import {clientCheck, readCallOptions, requirePayload} from '../callArguments.js';
import * as emailUrls from './emailUrls.js';
import {EmailSendResult} from './emailDto.js';

/** @typedef {import('../../client/webCommanderClient.js').WebCommanderClient} Client */
/** @template T @typedef {import('../../client/apiResponse.js').ApiResponse<T>} ApiResponse */
/** @typedef {{ raiseOnError?: boolean | null, responseFormat?: 'map' | 'json' | 'dto' | null }} CallOptions */
/** @typedef {Record<string, unknown> | string | {toMap: () => Record<string, unknown>}} EmailPayload */

const requireClient = clientCheck(
    'email.sendEmail(client, {recipients: ["someone@example.com"], subject: "Hi", htmlContent: "Hi"})',
    'client.email.sendEmail({recipients: ["someone@example.com"], subject: "Hi", htmlContent: "Hi"})',
);

/**
 * `POST /admin/email/send` — send an email, answered `200` once every message is sent. A bare body: `recipients`
 * and `subject`, with `htmlContent` or a template `identifier` and its `data`. Past 500 addresses a day per sender
 * the store answers `429` until 00:00 UTC; a body over 1048576 bytes is `413`. A send the mail server fails is
 * `502`, `status` `failed`, each address in `rejected`.
 * @param {Client} client
 * @param {EmailPayload} payload an `EmailInput`, a mapping or a JSON string
 * @param {string | null} [pluginUuid] sent as the `plugin_uuid` header a template send needs; it switches the call
 * to plugin auth, so an admin token is `401`. Left out or `null`, none is sent
 * @param {CallOptions} [options] @returns {Promise<ApiResponse<EmailSendResult>>}
 */
export function sendEmail(client, payload, pluginUuid = undefined, options = undefined) {
    const target = requireClient(client);
    requirePayload(payload);
    const {raiseOnError, responseFormat} = readCallOptions(options);
    return target.sendPostRequest(emailUrls.EMAIL_SEND, {
        jsonBody: payload,
        headers: pluginUuid == null ? undefined : {[emailUrls.PLUGIN_UUID_HEADER]: pluginUuid},
        raiseOnError,
        responseFormat,
        dtoType: EmailSendResult,
    });
}
