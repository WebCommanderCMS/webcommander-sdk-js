export const VARIATIONS = '/api/{api_version}/admin/variations';
export const VARIATION = '/api/{api_version}/admin/variations/{variation_id}';
export const VARIATION_OPTION = '/api/{api_version}/admin/variations/{variation_id}/options/{variation_option_id}';
export const PRODUCT_VARIATIONS = '/api/{api_version}/admin/products/{product_id}/variations';
export const PRODUCT_VARIATION = '/api/{api_version}/admin/products/{product_id}/variations/{variation_id}';
export const PRODUCT_VARIATIONS_BULK = '/api/{api_version}/admin/products/{product_id}/variations/bulk';

/** Tags a write with a transaction number; a differing top-level `transaction_no` is `400 header_body_mismatch`. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
