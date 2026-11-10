import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/**
 * One gift card. `code` is what an order preview's `gift-card` call takes; a card can be applied only while `isActive`
 * and `isPaid`, with a `balance` above zero, before its `availableTo` date and with `email` equal to the previewed
 * customer's email.
 */
export class GiftCard extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        balance: 'float',
        initialAmount: 'float',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        message: 'string',
        isActive: 'boolean',
        isPaid: 'boolean',
        availableTo: 'string',
        externalReference: 'string',
        productName: 'string',
        createdOn: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {number | null} */ balance = this.declared('balance');
    /** @type {number | null} */ initialAmount = this.declared('initialAmount');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ message = this.declared('message');
    /** @type {boolean | null} */ isActive = this.declared('isActive');
    /** @type {boolean | null} */ isPaid = this.declared('isPaid');
    /** @type {string | null} */ availableTo = this.declared('availableTo');
    /** @type {string | null} */ externalReference = this.declared('externalReference');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
}

/** The listing's ten-key `pagination` block; `limit` is the size the store applied, at most 20. */
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

/** One page of the listing, newest first. */
export class GiftCardPage extends Dto {
    static FIELDS = {
        giftCards: dtoList(GiftCard),
        pagination: Pagination,
    };

    /** @type {Array<GiftCard | null> | null} */ giftCards = this.declared('giftCards');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(GiftCard, Pagination, GiftCardPage);
