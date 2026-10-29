import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** One content type's block of `global_store_settings`; each block allows its own template tokens. */
export class SeoTemplates extends Dto {
    static FIELDS = {
        disableIndexing: 'boolean',
        titleTemplate: dtoList('string'),
        descriptionTemplate: dtoList('string'),
    };

    /** @type {boolean | null} */ disableIndexing = this.declared('disableIndexing');
    /** @type {Array<string | null> | null} */ titleTemplate = this.declared('titleTemplate');
    /** @type {Array<string | null> | null} */ descriptionTemplate = this.declared('descriptionTemplate');
}

/** The `global_store_settings` section — the store name, title separator and per-type templates. */
export class GlobalStoreSettings extends Dto {
    static ENVELOPE_KEY = 'global_store_settings';

    static FIELDS = {
        storeName: 'string',
        titleSeparator: 'string',
        pages: SeoTemplates,
        products: SeoTemplates,
        categories: SeoTemplates,
    };

    /** @type {string | null} */ storeName = this.declared('storeName');
    /** @type {string | null} */ titleSeparator = this.declared('titleSeparator');
    /** @type {SeoTemplates | null} */ pages = this.declared('pages');
    /** @type {SeoTemplates | null} */ products = this.declared('products');
    /** @type {SeoTemplates | null} */ categories = this.declared('categories');
}

/** The `header` or `footer` block of `custom_code`, whose `code` the storefront serves on every page. */
export class CustomCodeBlock extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        code: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ code = this.declared('code');
}

/** The `custom_code` section — the two blocks whose `code` reaches every storefront page. */
export class CustomCode extends Dto {
    static ENVELOPE_KEY = 'custom_code';

    static FIELDS = {
        header: CustomCodeBlock,
        footer: CustomCodeBlock,
    };

    /** @type {CustomCodeBlock | null} */ header = this.declared('header');
    /** @type {CustomCodeBlock | null} */ footer = this.declared('footer');
}

/** One redirect row; a listing sends rows under `items` with no envelope. */
export class Redirect extends Dto {
    static ENVELOPE_KEY = 'redirect';

    static FIELDS = {
        id: 'int',
        sourceUrl: 'string',
        destinationUrl: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ sourceUrl = this.declared('sourceUrl');
    /** @type {string | null} */ destinationUrl = this.declared('destinationUrl');
}

/** The `redirects` rows inlined in `url_settings`, without `pagination`. */
export class RedirectsPreview extends Dto {
    static FIELDS = {
        items: dtoList(Redirect),
    };

    /** @type {Array<Redirect | null> | null} */ items = this.declared('items');
}

/** The `url_settings` section — URL rewrites on rename, the redirects they leave, and the inlined rows. */
export class UrlSettings extends Dto {
    static ENVELOPE_KEY = 'url_settings';

    static FIELDS = {
        regenerateUrlOnItemUpdate: 'boolean',
        autoRedirectOnUrlChange: 'boolean',
        redirects: RedirectsPreview,
    };

    /** @type {boolean | null} */ regenerateUrlOnItemUpdate = this.declared('regenerateUrlOnItemUpdate');
    /** @type {boolean | null} */ autoRedirectOnUrlChange = this.declared('autoRedirectOnUrlChange');
    /** @type {RedirectsPreview | null} */ redirects = this.declared('redirects');
}

/** One document-root file; `configKey` is the store's id and what the delete takes, not the file name. */
export class DocumentRootFile extends Dto {
    static ENVELOPE_KEY = 'document_root_file';

    static FIELDS = {
        configKey: 'string',
        fileName: 'string',
        filePath: 'string',
    };

    /** @type {string | null} */ configKey = this.declared('configKey');
    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {string | null} */ filePath = this.declared('filePath');
}

/** The `document_root` rows the facade inlines, without `pagination`. */
export class DocumentRootPreview extends Dto {
    static FIELDS = {
        items: dtoList(DocumentRootFile),
    };

    /** @type {Array<DocumentRootFile | null> | null} */ items = this.declared('items');
}

/** One entry of `group_meta`; `url_settings`' entry nests one more for `redirects`. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
        redirects: SectionMeta,
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
    /** @type {SectionMeta | null} */ redirects = this.declared('redirects');
}

/** The `group_meta` block — one {@link SectionMeta} per section, plus `document_root`; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        globalStoreSettings: SectionMeta,
        customCode: SectionMeta,
        documentRoot: SectionMeta,
        urlSettings: SectionMeta,
    };

    /** @type {SectionMeta | null} */ globalStoreSettings = this.declared('globalStoreSettings');
    /** @type {SectionMeta | null} */ customCode = this.declared('customCode');
    /** @type {SectionMeta | null} */ documentRoot = this.declared('documentRoot');
    /** @type {SectionMeta | null} */ urlSettings = this.declared('urlSettings');
}

/** The SEO configuration, as the facade or one section sends it. */
export class SeoConfiguration extends Dto {
    static ENVELOPE_KEY = 'seo_configuration';

    static FIELDS = {
        globalStoreSettings: GlobalStoreSettings,
        customCode: CustomCode,
        documentRoot: DocumentRootPreview,
        urlSettings: UrlSettings,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {GlobalStoreSettings | null} */ globalStoreSettings = this.declared('globalStoreSettings');
    /** @type {CustomCode | null} */ customCode = this.declared('customCode');
    /** @type {DocumentRootPreview | null} */ documentRoot = this.declared('documentRoot');
    /** @type {UrlSettings | null} */ urlSettings = this.declared('urlSettings');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    SeoTemplates,
    GlobalStoreSettings,
    CustomCodeBlock,
    CustomCode,
    Redirect,
    RedirectsPreview,
    UrlSettings,
    DocumentRootFile,
    DocumentRootPreview,
    SectionMeta,
    GroupMeta,
    SeoConfiguration,
);
