/** The five C0 characters with a familiar spelling. @type {Record<number, string>} */
const SHORT_ESCAPES = {
    8: '\\b',
    9: '\\t',
    10: '\\n',
    12: '\\f',
    13: '\\r',
};

/** Escape one control character; `JSON.stringify` escapes nothing at or above U+0020. @param {string} ch @returns {string} */
export function escapeControlCharacter(ch) {
    const code = ch.charCodeAt(0);
    const short = SHORT_ESCAPES[code];
    if (short) return short;
    if (code <= 0xff) return `\\x${code.toString(16).padStart(2, '0')}`;
    return `\\u${code.toString(16).padStart(4, '0')}`;
}
