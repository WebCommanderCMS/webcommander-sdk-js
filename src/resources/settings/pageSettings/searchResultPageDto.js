import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The `product_interaction_buttons` block — which buttons each result carries. */
export class ProductInteractionButtons extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        displayAddToCartButton: 'boolean',
        displayAddToCompareButton: 'boolean',
        displayAddToWishlistButton: 'boolean',
        displayViewDetailsButton: 'boolean',
        displayOnHover: 'boolean',
        displayQuickViewButton: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ displayAddToCartButton = this.declared('displayAddToCartButton');
    /** @type {boolean | null} */ displayAddToCompareButton = this.declared('displayAddToCompareButton');
    /** @type {boolean | null} */ displayAddToWishlistButton = this.declared('displayAddToWishlistButton');
    /** @type {boolean | null} */ displayViewDetailsButton = this.declared('displayViewDetailsButton');
    /** @type {boolean | null} */ displayOnHover = this.declared('displayOnHover');
    /** @type {boolean | null} */ displayQuickViewButton = this.declared('displayQuickViewButton');
}

/** The `number_of_searches_per_result` block — whether results are paginated, and how many per page. */
export class NumberOfSearchesPerResult extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        itemsPerPage: 'int',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ itemsPerPage = this.declared('itemsPerPage');
}

/** The `set_product_display_preferences` block — how results load and where pagination sits. */
export class SetProductDisplayPreferences extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        displayMode: 'string',
        selectPaginationPosition: 'string',
        numberOfProductsPerPage: 'int',
        allowUsersToSelectNumberOfProducts: 'boolean',
        numberOfProductsPerLoad: 'int',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ displayMode = this.declared('displayMode');
    /** @type {string | null} */ selectPaginationPosition = this.declared('selectPaginationPosition');
    /** @type {number | null} */ numberOfProductsPerPage = this.declared('numberOfProductsPerPage');
    /** @type {boolean | null} */ allowUsersToSelectNumberOfProducts = this.declared(
        'allowUsersToSelectNumberOfProducts',
    );
    /** @type {number | null} */ numberOfProductsPerLoad = this.declared('numberOfProductsPerLoad');
}

/** The `set_product_sorting` block — whether a default sort is applied, and which. */
export class SetProductSorting extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        defaultSort: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ defaultSort = this.declared('defaultSort');
}

/** The `configure_sorting_options` block — which sort orders a shopper may switch to. */
export class ConfigureSortingOptions extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        alphabetical: 'boolean',
        featured: 'boolean',
        new: 'boolean',
        topSelling: 'boolean',
        price: 'boolean',
        createdDate: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ alphabetical = this.declared('alphabetical');
    /** @type {boolean | null} */ featured = this.declared('featured');
    /** @type {boolean | null} */ new = this.declared('new');
    /** @type {boolean | null} */ topSelling = this.declared('topSelling');
    /** @type {boolean | null} */ price = this.declared('price');
    /** @type {boolean | null} */ createdDate = this.declared('createdDate');
}

/** The `display_price` block — whether a result shows a price, and which price. */
export class DisplayPrice extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        displayExpectToPayPrice: 'boolean',
        showTaxWithTheExpectToPayPrice: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ displayExpectToPayPrice = this.declared('displayExpectToPayPrice');
    /** @type {boolean | null} */ showTaxWithTheExpectToPayPrice = this.declared('showTaxWithTheExpectToPayPrice');
}

/** The `product_information` section — what each search result shows and how the list behaves. */
export class ProductInformation extends Dto {
    static ENVELOPE_KEY = 'product_information';

    static FIELDS = {
        useDefaultProductListingConfigurations: 'boolean',
        productInteractionButtons: ProductInteractionButtons,
        displayContentPage: 'boolean',
        numberOfSearchesPerResult: NumberOfSearchesPerResult,
        displayShortDescription: 'boolean',
        displayVariationsCombination: 'boolean',
        setProductDisplayPreferences: SetProductDisplayPreferences,
        setProductSorting: SetProductSorting,
        configureSortingOptions: ConfigureSortingOptions,
        displayLoyaltyPoints: 'boolean',
        displayPrice: DisplayPrice,
        labelForPrice: 'string',
    };

    /** @type {boolean | null} */ useDefaultProductListingConfigurations = this.declared(
        'useDefaultProductListingConfigurations',
    );
    /** @type {ProductInteractionButtons | null} */ productInteractionButtons =
        this.declared('productInteractionButtons');
    /** @type {boolean | null} */ displayContentPage = this.declared('displayContentPage');
    /** @type {NumberOfSearchesPerResult | null} */ numberOfSearchesPerResult =
        this.declared('numberOfSearchesPerResult');
    /** @type {boolean | null} */ displayShortDescription = this.declared('displayShortDescription');
    /** @type {boolean | null} */ displayVariationsCombination = this.declared('displayVariationsCombination');
    /** @type {SetProductDisplayPreferences | null} */ setProductDisplayPreferences =
        this.declared('setProductDisplayPreferences');
    /** @type {SetProductSorting | null} */ setProductSorting = this.declared('setProductSorting');
    /** @type {ConfigureSortingOptions | null} */ configureSortingOptions = this.declared('configureSortingOptions');
    /** @type {boolean | null} */ displayLoyaltyPoints = this.declared('displayLoyaltyPoints');
    /** @type {DisplayPrice | null} */ displayPrice = this.declared('displayPrice');
    /** @type {string | null} */ labelForPrice = this.declared('labelForPrice');
}

/** The `seo` section — two read-only markers; this page's SEO is configured elsewhere. */
export class Seo extends Dto {
    static ENVELOPE_KEY = 'seo';

    static FIELDS = {
        readOnly: 'boolean',
        pageKind: 'string',
    };

    /** @type {boolean | null} */ readOnly = this.declared('readOnly');
    /** @type {string | null} */ pageKind = this.declared('pageKind');
}

/** The `reinitialise` section — one read-only field naming an action on another resource. */
export class Reinitialise extends Dto {
    static ENVELOPE_KEY = 'reinitialise';

    static FIELDS = {
        action: 'string',
    };

    /** @type {string | null} */ action = this.declared('action');
}

/** The `product_promotion` marker the facade inlines; the rows have their own path and functions. */
export class ProductPromotionPreview extends Dto {
    static FIELDS = {
        readOnly: 'boolean',
    };

    /** @type {boolean | null} */ readOnly = this.declared('readOnly');
}

/** One promotion row; `ENVELOPE_KEY` is how a row arrives and the wrapper every write requires. */
export class ProductPromotion extends Dto {
    static ENVELOPE_KEY = 'product_promotion';

    static FIELDS = {
        id: 'int',
        name: 'string',
        rule: 'string',
        position: 'string',
        specificKeywords: 'string',
        isActive: 'boolean',
        isAlwaysAvailable: 'boolean',
        availableFromDate: 'string',
        availableToDate: 'string',
        productIds: dtoList('int'),
        created: 'string',
        updated: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ rule = this.declared('rule');
    /** @type {string | null} */ position = this.declared('position');
    /** @type {string | null} */ specificKeywords = this.declared('specificKeywords');
    /** @type {boolean | null} */ isActive = this.declared('isActive');
    /** @type {boolean | null} */ isAlwaysAvailable = this.declared('isAlwaysAvailable');
    /** @type {string | null} */ availableFromDate = this.declared('availableFromDate');
    /** @type {string | null} */ availableToDate = this.declared('availableToDate');
    /** @type {Array<number | null> | null} */ productIds = this.declared('productIds');
    /** @type {string | null} */ created = this.declared('created');
    /** @type {string | null} */ updated = this.declared('updated');
}

/** One entry of `group_meta`; `href` may name another resource. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        uiLabel: 'string',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ uiLabel = this.declared('uiLabel');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block — one {@link SectionMeta} per section, plus `product_promotion`; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        productInformation: SectionMeta,
        seo: SectionMeta,
        productPromotion: SectionMeta,
        reinitialise: SectionMeta,
    };

    /** @type {SectionMeta | null} */ productInformation = this.declared('productInformation');
    /** @type {SectionMeta | null} */ seo = this.declared('seo');
    /** @type {SectionMeta | null} */ productPromotion = this.declared('productPromotion');
    /** @type {SectionMeta | null} */ reinitialise = this.declared('reinitialise');
}

/** The search result page settings; a section arrives one level inside the facade's key. */
export class SearchResultPage extends Dto {
    static ENVELOPE_KEY = 'search_result_page';

    static FIELDS = {
        productInformation: ProductInformation,
        seo: Seo,
        productPromotion: ProductPromotionPreview,
        reinitialise: Reinitialise,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {ProductInformation | null} */ productInformation = this.declared('productInformation');
    /** @type {Seo | null} */ seo = this.declared('seo');
    /** @type {ProductPromotionPreview | null} */ productPromotion = this.declared('productPromotion');
    /** @type {Reinitialise | null} */ reinitialise = this.declared('reinitialise');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    ProductInteractionButtons,
    NumberOfSearchesPerResult,
    SetProductDisplayPreferences,
    SetProductSorting,
    ConfigureSortingOptions,
    DisplayPrice,
    ProductInformation,
    Seo,
    Reinitialise,
    ProductPromotionPreview,
    ProductPromotion,
    SectionMeta,
    GroupMeta,
    SearchResultPage,
);
