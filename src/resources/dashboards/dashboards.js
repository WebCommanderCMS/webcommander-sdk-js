import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as dashboardsUrls from './dashboardsUrls.js';
import {Dashboard, DashboardListing} from './dashboardsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} DashboardPayload */

const requireClient = clientCheck('dashboards.listDashboards(client)', 'client.dashboards.listDashboards()');

/**
 * `GET /admin/dashboards` — List the admin's layouts, `{"dashboards": [...]}` with no paging. Each row is `id`, `name`, `default` and the two timestamps, and exactly one row is the default.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<DashboardListing>>}
 */
export function listDashboards(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardsUrls.DASHBOARDS, {
        raiseOnError,
        responseFormat,
        dtoType: DashboardListing,
    });
}

/**
 * `POST /admin/dashboards` — Create a layout, answered `201` with the whole layout, bare and with no `Location`. The body is bare and needs `name`, unique among the admin's layouts (`409` `name_taken`); an empty body is `400`. It starts as a copy of the layout named in `copy_from` or of the default one, then the sections and `kpis` sent are applied. Unknown fields are ignored.
 * @param {Client} client
 * @param {DashboardPayload} payload a `DashboardInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Dashboard>>}
 */
export function createDashboard(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(dashboardsUrls.DASHBOARDS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Dashboard,
    });
}

/**
 * `GET /admin/dashboards/{dashboard_id}` — Read one layout by its `id`, the layout bare. An unknown id is `404` `not_found` on `dashboard_id`.
 * @param {Client} client @param {string} dashboardId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Dashboard>>}
 */
export function getDashboard(client, dashboardId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardsUrls.DASHBOARD, {
        pathParams: {dashboard_id: dashboardId},
        raiseOnError,
        responseFormat,
        dtoType: Dashboard,
    });
}

/**
 * `PATCH /admin/dashboards/{dashboard_id}` — Change only the fields sent, answered `200` with the whole layout. An empty body is `400`; unknown fields are ignored. A blank `name` or one over 60 characters is `400`, a section key the layout does not have is `400`, a standard section with a `position` is `400` and hiding `contact` is `400`. `default` `true` moves the store's default layout to this one.
 * @param {Client} client @param {string} dashboardId
 * @param {DashboardPayload} payload a `DashboardInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Dashboard>>}
 */
export function patchDashboard(client, dashboardId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(dashboardsUrls.DASHBOARD, {
        pathParams: {dashboard_id: dashboardId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Dashboard,
    });
}

/**
 * `DELETE /admin/dashboards/{dashboard_id}` — Delete one layout, `204` with no body; the layout then reads `404`.
 * @param {Client} client @param {string} dashboardId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteDashboard(client, dashboardId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(dashboardsUrls.DASHBOARD, {
        pathParams: {dashboard_id: dashboardId},
        raiseOnError,
        responseFormat,
    });
}
