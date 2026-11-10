export const SHIPPING_RULES = '/api/{api_version}/admin/shipping_rules';
export const SHIPPING_RULES_COUNT = '/api/{api_version}/admin/shipping_rules/count';
export const SHIPPING_RULE = '/api/{api_version}/admin/shipping_rules/{shipping_rule_id}';

/** Files the record under a transaction number; it wins over a `transaction_no` in the body. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
