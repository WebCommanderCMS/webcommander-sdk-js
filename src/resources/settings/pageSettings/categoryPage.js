import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as categoryPageUrls from './categoryPageUrls.js';
import {CategoryPage} from './categoryPageDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CategoryPagePayload */

const requireClient = clientCheck('categoryPage.getCategoryPage(client)', 'client.categoryPage.getCategoryPage()');

/**
 * `GET /admin/settings/page_settings/category_page` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CategoryPage>>}
 */
export function getCategoryPage(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoryPageUrls.CATEGORY_PAGE, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CategoryPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/category_page` — partial write of either section, wrapped as
 * `{category_page: {<section>: {...}}}`.
 * @param {Client} client @param {CategoryPagePayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CategoryPage>>}
 */
export function patchCategoryPage(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(categoryPageUrls.CATEGORY_PAGE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CategoryPage,
    });
}

/**
 * `HEAD /admin/settings/page_settings/category_page` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCategoryPage(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', categoryPageUrls.CATEGORY_PAGE, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/page_settings/category_page/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CategoryPage>>}
 */
export function getCategoryPageSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoryPageUrls.CATEGORY_PAGE_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CategoryPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/category_page/{section}` — partial write of one section, wrapped in its
 * own key.
 * @param {Client} client @param {string} section @param {CategoryPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CategoryPage>>}
 */
export function patchCategoryPageSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(categoryPageUrls.CATEGORY_PAGE_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CategoryPage,
    });
}
