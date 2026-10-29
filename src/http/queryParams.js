import {SdkUsageError} from '../errors.js';
import {isPlainRecord} from '../plainRecord.js';

/** Sort direction for the `direction` query parameter; members are `asc`/`desc`. */
export const SortDirection = Object.freeze({ASC: 'asc', DESC: 'desc'});

/** Whether a value is a sequence to expand into repeated names; a string is one value. @param {unknown} value */
function isIterableNonString(value) {
    if (typeof value === 'string') return false;
    if (value == null) return false;
    if (ArrayBuffer.isView(value)) return false;
    return typeof (/** @type {any} */ (value)[Symbol.iterator]) === 'function';
}

/** The type name to quote when `params` is not a key/value object. @param {unknown} params @returns {string} */
function describeParams(params) {
    if (Array.isArray(params)) return 'array';
    if (params instanceof Set) return 'set';
    return typeof params;
}

/**
 * The `(name, value)` pairs of `params`; a `Map` is read by its own entries, which `Object.entries` cannot see.
 * @param {unknown} params @returns {[string, unknown][]}
 */
function queryParamEntries(params) {
    if (params instanceof Map) {
        return [...params].map(([key, value]) => [typeof key === 'string' ? key : String(key), value]);
    }
    if (typeof params === 'object' && !Array.isArray(params) && !isIterableNonString(params)) {
        return Object.entries(/** @type {Record<string, unknown>} */ (params));
    }
    throw new SdkUsageError(
        `query params: expected an object of names to values, got ${describeParams(params)}; ` +
            'to send one name twice give it a list, as in {limit: [5, 6]}',
    );
}

/**
 * Normalise query parameter values for the wire; keys pass through untouched.
 * @param {Record<string, unknown> | Map<unknown, unknown> | null} [params]
 * @returns {Record<string, unknown>}
 */
export function buildQueryParams(params = null) {
    if (params == null) return {};
    // Prototype-less while filled, so `__proto__` is recorded as a parameter; restored before it is answered.
    /** @type {Record<string, unknown>} */
    const normalised = Object.create(null);
    for (const [key, value] of queryParamEntries(params)) {
        if (value === null || value === undefined) continue;
        normalised[key] = normaliseQueryValue(value, key, new Set(), 0);
    }
    return Object.setPrototypeOf(normalised, Object.prototype);
}

/** @param {unknown} value @param {string} key @param {Set<object>} seen @param {number} depth @returns {unknown} */
function normaliseQueryValue(value, key, seen, depth) {
    // Before the iterable branch: a Map iterates as `[key, value]` pairs, which have no unambiguous encoding.
    if (value instanceof Map) throw nestedMappingError(key);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            // `.toISOString()` would throw a bare `RangeError`, not an `SdkError`.
            throw new SdkUsageError(
                `query param ${JSON.stringify(key)}: an invalid Date has no ISO 8601 form; pass a valid Date or an ISO 8601 string`,
            );
        }
        return value.toISOString();
    }
    // Before the nested-object refusal: a sequence has a query form, one repeated name; a nested bag does not.
    if (isIterableNonString(value)) {
        const container = /** @type {object} */ (value);
        if (seen.has(container)) {
            throw new SdkUsageError(
                `query param ${JSON.stringify(key)}: the value refers to itself, so it has no finite query-string encoding`,
            );
        }
        if (depth >= 1) {
            // Refused, not stringified: the encoder would turn `[1, 2]` into the one value `1,2`, a guess at intent.
            throw new SdkUsageError(
                `query param ${JSON.stringify(key)}: a sequence inside a sequence has no query-string encoding; flatten it to one list of scalars`,
            );
        }
        const nextSeen = new Set(seen);
        nextSeen.add(container);
        const out = [];
        for (const entry of /** @type {Iterable<unknown>} */ (value)) {
            if (entry === null || entry === undefined) continue;
            out.push(normaliseQueryValue(entry, key, nextSeen, depth + 1));
        }
        return out;
    }
    if (isPlainRecord(value)) throw nestedMappingError(key);
    return wireQueryLeaf(value, key);
}

/**
 * One leaf as the wire will carry it.
 * @param {unknown} value @param {string} key @returns {unknown}
 */
function wireQueryLeaf(value, key) {
    const kind = typeof value;
    if (kind === 'string' || kind === 'number' || kind === 'bigint') return value;
    try {
        return String(value);
    } catch (error) {
        throw new SdkUsageError(
            `query param ${JSON.stringify(key)}: its value has no text form ` +
                `(${error instanceof Error ? error.message : String(error)}); pass a string, a number, a boolean, a Date or a list of those`,
        );
    }
}

/** @param {string} key @returns {SdkUsageError} */
function nestedMappingError(key) {
    return new SdkUsageError(
        `query param ${JSON.stringify(key)}: nested objects cannot be encoded in a query string; flatten it or send it in the body`,
    );
}
