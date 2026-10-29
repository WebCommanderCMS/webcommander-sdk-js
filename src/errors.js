import {escapeControlCharacter} from './controlCharacters.js';

/** C0, DEL, C1 and the two Unicode line separators — what could drive a terminal. */
const CONTROL_CHARACTERS = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u2028\\u2029]', 'g');

const UNRENDERABLE = '<unrenderable value>';

function safeStr(value) {
    try {
        return String(value);
    } catch {
        return UNRENDERABLE;
    }
}

function flatten(value) {
    return safeStr(value).replace(CONTROL_CHARACTERS, escapeControlCharacter);
}

function safeJson(value) {
    const open = new WeakSet();
    try {
        const text = JSON.stringify(value, (_key, item) => {
            if (typeof item === 'bigint') return `${item}`;
            if (item !== null && typeof item === 'object') {
                if (open.has(item)) return '<circular>';
                open.add(item);
            }
            return item;
        });
        return typeof text === 'string' ? text : safeStr(value);
    } catch {
        return UNRENDERABLE;
    }
}

const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];

const REDIRECT_HINT = 'the store redirected; read Location off the response';

/** Prototype-less: a literal answers a function for a `statusCode` of `'toString'`. @type {Record<number, string>} */
const HINTS_BY_STATUS = Object.assign(Object.create(null), {
    400:
        'the API rejected the request itself - check the payload shape and the ' +
        "query parameter names against the endpoint's JSDoc",
    401:
        'credentials were rejected, or the token expired and could not be renewed ' +
        '- check clientId, clientSecret and authString',
    403: 'authenticated, but this client is not allowed to do that',
    404: 'no such record - check the id you passed actually exists',
    405: 'wrong HTTP method for this path',
    409: 'conflicts with existing data, e.g. an email already in use',
    429: 'rate limited - slow down, or raise maxRetries so the SDK waits and retries for you',
    500:
        'the server failed. Retrying may help on a read; by default the SDK will not retry ' +
        'a write on a 500, because it cannot tell whether the server committed',
});
for (const status of REDIRECT_STATUS_CODES) HINTS_BY_STATUS[status] = REDIRECT_HINT;

const LOCATION_HEADER = 'location';

/** The Node hook `util.inspect`, and therefore `console.error`, calls to render a value. */
const INSPECT = Symbol.for('nodejs.util.inspect.custom');

/** Install a property the default renderings (inspect, uncaught, JSON, spread) cannot see; still reachable by name. */
function defineWithheld(target, name, value) {
    Object.defineProperty(target, name, {value, enumerable: false, writable: true, configurable: true});
}

function stackFrames(stack) {
    if (typeof stack !== 'string' || !stack) return '';
    const frames = stack.split('\n').filter((line) => /^\s+at\s/.test(line));
    return frames.join('\n');
}

function redirectTarget(headers) {
    for (const [name, value] of Object.entries(headers)) {
        if (String(name).toLowerCase() === LOCATION_HEADER) return value;
    }
    return null;
}

/** The endpoint template an info names, or `null`; never the resolved path, whose values identify a person. */
function endpointOf(info) {
    const endpoint = info == null ? null : info.endpoint;
    return typeof endpoint === 'string' && endpoint ? endpoint : null;
}

/**
 * Name a failure's cause by class and `errno` code; its `message` is left out, as it names hosts and documents.
 * @param {unknown} error @returns {string}
 */
export function describeCause(error) {
    if (error === null || error === undefined) return 'none';
    if (typeof error !== 'object') return typeof error;
    const held = /** @type {any} */ (error);
    const name = held.name || held.constructor?.name || 'error';
    const code = typeof held.code === 'string' && held.code ? held.code : null;
    return code ? `${flatten(name)} ${flatten(code)}` : flatten(name);
}

/**
 * @typedef {object} SdkErrorOptions
 * @property {number} [statusCode]
 * @property {unknown} [errorType]
 * @property {unknown} [rawResponse]
 * @property {Record<string, string> | null} [responseHeaders]
 * @property {unknown} [requestInfo]
 * @property {unknown} [cause] the original failure, read with {@link SdkError#getCause}
 * @property {Record<string, unknown>} [details] values the refusal refers to but must not print
 */

/**
 * Base class for every SDK error, carrying the failing response already redacted. Default renderings are
 * structural: values are withheld as non-enumerable or private, and `explain({includeSensitive: true})` shows them.
 */
export class SdkError extends Error {
    /** The failing body, already redacted. Withheld from default renderings. @type {unknown} */
    rawResponse;

    /** The response headers, already redacted. Withheld from default renderings. @type {Record<string, string>} */
    responseHeaders;

    /** The request that failed. Withheld from default renderings. @type {unknown} */
    requestInfo;

    /**
     * Values the message refers to but will not print; withheld and frozen.
     * @type {Readonly<Record<string, unknown>>}
     */
    details;

    /** The store's field-level messages; private because Node prints an `errors` array property. @type {string[]} */
    #errors = [];

    /**
     * The failure this error replaced; private because Node prints a `cause`, which may name a host.
     * @type {unknown}
     */
    #cause = null;

    /** @param {string} message @param {SdkErrorOptions} [options] */
    constructor(message, options = {}) {
        // `cause` is not forwarded: `Error` would install it as an own property and Node prints it.
        super(message);
        this.name = 'SdkError';
        this.statusCode = options.statusCode ?? null;
        this.errorType = options.errorType ?? null;
        this.#cause = options.cause ?? null;
        /**
         * The cause's class and `errno` code, such as `'Error ECONNREFUSED'`; `'none'` without a cause.
         * @type {string}
         */
        this.causeCategory = describeCause(this.#cause);
        defineWithheld(this, 'rawResponse', options.rawResponse ?? null);
        defineWithheld(this, 'responseHeaders', {...(options.responseHeaders || {})});
        defineWithheld(this, 'requestInfo', options.requestInfo ?? null);
        defineWithheld(this, 'details', Object.freeze({...(options.details || {})}));
    }

    /**
     * The original failure, or `null`; unsafe to print, as {@link SdkError#causeCategory} is the safe form.
     * @returns {unknown}
     */
    getCause() {
        return this.#cause;
    }

    /** Append one field-level message from the response body. @param {string} errorMessage @returns {SdkError} */
    addError(errorMessage) {
        this.#errors.push(errorMessage);
        return this;
    }

    /**
     * What `console.error(error)` prints: {@link SdkError#explain} and the stack, not every own property.
     * @returns {string}
     */
    [INSPECT]() {
        const frames = stackFrames(this.stack);
        return frames ? `${this.explain()}\n${frames}` : this.explain();
    }

    /** A copy of the field-level messages the API supplied. @returns {string[]} */
    getErrorMessages() {
        return [...this.#errors];
    }

    /** A suggestion keyed off the status code, or `null` when there is none. @returns {string | null} */
    getHint() {
        if (this.statusCode == null) return null;
        return HINTS_BY_STATUS[this.statusCode] ?? null;
    }

    /**
     * The diagnostic as one printable block that cannot raise; `{includeSensitive: true}` adds the values.
     * @param {{includeSensitive?: boolean}} [options] @returns {string}
     */
    explain(options = {}) {
        const sensitive = options.includeSensitive === true;
        const lines = [this.toString()];

        const info = /** @type {any} */ (this.requestInfo);
        if (info != null) {
            const parameterCount = info.queryParams ? Object.keys(info.queryParams).length : 0;
            if (parameterCount) {
                lines.push(`  params  : ${sensitive ? safeJson(info.queryParams) : `${parameterCount} parameter(s)`}`);
            }
            if (info.attemptCount && info.maxAttempts)
                lines.push(`  attempt : ${info.attemptCount}/${info.maxAttempts}`);
            if (info.elapsedSeconds != null) lines.push(`  elapsed : ${info.elapsedSeconds}s`);
            if (sensitive && info.url) lines.push(`  url     : ${flatten(info.url)}`);
        }

        const location = redirectTarget(this.responseHeaders);
        if (location) lines.push(`  location: ${sensitive ? flatten(location) : 'withheld'}`);

        const messages = this.getErrorMessages();
        if (messages.length) {
            if (sensitive) {
                lines.push('  reported:');
                for (const message of messages) lines.push(`    - ${flatten(message)}`);
            } else {
                lines.push(`  reported: ${messages.length} message(s)`);
            }
        }

        if (this.causeCategory && this.causeCategory !== 'none') {
            const cause = /** @type {any} */ (this.getCause());
            const shown = sensitive && cause ? `${this.causeCategory}: ${flatten(cause.message ?? cause)}` : null;
            lines.push(`  cause   : ${shown ?? `${this.causeCategory} (getCause() for the original)`}`);
        }

        const detailNames = Object.keys(this.details || {});
        if (detailNames.length) {
            lines.push(
                `  details : ${
                    sensitive
                        ? safeJson(this.details)
                        : `${detailNames.sort().join(', ')} — read error.details for the values`
                }`,
            );
        }

        const hint = this.getHint();
        if (hint) lines.push(`  hint    : ${hint}`);

        if (this.rawResponse != null) {
            // JSON rather than `String()`: a character count over `[object Object]` says nothing.
            const body = flatten(safeJson(this.rawResponse));
            if (sensitive) {
                lines.push(
                    `  body    : ${body.length > 500 ? `${body.slice(0, 500)}... +${body.length - 500} chars` : body}`,
                );
            } else {
                lines.push(`  body    : ${body.length} char(s)`);
            }
        }

        if (!sensitive) lines.push('  detail  : explain({includeSensitive: true}) renders the values withheld above');

        return lines.join('\n');
    }

    /**
     * One structural line: class, status, category, method, endpoint template, attempts and `message`.
     * @returns {string}
     */
    toString() {
        const parts = [this.name];
        if (this.statusCode) {
            parts.push(this.errorType ? `${this.statusCode} ${flatten(this.errorType)}` : String(this.statusCode));
        } else if (this.errorType) {
            parts.push(flatten(this.errorType));
        }
        const info = /** @type {any} */ (this.requestInfo);
        const endpoint = endpointOf(info);
        if (info != null && info.httpMethod && endpoint) parts.push(`${flatten(info.httpMethod)} ${flatten(endpoint)}`);
        if (info != null && info.attemptCount && info.maxAttempts) {
            parts.push(`attempt ${info.attemptCount}/${info.maxAttempts}`);
        }
        parts.push(flatten(this.message));
        return parts.join(' · ');
    }
}

/** A setting is wrong. Thrown at construction, before any I/O, listing every problem. */
export class SdkConfigError extends SdkError {
    /** @param {string} message @param {SdkErrorOptions} [options] */
    constructor(message, options) {
        super(message, options);
        this.name = 'SdkConfigError';
    }
}

/** The call itself is wrong, and no request was sent: `missing path params: customer_id`. */
export class SdkUsageError extends SdkError {
    /** @param {string} message @param {SdkErrorOptions} [options] */
    constructor(message, options) {
        super(message, options);
        this.name = 'SdkUsageError';
    }
}

/** No such property on a bound resource, such as a misspelt endpoint; suggests the closest real name. */
export class SdkAttributeError extends SdkUsageError {
    /** @param {string} message @param {SdkErrorOptions} [options] */
    constructor(message, options) {
        super(message, options);
        this.name = 'SdkAttributeError';
    }
}

/**
 * The token cache file exists but will not parse or cannot be read. Kept apart from an empty cache, since
 * treating a corrupt file as empty would rebuild it and drop every other credential's entry.
 */
export class TokenCacheError extends SdkError {
    /** @param {string} message @param {SdkErrorOptions & {reason?: 'corrupt' | 'unreadable'}} [options] */
    constructor(message, options = {}) {
        super(message, options);
        this.name = 'TokenCacheError';
        /** @type {'corrupt' | 'unreadable'} which of the two states the file is in */
        this.reason = options.reason ?? 'corrupt';
    }
}

/**
 * Authentication failed. A grant that issues nothing usable always raises; a `401` or `403` on a call
 * becomes this through `raiseForStatus()`.
 */
export class SdkAuthError extends SdkError {
    /** @param {string} message @param {SdkErrorOptions} [options] */
    constructor(message, options) {
        super(message, options);
        this.name = 'SdkAuthError';
    }
}

/**
 * A minted token could not be cached: a warning, since the call succeeds and only the next process re-mints.
 * A custom store's `TypeError` is raised instead, as a bug.
 */
export class TokenCacheWriteWarning extends Error {
    /** @param {string} message */
    constructor(message) {
        super(message);
        this.name = 'TokenCacheWriteWarning';
    }
}

/** The transport is not secure: an `http://` base URL off loopback, or `verifySsl: false`. */
export class InsecureTransportWarning extends Error {
    /** @param {string} message */
    constructor(message) {
        super(message);
        this.name = 'InsecureTransportWarning';
    }
}
