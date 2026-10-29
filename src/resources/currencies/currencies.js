import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as currenciesUrls from './currenciesUrls.js';
import {Currency, CurrencyBaseChange, CurrencyCount, CurrencyPage} from './currenciesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CurrencyPayload */

const requireClient = clientCheck(
    'currencies.listCurrencies(client, {search: "dollar"})',
    'client.currencies.listCurrencies({search: "dollar"})',
);

/**
 * `GET /admin/currencies` — list the currencies by ascending `id`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CurrencyPage>>}
 */
export function listCurrencies(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(currenciesUrls.CURRENCIES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CurrencyPage,
    });
}

/**
 * `HEAD /admin/currencies` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCurrencies(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', currenciesUrls.CURRENCIES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/currencies/count` — a bare `{"total": N}`; `search` and `active` narrow it as they narrow the
 * listing, and `limit` is ignored.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CurrencyCount>>}
 */
export function countCurrencies(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(currenciesUrls.CURRENCIES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CurrencyCount,
    });
}

/**
 * `HEAD /admin/currencies/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCurrenciesCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', currenciesUrls.CURRENCIES_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/currencies` — create a currency from a bare record, answered `201`.
 * @param {Client} client
 * @param {CurrencyPayload} payload a `CurrencyInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Currency>>}
 */
export function createCurrency(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(currenciesUrls.CURRENCIES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[currenciesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: Currency,
    });
}

/**
 * `GET /admin/currencies/{currency_id}` — one currency, with an `ETag`; `field_metadata` adds the schema beside it.
 * @param {Client} client @param {number|string} currencyId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Currency>>}
 */
export function getCurrency(client, currencyId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(currenciesUrls.CURRENCY, {
        pathParams: {currency_id: currencyId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Currency,
    });
}

/**
 * `HEAD /admin/currencies/{currency_id}` — `200` with no body and the `ETag` the row's `GET` carries.
 * @param {Client} client @param {number|string} currencyId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headCurrency(client, currencyId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', currenciesUrls.CURRENCY, {
        pathParams: {currency_id: currencyId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/currencies/{currency_id}` — replace one currency.
 * @param {Client} client @param {number|string} currencyId
 * @param {CurrencyPayload} payload a `CurrencyInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Currency>>}
 */
export function updateCurrency(client, currencyId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(currenciesUrls.CURRENCY, {
        pathParams: {currency_id: currencyId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Currency,
    });
}

/**
 * `PATCH /admin/currencies/{currency_id}` — change only the fields sent; an empty body is `400`, and the base
 * currency is read-only here as on `PUT`.
 * @param {Client} client @param {number|string} currencyId
 * @param {CurrencyPayload} payload a `CurrencyInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Currency>>}
 */
export function patchCurrency(client, currencyId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(currenciesUrls.CURRENCY, {
        pathParams: {currency_id: currencyId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Currency,
    });
}

/**
 * `DELETE /admin/currencies/{currency_id}` — `204`, hard; the base currency is `409` until {@link setBaseCurrency}
 * moves the flag.
 * @param {Client} client @param {number|string} currencyId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteCurrency(client, currencyId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(currenciesUrls.CURRENCY, {
        pathParams: {currency_id: currencyId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/currencies/{currency_id}/base` — make an active currency the store's base.
 * @param {Client} client @param {number|string} currencyId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CurrencyBaseChange>>}
 */
export function setBaseCurrency(client, currencyId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(currenciesUrls.CURRENCY_BASE, {
        pathParams: {currency_id: currencyId},
        raiseOnError,
        responseFormat,
        dtoType: CurrencyBaseChange,
    });
}
