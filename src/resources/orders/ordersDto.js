import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** A country or a state as the store answers it: `{"id", "name", "code"}`. */
export class Reference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        code: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
}

/** The order's `customer` section, also sent as `customer_summary`. */
export class OrderCustomer extends Dto {
    static FIELDS = {
        firstName: 'string',
        lastName: 'string',
        customerGroup: 'string',
        gender: 'string',
        customerId: 'int',
        internalId: 'int',
        email: 'string',
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        country: Reference,
        state: Reference,
        postCode: 'string',
        phone: 'string',
        mobile: 'string',
        fax: 'string',
        companyName: 'string',
    };

    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ customerGroup = this.declared('customerGroup');
    /** @type {string | null} */ gender = this.declared('gender');
    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {Reference | null} */ country = this.declared('country');
    /** @type {Reference | null} */ state = this.declared('state');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ fax = this.declared('fax');
    /** @type {string | null} */ companyName = this.declared('companyName');
}

/** A billing or shipping address. `companyName` reads `""` whatever was written. */
export class OrderAddress extends Dto {
    static FIELDS = {
        id: 'int',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        companyName: 'string',
        addressLine1: 'string',
        addressLine2: 'string',
        country: Reference,
        state: Reference,
        city: 'string',
        postCode: 'string',
        mobile: 'string',
        phone: 'string',
        fax: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {Reference | null} */ country = this.declared('country');
    /** @type {Reference | null} */ state = this.declared('state');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ fax = this.declared('fax');
}

/** One order line, under `items` or `order_line_details`; `variations` is `[]`, except on a create's answer: `null`. */
export class OrderItem extends Dto {
    static FIELDS = {
        itemId: 'int',
        productName: 'string',
        productId: 'int',
        sku: 'string',
        quantity: 'int',
        price: 'float',
        totalAmount: 'float',
        tax: 'float',
        discount: 'float',
        taxDiscount: 'float',
        isTaxable: 'boolean',
        isShippable: 'boolean',
        imageUrl: 'string',
        variations: dtoList('any'),
        serialBatchNumber: 'string',
    };

    /** @type {number | null} */ itemId = this.declared('itemId');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ price = this.declared('price');
    /** @type {number | null} */ totalAmount = this.declared('totalAmount');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ taxDiscount = this.declared('taxDiscount');
    /** @type {boolean | null} */ isTaxable = this.declared('isTaxable');
    /** @type {boolean | null} */ isShippable = this.declared('isShippable');
    /** @type {string | null} */ imageUrl = this.declared('imageUrl');
    /** @type {unknown[] | null} */ variations = this.declared('variations');
    /** @type {string | null} */ serialBatchNumber = this.declared('serialBatchNumber');
}

/** The `shipping` section; `shippingType` is the first shipment's method. */
export class OrderShipping extends Dto {
    static FIELDS = {
        deliveryType: 'string',
        shippingType: 'string',
        shippingStatus: 'string',
        shippingCost: 'float',
        shippingTax: 'float',
    };

    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {string | null} */ shippingType = this.declared('shippingType');
    /** @type {string | null} */ shippingStatus = this.declared('shippingStatus');
    /** @type {number | null} */ shippingCost = this.declared('shippingCost');
    /** @type {number | null} */ shippingTax = this.declared('shippingTax');
}

export class OrderDiscounts extends Dto {
    static FIELDS = {
        totalDiscount: 'float',
        couponCode: 'string',
        giftCardCode: 'string',
    };

    /** @type {number | null} */ totalDiscount = this.declared('totalDiscount');
    /** @type {string | null} */ couponCode = this.declared('couponCode');
    /** @type {string | null} */ giftCardCode = this.declared('giftCardCode');
}

/** The `charges_totals` section; a payment refund lowers `paid` and an order refund does not. */
export class OrderChargesTotals extends Dto {
    static FIELDS = {
        subTotal: 'float',
        totalTax: 'float',
        handlingCost: 'float',
        totalSurcharge: 'float',
        otherCharges: 'float',
        grandTotal: 'float',
        paid: 'float',
        due: 'float',
        refunded: 'float',
        refundStatus: 'string',
        itemsTotal: 'int',
    };

    /** @type {number | null} */ subTotal = this.declared('subTotal');
    /** @type {number | null} */ totalTax = this.declared('totalTax');
    /** @type {number | null} */ handlingCost = this.declared('handlingCost');
    /** @type {number | null} */ totalSurcharge = this.declared('totalSurcharge');
    /** @type {number | null} */ otherCharges = this.declared('otherCharges');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
    /** @type {number | null} */ paid = this.declared('paid');
    /** @type {number | null} */ due = this.declared('due');
    /** @type {number | null} */ refunded = this.declared('refunded');
    /** @type {string | null} */ refundStatus = this.declared('refundStatus');
    /** @type {number | null} */ itemsTotal = this.declared('itemsTotal');
}

/** One entry of an order's `payments`; `gatewayResponse` comes only in the flat shape. */
export class OrderPayment extends Dto {
    static FIELDS = {
        id: 'int',
        status: 'string',
        amount: 'float',
        paymentMethod: 'string',
        trackInfo: 'string',
        gatewayName: 'string',
        gatewayCode: 'string',
        gatewayResponse: 'string',
        payerInfo: 'string',
        payingDate: 'string',
        transactionDate: 'string',
        transactionReference: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ paymentMethod = this.declared('paymentMethod');
    /** @type {string | null} */ trackInfo = this.declared('trackInfo');
    /** @type {string | null} */ gatewayName = this.declared('gatewayName');
    /** @type {string | null} */ gatewayCode = this.declared('gatewayCode');
    /** @type {string | null} */ gatewayResponse = this.declared('gatewayResponse');
    /** @type {string | null} */ payerInfo = this.declared('payerInfo');
    /** @type {string | null} */ payingDate = this.declared('payingDate');
    /** @type {string | null} */ transactionDate = this.declared('transactionDate');
    /** @type {string | null} */ transactionReference = this.declared('transactionReference');
}

export class OrderFulfillment extends Dto {
    static FIELDS = {
        fulfillmentMode: 'string',
        fulfillmentTerm: 'string',
        invoiceMode: 'string',
        paymentTerm: 'string',
        customerPoNumber: 'string',
        externalReferenceOrderId: 'string',
        externalReferenceStoreId: 'string',
        externalReferenceOrderNo: 'string',
        externalReferenceStatus: 'string',
        externalReferenceUrl: 'string',
        customFields: dtoList('any'),
    };

    /** @type {string | null} */ fulfillmentMode = this.declared('fulfillmentMode');
    /** @type {string | null} */ fulfillmentTerm = this.declared('fulfillmentTerm');
    /** @type {string | null} */ invoiceMode = this.declared('invoiceMode');
    /** @type {string | null} */ paymentTerm = this.declared('paymentTerm');
    /** @type {string | null} */ customerPoNumber = this.declared('customerPoNumber');
    /** @type {string | null} */ externalReferenceOrderId = this.declared('externalReferenceOrderId');
    /** @type {string | null} */ externalReferenceStoreId = this.declared('externalReferenceStoreId');
    /** @type {string | null} */ externalReferenceOrderNo = this.declared('externalReferenceOrderNo');
    /** @type {string | null} */ externalReferenceStatus = this.declared('externalReferenceStatus');
    /** @type {string | null} */ externalReferenceUrl = this.declared('externalReferenceUrl');
    /** @type {unknown[] | null} */ customFields = this.declared('customFields');
}

/** One `group_meta` entry. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block; the listing's has no entry for the two addresses. */
export class GroupMeta extends Dto {
    static FIELDS = {
        customer: SectionMeta,
        billingAddress: SectionMeta,
        shippingAddress: SectionMeta,
        items: SectionMeta,
        shipping: SectionMeta,
        discounts: SectionMeta,
        chargesTotals: SectionMeta,
        payments: SectionMeta,
        fulfillment: SectionMeta,
    };

    /** @type {SectionMeta | null} */ customer = this.declared('customer');
    /** @type {SectionMeta | null} */ billingAddress = this.declared('billingAddress');
    /** @type {SectionMeta | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {SectionMeta | null} */ items = this.declared('items');
    /** @type {SectionMeta | null} */ shipping = this.declared('shipping');
    /** @type {SectionMeta | null} */ discounts = this.declared('discounts');
    /** @type {SectionMeta | null} */ chargesTotals = this.declared('chargesTotals');
    /** @type {SectionMeta | null} */ payments = this.declared('payments');
    /** @type {SectionMeta | null} */ fulfillment = this.declared('fulfillment');
}

/** One order in sections: the row path's body. */
export class Order extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        orderId: 'int',
        orderNo: 'int',
        internalId: 'int',
        uuid: 'string',
        orderStatus: 'string',
        paymentStatus: 'string',
        shippingStatus: 'string',
        currencyCode: 'string',
        transactionNo: 'string',
        ipAddress: 'string',
        orderChannel: 'string',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        customer: OrderCustomer,
        billingAddress: OrderAddress,
        shippingAddress: OrderAddress,
        items: dtoList(OrderItem),
        shipping: OrderShipping,
        discounts: OrderDiscounts,
        chargesTotals: OrderChargesTotals,
        payments: dtoList(OrderPayment),
        fulfillment: OrderFulfillment,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ orderStatus = this.declared('orderStatus');
    /** @type {string | null} */ paymentStatus = this.declared('paymentStatus');
    /** @type {string | null} */ shippingStatus = this.declared('shippingStatus');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ ipAddress = this.declared('ipAddress');
    /** @type {string | null} */ orderChannel = this.declared('orderChannel');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {OrderCustomer | null} */ customer = this.declared('customer');
    /** @type {OrderAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {Array<OrderItem | null> | null} */ items = this.declared('items');
    /** @type {OrderShipping | null} */ shipping = this.declared('shipping');
    /** @type {OrderDiscounts | null} */ discounts = this.declared('discounts');
    /** @type {OrderChargesTotals | null} */ chargesTotals = this.declared('chargesTotals');
    /** @type {Array<OrderPayment | null> | null} */ payments = this.declared('payments');
    /** @type {OrderFulfillment | null} */ fulfillment = this.declared('fulfillment');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The listing's ten-key `pagination` block; `limit` is the size applied, at most 20. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        count: 'int',
        currentPage: 'int',
        totalPages: 'int',
        hasNext: 'boolean',
        hasPrevious: 'boolean',
        previousPage: 'string',
        nextPage: 'string',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {number | null} */ count = this.declared('count');
    /** @type {number | null} */ currentPage = this.declared('currentPage');
    /** @type {number | null} */ totalPages = this.declared('totalPages');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
    /** @type {string | null} */ previousPage = this.declared('previousPage');
    /** @type {string | null} */ nextPage = this.declared('nextPage');
}

/** One page of the listing, with the rows under `orders` and the `field_metadata` block when it was asked for. */
export class OrderPage extends Dto {
    static FIELDS = {
        orders: dtoList(Order),
        pagination: Pagination,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Array<Order | null> | null} */ orders = this.declared('orders');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's body, `{"orders": {"count": N}}`. */
export class OrderCount extends Dto {
    static ENVELOPE_KEY = 'orders';

    static FIELDS = {
        count: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
}

/** One order with its totals and fulfilment at the top. */
export class FlatOrder extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        orderId: 'int',
        orderNo: 'int',
        internalId: 'int',
        uuid: 'string',
        transactionNo: 'string',
        currencyCode: 'string',
        orderStatus: 'string',
        paymentStatus: 'string',
        shippingStatus: 'string',
        subTotal: 'float',
        shippingCost: 'float',
        shippingTax: 'float',
        handlingCost: 'float',
        totalSurcharge: 'float',
        totalDiscount: 'float',
        totalTax: 'float',
        grandTotal: 'float',
        paid: 'float',
        due: 'float',
        itemsTotal: 'int',
        ipAddress: 'string',
        orderChannel: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        customerSummary: OrderCustomer,
        orderLineDetails: dtoList(OrderItem),
        payments: dtoList(OrderPayment),
        externalReferenceOrderId: 'string',
        externalReferenceStoreId: 'string',
        externalReferenceOrderNo: 'string',
        externalReferenceStatus: 'string',
        externalReferenceUrl: 'string',
        customerPoNumber: 'string',
        paymentTerm: 'string',
        fulfillmentMode: 'string',
        fulfillmentTerm: 'string',
        invoiceMode: 'string',
        billingAddress: OrderAddress,
        shippingAddress: OrderAddress,
        customFields: dtoList('any'),
        status: 'string',
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {string | null} */ orderStatus = this.declared('orderStatus');
    /** @type {string | null} */ paymentStatus = this.declared('paymentStatus');
    /** @type {string | null} */ shippingStatus = this.declared('shippingStatus');
    /** @type {number | null} */ subTotal = this.declared('subTotal');
    /** @type {number | null} */ shippingCost = this.declared('shippingCost');
    /** @type {number | null} */ shippingTax = this.declared('shippingTax');
    /** @type {number | null} */ handlingCost = this.declared('handlingCost');
    /** @type {number | null} */ totalSurcharge = this.declared('totalSurcharge');
    /** @type {number | null} */ totalDiscount = this.declared('totalDiscount');
    /** @type {number | null} */ totalTax = this.declared('totalTax');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
    /** @type {number | null} */ paid = this.declared('paid');
    /** @type {number | null} */ due = this.declared('due');
    /** @type {number | null} */ itemsTotal = this.declared('itemsTotal');
    /** @type {string | null} */ ipAddress = this.declared('ipAddress');
    /** @type {string | null} */ orderChannel = this.declared('orderChannel');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
    /** @type {OrderCustomer | null} */ customerSummary = this.declared('customerSummary');
    /** @type {Array<OrderItem | null> | null} */ orderLineDetails = this.declared('orderLineDetails');
    /** @type {Array<OrderPayment | null> | null} */ payments = this.declared('payments');
    /** @type {string | null} */ externalReferenceOrderId = this.declared('externalReferenceOrderId');
    /** @type {string | null} */ externalReferenceStoreId = this.declared('externalReferenceStoreId');
    /** @type {string | null} */ externalReferenceOrderNo = this.declared('externalReferenceOrderNo');
    /** @type {string | null} */ externalReferenceStatus = this.declared('externalReferenceStatus');
    /** @type {string | null} */ externalReferenceUrl = this.declared('externalReferenceUrl');
    /** @type {string | null} */ customerPoNumber = this.declared('customerPoNumber');
    /** @type {string | null} */ paymentTerm = this.declared('paymentTerm');
    /** @type {string | null} */ fulfillmentMode = this.declared('fulfillmentMode');
    /** @type {string | null} */ fulfillmentTerm = this.declared('fulfillmentTerm');
    /** @type {string | null} */ invoiceMode = this.declared('invoiceMode');
    /** @type {OrderAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {unknown[] | null} */ customFields = this.declared('customFields');
    /** @type {string | null} */ status = this.declared('status');
}

/** One customer's orders, unpaged, cancelled ones left out. */
export class CustomerOrders extends Dto {
    static FIELDS = {
        customerId: 'int',
        internalId: 'int',
        orders: dtoList(FlatOrder),
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {Array<FlatOrder | null> | null} */ orders = this.declared('orders');
}

/** What the addresses sub-path answers: both addresses as they now stand. */
export class OrderAddresses extends Dto {
    static FIELDS = {
        orderId: 'int',
        internalId: 'int',
        billingAddress: OrderAddress,
        shippingAddress: OrderAddress,
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {OrderAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddress | null} */ shippingAddress = this.declared('shippingAddress');
}

/** One comment; `created` is `M/D/YYYY` and a time two spaces apart, not ISO 8601. */
export class OrderComment extends Dto {
    static ENVELOPE_KEY = 'comment';

    static FIELDS = {
        id: 'int',
        content: 'string',
        adminName: 'string',
        visibleToCustomer: 'boolean',
        admin: 'boolean',
        created: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ content = this.declared('content');
    /** @type {string | null} */ adminName = this.declared('adminName');
    /** @type {boolean | null} */ visibleToCustomer = this.declared('visibleToCustomer');
    /** @type {boolean | null} */ admin = this.declared('admin');
    /** @type {string | null} */ created = this.declared('created');
}

/** An order's comments, oldest first and unpaged. */
export class OrderCommentList extends Dto {
    static FIELDS = {
        comments: dtoList(OrderComment),
    };

    /** @type {Array<OrderComment | null> | null} */ comments = this.declared('comments');
}

/** An order's custom field values; `orderId` echoes the `internal_id` asked for, and a `delivery` order adds `deliveryCost`. */
export class OrderCustomFields extends Dto {
    static FIELDS = {
        orderId: 'int',
        customFields: dtoList('any'),
        deliveryCost: 'float',
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {unknown[] | null} */ customFields = this.declared('customFields');
    /** @type {number | null} */ deliveryCost = this.declared('deliveryCost');
}

/** The customer a payment receipt names; `id` is the public customer id. */
export class PaymentReceiptCustomer extends Dto {
    static FIELDS = {
        id: 'int',
        internalId: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ name = this.declared('name');
}

/** What recording a payment answers; `id` is the `payment_id` a payment refund takes. */
export class PaymentReceipt extends Dto {
    static ENVELOPE_KEY = 'payment';

    static FIELDS = {
        status: 'string',
        id: 'int',
        date: 'string',
        transactionDate: 'string',
        transactionReference: 'string',
        paymentApplied: 'float',
        paymentMethod: 'string',
        payerInfo: 'string',
        orderId: 'int',
        orderInternalId: 'int',
        orderTotal: 'float',
        dueAmount: 'float',
        paidAmount: 'float',
        customer: PaymentReceiptCustomer,
        createdBy: 'string',
        createdAt: 'string',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ date = this.declared('date');
    /** @type {string | null} */ transactionDate = this.declared('transactionDate');
    /** @type {string | null} */ transactionReference = this.declared('transactionReference');
    /** @type {number | null} */ paymentApplied = this.declared('paymentApplied');
    /** @type {string | null} */ paymentMethod = this.declared('paymentMethod');
    /** @type {string | null} */ payerInfo = this.declared('payerInfo');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderInternalId = this.declared('orderInternalId');
    /** @type {number | null} */ orderTotal = this.declared('orderTotal');
    /** @type {number | null} */ dueAmount = this.declared('dueAmount');
    /** @type {number | null} */ paidAmount = this.declared('paidAmount');
    /** @type {PaymentReceiptCustomer | null} */ customer = this.declared('customer');
    /** @type {string | null} */ createdBy = this.declared('createdBy');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
}

/** What an order refund answers; `amount` is the text that was sent. */
export class OrderRefund extends Dto {
    static FIELDS = {
        status: 'string',
        refundId: 'int',
        orderId: 'int',
        internalId: 'int',
        amount: 'string',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ refundId = this.declared('refundId');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ amount = this.declared('amount');
}

/** One order line a refund was spread over; the money fields are decimal text such as `"1.00"`. */
export class OrderRefundRecordLine extends Dto {
    static FIELDS = {
        orderItemId: 'int',
        productSku: 'string',
        productName: 'string',
        extItemReferer: 'any',
        pluginLine: 'boolean',
        quantity: 'int',
        linePaid: 'string',
        amount: 'string',
        lineRefundedTotal: 'string',
        lineFullyRefunded: 'boolean',
    };

    /** @type {number | null} */ orderItemId = this.declared('orderItemId');
    /** @type {string | null} */ productSku = this.declared('productSku');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {unknown} */ extItemReferer = this.declared('extItemReferer');
    /** @type {boolean | null} */ pluginLine = this.declared('pluginLine');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {string | null} */ linePaid = this.declared('linePaid');
    /** @type {string | null} */ amount = this.declared('amount');
    /** @type {string | null} */ lineRefundedTotal = this.declared('lineRefundedTotal');
    /** @type {boolean | null} */ lineFullyRefunded = this.declared('lineFullyRefunded');
}

/** One refund an order holds; `orderId` is the order's internal id. A payment refund fills `recordOnly` to `lines`; an order refund leaves them `null` and `lines` empty. */
export class OrderRefundRecord extends Dto {
    static FIELDS = {
        gateway: 'string',
        gatewayChargeId: 'any',
        gatewayRefundId: 'any',
        recordOnly: 'boolean',
        initiatedBy: 'string',
        cancelledWithOrder: 'boolean',
        notifyCustomer: 'boolean',
        allocation: 'string',
        otherAmount: 'string',
        lines: dtoList(OrderRefundRecordLine),
        refundId: 'int',
        paymentId: 'int',
        orderId: 'int',
        amount: 'float',
        status: 'string',
        transactionStatus: 'string',
        transactionId: 'string',
        reason: 'string',
        failureCause: 'any',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {string | null} */ gateway = this.declared('gateway');
    /** @type {unknown} */ gatewayChargeId = this.declared('gatewayChargeId');
    /** @type {unknown} */ gatewayRefundId = this.declared('gatewayRefundId');
    /** @type {boolean | null} */ recordOnly = this.declared('recordOnly');
    /** @type {string | null} */ initiatedBy = this.declared('initiatedBy');
    /** @type {boolean | null} */ cancelledWithOrder = this.declared('cancelledWithOrder');
    /** @type {boolean | null} */ notifyCustomer = this.declared('notifyCustomer');
    /** @type {string | null} */ allocation = this.declared('allocation');
    /** @type {string | null} */ otherAmount = this.declared('otherAmount');
    /** @type {Array<OrderRefundRecordLine | null> | null} */ lines = this.declared('lines');
    /** @type {number | null} */ refundId = this.declared('refundId');
    /** @type {number | null} */ paymentId = this.declared('paymentId');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ transactionStatus = this.declared('transactionStatus');
    /** @type {string | null} */ transactionId = this.declared('transactionId');
    /** @type {string | null} */ reason = this.declared('reason');
    /** @type {unknown} */ failureCause = this.declared('failureCause');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** One page of an order's refunds, newest first; `orderId` is the order's internal id and `orderNo` the `{order_id}` the path took. */
export class OrderRefundPage extends Dto {
    static FIELDS = {
        orderId: 'int',
        orderNo: 'int',
        refunds: dtoList(OrderRefundRecord),
        pagination: Pagination,
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {Array<OrderRefundRecord | null> | null} */ refunds = this.declared('refunds');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** What a payment refund answers. */
export class PaymentRefund extends Dto {
    static FIELDS = {
        status: 'string',
        refundId: 'int',
        paymentId: 'int',
        orderId: 'int',
        orderNo: 'int',
        currency: 'string',
        amount: 'float',
        reason: 'string',
        gatewayRefund: 'boolean',
        gatewayTransactionId: 'string',
        transactionStatus: 'string',
        paymentStatus: 'string',
        paymentRefundStatus: 'string',
        orderRefundStatus: 'string',
        orderRefundedTotal: 'float',
        orderAdjustment: 'float',
        orderTotal: 'float',
        availableForRefund: 'float',
        adjustWithOrder: 'boolean',
        refundEmailQueued: 'boolean',
        inventoryReadjusted: 'boolean',
        refundedAt: 'string',
        idempotentReplay: 'boolean',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ refundId = this.declared('refundId');
    /** @type {number | null} */ paymentId = this.declared('paymentId');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {string | null} */ currency = this.declared('currency');
    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ reason = this.declared('reason');
    /** @type {boolean | null} */ gatewayRefund = this.declared('gatewayRefund');
    /** @type {string | null} */ gatewayTransactionId = this.declared('gatewayTransactionId');
    /** @type {string | null} */ transactionStatus = this.declared('transactionStatus');
    /** @type {string | null} */ paymentStatus = this.declared('paymentStatus');
    /** @type {string | null} */ paymentRefundStatus = this.declared('paymentRefundStatus');
    /** @type {string | null} */ orderRefundStatus = this.declared('orderRefundStatus');
    /** @type {number | null} */ orderRefundedTotal = this.declared('orderRefundedTotal');
    /** @type {number | null} */ orderAdjustment = this.declared('orderAdjustment');
    /** @type {number | null} */ orderTotal = this.declared('orderTotal');
    /** @type {number | null} */ availableForRefund = this.declared('availableForRefund');
    /** @type {boolean | null} */ adjustWithOrder = this.declared('adjustWithOrder');
    /** @type {boolean | null} */ refundEmailQueued = this.declared('refundEmailQueued');
    /** @type {boolean | null} */ inventoryReadjusted = this.declared('inventoryReadjusted');
    /** @type {string | null} */ refundedAt = this.declared('refundedAt');
    /** @type {boolean | null} */ idempotentReplay = this.declared('idempotentReplay');
}

/** What sending an invoice answers: who it went to and when. */
export class InvoiceDispatch extends Dto {
    static FIELDS = {
        status: 'string',
        orderId: 'int',
        internalId: 'int',
        sentTo: 'string',
        template: 'string',
        invoiceDocument: 'any',
        sentAt: 'string',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ sentTo = this.declared('sentTo');
    /** @type {string | null} */ template = this.declared('template');
    /** @type {unknown} */ invoiceDocument = this.declared('invoiceDocument');
    /** @type {string | null} */ sentAt = this.declared('sentAt');
}

/** One shipment as the shipment status lists it. */
export class ShipmentTracking extends Dto {
    static FIELDS = {
        shippingProvider: 'string',
        trackingNumber: 'string',
        lastUpdated: 'string',
    };

    /** @type {string | null} */ shippingProvider = this.declared('shippingProvider');
    /** @type {string | null} */ trackingNumber = this.declared('trackingNumber');
    /** @type {string | null} */ lastUpdated = this.declared('lastUpdated');
}

/** The shipment status: `unshipped`, `partial` or `shipped`, where the order itself reads `not_shipped` for the first. */
export class ShipmentStatus extends Dto {
    static FIELDS = {
        orderId: 'int',
        internalId: 'int',
        shipmentStatus: 'string',
        shipmentsInfo: dtoList(ShipmentTracking),
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ shipmentStatus = this.declared('shipmentStatus');
    /** @type {Array<ShipmentTracking | null> | null} */ shipmentsInfo = this.declared('shipmentsInfo');
}

/** One line a shipment carries. */
export class ShipmentItem extends Dto {
    static FIELDS = {
        orderItemId: 'int',
        productId: 'int',
        productName: 'string',
        productSku: 'string',
        shippingClass: 'string',
        orderQuantity: 'int',
        shippedQuantity: 'int',
        totalAmount: 'float',
    };

    /** @type {number | null} */ orderItemId = this.declared('orderItemId');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {string | null} */ productSku = this.declared('productSku');
    /** @type {string | null} */ shippingClass = this.declared('shippingClass');
    /** @type {number | null} */ orderQuantity = this.declared('orderQuantity');
    /** @type {number | null} */ shippedQuantity = this.declared('shippedQuantity');
    /** @type {number | null} */ totalAmount = this.declared('totalAmount');
}

/** One shipment. */
export class OrderShipment extends Dto {
    static ENVELOPE_KEY = 'shipment';

    static FIELDS = {
        shippingId: 'int',
        orderId: 'int',
        orderInternalId: 'int',
        customerId: 'int',
        customerInternalId: 'int',
        orderAddressId: 'int',
        dateCreated: 'string',
        trackingNumber: 'string',
        shippingMethod: 'string',
        shippingAddress: OrderAddress,
        billingAddress: OrderAddress,
        items: dtoList(ShipmentItem),
        status: 'string',
    };

    /** @type {number | null} */ shippingId = this.declared('shippingId');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ orderInternalId = this.declared('orderInternalId');
    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {number | null} */ customerInternalId = this.declared('customerInternalId');
    /** @type {number | null} */ orderAddressId = this.declared('orderAddressId');
    /** @type {string | null} */ dateCreated = this.declared('dateCreated');
    /** @type {string | null} */ trackingNumber = this.declared('trackingNumber');
    /** @type {string | null} */ shippingMethod = this.declared('shippingMethod');
    /** @type {OrderAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {OrderAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {Array<ShipmentItem | null> | null} */ items = this.declared('items');
    /** @type {string | null} */ status = this.declared('status');
}

/** An order's shipments, unpaged. */
export class OrderShipmentList extends Dto {
    static FIELDS = {
        shipments: dtoList(OrderShipment),
    };

    /** @type {Array<OrderShipment | null> | null} */ shipments = this.declared('shipments');
}

/** An address to write, replacing the whole one: a field left out reads `""`. */
export class OrderAddressInput extends Dto {
    static FIELDS = {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        companyName: 'string',
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        postCode: 'string',
        phone: 'string',
        mobile: 'string',
        fax: 'string',
        countryCode: 'string',
        stateCode: 'string',
    };

    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ fax = this.declared('fax');
    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ stateCode = this.declared('stateCode');
}

/** One line to order, by the product's `id`. */
export class OrderProductInput extends Dto {
    static FIELDS = {
        productId: 'int',
        quantity: 'int',
    };

    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {number | null} */ quantity = this.declared('quantity');
}

/** The create body, with no envelope. */
export class OrderInput extends Dto {
    static FIELDS = {
        customerId: 'int',
        paymentGateway: 'string',
        deliveryType: 'string',
        isSendEmail: 'boolean',
        transactionNo: 'string',
        externalReferenceOrderId: 'string',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
        products: dtoList(OrderProductInput),
        orderChannel: 'string',
        ipAddress: 'string',
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ paymentGateway = this.declared('paymentGateway');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {boolean | null} */ isSendEmail = this.declared('isSendEmail');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ externalReferenceOrderId = this.declared('externalReferenceOrderId');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {Array<OrderProductInput | null> | null} */ products = this.declared('products');
    /** @type {string | null} */ orderChannel = this.declared('orderChannel');
    /** @type {string | null} */ ipAddress = this.declared('ipAddress');
}

/**
 * The payment a create-with-payment records. It is filed under method `API`, and `payerInfo`,
 * `transactionReference` and `transactionDate` are not kept.
 */
export class InitialPaymentInput extends Dto {
    static FIELDS = {
        amount: 'float',
        surcharge: 'float',
        status: 'string',
        paymentMethod: 'string',
        trackInfo: 'string',
        payerInfo: 'string',
        transactionReference: 'string',
        transactionDate: 'string',
    };

    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {number | null} */ surcharge = this.declared('surcharge');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ paymentMethod = this.declared('paymentMethod');
    /** @type {string | null} */ trackInfo = this.declared('trackInfo');
    /** @type {string | null} */ payerInfo = this.declared('payerInfo');
    /** @type {string | null} */ transactionReference = this.declared('transactionReference');
    /** @type {string | null} */ transactionDate = this.declared('transactionDate');
}

/** The create-with-payment body: {@link OrderInput} and the `payment` it records. */
export class OrderWithPaymentInput extends OrderInput {
    static FIELDS = {...OrderInput.FIELDS, payment: InitialPaymentInput};

    /** @type {InitialPaymentInput | null} */ payment = this.declared('payment');
}

/** The `PUT` body; it writes the customer and the two addresses, and nothing else. */
export class OrderUpdateInput extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        customerId: 'int',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
}

/** The `PATCH` body: the seven fields it writes; an address sent replaces that address. */
export class OrderPatchInput extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        orderStatus: 'string',
        customerPoNumber: 'string',
        paymentTerm: 'string',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
        orderChannel: 'string',
        ipAddress: 'string',
    };

    /** @type {string | null} */ orderStatus = this.declared('orderStatus');
    /** @type {string | null} */ customerPoNumber = this.declared('customerPoNumber');
    /** @type {string | null} */ paymentTerm = this.declared('paymentTerm');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {string | null} */ orderChannel = this.declared('orderChannel');
    /** @type {string | null} */ ipAddress = this.declared('ipAddress');
}

/** The addresses sub-path's body; at least one address, and one left out is untouched. */
export class OrderAddressesInput extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
}

/** The cancel body; every field is optional and an empty request cancels too. */
export class OrderCancelInput extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        reason: 'string',
        refundAutomatically: 'boolean',
        isGatewayRefund: 'boolean',
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ reason = this.declared('reason');
    /** @type {boolean | null} */ refundAutomatically = this.declared('refundAutomatically');
    /** @type {boolean | null} */ isGatewayRefund = this.declared('isGatewayRefund');
}

/** The comment body, with no envelope; `content` is required. */
export class OrderCommentInput extends Dto {
    static FIELDS = {
        content: 'string',
        saveAndSend: 'boolean',
        transactionNo: 'string',
    };

    /** @type {string | null} */ content = this.declared('content');
    /** @type {boolean | null} */ saveAndSend = this.declared('saveAndSend');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** The payment body: `{"payment": {...}}` with `transaction_no` beside the envelope. */
export class OrderPaymentInput extends Dto {
    static ENVELOPE_KEY = 'payment';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        amount: 'float',
        paymentMethod: 'string',
        paymentStatus: 'string',
        trackInfo: 'string',
        payerInfo: 'string',
        transactionDate: 'string',
        transactionReference: 'string',
        surcharge: 'float',
        transactionNo: 'string',
    };

    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ paymentMethod = this.declared('paymentMethod');
    /** @type {string | null} */ paymentStatus = this.declared('paymentStatus');
    /** @type {string | null} */ trackInfo = this.declared('trackInfo');
    /** @type {string | null} */ payerInfo = this.declared('payerInfo');
    /** @type {string | null} */ transactionDate = this.declared('transactionDate');
    /** @type {string | null} */ transactionReference = this.declared('transactionReference');
    /** @type {number | null} */ surcharge = this.declared('surcharge');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One line an order refund names, by the order line's `item_id`. */
export class RefundLineInput extends Dto {
    static FIELDS = {
        orderItemId: 'int',
        quantity: 'int',
        amount: 'float',
    };

    /** @type {number | null} */ orderItemId = this.declared('orderItemId');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ amount = this.declared('amount');
}

/**
 * The order refund body, `{"refund": {...}}`; `refundDate` is required, and `amount` may not pass what was paid
 * less earlier refunds.
 */
export class OrderRefundInput extends Dto {
    static ENVELOPE_KEY = 'refund';

    static FIELDS = {
        amount: 'string',
        refundDate: 'string',
        reason: 'string',
        lineItems: dtoList(RefundLineInput),
    };

    /** @type {string | null} */ amount = this.declared('amount');
    /** @type {string | null} */ refundDate = this.declared('refundDate');
    /** @type {string | null} */ reason = this.declared('reason');
    /** @type {Array<RefundLineInput | null> | null} */ lineItems = this.declared('lineItems');
}

/** The payment refund body: `{"refund": {...}}` with `transaction_no` beside it. */
export class PaymentRefundInput extends Dto {
    static ENVELOPE_KEY = 'refund';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        amount: 'string',
        reason: 'string',
        isGatewayRefund: 'boolean',
        sendRefundEmail: 'boolean',
        adjustWithOrder: 'boolean',
        transactionNo: 'string',
    };

    /** @type {string | null} */ amount = this.declared('amount');
    /** @type {string | null} */ reason = this.declared('reason');
    /** @type {boolean | null} */ isGatewayRefund = this.declared('isGatewayRefund');
    /** @type {boolean | null} */ sendRefundEmail = this.declared('sendRefundEmail');
    /** @type {boolean | null} */ adjustWithOrder = this.declared('adjustWithOrder');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One line to ship, by the order line's `item_id`. */
export class ShipmentItemInput extends Dto {
    static FIELDS = {
        orderItemId: 'int',
        quantity: 'int',
    };

    /** @type {number | null} */ orderItemId = this.declared('orderItemId');
    /** @type {number | null} */ quantity = this.declared('quantity');
}

/** The shipment body. */
export class OrderShipmentInput extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        method: 'string',
        trackingInfo: 'string',
        shippingDate: 'string',
        shipmentItems: dtoList(ShipmentItemInput),
        changeNote: 'string',
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ method = this.declared('method');
    /** @type {string | null} */ trackingInfo = this.declared('trackingInfo');
    /** @type {string | null} */ shippingDate = this.declared('shippingDate');
    /** @type {Array<ShipmentItemInput | null> | null} */ shipmentItems = this.declared('shipmentItems');
    /** @type {string | null} */ changeNote = this.declared('changeNote');
}

/** The status body; `status` is required: `cancelled`, `completed`, `draft`, `in_progress`, `paused` or `reopened`. */
export class OrderStatusInput extends Dto {
    static FIELDS = {
        status: 'string',
        transactionNo: 'string',
        refundAutomatically: 'boolean',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ refundAutomatically = this.declared('refundAutomatically');
}

/** The custom status body; `orderId` is required. */
export class CustomOrderStatusInput extends Dto {
    static FIELDS = {
        orderId: 'int',
        orderStatusValue: 'string',
        orderStatusLabel: 'string',
        orderType: 'string',
        statusType: 'string',
    };

    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {string | null} */ orderStatusValue = this.declared('orderStatusValue');
    /** @type {string | null} */ orderStatusLabel = this.declared('orderStatusLabel');
    /** @type {string | null} */ orderType = this.declared('orderType');
    /** @type {string | null} */ statusType = this.declared('statusType');
}

sealDtoSchema(
    Reference,
    OrderCustomer,
    OrderAddress,
    OrderItem,
    OrderShipping,
    OrderDiscounts,
    OrderChargesTotals,
    OrderPayment,
    OrderFulfillment,
    SectionMeta,
    GroupMeta,
    Order,
    Pagination,
    OrderPage,
    OrderCount,
    FlatOrder,
    CustomerOrders,
    OrderAddresses,
    OrderComment,
    OrderCommentList,
    OrderCustomFields,
    PaymentReceiptCustomer,
    PaymentReceipt,
    OrderRefund,
    OrderRefundRecordLine,
    OrderRefundRecord,
    OrderRefundPage,
    PaymentRefund,
    InvoiceDispatch,
    ShipmentTracking,
    ShipmentStatus,
    ShipmentItem,
    OrderShipment,
    OrderShipmentList,
    OrderAddressInput,
    OrderProductInput,
    OrderInput,
    InitialPaymentInput,
    OrderWithPaymentInput,
    OrderUpdateInput,
    OrderPatchInput,
    OrderAddressesInput,
    OrderCancelInput,
    OrderCommentInput,
    OrderPaymentInput,
    RefundLineInput,
    OrderRefundInput,
    PaymentRefundInput,
    ShipmentItemInput,
    OrderShipmentInput,
    OrderStatusInput,
    CustomOrderStatusInput,
);
