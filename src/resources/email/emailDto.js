import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The two body keys the store spells in camel case, against the snake-case keys their names would derive. */
const CAMEL_CASE_KEYS = Object.freeze({html_content: 'htmlContent', content_type: 'contentType'});

/**
 * The send body, bare and camelCase as the store takes it; `html_content` and other unknown keys are ignored.
 * `recipients`, `cc` and `bcc` hold at most 100 addresses together. Send `htmlContent` or a plugin template's
 * `identifier`, not both.
 */
export class EmailInput extends Dto {
    static FIELDS = {
        recipients: dtoList('string'),
        cc: dtoList('string'),
        bcc: dtoList('string'),
        subject: 'string',
        htmlContent: 'string',
        contentType: 'string',
        identifier: 'string',
        // The template's variables, an object of any shape.
        data: 'any',
    };

    /** @type {Array<string | null> | null} */ recipients = this.declared('recipients');
    /** @type {Array<string | null> | null} */ cc = this.declared('cc');
    /** @type {Array<string | null> | null} */ bcc = this.declared('bcc');
    /** @type {string | null} */ subject = this.declared('subject');
    /** @type {string | null} */ htmlContent = this.declared('htmlContent');
    /** @type {string | null} */ contentType = this.declared('contentType');
    /** @type {string | null} */ identifier = this.declared('identifier');
    /** @type {any} */ data = this.declared('data');

    /** @returns {Record<string, string>} */
    static fields() {
        const wireNames = Object.entries(super.fields()).map(([name, key]) => [name, CAMEL_CASE_KEYS[key] ?? key]);
        return Object.freeze(Object.fromEntries(wireNames));
    }

    /** @param {unknown} body @returns {any} */
    static fromMap(body) {
        const record = /** @type {any} */ (super.fromMap(body));
        for (const key of Object.values(CAMEL_CASE_KEYS)) {
            const value = /** @type {Record<string, unknown>} */ (body)[key];
            record[key] = typeof value === 'string' ? value : null;
        }
        return record;
    }

    /** @returns {Record<string, unknown>} */
    toMap() {
        return Object.fromEntries(
            Object.entries(super.toMap()).map(([key, value]) => [CAMEL_CASE_KEYS[key] ?? key, value]),
        );
    }
}

/** One address the store could not send to, and why, such as `send_failed`. */
export class EmailRejection extends Dto {
    static FIELDS = {
        email: 'string',
        reason: 'string',
    };

    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ reason = this.declared('reason');
}

/** The send's verdict: each list holds the addresses trimmed, a repeat in any case once. */
export class EmailSendResult extends Dto {
    static FIELDS = {
        status: 'string',
        accepted: dtoList('string'),
        rejected: dtoList(EmailRejection),
        cc: dtoList('string'),
        bcc: dtoList('string'),
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {Array<string | null> | null} */ accepted = this.declared('accepted');
    /** @type {Array<EmailRejection | null> | null} */ rejected = this.declared('rejected');
    /** @type {Array<string | null> | null} */ cc = this.declared('cc');
    /** @type {Array<string | null> | null} */ bcc = this.declared('bcc');
}

sealDtoSchema(EmailInput, EmailRejection, EmailSendResult);
