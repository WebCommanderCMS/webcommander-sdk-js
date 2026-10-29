export const PRODUCT_PAGE = '/api/{api_version}/admin/settings/page_settings/product_page';
export const PRODUCT_PAGE_SECTION = '/api/{api_version}/admin/settings/page_settings/product_page/{section}';

/** The seven values `{section}` takes, in the facade's order; all are writable. @type {readonly string[]} */
export const PRODUCT_PAGE_SECTIONS = Object.freeze([
    'configuration',
    'variations',
    'image_and_video',
    'up_sell',
    'related_products',
    'review_and_ratings',
    'quick_view',
]);
