import {Dto, sealDtoSchema} from '../../../dto.js';

/** What a reference field holds: the store's id and the name it resolves to, or `null`. */
export class ProfileReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One `group_meta` entry: what the area is, whether it can be written, and its path. */
export class AreaMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block: the settings area and the two collections beside it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        shippingSettings: AreaMeta,
        shippingMethods: AreaMeta,
        shippingClasses: AreaMeta,
    };

    /** @type {AreaMeta | null} */ shippingSettings = this.declared('shippingSettings');
    /** @type {AreaMeta | null} */ shippingMethods = this.declared('shippingMethods');
    /** @type {AreaMeta | null} */ shippingClasses = this.declared('shippingClasses');
}

/**
 * The shipping settings; sending a reference as an id or `null` takes a mapping body, as `toMap()` drops a
 * `null` field.
 */
export class ShippingSettings extends Dto {
    static ENVELOPE_KEY = 'shipping_settings';

    static FIELDS = {
        defaultShippingProfile: ProfileReference,
        applyStoreTaxSettingsToShipping: 'boolean',
        defaultDeliveryProfile: ProfileReference,
        applyStoreTaxSettingsToDelivery: 'boolean',
        shippingTaxProfile: ProfileReference,
        enableShippingClass: 'boolean',
        enableClassInFlatView: 'boolean',
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {ProfileReference | null} */ defaultShippingProfile = this.declared('defaultShippingProfile');
    /** @type {boolean | null} */ applyStoreTaxSettingsToShipping = this.declared('applyStoreTaxSettingsToShipping');
    /** @type {ProfileReference | null} */ defaultDeliveryProfile = this.declared('defaultDeliveryProfile');
    /** @type {boolean | null} */ applyStoreTaxSettingsToDelivery = this.declared('applyStoreTaxSettingsToDelivery');
    /** @type {ProfileReference | null} */ shippingTaxProfile = this.declared('shippingTaxProfile');
    /** @type {boolean | null} */ enableShippingClass = this.declared('enableShippingClass');
    /** @type {boolean | null} */ enableClassInFlatView = this.declared('enableClassInFlatView');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(ProfileReference, AreaMeta, GroupMeta, ShippingSettings);
