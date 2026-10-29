import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as categoriesUrls from './categoriesUrls.js';
import {Category, CategoryCount, CategoryPage} from './categoriesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CategoryPayload */

const requireClient = clientCheck(
    'categories.listCategories(client, {limit: 5})',
    'client.categories.listCategories({limit: 5})',
);

/**
 * `GET /admin/categories` — every level of the tree in one list, newest update first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CategoryPage>>}
 */
export function listCategories(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoriesUrls.CATEGORIES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CategoryPage,
    });
}

/**
 * `GET /admin/categories/count` — `{"categories": {"count": N}}`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CategoryCount>>}
 */
export function countCategories(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoriesUrls.CATEGORIES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CategoryCount,
    });
}

/**
 * `GET /admin/categories/check-name` — read `map.available`.
 * @param {Client} client @param {string} name @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function checkCategoryName(client, name, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    // No dtoType: `{available}` is a verdict, not a record.
    return target.sendGetRequest(categoriesUrls.CATEGORIES_CHECK_NAME, {
        queryParams: {name},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/categories` — `201`, the body wrapped in `category` and needing `general.name`.
 * @param {Client} client
 * @param {CategoryPayload} payload a `CategoryInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Category>>}
 */
export function createCategory(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(categoriesUrls.CATEGORIES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[categoriesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}

/**
 * `GET /admin/categories/{category_id}` — a trashed row still reads `200` with `in_trash: true`; `field_metadata`
 * adds the field schema.
 * @param {Client} client @param {number|string} categoryId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Category>>}
 */
export function getCategory(client, categoryId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoriesUrls.CATEGORY, {
        pathParams: {category_id: categoryId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}

/**
 * `PUT /admin/categories/{category_id}` — omitted fields reset.
 * @param {Client} client @param {number|string} categoryId
 * @param {CategoryPayload} payload a `CategoryInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Category>>}
 */
export function updateCategory(client, categoryId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(categoriesUrls.CATEGORY, {
        pathParams: {category_id: categoryId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}

/**
 * `PATCH /admin/categories/{category_id}` — a merge across as many sections as the body names; what it omits keeps
 * its stored value.
 * @param {Client} client @param {number|string} categoryId
 * @param {CategoryPayload} payload a `CategoryInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Category>>}
 */
export function patchCategory(client, categoryId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(categoriesUrls.CATEGORY, {
        pathParams: {category_id: categoryId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}

/**
 * `DELETE /admin/categories/{category_id}` — `204`, soft: the row leaves the listing and the count, and still reads
 * `200` and holds its name.
 * @param {Client} client @param {number|string} categoryId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteCategory(client, categoryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(categoriesUrls.CATEGORY, {
        pathParams: {category_id: categoryId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/categories/{category_id}/{section}` — `section` is one of `CATEGORY_SECTIONS`, answered as
 * `{"category": {<section>: {...}}}`.
 * @param {Client} client @param {number|string} categoryId @param {string} section
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Category>>}
 */
export function getCategorySection(client, categoryId, section, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(categoriesUrls.CATEGORY_SECTION, {
        pathParams: {category_id: categoryId, section},
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}

/**
 * `PATCH /admin/categories/{category_id}/{section}` — a merge into one section, wrapped as `{"category": {<section>: {...}}}`.
 * @param {Client} client @param {number|string} categoryId @param {string} section
 * @param {CategoryPayload} payload a `CategoryInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Category>>}
 */
export function patchCategorySection(client, categoryId, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(categoriesUrls.CATEGORY_SECTION, {
        pathParams: {category_id: categoryId, section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Category,
    });
}
