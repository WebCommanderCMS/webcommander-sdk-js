import {SdkUsageError} from '../../errors.js';
import {clientCheck, readCallOptions, requireFiles, requirePayload} from '../callArguments.js';
import * as adminCustomersUrls from './adminCustomersUrls.js';
import {Customer, Page, StoreCreditAdjustment} from './adminCustomersDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const CustomerPage = Page.of(Customer);
const StoreCreditAdjustmentPage = Page.of(StoreCreditAdjustment);

const requireClient = clientCheck(
    'adminCustomers.getCustomers(client, {limit: 5})',
    'client.adminCustomers.getCustomers({limit: 5})',
);

function requireEmail(email) {
    if (email === null || email === undefined || (typeof email === 'string' && !email.trim())) {
        throw new SdkUsageError(
            'email is required and identifies the lookup, so a null or blank one is refused here rather than sent as a different question',
        );
    }
}

/**
 * `GET /admin/customers`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page<Customer>>>}
 */
export function getCustomers(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMERS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CustomerPage,
    });
}

/**
 * `GET /admin/customers/{customer_id}`.
 * @param {Client} client @param {number|string} customerId the record's `customer_id`, never its `internal_id`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Customer>>}
 */
export function getCustomer(client, customerId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMER, {
        pathParams: {customer_id: customerId},
        raiseOnError,
        responseFormat,
        dtoType: Customer,
    });
}

/**
 * `GET /admin/customers/count` — the body is `{total}` alone.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function getCustomerCount(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMERS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/customers/check-email` — the ids come only when the address is taken, so read `map.exists` first.
 * @param {Client} client @param {string} email
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function getCustomerEmailExists(client, email, options = undefined) {
    const target = requireClient(client);
    requireEmail(email);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    // No dtoType: a typed view cannot tell an absent `customer_id` from a null one.
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMERS_CHECK_EMAIL, {
        queryParams: {email},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/customers/export` — `data` is XLSX bytes, not JSON; query keys toggle columns, never filter rows.
 * @param {Client} client @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function getCustomerExport(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMERS_EXPORT, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/customers` — an email already registered, a trashed record's included, is answered `409`.
 * @param {Client} client
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `CustomerInput`
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Customer>>}
 */
export function createCustomer(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMERS, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[adminCustomersUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: Customer,
    });
}

/**
 * `PUT /admin/customers/{customer_id}` — send only the fields being changed.
 * @param {Client} client @param {number|string} customerId
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `CustomerInput`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Customer>>}
 */
export function updateCustomer(client, customerId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(adminCustomersUrls.ADMIN_CUSTOMER, {
        pathParams: {customer_id: customerId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Customer,
    });
}

/**
 * `DELETE /admin/customers/{customer_id}` — soft: the record still reads `200` with `is_in_trash`, and a second
 * delete is `404`.
 * @param {Client} client @param {number|string} customerId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteCustomer(client, customerId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(adminCustomersUrls.ADMIN_CUSTOMER, {
        pathParams: {customer_id: customerId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/customers/{customer_id}/addresses` — a `state` not in its `country` is `400 state_country_mismatch`.
 * @param {Client} client @param {number|string} customerId
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `CustomerInput` with `addresses` filled, each `type` one of `PRIMARY`, `SHIPPING` or `BILLING`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Customer>>}
 */
export function createCustomerAddresses(client, customerId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMER_ADDRESSES, {
        pathParams: {customer_id: customerId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Customer,
    });
}

/**
 * `POST /admin/customers/{customer_id}/reset-password` — sets the password without the current one.
 * @param {Client} client @param {number|string} customerId
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `CustomerInput`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function resetCustomerPassword(client, customerId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMER_RESET_PASSWORD, {
        pathParams: {customer_id: customerId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/customers/{customer_id}/change-password` — a wrong or missing credential is `401`, never a `400`.
 * @param {Client} client @param {number|string} customerId
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `CustomerInput` carrying `email`, `oldPassword` and `password`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function changeCustomerPassword(client, customerId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMER_CHANGE_PASSWORD, {
        pathParams: {customer_id: customerId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/customers/bulk-reset-password` — queues many at once; a refused id is `{customer_id, reason}` in `skipped`.
 * @param {Client} client @param {Record<string, unknown>} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function bulkResetCustomerPasswords(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMERS_BULK_RESET_PASSWORD, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/customers/import` — multipart; the part must be named `file`, or the store answers 400.
 * @param {Client} client
 * @param {Record<string, unknown> | Map<unknown, unknown> | Array<[unknown, unknown]>} files part name against its `[filename, bytes, contentType?]` tuple
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function importCustomers(client, files, options = undefined) {
    const target = requireClient(client);
    requireFiles(files, "{file: ['customers.xlsx', bytes]}");
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMERS_IMPORT, {
        files,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/customers/{customer_id}/store-credit/adjustments` — newest first.
 * @param {Client} client @param {number|string} customerId @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Page<StoreCreditAdjustment>>>}
 */
export function getCustomerStoreCreditAdjustments(client, customerId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(adminCustomersUrls.ADMIN_CUSTOMER_STORE_CREDIT_ADJUSTMENTS, {
        pathParams: {customer_id: customerId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: StoreCreditAdjustmentPage,
    });
}

/**
 * `POST /admin/customers/{customer_id}/store-credit/adjustments` — the only route that records history.
 * @param {Client} client @param {number|string} customerId
 * @param {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} payload a `StoreCreditAdjustmentInput`
 * @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<StoreCreditAdjustment>>}
 */
export function createCustomerStoreCreditAdjustment(client, customerId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(adminCustomersUrls.ADMIN_CUSTOMER_STORE_CREDIT_ADJUSTMENTS, {
        pathParams: {customer_id: customerId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: StoreCreditAdjustment,
    });
}
