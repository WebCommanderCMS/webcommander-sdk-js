import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as trashUrls from './trashUrls.js';
import {TrashBulkDeleteResult, TrashBulkRestoreResult, TrashItem, TrashPage, TrashTypeList} from './trashDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TrashBulkPayload */

const requireClient = clientCheck(
    'trash.listTrash(client, {type: "Category", limit: 5})',
    'client.trash.listTrash({type: "Category", limit: 5})',
);

/**
 * `GET /admin/trash` — list trashed rows, newest change first. `type` (a `types` value, any case, or a comma list),
 * `search` or `searchText`, `sort` `name`, `type`, `updated` or `removed_at` with `order` or `dir`, `limit` or `max`
 * (above 100 is `400`), `offset`, `page`, `removed_from` and `removed_to`; any other name is `400`. Pass `type`: an
 * unfiltered page can outlast the default timeout.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TrashPage>>}
 */
export function listTrash(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(trashUrls.TRASH, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TrashPage,
    });
}

/**
 * `HEAD /admin/trash` — `200` with no body. It takes the listing's query names and runs the same query, so pass a
 * `type` as on the `GET`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headTrash(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', trashUrls.TRASH, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/trash/types` — the types the trash holds, snake_case names such as `category`, `customer` and
 * `blog_post`. Any query name is `400`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<TrashTypeList>>}
 */
export function listTrashTypes(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(trashUrls.TRASH_TYPES, {
        raiseOnError,
        responseFormat,
        dtoType: TrashTypeList,
    });
}

/**
 * `HEAD /admin/trash/types` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTrashTypes(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', trashUrls.TRASH_TYPES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/trash/{trash_type}/{trash_item_id}/restore` — restore one trashed row, answered `200` with the row
 * under `item`; sends no body. A live row is `409`, an id the type does not hold `404`.
 * @param {Client} client @param {string} trashType a `types` value, in any case
 * @param {number|string} trashItemId the row's own id, a customer's `customer_id` @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TrashItem>>}
 */
export function restoreTrashItem(client, trashType, trashItemId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(trashUrls.TRASH_ITEM_RESTORE, {
        pathParams: {trash_type: trashType, trash_item_id: trashItemId},
        raiseOnError,
        responseFormat,
        dtoType: TrashItem,
    });
}

/**
 * `DELETE /admin/trash/{trash_type}/{trash_item_id}` — delete one trashed row for good, `204`. A live row is `409`;
 * once purged, every read and a second delete are `404`.
 * @param {Client} client @param {string} trashType @param {number|string} trashItemId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTrashItem(client, trashType, trashItemId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(trashUrls.TRASH_ITEM, {
        pathParams: {trash_type: trashType, trash_item_id: trashItemId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/trash/bulk-restore` — restore up to 100 rows from `{"items": [{"type", "id"}]}`. `200` when every
 * item is restored, `207` with the same body when any fails.
 * @param {Client} client
 * @param {TrashBulkPayload} payload a `TrashBulkInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TrashBulkRestoreResult>>}
 */
export function bulkRestoreTrash(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(trashUrls.TRASH_BULK_RESTORE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TrashBulkRestoreResult,
    });
}

/**
 * `POST /admin/trash/bulk-delete` — delete up to 100 trashed rows for good, from the bulk restore's body. `200` when
 * every item is deleted, `207` with the same body when any fails.
 * @param {Client} client
 * @param {TrashBulkPayload} payload a `TrashBulkInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TrashBulkDeleteResult>>}
 */
export function bulkDeleteTrash(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(trashUrls.TRASH_BULK_DELETE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TrashBulkDeleteResult,
    });
}
