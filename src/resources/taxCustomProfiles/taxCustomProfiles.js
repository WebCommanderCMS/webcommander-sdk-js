import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxCustomProfilesUrls from './taxCustomProfilesUrls.js';
import {CustomProfile, CustomProfilePage} from './taxCustomProfilesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CustomProfilePayload */

const requireClient = clientCheck(
    'taxCustomProfiles.listTaxCustomProfiles(client, {limit: 5})',
    'client.taxCustomProfiles.listTaxCustomProfiles({limit: 5})',
);

/**
 * `GET /admin/tax/custom-profiles` — list the custom profiles, newest first. `limit` is 1 to 100 with the cap
 * echoed, `offset` or `page` move the window, and `sort` takes `id` or `name`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomProfilePage>>}
 */
export function listTaxCustomProfiles(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCustomProfilesUrls.TAX_CUSTOM_PROFILES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomProfilePage,
    });
}

/**
 * `POST /admin/tax/custom-profiles` — create a custom profile inside the `custom_profile` wrapper, answered `201`;
 * `name` is required and `code` is discarded.
 * @param {Client} client
 * @param {CustomProfilePayload} payload a `CustomProfileInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomProfile>>}
 */
export function createTaxCustomProfile(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxCustomProfilesUrls.TAX_CUSTOM_PROFILES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[taxCustomProfilesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: CustomProfile,
    });
}

/**
 * `GET /admin/tax/custom-profiles/{custom_profile_id}` — one custom profile with an `ETag`; only this read carries
 * `rules`.
 * @param {Client} client @param {number|string} customProfileId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomProfile>>}
 */
export function getTaxCustomProfile(client, customProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCustomProfilesUrls.TAX_CUSTOM_PROFILE, {
        pathParams: {custom_profile_id: customProfileId},
        raiseOnError,
        responseFormat,
        dtoType: CustomProfile,
    });
}

/**
 * `PUT /admin/tax/custom-profiles/{custom_profile_id}` — replace one custom profile, answered `200` with an `ETag`;
 * an omitted `name` is kept, an omitted `description` or `tax_code` comes back `null`.
 * @param {Client} client @param {number|string} customProfileId
 * @param {CustomProfilePayload} payload a `CustomProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomProfile>>}
 */
export function updateTaxCustomProfile(client, customProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxCustomProfilesUrls.TAX_CUSTOM_PROFILE, {
        pathParams: {custom_profile_id: customProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomProfile,
    });
}

/**
 * `DELETE /admin/tax/custom-profiles/{custom_profile_id}` — `204`, hard.
 * @param {Client} client @param {number|string} customProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxCustomProfile(client, customProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxCustomProfilesUrls.TAX_CUSTOM_PROFILE, {
        pathParams: {custom_profile_id: customProfileId},
        raiseOnError,
        responseFormat,
    });
}
