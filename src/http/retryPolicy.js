import {SdkConfigError} from '../errors.js';
import {httpMethodName} from './httpMethod.js';

export const DEFAULT_MAX_ATTEMPTS = 1;
export const DEFAULT_RETRY_BACKOFF_SECONDS = 0.5;
export const DEFAULT_RETRY_BACKOFF_MAX_SECONDS = 20.0;

// Allow-lists: a verb never seen is neither safe nor idempotent.
const SAFE_METHOD_NAMES = Object.freeze(['GET', 'HEAD', 'OPTIONS', 'TRACE']);
const IDEMPOTENT_METHOD_NAMES = Object.freeze(['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE']);
const UNSAFE_METHOD_NAMES = Object.freeze(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Statuses worth another attempt. `401` is absent: it is refresh-and-replayed a layer up. */
export const DEFAULT_RETRYABLE_HTTP_CODES = Object.freeze([429, 500, 502, 503, 504]);

/** The methods this SDK treats as safe, as a read-only view over a private frozen array. @type {ReadonlySet<string>} */
export const SAFE_METHODS = readOnlySet('SAFE_METHODS', SAFE_METHOD_NAMES, 'the safe-method set');

/** The write verbs this SDK names; absence from this set does not make a method safe. @type {ReadonlySet<string>} */
export const UNSAFE_METHODS = readOnlySet('UNSAFE_METHODS', UNSAFE_METHOD_NAMES, 'the unsafe-method set');

/**
 * The statuses retried on a state-changing method: none. A status says what the server answered, not what it did.
 * @type {readonly number[]}
 */
export const DEFAULT_UNSAFE_RETRYABLE_HTTP_CODES = Object.freeze([]);

/**
 * Error `kind` tags the transport classifies a failure with. `CONNECTION` is establishment only, `CONNECTION_RESET`
 * a socket that died after the request went out; {@link DELIVERY_STAGE_BY_KIND} sends the two opposite ways.
 */
export const TRANSPORT_ERROR_KINDS = Object.freeze({
    SSL: 'SSLError',
    CONNECT_TIMEOUT: 'ConnectTimeout',
    READ_TIMEOUT: 'ReadTimeout',
    CONNECTION: 'ConnectionError',
    CONNECTION_RESET: 'ConnectionResetError',
    TIMEOUT: 'Timeout',
    CHUNKED_ENCODING: 'ChunkedEncodingError',
    CONTENT_DECODING: 'ContentDecodingError',
    RESPONSE_TOO_LARGE: 'ResponseTooLarge',
});

/** How far a failed attempt got, which is what decides whether it may be sent again. */
export const DELIVERY_STAGE = Object.freeze({
    /** Nothing was delivered: the connection was never established. */
    NOT_SENT: 'notSent',
    /** The request was on its way out or already out, so the server may have acted on it. */
    SENT: 'sent',
    /** Repeating cannot help, whatever was delivered. */
    FATAL: 'fatal',
});

/**
 * Retry only what certainly did not arrive; an unlisted `kind` reads as `SENT`.
 * @type {Readonly<Record<string, string>>}
 */
const DELIVERY_STAGE_BY_KIND = Object.freeze({
    [TRANSPORT_ERROR_KINDS.CONNECTION]: DELIVERY_STAGE.NOT_SENT,
    [TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT]: DELIVERY_STAGE.NOT_SENT,
    [TRANSPORT_ERROR_KINDS.READ_TIMEOUT]: DELIVERY_STAGE.SENT,
    [TRANSPORT_ERROR_KINDS.TIMEOUT]: DELIVERY_STAGE.SENT,
    [TRANSPORT_ERROR_KINDS.CONNECTION_RESET]: DELIVERY_STAGE.SENT,
    [TRANSPORT_ERROR_KINDS.CHUNKED_ENCODING]: DELIVERY_STAGE.SENT,
    [TRANSPORT_ERROR_KINDS.CONTENT_DECODING]: DELIVERY_STAGE.SENT,
    [TRANSPORT_ERROR_KINDS.SSL]: DELIVERY_STAGE.NOT_SENT,
    [TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE]: DELIVERY_STAGE.FATAL,
});

/** How far the attempt behind a failure got. @param {unknown} kind @returns {string} */
export function deliveryStageOfKind(kind) {
    return DELIVERY_STAGE_BY_KIND[/** @type {string} */ (kind)] ?? DELIVERY_STAGE.SENT;
}

/** The methods a server must treat identically however many times they arrive. @type {ReadonlySet<string>} */
export const IDEMPOTENT_METHODS = readOnlySet(
    'IDEMPOTENT_METHODS',
    IDEMPOTENT_METHOD_NAMES,
    'the idempotent-method set',
);

/** @param {unknown} value */
function isRealNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

/**
 * A `Set` whose named reads answer from a frozen snapshot, not its storage, which `Set.prototype.add.call` can reach.
 * @template T @param {string} name
 */
function readOnlySet(name, snapshot, subject) {
    const members = new Set(snapshot);
    const define = (key, value) =>
        Object.defineProperty(members, key, {value, writable: false, enumerable: false, configurable: false});

    for (const mutator of ['add', 'delete', 'clear']) {
        define(mutator, function () {
            throw new TypeError(`${name}: ${subject} cannot be changed`);
        });
    }
    define('has', (/** @type {T} */ value) => snapshot.includes(value));
    define('forEach', (/** @type {any} */ callback, /** @type {any} */ thisArg) => {
        for (const value of snapshot) callback.call(thisArg, value, value, members);
    });
    for (const reader of ['values', 'keys', Symbol.iterator]) {
        define(reader, () => snapshot[Symbol.iterator]());
    }
    define('entries', () => snapshot.map((value) => /** @type {[T, T]} */ ([value, value]))[Symbol.iterator]());
    Object.defineProperty(members, 'size', {
        get: () => snapshot.length,
        enumerable: false,
        configurable: false,
    });
    return Object.freeze(members);
}

/** The caller's status codes as a set that cannot be widened afterwards. */
function frozenStatusCodes(name, supplied, fallback) {
    const source = supplied === undefined ? fallback : supplied;
    const iterable =
        source !== null &&
        typeof source !== 'string' &&
        typeof (/** @type {any} */ (source || {})[Symbol.iterator]) === 'function';
    if (!iterable) {
        // A string would become a set of its digits and `null` an empty set.
        throw new SdkConfigError(`${name}: expected an iterable of HTTP status codes, got ${JSON.stringify(source)}`);
    }
    const snapshot = Object.freeze([...new Set(/** @type {Iterable<number>} */ (source))]);
    // Each value, not just the container: `'429'`, `4.29` or `NaN` would match no real status, retries silently off.
    for (const code of snapshot) {
        if (!Number.isInteger(code) || code < 100 || code > 599) {
            throw new SdkConfigError(
                `${name}: expected whole HTTP status codes between 100 and 599, got ${JSON.stringify(code) ?? String(code)}`,
            );
        }
    }
    return readOnlySet(name, snapshot, "a RetryPolicy's status codes");
}

/**
 * Whether replaying this verb could change data twice; read from the private list, and anything unnamed is unsafe.
 * @param {unknown} method @returns {boolean}
 */
export function isUnsafeMethod(method) {
    const name = httpMethodName(method);
    return name === null || !SAFE_METHOD_NAMES.includes(name);
}

/**
 * Whether this verb may be resent after a failure that may already have arrived; unknown is not idempotent.
 * @param {unknown} method @returns {boolean}
 */
export function isIdempotentMethod(method) {
    const name = httpMethodName(method);
    return name !== null && IDEMPOTENT_METHOD_NAMES.includes(name);
}

// Keeps the power finite rather than capping the delay: `2 ** 30` seconds is past any reachable backoffMaxSeconds.
const MAX_BACKOFF_EXPONENT = 30;

/** The delay-seconds form of `Retry-After`; the sign matters, `Date.parse` reads `'-3'`. */
const NUMERIC_RETRY_AFTER = /^[+-]?\d+(\.\d+)?$/;

/** `Retry-After` as numeric seconds, or an HTTP date as seconds from now; else null. */
function parseRetryAfter(retryAfter) {
    if (!retryAfter) return null;
    const value = String(retryAfter).trim();
    if (NUMERIC_RETRY_AFTER.test(value)) return Math.max(0, Number(value));
    const when = Date.parse(value);
    if (Number.isNaN(when)) return null;
    return Math.max(0, (when - Date.now()) / 1000);
}

/** How many attempts to make, on what, and how long to wait between them. */
export class RetryPolicy {
    /**
     * @param {{
     *   maxAttempts?: number, backoffSeconds?: number, backoffMaxSeconds?: number,
     *   retryableStatusCodes?: Iterable<number>, unsafeRetryableStatusCodes?: Iterable<number>,
     * }} [options]
     */
    constructor(options = {}) {
        // `=== undefined`, not `??`: a field that arrived as JSON `null` was supplied, so it is reported.
        /** @readonly @type {number} */
        this.maxAttempts = options.maxAttempts === undefined ? DEFAULT_MAX_ATTEMPTS : options.maxAttempts;
        /** @readonly @type {number} */
        this.backoffSeconds =
            options.backoffSeconds === undefined ? DEFAULT_RETRY_BACKOFF_SECONDS : options.backoffSeconds;
        /** @readonly @type {number} */
        this.backoffMaxSeconds =
            options.backoffMaxSeconds === undefined ? DEFAULT_RETRY_BACKOFF_MAX_SECONDS : options.backoffMaxSeconds;
        /** @readonly @type {ReadonlySet<number>} */
        this.retryableStatusCodes = frozenStatusCodes(
            'retryableStatusCodes',
            options.retryableStatusCodes,
            DEFAULT_RETRYABLE_HTTP_CODES,
        );
        /** @readonly @type {ReadonlySet<number>} */
        this.unsafeRetryableStatusCodes = frozenStatusCodes(
            'unsafeRetryableStatusCodes',
            options.unsafeRetryableStatusCodes,
            DEFAULT_UNSAFE_RETRYABLE_HTTP_CODES,
        );

        if (!Number.isInteger(this.maxAttempts) || this.maxAttempts < 1) {
            throw new SdkConfigError(
                `maxAttempts: must be at least 1 (1 disables retry), got ${JSON.stringify(this.maxAttempts)}`,
            );
        }
        for (const name of ['backoffSeconds', 'backoffMaxSeconds']) {
            const value = /** @type {any} */ (this)[name];
            if (!isRealNumber(value))
                throw new SdkConfigError(`${name}: expected a number of seconds, got ${JSON.stringify(value)}`);
        }
        if (this.backoffSeconds < 0)
            throw new SdkConfigError(`backoffSeconds: must be >= 0, got ${this.backoffSeconds}`);
        if (this.backoffMaxSeconds < this.backoffSeconds) {
            throw new SdkConfigError(
                `backoffMaxSeconds: must be >= backoffSeconds, got ${this.backoffMaxSeconds} < ${this.backoffSeconds}`,
            );
        }
        Object.freeze(this);
    }

    /**
     * The policy a transport decides by: a {@link RetryPolicy} as it stands, else a plain object read once and
     * rebuilt, so a value changed mid-retry cannot change the call's limits.
     * @param {unknown} supplied @param {any} config @returns {RetryPolicy} @throws {SdkConfigError}
     */
    static snapshotOf(supplied, config) {
        if (supplied === null || supplied === undefined) return RetryPolicy.fromConfig(config);
        if (supplied instanceof RetryPolicy) return supplied;
        if (typeof supplied !== 'object') {
            throw new SdkConfigError(
                `retryPolicy: expected a RetryPolicy or an object carrying its settings, got ${typeof supplied}`,
            );
        }
        const held = /** @type {any} */ (supplied);
        return new RetryPolicy({
            maxAttempts: held.maxAttempts,
            backoffSeconds: held.backoffSeconds,
            backoffMaxSeconds: held.backoffMaxSeconds,
            retryableStatusCodes: held.retryableStatusCodes,
            unsafeRetryableStatusCodes: held.unsafeRetryableStatusCodes,
        });
    }

    /** Build a policy from an SdkConfig. @param {any} config @returns {RetryPolicy} */
    static fromConfig(config) {
        return new RetryPolicy({
            maxAttempts: config.maxRetries,
            backoffSeconds: config.retryBackoffSeconds,
            backoffMaxSeconds: config.retryBackoffMaxSeconds,
            retryableStatusCodes: config.retryableHttpCodes,
            unsafeRetryableStatusCodes: config.unsafeRetryableHttpCodes,
        });
    }

    /**
     * Whether a status warrants another attempt: a safe method on the status alone, anything else only if listed
     * in `unsafeRetryableStatusCodes`. An explicitly passed `undefined` method counts as unsafe.
     * @param {number} statusCode @param {...any} methodArgs @returns {boolean}
     */
    shouldRetryStatusCode(statusCode, ...methodArgs) {
        const method = methodArgs.length === 0 ? 'GET' : methodArgs[0];
        if (!this.retryableStatusCodes.has(statusCode)) return false;
        if (isUnsafeMethod(method)) return this.unsafeRetryableStatusCodes.has(statusCode);
        return true;
    }

    /**
     * Whether a transport failure warrants another attempt: nothing delivered retries any method, possibly
     * delivered only an {@link IDEMPOTENT_METHODS} one.
     * @param {{ kind?: string }} error @param {...any} methodArgs @returns {boolean}
     */
    shouldRetryAfterException(error, ...methodArgs) {
        const method = methodArgs.length === 0 ? 'GET' : methodArgs[0];
        const stage = deliveryStageOfKind(error && error.kind);
        if (stage === DELIVERY_STAGE.FATAL) return false;
        if (stage === DELIVERY_STAGE.NOT_SENT) return true;
        return isIdempotentMethod(method);
    }

    /**
     * How long to wait before the next attempt: exponential with full jitter.
     * @param {number} attempt 1-based index of the attempt that just failed
     * @param {{ retryAfterHeader?: string | null }} [options]
     * @returns {number} finite, and never negative
     */
    computeBackoffSeconds(attempt, options = {}) {
        const serverDelay = parseRetryAfter(options.retryAfterHeader);
        if (serverDelay !== null) return Math.min(serverDelay, this.backoffMaxSeconds);
        const exponent = Math.min(Math.max(0, attempt - 1), MAX_BACKOFF_EXPONENT);
        const window = Math.min(this.backoffSeconds * 2 ** exponent, this.backoffMaxSeconds);
        return Math.random() * window;
    }
}
