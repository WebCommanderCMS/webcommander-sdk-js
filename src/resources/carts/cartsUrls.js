export const CARTS = '/api/{api_version}/carts';
export const CART = '/api/{api_version}/carts/{session_id}';
export const CART_ITEM = '/api/{api_version}/carts/{session_id}/cart_items/{cart_item_id}';

/** The one cart path under `/admin`. @type {string} */
export const CART_ORDER = '/api/{api_version}/admin/orders/carts/{session_id}';

/** The key the session write answers under, spelled as the store spells it. @type {string} */
export const CART_SESSION_KEY = 'sessionId';

/** Files the order a cart becomes under this transaction number; it beats `transaction_no`. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
