import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/**
 * The state a city row carries. `id` is the one a country's `states` listing answers; `default` follows the
 * `administration` section's `default_state`.
 */
export class CityState extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
        active: 'boolean',
        default: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
}

/** The country a city row carries; `id` is the one the `countries` listing answers. */
export class CityCountry extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
}

/** One listing row. */
export class City extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        postCode: 'string',
        state: CityState,
        country: CityCountry,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {CityState | null} */ state = this.declared('state');
    /** @type {CityCountry | null} */ country = this.declared('country');
}

/**
 * The five-key `pagination` block: `total` is the number of rows that matched, `limit` the page size applied and
 * `offset` the start.
 */
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

/** One page of the city listing: the rows, and the block that says where they sit. */
export class CityPage extends Dto {
    static FIELDS = {
        cities: dtoList(City),
        pagination: Pagination,
    };

    /** @type {Array<City | null> | null} */ cities = this.declared('cities');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(CityState, CityCountry, City, Pagination, CityPage);
