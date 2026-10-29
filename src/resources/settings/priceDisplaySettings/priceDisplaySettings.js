import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as priceDisplaySettingsUrls from './priceDisplaySettingsUrls.js';
import {PriceDisplaySettings} from './priceDisplaySettingsDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} PriceDisplaySettingsPayload */

const requireClient = clientCheck(
    'priceDisplaySettings.getPriceDisplaySettings(client)',
    'client.priceDisplaySettings.getPriceDisplaySettings()',
);

/**
 * `GET /admin/settings/price_display_settings` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PriceDisplaySettings>>}
 */
export function getPriceDisplaySettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(priceDisplaySettingsUrls.PRICE_DISPLAY_SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PriceDisplaySettings,
    });
}

/**
 * `PATCH /admin/settings/price_display_settings` — partial write of either section.
 * @param {Client} client @param {PriceDisplaySettingsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<PriceDisplaySettings>>}
 */
export function patchPriceDisplaySettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(priceDisplaySettingsUrls.PRICE_DISPLAY_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: PriceDisplaySettings,
    });
}

/**
 * `HEAD /admin/settings/price_display_settings` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headPriceDisplaySettings(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', priceDisplaySettingsUrls.PRICE_DISPLAY_SETTINGS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/price_display_settings/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PriceDisplaySettings>>}
 */
export function getPriceDisplaySettingsSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(priceDisplaySettingsUrls.PRICE_DISPLAY_SETTINGS_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: PriceDisplaySettings,
    });
}

/**
 * `PATCH /admin/settings/price_display_settings/{section}` — partial write of one section, wrapped in its own
 * key or bare.
 * @param {Client} client @param {string} section @param {PriceDisplaySettingsPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PriceDisplaySettings>>}
 */
export function patchPriceDisplaySettingsSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(priceDisplaySettingsUrls.PRICE_DISPLAY_SETTINGS_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: PriceDisplaySettings,
    });
}
