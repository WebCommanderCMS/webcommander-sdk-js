import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxCountryTaxesUrls from './taxCountryTaxesUrls.js';
import {CountryTax, CountryTaxPage} from './taxCountryTaxesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CountryTaxPayload */

const requireClient = clientCheck(
    'taxCountryTaxes.listTaxCountryTaxes(client, {limit: 5})',
    'client.taxCountryTaxes.listTaxCountryTaxes({limit: 5})',
);

/**
 * `GET /admin/tax/country-taxes` — list the country taxes, newest first. `limit` is 1 to 100 with the cap echoed,
 * `offset` or `page` move the window, and `sort` takes `id` or `name`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CountryTaxPage>>}
 */
export function listTaxCountryTaxes(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCountryTaxesUrls.TAX_COUNTRY_TAXES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CountryTaxPage,
    });
}

/**
 * `POST /admin/tax/country-taxes` — create a country tax inside the `country_tax` wrapper, answered `201`;
 * `country_code` is required though no read sends it back.
 * @param {Client} client
 * @param {CountryTaxPayload} payload a `CountryTaxInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CountryTax>>}
 */
export function createTaxCountryTax(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxCountryTaxesUrls.TAX_COUNTRY_TAXES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[taxCountryTaxesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: CountryTax,
    });
}

/**
 * `GET /admin/tax/country-taxes/{country_tax_id}` — one country tax with an `ETag`; only this read and the update
 * carry `state_rules`.
 * @param {Client} client @param {number|string} countryTaxId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CountryTax>>}
 */
export function getTaxCountryTax(client, countryTaxId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxCountryTaxesUrls.TAX_COUNTRY_TAX, {
        pathParams: {country_tax_id: countryTaxId},
        raiseOnError,
        responseFormat,
        dtoType: CountryTax,
    });
}

/**
 * `PUT /admin/tax/country-taxes/{country_tax_id}` — merge into one country tax, inside the `country_tax`
 * wrapper, answered `200` with an `ETag`.
 * @param {Client} client @param {number|string} countryTaxId
 * @param {CountryTaxPayload} payload a `CountryTaxInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CountryTax>>}
 */
export function updateTaxCountryTax(client, countryTaxId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxCountryTaxesUrls.TAX_COUNTRY_TAX, {
        pathParams: {country_tax_id: countryTaxId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CountryTax,
    });
}

/**
 * `DELETE /admin/tax/country-taxes/{country_tax_id}` — `204`, hard.
 * @param {Client} client @param {number|string} countryTaxId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxCountryTax(client, countryTaxId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxCountryTaxesUrls.TAX_COUNTRY_TAX, {
        pathParams: {country_tax_id: countryTaxId},
        raiseOnError,
        responseFormat,
    });
}
