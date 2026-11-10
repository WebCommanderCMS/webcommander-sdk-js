import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as shippingRulesUrls from './shippingRulesUrls.js';
import {ShippingRule, ShippingRuleCount, ShippingRuleListing} from './shippingRulesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} ShippingRulePayload */

const requireClient = clientCheck(
    'shippingRules.listShippingRules(client, {search: "metro"})',
    'client.shippingRules.listShippingRules({search: "metro"})',
);

/**
 * `GET /admin/shipping_rules` — List the rules, newest first. `search` (part of the name), `shipping_class_id`, `zone_id`, `method` (the method of the rule's rate) and `handling_cost` (`with_handling` or `without_handling`) filter, each rule listed once; `sort` is `id`, `name`, `description`, `created_at`, `updated_at` or `transaction_no` with `order` `asc` or `desc`; `limit` is 1 to 100 and defaults to 20, `offset` pages. An unknown value or an id that names no record is `400`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRuleListing>>}
 */
export function listShippingRules(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRulesUrls.SHIPPING_RULES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRuleListing,
    });
}

/**
 * `HEAD /admin/shipping_rules` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRules(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRulesUrls.SHIPPING_RULES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/shipping_rules/count` — a bare `{"total": N}`. The listing's filters narrow it.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRuleCount>>}
 */
export function countShippingRules(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRulesUrls.SHIPPING_RULES_COUNT, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRuleCount,
    });
}

/**
 * `HEAD /admin/shipping_rules/count` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRulesCount(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRulesUrls.SHIPPING_RULES_COUNT, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/shipping_rules` — Create a rule, answered `201` with a `Location`. The body is wrapped in `shipping_rule` and needs `name`, unique without regard to case (`409`). A class, a rate and every zone must exist, `zones` without a repeat; a `profile_id` adds the rule to that profile. An unknown field, an `id` or an unwrapped body is `400`.
 * @param {Client} client
 * @param {ShippingRulePayload} payload a `ShippingRuleInput`, a mapping or a JSON string
 * @param {string | null} [transactionNo] sent as the `X-Transaction-No` header; left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRule>>}
 */
export function createShippingRule(client, payload, transactionNo = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(shippingRulesUrls.SHIPPING_RULES, {
        jsonBody: payload,
        headers: transactionNo == null ? undefined : {[shippingRulesUrls.TRANSACTION_NO_HEADER]: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: ShippingRule,
    });
}

/**
 * `GET /admin/shipping_rules/{shipping_rule_id}` — one rule, the row under `shipping_rule`. An id that is not plain digits, or unknown, is `404`.
 * @param {Client} client @param {number|string} shippingRuleId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<ShippingRule>>}
 */
export function getShippingRule(client, shippingRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(shippingRulesUrls.SHIPPING_RULE, {
        pathParams: {shipping_rule_id: shippingRuleId},
        raiseOnError,
        responseFormat,
        dtoType: ShippingRule,
    });
}

/**
 * `HEAD /admin/shipping_rules/{shipping_rule_id}` — `200` with no body, `404` for an unknown id.
 * @param {Client} client @param {number|string} shippingRuleId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headShippingRule(client, shippingRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', shippingRulesUrls.SHIPPING_RULE, {
        pathParams: {shipping_rule_id: shippingRuleId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/shipping_rules/{shipping_rule_id}` — Replace one rule. `name`, `description`, `shipping_class`, `shipping_rate` and `zones` are all required; the first three may be `null` and `zones` `[]`. The rate and the zones themselves stay.
 * @param {Client} client @param {number|string} shippingRuleId
 * @param {ShippingRulePayload} payload a `ShippingRuleInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRule>>}
 */
export function updateShippingRule(client, shippingRuleId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(shippingRulesUrls.SHIPPING_RULE, {
        pathParams: {shipping_rule_id: shippingRuleId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRule,
    });
}

/**
 * `PATCH /admin/shipping_rules/{shipping_rule_id}` — Change only the fields sent. `zones` is the full list, so `[]` takes every zone off; `shipping_rate` and `shipping_class` `null` take the rate or the class off. The records themselves stay.
 * @param {Client} client @param {number|string} shippingRuleId
 * @param {ShippingRulePayload} payload a `ShippingRuleInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<ShippingRule>>}
 */
export function patchShippingRule(client, shippingRuleId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPatchRequest(shippingRulesUrls.SHIPPING_RULE, {
        pathParams: {shipping_rule_id: shippingRuleId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: ShippingRule,
    });
}

/**
 * `DELETE /admin/shipping_rules/{shipping_rule_id}` — `204`. Its rate and zones stay. A rule on a profile is `409` until it is taken off.
 * @param {Client} client @param {number|string} shippingRuleId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteShippingRule(client, shippingRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(shippingRulesUrls.SHIPPING_RULE, {
        pathParams: {shipping_rule_id: shippingRuleId},
        raiseOnError,
        responseFormat,
    });
}
