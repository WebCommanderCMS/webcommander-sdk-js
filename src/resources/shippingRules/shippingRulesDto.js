import {Dto, dtoList, dtoOneOf, sealDtoSchema} from '../../dto.js';

/**
 * An `{id, name}` pair: the rule's class, rate, zones and profiles. A write names a class, a rate or a zone by its id,
 * bare or as `{"id": ...}`; `name` is read-only.
 */
export class ShippingReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/**
 * One rule, the same ten keys on a listing row, the row read and every write's answer. `shippingClass` and
 * `shippingRate` are `null` when unset, `zones` and `profiles` empty lists.
 */
export class ShippingRule extends Dto {
    static ENVELOPE_KEY = 'shipping_rule';

    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        shippingClass: ShippingReference,
        shippingRate: ShippingReference,
        zones: dtoList(ShippingReference),
        profiles: dtoList(ShippingReference),
        transactionNo: 'string',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {ShippingReference | null} */ shippingClass = this.declared('shippingClass');
    /** @type {ShippingReference | null} */ shippingRate = this.declared('shippingRate');
    /** @type {Array<ShippingReference | null> | null} */ zones = this.declared('zones');
    /** @type {Array<ShippingReference | null> | null} */ profiles = this.declared('profiles');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/**
 * The writable fields, wrapped in `shipping_rule`, for the create, the `PUT` replace and the `PATCH`. `zones` is the
 * whole list of zones, each once; `profileId` adds the new rule to a profile on a create. `PUT` needs `name`,
 * `description`, `shippingClass`, `shippingRate` and `zones`. A `null` field is not sent: to clear a class or a rate,
 * pass a mapping holding `null`.
 */
export class ShippingRuleInput extends Dto {
    static ENVELOPE_KEY = 'shipping_rule';

    static FIELDS = {
        name: 'string',
        description: 'string',
        shippingClass: dtoOneOf('int', ShippingReference),
        shippingRate: dtoOneOf('int', ShippingReference),
        zones: dtoList(dtoOneOf('int', ShippingReference)),
        profileId: 'int',
        transactionNo: 'string',
        suggestName: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {number | ShippingReference | null} */ shippingClass = this.declared('shippingClass');
    /** @type {number | ShippingReference | null} */ shippingRate = this.declared('shippingRate');
    /** @type {Array<number | ShippingReference | null> | null} */ zones = this.declared('zones');
    /** @type {number | null} */ profileId = this.declared('profileId');
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
export class ShippingRuleListing extends Dto {
    static FIELDS = {
        shippingRules: dtoList(ShippingRule),
        pagination: Pagination,
    };

    /** @type {Array<ShippingRule | null> | null} */ shippingRules = this.declared('shippingRules');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class ShippingRuleCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

sealDtoSchema(ShippingReference, ShippingRule, ShippingRuleInput, Pagination, ShippingRuleListing, ShippingRuleCount);
