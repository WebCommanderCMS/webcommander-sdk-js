import crypto from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import zlib from 'node:zlib';
import fs from 'node:fs';
import {TRANSPORT_ERROR_KINDS} from './retryPolicy.js';
import {SdkConfigError} from '../errors.js';

const ACCEPT_ENCODING = 'gzip, deflate, br, identity';

function tagged(error, kind) {
    const wrapped = error instanceof Error ? error : new Error(String(error));
    return Object.assign(wrapped, {kind});
}

export const TLS_ERROR_CODES = /CERT|SSL|SELF_SIGNED|UNABLE_TO_VERIFY|DEPTH_ZERO|ALT_NAME|TLSV1|WRONG_VERSION/;

/** Sort a socket error into a `TRANSPORT_ERROR_KINDS` tag; only this layer knows whether it was `delivered`. */
function classify(error, delivered = false) {
    const code = String(/** @type {any} */ (error)?.code || '');
    if (TLS_ERROR_CODES.test(code)) return TRANSPORT_ERROR_KINDS.SSL;
    return delivered ? TRANSPORT_ERROR_KINDS.CONNECTION_RESET : TRANSPORT_ERROR_KINDS.CONNECTION;
}

/** One value made safe inside a quoted `Content-Disposition` parameter: percent form, as WHATWG ignores backslashes. */
function escapePartParameter(value) {
    return value.replaceAll('\\', '%5C').replaceAll('"', '%22');
}

/**
 * One multipart part, with every label and byte already read, so nothing is read twice.
 * @typedef {object} MultipartPart
 * @property {string} name the field name
 * @property {string | null} filename `null` for a plain field rather than an upload
 * @property {string | null} contentType the part's own media type, when it has one
 * @property {Uint8Array | string} content
 */

const BOUNDARY_ATTEMPTS = 8;

const BOUNDARY_PREFIX = '----WebCommanderSDK';
const BOUNDARY_RANDOM_BYTES = 16;

/** How many characters — and, being ASCII, how many bytes — every boundary this SDK writes has. */
const MULTIPART_BOUNDARY_LENGTH = BOUNDARY_PREFIX.length + BOUNDARY_RANDOM_BYTES * 2;

const PLACEHOLDER_BOUNDARY = 'x'.repeat(MULTIPART_BOUNDARY_LENGTH);

const DEFAULT_PART_CONTENT_TYPE = 'application/octet-stream';

function newBoundary() {
    return `${BOUNDARY_PREFIX}${crypto.randomBytes(BOUNDARY_RANDOM_BYTES).toString('hex')}`;
}

/** The delimiter and header block in front of one part — the one place framing is spelled out. */
function partHeaderText(part, boundary) {
    const field = escapePartParameter(part.name);
    if (part.filename === null) {
        return `--${boundary}\r\nContent-Disposition: form-data; name="${field}"\r\n\r\n`;
    }
    const filename = escapePartParameter(part.filename);
    const type = part.contentType || DEFAULT_PART_CONTENT_TYPE;
    return (
        `--${boundary}\r\nContent-Disposition: form-data; name="${field}"; filename="${filename}"\r\n` +
        `Content-Type: ${type}\r\n\r\n`
    );
}

/** How many bytes of framing one part costs, as the encoder writes it. @param {MultipartPart} part @returns {number} */
export function multipartFramingBytes(part) {
    return Buffer.byteLength(partHeaderText(part, PLACEHOLDER_BOUNDARY), 'utf8') + 2;
}

/** The framing bytes the closing `--<boundary>--\r\n` delimiter costs. */
export const MULTIPART_CLOSING_BYTES = Buffer.byteLength(`--${PLACEHOLDER_BOUNDARY}--\r\n`, 'utf8');

const CRLF = Buffer.from('\r\n', 'utf8');

const EMPTY_BUFFER = Buffer.alloc(0);

/** Whether any part, content or label, carries the delimiter `--<boundary>` this boundary would write. */
function boundaryCollides(parts, boundary) {
    const delimiter = `--${boundary}`;
    const delimiterBytes = Buffer.from(delimiter, 'utf8');
    for (const part of parts) {
        if (part.name.includes(delimiter)) return true;
        if (part.filename !== null && part.filename.includes(delimiter)) return true;
        if (part.contentType !== null && part.contentType.includes(delimiter)) return true;
        const content =
            typeof part.content === 'string'
                ? Buffer.from(part.content, 'utf8')
                : Buffer.from(part.content.buffer, part.content.byteOffset, part.content.byteLength);
        if (content.indexOf(delimiterBytes) !== -1) return true;
    }
    return false;
}

/**
 * Encode materialised parts as a multipart body and its `Content-Type`; the random boundary is redrawn on collision.
 * @param {MultipartPart[]} parts @returns {{ bytes: Uint8Array, contentType: string }}
 */
export function encodeMultipartParts(parts) {
    let boundary = newBoundary();
    for (let tries = 0; boundaryCollides(parts, boundary); tries += 1) {
        if (tries >= BOUNDARY_ATTEMPTS) {
            throw new Error('no multipart boundary could be found that the payload does not already contain');
        }
        boundary = newBoundary();
    }
    /** @type {Array<Buffer | Uint8Array>} */
    const chunks = [];
    for (const part of parts) {
        chunks.push(Buffer.from(partHeaderText(part, boundary), 'utf8'));
        // Used as it stands: `transport.js` already copied every upload into private storage.
        chunks.push(typeof part.content === 'string' ? Buffer.from(part.content, 'utf8') : part.content);
        chunks.push(CRLF);
    }
    chunks.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
    return {bytes: Buffer.concat(chunks), contentType: `multipart/form-data; boundary=${boundary}`};
}

function overCap(limitBytes) {
    return Object.assign(
        tagged(
            new Error(`the response body is over the ${limitBytes}-byte maxResponseBytes cap`),
            TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE,
        ),
        {limitBytes},
    );
}

/** Refusal of a body that could not be decoded from its declared encoding; the bytes are not shown. */
function undecodableBody(encoding, cause) {
    const reason = /** @type {any} */ (cause)?.code || /** @type {any} */ (cause)?.message || 'unknown';
    return tagged(
        new Error(`the response declared Content-Encoding: ${encoding} but the body could not be decoded (${reason})`),
        TRANSPORT_ERROR_KINDS.CONTENT_DECODING,
    );
}

/** Refusal of an encoding with no decoder; the peer's token is named, not the body. */
function unsupportedEncoding(encoding, header) {
    return tagged(
        new Error(
            `the response declared Content-Encoding: ${header}, and ${encoding} is not one this SDK can decode; ` +
                `the request asked for ${ACCEPT_ENCODING}`,
        ),
        TRANSPORT_ERROR_KINDS.CONTENT_DECODING,
    );
}

const DECODERS = {
    gzip: zlib.gunzipSync,
    'x-gzip': zlib.gunzipSync,
    deflate: zlib.inflateSync,
    br: zlib.brotliDecompressSync,
};

/**
 * Decompress per `Content-Encoding`, right to left, under the read ceiling; `maxOutputLength` stops a small
 * gzip body inflating to gigabytes before any cap is consulted.
 */
function decompress(bytes, encoding, limitBytes) {
    if (!bytes.length) return bytes;
    const header = String(encoding || '').trim();
    const layers = header
        .split(',')
        .map((token) => token.toLowerCase().trim())
        .filter((token) => token && token !== 'identity');
    if (!layers.length) return bytes;
    // +1, so a body exactly on the limit inflates and one byte past it raises.
    const options = {maxOutputLength: limitBytes + 1};
    let decoded = bytes;
    for (const name of layers.reverse()) {
        const decoder = /** @type {Record<string, (input: Buffer, options: object) => Buffer>} */ (DECODERS)[name];
        if (!decoder) throw unsupportedEncoding(name, header);
        try {
            decoded = decoder(decoded, options);
        } catch (error) {
            if (/** @type {any} */ (error)?.code === 'ERR_BUFFER_TOO_LARGE') throw overCap(limitBytes);
            throw undecodableBody(name, error);
        }
    }
    return decoded;
}

function handshakeSettled(socket) {
    return !socket.encrypted || Boolean(socket.getCipher());
}

/** Read the CA bundle once, at construction and under a ceiling, so no request can fail on reading it. */
function readCaBundle(caBundle, maxBytes) {
    if (!caBundle) return undefined;
    let handle;
    try {
        handle = fs.openSync(caBundle, 'r');
    } catch (error) {
        // The errno name is the structural part; the path goes on the withheld `details`.
        throw new SdkConfigError(
            `caBundle: the file it names could not be opened (${fileErrorCode(error)}); pass a readable PEM path, ` +
                'or null to use the system trust store',
            {details: {caBundle}},
        );
    }
    try {
        const declared = fs.fstatSync(handle).size;
        // Sized from the handle's own length, not the ceiling; the `+ 1` catches a file that grew.
        const want = Math.min(declared, maxBytes) + 1;
        const buffer = Buffer.allocUnsafe(want);
        let read;
        try {
            read = fs.readSync(handle, buffer, 0, want, 0);
        } catch (error) {
            throw new SdkConfigError(
                `caBundle: the file it names could not be read (${fileErrorCode(error)}); pass a readable PEM ` +
                    'path, or null to use the system trust store',
                {details: {caBundle}},
            );
        }
        if (read > maxBytes) {
            throw new SdkConfigError(
                `caBundle: the file it names is over the ${maxBytes}-byte maxCaBundleBytes ceiling, so it was not ` +
                    'read — a trust store is a few hundred kilobytes; raise maxCaBundleBytes if this one is ' +
                    'legitimately larger',
                {details: {caBundle}},
            );
        }
        return Buffer.from(buffer.subarray(0, read));
    } finally {
        fs.closeSync(handle);
    }
}

function fileErrorCode(error) {
    const code = /** @type {any} */ (error)?.code;
    return typeof code === 'string' && code ? code : 'unreadable';
}

function proxyIsSecure(proxy) {
    return proxy.protocol === 'https:';
}

function proxyPort(proxy) {
    return Number(proxy.port || (proxyIsSecure(proxy) ? 443 : 80));
}

function proxyAuthorization(proxy) {
    if (!proxy.username) return null;
    const credentials = Buffer.from(
        `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password || '')}`,
    ).toString('base64');
    return `Basic ${credentials}`;
}

/**
 * Open a `CONNECT` tunnel for an https target; an `https://` proxy is verified against the CA bundle.
 * @param {(abort: () => void) => (() => void)} registerAbort
 */
function openProxyTunnel(proxy, target, connectTimeoutMs, trust, registerAbort) {
    return new Promise((resolve, reject) => {
        const port = target.port || '443';
        /** @type {any} */
        const options = {
            host: proxy.hostname,
            port: proxyPort(proxy),
            method: 'CONNECT',
            path: `${target.hostname}:${port}`,
            headers: {Host: `${target.hostname}:${port}`},
            agent: false,
        };
        const authorization = proxyAuthorization(proxy);
        if (authorization) options.headers['Proxy-Authorization'] = authorization;
        if (proxyIsSecure(proxy)) {
            options.ca = trust.ca;
            options.rejectUnauthorized = trust.verifySsl;
            // RFC 6066 forbids an IP literal as the SNI name.
            options.servername = net.isIP(proxy.hostname) ? undefined : proxy.hostname;
        }
        const request = (proxyIsSecure(proxy) ? https : http).request(options);
        const timer = setTimeout(() => {
            request.destroy(
                tagged(
                    new Error(`proxy CONNECT timed out after ${connectTimeoutMs}ms`),
                    TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT,
                ),
            );
        }, connectTimeoutMs);
        // Attached before `end()`, so an abort already pending tears this stage down at once.
        const unregisterAbort = registerAbort(() =>
            request.destroy(
                tagged(
                    new Error('request aborted while the proxy tunnel was being opened'),
                    TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT,
                ),
            ),
        );
        const settle = () => {
            clearTimeout(timer);
            unregisterAbort();
        };
        request.on('connect', (response, socket) => {
            settle();
            if (response.statusCode !== 200) {
                socket.destroy();
                reject(
                    tagged(
                        new Error(`proxy refused CONNECT with ${response.statusCode}`),
                        TRANSPORT_ERROR_KINDS.CONNECTION,
                    ),
                );
                return;
            }
            resolve(socket);
        });
        request.on('error', (error) => {
            settle();
            reject(tagged(error, /** @type {any} */ (error).kind || classify(error)));
        });
        request.end();
    });
}

/**
 * @param {{
 *   caBundle?: string | null, verifySsl?: boolean, proxyUrl?: string | null,
 *   poolMaxsize?: number, connectTimeoutSeconds?: number, timeoutSeconds?: number,
 *   maxResponseBytes?: number, maxCaBundleBytes?: number,
 * }} settings `maxResponseBytes` bounds the read and the inflate, not just the verdict;
 *   `maxCaBundleBytes` bounds the trust store read at construction
 * @returns {((url: string, init?: any) => Promise<Response>) & { close: () => void, discardPooledConnections: () => void }}
 */
export function createNodeFetch(settings = {}) {
    const verifySsl = settings.verifySsl !== false;
    const ca = readCaBundle(settings.caBundle, settings.maxCaBundleBytes);
    const connectTimeoutMs = /** @type {number} */ (settings.connectTimeoutSeconds) * 1000;
    const readTimeoutMs = /** @type {number} */ (settings.timeoutSeconds) * 1000;
    const maxResponseBytes = /** @type {number} */ (settings.maxResponseBytes);
    const proxy = settings.proxyUrl ? new URL(settings.proxyUrl) : null;

    // `maxSockets` is unbounded: a capped agent queues, and the connect deadline would call that wait a timeout.
    const agentOptions = {keepAlive: true, maxSockets: Infinity, maxFreeSockets: settings.poolMaxsize};
    let httpsAgent = new https.Agent({...agentOptions, ca, rejectUnauthorized: verifySsl});
    let httpAgent = new http.Agent(agentOptions);
    /** Agents a discard replaced; a request already running on one finishes there, so `close()` reaches them too. */
    const retiredAgents = new Set();

    async function nodeFetch(url, init = {}) {
        const target = new URL(url);
        const secure = target.protocol === 'https:';

        // Abort is wired up first: encoding a body and opening a tunnel both precede the request.
        const signal = init.signal;
        let aborted = Boolean(signal && signal.aborted);
        /** @type {(() => void) | null} */
        let notifyAbort = null;
        const onAbort = () => {
            aborted = true;
            if (notifyAbort) notifyAbort();
        };
        if (signal) signal.addEventListener('abort', onAbort, {once: true});
        const refuseIfAborted = () => {
            // Raised, not routed through `fail`: there is no ClientRequest to destroy yet.
            if (aborted) throw tagged(new Error('request aborted'), TRANSPORT_ERROR_KINDS.READ_TIMEOUT);
        };

        /** Releases a per-request proxy tunnel once the call has settled. @type {(() => void) | null} */
        let releaseTunnel = null;

        try {
            refuseIfAborted();
            const bytes = init.body === null || init.body === undefined ? null : Buffer.from(init.body);

            /** @type {Record<string, string>} */
            const headers = {'Accept-Encoding': ACCEPT_ENCODING};
            for (const [name, value] of Object.entries(init.headers || {})) headers[name] = String(value);
            if (bytes) headers['Content-Length'] = String(bytes.length);

            // The first hop's scheme decides: plaintext to a TLS proxy would expose the proxy credentials.
            const tunnelled = Boolean(proxy) && secure;
            const firstHopSecure = proxy ? (tunnelled ? true : proxyIsSecure(proxy)) : secure;

            /** @type {any} */
            const options = {
                method: init.method || 'GET',
                headers,
                host: target.hostname,
                port: target.port || (secure ? 443 : 80),
                path: `${target.pathname}${target.search}`,
            };

            if (proxy && !secure) {
                options.host = proxy.hostname;
                options.port = proxyPort(proxy);
                options.path = url;
                options.agent = firstHopSecure ? httpsAgent : httpAgent;
                // Set explicitly: Node derives `Host` from the proxy it dials, and proxies route by it.
                options.headers.Host = target.host;
                const authorization = proxyAuthorization(proxy);
                if (authorization) options.headers['Proxy-Authorization'] = authorization;
                if (firstHopSecure) {
                    options.ca = ca;
                    options.rejectUnauthorized = verifySsl;
                    options.servername = net.isIP(proxy.hostname) ? undefined : proxy.hostname;
                }
            } else if (proxy && secure) {
                const tunnel = await openProxyTunnel(proxy, target, connectTimeoutMs, {ca, verifySsl}, (abort) => {
                    notifyAbort = abort;
                    if (aborted) abort();
                    return () => {
                        notifyAbort = null;
                    };
                });
                const tunnelAgent = new https.Agent({
                    keepAlive: false,
                    ca,
                    rejectUnauthorized: verifySsl,
                });
                const servername = net.isIP(target.hostname) ? undefined : target.hostname;
                tunnelAgent.createConnection = () =>
                    tls.connect({
                        socket: tunnel,
                        servername,
                        ca,
                        rejectUnauthorized: verifySsl,
                    });
                options.agent = tunnelAgent;
                options.ca = ca;
                options.rejectUnauthorized = verifySsl;
                releaseTunnel = () => {
                    tunnelAgent.destroy();
                    tunnel.destroy();
                };
                // An abort during the open must not be answered by sending the request down it.
                refuseIfAborted();
            } else {
                options.agent = secure ? httpsAgent : httpAgent;
                if (secure) {
                    options.ca = ca;
                    options.rejectUnauthorized = verifySsl;
                }
            }

            return await new Promise((resolve, reject) => {
                const request = (firstHopSecure ? https : http).request(options);
                let connected = false;
                let settled = false;
                /** Detaches the handshake listeners this request put on its socket. @type {() => void} */
                let releaseSocketListeners = () => {};

                // Attached first: destroying a ClientRequest with no 'error' listener raises.
                request.on('error', (error) =>
                    fail(error, /** @type {any} */ (error).kind || classify(error, connected)),
                );

                const fail = (error, kind) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(connectTimer);
                    clearTimeout(readTimer);
                    releaseSocketListeners();
                    request.destroy();
                    if (releaseTunnel) releaseTunnel();
                    reject(tagged(error, kind));
                };

                // The connect half only, so a slow body cannot pass for a connect timeout and be retried wrongly.
                const connectTimer = setTimeout(() => {
                    fail(
                        new Error(`connect timed out after ${connectTimeoutMs}ms`),
                        TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT,
                    );
                }, connectTimeoutMs);

                /** @type {ReturnType<typeof setTimeout> | undefined} */
                let readTimer;
                const armReadTimer = () => {
                    clearTimeout(readTimer);
                    readTimer = setTimeout(() => {
                        fail(new Error(`read timed out after ${readTimeoutMs}ms`), TRANSPORT_ERROR_KINDS.READ_TIMEOUT);
                    }, readTimeoutMs);
                };

                const markConnected = () => {
                    if (connected) return;
                    connected = true;
                    clearTimeout(connectTimer);
                    armReadTimer();
                };

                request.on('socket', (socket) => {
                    if (!socket.connecting && handshakeSettled(socket)) {
                        // A pooled socket: neither event fires again, so a listener would leak.
                        markConnected();
                        return;
                    }
                    const onEstablished = () => {
                        releaseSocketListeners();
                        markConnected();
                    };
                    // Removed explicitly, or the event that did not fire stays on a pooled socket.
                    releaseSocketListeners = () => {
                        releaseSocketListeners = () => {};
                        socket.removeListener('connect', onEstablished);
                        socket.removeListener('secureConnect', onEstablished);
                    };
                    // Only `secureConnect` ends a TLS connect; `connect` fires before any certificate is exchanged.
                    if (/** @type {any} */ (socket).encrypted) socket.on('secureConnect', onEstablished);
                    else socket.on('connect', onEstablished);
                });

                notifyAbort = () => {
                    fail(
                        new Error('request aborted'),
                        connected ? TRANSPORT_ERROR_KINDS.READ_TIMEOUT : TRANSPORT_ERROR_KINDS.CONNECT_TIMEOUT,
                    );
                };
                if (aborted) {
                    notifyAbort();
                    return;
                }

                request.on('response', (response) => {
                    clearTimeout(connectTimer);
                    connected = true;
                    releaseSocketListeners();
                    armReadTimer();
                    // Refused before a byte is read: the last point the allocation can be avoided.
                    const declared = Number(response.headers['content-length']);
                    if (Number.isFinite(declared) && declared > maxResponseBytes) {
                        fail(overCap(maxResponseBytes), TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE);
                        return;
                    }
                    /** @type {Buffer[]} */
                    const chunks = [];
                    let received = 0;
                    response.on('data', (chunk) => {
                        received += chunk.length;
                        // An undeclared or lying length is bounded by what has actually arrived.
                        if (received > maxResponseBytes) {
                            chunks.length = 0;
                            fail(overCap(maxResponseBytes), TRANSPORT_ERROR_KINDS.RESPONSE_TOO_LARGE);
                            return;
                        }
                        chunks.push(chunk);
                        armReadTimer();
                    });
                    response.on('end', () => {
                        if (settled) return;
                        settled = true;
                        clearTimeout(readTimer);
                        let raw = Buffer.concat(chunks);
                        // Both intermediates are cap-sized: one ceiling would otherwise permit two.
                        chunks.length = 0;
                        /** @type {Buffer} */
                        let body;
                        try {
                            body = decompress(
                                raw,
                                /** @type {string} */ (response.headers['content-encoding']),
                                maxResponseBytes,
                            );
                            if (body !== raw) raw = EMPTY_BUFFER;
                        } catch (error) {
                            // `settled` is already true, so `fail` would drop this refusal.
                            request.destroy();
                            if (releaseTunnel) releaseTunnel();
                            reject(error);
                            return;
                        }
                        const outHeaders = new Headers();
                        for (const [name, value] of Object.entries(response.headers)) {
                            if (value === undefined) continue;
                            if (Array.isArray(value)) for (const item of value) outHeaders.append(name, item);
                            else outHeaders.set(name, String(value));
                        }
                        // The decompressed length is what a reader would measure.
                        if (outHeaders.has('content-encoding')) {
                            outHeaders.delete('content-encoding');
                            outHeaders.set('content-length', String(body.length));
                        }
                        if (releaseTunnel) releaseTunnel();
                        resolve(
                            new Response(/** @type {any} */ (body.length ? body : null), {
                                status: response.statusCode || 0,
                                statusText: response.statusMessage || '',
                                headers: outHeaders,
                            }),
                        );
                    });
                    // The response had already begun, so the request was delivered in full.
                    response.on('error', (error) => fail(error, classify(error, true)));
                });

                if (bytes) request.write(bytes);
                request.end();
            });
        } catch (error) {
            if (releaseTunnel) releaseTunnel();
            throw error;
        } finally {
            if (signal) signal.removeEventListener('abort', onAbort);
        }
    }

    nodeFetch.close = () => {
        for (const agent of [httpsAgent, httpAgent, ...retiredAgents]) agent.destroy();
        retiredAgents.clear();
    };
    /** Give new requests fresh pools; unlike `close()`, the instance stays usable and running requests finish. */
    nodeFetch.discardPooledConnections = () => {
        for (const agent of retiredAgents) if (!Object.keys(agent.sockets).length) retiredAgents.delete(agent);
        for (const agent of [httpsAgent, httpAgent]) {
            // A running request keeps its socket; with keep-alive off the agent closes it on release, never pools it.
            /** @type {any} */ (agent).keepAlive = false;
            for (const sockets of Object.values(agent.freeSockets)) for (const socket of sockets) socket.destroy();
            retiredAgents.add(agent);
        }
        httpsAgent = new https.Agent({...agentOptions, ca, rejectUnauthorized: verifySsl});
        httpAgent = new http.Agent(agentOptions);
    };
    return nodeFetch;
}
