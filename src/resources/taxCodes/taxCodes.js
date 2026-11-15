import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxCodesUrls from './taxCodesUrls.js';
import {TaxCode, TaxCodePage} from './taxCodesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TaxCodePayload */

const requireClient = clientCheck(
    'taxCodes.listTaxCodes(client, {limit: 5})',
    'client.taxCodes.listTaxCodes({limit: 5})',
);

/**
 * `GET /admin/tax_codes` — list the tax codes; `limit` is capped at 100, so page on `pagination.total`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TaxCodePage>>}
 */
export function listTaxCodes(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCodesUrls.TAX_CODES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TaxCodePage,
    });
}

/**
 * `POST /admin/tax_codes` — create a tax code inside the `tax_code` wrapper; `name` is required.
 * @param {Client} client @param {TaxCodePayload} payload a `TaxCodeInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxCode>>}
 */
export function createTaxCode(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxCodesUrls.TAX_CODES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxCode,
    });
}

/**
 * `GET /admin/tax_codes/{tax_code_id}` — one tax code, under the singular key.
 * @param {Client} client @param {number|string} taxCodeId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxCode>>}
 */
export function getTaxCode(client, taxCodeId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCodesUrls.TAX_CODE, {
        pathParams: {tax_code_id: taxCodeId},
        raiseOnError,
        responseFormat,
        dtoType: TaxCode,
    });
}

/**
 * `PUT /admin/tax_codes/{tax_code_id}` — update one tax code inside the `tax_code` wrapper.
 * @param {Client} client @param {number|string} taxCodeId
 * @param {TaxCodePayload} payload a `TaxCodeInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxCode>>}
 */
export function updateTaxCode(client, taxCodeId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxCodesUrls.TAX_CODE, {
        pathParams: {tax_code_id: taxCodeId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxCode,
    });
}

/**
 * `DELETE /admin/tax_codes/{tax_code_id}` — `204`, hard; confirm it by a read, as straight after a refusal it
 * answers that refusal and removes nothing.
 * @param {Client} client @param {number|string} taxCodeId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxCode(client, taxCodeId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxCodesUrls.TAX_CODE, {
        pathParams: {tax_code_id: taxCodeId},
        raiseOnError,
        responseFormat,
    });
}
