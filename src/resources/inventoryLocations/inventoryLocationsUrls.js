export const INVENTORY_LOCATIONS = '/api/{api_version}/admin/inventory_locations';
export const INVENTORY_LOCATION = '/api/{api_version}/admin/inventory_locations/{inventory_location_id}';
export const INVENTORY_LOCATION_STOCK = '/api/{api_version}/admin/inventory_locations/{inventory_location_id}/stock';
export const INVENTORY_LOCATION_DEFAULT =
    '/api/{api_version}/admin/inventory_locations/{inventory_location_id}/default';
export const INVENTORY_LOCATION_STATUS = '/api/{api_version}/admin/inventory_locations/{inventory_location_id}/status';

/** @type {string} */
export const INVENTORY_LOCATIONS_KEY = 'inventory_locations';

/** The key one row arrives under; no write takes it as a wrapper, as each takes a bare record. @type {string} */
export const INVENTORY_LOCATION_KEY = 'inventory_location';

/** The key the stock sub-path's rows arrive under. @type {string} */
export const INVENTORY_LOCATION_STOCK_KEY = 'items';

/**
 * The names the listing accepts; any other name is refused with `400`.
 * @type {readonly string[]}
 */
export const INVENTORY_LOCATIONS_QUERY_PARAMS = Object.freeze(['q', 'limit', 'offset']);

/** The page size the listing applies when no `limit` is sent. @type {number} */
export const INVENTORY_LOCATIONS_PAGE_SIZE = 20;

/**
 * The `200` body the store answers for a method with no handler on these paths; nothing is stored.
 * @type {Readonly<{isSuccess: boolean, message: string}>}
 */
export const UNROUTED_METHOD_BODY = Object.freeze({isSuccess: false, message: 'Invalid API Request'});
