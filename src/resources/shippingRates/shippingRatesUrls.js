export const SHIPPING_RATES = '/api/{api_version}/admin/shipping_rates';
export const SHIPPING_RATES_COUNT = '/api/{api_version}/admin/shipping_rates/count';
export const SHIPPING_RATE = '/api/{api_version}/admin/shipping_rates/{shipping_rate_id}';

/** Files the record under a transaction number; it wins over a `transaction_no` in the body. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
