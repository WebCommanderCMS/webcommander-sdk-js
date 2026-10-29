import {SdkError, SdkUsageError} from '../errors.js';
import {pathTemplateOf, resolvedRequestUrl} from './apiResponse.js';
import {isPlainRecord} from '../plainRecord.js';

const PAGINATION_KEY = 'pagination';
const NEXT_PAGE_KEY = 'next_page';

/** The `pagination.next_page` URL, or null on the last page. @param {unknown} data @returns {string | null} */
function readNextPage(data) {
    if (!isPlainRecord(data)) return null;
    const pagination = /** @type {Record<string, unknown>} */ (data)[PAGINATION_KEY];
    if (!isPlainRecord(pagination)) return null;
    const nextPage = /** @type {Record<string, unknown>} */ (pagination)[NEXT_PAGE_KEY];
    if (typeof nextPage === 'string' && nextPage.trim()) return nextPage;
    return null;
}

/**
 * The form a URL is compared in when deciding whether this walk has been here before.
 * @param {unknown} url @param {string} [base] @returns {string}
 */
function canonicalPageUrl(url, base = '') {
    const text = String(url ?? '').trim();
    try {
        const parsed = base ? new URL(text, base) : new URL(text);
        parsed.hash = '';
        return parsed.href;
    } catch {
        return `unparsed:${text}`;
    }
}

/** @typedef {import('./webCommanderClient.js').WebCommanderClient} Client */

/**
 * Yield one `ApiResponse` per page, following `pagination.next_page` to the end. `queryParams`
 * applies to the first request only, and a repeated URL throws.
 * @param {Client} client @param {string} path
 * @param {{ queryParams?: Record<string, unknown>, maxPages?: number | null, raiseOnError?: boolean }} [options]
 * @returns {AsyncGenerator<any>}
 */
export async function* iterPages(client, path, options = {}) {
    const {queryParams = null, maxPages = null, raiseOnError = true} = options;
    if (maxPages !== null && (!Number.isInteger(maxPages) || maxPages < 1)) {
        throw new SdkUsageError(`maxPages: expected a positive integer or null, got ${JSON.stringify(maxPages)}`);
    }

    /** @type {Set<string>} */
    const visited = new Set();
    let pagesYielded = 0;
    let response = await client.sendGetRequest(path, {queryParams, raiseOnError});
    let currentUrl = resolvedRequestUrl(response.requestInfo) || String(path);
    visited.add(canonicalPageUrl(currentUrl));
    const template = (response.requestInfo && response.requestInfo.endpoint) || pathTemplateOf(path) || '';
    for (;;) {
        yield response;
        pagesYielded += 1;
        if (!response.succeeded) return;
        if (maxPages !== null && pagesYielded >= maxPages) return;
        // `map`, not `data`: following a listing must not depend on the configured response form.
        const nextPage = readNextPage(response.map);
        if (nextPage === null) return;
        // Resolved against the page it was found on, which is what a relative link means.
        const key = canonicalPageUrl(nextPage, currentUrl);
        if (visited.has(key)) throw paginationLoop(pagesYielded, template);
        visited.add(key);
        response = await client.sendGetRequest(nextPage, {raiseOnError});
        currentUrl = resolvedRequestUrl(response.requestInfo) || nextPage;
        const reached = canonicalPageUrl(currentUrl);
        if (reached !== key) {
            if (visited.has(reached)) throw paginationLoop(pagesYielded, template);
            visited.add(reached);
        }
    }
}

/**
 * The refusal for a listing that points back at a page this walk already followed.
 * @param {number} pagesYielded @param {string} template @returns {SdkError}
 */
function paginationLoop(pagesYielded, template) {
    return new SdkError(`pagination loop after ${pagesYielded} page(s) of ${template}`);
}

/** The kind of a page body for the error message, distinguishing what `typeof` cannot. @param {unknown} data @returns {string} */
function bodyKind(data) {
    if (data === null) return 'null';
    if (Array.isArray(data)) return 'array';
    if (data instanceof Uint8Array) return 'Uint8Array';
    return typeof data;
}

/**
 * Yield each record of a listing, across every page — `iterPages` with the envelope unwrapped.
 * @param {Client} client @param {string} path
 * @param {string} recordKey the envelope key holding the records, e.g. `'customers'`
 * @param {{ queryParams?: Record<string, unknown>, maxPages?: number | null }} [options]
 * @returns {AsyncGenerator<any>}
 */
export async function* iterRecords(client, path, recordKey, options = {}) {
    if (typeof recordKey !== 'string' || !recordKey.trim()) {
        throw new SdkUsageError(
            `recordKey: expected the envelope key holding the records, like 'customers', got ${JSON.stringify(recordKey)}`,
        );
    }
    for await (const page of iterPages(client, path, {
        queryParams: options.queryParams ?? null,
        maxPages: options.maxPages ?? null,
        raiseOnError: true,
    })) {
        const data = page.map;
        const records = isPlainRecord(data) ? data[recordKey] : null;
        if (!Array.isArray(records)) {
            const available = isPlainRecord(data) ? Object.keys(data).sort().join(', ') : `a ${bodyKind(data)} body`;
            throw new SdkUsageError(
                `recordKey ${JSON.stringify(recordKey)}: this page has no array under that key; it carries ${available}`,
            );
        }
        yield* records;
    }
}
