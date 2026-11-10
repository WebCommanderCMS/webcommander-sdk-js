import {clientCheck, readCallOptions} from '../callArguments.js';
import * as dashboardSectionsUrls from './dashboardSectionsUrls.js';
import {DashboardSectionReport} from './dashboardSectionsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const requireClient = clientCheck(
    'dashboardSections.getDashboardSection(client, "blog")',
    'client.dashboardSections.getDashboardSection("blog")',
);

/**
 * `GET /admin/dashboard/sections/{section}` — Read one tab, `section` being one of `DASHBOARD_SECTIONS` (`ecommerce`, `content`, `bookings`, `courses`, `blog`); the answer is bare, `section` echoing it, with `period` and that tab's own fields. Any other value is `404` `not_found` on `key`. `duration` or `start_date` with `end_date` choose the period, as in the reports.
 * @param {Client} client @param {string} section @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<DashboardSectionReport>>}
 */
export function getDashboardSection(client, section, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardSectionsUrls.DASHBOARD_SECTION, {
        pathParams: {section},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: DashboardSectionReport,
    });
}
