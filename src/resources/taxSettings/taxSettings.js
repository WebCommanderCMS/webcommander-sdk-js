import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxSettingsUrls from './taxSettingsUrls.js';
import {TaxSettings} from './taxSettingsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TaxSettingsPayload */

const requireClient = clientCheck('taxSettings.getTaxSettings(client)', 'client.taxSettings.getTaxSettings()');

/**
 * `GET /admin/settings/tax` — the tax settings, under `tax_settings`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TaxSettings>>}
 */
export function getTaxSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxSettingsUrls.TAX_SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TaxSettings,
    });
}

/**
 * `PUT /admin/settings/tax` — merge into the tax settings, wrapped in `tax_settings`.
 * @param {Client} client
 * @param {TaxSettingsPayload} payload a `TaxSettingsInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxSettings>>}
 */
export function putTaxSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxSettingsUrls.TAX_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxSettings,
    });
}

/**
 * `PATCH /admin/settings/tax` — write one field or several, wrapped in `tax_settings`.
 * @param {Client} client
 * @param {TaxSettingsPayload} payload a `TaxSettingsInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxSettings>>}
 */
export function patchTaxSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(taxSettingsUrls.TAX_SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxSettings,
    });
}

/**
 * `HEAD /admin/settings/tax` — ask whether the tax settings are reachable; no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTaxSettings(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxSettingsUrls.TAX_SETTINGS, {
        raiseOnError,
        responseFormat,
    });
}
