import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as shippingProfilesUrls from './shippingProfilesUrls.js';
import {ShippingProfile, ShippingProfileCount, ShippingProfileListing} from './shippingProfilesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingProfilePayload */

const requireClient = clientCheck(
    'shippingProfiles.listShippingProfiles(client, {search: "metro"})',
    'client.shippingProfiles.listShippingProfiles({search: "metro"})',
);

/**
 * `GET /admin/shipping_profiles` — List the profiles, newest first. `search` (part of the name) and `default` (`true` or `false`) filter; `sort` is `id`, `name`, `description`, `rule_preference`, `created_at`, `updated_at` or `transaction_no` with `order` `asc` or `desc`; `limit` is 1 to 100 and defaults to 20, `offset` pages. An unknown value is `400`; an unknown name is ignored.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingProfileListing>>}
 */
export function listShippingProfiles(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingProfilesUrls.SHIPPING_PROFILES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfileListing,
    });
}

/**
 * `HEAD /admin/shipping_profiles` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingProfiles(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingProfilesUrls.SHIPPING_PROFILES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/shipping_profiles/count` — a bare `{"total": N}`. `search` and `default` narrow it.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingProfileCount>>}
 */
export function countShippingProfiles(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingProfilesUrls.SHIPPING_PROFILES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfileCount,
    });
}

/**
 * `HEAD /admin/shipping_profiles/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingProfilesCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingProfilesUrls.SHIPPING_PROFILES_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/shipping_profiles` — Create a profile, answered `201` with a `Location`. The body is wrapped in `shipping_profile` and needs `name`, unique without regard to case (`409`); `rule_preference` defaults to `product_assigned_rule`. An unknown field, an `id` or an unwrapped body is `400`.
 * @param {Client} client
 * @param {ShippingProfilePayload} payload a `ShippingProfileInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingProfile>>}
 */
export function createShippingProfile(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingProfilesUrls.SHIPPING_PROFILES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[shippingProfilesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfile,
    });
}

/**
 * `POST /admin/shipping_profiles/wizard` — create a profile with its rules and their rates in one call. A new profile name is
 * `201`; a name that exists adds the rules to that profile and is `200`. Every rule's rate, class and zone is checked
 * first, and one bad value saves nothing. A zone given as `{"name": ...}` is created.
 * @param {Client} client
 * @param {ShippingProfilePayload} payload a `ShippingProfileWizardInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingProfile>>}
 */
export function createShippingProfileWizard(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingProfilesUrls.SHIPPING_PROFILES_WIZARD, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfile,
    });
}

/**
 * `GET /admin/shipping_profiles/{shipping_profile_id}` — one profile, the row under `shipping_profile`. An id that is not plain digits, or unknown, is `404`.
 * @param {Client} client @param {number|string} shippingProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingProfile>>}
 */
export function getShippingProfile(client, shippingProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingProfilesUrls.SHIPPING_PROFILE, {
        pathParams: {shipping_profile_id: shippingProfileId},
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfile,
    });
}

/**
 * `HEAD /admin/shipping_profiles/{shipping_profile_id}` — `200` with no body, `404` for an unknown id.
 * @param {Client} client @param {number|string} shippingProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headShippingProfile(client, shippingProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingProfilesUrls.SHIPPING_PROFILE, {
        pathParams: {shipping_profile_id: shippingProfileId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_profiles/{shipping_profile_id}` — Replace one profile. `name`, `description`, `rule_preference` and `shipping_rules` are all required (`description` may be `null`); the rules not listed are taken off the profile and kept.
 * @param {Client} client @param {number|string} shippingProfileId
 * @param {ShippingProfilePayload} payload a `ShippingProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingProfile>>}
 */
export function updateShippingProfile(client, shippingProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingProfilesUrls.SHIPPING_PROFILE, {
        pathParams: {shipping_profile_id: shippingProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfile,
    });
}

/**
 * `PATCH /admin/shipping_profiles/{shipping_profile_id}` — Change only the fields sent. `shipping_rules` is the full list, so `[]` takes every rule off. `default` true moves the store default to this profile; the default cannot be switched off directly (`409`).
 * @param {Client} client @param {number|string} shippingProfileId
 * @param {ShippingProfilePayload} payload a `ShippingProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingProfile>>}
 */
export function patchShippingProfile(client, shippingProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shippingProfilesUrls.SHIPPING_PROFILE, {
        pathParams: {shipping_profile_id: shippingProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingProfile,
    });
}

/**
 * `DELETE /admin/shipping_profiles/{shipping_profile_id}` — `204`. Its rules and zones stay. The store default is `409` until another profile holds the flag.
 * @param {Client} client @param {number|string} shippingProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteShippingProfile(client, shippingProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(shippingProfilesUrls.SHIPPING_PROFILE, {
        pathParams: {shipping_profile_id: shippingProfileId},
        raiseOnError,
        responseFormat,
    });
}
