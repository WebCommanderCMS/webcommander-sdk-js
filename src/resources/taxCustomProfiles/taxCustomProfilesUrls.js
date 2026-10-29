export const TAX_CUSTOM_PROFILES = '/api/{api_version}/admin/tax/custom-profiles';
export const TAX_CUSTOM_PROFILE = '/api/{api_version}/admin/tax/custom-profiles/{custom_profile_id}';

/** Files a new custom profile under this transaction number; it beats a `transaction_no` body field. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
