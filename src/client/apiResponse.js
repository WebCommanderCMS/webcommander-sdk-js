import {SdkAuthError, SdkError, SdkUsageError} from '../errors.js';
import {DEFAULT_RESPONSE_FORMAT, ResponseFormat} from '../config/sdkConfig.js';
import {isDtoMapping} from '../dto.js';
import {isPlainRecord} from '../plainRecord.js';
import {REDACTED, redactMapping, redactValue, shouldRedact} from '../redaction.js';

const MAX_REPORTED_MESSAGES = 50;
const MAX_MESSAGE_DEPTH = 4;
const URL_FIELD = 'url';
const SUCCESS_FLAG = 'isSuccess';

/** Classification of a failed call, derived from the HTTP status. A member is its string value. */
export const ErrorType = Object.freeze({
    NONE: 'none',
    REDIRECT: 'redirect',
    VALIDATION: 'validation',
    AUTHENTICATION: 'authentication',
    AUTHORIZATION: 'authorization',
    NOT_FOUND: 'not_found',
    METHOD_NOT_ALLOWED: 'method_not_allowed',
    CONFLICT: 'conflict',
    RATE_LIMIT: 'rate_limit',
    SERVER: 'server',
    NETWORK: 'network',
    TIMEOUT: 'timeout',
    UNKNOWN: 'unknown',
});

const ERROR_TYPE_VALUES = new Set(Object.values(ErrorType));

/**
 * Map an HTTP status to an ErrorType; a denied 2xx classifies `unknown`, not `none`.
 * @param {number} statusCode @param {boolean} [bodyDeniedSuccess] @returns {string}
 */
export function classifyErrorType(statusCode, bodyDeniedSuccess = false) {
    if (statusCode >= 200 && statusCode < 300) return bodyDeniedSuccess ? ErrorType.UNKNOWN : ErrorType.NONE;
    if (statusCode >= 300 && statusCode < 400) return ErrorType.REDIRECT;
    if (statusCode === 400 || statusCode === 422) return ErrorType.VALIDATION;
    if (statusCode === 401) return ErrorType.AUTHENTICATION;
    if (statusCode === 403) return ErrorType.AUTHORIZATION;
    if (statusCode === 404) return ErrorType.NOT_FOUND;
    if (statusCode === 405) return ErrorType.METHOD_NOT_ALLOWED;
    if (statusCode === 409) return ErrorType.CONFLICT;
    if (statusCode === 429) return ErrorType.RATE_LIMIT;
    if (statusCode >= 500 && statusCode < 600) return ErrorType.SERVER;
    return ErrorType.UNKNOWN;
}

/** Redact query values for RequestInfo into a frozen copy; prototype-less while filled, for `__proto__`. */
function redactQueryParams(params) {
    if (!params) return Object.freeze({});
    /** @type {Record<string, unknown>} */
    const out = Object.create(null);
    for (const [key, value] of Object.entries(params)) {
        out[key] = shouldRedact(String(key)) ? REDACTED : redactValue(value);
    }
    return Object.freeze(Object.setPrototypeOf(out, Object.prototype));
}

function redactUrl(url) {
    return redactMapping({[URL_FIELD]: /** @type {string} */ (url)})[URL_FIELD];
}

/** A supplied path template, minus any query string or fragment. @param {unknown} endpoint @returns {string | null} */
export function pathTemplateOf(endpoint) {
    if (typeof endpoint !== 'string' || !endpoint) return null;
    const cut = endpoint.search(/[?#]/);
    return cut < 0 ? endpoint : endpoint.slice(0, cut);
}

/** The {@link RequestInfo} fields carrying the call's values, withheld from every rendering. */
const WITHHELD_FIELDS = Object.freeze(['url', 'queryParams', 'headers', 'body']);

export class RequestInfo {
    /** The URL as requested, before redaction. @type {string} */
    #resolvedUrl;

    /**
     * @param {{
     *   clientName: string, apiVersion: string, httpMethod: string, url: string,
     *   resolvedUrl?: string, endpoint?: string | null,
     *   queryParams?: Record<string, unknown>, body?: unknown, headers?: Record<string, string>,
     *   attemptCount?: number, maxAttempts?: number, elapsedSeconds?: number,
     * }} options `endpoint` is the unresolved path template
     */
    constructor(options) {
        /** @readonly @type {string} */
        this.clientName = options.clientName;
        /** @readonly @type {string} */
        this.apiVersion = options.apiVersion;
        /** @readonly @type {string} */
        this.httpMethod = options.httpMethod;
        /** The resolved URL, secrets redacted; still carries the host and path. @readonly @type {string} */
        this.url = redactUrl(options.url);
        // The assembled target the transport wrote, query included: it tells two pages apart.
        this.#resolvedUrl = typeof options.resolvedUrl === 'string' ? options.resolvedUrl : (options.url ?? '');
        /**
         * The unfilled path template, named by default-safe output in place of `url`.
         * @readonly @type {string | null}
         */
        this.endpoint = pathTemplateOf(options.endpoint);
        /** @readonly @type {Readonly<Record<string, unknown>>} */
        this.queryParams = /** @type {Record<string, unknown>} */ (redactQueryParams(options.queryParams));
        /** @readonly @type {unknown} */
        this.body = redactValue(options.body ?? null);
        /** @readonly @type {Readonly<Record<string, string>>} */
        this.headers = /** @type {Record<string, string>} */ (redactMapping(options.headers));
        /** @readonly @type {number} */
        this.attemptCount = options.attemptCount ?? 1;
        /** @readonly @type {number} */
        this.maxAttempts = options.maxAttempts ?? 1;
        /** @readonly @type {number} */
        this.elapsedSeconds = options.elapsedSeconds ?? 0.0;
        // Assigned above so the types land on the class, then withheld from default traversal here, before the freeze.
        for (const name of WITHHELD_FIELDS) {
            Object.defineProperty(this, name, {value: this[name], enumerable: false, writable: false});
        }
        Object.freeze(this);
    }

    /**
     * The structural view every default rendering uses: the call, not its values.
     * @returns {Record<string, unknown>}
     */
    toJSON() {
        return {
            clientName: this.clientName,
            apiVersion: this.apiVersion,
            httpMethod: this.httpMethod,
            endpoint: this.endpoint,
            attemptCount: this.attemptCount,
            maxAttempts: this.maxAttempts,
            elapsedSeconds: this.elapsedSeconds,
            withheld: [...WITHHELD_FIELDS],
        };
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return `RequestInfo ${JSON.stringify(this.toJSON())}`;
    }

    /**
     * The unredacted resolved URL held on `info`, or `''`; a static method, since a getter would be traversed.
     * @param {unknown} info @returns {string}
     */
    static resolvedUrlOf(info) {
        return info instanceof RequestInfo ? info.#resolvedUrl : '';
    }
}

/**
 * The unredacted resolved URL of a {@link RequestInfo}, for the pagination walk. Not safe to log.
 * @param {unknown} info @returns {string}
 */
export function resolvedRequestUrl(info) {
    return RequestInfo.resolvedUrlOf(info);
}

/**
 * One HTTP exchange: what was sent, what came back.
 * @template [TDto=any]
 */
export class ApiResponse {
    #map;
    #bodyText;
    #dtoType;
    /** The built view, and whether it has been built — `null` is a valid built value. */
    #dto = null;
    #dtoBuilt = false;

    /** The view `responseFormat` selects, installed as an own enumerable accessor. @type {unknown} */
    data;

    /**
     * @param {{
     *   statusCode: number, data: unknown, headers: Record<string, string>,
     *   contentType?: string | null, requestInfo?: RequestInfo | null, errorType?: string,
     *   bodyText?: string | null, responseFormat?: string,
     *   dtoType?: {fromMap: (body: unknown) => TDto} | null,
     * }} options `bodyText` is the body as received; `dtoType` the shape `dto` builds
     */
    constructor(options) {
        /** @readonly @type {number} */
        this.statusCode = options.statusCode;
        this.#map = options.data;
        this.#bodyText = options.bodyText ?? null;
        this.#dtoType = options.dtoType ?? null;
        /** @type {string} which form `data` presents; `map`, `json` and `dto` ignore it */
        this.responseFormat = options.responseFormat ?? DEFAULT_RESPONSE_FORMAT;
        // Copied and frozen: a caller holding the original could otherwise change this record.
        /** @readonly @type {Readonly<Record<string, string>>} */
        this.headers = Object.freeze({...(options.headers || {})});
        /** `null` for a `204`, and for a backend that reported no content type. @readonly @type {string | null} */
        this.contentType = options.contentType ?? null;
        /** `null` on a response built without one. @readonly @type {RequestInfo | null} */
        this.requestInfo = options.requestInfo ?? null;
        let errorType = options.errorType ?? ErrorType.NONE;
        if (!ERROR_TYPE_VALUES.has(/** @type {any} */ (errorType))) {
            throw new SdkUsageError(
                `unknown error_type ${JSON.stringify(errorType)}; expected one of: ${[...ERROR_TYPE_VALUES].join(', ')}`,
            );
        }
        // Keyed on the decoded body, never `data`: `succeeded` cannot depend on the form asked.
        const denied = bodyDeniesSuccess(this.#map);
        if (errorType === ErrorType.NONE && (!(this.statusCode >= 200 && this.statusCode < 300) || denied)) {
            errorType = classifyErrorType(this.statusCode, denied);
        }
        /** @readonly @type {string} */
        this.errorType = /** @type {string} */ (errorType);

        // An unsupported form reads `null`; own and enumerable, because `JSON.stringify` and spread skip getters.
        Object.defineProperty(this, 'data', {
            get: () => {
                if (this.responseFormat === ResponseFormat.JSON) return this.#bodyText;
                if (this.responseFormat === ResponseFormat.DTO) return this.dto;
                return this.#map;
            },
            enumerable: true,
            configurable: false,
        });

        Object.freeze(this);
    }

    /**
     * The decoded body: an object or array for JSON, `Uint8Array` for a download, `null` for 204.
     * @returns {unknown}
     */
    get map() {
        return this.#map;
    }

    /** The text `map` was decoded from, in the server's key order; `null` when not text. @returns {string | null} */
    get json() {
        return this.#bodyText;
    }

    /**
     * The typed view over this body; `null` if the body is not a record or no type is declared.
     * @returns {TDto | null}
     */
    get dto() {
        if (!this.#dtoBuilt) {
            this.#dtoBuilt = true;
            this.#dto = this.#dtoType && isDtoMapping(this.#map) ? this.#dtoType.fromMap(this.#map) : null;
        }
        return this.#dto;
    }

    /**
     * `true` for a 2xx whose body does not set `isSuccess` false.
     * @returns {boolean}
     */
    get succeeded() {
        return this.statusCode >= 200 && this.statusCode < 300 && !bodyDeniesSuccess(this.#map);
    }

    /** Human-readable messages from the body, most specific first; empty when it carries none. @returns {string[]} */
    getErrorMessages() {
        let body = this.#map;
        if (!isPlainRecord(body)) body = parseJsonBody(body);
        if (body == null) return [];
        const map = /** @type {Record<string, unknown>} */ (body);

        let messages = readErrorEntries(map.errors);
        if (!messages.length) messages = readMessageValue(map.message);
        if (!messages.length) messages = readMessageValue(map.error);
        if (!messages.length) messages = readMessageValue(map.errorCode);
        if (!messages.length) messages = readMessageValue(map.detail);
        if (!messages.length) messages = readMessageValue(map.title);
        return capMessages(messages);
    }

    /**
     * Throw an `SdkError` when the call failed, otherwise answer the response so it chains.
     * @returns {ApiResponse<TDto>}
     */
    raiseForStatus() {
        if (this.succeeded) return this;
        const messages = this.getErrorMessages();
        // Structural, never `messages[0]`: an uncaught error prints this, and the store's text names the record.
        const summary = messages.length
            ? `HTTP ${this.statusCode} with ${messages.length} reported message(s); read getErrorMessages() for the store's own text`
            : `HTTP ${this.statusCode} with no reported message`;
        const ErrorClass = this.statusCode === 401 || this.statusCode === 403 ? SdkAuthError : SdkError;
        const error = new ErrorClass(summary, {
            statusCode: this.statusCode,
            errorType: this.errorType,
            rawResponse: redactValue(this.#map),
            responseHeaders: redactMapping(this.headers),
            requestInfo: this.requestInfo,
        });
        for (const message of messages) error.addError(message);
        throw error;
    }
}

/** Whether a decoded body denies success: only a present-but-falsy `isSuccess`, not `'false'`. */
function bodyDeniesSuccess(data) {
    if (!isPlainRecord(data)) return false;
    const body = /** @type {Record<string, unknown>} */ (data);
    return Object.hasOwn(body, SUCCESS_FLAG) && !isTruthy(body[SUCCESS_FLAG]);
}

/**
 * JSON truthiness, spelled out because `if (value)` calls an empty array truthy.
 * @param {unknown} value @returns {boolean}
 */
function isTruthy(value) {
    if (value == null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'bigint') return value !== 0n;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof Map || value instanceof Set) return value.size > 0;
    if (isPlainRecord(value)) return Object.keys(value).length > 0;
    return true;
}

function parseJsonBody(data) {
    let text = data;
    if (text instanceof Uint8Array) {
        try {
            text = new TextDecoder('utf-8', {fatal: true}).decode(text);
        } catch {
            return null;
        }
    }
    if (typeof text !== 'string') return null;
    const trimmed = text.trim().replace(/^﻿/, '').trim();
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return null;
    let parsed;
    try {
        parsed = JSON.parse(trimmed);
    } catch {
        return null;
    }
    return isPlainRecord(parsed) ? parsed : null;
}

function readMessageValue(value, depth = 0) {
    if (value == null || depth > MAX_MESSAGE_DEPTH) return [];
    if (typeof value === 'string') return value.trim() ? [value] : [];
    if (isPlainRecord(value)) {
        const map = /** @type {Record<string, unknown>} */ (value);
        const text = map.message != null ? map.message : map.code;
        return readMessageValue(text, depth + 1);
    }
    if (Array.isArray(value)) {
        const messages = [];
        for (const item of value) messages.push(...readMessageValue(item, depth + 1));
        return messages;
    }
    const text = String(value);
    return text.trim() ? [text] : [];
}

function readErrorEntries(entries) {
    if (isPlainRecord(entries)) {
        const messages = [];
        for (const [fieldName, value] of Object.entries(/** @type {Record<string, unknown>} */ (entries))) {
            messages.push(...prefixField(fieldName, readMessageValue(value)));
        }
        return messages;
    }
    if (Array.isArray(entries)) {
        const messages = [];
        for (const entry of entries) {
            if (isPlainRecord(entry)) {
                const map = /** @type {Record<string, unknown>} */ (entry);
                const text = map.message != null ? map.message : map.code;
                messages.push(...prefixField(map.field, readMessageValue(text)));
            } else {
                messages.push(...readMessageValue(entry));
            }
        }
        return messages;
    }
    if (typeof entries === 'string') return readMessageValue(entries);
    return [];
}

function prefixField(fieldName, messages) {
    if (fieldName == null || !String(fieldName).trim()) return messages;
    return messages.map((message) => `${fieldName}: ${message}`);
}

function capMessages(messages) {
    if (messages.length <= MAX_REPORTED_MESSAGES) return messages;
    const remainder = messages.length - MAX_REPORTED_MESSAGES;
    return [...messages.slice(0, MAX_REPORTED_MESSAGES), `+${remainder} more problems`];
}
