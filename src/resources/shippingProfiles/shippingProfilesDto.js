import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/**
 * An `{id, name}` pair: a rule's rate, and a zone named in the wizard, where a write sends `{"id": ...}` for an
 * existing zone or `{"name": ...}` to create one.
 */
export class ShippingReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** A rule on a profile; `shippingRate` is `null` on a rule that has no rate. */
export class ShippingProfileRule extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        shippingRate: ShippingReference,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {ShippingReference | null} */ shippingRate = this.declared('shippingRate');
}

/**
 * One profile, the same ten keys on a listing row, the row read and every write's answer. `rulePreference` reads
 * `product_assigned_rule`, `lowest_shipping_cost_rule` or `highest_shipping_cost_rule`; exactly one profile has
 * `default` true.
 */
export class ShippingProfile extends Dto {
    static ENVELOPE_KEY = 'shipping_profile';

    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        rulePreference: 'string',
        default: 'boolean',
        rulesCount: 'int',
        shippingRules: dtoList(ShippingProfileRule),
        transactionNo: 'string',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ rulePreference = this.declared('rulePreference');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {number | null} */ rulesCount = this.declared('rulesCount');
    /** @type {Array<ShippingProfileRule | null> | null} */ shippingRules = this.declared('shippingRules');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/**
 * The writable fields, wrapped in `shipping_profile`, for the create, the `PUT` replace and the `PATCH`.
 * `shippingRules` is the whole list of rule ids, each rule once; `PUT` needs `name`, `description`, `rulePreference`
 * and `shippingRules`. `default` takes only `true` or `false`. A `null` field is not sent: to clear one, pass a
 * mapping.
 */
export class ShippingProfileInput extends Dto {
    static ENVELOPE_KEY = 'shipping_profile';

    static FIELDS = {
        name: 'string',
        description: 'string',
        rulePreference: 'string',
        default: 'boolean',
        shippingRules: dtoList('int'),
        transactionNo: 'string',
        suggestName: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ rulePreference = this.declared('rulePreference');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {Array<number | null> | null} */ shippingRules = this.declared('shippingRules');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ suggestName = this.declared('suggestName');
}

/** The rate a wizard rule creates; the fields of a rate write, `name` and `method` required. */
export class ShippingProfileWizardRate extends Dto {
    static FIELDS = {
        name: 'string',
        method: 'string',
        calculateForEntireOrder: 'boolean',
        priceEnteredWithTax: 'boolean',
        shippingCost: 'any',
        handlingCost: 'any',
        conditions: dtoList('any'),
        additionalRule: 'any',
        transactionNo: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ method = this.declared('method');
    /** @type {boolean | null} */ calculateForEntireOrder = this.declared('calculateForEntireOrder');
    /** @type {boolean | null} */ priceEnteredWithTax = this.declared('priceEnteredWithTax');
    /** @type {any} */ shippingCost = this.declared('shippingCost');
    /** @type {any} */ handlingCost = this.declared('handlingCost');
    /** @type {Array<any> | null} */ conditions = this.declared('conditions');
    /** @type {any} */ additionalRule = this.declared('additionalRule');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/**
 * A rule the wizard creates beside its rate: `name` is required, `shippingClass` is a class id, and `zones` name
 * existing zones by `{"id": ...}` or new ones by `{"name": ...}`.
 */
export class ShippingProfileWizardRule extends Dto {
    static FIELDS = {
        name: 'string',
        description: 'string',
        shippingClass: 'int',
        shippingRate: ShippingProfileWizardRate,
        zones: dtoList(ShippingReference),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {number | null} */ shippingClass = this.declared('shippingClass');
    /** @type {ShippingProfileWizardRate | null} */ shippingRate = this.declared('shippingRate');
    /** @type {Array<ShippingReference | null> | null} */ zones = this.declared('zones');
}

/**
 * The wizard's body, wrapped in `shipping_profile`: the profile fields and the rules, each with its rate, to create
 * under it.
 */
export class ShippingProfileWizardInput extends Dto {
    static ENVELOPE_KEY = 'shipping_profile';

    static FIELDS = {
        name: 'string',
        description: 'string',
        rulePreference: 'string',
        shippingRules: dtoList(ShippingProfileWizardRule),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ rulePreference = this.declared('rulePreference');
    /** @type {Array<ShippingProfileWizardRule | null> | null} */ shippingRules = this.declared('shippingRules');
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
export class ShippingProfileListing extends Dto {
    static FIELDS = {
        shippingProfiles: dtoList(ShippingProfile),
        pagination: Pagination,
    };

    /** @type {Array<ShippingProfile | null> | null} */ shippingProfiles = this.declared('shippingProfiles');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class ShippingProfileCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

sealDtoSchema(
    ShippingReference,
    ShippingProfileRule,
    ShippingProfile,
    ShippingProfileInput,
    ShippingProfileWizardRate,
    ShippingProfileWizardRule,
    ShippingProfileWizardInput,
    Pagination,
    ShippingProfileListing,
    ShippingProfileCount,
);
