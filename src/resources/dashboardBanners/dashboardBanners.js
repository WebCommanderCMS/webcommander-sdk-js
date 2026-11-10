import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as dashboardBannersUrls from './dashboardBannersUrls.js';
import {DashboardBanner, DashboardBannerListing, DashboardContentInfo} from './dashboardBannersDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} DashboardBannerPayload */

const requireClient = clientCheck(
    'dashboardBanners.listDashboardBanners(client)',
    'client.dashboardBanners.listDashboardBanners()',
);

/**
 * `GET /admin/dashboard/banners` — List every banner, active or not, `{"banners": [...]}` in position order, positions counting from 1 without a gap.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<DashboardBannerListing>>}
 */
export function listDashboardBanners(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardBannersUrls.DASHBOARD_BANNERS, {
        raiseOnError,
        responseFormat,
        dtoType: DashboardBannerListing,
    });
}

/**
 * `POST /admin/dashboard/banners` — Create a banner, answered `201` with the banner bare and no `Location`. The body is bare; every failing field is listed in one `400`, a `key` already used is `400` `duplicate`, an unknown field is `400`. It joins the Dashboard feed at once while `active`.
 * @param {Client} client
 * @param {DashboardBannerPayload} payload a `DashboardBannerInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DashboardBanner>>}
 */
export function createDashboardBanner(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(dashboardBannersUrls.DASHBOARD_BANNERS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: DashboardBanner,
    });
}

/**
 * `GET /admin/dashboard/banners/{banner_key}` — Read one banner by its `key`, the banner bare, hidden ones included. An unknown key is `404`.
 * @param {Client} client @param {string} bannerKey @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<DashboardBanner>>}
 */
export function getDashboardBanner(client, bannerKey, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardBannersUrls.DASHBOARD_BANNER, {
        pathParams: {banner_key: bannerKey},
        raiseOnError,
        responseFormat,
        dtoType: DashboardBanner,
    });
}

/**
 * `PATCH /admin/dashboard/banners/{banner_key}` — Change only the fields sent, answered `200` with the banner. An empty body, a blank `title`, a `key` and an unknown field are `400`; an unknown banner is `404`. `learn_more` and `try_it` are replaced whole, and `try_it` `null` removes the second button. `updated_at` is not moved.
 * @param {Client} client @param {string} bannerKey
 * @param {DashboardBannerPayload} payload a `DashboardBannerInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<DashboardBanner>>}
 */
export function patchDashboardBanner(client, bannerKey, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(dashboardBannersUrls.DASHBOARD_BANNER, {
        pathParams: {banner_key: bannerKey},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: DashboardBanner,
    });
}

/**
 * `DELETE /admin/dashboard/banners/{banner_key}` — Delete one banner, `204` with no body. The banners after it move up, so the positions stay without a gap; an unknown key is `404`.
 * @param {Client} client @param {string} bannerKey @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteDashboardBanner(client, bannerKey, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(dashboardBannersUrls.DASHBOARD_BANNER, {
        pathParams: {banner_key: bannerKey},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/dashboard/content_info` — Read what the Dashboard shows besides the figures: the active banners under `banners`, the support card under `contact`, `online_store` and `member_label`. A hidden banner is not listed.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<DashboardContentInfo>>}
 */
export function getDashboardContentInfo(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(dashboardBannersUrls.DASHBOARD_CONTENT_INFO, {
        raiseOnError,
        responseFormat,
        dtoType: DashboardContentInfo,
    });
}
