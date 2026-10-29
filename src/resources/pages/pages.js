import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as pagesUrls from './pagesUrls.js';
import {Page, PageCount, PageDeleteBlockers, PageListing} from './pagesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} PagePayload */

const requireClient = clientCheck(
    'pages.listPages(client, {search: "about"})',
    'client.pages.listPages({search: "about"})',
);

/**
 * `GET /admin/pages` — list the pages outside the trash, newest change first. `search`, `active`, `has_layout`,
 * `visibility`, `created_from`/`created_to`, `updated_from`/`updated_to` (`YYYY-MM-DD`), `author`, `store` and
 * `not_in_store` filter; `sort` and `order` order; `limit` is 1 to 100 or `all`. Unknown names are `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PageListing>>}
 */
export function listPages(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(pagesUrls.PAGES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PageListing,
    });
}

/**
 * `HEAD /admin/pages` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headPages(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', pagesUrls.PAGES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/pages/count` — a bare `{"total": N}`; the listing's filters narrow it, and `sort`, `order`, `limit` and
 * `offset` are ignored.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PageCount>>}
 */
export function countPages(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(pagesUrls.PAGES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PageCount,
    });
}

/**
 * `HEAD /admin/pages/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headPagesCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', pagesUrls.PAGES_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/pages` — create a page from `{"page": {...}}`, answered `201`. `name` and `visibility` are required;
 * the URL is made from the name.
 * @param {Client} client
 * @param {PagePayload} payload a `PageInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Page>>}
 */
export function createPage(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(pagesUrls.PAGES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `GET /admin/pages/{page_id}` — one page, with an `ETag`; a page in the trash still reads, `in_trash` true.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page>>}
 */
export function getPage(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(pagesUrls.PAGE, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `HEAD /admin/pages/{page_id}` — `200` with no body and the `ETag` the row's `GET` carries.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headPage(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', pagesUrls.PAGE, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/pages/{page_id}` — replace one page. `name`, `title`, `subtitle`, `url`, `layout`, `visibility`,
 * `body_class`, `active`, `disable_tracking` and `password_protection` are required, a partial body is `400`;
 * `subtitle`, `layout` and `body_class` take `null`.
 * @param {Client} client @param {number|string} pageId
 * @param {PagePayload} payload a `PageInput`, a mapping or a JSON string
 * @param {string | null} [ifMatch] sent as the `If-Match` header; a stale `ETag` is `412`, checked before the body
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Page>>}
 */
export function updatePage(client, pageId, payload, ifMatch = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(pagesUrls.PAGE, {
        pathParams: {page_id: pageId},
        jsonBody: payload,
        headers: ifMatch == null ? undefined : {[pagesUrls.IF_MATCH_HEADER]: ifMatch},
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `PATCH /admin/pages/{page_id}` — change only the fields sent; an empty `page` is `400` and a page in the trash
 * `409`.
 * @param {Client} client @param {number|string} pageId
 * @param {PagePayload} payload a `PageInput`, a mapping or a JSON string
 * @param {string | null} [ifMatch] sent as the `If-Match` header; a stale `ETag` is `412`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Page>>}
 */
export function patchPage(client, pageId, payload, ifMatch = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(pagesUrls.PAGE, {
        pathParams: {page_id: pageId},
        jsonBody: payload,
        headers: ifMatch == null ? undefined : {[pagesUrls.IF_MATCH_HEADER]: ifMatch},
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `DELETE /admin/pages/{page_id}` — `204`, to the trash; `force` `true` purges it, from the trash or live. A second
 * plain delete is `400`, and the landing page is `409`.
 * @param {Client} client @param {number|string} pageId @param {Record<string, unknown>} [queryParams]
 * @param {string | null} [ifMatch] sent as the `If-Match` header; a stale `ETag` is `412`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deletePage(client, pageId, queryParams = undefined, ifMatch = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(pagesUrls.PAGE, {
        pathParams: {page_id: pageId},
        queryParams,
        headers: ifMatch == null ? undefined : {[pagesUrls.IF_MATCH_HEADER]: ifMatch},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/pages/{page_id}/url` — move a page to a new URL with a bare `{"url": ...}`; answers the page. A URL
 * another page holds is `409`.
 * @param {Client} client @param {number|string} pageId
 * @param {PagePayload} payload a `PageUrlInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Page>>}
 */
export function updatePageUrl(client, pageId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(pagesUrls.PAGE_URL, {
        pathParams: {page_id: pageId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `PATCH /admin/pages/{page_id}/landing` — make a page the store's landing page; takes no body. The previous landing
 * page stops being it.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page>>}
 */
export function setLandingPage(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(pagesUrls.PAGE_LANDING, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}

/**
 * `GET /admin/pages/{page_id}/delete-blockers` — whether a delete would pass and what blocks it, such as
 * `landing_page`.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PageDeleteBlockers>>}
 */
export function getPageDeleteBlockers(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(pagesUrls.PAGE_DELETE_BLOCKERS, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
        dtoType: PageDeleteBlockers,
    });
}

/**
 * `HEAD /admin/pages/{page_id}/delete-blockers` — `200` with no body.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headPageDeleteBlockers(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', pagesUrls.PAGE_DELETE_BLOCKERS, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/pages/{page_id}/duplicate` — copy a page, answered `201`; a body field is `400`. The copy is
 * `"<name> - Copy"` at `<url>-copy`, then `- Copy 1` at `-copy-1`.
 * @param {Client} client @param {number|string} pageId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page>>}
 */
export function duplicatePage(client, pageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(pagesUrls.PAGE_DUPLICATE, {
        pathParams: {page_id: pageId},
        raiseOnError,
        responseFormat,
        dtoType: Page,
    });
}
