import {Dto, dtoList, dtoOneOf, sealDtoSchema} from '../../dto.js';

/**
 * An `{id, name}` pair: the layout, an access-list customer or group, the navigation and the author. A write names
 * one by `{"id": ...}`; `name` is read-only.
 */
export class PageReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/**
 * The password gate. A listing row masks the password as `***`; the row read and the writes answer it as saved, and
 * switching it off keeps the stored password.
 */
export class PagePasswordProtection extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        password: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ password = this.declared('password');
}

/**
 * Whether the page is linked from a navigation; `navigation` is `null` when it is not, and must be `{"id": ...}` when
 * a write sends `enabled` true.
 */
export class PageMenuPlacement extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        navigation: PageReference,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {PageReference | null} */ navigation = this.declared('navigation');
}

/** The draft and approval state; the draft and published ids are `null`, never `0`. */
export class PagePublishing extends Dto {
    static FIELDS = {
        draft: 'boolean',
        draftPageId: 'int',
        publishedPageId: 'int',
        pendingApproval: 'boolean',
        pendingApprovalCount: 'int',
        pendingApprovalIds: dtoList('int'),
        disposable: 'boolean',
    };

    /** @type {boolean | null} */ draft = this.declared('draft');
    /** @type {number | null} */ draftPageId = this.declared('draftPageId');
    /** @type {number | null} */ publishedPageId = this.declared('publishedPageId');
    /** @type {boolean | null} */ pendingApproval = this.declared('pendingApproval');
    /** @type {number | null} */ pendingApprovalCount = this.declared('pendingApprovalCount');
    /** @type {Array<number | null> | null} */ pendingApprovalIds = this.declared('pendingApprovalIds');
    /** @type {boolean | null} */ disposable = this.declared('disposable');
}

/**
 * One page: a listing row, the row read and every write's answer, the same 23 keys. `visibility` is `open`, `hidden`
 * or `restricted`; `visibleTo` is `all` or `selected` on a restricted page and `null` otherwise.
 */
export class Page extends Dto {
    static ENVELOPE_KEY = 'page';

    static FIELDS = {
        id: 'int',
        name: 'string',
        title: 'string',
        subtitle: 'string',
        url: 'string',
        fullUrl: 'string',
        layout: PageReference,
        visibility: 'string',
        visibleTo: 'string',
        customers: dtoList(PageReference),
        customerGroups: dtoList(PageReference),
        bodyClass: 'string',
        passwordProtection: PagePasswordProtection,
        menuPlacement: PageMenuPlacement,
        active: 'boolean',
        disableTracking: 'boolean',
        landing: 'boolean',
        inTrash: 'boolean',
        publishing: PagePublishing,
        // null on every page the store holds; no store-bound page could be read to type it.
        store: 'any',
        author: PageReference,
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ subtitle = this.declared('subtitle');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ fullUrl = this.declared('fullUrl');
    /** @type {PageReference | null} */ layout = this.declared('layout');
    /** @type {string | null} */ visibility = this.declared('visibility');
    /** @type {string | null} */ visibleTo = this.declared('visibleTo');
    /** @type {Array<PageReference | null> | null} */ customers = this.declared('customers');
    /** @type {Array<PageReference | null> | null} */ customerGroups = this.declared('customerGroups');
    /** @type {string | null} */ bodyClass = this.declared('bodyClass');
    /** @type {PagePasswordProtection | null} */ passwordProtection = this.declared('passwordProtection');
    /** @type {PageMenuPlacement | null} */ menuPlacement = this.declared('menuPlacement');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ disableTracking = this.declared('disableTracking');
    /** @type {boolean | null} */ landing = this.declared('landing');
    /** @type {boolean | null} */ inTrash = this.declared('inTrash');
    /** @type {PagePublishing | null} */ publishing = this.declared('publishing');
    /** @type {any} */ store = this.declared('store');
    /** @type {PageReference | null} */ author = this.declared('author');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/**
 * The writable fields, wrapped in `page`, for the create, the `PUT` replace and the `PATCH`. `customers` take public
 * `customer_id` values, groups their ids, either bare or as `{"id": ...}`. A `null` field is not sent: to clear one,
 * pass a mapping.
 */
export class PageInput extends Dto {
    static ENVELOPE_KEY = 'page';

    static FIELDS = {
        name: 'string',
        title: 'string',
        subtitle: 'string',
        url: 'string',
        layout: PageReference,
        visibility: 'string',
        visibleTo: 'string',
        customers: dtoList(dtoOneOf('int', PageReference)),
        customerGroups: dtoList(dtoOneOf('int', PageReference)),
        bodyClass: 'string',
        passwordProtection: PagePasswordProtection,
        menuPlacement: PageMenuPlacement,
        active: 'boolean',
        disableTracking: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ subtitle = this.declared('subtitle');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {PageReference | null} */ layout = this.declared('layout');
    /** @type {string | null} */ visibility = this.declared('visibility');
    /** @type {string | null} */ visibleTo = this.declared('visibleTo');
    /** @type {Array<number | PageReference | null> | null} */ customers = this.declared('customers');
    /** @type {Array<number | PageReference | null> | null} */ customerGroups = this.declared('customerGroups');
    /** @type {string | null} */ bodyClass = this.declared('bodyClass');
    /** @type {PagePasswordProtection | null} */ passwordProtection = this.declared('passwordProtection');
    /** @type {PageMenuPlacement | null} */ menuPlacement = this.declared('menuPlacement');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ disableTracking = this.declared('disableTracking');
}

/** The URL write's bare body, `{"url": ...}`; a `page` wrapper is `400`. */
export class PageUrlInput extends Dto {
    static FIELDS = {
        url: 'string',
    };

    /** @type {string | null} */ url = this.declared('url');
}

/** The five-key `pagination` block; `limit` is the page size applied, the total under `limit=all`. */
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

/** One page of the listing: the rows, outside the trash, and where they sit. */
export class PageListing extends Dto {
    static FIELDS = {
        pages: dtoList(Page),
        pagination: Pagination,
    };

    /** @type {Array<Page | null> | null} */ pages = this.declared('pages');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class PageCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

/** One reason the page cannot be deleted, such as `landing_page`. */
export class PageDeleteBlocker extends Dto {
    static FIELDS = {
        code: 'string',
        message: 'string',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ message = this.declared('message');
}

/**
 * The delete check's body: whether a delete would pass, what blocks it and what links to the page. `linked` was empty
 * on every page read, so its rows stay untyped.
 */
export class PageDeleteBlockers extends Dto {
    static FIELDS = {
        canDelete: 'boolean',
        blockers: dtoList(PageDeleteBlocker),
        linked: dtoList('any'),
    };

    /** @type {boolean | null} */ canDelete = this.declared('canDelete');
    /** @type {Array<PageDeleteBlocker | null> | null} */ blockers = this.declared('blockers');
    /** @type {Array<any> | null} */ linked = this.declared('linked');
}

sealDtoSchema(
    PageReference,
    PagePasswordProtection,
    PageMenuPlacement,
    PagePublishing,
    Page,
    PageInput,
    PageUrlInput,
    Pagination,
    PageListing,
    PageCount,
    PageDeleteBlocker,
    PageDeleteBlockers,
);
