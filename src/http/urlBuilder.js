import {SdkUsageError} from '../errors.js';
import {REDACTED} from '../redaction.js';

const PLACEHOLDER_PATTERN = /\{([a-z_][a-z0-9_]*)\}/g;
const QUERY_OR_FRAGMENT_PATTERN = /[?#]/;
const REDACTED_PARAMETER = new RegExp(`[?#&]([^?#&=]*)=${REDACTED.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[&#]|$)`);
const IMPLIED_PORTS = {http: 80, https: 443};

/** Percent-encode a path segment with an empty safe set. @param {string} text @returns {string} */
function quoteSegment(text) {
    return encodeURIComponent(text).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Split a template into its path and any query string it carries. @param {string} pathTemplate @returns {[string, string]} */
function splitPathTemplate(pathTemplate) {
    const boundary = pathTemplate.search(QUERY_OR_FRAGMENT_PATTERN);
    if (boundary < 0) return [pathTemplate, ''];
    return [pathTemplate.slice(0, boundary), pathTemplate.slice(boundary)];
}

/** The `{name}` placeholders in a template, first-seen order. @param {string} pathTemplate @returns {string[]} */
export function findPathParamNames(pathTemplate) {
    const [template] = splitPathTemplate(pathTemplate);
    const seen = [];
    for (const match of template.matchAll(PLACEHOLDER_PATTERN)) {
        if (!seen.includes(match[1])) seen.push(match[1]);
    }
    return seen;
}

/** Whether a path value is empty enough to collapse the URL into a different endpoint. @param {unknown} value */
function blankPathParam(value) {
    return value === null || value === undefined || (typeof value === 'string' && !value.trim());
}

/**
 * Whether a value can stand in for a path segment: text, an integer or a `BigInt` (ids pass 2^53), never a boolean.
 * @param {unknown} value
 */
function usablePathParam(value) {
    if (typeof value === 'string') return true;
    if (typeof value === 'bigint') return true;
    return typeof value === 'number' && Number.isInteger(value);
}

/** The text form of a path value, ready to be escaped into the template. @param {unknown} value */
function pathParamText(value) {
    return typeof value === 'string' ? value.trim() : String(value);
}

/**
 * Fill `{name}` placeholders, reporting every missing, blank, unknown, wrong-typed, inexact or dot-only one
 * in one `SdkUsageError` before encoding; `.hidden` and `a..b` are ordinary identifiers.
 * @param {string} pathTemplate @param {Record<string, unknown> | null} [pathParams] @returns {string}
 */
export function substitutePathParams(pathTemplate, pathParams = null) {
    const [template, queryAndFragment] = splitPathTemplate(pathTemplate);
    const expected = findPathParamNames(pathTemplate);
    const supplied = {...(pathParams || {})};

    /** @type {string[]} */
    const problems = [];
    const missing = expected.filter((name) => !(name in supplied));
    if (missing.length) problems.push(`missing path params: ${[...missing].sort().join(', ')}`);
    const unknown = Object.keys(supplied).filter((name) => !expected.includes(name));
    if (unknown.length) problems.push(`unknown path params: ${[...unknown].sort().join(', ')}`);
    const given = expected.filter((name) => name in supplied);
    const blank = given.filter((name) => blankPathParam(supplied[name]));
    if (blank.length) problems.push(`blank path params: ${[...blank].sort().join(', ')}`);
    const wrongTyped = given
        .filter((name) => !blank.includes(name) && !usablePathParam(supplied[name]))
        .map((name) => `${name} (${typeof supplied[name]})`);
    if (wrongTyped.length) problems.push(`wrong-typed path params: ${[...wrongTyped].sort().join(', ')}`);
    // Named without its value: a path parameter is an id, and an id is customer data.
    const inexact = given.filter(
        (name) => !blank.includes(name) && typeof supplied[name] === 'number' && !Number.isSafeInteger(supplied[name]),
    );
    if (inexact.length) {
        problems.push(
            `inexact path params: ${[...inexact].sort().join(', ')} (pass a BigInt or a string past 2**53 - 1)`,
        );
    }
    const dotOnly = given.filter(
        (name) =>
            !blank.includes(name) && usablePathParam(supplied[name]) && /^\.+$/.test(pathParamText(supplied[name])),
    );
    if (dotOnly.length) problems.push(`dot-only path params: ${[...dotOnly].sort().join(', ')}`);
    if (problems.length) throw new SdkUsageError(`${pathTemplate} -> ${problems.join('; ')}`);

    const substituted = template.replace(PLACEHOLDER_PATTERN, (_, name) => {
        try {
            return quoteSegment(pathParamText(supplied[name]));
        } catch {
            // `encodeURIComponent` throws a bare `URIError` on an unpaired surrogate.
            throw new SdkUsageError(
                `${pathTemplate} -> path param ${name} cannot be percent-encoded: it holds a lone surrogate, which ` +
                    'is not a character any URL can carry',
            );
        }
    });
    if (substituted.includes('{') || substituted.includes('}')) {
        // The template, never the substituted path, which carries the ids that filled it.
        throw new SdkUsageError(
            `${pathTemplate} -> malformed placeholder: a brace survived substitution, so this is not the endpoint ` +
                'the template names — check the braces in the path',
        );
    }
    return substituted + queryAndFragment;
}

/** Refusal of a URL that will not parse. @param {string} label @param {string} url @returns {SdkUsageError} */
function unparsableUrl(label, url) {
    return new SdkUsageError(
        `${label}: is not a URL this SDK can parse — its scheme, authority or port is not usable. Pass a link the ` +
            'store composed, or a path relative to the configured base URL',
        {details: {[label]: url}},
    );
}

/** Scheme, lower-cased host and port, with the scheme's implied port filled in. @param {string} label @param {string} url @returns {[string, string, number | null]} */
function splitOrigin(label, url) {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        throw unparsableUrl(label, url);
    }
    const scheme = parsed.protocol.replace(/:$/, '').toLowerCase();
    const explicitPort = parsed.port ? Number(parsed.port) : null;
    const port = explicitPort ?? IMPLIED_PORTS[/** @type {'http'|'https'} */ (scheme)] ?? null;
    return [scheme, (parsed.hostname || '').toLowerCase(), port];
}

/**
 * Refuse an absolute URL off the configured origin, or carrying userinfo.
 * @param {string} baseUrl @param {string} url
 */
function requireSameOrigin(baseUrl, url) {
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        throw unparsableUrl('path', url);
    }
    if (parsed.username || parsed.password) {
        throw new SdkUsageError(
            'path: the absolute URL carries credentials in its userinfo, which would replace the bearer token; ' +
                'strip the userinfo before following it',
            {details: {path: url}},
        );
    }
    const a = splitOrigin('path', url);
    const b = splitOrigin('baseUrl', baseUrl);
    const differs = ['scheme', 'host', 'port'].filter((_, index) => a[index] !== b[index]);
    if (differs.length) {
        throw new SdkUsageError(
            `path: the absolute URL is not on the configured origin — its ${differs.join(' and ')} ${
                differs.length > 1 ? 'differ' : 'differs'
            }. An absolute URL is requested with the access token attached, so only the store's own links may be ` +
                'passed back',
            {details: {path: url, baseUrl}},
        );
    }
}

/** Refuse a request target carrying a fragment. @param {string} target @param {string} label */
function rejectFragment(target, label) {
    const marker = target.indexOf('#');
    if (marker < 0) return;
    throw new SdkUsageError(`${label}: carries a fragment at index ${marker}; remove it or encode # as %23`);
}

/** Refuse a request target carrying the redaction marker — it is a printed copy. @param {string} target @param {string} label */
function rejectRedactedValue(target, label) {
    const found = REDACTED_PARAMETER.exec(target);
    if (!found) return;
    throw new SdkUsageError(
        `${label}: ${JSON.stringify(found[1])} holds the redaction marker; this URL is a printed copy`,
    );
}

/**
 * Refuse a request target with a fragment or a redacted value.
 * @param {string} target @param {string} [label] @returns {string} @throws {SdkUsageError}
 */
export function refuseUnsendableUrl(target, label = 'url') {
    if (typeof target !== 'string') {
        throw new SdkUsageError(`${label}: expected a string request target, got ${typeof target}`);
    }
    rejectFragment(target, label);
    rejectRedactedValue(target, label);
    return target;
}

/** Join a base URL and a path. @param {string} baseUrl @param {string} path @returns {string} */
export function buildUrl(baseUrl, path) {
    refuseUnsendableUrl(path, 'path');
    const lower = path.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
        requireSameOrigin(baseUrl, path);
        return path;
    }
    return baseUrl.replace(/\/+$/, '') + (path.startsWith('/') ? '' : '/') + path;
}
