import {clientCheck, readCallOptions} from '../callArguments.js';
import * as citiesUrls from './citiesUrls.js';
import {CityPage} from './citiesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const requireClient = clientCheck(
    'cities.listCities(client, {search: "town", limit: 10})',
    'client.cities.listCities({search: "town", limit: 10})',
);

/**
 * `GET /app/cities` — list the cities, by state, post code and name unless `sort` says otherwise. `limit` is the
 * page size, 1 to 100 and 100 when absent; `offset` the start. `country` takes a country id or two-letter code,
 * `state` a state id or, beside `country`, a state code; `post_code` matches exactly and `search` a substring of
 * `name` in any case. `sort` is `state`, `name` or `post_code`, `order` `asc` or `desc`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CityPage>>}
 */
export function listCities(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(citiesUrls.CITIES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CityPage,
    });
}

/**
 * `HEAD /app/cities` — `200` with the listing's headers, its `ETag` among them, and no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCities(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', citiesUrls.CITIES, {
        raiseOnError,
        responseFormat,
    });
}
