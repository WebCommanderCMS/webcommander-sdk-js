export const DISCOUNT_PROFILES = '/api/{api_version}/admin/discount_profiles';
export const DISCOUNT_PROFILE = '/api/{api_version}/admin/discount_profiles/{discount_profile_id}';
export const DISCOUNT_PROFILE_CREATE_COUPONS =
    '/api/{api_version}/admin/discount_profiles/{discount_profile_id}/create-coupons';
export const DISCOUNT_COUPONS_ASSIGN_CUSTOMER = '/api/{api_version}/admin/discount_coupons/assign-customer';

/** @type {string} */
export const DISCOUNT_PROFILES_KEY = 'discount_profiles';

/** The key one row arrives under; no write takes it as a wrapper. @type {string} */
export const DISCOUNT_PROFILE_KEY = 'discount_profile';

/** The key the generated codes arrive under, beside `status` and `message`. @type {string} */
export const DISCOUNT_PROFILE_COUPON_CODES_KEY = 'codes';

/** A row carries exactly one of these, the one its `discount_details_type` names. @type {readonly string[]} */
export const DISCOUNT_DETAILS_KEYS = Object.freeze(['amount_details', 'shipping_details', 'product_details']);

/** The names the listing reads; any other name is ignored rather than refused. @type {readonly string[]} */
export const DISCOUNT_PROFILES_QUERY_PARAMS = Object.freeze([
    'limit',
    'offset',
    'page',
    'sort',
    'dir',
    'type',
    'name',
    'field_metadata',
]);

/** The fields `sort` accepts; any other is `400 invalid_sort_field`. @type {readonly string[]} */
export const DISCOUNT_PROFILES_SORT_FIELDS = Object.freeze(['id', 'name', 'type']);

/**
 * The values `type` takes; a create and the listing filter refuse any other, an update does not.
 * @type {readonly string[]}
 */
export const DISCOUNT_PROFILE_TYPES = Object.freeze([
    'customer',
    'promote_product',
    'offer_incentive_and_sell_more',
    'offer_coupon',
]);

/** The page size when `limit` is not sent, and the cap on a larger `limit`. @type {number} */
export const DISCOUNT_PROFILES_PAGE_SIZE = 20;

/** @type {readonly string[]} */
export const DISCOUNT_PROFILES_PAGINATION_KEYS = Object.freeze([
    'count',
    'current_page',
    'has_next',
    'has_previous',
    'limit',
    'next_page',
    'offset',
    'previous_page',
    'total',
    'total_pages',
]);
