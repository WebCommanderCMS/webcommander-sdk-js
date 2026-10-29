export const SEARCH_RESULT_PAGE = '/api/{api_version}/admin/settings/page_settings/search_result_page';
export const SEARCH_RESULT_PAGE_SECTION =
    '/api/{api_version}/admin/settings/page_settings/search_result_page/{section}';
export const SEARCH_RESULT_PAGE_PRODUCT_PROMOTIONS =
    '/api/{api_version}/admin/settings/page_settings/search_result_page/product_promotion';
export const SEARCH_RESULT_PAGE_PRODUCT_PROMOTION =
    '/api/{api_version}/admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}';
export const SEARCH_RESULT_PAGE_PRODUCT_PROMOTION_ACTIVE =
    '/api/{api_version}/admin/settings/page_settings/search_result_page/product_promotion/{promotion_id}/active';

/**
 * The three values `{section}` takes; only `product_information` is writable, and `product_promotion` is a
 * resource with functions of its own.
 * @type {readonly string[]}
 */
export const SEARCH_RESULT_PAGE_SECTIONS = Object.freeze(['product_information', 'seo', 'reinitialise']);
