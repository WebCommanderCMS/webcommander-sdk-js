import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import {FlatOrder} from '../orders/ordersDto.js';
import * as adminCartsUrls from './adminCartsUrls.js';
import {AdminCart, AdminCheckout} from './adminCartsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} AdminCartPayload */

const requireClient = clientCheck(
    'adminCarts.getAdminCart(client, "PRV-0123456789ABCDEF")',
    'client.adminCarts.getAdminCart("PRV-0123456789ABCDEF")',
);

/**
 * `POST /admin/orders/carts` — start a cart for a customer, `201`. `customer_id` is the customer's `customer_id` and
 * `products` (`product_id` and `quantity`) is required. Keep `cart.session.session_id`: every other call takes it as
 * `session_id`. The session lasts 30 minutes from the last write.
 * @param {Client} client
 * @param {AdminCartPayload} payload an `AdminCartInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCart>>}
 */
export function createAdminCart(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCartsUrls.ADMIN_CARTS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `GET /admin/orders/carts/{session_id}` — read the cart; the slot takes `cart.session.session_id`. A deleted cart is
 * `410 session_deleted` and one an order was placed from is `410 session_confirmed`.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCart>>}
 */
export function getAdminCart(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCartsUrls.ADMIN_CART, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `PUT /admin/orders/carts/{session_id}` — replace the cart's customer and lines, `200`. `customer_id` and `products`
 * are both sent. The lines are put on again, so each gets a new `cart_item_id`.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCartInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCart>>}
 */
export function replaceAdminCart(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(adminCartsUrls.ADMIN_CART, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `PATCH /admin/orders/carts/{session_id}` — change the cart's customer, `200`. Only `customer_id` is taken, and it is
 * required: `products` is `400 unknown_field`.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCartCustomerInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCart>>}
 */
export function updateAdminCart(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(adminCartsUrls.ADMIN_CART, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `DELETE /admin/orders/carts/{session_id}` — delete the cart; `204` with no body, after which every call on the
 * session is `410`.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteAdminCart(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CART, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/orders/carts/{session_id}/cart_items` — put products on the cart, `201` with the whole cart. `products`
 * is required; one already on the cart raises that line's quantity.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCartItemsInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCart>>}
 */
export function addAdminCartItems(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCartsUrls.ADMIN_CART_ITEMS, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `DELETE /admin/orders/carts/{session_id}/cart_items` — take every line off the cart, `200` with the empty cart. The
 * session stays.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCart>>}
 */
export function clearAdminCartItems(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CART_ITEMS, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `PATCH /admin/orders/carts/{session_id}/cart_items/{cart_item_id}` — set one line's quantity, `200` with the cart.
 * `cart_item_id` is a line's `cart_item_id` and `quantity` is required. A line the cart does not hold is `404`.
 * @param {Client} client @param {string} sessionId @param {number|string} cartItemId
 * @param {AdminCartPayload} payload an `AdminCartItemUpdateInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCart>>}
 */
export function updateAdminCartItem(client, sessionId, cartItemId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(adminCartsUrls.ADMIN_CART_ITEM, {
        pathParams: {session_id: sessionId, cart_item_id: cartItemId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `DELETE /admin/orders/carts/{session_id}/cart_items/{cart_item_id}` — take one line off the cart, `200` with the
 * cart. `cart_item_id` is a line's `cart_item_id`; one the cart does not hold is `404`.
 * @param {Client} client @param {string} sessionId @param {number|string} cartItemId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCart>>}
 */
export function deleteAdminCartItem(client, sessionId, cartItemId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CART_ITEM, {
        pathParams: {session_id: sessionId, cart_item_id: cartItemId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCart,
    });
}

/**
 * `GET /admin/orders/checkout/{session_id}` — read the checkout of a cart. `issues` lists what still blocks a confirm,
 * `delivery_type` `required` until one is set; the addresses start as the customer's.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function getCheckout(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCartsUrls.ADMIN_CHECKOUT, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `PATCH /admin/orders/checkout/{session_id}` — set the delivery and addresses, `200` with the priced checkout. Only
 * `delivery_type`, `billing_address` and `shipping_address` are taken. The shipping and handling cost follow the
 * shipping address, so set it with `delivery_type`.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCheckoutInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function updateCheckout(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(adminCartsUrls.ADMIN_CHECKOUT, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `POST /admin/orders/checkout/{session_id}/confirm` — place the order; `201` with the order, and the body optional.
 * This creates a real order and closes the session, so every later call on it is `410 session_confirmed`. A checkout
 * with `issues` is `422 checkout_incomplete`. Without a `payment` the order is unpaid.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} [payload] an `AdminCheckoutConfirmInput`, a mapping or a JSON string, bare
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header and files the order under that number;
 *   left out or `null`, none is sent. A different `transaction_no` in the body is `400 header_body_mismatch`.
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function confirmCheckout(
    client,
    sessionId,
    payload = undefined,
    transactionNo = undefined,
    options = undefined,
) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCartsUrls.ADMIN_CHECKOUT_CONFIRM, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[adminCartsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `POST /admin/orders/checkout/{session_id}/coupon` — apply a coupon, `200`. `code` is required. One coupon at a time:
 * a second is `409`, and a code the store does not accept is `422 invalid_coupon`.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCheckoutCodeInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function applyCheckoutCoupon(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCartsUrls.ADMIN_CHECKOUT_COUPON, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `DELETE /admin/orders/checkout/{session_id}/coupon` — remove the coupon. With none applied it is
 * `404 coupon_not_applied`.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function removeCheckoutCoupon(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CHECKOUT_COUPON, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `POST /admin/orders/checkout/{session_id}/gift_card` — apply a gift card, `200`. `code` is required. The card must be
 * usable by the cart's customer, else `422 invalid_gift_card`; a second card is `409`. It lowers `due` and spends
 * nothing until an order is placed.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCheckoutCodeInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function applyCheckoutGiftCard(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCartsUrls.ADMIN_CHECKOUT_GIFT_CARD, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `DELETE /admin/orders/checkout/{session_id}/gift_card` — remove the gift card. With none applied it is
 * `404 gift_card_not_applied`.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function removeCheckoutGiftCard(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CHECKOUT_GIFT_CARD, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `GET /admin/orders/checkout/{session_id}/delivery_schedules` — read the chosen delivery schedule, with `session` and
 * `delivery_schedule`, which is `null` until one is set.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function getCheckoutDeliverySchedules(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCartsUrls.ADMIN_CHECKOUT_DELIVERY_SCHEDULES, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `PUT /admin/orders/checkout/{session_id}/delivery_schedules` — choose a delivery schedule and date. `id` and `date`
 * are both required. Only a `delivery_type` of `delivery` takes one (else `422`), an unknown `id` is `404` and one that
 * does not apply to the order is `422 schedule_not_applicable`.
 * @param {Client} client @param {string} sessionId
 * @param {AdminCartPayload} payload an `AdminCheckoutDeliveryScheduleInput`, a mapping or a JSON string, bare
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<AdminCheckout>>}
 */
export function setCheckoutDeliverySchedule(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(adminCartsUrls.ADMIN_CHECKOUT_DELIVERY_SCHEDULES, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: AdminCheckout,
    });
}

/**
 * `DELETE /admin/orders/checkout/{session_id}/delivery_schedules` — clear the delivery schedule; `204` with no body,
 * and also when none was set.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function clearCheckoutDeliverySchedule(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCartsUrls.ADMIN_CHECKOUT_DELIVERY_SCHEDULES, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
    });
}
