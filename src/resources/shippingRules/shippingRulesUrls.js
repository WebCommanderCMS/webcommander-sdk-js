export const SHIPPING_RULES = '/api/{api_version}/admin/shipping_rules';
export const SHIPPING_RULES_COUNT = '/api/{api_version}/admin/shipping_rules/count';
export const SHIPPING_RULE = '/api/{api_version}/admin/shipping_rules/{shipping_rule_id}';

/** Files the record under a transaction number; a differing `transaction_no` beside the wrapper is `400 header_body_mismatch`; one inside is not compared. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
