import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The `heading` block — whether the category name is shown, and at which heading level. */
export class CategoryHeading extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        style: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ style = this.declared('style');
}

/** The `subcategory` block — whether subcategories are listed, and how that list pages. */
export class Subcategory extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        display: 'boolean',
        loadType: 'string',
        paginationPosition: 'string',
        perPage: 'int',
        allowUserPerPage: 'boolean',
        perLoad: 'int',
        displayProducts: 'boolean',
        showSummary: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ display = this.declared('display');
    /** @type {string | null} */ loadType = this.declared('loadType');
    /** @type {string | null} */ paginationPosition = this.declared('paginationPosition');
    /** @type {number | null} */ perPage = this.declared('perPage');
    /** @type {boolean | null} */ allowUserPerPage = this.declared('allowUserPerPage');
    /** @type {number | null} */ perLoad = this.declared('perLoad');
    /** @type {boolean | null} */ displayProducts = this.declared('displayProducts');
    /** @type {boolean | null} */ showSummary = this.declared('showSummary');
}

/** The `category_information` section — what the category shows and how its subcategories are listed. */
export class CategoryInformation extends Dto {
    static ENVELOPE_KEY = 'category_information';

    static FIELDS = {
        heading: CategoryHeading,
        showDescription: 'boolean',
        showBannerImage: 'boolean',
        showImage: 'boolean',
        subcategory: Subcategory,
    };

    /** @type {CategoryHeading | null} */ heading = this.declared('heading');
    /** @type {boolean | null} */ showDescription = this.declared('showDescription');
    /** @type {boolean | null} */ showBannerImage = this.declared('showBannerImage');
    /** @type {boolean | null} */ showImage = this.declared('showImage');
    /** @type {Subcategory | null} */ subcategory = this.declared('subcategory');
}

/** The `interaction_buttons` block — which buttons each product card carries. */
export class InteractionButtons extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        addToCart: 'boolean',
        viewDetails: 'boolean',
        showOnHover: 'boolean',
        addToWishList: 'boolean',
        addToCompare: 'boolean',
        quickView: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ addToCart = this.declared('addToCart');
    /** @type {boolean | null} */ viewDetails = this.declared('viewDetails');
    /** @type {boolean | null} */ showOnHover = this.declared('showOnHover');
    /** @type {boolean | null} */ addToWishList = this.declared('addToWishList');
    /** @type {boolean | null} */ addToCompare = this.declared('addToCompare');
    /** @type {boolean | null} */ quickView = this.declared('quickView');
}

/** The `price` block — whether a card shows a price, and which price. */
export class Price extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        expectToPay: 'boolean',
        expectToPayWithTax: 'boolean',
        strikeThroughPrevious: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ expectToPay = this.declared('expectToPay');
    /** @type {boolean | null} */ expectToPayWithTax = this.declared('expectToPayWithTax');
    /** @type {boolean | null} */ strikeThroughPrevious = this.declared('strikeThroughPrevious');
}

/** One entry of `variation_combination.types`; take ids from `field_metadata`'s `allowed_values`. */
export class VariationType extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `variation_combination` block — whether combinations are shown, and which variation types are offered. */
export class VariationCombination extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        types: dtoList(VariationType),
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {Array<VariationType | null> | null} */ types = this.declared('types');
}

/** The `rating` block — whether the rating is shown, and whether the review count sits beside it. */
export class Rating extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        showReviewCount: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ showReviewCount = this.declared('showReviewCount');
}

/** The `view_switcher` block — whether a shopper may change the display mode, and to which modes. */
export class ViewSwitcher extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        grid: 'boolean',
        list: 'boolean',
        tabular: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ grid = this.declared('grid');
    /** @type {boolean | null} */ list = this.declared('list');
    /** @type {boolean | null} */ tabular = this.declared('tabular');
}

/** The `columns_per_row` block — product columns per row, per mode; each mode has its own `max`. */
export class ColumnsPerRow extends Dto {
    static FIELDS = {
        grid: 'int',
        list: 'int',
    };

    /** @type {number | null} */ grid = this.declared('grid');
    /** @type {number | null} */ list = this.declared('list');
}

/** The `default_display` block — the mode a listing opens in and how wide its rows are. */
export class DefaultDisplay extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        mode: 'string',
        columnsPerRow: ColumnsPerRow,
        showVariationOptionsLabelInTabular: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ mode = this.declared('mode');
    /** @type {ColumnsPerRow | null} */ columnsPerRow = this.declared('columnsPerRow');
    /** @type {boolean | null} */ showVariationOptionsLabelInTabular = this.declared(
        'showVariationOptionsLabelInTabular',
    );
}

/** The `load` block — how the product listing pages and where its control sits. */
export class ProductLoad extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        type: 'string',
        paginationPosition: 'string',
        perPage: 'int',
        allowUserPerPage: 'boolean',
        perLoad: 'int',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ paginationPosition = this.declared('paginationPosition');
    /** @type {number | null} */ perPage = this.declared('perPage');
    /** @type {boolean | null} */ allowUserPerPage = this.declared('allowUserPerPage');
    /** @type {number | null} */ perLoad = this.declared('perLoad');
}

/** The `default_sort` block — whether a default order is applied, and which. */
export class DefaultSort extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        by: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ by = this.declared('by');
}

/** The `sort_options` block — which orders a shopper may switch to. */
export class SortOptions extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        alphabetic: 'boolean',
        featured: 'boolean',
        new: 'boolean',
        topSelling: 'boolean',
        price: 'boolean',
        date: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ alphabetic = this.declared('alphabetic');
    /** @type {boolean | null} */ featured = this.declared('featured');
    /** @type {boolean | null} */ new = this.declared('new');
    /** @type {boolean | null} */ topSelling = this.declared('topSelling');
    /** @type {boolean | null} */ price = this.declared('price');
    /** @type {boolean | null} */ date = this.declared('date');
}

/** The `product_information` section — what each product card shows and how the listing behaves. */
export class ProductInformation extends Dto {
    static ENVELOPE_KEY = 'product_information';

    static FIELDS = {
        useGlobalDefaults: 'boolean',
        interactionButtons: InteractionButtons,
        showSummary: 'boolean',
        showSalePercentage: 'boolean',
        showStockAvailability: 'boolean',
        showParentCategory: 'boolean',
        price: Price,
        variationCombination: VariationCombination,
        rating: Rating,
        viewSwitcher: ViewSwitcher,
        defaultDisplay: DefaultDisplay,
        load: ProductLoad,
        defaultSort: DefaultSort,
        sortOptions: SortOptions,
    };

    /** @type {boolean | null} */ useGlobalDefaults = this.declared('useGlobalDefaults');
    /** @type {InteractionButtons | null} */ interactionButtons = this.declared('interactionButtons');
    /** @type {boolean | null} */ showSummary = this.declared('showSummary');
    /** @type {boolean | null} */ showSalePercentage = this.declared('showSalePercentage');
    /** @type {boolean | null} */ showStockAvailability = this.declared('showStockAvailability');
    /** @type {boolean | null} */ showParentCategory = this.declared('showParentCategory');
    /** @type {Price | null} */ price = this.declared('price');
    /** @type {VariationCombination | null} */ variationCombination = this.declared('variationCombination');
    /** @type {Rating | null} */ rating = this.declared('rating');
    /** @type {ViewSwitcher | null} */ viewSwitcher = this.declared('viewSwitcher');
    /** @type {DefaultDisplay | null} */ defaultDisplay = this.declared('defaultDisplay');
    /** @type {ProductLoad | null} */ load = this.declared('load');
    /** @type {DefaultSort | null} */ defaultSort = this.declared('defaultSort');
    /** @type {SortOptions | null} */ sortOptions = this.declared('sortOptions');
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
        categoryInformation: SectionMeta,
        productInformation: SectionMeta,
    };

    /** @type {SectionMeta | null} */ categoryInformation = this.declared('categoryInformation');
    /** @type {SectionMeta | null} */ productInformation = this.declared('productInformation');
}

/** The category page settings, as the facade or one section sends them. */
export class CategoryPage extends Dto {
    static ENVELOPE_KEY = 'category_page';

    static FIELDS = {
        categoryInformation: CategoryInformation,
        productInformation: ProductInformation,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {CategoryInformation | null} */ categoryInformation = this.declared('categoryInformation');
    /** @type {ProductInformation | null} */ productInformation = this.declared('productInformation');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    CategoryHeading,
    Subcategory,
    CategoryInformation,
    InteractionButtons,
    Price,
    VariationType,
    VariationCombination,
    Rating,
    ViewSwitcher,
    ColumnsPerRow,
    DefaultDisplay,
    ProductLoad,
    DefaultSort,
    SortOptions,
    ProductInformation,
    SectionMeta,
    GroupMeta,
    CategoryPage,
);
