import {Dto, dtoList, dtoOneOf, isDtoMapping, sealDtoSchema} from '../../dto.js';

/** A lookup the API sends as an object rather than a bare id; an address `state` can be `{}`. */
export class Reference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        code: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ code = this.declared('code');
}

/** One entry of a customer's `addresses`. */
export class Address extends Dto {
    static FIELDS = {
        id: 'int',
        type: 'string',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        companyName: 'string',
        addressLine1: 'string',
        addressLine2: 'string',
        country: Reference,
        state: Reference,
        city: 'string',
        postCode: 'string',
        mobile: 'string',
        phone: 'string',
        fax: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {Reference | null} */ country = this.declared('country');
    /** @type {Reference | null} */ state = this.declared('state');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ fax = this.declared('fax');
}

/** One entry of a customer's `customProperties`; sending the list replaces it, and `id` tracks the text pair. */
export class CustomProperty extends Dto {
    static FIELDS = {
        id: 'int',
        label: 'string',
        description: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ description = this.declared('description');
}

/** One customer; a listing sends fewer fields than a detail fetch, and an omitted field reads `null`. */
export class Customer extends Dto {
    static ENVELOPE_KEY = 'customer';

    static FIELDS = {
        customerId: 'int',
        internalId: 'int',
        uuid: 'string',
        firstName: 'string',
        lastName: 'string',
        name: 'string',
        email: 'string',
        status: 'string',
        gender: 'string',
        companyName: 'string',
        storeCredit: 'float',
        customerGroups: dtoList(Reference),
        shippingProfile: 'any',
        addresses: dtoList(Address),
        createdAt: 'string',
        updatedAt: 'string',

        abn: 'string',
        abnBranch: 'string',
        accountHold: 'boolean',
        // Address ids, not addresses: each matches an `id` in `addresses`.
        activeBillingAddress: 'int',
        activeShippingAddress: 'int',
        allowCreditLimit: 'boolean',
        backgroundImage: 'string',
        baseUrl: 'string',
        countReferralCodeUsed: 'int',
        creditLimit: 'float',
        customProperties: dtoList(CustomProperty),
        customerPasswordExpired: 'boolean',
        defaultTaxCode: 'string',
        emailVerified: 'boolean',
        hidePrice: 'boolean',
        howDoYouKnow: 'string',
        isInTrash: 'boolean',
        newsletters: dtoList('any'),
        note: 'string',
        paymentTerm: 'any',
        profilePicture: 'any',
        referralCode: 'any',
        smsSubscribed: 'boolean',
        source: 'string',
        timezone: 'string',
        transactionNumber: 'string',
        usedReferralCode: 'any',
        version: 'int',
    };

    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ gender = this.declared('gender');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {number | null} */ storeCredit = this.declared('storeCredit');
    /** @type {Array<Reference | null> | null} */ customerGroups = this.declared('customerGroups');
    /** @type {unknown} */ shippingProfile = this.declared('shippingProfile');
    /** @type {Array<Address | null> | null} */ addresses = this.declared('addresses');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
    /** @type {string | null} */ abn = this.declared('abn');
    /** @type {string | null} */ abnBranch = this.declared('abnBranch');
    /** @type {boolean | null} */ accountHold = this.declared('accountHold');
    /** @type {number | null} */ activeBillingAddress = this.declared('activeBillingAddress');
    /** @type {number | null} */ activeShippingAddress = this.declared('activeShippingAddress');
    /** @type {boolean | null} */ allowCreditLimit = this.declared('allowCreditLimit');
    /** @type {string | null} */ backgroundImage = this.declared('backgroundImage');
    /** @type {string | null} */ baseUrl = this.declared('baseUrl');
    /** @type {number | null} */ countReferralCodeUsed = this.declared('countReferralCodeUsed');
    /** @type {number | null} */ creditLimit = this.declared('creditLimit');
    /** @type {Array<CustomProperty | null> | null} */ customProperties = this.declared('customProperties');
    /** @type {boolean | null} */ customerPasswordExpired = this.declared('customerPasswordExpired');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {boolean | null} */ emailVerified = this.declared('emailVerified');
    /** @type {boolean | null} */ hidePrice = this.declared('hidePrice');
    /** @type {string | null} */ howDoYouKnow = this.declared('howDoYouKnow');
    /** @type {boolean | null} */ isInTrash = this.declared('isInTrash');
    /** @type {Array<unknown> | null} */ newsletters = this.declared('newsletters');
    /** @type {string | null} */ note = this.declared('note');
    /** @type {unknown} */ paymentTerm = this.declared('paymentTerm');
    /** @type {unknown} */ profilePicture = this.declared('profilePicture');
    /** @type {unknown} */ referralCode = this.declared('referralCode');
    /** @type {boolean | null} */ smsSubscribed = this.declared('smsSubscribed');
    /** @type {string | null} */ source = this.declared('source');
    /** @type {string | null} */ timezone = this.declared('timezone');
    /** @type {string | null} */ transactionNumber = this.declared('transactionNumber');
    /** @type {unknown} */ usedReferralCode = this.declared('usedReferralCode');
    /** @type {number | null} */ version = this.declared('version');
}

/** The writable form of {@link Customer}; `storeCredit` is left out because an update lands no adjustment for it. */
export class CustomerInput extends Dto {
    static ENVELOPE_KEY = 'customer';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        emailVerified: 'boolean',
        password: 'string',
        oldPassword: 'string',
        status: 'string',
        company: 'boolean',
        companyName: 'string',
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        state: dtoOneOf('int', 'string'),
        country: dtoOneOf('int', 'string'),
        postCode: 'string',
        addresses: dtoList(Address),
        customProperties: dtoList(CustomProperty),
        transactionNo: 'string',
    };

    /** @type {string | null} */ firstName = this.declared('firstName');
    /** @type {string | null} */ lastName = this.declared('lastName');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {boolean | null} */ emailVerified = this.declared('emailVerified');
    /** @type {string | null} */ password = this.declared('password');
    /** @type {string | null} */ oldPassword = this.declared('oldPassword');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {boolean | null} */ company = this.declared('company');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {number | string | null} */ state = this.declared('state');
    /** @type {number | string | null} */ country = this.declared('country');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {Array<Address | null> | null} */ addresses = this.declared('addresses');
    /** @type {Array<CustomProperty | null> | null} */ customProperties = this.declared('customProperties');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One movement of a customer's store credit. */
export class StoreCreditAdjustment extends Dto {
    static ENVELOPE_KEY = 'store_credit_adjustment';

    static FIELDS = {
        id: 'int',
        customerId: 'int',
        internalId: 'int',
        action: 'string',
        amount: 'float',
        note: 'string',
        createdAt: 'string',
        createdBy: 'any',

        balanceBefore: 'float',
        balanceAfter: 'float',
        storeCredit: 'float',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ customerId = this.declared('customerId');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ action = this.declared('action');
    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ note = this.declared('note');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {unknown} */ createdBy = this.declared('createdBy');
    /** @type {number | null} */ balanceBefore = this.declared('balanceBefore');
    /** @type {number | null} */ balanceAfter = this.declared('balanceAfter');
    /** @type {number | null} */ storeCredit = this.declared('storeCredit');
}

/** The writable form of {@link StoreCreditAdjustment}. */
export class StoreCreditAdjustmentInput extends Dto {
    static FIELDS = {
        action: 'string',
        amount: 'float',
        note: 'string',
    };

    /** @type {string | null} */ action = this.declared('action');
    /** @type {number | null} */ amount = this.declared('amount');
    /** @type {string | null} */ note = this.declared('note');
}

/** The `pagination` block of a listing; `nextPage` and `previousPage` are absolute URLs or null. */
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

/**
 * One page of a listing; rows on `items`, and a row that is not a record reads `null`.
 * @template [TItem=any]
 */
export class Page extends Dto {
    /** The type each record reads as, set by {@link Page.of}. @type {any} */
    static ITEM_TYPE = null;

    static FIELDS = {
        items: dtoList('any'),
        pagination: Pagination,
    };

    /** @type {Array<TItem | null> | null} */ items = this.declared('items');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');

    /**
     * A `Page` reading its rows as `itemType`: a real subclass, so `instanceof Page` still holds.
     * @template {typeof Dto} T
     * @param {T} itemType a `Dto` subclass
     * @returns {{new (values?: Record<string, unknown>): Page<InstanceType<T>>, fromMap(body: unknown): Page<InstanceType<T>>}}
     */
    static of(itemType) {
        const built = class extends this {
            static ITEM_TYPE = itemType;
        };
        Object.defineProperty(built, 'name', {value: `Page<${itemType?.name ?? 'unknown'}>`, configurable: true});
        // Sealed here, or the caller could rewrite `ITEM_TYPE` afterwards.
        sealDtoSchema(built);
        return /** @type {any} */ (built);
    }

    /**
     * Read a listing envelope, finding the rows by shape; no list, or more than one, leaves `items` null.
     * @param {unknown} body @returns {any}
     */
    static fromMap(body) {
        if (!isDtoMapping(body)) return super.fromMap(body);

        const lists = Object.values(/** @type {Record<string, unknown>} */ (body)).filter((value) =>
            Array.isArray(value),
        );
        const records = lists.length === 1 ? /** @type {unknown[]} */ (lists[0]) : null;
        // `schema()` is a frozen copy, so a rewritten `ITEM_TYPE` static cannot change this.
        const itemType = this.schema().itemType;
        const items =
            records === null || itemType === null
                ? records
                : records.map((record) => (isDtoMapping(record) ? itemType.fromMap(record) : null));

        const block = /** @type {Record<string, unknown>} */ (body).pagination;
        return new this({items, pagination: isDtoMapping(block) ? Pagination.fromMap(block) : null});
    }
}

sealDtoSchema(
    Reference,
    Address,
    CustomProperty,
    Customer,
    CustomerInput,
    StoreCreditAdjustment,
    StoreCreditAdjustmentInput,
    Pagination,
    Page,
);
