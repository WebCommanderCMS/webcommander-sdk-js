export const ADMIN_CARTS = '/api/{api_version}/admin/orders/carts';
export const ADMIN_CART = '/api/{api_version}/admin/orders/carts/{session_id}';
export const ADMIN_CART_ITEMS = '/api/{api_version}/admin/orders/carts/{session_id}/cart_items';
export const ADMIN_CART_ITEM = '/api/{api_version}/admin/orders/carts/{session_id}/cart_items/{cart_item_id}';
export const ADMIN_CHECKOUT = '/api/{api_version}/admin/orders/checkout/{session_id}';
export const ADMIN_CHECKOUT_CONFIRM = '/api/{api_version}/admin/orders/checkout/{session_id}/confirm';
export const ADMIN_CHECKOUT_COUPON = '/api/{api_version}/admin/orders/checkout/{session_id}/coupon';
export const ADMIN_CHECKOUT_GIFT_CARD = '/api/{api_version}/admin/orders/checkout/{session_id}/gift_card';
export const ADMIN_CHECKOUT_DELIVERY_SCHEDULES =
    '/api/{api_version}/admin/orders/checkout/{session_id}/delivery_schedules';

/** Files the order a checkout places under this transaction number; it beats `transaction_no`. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
