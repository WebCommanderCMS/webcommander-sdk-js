import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as shippingRatesUrls from './shippingRatesUrls.js';
import {ShippingRate, ShippingRateCount, ShippingRateListing} from './shippingRatesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingRatePayload */

const requireClient = clientCheck(
    'shippingRates.listShippingRates(client, {search: "metro"})',
    'client.shippingRates.listShippingRates({search: "metro"})',
);

/**
 * `GET /admin/shipping_rates` — List the rates, newest first. `search` (part of the name), `method` (such as `flat_rate` or `ship_by_weight`) and `handling_cost` (`with_handling` or `without_handling`) filter; `sort` is `id`, `name`, `method`, `created_at`, `updated_at` or `transaction_no` with `order` `asc` or `desc`; `limit` is 1 to 100 and defaults to 20, `offset` pages. An unknown value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRateListing>>}
 */
export function listShippingRates(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRatesUrls.SHIPPING_RATES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRateListing,
    });
}

/**
 * `HEAD /admin/shipping_rates` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRates(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRatesUrls.SHIPPING_RATES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/shipping_rates/count` — a bare `{"total": N}`. The listing's filters narrow it.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRateCount>>}
 */
export function countShippingRates(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRatesUrls.SHIPPING_RATES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRateCount,
    });
}

/**
 * `HEAD /admin/shipping_rates/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRatesCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRatesUrls.SHIPPING_RATES_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/shipping_rates` — Create a rate, answered `201` with a `Location`. The body is wrapped in `shipping_rate` and needs `name`, unique without regard to case (`409`), and `method`. A flat rate needs `shipping_cost`; `ship_by_price`, `ship_by_quantity`, `ship_by_weight` and `ship_by_variation` take their costs per row in `conditions` and refuse a rate-level `shipping_cost`. `free_shipping` always saves `calculate_for_entire_order` false. `shipping_rule_id` attaches the rate to a rule that has none (`409` otherwise). An unknown field, an `id` or an unwrapped body is `400`.
 * @param {Client} client
 * @param {ShippingRatePayload} payload a `ShippingRateInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRate>>}
 */
export function createShippingRate(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingRatesUrls.SHIPPING_RATES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[shippingRatesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ShippingRate,
    });
}

/**
 * `GET /admin/shipping_rates/{shipping_rate_id}` — one rate, the row under `shipping_rate`. An id that is not plain digits, or unknown, is `404`.
 * @param {Client} client @param {number|string} shippingRateId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRate>>}
 */
export function getShippingRate(client, shippingRateId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRatesUrls.SHIPPING_RATE, {
        pathParams: {shipping_rate_id: shippingRateId},
        raiseOnError,
        responseFormat,
        dtoType: ShippingRate,
    });
}

/**
 * `HEAD /admin/shipping_rates/{shipping_rate_id}` — `200` with no body, `404` for an unknown id.
 * @param {Client} client @param {number|string} shippingRateId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRate(client, shippingRateId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRatesUrls.SHIPPING_RATE, {
        pathParams: {shipping_rate_id: shippingRateId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_rates/{shipping_rate_id}` — Replace one rate. Every field is required: `name`, `method`, `calculate_for_entire_order`, `price_entered_with_tax`, the costs the method uses and `additional_rule`; a `handling_cost` or `additional_rule` the rate does not use is sent as `null`. A field left out is `400` naming it.
 * @param {Client} client @param {number|string} shippingRateId
 * @param {ShippingRatePayload} payload a `ShippingRateInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRate>>}
 */
export function updateShippingRate(client, shippingRateId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingRatesUrls.SHIPPING_RATE, {
        pathParams: {shipping_rate_id: shippingRateId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRate,
    });
}

/**
 * `PATCH /admin/shipping_rates/{shipping_rate_id}` — Change only the fields sent; the costs, rows and boxes not sent are kept. An empty `shipping_rate` changes nothing and is `200`.
 * @param {Client} client @param {number|string} shippingRateId
 * @param {ShippingRatePayload} payload a `ShippingRateInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRate>>}
 */
export function patchShippingRate(client, shippingRateId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shippingRatesUrls.SHIPPING_RATE, {
        pathParams: {shipping_rate_id: shippingRateId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRate,
    });
}

/**
 * `DELETE /admin/shipping_rates/{shipping_rate_id}` — `204`. A rate a rule uses is `409` until the rule lets it go.
 * @param {Client} client @param {number|string} shippingRateId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteShippingRate(client, shippingRateId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(shippingRatesUrls.SHIPPING_RATE, {
        pathParams: {shipping_rate_id: shippingRateId},
        raiseOnError,
        responseFormat,
    });
}
