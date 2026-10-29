export const PRODUCT_LISTING = '/api/{api_version}/admin/settings/product_listing';

/**
 * The four sections, body keys rather than path values: there is no `/product_listing/{section}` route.
 * @type {readonly string[]}
 */
export const PRODUCT_LISTING_SECTIONS = Object.freeze(['product_information', 'load', 'sorting', 'sortable_items']);
