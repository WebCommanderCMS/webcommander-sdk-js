import {Dto, dtoList, sealDtoSchema} from '../../dto.js';
import {OrderAddressInput} from '../orders/ordersDto.js';
import {Reference} from './cartsDto.js';

/**
 * The session block. `sessionId` starts `PRV-` and is the `session_id` of every other call. `expiresAt` is 30 minutes
 * after the last write.
 */
export class AdminCartSession extends Dto {
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

/** The customer the cart is for; `customerId` is the customer's normal id. */
export class AdminCartCustomer extends Dto {
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

/**
 * One line, priced by the store. `cartItemId` is what the line's update and delete take; a replace of the cart numbers
 * its lines again.
 */
export class AdminCartItem extends Dto {
    static FIELDS = {
        cartItemId: 'int',
        productId: 'int',
        productName: 'string',
        variationId: 'int',
        variationName: 'string',
        sku: 'string',
        price: 'float',
        quantity: 'int',
        discount: 'float',
        tax: 'float',
        totalAmount: 'float',
        taxable: 'boolean',
        shippable: 'boolean',
    };

    /** @type {number | null} */ cartItemId = this.declared('cartItemId');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {number | null} */ variationId = this.declared('variationId');
    /** @type {string | null} */ variationName = this.declared('variationName');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ price = this.declared('price');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ totalAmount = this.declared('totalAmount');
    /** @type {boolean | null} */ taxable = this.declared('taxable');
    /** @type {boolean | null} */ shippable = this.declared('shippable');
}

/** The cart's money before shipping. */
export class AdminCartTotals extends Dto {
    static FIELDS = {
        subTotal: 'float',
        totalDiscount: 'float',
        totalTax: 'float',
        grandTotal: 'float',
    };

    /** @type {number | null} */ subTotal = this.declared('subTotal');
    /** @type {number | null} */ totalDiscount = this.declared('totalDiscount');
    /** @type {number | null} */ totalTax = this.declared('totalTax');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
}

/** A cart: what every cart call but the deletes answers. */
export class AdminCart extends Dto {
    static ENVELOPE_KEY = 'cart';

    static FIELDS = {
        session: AdminCartSession,
        customer: AdminCartCustomer,
        currencyCode: 'string',
        items: dtoList(AdminCartItem),
        totals: AdminCartTotals,
    };

    /** @type {AdminCartSession | null} */ session = this.declared('session');
    /** @type {AdminCartCustomer | null} */ customer = this.declared('customer');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {Array<AdminCartItem | null> | null} */ items = this.declared('items');
    /** @type {AdminCartTotals | null} */ totals = this.declared('totals');
}

/** A billing or shipping address as the checkout reads it back; `state` is `{}` when the address has none. */
export class CheckoutAddress extends Dto {
    static FIELDS = {
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

/** The delivery the checkout was priced for; empty until a `deliveryType` is set. */
export class CheckoutShipping extends Dto {
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

/** The coupon applied: `appliedAmount` is the discount it takes off. */
export class CheckoutCoupon extends Dto {
    static FIELDS = {
        code: 'string',
        status: 'string',
        appliedAmount: 'float',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ appliedAmount = this.declared('appliedAmount');
}

/** The gift card applied: `appliedAmount` is the lesser of its balance and the grand total. */
export class CheckoutGiftCard extends Dto {
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
export class CheckoutDiscounts extends Dto {
    static FIELDS = {
        coupon: CheckoutCoupon,
        giftCard: CheckoutGiftCard,
    };

    /** @type {CheckoutCoupon | null} */ coupon = this.declared('coupon');
    /** @type {CheckoutGiftCard | null} */ giftCard = this.declared('giftCard');
}

/** The money. A gift card lowers `due`, not `grandTotal`. */
export class CheckoutTotals extends Dto {
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

/** One thing still blocking a confirm, such as `field` `delivery_type` with `code` `required`. */
export class CheckoutIssue extends Dto {
    static FIELDS = {
        field: 'string',
        code: 'string',
        message: 'string',
    };

    /** @type {string | null} */ field = this.declared('field');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ message = this.declared('message');
}

/**
 * The checkout. The read and the update answer every field; the coupon, gift card and delivery schedule calls answer
 * the parts they change. `deliverySchedule` is `null` until one is set.
 */
export class AdminCheckout extends Dto {
    static ENVELOPE_KEY = 'checkout';

    static FIELDS = {
        session: AdminCartSession,
        customer: AdminCartCustomer,
        deliveryType: 'string',
        currencyCode: 'string',
        items: dtoList(AdminCartItem),
        billingAddress: CheckoutAddress,
        shippingAddress: CheckoutAddress,
        shipping: CheckoutShipping,
        discounts: CheckoutDiscounts,
        deliverySchedule: 'any',
        totals: CheckoutTotals,
        issues: dtoList(CheckoutIssue),
    };

    /** @type {AdminCartSession | null} */ session = this.declared('session');
    /** @type {AdminCartCustomer | null} */ customer = this.declared('customer');
    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {string | null} */ currencyCode = this.declared('currencyCode');
    /** @type {Array<AdminCartItem | null> | null} */ items = this.declared('items');
    /** @type {CheckoutAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {CheckoutAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {CheckoutShipping | null} */ shipping = this.declared('shipping');
    /** @type {CheckoutDiscounts | null} */ discounts = this.declared('discounts');
    /** @type {any} */ deliverySchedule = this.declared('deliverySchedule');
    /** @type {CheckoutTotals | null} */ totals = this.declared('totals');
    /** @type {Array<CheckoutIssue | null> | null} */ issues = this.declared('issues');
}

/** One product line to put on a cart. `productId` and `quantity` are required; `variationId` picks a variation. */
export class AdminCartProductInput extends Dto {
    static FIELDS = {
        productId: 'int',
        variationId: 'int',
        quantity: 'int',
    };

    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {number | null} */ variationId = this.declared('variationId');
    /** @type {number | null} */ quantity = this.declared('quantity');
}

/**
 * The create and replace body, bare. `products` is required, and so is `customerId` on a replace; `sessionId` on a
 * create names the session yourself, in the `PRV-` form. An unknown field is `400 unknown_field`.
 */
export class AdminCartInput extends Dto {
    static FIELDS = {
        customerId: 'int',
        sessionId: 'string',
        products: dtoList(AdminCartProductInput),
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ sessionId = this.declared('sessionId');
    /** @type {Array<AdminCartProductInput | null> | null} */ products = this.declared('products');
}

/** The cart update body: the customer to move the cart to. `customerId` is required. */
export class AdminCartCustomerInput extends Dto {
    static FIELDS = {
        customerId: 'int',
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
}

/** The add-lines body. Adding a product already on the cart raises that line's quantity. */
export class AdminCartItemsInput extends Dto {
    static FIELDS = {
        products: dtoList(AdminCartProductInput),
    };

    /** @type {Array<AdminCartProductInput | null> | null} */ products = this.declared('products');
}

/** The line update body: the new `quantity`, required. */
export class AdminCartItemUpdateInput extends Dto {
    static FIELDS = {
        quantity: 'int',
    };

    /** @type {number | null} */ quantity = this.declared('quantity');
}

/**
 * The checkout update body. `deliveryType` is `shipping`, `delivery`, `others_shipping` or `store_pickup`; an address
 * replaces the whole one.
 */
export class AdminCheckoutInput extends Dto {
    static FIELDS = {
        deliveryType: 'string',
        billingAddress: OrderAddressInput,
        shippingAddress: OrderAddressInput,
    };

    /** @type {string | null} */ deliveryType = this.declared('deliveryType');
    /** @type {OrderAddressInput | null} */ billingAddress = this.declared('billingAddress');
    /** @type {OrderAddressInput | null} */ shippingAddress = this.declared('shippingAddress');
}

/** The body of a coupon or gift card call: `code`, required. */
export class AdminCheckoutCodeInput extends Dto {
    static FIELDS = {
        code: 'string',
    };

    /** @type {string | null} */ code = this.declared('code');
}

/** The payment a confirm records. `amount` and `paymentMethod` are required; an `amount` above what is due is refused. */
export class AdminCheckoutPaymentInput extends Dto {
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

/**
 * The confirm body, bare, and optional. `paymentGateway` takes one of the store's codes, such as `PIS`; an unknown
 * field is `400`.
 */
export class AdminCheckoutConfirmInput extends Dto {
    static FIELDS = {
        paymentGateway: 'string',
        transactionNo: 'string',
        sendEmail: 'boolean',
        payment: AdminCheckoutPaymentInput,
    };

    /** @type {string | null} */ paymentGateway = this.declared('paymentGateway');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ sendEmail = this.declared('sendEmail');
    /** @type {AdminCheckoutPaymentInput | null} */ payment = this.declared('payment');
}

/** The delivery schedule to choose: its `id` and the `date` wanted, both required. */
export class AdminCheckoutDeliveryScheduleInput extends Dto {
    static FIELDS = {
        id: 'int',
        date: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ date = this.declared('date');
}

sealDtoSchema(
    AdminCartSession,
    AdminCartCustomer,
    AdminCartItem,
    AdminCartTotals,
    AdminCart,
    CheckoutAddress,
    CheckoutShipping,
    CheckoutCoupon,
    CheckoutGiftCard,
    CheckoutDiscounts,
    CheckoutTotals,
    CheckoutIssue,
    AdminCheckout,
    AdminCartProductInput,
    AdminCartInput,
    AdminCartCustomerInput,
    AdminCartItemsInput,
    AdminCartItemUpdateInput,
    AdminCheckoutInput,
    AdminCheckoutCodeInput,
    AdminCheckoutPaymentInput,
    AdminCheckoutConfirmInput,
    AdminCheckoutDeliveryScheduleInput,
);
