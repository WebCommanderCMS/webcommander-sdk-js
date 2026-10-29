import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as customerPortalUrls from './customerPortalUrls.js';
import {CustomerPortal} from './customerPortalDto.js';

/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CustomerPortalPayload */

const requireClient = clientCheck(
    'customerPortal.getCustomerPortal(client)',
    'client.customerPortal.getCustomerPortal()',
);

/**
 * `GET /admin/settings/customer_portal` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomerPortal>>}
 */
export function getCustomerPortal(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerPortalUrls.CUSTOMER_PORTAL, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerPortal,
    });
}

/**
 * `PATCH /admin/settings/customer_portal` — partial write of the writable sections, wrapped as
 * `{customer_portal: {<section>: {...}}}` and only so.
 * @param {Client} client @param {CustomerPortalPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomerPortal>>}
 */
export function patchCustomerPortal(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(customerPortalUrls.CUSTOMER_PORTAL, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerPortal,
    });
}

/**
 * `HEAD /admin/settings/customer_portal` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCustomerPortal(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', customerPortalUrls.CUSTOMER_PORTAL, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/settings/customer_portal/{section}` — one section, under its own key.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerPortal>>}
 */
export function getCustomerPortalSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerPortalUrls.CUSTOMER_PORTAL_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerPortal,
    });
}

/**
 * `PATCH /admin/settings/customer_portal/{section}` — partial write of one writable section, wrapped in its own key or bare.
 * @param {Client} client @param {string} section @param {CustomerPortalPayload} payload
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerPortal>>}
 */
export function patchCustomerPortalSection(client, section, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(customerPortalUrls.CUSTOMER_PORTAL_SECTION, {
        pathParams: {section},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerPortal,
    });
}
