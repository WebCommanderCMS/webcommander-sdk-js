import fs from 'node:fs';
import {SdkConfigError} from '../errors.js';
import {redactFields} from '../redaction.js';
import {buildDefaultTokenCachePath} from '../auth/tokenStore.js';

export const DEFAULT_GRANT_TYPE = 'client_credentials';

// Re-exported rather than redefined: `tokenStore` owns the filename.
export {DEFAULT_TOKEN_CACHE_FILENAME} from '../auth/tokenStore.js';

/** Sentinel: resolve the platform's per-user cache path. */
export const USE_DEFAULT_TOKEN_CACHE = Object.freeze({[Symbol.for('webcommander.useDefaultTokenCache')]: true});

const REQUIRED_FIELDS = ['baseUrl', 'clientId', 'clientSecret', 'redirectUri', 'authString', 'clientName', 'grantType'];
/** Hykmah issues the token from the client alone, so the redirect URI and auth string drop out. */
const HYKMAH_REQUIRED_FIELDS = REQUIRED_FIELDS.filter((name) => name !== 'redirectUri' && name !== 'authString');
const FIELD_NAMES = [...REQUIRED_FIELDS, 'tokenCachePath', 'authBaseUrl'];

/** Trim a base URL, handing a wrong-typed value back for validation to report. @param {unknown} rawValue @returns {unknown} */
function normaliseBaseUrl(rawValue) {
    if (typeof rawValue !== 'string') return rawValue;
    return rawValue.trim().replace(/\/+$/, '');
}

/** Trim the Hykmah origin; blank means not set, so an empty `.env` entry keeps the store flow. @param {unknown} rawValue @returns {unknown} */
function normaliseAuthBaseUrl(rawValue) {
    if (typeof rawValue !== 'string') return rawValue;
    return rawValue.trim().replace(/\/+$/, '') || null;
}

/** Report every way a syntactically-present base URL is still unusable. @param {string} baseUrl @param {string} [name] @returns {string[]} */
function problemsWithTheBaseUrl(baseUrl, name = 'baseUrl') {
    let parsed;
    try {
        parsed = new URL(baseUrl);
    } catch (error) {
        return [`${name}: is not a URL (${error instanceof Error ? error.message : String(error)})`];
    }
    const scheme = parsed.protocol.replace(/:$/, '');
    if ((scheme !== 'http' && scheme !== 'https') || !parsed.host) {
        return [`${name}: must start with http:// or https:// and include a host, got ${JSON.stringify(baseUrl)}`];
    }
    const problems = [];
    if (parsed.username || parsed.password) {
        // Not echoed: it holds a password.
        problems.push(
            `${name}: host ${parsed.hostname} carries embedded credentials, which would replace the bearer token; strip the userinfo`,
        );
    }
    if (parsed.search || parsed.hash) {
        problems.push(
            `${name}: must be the origin only, with no query string or fragment, got ${JSON.stringify(baseUrl)}`,
        );
    }
    return problems;
}

/**
 * The instance label for a batched report; `String()`, as interpolating a symbol throws.
 * @param {unknown} rawValue @returns {string}
 */
function instanceLabel(rawValue) {
    return (rawValue ? String(rawValue).trim() : '') || '<unnamed>';
}

/**
 * Credentials for one WebCommander instance, validated at construction with every problem
 * reported at once. `tokenCachePath` takes a path, or `null` to keep the token in memory only.
 */
export class AuthConfig {
    /**
     * @param {{
     *   baseUrl: string, clientId: string, clientSecret: string,
     *   redirectUri?: string, authString?: string, authBaseUrl?: string | null,
     *   clientName: string, grantType?: string, tokenCachePath?: unknown,
     * }} options
     */
    constructor(options = /** @type {any} */ ({})) {
        /** @readonly @type {string} */ this.baseUrl = /** @type {string} */ (normaliseBaseUrl(options.baseUrl));
        /** @readonly @type {string} */ this.clientId = options.clientId;
        /** @readonly @type {string} */ this.clientSecret = options.clientSecret;
        /** The store token endpoint's redirect URI; unused when `authBaseUrl` is set. @readonly @type {string} */ this.redirectUri =
            options.redirectUri;
        /** The store token endpoint's auth string; unused when `authBaseUrl` is set. @readonly @type {string} */ this.authString =
            options.authString;
        /** The Hykmah origin that issues the token; `null` asks the store at `baseUrl`. @readonly @type {string | null} */ this.authBaseUrl =
            /** @type {string | null} */ (normaliseAuthBaseUrl(options.authBaseUrl ?? null));
        /** @readonly @type {string} */ this.clientName = options.clientName;
        // Defaulted only when absent: `grantType: null` is a mistake, not a blank.
        /** @readonly @type {string} */ this.grantType =
            options.grantType === undefined ? DEFAULT_GRANT_TYPE : options.grantType;
        /** @readonly @type {unknown} */ this.tokenCachePath =
            options.tokenCachePath === undefined ? USE_DEFAULT_TOKEN_CACHE : options.tokenCachePath;

        // Validate first: resolving the sentinel creates a directory an invalid config should not leave behind.
        this.#validate();

        if (this.tokenCachePath === USE_DEFAULT_TOKEN_CACHE) {
            try {
                this.tokenCachePath = buildDefaultTokenCachePath();
            } catch (error) {
                throw new SdkConfigError(
                    `instance ${this.clientName}: tokenCachePath: the default cache directory could not be created ` +
                        `(${error instanceof Error ? error.message : String(error)}); pass a path, or null to keep the token in memory`,
                );
            }
        }

        Object.freeze(this);
    }

    #validate() {
        /** @type {string[]} */
        const problems = [];
        const mistyped = new Set();

        for (const name of REQUIRED_FIELDS) {
            const value = /** @type {any} */ (this)[name];
            if (value != null && typeof value !== 'string') {
                mistyped.add(name);
                problems.push(`${name}: expected a string, got ${typeof value}`);
            }
        }

        if (this.authBaseUrl !== null && typeof this.authBaseUrl !== 'string') {
            mistyped.add('authBaseUrl');
            problems.push(`authBaseUrl: expected a string or null, got ${typeof this.authBaseUrl}`);
        }

        const required = this.authBaseUrl === null ? REQUIRED_FIELDS : HYKMAH_REQUIRED_FIELDS;
        const missing = required.filter(
            (name) => !mistyped.has(name) && !String(/** @type {any} */ (this)[name] ?? '').trim(),
        );
        if (missing.length) problems.push(`missing required values: ${missing.join(', ')}`);

        if (this.baseUrl && !mistyped.has('baseUrl')) {
            problems.push(...problemsWithTheBaseUrl(/** @type {string} */ (this.baseUrl)));
        }

        if (this.authBaseUrl && !mistyped.has('authBaseUrl')) {
            problems.push(...problemsWithTheBaseUrl(this.authBaseUrl, 'authBaseUrl'));
        }

        const tcp = this.tokenCachePath;
        if (tcp !== USE_DEFAULT_TOKEN_CACHE && tcp !== null && tcp !== undefined && typeof tcp !== 'string') {
            problems.push(`tokenCachePath: expected a path or null, got ${typeof tcp}`);
        } else if (typeof tcp === 'string' && !tcp.trim()) {
            problems.push(
                'tokenCachePath: must not be blank — pass null to keep the token in memory, or a path to cache it',
            );
        } else if (typeof tcp === 'string') {
            let isDir;
            try {
                isDir = fs.statSync(tcp).isDirectory();
            } catch {
                isDir = false;
            }
            if (isDir) {
                problems.push(
                    `tokenCachePath: ${JSON.stringify(tcp)} is an existing directory, so nothing could be written to it — ` +
                        'pass the file to write, or null to keep the token in memory',
                );
            }
        }

        if (problems.length) {
            throw new SdkConfigError(`instance ${instanceLabel(this.clientName)}: ${problems.join('; ')}`);
        }
    }

    /** Derive a new validated set of credentials from this one. @param {Record<string, unknown>} changes @returns {AuthConfig} */
    withOverrides(changes = {}) {
        const unknown = Object.keys(changes).filter((key) => !FIELD_NAMES.includes(key));
        if (unknown.length) {
            throw new SdkConfigError(`unknown auth field(s): ${unknown.sort().join(', ')}`);
        }
        /** @type {any} */
        const merged = {};
        for (const name of FIELD_NAMES) merged[name] = /** @type {any} */ (this)[name];
        Object.assign(merged, changes);
        return new AuthConfig(merged);
    }

    /** Whether the token comes from Hykmah rather than from the store itself. @returns {boolean} */
    get usesHykmah() {
        return this.authBaseUrl !== null;
    }

    /** One line, with `clientSecret` and `authString` redacted. @returns {string} */
    toString() {
        const shown = redactFields(this, FIELD_NAMES);
        return `AuthConfig(${shown.join(', ')})`;
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.toString();
    }
}
