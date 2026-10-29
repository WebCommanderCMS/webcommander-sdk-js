export const CURRENCIES = '/api/{api_version}/admin/currencies';
export const CURRENCIES_COUNT = '/api/{api_version}/admin/currencies/count';
export const CURRENCY = '/api/{api_version}/admin/currencies/{currency_id}';
export const CURRENCY_BASE = '/api/{api_version}/admin/currencies/{currency_id}/base';

/**
 * The names `sort` accepts; any other value is `400 invalid_enum`.
 * @type {readonly string[]}
 */
export const CURRENCIES_SORT_FIELDS = Object.freeze([
    'id',
    'name',
    'code',
    'symbol',
    'precision',
    'rounding',
    'conversion_rate',
    'active',
    'base',
    'updated_at',
]);

/** Files a new currency under this transaction number, the only way: a body field is `400`. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
