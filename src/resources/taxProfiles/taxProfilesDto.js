import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The ten-key `pagination` block of this listing; `limit` is the size asked for, capped at the page size. */
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

/** The tax code a nested rule points at. */
export class TaxProfileRuleCode extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        isDefault: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
}

/** One tax zone a nested rule points at. */
export class TaxProfileRuleZone extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        isSystemGenerated: 'boolean',
        isDefault: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isSystemGenerated = this.declared('isSystemGenerated');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
}

/** One tax rule as a profile nests it, the same ten keys a `/admin/tax_rules` read sends. */
export class TaxProfileRule extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        code: TaxProfileRuleCode,
        description: 'string',
        default: 'boolean',
        roundingType: 'string',
        decimalPoint: 'int',
        zones: dtoList(TaxProfileRuleZone),
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {TaxProfileRuleCode | null} */ code = this.declared('code');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ roundingType = this.declared('roundingType');
    /** @type {number | null} */ decimalPoint = this.declared('decimalPoint');
    /** @type {Array<TaxProfileRuleZone | null> | null} */ zones = this.declared('zones');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/**
 * One tax profile, the same seven keys on the listing row and on the row path; a new profile's `taxRules` is empty.
 * `default` is exclusive and `taxSettings`' `defaultTaxProfile` follows it.
 */
export class TaxProfile extends Dto {
    static ENVELOPE_KEY = 'tax_profile';

    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        default: 'boolean',
        taxRules: dtoList(TaxProfileRule),
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {Array<TaxProfileRule | null> | null} */ taxRules = this.declared('taxRules');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The writable form of {@link TaxProfile}; the update merges, and `default` is one-way: `false` leaves it on. */
export class TaxProfileInput extends Dto {
    static ENVELOPE_KEY = 'tax_profile';

    static FIELDS = {
        name: 'string',
        description: 'string',
        default: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ default = this.declared('default');
}

/** One page of the tax profile listing. */
export class TaxProfilePage extends Dto {
    static FIELDS = {
        taxProfiles: dtoList(TaxProfile),
        pagination: Pagination,
    };

    /** @type {Array<TaxProfile | null> | null} */ taxProfiles = this.declared('taxProfiles');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    Pagination,
    TaxProfileRuleCode,
    TaxProfileRuleZone,
    TaxProfileRule,
    TaxProfile,
    TaxProfileInput,
    TaxProfilePage,
);
