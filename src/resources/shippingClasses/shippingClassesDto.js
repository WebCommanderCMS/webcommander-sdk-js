import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One shipping class, a listing row or a row path's record; `fieldMetadata` is `'any'` as its entries vary. */
export class ShippingClass extends Dto {
    static ENVELOPE_KEY = 'shipping_class';

    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        isDefault: 'boolean',
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The body both writes take: `name`, required, unique and at most 50 characters, and `description`, at most 100. */
export class ShippingClassInput extends Dto {
    static ENVELOPE_KEY = 'shipping_class';

    static FIELDS = {
        name: 'string',
        description: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
}

/** The listing's ten-key `pagination` block; `limit` is the size the store applied. */
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

/** One page of the listing, with the `field_metadata` block when it was asked for. */
export class ShippingClassPage extends Dto {
    static FIELDS = {
        shippingClasses: dtoList(ShippingClass),
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<ShippingClass | null> | null} */ shippingClasses = this.declared('shippingClasses');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's `{"shipping_classes": {"count": N}}`. */
export class ShippingClassCount extends Dto {
    static ENVELOPE_KEY = 'shipping_classes';

    static FIELDS = {
        count: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
}

sealDtoSchema(ShippingClass, ShippingClassInput, Pagination, ShippingClassPage, ShippingClassCount);
