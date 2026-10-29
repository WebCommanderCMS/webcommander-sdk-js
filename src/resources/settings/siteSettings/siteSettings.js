import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as siteSettingsUrls from './siteSettingsUrls.js';
import {SiteSettings} from './siteSettingsDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} SiteSettingsPayload */

const requireClient = clientCheck('siteSettings.getSiteSettings(client)', 'client.siteSettings.getSiteSettings()');

/**
 * `GET /admin/settings/site_settings` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SiteSettings>>}
 */
export function getSiteSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(siteSettingsUrls.SITE_SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SiteSettings,
    });
}

/**
 * `PATCH /admin/settings/site_settings` — partial write of one or more sections, wrapped or bare.
 * @param {Client} client @param {SiteSettingsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SiteSettings>>}
 */
export function patchSiteSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(siteSettingsUrls.SITE_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SiteSettings,
    });
}

/**
 * `HEAD /admin/settings/site_settings` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headSiteSettings(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', siteSettingsUrls.SITE_SETTINGS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/site_settings/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SiteSettings>>}
 */
export function getSiteSettingsSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(siteSettingsUrls.SITE_SETTINGS_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SiteSettings,
    });
}

/**
 * `PATCH /admin/settings/site_settings/{section}` — partial write of one section, wrapped in its own key or bare.
 * @param {Client} client @param {string} section @param {SiteSettingsPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<SiteSettings>>}
 */
export function patchSiteSettingsSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(siteSettingsUrls.SITE_SETTINGS_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: SiteSettings,
    });
}
