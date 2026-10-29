import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One country: a listing row, and the row path's body. */
export class Country extends Dto {
    static ENVELOPE_KEY = 'country';

    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
        stateCount: 'int',
        active: 'boolean',
        default: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {number | null} */ stateCount = this.declared('stateCount');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
}

/** The short parent country a state listing and a state read carry beside the state. */
export class CountryReference extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
}

/** One state: a listing row, and the state path's body with its parent `country` beside it. */
export class CountryState extends Dto {
    static ENVELOPE_KEY = 'state';

    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
        active: 'boolean',
        default: 'boolean',
        country: CountryReference,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {CountryReference | null} */ country = this.declared('country');
}

/** The five-key `pagination` block of both listings. */
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

/** One page of the country listing: the rows, and the block that says where they sit. */
export class CountryPage extends Dto {
    static FIELDS = {
        countries: dtoList(Country),
        pagination: Pagination,
    };

    /** @type {Array<Country | null> | null} */ countries = this.declared('countries');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** One page of a country's states, beside the short parent country. */
export class CountryStatePage extends Dto {
    static FIELDS = {
        country: CountryReference,
        states: dtoList(CountryState),
        pagination: Pagination,
    };

    /** @type {CountryReference | null} */ country = this.declared('country');
    /** @type {Array<CountryState | null> | null} */ states = this.declared('states');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(Country, CountryReference, CountryState, Pagination, CountryPage, CountryStatePage);
