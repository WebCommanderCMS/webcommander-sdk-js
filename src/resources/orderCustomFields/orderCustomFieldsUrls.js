export const ORDER_CUSTOM_FIELDS = '/api/{api_version}/admin/order_custom_fields';
export const ORDER_CUSTOM_FIELDS_COUNT = '/api/{api_version}/admin/order_custom_fields/count';
export const ORDER_CUSTOM_FIELD = '/api/{api_version}/admin/order_custom_fields/{order_custom_field_id}';
export const ORDER_CUSTOM_FIELD_VALIDATE_TIMESLOT =
    '/api/{api_version}/admin/order_custom_fields/{order_custom_field_id}/validate_timeslot';

/** The key the listing's rows arrive under, and the one entry of its `group_meta`. @type {string} */
export const ORDER_CUSTOM_FIELDS_KEY = 'order_custom_fields';

/** The key one row arrives under. @type {string} */
export const ORDER_CUSTOM_FIELD_KEY = 'order_custom_field';

/** The one key the count sub-path answers with, bare at the top of the body. @type {string} */
export const ORDER_CUSTOM_FIELDS_COUNT_KEY = 'count';

/** The page size when `limit` is not sent, and the cap on a larger `limit`. @type {number} */
export const ORDER_CUSTOM_FIELDS_PAGE_SIZE = 20;

/** @type {readonly string[]} */
export const ORDER_CUSTOM_FIELDS_PAGINATION_KEYS = Object.freeze([
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
