import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as variationsUrls from './variationsUrls.js';
import {
    ProductVariations,
    ProductVariationsBulkResult,
    ProductVariationsImportResult,
    Variation,
    VariationPage,
} from './variationsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} VariationPayload */

const requireClient = clientCheck(
    'variations.listVariations(client, {search: "Size"})',
    'client.variations.listVariations({search: "Size"})',
);

/**
 * `GET /admin/variations` — list the types by ascending `id`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<VariationPage>>}
 */
export function listVariations(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(variationsUrls.VARIATIONS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: VariationPage,
    });
}

/**
 * `HEAD /admin/variations` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headVariations(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', variationsUrls.VARIATIONS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/variations` — create a type from `{"variation": {...}}` with `name`.
 * @param {Client} client
 * @param {VariationPayload} payload a `VariationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Variation>>}
 */
export function createVariation(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(variationsUrls.VARIATIONS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Variation,
    });
}

/**
 * `GET /admin/variations/{variation_id}` — one type, under the singular key; `field_metadata` adds the schema
 * beside it.
 * @param {Client} client @param {number|string} variationId a type's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Variation>>}
 */
export function getVariation(client, variationId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(variationsUrls.VARIATION, {
        pathParams: {variation_id: variationId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Variation,
    });
}

/**
 * `HEAD /admin/variations/{variation_id}` — `200` with no body and the row read's `ETag`.
 * @param {Client} client @param {number|string} variationId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headVariation(client, variationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', variationsUrls.VARIATION, {
        pathParams: {variation_id: variationId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/variations/{variation_id}` — replace one type; `name` and `options` are required, and an option left
 * out of the list is deleted.
 * @param {Client} client @param {number|string} variationId
 * @param {VariationPayload} payload a `VariationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Variation>>}
 */
export function updateVariation(client, variationId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(variationsUrls.VARIATION, {
        pathParams: {variation_id: variationId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Variation,
    });
}

/**
 * `PATCH /admin/variations/{variation_id}` — merge into one type.
 * @param {Client} client @param {number|string} variationId
 * @param {VariationPayload} payload a `VariationInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Variation>>}
 */
export function patchVariation(client, variationId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(variationsUrls.VARIATION, {
        pathParams: {variation_id: variationId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Variation,
    });
}

/**
 * `DELETE /admin/variations/{variation_id}` — `204`, hard; a type with options is `409` unless `cascade` is
 * `true`, which deletes them with it.
 * @param {Client} client @param {number|string} variationId
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteVariation(client, variationId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(variationsUrls.VARIATION, {
        pathParams: {variation_id: variationId},
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `DELETE /admin/variations/{variation_id}/options/{variation_option_id}` — `204`; a type's last option is `409`.
 * @param {Client} client @param {number|string} variationId @param {number|string} variationOptionId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deleteVariationOption(client, variationId, variationOptionId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(variationsUrls.VARIATION_OPTION, {
        pathParams: {variation_id: variationId, variation_option_id: variationOptionId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/products/{product_id}/variations` — one product's variants, grouped, with no paging; a
 * tax-inclusive product's prices read net of tax.
 * @param {Client} client @param {number|string} productId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductVariations>>}
 */
export function listProductVariations(client, productId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(variationsUrls.PRODUCT_VARIATIONS, {
        pathParams: {product_id: productId},
        raiseOnError,
        responseFormat,
        dtoType: ProductVariations,
    });
}

/**
 * `POST /admin/products/{product_id}/variations` — add or change a product's variants by `key`, `201`; a
 * `product_key` naming other types than the product's is `409`.
 * @param {Client} client @param {number|string} productId
 * @param {VariationPayload} payload a `ProductVariationsImportInput`, a mapping or a JSON string
 * @param {string} [transactionNo] sent as the `X-Transaction-No` header; no header when absent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductVariationsImportResult>>}
 */
export function importProductVariations(client, productId, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(variationsUrls.PRODUCT_VARIATIONS, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[variationsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ProductVariationsImportResult,
    });
}

/**
 * `PATCH /admin/products/{product_id}/variations/bulk` — set fields on several variants of one product, from a
 * bare record.
 * @param {Client} client @param {number|string} productId
 * @param {VariationPayload} payload a `ProductVariationsBulkInput`, a mapping or a JSON string
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductVariationsBulkResult>>}
 */
export function updateProductVariations(client, productId, payload, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(variationsUrls.PRODUCT_VARIATIONS_BULK, {
        pathParams: {product_id: productId},
        queryParams,
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductVariationsBulkResult,
    });
}
