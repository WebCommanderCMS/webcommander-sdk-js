import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** An image option's stored picture; `null` on text and color options. */
export class VariationOptionImage extends Dto {
    static FIELDS = {
        url: 'string',
        fileName: 'string',
    };

    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ fileName = this.declared('fileName');
}

/** One option of a type. `value` is `null` on an image option. */
export class VariationOption extends Dto {
    static FIELDS = {
        id: 'int',
        label: 'string',
        value: 'string',
        order: 'int',
        default: 'boolean',
        image: VariationOptionImage,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {number | null} */ order = this.declared('order');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {VariationOptionImage | null} */ image = this.declared('image');
}

/** One variation type: a listing row, a row read and every type write's answer. */
export class Variation extends Dto {
    static ENVELOPE_KEY = 'variation';

    static FIELDS = {
        id: 'int',
        name: 'string',
        standard: 'string',
        disposable: 'boolean',
        options: dtoList(VariationOption),
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ standard = this.declared('standard');
    /** @type {boolean | null} */ disposable = this.declared('disposable');
    /** @type {Array<VariationOption | null> | null} */ options = this.declared('options');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The listing's five-key `pagination` block. */
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

/** One page of the listing, with the rows under `variations`, and the schema when `field_metadata` is asked for. */
export class VariationPage extends Dto {
    static FIELDS = {
        variations: dtoList(Variation),
        fieldMetadata: 'any',
        pagination: Pagination,
    };

    /** @type {Array<Variation | null> | null} */ variations = this.declared('variations');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** An image option's upload; written as `filename`, read back as `file_name`. */
export class VariationOptionImageInput extends Dto {
    static FIELDS = {
        base64: 'string',
        filename: 'string',
    };

    /** @type {string | null} */ base64 = this.declared('base64');
    /** @type {string | null} */ filename = this.declared('filename');
}

/** One option in a type write; an `id` names an option of this type to change. */
export class VariationOptionInput extends Dto {
    static FIELDS = {
        id: 'int',
        label: 'string',
        value: 'string',
        order: 'int',
        default: 'boolean',
        image: VariationOptionImageInput,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {number | null} */ order = this.declared('order');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {VariationOptionImageInput | null} */ image = this.declared('image');
}

/** The type writes' body, `{"variation": {...}}`; `standard` cannot change after the create. */
export class VariationInput extends Dto {
    static ENVELOPE_KEY = 'variation';

    static FIELDS = {
        name: 'string',
        standard: 'string',
        options: dtoList(VariationOptionInput),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ standard = this.declared('standard');
    /** @type {Array<VariationOptionInput | null> | null} */ options = this.declared('options');
}

/** A variant's expected-price display. */
export class ProductVariantExpectToPay extends Dto {
    static FIELDS = {
        isEnabled: 'boolean',
        price: 'float',
    };

    /** @type {boolean | null} */ isEnabled = this.declared('isEnabled');
    /** @type {number | null} */ price = this.declared('price');
}

/** A variant's prices; the bulk write answers the first four fields. */
export class ProductVariantPricing extends Dto {
    static FIELDS = {
        basePrice: 'float',
        costPrice: 'float',
        salePrice: 'float',
        isOnSale: 'boolean',
        saleAmountType: 'string',
        hidePrice: 'boolean',
        isCallForPrice: 'boolean',
        expectToPay: ProductVariantExpectToPay,
        tieredPricing: 'any',
    };

    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ salePrice = this.declared('salePrice');
    /** @type {boolean | null} */ isOnSale = this.declared('isOnSale');
    /** @type {string | null} */ saleAmountType = this.declared('saleAmountType');
    /** @type {boolean | null} */ hidePrice = this.declared('hidePrice');
    /** @type {boolean | null} */ isCallForPrice = this.declared('isCallForPrice');
    /** @type {ProductVariantExpectToPay | null} */ expectToPay = this.declared('expectToPay');
    /** @type {unknown} */ tieredPricing = this.declared('tieredPricing');
}

/** A variant's stock; the bulk write answers the first three fields. */
export class ProductVariantInventory extends Dto {
    static FIELDS = {
        isEnabled: 'boolean',
        quantity: 'int',
        lowStockThreshold: 'int',
        isSoldOut: 'boolean',
        soldOutLabel: 'string',
    };

    /** @type {boolean | null} */ isEnabled = this.declared('isEnabled');
    /** @type {number | null} */ quantity = this.declared('quantity');
    /** @type {number | null} */ lowStockThreshold = this.declared('lowStockThreshold');
    /** @type {boolean | null} */ isSoldOut = this.declared('isSoldOut');
    /** @type {string | null} */ soldOutLabel = this.declared('soldOutLabel');
}

/** A variant's order quantities; `max_quantity` 0 is no maximum. */
export class ProductVariantOrdering extends Dto {
    static FIELDS = {
        minQuantity: 'int',
        maxQuantity: 'int',
        multipleOf: 'int',
        isMultipleQuantityRequired: 'boolean',
    };

    /** @type {number | null} */ minQuantity = this.declared('minQuantity');
    /** @type {number | null} */ maxQuantity = this.declared('maxQuantity');
    /** @type {number | null} */ multipleOf = this.declared('multipleOf');
    /** @type {boolean | null} */ isMultipleQuantityRequired = this.declared('isMultipleQuantityRequired');
}

/** A variant's size and weight. */
export class ProductVariantDimensions extends Dto {
    static FIELDS = {
        length: 'float',
        width: 'float',
        height: 'float',
        weight: 'float',
    };

    /** @type {number | null} */ length = this.declared('length');
    /** @type {number | null} */ width = this.declared('width');
    /** @type {number | null} */ height = this.declared('height');
    /** @type {number | null} */ weight = this.declared('weight');
}

/** A variant's two badges. */
export class ProductVariantBadges extends Dto {
    static FIELDS = {
        isFeatured: 'boolean',
        isNewArrival: 'boolean',
    };

    /** @type {boolean | null} */ isFeatured = this.declared('isFeatured');
    /** @type {boolean | null} */ isNewArrival = this.declared('isNewArrival');
}

/** One variant of a product; `key` joins its option labels with `/`. */
export class ProductVariant extends Dto {
    static FIELDS = {
        variationId: 'int',
        available: 'boolean',
        isBase: 'boolean',
        key: 'string',
        name: 'string',
        sku: 'string',
        customSku: 'string',
        title: 'string',
        summary: 'string',
        description: 'string',
        barcode: 'string',
        countryOfOrigin: 'string',
        hsCode: 'string',
        pricing: ProductVariantPricing,
        inventory: ProductVariantInventory,
        ordering: ProductVariantOrdering,
        dimensions: ProductVariantDimensions,
        badges: ProductVariantBadges,
        images: dtoList('any'),
    };

    /** @type {number | null} */ variationId = this.declared('variationId');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {boolean | null} */ isBase = this.declared('isBase');
    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ customSku = this.declared('customSku');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ summary = this.declared('summary');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {ProductVariantPricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductVariantInventory | null} */ inventory = this.declared('inventory');
    /** @type {ProductVariantOrdering | null} */ ordering = this.declared('ordering');
    /** @type {ProductVariantDimensions | null} */ dimensions = this.declared('dimensions');
    /** @type {ProductVariantBadges | null} */ badges = this.declared('badges');
    /** @type {Array<unknown> | null} */ images = this.declared('images');
}

/** A product's variants, under `product_key`: its type names joined with `/`. */
export class ProductVariationGroup extends Dto {
    static FIELDS = {
        productKey: 'string',
        variants: dtoList(ProductVariant),
    };

    /** @type {string | null} */ productKey = this.declared('productKey');
    /** @type {Array<ProductVariant | null> | null} */ variants = this.declared('variants');
}

/** The product read's body; `variations` is empty for a product without variants. */
export class ProductVariations extends Dto {
    static FIELDS = {
        variations: dtoList(ProductVariationGroup),
    };

    /** @type {Array<ProductVariationGroup | null> | null} */ variations = this.declared('variations');
}

/** One option a variant carries, in the bulk write's full answer. */
export class ProductVariantOptionReference extends Dto {
    static FIELDS = {
        id: 'int',
        type: 'string',
        label: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ label = this.declared('label');
}

/** One written variant: `id` and `name`, and the rest with `response=full`. */
export class ProductVariantUpdate extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        sku: 'string',
        customSku: 'string',
        barcode: 'string',
        countryOfOrigin: 'string',
        hsCode: 'string',
        available: 'boolean',
        options: dtoList(ProductVariantOptionReference),
        pricing: ProductVariantPricing,
        inventory: ProductVariantInventory,
        ordering: ProductVariantOrdering,
        transactionNo: 'string',
        url: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ customSku = this.declared('customSku');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {Array<ProductVariantOptionReference | null> | null} */ options = this.declared('options');
    /** @type {ProductVariantPricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductVariantInventory | null} */ inventory = this.declared('inventory');
    /** @type {ProductVariantOrdering | null} */ ordering = this.declared('ordering');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {string | null} */ url = this.declared('url');
}

/** The bulk write's answer; `failed` stays empty, as a refused id refuses the whole write. */
export class ProductVariationsBulkResult extends Dto {
    static FIELDS = {
        status: 'string',
        message: 'string',
        updated: dtoList(ProductVariantUpdate),
        failed: dtoList('any'),
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ message = this.declared('message');
    /** @type {Array<ProductVariantUpdate | null> | null} */ updated = this.declared('updated');
    /** @type {Array<unknown> | null} */ failed = this.declared('failed');
}

/** The bulk write's body, sent bare: the variant ids and at least one of the six fields. */
export class ProductVariationsBulkInput extends Dto {
    static FIELDS = {
        variationIds: dtoList('int'),
        available: 'boolean',
        basePrice: 'float',
        costPrice: 'float',
        availableStock: 'int',
        minOrderQuantity: 'int',
        maxOrderQuantity: 'int',
    };

    /** @type {Array<number | null> | null} */ variationIds = this.declared('variationIds');
    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {number | null} */ basePrice = this.declared('basePrice');
    /** @type {number | null} */ costPrice = this.declared('costPrice');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ minOrderQuantity = this.declared('minOrderQuantity');
    /** @type {number | null} */ maxOrderQuantity = this.declared('maxOrderQuantity');
}

/**
 * One variant to import; `key` joins one option label per type with `/` and is required. A key the product has is that
 * variant, changed; an unknown field is `400 unknown_field`.
 */
export class ProductVariantInput extends Dto {
    static FIELDS = {
        key: 'string',
        name: 'string',
        sku: 'string',
        customSku: 'string',
        title: 'string',
        summary: 'string',
        description: 'string',
        barcode: 'string',
        countryOfOrigin: 'string',
        hsCode: 'string',
        pricing: ProductVariantPricing,
        inventory: ProductVariantInventory,
        ordering: ProductVariantOrdering,
        dimensions: ProductVariantDimensions,
        badges: ProductVariantBadges,
        images: dtoList('any'),
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ customSku = this.declared('customSku');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ summary = this.declared('summary');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {string | null} */ barcode = this.declared('barcode');
    /** @type {string | null} */ countryOfOrigin = this.declared('countryOfOrigin');
    /** @type {string | null} */ hsCode = this.declared('hsCode');
    /** @type {ProductVariantPricing | null} */ pricing = this.declared('pricing');
    /** @type {ProductVariantInventory | null} */ inventory = this.declared('inventory');
    /** @type {ProductVariantOrdering | null} */ ordering = this.declared('ordering');
    /** @type {ProductVariantDimensions | null} */ dimensions = this.declared('dimensions');
    /** @type {ProductVariantBadges | null} */ badges = this.declared('badges');
    /** @type {Array<unknown> | null} */ images = this.declared('images');
}

/**
 * One group to import: `product_key` names the types, joined with `/`, and `variants` must not be empty. A type name
 * the store has is reused, an option label it lacks is added.
 */
export class ProductVariationGroupInput extends Dto {
    static FIELDS = {
        productKey: 'string',
        variants: dtoList(ProductVariantInput),
    };

    /** @type {string | null} */ productKey = this.declared('productKey');
    /** @type {Array<ProductVariantInput | null> | null} */ variants = this.declared('variants');
}

/** The import's body, no envelope; `variations` must not be empty. */
export class ProductVariationsImportInput extends Dto {
    static FIELDS = {
        transactionNo: 'string',
        variations: dtoList(ProductVariationGroupInput),
    };

    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {Array<ProductVariationGroupInput | null> | null} */ variations = this.declared('variations');
}

/** The import's answer: `status`, a `message` counting the variants and `total_variants`. */
export class ProductVariationsImportResult extends Dto {
    static FIELDS = {
        status: 'string',
        message: 'string',
        totalVariants: 'int',
    };

    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ message = this.declared('message');
    /** @type {number | null} */ totalVariants = this.declared('totalVariants');
}

sealDtoSchema(
    VariationOptionImage,
    VariationOption,
    Variation,
    Pagination,
    VariationPage,
    VariationOptionImageInput,
    VariationOptionInput,
    VariationInput,
    ProductVariantExpectToPay,
    ProductVariantPricing,
    ProductVariantInventory,
    ProductVariantOrdering,
    ProductVariantDimensions,
    ProductVariantBadges,
    ProductVariant,
    ProductVariationGroup,
    ProductVariations,
    ProductVariantOptionReference,
    ProductVariantUpdate,
    ProductVariationsBulkResult,
    ProductVariationsBulkInput,
    ProductVariantInput,
    ProductVariationGroupInput,
    ProductVariationsImportInput,
    ProductVariationsImportResult,
);
