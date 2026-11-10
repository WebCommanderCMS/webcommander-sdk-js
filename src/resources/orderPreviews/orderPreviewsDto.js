import {Dto, dtoList, sealDtoSchema} from '../../dto.js';
import {OrderAddressInput, OrderProductInput} from '../orders/ordersDto.js';

/**
 * The session block. `sessionId` starts `PRV-` and is the `preview_session_id` of every other call. `expiresAt` is 30
 * minutes after `createdAt`; a coupon or gift card call, applying or removing, moves it 30 minutes past that call, and
 * a read does not.
 */
export class PreviewSession extends Dto {
    static FIELDS = {
        sessionId: 'string',
        status: 'string',
        createdAt: 'string',
        expiresAt: 'string',
    };

    /** @type {string | null} */ sessionId = this.declared('sessionId');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ expiresAt = this.declared('expiresAt');
}

/** The customer as the preview shows it: the billing address names win over the record's. */
export class PreviewCustomer extends Dto {
    static FIELDS = {
        customerId: 'int',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
}

/** One line of the preview, priced by the store. */
export class PreviewItem extends Dto {
    static FIELDS = {
        productId: 'int',
        productName: 'string',
        sku: 'string',
        quantity: 'int',
        price: 'float',
        discount: 'float',
        tax: 'float',
        totalAmount: 'float',
        taxable: 'boolean',
        shippable: 'boolean',
    };

    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ price = this.declared('price');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ totalAmount = this.declared('totalAmount');
    /** @type {boolean | null} */ taxable = this.declared('taxable');
    /** @type {boolean | null} */ shippable = this.declared('shippable');
}

/** The delivery the preview was priced for. A `store_pickup` has no shipping cost. */
export class PreviewShipping extends Dto {
    static FIELDS = {
        deliveryType: 'string',
        shippingType: 'string',
        shippingCost: 'float',
        shippingTax: 'float',
    };

    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {string | null} */ shippingType = this.declared('shippingType');
    /** @type {number | null} */ shippingCost = this.declared('shippingCost');
    /** @type {number | null} */ shippingTax = this.declared('shippingTax');
}

/** The coupon on the preview: `amount` is the discount it takes off, `status` `applied`. */
export class PreviewCoupon extends Dto {
    static FIELDS = {
        code: 'string',
        status: 'string',
        amount: 'float',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ amount = this.declared('amount');
}

/** The gift card on the preview: `appliedAmount` is the lesser of its balance and the grand total. `remainingBalance` came back `null`. */
export class PreviewGiftCard extends Dto {
    static FIELDS = {
        code: 'string',
        status: 'string',
        appliedAmount: 'float',
        remainingBalance: 'float',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ appliedAmount = this.declared('appliedAmount');
    /** @type {number | null} */ remainingBalance = this.declared('remainingBalance');
}

/** At most one coupon and one gift card; `null` for one not applied. */
export class PreviewDiscounts extends Dto {
    static FIELDS = {
        coupon: PreviewCoupon,
        giftCard: PreviewGiftCard,
    };

    /** @type {PreviewCoupon | null} */ coupon = this.declared('coupon');
    /** @type {PreviewGiftCard | null} */ giftCard = this.declared('giftCard');
}

/**
 * The money. `grandTotal` is `subTotal` less `totalDiscount` plus the tax, shipping (and its tax), handling and
 * surcharge; a gift card lowers `due`, not `grandTotal`.
 */
export class PreviewTotals extends Dto {
    static FIELDS = {
        subTotal: 'float',
        totalDiscount: 'float',
        totalTax: 'float',
        shippingCost: 'float',
        handlingCost: 'float',
        totalSurcharge: 'float',
        giftCardApplied: 'float',
        grandTotal: 'float',
        due: 'float',
    };

    /** @type {number | null} */ subTotal = this.declared('subTotal');
    /** @type {number | null} */ totalDiscount = this.declared('totalDiscount');
    /** @type {number | null} */ totalTax = this.declared('totalTax');
    /** @type {number | null} */ shippingCost = this.declared('shippingCost');
    /** @type {number | null} */ handlingCost = this.declared('handlingCost');
    /** @type {number | null} */ totalSurcharge = this.declared('totalSurcharge');
    /** @type {number | null} */ giftCardApplied = this.declared('giftCardApplied');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
    /** @type {number | null} */ due = this.declared('due');
}

/** A preview. The start and the read answer every field; a coupon or gift card call answers only `session`, `discounts` and `totals`. */
export class OrderPreview extends Dto {
    static ENVELOPE_KEY = 'order';

    static FIELDS = {
        session: PreviewSession,
        customer: PreviewCustomer,
        deliveryType: 'string',
        currencyCode: 'string',
        items: dtoList(PreviewItem),
        shipping: PreviewShipping,
        discounts: PreviewDiscounts,
        totals: PreviewTotals,
    };

    /** @type {PreviewSession | null} */ session = this.declared('session');
    /** @type {PreviewCustomer | null} */ customer = this.declared('customer');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {Array<PreviewItem | null> | null} */ items = this.declared('items');
    /** @type {PreviewShipping | null} */ shipping = this.declared('shipping');
    /** @type {PreviewDiscounts | null} */ discounts = this.declared('discounts');
    /** @type {PreviewTotals | null} */ totals = this.declared('totals');
}

/**
 * The start body, bare. `products` is required. Without `customerId` the billing address is required, and a shipping
 * address too unless `deliveryType` is `store_pickup`. `deliveryType` is `shipping` unless it is `delivery`,
 * `others_shipping` or `store_pickup`. An unknown field, such as `coupon_code` or a product line's `price`, is `400`.
 */
export class OrderPreviewInput extends Dto {
    static FIELDS = {
        customerId: 'int',
        deliveryType: 'string',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
        products: dtoList(OrderProductInput),
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {Array<OrderProductInput | null> | null} */ products = this.declared('products');
}

/** The body of a coupon or gift card call: `code`, required, at most 100 characters. */
export class OrderPreviewCodeInput extends Dto {
    static FIELDS = {
        code: 'string',
    };

    /** @type {string | null} */ code = this.declared('code');
}

/**
 * The payment a confirm records. `amount` above what is due is `422`, a missing `paymentMethod` is `400`, and
 * `paymentStatus` `failed` leaves the order unpaid.
 */
export class OrderPreviewPaymentInput extends Dto {
    static FIELDS = {
        amount: 'float',
        paymentStatus: 'string',
        paymentMethod: 'string',
        transactionReference: 'string',
        transactionDate: 'string',
    };

    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ paymentStatus = this.declared('paymentStatus');
    /** @type {string | null} */ paymentMethod = this.declared('paymentMethod');
    /** @type {string | null} */ transactionReference = this.declared('transactionReference');
    /** @type {string | null} */ transactionDate = this.declared('transactionDate');
}

/** The confirm body, bare, and optional. `paymentGateway` takes a code such as `PIS` and leaves the order unpaid; an unknown field is `400`. */
export class OrderPreviewConfirmInput extends Dto {
    static FIELDS = {
        paymentGateway: 'string',
        transactionNo: 'string',
        sendEmail: 'boolean',
        payment: OrderPreviewPaymentInput,
    };

    /** @type {string | null} */ paymentGateway = this.declared('paymentGateway');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ sendEmail = this.declared('sendEmail');
    /** @type {OrderPreviewPaymentInput | null} */ payment = this.declared('payment');
}

sealDtoSchema(
    PreviewSession,
    PreviewCustomer,
    PreviewItem,
    PreviewShipping,
    PreviewCoupon,
    PreviewGiftCard,
    PreviewDiscounts,
    PreviewTotals,
    OrderPreview,
    OrderPreviewInput,
    OrderPreviewCodeInput,
    OrderPreviewPaymentInput,
    OrderPreviewConfirmInput,
);
