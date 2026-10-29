import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as inventoryLocationsUrls from './inventoryLocationsUrls.js';
import {InventoryLocation, InventoryLocationPage, InventoryLocationStock} from './inventoryLocationsDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} InventoryLocationPayload */

const requireClient = clientCheck(
    'inventoryLocations.listInventoryLocations(client, {q: "Sydney"})',
    'client.inventoryLocations.listInventoryLocations({q: "Sydney"})',
);

/**
 * `GET /admin/inventory_locations` — list the locations, default row first.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<InventoryLocationPage>>}
 */
export function listInventoryLocations(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(inventoryLocationsUrls.INVENTORY_LOCATIONS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocationPage,
    });
}

/**
 * `HEAD /admin/inventory_locations` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headInventoryLocations(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', inventoryLocationsUrls.INVENTORY_LOCATIONS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/inventory_locations` — create a location from a bare record, answered `201`;
 * `default: true` takes the flag off the row that held it.
 * @param {Client} client
 * @param {InventoryLocationPayload} payload an `InventoryLocationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function createInventoryLocation(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(inventoryLocationsUrls.INVENTORY_LOCATIONS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}

/**
 * `GET /admin/inventory_locations/{inventory_location_id}` — one location, under the singular key.
 * @param {Client} client @param {number|string} inventoryLocationId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function getInventoryLocation(client, inventoryLocationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(inventoryLocationsUrls.INVENTORY_LOCATION, {
        pathParams: {inventory_location_id: inventoryLocationId},
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}

/**
 * `HEAD /admin/inventory_locations/{inventory_location_id}` — `200` with no body.
 * @param {Client} client @param {number|string} inventoryLocationId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headInventoryLocation(client, inventoryLocationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', inventoryLocationsUrls.INVENTORY_LOCATION, {
        pathParams: {inventory_location_id: inventoryLocationId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/inventory_locations/{inventory_location_id}` — replace one location.
 * @param {Client} client @param {number|string} inventoryLocationId
 * @param {InventoryLocationPayload} payload an `InventoryLocationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function updateInventoryLocation(client, inventoryLocationId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(inventoryLocationsUrls.INVENTORY_LOCATION, {
        pathParams: {inventory_location_id: inventoryLocationId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}

/**
 * `PATCH /admin/inventory_locations/{inventory_location_id}` — merge fields into one location from a bare record of
 * at least one field.
 * @param {Client} client @param {number|string} inventoryLocationId
 * @param {InventoryLocationPayload} payload an `InventoryLocationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function patchInventoryLocation(client, inventoryLocationId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(inventoryLocationsUrls.INVENTORY_LOCATION, {
        pathParams: {inventory_location_id: inventoryLocationId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}

/**
 * `DELETE /admin/inventory_locations/{inventory_location_id}` — `204`, hard.
 * @param {Client} client @param {number|string} inventoryLocationId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteInventoryLocation(client, inventoryLocationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(inventoryLocationsUrls.INVENTORY_LOCATION, {
        pathParams: {inventory_location_id: inventoryLocationId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/inventory_locations/{inventory_location_id}/stock` — what one location holds, paged by `limit` and
 * `offset`; read-only.
 * @param {Client} client @param {number|string} inventoryLocationId
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<InventoryLocationStock>>}
 */
export function getInventoryLocationStock(client, inventoryLocationId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(inventoryLocationsUrls.INVENTORY_LOCATION_STOCK, {
        pathParams: {inventory_location_id: inventoryLocationId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocationStock,
    });
}

/**
 * `PUT /admin/inventory_locations/{inventory_location_id}/default` — make one location the default.
 * @param {Client} client @param {number|string} inventoryLocationId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function setInventoryLocationDefault(client, inventoryLocationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(inventoryLocationsUrls.INVENTORY_LOCATION_DEFAULT, {
        pathParams: {inventory_location_id: inventoryLocationId},
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}

/**
 * `PUT /admin/inventory_locations/{inventory_location_id}/status` — set `active` alone, from a bare record.
 * @param {Client} client @param {number|string} inventoryLocationId
 * @param {InventoryLocationPayload} payload an `InventoryLocationStatusInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<InventoryLocation>>}
 */
export function updateInventoryLocationStatus(client, inventoryLocationId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(inventoryLocationsUrls.INVENTORY_LOCATION_STATUS, {
        pathParams: {inventory_location_id: inventoryLocationId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: InventoryLocation,
    });
}
