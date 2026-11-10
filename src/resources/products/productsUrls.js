export const PRODUCTS = '/api/{api_version}/admin/products';
export const PRODUCTS_COUNT = '/api/{api_version}/admin/products/count';
export const PRODUCTS_CHECK_SKU = '/api/{api_version}/admin/products/check-sku';
export const PRODUCTS_SPECIAL = '/api/{api_version}/admin/products/special';
export const PRODUCTS_BULK_DELETE = '/api/{api_version}/admin/products/bulk-delete';
export const PRODUCT = '/api/{api_version}/admin/products/{product_id}';
export const PRODUCT_REVIEWS = '/api/{api_version}/admin/products/{product_id}/reviews';
export const PRODUCT_REVIEW = '/api/{api_version}/admin/products/{product_id}/reviews/{review_id}';
export const PRODUCT_IMAGE = '/api/{api_version}/admin/products/{product_id}/image';
export const PRODUCT_MEDIA = '/api/{api_version}/admin/products/{product_id}/media';
export const PRODUCT_MEDIA_IMAGE = '/api/{api_version}/admin/products/{product_id}/media/images/{image_id}';
export const PRODUCT_INVENTORIES = '/api/{api_version}/admin/products/{product_id}/inventories';
export const PRODUCT_STOCK = '/api/{api_version}/admin/products/{product_id}/stock';
export const PRODUCT_STOCK_LOCATION =
    '/api/{api_version}/admin/products/{product_id}/stock/locations/{inventory_location_id}';

export const PRODUCT_STOCK_ADJUSTMENTS = '/api/{api_version}/admin/products/{product_id}/stock/adjustments';
export const PRODUCT_SEO = '/api/{api_version}/admin/products/{product_id}/seo';
export const PRODUCT_MEDIA_ORDER = '/api/{api_version}/admin/products/{product_id}/media/order';

/** The key the row read and every write answer under; only the review import takes it as a wrapper. @type {string} */
export const PRODUCT_KEY = 'product';

/** The key the stock rows arrive under, and the one key the stock write requires. @type {string} */
export const PRODUCT_STOCK_LOCATIONS_KEY = 'locations';

/**
 * The one name the row read accepts; any other name is `400 unknown_parameter`.
 * @type {readonly string[]}
 */
export const PRODUCT_QUERY_PARAMS = Object.freeze(['field_metadata']);

/** Tags a write with a transaction number; it wins over a body `transaction_no` it disagrees with. @type {string} */
export const TRANSACTION_NO_HEADER = 'X-Transaction-No';
