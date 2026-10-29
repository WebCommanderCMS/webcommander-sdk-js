import {Dto, dtoList, dtoOneOf, sealDtoSchema} from '../../dto.js';

/** The shipping profile a group names; a write sends the bare `id`, not this record. */
export class CustomerGroupShippingProfile extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The stored image; a write sends a base64 or `data:` URI string, and `null` removes it. */
export class CustomerGroupBackgroundImage extends Dto {
    static FIELDS = {
        url: 'string',
        width: 'int',
        height: 'int',
    };

    /** @type {string | null} */ url = this.declared('url');
    /** @type {number | null} */ width = this.declared('width');
    /** @type {number | null} */ height = this.declared('height');
}

/** An `enabled` switch and its `amount`: `minimum_purchase`, `max_purchase` and `credit_limit` all take this shape. */
export class CustomerGroupAmountSetting extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        amount: 'float',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ amount = this.declared('amount');
}

/** `terms` is written `NET_30`, `NET_60` or `NET_90` and reads back in lower case. */
export class CustomerGroupPaymentTerms extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        terms: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ terms = this.declared('terms');
}

export class CustomerGroupOnAccountPurchase extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        maxPurchase: CustomerGroupAmountSetting,
        creditLimit: CustomerGroupAmountSetting,
        paymentTerms: CustomerGroupPaymentTerms,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {CustomerGroupAmountSetting | null} */ maxPurchase = this.declared('maxPurchase');
    /** @type {CustomerGroupAmountSetting | null} */ creditLimit = this.declared('creditLimit');
    /** @type {CustomerGroupPaymentTerms | null} */ paymentTerms = this.declared('paymentTerms');
}

export class CustomerGroupPurchasePreference extends Dto {
    static FIELDS = {
        minimumPurchase: CustomerGroupAmountSetting,
        onAccountPurchase: CustomerGroupOnAccountPurchase,
    };

    /** @type {CustomerGroupAmountSetting | null} */ minimumPurchase = this.declared('minimumPurchase');
    /** @type {CustomerGroupOnAccountPurchase | null} */ onAccountPurchase = this.declared('onAccountPurchase');
}

/** `basePriceRounding` is `nearest`, `up` or `down`. */
export class CustomerGroupTaxConfiguration extends Dto {
    static FIELDS = {
        overrideStoreTax: 'boolean',
        taxExempt: 'boolean',
        taxMessage: 'string',
        showPricesWithTaxIncluded: 'boolean',
        pricesEnteredWithTaxIncluded: 'boolean',
        basePriceRounding: 'string',
    };

    /** @type {boolean | null} */ overrideStoreTax = this.declared('overrideStoreTax');
    /** @type {boolean | null} */ taxExempt = this.declared('taxExempt');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
    /** @type {boolean | null} */ showPricesWithTaxIncluded = this.declared('showPricesWithTaxIncluded');
    /** @type {boolean | null} */ pricesEnteredWithTaxIncluded = this.declared('pricesEnteredWithTaxIncluded');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
}

/** `priceDisplayMethod` is `lowest` or `highest`. */
export class CustomerGroupProductDisplay extends Dto {
    static FIELDS = {
        overwriteDefault: 'boolean',
        variationDisplayType: 'string',
        displayParentImage: 'boolean',
        activateColourVariationImage: 'boolean',
        showSelectedVariationValue: 'boolean',
        strikeThroughOutOfStock: 'boolean',
        singleClickVariationLoading: 'boolean',
        priceDisplayMethod: 'string',
    };

    /** @type {boolean | null} */ overwriteDefault = this.declared('overwriteDefault');
    /** @type {string | null} */ variationDisplayType = this.declared('variationDisplayType');
    /** @type {boolean | null} */ displayParentImage = this.declared('displayParentImage');
    /** @type {boolean | null} */ activateColourVariationImage = this.declared('activateColourVariationImage');
    /** @type {boolean | null} */ showSelectedVariationValue = this.declared('showSelectedVariationValue');
    /** @type {boolean | null} */ strikeThroughOutOfStock = this.declared('strikeThroughOutOfStock');
    /** @type {boolean | null} */ singleClickVariationLoading = this.declared('singleClickVariationLoading');
    /** @type {string | null} */ priceDisplayMethod = this.declared('priceDisplayMethod');
}

/** One member, by its `customer_id`: an entry of `customers` and the membership read. */
export class CustomerGroupMember extends Dto {
    static ENVELOPE_KEY = 'customer';

    static FIELDS = {
        id: 'int',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
}

/** One group. */
export class CustomerGroup extends Dto {
    static ENVELOPE_KEY = 'customer_group';

    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        status: 'string',
        defaultTaxCode: 'string',
        addAsNewCustomerDefaultGroup: 'boolean',
        shippingProfile: CustomerGroupShippingProfile,
        backgroundImage: CustomerGroupBackgroundImage,
        purchasePreference: CustomerGroupPurchasePreference,
        taxConfiguration: CustomerGroupTaxConfiguration,
        productDisplay: CustomerGroupProductDisplay,
        createdAt: 'string',
        updatedAt: 'string',
        customerCount: 'int',
        customers: dtoList(CustomerGroupMember),
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {boolean | null} */ addAsNewCustomerDefaultGroup = this.declared('addAsNewCustomerDefaultGroup');
    /** @type {CustomerGroupShippingProfile | null} */ shippingProfile = this.declared('shippingProfile');
    /** @type {CustomerGroupBackgroundImage | null} */ backgroundImage = this.declared('backgroundImage');
    /** @type {CustomerGroupPurchasePreference | null} */ purchasePreference = this.declared('purchasePreference');
    /** @type {CustomerGroupTaxConfiguration | null} */ taxConfiguration = this.declared('taxConfiguration');
    /** @type {CustomerGroupProductDisplay | null} */ productDisplay = this.declared('productDisplay');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
    /** @type {number | null} */ customerCount = this.declared('customerCount');
    /** @type {Array<CustomerGroupMember | null> | null} */ customers = this.declared('customers');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The five-key `pagination` block; `limit` is the page size applied. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        hasPrevious: 'boolean',
        hasNext: 'boolean',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
}

/** One page of the listing, with the rows under `customer_groups` rather than `items`. */
export class CustomerGroupPage extends Dto {
    static FIELDS = {
        customerGroups: dtoList(CustomerGroup),
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<CustomerGroup | null> | null} */ customerGroups = this.declared('customerGroups');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class CustomerGroupCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

/** The assign answer: `added` is `false` when the customer was already a member. */
export class CustomerGroupAssignment extends Dto {
    static FIELDS = {
        status: 'string',
        customerId: 'int',
        email: 'string',
        group: CustomerGroup,
        added: 'boolean',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {CustomerGroup | null} */ group = this.declared('group');
    /** @type {boolean | null} */ added = this.declared('added');
}

/** The writable form of {@link CustomerGroup}, for the create and the patch. */
export class CustomerGroupInput extends Dto {
    static ENVELOPE_KEY = 'customer_group';

    static FIELDS = {
        name: 'string',
        description: 'string',
        status: 'string',
        defaultTaxCode: 'string',
        addAsNewCustomerDefaultGroup: 'boolean',
        shippingProfile: 'int',
        backgroundImage: 'string',
        purchasePreference: CustomerGroupPurchasePreference,
        taxConfiguration: CustomerGroupTaxConfiguration,
        productDisplay: CustomerGroupProductDisplay,
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {boolean | null} */ addAsNewCustomerDefaultGroup = this.declared('addAsNewCustomerDefaultGroup');
    /** @type {number | null} */ shippingProfile = this.declared('shippingProfile');
    /** @type {string | null} */ backgroundImage = this.declared('backgroundImage');
    /** @type {CustomerGroupPurchasePreference | null} */ purchasePreference = this.declared('purchasePreference');
    /** @type {CustomerGroupTaxConfiguration | null} */ taxConfiguration = this.declared('taxConfiguration');
    /** @type {CustomerGroupProductDisplay | null} */ productDisplay = this.declared('productDisplay');
}

/** The membership body: the whole member list, replacing the stored one; `[]` empties it. */
export class CustomerGroupCustomersInput extends Dto {
    static FIELDS = {
        customers: dtoList(dtoOneOf('int', 'string')),
    };

    /** @type {Array<number | string> | null} */ customers = this.declared('customers');
}

/** The assign body, both ids bare: `customer` is a `customer_id`. */
export class CustomerGroupAssignInput extends Dto {
    static FIELDS = {
        customer: dtoOneOf('int', 'string'),
        group: dtoOneOf('int', 'string'),
    };

    /** @type {number | string | null} */ customer = this.declared('customer');
    /** @type {number | string | null} */ group = this.declared('group');
}

sealDtoSchema(
    CustomerGroupShippingProfile,
    CustomerGroupBackgroundImage,
    CustomerGroupAmountSetting,
    CustomerGroupPaymentTerms,
    CustomerGroupOnAccountPurchase,
    CustomerGroupPurchasePreference,
    CustomerGroupTaxConfiguration,
    CustomerGroupProductDisplay,
    CustomerGroupMember,
    CustomerGroup,
    Pagination,
    CustomerGroupPage,
    CustomerGroupCount,
    CustomerGroupAssignment,
    CustomerGroupInput,
    CustomerGroupCustomersInput,
    CustomerGroupAssignInput,
);
