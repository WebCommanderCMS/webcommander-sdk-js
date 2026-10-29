import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The `continue_shopping` section — where the continue-shopping link goes; its target is a page slug. */
export class ContinueShopping extends Dto {
    static ENVELOPE_KEY = 'continue_shopping';

    static FIELDS = {
        enableContinueShopping: 'boolean',
        continueShoppingTarget: 'string',
        continueShoppingSpecifiedTarget: 'string',
    };

    /** @type {boolean | null} */ enableContinueShopping = this.declared('enableContinueShopping');
    /** @type {string | null} */ continueShoppingTarget = this.declared('continueShoppingTarget');
    /** @type {string | null} */ continueShoppingSpecifiedTarget = this.declared('continueShoppingSpecifiedTarget');
}

/** The `product_inventory` section — out-of-stock behaviour and when a sale draws stock down. */
export class ProductInventory extends Dto {
    static ENVELOPE_KEY = 'product_inventory';

    static FIELDS = {
        showOutOfStockProducts: 'boolean',
        lowStockNotification: 'boolean',
        outOfStockNotification: 'boolean',
        hideOnSaleTagForOutOfStockProduct: 'boolean',
        orderQuantityOverStock: 'string',
        updateStock: 'string',
    };

    /** @type {boolean | null} */ showOutOfStockProducts = this.declared('showOutOfStockProducts');
    /** @type {boolean | null} */ lowStockNotification = this.declared('lowStockNotification');
    /** @type {boolean | null} */ outOfStockNotification = this.declared('outOfStockNotification');
    /** @type {boolean | null} */ hideOnSaleTagForOutOfStockProduct = this.declared(
        'hideOnSaleTagForOutOfStockProduct',
    );
    /** @type {string | null} */ orderQuantityOverStock = this.declared('orderQuantityOverStock');
    /** @type {string | null} */ updateStock = this.declared('updateStock');
}

/** The `pricing` section — purchase floors, credit and payment terms. */
export class Pricing extends Dto {
    static ENVELOPE_KEY = 'pricing';

    static FIELDS = {
        updatePriceRange: 'boolean',
        enableMinimumPurchaseAmount: 'boolean',
        minimumPurchaseAmount: 'float',
        enableMinimumPurchaseAmountInCart: 'boolean',
        minimumPurchaseAmountInCart: 'float',
        enableOnAccountPurchase: 'boolean',
        assignCreditLimitPerOrder: 'boolean',
        creditLimitPerOrder: 'float',
        enablePaymentTerms: 'boolean',
        paymentTerms: 'string',
        enableCustomerPriceRestriction: 'boolean',
    };

    /** @type {boolean | null} */ updatePriceRange = this.declared('updatePriceRange');
    /** @type {boolean | null} */ enableMinimumPurchaseAmount = this.declared('enableMinimumPurchaseAmount');
    /** @type {number | null} */ minimumPurchaseAmount = this.declared('minimumPurchaseAmount');
    /** @type {boolean | null} */ enableMinimumPurchaseAmountInCart = this.declared(
        'enableMinimumPurchaseAmountInCart',
    );
    /** @type {number | null} */ minimumPurchaseAmountInCart = this.declared('minimumPurchaseAmountInCart');
    /** @type {boolean | null} */ enableOnAccountPurchase = this.declared('enableOnAccountPurchase');
    /** @type {boolean | null} */ assignCreditLimitPerOrder = this.declared('assignCreditLimitPerOrder');
    /** @type {number | null} */ creditLimitPerOrder = this.declared('creditLimitPerOrder');
    /** @type {boolean | null} */ enablePaymentTerms = this.declared('enablePaymentTerms');
    /** @type {string | null} */ paymentTerms = this.declared('paymentTerms');
    /** @type {boolean | null} */ enableCustomerPriceRestriction = this.declared('enableCustomerPriceRestriction');
}

/** The `product_restriction` section — one switch. */
export class ProductRestriction extends Dto {
    static ENVELOPE_KEY = 'product_restriction';

    static FIELDS = {
        enableProductRestrictionBasedOnParentCategory: 'boolean',
    };

    /** @type {boolean | null} */ enableProductRestrictionBasedOnParentCategory = this.declared(
        'enableProductRestrictionBasedOnParentCategory',
    );
}

/** The `order_filters` section — the status each admin order list opens on; each reads `null` when unset. */
export class OrderFilters extends Dto {
    static ENVELOPE_KEY = 'order_filters';

    static FIELDS = {
        defaultOrderStatus: 'string',
        defaultPaymentStatus: 'string',
        defaultShipmentStatus: 'string',
    };

    /** @type {string | null} */ defaultOrderStatus = this.declared('defaultOrderStatus');
    /** @type {string | null} */ defaultPaymentStatus = this.declared('defaultPaymentStatus');
    /** @type {string | null} */ defaultShipmentStatus = this.declared('defaultShipmentStatus');
}

/** One row of `location_settings.locations`, as the facade previews it; the rows are managed elsewhere. */
export class InventoryLocation extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        address: 'string',
        active: 'boolean',
        default: 'boolean',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ address = this.declared('address');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The `location_settings` section — the multi-location switch, the only writable field, and a read-only preview. */
export class LocationSettings extends Dto {
    static ENVELOPE_KEY = 'location_settings';

    static FIELDS = {
        enableMultiLocation: 'boolean',
        locations: dtoList(InventoryLocation),
    };

    /** @type {boolean | null} */ enableMultiLocation = this.declared('enableMultiLocation');
    /** @type {InventoryLocation[] | null} */ locations = this.declared('locations');
}

/** One row of `order_flags`, as the facade inlines it; nothing in this module writes one. */
export class OrderFlag extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        color: 'string',
        description: 'string',
        type: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ color = this.declared('color');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ type = this.declared('type');
}

/** One entry of `group_meta`; `location_settings` also carries `locations_href`. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
        locationsHref: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
    /** @type {string | null} */ locationsHref = this.declared('locationsHref');
}

/** The `group_meta` block — one {@link SectionMeta} per area key, `order_flags` included; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        continueShopping: SectionMeta,
        productInventory: SectionMeta,
        pricing: SectionMeta,
        productRestriction: SectionMeta,
        orderFilters: SectionMeta,
        locationSettings: SectionMeta,
        orderFlags: SectionMeta,
    };

    /** @type {SectionMeta | null} */ continueShopping = this.declared('continueShopping');
    /** @type {SectionMeta | null} */ productInventory = this.declared('productInventory');
    /** @type {SectionMeta | null} */ pricing = this.declared('pricing');
    /** @type {SectionMeta | null} */ productRestriction = this.declared('productRestriction');
    /** @type {SectionMeta | null} */ orderFilters = this.declared('orderFilters');
    /** @type {SectionMeta | null} */ locationSettings = this.declared('locationSettings');
    /** @type {SectionMeta | null} */ orderFlags = this.declared('orderFlags');
}

/** The ecommerce settings, as the facade or one section sends them; `orderFlags` is a list, not a section. */
export class EcommerceSettings extends Dto {
    static ENVELOPE_KEY = 'ecommerce_settings';

    static FIELDS = {
        continueShopping: ContinueShopping,
        productInventory: ProductInventory,
        pricing: Pricing,
        productRestriction: ProductRestriction,
        orderFilters: OrderFilters,
        locationSettings: LocationSettings,
        orderFlags: dtoList(OrderFlag),
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {ContinueShopping | null} */ continueShopping = this.declared('continueShopping');
    /** @type {ProductInventory | null} */ productInventory = this.declared('productInventory');
    /** @type {Pricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductRestriction | null} */ productRestriction = this.declared('productRestriction');
    /** @type {OrderFilters | null} */ orderFilters = this.declared('orderFilters');
    /** @type {LocationSettings | null} */ locationSettings = this.declared('locationSettings');
    /** @type {OrderFlag[] | null} */ orderFlags = this.declared('orderFlags');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    ContinueShopping,
    ProductInventory,
    Pricing,
    ProductRestriction,
    OrderFilters,
    InventoryLocation,
    LocationSettings,
    OrderFlag,
    SectionMeta,
    GroupMeta,
    EcommerceSettings,
);
