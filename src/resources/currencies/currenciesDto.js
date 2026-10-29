import {Dto, dtoList, dtoOneOf, sealDtoSchema} from '../../dto.js';

/** The country a currency is filed under, as every row answers it. */
export class CurrencyCountry extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
}

/**
 * One currency: a listing row, the row path's body and every row write's answer. The base write answers only
 * `id`, `name`, `code` and `base` of it.
 */
export class Currency extends Dto {
    static ENVELOPE_KEY = 'currency';

    static FIELDS = {
        id: 'int',
        name: 'string',
        code: 'string',
        symbol: 'string',
        country: CurrencyCountry,
        conversionRate: 'float',
        rounding: 'string',
        precision: 'int',
        active: 'boolean',
        base: 'boolean',
        updatedAt: 'string',
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ symbol = this.declared('symbol');
    /** @type {CurrencyCountry | null} */ country = this.declared('country');
    /** @type {number | null} */ conversionRate = this.declared('conversionRate');
    /** @type {string | null} */ rounding = this.declared('rounding');
    /** @type {number | null} */ precision = this.declared('precision');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ base = this.declared('base');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/**
 * The writable fields, for the create, the `PUT` replace and the `PATCH`, sent bare. `country` takes a
 * country's id, code, name or `{"code": ...}`.
 */
export class CurrencyInput extends Dto {
    static FIELDS = {
        name: 'string',
        code: 'string',
        symbol: 'string',
        country: dtoOneOf('int', 'string', CurrencyCountry),
        conversionRate: 'float',
        rounding: 'string',
        precision: 'int',
        active: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ symbol = this.declared('symbol');
    /** @type {number | string | CurrencyCountry | null} */ country = this.declared('country');
    /** @type {number | null} */ conversionRate = this.declared('conversionRate');
    /** @type {string | null} */ rounding = this.declared('rounding');
    /** @type {number | null} */ precision = this.declared('precision');
    /** @type {boolean | null} */ active = this.declared('active');
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

/** One page of the listing: the rows under `currencies`, where they sit and any schema. */
export class CurrencyPage extends Dto {
    static FIELDS = {
        currencies: dtoList(Currency),
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<Currency | null> | null} */ currencies = this.declared('currencies');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class CurrencyCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

/** The row that held the base flag before a base write. */
export class CurrencyReference extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
}

/** The base write's body: the new base, and the row that held the flag, `null` when none moved. */
export class CurrencyBaseChange extends Dto {
    static FIELDS = {
        currency: Currency,
        previousBase: CurrencyReference,
    };

    /** @type {Currency | null} */ currency = this.declared('currency');
    /** @type {CurrencyReference | null} */ previousBase = this.declared('previousBase');
}

sealDtoSchema(
    CurrencyCountry,
    Currency,
    CurrencyInput,
    Pagination,
    CurrencyPage,
    CurrencyCount,
    CurrencyReference,
    CurrencyBaseChange,
);
