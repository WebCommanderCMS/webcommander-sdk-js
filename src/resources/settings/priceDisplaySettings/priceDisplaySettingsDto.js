import {Dto, sealDtoSchema} from '../../../dto.js';

/** The storefront surfaces one setting applies to; each block allows its own subset. */
export class DisplayScopes extends Dto {
    static FIELDS = {
        shoppingCart: 'boolean',
        checkout: 'boolean',
        orderSuccess: 'boolean',
    };

    /** @type {boolean | null} */ shoppingCart = this.declared('shoppingCart');
    /** @type {boolean | null} */ checkout = this.declared('checkout');
    /** @type {boolean | null} */ orderSuccess = this.declared('orderSuccess');
}

/** A master switch with optional per-surface control; while `customize` is off the store computes `scopes`. */
export class ScopedToggle extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        customize: 'boolean',
        scopes: DisplayScopes,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ customize = this.declared('customize');
    /** @type {DisplayScopes | null} */ scopes = this.declared('scopes');
}

/** A setting with nothing but a master switch. */
export class PlainToggle extends Dto {
    static FIELDS = {
        enabled: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
}

/** The `subtotal` block; `show` is a {@link DisplayScopes} rather than a toggle. */
export class Subtotal extends Dto {
    static FIELDS = {
        show: DisplayScopes,
        includeTax: ScopedToggle,
        includeDiscount: ScopedToggle,
    };

    /** @type {DisplayScopes | null} */ show = this.declared('show');
    /** @type {ScopedToggle | null} */ includeTax = this.declared('includeTax');
    /** @type {ScopedToggle | null} */ includeDiscount = this.declared('includeDiscount');
}

/** The `discount` block — where the discount line shows, whether it hides at zero and whether it carries tax. */
export class Discount extends Dto {
    static FIELDS = {
        show: DisplayScopes,
        hideIfZero: ScopedToggle,
        includeTax: ScopedToggle,
    };

    /** @type {DisplayScopes | null} */ show = this.declared('show');
    /** @type {ScopedToggle | null} */ hideIfZero = this.declared('hideIfZero');
    /** @type {ScopedToggle | null} */ includeTax = this.declared('includeTax');
}

/** The `shipping_cost` block — where the shipping line shows, and whether it carries tax and discount. */
export class ShippingCost extends Dto {
    static FIELDS = {
        show: DisplayScopes,
        includeTax: ScopedToggle,
        includeDiscount: ScopedToggle,
    };

    /** @type {DisplayScopes | null} */ show = this.declared('show');
    /** @type {ScopedToggle | null} */ includeTax = this.declared('includeTax');
    /** @type {ScopedToggle | null} */ includeDiscount = this.declared('includeDiscount');
}

/** The `shipping_discount` block — the shipping discount line, its tax, and the shipping tax line's switch. */
export class ShippingDiscount extends Dto {
    static FIELDS = {
        show: DisplayScopes,
        includeTax: ScopedToggle,
        shippingTax: PlainToggle,
    };

    /** @type {DisplayScopes | null} */ show = this.declared('show');
    /** @type {ScopedToggle | null} */ includeTax = this.declared('includeTax');
    /** @type {PlainToggle | null} */ shippingTax = this.declared('shippingTax');
}

/** The `handling` block — whether handling shows apart from shipping, and its two tax settings. */
export class Handling extends Dto {
    static FIELDS = {
        showSeparately: DisplayScopes,
        includeTax: ScopedToggle,
        handlingTax: ScopedToggle,
    };

    /** @type {DisplayScopes | null} */ showSeparately = this.declared('showSeparately');
    /** @type {ScopedToggle | null} */ includeTax = this.declared('includeTax');
    /** @type {ScopedToggle | null} */ handlingTax = this.declared('handlingTax');
}

/** The `pricing_info` block — a note after the total, and whether the success page hides the due amount. */
export class PricingInfo extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        text: 'string',
        customize: 'boolean',
        scopes: DisplayScopes,
        doNotShowDueAmount: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ text = this.declared('text');
    /** @type {boolean | null} */ customize = this.declared('customize');
    /** @type {DisplayScopes | null} */ scopes = this.declared('scopes');
    /** @type {boolean | null} */ doNotShowDueAmount = this.declared('doNotShowDueAmount');
}

/** The `order_item` section — how a line item's own price is displayed. */
export class OrderItem extends Dto {
    static ENVELOPE_KEY = 'order_item';

    static FIELDS = {
        priceIncludingTax: ScopedToggle,
        priceIncludingDiscount: ScopedToggle,
        taxInLine: ScopedToggle,
        discountInLineItem: ScopedToggle,
        itemTotalIncludingTax: ScopedToggle,
    };

    /** @type {ScopedToggle | null} */ priceIncludingTax = this.declared('priceIncludingTax');
    /** @type {ScopedToggle | null} */ priceIncludingDiscount = this.declared('priceIncludingDiscount');
    /** @type {ScopedToggle | null} */ taxInLine = this.declared('taxInLine');
    /** @type {ScopedToggle | null} */ discountInLineItem = this.declared('discountInLineItem');
    /** @type {ScopedToggle | null} */ itemTotalIncludingTax = this.declared('itemTotalIncludingTax');
}

/** The `order_summary` section — which lines the summary panel shows and what each one includes. */
export class OrderSummary extends Dto {
    static ENVELOPE_KEY = 'order_summary';

    static FIELDS = {
        orderTotalExcludingTax: ScopedToggle,
        orderTotalIncludingDiscount: ScopedToggle,
        subtotal: Subtotal,
        discount: Discount,
        subtotalTax: PlainToggle,
        totalTax: PlainToggle,
        orderTotal: PlainToggle,
        shippingCost: ShippingCost,
        shippingDiscount: ShippingDiscount,
        handling: Handling,
        paymentSurcharge: ScopedToggle,
        pricingInfo: PricingInfo,
    };

    /** @type {ScopedToggle | null} */ orderTotalExcludingTax = this.declared('orderTotalExcludingTax');
    /** @type {ScopedToggle | null} */ orderTotalIncludingDiscount = this.declared('orderTotalIncludingDiscount');
    /** @type {Subtotal | null} */ subtotal = this.declared('subtotal');
    /** @type {Discount | null} */ discount = this.declared('discount');
    /** @type {PlainToggle | null} */ subtotalTax = this.declared('subtotalTax');
    /** @type {PlainToggle | null} */ totalTax = this.declared('totalTax');
    /** @type {PlainToggle | null} */ orderTotal = this.declared('orderTotal');
    /** @type {ShippingCost | null} */ shippingCost = this.declared('shippingCost');
    /** @type {ShippingDiscount | null} */ shippingDiscount = this.declared('shippingDiscount');
    /** @type {Handling | null} */ handling = this.declared('handling');
    /** @type {ScopedToggle | null} */ paymentSurcharge = this.declared('paymentSurcharge');
    /** @type {PricingInfo | null} */ pricingInfo = this.declared('pricingInfo');
}

/** One entry of `group_meta`: what a section is, whether it can be written and where it is managed. */
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

/** The `group_meta` block — one {@link SectionMeta} per section; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        orderItem: SectionMeta,
        orderSummary: SectionMeta,
    };

    /** @type {SectionMeta | null} */ orderItem = this.declared('orderItem');
    /** @type {SectionMeta | null} */ orderSummary = this.declared('orderSummary');
}

/** The price display settings, as the facade or one section sends them. */
export class PriceDisplaySettings extends Dto {
    static ENVELOPE_KEY = 'price_display_settings';

    static FIELDS = {
        orderItem: OrderItem,
        orderSummary: OrderSummary,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {OrderItem | null} */ orderItem = this.declared('orderItem');
    /** @type {OrderSummary | null} */ orderSummary = this.declared('orderSummary');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    DisplayScopes,
    ScopedToggle,
    PlainToggle,
    Subtotal,
    Discount,
    ShippingCost,
    ShippingDiscount,
    Handling,
    PricingInfo,
    OrderItem,
    OrderSummary,
    SectionMeta,
    GroupMeta,
    PriceDisplaySettings,
);
