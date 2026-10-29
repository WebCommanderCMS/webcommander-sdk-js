import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as blogsUrls from './blogsUrls.js';
import {Blog, BlogCommentEnvelope, BlogCommentList, BlogCount, BlogPage} from './blogsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} BlogPayload */

const requireClient = clientCheck('blogs.listBlogs(client, {limit: 5})', 'client.blogs.listBlogs({limit: 5})');

/**
 * `GET /admin/blogs` — list the blogs, latest `date` first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<BlogPage>>}
 */
export function listBlogs(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogsUrls.BLOGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: BlogPage,
    });
}

/**
 * `GET /admin/blogs/count` — `{"blogs": {"count": N}}`, narrowed by the listing's filters and not by its paging.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<BlogCount>>}
 */
export function countBlogs(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogsUrls.BLOGS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: BlogCount,
    });
}

/**
 * `POST /admin/blogs` — create a blog, answered `201`. The body is `{"blog": {...}}` with `title` required,
 * unique among live and trashed blogs alike.
 * @param {Client} client
 * @param {BlogPayload} payload a `BlogInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Blog>>}
 */
export function createBlog(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(blogsUrls.BLOGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Blog,
    });
}

/**
 * `GET /admin/blogs/{blog_id}` — one blog; `field_metadata=true` adds the field schema beside it, and a trashed
 * blog is `404`.
 * @param {Client} client @param {number|string} blogId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Blog>>}
 */
export function getBlog(client, blogId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogsUrls.BLOG, {
        pathParams: {blog_id: blogId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Blog,
    });
}

/**
 * `PUT /admin/blogs/{blog_id}` — replace one blog.
 * @param {Client} client @param {number|string} blogId
 * @param {BlogPayload} payload a `BlogInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Blog>>}
 */
export function updateBlog(client, blogId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(blogsUrls.BLOG, {
        pathParams: {blog_id: blogId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Blog,
    });
}

/**
 * `PATCH /admin/blogs/{blog_id}` — change only the fields sent, in the `blog` wrapper; the answer carries
 * `group_meta` beside the row.
 * @param {Client} client @param {number|string} blogId
 * @param {BlogPayload} payload a `BlogInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Blog>>}
 */
export function patchBlog(client, blogId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(blogsUrls.BLOG, {
        pathParams: {blog_id: blogId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Blog,
    });
}

/**
 * `DELETE /admin/blogs/{blog_id}` — move one blog to the trash, `204`. Its title stays taken, and its comments
 * stay readable.
 * @param {Client} client @param {number|string} blogId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteBlog(client, blogId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(blogsUrls.BLOG, {
        pathParams: {blog_id: blogId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/blogs/{blog_id}/comments` — every comment on one blog, oldest first and unpaged; no query parameter
 * has an effect.
 * @param {Client} client @param {number|string} blogId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<BlogCommentList>>}
 */
export function listBlogComments(client, blogId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogsUrls.BLOG_COMMENTS, {
        pathParams: {blog_id: blogId},
        raiseOnError,
        responseFormat,
        dtoType: BlogCommentList,
    });
}

/**
 * `POST /admin/blogs/{blog_id}/comments` — add a comment, `pending`, answered `201`.
 * @param {Client} client @param {number|string} blogId
 * @param {BlogPayload} payload a `BlogCommentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCommentEnvelope>>}
 */
export function createBlogComment(client, blogId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(blogsUrls.BLOG_COMMENTS, {
        pathParams: {blog_id: blogId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: BlogCommentEnvelope,
    });
}

/**
 * `GET /admin/blogs/{blog_id}/comments/{blog_comment_id}` — one comment; the top-level `id` is the blog's, the
 * comment's is inside.
 * @param {Client} client @param {number|string} blogId @param {number|string} blogCommentId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCommentEnvelope>>}
 */
export function getBlogComment(client, blogId, blogCommentId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(blogsUrls.BLOG_COMMENT, {
        pathParams: {blog_id: blogId, blog_comment_id: blogCommentId},
        raiseOnError,
        responseFormat,
        dtoType: BlogCommentEnvelope,
    });
}

/**
 * `POST /admin/blogs/{blog_id}/comments/{blog_comment_id}/approve` — approve one comment; takes no body, answers
 * `201` and leaves `spam` as it was.
 * @param {Client} client @param {number|string} blogId @param {number|string} blogCommentId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCommentEnvelope>>}
 */
export function approveBlogComment(client, blogId, blogCommentId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(blogsUrls.BLOG_COMMENT_APPROVE, {
        pathParams: {blog_id: blogId, blog_comment_id: blogCommentId},
        raiseOnError,
        responseFormat,
        dtoType: BlogCommentEnvelope,
    });
}

/**
 * `POST /admin/blogs/{blog_id}/comments/{blog_comment_id}/mark-spam` — mark one comment as spam, setting `status` and `spam`.
 * @param {Client} client @param {number|string} blogId @param {number|string} blogCommentId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<BlogCommentEnvelope>>}
 */
export function markBlogCommentSpam(client, blogId, blogCommentId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(blogsUrls.BLOG_COMMENT_MARK_SPAM, {
        pathParams: {blog_id: blogId, blog_comment_id: blogCommentId},
        raiseOnError,
        responseFormat,
        dtoType: BlogCommentEnvelope,
    });
}
