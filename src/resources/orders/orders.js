import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as ordersUrls from './ordersUrls.js';
import {
    CustomerOrders,
    FlatOrder,
    InvoiceDispatch,
    Order,
    OrderAddresses,
    OrderComment,
    OrderCommentList,
    OrderCount,
    OrderCustomFields,
    OrderPage,
    OrderRefund,
    OrderRefundPage,
    OrderShipment,
    OrderShipmentList,
    PaymentReceipt,
    PaymentRefund,
    ShipmentStatus,
} from './ordersDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} OrderPayload */

const requireClient = clientCheck('orders.listOrders(client, {limit: 5})', 'client.orders.listOrders({limit: 5})');

/**
 * `GET /admin/orders` — list the orders, newest first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderPage>>}
 */
export function listOrders(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDERS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderPage,
    });
}

/**
 * `GET /admin/orders/count` — `{"orders": {"count": N}}`; the listing's filters narrow it, and its paging, sort and
 * `field_metadata` change nothing.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderCount>>}
 */
export function countOrders(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDERS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderCount,
    });
}

/**
 * `POST /admin/orders` — create an order from a bare record, answered `201` in the flat shape with `status` beside it.
 * @param {Client} client
 * @param {OrderPayload} payload an `OrderInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function createOrder(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDERS, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[ordersUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `POST /admin/orders/with-payment` — create an order and record a payment on it, answered `201`.
 * @param {Client} client
 * @param {OrderPayload} payload an `OrderWithPaymentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function createOrderWithPayment(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDERS_WITH_PAYMENT, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `GET /admin/orders/{order_id}` — one order in sections, `group_meta` beside it.
 * @param {Client} client @param {number|string} orderId an order's `order_id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Order>>}
 */
export function getOrder(client, orderId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER, {
        pathParams: {order_id: orderId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Order,
    });
}

/**
 * `PUT /admin/orders/{order_id}` — write the customer and the addresses, each address sent replacing the stored one.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderUpdateInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Order>>}
 */
export function updateOrder(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(ordersUrls.ORDER, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Order,
    });
}

/**
 * `PATCH /admin/orders/{order_id}` — change named fields.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderPatchInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Order>>}
 */
export function patchOrder(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(ordersUrls.ORDER, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Order,
    });
}

/**
 * `DELETE /admin/orders/{order_id}` — hard. Read `status`: `deleted`, or `not_found` for an id no order holds, both
 * at `200`.
 * @param {Client} client @param {number|string} orderId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse>}
 */
export function deleteOrder(client, orderId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(ordersUrls.ORDER, {
        pathParams: {order_id: orderId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PATCH /admin/orders/{order_id}/addresses` — replace one or both addresses.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderAddressesInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderAddresses>>}
 */
export function updateOrderAddresses(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(ordersUrls.ORDER_ADDRESSES, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderAddresses,
    });
}

/**
 * `POST /admin/orders/{order_id}/cancel` — answered `201`.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} [payload] an `OrderCancelInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function cancelOrder(client, orderId, payload = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_CANCEL, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `GET /admin/orders/{order_id}/comments` — an order's comments, oldest first and unpaged.
 * @param {Client} client @param {number|string} orderId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderCommentList>>}
 */
export function listOrderComments(client, orderId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER_COMMENTS, {
        pathParams: {order_id: orderId},
        raiseOnError,
        responseFormat,
        dtoType: OrderCommentList,
    });
}

/**
 * `POST /admin/orders/{order_id}/comments` — add a comment from a bare record, answered `201`; a `comment` wrapper
 * hides `content` and is `400`.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderCommentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderComment>>}
 */
export function createOrderComment(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_COMMENTS, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderComment,
    });
}

/**
 * `GET /admin/orders/{order_internal_id}/custom_fields` — an order's custom field values.
 * @param {Client} client @param {number|string} orderInternalId an order's `internal_id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderCustomFields>>}
 */
export function getOrderCustomFields(client, orderInternalId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER_CUSTOM_FIELDS, {
        pathParams: {order_internal_id: orderInternalId},
        raiseOnError,
        responseFormat,
        dtoType: OrderCustomFields,
    });
}

/**
 * `POST /admin/orders/{order_id}/payments` — record a payment, answered `201`.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderPaymentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PaymentReceipt>>}
 */
export function createOrderPayment(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_PAYMENTS, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: PaymentReceipt,
    });
}

/**
 * `GET /admin/orders/{order_id}/refunds` — an order's refunds, newest first. `limit` is 1 to 20 (above 20 is capped,
 * `0` is `400`), with `offset` or a 1-based `page`; any other name is ignored.
 * @param {Client} client @param {number|string} orderId @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderRefundPage>>}
 */
export function listOrderRefunds(client, orderId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER_REFUNDS, {
        pathParams: {order_id: orderId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: OrderRefundPage,
    });
}

/**
 * `POST /admin/orders/{order_id}/refunds` — refund against an order, answered `201`.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderRefundInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderRefund>>}
 */
export function createOrderRefund(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_REFUNDS, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderRefund,
    });
}

/**
 * `POST /admin/payment/{payment_id}/refunds` — refund part of a payment, answered `200`.
 * @param {Client} client @param {number|string} paymentId a payment receipt's `id`
 * @param {OrderPayload} payload a `PaymentRefundInput`, a mapping or a JSON string
 * @param {string} idempotencyKey sent as the `Idempotency-Key` header
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<PaymentRefund>>}
 */
export function createPaymentRefund(client, paymentId, payload, idempotencyKey, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.PAYMENT_REFUNDS, {
        pathParams: {payment_id: paymentId},
        jsonBody: payload,
        headers: {[ordersUrls.IDEMPOTENCY_KEY_HEADER]: idempotencyKey},
        raiseOnError,
        responseFormat,
        dtoType: PaymentRefund,
    });
}

/**
 * `POST /admin/orders/{order_internal_id}/send-invoice` — email the invoice.
 * @param {Client} client @param {number|string} orderInternalId an order's `internal_id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InvoiceDispatch>>}
 */
export function sendOrderInvoice(client, orderInternalId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_SEND_INVOICE, {
        pathParams: {order_internal_id: orderInternalId},
        raiseOnError,
        responseFormat,
        dtoType: InvoiceDispatch,
    });
}

/**
 * `GET /admin/orders/{order_id}/shipment-status` — how far an order has shipped.
 * @param {Client} client @param {number|string} orderId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShipmentStatus>>}
 */
export function getOrderShipmentStatus(client, orderId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER_SHIPMENT_STATUS, {
        pathParams: {order_id: orderId},
        raiseOnError,
        responseFormat,
        dtoType: ShipmentStatus,
    });
}

/**
 * `GET /admin/orders/{order_id}/shipments` — an order's shipments, unpaged.
 * @param {Client} client @param {number|string} orderId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<OrderShipmentList>>}
 */
export function listOrderShipments(client, orderId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.ORDER_SHIPMENTS, {
        pathParams: {order_id: orderId},
        raiseOnError,
        responseFormat,
        dtoType: OrderShipmentList,
    });
}

/**
 * `POST /admin/orders/{order_id}/shipments` — ship order lines, answered `201`.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderShipmentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderShipment>>}
 */
export function createOrderShipment(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_SHIPMENTS, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderShipment,
    });
}

/**
 * `PATCH /admin/orders/{order_id}/shipments/{shipment_id}` — change a shipment, by its `shipping_id`.
 * @param {Client} client @param {number|string} orderId @param {number|string} shipmentId a shipment's `shipping_id`
 * @param {OrderPayload} payload an `OrderShipmentInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<OrderShipment>>}
 */
export function updateOrderShipment(client, orderId, shipmentId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(ordersUrls.ORDER_SHIPMENT, {
        pathParams: {order_id: orderId, shipment_id: shipmentId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: OrderShipment,
    });
}

/**
 * `PATCH /admin/orders/{order_id}/update-status` — move an order's status, answered in the flat shape.
 * @param {Client} client @param {number|string} orderId
 * @param {OrderPayload} payload an `OrderStatusInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<FlatOrder>>}
 */
export function updateOrderStatus(client, orderId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(ordersUrls.ORDER_UPDATE_STATUS, {
        pathParams: {order_id: orderId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: FlatOrder,
    });
}

/**
 * `POST /admin/order/add-order-status` — add a store-wide custom order status, answered `201 {"success": "true"}`.
 * @param {Client} client
 * @param {OrderPayload} payload a `CustomOrderStatusInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse>}
 */
export function createOrderStatus(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(ordersUrls.ORDER_STATUS_ADD, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/customers/{customer_id}/orders` — one customer's orders, by the public `customer_id`.
 * @param {Client} client @param {number|string} customerId a customer's `customer_id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerOrders>>}
 */
export function listCustomerOrders(client, customerId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(ordersUrls.CUSTOMER_ORDERS, {
        pathParams: {customer_id: customerId},
        raiseOnError,
        responseFormat,
        dtoType: CustomerOrders,
    });
}
