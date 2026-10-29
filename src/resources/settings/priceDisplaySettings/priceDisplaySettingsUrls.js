export const PRICE_DISPLAY_SETTINGS = '/api/{api_version}/admin/settings/price_display_settings';
export const PRICE_DISPLAY_SETTINGS_SECTION = '/api/{api_version}/admin/settings/price_display_settings/{section}';

/** The two values `{section}` takes, in the facade's order; both are writable. @type {readonly string[]} */
export const PRICE_DISPLAY_SETTINGS_SECTIONS = Object.freeze(['order_item', 'order_summary']);
