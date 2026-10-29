import net from 'node:net';
import {createHash} from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import {AsyncLocalStorage} from 'node:async_hooks';
import {SdkConfigError, SdkError, SdkUsageError, TokenCacheError} from '../errors.js';
import {DEFAULT_MAX_TOKEN_CACHE_BYTES} from '../config/sdkConfig.js';

/** The default cache file. Every write rewrites the whole document, one entry per namespace. */
export const DEFAULT_TOKEN_CACHE_FILENAME = 'wc_js_token.json';
const APP_CACHE_DIRNAME = 'webcommander';
/** How long acquisition waits for the lock holder before failing the token operation. */
const LOCK_TIMEOUT_SECONDS = 30;
const LOCK_POLL_SECONDS = 0.05;
/** The `sun_path` ceiling (108 bytes on Linux, 104 on macOS); past it the endpoint goes in `os.tmpdir()`. */
const MAX_SOCKET_PATH_LENGTH = 100;
const DEFAULT_NAMESPACE = 'default';
const REPLACE_RETRY_ATTEMPTS = 5;
const REPLACE_RETRY_INITIAL_SECONDS = 0.01;

/** The real path of a target, symlinks collapsed and Windows case folded, so two spellings share one guard. */
function realTargetPath(filePath) {
    const resolved = path.resolve(filePath);
    /** @type {string[]} */
    const tail = [];
    let current = resolved;
    for (;;) {
        try {
            const real = fs.realpathSync.native(current);
            return tail.length ? path.join(real, ...tail.reverse()) : real;
        } catch {
            const parent = path.dirname(current);
            // The root resolves to itself or does not exist: no further ancestor to ask.
            if (parent === current) return resolved;
            tail.push(path.basename(current));
            current = parent;
        }
    }
}

function targetIdentity(realPath) {
    return process.platform === 'win32' ? realPath.toLowerCase() : realPath;
}

/**
 * One target's in-process coordination state, keyed by the lock address so two stores on one file share it.
 * @type {Map<string, {lock: ReentrantAsyncLock, depth: number, servers: import('node:net').Server[]}>}
 */
const TARGET_GUARDS = new Map();

function guardFor(identity) {
    let guard = TARGET_GUARDS.get(identity);
    if (guard === undefined) {
        guard = {lock: new ReentrantAsyncLock(), depth: 0, servers: []};
        TARGET_GUARDS.set(identity, guard);
    }
    return guard;
}

/** The coordination address for a cache file: a named pipe on Windows, a Unix socket elsewhere. */
function lockChannelsFor(realPath) {
    const digest = createHash('sha256').update(targetIdentity(realPath)).digest('hex').slice(0, 32);
    if (process.platform === 'win32') return [`\\\\.\\pipe\\webcommander-token-${digest}`];
    const beside = path.join(path.dirname(realPath), `.${path.basename(realPath)}.${digest.slice(0, 16)}.sock`);
    const filesystem =
        beside.length <= MAX_SOCKET_PATH_LENGTH ? beside : path.join(os.tmpdir(), `wc-token-${digest}.sock`);
    if (!ABSTRACT_ADDRESS_PLATFORMS.includes(process.platform)) return [filesystem];
    return [filesystem, `\u0000webcommander-token-${digest}`];
}

/** Platforms with an abstract Unix-socket namespace, which cannot be unlinked; both must be free. */
const ABSTRACT_ADDRESS_PLATFORMS = Object.freeze(['linux']);

function platformCacheRoot() {
    if (process.platform === 'win32') {
        return process.env.LOCALAPPDATA || os.homedir();
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Caches');
    }
    return process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache');
}

/**
 * The per-user cache path, with the directory created and narrowed to its owner.
 * @param {string} [filename] @returns {string}
 */
export function buildDefaultTokenCachePath(filename = DEFAULT_TOKEN_CACHE_FILENAME) {
    let root = platformCacheRoot();
    if (!path.isAbsolute(root)) root = os.tmpdir();
    const directory = path.join(root, APP_CACHE_DIRNAME);
    fs.mkdirSync(directory, {recursive: true});
    restrictToOwner(directory);
    return path.join(directory, filename);
}

function restrictToOwner(target) {
    if (process.platform === 'win32') return;
    try {
        const mode = fs.statSync(target).isDirectory() ? 0o700 : 0o600;
        fs.chmodSync(target, mode);
    } catch {
        // Best-effort; access is still governed by the directory.
    }
}

/**
 * A length-prefixed SHA-256 fingerprint of the token's credentials; `'v3'` is on-disk format, bumped with the inputs.
 * @param {{ baseUrl: string, clientId: string, clientSecret?: string, authString?: string, grantType?: string }} credentials @returns {string}
 */
export function buildCredentialsNamespace({baseUrl, clientId, clientSecret = '', authString = '', grantType = ''}) {
    const parts = ['v3', baseUrl, clientId, clientSecret, authString, grantType];
    // Length-prefixed in code points, so the concatenation cannot be ambiguous.
    const material = parts.map((value) => `${[...String(value)].length}:${value}`).join('');
    return createHash('sha256').update(material, 'utf8').digest('hex').slice(0, 16);
}

/** A reentrant async lock: an acquire nested in the running critical section re-enters instead of deadlocking. */
class ReentrantAsyncLock {
    /** The queue every non-reentrant acquisition joins. @type {Promise<void>} */
    #tail = Promise.resolve();
    /** @type {AsyncLocalStorage<symbol>} */
    #context = new AsyncLocalStorage();
    /** The token of the acquisition holding the section, or null between them. @type {symbol | null} */
    #holder = null;

    /** @template T @param {() => Promise<T> | T} fn @returns {Promise<T>} */
    async runExclusive(fn) {
        if (this.#holder !== null && this.#context.getStore() === this.#holder) return await fn();
        /** @type {() => void} */
        let release = () => {};
        const previous = this.#tail;
        this.#tail = new Promise((resolve) => {
            release = resolve;
        });
        await previous;
        const token = Symbol('tokenStoreLockHolder');
        this.#holder = token;
        try {
            return await this.#context.run(token, fn);
        } finally {
            this.#holder = null;
            release();
        }
    }
}

/** The interface a token store implements; an un-overridden member throws `SdkUsageError`. */
export class TokenStore {
    /** @param {string} method @returns {never} */
    #abstract(method) {
        throw new SdkUsageError(
            `${this.constructor.name}.${method}() is not implemented: TokenStore is an interface, so a subclass has to ` +
                'override readTokenRecord, writeTokenRecord, clearTokenRecord and acquireTokenRefreshLock',
        );
    }

    /** The stored record, or null when nothing is cached. @returns {Promise<Record<string, unknown> | null>} */
    async readTokenRecord() {
        return this.#abstract('readTokenRecord');
    }

    /** Persist one record. @param {Record<string, unknown>} record @returns {Promise<void>} */
    async writeTokenRecord(record) {
        return this.#abstract('writeTokenRecord');
    }

    /** Forget the stored record. @returns {Promise<void>} */
    async clearTokenRecord() {
        return this.#abstract('clearTokenRecord');
    }

    /** Run `fn` holding whatever lock keeps two refreshes from racing. @template T @param {() => Promise<T> | T} fn @returns {Promise<T>} */
    async acquireTokenRefreshLock(fn) {
        return this.#abstract('acquireTokenRefreshLock');
    }
}

async function readBoundedText(filePath, maxBytes) {
    const handle = await fsp.open(filePath, 'r');
    try {
        const declared = (await handle.stat()).size;
        const want = Math.min(declared, maxBytes) + 1;
        const buffer = Buffer.allocUnsafe(want);
        const {bytesRead} = await handle.read(buffer, 0, want, 0);
        if (bytesRead > maxBytes) {
            throw new TokenCacheError(
                `the token cache named by tokenCachePath is over the ${maxBytes}-byte maxTokenCacheBytes ceiling, ` +
                    'so it was not read; it is not overwritten either, because that would discard the entries of ' +
                    'every other credential sharing this file — inspect it, or raise maxTokenCacheBytes',
                {reason: 'unreadable', details: {tokenCachePath: filePath}},
            );
        }
        return buffer.subarray(0, bytesRead).toString('utf8');
    } finally {
        await handle.close();
    }
}

/** In-process token storage, isolated per instance and nothing on disk. */
export class MemoryTokenStore extends TokenStore {
    /** @type {Record<string, unknown> | null} */
    #record = null;
    #lock = new ReentrantAsyncLock();

    async readTokenRecord() {
        return this.#lock.runExclusive(() => (this.#record ? structuredClone(this.#record) : null));
    }

    /** @param {Record<string, unknown>} record */
    async writeTokenRecord(record) {
        await this.#lock.runExclusive(() => {
            this.#record = structuredClone(record);
        });
    }

    async clearTokenRecord() {
        await this.#lock.runExclusive(() => {
            this.#record = null;
        });
    }

    /** @template T @param {() => Promise<T> | T} fn */
    async acquireTokenRefreshLock(fn) {
        return this.#lock.runExclusive(fn);
    }
}

/** Token storage in a JSON file, shared between processes under an OS-owned lock; fails closed. */
export class FileTokenStore extends TokenStore {
    #path;
    /** Every address that must be free before this process enters. @type {string[]} */
    #lockChannels;
    #namespace;
    /**
     * The coordination state for this store's target; see {@link TARGET_GUARDS}.
     * @type {{lock: ReentrantAsyncLock, depth: number, servers: import('node:net').Server[]}}
     */
    #guard;

    #maxBytes = DEFAULT_MAX_TOKEN_CACHE_BYTES;

    /**
     * @param {string} filePath @param {string} [namespace]
     * @param {{maxBytes?: number}} [options] `maxBytes` is `SdkConfig.maxTokenCacheBytes`
     */
    constructor(filePath, namespace = DEFAULT_NAMESPACE, options = {}) {
        super();
        if (Number.isFinite(options.maxBytes) && /** @type {number} */ (options.maxBytes) > 0) {
            this.#maxBytes = /** @type {number} */ (options.maxBytes);
        }
        this.#namespace = namespace || DEFAULT_NAMESPACE;

        // The parent is created first, so the resolution below has a real directory to resolve.
        const parent = path.dirname(path.resolve(filePath));
        if (!fs.existsSync(parent)) {
            try {
                fs.mkdirSync(parent, {recursive: true});
            } catch (error) {
                throw new SdkConfigError(
                    'tokenCachePath: its parent directory does not exist and could not be created ' +
                        `(${describeFileError(error)}); pass a path whose parent exists, or null to keep the token ` +
                        'in memory',
                    {details: {tokenCachePath: path.resolve(filePath)}},
                );
            }
        }

        // One identity: the data file, the sidecar address and the in-process gate must agree.
        this.#path = realTargetPath(filePath);
        this.#lockChannels = lockChannelsFor(this.#path);
        this.#guard = guardFor(targetIdentity(this.#path));
    }

    /** The resolved real path this store reads and writes. @returns {string} */
    get path() {
        return this.#path;
    }

    /** @returns {Promise<Record<string, unknown> | null>} */
    async readTokenRecord() {
        return this.#guard.lock.runExclusive(async () => {
            const entry = (await this.#readAllNamespaces())[this.#namespace];
            return entry && typeof entry === 'object' && !Array.isArray(entry)
                ? /** @type {Record<string, unknown>} */ (structuredClone(entry))
                : null;
        });
    }

    /** @param {Record<string, unknown>} record */
    async writeTokenRecord(record) {
        await this.acquireTokenRefreshLock(async () => {
            const stored = await this.#readAllNamespaces();
            stored[this.#namespace] = structuredClone(record);
            await this.#writeAllNamespaces(stored);
        });
    }

    /** Forget this namespace's record, removing the data file once it holds nothing else. */
    async clearTokenRecord() {
        await this.acquireTokenRefreshLock(async () => {
            const stored = await this.#readAllNamespaces();
            // Nothing to clear leaves the file alone, so a shared file is undisturbed.
            const entry = stored[this.#namespace];
            if (entry === null || entry === undefined) return;
            delete stored[this.#namespace];
            if (Object.keys(stored).length) {
                await this.#writeAllNamespaces(stored);
                return;
            }
            try {
                await fsp.unlink(this.#path);
            } catch (error) {
                // Already gone is the outcome asked for, so it is a success.
                if (/** @type {any} */ (error).code !== 'ENOENT') {
                    throw new SdkError(
                        'the token cache entry was removed from memory but the file holding it could not be ' +
                            `deleted (${describeFileError(error)}). A reusable token may still be on disk at the ` +
                            'path tokenCachePath names, so treat this as a failed logout rather than a completed one',
                        {details: {tokenCachePath: this.#path}},
                    );
                }
            }
        });
    }

    /** Every namespace, or a typed failure: unreadable is corrupt, since empty would drop every sibling on write. */
    async #readAllNamespaces() {
        let content;
        try {
            content = await readBoundedText(this.#path, this.#maxBytes);
        } catch (error) {
            if (/** @type {any} */ (error).code === 'ENOENT') return {};
            if (error instanceof TokenCacheError) throw error;
            throw new TokenCacheError(
                `the token cache named by tokenCachePath exists but could not be read (${describeFileError(error)}); ` +
                    'fix the permissions on it, or pass tokenCachePath: null to keep the token in memory',
                {reason: 'unreadable', details: {tokenCachePath: this.#path}},
            );
        }
        if (!content.trim()) return {};
        let stored;
        try {
            stored = JSON.parse(content);
        } catch {
            // The parser's own text would quote the document it choked on, and that holds tokens.
            throw new TokenCacheError(
                'the token cache named by tokenCachePath is not valid JSON; it is not overwritten, because that ' +
                    'would discard the entries of every other credential sharing this file — inspect it, then ' +
                    'remove it if it is beyond repair',
                {reason: 'corrupt', details: {tokenCachePath: this.#path}},
            );
        }
        if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
            throw new TokenCacheError(
                `the token cache named by tokenCachePath decoded to ${Array.isArray(stored) ? 'an array' : typeof stored} ` +
                    'rather than an object of namespaces; it is not overwritten, because that would discard the ' +
                    'entries of every other credential sharing this file',
                {reason: 'corrupt', details: {tokenCachePath: this.#path}},
            );
        }
        return stored;
    }

    /** Write every namespace back through a temp file and an atomic rename. */
    async #writeAllNamespaces(stored) {
        const directory = path.dirname(this.#path);
        await fsp.mkdir(directory, {recursive: true});
        const temporaryPath = path.join(directory, `${path.basename(this.#path)}.${process.pid}.${uniqueSuffix()}.tmp`);
        try {
            await fsp.writeFile(temporaryPath, JSON.stringify(stored), {
                encoding: 'utf8',
                mode: 0o600,
                flag: 'wx',
            });
            await this.#replaceTokenFile(temporaryPath);
            restrictToOwner(this.#path);
        } catch (error) {
            await fsp.unlink(temporaryPath).catch(() => {});
            throw error;
        }
    }

    async #replaceTokenFile(temporaryPath) {
        for (let attempt = 0; attempt < REPLACE_RETRY_ATTEMPTS; attempt += 1) {
            try {
                await fsp.rename(temporaryPath, this.#path);
                return;
            } catch (error) {
                const code = /** @type {any} */ (error).code;
                const windowsSharing =
                    process.platform === 'win32' && (code === 'EPERM' || code === 'EBUSY' || code === 'EACCES');
                if (!windowsSharing || attempt === REPLACE_RETRY_ATTEMPTS - 1) throw error;
                await sleepSeconds(REPLACE_RETRY_INITIAL_SECONDS * 2 ** attempt);
            }
        }
    }

    /**
     * Run `fn` holding the cross-process lock, reentrantly; only the outermost frame binds and closes the endpoint.
     * @template T @param {() => Promise<T> | T} fn @returns {Promise<T>}
     * @throws {SdkError} the lock could not be taken, so the operation is refused
     */
    async acquireTokenRefreshLock(fn) {
        const guard = this.#guard;
        return guard.lock.runExclusive(async () => {
            const outermost = guard.depth === 0;
            if (outermost) await this.#acquireChannel();
            guard.depth += 1;
            try {
                return await fn();
            } finally {
                guard.depth -= 1;
                if (outermost) await this.#releaseChannel();
            }
        });
    }

    async #acquireChannel() {
        const deadline = Date.now() + LOCK_TIMEOUT_SECONDS * 1000;
        for (;;) {
            const {servers, blockedIndex} = await this.#bindChannels();
            if (servers !== null) {
                this.#guard.servers = servers;
                return;
            }
            // A leftover socket file fails a bind like a live holder; whether anything answers tells them apart.
            if (blockedIndex === 0 && process.platform !== 'win32' && !(await this.#channelAnswers())) {
                throw new SdkError(
                    'token cache lock endpoint is stale; remove error.details.lockChannel once no process uses ' +
                        'this cache, or pass tokenCachePath: null',
                    {details: {tokenCachePath: this.#path, lockChannel: this.#lockChannels[0]}},
                );
            }
            if (Date.now() >= deadline) {
                throw new SdkError(
                    'another process has held the token cache lock for the file tokenCachePath names for more ' +
                        `than ${LOCK_TIMEOUT_SECONDS}s. The refresh was not attempted: two processes writing this ` +
                        "file at once lose one of them's entry. Retry, or give this client its own tokenCachePath",
                    {details: {tokenCachePath: this.#path}},
                );
            }
            await sleepSeconds(LOCK_POLL_SECONDS);
        }
    }

    /** Bind the endpoint, answering the bound server or `null` when somebody else holds it. */
    #bindChannel(address) {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            const settle = (/** @type {(value: any) => void} */ done, /** @type {any} */ value) => {
                server.removeAllListeners('error');
                server.removeAllListeners('listening');
                // A standing listener, because an emitter with none throws on 'error'.
                server.on('error', () => {});
                done(value);
            };
            server.on('connection', (socket) => socket.destroy());
            server.on('error', (error) => {
                if (/** @type {any} */ (error).code === 'EADDRINUSE') {
                    settle(resolve, null);
                    return;
                }
                settle(
                    reject,
                    new SdkError(
                        'the token cache lock could not be taken: the coordination endpoint beside the file ' +
                            `tokenCachePath names is unusable (${describeFileError(error)}). Pass a tokenCachePath ` +
                            'whose directory this process can write, or tokenCachePath: null to keep the token in memory',
                        {details: {tokenCachePath: this.#path, lockChannel: this.#lockChannels.join(', ')}},
                    ),
                );
            });
            server.on('listening', () => {
                server.unref();
                settle(resolve, server);
            });
            server.listen(address);
        });
    }

    /** Take every address or none, so two waiters cannot deadlock on one each; `blockedIndex` names the held one. */
    async #bindChannels() {
        /** @type {import('node:net').Server[]} */
        const bound = [];
        for (let index = 0; index < this.#lockChannels.length; index += 1) {
            let server;
            try {
                server = await this.#bindChannel(this.#lockChannels[index]);
            } catch (error) {
                await closeServers(bound);
                throw error;
            }
            if (server === null) {
                await closeServers(bound);
                return {servers: null, blockedIndex: index};
            }
            bound.push(server);
        }
        return {servers: bound, blockedIndex: -1};
    }

    #channelAnswers() {
        return new Promise((resolve) => {
            const probe = net.connect(/** @type {any} */ (this.#lockChannels[0]));
            probe.unref();
            const finish = (/** @type {boolean} */ answered) => {
                probe.removeAllListeners();
                probe.destroy();
                resolve(answered);
            };
            probe.on('connect', () => finish(true));
            probe.on('error', () => finish(false));
        });
    }

    /** Release the lock by closing the handle this store bound; nothing is deleted by name. */
    async #releaseChannel() {
        const servers = this.#guard.servers;
        this.#guard.servers = [];
        await closeServers(servers);
    }
}

async function closeServers(servers) {
    for (const server of servers) {
        await new Promise((resolve) => server.close(() => resolve(undefined)));
    }
}

function describeFileError(error) {
    const code = /** @type {any} */ (error)?.code;
    if (typeof code === 'string' && code) return code;
    return error instanceof Error ? error.message : String(error);
}

let suffixCounter = 0;
/** A short suffix that makes a temp filename unique, so two writers never share one. */
function uniqueSuffix() {
    suffixCounter += 1;
    return suffixCounter.toString(36);
}

function sleepSeconds(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
