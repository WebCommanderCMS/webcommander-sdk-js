import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as searchSettingsUrls from './searchSettingsUrls.js';
import {ReindexStatus, SearchSettings} from './searchSettingsDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} SearchSettingsPayload */

const requireClient = clientCheck(
    'searchSettings.getSearchSettings(client)',
    'client.searchSettings.getSearchSettings()',
);

/**
 * `GET /admin/settings/search_settings` — the whole area, with `group_meta`; `reindex_status` is not in it.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function getSearchSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchSettingsUrls.SEARCH_SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `PATCH /admin/settings/search_settings` — partial write of one or more sections; naming `synonyms` reindexes.
 * @param {Client} client @param {SearchSettingsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function patchSearchSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchSettingsUrls.SEARCH_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `PUT /admin/settings/search_settings` — replace the whole area; leaving out `synonyms` resets it and reindexes.
 * @param {Client} client @param {SearchSettingsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function putSearchSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(searchSettingsUrls.SEARCH_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `HEAD /admin/settings/search_settings` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSearchSettings(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', searchSettingsUrls.SEARCH_SETTINGS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/search_settings/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function getSearchSettingsSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchSettingsUrls.SEARCH_SETTINGS_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `PATCH /admin/settings/search_settings/{section}` — partial write of one section, wrapped in its own key and
 * only so. Never write `synonyms`.
 * @param {Client} client @param {string} section @param {SearchSettingsPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function patchSearchSettingsSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(searchSettingsUrls.SEARCH_SETTINGS_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `PUT /admin/settings/search_settings/{section}` — replace one section, wrapped in its own key; writing `synonyms`
 * reindexes.
 * @param {Client} client @param {string} section @param {SearchSettingsPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SearchSettings>>}
 */
export function putSearchSettingsSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(searchSettingsUrls.SEARCH_SETTINGS_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SearchSettings,
    });
}

/**
 * `GET /admin/settings/search_settings/reindex_status` — where the reindex stands, a bare record; read-only.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ReindexStatus>>}
 */
export function getSearchSettingsReindexStatus(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(searchSettingsUrls.SEARCH_SETTINGS_REINDEX_STATUS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ReindexStatus,
    });
}

/**
 * `HEAD /admin/settings/search_settings/reindex_status` — `200` with no body and no `ETag`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSearchSettingsReindexStatus(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', searchSettingsUrls.SEARCH_SETTINGS_REINDEX_STATUS, {
        raiseOnError,
        responseFormat,
    });
}
