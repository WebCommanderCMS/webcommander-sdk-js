export const ORDERS = '/api/{api_version}/admin/orders';
export const ORDERS_COUNT = '/api/{api_version}/admin/orders/count';
export const ORDERS_WITH_PAYMENT = '/api/{api_version}/admin/orders/with-payment';
export const ORDER = '/api/{api_version}/admin/orders/{order_id}';
export const ORDER_ADDRESSES = '/api/{api_version}/admin/orders/{order_id}/addresses';
export const ORDER_CANCEL = '/api/{api_version}/admin/orders/{order_id}/cancel';
export const ORDER_COMMENTS = '/api/{api_version}/admin/orders/{order_id}/comments';
export const ORDER_PAYMENTS = '/api/{api_version}/admin/orders/{order_id}/payments';
export const ORDER_REFUNDS = '/api/{api_version}/admin/orders/{order_id}/refunds';
export const ORDER_SHIPMENT_STATUS = '/api/{api_version}/admin/orders/{order_id}/shipment-status';
export const ORDER_SHIPMENTS = '/api/{api_version}/admin/orders/{order_id}/shipments';
export const ORDER_SHIPMENT = '/api/{api_version}/admin/orders/{order_id}/shipments/{shipment_id}';
export const ORDER_UPDATE_STATUS = '/api/{api_version}/admin/orders/{order_id}/update-status';

/** These two resolve the slot against the order's `internal_id`: its `order_id` names another order, or none. */
export const ORDER_CUSTOM_FIELDS = '/api/{api_version}/admin/orders/{order_internal_id}/custom_fields';
export const ORDER_SEND_INVOICE = '/api/{api_version}/admin/orders/{order_internal_id}/send-invoice';

export const PAYMENT_REFUNDS = '/api/{api_version}/admin/payment/{payment_id}/refunds';
export const ORDER_STATUS_ADD = '/api/{api_version}/admin/order/add-order-status';
export const CUSTOMER_ORDERS = '/api/{api_version}/admin/customers/{customer_id}/orders';

/** The key the listing's rows and a customer's orders arrive under; the count wraps its record in it. @type {string} */
export const ORDERS_KEY = 'orders';

/** The key one order arrives under, and the wrapper `PUT` and `PATCH` read beside a bare body. @type {string} */
export const ORDER_KEY = 'order';

/** @type {string} */
export const COMMENTS_KEY = 'comments';

/** The key one comment arrives under; the comment write takes a bare record. @type {string} */
export const COMMENT_KEY = 'comment';

/** @type {string} */
export const SHIPMENTS_KEY = 'shipments';

/** @type {string} */
export const SHIPMENT_KEY = 'shipment';

/** The wrapper a payment write requires, and the key its receipt arrives under. @type {string} */
export const PAYMENT_KEY = 'payment';

/** The listing's page size when `limit` is absent, and its ceiling when `limit` is larger. @type {number} */
export const ORDERS_PAGE_SIZE = 20;

/**
 * The ten values the listing's `sort` refusal names; another value is `400`, except `id`, answered in the
 * default order.
 * @type {readonly string[]}
 */
export const ORDERS_SORT_FIELDS = Object.freeze([
    'orderNo',
    'customerName',
    'created',
    'orderStatus',
    'paymentStatus',
    'shippingStatus',
    'deliveryType',
    'scheduledDate',
    'total',
    'items',
]);

/** The header a payment refund is refused without; a repeat under one key replays the first. @type {string} */
export const IDEMPOTENCY_KEY_HEADER = 'Idempotency-Key';

/** Files a created order under this transaction number; it beats a `transaction_no` body field. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
