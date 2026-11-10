import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import {FlatOrder} from '../orders/ordersDto.js';
import * as orderPreviewsUrls from './orderPreviewsUrls.js';
import {OrderPreview} from './orderPreviewsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} OrderPreviewPayload */

const requireClient = clientCheck(
    'orderPreviews.getOrderPreview(client, "PRV-0123456789ABCDEF")',
    'client.orderPreviews.getOrderPreview("PRV-0123456789ABCDEF")',
);

/**
 * `POST /admin/orders/preview` — Start an order preview, `201`, a priced session that places no order. `products` is required; read `order.session.session_id`, which every other call takes as `preview_session_id`. The session lasts 30 minutes.
 * @param {Client} client
 * @param {OrderPreviewPayload} payload an `OrderPreviewInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderPreview>>}
 */
export function createOrderPreview(client, payload, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    requirePayload(payload);
    return target.sendPostRequest(orderPreviewsUrls.ORDER_PREVIEWS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderPreview,
    });
}

/**
 * `GET /admin/orders/preview/{preview_session_id}` — Read an order preview; the slot takes the `session_id` the start answered. A read does not extend the session. An unknown id is `404`, and a session already confirmed is `410` `session_confirmed`.
 * @param {Client} client @param {string} previewSessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderPreview>>}
 */
export function getOrderPreview(client, previewSessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(orderPreviewsUrls.ORDER_PREVIEW, {
        pathParams: {preview_session_id: previewSessionId},
        raiseOnError,
        responseFormat,
        dtoType: OrderPreview,
    });
}

/**
 * `POST /admin/orders/preview/{preview_session_id}/confirm` — Place the order: `201` with the created order, and the body optional. This creates a real order and closes the session, so a second confirm, or any other call on it, is `410` `session_confirmed`. Without a `payment` the order is unpaid, and so it is after a `payment_gateway` alone.
 * @param {Client} client @param {string} previewSessionId
 * @param {OrderPreviewPayload} [payload] an `OrderPreviewConfirmInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function confirmOrderPreview(client, previewSessionId, payload = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(orderPreviewsUrls.ORDER_PREVIEW_CONFIRM, {
        pathParams: {preview_session_id: previewSessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `POST /admin/orders/preview/{preview_session_id}/coupon` — Apply a coupon, `200` with `session`, `discounts` and `totals`. One coupon at a time: a second is `409`, and a code the store does not accept is `422` `invalid_coupon`.
 * @param {Client} client @param {string} previewSessionId
 * @param {OrderPreviewPayload} payload an `OrderPreviewCodeInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderPreview>>}
 */
export function applyOrderPreviewCoupon(client, previewSessionId, payload, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    requirePayload(payload);
    return target.sendPostRequest(orderPreviewsUrls.ORDER_PREVIEW_COUPON, {
        pathParams: {preview_session_id: previewSessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderPreview,
    });
}

/**
 * `DELETE /admin/orders/preview/{preview_session_id}/coupon` — Remove the coupon, `204` with no body. With none applied it is `404` `coupon_not_applied`.
 * @param {Client} client @param {string} previewSessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function removeOrderPreviewCoupon(client, previewSessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(orderPreviewsUrls.ORDER_PREVIEW_COUPON, {
        pathParams: {preview_session_id: previewSessionId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/orders/preview/{preview_session_id}/gift-card` — Apply a gift card, `200` with `session`, `discounts` and `totals`. The card must be the previewed customer's, active, paid, in date and with a balance, else `422` `invalid_gift_card`; a second card is `409`. It lowers `due` and spends nothing until an order is placed with it applied.
 * @param {Client} client @param {string} previewSessionId
 * @param {OrderPreviewPayload} payload an `OrderPreviewCodeInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderPreview>>}
 */
export function applyOrderPreviewGiftCard(client, previewSessionId, payload, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    requirePayload(payload);
    return target.sendPostRequest(orderPreviewsUrls.ORDER_PREVIEW_GIFT_CARD, {
        pathParams: {preview_session_id: previewSessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderPreview,
    });
}

/**
 * `DELETE /admin/orders/preview/{preview_session_id}/gift-card` — Remove the gift card, `204` with no body. With none applied it is `404` `gift_card_not_applied`.
 * @param {Client} client @param {string} previewSessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function removeOrderPreviewGiftCard(client, previewSessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(orderPreviewsUrls.ORDER_PREVIEW_GIFT_CARD, {
        pathParams: {preview_session_id: previewSessionId},
        raiseOnError,
        responseFormat,
    });
}
