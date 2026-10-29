import {TokenProvider} from '../auth/tokenProvider.js';
import {FileTokenStore, MemoryTokenStore, buildCredentialsNamespace} from '../auth/tokenStore.js';
import {ApiResponse, RequestInfo, pathTemplateOf} from './apiResponse.js';
import {renderExchange, renderJsonValue, summarisePayload} from './console.js';
import {BoundResource, registeredResourceNames, resolveResourceModule} from './resourceBinding.js';
import {SdkConfig, VALID_RESPONSE_FORMATS, unsendableHeaderReason} from '../config/sdkConfig.js';
import {dtoMapOf} from '../dto.js';
import {InsecureTransportWarning, SdkError, SdkUsageError} from '../errors.js';
import {requireHttpMethod} from '../http/httpMethod.js';
import {buildQueryParams} from '../http/queryParams.js';
import {isUnsafeMethod} from '../http/retryPolicy.js';
import {
    Transport,
    bufferPayloadStreams,
    encodeRequestBody,
    headerValueText,
    requestCeilings,
    snapshotPayload,
} from '../http/transport.js';
import {buildUrl, findPathParamNames, substitutePathParams} from '../http/urlBuilder.js';
import {redactMapping, redactValue} from '../redaction.js';
import {
    LOG_LEVELS,
    attachLogFile,
    detachLogFile,
    emitLogRecord,
    levelName,
    resolveLevel,
    writeLogFileRecord,
} from './logging.js';

/**
 * One module's endpoint functions with the leading `client` argument already supplied.
 * @template T
 * @typedef {{
 *   [K in keyof T]: T[K] extends (client: any, ...rest: infer R) => infer O ? (...rest: R) => O : never
 * }} BoundModule
 */

/** @typedef {BoundModule<typeof import('../resources/customers/adminCustomers.js')>} BoundAdminCustomers */
/** @typedef {BoundModule<typeof import('../resources/orderFlags/orderFlags.js')>} BoundOrderFlags */
/** @typedef {BoundModule<typeof import('../resources/settings/pageSettings/categoryPage.js')>} BoundCategoryPage */
/** @typedef {BoundModule<typeof import('../resources/settings/pageSettings/checkoutPage.js')>} BoundCheckoutPage */
/** @typedef {BoundModule<typeof import('../resources/settings/pageSettings/productPage.js')>} BoundProductPage */
/** @typedef {BoundModule<typeof import('../resources/settings/pageSettings/shoppingCart.js')>} BoundShoppingCart */
/** @typedef {BoundModule<typeof import('../resources/settings/priceDisplaySettings/priceDisplaySettings.js')>} BoundPriceDisplaySettings */
/** @typedef {BoundModule<typeof import('../resources/settings/animationEffects/animationEffects.js')>} BoundAnimationEffects */
/** @typedef {BoundModule<typeof import('../resources/settings/productListing/productListing.js')>} BoundProductListing */
/** @typedef {BoundModule<typeof import('../resources/settings/customerPortal/customerPortal.js')>} BoundCustomerPortal */
/** @typedef {BoundModule<typeof import('../resources/settings/siteSettings/siteSettings.js')>} BoundSiteSettings */
/** @typedef {BoundModule<typeof import('../resources/settings/seoConfiguration/seoConfiguration.js')>} BoundSeoConfiguration */
/** @typedef {BoundModule<typeof import('../resources/inventoryLocations/inventoryLocations.js')>} BoundInventoryLocations */
/** @typedef {BoundModule<typeof import('../resources/shippingMethods/shippingMethods.js')>} BoundShippingMethods */
/** @typedef {BoundModule<typeof import('../resources/shippingClasses/shippingClasses.js')>} BoundShippingClasses */
/** @typedef {BoundModule<typeof import('../resources/aliases/aliases.js')>} BoundAliases */
/** @typedef {BoundModule<typeof import('../resources/orders/orders.js')>} BoundOrders */
/** @typedef {BoundModule<typeof import('../resources/orderCustomFields/orderCustomFields.js')>} BoundOrderCustomFields */
/** @typedef {BoundModule<typeof import('../resources/blogCategories/blogCategories.js')>} BoundBlogCategories */
/** @typedef {BoundModule<typeof import('../resources/categories/categories.js')>} BoundCategories */
/** @typedef {BoundModule<typeof import('../resources/discountProfiles/discountProfiles.js')>} BoundDiscountProfiles */
/** @typedef {BoundModule<typeof import('../resources/blogs/blogs.js')>} BoundBlogs */
/** @typedef {BoundModule<typeof import('../resources/carts/carts.js')>} BoundCarts */
/** @typedef {BoundModule<typeof import('../resources/products/products.js')>} BoundProducts */
/** @typedef {BoundModule<typeof import('../resources/countries/countries.js')>} BoundCountries */
/** @typedef {BoundModule<typeof import('../resources/customerGroups/customerGroups.js')>} BoundCustomerGroups */
/** @typedef {BoundModule<typeof import('../resources/currencies/currencies.js')>} BoundCurrencies */
/** @typedef {BoundModule<typeof import('../resources/variations/variations.js')>} BoundVariations */
/** @typedef {BoundModule<typeof import('../resources/cities/cities.js')>} BoundCities */
/** @typedef {BoundModule<typeof import('../resources/paymentGateways/paymentGateways.js')>} BoundPaymentGateways */
/** @typedef {BoundModule<typeof import('../resources/taxCodes/taxCodes.js')>} BoundTaxCodes */
/** @typedef {BoundModule<typeof import('../resources/taxProfiles/taxProfiles.js')>} BoundTaxProfiles */
/** @typedef {BoundModule<typeof import('../resources/taxRules/taxRules.js')>} BoundTaxRules */
/** @typedef {BoundModule<typeof import('../resources/taxZones/taxZones.js')>} BoundTaxZones */
/** @typedef {BoundModule<typeof import('../resources/taxSettings/taxSettings.js')>} BoundTaxSettings */
/** @typedef {BoundModule<typeof import('../resources/taxCountryTaxes/taxCountryTaxes.js')>} BoundTaxCountryTaxes */
/** @typedef {BoundModule<typeof import('../resources/taxCustomProfiles/taxCustomProfiles.js')>} BoundTaxCustomProfiles */
/** @typedef {BoundModule<typeof import('../resources/transactions/transactions.js')>} BoundTransactions */
/** @typedef {BoundModule<typeof import('../resources/trash/trash.js')>} BoundTrash */
/** @typedef {BoundModule<typeof import('../resources/email/email.js')>} BoundEmail */
/** @typedef {BoundModule<typeof import('../resources/commonSettings/commonSettings.js')>} BoundCommonSettings */
/** @typedef {BoundModule<typeof import('../resources/pages/pages.js')>} BoundPages */
/** @typedef {BoundModule<typeof import('../resources/settings/pageSettings/searchResultPage.js')>} BoundSearchResultPage */
/** @typedef {BoundModule<typeof import('../resources/settings/shippingSettings/shippingSettings.js')>} BoundShippingSettings */
/** @typedef {BoundModule<typeof import('../resources/settings/searchSettings/searchSettings.js')>} BoundSearchSettings */
/** @typedef {BoundModule<typeof import('../resources/settings/ecommerceSettings/ecommerceSettings.js')>} BoundEcommerceSettings */

const API_VERSION_PARAM = 'api_version';
const LOOPBACK_HOSTNAMES = new Set(['localhost', 'localhost.localdomain']);
const TOKEN_FAILURE_ERROR = 'unauthorized';
const TOKEN_FAILURE_MESSAGES = new Set(['invalid_access_token', 'invalid_request']);

function isLoopbackHost(hostname) {
    if (!hostname) return false;
    const lower = hostname.toLowerCase();
    if (LOOPBACK_HOSTNAMES.has(lower)) return true;
    const bare = hostname.replace(/^\[|\]$/g, '');
    if (bare === '::1') return true;
    return /^127\.\d+\.\d+\.\d+$/.test(bare);
}

function validatePath(path) {
    if (typeof path !== 'string') throw new SdkUsageError(`path must be text, got ${typeof path}`);
    if (!path.trim()) throw new SdkUsageError(`path must name an endpoint, got ${JSON.stringify(path)}`);
    return path;
}

/** Verify a text `jsonBody`; parsed only to verify, never to rewrite. @param {string} jsonBody */
function checkJsonBodyText(jsonBody) {
    let decoded;
    try {
        decoded = JSON.parse(jsonBody);
    } catch (error) {
        throw new SdkUsageError(`jsonBody: not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (decoded === null || typeof decoded !== 'object') {
        throw new SdkUsageError(
            `jsonBody: a JSON string must hold an object or an array, got ${decoded === null ? 'null' : typeof decoded}`,
        );
    }
}

function rejectDuplicatedQueryParams(url, params) {
    if (!params || !Object.keys(params).length) return;
    const existing = new Set([...new URL(url).searchParams.keys()]);
    const clash = Object.keys(params)
        .filter((name) => existing.has(name))
        .sort();
    if (clash.length) {
        throw new SdkUsageError(
            `queryParams ${clash.join(', ')} already appear in the path's own query string, so each would be sent twice with two values and the store chooses — pass them once, in one place`,
        );
    }
}

/** The per-call header values read down to text once, so the header validated is the header sent. */
function materialiseHeaderValues(headers) {
    // No prototype while it is filled: on a `{}`, `materialised['__proto__'] = v` sets one.
    /** @type {Record<string, string | null>} */
    const materialised = Object.create(null);
    for (const [name, value] of Object.entries(headers || {})) materialised[name] = headerValueText(value);
    return Object.freeze(Object.setPrototypeOf(materialised, Object.prototype));
}

/** Freeze a normalised query map and its lists, so the transport and every `RequestInfo` agree. */
function freezeQueryParams(params) {
    for (const value of Object.values(params)) if (Array.isArray(value)) Object.freeze(value);
    return Object.freeze(params);
}

function normalisedReason(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase();
}

/**
 * Whether a 401 means a stale token (`error: 'unauthorized'`, or a token-failure `message`), not a refusal like
 * `account_suspended`; a 401 without an object body counts only on a safe method.
 */
function meansExpiredToken(response, httpMethod) {
    if (response.statusCode !== 401) return false;
    // The decoded body, not `data`: staleness must not depend on the configured response form.
    const data = response.map;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return !isUnsafeMethod(httpMethod);
    }
    const map = /** @type {Record<string, unknown>} */ (data);
    if (normalisedReason(map.error) === TOKEN_FAILURE_ERROR) return true;
    return TOKEN_FAILURE_MESSAGES.has(normalisedReason(map.message));
}

/** A request that never produced a response, for the console. */
class FailedExchange {
    constructor(error) {
        this.succeeded = false;
        this.data = null;
        // The console reads `map`, so this shape has to carry one too.
        this.map = null;
        this.statusCode = 'no response';
        this.headers = {};
        this.requestInfo = error.requestInfo;
    }
}

/** Authenticated access to one WebCommander store. */
export class WebCommanderClient {
    /**
     * @param {SdkConfig} config
     * @param {{ tokenStore?: any, transport?: Transport, retryPolicy?: import('../http/retryPolicy.js').RetryPolicy, tokenProvider?: TokenProvider }} [options]
     */
    constructor(config, options = {}) {
        if (options.transport != null && options.retryPolicy != null) {
            throw new SdkUsageError(
                'pass transport or retryPolicy, not both — an injected transport already carries its own policy',
            );
        }
        /** @private */
        this._config = config;
        /** @private */
        this._loggerName = `webcommander.${loggerSafe(config.clientName)}`;
        /** @private */
        this._logLevel = resolveLevel(config.logLevel);
        /** @type {import('./logging.js').LogFileHandle | null} @private */
        this._logFile = null;
        /** @private */
        this._resourceCache = new Map();
        /** @private */
        this._closed = false;
        /** Accepted calls not yet finished; `closeClient` waits for them. @type {Set<Promise<unknown>>} @private */
        this._inFlight = new Set();
        /** The single teardown, so two `closeClient()` callers wait for one. @type {Promise<void> | null} @private */
        this._closing = null;
        if (config.logFile) {
            this._logFile = attachLogFile(this._loggerName, config.clientName, config.logFile, this._logLevel);
        }

        try {
            if (!config.verifySsl) {
                const message = 'TLS verification is disabled (verifySsl=false); responses cannot be trusted';
                this.#log(LOG_LEVELS.WARNING, message);
                process.emitWarning(message, {type: 'InsecureTransportWarning', ctor: InsecureTransportWarning});
            }
            this.#warnAboutPlaintextTransport();

            // Caller-supplied: its lifetime is theirs, so `closeClient` leaves it open.
            /** @private */
            this._ownsTransport = !options.transport;
            /** @private */
            this._transport =
                options.transport ||
                new Transport(config, {
                    retryPolicy: options.retryPolicy,
                    onProgress: (message) => this.#log(LOG_LEVELS.INFO, message),
                });
            /** @private */
            this._tokenStore = options.tokenStore || WebCommanderClient.#buildTokenStore(config);
            /** @private */
            this._tokenProvider = options.tokenProvider || new TokenProvider(config, this._tokenStore, this._transport);
        } catch (error) {
            this.#detachLogFile();
            throw error;
        }

        const proxy = new Proxy(this, {
            get(target, prop) {
                if (
                    typeof prop === 'symbol' ||
                    (typeof prop === 'string' && (prop.startsWith('_') || prop in target))
                ) {
                    const value = Reflect.get(target, prop, target);
                    // Bound to the real instance, so private fields work through the proxy.
                    return typeof value === 'function' ? value.bind(target) : value;
                }
                if (prop === 'then') return undefined;
                return target.#boundResource(String(prop));
            },
        });
        return proxy;
    }

    #warnAboutPlaintextTransport() {
        const parsed = new URL(this._config.baseUrl);
        if (parsed.protocol.replace(/:$/, '') !== 'http' || isLoopbackHost(parsed.hostname)) return;
        const message = `baseUrl uses http://, so every request to ${parsed.hostname} crosses the network in cleartext — the bearer token, and the credentials in the token request itself. Use https:// unless this is a local development instance`;
        this.#log(LOG_LEVELS.WARNING, message);
        process.emitWarning(message, {type: 'InsecureTransportWarning', ctor: InsecureTransportWarning});
    }

    /** The frozen config this client was built from. @returns {SdkConfig} */
    get config() {
        return this._config;
    }

    /** The instance label, i.e. `config.clientName`. @returns {string} */
    get name() {
        return this._config.clientName;
    }

    /**
     * Send one request and return the response; refuses once `closeClient` has been called.
     * @param {string} httpMethod @param {string} requestPath
     * @param {{
     *   pathParams?: Record<string, unknown>, queryParams?: Record<string, unknown>,
     *   jsonBody?: unknown, formData?: unknown, files?: unknown,
     *   headers?: Record<string, string | Uint8Array>, authenticated?: boolean, raiseOnError?: boolean | null,
     *   responseFormat?: string | null, dtoType?: any,
     * }} [options] `jsonBody` is an object, an array, a raw JSON string or a payload DTO
     * @returns {Promise<ApiResponse>}
     */
    async sendApiRequest(httpMethod, requestPath, options = {}) {
        // Accept then register with no await between, so a call is either refused or in the set `closeClient` drains.
        this.#refuseWhenClosed();
        const running = this.#performApiRequest(httpMethod, requestPath, options);
        this._inFlight.add(running);
        try {
            return await running;
        } finally {
            this._inFlight.delete(running);
        }
    }

    async #performApiRequest(httpMethod, requestPath, options) {
        // Read once: `options` is the caller's object and could answer differently across the awaits below.
        const {
            pathParams,
            queryParams,
            jsonBody: suppliedJsonBody,
            formData: suppliedFormData,
            files: suppliedFiles,
            headers: suppliedHeaders,
            authenticated,
            raiseOnError,
            responseFormat: perCallResponseFormat,
            dtoType,
        } = options;
        const authenticate = authenticated !== false;
        const shouldRaise = raiseOnError == null ? this._config.raiseOnError : raiseOnError;

        const method = requireHttpMethod(httpMethod);
        const path = validatePath(requestPath);
        const jsonBody = dtoMapOf(suppliedJsonBody);
        const jsonBodyText = this.#materialiseJsonBody(jsonBody, suppliedFormData, suppliedFiles);
        const responseFormat = this.#resolveResponseFormat(perCallResponseFormat);
        const perCallHeaders = materialiseHeaderValues(suppliedHeaders);
        // Refused before the grant: a caller mistake must not cost a token request.
        this.#refuseUnsendableHeaders(perCallHeaders);

        const endpoint = pathTemplateOf(path);
        const resolvedPath = substitutePathParams(path, this.#seedApiVersion(path, pathParams));
        const url = buildUrl(this._config.baseUrl, resolvedPath);
        const normalisedParams = freezeQueryParams(buildQueryParams(queryParams));
        rejectDuplicatedQueryParams(url, normalisedParams);

        const [payloadFiles, payloadForm] = snapshotPayload(suppliedFiles, suppliedFormData);

        const reportedBody = jsonBodyText === null ? payloadForm : JSON.parse(jsonBodyText);
        const requestBodySummary = redactValue(summarisePayload(reportedBody, payloadFiles));
        const formEncoded = jsonBodyText === null && payloadForm != null;

        const ceilings = requestCeilings(this._config);
        const [files, formData] = await bufferPayloadStreams(payloadFiles, payloadForm, ceilings);
        const wireBody = await encodeRequestBody(jsonBodyText, formData, files, ceilings);
        const baseHeaders = Object.freeze(this.#buildRequestHeaders(perCallHeaders));

        const accessToken = authenticate ? await this._tokenProvider.getAccessToken() : null;

        const sendOnce = async (token) => {
            const requestHeaders = token ? {...baseHeaders, Authorization: `Bearer ${token}`} : {...baseHeaders};
            let parts;
            try {
                parts = await this._transport.sendHttpRequest({
                    method,
                    url,
                    endpoint,
                    params: normalisedParams,
                    body: wireBody,
                    headers: requestHeaders,
                });
            } catch (error) {
                if (error instanceof SdkError && error.requestInfo != null) {
                    this.#reportExchange(
                        new FailedExchange(error),
                        reportedBody,
                        payloadFiles,
                        LOG_LEVELS.ERROR,
                        formEncoded,
                    );
                }
                throw error;
            }
            return new ApiResponse({
                statusCode: parts.statusCode,
                data: parts.data,
                bodyText: parts.bodyText,
                responseFormat,
                dtoType,
                headers: parts.headers,
                contentType: parts.contentType,
                requestInfo: new RequestInfo({
                    clientName: this._config.clientName,
                    apiVersion: this._config.apiVersion,
                    httpMethod: method,
                    url,
                    // Kept privately: `iterPages` tells pages apart by query values the printed `url` redacts.
                    resolvedUrl: parts.resolvedUrl,
                    endpoint,
                    queryParams: normalisedParams,
                    headers: redactMapping(requestHeaders),
                    body: requestBodySummary,
                    attemptCount: parts.attemptCount,
                    maxAttempts: parts.maxAttempts,
                    elapsedSeconds: parts.elapsedSeconds,
                }),
            });
        };

        let response = await sendOnce(accessToken);

        if (authenticate && meansExpiredToken(response, method)) {
            // Replayed whatever the payload: the second send writes the bytes the first attempt wrote.
            this.#reportExchange(response, reportedBody, payloadFiles, LOG_LEVELS.WARNING, formEncoded);
            response = await sendOnce(await this._tokenProvider.refreshAccessToken(accessToken));
        }

        this.#reportExchange(response, reportedBody, payloadFiles, LOG_LEVELS.INFO, formEncoded);

        if (shouldRaise) response.raiseForStatus();
        return response;
    }

    /**
     * `GET` one path; retried on a transport error or a retryable status when `maxRetries` allows another attempt.
     * @param {string} requestPath path, with `{...}` placeholders — `{api_version}` fills itself
     * @param {object} [options] `{queryParams, headers, raiseOnError, authenticated}` @returns {Promise<ApiResponse>}
     */
    async sendGetRequest(requestPath, options) {
        return this.sendApiRequest('GET', requestPath, options);
    }

    /**
     * `POST` one path; not retried on a `500` unless `unsafeRetryableHttpCodes` names it.
     * @param {string} requestPath @param {object} [options] `{jsonBody, files, formData, pathParams, queryParams, raiseOnError}`
     */
    async sendPostRequest(requestPath, options) {
        return this.sendApiRequest('POST', requestPath, options);
    }

    /**
     * `PUT` one path; whether the store replaces or merges is per endpoint.
     * @param {string} requestPath @param {object} [options] @returns {Promise<ApiResponse>}
     */
    async sendPutRequest(requestPath, options) {
        return this.sendApiRequest('PUT', requestPath, options);
    }

    /** `PATCH` one path — send only the fields being changed. @param {string} requestPath @param {object} [options] @returns {Promise<ApiResponse>} */
    async sendPatchRequest(requestPath, options) {
        return this.sendApiRequest('PATCH', requestPath, options);
    }

    /** `DELETE` one path; a `204` carries no body, so `response.data` is `null`. @param {string} requestPath @param {object} [options] @returns {Promise<ApiResponse>} */
    async sendDeleteRequest(requestPath, options) {
        return this.sendApiRequest('DELETE', requestPath, options);
    }

    /**
     * Release the pool and the log file this client holds, and latch closed; later requests raise.
     * @returns {Promise<void>}
     */
    async closeClient() {
        if (this._closing) return this._closing;
        // Latched before anything is awaited, so from here a call is either refused or drained.
        this._closed = true;
        this._closing = (async () => {
            try {
                // Settled, not resolved: a call that fails has still finished with the resources.
                while (this._inFlight.size) await Promise.allSettled([...this._inFlight]);
                if (this._ownsTransport) await this._transport.closeTransport();
            } finally {
                this._resourceCache.clear();
                this.#detachLogFile();
            }
        })();
        return this._closing;
    }

    /** @returns {BoundAdminCustomers} */
    get adminCustomers() {
        return /** @type {any} */ (this.#boundResource('adminCustomers'));
    }

    /** @returns {BoundOrderFlags} */
    get orderFlags() {
        return /** @type {any} */ (this.#boundResource('orderFlags'));
    }

    /** @returns {BoundCategoryPage} */
    get categoryPage() {
        return /** @type {any} */ (this.#boundResource('categoryPage'));
    }

    /** @returns {BoundCheckoutPage} */
    get checkoutPage() {
        return /** @type {any} */ (this.#boundResource('checkoutPage'));
    }

    /** @returns {BoundProductPage} */
    get productPage() {
        return /** @type {any} */ (this.#boundResource('productPage'));
    }

    /** @returns {BoundShoppingCart} */
    get shoppingCart() {
        return /** @type {any} */ (this.#boundResource('shoppingCart'));
    }

    /** @returns {BoundPriceDisplaySettings} */
    get priceDisplaySettings() {
        return /** @type {any} */ (this.#boundResource('priceDisplaySettings'));
    }

    /** @returns {BoundAnimationEffects} */
    get animationEffects() {
        return /** @type {any} */ (this.#boundResource('animationEffects'));
    }

    /** @returns {BoundProductListing} */
    get productListing() {
        return /** @type {any} */ (this.#boundResource('productListing'));
    }

    /** @returns {BoundCustomerPortal} */
    get customerPortal() {
        return /** @type {any} */ (this.#boundResource('customerPortal'));
    }

    /** @returns {BoundSiteSettings} */
    get siteSettings() {
        return /** @type {any} */ (this.#boundResource('siteSettings'));
    }

    /** @returns {BoundSeoConfiguration} */
    get seoConfiguration() {
        return /** @type {any} */ (this.#boundResource('seoConfiguration'));
    }

    /** @returns {BoundInventoryLocations} */
    get inventoryLocations() {
        return /** @type {any} */ (this.#boundResource('inventoryLocations'));
    }

    /** @returns {BoundShippingMethods} */
    get shippingMethods() {
        return /** @type {any} */ (this.#boundResource('shippingMethods'));
    }

    /** @returns {BoundShippingClasses} */
    get shippingClasses() {
        return /** @type {any} */ (this.#boundResource('shippingClasses'));
    }

    /** @returns {BoundAliases} */
    get aliases() {
        return /** @type {any} */ (this.#boundResource('aliases'));
    }

    /** @returns {BoundOrders} */
    get orders() {
        return /** @type {any} */ (this.#boundResource('orders'));
    }

    /** @returns {BoundOrderCustomFields} */
    get orderCustomFields() {
        return /** @type {any} */ (this.#boundResource('orderCustomFields'));
    }

    /** @returns {BoundBlogCategories} */
    get blogCategories() {
        return /** @type {any} */ (this.#boundResource('blogCategories'));
    }

    /** @returns {BoundCategories} */
    get categories() {
        return /** @type {any} */ (this.#boundResource('categories'));
    }

    /** @returns {BoundDiscountProfiles} */
    get discountProfiles() {
        return /** @type {any} */ (this.#boundResource('discountProfiles'));
    }

    /** @returns {BoundBlogs} */
    get blogs() {
        return /** @type {any} */ (this.#boundResource('blogs'));
    }

    /** @returns {BoundCarts} */
    get carts() {
        return /** @type {any} */ (this.#boundResource('carts'));
    }

    /** @returns {BoundProducts} */
    get products() {
        return /** @type {any} */ (this.#boundResource('products'));
    }

    /** @returns {BoundCountries} */
    get countries() {
        return /** @type {any} */ (this.#boundResource('countries'));
    }

    /** @returns {BoundCustomerGroups} */
    get customerGroups() {
        return /** @type {any} */ (this.#boundResource('customerGroups'));
    }

    /** @returns {BoundCurrencies} */
    get currencies() {
        return /** @type {any} */ (this.#boundResource('currencies'));
    }

    /** @returns {BoundVariations} */
    get variations() {
        return /** @type {any} */ (this.#boundResource('variations'));
    }

    /** @returns {BoundCities} */
    get cities() {
        return /** @type {any} */ (this.#boundResource('cities'));
    }

    /** @returns {BoundPaymentGateways} */
    get paymentGateways() {
        return /** @type {any} */ (this.#boundResource('paymentGateways'));
    }

    /** @returns {BoundTaxCodes} */
    get taxCodes() {
        return /** @type {any} */ (this.#boundResource('taxCodes'));
    }

    /** @returns {BoundTaxProfiles} */
    get taxProfiles() {
        return /** @type {any} */ (this.#boundResource('taxProfiles'));
    }

    /** @returns {BoundTaxRules} */
    get taxRules() {
        return /** @type {any} */ (this.#boundResource('taxRules'));
    }

    /** @returns {BoundTaxZones} */
    get taxZones() {
        return /** @type {any} */ (this.#boundResource('taxZones'));
    }

    /** @returns {BoundTaxSettings} */
    get taxSettings() {
        return /** @type {any} */ (this.#boundResource('taxSettings'));
    }

    /** @returns {BoundTaxCountryTaxes} */
    get taxCountryTaxes() {
        return /** @type {any} */ (this.#boundResource('taxCountryTaxes'));
    }

    /** @returns {BoundTaxCustomProfiles} */
    get taxCustomProfiles() {
        return /** @type {any} */ (this.#boundResource('taxCustomProfiles'));
    }

    /** @returns {BoundTransactions} */
    get transactions() {
        return /** @type {any} */ (this.#boundResource('transactions'));
    }

    /** @returns {BoundTrash} */
    get trash() {
        return /** @type {any} */ (this.#boundResource('trash'));
    }

    /** @returns {BoundEmail} */
    get email() {
        return /** @type {any} */ (this.#boundResource('email'));
    }

    /** @returns {BoundCommonSettings} */
    get commonSettings() {
        return /** @type {any} */ (this.#boundResource('commonSettings'));
    }

    /** @returns {BoundPages} */
    get pages() {
        return /** @type {any} */ (this.#boundResource('pages'));
    }

    /** @returns {BoundSearchResultPage} */
    get searchResultPage() {
        return /** @type {any} */ (this.#boundResource('searchResultPage'));
    }

    /** @returns {BoundShippingSettings} */
    get shippingSettings() {
        return /** @type {any} */ (this.#boundResource('shippingSettings'));
    }

    /** @returns {BoundSearchSettings} */
    get searchSettings() {
        return /** @type {any} */ (this.#boundResource('searchSettings'));
    }

    /** @returns {BoundEcommerceSettings} */
    get ecommerceSettings() {
        return /** @type {any} */ (this.#boundResource('ecommerceSettings'));
    }

    #boundResource(name) {
        const cached = this._resourceCache.get(name);
        if (cached) return cached;
        const bound = new BoundResource(this, resolveResourceModule(name));
        this._resourceCache.set(name, bound);
        return bound;
    }

    /** Every registered resource name, e.g. `['adminCustomers', 'seoConfiguration']`. @returns {string[]} */
    listResourceNames() {
        return registeredResourceNames();
    }

    /** @param {SdkConfig} config @returns {any} */
    static #buildTokenStore(config) {
        if (config.tokenCachePath) {
            return new FileTokenStore(
                // AuthConfig resolved the sentinel, so anything truthy here is a path.
                /** @type {string} */ (config.tokenCachePath),
                buildCredentialsNamespace({
                    baseUrl: config.baseUrl,
                    clientId: config.clientId,
                    clientSecret: config.clientSecret,
                    authString: config.authString,
                    grantType: config.grantType,
                }),
                {maxBytes: config.maxTokenCacheBytes},
            );
        }
        return new MemoryTokenStore();
    }

    /** Refuse a request on a closed client, named so a process holding several says which. */
    #refuseWhenClosed() {
        if (!this._closed) return;
        throw new SdkUsageError(
            `client ${JSON.stringify(this._config.clientName)} is closed: closeClient() latched it shut, ` +
                'so it cannot send this request — build a new client with buildClient() rather than reusing a closed one',
        );
    }

    /** The form `data` will present: the per-call value if given, else the client's. */
    #resolveResponseFormat(perCall) {
        if (perCall == null) return this._config.responseFormat;
        if (typeof perCall !== 'string' || !VALID_RESPONSE_FORMATS.includes(perCall.trim().toLowerCase())) {
            throw new SdkUsageError(
                `responseFormat: expected one of ${VALID_RESPONSE_FORMATS.join(', ')}, got ${JSON.stringify(perCall)}`,
            );
        }
        return perCall.trim().toLowerCase();
    }

    /** Fill `{api_version}` from the config when the caller did not name it. */
    #seedApiVersion(path, pathParams) {
        const resolved = {...(pathParams || {})};
        if (findPathParamNames(path).includes(API_VERSION_PARAM) && !(API_VERSION_PARAM in resolved)) {
            resolved[API_VERSION_PARAM] = this._config.apiVersion;
        }
        return resolved;
    }

    /** Refuse a per-call header the wire cannot carry, before the token grant. */
    #refuseUnsendableHeaders(headers) {
        for (const [name, value] of Object.entries(headers)) {
            const unsendable = unsendableHeaderReason(name, value);
            if (unsendable !== null) throw new SdkUsageError(unsendable);
        }
    }

    /** Merge SDK, `defaultHeaders` and per-call headers, last wins, case-insensitive; `Authorization` is fixed. */
    #buildRequestHeaders(headers) {
        /** @type {Map<string, [string, string]>} */
        const merged = new Map();
        const own = {Accept: 'application/json', 'User-Agent': this._config.userAgent};
        const setPair = (name, value) => merged.set(name.toLowerCase(), [name, value]);
        for (const [name, value] of Object.entries(own)) setPair(name, value);
        for (const [name, value] of Object.entries(this._config.defaultHeadersDict)) setPair(name, value);
        for (const [name, valueText] of Object.entries(headers)) {
            if (name.toLowerCase() === 'authorization') continue;
            setPair(name, /** @type {string} */ (valueText));
        }

        // Prototype-less: a literal would answer a function for a lower-cased `'constructor'`.
        const canonical = Object.assign(Object.create(null), {
            authorization: 'Authorization',
            accept: 'Accept',
            'user-agent': 'User-Agent',
        });
        /** @type {Record<string, string>} */
        const out = Object.create(null);
        for (const [lower, [name, value]] of merged) {
            out[canonical[lower] || name] = value;
        }
        return Object.setPrototypeOf(out, Object.prototype);
    }

    /** Refuse two payloads or a body JSON cannot carry, then serialise once, so the text validated is the text sent. */
    #materialiseJsonBody(jsonBody, formData, files) {
        if (jsonBody != null && formData != null) {
            throw new SdkUsageError(
                'pass jsonBody or formData, not both — they are different content types and only one can be sent',
            );
        }
        if (jsonBody != null && files != null) {
            throw new SdkUsageError(
                'pass jsonBody or files, not both — a multipart body replaces the JSON one, so the JSON would be discarded unsent',
            );
        }
        if (jsonBody == null) return null;
        if (typeof jsonBody === 'string') {
            checkJsonBodyText(jsonBody);
            return jsonBody;
        }
        if (typeof jsonBody !== 'object') {
            throw new SdkUsageError(`jsonBody must be an object, an array or a JSON string, got ${typeof jsonBody}`);
        }
        let text;
        try {
            text = JSON.stringify(jsonBody);
        } catch (error) {
            throw new SdkUsageError(
                `jsonBody is not JSON-serialisable: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
        if (typeof text !== 'string') {
            // `JSON.stringify` gives undefined for a value with no JSON form, which would send `undefined`.
            throw new SdkUsageError(
                'jsonBody has no JSON form: it serialised to nothing at all, so there would be no body to send',
            );
        }
        return text;
    }

    /** Release this client's claim on the shared log-file handler. */
    #detachLogFile() {
        detachLogFile(this._logFile);
        this._logFile = null;
    }

    #log(level, message) {
        if (level < this._logLevel) return;
        const record = {
            loggerName: this._loggerName,
            clientName: this._config.clientName,
            level,
            levelName: levelName(level),
            message,
            timestamp: new Date(),
        };
        writeLogFileRecord(this._logFile, record);
        emitLogRecord(record);
    }

    /** Print the exchange if the `print*` flags ask for it, and log one line either way. */
    #reportExchange(response, body, files, level, formEncoded) {
        const config = this._config;
        const wantsPrint =
            config.printApiInfo ||
            config.printRequestPayload ||
            config.printResponseBody ||
            config.printHeaders ||
            config.printCurl;
        if (wantsPrint && !(config.printOnlyOnError && response.succeeded)) {
            console.log(renderExchange(response, body, files, config, {formEncoded}));
        }
        const info = response.requestInfo;
        if (info) {
            this.#log(
                level,
                `${info.httpMethod} ${info.endpoint ?? ''} -> ${response.statusCode} in ${info.elapsedSeconds}s (attempt ${info.attemptCount}/${info.maxAttempts})`,
            );
        }
        if (config.logBodies) {
            this.#log(
                LOG_LEVELS.DEBUG,
                `payload=${renderJsonValue(redactValue(body), {compact: true})} response=${renderJsonValue(redactValue(response.map), {compact: true})}`,
            );
        }
    }
}

/**
 * @param {number | string | null} [instance] position, `clientName`, or null for the first
 * @param {{credentials?: unknown[]} & import('../config/sdkConfig.js').SdkOptions} [options]
 *   any `SdkConfig` setting, plus `credentials` to bypass the registry
 * @returns {Promise<WebCommanderClient>}
 */
export async function buildClient(instance = null, options = {}) {
    const {credentials, ...overrides} = options;
    let blocks = credentials;
    if (blocks === undefined) {
        const {getRegisteredInstances} = await import('./clientRegistry.js');
        blocks = getRegisteredInstances();
    }
    return new WebCommanderClient(SdkConfig.fromCredentials(blocks, {instance, ...overrides}));
}

function loggerSafe(clientName) {
    return encodeURIComponent(clientName).replace(/\./g, '%2E');
}
