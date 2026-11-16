export const SHIPPING_RATES = '/api/{api_version}/admin/shipping_rates';
export const SHIPPING_RATES_COUNT = '/api/{api_version}/admin/shipping_rates/count';
export const SHIPPING_RATE = '/api/{api_version}/admin/shipping_rates/{shipping_rate_id}';

/** Files the record under a transaction number; a differing `transaction_no` beside the wrapper is `400 header_body_mismatch`; one inside is not compared. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
