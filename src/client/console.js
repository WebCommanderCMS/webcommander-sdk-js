import process from 'node:process';
import {PRINT_FORMAT_COMPACT} from '../config/sdkConfig.js';
import {escapeControlCharacter} from '../controlCharacters.js';
import {redactMapping, redactValue} from '../redaction.js';

const CONTROL_RUN = new RegExp('[\\u0000-\\u0009\\u000b-\\u001f\\u007f-\\u009f\\u2028\\u2029]', 'g');
const CONTROL_RUN_WITH_NEWLINE = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u2028\\u2029]', 'g');

const UNICODE_BOX_GLYPHS = Object.freeze({top: '┌', bottom: '└', tee: '├', v: '│', h: '─', ellipsis: '…'});

/** The `TERM` value that means the terminal cannot render escapes at all. */
const DUMB_TERMINAL = 'dumb';
const ANSI_ESCAPE = '\u001b';
const ANSI_ESCAPE_START = '\u001b[';
const ANSI_RESET = '\u001b[0m';

/** Row indent. Body blocks are not indented, so a response pastes as valid JSON. */
const ROW_INDENT = '  ';

const MULTIPART_PREFIX = '<multipart: ';
const UNNAMED_FILE = 'file';
const CONTENT_TYPE_HEADER = 'Content-Type';
const JSON_CONTENT_TYPE = 'application/json';
const POSIX_SHELL_LABEL = 'POSIX shell';

/** Escape control characters from outside the SDK: a terminal acts on escapes, and U+2028 forges a line. */
function neutraliseControls(text, keepNewlines = false) {
    const pattern = keepNewlines ? CONTROL_RUN : CONTROL_RUN_WITH_NEWLINE;
    return text.replace(pattern, escapeControlCharacter);
}

function summariseBinary(value) {
    const length = value instanceof ArrayBuffer ? value.byteLength : (value.byteLength ?? value.length);
    return `<${length} bytes>`;
}

function isBinary(value) {
    return (
        value instanceof Uint8Array ||
        value instanceof ArrayBuffer ||
        value instanceof DataView ||
        (typeof Buffer !== 'undefined' && Buffer.isBuffer(value))
    );
}

/**
 * Summarise binary at any depth from the raw `this[key]`, since `JSON.stringify` calls `Buffer`'s `toJSON` first.
 * @this {Record<string, unknown> | unknown[]}
 */
function binaryReplacer(key, val) {
    const holder = /** @type {any} */ (this);
    const raw = holder && typeof holder === 'object' ? holder[key] : val;
    if (isBinary(raw)) return summariseBinary(/** @type {any} */ (raw));
    if (isBinary(val)) return summariseBinary(/** @type {any} */ (val));
    return val;
}

/** Whether a string is itself a JSON object or array document: true for `'{"a": 1}'`, false for `'42'`. */
function isJsonDocument(text) {
    const trimmed = text.replace(/^\s+/, '');
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return false;
    try {
        const parsed = JSON.parse(text);
        return parsed !== null && typeof parsed === 'object';
    } catch {
        return false;
    }
}

function collapseJsonDocument(text) {
    let out = '';
    let inString = false;
    let escaped = false;
    for (const ch of text) {
        if (inString) {
            out += ch;
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
            continue;
        }
        // The four characters JSON allows between tokens, so nothing else can be dropped.
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') continue;
        out += ch;
        if (ch === '"') inString = true;
        else if (ch === ':' || ch === ',') out += ' ';
    }
    return out;
}

/**
 * Render a value for display; a string that is already a JSON document prints as it stands, and nothing throws.
 * @param {unknown} value @param {{ compact?: boolean }} [options] @returns {string}
 */
export function renderJsonValue(value, options = {}) {
    const compact = Boolean(options.compact);
    if (value === null || value === undefined) return '<empty>';
    if (isBinary(value)) return summariseBinary(/** @type {any} */ (value));
    if (typeof value === 'string') {
        // Printed as the document it is; JSON-encoding it would give a string literal with no fields.
        if (isJsonDocument(value)) return neutraliseControls(value, !compact);
        // Compact owes the caller one line, which a text body would otherwise break.
        if (compact) return neutraliseControls(JSON.stringify(value).slice(1, -1));
        return neutraliseControls(value, true);
    }
    try {
        const rendered = compact ? JSON.stringify(value, binaryReplacer) : JSON.stringify(value, binaryReplacer, 2);
        if (rendered === undefined) return neutraliseControls(String(value), !compact);
        return neutraliseControls(rendered, !compact);
    } catch {
        return neutraliseControls(String(value), !compact);
    }
}

/**
 * Box-drawing characters the console prints.
 * @returns {Record<string, string>}
 */
export function resolveBoxGlyphs() {
    return {...UNICODE_BOX_GLYPHS};
}

/** Whether colour escapes should be emitted at all; false when piped to a file. @returns {boolean} */
export function stdoutSupportsColour() {
    if (process.env.NO_COLOR) return false;
    if (process.env.TERM === DUMB_TERMINAL) return false;
    return Boolean(process.stdout && process.stdout.isTTY);
}

/** ANSI helpers that no-op when colour is off or stdout is not a TTY. */
class Colour {
    constructor(enabled, glyphs) {
        this._enabled = enabled;
        this._glyphs = glyphs;
    }

    dim(text) {
        return this._enabled ? `\u001b[2m${text}\u001b[0m` : text;
    }

    section(label) {
        const prefix = `${this._glyphs.tee}${this._glyphs.h} ${label} `;
        return this.dim(prefix + this._glyphs.h.repeat(Math.max(4, 62 - prefix.length)));
    }

    status(text, succeeded) {
        if (!this._enabled) return text;
        return `\u001b[${succeeded ? '32' : '31'}m${text}\u001b[0m`;
    }
}

function shellQuote(s) {
    return `'${String(s).replace(/'/g, "'\\''")}'`;
}

function multipartEntries(files) {
    if (
        files &&
        typeof files === 'object' &&
        !Array.isArray(files) &&
        typeof (/** @type {any} */ (files).read) !== 'function' &&
        !isBinary(files)
    ) {
        return Object.entries(files).map(([key, value]) => multipartEntry(String(key), value));
    }
    if (Array.isArray(files)) {
        if (files.every((entry) => Array.isArray(entry) && entry.length === 2)) {
            return files.map((entry) => multipartEntry(String(entry[0]), entry[1]));
        }
        return [multipartEntry(UNNAMED_FILE, files)];
    }
    // A lone stream handle, probed rather than iterated so a one-shot container is not consumed.
    if (
        files &&
        (typeof files === 'object' || typeof files === 'function') &&
        typeof (/** @type {any} */ (files).read) === 'function'
    ) {
        return [multipartEntry(UNNAMED_FILE, files)];
    }
    return [];
}

function multipartEntry(fieldName, value) {
    let filename = null;
    let handle = value;
    if (Array.isArray(value) && value.length) {
        if (typeof value[0] === 'string') filename = value[0];
        handle = value.length > 1 ? value[1] : null;
    }
    const name = filename || (handle && /** @type {any} */ (handle).name) || UNNAMED_FILE;
    return [fieldName, String(name)];
}

/**
 * Describe what was sent without reading a byte of any upload: `{files: '<multipart: file=a.xlsx>', form: body}`.
 * @param {unknown} body @param {unknown} files @returns {unknown}
 */
export function summarisePayload(body, files) {
    const entries = multipartEntries(files);
    if (!entries.length) return body;
    const names = entries.map(([field, filename]) => `${field}=${filename}`).join(', ');
    const summary = `${MULTIPART_PREFIX}${names}>`;
    if (body === null || body === undefined) return summary;
    return {files: summary, form: body};
}

function formPart(payload) {
    if (
        payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'files' in payload &&
        'form' in payload &&
        Object.keys(payload).length === 2 &&
        String(/** @type {any} */ (payload).files).startsWith(MULTIPART_PREFIX)
    ) {
        return /** @type {any} */ (payload).form;
    }
    return payload;
}

function formFields(body) {
    if (body && typeof body === 'object' && !Array.isArray(body)) {
        return Object.entries(/** @type {Record<string, unknown>} */ (redactValue(body)));
    }
    if (Array.isArray(body) && body.length && body.every((e) => Array.isArray(e) && e.length === 2)) {
        return /** @type {Array<[string, unknown]>} */ (redactValue(body));
    }
    return [];
}

function namesTheContentType(headers) {
    return Object.keys(headers).some((name) => name.toLowerCase() === CONTENT_TYPE_HEADER.toLowerCase());
}

/**
 * A `curl` reproducing the call, single-quoted for a POSIX shell, secrets redacted: for reading, not re-issuing.
 * @param {{ method?: string, url: string, headers?: Record<string, string>, body?: unknown, files?: unknown, formEncoded?: boolean, verifySsl?: boolean, queryParams?: Record<string, unknown> }} exchange @returns {string}
 */
export function buildCurlCommand(exchange) {
    const method = exchange.method || 'GET';
    const headers = redactMapping(exchange.headers || {});
    const formEncoded = Boolean(exchange.formEncoded);
    let url = neutraliseControls(String(exchange.url));
    if (exchange.queryParams && Object.keys(exchange.queryParams).length) {
        const usp = new URLSearchParams();
        for (const [key, value] of Object.entries(exchange.queryParams)) {
            if (Array.isArray(value)) for (const item of value) usp.append(key, String(item));
            else usp.append(key, String(value));
        }
        // `%2A` back to `*` keeps the redaction marker readable.
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${usp.toString().replace(/%2A/g, '*')}`;
    }

    const parts = [`curl -X ${shellQuote(method)} ${shellQuote(url)}`];
    if (exchange.verifySsl === false) parts.push('  -k');
    for (const [key, value] of Object.entries(headers).sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
        parts.push(`  -H ${shellQuote(`${neutraliseControls(String(key))}: ${neutraliseControls(String(value))}`)}`);
    }

    const entries = multipartEntries(exchange.files);
    const body = formPart(exchange.body);
    for (const [fieldName, filename] of entries) {
        parts.push(`  -F ${shellQuote(`${neutraliseControls(fieldName)}=@${neutraliseControls(filename)}`)}`);
    }
    if (entries.length) {
        // Form fields ride in the same multipart body, so they are `-F` too.
        for (const [key, value] of formFields(body)) {
            parts.push(`  -F ${shellQuote(`${neutraliseControls(String(key))}=${neutraliseControls(String(value))}`)}`);
        }
    } else if (body !== null && body !== undefined) {
        const fields = formEncoded ? formFields(body) : [];
        if (fields.length) {
            // curl encodes each `--data-urlencode` field and sets the content type.
            for (const [key, value] of fields) {
                parts.push(
                    `  --data-urlencode ${shellQuote(`${neutraliseControls(String(key))}=${neutraliseControls(String(value))}`)}`,
                );
            }
        } else {
            const redacted = redactValue(body);
            // One line before the control guard: in single quotes a newline would forge a line; escaping breaks JSON.
            const rendered =
                typeof redacted === 'string' && isJsonDocument(redacted)
                    ? neutraliseControls(collapseJsonDocument(redacted))
                    : renderJsonValue(redacted, {compact: true});
            if (!formEncoded && !namesTheContentType(headers)) {
                // curl defaults `--data-raw` to form encoding, and honours the last `-H`.
                parts.push(`  -H ${shellQuote(`${CONTENT_TYPE_HEADER}: ${JSON_CONTENT_TYPE}`)}`);
            }
            parts.push(`  --data-raw ${shellQuote(rendered)}`);
        }
    }
    return parts.join(' \\\n');
}

/**
 * Render one exchange for the console, boxed or on one line per `config.printFormat`.
 * @param {any} response @param {unknown} body @param {unknown} files @param {any} config
 * @param {{ formEncoded?: boolean }} [options] @returns {string}
 */
export function renderExchange(response, body, files, config, options = {}) {
    const info = response.requestInfo;
    const payload = summarisePayload(body, files);
    const formEncoded = Boolean(options.formEncoded);

    if (config.printFormat === PRINT_FORMAT_COMPACT) {
        const parts = [
            'wc',
            info.clientName,
            info.httpMethod,
            info.url,
            String(response.statusCode),
            `${info.attemptCount}/${info.maxAttempts}`,
            `${info.elapsedSeconds}s`,
        ];
        if (config.printRequestPayload) parts.push(`payload=${renderJsonValue(redactValue(payload), {compact: true})}`);
        if (config.printResponseBody)
            parts.push(`response=${renderJsonValue(redactValue(response.map), {compact: true})}`);
        return truncate(parts.join(' | '), config.printMaxChars);
    }

    const glyphs = resolveBoxGlyphs();
    const colour = new Colour(Boolean(config.printColor) && stdoutSupportsColour(), glyphs);
    const lines = [colour.dim(`${glyphs.top}${glyphs.h} WebCommander ${glyphs.h.repeat(46)}`)];

    if (config.printApiInfo) {
        for (const [label, value] of [
            ['client', info.clientName],
            ['api version', info.apiVersion],
            ['method', info.httpMethod],
            ['endpoint', info.endpoint],
            ['url', info.url],
            ['params', renderJsonValue(info.queryParams, {compact: true})],
        ]) {
            lines.push(`${ROW_INDENT}${String(label).padEnd(12)} : ${neutraliseControls(String(value))}`);
        }
        lines.push(
            `${ROW_INDENT}${'status'.padEnd(12)} : ${colour.status(String(response.statusCode), Boolean(response.succeeded))}`,
        );
        lines.push(`${ROW_INDENT}${'attempt'.padEnd(12)} : ${info.attemptCount} / ${info.maxAttempts}`);
        lines.push(`${ROW_INDENT}${'elapsed'.padEnd(12)} : ${info.elapsedSeconds}s`);
    }

    if (config.printHeaders) {
        lines.push(colour.section('request headers'));
        lines.push(...headerRows(info.headers));
        lines.push(colour.section('response headers'));
        lines.push(...headerRows(redactMapping(response.headers)));
    }

    if (config.printRequestPayload && payload != null) {
        lines.push(colour.section('payload'));
        lines.push(renderJsonValue(redactValue(payload)));
    }

    if (config.printResponseBody) {
        lines.push(colour.section('response'));
        lines.push(renderJsonValue(redactValue(response.map)));
    }

    if (config.printCurl) {
        lines.push(colour.section(`curl (${POSIX_SHELL_LABEL})`));
        lines.push(
            buildCurlCommand({
                method: info.httpMethod,
                url: info.url,
                headers: info.headers,
                body: payload,
                files,
                formEncoded,
                verifySsl: config.verifySsl,
                queryParams: info.queryParams,
            }),
        );
    }

    const closing = colour.dim(glyphs.bottom + glyphs.h.repeat(61));
    return truncate(lines.join('\n'), config.printMaxChars, `\n${closing}`);
}

function headerRows(headers) {
    return Object.entries(headers)
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(
            ([key, value]) =>
                `${ROW_INDENT}${neutraliseControls(String(key)).padEnd(14)}: ${neutraliseControls(String(value))}`,
        );
}

/**
 * Cut a rendered block to `maxChars`, notice and closing frame included.
 * @param {string} text @param {number} maxChars `0` means unlimited
 * @param {string} [tail] a line that must survive the cut @returns {string}
 */
function truncate(text, maxChars, tail = '') {
    if (!maxChars || text.length + tail.length <= maxChars) return text + tail;
    const ellipsis = resolveBoxGlyphs().ellipsis;
    let reserved = tail.length + `${ellipsis} +${text.length} chars`.length;
    if (text.includes(ANSI_ESCAPE)) reserved += ANSI_RESET.length;
    const cut = Math.min(text.length, Math.max(0, maxChars - reserved));
    if (cut >= text.length) return text + tail;
    const sliced = closeColourRun(text.slice(0, cut));
    return `${sliced}${ellipsis} +${text.length - cut} chars${tail}`;
}

/** Repair an ANSI sequence a cut landed inside, so the terminal is not left dim afterwards. */
function closeColourRun(text) {
    if (!text.includes(ANSI_ESCAPE)) return text;
    const marker = text.lastIndexOf(ANSI_ESCAPE);
    let out = text;
    if (!out.slice(marker).includes('m')) out = out.slice(0, marker);
    const last = out.lastIndexOf(ANSI_ESCAPE_START);
    if (last !== -1 && !out.startsWith(ANSI_RESET, last)) return out + ANSI_RESET;
    return out;
}
