import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as customerGroupsUrls from './customerGroupsUrls.js';
import {
    CustomerGroup,
    CustomerGroupAssignment,
    CustomerGroupCount,
    CustomerGroupMember,
    CustomerGroupPage,
} from './customerGroupsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CustomerGroupPayload */

const requireClient = clientCheck(
    'customerGroups.listCustomerGroups(client, {limit: 5})',
    'client.customerGroups.listCustomerGroups({limit: 5})',
);

/**
 * `GET /admin/customer_groups` — list the groups, by `name`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomerGroupPage>>}
 */
export function listCustomerGroups(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerGroupsUrls.CUSTOMER_GROUPS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroupPage,
    });
}

/**
 * `GET /admin/customer_groups/count` — how many groups match.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomerGroupCount>>}
 */
export function countCustomerGroups(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerGroupsUrls.CUSTOMER_GROUPS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroupCount,
    });
}

/**
 * `POST /admin/customer_groups` — create a group, answered `201`.
 * @param {Client} client
 * @param {CustomerGroupPayload} payload a `CustomerGroupInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerGroup>>}
 */
export function createCustomerGroup(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(customerGroupsUrls.CUSTOMER_GROUPS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroup,
    });
}

/**
 * `GET /admin/customer_groups/{customer_group_id}` — one group with `customer_count` and its `customers`;
 * `field_metadata` adds the schema beside it.
 * @param {Client} client @param {number|string} customerGroupId a row's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CustomerGroup>>}
 */
export function getCustomerGroup(client, customerGroupId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerGroupsUrls.CUSTOMER_GROUP, {
        pathParams: {customer_group_id: customerGroupId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroup,
    });
}

/**
 * `PATCH /admin/customer_groups/{customer_group_id}` — change only the fields sent.
 * @param {Client} client @param {number|string} customerGroupId
 * @param {CustomerGroupPayload} payload a `CustomerGroupInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerGroup>>}
 */
export function patchCustomerGroup(client, customerGroupId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(customerGroupsUrls.CUSTOMER_GROUP, {
        pathParams: {customer_group_id: customerGroupId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroup,
    });
}

/**
 * `DELETE /admin/customer_groups/{customer_group_id}` — `204`, hard; the group's memberships go and the members
 * stay as customers.
 * @param {Client} client @param {number|string} customerGroupId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteCustomerGroup(client, customerGroupId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(customerGroupsUrls.CUSTOMER_GROUP, {
        pathParams: {customer_group_id: customerGroupId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PATCH /admin/customer_groups/{customer_group_id}/customers` — replace the member list with `{"customers": [customer_id, ...]}`.
 * @param {Client} client @param {number|string} customerGroupId
 * @param {CustomerGroupPayload} payload a `CustomerGroupCustomersInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerGroup>>}
 */
export function updateCustomerGroupCustomers(client, customerGroupId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(customerGroupsUrls.CUSTOMER_GROUP_CUSTOMERS, {
        pathParams: {customer_group_id: customerGroupId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroup,
    });
}

/**
 * `GET /admin/customer_groups/{customer_group_id}/customers/{customer_id}` — one member by its `customer_id`; a
 * customer outside the group is `404`.
 * @param {Client} client @param {number|string} customerGroupId @param {number|string} customerId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerGroupMember>>}
 */
export function getCustomerGroupCustomer(client, customerGroupId, customerId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(customerGroupsUrls.CUSTOMER_GROUP_CUSTOMER, {
        pathParams: {customer_group_id: customerGroupId, customer_id: customerId},
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroupMember,
    });
}

/**
 * `POST /admin/customer_groups/assign` — add one customer to one group.
 * @param {Client} client
 * @param {CustomerGroupPayload} payload a `CustomerGroupAssignInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerGroupAssignment>>}
 */
export function assignCustomerGroup(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(customerGroupsUrls.CUSTOMER_GROUPS_ASSIGN, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CustomerGroupAssignment,
    });
}
