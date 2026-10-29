import {clientCheck, readCallOptions} from '../callArguments.js';
import * as transactionsUrls from './transactionsUrls.js';
import {Transaction, TransactionItemPage, TransactionPage} from './transactionsDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */

const requireClient = clientCheck(
    'transactions.listTransactions(client, {limit: 5})',
    'client.transactions.listTransactions({limit: 5})',
);

/**
 * `GET /admin/transactions` — list the numbers, ascending. `limit` (or `max`) from 1, default 20, held to 200;
 * `offset`, `page`; `transaction_no` matches exactly. `search`, `q`, `sort` and `order` change nothing.
 * @param {Client} client @param {Record<string, unknown>} [queryParams] @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<TransactionPage>>}
 */
export function listTransactions(client, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(transactionsUrls.TRANSACTIONS, {
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TransactionPage,
    });
}

/**
 * `HEAD /admin/transactions` — `200` with no body.
 * @param {Client} client @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTransactions(client, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', transactionsUrls.TRANSACTIONS, {
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/transactions/{transaction_no}` — count the records one number tagged, by type, in a bare body.
 * A number holding `/` is refused by the server in front of the API as an encoded slash, `400` HTML.
 * @param {Client} client @param {string} transactionNo matched exactly and case-sensitively
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<Transaction>>}
 */
export function getTransaction(client, transactionNo, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(transactionsUrls.TRANSACTION, {
        pathParams: {transaction_no: transactionNo},
        raiseOnError,
        responseFormat,
        dtoType: Transaction,
    });
}

/**
 * `HEAD /admin/transactions/{transaction_no}` — `200` with no body, `404` for a number no record carries.
 * @param {Client} client @param {string} transactionNo @param {CallOptions} [options]
 * @returns {Promise<ApiResponse<null>>}
 */
export function headTransaction(client, transactionNo, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', transactionsUrls.TRANSACTION, {
        pathParams: {transaction_no: transactionNo},
        raiseOnError,
        responseFormat,
    });
}

/**
 * `GET /admin/transactions/{transaction_no}/items` — the records a number tagged, newest first. `type` is optional:
 * left out, every type is listed; sent, it takes one or more of the 15 `by_type` names, comma-separated. `limit`
 * (or `max`) 1 to 200, `offset`, `page`, `detail` `slim` or `full`. A `slim` item is `type`, `id`, `stamp`,
 * `trashed` and the fields of its type, such as `name`, `sku` and `url` for a product. A number or a type with no
 * records answers `200` with `items` empty and `total` `0`, not `404`.
 * @param {Client} client @param {string} transactionNo @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<TransactionItemPage>>}
 */
export function listTransactionItems(client, transactionNo, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendGetRequest(transactionsUrls.TRANSACTION_ITEMS, {
        pathParams: {transaction_no: transactionNo},
        queryParams,
        raiseOnError,
        responseFormat,
        dtoType: TransactionItemPage,
    });
}

/**
 * `HEAD /admin/transactions/{transaction_no}/items` — `200` with no body; `type` is optional here too.
 * @param {Client} client @param {string} transactionNo @param {Record<string, unknown>} [queryParams]
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<null>>}
 */
export function headTransactionItems(client, transactionNo, queryParams = undefined, options = undefined) {
    const target = requireClient(client);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendApiRequest('HEAD', transactionsUrls.TRANSACTION_ITEMS, {
        pathParams: {transaction_no: transactionNo},
        queryParams,
        raiseOnError,
        responseFormat,
    });
}
