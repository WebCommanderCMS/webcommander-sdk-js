import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxProfilesUrls from './taxProfilesUrls.js';
import {TaxProfile, TaxProfilePage} from './taxProfilesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TaxProfilePayload */

const requireClient = clientCheck(
    'taxProfiles.listTaxProfiles(client, {limit: 5})',
    'client.taxProfiles.listTaxProfiles({limit: 5})',
);

/**
 * `GET /admin/tax_profiles` — list the tax profiles; `limit` is capped at the page size.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TaxProfilePage>>}
 */
export function listTaxProfiles(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxProfilesUrls.TAX_PROFILES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TaxProfilePage,
    });
}

/**
 * `HEAD /admin/tax_profiles` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTaxProfiles(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxProfilesUrls.TAX_PROFILES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/tax_profiles` — create a tax profile inside the `tax_profile` wrapper.
 * @param {Client} client
 * @param {TaxProfilePayload} payload a `TaxProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxProfile>>}
 */
export function createTaxProfile(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxProfilesUrls.TAX_PROFILES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxProfile,
    });
}

/**
 * `GET /admin/tax_profiles/{tax_profile_id}` — one tax profile, under the singular key.
 * @param {Client} client @param {number|string} taxProfileId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxProfile>>}
 */
export function getTaxProfile(client, taxProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxProfilesUrls.TAX_PROFILE, {
        pathParams: {tax_profile_id: taxProfileId},
        raiseOnError,
        responseFormat,
        dtoType: TaxProfile,
    });
}

/**
 * `HEAD /admin/tax_profiles/{tax_profile_id}` — `200` even for an unknown id, so it is no existence check.
 * @param {Client} client @param {number|string} taxProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headTaxProfile(client, taxProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxProfilesUrls.TAX_PROFILE, {
        pathParams: {tax_profile_id: taxProfileId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/tax_profiles/{tax_profile_id}` — merge into one tax profile.
 * @param {Client} client @param {number|string} taxProfileId
 * @param {TaxProfilePayload} payload a `TaxProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxProfile>>}
 */
export function updateTaxProfile(client, taxProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxProfilesUrls.TAX_PROFILE, {
        pathParams: {tax_profile_id: taxProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxProfile,
    });
}

/**
 * `DELETE /admin/tax_profiles/{tax_profile_id}` — `204`, hard, even for the default row, which leaves
 * `default_tax_profile` dangling.
 * @param {Client} client @param {number|string} taxProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxProfile(client, taxProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxProfilesUrls.TAX_PROFILE, {
        pathParams: {tax_profile_id: taxProfileId},
        raiseOnError,
        responseFormat,
    });
}
