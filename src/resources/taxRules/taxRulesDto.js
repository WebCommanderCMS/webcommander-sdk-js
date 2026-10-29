import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The ten-key `pagination` block of this listing; `limit` is the size asked for, capped at 100. */
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

/** The tax code a rule points at, as the rule nests it; no write on the rule resource sets it. */
export class TaxRuleCode extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        isDefault: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
}

/** One tax zone a rule points at, as the rule nests it; no write on the rule resource sets these. */
export class TaxRuleZone extends Dto {
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

/** One tax rule; `code`, `zones`, `decimalPoint` and `roundingType` are read-only. */
export class TaxRule extends Dto {
    static ENVELOPE_KEY = 'tax_rule';

    static FIELDS = {
        id: 'int',
        name: 'string',
        code: TaxRuleCode,
        description: 'string',
        default: 'boolean',
        roundingType: 'string',
        decimalPoint: 'int',
        zones: dtoList(TaxRuleZone),
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {TaxRuleCode | null} */ code = this.declared('code');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ roundingType = this.declared('roundingType');
    /** @type {number | null} */ decimalPoint = this.declared('decimalPoint');
    /** @type {Array<TaxRuleZone | null> | null} */ zones = this.declared('zones');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The writable form of {@link TaxRule}: two of its ten fields. The update merges; every other key is discarded. */
export class TaxRuleInput extends Dto {
    static ENVELOPE_KEY = 'tax_rule';

    static FIELDS = {
        name: 'string',
        description: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
}

/** One page of the tax rule listing. */
export class TaxRulePage extends Dto {
    static FIELDS = {
        taxRules: dtoList(TaxRule),
        pagination: Pagination,
    };

    /** @type {Array<TaxRule | null> | null} */ taxRules = this.declared('taxRules');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(Pagination, TaxRuleCode, TaxRuleZone, TaxRule, TaxRuleInput, TaxRulePage);
