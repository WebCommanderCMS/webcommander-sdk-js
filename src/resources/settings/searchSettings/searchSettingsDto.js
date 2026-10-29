import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** One entry of an `excluded` list as a read sends it; a write takes bare ids or these records. */
export class ExcludedRecord extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One content type the site search covers: whether it is searched, its hits' heading, and rows held out. */
export class SearchableContentGroup extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        displayHeading: 'string',
        excluded: dtoList(ExcludedRecord),
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ displayHeading = this.declared('displayHeading');
    /** @type {Array<ExcludedRecord | null> | null} */ excluded = this.declared('excluded');
}

/** The `product_categories` block — the only content group with a fourth field. */
export class ProductCategoriesContent extends SearchableContentGroup {
    static FIELDS = {...SearchableContentGroup.FIELDS, hideParentCategory: 'boolean'};

    /** @type {boolean | null} */ hideParentCategory = this.declared('hideParentCategory');
}

/** The `searchable_content` section — what the search box says and which content types it reaches. */
export class SearchableContent extends Dto {
    static ENVELOPE_KEY = 'searchable_content';

    static FIELDS = {
        placeholderText: 'string',
        product: SearchableContentGroup,
        productCategories: ProductCategoriesContent,
        blog: SearchableContentGroup,
        otherPages: SearchableContentGroup,
    };

    /** @type {string | null} */ placeholderText = this.declared('placeholderText');
    /** @type {SearchableContentGroup | null} */ product = this.declared('product');
    /** @type {ProductCategoriesContent | null} */ productCategories = this.declared('productCategories');
    /** @type {SearchableContentGroup | null} */ blog = this.declared('blog');
    /** @type {SearchableContentGroup | null} */ otherPages = this.declared('otherPages');
}

/** One row of `search_fields.fields` — a product field and where it ranks. */
export class SearchFieldPriority extends Dto {
    static FIELDS = {
        field: 'string',
        priority: 'int',
    };

    /** @type {string | null} */ field = this.declared('field');
    /** @type {number | null} */ priority = this.declared('priority');
}

/** The `search_fields` section — how a query is matched and which fields it is matched against. */
export class SearchFields extends Dto {
    static ENVELOPE_KEY = 'search_fields';

    static FIELDS = {
        matchKeywordsExactly: 'boolean',
        matchFullSentences: 'boolean',
        fields: dtoList(SearchFieldPriority),
    };

    /** @type {boolean | null} */ matchKeywordsExactly = this.declared('matchKeywordsExactly');
    /** @type {boolean | null} */ matchFullSentences = this.declared('matchFullSentences');
    /** @type {Array<SearchFieldPriority | null> | null} */ fields = this.declared('fields');
}

/** One group of `synonyms.groups` — words a query treats as each other. */
export class SynonymGroup extends Dto {
    static FIELDS = {
        keywords: dtoList('string'),
    };

    /** @type {Array<string | null> | null} */ keywords = this.declared('keywords');
}

/** The `synonyms` section — read it, never write it: a change triggers a reindex that cannot be undone. */
export class Synonyms extends Dto {
    static ENVELOPE_KEY = 'synonyms';

    static FIELDS = {
        groups: dtoList(SynonymGroup),
    };

    /** @type {Array<SynonymGroup | null> | null} */ groups = this.declared('groups');
}

/** One entry of `group_meta`: what a section is, whether it can be written and where it is managed. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block — one {@link SectionMeta} per section; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        searchableContent: SectionMeta,
        searchFields: SectionMeta,
        synonyms: SectionMeta,
    };

    /** @type {SectionMeta | null} */ searchableContent = this.declared('searchableContent');
    /** @type {SectionMeta | null} */ searchFields = this.declared('searchFields');
    /** @type {SectionMeta | null} */ synonyms = this.declared('synonyms');
}

/** The bare `reindex_status` record. */
export class ReindexStatus extends Dto {
    static FIELDS = {
        state: 'string',
        startedAt: 'any',
        finishedAt: 'any',
        error: 'any',
    };

    /** @type {string | null} */ state = this.declared('state');
    /** @type {unknown} */ startedAt = this.declared('startedAt');
    /** @type {unknown} */ finishedAt = this.declared('finishedAt');
    /** @type {unknown} */ error = this.declared('error');
}

/** The search settings, as the facade or one section sends them. */
export class SearchSettings extends Dto {
    static ENVELOPE_KEY = 'search_settings';

    static FIELDS = {
        searchableContent: SearchableContent,
        searchFields: SearchFields,
        synonyms: Synonyms,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {SearchableContent | null} */ searchableContent = this.declared('searchableContent');
    /** @type {SearchFields | null} */ searchFields = this.declared('searchFields');
    /** @type {Synonyms | null} */ synonyms = this.declared('synonyms');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    ExcludedRecord,
    SearchableContentGroup,
    ProductCategoriesContent,
    SearchableContent,
    SearchFieldPriority,
    SearchFields,
    SynonymGroup,
    Synonyms,
    SectionMeta,
    GroupMeta,
    ReindexStatus,
    SearchSettings,
);
