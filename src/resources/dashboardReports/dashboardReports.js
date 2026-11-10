import {clientCheck, readCallOptions} from '../callArguments.js';
import * as dashboardReportsUrls from './dashboardReportsUrls.js';
import {QuickReport, SalesReport, SummaryReport} from './dashboardReportsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

/*
 * Every report takes the same period query: `duration` (`today`, `yesterday`, `last_24_hours`, `last_7_days`,
 * `last_30_days`, `this_month`, `last_month`, `last_3_months`, `last_6_months`, `last_12_months`, `last_24_months`,
 * `last_36_months`, `last_48_months`, `last_60_months` or `custom`; `last_30_days` when left out) or `start_date` with
 * `end_date` (`YYYY-MM-DD`, sent together, not reversed and not in the future). A bad value, a repeated `duration` and
 * a lone date are `400` with every bad field listed; a name the report does not know is ignored.
 */

const requireClient = clientCheck(
    'dashboardReports.getDashboardReportQuick(client, {duration: "last_7_days"})',
    'client.dashboardReports.getDashboardReportQuick({duration: "last_7_days"})',
);

/**
 * `GET /admin/dashboard/reports/quick` — Read the quick report: `period`, `kpis`, grouped totals, the most viewed pages under `view_report` and `trends`. `kpis` is a comma list of metric keys (an unknown one is `400`) that narrows `kpis` to those, in that order; `entity_name` is `page` (the default) or `product` and picks what `view_report` ranks.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<QuickReport>>}
 */
export function getDashboardReportQuick(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardReportsUrls.DASHBOARD_REPORT_QUICK, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: QuickReport,
    });
}

/**
 * `HEAD /admin/dashboard/reports/quick` — Ask whether the quick report is reachable: the status of the read, with no body. It runs the read's query, so a bad value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headDashboardReportQuick(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', dashboardReportsUrls.DASHBOARD_REPORT_QUICK, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/dashboard/reports/sales` — Read the sales report: `rows` by day or month and `totals`. `breakdown` (`true` or `false`) adds orders, shipping, tax, discount, refunds and the top product to each row and total; `sort` is `date` (the default) or `sales` and `order` is `asc` (the default) or `desc`; any other value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SalesReport>>}
 */
export function getDashboardReportSales(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardReportsUrls.DASHBOARD_REPORT_SALES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SalesReport,
    });
}

/**
 * `HEAD /admin/dashboard/reports/sales` — Ask whether the sales report is reachable: the status of the read, with no body. It runs the read's query, so a bad value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headDashboardReportSales(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', dashboardReportsUrls.DASHBOARD_REPORT_SALES, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/dashboard/reports/summary` — Read the summary: the quick report without `kpis`, orders by month, sales rows, the most visited and best selling products and the order updates, in one answer. `compare_previous` (`true` or `false`) is checked as a boolean; any other value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<SummaryReport>>}
 */
export function getDashboardReportSummary(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardReportsUrls.DASHBOARD_REPORT_SUMMARY, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: SummaryReport,
    });
}

/**
 * `HEAD /admin/dashboard/reports/summary` — Ask whether the summary report is reachable: the status of the read, with no body. It runs the read's query, so a bad value is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headDashboardReportSummary(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', dashboardReportsUrls.DASHBOARD_REPORT_SUMMARY, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}
