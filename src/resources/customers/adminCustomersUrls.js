/** `{customer_id}` is a record's `customer_id`, never its `internal_id`. */

export const ADMIN_CUSTOMERS = '/api/{api_version}/admin/customers';
export const ADMIN_CUSTOMER = '/api/{api_version}/admin/customers/{customer_id}';
export const ADMIN_CUSTOMERS_COUNT = '/api/{api_version}/admin/customers/count';
export const ADMIN_CUSTOMERS_CHECK_EMAIL = '/api/{api_version}/admin/customers/check-email';
export const ADMIN_CUSTOMERS_EXPORT = '/api/{api_version}/admin/customers/export';
export const ADMIN_CUSTOMERS_IMPORT = '/api/{api_version}/admin/customers/import';
export const ADMIN_CUSTOMERS_BULK_RESET_PASSWORD = '/api/{api_version}/admin/customers/bulk-reset-password';
export const ADMIN_CUSTOMER_ADDRESSES = '/api/{api_version}/admin/customers/{customer_id}/addresses';
export const ADMIN_CUSTOMER_RESET_PASSWORD = '/api/{api_version}/admin/customers/{customer_id}/reset-password';
export const ADMIN_CUSTOMER_CHANGE_PASSWORD = '/api/{api_version}/admin/customers/{customer_id}/change-password';
export const ADMIN_CUSTOMER_STORE_CREDIT_ADJUSTMENTS =
    '/api/{api_version}/admin/customers/{customer_id}/store-credit/adjustments';

/** Files the new customer under this transaction number; it beats a `transaction_no` body field. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
