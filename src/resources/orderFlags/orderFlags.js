import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as orderFlagsUrls from './orderFlagsUrls.js';
import {OrderFlag, OrderFlagPage} from './orderFlagsDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} OrderFlagPayload */

const requireClient = clientCheck(
    'orderFlags.listOrderFlags(client, {limit: 5})',
    'client.orderFlags.listOrderFlags({limit: 5})',
);

/**
 * `GET /admin/order_flags` — list the flags, ordered by `name`; an unknown query name is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderFlagPage>>}
 */
export function listOrderFlags(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderFlagsUrls.ORDER_FLAGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderFlagPage,
    });
}

/**
 * `HEAD /admin/order_flags` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headOrderFlags(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', orderFlagsUrls.ORDER_FLAGS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/order_flags` — create a flag inside the `order_flag` wrapper; `name` and a hex `color` are required.
 * @param {Client} client @param {OrderFlagPayload} payload an `OrderFlagInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderFlag>>}
 */
export function createOrderFlag(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(orderFlagsUrls.ORDER_FLAGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderFlag,
    });
}

/**
 * `GET /admin/order_flags/{order_flag_id}` — one flag, under the singular key.
 * @param {Client} client @param {number|string} orderFlagId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderFlag>>}
 */
export function getOrderFlag(client, orderFlagId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderFlagsUrls.ORDER_FLAG, {
        pathParams: {order_flag_id: orderFlagId},
        raiseOnError,
        responseFormat,
        dtoType: OrderFlag,
    });
}

/**
 * `HEAD /admin/order_flags/{order_flag_id}` — `200` with no body.
 * @param {Client} client @param {number|string} orderFlagId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headOrderFlag(client, orderFlagId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', orderFlagsUrls.ORDER_FLAG, {
        pathParams: {order_flag_id: orderFlagId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/order_flags/{order_flag_id}` — replace one flag.
 * @param {Client} client @param {number|string} orderFlagId
 * @param {OrderFlagPayload} payload an `OrderFlagInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderFlag>>}
 */
export function updateOrderFlag(client, orderFlagId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(orderFlagsUrls.ORDER_FLAG, {
        pathParams: {order_flag_id: orderFlagId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderFlag,
    });
}

/**
 * `DELETE /admin/order_flags/{order_flag_id}` — `204`, hard.
 * @param {Client} client @param {number|string} orderFlagId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteOrderFlag(client, orderFlagId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(orderFlagsUrls.ORDER_FLAG, {
        pathParams: {order_flag_id: orderFlagId},
        raiseOnError,
        responseFormat,
    });
}
