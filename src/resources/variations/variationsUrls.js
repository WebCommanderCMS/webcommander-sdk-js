export const VARIATIONS = '/api/{api_version}/admin/variations';
export const VARIATION = '/api/{api_version}/admin/variations/{variation_id}';
export const VARIATION_OPTION = '/api/{api_version}/admin/variations/{variation_id}/options/{variation_option_id}';
export const PRODUCT_VARIATIONS = '/api/{api_version}/admin/products/{product_id}/variations';
export const PRODUCT_VARIATIONS_BULK = '/api/{api_version}/admin/products/{product_id}/variations/bulk';

/** Tags a write with a transaction number; it wins over a body `transaction_no` it disagrees with. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
