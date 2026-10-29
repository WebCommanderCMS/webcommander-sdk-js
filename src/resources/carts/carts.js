import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as cartsUrls from './cartsUrls.js';
import {Cart, CartOrder, CartSession} from './cartsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CartPayload */

const requireClient = clientCheck('carts.getCart(client, sessionId)', 'client.carts.getCart(sessionId)');

/**
 * `POST /carts` — add a product to the cart `session_id` names, creating it, answered `201`.
 * @param {Client} client
 * @param {CartPayload} payload a `CartItemInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Cart>>}
 */
export function addCartItem(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(cartsUrls.CARTS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Cart,
    });
}

/**
 * `GET /carts/{session_id}` — the cart, with `group_meta` beside it. A cart with no line is `400`
 * `Your shopping cart is empty`.
 * @param {Client} client @param {string} sessionId the id the add named the cart by
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Cart>>}
 */
export function getCart(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(cartsUrls.CART, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
        dtoType: Cart,
    });
}

/**
 * `PUT /carts/{session_id}` — ask which session id to use.
 * @param {Client} client @param {string} sessionId
 * @param {CartPayload} payload a `CartSessionInput`, a mapping or a JSON string; `{}` at least
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CartSession>>}
 */
export function resolveCartSession(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(cartsUrls.CART, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CartSession,
    });
}

/**
 * `PATCH /carts/{session_id}` — change one line's quantity. `cart_item_id` and `quantity` are required; the
 * addresses are optional.
 * @param {Client} client @param {string} sessionId
 * @param {CartPayload} payload a `CartItemUpdateInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Cart>>}
 */
export function updateCartItem(client, sessionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(cartsUrls.CART, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Cart,
    });
}

/**
 * `DELETE /carts/{session_id}` — empty the cart; `204`, after which a read is `400`.
 * @param {Client} client @param {string} sessionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteCart(client, sessionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(cartsUrls.CART, {
        pathParams: {session_id: sessionId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `DELETE /carts/{session_id}/cart_items/{cart_item_id}` — remove one line; `204`. Removing the last line empties
 * the cart.
 * @param {Client} client @param {string} sessionId @param {number|string} cartItemId a line's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deleteCartItem(client, sessionId, cartItemId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(cartsUrls.CART_ITEM, {
        pathParams: {session_id: sessionId, cart_item_id: cartItemId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/orders/carts/{session_id}` — turn the cart into an order, answered `201`, and the cart is gone.
 * @param {Client} client @param {string} sessionId
 * @param {CartPayload} payload a `CartOrderInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CartOrder>>}
 */
export function createOrderFromCart(client, sessionId, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(cartsUrls.CART_ORDER, {
        pathParams: {session_id: sessionId},
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[cartsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: CartOrder,
    });
}
