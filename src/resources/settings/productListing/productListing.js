import {clientCheck, readCallOptions, requirePayload} from '../../callArguments.js';
import * as productListingUrls from './productListingUrls.js';
import {ProductListing} from './productListingDto.js';

/** @import {ApiResponse} from '../../../client/apiResponse.js' */
/** @typedef {import('../../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ProductListingPayload */

const requireClient = clientCheck(
    'productListing.getProductListing(client)',
    'client.productListing.getProductListing()',
);

/**
 * `GET /admin/settings/product_listing` — the whole area, with `group_meta`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductListing>>}
 */
export function getProductListing(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productListingUrls.PRODUCT_LISTING, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductListing,
    });
}

/**
 * `PATCH /admin/settings/product_listing` — partial write of one or more sections, wrapped as
 * `{product_listing: {<section>: {...}}}` and only so.
 * @param {Client} client @param {ProductListingPayload} payload @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductListing>>}
 */
export function patchProductListing(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productListingUrls.PRODUCT_LISTING, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductListing,
    });
}

/**
 * `HEAD /admin/settings/product_listing` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headProductListing(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', productListingUrls.PRODUCT_LISTING, {
        raiseOnError,
        responseFormat,
    });
}
