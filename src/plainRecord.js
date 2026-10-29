/** Whether a value is a plain object, not an array, a typed array or a class instance. @param {unknown} value */
export function isPlainRecord(value) {
    if (value === null || typeof value !== 'object') return false;
    if (Array.isArray(value) || ArrayBuffer.isView(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
