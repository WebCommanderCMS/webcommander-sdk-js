export const PRODUCTS = '/api/{api_version}/admin/products';
export const PRODUCT = '/api/{api_version}/admin/products/{product_id}';
export const PRODUCT_REVIEWS = '/api/{api_version}/admin/products/{product_id}/reviews';
export const PRODUCT_STOCK = '/api/{api_version}/admin/products/{product_id}/stock';
export const PRODUCT_STOCK_LOCATION =
    '/api/{api_version}/admin/products/{product_id}/stock/locations/{inventory_location_id}';

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
