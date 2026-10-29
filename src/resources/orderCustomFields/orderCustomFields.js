import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as orderCustomFieldsUrls from './orderCustomFieldsUrls.js';
import {OrderCustomField, OrderCustomFieldPage} from './orderCustomFieldsDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} OrderCustomFieldTimeslotPayload */

const requireClient = clientCheck(
    'orderCustomFields.listOrderCustomFields(client, {limit: 5})',
    'client.orderCustomFields.listOrderCustomFields({limit: 5})',
);

/**
 * `GET /admin/order_custom_fields` — list the fields.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderCustomFieldPage>>}
 */
export function listOrderCustomFields(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderCustomFieldsUrls.ORDER_CUSTOM_FIELDS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderCustomFieldPage,
    });
}

/**
 * `GET /admin/order_custom_fields/count` — `map` is `{"count": N}`, bare; `filterBy` narrows it as it narrows the
 * listing.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function countOrderCustomFields(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderCustomFieldsUrls.ORDER_CUSTOM_FIELDS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/order_custom_fields/{order_custom_field_id}` — one field, with nine fields its listing row leaves out.
 * @param {Client} client @param {number|string} orderCustomFieldId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderCustomField>>}
 */
export function getOrderCustomField(client, orderCustomFieldId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderCustomFieldsUrls.ORDER_CUSTOM_FIELD, {
        pathParams: {order_custom_field_id: orderCustomFieldId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderCustomField,
    });
}

/**
 * `POST /admin/order_custom_fields/{order_custom_field_id}/validate_timeslot` — check a timeslot against an order
 * limit.
 * @param {Client} client @param {number|string} orderCustomFieldId
 * @param {OrderCustomFieldTimeslotPayload} payload an `OrderCustomFieldTimeslotInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function validateOrderCustomFieldTimeslot(client, orderCustomFieldId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(orderCustomFieldsUrls.ORDER_CUSTOM_FIELD_VALIDATE_TIMESLOT, {
        pathParams: {order_custom_field_id: orderCustomFieldId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}
