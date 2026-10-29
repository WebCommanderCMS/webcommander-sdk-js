export const TAX_COUNTRY_TAXES = '/api/{api_version}/admin/tax/country-taxes';
export const TAX_COUNTRY_TAX = '/api/{api_version}/admin/tax/country-taxes/{country_tax_id}';

/** Files a new country tax under this transaction number; it beats a `transaction_no` body field. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
