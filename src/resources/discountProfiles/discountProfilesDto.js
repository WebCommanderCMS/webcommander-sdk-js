import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The block an `amount` profile carries. */
export class AmountDetails extends Dto {
    static FIELDS = {
        type: 'string',
        applyTo: 'string',
        singleAmount: 'float',
        singleAmountType: 'string',
        minimumAmountOn: 'string',
        tiers: dtoList('int'),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ applyTo = this.declared('applyTo');
    /** @type {number | null} */ singleAmount = this.declared('singleAmount');
    /** @type {string | null} */ singleAmountType = this.declared('singleAmountType');
    /** @type {string | null} */ minimumAmountOn = this.declared('minimumAmountOn');
    /** @type {Array<number | null> | null} */ tiers = this.declared('tiers');
}

/** The block a `shipping` profile carries; without `apply_to` or `minimum_qty_on` a write is `500`. */
export class ShippingDetails extends Dto {
    static FIELDS = {
        type: 'string',
        applyTo: 'string',
        minimumQtyOn: 'string',
        amountType: 'string',
        singleAmountType: 'string',
        minimumQty: 'int',
        minimumAmount: 'float',
        singleAmount: 'any',
        capAmount: 'any',
        maximumTime: 'any',
        zone: 'any',
        shippingClass: 'any',
        tiers: dtoList('any'),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ applyTo = this.declared('applyTo');
    /** @type {string | null} */ minimumQtyOn = this.declared('minimumQtyOn');
    /** @type {string | null} */ amountType = this.declared('amountType');
    /** @type {string | null} */ singleAmountType = this.declared('singleAmountType');
    /** @type {number | null} */ minimumQty = this.declared('minimumQty');
    /** @type {number | null} */ minimumAmount = this.declared('minimumAmount');
    /** @type {unknown} */ singleAmount = this.declared('singleAmount');
    /** @type {unknown} */ capAmount = this.declared('capAmount');
    /** @type {unknown} */ maximumTime = this.declared('maximumTime');
    /** @type {unknown} */ zone = this.declared('zone');
    /** @type {unknown} */ shippingClass = this.declared('shippingClass');
    /** @type {Array<unknown> | null} */ tiers = this.declared('tiers');
}

/** The block a `product` profile carries. */
export class ProductDetails extends Dto {
    static FIELDS = {
        type: 'string',
        freeProductMinQtyOn: 'string',
        freeProductMaxQty: 'int',
        freeProductMinAmount: 'float',
        minimumQtyOn: 'string',
        amountType: 'string',
        singleAmountType: 'string',
        singleAmount: 'any',
        capPrice: 'any',
        capPriceMaxQty: 'any',
        productIds: dtoList('any'),
        categoryIds: dtoList('any'),
        tiers: dtoList('any'),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ freeProductMinQtyOn = this.declared('freeProductMinQtyOn');
    /** @type {number | null} */ freeProductMaxQty = this.declared('freeProductMaxQty');
    /** @type {number | null} */ freeProductMinAmount = this.declared('freeProductMinAmount');
    /** @type {string | null} */ minimumQtyOn = this.declared('minimumQtyOn');
    /** @type {string | null} */ amountType = this.declared('amountType');
    /** @type {string | null} */ singleAmountType = this.declared('singleAmountType');
    /** @type {unknown} */ singleAmount = this.declared('singleAmount');
    /** @type {unknown} */ capPrice = this.declared('capPrice');
    /** @type {unknown} */ capPriceMaxQty = this.declared('capPriceMaxQty');
    /** @type {Array<unknown> | null} */ productIds = this.declared('productIds');
    /** @type {Array<unknown> | null} */ categoryIds = this.declared('categoryIds');
    /** @type {Array<unknown> | null} */ tiers = this.declared('tiers');
}

/** One generated coupon; `customer_email` is `""` until a customer is assigned. */
export class CustomerCoupon extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        customerEmail: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ customerEmail = this.declared('customerEmail');
}

/** One discount profile: a listing row, a row path's body and every write's answer. */
export class DiscountProfile extends Dto {
    static ENVELOPE_KEY = 'discount_profile';

    static FIELDS = {
        id: 'int',
        uuid: 'string',
        name: 'string',
        type: 'string',
        discountDetailsType: 'string',
        amountDetails: AmountDetails,
        shippingDetails: ShippingDetails,
        productDetails: ProductDetails,
        isActive: 'boolean',
        startDate: 'string',
        isSpecifyEndDate: 'boolean',
        endDate: 'string',
        isApplyCouponCode: 'boolean',
        defaultCouponCode: 'string',
        isCouponCodeAutoGenerate: 'boolean',
        isCreateUniqueCouponEachCustomer: 'boolean',
        isImportedCoupon: 'boolean',
        isMaximumUseTotal: 'boolean',
        maximumUseCount: 'int',
        isMaximumUseCustomer: 'boolean',
        maximumUseCustomerCount: 'int',
        isMaximumDiscountAllowed: 'boolean',
        maximumDiscountAllowedAmount: 'float',
        isExcludeProductsOnSale: 'boolean',
        isDiscountUsedWithOtherDiscount: 'boolean',
        isDisplayDiscountInformationProdDetail: 'boolean',
        isDisplayTextCoupon: 'boolean',
        displayTextCoupon: 'string',
        isDisplayTextCart: 'boolean',
        displayTextCart: 'string',
        isDisplayTextPartialDiscountCondition: 'boolean',
        displayTextPartialDiscountCondition: 'string',
        invoiceNote: 'string',
        excludeProducts: dtoList('int'),
        customerCoupons: dtoList(CustomerCoupon),
        usage: dtoList('int'),
        createdOn: 'string',
        lastUpdatedOn: 'string',
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ discountDetailsType = this.declared('discountDetailsType');
    /** @type {AmountDetails | null} */ amountDetails = this.declared('amountDetails');
    /** @type {ShippingDetails | null} */ shippingDetails = this.declared('shippingDetails');
    /** @type {ProductDetails | null} */ productDetails = this.declared('productDetails');
    /** @type {boolean | null} */ isActive = this.declared('isActive');
    /** @type {string | null} */ startDate = this.declared('startDate');
    /** @type {boolean | null} */ isSpecifyEndDate = this.declared('isSpecifyEndDate');
    /** @type {string | null} */ endDate = this.declared('endDate');
    /** @type {boolean | null} */ isApplyCouponCode = this.declared('isApplyCouponCode');
    /** @type {string | null} */ defaultCouponCode = this.declared('defaultCouponCode');
    /** @type {boolean | null} */ isCouponCodeAutoGenerate = this.declared('isCouponCodeAutoGenerate');
    /** @type {boolean | null} */ isCreateUniqueCouponEachCustomer = this.declared('isCreateUniqueCouponEachCustomer');
    /** @type {boolean | null} */ isImportedCoupon = this.declared('isImportedCoupon');
    /** @type {boolean | null} */ isMaximumUseTotal = this.declared('isMaximumUseTotal');
    /** @type {number | null} */ maximumUseCount = this.declared('maximumUseCount');
    /** @type {boolean | null} */ isMaximumUseCustomer = this.declared('isMaximumUseCustomer');
    /** @type {number | null} */ maximumUseCustomerCount = this.declared('maximumUseCustomerCount');
    /** @type {boolean | null} */ isMaximumDiscountAllowed = this.declared('isMaximumDiscountAllowed');
    /** @type {number | null} */ maximumDiscountAllowedAmount = this.declared('maximumDiscountAllowedAmount');
    /** @type {boolean | null} */ isExcludeProductsOnSale = this.declared('isExcludeProductsOnSale');
    /** @type {boolean | null} */ isDiscountUsedWithOtherDiscount = this.declared('isDiscountUsedWithOtherDiscount');
    /** @type {boolean | null} */ isDisplayDiscountInformationProdDetail = this.declared(
        'isDisplayDiscountInformationProdDetail',
    );
    /** @type {boolean | null} */ isDisplayTextCoupon = this.declared('isDisplayTextCoupon');
    /** @type {string | null} */ displayTextCoupon = this.declared('displayTextCoupon');
    /** @type {boolean | null} */ isDisplayTextCart = this.declared('isDisplayTextCart');
    /** @type {string | null} */ displayTextCart = this.declared('displayTextCart');
    /** @type {boolean | null} */ isDisplayTextPartialDiscountCondition = this.declared(
        'isDisplayTextPartialDiscountCondition',
    );
    /** @type {string | null} */ displayTextPartialDiscountCondition = this.declared(
        'displayTextPartialDiscountCondition',
    );
    /** @type {string | null} */ invoiceNote = this.declared('invoiceNote');
    /** @type {Array<number | null> | null} */ excludeProducts = this.declared('excludeProducts');
    /** @type {Array<CustomerCoupon | null> | null} */ customerCoupons = this.declared('customerCoupons');
    /** @type {Array<number | null> | null} */ usage = this.declared('usage');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/**
 * The writable form of {@link DiscountProfile}, for the create and the update, sent bare. The update resets every
 * `is_*` flag, date and limit it omits.
 */
export class DiscountProfileInput extends Dto {
    static FIELDS = {
        name: 'string',
        type: 'string',
        discountDetailsType: 'string',
        amountDetails: AmountDetails,
        shippingDetails: ShippingDetails,
        productDetails: ProductDetails,
        isActive: 'boolean',
        startDate: 'string',
        isSpecifyEndDate: 'boolean',
        endDate: 'string',
        isApplyCouponCode: 'boolean',
        defaultCouponCode: 'string',
        isCouponCodeAutoGenerate: 'boolean',
        isCreateUniqueCouponEachCustomer: 'boolean',
        isImportedCoupon: 'boolean',
        isMaximumUseTotal: 'boolean',
        maximumUseCount: 'int',
        isMaximumUseCustomer: 'boolean',
        maximumUseCustomerCount: 'int',
        isMaximumDiscountAllowed: 'boolean',
        maximumDiscountAllowedAmount: 'float',
        isExcludeProductsOnSale: 'boolean',
        isDiscountUsedWithOtherDiscount: 'boolean',
        isDisplayDiscountInformationProdDetail: 'boolean',
        isDisplayTextCoupon: 'boolean',
        displayTextCoupon: 'string',
        isDisplayTextCart: 'boolean',
        displayTextCart: 'string',
        isDisplayTextPartialDiscountCondition: 'boolean',
        displayTextPartialDiscountCondition: 'string',
        invoiceNote: 'string',
        excludeProducts: dtoList('int'),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ discountDetailsType = this.declared('discountDetailsType');
    /** @type {AmountDetails | null} */ amountDetails = this.declared('amountDetails');
    /** @type {ShippingDetails | null} */ shippingDetails = this.declared('shippingDetails');
    /** @type {ProductDetails | null} */ productDetails = this.declared('productDetails');
    /** @type {boolean | null} */ isActive = this.declared('isActive');
    /** @type {string | null} */ startDate = this.declared('startDate');
    /** @type {boolean | null} */ isSpecifyEndDate = this.declared('isSpecifyEndDate');
    /** @type {string | null} */ endDate = this.declared('endDate');
    /** @type {boolean | null} */ isApplyCouponCode = this.declared('isApplyCouponCode');
    /** @type {string | null} */ defaultCouponCode = this.declared('defaultCouponCode');
    /** @type {boolean | null} */ isCouponCodeAutoGenerate = this.declared('isCouponCodeAutoGenerate');
    /** @type {boolean | null} */ isCreateUniqueCouponEachCustomer = this.declared('isCreateUniqueCouponEachCustomer');
    /** @type {boolean | null} */ isImportedCoupon = this.declared('isImportedCoupon');
    /** @type {boolean | null} */ isMaximumUseTotal = this.declared('isMaximumUseTotal');
    /** @type {number | null} */ maximumUseCount = this.declared('maximumUseCount');
    /** @type {boolean | null} */ isMaximumUseCustomer = this.declared('isMaximumUseCustomer');
    /** @type {number | null} */ maximumUseCustomerCount = this.declared('maximumUseCustomerCount');
    /** @type {boolean | null} */ isMaximumDiscountAllowed = this.declared('isMaximumDiscountAllowed');
    /** @type {number | null} */ maximumDiscountAllowedAmount = this.declared('maximumDiscountAllowedAmount');
    /** @type {boolean | null} */ isExcludeProductsOnSale = this.declared('isExcludeProductsOnSale');
    /** @type {boolean | null} */ isDiscountUsedWithOtherDiscount = this.declared('isDiscountUsedWithOtherDiscount');
    /** @type {boolean | null} */ isDisplayDiscountInformationProdDetail = this.declared(
        'isDisplayDiscountInformationProdDetail',
    );
    /** @type {boolean | null} */ isDisplayTextCoupon = this.declared('isDisplayTextCoupon');
    /** @type {string | null} */ displayTextCoupon = this.declared('displayTextCoupon');
    /** @type {boolean | null} */ isDisplayTextCart = this.declared('isDisplayTextCart');
    /** @type {string | null} */ displayTextCart = this.declared('displayTextCart');
    /** @type {boolean | null} */ isDisplayTextPartialDiscountCondition = this.declared(
        'isDisplayTextPartialDiscountCondition',
    );
    /** @type {string | null} */ displayTextPartialDiscountCondition = this.declared(
        'displayTextPartialDiscountCondition',
    );
    /** @type {string | null} */ invoiceNote = this.declared('invoiceNote');
    /** @type {Array<number | null> | null} */ excludeProducts = this.declared('excludeProducts');
}

/** The listing's ten-key `pagination` block; `limit` is the size the store applied, capped at 20. */
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

/** The listing's one `group_meta` entry: what the collection is, whether it is writable and where. */
export class ResourceMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The listing's `group_meta` block, keyed by the collection's own name. */
export class GroupMeta extends Dto {
    static FIELDS = {
        discountProfiles: ResourceMeta,
    };

    /** @type {ResourceMeta | null} */ discountProfiles = this.declared('discountProfiles');
}

/** One page of the listing: the rows, where they sit, `group_meta` and any schema. */
export class DiscountProfilePage extends Dto {
    static FIELDS = {
        discountProfiles: dtoList(DiscountProfile),
        pagination: Pagination,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Array<DiscountProfile | null> | null} */ discountProfiles = this.declared('discountProfiles');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The create-coupons answer: the codes generated, beside `status` and `message`. */
export class DiscountProfileCoupons extends Dto {
    static FIELDS = {
        status: 'string',
        message: 'string',
        codes: dtoList('string'),
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ message = this.declared('message');
    /** @type {Array<string | null> | null} */ codes = this.declared('codes');
}

/** The create-coupons body, sent bare; `requested_codes` is required and at least 1. */
export class DiscountProfileCouponsInput extends Dto {
    static FIELDS = {
        requestedCodes: 'int',
    };

    /** @type {number | null} */ requestedCodes = this.declared('requestedCodes');
}

/** The assign-customer body, sent bare: a generated `code` and the `email` of an existing customer. */
export class DiscountCouponCustomerInput extends Dto {
    static FIELDS = {
        code: 'string',
        email: 'string',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ email = this.declared('email');
}

sealDtoSchema(
    AmountDetails,
    ShippingDetails,
    ProductDetails,
    CustomerCoupon,
    DiscountProfile,
    DiscountProfileInput,
    Pagination,
    ResourceMeta,
    GroupMeta,
    DiscountProfilePage,
    DiscountProfileCoupons,
    DiscountProfileCouponsInput,
    DiscountCouponCustomerInput,
);
