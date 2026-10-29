import {
    SdkAuthError,
    SdkError,
    SdkUsageError,
    TokenCacheError,
    TokenCacheWriteWarning,
    describeCause,
} from '../errors.js';
import {redactFields, redactMapping} from '../redaction.js';
import {ApiResponse, RequestInfo} from '../client/apiResponse.js';

export const TOKEN_PATH_TEMPLATE = '/api/{api_version}/oauth2/token';
export const DEFAULT_TOKEN_TTL_SECONDS = 3600;
export const EXPIRY_SKEW_SECONDS = 60;
export const MAX_TOKEN_TTL_SECONDS = 24 * 60 * 60;
const REFRESH_GRANT_TYPE = 'refresh_token';

/** The `b64token` grammar of RFC 6750 §2.1: what an `Authorization: Bearer …` value may be. */
const BEARER_B64TOKEN = /^[A-Za-z0-9\-._~+/]+=*$/;

/** RFC 6749 A.17 `refresh-token`: `1*VSCHAR`, not the Bearer grammar — it never reaches a header. */
const REFRESH_TOKEN_VSCHAR = /^[\x20-\x7e]+$/;

/** Why a credential is outside its grammar, or `null`; never carries the value. */
function tokenProblem(name, value, pattern, grammar) {
    if (typeof value !== 'string') return `${name}: expected a string, got ${value === null ? 'null' : typeof value}`;
    if (!value) return `${name}: empty`;
    if (!pattern.test(value)) return `${name}: ${value.length} character(s) outside ${grammar}`;
    return null;
}

/** The token endpoint path: `buildTokenPath('v4')` → `/api/v4/oauth2/token`. @param {string} apiVersion @returns {string} */
export function buildTokenPath(apiVersion) {
    return TOKEN_PATH_TEMPLATE.replace('{api_version}', apiVersion);
}

/** Default clock in seconds since the epoch. */
const defaultNow = () => Date.now() / 1000;

/** An access token and when it stops being usable; both credentials are checked at construction. */
export class TokenRecord {
    /**
     * @param {{ accessToken: string, refreshToken?: string | null, expiresAt: number, skewSeconds?: number }} options
     * @throws {SdkUsageError} either credential is outside the grammar its destination requires
     */
    constructor(options) {
        const accessProblem = tokenProblem(
            'access_token',
            options.accessToken,
            BEARER_B64TOKEN,
            'the Bearer b64token grammar of RFC 6750 §2.1',
        );
        if (accessProblem !== null) throw new SdkUsageError(accessProblem);
        const refreshSupplied = options.refreshToken ?? null;
        if (refreshSupplied !== null) {
            const refreshProblem = tokenProblem(
                'refresh_token',
                refreshSupplied,
                REFRESH_TOKEN_VSCHAR,
                'the 1*VSCHAR grammar of RFC 6749 Appendix A.17',
            );
            if (refreshProblem !== null) throw new SdkUsageError(refreshProblem);
        }
        /** @readonly @type {string} */
        this.accessToken = options.accessToken;
        /** @readonly @type {string | null} */
        this.refreshToken = refreshSupplied;
        /** @readonly @type {number} seconds since the epoch */
        this.expiresAt = options.expiresAt;
        /** @readonly @type {number} */
        this.skewSeconds = options.skewSeconds ?? EXPIRY_SKEW_SECONDS;
        Object.freeze(this);
    }

    /** Whether the token should be treated as expired. @param {number | null} [skewSeconds] @returns {boolean} */
    needsRefresh(skewSeconds = null) {
        const effectiveSkew = skewSeconds == null ? this.skewSeconds : skewSeconds;
        const nowSeconds = defaultNow();
        if (this.expiresAt - nowSeconds > MAX_TOKEN_TTL_SECONDS) return true;
        return nowSeconds >= this.expiresAt - effectiveSkew;
    }

    /** The stored form, with the API's own snake_case keys. @returns {Record<string, unknown>} */
    toDict() {
        return {
            access_token: this.accessToken,
            refresh_token: this.refreshToken,
            expires_at: this.expiresAt,
            skew_seconds: this.skewSeconds,
        };
    }

    /**
     * Rebuild from a stored record; one that is present and does not decode is corrupt, not absent.
     * @param {Record<string, unknown> | null | undefined} record
     * @returns {TokenRecord | null} `null` when nothing is cached
     * @throws {TokenCacheError} the record is present and does not decode
     */
    static fromDict(record) {
        if (record === null || record === undefined) return null;
        if (typeof record !== 'object' || Array.isArray(record)) {
            throw corruptRecord(
                `expected an object of token fields, got ${Array.isArray(record) ? 'an array' : typeof record}`,
            );
        }
        // A record with no fields is the empty cache a fresh namespace starts as.
        if (!Object.keys(record).length) return null;

        const expiresAt = record.expires_at;
        if (typeof expiresAt !== 'number' || !Number.isFinite(expiresAt)) {
            throw corruptRecord(`expires_at: expected a finite number of seconds, got ${typeof expiresAt}`);
        }
        let skewSeconds = record.skew_seconds;
        if (typeof skewSeconds !== 'number' || !Number.isFinite(skewSeconds) || skewSeconds < 0) {
            skewSeconds = EXPIRY_SKEW_SECONDS;
        }
        // Absent is fine — a grant may issue no refresh credential. Present and unusable is not.
        try {
            return new TokenRecord({
                accessToken: /** @type {string} */ (record.access_token),
                refreshToken: /** @type {string | null} */ (record.refresh_token ?? null),
                expiresAt,
                skewSeconds: /** @type {number} */ (skewSeconds),
            });
        } catch (error) {
            if (error instanceof SdkUsageError) throw corruptRecord(error.message);
            throw error;
        }
    }

    /**
     * One line: credentials redacted and the expiry withheld, since the pair identifies the grant.
     * @returns {string}
     */
    toString() {
        const shown = redactFields(this, ['accessToken', 'refreshToken']);
        const expired = this.needsRefresh() ? 'yes' : 'no';
        return `TokenRecord(${shown.join(', ')}, needsRefresh=${expired}, expiresAt=<withheld>, skewSeconds=<withheld>)`;
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return this.toString();
    }

    /**
     * What `JSON.stringify` renders: the redacted line, since credentials are enumerable properties.
     * @returns {string}
     */
    toJSON() {
        return this.toString();
    }
}

/** The failure classes that mean the code is wrong rather than the filesystem. */
const PROGRAMMING_FAILURES = Object.freeze([TypeError, ReferenceError, RangeError, SyntaxError, EvalError]);

/** Report a minted token that could not be cached: a refusal warns and the call succeeds; a bug re-raises. */
function reportCacheWriteRefusal(error) {
    if (PROGRAMMING_FAILURES.some((kind) => error instanceof kind)) throw error;
    process.emitWarning(
        `the access token was minted but could not be cached (${describeCause(error)}). The call succeeds and the ` +
            'token is usable; the next process will mint its own rather than reuse this one. Listen for the ' +
            "'warning' event with name TokenCacheWriteWarning to surface this",
        {type: 'TokenCacheWriteWarning', ctor: TokenCacheWriteWarning},
    );
}

/** The refusal for a cached record that is present but undecodable: `reason: 'corrupt'`, not absence. */
function corruptRecord(detail) {
    return new TokenCacheError(
        `the cached token record is unusable (${detail}); it is not treated as an empty cache, because writing ` +
            'over it would discard the entries of every other credential sharing this file — clear this namespace ' +
            'with clearAccessToken(), or remove the cache file',
        {reason: 'corrupt'},
    );
}

export class TokenProvider {
    /**
     * @param {any} config
     * @param {import('./tokenStore.js').TokenStore} tokenStore
     * @param {import('../http/transport.js').Transport} transport
     */
    constructor(config, tokenStore, transport) {
        /** @private */
        this._config = config;
        /** @private */
        this._tokenStore = tokenStore;
        /** @private */
        this._transport = transport;
        /** @private */
        this._tokenPath = buildTokenPath(config.apiVersion);
    }

    /** The absolute token endpoint URL. @returns {string} */
    get tokenUrl() {
        return this._config.baseUrl + this._tokenPath;
    }

    /** A usable token, from the cache when one is still good. @returns {Promise<string>} */
    async getAccessToken() {
        const record = TokenRecord.fromDict(await this._tokenStore.readTokenRecord());
        if (record && !record.needsRefresh()) return record.accessToken;
        return this.#renewAccessToken(null, true);
    }

    /** Mint a token to replace one the store rejected. @param {string | null} staleAccessToken @returns {Promise<string>} */
    async refreshAccessToken(staleAccessToken) {
        return this.#renewAccessToken(staleAccessToken, false);
    }

    async clearAccessToken() {
        await this._tokenStore.clearTokenRecord();
    }

    async #renewAccessToken(staleAccessToken, anyCachedTokenWillDo) {
        return this._tokenStore.acquireTokenRefreshLock(async () => {
            const record = TokenRecord.fromDict(await this._tokenStore.readTokenRecord());
            if (record && !record.needsRefresh()) {
                if (anyCachedTokenWillDo || (staleAccessToken !== null && record.accessToken !== staleAccessToken)) {
                    return record.accessToken;
                }
            }

            let newRecord = null;
            if (record && record.refreshToken) {
                newRecord = await this.#requestTokenWithRefreshGrant(record.refreshToken);
            }
            if (newRecord === null) {
                newRecord = await this.#requestTokenWithCredentials();
            }

            try {
                await this._tokenStore.writeTokenRecord(newRecord.toDict());
            } catch (error) {
                reportCacheWriteRefusal(error);
            }
            return newRecord.accessToken;
        });
    }

    async #requestTokenWithCredentials() {
        const response = await this.#send(credentialsPayload(this._config));
        if (!response.succeeded) {
            const messages = response.getErrorMessages();
            // Structural: an uncaught error prints this, and the grant's own reason names the refused client id.
            const error = new SdkAuthError(
                `token request failed with ${response.statusCode} and ${messages.length} reported message(s); ` +
                    "read getErrorMessages() for the store's own text",
                {
                    statusCode: response.statusCode,
                    errorType: response.errorType,
                    rawResponse: response.map,
                    responseHeaders: redactMapping(response.headers),
                    requestInfo: response.requestInfo,
                },
            );
            for (const message of messages) error.addError(message);
            throw error;
        }
        // `map`, not `data`: authentication must not depend on the configured response form.
        return this.#buildTokenRecord(response.map, response, null);
    }

    async #requestTokenWithRefreshGrant(refreshToken) {
        let response;
        try {
            response = await this.#send({
                grant_type: REFRESH_GRANT_TYPE,
                refresh_token: refreshToken,
                redirect_uri: this._config.redirectUri,
                client_id: this._config.clientId,
                client_secret: this._config.clientSecret,
            });
        } catch (error) {
            if (error instanceof SdkError) return null;
            throw error;
        }
        if (!response.succeeded) return null;
        try {
            return this.#buildTokenRecord(response.map, response, refreshToken);
        } catch (error) {
            if (error instanceof SdkError) return null;
            throw error;
        }
    }

    async #send(body) {
        const parts = await this._transport.sendHttpRequest({
            method: 'POST',
            url: this.tokenUrl,
            endpoint: TOKEN_PATH_TEMPLATE,
            jsonBody: body,
            headers: {
                Accept: 'application/json',
                'User-Agent': this._config.userAgent,
            },
        });
        return new ApiResponse({
            statusCode: parts.statusCode,
            data: parts.data,
            bodyText: parts.bodyText,
            headers: parts.headers,
            contentType: parts.contentType,
            requestInfo: new RequestInfo({
                clientName: this._config.clientName,
                apiVersion: this._config.apiVersion,
                httpMethod: 'POST',
                url: this.tokenUrl,
                endpoint: TOKEN_PATH_TEMPLATE,
                queryParams: {},
                headers: {},
                attemptCount: parts.attemptCount,
                maxAttempts: parts.maxAttempts,
                elapsedSeconds: parts.elapsedSeconds,
            }),
        });
    }

    /** The record a grant response decodes to; nothing is coerced, so a non-string value fails here. */
    #buildTokenRecord(body, response, previousRefreshToken) {
        const grantFailure = (/** @type {string} */ detail) =>
            new SdkAuthError(`token response did not carry a usable credential: ${detail}`, {
                statusCode: response.statusCode,
                rawResponse: body,
                requestInfo: response.requestInfo,
            });
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            throw grantFailure(
                `expected an object of token fields, got ${Array.isArray(body) ? 'an array' : typeof body}`,
            );
        }
        const map = /** @type {Record<string, unknown>} */ (body);

        let ttlSeconds = Number(map.expires_in);
        if (map.expires_in == null || !Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
            ttlSeconds = DEFAULT_TOKEN_TTL_SECONDS;
        }
        ttlSeconds = Math.min(ttlSeconds, MAX_TOKEN_TTL_SECONDS);

        // No refresh credential leaves the one already held; an unusable one fails, not falls back.
        try {
            return new TokenRecord({
                accessToken: /** @type {string} */ (map.access_token),
                refreshToken: /** @type {string | null} */ (map.refresh_token ?? previousRefreshToken),
                expiresAt: defaultNow() + ttlSeconds,
                skewSeconds: Math.min(EXPIRY_SKEW_SECONDS, ttlSeconds / 2),
            });
        } catch (error) {
            if (error instanceof SdkUsageError) throw grantFailure(error.message);
            throw error;
        }
    }
}

function credentialsPayload(config) {
    return {
        grant_type: config.grantType,
        auth_string: config.authString,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
    };
}
