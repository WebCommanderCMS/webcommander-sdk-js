import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as productPageUrls from './productPageUrls.js';
import {ProductPage} from './productPageDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ProductPagePayload */

const requireClient = clientCheck('productPage.getProductPage(client)', 'client.productPage.getProductPage()');

/**
 * `GET /admin/settings/page_settings/product_page` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductPage>>}
 */
export function getProductPage(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productPageUrls.PRODUCT_PAGE, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/product_page` — partial write of one or more sections, wrapped as
 * `{product_page: {<section>: {...}}}`.
 * @param {Client} client @param {ProductPagePayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductPage>>}
 */
export function patchProductPage(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productPageUrls.PRODUCT_PAGE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductPage,
    });
}

/**
 * `HEAD /admin/settings/page_settings/product_page` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headProductPage(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', productPageUrls.PRODUCT_PAGE, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/page_settings/product_page/{section}` — one section, one level inside the facade's key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductPage>>}
 */
export function getProductPageSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productPageUrls.PRODUCT_PAGE_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/product_page/{section}` — partial write of one section, wrapped in the
 * facade's key or its own.
 * @param {Client} client @param {string} section @param {ProductPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductPage>>}
 */
export function patchProductPageSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productPageUrls.PRODUCT_PAGE_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductPage,
    });
}
