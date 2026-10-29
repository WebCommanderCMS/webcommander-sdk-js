import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** Another record a category points at, read as `{id, name}`; a write needs only `id`. */
export class CategoryReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `general` section as read. */
export class CategoryGeneral extends Dto {
    static FIELDS = {
        name: 'string',
        title: 'string',
        sku: 'string',
        url: 'string',
        heading: 'string',
        parentCategory: CategoryReference,
        filterProfile: 'any',
        layout: CategoryReference,
        summary: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ heading = this.declared('heading');
    /** @type {CategoryReference | null} */ parentCategory = this.declared('parentCategory');
    /** @type {unknown} */ filterProfile = this.declared('filterProfile');
    /** @type {CategoryReference | null} */ layout = this.declared('layout');
    /** @type {string | null} */ summary = this.declared('summary');
}

/** The `description` section, the same one field read and written. */
export class CategoryDescription extends Dto {
    static FIELDS = {
        content: 'string',
    };

    /** @type {string | null} */ content = this.declared('content');
}

/** The `images_media` section as read: the two stored images' URLs and the image's alt text, each `""` when unset. */
export class CategoryImagesMedia extends Dto {
    static FIELDS = {
        imageUrl: 'string',
        imageAlt: 'string',
        backgroundImageUrl: 'string',
    };

    /** @type {string | null} */ imageUrl = this.declared('imageUrl');
    /** @type {string | null} */ imageAlt = this.declared('imageAlt');
    /** @type {string | null} */ backgroundImageUrl = this.declared('backgroundImageUrl');
}

/** Who `available_for: "selected"` admits, each customer and group read as `{id, name}`. */
export class CategorySelectedCustomers extends Dto {
    static FIELDS = {
        customers: dtoList(CategoryReference),
        groups: dtoList(CategoryReference),
    };

    /** @type {Array<CategoryReference | null> | null} */ customers = this.declared('customers');
    /** @type {Array<CategoryReference | null> | null} */ groups = this.declared('groups');
}

/** The `availability_visibility` section as read; `password` is never echoed. */
export class CategoryAvailabilityVisibility extends Dto {
    static FIELDS = {
        available: 'boolean',
        visible: 'boolean',
        availableFor: 'string',
        selectedCustomers: CategorySelectedCustomers,
        availableOnDateRange: 'boolean',
        availableFromDate: 'string',
        availableToDate: 'string',
        passwordProtected: 'boolean',
        customSorting: 'boolean',
        defaultSorting: 'string',
        disableTracking: 'boolean',
    };

    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {boolean | null} */ visible = this.declared('visible');
    /** @type {string | null} */ availableFor = this.declared('availableFor');
    /** @type {CategorySelectedCustomers | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {boolean | null} */ availableOnDateRange = this.declared('availableOnDateRange');
    /** @type {string | null} */ availableFromDate = this.declared('availableFromDate');
    /** @type {string | null} */ availableToDate = this.declared('availableToDate');
    /** @type {boolean | null} */ passwordProtected = this.declared('passwordProtected');
    /** @type {boolean | null} */ customSorting = this.declared('customSorting');
    /** @type {string | null} */ defaultSorting = this.declared('defaultSorting');
    /** @type {boolean | null} */ disableTracking = this.declared('disableTracking');
}

/** The `tax_shipping` section, the same eight fields read and written. */
export class CategoryTaxShipping extends Dto {
    static FIELDS = {
        taxExempt: 'boolean',
        taxProfile: CategoryReference,
        taxMessage: 'string',
        showPriceWithTax: 'boolean',
        pricesEnteredWithTax: 'boolean',
        basePriceRounding: 'string',
        enableShipping: 'boolean',
        shippingProfile: CategoryReference,
    };

    /** @type {boolean | null} */ taxExempt = this.declared('taxExempt');
    /** @type {CategoryReference | null} */ taxProfile = this.declared('taxProfile');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
    /** @type {boolean | null} */ showPriceWithTax = this.declared('showPriceWithTax');
    /** @type {boolean | null} */ pricesEnteredWithTax = this.declared('pricesEnteredWithTax');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
    /** @type {boolean | null} */ enableShipping = this.declared('enableShipping');
    /** @type {CategoryReference | null} */ shippingProfile = this.declared('shippingProfile');
}

/** One assigned product, as `assign_products` reads it. */
export class CategoryProduct extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        sku: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
}

/** The `assign_products` section as read. */
export class CategoryAssignProducts extends Dto {
    static FIELDS = {
        products: dtoList(CategoryProduct),
    };

    /** @type {Array<CategoryProduct | null> | null} */ products = this.declared('products');
}

/** One `group_meta` entry; `href` is the section's path, the row's id a placeholder. */
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

/** The `group_meta` block the listing, a row read and every whole-row write send. */
export class GroupMeta extends Dto {
    static FIELDS = {
        general: SectionMeta,
        description: SectionMeta,
        imagesMedia: SectionMeta,
        availabilityVisibility: SectionMeta,
        taxShipping: SectionMeta,
        assignProducts: SectionMeta,
    };

    /** @type {SectionMeta | null} */ general = this.declared('general');
    /** @type {SectionMeta | null} */ description = this.declared('description');
    /** @type {SectionMeta | null} */ imagesMedia = this.declared('imagesMedia');
    /** @type {SectionMeta | null} */ availabilityVisibility = this.declared('availabilityVisibility');
    /** @type {SectionMeta | null} */ taxShipping = this.declared('taxShipping');
    /** @type {SectionMeta | null} */ assignProducts = this.declared('assignProducts');
}

/**
 * One category: a listing row, a row read, a whole-row write's answer, or a section's answer, which carries that one
 * section alone under `category`.
 */
export class Category extends Dto {
    static ENVELOPE_KEY = 'category';

    static FIELDS = {
        general: CategoryGeneral,
        description: CategoryDescription,
        imagesMedia: CategoryImagesMedia,
        availabilityVisibility: CategoryAvailabilityVisibility,
        taxShipping: CategoryTaxShipping,
        assignProducts: CategoryAssignProducts,
        id: 'int',
        transactionNo: 'string',
        disposable: 'boolean',
        inTrash: 'boolean',
        parentInTrash: 'boolean',
        createdBy: 'string',
        createdOn: 'string',
        lastUpdatedBy: 'string',
        lastUpdatedOn: 'string',
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {CategoryGeneral | null} */ general = this.declared('general');
    /** @type {CategoryDescription | null} */ description = this.declared('description');
    /** @type {CategoryImagesMedia | null} */ imagesMedia = this.declared('imagesMedia');
    /** @type {CategoryAvailabilityVisibility | null} */ availabilityVisibility =
        this.declared('availabilityVisibility');
    /** @type {CategoryTaxShipping | null} */ taxShipping = this.declared('taxShipping');
    /** @type {CategoryAssignProducts | null} */ assignProducts = this.declared('assignProducts');
    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
    /** @type {boolean | null} */ disposable = this.declared('disposable');
    /** @type {boolean | null} */ inTrash = this.declared('inTrash');
    /** @type {boolean | null} */ parentInTrash = this.declared('parentInTrash');
    /** @type {string | null} */ createdBy = this.declared('createdBy');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedBy = this.declared('lastUpdatedBy');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The listing's ten-key `pagination` block; `limit` is the size the store applied. */
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

/** One page of the listing, with the `field_metadata` block when it was asked for. */
export class CategoryPage extends Dto {
    static FIELDS = {
        categories: dtoList(Category),
        groupMeta: GroupMeta,
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<Category | null> | null} */ categories = this.declared('categories');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's `{"categories": {"count": N}}`. */
export class CategoryCount extends Dto {
    static ENVELOPE_KEY = 'categories';

    static FIELDS = {
        count: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
}

/**
 * The writable `general` fields. `name` is required on a create and is kept by a `PUT` that omits it; a reference
 * takes `new CategoryReference({id})`.
 */
export class CategoryGeneralInput extends Dto {
    static FIELDS = {
        name: 'string',
        title: 'string',
        sku: 'string',
        url: 'string',
        heading: 'string',
        parentCategory: CategoryReference,
        layout: CategoryReference,
        summary: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ sku = this.declared('sku');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ heading = this.declared('heading');
    /** @type {CategoryReference | null} */ parentCategory = this.declared('parentCategory');
    /** @type {CategoryReference | null} */ layout = this.declared('layout');
    /** @type {string | null} */ summary = this.declared('summary');
}

/** One image upload: a file name and its bytes as base64. */
export class CategoryImage extends Dto {
    static FIELDS = {
        filename: 'string',
        base64: 'string',
    };

    /** @type {string | null} */ filename = this.declared('filename');
    /** @type {string | null} */ base64 = this.declared('base64');
}

/** The writable `images_media` fields; each image reads back as its `*_url`, and neither `null` nor `""` removes one. */
export class CategoryImagesMediaInput extends Dto {
    static FIELDS = {
        image: CategoryImage,
        imageAlt: 'string',
        backgroundImage: CategoryImage,
    };

    /** @type {CategoryImage | null} */ image = this.declared('image');
    /** @type {string | null} */ imageAlt = this.declared('imageAlt');
    /** @type {CategoryImage | null} */ backgroundImage = this.declared('backgroundImage');
}

/** The ids `available_for: "selected"` admits; an id no customer or group holds is dropped without a refusal. */
export class CategorySelectedCustomersInput extends Dto {
    static FIELDS = {
        customers: dtoList('int'),
        groups: dtoList('int'),
    };

    /** @type {Array<number | null> | null} */ customers = this.declared('customers');
    /** @type {Array<number | null> | null} */ groups = this.declared('groups');
}

/**
 * The writable `availability_visibility` fields: the read fields, plus the write-only `password`, with
 * `selectedCustomers` taking ids.
 */
export class CategoryAvailabilityVisibilityInput extends Dto {
    static FIELDS = {
        available: 'boolean',
        visible: 'boolean',
        availableFor: 'string',
        selectedCustomers: CategorySelectedCustomersInput,
        availableOnDateRange: 'boolean',
        availableFromDate: 'string',
        availableToDate: 'string',
        passwordProtected: 'boolean',
        password: 'string',
        customSorting: 'boolean',
        defaultSorting: 'string',
        disableTracking: 'boolean',
    };

    /** @type {boolean | null} */ available = this.declared('available');
    /** @type {boolean | null} */ visible = this.declared('visible');
    /** @type {string | null} */ availableFor = this.declared('availableFor');
    /** @type {CategorySelectedCustomersInput | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {boolean | null} */ availableOnDateRange = this.declared('availableOnDateRange');
    /** @type {string | null} */ availableFromDate = this.declared('availableFromDate');
    /** @type {string | null} */ availableToDate = this.declared('availableToDate');
    /** @type {boolean | null} */ passwordProtected = this.declared('passwordProtected');
    /** @type {string | null} */ password = this.declared('password');
    /** @type {boolean | null} */ customSorting = this.declared('customSorting');
    /** @type {string | null} */ defaultSorting = this.declared('defaultSorting');
    /** @type {boolean | null} */ disableTracking = this.declared('disableTracking');
}

/** The product ids to assign; a write replaces the whole assignment. */
export class CategoryAssignProductsInput extends Dto {
    static FIELDS = {
        products: dtoList('int'),
    };

    /** @type {Array<number | null> | null} */ products = this.declared('products');
}

/** The body every write takes, `{"category": {<section>: {...}}}`. */
export class CategoryInput extends Dto {
    static ENVELOPE_KEY = 'category';

    static FIELDS = {
        general: CategoryGeneralInput,
        description: CategoryDescription,
        imagesMedia: CategoryImagesMediaInput,
        availabilityVisibility: CategoryAvailabilityVisibilityInput,
        taxShipping: CategoryTaxShipping,
        assignProducts: CategoryAssignProductsInput,
        transactionNo: 'string',
    };

    /** @type {CategoryGeneralInput | null} */ general = this.declared('general');
    /** @type {CategoryDescription | null} */ description = this.declared('description');
    /** @type {CategoryImagesMediaInput | null} */ imagesMedia = this.declared('imagesMedia');
    /** @type {CategoryAvailabilityVisibilityInput | null} */ availabilityVisibility =
        this.declared('availabilityVisibility');
    /** @type {CategoryTaxShipping | null} */ taxShipping = this.declared('taxShipping');
    /** @type {CategoryAssignProductsInput | null} */ assignProducts = this.declared('assignProducts');
    // Read inside the `category` wrapper only; beside it, it is ignored and nothing is filed.
    /** @type {string | null} */ transactionNo = this.declared('transactionNo');
}

sealDtoSchema(
    CategoryReference,
    CategoryGeneral,
    CategoryDescription,
    CategoryImagesMedia,
    CategorySelectedCustomers,
    CategoryAvailabilityVisibility,
    CategoryTaxShipping,
    CategoryProduct,
    CategoryAssignProducts,
    SectionMeta,
    GroupMeta,
    Category,
    Pagination,
    CategoryPage,
    CategoryCount,
    CategoryGeneralInput,
    CategoryImage,
    CategoryImagesMediaInput,
    CategorySelectedCustomersInput,
    CategoryAvailabilityVisibilityInput,
    CategoryAssignProductsInput,
    CategoryInput,
);
