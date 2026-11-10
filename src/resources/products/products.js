import {SdkUsageError} from '../../errors.js';
import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as productsUrls from './productsUrls.js';
import {
    Product,
    ProductCount,
    ProductInventoryResult,
    ProductMediaImage,
    ProductMediaOrder,
    ProductMediaUploaded,
    ProductPage,
    ProductReview,
    ProductReviewList,
    ProductReviews,
    ProductSeo,
    ProductSkuCheck,
    ProductSpecialPage,
    ProductStock,
    ProductStockAdjustmentPage,
    ProductStockPatchResult,
    ProductsBulkDeleteResult,
} from './productsDto.js';

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

/**
 * `GET /admin/products/count` — count products; `{"total": n, "count": n}`. It takes the list's filters (`search_text`,
 * `name`, `sku`, `ids`, `parent`, `product_type`, `stock`, `is_available`, `is_inventory_enabled`, `created_by`,
 * `price_from`, `price_to` and the four date bounds) and refuses its paging and sorting, and `status`, as
 * `400 unknown_parameter`. A trashed product is not counted.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductCount>>}
 */
export function countProducts(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCTS_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductCount,
    });
}

/**
 * `GET /admin/products/check-sku` — ask whether a SKU is free. The match ignores case and sees a SKU held by a trashed
 * product or by a variant; `excludeProductId` is the `id` of a product that may hold it, as when that product is being
 * edited. Any other query name, and `SKU` in capitals, is `400 unknown_parameter`.
 * @param {Client} client @param {string} sku
 * @param {number|string} [excludeProductId] sent as `exclude_product_id`; left out when absent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductSkuCheck>>}
 */
export function checkProductSku(client, sku, excludeProductId = undefined, options = undefined) {
    const target = requireClient(client);
    if (sku === null || sku === undefined || String(sku) === '') throw new SdkUsageError('sku is required');
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCTS_CHECK_SKU, {
        queryParams: {sku, exclude_product_id: excludeProductId},
        raiseOnError,
        responseFormat,
        dtoType: ProductSkuCheck,
    });
}

/**
 * `GET /admin/products/special` — list a special selection of products. `type` is required: `onSale`, `featured`,
 * `new`, `topSelling`, `lastBought` or `lastViewed`. `max` (1 to 100, default 10) and `offset` page it. The last two
 * are per customer and need `customerId` (the `customer_id` or `internal_id` of a customer) or `customer_email`;
 * `customer_id` is not read, and an unknown customer is `400 unknown_reference`. A name it does not know is ignored.
 * @param {Client} client @param {Record<string, unknown>} queryParams @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductSpecialPage>>}
 */
export function listSpecialProducts(client, queryParams, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCTS_SPECIAL, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductSpecialPage,
    });
}

/**
 * `POST /admin/products/bulk-delete` — move several products to the trash, answered `200` even when an id failed. The
 * body is `{"ids": [...]}` (the collection sends `product_ids`, which the store answers `400 required` for `ids`); an
 * empty list is `400`. Each id that is not a product is counted in `failed` and listed in `errors`.
 * @param {Client} client @param {ProductPayload} payload a `ProductsBulkDeleteInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductsBulkDeleteResult>>}
 */
export function bulkDeleteProducts(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCTS_BULK_DELETE, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductsBulkDeleteResult,
    });
}

/**
 * `GET /admin/products/{product_id}/reviews` — list a product's reviews; `{"reviews": [...]}` with no paging block.
 * `status`, `limit` and `offset` are in the collection and this store ignores them, as it does any other name.
 * @param {Client} client @param {number|string} productId
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ProductReviewList>>}
 */
export function listProductReviews(client, productId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT_REVIEWS, {
        pathParams: {product_id: productId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductReviewList,
    });
}

/**
 * `GET /admin/products/{product_id}/reviews/{review_id}` — read one review under `review`. An unknown one is `404`.
 * @param {Client} client @param {number|string} productId @param {number|string} reviewId a review's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductReview>>}
 */
export function getProductReview(client, productId, reviewId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT_REVIEW, {
        pathParams: {product_id: productId, review_id: reviewId},
        raiseOnError,
        responseFormat,
        dtoType: ProductReview,
    });
}

/**
 * `PATCH /admin/products/{product_id}/reviews/{review_id}` — change one review with a bare body, answered `200` with
 * the review under `review`. `status` is `pending` (what an imported review without one reads) or `approved`;
 * `rejected`, which the collection uses, is `400 invalid_enum`. `rating` and `comment` change too.
 * @param {Client} client @param {number|string} productId @param {number|string} reviewId
 * @param {ProductPayload} payload a `ProductReviewPatchInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductReview>>}
 */
export function patchProductReview(client, productId, reviewId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productsUrls.PRODUCT_REVIEW, {
        pathParams: {product_id: productId, review_id: reviewId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductReview,
    });
}

/**
 * `DELETE /admin/products/{product_id}/reviews/{review_id}` — delete one review for good, `204`; a second delete is
 * `404`.
 * @param {Client} client @param {number|string} productId @param {number|string} reviewId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deleteProductReview(client, productId, reviewId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(productsUrls.PRODUCT_REVIEW, {
        pathParams: {product_id: productId, review_id: reviewId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/products/{product_id}/inventories` — set a product's stock figure, answered `201`. The body is
 * `{"product": {"product_pricing_and_stock": {"track_inventory": true, "available_stock": n}}}`; `low_level_stock`
 * sets the low level. It records a history row and a variant keeps its own figure. The header is stored as the
 * product's `transaction_no` when it has none, and the answer echoes the value from before the write.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductInventoryInput`, a mapping or a JSON string
 * @param {string} [transactionNo] sent as the `X-Transaction-No` header; no header when absent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductInventoryResult>>}
 */
export function createProductInventory(client, productId, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCT_INVENTORIES, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[productsUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ProductInventoryResult,
    });
}

/**
 * `POST /admin/products/{product_id}/image` — store images on a product, answered `201` with the files just stored.
 * The body is JSON, `{"product": {"image_and_video": {"images": [{"filename": ..., "base64": ...}]}}}`; a multipart
 * body is `415`.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductImageUploadInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductMediaUploaded>>}
 */
export function createProductImage(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCT_IMAGE, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductMediaUploaded,
    });
}

/**
 * `POST /admin/products/{product_id}/media` � store one file on a product, answered `201` with a `Location` header and
 * the file just stored as one flat row, not under `product`: `id`, `filename`, `position`, `primary`, `alt_text`, `url`
 * and `thumbnail_url`. A bare JSON body of `type`, `filename` and `content` (base64 or a `data:` URI). Only `type`
 * `images` is accepted; `videos` and `specification_file` are `400 not_supported`. `position` (1-based) is accepted.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductMediaUploadInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductMediaImage>>}
 */
export function createProductMedia(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(productsUrls.PRODUCT_MEDIA, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductMediaImage,
    });
}

/**
 * `DELETE /admin/products/{product_id}/media/images/{image_id}` — delete one image from a product, `204`; a second
 * delete is `404`.
 * @param {Client} client @param {number|string} productId @param {number|string} imageId an image's `id` on the product
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function deleteProductMediaImage(client, productId, imageId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(productsUrls.PRODUCT_MEDIA_IMAGE, {
        pathParams: {product_id: productId, image_id: imageId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/products/{product_id}/media/order` — set the order of a product's images; the first becomes `primary`.
 * A bare `{"type": "images", "ids": [...]}` naming every image once (`400 invalid_set` otherwise), answered with
 * `images` in the new order.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductMediaOrderInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductMediaOrder>>}
 */
export function updateProductMediaOrder(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(productsUrls.PRODUCT_MEDIA_ORDER, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductMediaOrder,
    });
}

/**
 * `PATCH /admin/products/{product_id}/media/images/{image_id}` — move one image to a 1-based `position`; a bare
 * `{"position": n}` is the only body, and the image is answered as one flat row. An image the product does not hold is
 * `404`.
 * @param {Client} client @param {number|string} productId @param {number|string} imageId an image's `id` on the product
 * @param {ProductPayload} payload a `ProductMediaImagePatchInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductMediaImage>>}
 */
export function patchProductMediaImage(client, productId, imageId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productsUrls.PRODUCT_MEDIA_IMAGE, {
        pathParams: {product_id: productId, image_id: imageId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductMediaImage,
    });
}

/**
 * `GET /admin/products/{product_id}/seo` — a product's SEO, analytics, custom code, social and AI visibility settings
 * under `seo`. There is no `HEAD`, and `field_metadata` is ignored.
 * @param {Client} client @param {number|string} productId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductSeo>>}
 */
export function getProductSeo(client, productId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT_SEO, {
        pathParams: {product_id: productId},
        raiseOnError,
        responseFormat,
        dtoType: ProductSeo,
    });
}

/**
 * `PATCH /admin/products/{product_id}/stock` — change a product's stock; a bare body of `tracking`, `locations`, `note`
 * and `transaction_no`, at least one of them (a wrapper or a flat `available_stock` is `400 unknown_field`). Answered
 * with the `stock` now and the `adjustment` it recorded, `null` when the figure did not change.
 * @param {Client} client @param {number|string} productId
 * @param {ProductPayload} payload a `ProductStockPatchInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductStockPatchResult>>}
 */
export function patchProductStock(client, productId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(productsUrls.PRODUCT_STOCK, {
        pathParams: {product_id: productId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ProductStockPatchResult,
    });
}

/**
 * `GET /admin/products/{product_id}/stock/adjustments` — a product's stock history, newest first, paged by `limit`
 * (default 20) and `offset`. Each row reads `transaction_no: null`, also for a change sent with one; `HEAD` is `404`.
 * @param {Client} client @param {number|string} productId @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ProductStockAdjustmentPage>>}
 */
export function listProductStockAdjustments(client, productId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(productsUrls.PRODUCT_STOCK_ADJUSTMENTS, {
        pathParams: {product_id: productId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ProductStockAdjustmentPage,
    });
}
