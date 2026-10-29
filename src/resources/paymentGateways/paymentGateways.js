import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as paymentGatewaysUrls from './paymentGatewaysUrls.js';
import {PaymentGateway, PaymentGatewayCount, PaymentGatewayPage} from './paymentGatewaysDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} PaymentGatewayPayload */

const requireClient = clientCheck(
    'paymentGateways.listPaymentGateways(client, {limit: 5})',
    'client.paymentGateways.listPaymentGateways({limit: 5})',
);

/**
 * `GET /admin/payment_gateways` — list the gateways by ascending `id`, rows without `settings`. `limit` is 1 to
 * 100, default 20; `0` or above 100 is `400` `out_of_range`. `offset` or `page`; `search` a substring of the name;
 * `exclude` a comma list of codes; `promotional` and `added` filter. Other names, `sort` included, are ignored.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PaymentGatewayPage>>}
 */
export function listPaymentGateways(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(paymentGatewaysUrls.PAYMENT_GATEWAYS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PaymentGatewayPage,
    });
}

/**
 * `HEAD /admin/payment_gateways` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headPaymentGateways(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', paymentGatewaysUrls.PAYMENT_GATEWAYS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/payment_gateways/count` — a bare `{"total": N}` the listing's filters narrow; `limit` is checked as
 * on the listing, `0` or above 100 `400` `out_of_range`, but changes nothing.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PaymentGatewayCount>>}
 */
export function countPaymentGateways(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(paymentGatewaysUrls.PAYMENT_GATEWAYS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PaymentGatewayCount,
    });
}

/**
 * `HEAD /admin/payment_gateways/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headPaymentGatewaysCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', paymentGatewaysUrls.PAYMENT_GATEWAYS_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/payment_gateways/{payment_gateway_id}` — one gateway with its `settings`; a stored secret reads
 * `********`.
 * @param {Client} client @param {number|string} paymentGatewayId a listed row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PaymentGateway>>}
 */
export function getPaymentGateway(client, paymentGatewayId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(paymentGatewaysUrls.PAYMENT_GATEWAY, {
        pathParams: {payment_gateway_id: paymentGatewayId},
        raiseOnError,
        responseFormat,
        dtoType: PaymentGateway,
    });
}

/**
 * `HEAD /admin/payment_gateways/{payment_gateway_id}` — `200` with no body.
 * @param {Client} client @param {number|string} paymentGatewayId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headPaymentGateway(client, paymentGatewayId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', paymentGatewaysUrls.PAYMENT_GATEWAY, {
        pathParams: {payment_gateway_id: paymentGatewayId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/payment_gateways/{payment_gateway_id}` — a bare record merged like the `PATCH`: the fields left out
 * keep their value.
 * @param {Client} client @param {number|string} paymentGatewayId
 * @param {PaymentGatewayPayload} payload a `PaymentGatewayInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PaymentGateway>>}
 */
export function updatePaymentGateway(client, paymentGatewayId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(paymentGatewaysUrls.PAYMENT_GATEWAY, {
        pathParams: {payment_gateway_id: paymentGatewayId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: PaymentGateway,
    });
}

/**
 * `PATCH /admin/payment_gateways/{payment_gateway_id}` — change only the fields sent; an empty body is `400`.
 * @param {Client} client @param {number|string} paymentGatewayId
 * @param {PaymentGatewayPayload} payload a `PaymentGatewayInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PaymentGateway>>}
 */
export function patchPaymentGateway(client, paymentGatewayId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(paymentGatewaysUrls.PAYMENT_GATEWAY, {
        pathParams: {payment_gateway_id: paymentGatewayId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: PaymentGateway,
    });
}
