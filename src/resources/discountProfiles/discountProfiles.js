import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as discountProfilesUrls from './discountProfilesUrls.js';
import {DiscountProfile, DiscountProfileCoupons, DiscountProfilePage} from './discountProfilesDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} DiscountProfilePayload */

const requireClient = clientCheck(
    'discountProfiles.listDiscountProfiles(client, {limit: 5})',
    'client.discountProfiles.listDiscountProfiles({limit: 5})',
);

/**
 * `GET /admin/discount_profiles` — list the profiles, newest `id` first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<DiscountProfilePage>>}
 */
export function listDiscountProfiles(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(discountProfilesUrls.DISCOUNT_PROFILES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: DiscountProfilePage,
    });
}

/**
 * `POST /admin/discount_profiles` — create a profile from a bare record, answered `201`.
 * @param {Client} client
 * @param {DiscountProfilePayload} payload a `DiscountProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DiscountProfile>>}
 */
export function createDiscountProfile(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(discountProfilesUrls.DISCOUNT_PROFILES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: DiscountProfile,
    });
}

/**
 * `GET /admin/discount_profiles/{discount_profile_id}` — one profile, under the singular key; `field_metadata` adds
 * the field schema beside it.
 * @param {Client} client @param {number|string} discountProfileId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<DiscountProfile>>}
 */
export function getDiscountProfile(client, discountProfileId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(discountProfilesUrls.DISCOUNT_PROFILE, {
        pathParams: {discount_profile_id: discountProfileId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: DiscountProfile,
    });
}

/**
 * `PUT /admin/discount_profiles/{discount_profile_id}` — replace one profile.
 * @param {Client} client @param {number|string} discountProfileId
 * @param {DiscountProfilePayload} payload a `DiscountProfileInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DiscountProfile>>}
 */
export function updateDiscountProfile(client, discountProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(discountProfilesUrls.DISCOUNT_PROFILE, {
        pathParams: {discount_profile_id: discountProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: DiscountProfile,
    });
}

/**
 * `DELETE /admin/discount_profiles/{discount_profile_id}` — delete one profile and its coupons; `204`, no body.
 * @param {Client} client @param {number|string} discountProfileId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteDiscountProfile(client, discountProfileId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(discountProfilesUrls.DISCOUNT_PROFILE, {
        pathParams: {discount_profile_id: discountProfileId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/discount_profiles/{discount_profile_id}/create-coupons` — generate codes on a profile that has
 * `is_apply_coupon_code`.
 * @param {Client} client @param {number|string} discountProfileId
 * @param {DiscountProfilePayload} payload a `DiscountProfileCouponsInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DiscountProfileCoupons>>}
 */
export function createDiscountProfileCoupons(client, discountProfileId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(discountProfilesUrls.DISCOUNT_PROFILE_CREATE_COUPONS, {
        pathParams: {discount_profile_id: discountProfileId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: DiscountProfileCoupons,
    });
}

/**
 * `POST /admin/discount_coupons/assign-customer` — assign a generated code to an existing customer, from a bare
 * `{"code", "email"}`.
 * @param {Client} client
 * @param {DiscountProfilePayload} payload a `DiscountCouponCustomerInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function assignDiscountCouponCustomer(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(discountProfilesUrls.DISCOUNT_COUPONS_ASSIGN_CUSTOMER, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}
