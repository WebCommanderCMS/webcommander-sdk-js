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

/** The `group_meta` entry: two fields and no `href`, as there is no section endpoint. */
export class AreaMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
}

/** The `group_meta` block — a single {@link AreaMeta}, keyed by the area itself. */
export class GroupMeta extends Dto {
    static FIELDS = {
        shippingSettings: AreaMeta,
    };

    /** @type {AreaMeta | null} */ shippingSettings = this.declared('shippingSettings');
}

/**
 * The shipping settings; sending a reference as an id or `null` takes a mapping body, as `toMap()` drops a
 * `null` field.
 */
export class ShippingSettings extends Dto {
    static ENVELOPE_KEY = 'shipping_settings';

    static FIELDS = {
        defaultShippingProfile: ProfileReference,
        enableShippingDefaultTax: 'boolean',
        defaultDeliveryProfile: ProfileReference,
        enableDeliveryDefaultTax: 'boolean',
        shippingTaxProfile: ProfileReference,
        enableShippingClass: 'boolean',
        enableFlatViewClass: 'boolean',
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {ProfileReference | null} */ defaultShippingProfile = this.declared('defaultShippingProfile');
    /** @type {boolean | null} */ enableShippingDefaultTax = this.declared('enableShippingDefaultTax');
    /** @type {ProfileReference | null} */ defaultDeliveryProfile = this.declared('defaultDeliveryProfile');
    /** @type {boolean | null} */ enableDeliveryDefaultTax = this.declared('enableDeliveryDefaultTax');
    /** @type {ProfileReference | null} */ shippingTaxProfile = this.declared('shippingTaxProfile');
    /** @type {boolean | null} */ enableShippingClass = this.declared('enableShippingClass');
    /** @type {boolean | null} */ enableFlatViewClass = this.declared('enableFlatViewClass');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(ProfileReference, AreaMeta, GroupMeta, ShippingSettings);
