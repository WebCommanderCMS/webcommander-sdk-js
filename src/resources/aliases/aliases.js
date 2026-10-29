import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as aliasesUrls from './aliasesUrls.js';
import {Alias, AliasPage} from './aliasesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} AliasPayload */

const requireClient = clientCheck('aliases.listAliases(client, {limit: 5})', 'client.aliases.listAliases({limit: 5})');

/**
 * `GET /admin/aliases` — list the aliases, a created row listed last.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<AliasPage>>}
 */
export function listAliases(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(aliasesUrls.ALIASES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: AliasPage,
    });
}

/**
 * `HEAD /admin/aliases` — ask whether the collection answers; `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headAliases(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', aliasesUrls.ALIASES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/aliases` — create an alias, `{"alias": "<hostname>"}` bare, `201` with the row under `alias`.
 * @param {Client} client @param {AliasPayload} payload an `AliasInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Alias>>}
 */
export function createAlias(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(aliasesUrls.ALIASES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: Alias,
    });
}

/**
 * `DELETE /admin/aliases/{alias_id}` — `204` and hard.
 * @param {Client} client @param {number|string} aliasId a row's `id` @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteAlias(client, aliasId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(aliasesUrls.ALIAS, {
        pathParams: {alias_id: aliasId},
        raiseOnError,
        responseFormat,
    });
}
