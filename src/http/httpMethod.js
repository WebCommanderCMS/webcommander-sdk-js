import {SdkUsageError} from '../errors.js';

/** An HTTP method token, per RFC 9110. A value that is not one is unsafe and not idempotent. */
const HTTP_METHOD_TOKEN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

export function httpMethodName(method) {
    if (typeof method !== 'string') return null;
    const name = method.trim().toUpperCase();
    return HTTP_METHOD_TOKEN.test(name) ? name : null;
}

/** Normalise and validate the HTTP verb before any I/O; `'GET\r\nX: y'` would forge a request line. */
export function requireHttpMethod(httpMethod) {
    if (typeof httpMethod !== 'string' || !httpMethod.trim()) {
        throw new SdkUsageError(
            `httpMethod: expected a non-blank string like 'GET', got ${JSON.stringify(httpMethod)}`,
        );
    }
    const method = httpMethodName(httpMethod);
    if (method === null) {
        throw new SdkUsageError(
            `httpMethod: ${JSON.stringify(httpMethod)} is not an HTTP method — a method is one token of ` +
                'letters, digits and the punctuation RFC 9110 allows, with no spaces or control characters',
        );
    }
    return method;
}
