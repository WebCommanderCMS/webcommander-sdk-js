import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as commonSettingsUrls from './commonSettingsUrls.js';
import {CommonSettings, CustomerFields} from './commonSettingsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} CommonSettingsPayload */

const requireClient = clientCheck(
    'commonSettings.getSettings(client, {type: "general"})',
    'client.commonSettings.getSettings({type: "general"})',
);

/**
 * `GET /settings` — `{"settings": {group: [{"config_key", "value"}]}}`, every value text and secrets `***`. `type`
 * names one group, an unknown one `404`; `config_key` one key, with or without `type`. A comma list of keys matches
 * nothing and answers `{"settings": {}}`; other names, paging included, are `400`. Without `type` the answer is every
 * group, about 2 MB, and can take 30 seconds or more.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<CommonSettings>>}
 */
export function getSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(commonSettingsUrls.SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: CommonSettings,
    });
}

/**
 * `HEAD /settings` — `200` with no body. It runs the read's query, so pass a `type`: an unknown one is `404`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headSettings(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', commonSettingsUrls.SETTINGS, {
        queryParams,
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /settings` with `{"settings": {group: ...}}` — `200` and every group of the store. Only the keys sent change,
 * and one bad entry refuses the whole request with `400`. A write was measured at 5 to 53 seconds, past the default
 * 30 of `timeoutSeconds` at the slow end: build the client with a longer one.
 * @param {Client} client @param {CommonSettingsPayload} payload a `CommonSettingsInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CommonSettings>>}
 */
export function updateSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(commonSettingsUrls.SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CommonSettings,
    });
}

/**
 * `POST /settings` — the `PUT`'s body, behaviour and timing, answered `201`. A `POST` is not resent after a timeout,
 * so read the keys back before retrying.
 * @param {Client} client @param {CommonSettingsPayload} payload a `CommonSettingsInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<CommonSettings>>}
 */
export function saveSettings(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(commonSettingsUrls.SETTINGS, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: CommonSettings,
    });
}

/**
 * `GET /create-customer-fields` — the customer registration form: the active `fields` in order and every field's
 * `fields_configs`. Any query name is `400`.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<CustomerFields>>}
 */
export function getCreateCustomerFields(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(commonSettingsUrls.CREATE_CUSTOMER_FIELDS, {
        raiseOnError,
        responseFormat,
        dtoType: CustomerFields,
    });
}

/**
 * `HEAD /create-customer-fields` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headCreateCustomerFields(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', commonSettingsUrls.CREATE_CUSTOMER_FIELDS, {
        raiseOnError,
        responseFormat,
    });
}
