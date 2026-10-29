import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One listing row: a number, how many records carry it, and its read path. */
export class TransactionListEntry extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        totalRecords: 'int',
        url: 'string',
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {number | null} */ totalRecords = this.declared('totalRecords');
    /** @type {string | null} */ url = this.declared('url');
}

/**
 * One `by_type` row of a number's read: `count` is `created` plus `updated`, and `trashed` counts those of them now
 * in the trash. `items_url` is sent on every row, `count` `0` included.
 */
export class TransactionTypeCount extends Dto {
    static FIELDS = {
        type: 'string',
        count: 'int',
        created: 'int',
        updated: 'int',
        trashed: 'int',
        itemsUrl: 'string',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ count = this.declared('count');
    /** @type {number | null} */ created = this.declared('created');
    /** @type {number | null} */ updated = this.declared('updated');
    /** @type {number | null} */ trashed = this.declared('trashed');
    /** @type {string | null} */ itemsUrl = this.declared('itemsUrl');
}

/** One number's read: a bare body, its 15 `by_type` rows always in the same order. */
export class Transaction extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        totalRecords: 'int',
        byType: dtoList(TransactionTypeCount),
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {number | null} */ totalRecords = this.declared('totalRecords');
    /** @type {Array<TransactionTypeCount | null> | null} */ byType = this.declared('byType');
}

/**
 * One record under a number as `detail=slim` sends it: `type`, `id`, `stamp` (`created` or `updated`), `trashed`
 * and the fields of its `type`. `category` sends `name` and `url`; `product` and `product_variation` add `sku`; `product_review` adds `rating`; `customer` sends `email`,
 * `first_name`, `last_name` and `url`; `order` sends `order_no`, `grand_total`, `status` and a `url` ending in
 * `order_no`; `currency` adds `code` and `symbol`; `custom_tax_profile` adds `code`; `custom_tax_rule` sends `name`
 * alone; `custom_tax_rule_zone` sends `country_code`, `state_name`, `postcode`, `rate` and `priority`;
 * `shipping_profile` adds `description`; `shipping_rate` adds `policy_type`. A field the type does not send reads
 * `null`. A `detail=full` row is the record's own read body, which stays in `response.map`.
 */
export class TransactionItem extends Dto {
    static FIELDS = {
        type: 'string',
        id: 'int',
        stamp: 'string',
        trashed: 'boolean',
        name: 'string',
        sku: 'string',
        rating: 'float',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        orderNo: 'int',
        grandTotal: 'float',
        status: 'string',
        code: 'string',
        symbol: 'string',
        countryCode: 'string',
        stateName: 'string',
        postcode: 'string',
        rate: 'float',
        priority: 'int',
        description: 'string',
        policyType: 'string',
        url: 'string',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ stamp = this.declared('stamp');
    /** @type {boolean | null} */ trashed = this.declared('trashed');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ rating = this.declared('rating');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {number | null} */ grandTotal = this.declared('grandTotal');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ symbol = this.declared('symbol');
    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ stateName = this.declared('stateName');
    /** @type {string | null} */ postcode = this.declared('postcode');
    /** @type {number | null} */ rate = this.declared('rate');
    /** @type {number | null} */ priority = this.declared('priority');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ policyType = this.declared('policyType');
    /** @type {string | null} */ url = this.declared('url');
}

/** The five-key `pagination` block of both listings; there is no next-page link, so step `offset`. */
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

/** One page of the numbers; a `transaction_no` filter answers `pagination` too. */
export class TransactionPage extends Dto {
    static FIELDS = {
        transactions: dtoList(TransactionListEntry),
        pagination: Pagination,
    };

    /** @type {Array<TransactionListEntry | null> | null} */ transactions = this.declared('transactions');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/**
 * One page of the records carrying a number, beside the number; each item names its own `type`. A number or a type
 * with no records answers `items` empty and `pagination.total` `0`.
 */
export class TransactionItemPage extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        items: dtoList(TransactionItem),
        pagination: Pagination,
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {Array<TransactionItem | null> | null} */ items = this.declared('items');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    TransactionListEntry,
    TransactionTypeCount,
    Transaction,
    TransactionItem,
    Pagination,
    TransactionPage,
    TransactionItemPage,
);
