import {Dto, dtoList, sealDtoSchema} from '../../dto.js';
import {CART_SESSION_KEY} from './cartsUrls.js';

/** The cart's `totals`; `subtotal` sums each line's `unit_price` times its quantity. */
export class CartTotals extends Dto {
    static FIELDS = {
        subtotal: 'float',
        discount: 'float',
        shippingDiscount: 'float',
        tax: 'float',
        total: 'float',
        grandTotal: 'float',
        paid: 'float',
    };

    /** @type {number | null} */ subtotal = this.declared('subtotal');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ shippingDiscount = this.declared('shippingDiscount');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
    /** @type {number | null} */ paid = this.declared('paid');
}

/** The cart's `shipping` block; its two taxes follow the shipping address's country. */
export class CartShipping extends Dto {
    static FIELDS = {
        cost: 'float',
        handlingFee: 'float',
        handlingTax: 'float',
        shippingTax: 'float',
        totalTax: 'float',
    };

    /** @type {number | null} */ cost = this.declared('cost');
    /** @type {number | null} */ handlingFee = this.declared('handlingFee');
    /** @type {number | null} */ handlingTax = this.declared('handlingTax');
    /** @type {number | null} */ shippingTax = this.declared('shippingTax');
    /** @type {number | null} */ totalTax = this.declared('totalTax');
}

/** One line's `pricing`. */
export class CartItemPricing extends Dto {
    static FIELDS = {
        unitPrice: 'float',
        displayUnitPrice: 'float',
        total: 'float',
        discount: 'float',
        discountTax: 'float',
        tax: 'float',
    };

    /** @type {number | null} */ unitPrice = this.declared('unitPrice');
    /** @type {number | null} */ displayUnitPrice = this.declared('displayUnitPrice');
    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ discountTax = this.declared('discountTax');
    /** @type {number | null} */ tax = this.declared('tax');
}

/** The product one line holds; `availableStock` is the product's, not the line's. */
export class CartItemProduct extends Dto {
    static FIELDS = {
        id: 'int',
        sku: 'string',
        basePrice: 'float',
        availableStock: 'int',
        onSale: 'boolean',
        costPrice: 'float',
        salePrice: 'float',
        url: 'string',
        name: 'string',
        productType: 'string',
        imageLink: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {boolean | null} */ onSale = this.declared('onSale');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ salePrice = this.declared('salePrice');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ productType = this.declared('productType');
    /** @type {string | null} */ imageLink = this.declared('imageLink');
}

/** One line of the cart; `id` is the `cart_item_id` the line's writes take. */
export class CartItem extends Dto {
    static FIELDS = {
        id: 'int',
        quantity: 'int',
        variations: 'any',
        taxable: 'boolean',
        shippable: 'boolean',
        pricing: CartItemPricing,
        product: CartItemProduct,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {unknown} */ variations = this.declared('variations');
    /** @type {boolean | null} */ taxable = this.declared('taxable');
    /** @type {boolean | null} */ shippable = this.declared('shippable');
    /** @type {CartItemPricing | null} */ pricing = this.declared('pricing');
    /** @type {CartItemProduct | null} */ product = this.declared('product');
}

/** The cart's `discount` block. */
export class CartDiscount extends Dto {
    static FIELDS = {
        discount: 'float',
        orderDiscount: 'float',
        shippingDiscount: 'float',
        discountOnTax: 'float',
        discountOnShippingTax: 'float',
    };

    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ orderDiscount = this.declared('orderDiscount');
    /** @type {number | null} */ shippingDiscount = this.declared('shippingDiscount');
    /** @type {number | null} */ discountOnTax = this.declared('discountOnTax');
    /** @type {number | null} */ discountOnShippingTax = this.declared('discountOnShippingTax');
}

/** The `discount` entry of `messages`; `status` is read as sent. */
export class CartDiscountMessage extends Dto {
    static FIELDS = {
        message: 'string',
        status: 'any',
    };

    /** @type {string | null} */ message = this.declared('message');
    /** @type {unknown} */ status = this.declared('status');
}

/** The cart's `messages` block. */
export class CartMessages extends Dto {
    static FIELDS = {
        discount: CartDiscountMessage,
    };

    /** @type {CartDiscountMessage | null} */ discount = this.declared('discount');
}

/** The one entry of `group_meta`. */
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

/** The `group_meta` block, which only a read sends, beside the `cart` envelope. */
export class GroupMeta extends Dto {
    static FIELDS = {
        cart: SectionMeta,
    };

    /** @type {SectionMeta | null} */ cart = this.declared('cart');
}

/** One cart: the answer of the add, the read and the line update. */
export class Cart extends Dto {
    static ENVELOPE_KEY = 'cart';

    static FIELDS = {
        customerId: 'int',
        sessionId: 'string',
        currencyCode: 'string',
        currencySymbol: 'string',
        deliveryType: 'string',
        totals: CartTotals,
        shipping: CartShipping,
        items: dtoList(CartItem),
        discount: CartDiscount,
        messages: CartMessages,
        groupMeta: GroupMeta,
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ sessionId = this.declared('sessionId');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {string | null} */ currencySymbol = this.declared('currencySymbol');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {CartTotals | null} */ totals = this.declared('totals');
    /** @type {CartShipping | null} */ shipping = this.declared('shipping');
    /** @type {Array<CartItem | null> | null} */ items = this.declared('items');
    /** @type {CartDiscount | null} */ discount = this.declared('discount');
    /** @type {CartMessages | null} */ messages = this.declared('messages');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
}

/** A `shipping_address` or `billing_address`; `address_line1` keeps the wire spelling no camelCase name derives. */
export class CartAddressInput extends Dto {
    static FIELDS = {
        firstName: 'string',
        lastName: 'string',
        address_line1: 'string',
        address_line2: 'string',
        city: 'string',
        postCode: 'string',
        phone: 'string',
        mobile: 'string',
        fax: 'string',
        email: 'string',
        countryCode: 'string',
        stateCode: 'string',
    };

    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ address_line1 = this.declared('address_line1');
    /** @type {string | null} */ address_line2 = this.declared('address_line2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ fax = this.declared('fax');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ stateCode = this.declared('stateCode');
}

/** The add's body, sent bare; `customerId` takes the customer's `internal_id`. */
export class CartItemInput extends Dto {
    static FIELDS = {
        productId: 'int',
        quantity: 'int',
        customerId: 'int',
        sessionId: 'string',
        shippingAddress: CartAddressInput,
    };

    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ sessionId = this.declared('sessionId');
    /** @type {CartAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
}

/** The line update's body, sent bare; `cartItemId` and `quantity` are required. */
export class CartItemUpdateInput extends Dto {
    static FIELDS = {
        cartItemId: 'int',
        quantity: 'int',
        shippingAddress: CartAddressInput,
        billingAddress: CartAddressInput,
    };

    /** @type {number | null} */ cartItemId = this.declared('cartItemId');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {CartAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {CartAddressInput | null} */ billingAddress = this.declared('billingAddress');
}

/** `sessionId` under the store's camel-case key, which a declared name would derive as `session_id`. */
class CartSessionRecord extends Dto {
    static FIELDS = {
        sessionId: 'string',
    };

    /** @type {string | null} */ sessionId = this.declared('sessionId');

    /** @returns {Record<string, string>} */
    static fields() {
        return Object.freeze({sessionId: CART_SESSION_KEY});
    }

    /** @param {unknown} body @returns {any} */
    static fromMap(body) {
        const record = /** @type {any} */ (super.fromMap(body));
        const value = /** @type {Record<string, unknown>} */ (body)[CART_SESSION_KEY];
        record.sessionId = typeof value === 'string' ? value : null;
        return record;
    }

    /** @returns {Record<string, unknown>} */
    toMap() {
        return this.sessionId === null ? {} : {[CART_SESSION_KEY]: this.sessionId};
    }
}

/** The session write's body; an unset `sessionId` sends `{}`. */
export class CartSessionInput extends CartSessionRecord {}

/** The session write's answer. */
export class CartSession extends CartSessionRecord {}

/** The order write's body, sent bare; `customerId` takes the customer's `customer_id`. */
export class CartOrderInput extends Dto {
    static FIELDS = {
        customerId: 'int',
        paymentGateway: 'string',
        deliveryType: 'string',
        transactionNo: 'string',
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ paymentGateway = this.declared('paymentGateway');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** A country or a state, as an object; a state arrives `{}` when the address has none. */
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

/** The order's `customer_summary`, carrying both of the customer's ids. */
export class CartOrderCustomer extends Dto {
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

/** One entry of the order's `order_line_details`. */
export class CartOrderLine extends Dto {
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
    /** @type {Array<unknown> | null} */ variations = this.declared('variations');
    /** @type {string | null} */ serialBatchNumber = this.declared('serialBatchNumber');
}

/** One entry of the order's `payments`. */
export class CartOrderPayment extends Dto {
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

/** The order's `billing_address` or `shipping_address`. */
export class CartOrderAddress extends Dto {
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

/**
 * The order a cart became, with the write's `status` read from beside the envelope. `transactionNo` answers `null`
 * here even when the write stored one.
 */
export class CartOrder extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        status: 'string',
        orderId: 'int',
        internalId: 'int',
        orderNo: 'int',
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
        customerSummary: CartOrderCustomer,
        orderLineDetails: dtoList(CartOrderLine),
        payments: dtoList(CartOrderPayment),
        externalReferenceOrderId: 'any',
        externalReferenceStoreId: 'any',
        externalReferenceOrderNo: 'any',
        externalReferenceStatus: 'any',
        externalReferenceUrl: 'any',
        customerPoNumber: 'string',
        paymentTerm: 'string',
        fulfillmentMode: 'string',
        fulfillmentTerm: 'string',
        invoiceMode: 'string',
        billingAddress: CartOrderAddress,
        shippingAddress: CartOrderAddress,
        customFields: dtoList('any'),
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ orderId = this.declared('orderId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
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
    /** @type {CartOrderCustomer | null} */ customerSummary = this.declared('customerSummary');
    /** @type {Array<CartOrderLine | null> | null} */ orderLineDetails = this.declared('orderLineDetails');
    /** @type {Array<CartOrderPayment | null> | null} */ payments = this.declared('payments');
    /** @type {unknown} */ externalReferenceOrderId = this.declared('externalReferenceOrderId');
    /** @type {unknown} */ externalReferenceStoreId = this.declared('externalReferenceStoreId');
    /** @type {unknown} */ externalReferenceOrderNo = this.declared('externalReferenceOrderNo');
    /** @type {unknown} */ externalReferenceStatus = this.declared('externalReferenceStatus');
    /** @type {unknown} */ externalReferenceUrl = this.declared('externalReferenceUrl');
    /** @type {string | null} */ customerPoNumber = this.declared('customerPoNumber');
    /** @type {string | null} */ paymentTerm = this.declared('paymentTerm');
    /** @type {string | null} */ fulfillmentMode = this.declared('fulfillmentMode');
    /** @type {string | null} */ fulfillmentTerm = this.declared('fulfillmentTerm');
    /** @type {string | null} */ invoiceMode = this.declared('invoiceMode');
    /** @type {CartOrderAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {CartOrderAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {Array<unknown> | null} */ customFields = this.declared('customFields');
}

sealDtoSchema(
    CartTotals,
    CartShipping,
    CartItemPricing,
    CartItemProduct,
    CartItem,
    CartDiscount,
    CartDiscountMessage,
    CartMessages,
    SectionMeta,
    GroupMeta,
    Cart,
    CartAddressInput,
    CartItemInput,
    CartItemUpdateInput,
    CartSessionRecord,
    CartSessionInput,
    CartSession,
    CartOrderInput,
    Reference,
    CartOrderCustomer,
    CartOrderLine,
    CartOrderPayment,
    CartOrderAddress,
    CartOrder,
);
