export const REDACTED = '***';

/** What replaces a structure nested deeper than {@link MAX_REDACTION_DEPTH}. */
export const TOO_DEEP = '<...>';

export const CIRCULAR = '<circular>';

/** What replaces a value this module could not read — a report that reading threw. */
const UNREADABLE = '<unreadable>';

function readProperty(container, key) {
    try {
        return container[key];
    } catch {
        return UNREADABLE;
    }
}

/** The `(name, value)` pairs of a `Map` or `Headers`, or `null` so the caller reads properties instead. */
function pairIterableEntries(container) {
    if (container instanceof Map) return [...container.entries()];
    if (Array.isArray(container) || typeof container === 'string') return null;
    if (typeof container[Symbol.iterator] !== 'function') return null;
    return [...container].filter((entry) => Array.isArray(entry) && entry.length === 2);
}

/** How deep {@link redactValue} walks before writing {@link TOO_DEEP} instead. */
export const MAX_REDACTION_DEPTH = 64;

/** A key is a secret when its name **contains** one of these, separators and case ignored. */
export const SENSITIVE_KEY_MARKERS = Object.freeze([
    'secret',
    'password',
    'passphrase',
    'passwd',
    'pwd',
    'token',
    'bearer',
    'jwt',
    'authorization',
    'authstring',
    'apikey',
    'assertion',
    'credential',
    'verifier',
    'cookie',
    'session',
    'signature',
    'privatekey',
]);

/** Trailing words that mean the field *describes* a secret rather than being one. */
const NON_SECRET_TAIL_WORDS = new Set([
    'amount',
    'at',
    'consent',
    'count',
    'duration',
    // `customer_password_expired` is a boolean flag about a password, not a password.
    'expired',
    'level',
    'path',
    'policy',
    'remaining',
    'status',
    'type',
]);

/** Leading words that make the field a boolean *about* a secret. */
const NON_SECRET_LEAD_WORDS = new Set(['has', 'is', 'was']);

/** Splits a name at punctuation and at camel-case humps. */
const KEY_WORD_BOUNDARY = /[^A-Za-z0-9]+|(?<=[a-z0-9])(?=[A-Z])/;

function keyWords(key) {
    return String(key)
        .split(KEY_WORD_BOUNDARY)
        .filter((word) => word)
        .map((word) => word.toLowerCase());
}

/** The markers as one separator-free word each, so the scan is a plain substring test. */
const NORMALISED_MARKERS = [...new Set(SENSITIVE_KEY_MARKERS.map((m) => keyWords(m).join('')))];

/**
 * Whether a key's name means its value must not be shown: true for `'X-Api-Key'` and `'api_key'`, false for `'page'`.
 * @param {string} key @returns {boolean}
 */
export function shouldRedact(key) {
    const words = keyWords(key);
    if (words.length && (NON_SECRET_LEAD_WORDS.has(words[0]) || NON_SECRET_TAIL_WORDS.has(words[words.length - 1]))) {
        return false;
    }
    const normalised = words.join('');
    return NORMALISED_MARKERS.some((marker) => normalised.includes(marker));
}

/** A prototype-less accumulator, so `__proto__` is recorded as data; {@link sealed} restores the prototype. */
function openObject() {
    return Object.create(null);
}

/**
 * Finish an accumulator: an ordinary prototype, frozen; an own `__proto__` entry stays data.
 * @template T @param {T} out @returns {Readonly<T>}
 */
function sealed(out) {
    return Object.freeze(Object.setPrototypeOf(out, Object.prototype));
}

function isMapping(value) {
    if (value === null || typeof value !== 'object') return false;
    if (Array.isArray(value)) return false;
    if (value instanceof Map) return true;
    if (ArrayBuffer.isView(value)) return false;
    if (value instanceof Date) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

/**
 * Snapshot a value for display with secret-looking entries replaced by {@link REDACTED}; the original is untouched.
 * The snapshot is deep and frozen; anything not JSON-shaped is summarised as `<Type size>`, never stringified.
 * @param {unknown} value @returns {unknown}
 */
export function redactValue(value) {
    return redact(value, 0, new Set());
}

function typeName(value) {
    const name = /** @type {any} */ (value)?.constructor?.name;
    return typeof name === 'string' && name ? name : 'object';
}

/** Name a value this module will not reproduce by its structural lengths only; no content, and no `toString`. */
function summariseOpaque(value) {
    if (typeof value === 'function') return '<function>';
    if (typeof value === 'symbol') return '<symbol>';
    if (typeof value === 'bigint') return '<bigint>';
    if (ArrayBuffer.isView(value)) {
        return `<${typeName(value)} ${/** @type {ArrayBufferView} */ (value).byteLength} bytes>`;
    }
    if (value instanceof ArrayBuffer) return `<ArrayBuffer ${value.byteLength} bytes>`;
    if (value instanceof Set) return `<Set ${value.size} entries>`;
    return `<${typeName(value)}>`;
}

/** The display name of one `Map` key without running its `toString`; a non-primitive key is named by type and index. */
function mapKeyName(key, out) {
    let name;
    if (typeof key === 'string') name = key;
    else if (key === null) name = 'null';
    else if (key === undefined) name = 'undefined';
    else if (typeof key === 'number' || typeof key === 'boolean' || typeof key === 'bigint') name = `${key}`;
    else name = summariseOpaque(key);
    if (!Object.prototype.hasOwnProperty.call(out, name)) return name;
    let index = 2;
    while (Object.prototype.hasOwnProperty.call(out, `${name} #${index}`)) index += 1;
    return `${name} #${index}`;
}

function redact(value, depth, seen) {
    const mapping = isMapping(value);
    if (mapping || Array.isArray(value)) {
        if (depth >= MAX_REDACTION_DEPTH) return TOO_DEEP;
        const container = /** @type {object} */ (value);
        if (seen.has(container)) return CIRCULAR;
        seen.add(container);
        try {
            /** @type {Record<string, unknown>} */
            const out = openObject();
            if (mapping) {
                if (value instanceof Map) {
                    for (const [key, item] of value.entries()) {
                        const name = mapKeyName(key, out);
                        out[name] = shouldRedact(name) ? REDACTED : redact(item, depth + 1, seen);
                    }
                    return sealed(out);
                }
                for (const key of Object.keys(value)) {
                    // Name judged first, so a getter behind a secret key is not invoked.
                    out[key] = shouldRedact(key) ? REDACTED : redact(readProperty(value, key), depth + 1, seen);
                }
                return sealed(out);
            }
            /** @type {unknown[]} */
            const items = [];
            for (const entry of /** @type {unknown[]} */ (value)) items.push(redactEntry(entry, depth + 1, seen));
            return Object.freeze(items);
        } finally {
            seen.delete(container);
        }
    }
    if (typeof value === 'string') {
        return redactUrls(redactJsonText(value, depth, seen));
    }
    if (value === null || value === undefined || typeof value === 'number' || typeof value === 'boolean') return value;
    return summariseOpaque(value);
}

function redactEntry(entry, depth, seen) {
    if (Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string' && shouldRedact(entry[0])) {
        return [entry[0], REDACTED];
    }
    return redact(entry, depth, seen);
}

/** Redact a JSON document that arrived as text; one that will not parse is withheld and named by size. */
function redactJsonText(text, depth, seen) {
    const trimmed = text.replace(/^\s+/, '');
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return text;
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch {
        return `<unparsed ${trimmed.startsWith('{') ? 'JSON object' : 'JSON array'} text ${text.length} chars>`;
    }
    const redacted = redact(parsed, depth + 1, seen);
    if (JSON.stringify(redacted) === JSON.stringify(parsed)) return text;
    return JSON.stringify(redacted);
}

/**
 * Redact a flat mapping such as headers into a frozen copy; a `Map` or `Headers` is read by iteration.
 * @param {Record<string, string> | Map<unknown, unknown> | Headers | null | undefined} headers
 * @returns {Readonly<Record<string, string>>}
 */
export function redactMapping(headers) {
    if (!headers) return Object.freeze({});
    /** @type {Record<string, string>} */
    const out = openObject();
    const pairs = pairIterableEntries(headers);
    if (pairs !== null) {
        for (const [key, value] of pairs) {
            out[/** @type {any} */ (key)] = shouldRedact(String(key))
                ? REDACTED
                : /** @type {string} */ (redactUrls(value));
        }
        return sealed(out);
    }
    for (const key of Object.keys(headers)) {
        // Name first, so a secret-named header's getter is never invoked.
        out[key] = shouldRedact(key) ? REDACTED : /** @type {string} */ (redactUrls(readProperty(headers, key)));
    }
    return sealed(out);
}

/** A run of characters that could be a URL inside a longer value. */
const URL_RUN = /[A-Za-z][A-Za-z0-9+.\-]*:\/\/[^\s<>"']*/g;

/** A schemeless `/path?query` or `/path#fragment` run. */
const PATH_QUERY_RUN = /\/[^\s<>"'?#]*[?#][^\s<>"']+/g;

/**
 * Redact every URL and schemeless `path?query` in free text: `?access_token=abc123` becomes `?access_token=***`.
 * @param {string} value @returns {string}
 */
export function redactText(value) {
    const cleaned = value.replace(URL_RUN, (match) => redactOneUrl(match));
    return cleaned.replace(PATH_QUERY_RUN, (match) => redactOneUrl(match));
}

function redactUrls(value) {
    if (typeof value !== 'string') return value;
    return redactText(value);
}

function redactOneUrl(url) {
    const hash = url.indexOf('#');
    const fragment = hash >= 0 ? url.slice(hash + 1) : '';
    const beforeFragment = hash >= 0 ? url.slice(0, hash) : url;
    const q = beforeFragment.indexOf('?');
    const query = q >= 0 ? beforeFragment.slice(q + 1) : '';
    const base = q >= 0 ? beforeFragment.slice(0, q) : beforeFragment;

    let newBase = base;
    let authorityChanged = false;
    const m = base.match(/^([A-Za-z][A-Za-z0-9+.\-]*:\/\/)([^/]*)(.*)$/s);
    if (m) {
        const redactedAuthority = redactUserinfo(m[2]);
        authorityChanged = redactedAuthority !== m[2];
        newBase = m[1] + redactedAuthority + m[3];
    }
    const newQuery = redactQueryString(query);
    const newFragment = redactQueryString(fragment);
    if (!authorityChanged && newQuery === query && newFragment === fragment) return url;
    let out = newBase;
    if (q >= 0) out += `?${newQuery}`;
    if (hash >= 0) out += `#${newFragment}`;
    return out;
}

/**
 * Replace an embedded password, keeping the user visible.
 * @param {string} authority the `user:password@host:port` run of a URL
 */
function redactUserinfo(authority) {
    const at = authority.lastIndexOf('@');
    if (at < 0) return authority;
    const userinfo = authority.slice(0, at);
    const host = authority.slice(at + 1);
    if (!userinfo.includes(':')) return authority;
    const user = userinfo.slice(0, userinfo.indexOf(':'));
    return `${user}:${REDACTED}@${host}`;
}

/** Decode a query-string name, where `+` means a space. @param {string} name @returns {string} */
function decodeQueryName(name) {
    try {
        return decodeURIComponent(name.replace(/\+/g, ' '));
    } catch {
        return name;
    }
}

/** Replace the value of every secret-named parameter, leaving the rest exact. @param {string} query @returns {string} */
function redactQueryString(query) {
    if (!query) return query;
    const rewritten = [];
    let matched = false;
    for (const chunk of query.split('&')) {
        const eq = chunk.indexOf('=');
        if (eq >= 0 && shouldRedact(decodeQueryName(chunk.slice(0, eq)))) {
            rewritten.push(`${chunk.slice(0, eq)}=${REDACTED}`);
            matched = true;
        } else {
            rewritten.push(chunk);
        }
    }
    return matched ? rewritten.join('&') : query;
}

/**
 * Render `name=value` pairs for a config class's `toString`, secret-named fields redacted.
 * @param {any} instance @param {Iterable<string>} fieldNames @returns {string[]}
 */
export function redactFields(instance, fieldNames) {
    const shown = [];
    for (const name of fieldNames) {
        let value = instance == null ? undefined : readProperty(instance, name);
        if (value && shouldRedact(name)) {
            value = REDACTED;
        } else {
            value = redactValue(value);
        }
        shown.push(`${name}=${JSON.stringify(value)}`);
    }
    return shown;
}
