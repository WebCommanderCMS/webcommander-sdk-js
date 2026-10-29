import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as shoppingCartUrls from './shoppingCartUrls.js';
import {ShoppingCart} from './shoppingCartDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShoppingCartPayload */

const requireClient = clientCheck('shoppingCart.getShoppingCart(client)', 'client.shoppingCart.getShoppingCart()');

/**
 * `GET /admin/settings/page_settings/shopping_cart` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShoppingCart>>}
 */
export function getShoppingCart(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shoppingCartUrls.SHOPPING_CART, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShoppingCart,
    });
}

/**
 * `PATCH /admin/settings/page_settings/shopping_cart` — partial write of either section, wrapped as
 * `{shopping_cart: {<section>: {...}}}`.
 * @param {Client} client @param {ShoppingCartPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShoppingCart>>}
 */
export function patchShoppingCart(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shoppingCartUrls.SHOPPING_CART, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShoppingCart,
    });
}

/**
 * `HEAD /admin/settings/page_settings/shopping_cart` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShoppingCart(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shoppingCartUrls.SHOPPING_CART, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/page_settings/shopping_cart/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShoppingCart>>}
 */
export function getShoppingCartSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shoppingCartUrls.SHOPPING_CART_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShoppingCart,
    });
}

/**
 * `PATCH /admin/settings/page_settings/shopping_cart/{section}` — partial write of one section, wrapped in its
 * own key.
 * @param {Client} client @param {string} section @param {ShoppingCartPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShoppingCart>>}
 */
export function patchShoppingCartSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shoppingCartUrls.SHOPPING_CART_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShoppingCart,
    });
}
