import {SdkError, SdkUsageError, describeCause} from '../errors.js';
import {
    DEFAULT_MAX_MULTIPART_OVERHEAD_BYTES,
    DEFAULT_MAX_REQUEST_BYTES,
    DEFAULT_MAX_RESPONSE_BYTES,
    DEFAULT_MAX_UPLOAD_BYTES,
    DEFAULT_TIMEOUT_SECONDS,
    unsendableHeaderReason,
} from '../config/sdkConfig.js';
import {RetryPolicy, TRANSPORT_ERROR_KINDS} from './retryPolicy.js';
import {requireHttpMethod} from './httpMethod.js';
import {
    MULTIPART_CLOSING_BYTES,
    TLS_ERROR_CODES,
    createNodeFetch,
    encodeMultipartParts,
    multipartFramingBytes,
} from './nodeFetch.js';
import {ErrorType, pathTemplateOf} from '../client/apiResponse.js';
import {refuseUnsendableUrl} from './urlBuilder.js';

const JSON_CONTENT_TYPE = 'application/json';
const TEXT_CONTENT_TYPE_PREFIX = 'text/';
const UNKNOWN_PARAMETER_ERROR = 'unknown_parameter';
const RESENDABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const PARAMETER_NAME_PATTERN = /[A-Za-z0-9_-]+/;
/** Bytes that forge a part header; prototype-less, so `'constructor'` is no match. @type {Record<string, string>} */
const FORGEABLE_PART_BYTES = Object.assign(Object.create(null), {
    '\r': 'a carriage return',
    '\n': 'a newline',
    '\u0000': 'a NUL',
});
/** Header bytes are octets, so they are read back one byte per character. */
const LATIN1_DECODER = new TextDecoder('latin1');

const DEFAULT_PREPARE_TIMEOUT_MS = DEFAULT_TIMEOUT_SECONDS * 1000;

function overCeiling(label, maxBytes, setting, advice) {
    return new SdkUsageError(
        `${label}: over the ${maxBytes}-byte ${setting} ceiling, so the request was not built — ${advice}`,
    );
}

const UPLOAD_ADVICE =
    'this SDK reads an upload into memory to build the body, so the source material is what it has to hold; ' +
    'raise maxUploadBytes on the client, or split the payload across several calls';
const REQUEST_ADVICE =
    'this is the encoded body that would cross the wire, framing included; raise maxRequestBytes on the client, ' +
    'or split the payload across several calls';
const FRAMING_ADVICE =
    'delimiters, part headers and encoded names are counted apart from the content, because a payload of many ' +
    'small parts is mostly framing; raise maxMultipartOverheadBytes on the client, or send fewer parts';

function preparationTimedOut(timeoutMs) {
    return Object.assign(
        new SdkError(`the request body could not be built within ${timeoutMs}ms`, {
            errorType: ErrorType.TIMEOUT,
            rawResponse: null,
        }),
        {kind: TRANSPORT_ERROR_KINDS.READ_TIMEOUT},
    );
}

/**
 * A running total against one ceiling, shared across a request so the limit is an aggregate.
 * @param {number} limit @returns {{limit: number, remaining: number, take: (bytes: number, label: string, setting: string, advice: string) => void}}
 */
function byteBudget(limit) {
    let used = 0;
    return {
        limit,
        get remaining() {
            return Math.max(0, limit - used);
        },
        take(bytes, label, setting, advice) {
            used += bytes;
            if (used > limit) throw overCeiling(label, limit, setting, advice);
        },
    };
}

/**
 * One deadline over a request's preparation, able to interrupt a blocked producer.
 * @param {number} timeoutMs @returns {{race: <T>(promise: Promise<T>) => Promise<T>, close: () => void}}
 */
function preparationDeadline(timeoutMs) {
    /** @type {any} */
    let timer = null;
    const expiry = new Promise((_resolve, reject) => {
        timer = setTimeout(() => reject(preparationTimedOut(timeoutMs)), timeoutMs);
    });
    // An unhandled rejection kills the process.
    expiry.catch(() => {});
    return {
        race: (promise) => {
            promise.catch(() => {});
            return /** @type {any} */ (Promise.race([promise, expiry]));
        },
        close: () => {
            if (timer !== null) clearTimeout(timer);
            timer = null;
        },
    };
}

/** The ceilings and preparation deadline one config implies. @param {any} config @returns {RequestCeilings} */
export function requestCeilings(config) {
    const timeoutSeconds = config?.timeoutSeconds;
    return {
        maxUploadBytes: config?.maxUploadBytes,
        maxRequestBytes: config?.maxRequestBytes,
        maxMultipartOverheadBytes: config?.maxMultipartOverheadBytes,
        prepareTimeoutMs: Number.isFinite(timeoutSeconds) ? timeoutSeconds * 1000 : undefined,
    };
}

/**
 * The ceilings a caller may set on one request's preparation; an omitted value falls back.
 * @typedef {object} RequestCeilings
 * @property {number} [maxUploadBytes] ceiling on the source material, and on the in-memory spool
 * @property {number} [maxRequestBytes] ceiling on the encoded body that crosses the wire
 * @property {number} [maxMultipartOverheadBytes] ceiling on multipart framing and part headers
 * @property {number} [prepareTimeoutMs] deadline over the whole of building the body
 */

function positiveOr(supplied, fallback) {
    return Number.isFinite(supplied) && /** @type {number} */ (supplied) > 0
        ? /** @type {number} */ (supplied)
        : fallback;
}

function resolveCeilings(options = {}) {
    return {
        maxUploadBytes: positiveOr(options.maxUploadBytes, DEFAULT_MAX_UPLOAD_BYTES),
        maxRequestBytes: positiveOr(options.maxRequestBytes, DEFAULT_MAX_REQUEST_BYTES),
        maxMultipartOverheadBytes: positiveOr(options.maxMultipartOverheadBytes, DEFAULT_MAX_MULTIPART_OVERHEAD_BYTES),
        prepareTimeoutMs: positiveOr(options.prepareTimeoutMs, DEFAULT_PREPARE_TIMEOUT_MS),
    };
}

/** @param {unknown} value @returns {string | null} null when the value is neither text nor bytes */
export function headerValueText(value) {
    if (typeof value === 'string') return value;
    if (value instanceof Uint8Array) return LATIN1_DECODER.decode(value);
    return null;
}

/** The headers as the wire will carry them; anything but text or bytes is refused, not coerced. */
function sendableHeaders(headers) {
    // Prototype-less while filled, so `__proto__` is recorded as a header; restored because fetch spreads it.
    /** @type {Record<string, string>} */
    const sendable = Object.create(null);
    for (const [name, value] of Object.entries(headers || {})) {
        const valueText = headerValueText(value);
        const unsendable = unsendableHeaderReason(name, valueText);
        if (unsendable !== null) throw new SdkUsageError(unsendable);
        sendable[name] = /** @type {string} */ (valueText);
    }
    return Object.setPrototypeOf(sendable, Object.prototype);
}

/** Why a value cannot go into a multipart part header (CR/LF would forge one), or `null`; never echoes it. */
function multipartLabelProblem(what, value) {
    const text = typeof value === 'string' ? value : String(value ?? '');
    for (let index = 0; index < text.length; index += 1) {
        const named = FORGEABLE_PART_BYTES[text[index]];
        if (named === undefined) continue;
        // The byte offset, not the character index: a part header is written in bytes.
        const offset = new TextEncoder().encode(text.slice(0, index)).length;
        return (
            `files: ${what} carries ${named} at byte ${offset}, which would forge a header on the multipart part ` +
            'this SDK sends. The value is not shown: it may be attacker-chosen. Strip CR, LF and NUL from an ' +
            'upload filename before passing it on'
        );
    }
    return null;
}

/**
 * Refuse labels that would forge a multipart part header.
 * @param {unknown} files @param {unknown} formData @returns {void}
 */
export function refuseUnsendableMultipartLabels(files, formData) {
    if (!files) return;
    for (const [key, entry] of pairsOf(files)) {
        const field = String(key);
        const problems = [[`a files part name of ${field.length} character(s)`, field]];
        if (Array.isArray(entry) && entry.length > 1) {
            if (entry[0] != null) problems.push([`the filename on part '${field}'`, String(entry[0])]);
            if (typeof entry[2] === 'string' && entry[2]) {
                problems.push([`the content type on part '${field}'`, entry[2]]);
            }
        } else {
            problems.push([`the filename on part '${field}'`, field]);
        }
        for (const [what, value] of problems) {
            const problem = multipartLabelProblem(what, value);
            if (problem !== null) throw new SdkUsageError(problem);
        }
    }
    for (const [key] of pairsOf(formData)) {
        const name = String(key);
        const problem = multipartLabelProblem(`a formData name of ${name.length} character(s)`, name);
        if (problem !== null) throw new SdkUsageError(problem);
    }
}

/** Whether a value is a Node stream, which can only be sent once. @param {unknown} value */
function isNodeStream(value) {
    return (
        Boolean(value) &&
        typeof value === 'object' &&
        (typeof (/** @type {any} */ (value).pipe) === 'function' ||
            typeof (/** @type {any} */ (value).read) === 'function')
    );
}

/** Whether a value can only be read once — true for a generator, false for a Buffer. @param {unknown} value */
export function isOneShotContainer(value) {
    if (value == null) return false;
    if (typeof value === 'string') return false;
    if (Array.isArray(value)) return false;
    if (value instanceof Map) return false;
    if (ArrayBuffer.isView(value)) return false;
    if (isNodeStream(value)) return false;
    if (typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) return false;
    return typeof (/** @type {any} */ (value)[Symbol.iterator]) === 'function';
}

/** @param {unknown} files @param {unknown} formData @returns {[unknown, unknown]} */
export function materialisePayload(files, formData) {
    if (isOneShotContainer(files)) files = [.../** @type {Iterable<unknown>} */ (files)];
    if (isOneShotContainer(formData)) formData = [.../** @type {Iterable<unknown>} */ (formData)];
    return [files, formData];
}

/**
 * A private, immutable copy of one call's query parameters, read once before the first await.
 * @param {Record<string, unknown> | null | undefined} params @returns {Record<string, string | string[]> | null}
 */
export function snapshotQueryParams(params) {
    if (params == null) return null;
    /** @type {Record<string, string | string[]>} */
    const snapshot = Object.create(null);
    for (const [name, value] of Object.entries(params)) {
        snapshot[String(name)] = Array.isArray(value)
            ? /** @type {string[]} */ (Object.freeze(value.map((item) => String(item))))
            : String(value);
    }
    Object.setPrototypeOf(snapshot, Object.prototype);
    return Object.freeze(snapshot);
}

function refuseLoneContainer(container, label, advice) {
    if (
        typeof container !== 'object' ||
        isNodeStream(container) ||
        ArrayBuffer.isView(container) ||
        container instanceof ArrayBuffer ||
        container instanceof Blob
    ) {
        throw new SdkUsageError(
            `${label}: expected an object of field name to value, a Map, or an array of (name, value) pairs — ${advice}`,
        );
    }
}

/**
 * A private, immutable snapshot of one payload, every label converted to text once.
 * @param {unknown} files @param {unknown} formData
 * @returns {[Array<[string, unknown]> | null, Array<[string, string]> | null]}
 */
export function snapshotPayload(files, formData) {
    const [oneShotFiles, oneShotFormData] = materialisePayload(files, formData);
    return [snapshotFiles(oneShotFiles), snapshotFormData(oneShotFormData)];
}

function snapshotFiles(files) {
    if (files == null) return null;
    refuseLoneContainer(files, 'files', 'a lone handle or a lone buffer carries no field name to send it under');
    /** @type {Array<[string, unknown]>} */
    const snapshot = [];
    for (const [key, entry] of pairsOf(files)) {
        const name = String(key);
        snapshot.push(/** @type {[string, unknown]} */ (Object.freeze([name, snapshotFilesEntry(name, entry)])));
    }
    return /** @type {Array<[string, unknown]>} */ (Object.freeze(snapshot));
}

function snapshotFilesEntry(name, entry) {
    if (!Array.isArray(entry) || entry.length <= 1) return snapshotUploadValue(entry);
    refuseOverlongFilesTuple(name, entry);
    return Object.freeze([
        entry[0] == null ? null : String(entry[0]),
        snapshotUploadValue(entry[1]),
        typeof entry[2] === 'string' && entry[2] ? entry[2] : null,
    ]);
}

function refuseOverlongFilesTuple(name, entry) {
    if (entry.length <= 3) return;
    throw new SdkUsageError(
        `files[${JSON.stringify(name)}]: a (filename, value, contentType?) tuple has at most three slots, got ` +
            `${entry.length}. This SDK writes Content-Disposition and Content-Type on a part and no other header, ` +
            'so a fourth value would go nowhere',
    );
}

/**
 * Upload bytes this module allocated and never exposed, so {@link partContent} can skip a second copy.
 * @type {WeakSet<object>}
 */
const sdkOwnedPayloadBytes = new WeakSet();

/** One upload value with its bytes copied into private storage before the call's first await. */
function snapshotUploadValue(value) {
    if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
        const owned = ownedChunkBytes(value);
        sdkOwnedPayloadBytes.add(owned);
        return owned;
    }
    return value;
}

/** The `formData` half of {@link snapshotPayload}; bytes, a stream or a `Blob` is refused, not sent as text. */
function snapshotFormData(formData) {
    if (formData == null) return null;
    refuseLoneContainer(formData, 'formData', 'a lone value carries no field name to send it under');
    /** @type {Array<[string, string]>} */
    const snapshot = [];
    for (const [key, value] of pairsOf(formData)) {
        const name = String(key);
        if (isNodeStream(value) || ArrayBuffer.isView(value) || value instanceof ArrayBuffer || value instanceof Blob) {
            throw new SdkUsageError(
                `formData[${JSON.stringify(name)}]: a form field is sent as text, so a stream, a buffer or a Blob ` +
                    'here would go out as its toString rather than its bytes — pass it under files to send it as an ' +
                    'upload',
            );
        }
        snapshot.push(/** @type {[string, string]} */ (Object.freeze([name, String(value)])));
    }
    return /** @type {Array<[string, string]>} */ (Object.freeze(snapshot));
}

function filesEntryStream(entry) {
    if (Array.isArray(entry) && entry.length > 1) return filesEntryStream(entry[1]);
    return entry;
}

/** Unwrap one payload container to the objects a request would read; an unknown shape counts as one. */
function containerStreams(payload) {
    if (payload == null) return [];
    if (payload instanceof Map) return [...payload.values()].map(filesEntryStream);
    if (Array.isArray(payload)) return payload.map(filesEntryStream);
    if (isOneShotContainer(payload)) return [payload];
    if (typeof payload === 'object' && !ArrayBuffer.isView(payload) && !isNodeStream(payload)) {
        return Object.values(payload).map(filesEntryStream);
    }
    return [payload];
}

function payloadStreams(payload) {
    return containerStreams(payload).filter((candidate) => isNodeStream(candidate));
}

/**
 * Replace every stream in a payload with the bytes it holds, so it is drained exactly once.
 * @param {unknown} files @param {unknown} formData @param {RequestCeilings} [options]
 * @returns {Promise<[unknown, unknown]>}
 */
export async function bufferPayloadStreams(files, formData, options = {}) {
    const ceilings = resolveCeilings(options);
    const budget = byteBudget(ceilings.maxUploadBytes);
    const deadline = preparationDeadline(ceilings.prepareTimeoutMs);
    try {
        return [
            await bufferContainerStreams(files, 'files', budget, deadline),
            await bufferContainerStreams(formData, 'formData', budget, deadline),
        ];
    } finally {
        deadline.close();
    }
}

/** One payload container with its streams read into bytes; an unknown shape is untouched. */
async function bufferContainerStreams(payload, label, budget, deadline) {
    if (payload == null || !payloadStreams(payload).length) return payload;
    if (payload instanceof Map) {
        /** @type {Map<unknown, unknown>} */
        const buffered = new Map();
        for (const [key, entry] of payload) {
            buffered.set(key, await bufferEntryStream(entry, String(key), budget, deadline));
        }
        return buffered;
    }
    if (Array.isArray(payload)) {
        const buffered = [];
        for (const entry of payload) {
            buffered.push(
                Array.isArray(entry) && entry.length > 1
                    ? [
                          entry[0],
                          await bufferEntryStream(entry[1], String(entry[0]), budget, deadline),
                          ...entry.slice(2),
                      ]
                    : await bufferEntryStream(entry, label, budget, deadline),
            );
        }
        return buffered;
    }
    if (typeof payload === 'object' && !ArrayBuffer.isView(payload) && !isNodeStream(payload)) {
        /** @type {Record<string, unknown>} */
        const buffered = {};
        for (const [key, entry] of Object.entries(payload)) {
            buffered[key] = await bufferEntryStream(entry, key, budget, deadline);
        }
        return buffered;
    }
    return payload;
}

async function bufferEntryStream(entry, key, budget, deadline) {
    if (Array.isArray(entry) && entry.length > 1) {
        return [entry[0], await bufferEntryStream(entry[1], key, budget, deadline), ...entry.slice(2)];
    }
    if (isNodeStream(entry)) return readStreamBytes(key, entry, budget, deadline);
    return entry;
}

/** The field names in the body's `errors`. */
function extractErrorFields(body) {
    /** @type {Set<string>} */
    const fields = new Set();
    const entries = body.errors;
    if (Array.isArray(entries)) {
        for (const entry of entries) {
            if (entry && typeof entry === 'object' && /** @type {any} */ (entry).field) {
                fields.add(
                    String(/** @type {any} */ (entry).field)
                        .trim()
                        .toLowerCase(),
                );
            }
        }
    } else if (entries && typeof entries === 'object' && !ArrayBuffer.isView(entries)) {
        for (const fieldName of Object.keys(entries)) {
            const name = String(fieldName).trim().toLowerCase();
            if (name) fields.add(name);
        }
    }
    return fields;
}

/** The names listed in an `unknown query parameter(s): a, b` message, the one stable wording. */
function parseUnknownParameterMessage(body) {
    /** @type {Set<string>} */
    const fields = new Set();
    const message = String(body.message || '');
    const marker = 'unknown query parameter(s):';
    const idx = message.indexOf(marker);
    if (idx >= 0) {
        for (const listed of message.slice(idx + marker.length).split(',')) {
            const named = PARAMETER_NAME_PATTERN.exec(listed);
            if (named) fields.add(named[0].toLowerCase());
        }
    }
    return fields;
}

/** Whether a `Content-Type` names JSON, `+json` suffixes included, parameters cut first. */
function isJsonContentType(contentType) {
    const mediaType = mediaTypeOf(contentType);
    return mediaType === JSON_CONTENT_TYPE || mediaType.endsWith('+json');
}

function responseBodyChunks(response) {
    const body = /** @type {any} */ (response).body;
    if (!body) return null;
    if (typeof body.getReader === 'function') return readableStreamChunks(body);
    if (typeof body[Symbol.asyncIterator] === 'function') return body;
    return null;
}

/** A web `ReadableStream` as an async iterable, cancelled if the consumer stops early. */
async function* readableStreamChunks(body) {
    const reader = body.getReader();
    try {
        for (;;) {
            const {done, value} = await reader.read();
            if (done) return;
            yield value;
        }
    } finally {
        await reader.cancel();
    }
}

function responseOverCap(limitBytes, call = null) {
    const subject =
        call && call.method && call.endpoint ? `${call.method} ${call.endpoint} answered with` : 'the response carried';
    return Object.assign(
        new SdkError(
            `${subject} a body over the ${limitBytes}-byte maxResponseBytes cap, so it was not buffered — raise ` +
                'maxResponseBytes on the client if a body this large is expected',
            {
                errorType: ErrorType.UNKNOWN,
                rawResponse: null,
                requestInfo: (call && call.requestInfo) || null,
            },
        ),
        {kind: TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE, limitBytes},
    );
}

/** Read a response body chunk by chunk, refusing one over `limitBytes`. */
async function readCappedBody(response, limitBytes) {
    const chunks = responseBodyChunks(response);
    if (!chunks) {
        const whole = new Uint8Array(await response.arrayBuffer());
        if (whole.byteLength > limitBytes) throw responseOverCap(limitBytes);
        return whole;
    }
    /** @type {Uint8Array[]} */
    const collected = [];
    let total = 0;
    for await (const chunk of chunks) {
        const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
        total += bytes.byteLength;
        if (total > limitBytes) {
            // Dropped before the refusal leaves, so a cap-sized list is not held while it propagates.
            collected.length = 0;
            throw responseOverCap(limitBytes);
        }
        collected.push(bytes);
    }
    // A single chunk is returned as is: joining would allocate a second cap-sized array.
    if (collected.length === 1) return collected[0];
    return joinBytes(collected, total);
}

function joinBytes(chunks, total) {
    const joined = new Uint8Array(total);
    let at = 0;
    for (const chunk of chunks) {
        joined.set(chunk, at);
        at += chunk.byteLength;
    }
    return joined;
}

/**
 * Decode by Content-Type: 204 or empty is `null`, JSON an object, `text/*` a string, anything else bytes.
 * @param {Response} response @param {number} [maxBytes] @returns {Promise<unknown>}
 */
export async function decodeResponseBody(response, maxBytes = DEFAULT_MAX_RESPONSE_BYTES) {
    return (await decodeResponseParts(response, maxBytes)).data;
}

/**
 * The same decode, plus the body text it came from; `bodyText` is `null` for a `204`, empty or binary body.
 * @param {Response} response @param {number} [maxBytes] @returns {Promise<{data: unknown, bodyText: string | null}>}
 */
export async function decodeResponseParts(response, maxBytes = DEFAULT_MAX_RESPONSE_BYTES) {
    if (response.status === 204) return {data: null, bodyText: null};
    const buffer = await readCappedBody(response, maxBytes);
    if (buffer.byteLength === 0) return {data: null, bodyText: null};
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (isJsonContentType(contentType)) {
        const text = new TextDecoder('utf-8').decode(buffer);
        try {
            return {data: JSON.parse(text.replace(/^﻿/, '')), bodyText: text};
        } catch {
            return {data: text, bodyText: text};
        }
    }
    if (contentType.startsWith(TEXT_CONTENT_TYPE_PREFIX)) {
        const text = new TextDecoder('utf-8').decode(buffer);
        return {data: text, bodyText: text};
    }
    return {data: buffer, bodyText: null};
}

/** Release a body the retry loop abandons: an unread body keeps its socket checked out of the pool. */
async function releaseResponseBody(response) {
    try {
        if (response.bodyUsed) return;
        const body = /** @type {any} */ (response).body;
        if (body && typeof body.cancel === 'function') {
            await body.cancel();
            return;
        }
        if (body && typeof body.destroy === 'function') {
            body.destroy();
            return;
        }
        if (typeof response.arrayBuffer === 'function') await response.arrayBuffer();
    } catch {
        // The body was already gone, or the backend refuses to release it; the retry proceeds.
    }
}

/** The errno codes that mean nothing was delivered; read only for an untagged failure. */
const NOT_DELIVERED_ERROR_CODES = new Set([
    'ENOTFOUND',
    'EAI_AGAIN',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'EADDRNOTAVAIL',
    'EACCES',
]);

/**
 * Sort a network failure into a retry `kind`. An unknown code is `CONNECTION_RESET`, not `CONNECTION`:
 * a write is replayed only for a failure that certainly did not arrive.
 */
function classifyTransportError(error) {
    if (error && error.kind) return error.kind;
    const code = String((error && (error.cause?.code || error.code)) || '');
    if (TLS_ERROR_CODES.test(code)) return TRANSPORT_ERROR_KINDS.SSL;
    if (error && error.name === 'AbortError') return TRANSPORT_ERROR_KINDS.TIMEOUT;
    if (NOT_DELIVERED_ERROR_CODES.has(code)) return TRANSPORT_ERROR_KINDS.CONNECTION;
    return TRANSPORT_ERROR_KINDS.CONNECTION_RESET;
}

/** Wrap a thrown string or null: assigning `.kind` to one raises a `TypeError` over the real failure. */
function taggable(raised) {
    if (raised !== null && (typeof raised === 'object' || typeof raised === 'function')) return raised;
    return new Error(`the transport backend rejected with a ${typeof raised} rather than an error`, {cause: raised});
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Sends HTTP requests and decodes responses. One fetch backend per instance. */
export class Transport {
    /** @param {any} config @param {{ retryPolicy?: RetryPolicy, onProgress?: (m: string) => void, fetchImpl?: typeof fetch }} [options] */
    constructor(config, options = {}) {
        /** @private */
        this._config = config;
        // Snapshotted, so the caller cannot change the policy between two attempts of a call.
        /** @private */
        this._retryPolicy = RetryPolicy.snapshotOf(options.retryPolicy, config);
        /** @private */
        this._onProgress = options.onProgress || (() => {});
        if (options.fetchImpl) {
            // Caller-supplied: its lifetime and its transport settings are theirs.
            /** @private */
            this._fetch = options.fetchImpl;
            /** @private */
            this._ownsFetch = false;
        } else {
            this._fetch = createNodeFetch({
                caBundle: config.caBundle,
                verifySsl: config.verifySsl,
                proxyUrl: config.proxyUrl,
                poolMaxsize: config.poolMaxsize,
                connectTimeoutSeconds: config.connectTimeoutSeconds,
                timeoutSeconds: config.timeoutSeconds,
                // Enforced while the backend reads, so it bounds the allocation instead of checking one already made.
                maxResponseBytes: config.maxResponseBytes,
                maxCaBundleBytes: config.maxCaBundleBytes,
            });
            this._ownsFetch = true;
        }
    }

    /**
     * Send one request, retrying per the policy; `body` comes pre-encoded from {@link encodeRequestBody}.
     * @param {{
     *   method: string, url: string, endpoint?: string | null,
     *   params?: Record<string, unknown> | null,
     *   body?: Readonly<{bytes: Uint8Array | null, contentType: string | null}> | null,
     *   jsonBody?: unknown, formData?: unknown, files?: unknown,
     *   headers?: Record<string, string> | null,
     * }} request
     * @returns {Promise<{ statusCode: number, data: unknown, bodyText: string | null, headers: Record<string, string>, contentType: string | null, resolvedUrl: string, attemptCount: number, maxAttempts: number, elapsedSeconds: number }>}
     */
    async sendHttpRequest(request) {
        // Read and frozen once: a caller can run code during the awaits below, and every attempt sends the same bytes.
        const method = requireHttpMethod(request.method);
        const headers = Object.freeze(sendableHeaders(request.headers));
        const params = snapshotQueryParams(request.params);
        // Checked here too: this class is exported, so a direct caller skips the client's refusals.
        const finalUrl = refuseUnsendableUrl(buildUrlWithParams(request.url, params), 'url');
        // The template, not the resolved path, which carries whatever filled its placeholders.
        const endpoint = pathTemplateOf(request.endpoint);
        const [, readTimeout] = this._config.timeout;
        let wireBody = request.body == null ? null : adoptWireBody(request.body);
        if (wireBody == null) {
            const ceilings = requestCeilings(this._config);
            const [files, formData] = await bufferPayloadStreams(
                ...snapshotPayload(request.files, request.formData),
                ceilings,
            );
            wireBody = await encodeRequestBody(request.jsonBody, formData, files, ceilings);
        }
        refuseContradictoryMultipartType(headers, wireBody);
        const started = performance.now();
        let attempt = 0;
        let requestsSent = 0;
        let staleEchoResent = false;
        /** @type {any} */
        let lastException = null;

        while (attempt < this._retryPolicy.maxAttempts) {
            attempt += 1;
            requestsSent += 1;
            this._onProgress(
                `${method} ${endpoint ?? ''} sending (attempt ${attempt}/${this._retryPolicy.maxAttempts})`,
            );

            /** @type {{ retryDelay: number, status: number } | { response: Response, decoded: {data: unknown, bodyText: string | null} }} */
            let outcome;
            try {
                outcome = await this.#fetchOnce(
                    method,
                    finalUrl,
                    headers,
                    wireBody,
                    readTimeout * 1000,
                    // Inside the ceiling, so a failure mid-body still reaches the retry table.
                    async (response) => {
                        if (
                            attempt < this._retryPolicy.maxAttempts &&
                            this._retryPolicy.shouldRetryStatusCode(response.status, method)
                        ) {
                            const retryDelay = this._retryPolicy.computeBackoffSeconds(attempt, {
                                retryAfterHeader: response.headers.get('retry-after'),
                            });
                            await releaseResponseBody(response);
                            return {retryDelay, status: response.status};
                        }
                        return {
                            response,
                            decoded: await decodeResponseParts(response, this._config.maxResponseBytes),
                        };
                    },
                );
            } catch (raised) {
                // A usage error is not a network failure; wrapping it would hide the fix.
                if (raised instanceof SdkUsageError) throw raised;
                const exception = taggable(raised);
                if (exception.kind === TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE) {
                    throw responseOverCap(exception.limitBytes ?? this._config.maxResponseBytes, {
                        method,
                        endpoint,
                        requestInfo: this.#requestInfo(
                            method,
                            finalUrl,
                            endpoint,
                            requestsSent,
                            this.#grantedAttempts(staleEchoResent),
                            started,
                        ),
                    });
                }
                lastException = exception;
                exception.kind = exception.kind || classifyTransportError(exception);
                if (
                    attempt >= this._retryPolicy.maxAttempts ||
                    !this._retryPolicy.shouldRetryAfterException(exception, method)
                ) {
                    break;
                }
                const delay = this._retryPolicy.computeBackoffSeconds(attempt);
                this._onProgress(
                    `${exception.name || 'error'}; retrying in ${delay.toFixed(1)}s (attempt ${attempt + 1}/${this._retryPolicy.maxAttempts})`,
                );
                await sleep(delay * 1000);
                continue;
            }

            if ('retryDelay' in outcome) {
                this._onProgress(
                    `${outcome.status}; retrying in ${outcome.retryDelay.toFixed(1)}s (attempt ${attempt + 1}/${this._retryPolicy.maxAttempts})`,
                );
                // Outside the ceiling, which bounds an attempt and not the wait between two.
                await sleep(outcome.retryDelay * 1000);
                continue;
            }

            const {response, decoded} = outcome;
            const parts = {
                statusCode: response.status,
                data: decoded.data,
                bodyText: decoded.bodyText,
                headers: Object.fromEntries(response.headers),
                contentType: response.headers.get('content-type'),
                resolvedUrl: finalUrl,
                attemptCount: requestsSent,
                maxAttempts: this.#grantedAttempts(staleEchoResent),
                elapsedSeconds: round4((performance.now() - started) / 1000),
            };

            if (!staleEchoResent && RESENDABLE_METHODS.has(method) && this.#detectStaleParameterEcho(parts, params)) {
                staleEchoResent = true;
                attempt -= 1;
                this.#discardPooledConnections();
                continue;
            }

            return parts;
        }

        throw this.#buildTransportError(
            lastException,
            method,
            finalUrl,
            endpoint,
            requestsSent,
            this.#grantedAttempts(staleEchoResent),
            started,
        );
    }

    /**
     * One whole attempt — request, response and body — under one hard ceiling.
     * @template T @param {string} method @param {string} url @param {Record<string, string>} headers
     * @param {Readonly<{bytes: Uint8Array | null, contentType: string | null}>} wireBody @param {number} timeoutMs
     * @param {(response: Response) => Promise<T>} consume @returns {Promise<T>}
     */
    async #fetchOnce(method, url, headers, wireBody, timeoutMs, consume) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const init = {
                method,
                headers: {...headers},
                redirect: 'manual',
                signal: controller.signal,
            };
            applyWireBody(init, wireBody);
            return await consume(await this._fetch(url, /** @type {any} */ (init)));
        } finally {
            clearTimeout(timer);
        }
    }

    /** Drop pooled connections; an injected `fetchImpl` that cannot is left alone. */
    #discardPooledConnections() {
        const impl = /** @type {any} */ (this._fetch);
        if (typeof impl.discardPooledConnections === 'function') impl.discardPooledConnections();
    }

    #grantedAttempts(staleEchoResent) {
        return this._retryPolicy.maxAttempts + (staleEchoResent ? 1 : 0);
    }

    /** A 400 that names only parameters this request did not send. */
    #detectStaleParameterEcho(parts, params) {
        if (parts.statusCode !== 400 || !parts.data || typeof parts.data !== 'object' || Array.isArray(parts.data))
            return false;
        let namedFields = extractErrorFields(parts.data);
        if (!namedFields.size && parts.data.error === UNKNOWN_PARAMETER_ERROR) {
            namedFields = parseUnknownParameterMessage(parts.data);
        }
        if (!namedFields.size) return false;
        const sent = new Set(Object.keys(params || {}).map((name) => String(name).toLowerCase()));
        // With nothing sent, this would collapse to "any 400 carrying an errors block".
        if (!sent.size) return false;
        for (const field of namedFields) if (sent.has(field)) return false;
        return true;
    }

    #buildTransportError(exception, method, url, endpoint, attempt, maxAttempts, started) {
        const kind = exception && exception.kind;
        const timedOut =
            kind === TRANSPORT_ERROR_KINDS.TIMEOUT ||
            kind === TRANSPORT_ERROR_KINDS.READ_TIMEOUT ||
            kind === TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT;
        const errorType = timedOut ? ErrorType.TIMEOUT : ErrorType.NETWORK;
        const label = timedOut ? 'timed out' : 'failed';
        const message =
            `${method} ${endpoint ?? '<endpoint withheld>'} ${label} after ${attempt} attempt(s): ` +
            `${kind || 'transport failure'} (${describeCause(exception)})`;
        return new SdkError(message, {
            errorType,
            rawResponse: null,
            cause: exception,
            requestInfo: this.#requestInfo(method, url, endpoint, attempt, maxAttempts, started),
        });
    }

    /** The `RequestInfo` for a call with no response; the query is dropped, since `?email=` is not secret-named. */
    #requestInfo(method, url, endpoint, attempt, maxAttempts, started) {
        return {
            clientName: this._config.clientName,
            apiVersion: this._config.apiVersion,
            httpMethod: method,
            url: pathTemplateOf(url) ?? '',
            endpoint,
            queryParams: {},
            headers: {},
            body: null,
            attemptCount: attempt,
            maxAttempts,
            elapsedSeconds: round4((performance.now() - started) / 1000),
        };
    }

    /** Release a fetch backend this transport owns. */
    async closeTransport() {
        if (this._ownsFetch && typeof (/** @type {any} */ (this._fetch).close) === 'function') {
            /** @type {any} */ (this._fetch).close();
        }
    }
}

function buildUrlWithParams(url, params) {
    if (!params || !Object.keys(params).length) return url;
    const usp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) for (const item of value) usp.append(key, String(item));
        else usp.append(key, String(value));
    }
    return url + (url.includes('?') ? '&' : '?') + usp.toString();
}

/**
 * Encode one payload to the bytes that cross the wire, once, as a frozen record whose `bytes` answers a copy.
 * @param {unknown} jsonBody @param {unknown} formData @param {unknown} files @param {RequestCeilings} [options]
 * @returns {Promise<Readonly<{bytes: Uint8Array | null, contentType: string | null}>>}
 */
export async function encodeRequestBody(jsonBody, formData, files, options = {}) {
    const ceilings = resolveCeilings(options);
    if (jsonBody !== undefined && jsonBody !== null) {
        const text = typeof jsonBody === 'string' ? jsonBody : JSON.stringify(jsonBody);
        // Measured before it is encoded, so the refusal costs no second allocation.
        const size = Buffer.byteLength(text, 'utf8');
        if (size > ceilings.maxRequestBytes) {
            throw overCeiling('jsonBody', ceilings.maxRequestBytes, 'maxRequestBytes', REQUEST_ADVICE);
        }
        return frozenWireBody(new TextEncoder().encode(text), JSON_CONTENT_TYPE);
    }
    if (files) {
        // Validated and encoded from one copy, so a stateful `toString` cannot pass validation then forge a header.
        const deadline = preparationDeadline(ceilings.prepareTimeoutMs);
        /** @type {import('./nodeFetch.js').MultipartPart[]} */
        let parts;
        try {
            parts = await materialiseMultipartParts(files, formData, ceilings, deadline);
        } finally {
            deadline.close();
        }
        refuseUnsendableMaterialisedParts(parts);
        const multipart = encodeMultipartParts(parts);
        return frozenWireBody(multipart.bytes, multipart.contentType);
    }
    if (formData) {
        return frozenWireBody(encodeUrlEncoded(formData, ceilings), 'application/x-www-form-urlencoded');
    }
    return frozenWireBody(null, null);
}

/** Write the form fields as `application/x-www-form-urlencoded` under a running `maxRequestBytes` total. */
function encodeUrlEncoded(formData, ceilings) {
    /** @type {string[]} */
    const encoded = [];
    let total = 0;
    let source = 0;
    for (const [key, value] of pairsOf(formData)) {
        const name = String(key);
        const text = String(value);
        source += Buffer.byteLength(name, 'utf8') + Buffer.byteLength(text, 'utf8');
        if (source > ceilings.maxUploadBytes) {
            throw overCeiling(
                `formData[${JSON.stringify(name)}]`,
                ceilings.maxUploadBytes,
                'maxUploadBytes',
                UPLOAD_ADVICE,
            );
        }
        const pair = new URLSearchParams([[name, text]]).toString();
        total += (encoded.length ? 1 : 0) + Buffer.byteLength(pair, 'utf8');
        if (total > ceilings.maxRequestBytes) {
            throw overCeiling(
                `formData[${JSON.stringify(name)}]`,
                ceilings.maxRequestBytes,
                'maxRequestBytes',
                REQUEST_ADVICE,
            );
        }
        encoded.push(pair);
    }
    return new TextEncoder().encode(encoded.join('&'));
}

/**
 * The bytes behind each settled wire body, held here because freezing the record leaves a typed array writable.
 * @type {WeakMap<object, Uint8Array | null>}
 */
const sdkOwnedWireBodies = new WeakMap();

/** One encoded body: a frozen record over private bytes, whose `bytes` accessor answers a copy. */
function frozenWireBody(bytes, contentType) {
    /** @type {any} */
    const body = {};
    Object.defineProperty(body, 'bytes', {
        get: () => (bytes === null ? null : new Uint8Array(bytes)),
        enumerable: true,
    });
    Object.defineProperty(body, 'contentType', {value: contentType, enumerable: true});
    Object.freeze(body);
    sdkOwnedWireBodies.set(body, bytes);
    return body;
}

/**
 * Take ownership of an outside wire body by copying its bytes once, before the first attempt;
 * a body {@link encodeRequestBody} produced passes through uncopied.
 */
function adoptWireBody(body) {
    if (sdkOwnedWireBodies.has(body)) return body;
    // Read once: a caller record may answer `bytes` from a getter of their own.
    const bytes = body.bytes;
    if (bytes == null) return frozenWireBody(null, body.contentType ?? null);
    if (!(bytes instanceof Uint8Array)) {
        throw new SdkUsageError(
            `body.bytes: expected a Uint8Array of already-encoded bytes, got ${typeof bytes}; ` +
                'pass jsonBody, formData or files and let encodeRequestBody settle the bytes',
        );
    }
    return frozenWireBody(new Uint8Array(bytes), body.contentType ?? null);
}

/** Put an encoded body on one attempt's request init; a caller `Content-Type` stands for JSON and urlencoded. */
function applyWireBody(init, body) {
    const bytes = sdkOwnedWireBodies.get(body);
    if (bytes == null) return;
    init.body = bytes;
    if (!body.contentType) return;
    if (isMultipartType(body.contentType)) {
        // Owned, not defaulted: only this value names the boundary the body was written with.
        init.headers['Content-Type'] = body.contentType;
        for (const key of Object.keys(init.headers)) {
            if (key !== 'Content-Type' && key.toLowerCase() === 'content-type') delete init.headers[key];
        }
        return;
    }
    if (!hasHeader(init.headers, 'content-type')) init.headers['Content-Type'] = body.contentType;
}

function isMultipartType(contentType) {
    return mediaTypeOf(contentType).startsWith('multipart/');
}

/** Every `boundary=` parameter of a media type, unquoted, in order; all of them, since two contradict. */
function boundariesOf(contentType) {
    /** @type {string[]} */
    const found = [];
    for (const parameter of contentType.split(';').slice(1)) {
        const eq = parameter.indexOf('=');
        if (eq < 0 || parameter.slice(0, eq).trim().toLowerCase() !== 'boundary') continue;
        found.push(
            parameter
                .slice(eq + 1)
                .trim()
                .replace(/^"(.*)"$/, '$1'),
        );
    }
    return found;
}

function mediaTypeOf(contentType) {
    return contentType.split(';', 1)[0].trim().toLowerCase();
}

/**
 * Refuse, rather than replace, a caller `Content-Type` contradicting a multipart body this SDK encoded;
 * only the exact media type with exactly this body's boundary is accepted.
 */
function refuseContradictoryMultipartType(headers, body) {
    if (!body.contentType || !isMultipartType(body.contentType)) return;
    const supplied = Object.entries(headers).find(([name]) => name.toLowerCase() === 'content-type');
    if (!supplied) return;
    const own = boundariesOf(body.contentType);
    const theirs = boundariesOf(supplied[1]);
    if (
        mediaTypeOf(supplied[1]) === mediaTypeOf(body.contentType) &&
        theirs.length === 1 &&
        own.length === 1 &&
        theirs[0] === own[0]
    ) {
        return;
    }
    throw new SdkUsageError(
        `${supplied[0]}: a multipart body's media type and boundary are chosen by this SDK when the parts are ` +
            'written, so a Content-Type supplied with the call cannot describe it — the header would say one thing ' +
            'and the body another, and the store would find no parts at all. Drop the header and the SDK sends ' +
            `${mediaTypeOf(body.contentType)} with the boundary it used`,
    );
}

function hasHeader(headers, name) {
    return Object.keys(headers).some((key) => key.toLowerCase() === name);
}

/**
 * Read a multipart payload down to {@link MultipartPart} records in one pass, so the label judged is the one
 * written; `maxUploadBytes`, `maxMultipartOverheadBytes` and `maxRequestBytes` are counted per part.
 */
async function materialiseMultipartParts(files, formData, ceilings, deadline) {
    refuseLoneContainer(files, 'files', 'a lone handle or a lone buffer carries no field name to send it under');
    /** @type {import('./nodeFetch.js').MultipartPart[]} */
    const parts = [];
    const content = byteBudget(ceilings.maxUploadBytes);
    const framing = byteBudget(ceilings.maxMultipartOverheadBytes);
    const wire = byteBudget(ceilings.maxRequestBytes);
    // The closing delimiter is written whatever else is, so it is spent before anything else.
    framing.take(MULTIPART_CLOSING_BYTES, 'files', 'maxMultipartOverheadBytes', FRAMING_ADVICE);
    wire.take(MULTIPART_CLOSING_BYTES, 'files', 'maxRequestBytes', REQUEST_ADVICE);
    const take = (part, label) => {
        const size = typeof part.content === 'string' ? Buffer.byteLength(part.content) : part.content.byteLength;
        // Raw labels first: measuring the framing exactly means escaping them, at up to three times their length.
        const labels =
            Buffer.byteLength(part.name) +
            (part.filename === null ? 0 : Buffer.byteLength(part.filename)) +
            (part.contentType ? Buffer.byteLength(part.contentType) : 0);
        if (labels > framing.remaining) {
            throw overCeiling(label, framing.limit, 'maxMultipartOverheadBytes', FRAMING_ADVICE);
        }
        const frame = multipartFramingBytes(part);
        content.take(size, label, 'maxUploadBytes', UPLOAD_ADVICE);
        framing.take(frame, label, 'maxMultipartOverheadBytes', FRAMING_ADVICE);
        wire.take(size + frame, label, 'maxRequestBytes', REQUEST_ADVICE);
        parts.push(part);
    };
    for (const [key, value] of pairsOf(formData)) {
        const name = String(key);
        take({name, filename: null, contentType: null, content: String(value)}, `formData[${JSON.stringify(name)}]`);
    }
    for (const [key, entry] of pairsOf(files)) {
        const name = String(key);
        const label = `files[${JSON.stringify(name)}]`;
        let filename = name;
        let value = entry;
        /** @type {string | null} */
        let contentType = null;
        if (Array.isArray(entry) && entry.length > 1) {
            refuseOverlongFilesTuple(name, entry);
            if (entry[0] != null) filename = String(entry[0]);
            value = entry[1];
            if (typeof entry[2] === 'string' && entry[2]) contentType = entry[2];
        }
        // Whichever ceiling has less left: content under `maxUploadBytes` can still exceed `maxRequestBytes`.
        const bytes = await partContent(name, value, Math.min(content.remaining, wire.remaining), content, deadline);
        if (bytes === null) {
            // A plain scalar under a `files` name: the caller meant an ordinary field.
            take({name, filename: null, contentType: null, content: String(value)}, label);
            continue;
        }
        if (contentType === null && value instanceof Blob && value.type) contentType = value.type;
        take({name, filename, contentType, content: bytes}, label);
    }
    return parts;
}

/**
 * The bytes behind one `files` value, copied into storage this module owns, or `null` for a plain scalar;
 * the copy stops a caller rewriting the array after the boundary was chosen by scanning it.
 */
async function partContent(key, value, maxBytes, budget, deadline) {
    const label = `files[${JSON.stringify(key)}]`;
    if (value instanceof Blob) {
        if (value.size > maxBytes) throw overCeiling(label, budget.limit, 'maxUploadBytes', UPLOAD_ADVICE);
        return new Uint8Array(await value.arrayBuffer());
    }
    if (ArrayBuffer.isView(value)) {
        const view = /** @type {ArrayBufferView} */ (value);
        if (view.byteLength > maxBytes) throw overCeiling(label, budget.limit, 'maxUploadBytes', UPLOAD_ADVICE);
        // Already private after `snapshotPayload`; copying again would hold two of every upload.
        if (sdkOwnedPayloadBytes.has(view)) return /** @type {Uint8Array} */ (view);
        return ownedChunkBytes(view);
    }
    if (value instanceof ArrayBuffer) {
        if (value.byteLength > maxBytes) throw overCeiling(label, budget.limit, 'maxUploadBytes', UPLOAD_ADVICE);
        return ownedChunkBytes(value);
    }
    if (isNodeStream(value)) return readStreamBytes(key, value, budget, deadline);
    if (value === null || value === undefined || typeof value !== 'object') return null;
    throw new SdkUsageError(
        `files[${JSON.stringify(key)}]: expected bytes, a Blob, a readable stream, or a ` +
            '(filename, value, contentType?) tuple around one of those',
    );
}

/** Refuse a materialised part whose labels would forge a header: the pre-grant check, run on the encoded copy. */
function refuseUnsendableMaterialisedParts(parts) {
    for (const part of parts) {
        const problems = [[`a part name of ${part.name.length} character(s)`, part.name]];
        if (part.filename !== null) problems.push([`the filename on part '${part.name}'`, part.filename]);
        if (part.contentType) problems.push([`the content type on part '${part.name}'`, part.contentType]);
        for (const [what, value] of problems) {
            const problem = multipartLabelProblem(what, value);
            if (problem !== null) throw new SdkUsageError(problem);
        }
    }
}

async function readStreamBytes(key, stream, budget, deadline) {
    const label = `files[${JSON.stringify(key)}]`;
    if (typeof stream[Symbol.asyncIterator] !== 'function') {
        throw new SdkUsageError(
            `${label}: a stream that cannot be read — expected an async-iterable ` +
                'readable such as fs.createReadStream(...) or Readable.from(...)',
        );
    }
    const remaining = budget.remaining;
    const iterator = stream[Symbol.asyncIterator]();
    /** @type {Uint8Array[]} */
    const chunks = [];
    let total = 0;
    try {
        for (;;) {
            const step = await deadline.race(iterator.next());
            if (step.done) break;
            // Measured before it is copied, so an over-ceiling chunk is never allocated.
            if (total + chunkByteLength(step.value) > remaining) {
                throw overCeiling(label, budget.limit, 'maxUploadBytes', UPLOAD_ADVICE);
            }
            // Copied on arrival: a Node readable hands on its source's buffers, which a caller could rewrite.
            const bytes = ownedChunkBytes(step.value);
            total += bytes.byteLength;
            chunks.push(bytes);
        }
    } catch (error) {
        // Released before the failure leaves, so nothing read is held while the refusal propagates.
        chunks.length = 0;
        endStream(stream, iterator);
        throw error;
    }
    budget.take(total, label, 'maxUploadBytes', UPLOAD_ADVICE);
    return joinBytes(chunks, total);
}

/** Stop an abandoned stream: `destroy()` reaches a producer blocked in `read`, `return()` a generator. */
function endStream(stream, iterator) {
    if (typeof stream.destroy === 'function') stream.destroy();
    const returned = iterator.return?.();
    if (returned && typeof returned.catch === 'function') returned.catch(() => {});
}

function chunkByteLength(chunk) {
    if (typeof chunk === 'string') return Buffer.byteLength(chunk, 'utf8');
    if (ArrayBuffer.isView(chunk)) return /** @type {ArrayBufferView} */ (chunk).byteLength;
    if (chunk instanceof ArrayBuffer) return chunk.byteLength;
    return /** @type {any} */ (chunk).length;
}

function ownedChunkBytes(chunk) {
    if (typeof chunk === 'string') return new TextEncoder().encode(chunk);
    if (ArrayBuffer.isView(chunk)) {
        const view = /** @type {ArrayBufferView} */ (chunk);
        return new Uint8Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength));
    }
    if (chunk instanceof ArrayBuffer) return new Uint8Array(chunk.slice(0));
    // An array-like: this overload copies, where the `ArrayBuffer` one above aliases.
    return new Uint8Array(/** @type {any} */ (chunk));
}

function pairsOf(container) {
    if (!container) return [];
    if (Array.isArray(container)) return /** @type {Array<[string, unknown]>} */ (container);
    if (container instanceof Map) return [...container.entries()];
    if (typeof container === 'object') return Object.entries(container);
    return [];
}

function round4(n) {
    return Math.round(n * 1e4) / 1e4;
}
