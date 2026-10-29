import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The product's slug and its absolute storefront address. */
export class ProductUrls extends Dto {
    static FIELDS = {
        url: 'string',
        productUrl: 'string',
    };

    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ productUrl = this.declared('productUrl');
}

/** An `id` and a `name`: an author, a page, a customer or a customer group. */
export class ProductNamedReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One category the product is filed under. */
export class ProductParent extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        isInTrash: 'boolean',
        isParentInTrash: 'boolean',
        isDisposable: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isInTrash = this.declared('isInTrash');
    /** @type {boolean | null} */ isParentInTrash = this.declared('isParentInTrash');
    /** @type {boolean | null} */ isDisposable = this.declared('isDisposable');
}

/** One customer an audience names: `id` is the customer's `customer_id`, `internalId` its `internal_id`. */
export class ProductSelectedCustomer extends Dto {
    static FIELDS = {
        id: 'int',
        internalId: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ internalId = this.declared('internalId');
    /** @type {string | null} */ name = this.declared('name');
}

/** Who `available_for: selected` admits, or whom a restriction names; both lists are empty when nobody is named. */
export class ProductSelectedCustomers extends Dto {
    static FIELDS = {
        customers: dtoList(ProductSelectedCustomer),
        groups: dtoList(ProductNamedReference),
    };

    /** @type {Array<ProductSelectedCustomer | null> | null} */ customers = this.declared('customers');
    /** @type {Array<ProductNamedReference | null> | null} */ groups = this.declared('groups');
}

/** An audience to write: customer and group ids. A group written as `{"id": ...}` is `400`. */
export class ProductSelectedCustomersInput extends Dto {
    static FIELDS = {
        customers: dtoList('int'),
        groups: dtoList('int'),
    };

    /** @type {Array<number | null> | null} */ customers = this.declared('customers');
    /** @type {Array<number | null> | null} */ groups = this.declared('groups');
}

/** One day of the weekday schedule. */
export class ProductWeekday extends Dto {
    static FIELDS = {
        day: 'string',
        startHour: 'int',
        startMinute: 'int',
        endHour: 'int',
        endMinute: 'int',
        isFullDay: 'boolean',
        enabled: 'boolean',
    };

    /** @type {string | null} */ day = this.declared('day');
    /** @type {number | null} */ startHour = this.declared('startHour');
    /** @type {number | null} */ startMinute = this.declared('startMinute');
    /** @type {number | null} */ endHour = this.declared('endHour');
    /** @type {number | null} */ endMinute = this.declared('endMinute');
    /** @type {boolean | null} */ isFullDay = this.declared('isFullDay');
    /** @type {boolean | null} */ enabled = this.declared('enabled');
}

/** The weekday schedule: a switch and the seven days. */
export class ProductAvailableOnWeekdays extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        weekdays: dtoList(ProductWeekday),
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {Array<ProductWeekday | null> | null} */ weekdays = this.declared('weekdays');
}

/** Dimensions as written; the top level of the product repeats the four numbers read-only. */
export class ProductProperties extends Dto {
    static FIELDS = {
        length: 'float',
        width: 'float',
        height: 'float',
        weight: 'float',
        lengthUnit: 'string',
        weightUnit: 'string',
    };

    /** @type {number | null} */ length = this.declared('length');
    /** @type {number | null} */ width = this.declared('width');
    /** @type {number | null} */ height = this.declared('height');
    /** @type {number | null} */ weight = this.declared('weight');
    /** @type {string | null} */ lengthUnit = this.declared('lengthUnit');
    /** @type {string | null} */ weightUnit = this.declared('weightUnit');
}

/** Per-product tax overrides, applied only when `overwrite_default_config` is `true`. */
export class ProductTaxSettings extends Dto {
    static FIELDS = {
        overwriteDefaultConfig: 'boolean',
        isTaxExempt: 'boolean',
        showPriceWithTax: 'boolean',
        isPriceWithTax: 'boolean',
        systemDefaultTax: 'boolean',
        taxMessage: 'string',
        basePriceRounding: 'string',
        defaultTaxCode: 'string',
        customTaxProfileId: 'string',
    };

    /** @type {boolean | null} */ overwriteDefaultConfig = this.declared('overwriteDefaultConfig');
    /** @type {boolean | null} */ isTaxExempt = this.declared('isTaxExempt');
    /** @type {boolean | null} */ showPriceWithTax = this.declared('showPriceWithTax');
    /** @type {boolean | null} */ isPriceWithTax = this.declared('isPriceWithTax');
    /** @type {boolean | null} */ systemDefaultTax = this.declared('systemDefaultTax');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {string | null} */ customTaxProfileId = this.declared('customTaxProfileId');
}

/**
 * Which variant price a listing shows, and the labels it shows it with. `lowestPriceLabel` and `highestPriceLabel` are
 * second names for the two `labelFor*` fields.
 */
export class ProductVariationPriceDisplay extends Dto {
    static FIELDS = {
        method: 'string',
        labelForLowestPrice: 'string',
        labelForHighestPrice: 'string',
        lowestPriceLabel: 'string',
        highestPriceLabel: 'string',
    };

    /** @type {string | null} */ method = this.declared('method');
    /** @type {string | null} */ labelForLowestPrice = this.declared('labelForLowestPrice');
    /** @type {string | null} */ labelForHighestPrice = this.declared('labelForHighestPrice');
    /** @type {string | null} */ lowestPriceLabel = this.declared('lowestPriceLabel');
    /** @type {string | null} */ highestPriceLabel = this.declared('highestPriceLabel');
}

/** One location's units in the legacy shape; `warehouse` is the location id as text. */
export class ProductWarehouseStock extends Dto {
    static FIELDS = {
        warehouse: 'string',
        stock: 'int',
    };

    /** @type {string | null} */ warehouse = this.declared('warehouse');
    /** @type {number | null} */ stock = this.declared('stock');
}

/** One location's holding of the product; exactly one row of a product holds `is_default`. */
export class ProductStockLocation extends Dto {
    static FIELDS = {
        warehouse: 'int',
        warehouseName: 'string',
        stock: 'int',
        lowStockLevel: 'int',
        isDefault: 'boolean',
    };

    /** @type {number | null} */ warehouse = this.declared('warehouse');
    /** @type {string | null} */ warehouseName = this.declared('warehouseName');
    /** @type {number | null} */ stock = this.declared('stock');
    /** @type {number | null} */ lowStockLevel = this.declared('lowStockLevel');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
}

/**
 * The pricing and stock block. `locations` matches the stock sub-path's rows, and `low_level_stock` follows the default
 * location's `low_stock_level`.
 */
export class ProductPricingAndStock extends Dto {
    static FIELDS = {
        trackInventory: 'boolean',
        availableStock: 'int',
        lowLevelStock: 'int',
        warehouses: dtoList(ProductWarehouseStock),
        minimumOrderQuantity: 'int',
        maximumOrderQuantity: 'int',
        taxProfile: 'any',
        shippingProfile: 'any',
        enableMultipleOrder: 'boolean',
        multipleOrderQuantity: 'int',
        onSale: 'boolean',
        onSalePriceType: 'string',
        onSalePrice: 'float',
        expectedToPay: 'boolean',
        expectedToPayPrice: 'float',
        enableCallForPrice: 'boolean',
        restrictPriceFor: 'string',
        restrictPriceForExceptCustomers: dtoList('any'),
        restrictPurchaseFor: 'string',
        restrictPurchaseForSelectedCustomers: dtoList('any'),
        hidePrice: 'boolean',
        enableCombinedStockSellingLimit: 'boolean',
        combinedStockSellingLimit: 'int',
        enableAdvancePricing: 'boolean',
        suppliers: dtoList('any'),
        isMultiLocationEnabled: 'boolean',
        locations: dtoList(ProductStockLocation),
    };

    /** @type {boolean | null} */ trackInventory = this.declared('trackInventory');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ lowLevelStock = this.declared('lowLevelStock');
    /** @type {Array<ProductWarehouseStock | null> | null} */ warehouses = this.declared('warehouses');
    /** @type {number | null} */ minimumOrderQuantity = this.declared('minimumOrderQuantity');
    /** @type {number | null} */ maximumOrderQuantity = this.declared('maximumOrderQuantity');
    /** @type {unknown} */ taxProfile = this.declared('taxProfile');
    /** @type {unknown} */ shippingProfile = this.declared('shippingProfile');
    /** @type {boolean | null} */ enableMultipleOrder = this.declared('enableMultipleOrder');
    /** @type {number | null} */ multipleOrderQuantity = this.declared('multipleOrderQuantity');
    /** @type {boolean | null} */ onSale = this.declared('onSale');
    /** @type {string | null} */ onSalePriceType = this.declared('onSalePriceType');
    /** @type {number | null} */ onSalePrice = this.declared('onSalePrice');
    /** @type {boolean | null} */ expectedToPay = this.declared('expectedToPay');
    /** @type {number | null} */ expectedToPayPrice = this.declared('expectedToPayPrice');
    /** @type {boolean | null} */ enableCallForPrice = this.declared('enableCallForPrice');
    /** @type {string | null} */ restrictPriceFor = this.declared('restrictPriceFor');
    /** @type {Array<unknown> | null} */ restrictPriceForExceptCustomers = this.declared(
        'restrictPriceForExceptCustomers',
    );
    /** @type {string | null} */ restrictPurchaseFor = this.declared('restrictPurchaseFor');
    /** @type {Array<unknown> | null} */ restrictPurchaseForSelectedCustomers = this.declared(
        'restrictPurchaseForSelectedCustomers',
    );
    /** @type {boolean | null} */ hidePrice = this.declared('hidePrice');
    /** @type {boolean | null} */ enableCombinedStockSellingLimit = this.declared('enableCombinedStockSellingLimit');
    /** @type {number | null} */ combinedStockSellingLimit = this.declared('combinedStockSellingLimit');
    /** @type {boolean | null} */ enableAdvancePricing = this.declared('enableAdvancePricing');
    /** @type {Array<unknown> | null} */ suppliers = this.declared('suppliers');
    /** @type {boolean | null} */ isMultiLocationEnabled = this.declared('isMultiLocationEnabled');
    /** @type {Array<ProductStockLocation | null> | null} */ locations = this.declared('locations');
}

/** One product image. */
export class ProductImage extends Dto {
    static FIELDS = {
        id: 'int',
        filename: 'string',
        altText: 'string',
        thumbnail: 'string',
        link: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ filename = this.declared('filename');
    /** @type {string | null} */ altText = this.declared('altText');
    /** @type {string | null} */ thumbnail = this.declared('thumbnail');
    /** @type {string | null} */ link = this.declared('link');
}

/** One product video, on the product or on a variant. */
export class ProductVideo extends Dto {
    static FIELDS = {
        id: 'int',
        filename: 'string',
        thumbnail: 'string',
        link: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ filename = this.declared('filename');
    /** @type {string | null} */ thumbnail = this.declared('thumbnail');
    /** @type {string | null} */ link = this.declared('link');
}

/** The media block. */
export class ProductImageAndVideo extends Dto {
    static FIELDS = {
        images: dtoList(ProductImage),
        videos: dtoList(ProductVideo),
        specs: dtoList('any'),
    };

    /** @type {Array<ProductImage | null> | null} */ images = this.declared('images');
    /** @type {Array<ProductVideo | null> | null} */ videos = this.declared('videos');
    /** @type {Array<unknown> | null} */ specs = this.declared('specs');
}

/**
 * Identifiers and origin; `mpn`, `upc`, `barcode` and `hs_code` are written here, not at the top level, which refuses
 * them.
 */
export class ProductAdvanceInformation extends Dto {
    static FIELDS = {
        globalTradeItemNumber: 'string',
        enableProductIdentifiers: 'boolean',
        gtin: 'string',
        mpn: 'string',
        upc: 'string',
        barcode: 'string',
        countryOfOrigin: 'string',
        hsCode: 'string',
        productCondition: 'string',
        model: 'string',
    };

    /** @type {string | null} */ globalTradeItemNumber = this.declared('globalTradeItemNumber');
    /** @type {boolean | null} */ enableProductIdentifiers = this.declared('enableProductIdentifiers');
    /** @type {string | null} */ gtin = this.declared('gtin');
    /** @type {string | null} */ mpn = this.declared('mpn');
    /** @type {string | null} */ upc = this.declared('upc');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {string | null} */ productCondition = this.declared('productCondition');
    /** @type {string | null} */ model = this.declared('model');
}

/** A flag and the label shown with it. */
export class ProductFlag extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        label: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ label = this.declared('label');
}

/** The flags in blocks: `isFeatured`, `isNew`, `soldOut` and `model` again. `soldOut` is read-only. */
export class ProductFlags extends Dto {
    static FIELDS = {
        featured: ProductFlag,
        newProduct: 'boolean',
        soldOut: ProductFlag,
        modelNumber: 'string',
    };

    /** @type {ProductFlag | null} */ featured = this.declared('featured');
    /** @type {boolean | null} */ newProduct = this.declared('newProduct');
    /** @type {ProductFlag | null} */ soldOut = this.declared('soldOut');
    /** @type {string | null} */ modelNumber = this.declared('modelNumber');
}

/** `productProperties` again; the two units are read-only here. */
export class ProductDimension extends Dto {
    static FIELDS = {
        lengthUnit: 'string',
        weightUnit: 'string',
        width: 'float',
        height: 'float',
        length: 'float',
        weight: 'float',
    };

    /** @type {string | null} */ lengthUnit = this.declared('lengthUnit');
    /** @type {string | null} */ weightUnit = this.declared('weightUnit');
    /** @type {number | null} */ width = this.declared('width');
    /** @type {number | null} */ height = this.declared('height');
    /** @type {number | null} */ length = this.declared('length');
    /** @type {number | null} */ weight = this.declared('weight');
}

/** `advanceInformation` again: a write here changes it there, `condition` being its `productCondition`. */
export class ProductIdentifiers extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        gtin: 'string',
        condition: 'string',
        barcode: 'string',
        hsCode: 'string',
        countryOfOrigin: 'string',
        mpn: 'string',
        upc: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ gtin = this.declared('gtin');
    /** @type {string | null} */ condition = this.declared('condition');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ mpn = this.declared('mpn');
    /** @type {string | null} */ upc = this.declared('upc');
}

/** `webtoolDisableTracking` again, read-only. */
export class ProductWebtool extends Dto {
    static FIELDS = {
        disableTracking: 'boolean',
    };

    /** @type {boolean | null} */ disableTracking = this.declared('disableTracking');
}

/** The advanced block. */
export class ProductAdvanced extends Dto {
    static FIELDS = {
        advanceInformation: ProductAdvanceInformation,
        webtoolDisableTracking: 'boolean',
        metaTags: dtoList('any'),
        productFlags: ProductFlags,
        productDimension: ProductDimension,
        productIdentifiers: ProductIdentifiers,
        webtool: ProductWebtool,
    };

    /** @type {ProductAdvanceInformation | null} */ advanceInformation = this.declared('advanceInformation');
    /** @type {boolean | null} */ webtoolDisableTracking = this.declared('webtoolDisableTracking');
    /** @type {Array<unknown> | null} */ metaTags = this.declared('metaTags');
    /** @type {ProductFlags | null} */ productFlags = this.declared('productFlags');
    /** @type {ProductDimension | null} */ productDimension = this.declared('productDimension');
    /** @type {ProductIdentifiers | null} */ productIdentifiers = this.declared('productIdentifiers');
    /** @type {ProductWebtool | null} */ webtool = this.declared('webtool');
}

/**
 * A related, similar or up-sell product. A write takes `{"id": ...}`; a list of bare ids in `upSellProducts` is answered
 * `200` and leaves it empty.
 */
export class ProductLink extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        url: 'string',
        status: 'string',
        sku: 'string',
        inStock: 'boolean',
        price: 'float',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {boolean | null} */ inStock = this.declared('inStock');
    /** @type {number | null} */ price = this.declared('price');
}

/** The bundle block; `bundle` is `null` on a product that is not a bundle. */
export class ProductBundle extends Dto {
    static FIELDS = {
        priceFixed: 'boolean',
        quantityFlexible: 'boolean',
        items: dtoList('any'),
    };

    /** @type {boolean | null} */ priceFixed = this.declared('priceFixed');
    /** @type {boolean | null} */ quantityFlexible = this.declared('quantityFlexible');
    /** @type {Array<unknown> | null} */ items = this.declared('items');
}

/** One SEO setting on the product. */
export class ProductSeoConfig extends Dto {
    static FIELDS = {
        id: 'int',
        value: 'string',
        type: 'string',
        configKey: 'string',
        metaTags: dtoList('any'),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ configKey = this.declared('configKey');
    /** @type {Array<unknown> | null} */ metaTags = this.declared('metaTags');
}

/** One value of a product tag. */
export class ProductTagValue extends Dto {
    static FIELDS = {
        id: 'int',
        title: 'string',
        value: 'string',
        url: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {string | null} */ url = this.declared('url');
}

/** One tag on the product, with its values. */
export class ProductTag extends Dto {
    static FIELDS = {
        id: 'int',
        tagId: 'int',
        name: 'string',
        values: dtoList(ProductTagValue),
        displayInProductPage: 'boolean',
        enableExpandedView: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ tagId = this.declared('tagId');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {Array<ProductTagValue | null> | null} */ values = this.declared('values');
    /** @type {boolean | null} */ displayInProductPage = this.declared('displayInProductPage');
    /** @type {boolean | null} */ enableExpandedView = this.declared('enableExpandedView');
}

/** One custom property. */
export class ProductCustomProperty extends Dto {
    static FIELDS = {
        id: 'int',
        label: 'string',
        description: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ description = this.declared('description');
}

/** Who wrote a review; `name` and `email` again. */
export class ProductReviewer extends Dto {
    static FIELDS = {
        name: 'string',
        email: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
}

const REVIEW_PRODUCT_ID_KEY = 'productId';

/**
 * One review; `productId` is camel case on the wire, so this type maps that key itself. `comment` and `createdAt` repeat
 * `review` and `date`; `createdAt` carries a `Z`.
 */
export class ProductReview extends Dto {
    static FIELDS = {
        id: 'int',
        productId: 'int',
        name: 'string',
        email: 'string',
        review: 'string',
        rating: 'float',
        date: 'string',
        status: 'string',
        files: dtoList('any'),
        reviewer: ProductReviewer,
        comment: 'string',
        createdAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ review = this.declared('review');
    /** @type {number | null} */ rating = this.declared('rating');
    /** @type {string | null} */ date = this.declared('date');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {Array<unknown> | null} */ files = this.declared('files');
    /** @type {ProductReviewer | null} */ reviewer = this.declared('reviewer');
    /** @type {string | null} */ comment = this.declared('comment');
    /** @type {string | null} */ createdAt = this.declared('createdAt');

    /** @returns {Record<string, string>} */
    static fields() {
        return Object.freeze({...super.fields(), productId: REVIEW_PRODUCT_ID_KEY});
    }

    /** @param {unknown} body @returns {any} */
    static fromMap(body) {
        const record = /** @type {any} */ (super.fromMap(body));
        const value = /** @type {Record<string, unknown>} */ (body)[REVIEW_PRODUCT_ID_KEY];
        record.productId = Number.isInteger(value) ? value : null;
        return record;
    }

    /** @returns {Record<string, unknown>} */
    toMap() {
        const {product_id: productId, ...record} = super.toMap();
        return productId === undefined ? record : {...record, [REVIEW_PRODUCT_ID_KEY]: productId};
    }
}

/** One option of a variation type the product uses. */
export class ProductVariationTypeOption extends Dto {
    static FIELDS = {
        id: 'int',
        label: 'string',
        value: 'string',
        default: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {boolean | null} */ default = this.declared('default');
}

/** One variation type the product uses, with its options. */
export class ProductVariationType extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        standard: 'string',
        options: dtoList(ProductVariationTypeOption),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ standard = this.declared('standard');
    /** @type {Array<ProductVariationTypeOption | null> | null} */ options = this.declared('options');
}

/** The type one option of a combination belongs to. */
export class ProductCombinationOptionType extends Dto {
    static FIELDS = {
        id: 'int',
        role: 'string',
        name: 'string',
        standard: 'string',
        isDisposable: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ role = this.declared('role');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ standard = this.declared('standard');
    /** @type {boolean | null} */ isDisposable = this.declared('isDisposable');
}

/** One option of a combination; `type` is a list of one type. */
export class ProductCombinationOption extends Dto {
    static FIELDS = {
        id: 'int',
        index: 'int',
        type: dtoList(ProductCombinationOptionType),
        label: 'string',
        value: 'string',
        colorHasSwatch: 'boolean',
        colorSwatchValue: 'string',
        imageBaseUrl: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {number | null} */ index = this.declared('index');
    /** @type {Array<ProductCombinationOptionType | null> | null} */ type = this.declared('type');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {boolean | null} */ colorHasSwatch = this.declared('colorHasSwatch');
    /** @type {string | null} */ colorSwatchValue = this.declared('colorSwatchValue');
    /** @type {string | null} */ imageBaseUrl = this.declared('imageBaseUrl');
}

/** One variant image. */
export class ProductCombinationImage extends Dto {
    static FIELDS = {
        id: 'int',
        thumbnail: 'string',
        url: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ thumbnail = this.declared('thumbnail');
    /** @type {string | null} */ url = this.declared('url');
}

/** A variant's pricing and stock block. */
export class ProductCombinationPriceAndStock extends Dto {
    static FIELDS = {
        trackInventory: 'boolean',
        availableStock: 'int',
        lowLevelStock: 'int',
        minimumOrderQuantity: 'int',
        maximumOrderQuantity: 'int',
        supportedMaxOrderQuantity: 'int',
        enableMultipleOrder: 'boolean',
        multipleOrderQuantity: 'int',
        onSale: 'boolean',
        soldOut: 'boolean',
        soldOutLabel: 'string',
        onSalePriceType: 'string',
        onSalePrice: 'float',
        expectedToPay: 'boolean',
        expectedToPayPrice: 'float',
        enableCallForPrice: 'boolean',
        hidePrice: 'boolean',
    };

    /** @type {boolean | null} */ trackInventory = this.declared('trackInventory');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ lowLevelStock = this.declared('lowLevelStock');
    /** @type {number | null} */ minimumOrderQuantity = this.declared('minimumOrderQuantity');
    /** @type {number | null} */ maximumOrderQuantity = this.declared('maximumOrderQuantity');
    /** @type {number | null} */ supportedMaxOrderQuantity = this.declared('supportedMaxOrderQuantity');
    /** @type {boolean | null} */ enableMultipleOrder = this.declared('enableMultipleOrder');
    /** @type {number | null} */ multipleOrderQuantity = this.declared('multipleOrderQuantity');
    /** @type {boolean | null} */ onSale = this.declared('onSale');
    /** @type {boolean | null} */ soldOut = this.declared('soldOut');
    /** @type {string | null} */ soldOutLabel = this.declared('soldOutLabel');
    /** @type {string | null} */ onSalePriceType = this.declared('onSalePriceType');
    /** @type {number | null} */ onSalePrice = this.declared('onSalePrice');
    /** @type {boolean | null} */ expectedToPay = this.declared('expectedToPay');
    /** @type {number | null} */ expectedToPayPrice = this.declared('expectedToPayPrice');
    /** @type {boolean | null} */ enableCallForPrice = this.declared('enableCallForPrice');
    /** @type {boolean | null} */ hidePrice = this.declared('hidePrice');
}

/** One variant. `weight`, `height`, `length` and `width` arrive as a number or as text, so they are not typed. */
export class ProductCombinationDetails extends Dto {
    static FIELDS = {
        variationId: 'int',
        available: 'boolean',
        productName: 'string',
        sku: 'string',
        customSku: 'string',
        urls: ProductUrls,
        metaTags: dtoList('any'),
        isInventoryEnabled: 'boolean',
        availableStock: 'int',
        lowStockLevel: 'int',
        spec: 'string',
        isMultipleOrderQuantity: 'boolean',
        isOnSale: 'boolean',
        isExpectToPay: 'boolean',
        isCallForPriceEnabled: 'boolean',
        isNew: 'boolean',
        isFeatured: 'boolean',
        onSaleAmountType: 'string',
        title: 'string',
        heading: 'string',
        summary: 'string',
        description: 'string',
        model: 'string',
        productCondition: 'string',
        featuredLabel: 'string',
        basePrice: 'float',
        costPrice: 'float',
        compareAtPrice: 'float',
        salePrice: 'float',
        expectToPayPrice: 'float',
        weight: 'any',
        height: 'any',
        length: 'any',
        width: 'any',
        displayPrice: 'float',
        previousPrice: 'float',
        priceAndStock: ProductCombinationPriceAndStock,
        images: dtoList(ProductCombinationImage),
        videos: dtoList(ProductVideo),
        specs: dtoList('any'),
        supportedMaxOrderQuantity: 'int',
        isBase: 'boolean',
        barcode: 'string',
        countryOfOrigin: 'string',
        hsCode: 'string',
        tax: 'float',
        taxMessage: 'string',
    };

    /** @type {number | null} */ variationId = this.declared('variationId');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {string | null} */ productName = this.declared('productName');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ customSku = this.declared('customSku');
    /** @type {ProductUrls | null} */ urls = this.declared('urls');
    /** @type {Array<unknown> | null} */ metaTags = this.declared('metaTags');
    /** @type {boolean | null} */ isInventoryEnabled = this.declared('isInventoryEnabled');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ lowStockLevel = this.declared('lowStockLevel');
    /** @type {string | null} */ spec = this.declared('spec');
    /** @type {boolean | null} */ isMultipleOrderQuantity = this.declared('isMultipleOrderQuantity');
    /** @type {boolean | null} */ isOnSale = this.declared('isOnSale');
    /** @type {boolean | null} */ isExpectToPay = this.declared('isExpectToPay');
    /** @type {boolean | null} */ isCallForPriceEnabled = this.declared('isCallForPriceEnabled');
    /** @type {boolean | null} */ isNew = this.declared('isNew');
    /** @type {boolean | null} */ isFeatured = this.declared('isFeatured');
    /** @type {string | null} */ onSaleAmountType = this.declared('onSaleAmountType');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ heading = this.declared('heading');
    /** @type {string | null} */ summary = this.declared('summary');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ model = this.declared('model');
    /** @type {string | null} */ productCondition = this.declared('productCondition');
    /** @type {string | null} */ featuredLabel = this.declared('featuredLabel');
    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ compareAtPrice = this.declared('compareAtPrice');
    /** @type {number | null} */ salePrice = this.declared('salePrice');
    /** @type {number | null} */ expectToPayPrice = this.declared('expectToPayPrice');
    /** @type {unknown} */ weight = this.declared('weight');
    /** @type {unknown} */ height = this.declared('height');
    /** @type {unknown} */ length = this.declared('length');
    /** @type {unknown} */ width = this.declared('width');
    /** @type {number | null} */ displayPrice = this.declared('displayPrice');
    /** @type {number | null} */ previousPrice = this.declared('previousPrice');
    /** @type {ProductCombinationPriceAndStock | null} */ priceAndStock = this.declared('priceAndStock');
    /** @type {Array<ProductCombinationImage | null> | null} */ images = this.declared('images');
    /** @type {Array<ProductVideo | null> | null} */ videos = this.declared('videos');
    /** @type {Array<unknown> | null} */ specs = this.declared('specs');
    /** @type {number | null} */ supportedMaxOrderQuantity = this.declared('supportedMaxOrderQuantity');
    /** @type {boolean | null} */ isBase = this.declared('isBase');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
}

/** One option combination and the variant it makes. */
export class ProductCombination extends Dto {
    static FIELDS = {
        options: dtoList(ProductCombinationOption),
        details: ProductCombinationDetails,
    };

    /** @type {Array<ProductCombinationOption | null> | null} */ options = this.declared('options');
    /** @type {ProductCombinationDetails | null} */ details = this.declared('details');
}

/** The variation block; `{}` on a product with no variations, so every field reads `null`. */
export class ProductVariation extends Dto {
    static FIELDS = {
        types: dtoList(ProductVariationType),
        availableCombinations: dtoList(ProductCombination),
    };

    /** @type {Array<ProductVariationType | null> | null} */ types = this.declared('types');
    /** @type {Array<ProductCombination | null> | null} */ availableCombinations =
        this.declared('availableCombinations');
}

/** One category the product is filed under, as `categories` lists it; `parents` again. */
export class ProductCategory extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        inTrash: 'boolean',
        parentInTrash: 'boolean',
        disposable: 'boolean',
    };

    /**
     * @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ inTrash = this.declared('inTrash');
    /** @type {boolean | null} */ parentInTrash = this.declared('parentInTrash');
    /** @type {boolean | null} */ disposable = this.declared('disposable');
}

/** One image in the media block.
 */
export class ProductMediaImage extends Dto {
    static FIELDS = {
        id: 'int',
        filename: 'string',
        position: 'int',
        primary: 'boolean',
        altText: 'string',
        url: 'string',
        thumbnailUrl: 'string',
    };

    /**
     * @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ filename = this.declared('filename');
    /** @type {number | null} */ position = this.declared('position');
    /** @type {boolean | null} */ primary = this.declared('primary');
    /** @type {string | null} */ altText = this.declared('altText');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ thumbnailUrl = this.declared('thumbnailUrl');
}

/** One video in the media block.
 */
export class ProductMediaVideo extends Dto {
    static FIELDS = {
        id: 'int',
        filename: 'string',
        position: 'int',
        url: 'string',
        thumbnailUrl: 'string',
    };

    /**
     * @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ filename = this.declared('filename');
    /** @type {number | null} */ position = this.declared('position');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ thumbnailUrl = this.declared('thumbnailUrl');
}

/** The media block. A write names files the product already holds, by `id`; another id is `400`.
 * `specificationFile` was `null` on every product read, so it is not typed.
 */
export class ProductMedia extends Dto {
    static FIELDS = {
        images: dtoList(ProductMediaImage),
        videos: dtoList(ProductMediaVideo),
        specificationFile: 'any',
    };

    /**
     * @type {Array<ProductMediaImage | null> | null} */ images = this.declared('images');
    /** @type {Array<ProductMediaVideo | null> | null} */ videos = this.declared('videos');
    /** @type {unknown} */ specificationFile = this.declared('specificationFile');
}

/** One day of the schedule; times are `HH:mm`.
 */
export class ProductWeekdayWindow extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        fullDay: 'boolean',
        startTime: 'string',
        endTime: 'string',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ fullDay = this.declared('fullDay');
    /** @type {string | null} */ startTime = this.declared('startTime');
    /** @type {string | null} */ endTime = this.declared('endTime');
}

/** The seven days of the schedule, each always present.
 */
export class ProductScheduleWeekdays extends Dto {
    static FIELDS = {
        monday: ProductWeekdayWindow,
        tuesday: ProductWeekdayWindow,
        wednesday: ProductWeekdayWindow,
        thursday: ProductWeekdayWindow,
        friday: ProductWeekdayWindow,
        saturday: ProductWeekdayWindow,
        sunday: ProductWeekdayWindow,
    };

    /**
     * @type {ProductWeekdayWindow | null} */ monday = this.declared('monday');
    /** @type {ProductWeekdayWindow | null} */ tuesday = this.declared('tuesday');
    /** @type {ProductWeekdayWindow | null} */ wednesday = this.declared('wednesday');
    /** @type {ProductWeekdayWindow | null} */ thursday = this.declared('thursday');
    /** @type {ProductWeekdayWindow | null} */ friday = this.declared('friday');
    /** @type {ProductWeekdayWindow | null} */ saturday = this.declared('saturday');
    /** @type {ProductWeekdayWindow | null} */ sunday = this.declared('sunday');
}

/** When the product is on sale. `type` is `scheduleType` (`date_range` or `custom_schedule`), `preset` is
 * `customScheduleOption` (`all_days`, `weekdays`, `business_hour`, `weekends` or `custom`).
 */
export class ProductSchedule extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        type: 'string',
        startDate: 'string',
        endDate: 'string',
        preset: 'string',
        weekdays: ProductScheduleWeekdays,
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ startDate = this.declared('startDate');
    /** @type {string | null} */ endDate = this.declared('endDate');
    /** @type {string | null} */ preset = this.declared('preset');
    /** @type {ProductScheduleWeekdays | null} */ weekdays = this.declared('weekdays');
}

/** `passwordProtected` and `password` again; a set password reads `***`.
 */
export class ProductPasswordProtection extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        password: 'string',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ password = this.declared('password');
}

/** Availability in one block: `enabled` is `available`, `active` is `administrativeStatus`, `whoCanView` is
 * `availableFor`. `restrictForSelectedCustomers` is read-only.
 */
export class ProductAvailableForPurchase extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        active: 'boolean',
        whoCanView: 'string',
        selectedCustomers: ProductSelectedCustomers,
        restrictForSelectedCustomers: ProductSelectedCustomers,
        schedule: ProductSchedule,
        passwordProtection: ProductPasswordProtection,
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {string | null} */ whoCanView = this.declared('whoCanView');
    /** @type {ProductSelectedCustomers | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {ProductSelectedCustomers | null} */ restrictForSelectedCustomers =
        this.declared('restrictForSelectedCustomers');
    /** @type {ProductSchedule | null} */ schedule = this.declared('schedule');
    /** @type {ProductPasswordProtection | null} */ passwordProtection = this.declared('passwordProtection');
}

/** The availability block to write. While `enabled` is `false` the store answers `200` and keeps none of
 * `whoCanView`, `schedule` or `passwordProtection`.
 */
export class ProductAvailableForPurchaseInput extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        active: 'boolean',
        whoCanView: 'string',
        selectedCustomers: ProductSelectedCustomersInput,
        schedule: ProductSchedule,
        passwordProtection: ProductPasswordProtection,
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {string | null} */ whoCanView = this.declared('whoCanView');
    /** @type {ProductSelectedCustomersInput | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {ProductSchedule | null} */ schedule = this.declared('schedule');
    /** @type {ProductPasswordProtection | null} */ passwordProtection = this.declared('passwordProtection');
}

/** The sale price; `amountType` is `onSalePriceType`.
 */
export class ProductOnSale extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        discountedPrice: 'float',
        amountType: 'string',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ discountedPrice = this.declared('discountedPrice');
    /** @type {string | null} */ amountType = this.declared('amountType');
}

/** Order in multiples of `multipleOf`.
 */
export class ProductQuantityMultiple extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        multipleOf: 'int',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ multipleOf = this.declared('multipleOf');
}

/** The expect-to-pay price.
 */
export class ProductExpectToPay extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        price: 'float',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ price = this.declared('price');
}

/** The advanced pricing switches.
 */
export class ProductAdvancedPricing extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        quantityMultiple: ProductQuantityMultiple,
        expectToPay: ProductExpectToPay,
        callForPrice: 'boolean',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {ProductQuantityMultiple | null} */ quantityMultiple = this.declared('quantityMultiple');
    /** @type {ProductExpectToPay | null} */ expectToPay = this.declared('expectToPay');
    /** @type {boolean | null} */ callForPrice = this.declared('callForPrice');
}

/** Prices in one block; `rrpPrice` is `compareAtPrice`. On a create `basePrice` here stands in for the top-level one.
 */
export class ProductPricing extends Dto {
    static FIELDS = {
        basePrice: 'float',
        costPrice: 'float',
        rrpPrice: 'float',
        onSale: ProductOnSale,
        advancedPricing: ProductAdvancedPricing,
    };

    /**
     * @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ rrpPrice = this.declared('rrpPrice');
    /** @type {ProductOnSale | null} */ onSale = this.declared('onSale');
    /** @type {ProductAdvancedPricing | null} */ advancedPricing = this.declared('advancedPricing');
}

/** Stock tracking; `suppliers` echoes the ids written.
 */
export class ProductInventoryTracking extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        availableStock: 'int',
        lowStockLevel: 'int',
        suppliers: dtoList('any'),
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ lowStockLevel = this.declared('lowStockLevel');
    /** @type {Array<unknown> | null} */ suppliers = this.declared('suppliers');
}

/** The combined stock selling limit.
 */
export class ProductCombinedStockLimit extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        units: 'int',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ units = this.declared('units');
}

/** Stock in one block; `preorder` is `preorderEnabled`.
 */
export class ProductInventory extends Dto {
    static FIELDS = {
        tracking: ProductInventoryTracking,
        combinedStockLimit: ProductCombinedStockLimit,
        preorder: 'boolean',
    };

    /**
     * @type {ProductInventoryTracking | null} */ tracking = this.declared('tracking');
    /** @type {ProductCombinedStockLimit | null} */ combinedStockLimit = this.declared('combinedStockLimit');
    /** @type {boolean | null} */ preorder = this.declared('preorder');
}

/** The order quantity limits; a `maxQuantity` of `0` is no maximum.
 */
export class ProductOrdering extends Dto {
    static FIELDS = {
        minQuantity: 'int',
        maxQuantity: 'int',
    };

    /**
     * @type {number | null} */ minQuantity = this.declared('minQuantity');
    /** @type {number | null} */ maxQuantity = this.declared('maxQuantity');
}

/** A price or purchase restriction. Only `mode` is written; `enabled` is read-only and `customers` is answered
 * `200` but kept empty.
 */
export class ProductRestriction extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        mode: 'string',
        customers: dtoList('any'),
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ mode = this.declared('mode');
    /** @type {Array<unknown> | null} */ customers = this.declared('customers');
}

/** `restrictPriceFor` and `restrictPurchaseFor` in one block; `enabled` and `displayOnly` are read-only.
 */
export class ProductRestrictions extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        price: ProductRestriction,
        purchase: ProductRestriction,
        displayOnly: 'boolean',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {ProductRestriction | null} */ price = this.declared('price');
    /** @type {ProductRestriction | null} */ purchase = this.declared('purchase');
    /** @type {boolean | null} */ displayOnly = this.declared('displayOnly');
}

/** Whether `basePrice` includes tax, and how it is rounded.
 */
export class ProductPriceIncludesTax extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        basePriceRounding: 'string',
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
}

/** `taxSettings` in one block; `enabled` is `overwriteDefaultConfig`. A write takes `customTaxProfile` as an id or
 * `{"id": ...}` of a custom tax profile.
 */
export class ProductTax extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        exempt: 'boolean',
        customTaxProfile: ProductNamedReference,
        message: 'string',
        showPriceWithTax: 'boolean',
        priceIncludesTax: ProductPriceIncludesTax,
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ exempt = this.declared('exempt');
    /** @type {ProductNamedReference | null} */ customTaxProfile = this.declared('customTaxProfile');
    /** @type {string | null} */ message = this.declared('message');
    /** @type {boolean | null} */ showPriceWithTax = this.declared('showPriceWithTax');
    /** @type {ProductPriceIncludesTax | null} */ priceIncludesTax = this.declared('priceIncludesTax');
}

/** The shipping profile; `enabled` is read-only and true while a profile is set. A create drops `profile`; an
 * update takes it as an id or `{"id": ...}`.
 */
export class ProductShipping extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        profile: ProductNamedReference,
    };

    /**
     * @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {ProductNamedReference | null} */ profile = this.declared('profile');
}

/** API paths of the product and its sub-paths, read-only.
 */
export class ProductLinks extends Dto {
    static FIELDS = {
        self: 'string',
        variations: 'string',
        stock: 'string',
        reviews: 'string',
    };

    /** @type {string | null} */ self = this.declared('self');
    /** @type {string | null} */ variations = this.declared('variations');
    /** @type {string | null} */ stock = this.declared('stock');
    /** @type {string | null} */ reviews = this.declared('reviews');
}

/**
 * One product: the row read's body and every write's answer. `field_metadata` sits beside `product` when the read asks
 * for it.
 */
export class Product extends Dto {
    static ENVELOPE_KEY = 'product';

    static FIELDS = {
        id: 'int',
        name: 'string',
        sku: 'string',
        status: 'string',
        urls: ProductUrls,
        heading: 'string',
        parents: dtoList(ProductParent),
        createdBy: ProductNamedReference,
        createdAt: 'string',
        updatedAt: 'string',
        transactionNo: 'string',
        productType: 'string',
        customType: 'string',
        isVirtual: 'boolean',
        invoiceNote: 'string',
        available: 'boolean',
        productPage: ProductNamedReference,
        productLayout: 'any',
        customClass: 'string',
        availableOnDateRange: 'boolean',
        availableFromDate: 'string',
        availableToDate: 'string',
        availableFor: 'string',
        selectedCustomers: ProductSelectedCustomers,
        restrictForSelectedCustomers: ProductSelectedCustomers,
        passwordProtected: 'boolean',
        password: 'string',
        availableOnWeekdays: ProductAvailableOnWeekdays,
        basePrice: 'float',
        costPrice: 'float',
        compareAtPrice: 'float',
        isOnSale: 'boolean',
        salePrice: 'float',
        soldOut: 'boolean',
        length: 'float',
        width: 'float',
        height: 'float',
        weight: 'float',
        soldOutLabel: 'string',
        isFeatured: 'boolean',
        featuredLabel: 'string',
        isNew: 'boolean',
        featured: 'boolean',
        new: 'boolean',
        model: 'string',
        productProperties: ProductProperties,
        version: 'int',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        lastUpdatedBy: ProductNamedReference,
        scheduleType: 'string',
        customScheduleOption: 'string',
        taxSettings: ProductTaxSettings,
        variationPriceDisplay: ProductVariationPriceDisplay,
        administrativeStatus: 'boolean',
        isDraft: 'boolean',
        productSummary: 'string',
        productDescription: 'string',
        productPricingAndStock: ProductPricingAndStock,
        imageAndVideo: ProductImageAndVideo,
        advanced: ProductAdvanced,
        relatedProducts: dtoList(ProductLink),
        similarProducts: dtoList(ProductLink),
        bundle: ProductBundle,
        seoConfigs: dtoList(ProductSeoConfig),
        tags: dtoList(ProductTag),
        customProperties: dtoList(ProductCustomProperty),
        reviews: dtoList(ProductReview),
        productVariation: ProductVariation,
        preorderEnabled: 'boolean',
        hasVariations: 'boolean',
        productUrl: 'string',
        updatedBy: ProductNamedReference,
        virtual: 'boolean',
        summary: 'string',
        description: 'string',
        categories: dtoList(ProductCategory),
        upSellProducts: dtoList(ProductLink),
        media: ProductMedia,
        availableForPurchase: ProductAvailableForPurchase,
        pricing: ProductPricing,
        inventory: ProductInventory,
        ordering: ProductOrdering,
        restrictions: ProductRestrictions,
        tax: ProductTax,
        shipping: ProductShipping,
        links: ProductLinks,
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {ProductUrls | null} */ urls = this.declared('urls');
    /** @type {string | null} */ heading = this.declared('heading');
    /** @type {Array<ProductParent | null> | null} */ parents = this.declared('parents');
    /** @type {ProductNamedReference | null} */ createdBy = this.declared('createdBy');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ productType = this.declared('productType');
    /** @type {string | null} */ customType = this.declared('customType');
    /** @type {boolean | null} */ isVirtual = this.declared('isVirtual');
    /** @type {string | null} */ invoiceNote = this.declared('invoiceNote');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {ProductNamedReference | null} */ productPage = this.declared('productPage');
    /** @type {unknown} */ productLayout = this.declared('productLayout');
    /** @type {string | null} */ customClass = this.declared('customClass');
    /** @type {boolean | null} */ availableOnDateRange = this.declared('availableOnDateRange');
    /** @type {string | null} */ availableFromDate = this.declared('availableFromDate');
    /** @type {string | null} */ availableToDate = this.declared('availableToDate');
    /** @type {string | null} */ availableFor = this.declared('availableFor');
    /** @type {ProductSelectedCustomers | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {ProductSelectedCustomers | null} */ restrictForSelectedCustomers =
        this.declared('restrictForSelectedCustomers');
    /** @type {boolean | null} */ passwordProtected = this.declared('passwordProtected');
    /** @type {string | null} */ password = this.declared('password');
    /** @type {ProductAvailableOnWeekdays | null} */ availableOnWeekdays = this.declared('availableOnWeekdays');
    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ compareAtPrice = this.declared('compareAtPrice');
    /** @type {boolean | null} */ isOnSale = this.declared('isOnSale');
    /** @type {number | null} */ salePrice = this.declared('salePrice');
    /** @type {boolean | null} */ soldOut = this.declared('soldOut');
    /** @type {number | null} */ length = this.declared('length');
    /** @type {number | null} */ width = this.declared('width');
    /** @type {number | null} */ height = this.declared('height');
    /** @type {number | null} */ weight = this.declared('weight');
    /** @type {string | null} */ soldOutLabel = this.declared('soldOutLabel');
    /** @type {boolean | null} */ isFeatured = this.declared('isFeatured');
    /** @type {string | null} */ featuredLabel = this.declared('featuredLabel');
    /** @type {boolean | null} */ isNew = this.declared('isNew');
    /** @type {boolean | null} */ featured = this.declared('featured');
    /** @type {boolean | null} */ new = this.declared('new');
    /** @type {string | null} */ model = this.declared('model');
    /** @type {ProductProperties | null} */ productProperties = this.declared('productProperties');
    /** @type {number | null} */ version = this.declared('version');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {ProductNamedReference | null} */ lastUpdatedBy = this.declared('lastUpdatedBy');
    /** @type {string | null} */ scheduleType = this.declared('scheduleType');
    /** @type {string | null} */ customScheduleOption = this.declared('customScheduleOption');
    /** @type {ProductTaxSettings | null} */ taxSettings = this.declared('taxSettings');
    /** @type {ProductVariationPriceDisplay | null} */ variationPriceDisplay = this.declared('variationPriceDisplay');
    /** @type {boolean | null} */ administrativeStatus = this.declared('administrativeStatus');
    /** @type {boolean | null} */ isDraft = this.declared('isDraft');
    /** @type {string | null} */ productSummary = this.declared('productSummary');
    /** @type {string | null} */ productDescription = this.declared('productDescription');
    /** @type {ProductPricingAndStock | null} */ productPricingAndStock = this.declared('productPricingAndStock');
    /** @type {ProductImageAndVideo | null} */ imageAndVideo = this.declared('imageAndVideo');
    /** @type {ProductAdvanced | null} */ advanced = this.declared('advanced');
    /** @type {Array<ProductLink | null> | null} */ relatedProducts = this.declared('relatedProducts');
    /** @type {Array<ProductLink | null> | null} */ similarProducts = this.declared('similarProducts');
    /** @type {ProductBundle | null} */ bundle = this.declared('bundle');
    /** @type {Array<ProductSeoConfig | null> | null} */ seoConfigs = this.declared('seoConfigs');
    /** @type {Array<ProductTag | null> | null} */ tags = this.declared('tags');
    /** @type {Array<ProductCustomProperty | null> | null} */ customProperties = this.declared('customProperties');
    /** @type {Array<ProductReview | null> | null} */ reviews = this.declared('reviews');
    /** @type {ProductVariation | null} */ productVariation = this.declared('productVariation');
    /** @type {boolean | null} */ preorderEnabled = this.declared('preorderEnabled');
    /** @type {boolean | null} */ hasVariations = this.declared('hasVariations');
    /** @type {string | null} */ productUrl = this.declared('productUrl');
    /** @type {ProductNamedReference | null} */ updatedBy = this.declared('updatedBy');
    /** @type {boolean | null} */ virtual = this.declared('virtual');
    /** @type {string | null} */ summary = this.declared('summary');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {Array<ProductCategory | null> | null} */ categories = this.declared('categories');
    /** @type {Array<ProductLink | null> | null} */ upSellProducts = this.declared('upSellProducts');
    /** @type {ProductMedia | null} */ media = this.declared('media');
    /** @type {ProductAvailableForPurchase | null} */ availableForPurchase = this.declared('availableForPurchase');
    /** @type {ProductPricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductInventory | null} */ inventory = this.declared('inventory');
    /** @type {ProductOrdering | null} */ ordering = this.declared('ordering');
    /** @type {ProductRestrictions | null} */ restrictions = this.declared('restrictions');
    /** @type {ProductTax | null} */ tax = this.declared('tax');
    /** @type {ProductShipping | null} */ shipping = this.declared('shipping');
    /** @type {ProductLinks | null} */ links = this.declared('links');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The five-key `pagination` block; `limit` is the page size applied. */
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

/** One page of the listing: full product records, where they sit and any schema. */
export class ProductPage extends Dto {
    static FIELDS = {
        products: dtoList(Product),
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<Product | null> | null} */ products = this.declared('products');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/**
 * The create's, `PUT`'s and `PATCH`'s bare record; an update merges it at every level, and a `PUT` also needs the ten
 * fields `updateProduct` lists. A changed read-only field is `400 read_only_field`; `productUrl`, `links` and
 * `restrictForSelectedCustomers` are read-only, and `updatedBy` is answered `200` and ignored. `transactionNo` is stored on a create; an update ignores it and the create's number stays.
 */
export class ProductInput extends Dto {
    static FIELDS = {
        name: 'string',
        sku: 'string',
        transactionNo: 'string',
        heading: 'string',
        productType: 'string',
        customType: 'string',
        isVirtual: 'boolean',
        invoiceNote: 'string',
        available: 'boolean',
        availableOnDateRange: 'boolean',
        availableFromDate: 'string',
        availableToDate: 'string',
        availableFor: 'string',
        passwordProtected: 'boolean',
        password: 'string',
        availableOnWeekdays: ProductAvailableOnWeekdays,
        basePrice: 'float',
        costPrice: 'float',
        compareAtPrice: 'float',
        isOnSale: 'boolean',
        salePrice: 'float',
        isFeatured: 'boolean',
        featuredLabel: 'string',
        isNew: 'boolean',
        productProperties: ProductProperties,
        scheduleType: 'string',
        customScheduleOption: 'string',
        taxSettings: ProductTaxSettings,
        variationPriceDisplay: ProductVariationPriceDisplay,
        administrativeStatus: 'boolean',
        productSummary: 'string',
        productDescription: 'string',
        productPricingAndStock: ProductPricingAndStock,
        imageAndVideo: ProductImageAndVideo,
        advanced: ProductAdvanced,
        parents: dtoList('int'),
        relatedProducts: dtoList('any'),
        similarProducts: dtoList('any'),
        tags: dtoList('any'),
        preorderEnabled: 'boolean',
        selectedCustomers: ProductSelectedCustomersInput,
        virtual: 'boolean',
        summary: 'string',
        description: 'string',
        categories: dtoList('int'),
        upSellProducts: dtoList(ProductLink),
        media: ProductMedia,
        availableForPurchase: ProductAvailableForPurchaseInput,
        pricing: ProductPricing,
        inventory: ProductInventory,
        ordering: ProductOrdering,
        restrictions: ProductRestrictions,
        tax: ProductTax,
        shipping: ProductShipping,
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ heading = this.declared('heading');
    /** @type {string | null} */ productType = this.declared('productType');
    /** @type {string | null} */ customType = this.declared('customType');
    /** @type {boolean | null} */ isVirtual = this.declared('isVirtual');
    /** @type {string | null} */ invoiceNote = this.declared('invoiceNote');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {boolean | null} */ availableOnDateRange = this.declared('availableOnDateRange');
    /** @type {string | null} */ availableFromDate = this.declared('availableFromDate');
    /** @type {string | null} */ availableToDate = this.declared('availableToDate');
    /** @type {string | null} */ availableFor = this.declared('availableFor');
    /** @type {boolean | null} */ passwordProtected = this.declared('passwordProtected');
    /** @type {string | null} */ password = this.declared('password');
    /** @type {ProductAvailableOnWeekdays | null} */ availableOnWeekdays = this.declared('availableOnWeekdays');
    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ compareAtPrice = this.declared('compareAtPrice');
    /** @type {boolean | null} */ isOnSale = this.declared('isOnSale');
    /** @type {number | null} */ salePrice = this.declared('salePrice');
    /** @type {boolean | null} */ isFeatured = this.declared('isFeatured');
    /** @type {string | null} */ featuredLabel = this.declared('featuredLabel');
    /** @type {boolean | null} */ isNew = this.declared('isNew');
    /** @type {ProductProperties | null} */ productProperties = this.declared('productProperties');
    /** @type {string | null} */ scheduleType = this.declared('scheduleType');
    /** @type {string | null} */ customScheduleOption = this.declared('customScheduleOption');
    /** @type {ProductTaxSettings | null} */ taxSettings = this.declared('taxSettings');
    /** @type {ProductVariationPriceDisplay | null} */ variationPriceDisplay = this.declared('variationPriceDisplay');
    /** @type {boolean | null} */ administrativeStatus = this.declared('administrativeStatus');
    /** @type {string | null} */ productSummary = this.declared('productSummary');
    /** @type {string | null} */ productDescription = this.declared('productDescription');
    /** @type {ProductPricingAndStock | null} */ productPricingAndStock = this.declared('productPricingAndStock');
    /** @type {ProductImageAndVideo | null} */ imageAndVideo = this.declared('imageAndVideo');
    /** @type {ProductAdvanced | null} */ advanced = this.declared('advanced');
    /** @type {Array<number | null> | null} */ parents = this.declared('parents');
    /** @type {Array<unknown> | null} */ relatedProducts = this.declared('relatedProducts');
    /** @type {Array<unknown> | null} */ similarProducts = this.declared('similarProducts');
    /** @type {Array<unknown> | null} */ tags = this.declared('tags');
    /** @type {boolean | null} */ preorderEnabled = this.declared('preorderEnabled');
    /** @type {ProductSelectedCustomersInput | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {boolean | null} */ virtual = this.declared('virtual');
    /** @type {string | null} */ summary = this.declared('summary');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {Array<number | null> | null} */ categories = this.declared('categories');
    /** @type {Array<ProductLink | null> | null} */ upSellProducts = this.declared('upSellProducts');
    /** @type {ProductMedia | null} */ media = this.declared('media');
    /** @type {ProductAvailableForPurchaseInput | null} */ availableForPurchase = this.declared('availableForPurchase');
    /** @type {ProductPricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductInventory | null} */ inventory = this.declared('inventory');
    /** @type {ProductOrdering | null} */ ordering = this.declared('ordering');
    /** @type {ProductRestrictions | null} */ restrictions = this.declared('restrictions');
    /** @type {ProductTax | null} */ tax = this.declared('tax');
    /** @type {ProductShipping | null} */ shipping = this.declared('shipping');
}

/** The review import's answer: every review the product holds, the ones just added last. */
export class ProductReviews extends Dto {
    static ENVELOPE_KEY = 'product';

    static FIELDS = {
        reviews: dtoList(ProductReview),
    };

    /** @type {Array<ProductReview | null> | null} */ reviews = this.declared('reviews');
}

const REVIEW_DATE_CREATED_KEY = 'dateCreated';

/**
 * One review to add. `name`, `email` and a `rating` of 1 to 5 are required; a second review under an `email` the
 * product already has overwrites that review. `comment` is the same text as `review`. `dateCreated`,
 * `yyyy-MM-ddTHH:mm:ss`, is camel case on the wire, so this type maps that key itself; the read's `date` key is
 * refused on the write.
 */
export class ProductReviewInput extends Dto {
    static FIELDS = {
        name: 'string',
        email: 'string',
        rating: 'float',
        review: 'string',
        comment: 'string',
        status: 'string',
        dateCreated: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {number | null} */ rating = this.declared('rating');
    /** @type {string | null} */ review = this.declared('review');
    /** @type {string | null} */ comment = this.declared('comment');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ dateCreated = this.declared('dateCreated');

    /** @returns {Record<string, string>} */
    static fields() {
        return Object.freeze({...super.fields(), dateCreated: REVIEW_DATE_CREATED_KEY});
    }

    /** @param {unknown} body @returns {any} */
    static fromMap(body) {
        const record = /** @type {any} */ (super.fromMap(body));
        const value = /** @type {Record<string, unknown>} */ (body)[REVIEW_DATE_CREATED_KEY];
        record.dateCreated = typeof value === 'string' ? value : null;
        return record;
    }

    /** @returns {Record<string, unknown>} */
    toMap() {
        const {date_created: dateCreated, ...record} = super.toMap();
        return dateCreated === undefined ? record : {...record, [REVIEW_DATE_CREATED_KEY]: dateCreated};
    }
}

/**
 * The review import's body: `{"product": {"reviews": [...]}}` with `transaction_no` beside the envelope; `reviews`
 * must not be empty.
 */
export class ProductReviewsImportInput extends Dto {
    static ENVELOPE_KEY = 'product';
    static TOP_LEVEL = ['transactionNo'];

    static FIELDS = {
        reviews: dtoList(ProductReviewInput),
        transactionNo: 'string',
    };

    /** @type {Array<ProductReviewInput | null> | null} */ reviews = this.declared('reviews');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

/** One variant's stock on a product with variations. */
export class ProductStockVariation extends Dto {
    static FIELDS = {
        variationId: 'int',
        productId: 'int',
        name: 'string',
        sku: 'string',
        availableStock: 'int',
        locations: dtoList(ProductStockLocation),
    };

    /** @type {number | null} */ variationId = this.declared('variationId');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {Array<ProductStockLocation | null> | null} */ locations = this.declared('locations');
}

/** The stock sub-path's body, read and written. */
export class ProductStock extends Dto {
    static FIELDS = {
        status: 'string',
        productId: 'int',
        multiLocationEnabled: 'boolean',
        trackInventory: 'boolean',
        availableStock: 'int',
        locations: dtoList(ProductStockLocation),
        variations: dtoList(ProductStockVariation),
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {number | null} */ productId = this.declared('productId');
    /** @type {boolean | null} */ multiLocationEnabled = this.declared('multiLocationEnabled');
    /** @type {boolean | null} */ trackInventory = this.declared('trackInventory');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {Array<ProductStockLocation | null> | null} */ locations = this.declared('locations');
    /** @type {Array<ProductStockVariation | null> | null} */ variations = this.declared('variations');
}

/**
 * One row of the stock write. An omitted `low_stock_level` is stored `null`; with no row marked `is_default`, the first
 * row sent becomes the default.
 */
export class ProductStockLocationInput extends Dto {
    static FIELDS = {
        warehouse: 'int',
        stock: 'int',
        lowStockLevel: 'int',
        isDefault: 'boolean',
    };

    /** @type {number | null} */ warehouse = this.declared('warehouse');
    /** @type {number | null} */ stock = this.declared('stock');
    /** @type {number | null} */ lowStockLevel = this.declared('lowStockLevel');
    /** @type {boolean | null} */ isDefault = this.declared('isDefault');
}

/**
 * The stock write's body: `locations` is required and replaces the product's whole set, so a location left out is
 * unassigned whatever it holds.
 */
export class ProductStockInput extends Dto {
    static FIELDS = {
        note: 'string',
        locations: dtoList(ProductStockLocationInput),
    };

    /** @type {string | null} */ note = this.declared('note');
    /** @type {Array<ProductStockLocationInput | null> | null} */ locations = this.declared('locations');
}

sealDtoSchema(
    ProductUrls,
    ProductNamedReference,
    ProductParent,
    ProductSelectedCustomer,
    ProductSelectedCustomers,
    ProductSelectedCustomersInput,
    ProductWeekday,
    ProductAvailableOnWeekdays,
    ProductProperties,
    ProductTaxSettings,
    ProductVariationPriceDisplay,
    ProductWarehouseStock,
    ProductStockLocation,
    ProductPricingAndStock,
    ProductImage,
    ProductVideo,
    ProductImageAndVideo,
    ProductAdvanceInformation,
    ProductFlag,
    ProductFlags,
    ProductDimension,
    ProductIdentifiers,
    ProductWebtool,
    ProductAdvanced,
    ProductLink,
    ProductBundle,
    ProductSeoConfig,
    ProductTagValue,
    ProductTag,
    ProductCustomProperty,
    ProductReviewer,
    ProductReview,
    ProductVariationTypeOption,
    ProductVariationType,
    ProductCombinationOptionType,
    ProductCombinationOption,
    ProductCombinationImage,
    ProductCombinationPriceAndStock,
    ProductCombinationDetails,
    ProductCombination,
    ProductVariation,
    ProductCategory,
    ProductMediaImage,
    ProductMediaVideo,
    ProductMedia,
    ProductWeekdayWindow,
    ProductScheduleWeekdays,
    ProductSchedule,
    ProductPasswordProtection,
    ProductAvailableForPurchase,
    ProductAvailableForPurchaseInput,
    ProductOnSale,
    ProductQuantityMultiple,
    ProductExpectToPay,
    ProductAdvancedPricing,
    ProductPricing,
    ProductInventoryTracking,
    ProductCombinedStockLimit,
    ProductInventory,
    ProductOrdering,
    ProductRestriction,
    ProductRestrictions,
    ProductPriceIncludesTax,
    ProductTax,
    ProductShipping,
    ProductLinks,
    Product,
    Pagination,
    ProductPage,
    ProductInput,
    ProductReviews,
    ProductReviewInput,
    ProductReviewsImportInput,
    ProductStockVariation,
    ProductStock,
    ProductStockLocationInput,
    ProductStockInput,
);
