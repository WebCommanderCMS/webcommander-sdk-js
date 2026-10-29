export const ORDER_FLAGS = '/api/{api_version}/admin/order_flags';
export const ORDER_FLAG = '/api/{api_version}/admin/order_flags/{order_flag_id}';

/** @type {string} */
export const ORDER_FLAGS_KEY = 'order_flags';

/** The key one row arrives under, and the wrapper both writes require. @type {string} */
export const ORDER_FLAG_KEY = 'order_flag';

/** The names the listing accepts; any other is `400 invalid_request`. @type {readonly string[]} */
export const ORDER_FLAGS_QUERY_PARAMS = Object.freeze(['limit', 'offset', 'page', 'field_metadata']);
