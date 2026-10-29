import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxZonesUrls from './taxZonesUrls.js';
import {TaxZone, TaxZonePage} from './taxZonesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TaxZonePayload */

const requireClient = clientCheck(
    'taxZones.listTaxZones(client, {limit: 5})',
    'client.taxZones.listTaxZones({limit: 5})',
);

/**
 * `GET /admin/tax_zones` — list the tax zones; `limit` is capped at the page size, so page on `pagination.total`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TaxZonePage>>}
 */
export function listTaxZones(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxZonesUrls.TAX_ZONES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TaxZonePage,
    });
}

/**
 * `HEAD /admin/tax_zones` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTaxZones(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxZonesUrls.TAX_ZONES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/tax_zones` — create a tax zone inside the `tax_zone` wrapper.
 * @param {Client} client @param {TaxZonePayload} payload a `TaxZoneInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxZone>>}
 */
export function createTaxZone(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxZonesUrls.TAX_ZONES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxZone,
    });
}

/**
 * `GET /admin/tax_zones/{tax_zone_id}` — one tax zone, under the singular key.
 * @param {Client} client @param {number|string} taxZoneId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxZone>>}
 */
export function getTaxZone(client, taxZoneId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxZonesUrls.TAX_ZONE, {
        pathParams: {tax_zone_id: taxZoneId},
        raiseOnError,
        responseFormat,
        dtoType: TaxZone,
    });
}

/**
 * `HEAD /admin/tax_zones/{tax_zone_id}` — `200` even for an unknown id, so it is no existence check.
 * @param {Client} client @param {number|string} taxZoneId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headTaxZone(client, taxZoneId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxZonesUrls.TAX_ZONE, {
        pathParams: {tax_zone_id: taxZoneId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/tax_zones/{tax_zone_id}` — update one tax zone.
 * @param {Client} client @param {number|string} taxZoneId
 * @param {TaxZonePayload} payload a `TaxZoneInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxZone>>}
 */
export function updateTaxZone(client, taxZoneId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxZonesUrls.TAX_ZONE, {
        pathParams: {tax_zone_id: taxZoneId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxZone,
    });
}

/**
 * `DELETE /admin/tax_zones/{tax_zone_id}` — `204`, hard; confirm it by a read, as straight after a refusal it
 * answers that refusal and removes nothing.
 * @param {Client} client @param {number|string} taxZoneId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxZone(client, taxZoneId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxZonesUrls.TAX_ZONE, {
        pathParams: {tax_zone_id: taxZoneId},
        raiseOnError,
        responseFormat,
    });
}
