import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as shippingSettingsUrls from './shippingSettingsUrls.js';
import {ShippingSettings} from './shippingSettingsDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingSettingsPayload */

const requireClient = clientCheck(
    'shippingSettings.getShippingSettings(client)',
    'client.shippingSettings.getShippingSettings()',
);

/**
 * `GET /admin/settings/shipping_settings` — the seven fields, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingSettings>>}
 */
export function getShippingSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingSettingsUrls.SHIPPING_SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingSettings,
    });
}

/**
 * `PATCH /admin/settings/shipping_settings` — partial write, wrapped or bare.
 * @param {Client} client @param {ShippingSettingsPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingSettings>>}
 */
export function patchShippingSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shippingSettingsUrls.SHIPPING_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingSettings,
    });
}

/**
 * `HEAD /admin/settings/shipping_settings` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingSettings(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingSettingsUrls.SHIPPING_SETTINGS, {
        raiseOnError,
        responseFormat,
    });
}
