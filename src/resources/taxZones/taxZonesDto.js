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

/** A country as a tax zone nests it; a zone write sends this record, never a bare id. */
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

/** A state as a tax zone nests it; a zone write sends this record too. */
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

/**
 * One tax zone; `postCode` reads as the flat list of strings a write sends, and a `systemGenerated` row is the
 * store's own.
 */
export class TaxZone extends Dto {
    static ENVELOPE_KEY = 'tax_zone';

    static FIELDS = {
        id: 'int',
        name: 'string',
        systemGenerated: 'boolean',
        default: 'boolean',
        useRadius: 'boolean',
        radius: 'float',
        startLocation: 'string',
        countries: dtoList(TaxCountry),
        states: dtoList(TaxState),
        postCode: dtoList('string'),
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ systemGenerated = this.declared('systemGenerated');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {boolean | null} */ useRadius = this.declared('useRadius');
    /** @type {number | null} */ radius = this.declared('radius');
    /** @type {string | null} */ startLocation = this.declared('startLocation');
    /** @type {Array<TaxCountry | null> | null} */ countries = this.declared('countries');
    /** @type {Array<TaxState | null> | null} */ states = this.declared('states');
    /** @type {Array<string | null> | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The writable form of {@link TaxZone}. */
export class TaxZoneInput extends Dto {
    static ENVELOPE_KEY = 'tax_zone';

    static FIELDS = {
        name: 'string',
        countries: dtoList(TaxCountry),
        states: dtoList(TaxState),
        postCode: dtoList('string'),
        radius: 'float',
        startLocation: 'string',
        useRadius: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {Array<TaxCountry | null> | null} */ countries = this.declared('countries');
    /** @type {Array<TaxState | null> | null} */ states = this.declared('states');
    /** @type {Array<string | null> | null} */ postCode = this.declared('postCode');
    /** @type {number | null} */ radius = this.declared('radius');
    /** @type {string | null} */ startLocation = this.declared('startLocation');
    /** @type {boolean | null} */ useRadius = this.declared('useRadius');
}

/** One page of the tax zone listing. */
export class TaxZonePage extends Dto {
    static FIELDS = {
        taxZones: dtoList(TaxZone),
        pagination: Pagination,
    };

    /** @type {Array<TaxZone | null> | null} */ taxZones = this.declared('taxZones');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(Pagination, TaxCountry, TaxState, TaxZone, TaxZoneInput, TaxZonePage);
