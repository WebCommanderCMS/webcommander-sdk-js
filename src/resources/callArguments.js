import {SdkUsageError} from '../errors.js';
import {isPlainRecord} from '../plainRecord.js';

function describeValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'an array';
    const named = /** @type {any} */ (value).constructor;
    if (typeof value === 'object' && named && typeof named.name === 'string' && named.name) return `a ${named.name}`;
    return `a ${typeof value}`;
}

export function clientCheck(moduleCall, boundCall) {
    return function requireClient(client) {
        if (client == null) {
            throw new SdkUsageError(
                `client is required: these functions take the WebCommanderClient first, as in ${moduleCall} — or ` +
                    `drop the argument and use the bound style, ${boundCall}`,
            );
        }
        if (typeof (/** @type {any} */ (client).sendApiRequest) !== 'function') {
            throw new SdkUsageError(
                `client: expected a WebCommanderClient, got ${describeValue(client)} — these functions take the client ` +
                    `first, as in ${moduleCall}`,
            );
        }
        return client;
    };
}

export function readCallOptions(options) {
    try {
        const {raiseOnError = null, responseFormat = null} = /** @type {any} */ (options === undefined ? {} : options);
        return {raiseOnError, responseFormat};
    } catch (error) {
        throw new SdkUsageError(
            `options: expected an object such as {raiseOnError: true}, got ${describeValue(options)} — omit the ` +
                'argument entirely to take the client-wide default',
            {cause: error},
        );
    }
}

export function requirePayload(payload) {
    if (payload === null || payload === undefined) {
        throw new SdkUsageError(
            'payload is required: this endpoint takes a body, and null would send the request with no body at all',
        );
    }
}

/** Field count, or `-1` when sizing would consume a one-shot upload. @param {unknown} files @returns {number} */
function countFileFields(files) {
    if (files instanceof Map) return files.size;
    if (Array.isArray(files)) return files.length;
    if (isPlainRecord(files)) return Object.keys(files).length;
    return -1;
}

export function requireFiles(files, example) {
    if (files === null || files === undefined) throw new SdkUsageError(`files is required: pass ${example}`);
    if (countFileFields(files) === 0) throw new SdkUsageError(`files is empty: pass ${example}`);
}
