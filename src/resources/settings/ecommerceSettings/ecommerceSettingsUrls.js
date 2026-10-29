export const ECOMMERCE_SETTINGS = '/api/{api_version}/admin/settings/ecommerce_settings';
export const ECOMMERCE_SETTINGS_SECTION = '/api/{api_version}/admin/settings/ecommerce_settings/{section}';

/**
 * The seven area keys: six sections and {@link ECOMMERCE_SETTINGS_COLLECTION_KEY}, in the store's order.
 * @type {readonly string[]}
 */
export const ECOMMERCE_SETTINGS_AREA_KEYS = Object.freeze([
    'continue_shopping',
    'product_inventory',
    'pricing',
    'product_restriction',
    'order_filters',
    'location_settings',
    'order_flags',
]);

/** The six values `{section}` takes; all are writable. @type {readonly string[]} */
export const ECOMMERCE_SETTINGS_SECTIONS = Object.freeze([
    'continue_shopping',
    'product_inventory',
    'pricing',
    'product_restriction',
    'order_filters',
    'location_settings',
]);

/**
 * The one area key that is not a section: a read-only collection with its own module and no section route.
 * @type {string}
 */
export const ECOMMERCE_SETTINGS_COLLECTION_KEY = 'order_flags';
