import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as dashboardKpisUrls from './dashboardKpisUrls.js';
import {KpiOptions, KpiSelection} from './dashboardKpisDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} DashboardKpiPayload */

const requireClient = clientCheck(
    'dashboardKpis.getDashboardKpiOptions(client)',
    'client.dashboardKpis.getDashboardKpiOptions()',
);

/**
 * `GET /admin/dashboard/kpi_options` — List the metrics a tile can show, grouped, with `min` 2 and `max` 5 tiles and the keys now in use under `selected`. It reads the same tiles as `kpi_selection`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<KpiOptions>>}
 */
export function getDashboardKpiOptions(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardKpisUrls.DASHBOARD_KPI_OPTIONS, {
        raiseOnError,
        responseFormat,
        dtoType: KpiOptions,
    });
}

/**
 * `GET /admin/dashboard/kpi_selection` — Read the tiles in use with their figures: the tiles of the default layout under `selected` in position order. `duration` (`last_30_days` when left out) or `start_date` with `end_date` (`YYYY-MM-DD`, sent together) choose the period; a bad value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<KpiSelection>>}
 */
export function getDashboardKpiSelection(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardKpisUrls.DASHBOARD_KPI_SELECTION, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: KpiSelection,
    });
}

/**
 * `PUT /admin/dashboard/kpi_selection` — Save the tiles with `{"metrics": [...]}`, answered `200` like the read. The list replaces the default layout's tiles, which is store-wide state, and is read back at once by that layout and by `kpi_options`. Fewer than 2 or more than 5, a repeat, an unknown key, a missing `metrics` and a non-list are `400`. `duration` or the dates in the query set the period of the figures in the answer.
 * @param {Client} client
 * @param {DashboardKpiPayload} payload a `KpiSelectionInput`, a mapping or a JSON string
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<KpiSelection>>}
 */
export function updateDashboardKpiSelection(client, payload, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(dashboardKpisUrls.DASHBOARD_KPI_SELECTION, {
        jsonBody: payload,
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: KpiSelection,
    });
}
