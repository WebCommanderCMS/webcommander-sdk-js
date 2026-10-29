import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as searchResultPageUrls from './searchResultPageUrls.js';
import {ProductPromotion, SearchResultPage} from './searchResultPageDto.js';
import {Page} from '../../customers/adminCustomersDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} SearchResultPagePayload */

const ProductPromotionPage = Page.of(ProductPromotion);

const requireClient = clientCheck(
    'searchResultPage.getSearchResultPage(client)',
    'client.searchResultPage.getSearchResultPage()',
);

/**
 * `GET /admin/settings/page_settings/search_result_page` — the whole area; the promotions are not inlined.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SearchResultPage>>}
 */
export function getSearchResultPage(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchResultPageUrls.SEARCH_RESULT_PAGE, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SearchResultPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/search_result_page` — partial write, wrapped as
 * `{search_result_page: {product_information: {...}}}`.
 * @param {Client} client @param {SearchResultPagePayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SearchResultPage>>}
 */
export function patchSearchResultPage(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchResultPageUrls.SEARCH_RESULT_PAGE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchResultPage,
    });
}

/**
 * `HEAD /admin/settings/page_settings/search_result_page` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSearchResultPage(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', searchResultPageUrls.SEARCH_RESULT_PAGE, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/page_settings/search_result_page/{section}` — one section, under the facade's key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SearchResultPage>>}
 */
export function getSearchResultPageSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SearchResultPage,
    });
}

/**
 * `PATCH /admin/settings/page_settings/search_result_page/{section}` — partial write of one section, wrapped in
 * its own key.
 * @param {Client} client @param {string} section @param {SearchResultPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SearchResultPage>>}
 */
export function patchSearchResultPageSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchResultPage,
    });
}

/**
 * `GET /admin/settings/page_settings/search_result_page/product_promotion` — list the promotions, under
 * `product_promotions`; `limit` is not applied.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page<ProductPromotion>>>}
 */
export function getSearchResultPageProductPromotions(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTIONS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductPromotionPage,
    });
}

/**
 * `HEAD /admin/settings/page_settings/search_result_page/product_promotion` — `200` with no body and no `ETag`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSearchResultPageProductPromotions(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTIONS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/settings/page_settings/search_result_page/product_promotion` — add a promotion inside the
 * `product_promotion` wrapper.
 * @param {Client} client @param {SearchResultPagePayload} payload a `ProductPromotion` sends the wrapped form
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductPromotion>>}
 */
export function createSearchResultPageProductPromotion(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTIONS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductPromotion,
    });
}

/**
 * `GET /admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}` — one promotion.
 * @param {Client} client @param {number|string} promotionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductPromotion>>}
 */
export function getSearchResultPageProductPromotion(client, promotionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTION, {
        pathParams: {promotion_id: promotionId},
        raiseOnError,
        responseFormat,
        dtoType: ProductPromotion,
    });
}

/**
 * `HEAD /admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}` — `200` with no body
 * and an `ETag`; an unknown id is `404`.
 * @param {Client} client @param {number|string} promotionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headSearchResultPageProductPromotion(client, promotionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTION, {
        pathParams: {promotion_id: promotionId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PATCH /admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}` — partial change
 * of one promotion, wrapped as a create is.
 * @param {Client} client @param {number|string} promotionId @param {SearchResultPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductPromotion>>}
 */
export function patchSearchResultPageProductPromotion(client, promotionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTION, {
        pathParams: {promotion_id: promotionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductPromotion,
    });
}

/**
 * `PATCH /admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}/active` — set
 * `is_active` alone.
 * @param {Client} client @param {number|string} promotionId @param {SearchResultPagePayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductPromotion>>}
 */
export function patchSearchResultPageProductPromotionActive(client, promotionId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTION_ACTIVE, {
        pathParams: {promotion_id: promotionId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductPromotion,
    });
}

/**
 * `DELETE /admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}` — `204`.
 * @param {Client} client @param {number|string} promotionId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteSearchResultPageProductPromotion(client, promotionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(searchResultPageUrls.SEARCH_RESULT_PAGE_PRODUCT_PROMOTION, {
        pathParams: {promotion_id: promotionId},
        raiseOnError,
        responseFormat,
    });
}
