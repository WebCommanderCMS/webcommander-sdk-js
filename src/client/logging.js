import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {SdkConfigError} from '../errors.js';

/** Numeric severities, on the conventional 10-to-50 scale. */
export const LOG_LEVELS = Object.freeze({
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
});

const LEVEL_NAMES = Object.freeze(Object.fromEntries(Object.entries(LOG_LEVELS).map(([name, value]) => [value, name])));

/** The name of a numeric level, e.g. `levelName(20) === 'INFO'`. @param {number} level @returns {string} */
export function levelName(level) {
    return LEVEL_NAMES[level] || String(level);
}

/** Resolve a level given as a name or a number: `'info'` and `20` both give 20. @param {string | number} level @returns {number} */
export function resolveLevel(level) {
    if (typeof level === 'number') return level;
    return LOG_LEVELS[String(level).toUpperCase()] ?? LOG_LEVELS.WARNING;
}

/**
 * @typedef {object} LogRecord
 * @property {string} loggerName e.g. `webcommander.default`
 * @property {string} clientName the configured instance label, unescaped
 * @property {number} level numeric severity
 * @property {string} levelName severity name
 * @property {string} message the already-redacted message
 * @property {Date} timestamp when the record was emitted
 */

/**
 * A subscriber. The record it is handed is a frozen copy of its own — see {@link emitLogRecord}.
 * @typedef {(record: Readonly<LogRecord>) => void} LogSink
 */

/** @type {Set<{ fn: LogSink, loggerName: string | null, level: number }>} */
const SINKS = new Set();

/**
 * Subscribe to every record the SDK emits. A sink that throws is ignored.
 * @param {LogSink} fn
 * @param {{ loggerName?: string | null, level?: string | number }} [options] one logger only; `level` defaults to `DEBUG`
 * @returns {() => void} an unsubscribe function
 */
export function addLogSink(fn, options = {}) {
    if (typeof fn !== 'function') {
        throw new SdkConfigError('addLogSink: expected a function to receive log records');
    }
    const entry = {
        fn,
        loggerName: options.loggerName ?? null,
        level: resolveLevel(options.level ?? LOG_LEVELS.DEBUG),
    };
    SINKS.add(entry);
    return () => SINKS.delete(entry);
}

/** Deliver one record to every interested sink. @param {Readonly<LogRecord>} record */
export function emitLogRecord(record) {
    for (const entry of SINKS) {
        if (entry.level > record.level) continue;
        if (entry.loggerName !== null && entry.loggerName !== record.loggerName) continue;
        try {
            entry.fn(Object.freeze({...record, timestamp: new Date(record.timestamp.getTime())}));
        } catch {
            // A sink must never break the call that produced the record.
        }
    }
}

/** One log line: `2026-08-12T09:15:04.001Z INFO webcommander.default GET /x -> 200`. @param {Readonly<LogRecord>} record @returns {string} */
export function formatLogLine(record) {
    return `${record.timestamp.toISOString()} ${record.levelName} ${record.loggerName} ${record.message}`;
}

/**
 * @typedef {object} LogFileHandle
 * @property {string} loggerName
 * @property {string} filePath
 * @property {number} level
 */

/** Ref-counted file handlers, keyed by logger name — one file per logger. */
const LOG_FILE_USERS = new Map();

/**
 * Claim a file handler for one logger, sharing an existing one when the path matches.
 * @param {string} loggerName @param {string} clientName @param {string} filePath @param {number} level
 * @returns {LogFileHandle}
 */
export function attachLogFile(loggerName, clientName, filePath, level) {
    const target = path.resolve(filePath);
    const existing = LOG_FILE_USERS.get(loggerName);
    if (existing && existing.filePath !== target) {
        throw new SdkConfigError(
            `logFile: clientName ${JSON.stringify(clientName)} already logs to ${JSON.stringify(existing.filePath)}, so ` +
                `adding ${JSON.stringify(target)} would write every record from both clients into both files — give this ` +
                'client its own clientName, or close the first one first',
        );
    }
    try {
        fs.mkdirSync(path.dirname(target), {recursive: true});
        // Open reports an unwritable path; the empty write reports a directory, which Windows lets open.
        const descriptor = fs.openSync(target, 'a');
        try {
            fs.writeSync(descriptor, '');
        } finally {
            fs.closeSync(descriptor);
        }
    } catch (error) {
        throw new SdkConfigError(
            `logFile ${JSON.stringify(filePath)} cannot be opened: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
    if (existing) existing.count += 1;
    else LOG_FILE_USERS.set(loggerName, {filePath: target, count: 1});
    return {loggerName, filePath: target, level};
}

/** Release a claim on a file handler; the last release drops it. @param {LogFileHandle | null} handle */
export function detachLogFile(handle) {
    if (!handle) return;
    const existing = LOG_FILE_USERS.get(handle.loggerName);
    if (!existing) return;
    existing.count -= 1;
    if (existing.count <= 0) LOG_FILE_USERS.delete(handle.loggerName);
}

/** Files whose first write failure has already been reported. @type {Set<string>} */
const LOG_FILE_FAILURES = new Set();

/** Append one record to a claimed file. @param {LogFileHandle | null} handle @param {Readonly<LogRecord>} record */
export function writeLogFileRecord(handle, record) {
    if (!handle) return;
    if (handle.level > record.level) return;
    try {
        fs.appendFileSync(handle.filePath, `${formatLogLine(record)}\n`);
        LOG_FILE_FAILURES.delete(handle.filePath);
    } catch (error) {
        if (LOG_FILE_FAILURES.has(handle.filePath)) return;
        LOG_FILE_FAILURES.add(handle.filePath);
        process.emitWarning(
            `logFile ${handle.filePath} could not be appended to (${error instanceof Error ? error.message : String(error)}); ` +
                'records for it are being dropped. The API calls themselves are unaffected. This is reported once ' +
                'per file until a write succeeds',
            {type: 'SdkLogFileWarning'},
        );
    }
}
