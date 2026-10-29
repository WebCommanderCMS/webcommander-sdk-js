import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/**
 * One inventory location, as every path sends it; `ENVELOPE_KEY` is unwrapped on reads only, as no write takes
 * that wrapper.
 */
export class InventoryLocation extends Dto {
    static ENVELOPE_KEY = 'inventory_location';

    static FIELDS = {
        id: 'int',
        name: 'string',
        address: 'string',
        active: 'boolean',
        default: 'boolean',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ address = this.declared('address');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The writable form of {@link InventoryLocation} for the create, the update and the patch, sent bare. */
export class InventoryLocationInput extends Dto {
    static FIELDS = {
        name: 'string',
        address: 'string',
        active: 'boolean',
        default: 'boolean',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ address = this.declared('address');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ default = this.declared('default');
}

/** The status sub-path's body: `active` alone, required. */
export class InventoryLocationStatusInput extends Dto {
    static FIELDS = {
        active: 'boolean',
    };

    /** @type {boolean | null} */ active = this.declared('active');
}

/** The five-key `pagination` block of the listing and the stock sub-path; `limit` is the page size applied. */
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

/** One page of the listing, with the rows under `inventory_locations` rather than `items`. */
export class InventoryLocationPage extends Dto {
    static FIELDS = {
        inventoryLocations: dtoList(InventoryLocation),
        pagination: Pagination,
    };

    /** @type {Array<InventoryLocation | null> | null} */ inventoryLocations = this.declared('inventoryLocations');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The product one stock item belongs to. */
export class InventoryLocationStockProduct extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        sku: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ sku = this.declared('sku');
}

/** One row of the stock sub-path's `items`. */
export class InventoryLocationStockItem extends Dto {
    static FIELDS = {
        product: InventoryLocationStockProduct,
        variation: 'any',
        availableStock: 'int',
        lowStockLevel: 'int',
        defaultForProduct: 'boolean',
    };

    /** @type {InventoryLocationStockProduct | null} */ product = this.declared('product');
    /** @type {unknown} */ variation = this.declared('variation');
    /** @type {number | null} */ availableStock = this.declared('availableStock');
    /** @type {number | null} */ lowStockLevel = this.declared('lowStockLevel');
    /** @type {boolean | null} */ defaultForProduct = this.declared('defaultForProduct');
}

/** The stock sub-path's body: the location, its items and their own pagination. */
export class InventoryLocationStock extends Dto {
    static FIELDS = {
        inventoryLocation: InventoryLocation,
        items: dtoList(InventoryLocationStockItem),
        pagination: Pagination,
    };

    /** @type {InventoryLocation | null} */ inventoryLocation = this.declared('inventoryLocation');
    /** @type {Array<InventoryLocationStockItem | null> | null} */ items = this.declared('items');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    InventoryLocation,
    InventoryLocationInput,
    InventoryLocationStatusInput,
    Pagination,
    InventoryLocationPage,
    InventoryLocationStockProduct,
    InventoryLocationStockItem,
    InventoryLocationStock,
);
