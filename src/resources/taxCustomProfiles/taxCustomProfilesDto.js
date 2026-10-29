import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The ten-key `pagination` block of this listing; `limit` is the size the store applied, capped at 100. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        count: 'int',
        currentPage: 'int',
        totalPages: 'int',
        hasNext: 'boolean',
        hasPrevious: 'boolean',
        previousPage: 'string',
        nextPage: 'string',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {number | null} */ count = this.declared('count');
    /** @type {number | null} */ currentPage = this.declared('currentPage');
    /** @type {number | null} */ totalPages = this.declared('totalPages');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
    /** @type {string | null} */ previousPage = this.declared('previousPage');
    /** @type {string | null} */ nextPage = this.declared('nextPage');
}

/** One profile a rule is filed under, on the rule's `profiles`. */
export class CustomProfileReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One entry of a custom profile's `rules`, which only the row read sends. */
export class CustomProfileRule extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        description: 'string',
        zonesCount: 'int',
        profiles: dtoList(CustomProfileReference),
        createdOn: 'string',
        lastUpdatedOn: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {number | null} */ zonesCount = this.declared('zonesCount');
    /** @type {Array<CustomProfileReference | null> | null} */ profiles = this.declared('profiles');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
}

/** One custom tax profile; the row read adds `rules` to the eight keys a listing row and both writes carry. */
export class CustomProfile extends Dto {
    static ENVELOPE_KEY = 'custom_profile';

    static FIELDS = {
        id: 'int',
        name: 'string',
        taxCode: 'string',
        description: 'string',
        isDefault: 'boolean',
        rulesCount: 'int',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        rules: dtoList(CustomProfileRule),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ taxCode = this.declared('taxCode');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {number | null} */ rulesCount = this.declared('rulesCount');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {Array<CustomProfileRule | null> | null} */ rules = this.declared('rules');
}

/**
 * The writable form of {@link CustomProfile}; `name` is the create's one requirement, and the update is a replace
 * that keeps an omitted `name`. `transactionNo` is written beside the envelope, where the create files it.
 */
export class CustomProfileInput extends Dto {
    static ENVELOPE_KEY = 'custom_profile';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        name: 'string',
        taxCode: 'string',
        description: 'string',
        isDefault: 'boolean',
        transactionNo: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ taxCode = this.declared('taxCode');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One `group_meta` entry: what the path is, whether it is writable and where. */
export class ResourceMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block only the listing sends. */
export class GroupMeta extends Dto {
    static FIELDS = {
        customProfile: ResourceMeta,
        rules: ResourceMeta,
    };

    /** @type {ResourceMeta | null} */ customProfile = this.declared('customProfile');
    /** @type {ResourceMeta | null} */ rules = this.declared('rules');
}

/** One page of the custom profile listing: the rows, `groupMeta` and the paging block. */
export class CustomProfilePage extends Dto {
    static FIELDS = {
        customProfiles: dtoList(CustomProfile),
        groupMeta: GroupMeta,
        pagination: Pagination,
    };

    /** @type {Array<CustomProfile | null> | null} */ customProfiles = this.declared('customProfiles');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    Pagination,
    CustomProfileReference,
    CustomProfileRule,
    CustomProfile,
    CustomProfileInput,
    ResourceMeta,
    GroupMeta,
    CustomProfilePage,
);
