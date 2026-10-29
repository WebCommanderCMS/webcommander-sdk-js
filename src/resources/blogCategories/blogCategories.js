import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as blogCategoriesUrls from './blogCategoriesUrls.js';
import {BlogCategory, BlogCategoryPage} from './blogCategoriesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} BlogCategoryPayload */

const requireClient = clientCheck(
    'blogCategories.listBlogCategories(client, {limit: 5})',
    'client.blogCategories.listBlogCategories({limit: 5})',
);

/**
 * `GET /admin/blog_categories` — list the categories, ordered by `name`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<BlogCategoryPage>>}
 */
export function listBlogCategories(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogCategoriesUrls.BLOG_CATEGORIES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: BlogCategoryPage,
    });
}

/**
 * `POST /admin/blog_categories` — create a category, wrapped in `blog_category`, `201`.
 * @param {Client} client
 * @param {BlogCategoryPayload} payload a `BlogCategoryInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCategory>>}
 */
export function createBlogCategory(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(blogCategoriesUrls.BLOG_CATEGORIES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: BlogCategory,
    });
}

/**
 * `GET /admin/blog_categories/{blog_category_id}` — one category, under the singular key.
 * @param {Client} client @param {number|string} blogCategoryId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCategory>>}
 */
export function getBlogCategory(client, blogCategoryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogCategoriesUrls.BLOG_CATEGORY, {
        pathParams: {blog_category_id: blogCategoryId},
        raiseOnError,
        responseFormat,
        dtoType: BlogCategory,
    });
}

/**
 * `PUT /admin/blog_categories/{blog_category_id}` — update one category, wrapped as the create is.
 * @param {Client} client @param {number|string} blogCategoryId
 * @param {BlogCategoryPayload} payload a `BlogCategoryInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCategory>>}
 */
export function updateBlogCategory(client, blogCategoryId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(blogCategoriesUrls.BLOG_CATEGORY, {
        pathParams: {blog_category_id: blogCategoryId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: BlogCategory,
    });
}

/**
 * `DELETE /admin/blog_categories/{blog_category_id}` — `204`, and the blogs linked to it are kept.
 * @param {Client} client @param {number|string} blogCategoryId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteBlogCategory(client, blogCategoryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(blogCategoriesUrls.BLOG_CATEGORY, {
        pathParams: {blog_category_id: blogCategoryId},
        raiseOnError,
        responseFormat,
    });
}
