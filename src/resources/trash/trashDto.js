import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/**
 * One trashed row, and the `item` a restore answers. `type` is the snake_case name `types` answers; `removedAt` is
 * when the row was trashed, in UTC; `url` is the record's own path, `null` for a `blog_post`. A restore and a bulk
 * delete send no `removed_at`.
 */
export class TrashItem extends Dto {
    static ENVELOPE_KEY = 'item';

    static FIELDS = {
        type: 'string',
        id: 'int',
        name: 'string',
        removedAt: 'string',
        url: 'string',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ removedAt = this.declared('removedAt');
    /** @type {string | null} */ url = this.declared('url');
}

/** The five-key `pagination` block; there is no next-page link, so step `offset`. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        hasPrevious: 'boolean',
        hasNext: 'boolean',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
}

/** One page of the listing: the rows under `items` and where they sit. */
export class TrashPage extends Dto {
    static FIELDS = {
        items: dtoList(TrashItem),
        pagination: Pagination,
    };

    /** @type {Array<TrashItem | null> | null} */ items = this.declared('items');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** One type the trash holds, as a path's `{trash_type}` takes it. */
export class TrashType extends Dto {
    static FIELDS = {
        type: 'string',
    };

    /** @type {string | null} */ type = this.declared('type');
}

/** The `types` body: every type, alphabetical. */
export class TrashTypeList extends Dto {
    static FIELDS = {
        types: dtoList(TrashType),
    };

    /** @type {Array<TrashType | null> | null} */ types = this.declared('types');
}

/** One item a bulk call could not act on: an error `code` such as `not_found` or `not_in_trash`, and why in words. */
export class TrashBulkError extends Dto {
    static FIELDS = {
        type: 'string',
        id: 'int',
        code: 'string',
        message: 'string',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ message = this.declared('message');
}

/** The bulk restore's body: the rows restored, and an entry per failed item. */
export class TrashBulkRestoreResult extends Dto {
    static FIELDS = {
        restored: dtoList(TrashItem),
        failed: dtoList(TrashBulkError),
    };

    /** @type {Array<TrashItem | null> | null} */ restored = this.declared('restored');
    /** @type {Array<TrashBulkError | null> | null} */ failed = this.declared('failed');
}

/** The bulk delete's body: the rows deleted, each `type`, `id` and `name`, and an entry per failed item. */
export class TrashBulkDeleteResult extends Dto {
    static FIELDS = {
        deleted: dtoList(TrashItem),
        failed: dtoList(TrashBulkError),
    };

    /** @type {Array<TrashItem | null> | null} */ deleted = this.declared('deleted');
    /** @type {Array<TrashBulkError | null> | null} */ failed = this.declared('failed');
}

/** One item of a bulk body; `type` in any letter case, `id` a number. */
export class TrashBulkItemInput extends Dto {
    static FIELDS = {
        type: 'string',
        id: 'int',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ id = this.declared('id');
}

/** The bulk body, `{"items": [...]}`, 1 to 100 items; no envelope. */
export class TrashBulkInput extends Dto {
    static FIELDS = {
        items: dtoList(TrashBulkItemInput),
    };

    /** @type {Array<TrashBulkItemInput | null> | null} */ items = this.declared('items');
}

sealDtoSchema(
    TrashItem,
    Pagination,
    TrashPage,
    TrashType,
    TrashTypeList,
    TrashBulkError,
    TrashBulkRestoreResult,
    TrashBulkDeleteResult,
    TrashBulkItemInput,
    TrashBulkInput,
);
