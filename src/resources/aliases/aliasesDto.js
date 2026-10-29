import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One alias, a listing row or a create's answer; `alias` is the hostname. */
export class Alias extends Dto {
    static ENVELOPE_KEY = 'alias';

    static FIELDS = {
        id: 'int',
        alias: 'string',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ alias = this.declared('alias');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The create body, `{"alias": "<hostname>"}`, bare: a wrapped hostname is `400 invalid_hostname`. */
export class AliasInput extends Dto {
    static FIELDS = {
        alias: 'string',
    };

    /** @type {string | null} */ alias = this.declared('alias');
}

/** The listing's five-key `pagination` block; `limit` is the size the store applied. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        hasNext: 'boolean',
        hasPrevious: 'boolean',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
}

/** One page of the listing. */
export class AliasPage extends Dto {
    static FIELDS = {
        aliases: dtoList(Alias),
        pagination: Pagination,
    };

    /** @type {Array<Alias | null> | null} */ aliases = this.declared('aliases');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(Alias, AliasInput, Pagination, AliasPage);
