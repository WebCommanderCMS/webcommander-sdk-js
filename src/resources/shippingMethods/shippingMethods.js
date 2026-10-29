import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as shippingMethodsUrls from './shippingMethodsUrls.js';
import {ShippingMethod, ShippingMethodCount, ShippingMethodPage} from './shippingMethodsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingMethodPayload */

const requireClient = clientCheck(
    'shippingMethods.listShippingMethods(client, {limit: 5})',
    'client.shippingMethods.listShippingMethods({limit: 5})',
);

/**
 * `GET /admin/shipping_methods` — list the methods by ascending `id`; an unknown query name is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingMethodPage>>}
 */
export function listShippingMethods(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingMethodsUrls.SHIPPING_METHODS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethodPage,
    });
}

/**
 * `HEAD /admin/shipping_methods` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingMethods(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingMethodsUrls.SHIPPING_METHODS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/shipping_methods/count` — `{"shipping_methods": {"count": N}}` for the whole collection.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingMethodCount>>}
 */
export function countShippingMethods(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingMethodsUrls.SHIPPING_METHODS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethodCount,
    });
}

/**
 * `POST /admin/shipping_methods` — create a method inside the `shipping_method` wrapper.
 * @param {Client} client @param {ShippingMethodPayload} payload a `ShippingMethodInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingMethod>>}
 */
export function createShippingMethod(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingMethodsUrls.SHIPPING_METHODS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethod,
    });
}

/**
 * `GET /admin/shipping_methods/{shipping_method_id}` — one method; `field_metadata=true` adds the schema.
 * @param {Client} client @param {number|string} shippingMethodId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingMethod>>}
 */
export function getShippingMethod(client, shippingMethodId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingMethodsUrls.SHIPPING_METHOD, {
        pathParams: {shipping_method_id: shippingMethodId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethod,
    });
}

/**
 * `HEAD /admin/shipping_methods/{shipping_method_id}` — `200` even for an unknown id, so it is no existence check.
 * @param {Client} client @param {number|string} shippingMethodId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headShippingMethod(client, shippingMethodId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingMethodsUrls.SHIPPING_METHOD, {
        pathParams: {shipping_method_id: shippingMethodId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_methods/{shipping_method_id}` — rename one method.
 * @param {Client} client @param {number|string} shippingMethodId
 * @param {ShippingMethodPayload} payload a `ShippingMethodInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingMethod>>}
 */
export function updateShippingMethod(client, shippingMethodId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingMethodsUrls.SHIPPING_METHOD, {
        pathParams: {shipping_method_id: shippingMethodId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethod,
    });
}

/**
 * `DELETE /admin/shipping_methods/{shipping_method_id}` — `204`, hard; the default row is `409` until
 * {@link setShippingMethodDefault} moves the flag.
 * @param {Client} client @param {number|string} shippingMethodId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteShippingMethod(client, shippingMethodId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(shippingMethodsUrls.SHIPPING_METHOD, {
        pathParams: {shipping_method_id: shippingMethodId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_methods/{shipping_method_id}/default` — make one method the default, taking the flag
 * off the row that held it; takes no body.
 * @param {Client} client @param {number|string} shippingMethodId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingMethod>>}
 */
export function setShippingMethodDefault(client, shippingMethodId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingMethodsUrls.SHIPPING_METHOD_DEFAULT, {
        pathParams: {shipping_method_id: shippingMethodId},
        raiseOnError,
        responseFormat,
        dtoType: ShippingMethod,
    });
}
