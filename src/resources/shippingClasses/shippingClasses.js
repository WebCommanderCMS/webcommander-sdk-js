import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as shippingClassesUrls from './shippingClassesUrls.js';
import {ShippingClass, ShippingClassCount, ShippingClassPage} from './shippingClassesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingClassPayload */

const requireClient = clientCheck(
    'shippingClasses.listShippingClasses(client, {limit: 5})',
    'client.shippingClasses.listShippingClasses({limit: 5})',
);

/**
 * `GET /admin/shipping_classes` — list the classes, a created row listed first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingClassPage>>}
 */
export function listShippingClasses(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingClassesUrls.SHIPPING_CLASSES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingClassPage,
    });
}

/**
 * `HEAD /admin/shipping_classes` — ask whether the collection answers; `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingClasses(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingClassesUrls.SHIPPING_CLASSES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/shipping_classes/count` — how many classes the store holds, answering
 * `{"shipping_classes": {"count": N}}`; no query parameter narrows it.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingClassCount>>}
 */
export function countShippingClasses(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingClassesUrls.SHIPPING_CLASSES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingClassCount,
    });
}

/**
 * `POST /admin/shipping_classes` — create a class, `201`.
 * @param {Client} client @param {ShippingClassPayload} payload a `ShippingClassInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingClass>>}
 */
export function createShippingClass(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingClassesUrls.SHIPPING_CLASSES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingClass,
    });
}

/**
 * `GET /admin/shipping_classes/{shipping_class_id}` — retrieve one class, the row under `shipping_class`.
 * @param {Client} client @param {number|string} shippingClassId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingClass>>}
 */
export function getShippingClass(client, shippingClassId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingClassesUrls.SHIPPING_CLASS, {
        pathParams: {shipping_class_id: shippingClassId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingClass,
    });
}

/**
 * `HEAD /admin/shipping_classes/{shipping_class_id}` — ask whether a class's path answers.
 * @param {Client} client @param {number|string} shippingClassId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headShippingClass(client, shippingClassId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingClassesUrls.SHIPPING_CLASS, {
        pathParams: {shipping_class_id: shippingClassId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_classes/{shipping_class_id}` — replace one class, wrapper and `name` required.
 * @param {Client} client @param {number|string} shippingClassId
 * @param {ShippingClassPayload} payload a `ShippingClassInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingClass>>}
 */
export function updateShippingClass(client, shippingClassId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingClassesUrls.SHIPPING_CLASS, {
        pathParams: {shipping_class_id: shippingClassId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingClass,
    });
}

/**
 * `DELETE /admin/shipping_classes/{shipping_class_id}` — `204` and hard. The row holding
 * `is_default` is `409 conflict` until the flag moves to another.
 * @param {Client} client @param {number|string} shippingClassId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteShippingClass(client, shippingClassId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(shippingClassesUrls.SHIPPING_CLASS, {
        pathParams: {shipping_class_id: shippingClassId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_classes/{shipping_class_id}/default` — make one class the default, no body read.
 * @param {Client} client @param {number|string} shippingClassId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingClass>>}
 */
export function setShippingClassDefault(client, shippingClassId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingClassesUrls.SHIPPING_CLASS_DEFAULT, {
        pathParams: {shipping_class_id: shippingClassId},
        raiseOnError,
        responseFormat,
        dtoType: ShippingClass,
    });
}
