import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The ten-key `pagination` block of this listing; `limit` is the size the store applied, capped at 100. */
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

/** A country as a country tax nests it; `null` on the rest-of-the-world row. */
export class TaxCountry extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        code: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
}

/** A state as a state rule nests it, on its `state`. */
export class TaxState extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        code: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
}

/** One entry of a country tax's `stateRules`, which only the row read and the update send. */
export class CountryTaxStateRule extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        state: TaxState,
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        postCode: 'string',
        taxRate: 'float',
        taxRule: 'string',
        effectiveTaxRate: 'float',
        isDefault: 'boolean',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        lastUpdatedBy: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {TaxState | null} */ state = this.declared('state');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {number | null} */ taxRate = this.declared('taxRate');
    /** @type {string | null} */ taxRule = this.declared('taxRule');
    /** @type {number | null} */ effectiveTaxRate = this.declared('effectiveTaxRate');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {unknown} */ lastUpdatedBy = this.declared('lastUpdatedBy');
}

/**
 * One country tax; the row read and the update add `stateRules` to the twelve keys a listing row and the create
 * answer carry. `taxMethod` reads lower case.
 */
export class CountryTax extends Dto {
    static ENVELOPE_KEY = 'country_tax';

    static FIELDS = {
        id: 'int',
        name: 'string',
        country: TaxCountry,
        taxCode: 'string',
        taxRate: 'float',
        taxMethod: 'string',
        isDefault: 'boolean',
        isRestOfWorld: 'boolean',
        stateRulesCount: 'int',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        lastUpdatedBy: 'any',
        stateRules: dtoList(CountryTaxStateRule),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {TaxCountry | null} */ country = this.declared('country');
    /** @type {string | null} */ taxCode = this.declared('taxCode');
    /** @type {number | null} */ taxRate = this.declared('taxRate');
    /** @type {string | null} */ taxMethod = this.declared('taxMethod');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {boolean | null} */ isRestOfWorld = this.declared('isRestOfWorld');
    /** @type {number | null} */ stateRulesCount = this.declared('stateRulesCount');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {unknown} */ lastUpdatedBy = this.declared('lastUpdatedBy');
    /** @type {Array<CountryTaxStateRule | null> | null} */ stateRules = this.declared('stateRules');
}

/**
 * The writable form of {@link CountryTax}; `countryCode` is the create's one requirement, and the update merges.
 * `transactionNo` is written beside the envelope, where the create files the row under it.
 */
export class CountryTaxInput extends Dto {
    static ENVELOPE_KEY = 'country_tax';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        countryCode: 'string',
        name: 'string',
        taxCode: 'string',
        taxRate: 'float',
        taxMethod: 'string',
        isDefault: 'boolean',
        transactionNo: 'string',
    };

    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ taxCode = this.declared('taxCode');
    /** @type {number | null} */ taxRate = this.declared('taxRate');
    /** @type {string | null} */ taxMethod = this.declared('taxMethod');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One `group_meta` entry: what the path is, whether it is writable and where. */
export class ResourceMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block only the listing sends. */
export class GroupMeta extends Dto {
    static FIELDS = {
        countryTax: ResourceMeta,
        stateRules: ResourceMeta,
    };

    /** @type {ResourceMeta | null} */ countryTax = this.declared('countryTax');
    /** @type {ResourceMeta | null} */ stateRules = this.declared('stateRules');
}

/** One page of the country tax listing: the rows, `groupMeta` and the paging block. */
export class CountryTaxPage extends Dto {
    static FIELDS = {
        countryTaxes: dtoList(CountryTax),
        groupMeta: GroupMeta,
        pagination: Pagination,
    };

    /** @type {Array<CountryTax | null> | null} */ countryTaxes = this.declared('countryTaxes');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    Pagination,
    TaxCountry,
    TaxState,
    CountryTaxStateRule,
    CountryTax,
    CountryTaxInput,
    ResourceMeta,
    GroupMeta,
    CountryTaxPage,
);
