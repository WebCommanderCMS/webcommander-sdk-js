import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** An `{id, name}` pair: a rule that uses the rate. */
export class ShippingReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** A shipping or handling cost; `type` is `fixed` or `percent`. */
export class ShippingCost extends Dto {
    static FIELDS = {
        amount: 'float',
        type: 'string',
    };

    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ type = this.declared('type');
}

/**
 * The charge for each item past the first; the other two keys read `null` while `enabled` is false, and `enabled`
 * true needs both.
 */
export class ShippingAdditionalRule extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        forEachAdditional: 'int',
        additionalCost: 'float',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ forEachAdditional = this.declared('forEachAdditional');
    /** @type {number | null} */ additionalCost = this.declared('additionalCost');
}

/**
 * One rate, the same fourteen keys on a listing row, the row read and every write's answer, whatever the method.
 * `method` is `flat_rate`, `free_shipping`, `ship_by_price`, `ship_by_quantity`, `ship_by_weight`,
 * `ship_by_variation` or `shipping_variant`. A flat rate carries `shippingCost` and `handlingCost`, the `ship_by_*`
 * methods carry them per row in `conditions`, and a key the method does not use reads `null` or an empty list.
 * `weightUnit` is the store's, `null` unless the method is `ship_by_weight`. A `conditions` row stays a mapping: its
 * shape depends on the method.
 */
export class ShippingRate extends Dto {
    static ENVELOPE_KEY = 'shipping_rate';

    static FIELDS = {
        id: 'int',
        name: 'string',
        method: 'string',
        calculateForEntireOrder: 'boolean',
        priceEnteredWithTax: 'boolean',
        shippingCost: ShippingCost,
        handlingCost: ShippingCost,
        weightUnit: 'string',
        conditions: dtoList('any'),
        additionalRule: ShippingAdditionalRule,
        shippingRules: dtoList(ShippingReference),
        transactionNo: 'string',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ method = this.declared('method');
    /** @type {boolean | null} */ calculateForEntireOrder = this.declared('calculateForEntireOrder');
    /** @type {boolean | null} */ priceEnteredWithTax = this.declared('priceEnteredWithTax');
    /** @type {ShippingCost | null} */ shippingCost = this.declared('shippingCost');
    /** @type {ShippingCost | null} */ handlingCost = this.declared('handlingCost');
    /** @type {string | null} */ weightUnit = this.declared('weightUnit');
    /** @type {Array<any> | null} */ conditions = this.declared('conditions');
    /** @type {ShippingAdditionalRule | null} */ additionalRule = this.declared('additionalRule');
    /** @type {Array<ShippingReference | null> | null} */ shippingRules = this.declared('shippingRules');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/**
 * The writable fields, wrapped in `shipping_rate`, for the create, the `PUT` replace and the `PATCH`. `name` and
 * `method` are required on a create; a flat rate also needs `shippingCost` and the `ship_by_*` methods need
 * `conditions`. `PUT` needs every field of the rate, `handlingCost` and `additionalRule` as `null` when unused.
 * `shippingRuleId` attaches the new rate to a rule that has none. A `null` field is not sent: to clear one, pass a
 * mapping.
 */
export class ShippingRateInput extends Dto {
    static ENVELOPE_KEY = 'shipping_rate';

    static FIELDS = {
        name: 'string',
        method: 'string',
        calculateForEntireOrder: 'boolean',
        priceEnteredWithTax: 'boolean',
        shippingCost: ShippingCost,
        handlingCost: ShippingCost,
        conditions: dtoList('any'),
        additionalRule: ShippingAdditionalRule,
        shippingRuleId: 'int',
        transactionNo: 'string',
        suggestName: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ method = this.declared('method');
    /** @type {boolean | null} */ calculateForEntireOrder = this.declared('calculateForEntireOrder');
    /** @type {boolean | null} */ priceEnteredWithTax = this.declared('priceEnteredWithTax');
    /** @type {ShippingCost | null} */ shippingCost = this.declared('shippingCost');
    /** @type {ShippingCost | null} */ handlingCost = this.declared('handlingCost');
    /** @type {Array<any> | null} */ conditions = this.declared('conditions');
    /** @type {ShippingAdditionalRule | null} */ additionalRule = this.declared('additionalRule');
    /** @type {number | null} */ shippingRuleId = this.declared('shippingRuleId');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ suggestName = this.declared('suggestName');
}

/** The five-key `pagination` block; `limit` is the size the store applied. */
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

/** One page of the listing, newest first. */
export class ShippingRateListing extends Dto {
    static FIELDS = {
        shippingRates: dtoList(ShippingRate),
        pagination: Pagination,
    };

    /** @type {Array<ShippingRate | null> | null} */ shippingRates = this.declared('shippingRates');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class ShippingRateCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

sealDtoSchema(
    ShippingReference,
    ShippingCost,
    ShippingAdditionalRule,
    ShippingRate,
    ShippingRateInput,
    Pagination,
    ShippingRateListing,
    ShippingRateCount,
);
