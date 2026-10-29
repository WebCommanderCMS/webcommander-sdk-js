import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One shipping method, a listing row or a row path's record. */
export class ShippingMethod extends Dto {
    static ENVELOPE_KEY = 'shipping_method';

    static FIELDS = {
        id: 'int',
        name: 'string',
        isDefault: 'boolean',
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The body both writes wrap in `shipping_method`: `name`, required, unique and at most 100 characters. */
export class ShippingMethodInput extends Dto {
    static ENVELOPE_KEY = 'shipping_method';

    static FIELDS = {
        name: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
}

/** The ten-key `pagination` block of the listing; `limit` is the size the store applied. */
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

/** One page of the listing, with the rows under `shipping_methods` rather than `items`. */
export class ShippingMethodPage extends Dto {
    static FIELDS = {
        shippingMethods: dtoList(ShippingMethod),
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<ShippingMethod | null> | null} */ shippingMethods = this.declared('shippingMethods');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's `{"shipping_methods": {"count": N}}`. */
export class ShippingMethodCount extends Dto {
    static ENVELOPE_KEY = 'shipping_methods';

    static FIELDS = {
        count: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
}

sealDtoSchema(ShippingMethod, ShippingMethodInput, Pagination, ShippingMethodPage, ShippingMethodCount);
