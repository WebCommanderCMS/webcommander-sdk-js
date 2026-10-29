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

/** One tax code; `default` is read-only and not exclusive, marking a store-built code. */
export class TaxCode extends Dto {
    static ENVELOPE_KEY = 'tax_code';

    static FIELDS = {
        id: 'int',
        name: 'string',
        label: 'string',
        description: 'string',
        rate: 'float',
        resolverType: 'string',
        priority: 'int',
        default: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {number | null} */ rate = this.declared('rate');
    /** @type {string | null} */ resolverType = this.declared('resolverType');
    /** @type {number | null} */ priority = this.declared('priority');
    /** @type {boolean | null} */ default = this.declared('default');
}

/**
 * The writable form of {@link TaxCode}. The update merges, except that an unset `priority` resets to `0` and
 * `resolverType` to `flat`.
 */
export class TaxCodeInput extends Dto {
    static ENVELOPE_KEY = 'tax_code';

    static FIELDS = {
        name: 'string',
        label: 'string',
        description: 'string',
        rate: 'float',
        resolverType: 'string',
        priority: 'int',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {number | null} */ rate = this.declared('rate');
    /** @type {string | null} */ resolverType = this.declared('resolverType');
    /** @type {number | null} */ priority = this.declared('priority');
}

/** One page of the tax code listing. */
export class TaxCodePage extends Dto {
    static FIELDS = {
        taxCodes: dtoList(TaxCode),
        pagination: Pagination,
    };

    /** @type {Array<TaxCode | null> | null} */ taxCodes = this.declared('taxCodes');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(Pagination, TaxCode, TaxCodeInput, TaxCodePage);
