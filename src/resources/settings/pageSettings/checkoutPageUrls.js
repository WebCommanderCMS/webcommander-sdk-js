export const CHECKOUT_PAGE = '/api/{api_version}/admin/settings/page_settings/checkout_page';
export const CHECKOUT_PAGE_SECTION = '/api/{api_version}/admin/settings/page_settings/checkout_page/{section}';

/** The four sections `group_meta` marks writable, the only ones a `PATCH` may name. @type {readonly string[]} */
export const CHECKOUT_PAGE_WRITABLE_SECTIONS = Object.freeze([
    'customer_checkout',
    'delivery_options',
    'order_summary',
    'others',
]);
