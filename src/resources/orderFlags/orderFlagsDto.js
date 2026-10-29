import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One order flag, a listing row or a row path's `{"order_flag": {...}}`; `type` always reads `order`. */
export class OrderFlag extends Dto {
    static ENVELOPE_KEY = 'order_flag';

    static FIELDS = {
        id: 'int',
        name: 'string',
        color: 'string',
        description: 'string',
        type: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ color = this.declared('color');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ type = this.declared('type');
}

/**
 * The writable form of {@link OrderFlag}: `name` and a hex `color` are required. The update is a replace, so an
 * unset `description` is cleared.
 */
export class OrderFlagInput extends Dto {
    static ENVELOPE_KEY = 'order_flag';

    static FIELDS = {
        name: 'string',
        color: 'string',
        description: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ color = this.declared('color');
    /** @type {string | null} */ description = this.declared('description');
}

/** The five-key `pagination` block of this listing; `limit` is the size applied. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        hasNext: 'boolean',
        hasPrevious: 'boolean',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
}

/** One page of the listing, with the rows under `order_flags` rather than `items`. */
export class OrderFlagPage extends Dto {
    static FIELDS = {
        orderFlags: dtoList(OrderFlag),
        pagination: Pagination,
    };

    /** @type {Array<OrderFlag | null> | null} */ orderFlags = this.declared('orderFlags');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(OrderFlag, OrderFlagInput, Pagination, OrderFlagPage);
