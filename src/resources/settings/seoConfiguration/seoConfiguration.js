import {clientCheck, readCallOptions, requireFiles, requirePayload} from '../../callArguments.js';
import * as seoConfigurationUrls from './seoConfigurationUrls.js';
import {DocumentRootFile, Redirect, SeoConfiguration} from './seoConfigurationDto.js';
import {Page} from '../../customers/adminCustomersDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} SeoConfigurationPayload */

const DocumentRootFilePage = Page.of(DocumentRootFile);
const RedirectPage = Page.of(Redirect);

const requireClient = clientCheck(
    'seoConfiguration.getSeoConfiguration(client)',
    'client.seoConfiguration.getSeoConfiguration()',
);

/**
 * `GET /admin/settings/seo_configuration` — the whole area, collections inlined without `pagination`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function getSeoConfiguration(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(seoConfigurationUrls.SEO_CONFIGURATION, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `PATCH /admin/settings/seo_configuration` — partial write of one or more sections, wrapped as
 * `{seo_configuration: {<section>: {...}}}`.
 * @param {Client} client @param {SeoConfigurationPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function patchSeoConfiguration(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(seoConfigurationUrls.SEO_CONFIGURATION, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `PUT /admin/settings/seo_configuration` — replace each section the body names.
 * @param {Client} client @param {SeoConfigurationPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function putSeoConfiguration(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(seoConfigurationUrls.SEO_CONFIGURATION, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `HEAD /admin/settings/seo_configuration` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSeoConfiguration(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', seoConfigurationUrls.SEO_CONFIGURATION, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/seo_configuration/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function getSeoConfigurationSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(seoConfigurationUrls.SEO_CONFIGURATION_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `PATCH /admin/settings/seo_configuration/{section}` — partial write of one section, wrapped in its own key.
 * @param {Client} client @param {string} section @param {SeoConfigurationPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function patchSeoConfigurationSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(seoConfigurationUrls.SEO_CONFIGURATION_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `PUT /admin/settings/seo_configuration/{section}` — replace one section, wrapped in its own key; omitted fields
 * reset, so send the section back whole.
 * @param {Client} client @param {string} section @param {SeoConfigurationPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SeoConfiguration>>}
 */
export function putSeoConfigurationSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(seoConfigurationUrls.SEO_CONFIGURATION_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SeoConfiguration,
    });
}

/**
 * `GET /admin/settings/seo_configuration/document_root` — the document-root files, a `Page` with rows on `items`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page<DocumentRootFile>>>}
 */
export function getSeoConfigurationDocumentRoot(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(seoConfigurationUrls.SEO_CONFIGURATION_DOCUMENT_ROOT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: DocumentRootFilePage,
    });
}

/**
 * `HEAD /admin/settings/seo_configuration/document_root` — `200` with no body and no `ETag`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSeoConfigurationDocumentRoot(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', seoConfigurationUrls.SEO_CONFIGURATION_DOCUMENT_ROOT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/settings/seo_configuration/document_root` — add a document-root file as a multipart part named
 * `file`.
 * @param {Client} client
 * @param {Record<string, unknown> | Map<unknown, unknown> | Array<[unknown, unknown]>} files part name against its `[filename, bytes, contentType?]` tuple
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DocumentRootFile>>}
 */
export function uploadSeoConfigurationDocumentRoot(client, files, options = undefined) {
    const target = requireClient(client);
    requireFiles(files, "{file: ['ads.txt', bytes, 'text/plain']}");
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(seoConfigurationUrls.SEO_CONFIGURATION_DOCUMENT_ROOT, {
        files,
        raiseOnError,
        responseFormat,
        dtoType: DocumentRootFile,
    });
}

/**
 * `DELETE /admin/settings/seo_configuration/document_root/{config_key}` — `204`.
 * @param {Client} client @param {string} configKey @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteSeoConfigurationDocumentRootFile(client, configKey, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(seoConfigurationUrls.SEO_CONFIGURATION_DOCUMENT_ROOT_FILE, {
        pathParams: {config_key: configKey},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/seo_configuration/redirects` — the redirects, a `Page` with rows on `items`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page<Redirect>>>}
 */
export function getSeoConfigurationRedirects(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(seoConfigurationUrls.SEO_CONFIGURATION_REDIRECTS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: RedirectPage,
    });
}

/**
 * `HEAD /admin/settings/seo_configuration/redirects` — `200` with no body and no `ETag`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSeoConfigurationRedirects(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', seoConfigurationUrls.SEO_CONFIGURATION_REDIRECTS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/settings/seo_configuration/redirects` — add a redirect, bare or wrapped in `redirect`; both URLs
 * are required.
 * @param {Client} client @param {SeoConfigurationPayload} payload a `Redirect` sends the wrapped form
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Redirect>>}
 */
export function createSeoConfigurationRedirect(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(seoConfigurationUrls.SEO_CONFIGURATION_REDIRECTS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Redirect,
    });
}

/**
 * `GET /admin/settings/seo_configuration/redirects/{redirect_id}` — one redirect.
 * @param {Client} client @param {number|string} redirectId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Redirect>>}
 */
export function getSeoConfigurationRedirect(client, redirectId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(seoConfigurationUrls.SEO_CONFIGURATION_REDIRECT, {
        pathParams: {redirect_id: redirectId},
        raiseOnError,
        responseFormat,
        dtoType: Redirect,
    });
}

/**
 * `HEAD /admin/settings/seo_configuration/redirects/{redirect_id}` — `200` with no body and no `ETag`; an
 * unknown id is `404`.
 * @param {Client} client @param {number|string} redirectId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headSeoConfigurationRedirect(client, redirectId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', seoConfigurationUrls.SEO_CONFIGURATION_REDIRECT, {
        pathParams: {redirect_id: redirectId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PATCH /admin/settings/seo_configuration/redirects/{redirect_id}` — partial change of one redirect.
 * @param {Client} client @param {number|string} redirectId @param {SeoConfigurationPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Redirect>>}
 */
export function patchSeoConfigurationRedirect(client, redirectId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(seoConfigurationUrls.SEO_CONFIGURATION_REDIRECT, {
        pathParams: {redirect_id: redirectId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Redirect,
    });
}

/**
 * `DELETE /admin/settings/seo_configuration/redirects/{redirect_id}` — `204`; nothing restores it, so pass an id
 * your own create answered.
 * @param {Client} client @param {number|string} redirectId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteSeoConfigurationRedirect(client, redirectId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(seoConfigurationUrls.SEO_CONFIGURATION_REDIRECT, {
        pathParams: {redirect_id: redirectId},
        raiseOnError,
        responseFormat,
    });
}
