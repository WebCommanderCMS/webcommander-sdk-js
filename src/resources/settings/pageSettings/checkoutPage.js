import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as checkoutPageUrls from './checkoutPageUrls.js';
import {CheckoutPage} from './checkoutPageDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CheckoutPagePayload */

const requireClient = clientCheck('checkoutPage.getCheckoutPage(client)', 'client.checkoutPage.getCheckoutPage()');

/**
 * `GET /admin/settings/page_settings/checkout_page` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CheckoutPage>>}
 */
export function getCheckoutPage(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(checkoutPageUrls.CHECKOUT_PAGE, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CheckoutPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/checkout_page` — partial write of one or more sections.
 * @param {Client} client @param {CheckoutPagePayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CheckoutPage>>}
 */
export function patchCheckoutPage(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(checkoutPageUrls.CHECKOUT_PAGE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CheckoutPage,
    });
}

/**
 * `HEAD /admin/settings/page_settings/checkout_page` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCheckoutPage(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', checkoutPageUrls.CHECKOUT_PAGE, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/page_settings/checkout_page/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CheckoutPage>>}
 */
export function getCheckoutPageSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(checkoutPageUrls.CHECKOUT_PAGE_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CheckoutPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/checkout_page/{section}` — partial write of one section, wrapped in its own key.
 * @param {Client} client @param {string} section @param {CheckoutPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CheckoutPage>>}
 */
export function patchCheckoutPageSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(checkoutPageUrls.CHECKOUT_PAGE_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CheckoutPage,
    });
}
