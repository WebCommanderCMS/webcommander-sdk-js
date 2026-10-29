import {SdkUsageError} from './errors.js';

/** Whether a value is a plain mapping — not an array, not bytes. @param {unknown} value @returns {boolean} */
export function isDtoMapping(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !ArrayBuffer.isView(value);
}

/**
 * The wire map behind a DTO payload, or the value unchanged; duck-typed, so a caller's own type sends too.
 * @param {unknown} value @returns {unknown}
 */
export function dtoMapOf(value) {
    const sendable = isDtoMapping(value) && typeof (/** @type {any} */ (value).toMap) === 'function';
    return sendable ? /** @type {any} */ (value).toMap() : value;
}

/**
 * An array of `itemType`, as a field type; a mismatched entry reads `null`, so the count stays the body's.
 * @param {unknown} itemType @returns {object}
 */
export function dtoList(itemType) {
    return Object.freeze({list: itemType});
}

/**
 * Either type, as a field type: a payload `state` takes an id or a name.
 * @param {...unknown} types @returns {object}
 */
export function dtoOneOf(...types) {
    return Object.freeze({oneOf: Object.freeze([...types])});
}

/** What each scalar name accepts. Anything else reads `null` rather than being converted. */
const SCALARS = {
    int: (/** @type {unknown} */ value) => Number.isInteger(value),
    // An integer is a float in JSON's one number type: the only widening, and it loses nothing.
    float: (/** @type {unknown} */ value) => typeof value === 'number' && Number.isFinite(value),
    string: (/** @type {unknown} */ value) => typeof value === 'string',
    boolean: (/** @type {unknown} */ value) => typeof value === 'boolean',
};

/** The private, frozen schema per class; parsing reads only this, so rewriting a public static changes nothing. */
const SCHEMAS = new WeakMap();

/**
 * `addressLine1` becomes `address_line_1`; a digit run opens a word only where no lowercase follows it.
 * A name with no capital is taken as the wire spelling, which is how `office365` and `private_key_v3` are declared.
 * @param {string} name @returns {string}
 */
function toWireName(name) {
    if (name === name.toLowerCase()) return name;
    return name.replace(/[A-Z]|\d+(?![a-z])/g, (part) => `_${part.toLowerCase()}`);
}

/** Freeze a declared field type in place; a `Dto` subclass is left alone, since freezing it would fix its statics. */
function freezeDeclaredType(declared) {
    if (declared === null || typeof declared !== 'object') return;
    for (const value of Object.values(/** @type {Record<string, unknown>} */ (declared))) {
        if (Array.isArray(value)) Object.freeze(value);
    }
    Object.freeze(declared);
}

/**
 * @typedef {object} DtoSchema
 * @property {Record<string, any>} fields the declared field types, copied and frozen
 * @property {ReadonlySet<string>} topLevel field names that sit beside the envelope
 * @property {string | null} envelopeKey the key the API wraps this record in
 * @property {any} itemType the record type a listing reads its entries as, or null
 * @property {Record<string, string>} wireNames each field against its key on the wire
 */

/** This class's private schema, taken from its statics once and frozen, with the statics locked too. */
function schemaOf(type) {
    const cached = SCHEMAS.get(type);
    if (cached !== undefined) return cached;

    const declared = type.FIELDS || {};
    for (const fieldType of Object.values(declared)) freezeDeclaredType(fieldType);
    for (const name of /** @type {const} */ (['FIELDS', 'TOP_LEVEL', 'ENVELOPE_KEY', 'ITEM_TYPE'])) {
        lockSchemaDeclaration(type, name);
    }

    const fields = Object.freeze({...declared});
    const schema = Object.freeze({
        fields,
        topLevel: Object.freeze(new Set(type.TOP_LEVEL || [])),
        envelopeKey: type.ENVELOPE_KEY ?? null,
        itemType: type.ITEM_TYPE ?? null,
        wireNames: Object.freeze(Object.fromEntries(Object.keys(fields).map((name) => [name, toWireName(name)]))),
    });
    SCHEMAS.set(type, schema);
    return schema;
}

/**
 * Seal each type's schema now. A DTO module calls this on its own types as its last statement: until then
 * their statics are ordinary writable properties.
 * @param {...any} types @returns {void}
 */
export function sealDtoSchema(...types) {
    for (const type of types) schemaOf(type);
}

/** Freeze one static schema declaration and stop the class reassigning it; an inherited one is frozen on the base. */
function lockSchemaDeclaration(type, name) {
    const value = type[name];
    if (value !== null && typeof value === 'object') Object.freeze(value);
    const descriptor = Object.getOwnPropertyDescriptor(type, name);
    if (descriptor && descriptor.configurable && 'value' in descriptor) {
        Object.defineProperty(type, name, {...descriptor, writable: false, configurable: false});
    }
}

function describeValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'an array';
    if (ArrayBuffer.isView(value)) return 'bytes';
    return `a ${typeof value}`;
}

/** One value as its declared type, or `null`: nothing is converted, so a float sent as `"12.50"` reads `null`. */
function readValue(value, declared) {
    if (value === null || value === undefined) return null;
    if (declared === 'any') return value;
    if (typeof declared === 'string') return SCALARS[declared](value) ? value : null;
    if (declared.list !== undefined) {
        return Array.isArray(value) ? value.map((item) => readValue(item, declared.list)) : null;
    }
    if (declared.oneOf !== undefined) {
        for (const candidate of declared.oneOf) {
            const read = readValue(value, candidate);
            if (read !== null) return read;
        }
        return null;
    }
    return isDtoMapping(value) ? declared.fromMap(value) : null;
}

/** One value as the API receives it: a nested DTO becomes its record, and a list is walked for nested DTOs. */
function writeValue(value) {
    if (value instanceof Dto) {
        const record = value.toMap();
        const {envelopeKey} = schemaOf(value.constructor);
        return envelopeKey === null ? record : record[envelopeKey];
    }
    if (Array.isArray(value)) return value.map(writeValue);
    if (isDtoMapping(value)) {
        /** @type {Record<string, unknown>} */
        const walked = {};
        for (const [key, item] of Object.entries(/** @type {any} */ (value))) walked[key] = writeValue(item);
        return walked;
    }
    return value;
}

/**
 * Base for every typed view. `ENVELOPE_KEY` is unwrapped by {@link Dto.fromMap} when present, so one type reads a
 * detail and a listing entry; `TOP_LEVEL` names fields beside that envelope, like `transactionNo`.
 */
export class Dto {
    /** @type {string | null} the key the API wraps this record in, or null for a bare body */
    static ENVELOPE_KEY = null;

    /** @type {readonly string[]} fields that sit beside the envelope rather than inside it */
    static TOP_LEVEL = Object.freeze([]);

    /** @type {Record<string, any>} each field against the type it holds: the wire contract */
    static FIELDS = Object.freeze({});

    /**
     * This type's fields in declaration order against their wire keys; introspection only, a frozen copy.
     * @returns {Record<string, string>}
     */
    static fields() {
        return Object.freeze({...schemaOf(this).wireNames});
    }

    /**
     * This type's schema as a frozen copy; introspection only, like {@link Dto.fields}.
     * @returns {{fields: Record<string, any>, envelopeKey: string | null, topLevel: readonly string[], itemType: any}}
     */
    static schema() {
        const schema = schemaOf(this);
        return Object.freeze({
            fields: Object.freeze({...schema.fields}),
            envelopeKey: schema.envelopeKey,
            topLevel: Object.freeze([...schema.topLevel]),
            itemType: schema.itemType,
        });
    }

    /**
     * Build one, every field optional and anything not passed `null`; an undeclared field name throws.
     * @param {Record<string, unknown>} [values] @throws {SdkUsageError}
     */
    constructor(values = {}) {
        const {fields} = schemaOf(this.constructor);
        if (!isDtoMapping(values)) {
            throw new SdkUsageError(
                `${this.constructor.name}: expected an object of field values, got ${describeValue(values)}`,
            );
        }
        const unknown = Object.keys(values).filter((name) => !Object.hasOwn(fields, name));
        if (unknown.length) {
            throw new SdkUsageError(
                `${this.constructor.name} has no field ${unknown.sort().join(', ')}; it holds ` +
                    `${Object.keys(fields).join(', ') || 'no fields'}`,
            );
        }
        for (const name of Object.keys(fields)) this[name] = values[name] ?? null;
    }

    /**
     * The value the constructor assigned to one declared field. A class field initialiser runs after `super()`,
     * so `email = null` would erase what the base read; `email = this.declared('email')` keeps and types it.
     * @param {string} name @returns {any}
     */
    declared(name) {
        return /** @type {any} */ (this)[name];
    }

    /**
     * Read a decoded body into this type; an `ENVELOPE_KEY` is unwrapped when present.
     * @param {unknown} body the decoded body, `response.map` or one record out of it
     * @template {typeof Dto} T
     * @this {T}
     * @returns {InstanceType<T>} an instance of the type this was called on
     * @throws {SdkUsageError} `body` is not a mapping
     */
    static fromMap(body) {
        if (!isDtoMapping(body)) {
            throw new SdkUsageError(
                `${this.name}.fromMap expects a decoded mapping body, got ${describeValue(body)} — ` +
                    'a binary or empty body has no DTO',
            );
        }
        const schema = schemaOf(this);
        let source = /** @type {Record<string, unknown>} */ (body);
        if (schema.envelopeKey !== null) {
            const inner = source[schema.envelopeKey];
            if (isDtoMapping(inner)) {
                source = {.../** @type {any} */ (inner)};
                for (const [key, value] of Object.entries(/** @type {any} */ (body))) {
                    if (key !== schema.envelopeKey) source[key] = value;
                }
            }
        }

        /** @type {Record<string, unknown>} */
        const values = {};
        for (const [name, wireName] of Object.entries(schema.wireNames)) {
            if (Object.hasOwn(source, wireName)) values[name] = readValue(source[wireName], schema.fields[name]);
        }
        return /** @type {InstanceType<T>} */ (/** @type {unknown} */ (new this(values)));
    }

    /**
     * The body this DTO stands for, envelope included; a `null` field is omitted rather than sent.
     * @returns {Record<string, unknown>}
     */
    toMap() {
        const schema = schemaOf(this.constructor);
        /** @type {Record<string, unknown>} */
        const record = {};
        /** @type {Record<string, unknown>} */
        const beside = {};
        for (const [name, wireName] of Object.entries(schema.wireNames)) {
            const value = this[name];
            if (value === null || value === undefined) continue;
            (schema.topLevel.has(name) ? beside : record)[/** @type {string} */ (wireName)] = writeValue(value);
        }
        const body = schema.envelopeKey === null ? record : {[schema.envelopeKey]: record};
        return Object.assign(body, beside);
    }
}
