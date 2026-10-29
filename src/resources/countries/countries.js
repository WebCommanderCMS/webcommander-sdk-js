import {clientCheck, readCallOptions} from '../callArguments.js';
import * as countriesUrls from './countriesUrls.js';
import {Country, CountryPage, CountryState, CountryStatePage} from './countriesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const requireClient = clientCheck(
    'countries.listCountries(client, {limit: 5})',
    'client.countries.listCountries({limit: 5})',
);

/**
 * `GET /admin/countries` — list the countries, `id` ascending.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CountryPage>>}
 */
export function listCountries(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(countriesUrls.COUNTRIES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CountryPage,
    });
}

/**
 * `HEAD /admin/countries` — `200` with no body, and the `ETag` the listing's first page carries.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCountries(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', countriesUrls.COUNTRIES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/countries/{country_id}` — one country, under the singular key.
 * @param {Client} client @param {number|string} countryId the numeric `id`, the ISO `code` or the `name`, in any case
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Country>>}
 */
export function getCountry(client, countryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(countriesUrls.COUNTRY, {
        pathParams: {country_id: countryId},
        raiseOnError,
        responseFormat,
        dtoType: Country,
    });
}

/**
 * `HEAD /admin/countries/{country_id}` — `200` with no body, and the `ETag` the country's read carries.
 * @param {Client} client @param {number|string} countryId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headCountry(client, countryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', countriesUrls.COUNTRY, {
        pathParams: {country_id: countryId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/countries/{country_id}/states` — one country's states beside the short parent country; the same
 * query names as {@link listCountries}.
 * @param {Client} client @param {number|string} countryId
 * @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CountryStatePage>>}
 */
export function listCountryStates(client, countryId, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(countriesUrls.COUNTRY_STATES, {
        pathParams: {country_id: countryId},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CountryStatePage,
    });
}

/**
 * `HEAD /admin/countries/{country_id}/states` — `200` with no body, and the `ETag` the state listing's first page
 * carries.
 * @param {Client} client @param {number|string} countryId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headCountryStates(client, countryId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', countriesUrls.COUNTRY_STATES, {
        pathParams: {country_id: countryId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/countries/{country_id}/states/{state_id}` — one state of one country, beside the short parent.
 * @param {Client} client @param {number|string} countryId
 * @param {number|string} stateId the state's `id`, `code` or `name`, in any case
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CountryState>>}
 */
export function getCountryState(client, countryId, stateId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(countriesUrls.COUNTRY_STATE, {
        pathParams: {country_id: countryId, state_id: stateId},
        raiseOnError,
        responseFormat,
        dtoType: CountryState,
    });
}

/**
 * `HEAD /admin/countries/{country_id}/states/{state_id}` — `200` with no body, and the `ETag` the state's read
 * carries.
 * @param {Client} client @param {number|string} countryId @param {number|string} stateId
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCountryState(client, countryId, stateId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', countriesUrls.COUNTRY_STATE, {
        pathParams: {country_id: countryId, state_id: stateId},
        raiseOnError,
        responseFormat,
    });
}
