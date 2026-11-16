export const TAX_COUNTRY_TAXES = '/api/{api_version}/admin/tax/country-taxes';
export const TAX_COUNTRY_TAX = '/api/{api_version}/admin/tax/country-taxes/{country_tax_id}';

/** Files a new country tax under this transaction number; a differing `transaction_no` beside the wrapper is `400 header_body_mismatch`; one inside is not compared. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
