import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as productsUrls from './productsUrls.js';
import {Product, ProductPage, ProductReviews, ProductStock} from './productsDto.js';

/** @import {ApiResponse} from '../../client/apiResponse.js' */
/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ProductPayload */

const requireClient = clientCheck('products.getProduct(client, productId)', 'client.products.getProduct(productId)');

/**
 * `GET /admin/products` — list products, the most recently updated first; each row is the full record the row read
 * answers, and a trashed product is not listed. `limit` is 1 to 100 (default 20, above 100 is `400`), with `offset` or
 * a 1-based `page`. `search_text` matches `name` or `sku`; `name`, `sku`, `ids` (repeat the name for more; a comma list
 * is `500`), `parent` (a category id), `product_type`, `stock` (`in`, `out` or `low`), `is_available`,
 * `is_inventory_enabled`, `created_by`, `price_from`, `price_to`, `created_from`, `created_to`, `updated_from` and
 * `updated_to` narrow it. `sort` takes `name`, `isAvailable`, `sku`, `parent`, `basePrice`, `isInventoryEnabled`, `createdBy`,
 * `created`, `updated` or `id`, with `dir`; `field_metadata` adds a schema. Any other name is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductPage>>}
 */
export function listProducts(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCTS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductPage,
    });
}

/**
 * `POST /admin/products` — create a product from a bare record, `201`; `name` and `base_price` are required, `sku`
 * must be free, and the store makes one when left out.
 * @param {Client} client @param {ProductPayload} payload a `ProductInput`, a mapping or a JSON string
 * @param {string} [transactionNo] sent as the `X-Transaction-No` header; no header when absent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Product>>}
 */
export function createProduct(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCTS, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[productsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: Product,
    });
}

/**
 * `GET /admin/products/{product_id}` — one product.
 * @param {Client} client @param {number|string} productId a product's `id`
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<Product>>}
 */
export function getProduct(client, productId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT, {
        pathParams: {product_id: productId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: Product,
    });
}

/**
 * `PUT /admin/products/{product_id}` — a bare record merged at every level; it must carry `name`, `sku`, `base_price`,
 * `product_type`, `available`, `is_on_sale`, `available_on_date_range`, `available_on_weekdays`, `available_for` and
 * `selected_customers` (`400 required` otherwise), and fields left out keep their values. `{"product": {...}}` is
 * `400 unknown_field`.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Product>>}
 */
export function updateProduct(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(productsUrls.PRODUCT, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Product,
    });
}

/**
 * `PATCH /admin/products/{product_id}` — the same bare record the `PUT` takes, merged the same way; a product in the
 * trash is `409`.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Product>>}
 */
export function patchProduct(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productsUrls.PRODUCT, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Product,
    });
}

/**
 * `DELETE /admin/products/{product_id}` — move a product to the trash, `204`; it still reads back with `status`
 * `trashed`, and a second delete is `404`.
 * @param {Client} client @param {number|string} productId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteProduct(client, productId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(productsUrls.PRODUCT, {
        pathParams: {product_id: productId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/products/{product_id}/reviews` — add reviews from `{"product": {"reviews": [...]}}`; `201` with every
 * review the product holds.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductReviewsImportInput`, a mapping or a JSON string
 * @param {string} [transactionNo] sent as the `X-Transaction-No` header; no header when absent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductReviews>>}
 */
export function importProductReviews(client, productId, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCT_REVIEWS, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[productsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ProductReviews,
    });
}

/**
 * `GET /admin/products/{product_id}/stock` — the product's stock at each location; every query name is ignored.
 * @param {Client} client @param {number|string} productId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductStock>>}
 */
export function getProductStock(client, productId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT_STOCK, {
        pathParams: {product_id: productId},
        raiseOnError,
        responseFormat,
        dtoType: ProductStock,
    });
}

/**
 * `PUT /admin/products/{product_id}/stock` — `locations` replaces the whole set.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductStockInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductStock>>}
 */
export function updateProductStock(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(productsUrls.PRODUCT_STOCK, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductStock,
    });
}

/**
 * `DELETE /admin/products/{product_id}/stock/locations/{inventory_location_id}` — unassign one location, `204`.
 * @param {Client} client @param {number|string} productId
 * @param {number|string} inventoryLocationId an inventory location's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deleteProductStockLocation(client, productId, inventoryLocationId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(productsUrls.PRODUCT_STOCK_LOCATION, {
        pathParams: {product_id: productId, inventory_location_id: inventoryLocationId},
        raiseOnError,
        responseFormat,
    });
}
