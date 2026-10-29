import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as taxRulesUrls from './taxRulesUrls.js';
import {TaxRule, TaxRulePage} from './taxRulesDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template [T=any] @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} TaxRulePayload */

const requireClient = clientCheck(
    'taxRules.listTaxRules(client, {limit: 5})',
    'client.taxRules.listTaxRules({limit: 5})',
);

/**
 * `GET /admin/tax_rules` — list the tax rules; `limit` is capped at 100, so page on `pagination.total`.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TaxRulePage>>}
 */
export function listTaxRules(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxRulesUrls.TAX_RULES, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TaxRulePage,
    });
}

/**
 * `HEAD /admin/tax_rules` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTaxRules(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxRulesUrls.TAX_RULES, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `POST /admin/tax_rules` — create a tax rule inside the `tax_rule` wrapper.
 * @param {Client} client @param {TaxRulePayload} payload a `TaxRuleInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxRule>>}
 */
export function createTaxRule(client, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(taxRulesUrls.TAX_RULES, {
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxRule,
    });
}

/**
 * `GET /admin/tax_rules/{tax_rule_id}` — one tax rule, under the singular key.
 * @param {Client} client @param {number|string} taxRuleId a row's `id`
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxRule>>}
 */
export function getTaxRule(client, taxRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(taxRulesUrls.TAX_RULE, {
        pathParams: {tax_rule_id: taxRuleId},
        raiseOnError,
        responseFormat,
        dtoType: TaxRule,
    });
}

/**
 * `HEAD /admin/tax_rules/{tax_rule_id}` — `200` even for an unknown id, so it is no existence check.
 * @param {Client} client @param {number|string} taxRuleId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headTaxRule(client, taxRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', taxRulesUrls.TAX_RULE, {
        pathParams: {tax_rule_id: taxRuleId},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `PUT /admin/tax_rules/{tax_rule_id}` — merge into one tax rule, discarding what the create discards.
 * `PATCH` is not handled.
 * @param {Client} client @param {number|string} taxRuleId
 * @param {TaxRulePayload} payload a `TaxRuleInput`, a mapping or a JSON string
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TaxRule>>}
 */
export function updateTaxRule(client, taxRuleId, payload, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPutRequest(taxRulesUrls.TAX_RULE, {
        pathParams: {tax_rule_id: taxRuleId},
        jsonBody: payload,
        raiseOnError,
        responseFormat,
        dtoType: TaxRule,
    });
}

/**
 * `DELETE /admin/tax_rules/{tax_rule_id}` — `204`, hard; confirm it by a read, as straight after a refusal it
 * answers that refusal and removes nothing.
 * @param {Client} client @param {number|string} taxRuleId @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function deleteTaxRule(client, taxRuleId, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendDeleteRequest(taxRulesUrls.TAX_RULE, {
        pathParams: {tax_rule_id: taxRuleId},
        raiseOnError,
        responseFormat,
    });
}
