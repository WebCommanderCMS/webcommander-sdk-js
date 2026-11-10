export const SHIPPING_PROFILES = '/api/{api_version}/admin/shipping_profiles';
export const SHIPPING_PROFILES_COUNT = '/api/{api_version}/admin/shipping_profiles/count';
export const SHIPPING_PROFILES_WIZARD = '/api/{api_version}/admin/shipping_profiles/wizard';
export const SHIPPING_PROFILE = '/api/{api_version}/admin/shipping_profiles/{shipping_profile_id}';

/** Files the record under a transaction number; it wins over a `transaction_no` in the body. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
