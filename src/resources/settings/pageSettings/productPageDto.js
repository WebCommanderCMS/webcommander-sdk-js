import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The `actions_buttons` block — which buttons a product page carries. */
export class ActionButtons extends Dto {
    static FIELDS = {
        showProductActionButtons: 'boolean',
        displayAddToCartButton: 'boolean',
        displayBuyNowButton: 'boolean',
        displayOnHover: 'boolean',
        displayAddToCompareButton: 'boolean',
        displayAddToWishlistButton: 'boolean',
    };

    /** @type {boolean | null} */ showProductActionButtons = this.declared('showProductActionButtons');
    /** @type {boolean | null} */ displayAddToCartButton = this.declared('displayAddToCartButton');
    /** @type {boolean | null} */ displayBuyNowButton = this.declared('displayBuyNowButton');
    /** @type {boolean | null} */ displayOnHover = this.declared('displayOnHover');
    /** @type {boolean | null} */ displayAddToCompareButton = this.declared('displayAddToCompareButton');
    /** @type {boolean | null} */ displayAddToWishlistButton = this.declared('displayAddToWishlistButton');
}

/** The `details` block — which parts of the product's own description are shown. */
export class ProductDetails extends Dto {
    static FIELDS = {
        displayDescription: 'boolean',
        displaySalePercentage: 'boolean',
        useStrikeThroughOnPreviousPrice: 'boolean',
        displayTaxWithExpectToPayPrice: 'boolean',
    };

    /** @type {boolean | null} */ displayDescription = this.declared('displayDescription');
    /** @type {boolean | null} */ displaySalePercentage = this.declared('displaySalePercentage');
    /** @type {boolean | null} */ useStrikeThroughOnPreviousPrice = this.declared('useStrikeThroughOnPreviousPrice');
    /** @type {boolean | null} */ displayTaxWithExpectToPayPrice = this.declared('displayTaxWithExpectToPayPrice');
}

/** The `social_sharing` block — share buttons, the networks they cover and the title beside them. */
export class SocialSharing extends Dto {
    static FIELDS = {
        enableShareOnSocialMedia: 'boolean',
        facebook: 'boolean',
        twitter: 'boolean',
        pinterest: 'boolean',
        messenger: 'boolean',
        linkedin: 'boolean',
        email: 'boolean',
        snapchat: 'boolean',
        telegram: 'boolean',
        reddit: 'boolean',
        instagram: 'boolean',
        youtube: 'boolean',
        tiktok: 'boolean',
        threads: 'boolean',
        whatsapp: 'boolean',
        bluesky: 'boolean',
        mastodon: 'boolean',
        copyLink: 'boolean',
        displayTitle: 'boolean',
        title: 'string',
    };

    /** @type {boolean | null} */ enableShareOnSocialMedia = this.declared('enableShareOnSocialMedia');
    /** @type {boolean | null} */ facebook = this.declared('facebook');
    /** @type {boolean | null} */ twitter = this.declared('twitter');
    /** @type {boolean | null} */ pinterest = this.declared('pinterest');
    /** @type {boolean | null} */ messenger = this.declared('messenger');
    /** @type {boolean | null} */ linkedin = this.declared('linkedin');
    /** @type {boolean | null} */ email = this.declared('email');
    /** @type {boolean | null} */ snapchat = this.declared('snapchat');
    /** @type {boolean | null} */ telegram = this.declared('telegram');
    /** @type {boolean | null} */ reddit = this.declared('reddit');
    /** @type {boolean | null} */ instagram = this.declared('instagram');
    /** @type {boolean | null} */ youtube = this.declared('youtube');
    /** @type {boolean | null} */ tiktok = this.declared('tiktok');
    /** @type {boolean | null} */ threads = this.declared('threads');
    /** @type {boolean | null} */ whatsapp = this.declared('whatsapp');
    /** @type {boolean | null} */ bluesky = this.declared('bluesky');
    /** @type {boolean | null} */ mastodon = this.declared('mastodon');
    /** @type {boolean | null} */ copyLink = this.declared('copyLink');
    /** @type {boolean | null} */ displayTitle = this.declared('displayTitle');
    /** @type {string | null} */ title = this.declared('title');
}

/** The `set_product_properties` block — which physical properties a product page lists. */
export class SetProductProperties extends Dto {
    static FIELDS = {
        displayHeight: 'boolean',
        displayWidth: 'boolean',
        displayLength: 'boolean',
        displayWeight: 'boolean',
        displayAddToGiftRegistry: 'boolean',
    };

    /** @type {boolean | null} */ displayHeight = this.declared('displayHeight');
    /** @type {boolean | null} */ displayWidth = this.declared('displayWidth');
    /** @type {boolean | null} */ displayLength = this.declared('displayLength');
    /** @type {boolean | null} */ displayWeight = this.declared('displayWeight');
    /** @type {boolean | null} */ displayAddToGiftRegistry = this.declared('displayAddToGiftRegistry');
}

/** The `configuration` section — what the product page itself shows, in four blocks. */
export class Configuration extends Dto {
    static ENVELOPE_KEY = 'configuration';

    static FIELDS = {
        actionsButtons: ActionButtons,
        details: ProductDetails,
        socialSharing: SocialSharing,
        setProductProperties: SetProductProperties,
    };

    /** @type {ActionButtons | null} */ actionsButtons = this.declared('actionsButtons');
    /** @type {ProductDetails | null} */ details = this.declared('details');
    /** @type {SocialSharing | null} */ socialSharing = this.declared('socialSharing');
    /** @type {SetProductProperties | null} */ setProductProperties = this.declared('setProductProperties');
}

/** The `labels_and_display` block — how a variation is labelled and drawn. */
export class LabelsAndDisplay extends Dto {
    static FIELDS = {
        disableVariationLabelForPrice: 'boolean',
        displayProductImageAsVariationIcons: 'boolean',
        displaySelectedVariationValue: 'boolean',
        enableColourTypeVariationImageDisplay: 'boolean',
        useStrikeThroughForOutOfStockVariations: 'boolean',
        enableSingleClickVariationLoading: 'boolean',
    };

    /** @type {boolean | null} */ disableVariationLabelForPrice = this.declared('disableVariationLabelForPrice');
    /** @type {boolean | null} */ displayProductImageAsVariationIcons = this.declared(
        'displayProductImageAsVariationIcons',
    );
    /** @type {boolean | null} */ displaySelectedVariationValue = this.declared('displaySelectedVariationValue');
    /** @type {boolean | null} */ enableColourTypeVariationImageDisplay = this.declared(
        'enableColourTypeVariationImageDisplay',
    );
    /** @type {boolean | null} */ useStrikeThroughForOutOfStockVariations = this.declared(
        'useStrikeThroughForOutOfStockVariations',
    );
    /** @type {boolean | null} */ enableSingleClickVariationLoading = this.declared(
        'enableSingleClickVariationLoading',
    );
}

/** One entry of `layout.variation_combinations`; take ids from `field_metadata`'s `allowed_values`. */
export class VariationType extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `layout` block — how variations are laid out and which price is shown. */
export class VariationLayout extends Dto {
    static FIELDS = {
        selectVariationView: 'boolean',
        selectVariationViewType: 'string',
        displayVariationCombinations: 'boolean',
        variationCombinations: dtoList(VariationType),
        variationPriceDisplayMode: 'boolean',
        variationPriceDisplayType: 'string',
    };

    /** @type {boolean | null} */ selectVariationView = this.declared('selectVariationView');
    /** @type {string | null} */ selectVariationViewType = this.declared('selectVariationViewType');
    /** @type {boolean | null} */ displayVariationCombinations = this.declared('displayVariationCombinations');
    /** @type {Array<VariationType | null> | null} */ variationCombinations = this.declared('variationCombinations');
    /** @type {boolean | null} */ variationPriceDisplayMode = this.declared('variationPriceDisplayMode');
    /** @type {string | null} */ variationPriceDisplayType = this.declared('variationPriceDisplayType');
}

/** The `variations` section — how a product's variations are labelled and laid out. */
export class Variations extends Dto {
    static ENVELOPE_KEY = 'variations';

    static FIELDS = {
        labelsAndDisplay: LabelsAndDisplay,
        layout: VariationLayout,
    };

    /** @type {LabelsAndDisplay | null} */ labelsAndDisplay = this.declared('labelsAndDisplay');
    /** @type {VariationLayout | null} */ layout = this.declared('layout');
}

/** The `image_display` block — how product images are laid out and zoomed. */
export class ImageDisplay extends Dto {
    static FIELDS = {
        enableImageSlider: 'boolean',
        productThumbnailVerticalView: 'boolean',
        productImageView: 'boolean',
        productImageViewType: 'string',
        imageZoomType: 'boolean',
        zoomType: 'string',
    };

    /** @type {boolean | null} */ enableImageSlider = this.declared('enableImageSlider');
    /** @type {boolean | null} */ productThumbnailVerticalView = this.declared('productThumbnailVerticalView');
    /** @type {boolean | null} */ productImageView = this.declared('productImageView');
    /** @type {string | null} */ productImageViewType = this.declared('productImageViewType');
    /** @type {boolean | null} */ imageZoomType = this.declared('imageZoomType');
    /** @type {string | null} */ zoomType = this.declared('zoomType');
}

/** The `video` block — whether a product video is previewed and where its thumbnail sits. */
export class ProductVideo extends Dto {
    static FIELDS = {
        enableVideoPreview: 'boolean',
        displayVideoThumbnailInFirstOrder: 'boolean',
    };

    /** @type {boolean | null} */ enableVideoPreview = this.declared('enableVideoPreview');
    /** @type {boolean | null} */ displayVideoThumbnailInFirstOrder = this.declared(
        'displayVideoThumbnailInFirstOrder',
    );
}

/** The `image_and_video` section — one field of its own beside two blocks. */
export class ImageAndVideo extends Dto {
    static ENVELOPE_KEY = 'image_and_video';

    static FIELDS = {
        allowSingleFileUploadPerProduct: 'boolean',
        imageDisplay: ImageDisplay,
        video: ProductVideo,
    };

    /** @type {boolean | null} */ allowSingleFileUploadPerProduct = this.declared('allowSingleFileUploadPerProduct');
    /** @type {ImageDisplay | null} */ imageDisplay = this.declared('imageDisplay');
    /** @type {ProductVideo | null} */ video = this.declared('video');
}

/** The fields a product listing carries, inherited by the two sections that hold one; column counts are numbers. */
export class ProductListing extends Dto {
    static FIELDS = {
        numberOfProducts: 'int',
        allowViewersToChangeDisplayMode: 'boolean',
        gridView: 'boolean',
        listView: 'boolean',
        tabularView: 'boolean',
        selectDisplayType: 'string',
        maximumNumberOfColumnsPerRow: 'int',
        maximumNumberOfColumnsPerRowList: 'int',
        shortDescription: 'boolean',
        displayOnHover: 'boolean',
        displayAddToCartButton: 'boolean',
        displayAddToCompareButton: 'boolean',
        displayAddToWishlistButton: 'boolean',
        price: 'boolean',
        showExpectToPayPrice: 'boolean',
        displayRating: 'boolean',
        displayReviewCount: 'boolean',
    };

    /** @type {number | null} */ numberOfProducts = this.declared('numberOfProducts');
    /** @type {boolean | null} */ allowViewersToChangeDisplayMode = this.declared('allowViewersToChangeDisplayMode');
    /** @type {boolean | null} */ gridView = this.declared('gridView');
    /** @type {boolean | null} */ listView = this.declared('listView');
    /** @type {boolean | null} */ tabularView = this.declared('tabularView');
    /** @type {string | null} */ selectDisplayType = this.declared('selectDisplayType');
    /** @type {number | null} */ maximumNumberOfColumnsPerRow = this.declared('maximumNumberOfColumnsPerRow');
    /** @type {number | null} */ maximumNumberOfColumnsPerRowList = this.declared('maximumNumberOfColumnsPerRowList');
    /** @type {boolean | null} */ shortDescription = this.declared('shortDescription');
    /** @type {boolean | null} */ displayOnHover = this.declared('displayOnHover');
    /** @type {boolean | null} */ displayAddToCartButton = this.declared('displayAddToCartButton');
    /** @type {boolean | null} */ displayAddToCompareButton = this.declared('displayAddToCompareButton');
    /** @type {boolean | null} */ displayAddToWishlistButton = this.declared('displayAddToWishlistButton');
    /** @type {boolean | null} */ price = this.declared('price');
    /** @type {boolean | null} */ showExpectToPayPrice = this.declared('showExpectToPayPrice');
    /** @type {boolean | null} */ displayRating = this.declared('displayRating');
    /** @type {boolean | null} */ displayReviewCount = this.declared('displayReviewCount');
}

/** The `up_sell` section, a flat {@link ProductListing}. */
export class UpSell extends ProductListing {
    static ENVELOPE_KEY = 'up_sell';
}

/** The `related_products` section, a flat {@link ProductListing}. */
export class RelatedProducts extends ProductListing {
    static ENVELOPE_KEY = 'related_products';
}

/** The `capabilities` block — what the review plugin provides; read-only. */
export class ReviewCapabilities extends Dto {
    static FIELDS = {
        available: 'boolean',
    };

    /** @type {boolean | null} */ available = this.declared('available');
}

/** The `review_and_ratings` section — where reviews appear and which version renders them. */
export class ReviewAndRatings extends Dto {
    static ENVELOPE_KEY = 'review_and_ratings';

    static FIELDS = {
        capabilities: ReviewCapabilities,
        enableReviewInTab: 'boolean',
        enableNewVersion: 'boolean',
    };

    /** @type {ReviewCapabilities | null} */ capabilities = this.declared('capabilities');
    /** @type {boolean | null} */ enableReviewInTab = this.declared('enableReviewInTab');
    /** @type {boolean | null} */ enableNewVersion = this.declared('enableNewVersion');
}

/** The `quick_view` section — the quick-view popup and what it shows. */
export class QuickView extends Dto {
    static ENVELOPE_KEY = 'quick_view';

    static FIELDS = {
        productQuickView: 'boolean',
        displayProductName: 'boolean',
        displaySku: 'boolean',
        displayProductRating: 'boolean',
        displayProductStock: 'boolean',
        displayProductVariation: 'boolean',
        displayProductImage: 'boolean',
        displayVariationImage: 'boolean',
        displayProductSummary: 'boolean',
        displayAddToCartButton: 'boolean',
        displayAddToCompareButton: 'boolean',
        displayAddToWishlistButton: 'boolean',
    };

    /** @type {boolean | null} */ productQuickView = this.declared('productQuickView');
    /** @type {boolean | null} */ displayProductName = this.declared('displayProductName');
    /** @type {boolean | null} */ displaySku = this.declared('displaySku');
    /** @type {boolean | null} */ displayProductRating = this.declared('displayProductRating');
    /** @type {boolean | null} */ displayProductStock = this.declared('displayProductStock');
    /** @type {boolean | null} */ displayProductVariation = this.declared('displayProductVariation');
    /** @type {boolean | null} */ displayProductImage = this.declared('displayProductImage');
    /** @type {boolean | null} */ displayVariationImage = this.declared('displayVariationImage');
    /** @type {boolean | null} */ displayProductSummary = this.declared('displayProductSummary');
    /** @type {boolean | null} */ displayAddToCartButton = this.declared('displayAddToCartButton');
    /** @type {boolean | null} */ displayAddToCompareButton = this.declared('displayAddToCompareButton');
    /** @type {boolean | null} */ displayAddToWishlistButton = this.declared('displayAddToWishlistButton');
}

/** One entry of `group_meta`; the plugin-backed one also carries `plugin` and `available`. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        plugin: 'string',
        available: 'boolean',
        uiLabel: 'string',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ plugin = this.declared('plugin');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {string | null} */ uiLabel = this.declared('uiLabel');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block — one {@link SectionMeta} per section; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        configuration: SectionMeta,
        variations: SectionMeta,
        imageAndVideo: SectionMeta,
        upSell: SectionMeta,
        relatedProducts: SectionMeta,
        reviewAndRatings: SectionMeta,
        quickView: SectionMeta,
    };

    /** @type {SectionMeta | null} */ configuration = this.declared('configuration');
    /** @type {SectionMeta | null} */ variations = this.declared('variations');
    /** @type {SectionMeta | null} */ imageAndVideo = this.declared('imageAndVideo');
    /** @type {SectionMeta | null} */ upSell = this.declared('upSell');
    /** @type {SectionMeta | null} */ relatedProducts = this.declared('relatedProducts');
    /** @type {SectionMeta | null} */ reviewAndRatings = this.declared('reviewAndRatings');
    /** @type {SectionMeta | null} */ quickView = this.declared('quickView');
}

/** The product page settings in either form the API sends. */
export class ProductPage extends Dto {
    static ENVELOPE_KEY = 'product_page';

    static FIELDS = {
        configuration: Configuration,
        variations: Variations,
        imageAndVideo: ImageAndVideo,
        upSell: UpSell,
        relatedProducts: RelatedProducts,
        reviewAndRatings: ReviewAndRatings,
        quickView: QuickView,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Configuration | null} */ configuration = this.declared('configuration');
    /** @type {Variations | null} */ variations = this.declared('variations');
    /** @type {ImageAndVideo | null} */ imageAndVideo = this.declared('imageAndVideo');
    /** @type {UpSell | null} */ upSell = this.declared('upSell');
    /** @type {RelatedProducts | null} */ relatedProducts = this.declared('relatedProducts');
    /** @type {ReviewAndRatings | null} */ reviewAndRatings = this.declared('reviewAndRatings');
    /** @type {QuickView | null} */ quickView = this.declared('quickView');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    ActionButtons,
    ProductDetails,
    SocialSharing,
    SetProductProperties,
    Configuration,
    LabelsAndDisplay,
    VariationType,
    VariationLayout,
    Variations,
    ImageDisplay,
    ProductVideo,
    ImageAndVideo,
    ProductListing,
    UpSell,
    RelatedProducts,
    ReviewCapabilities,
    ReviewAndRatings,
    QuickView,
    SectionMeta,
    GroupMeta,
    ProductPage,
);
