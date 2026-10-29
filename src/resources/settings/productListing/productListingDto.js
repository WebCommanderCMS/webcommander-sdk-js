import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The `add to cart` and `view details` buttons on a listing tile, and whether they wait for a hover. */
export class InteractionButtons extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        addToCart: 'boolean',
        showViewDetails: 'boolean',
        showOnHover: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ addToCart = this.declared('addToCart');
    /** @type {boolean | null} */ showViewDetails = this.declared('showViewDetails');
    /** @type {boolean | null} */ showOnHover = this.declared('showOnHover');
}

/** Which prices a listing tile shows. */
export class ListingPrice extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        expectToPay: 'boolean',
        expectToPayWithTax: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ expectToPay = this.declared('expectToPay');
    /** @type {boolean | null} */ expectToPayWithTax = this.declared('expectToPayWithTax');
}

/** The rating stars on a listing tile and the count beside them. */
export class Reviews extends Dto {
    static FIELDS = {
        showRating: 'boolean',
        showReviewCount: 'boolean',
    };

    /** @type {boolean | null} */ showRating = this.declared('showRating');
    /** @type {boolean | null} */ showReviewCount = this.declared('showReviewCount');
}

/** Which variation types a listing tile combines, from the store's own variation names. */
export class VariationCombination extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        types: dtoList('string'),
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string[] | null} */ types = this.declared('types');
}

/** The `product_information` section — what each product shows on a listing tile. */
export class ProductInformation extends Dto {
    static FIELDS = {
        interactionButtons: InteractionButtons,
        showSummary: 'boolean',
        showSalePercentage: 'boolean',
        showStockAvailability: 'boolean',
        showParentCategory: 'boolean',
        showLoyaltyPoints: 'boolean',
        price: ListingPrice,
        reviews: Reviews,
        variationCombination: VariationCombination,
        showVariationsAsProducts: 'boolean',
    };

    /** @type {InteractionButtons | null} */ interactionButtons = this.declared('interactionButtons');
    /** @type {boolean | null} */ showSummary = this.declared('showSummary');
    /** @type {boolean | null} */ showSalePercentage = this.declared('showSalePercentage');
    /** @type {boolean | null} */ showStockAvailability = this.declared('showStockAvailability');
    /** @type {boolean | null} */ showParentCategory = this.declared('showParentCategory');
    /** @type {boolean | null} */ showLoyaltyPoints = this.declared('showLoyaltyPoints');
    /** @type {ListingPrice | null} */ price = this.declared('price');
    /** @type {Reviews | null} */ reviews = this.declared('reviews');
    /** @type {VariationCombination | null} */ variationCombination = this.declared('variationCombination');
    /** @type {boolean | null} */ showVariationsAsProducts = this.declared('showVariationsAsProducts');
}

/** Where the pager sits and how many products a page holds. */
export class Pagination extends Dto {
    static FIELDS = {
        position: 'string',
        perPage: 'int',
        allowUserPerPage: 'boolean',
    };

    /** @type {string | null} */ position = this.declared('position');
    /** @type {number | null} */ perPage = this.declared('perPage');
    /** @type {boolean | null} */ allowUserPerPage = this.declared('allowUserPerPage');
}

/** How many products each press of *load more* adds. */
export class LoadMore extends Dto {
    static FIELDS = {
        perLoad: 'int',
    };

    /** @type {number | null} */ perLoad = this.declared('perLoad');
}

/** The `load` section — pagination or load-more, and the settings of whichever `type` selects. */
export class Load extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        type: 'string',
        pagination: Pagination,
        loadMore: LoadMore,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {LoadMore | null} */ loadMore = this.declared('loadMore');
}

/** The `sorting` section — the order a listing arrives in. */
export class Sorting extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        sortBy: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ sortBy = this.declared('sortBy');
}

/** Which orders a shopper may pick from. */
export class SortableOptions extends Dto {
    static FIELDS = {
        alphabetic: 'boolean',
        featured: 'boolean',
        new: 'boolean',
        topSelling: 'boolean',
        price: 'boolean',
        createdDate: 'boolean',
    };

    /** @type {boolean | null} */ alphabetic = this.declared('alphabetic');
    /** @type {boolean | null} */ featured = this.declared('featured');
    /** @type {boolean | null} */ new = this.declared('new');
    /** @type {boolean | null} */ topSelling = this.declared('topSelling');
    /** @type {boolean | null} */ price = this.declared('price');
    /** @type {boolean | null} */ createdDate = this.declared('createdDate');
}

/** The `sortable_items` section — whether a shopper may re-sort a listing, and by what. */
export class SortableItems extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        options: SortableOptions,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {SortableOptions | null} */ options = this.declared('options');
}

/** The one entry of `group_meta`: what the area is, whether it is writable and where. */
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

/** The `group_meta` block — a single entry for the whole area, not one per section. */
export class GroupMeta extends Dto {
    static FIELDS = {
        productListing: SectionMeta,
    };

    /** @type {SectionMeta | null} */ productListing = this.declared('productListing');
}

/**
 * The product listing settings; `toMap()` renders the wrapped body the facade `PATCH` wants, as section
 * types carry no envelope of their own.
 */
export class ProductListing extends Dto {
    static ENVELOPE_KEY = 'product_listing';

    static FIELDS = {
        productInformation: ProductInformation,
        load: Load,
        sorting: Sorting,
        sortableItems: SortableItems,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {ProductInformation | null} */ productInformation = this.declared('productInformation');
    /** @type {Load | null} */ load = this.declared('load');
    /** @type {Sorting | null} */ sorting = this.declared('sorting');
    /** @type {SortableItems | null} */ sortableItems = this.declared('sortableItems');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    InteractionButtons,
    ListingPrice,
    Reviews,
    VariationCombination,
    ProductInformation,
    Pagination,
    LoadMore,
    Load,
    Sorting,
    SortableOptions,
    SortableItems,
    SectionMeta,
    GroupMeta,
    ProductListing,
);
