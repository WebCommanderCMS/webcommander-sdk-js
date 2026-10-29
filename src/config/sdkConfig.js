import fs from 'node:fs';
import {AuthConfig} from './authConfig.js';
import {SdkConfigError, SdkUsageError} from '../errors.js';
import {
    DEFAULT_MAX_ATTEMPTS,
    DEFAULT_RETRYABLE_HTTP_CODES,
    DEFAULT_RETRY_BACKOFF_MAX_SECONDS,
    DEFAULT_RETRY_BACKOFF_SECONDS,
    DEFAULT_UNSAFE_RETRYABLE_HTTP_CODES,
} from '../http/retryPolicy.js';
import {redactFields} from '../redaction.js';

/** Used when the package version cannot be read; it names itself as not a released version. */
const VERSION_FALLBACK = '0.0.0+source';

/** The version from package.json, or a constant so import cannot fail. @returns {string} */
function readInstalledVersion() {
    try {
        const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
        return pkg.version || VERSION_FALLBACK;
    } catch {
        return VERSION_FALLBACK;
    }
}

export const SDK_VERSION = readInstalledVersion();

export const DEFAULT_API_VERSION = 'v4';
export const DEFAULT_TIMEOUT_SECONDS = 30.0;
export const DEFAULT_CONNECT_TIMEOUT_SECONDS = 10.0;
export const DEFAULT_MAX_RETRIES = DEFAULT_MAX_ATTEMPTS;
export {
    DEFAULT_RETRYABLE_HTTP_CODES,
    DEFAULT_UNSAFE_RETRYABLE_HTTP_CODES,
    DEFAULT_RETRY_BACKOFF_SECONDS,
    DEFAULT_RETRY_BACKOFF_MAX_SECONDS,
};
export const DEFAULT_POOL_MAXSIZE = 10;

export const DEFAULT_MAX_RESPONSE_BYTES = 64 * 1024 * 1024;

/**
 * Ceiling on the encoded body one request puts on the wire, framing included: 1 GiB. Separate from
 * {@link DEFAULT_MAX_UPLOAD_BYTES}; building a body holds about twice this in memory.
 */
export const DEFAULT_MAX_REQUEST_BYTES = 1024 * 1024 * 1024;

export const DEFAULT_MAX_UPLOAD_BYTES = 1024 * 1024 * 1024;

export const DEFAULT_MAX_MULTIPART_OVERHEAD_BYTES = 16 * 1024 * 1024;

export const DEFAULT_MAX_TOKEN_CACHE_BYTES = 8 * 1024 * 1024;

export const DEFAULT_MAX_CA_BUNDLE_BYTES = 8 * 1024 * 1024;

export const DEFAULT_LOG_LEVEL = 'WARNING';
export const DEFAULT_PRINT_FORMAT = 'pretty';
export const DEFAULT_USER_AGENT = `@webcommander/webcommander/${SDK_VERSION}`;

export const PRINT_FORMAT_PRETTY = 'pretty';
export const PRINT_FORMAT_COMPACT = 'compact';

/** Which form `response.data` presents; `response.map`, `.json` and `.dto` ignore it and are always there. */
export const ResponseFormat = Object.freeze({
    MAP: 'map',
    JSON: 'json',
    DTO: 'dto',
});

/** The built-in default: the decoded body. */
export const DEFAULT_RESPONSE_FORMAT = ResponseFormat.MAP;

/** The lowest-priority source of `responseFormat` — below a client, below a call site. */
export const RESPONSE_FORMAT_ENV_VAR = 'WC_RESPONSE_FORMAT';

const VALID_LOG_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
const VALID_PRINT_FORMATS = [PRINT_FORMAT_PRETTY, PRINT_FORMAT_COMPACT];
/** @type {readonly string[]} */
export const VALID_RESPONSE_FORMATS = Object.freeze(Object.values(ResponseFormat));
const API_VERSION_PATTERN = /^v[1-9][0-9]*$/;
const MAX_HTTP_CODES = 500;

function bounded(value) {
    const text = typeof value === 'string' ? JSON.stringify(value) : String(value);
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

const isText = (v) => typeof v === 'string';
const isBoolean = (v) => typeof v === 'boolean';
const isRealNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isWholeNumber = (v) => Number.isInteger(v);
const isCodeSequence = (v) => Array.isArray(v);
const isOptionalText = (v) => v == null || typeof v === 'string';

/** @type {Array<[string, (v: unknown) => boolean, string]>} */
const FIELD_TYPES = [
    ['apiVersion', isText, "a version string like 'v4' or '4'"],
    ['timeoutSeconds', isRealNumber, 'a number of seconds'],
    ['connectTimeoutSeconds', isRealNumber, 'a number of seconds'],
    ['maxRetries', isWholeNumber, 'an integer'],
    ['retryableHttpCodes', isCodeSequence, 'an iterable of HTTP status codes'],
    ['unsafeRetryableHttpCodes', isCodeSequence, 'an iterable of HTTP status codes'],
    ['retryBackoffSeconds', isRealNumber, 'a number of seconds'],
    ['retryBackoffMaxSeconds', isRealNumber, 'a number of seconds'],
    ['verifySsl', isBoolean, 'true or false'],
    ['caBundle', isOptionalText, 'a path or null'],
    ['proxyUrl', isOptionalText, 'a proxy URL or null'],
    ['poolMaxsize', isWholeNumber, 'an integer'],
    ['maxResponseBytes', isWholeNumber, 'an integer number of bytes'],
    ['maxRequestBytes', isWholeNumber, 'an integer number of bytes'],
    ['maxUploadBytes', isWholeNumber, 'an integer number of bytes'],
    ['maxMultipartOverheadBytes', isWholeNumber, 'an integer number of bytes'],
    ['maxTokenCacheBytes', isWholeNumber, 'an integer number of bytes'],
    ['maxCaBundleBytes', isWholeNumber, 'an integer number of bytes'],
    ['raiseOnError', isBoolean, 'true or false'],
    ['responseFormat', isText, 'a string'],
    ['userAgent', isText, 'a string'],
    ['logLevel', isText, 'a string'],
    ['logBodies', isBoolean, 'true or false'],
    ['logFile', isOptionalText, 'a path or null'],
    ['printApiInfo', isBoolean, 'true or false'],
    ['printRequestPayload', isBoolean, 'true or false'],
    ['printResponseBody', isBoolean, 'true or false'],
    ['printHeaders', isBoolean, 'true or false'],
    ['printCurl', isBoolean, 'true or false'],
    ['printOnlyOnError', isBoolean, 'true or false'],
    ['printFormat', isText, 'a string'],
    ['printColor', isBoolean, 'true or false'],
    ['printMaxChars', isWholeNumber, 'an integer'],
];

/**
 * Every behaviour setting, all optional, as `SdkConfig`, `withOverrides` and `buildClient` accept them.
 * @typedef {object} SdkOptions
 * @property {string} [apiVersion] Version in the path. `'V4'`, `'4'` and `' 4 '` all store `'v4'`. Default `'v4'`.
 * @property {number} [timeoutSeconds] Read deadline and hard ceiling on one attempt, in seconds. Default `30`.
 * @property {number} [connectTimeoutSeconds] Deadline for opening the connection, in seconds. Default `10`.
 * @property {number} [maxRetries] Total attempts, not extra ones: `1` means no retry. Default `1`.
 * @property {number[]} [retryableHttpCodes] Statuses retried on a safe method. Default `[429, 500, 502, 503, 504]`.
 * @property {number[]} [unsafeRetryableHttpCodes] Statuses retried on a write too; none proves a write did not apply. Default `[]`.
 * @property {number} [retryBackoffSeconds] Base backoff before the jitter is applied. Default `0.5`.
 * @property {number} [retryBackoffMaxSeconds] Ceiling on any single backoff. Default `20`.
 * @property {boolean} [verifySsl] Verify the server certificate. Turning this off warns. Default `true`.
 * @property {string | null} [caBundle] Path to a CA bundle, for a private or self-signed chain. Default `null`.
 * @property {string | null} [proxyUrl] `http://` or `https://` proxy for every request. Default `null`.
 * @property {number} [poolMaxsize] Sockets kept open for reuse, not a ceiling on concurrency. Default `10`.
 * @property {number} [maxResponseBytes] Ceiling on one buffered response body, in bytes. Default `64 * 1024 * 1024`.
 * @property {number} [maxRequestBytes] Ceiling on the encoded request body, framing included. Default `1024 * 1024 * 1024`.
 * @property {number} [maxUploadBytes] Ceiling on the source material one body is built from. Default `1024 * 1024 * 1024`.
 * @property {number} [maxMultipartOverheadBytes] Ceiling on multipart framing and part headers. Default `16 * 1024 * 1024`.
 * @property {number} [maxTokenCacheBytes] Ceiling on the token cache file read back from disk. Default `8 * 1024 * 1024`.
 * @property {number} [maxCaBundleBytes] Ceiling on the CA bundle read at construction. Default `8 * 1024 * 1024`.
 * @property {Record<string, string> | Array<[string, string]> | string} [defaultHeaders] Headers added to every request.
 * @property {boolean} [raiseOnError] Throw on a failed call instead of returning it. Default `false`.
 * @property {'map' | 'json' | 'dto'} [responseFormat] Which form `response.data` presents; else `WC_RESPONSE_FORMAT`, else `'map'`.
 * @property {string} [userAgent] The `User-Agent` sent. Default `@webcommander/webcommander/<version>`.
 * @property {'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'} [logLevel] Lowest severity emitted. Default `'WARNING'`.
 * @property {boolean} [logBodies] Include request and response bodies in DEBUG records, redacted. Default `false`.
 * @property {string | null} [logFile] Also append records to this file. Default `null`.
 * @property {boolean} [printApiInfo] Print method, URL, status, attempt and timing for each call. Default `false`.
 * @property {boolean} [printRequestPayload] Print the request body that was sent, redacted. Default `false`.
 * @property {boolean} [printResponseBody] Print the response body, with bytes summarised. Default `false`.
 * @property {boolean} [printHeaders] Print request and response headers, redacted. Default `false`.
 * @property {boolean} [printCurl] Print a runnable `curl` reproduction, secrets removed. Default `false`.
 * @property {boolean} [printOnlyOnError] Print only the calls that failed. Default `false`.
 * @property {'pretty' | 'compact'} [printFormat] Boxed output, or one line per call. Default `'pretty'`.
 * @property {boolean} [printColor] ANSI colour, honouring NO_COLOR and whether stdout is a TTY. Default `false`.
 * @property {number} [printMaxChars] Truncate printed bodies to this many characters; `0` is unlimited. Default `0`.
 */

const DEFAULTS = {
    apiVersion: DEFAULT_API_VERSION,
    timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
    connectTimeoutSeconds: DEFAULT_CONNECT_TIMEOUT_SECONDS,
    maxRetries: DEFAULT_MAX_RETRIES,
    retryableHttpCodes: [...DEFAULT_RETRYABLE_HTTP_CODES],
    unsafeRetryableHttpCodes: [...DEFAULT_UNSAFE_RETRYABLE_HTTP_CODES],
    retryBackoffSeconds: DEFAULT_RETRY_BACKOFF_SECONDS,
    retryBackoffMaxSeconds: DEFAULT_RETRY_BACKOFF_MAX_SECONDS,
    verifySsl: true,
    caBundle: null,
    proxyUrl: null,
    poolMaxsize: DEFAULT_POOL_MAXSIZE,
    maxResponseBytes: DEFAULT_MAX_RESPONSE_BYTES,
    maxRequestBytes: DEFAULT_MAX_REQUEST_BYTES,
    maxUploadBytes: DEFAULT_MAX_UPLOAD_BYTES,
    maxMultipartOverheadBytes: DEFAULT_MAX_MULTIPART_OVERHEAD_BYTES,
    maxTokenCacheBytes: DEFAULT_MAX_TOKEN_CACHE_BYTES,
    maxCaBundleBytes: DEFAULT_MAX_CA_BUNDLE_BYTES,
    defaultHeaders: [],
    raiseOnError: false,
    responseFormat: DEFAULT_RESPONSE_FORMAT,
    userAgent: DEFAULT_USER_AGENT,
    logLevel: DEFAULT_LOG_LEVEL,
    logBodies: false,
    logFile: null,
    printApiInfo: false,
    printRequestPayload: false,
    printResponseBody: false,
    printHeaders: false,
    printCurl: false,
    printOnlyOnError: false,
    printFormat: DEFAULT_PRINT_FORMAT,
    printColor: false,
    printMaxChars: 0,
};

/** Every `SdkConfig` behaviour field, in declaration order. */
const CONFIG_FIELDS = Object.keys(DEFAULTS);

/** Every name a caller may pass as an override; `auth` is handled apart from the rest. */
const KNOWN_CONFIG_FIELDS = ['auth', ...CONFIG_FIELDS];

/** Settle the version on `vN` — `'V4'`, `' 4 '` and `'4'` become `'v4'`; a non-string is returned unchanged. */
function normaliseApiVersion(raw) {
    if (raw != null && typeof raw !== 'string') return raw;
    const value = String(raw || '')
        .trim()
        .toLowerCase();
    return value && !value.startsWith('v') ? `v${value}` : value;
}

/**
 * The `responseFormat` the environment offers, read once per config and ranked below a client and a call site;
 * an unrecognised value is returned unchanged so validation refuses it by name.
 */
function environmentResponseFormat() {
    const raw = process.env[RESPONSE_FORMAT_ENV_VAR];
    if (raw == null || !String(raw).trim()) return {value: DEFAULT_RESPONSE_FORMAT, source: null};
    return {value: raw, source: RESPONSE_FORMAT_ENV_VAR};
}

function normaliseCase(raw, transform) {
    if (raw != null && typeof raw !== 'string') return raw;
    return transform(String(raw || '').trim());
}

function normaliseCodes(raw) {
    if (typeof raw === 'string' || !isIterable(raw)) return raw;
    const out = [];
    for (const item of /** @type {Iterable<unknown>} */ (raw)) {
        out.push(item);
        if (out.length > MAX_HTTP_CODES) break;
    }
    return out;
}

function isIterable(v) {
    return v != null && typeof (/** @type {any} */ (v)[Symbol.iterator]) === 'function';
}

/** RFC 9110 token, non-empty. Read only through {@link unsendableHeaderReason}. */
const HEADER_NAME_PATTERN = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/** An RFC 9110 header value: internal tabs allowed, no leading or trailing whitespace. */
const HEADER_VALUE_PATTERN = /^(?:[\x21-\x7e](?:[\x20-\x7e\x09]*[\x21-\x7e])?)?$/;

/**
 * Why a header pair cannot be sent, or `null` — the one header grammar, applied at construction, before the
 * token grant and before I/O. Controls, DEL and bytes >= 0x80 are refused; the value is never quoted back.
 * @param {unknown} name @param {string | null} valueText @returns {string | null}
 */
export function unsendableHeaderReason(name, valueText) {
    if (valueText !== null && HEADER_NAME_PATTERN.test(String(name)) && HEADER_VALUE_PATTERN.test(valueText)) {
        return null;
    }
    return `header ${JSON.stringify(String(name))}: not sendable (control character, non-ASCII byte, edge whitespace, bad name or non-text value)`;
}

/** @param {unknown} name @param {unknown} value @returns {[string, string]} */
function headerPair(name, value) {
    if (!(typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        throw new SdkConfigError(
            `defaultHeaders: ${bounded(String(name))} holds ${bounded(value)}, which is not a header value; headers must be flat`,
        );
    }
    const nameText = String(name);
    const valueText = String(value);
    const unsendable = unsendableHeaderReason(nameText, valueText);
    if (unsendable) throw new SdkConfigError(`defaultHeaders: ${unsendable}`);
    return [nameText, valueText];
}

/** @param {unknown} raw @returns {Array<[string, string]>} */
function normaliseHeaders(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        /** @type {Array<[string, string]>} */
        const pairs = [];
        for (const entry of raw) {
            if (typeof entry === 'string' || !Array.isArray(entry) || entry.length !== 2) {
                throw new SdkConfigError(`defaultHeaders: expected (name, value) pairs, got ${bounded(entry)}`);
            }
            pairs.push(headerPair(entry[0], entry[1]));
        }
        return pairs;
    }
    if (typeof raw === 'string') {
        let decoded;
        try {
            decoded = JSON.parse(raw);
        } catch (error) {
            throw new SdkConfigError(
                `defaultHeaders: expected an object or a JSON object, got ${bounded(raw)} (${error instanceof Error ? error.message : String(error)})`,
            );
        }
        if (decoded === null || typeof decoded !== 'object' || Array.isArray(decoded)) {
            throw new SdkConfigError('defaultHeaders: JSON must be an object');
        }
        return Object.entries(decoded).map(([k, v]) => headerPair(k, v));
    }
    if (typeof raw === 'object') {
        return Object.entries(raw).map(([k, v]) => headerPair(k, v));
    }
    throw new SdkConfigError(
        `defaultHeaders: expected an object, a JSON object or (name, value) pairs, got ${bounded(raw)}`,
    );
}

function problemsWithTheProxyUrl(proxyUrl) {
    let parsed;
    try {
        parsed = new URL(proxyUrl);
    } catch {
        // No '; ' in one problem, as that joins the batch; the parser's text is dropped as it may quote the value.
        return ['proxyUrl: is not a URL — the value is not shown: it may carry a password'];
    }
    const scheme = parsed.protocol.replace(/:$/, '');
    if ((scheme !== 'http' && scheme !== 'https') || !parsed.host) {
        return [
            'proxyUrl: must start with http:// or https:// and include a host — ' +
                'the value is not shown: it may carry a password',
        ];
    }
    return [];
}

/**
 * Frozen SDK configuration.
 * @example
 * const config = new SdkConfig(auth, {
 *     raiseOnError: true,      // throw instead of returning a failed response
 *     maxRetries: 3,
 *     printApiInfo: true,      // log method, URL, status, timing
 * });
 * const staging = config.withOverrides({auth: stagingAuth}); // swap credentials only
 */
export class SdkConfig {
    /** @param {AuthConfig} auth @param {SdkOptions} [overrides] every behaviour setting, all optional */
    constructor(auth, overrides = {}) {
        // Declared for the type checker, then filled from CONFIG_FIELDS.
        /** @readonly @type {AuthConfig} */ this.auth = auth;
        /** @readonly @type {string} */ this.apiVersion = DEFAULTS.apiVersion;
        /** @readonly @type {number} */ this.timeoutSeconds = DEFAULTS.timeoutSeconds;
        /** @readonly @type {number} */ this.connectTimeoutSeconds = DEFAULTS.connectTimeoutSeconds;
        /** @readonly @type {number} */ this.maxRetries = DEFAULTS.maxRetries;
        /** @readonly @type {readonly number[]} */ this.retryableHttpCodes = DEFAULTS.retryableHttpCodes;
        /** @readonly @type {readonly number[]} */ this.unsafeRetryableHttpCodes = DEFAULTS.unsafeRetryableHttpCodes;
        /** @readonly @type {number} */ this.retryBackoffSeconds = DEFAULTS.retryBackoffSeconds;
        /** @readonly @type {number} */ this.retryBackoffMaxSeconds = DEFAULTS.retryBackoffMaxSeconds;
        /** @readonly @type {boolean} */ this.verifySsl = DEFAULTS.verifySsl;
        /** @readonly @type {string | null} */ this.caBundle = DEFAULTS.caBundle;
        /** @readonly @type {string | null} */ this.proxyUrl = DEFAULTS.proxyUrl;
        /** @readonly @type {number} */ this.poolMaxsize = DEFAULTS.poolMaxsize;
        /** @readonly @type {number} */ this.maxResponseBytes = DEFAULTS.maxResponseBytes;
        /** @readonly @type {number} */ this.maxRequestBytes = DEFAULTS.maxRequestBytes;
        /** @readonly @type {number} */ this.maxUploadBytes = DEFAULTS.maxUploadBytes;
        /** @readonly @type {number} */ this.maxMultipartOverheadBytes = DEFAULTS.maxMultipartOverheadBytes;
        /** @readonly @type {number} */ this.maxTokenCacheBytes = DEFAULTS.maxTokenCacheBytes;
        /** @readonly @type {number} */ this.maxCaBundleBytes = DEFAULTS.maxCaBundleBytes;
        /** @readonly @type {ReadonlyArray<readonly [string, string]>} */ this.defaultHeaders = DEFAULTS.defaultHeaders;
        /** @readonly @type {boolean} */ this.raiseOnError = DEFAULTS.raiseOnError;
        /** @type {string} */
        this.responseFormat = DEFAULTS.responseFormat;
        /** @readonly @type {string} */ this.userAgent = DEFAULTS.userAgent;
        /** @readonly @type {string} */ this.logLevel = DEFAULTS.logLevel;
        /** @readonly @type {boolean} */ this.logBodies = DEFAULTS.logBodies;
        /** @readonly @type {string | null} */ this.logFile = DEFAULTS.logFile;
        /** @readonly @type {boolean} */ this.printApiInfo = DEFAULTS.printApiInfo;
        /** @readonly @type {boolean} */ this.printRequestPayload = DEFAULTS.printRequestPayload;
        /** @readonly @type {boolean} */ this.printResponseBody = DEFAULTS.printResponseBody;
        /** @readonly @type {boolean} */ this.printHeaders = DEFAULTS.printHeaders;
        /** @readonly @type {boolean} */ this.printCurl = DEFAULTS.printCurl;
        /** @readonly @type {boolean} */ this.printOnlyOnError = DEFAULTS.printOnlyOnError;
        /** @readonly @type {string} */ this.printFormat = DEFAULTS.printFormat;
        /** @readonly @type {boolean} */ this.printColor = DEFAULTS.printColor;
        /** @readonly @type {number} */ this.printMaxChars = DEFAULTS.printMaxChars;

        rejectUnknownConfigFields(overrides);
        // An explicit `auth` override beats the positional one, so `withOverrides({auth})` swaps credentials only.
        this.auth = 'auth' in overrides ? /** @type {any} */ (overrides).auth : auth;
        for (const name of CONFIG_FIELDS) {
            /** @type {any} */ (this)[name] =
                name in overrides ? /** @type {any} */ (overrides)[name] : /** @type {any} */ (DEFAULTS)[name];
        }

        const suppliedFormat = /** @type {any} */ (overrides).responseFormat;
        const resolvedFormat =
            suppliedFormat == null ? environmentResponseFormat() : {value: suppliedFormat, source: null};
        this.responseFormat = /** @type {string} */ (resolvedFormat.value);

        this.apiVersion = /** @type {string} */ (normaliseApiVersion(this.apiVersion));
        this.responseFormat = /** @type {string} */ (normaliseCase(this.responseFormat, (s) => s.toLowerCase()));
        this.logLevel = /** @type {string} */ (normaliseCase(this.logLevel, (s) => s.toUpperCase()));
        this.printFormat = /** @type {string} */ (normaliseCase(this.printFormat, (s) => s.toLowerCase()));
        this.retryableHttpCodes = /** @type {number[]} */ (normaliseCodes(this.retryableHttpCodes));
        this.unsafeRetryableHttpCodes = /** @type {number[]} */ (normaliseCodes(this.unsafeRetryableHttpCodes));

        /** @type {string | null} */
        let headerProblem = null;
        try {
            this.defaultHeaders = normaliseHeaders(this.defaultHeaders);
        } catch (error) {
            headerProblem = error instanceof Error ? error.message : String(error);
            this.defaultHeaders = [];
        }

        this.#validate(headerProblem, resolvedFormat.source);

        // `Object.freeze` is shallow: without this, `retryableHttpCodes.push(999)` would bypass validation.
        for (const pair of /** @type {Array<[string, string]>} */ (this.defaultHeaders)) Object.freeze(pair);
        Object.freeze(this.defaultHeaders);
        Object.freeze(this.retryableHttpCodes);
        Object.freeze(this.unsafeRetryableHttpCodes);
        Object.freeze(this);
    }

    #validate(headerProblem, responseFormatSource = null) {
        /** @type {string[]} */
        const problems = [];
        if (headerProblem) problems.push(headerProblem);

        if (!(this.auth instanceof AuthConfig)) {
            problems.push(`auth: expected an AuthConfig, got ${this.auth === null ? 'null' : typeof this.auth}`);
        }

        const mistyped = new Set();
        for (const [name, isValid, expected] of FIELD_TYPES) {
            const value = /** @type {any} */ (this)[name];
            if (!isValid(value)) {
                mistyped.add(name);
                problems.push(`${name}: expected ${expected}, got ${bounded(value)}`);
            }
        }

        if (!mistyped.has('apiVersion') && !API_VERSION_PATTERN.test(/** @type {string} */ (this.apiVersion))) {
            problems.push(`apiVersion: expected something like 'v4' or '4', got ${bounded(this.apiVersion)}`);
        }
        if (!mistyped.has('maxRetries') && /** @type {number} */ (this.maxRetries) < 1) {
            problems.push(`maxRetries: must be at least 1 (1 disables retry), got ${this.maxRetries}`);
        }
        if (!mistyped.has('timeoutSeconds') && /** @type {number} */ (this.timeoutSeconds) <= 0) {
            problems.push('timeoutSeconds: must be > 0');
        }
        if (!mistyped.has('connectTimeoutSeconds') && /** @type {number} */ (this.connectTimeoutSeconds) <= 0) {
            problems.push('connectTimeoutSeconds: must be > 0');
        }
        if (!mistyped.has('retryBackoffSeconds') && /** @type {number} */ (this.retryBackoffSeconds) < 0) {
            problems.push('retryBackoffSeconds: must be >= 0');
        }
        if (
            !mistyped.has('retryBackoffSeconds') &&
            !mistyped.has('retryBackoffMaxSeconds') &&
            /** @type {number} */ (this.retryBackoffMaxSeconds) < /** @type {number} */ (this.retryBackoffSeconds)
        ) {
            problems.push('retryBackoffMaxSeconds: must be >= retryBackoffSeconds');
        }
        if (!mistyped.has('poolMaxsize') && /** @type {number} */ (this.poolMaxsize) < 1) {
            problems.push('poolMaxsize: must be at least 1');
        }
        for (const name of [
            'maxResponseBytes',
            'maxRequestBytes',
            'maxUploadBytes',
            'maxMultipartOverheadBytes',
            'maxTokenCacheBytes',
            'maxCaBundleBytes',
        ]) {
            const value = /** @type {number} */ (/** @type {any} */ (this)[name]);
            if (!mistyped.has(name) && value < 1) {
                problems.push(`${name}: must be at least 1 byte, got ${value}`);
            }
        }

        for (const name of ['retryableHttpCodes', 'unsafeRetryableHttpCodes']) {
            if (mistyped.has(name)) continue;
            const codes = /** @type {number[]} */ (/** @type {any} */ (this)[name]);
            if (codes.length > MAX_HTTP_CODES) {
                problems.push(
                    `${name}: at most ${MAX_HTTP_CODES} status codes (100-599 is every code there is), got more than that`,
                );
                continue;
            }
            for (const code of codes) {
                if (!isWholeNumber(code)) {
                    problems.push(`${name}: expected HTTP status codes, got ${bounded(code)}`);
                } else if (!(code >= 100 && code <= 599)) {
                    problems.push(`${name}: ${code} is not an HTTP status code`);
                }
            }
        }

        if (!mistyped.has('logLevel') && !VALID_LOG_LEVELS.includes(/** @type {string} */ (this.logLevel))) {
            problems.push(`logLevel: expected one of ${VALID_LOG_LEVELS.join(', ')}, got ${bounded(this.logLevel)}`);
        }
        if (!mistyped.has('printFormat') && !VALID_PRINT_FORMATS.includes(/** @type {string} */ (this.printFormat))) {
            problems.push(
                `printFormat: expected one of ${VALID_PRINT_FORMATS.join(', ')}, got ${bounded(this.printFormat)}`,
            );
        }
        if (!mistyped.has('printMaxChars') && /** @type {number} */ (this.printMaxChars) < 0) {
            problems.push('printMaxChars: must be >= 0 (0 = unlimited)');
        }
        // Refused, never a silent fall back to 'map'; the source is named because the caller's code does not show it.
        if (
            !mistyped.has('responseFormat') &&
            !VALID_RESPONSE_FORMATS.includes(/** @type {string} */ (this.responseFormat))
        ) {
            const from = responseFormatSource ? ` (from ${responseFormatSource})` : '';
            problems.push(
                `responseFormat: expected one of ${VALID_RESPONSE_FORMATS.join(', ')}, got ${bounded(this.responseFormat)}${from}`,
            );
        }

        if (!mistyped.has('proxyUrl') && this.proxyUrl) {
            problems.push(...problemsWithTheProxyUrl(/** @type {string} */ (this.proxyUrl)));
        }

        if (!mistyped.has('caBundle') && this.caBundle) {
            if (!this.verifySsl) {
                problems.push(
                    'caBundle and verifySsl=false are contradictory: one supplies a trust store, the other disables verification',
                );
            }
            let isFile;
            try {
                isFile = fs.statSync(/** @type {string} */ (this.caBundle)).isFile();
            } catch {
                isFile = false;
            }
            // The path is not quoted: it carries the account name and deployment layout, and this refusal is logged.
            if (!isFile) problems.push('caBundle: the path it names is not a readable file');
        }

        if (problems.length) throw new SdkConfigError(problems.join('; '));
    }

    get baseUrl() {
        return this.auth.baseUrl;
    }
    get clientId() {
        return this.auth.clientId;
    }
    get clientSecret() {
        return this.auth.clientSecret;
    }
    get redirectUri() {
        return this.auth.redirectUri;
    }
    get authString() {
        return this.auth.authString;
    }
    get clientName() {
        return this.auth.clientName;
    }
    get grantType() {
        return this.auth.grantType;
    }
    get tokenCachePath() {
        return this.auth.tokenCachePath;
    }

    /** The `(connect, read)` deadline pair, in seconds. @returns {[number, number]} */
    get timeout() {
        return [/** @type {number} */ (this.connectTimeoutSeconds), /** @type {number} */ (this.timeoutSeconds)];
    }

    /** `defaultHeaders` as a fresh object. @returns {Record<string, string>} */
    get defaultHeadersDict() {
        return Object.fromEntries(/** @type {Array<[string, string]>} */ (this.defaultHeaders));
    }

    /**
     * @param {unknown[]} credentials
     * @param {{instance?: number | string | null, auth?: AuthConfig} & SdkOptions} [options] @returns {SdkConfig}
     */
    static fromCredentials(credentials, options = {}) {
        const {instance = null, ...overrides} = options;
        const chosen = selectCredentials(credentials, instance);
        if (chosen instanceof SdkConfig) {
            return Object.keys(overrides).length ? chosen.withOverrides(overrides) : chosen;
        }
        if (chosen instanceof AuthConfig) {
            return new SdkConfig(chosen, overrides);
        }
        if (chosen === null || typeof chosen !== 'object') {
            throw new SdkConfigError(
                `credentials[${instance === null ? 0 : JSON.stringify(instance)}]: expected an SdkConfig, an AuthConfig or a plain object of config fields, got ${chosen === null ? 'null' : typeof chosen}`,
            );
        }
        const block = {.../** @type {Record<string, unknown>} */ (chosen)};
        const blockAuth = block.auth;
        delete block.auth;
        const authNames = [
            'baseUrl',
            'clientId',
            'clientSecret',
            'redirectUri',
            'authString',
            'clientName',
            'grantType',
            'tokenCachePath',
        ];
        /** @type {Record<string, unknown>} */
        const authValues = {};
        for (const name of authNames) {
            if (name in block) {
                authValues[name] = block[name];
                delete block[name];
            }
        }
        const settings = {...block, ...overrides};
        rejectUnknownConfigFields(settings);
        // An `auth` override beats the block's own and is passed to the constructor positionally.
        const suppliedAuth = 'auth' in settings ? settings.auth : blockAuth;
        delete settings.auth;
        if (suppliedAuth == null) {
            return new SdkConfig(new AuthConfig(/** @type {any} */ (authValues)), settings);
        }
        if (Object.keys(authValues).length) {
            throw new SdkConfigError(
                `auth: an AuthConfig was supplied alongside the credential field(s) ${Object.keys(authValues).sort().join(', ')}; pass one or the other`,
            );
        }
        return new SdkConfig(/** @type {AuthConfig} */ (suppliedAuth), settings);
    }

    /**
     * @param {{auth?: AuthConfig} & SdkOptions} changes the settings to replace; everything else is kept
     * @returns {SdkConfig}
     */
    withOverrides(changes = {}) {
        /** @type {any} */
        const merged = {};
        for (const name of CONFIG_FIELDS) merged[name] = /** @type {any} */ (this)[name];
        Object.assign(merged, changes);
        const nextAuth = 'auth' in changes ? /** @type {any} */ (changes.auth) : this.auth;
        delete merged.auth;
        return new SdkConfig(nextAuth, merged);
    }

    /** One line, with every secret-named field redacted. @returns {string} */
    toString() {
        const shown = redactFields(this, KNOWN_CONFIG_FIELDS);
        return `SdkConfig(${shown.join(', ')})`;
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.toString();
    }
}

/**
 * Return one block from a list, chosen by position or by name.
 * @example
 * selectCredentials(blocks);              // the first block
 * selectCredentials(blocks, 1);           // by position; -1 is the last
 * selectCredentials(blocks, 'staging');   // by clientName
 * @param {unknown[]} credentials @param {number | string | null} [instance] @returns {unknown}
 */
export function selectCredentials(credentials, instance = null) {
    const blocks = readCredentialBlocks(credentials);
    if (!blocks.length) throw new SdkUsageError('no credentials were supplied');
    if (instance === null || instance === undefined) return blocks[0];

    if (typeof instance === 'number' && Number.isInteger(instance)) {
        // Negative indices count from the end, matching `clientRegistry.resolveIndex`.
        const length = blocks.length;
        if (instance < -length || instance >= length) {
            throw new SdkUsageError(`no credentials at index ${instance}; ${length} supplied (0-${length - 1})`);
        }
        return blocks[((instance % length) + length) % length];
    }

    const matched = [];
    blocks.forEach((block, index) => {
        if (readClientName(block) === instance) matched.push(index);
    });
    if (matched.length > 1) {
        throw new SdkUsageError(
            `instance ${JSON.stringify(instance)} is defined more than once, at index ${matched.join(' and ')}; clientName has to identify one entry`,
        );
    }
    if (matched.length) return blocks[matched[0]];

    const available = blocks.map((block, index) => readClientName(block) || `<index ${index}>`).join(', ');
    throw new SdkUsageError(`unknown instance ${JSON.stringify(instance)}; available: ${available}`);
}

function typeNameOf(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'Array';
    if (typeof value === 'object') {
        const named = /** @type {any} */ (value).constructor;
        return (named && typeof named.name === 'string' && named.name) || 'object';
    }
    return typeof value;
}

function readCredentialBlocks(credentials) {
    if (
        typeof credentials === 'string' ||
        (credentials !== null && typeof credentials === 'object' && !isIterable(credentials))
    ) {
        throw new SdkUsageError(
            `credentials: expected a list of credential blocks, not a single ${typeNameOf(credentials)}; ` +
                'wrap the single block in a list: [block]',
        );
    }
    if (!isIterable(credentials)) {
        throw new SdkUsageError(
            `credentials: expected a list of credential blocks; ${typeNameOf(credentials)} is not iterable`,
        );
    }
    return [.../** @type {Iterable<unknown>} */ (credentials)];
}

/**
 * An entry's `clientName`, from a config or a plain object; `null` when unnamed.
 * @param {unknown} block @returns {string | null}
 */
export function readClientName(block) {
    if (block instanceof SdkConfig || block instanceof AuthConfig) return block.clientName;
    if (block && typeof block === 'object') {
        const value = /** @type {Record<string, unknown>} */ (block).clientName;
        return value ? String(value) : null;
    }
    return null;
}

function rejectUnknownConfigFields(values) {
    const unknown = Object.keys(values).filter((key) => !KNOWN_CONFIG_FIELDS.includes(key));
    if (unknown.length) throw new SdkConfigError(`unknown config field(s): ${unknown.sort().join(', ')}`);
}
