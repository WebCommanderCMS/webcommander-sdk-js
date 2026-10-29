import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One order custom field. */
export class OrderCustomField extends Dto {
    static ENVELOPE_KEY = 'order_custom_field';

    static FIELDS = {
        id: 'int',
        fieldType: 'string',
        label: 'string',
        name: 'string',
        isActive: 'boolean',
        orderNo: 'int',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        isRequired: 'boolean',
        inputFormat: 'string',
        hasMaxLength: 'boolean',
        maxLength: 'int',
        hoverText: 'string',
        placeholder: 'string',
        defaultValue: 'string',
        htmlClass: 'string',
        options: dtoList('string'),
        isAllowedForShipping: 'boolean',
        isAllowedForDelivery: 'boolean',
        isAllowedForStorePickup: 'boolean',
        isAllowedForPreOrder: 'boolean',
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ fieldType = this.declared('fieldType');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isActive = this.declared('isActive');
    /** @type {number | null} */ orderNo = this.declared('orderNo');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {boolean | null} */ isRequired = this.declared('isRequired');
    /** @type {string | null} */ inputFormat = this.declared('inputFormat');
    /** @type {boolean | null} */ hasMaxLength = this.declared('hasMaxLength');
    /** @type {number | null} */ maxLength = this.declared('maxLength');
    /** @type {string | null} */ hoverText = this.declared('hoverText');
    /** @type {string | null} */ placeholder = this.declared('placeholder');
    /** @type {string | null} */ defaultValue = this.declared('defaultValue');
    /** @type {string | null} */ htmlClass = this.declared('htmlClass');
    /** @type {Array<string | null> | null} */ options = this.declared('options');
    /** @type {boolean | null} */ isAllowedForShipping = this.declared('isAllowedForShipping');
    /** @type {boolean | null} */ isAllowedForDelivery = this.declared('isAllowedForDelivery');
    /** @type {boolean | null} */ isAllowedForStorePickup = this.declared('isAllowedForStorePickup');
    /** @type {boolean | null} */ isAllowedForPreOrder = this.declared('isAllowedForPreOrder');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The ten-key `pagination` block; `limit` is the size the store applied, capped at 20. */
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

/** The listing's one `group_meta` entry: `kind` `resource`, `writable` `false`. */
export class ResourceMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The listing's `group_meta` block, keyed by the collection's own name. */
export class GroupMeta extends Dto {
    static FIELDS = {
        orderCustomFields: ResourceMeta,
    };

    /** @type {ResourceMeta | null} */ orderCustomFields = this.declared('orderCustomFields');
}

/** One page of the listing: the rows, where they sit, `group_meta` and any schema. */
export class OrderCustomFieldPage extends Dto {
    static FIELDS = {
        orderCustomFields: dtoList(OrderCustomField),
        pagination: Pagination,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Array<OrderCustomField | null> | null} */ orderCustomFields = this.declared('orderCustomFields');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The `validate_timeslot` body, sent bare; `selectedDate` is `dd/MM/yyyy`. */
export class OrderCustomFieldTimeslotInput extends Dto {
    static FIELDS = {
        selectedDate: 'string',
        fieldName: 'string',
        weekdayId: 'int',
        startHour: 'int',
        endHour: 'int',
        orderLimit: 'int',
    };

    /** @type {string | null} */ selectedDate = this.declared('selectedDate');
    /** @type {string | null} */ fieldName = this.declared('fieldName');
    /** @type {number | null} */ weekdayId = this.declared('weekdayId');
    /** @type {number | null} */ startHour = this.declared('startHour');
    /** @type {number | null} */ endHour = this.declared('endHour');
    /** @type {number | null} */ orderLimit = this.declared('orderLimit');
}

sealDtoSchema(
    OrderCustomField,
    Pagination,
    ResourceMeta,
    GroupMeta,
    OrderCustomFieldPage,
    OrderCustomFieldTimeslotInput,
);
