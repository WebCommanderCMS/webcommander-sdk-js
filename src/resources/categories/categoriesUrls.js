export const CATEGORIES = '/api/{api_version}/admin/categories';
export const CATEGORIES_COUNT = '/api/{api_version}/admin/categories/count';
export const CATEGORIES_CHECK_NAME = '/api/{api_version}/admin/categories/check-name';
export const CATEGORY = '/api/{api_version}/admin/categories/{category_id}';
export const CATEGORY_SECTION = '/api/{api_version}/admin/categories/{category_id}/{section}';

/** The six values `{section}` takes, each also a key of the row and of `group_meta`. @type {readonly string[]} */
export const CATEGORY_SECTIONS = Object.freeze([
    'general',
    'description',
    'images_media',
    'availability_visibility',
    'tax_shipping',
    'assign_products',
]);

/** Files a new category under this transaction number; it beats `category.transaction_no`. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
