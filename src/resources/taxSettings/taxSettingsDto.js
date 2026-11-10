import {Dto, sealDtoSchema} from '../../dto.js';

/** The country tax the store charges by default, as `tax_region` reads it. */
export class TaxRegion extends Dto {
    static FIELDS = {
        countryTaxId: 'int',
        countryCode: 'string',
        countryName: 'string',
    };

    /** @type {number | null} */ countryTaxId = this.declared('countryTaxId');
    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ countryName = this.declared('countryName');
}

/** A custom tax profile as a read names it: its id and name, or `null`. */
export class TaxProfileReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One `group_meta` entry: what the area is, whether it can be written, and its path. */
export class TaxSettingsAreaMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block: the settings area and the two tax collections beside it. */
export class TaxSettingsGroupMeta extends Dto {
    static FIELDS = {
        taxSettings: TaxSettingsAreaMeta,
        taxProfiles: TaxSettingsAreaMeta,
        taxRules: TaxSettingsAreaMeta,
    };

    /** @type {TaxSettingsAreaMeta | null} */ taxSettings = this.declared('taxSettings');
    /** @type {TaxSettingsAreaMeta | null} */ taxProfiles = this.declared('taxProfiles');
    /** @type {TaxSettingsAreaMeta | null} */ taxRules = this.declared('taxRules');
}

/** The nine keys under `tax_settings`, with `group_meta` and, when asked for, `field_metadata`. */
export class TaxSettings extends Dto {
    static ENVELOPE_KEY = 'tax_settings';

    static FIELDS = {
        taxRateForCustomers: 'string',
        taxRegion: TaxRegion,
        customTaxProfile: TaxProfileReference,
        isPriceShownWithTax: 'boolean',
        pricesInCatalog: 'string',
        calculatedBy: 'string',
        isOutOfRegionTaxFree: 'boolean',
        taxMessage: 'string',
        basePriceRounding: 'string',
        groupMeta: TaxSettingsGroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {string | null} */ taxRateForCustomers = this.declared('taxRateForCustomers');
    /** @type {TaxRegion | null} */ taxRegion = this.declared('taxRegion');
    /** @type {TaxProfileReference | null} */ customTaxProfile = this.declared('customTaxProfile');
    /** @type {boolean | null} */ isPriceShownWithTax = this.declared('isPriceShownWithTax');
    /** @type {string | null} */ pricesInCatalog = this.declared('pricesInCatalog');
    /** @type {string | null} */ calculatedBy = this.declared('calculatedBy');
    /** @type {boolean | null} */ isOutOfRegionTaxFree = this.declared('isOutOfRegionTaxFree');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
    /** @type {TaxSettingsGroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** `tax_region` as a write takes it: a `countryCode` (with an optional `stateCode`) or a `countryTaxId`. */
export class TaxRegionInput extends Dto {
    static FIELDS = {
        countryTaxId: 'int',
        countryCode: 'string',
        stateCode: 'string',
    };

    /** @type {number | null} */ countryTaxId = this.declared('countryTaxId');
    /** @type {string | null} */ countryCode = this.declared('countryCode');
    /** @type {string | null} */ stateCode = this.declared('stateCode');
}

/**
 * The body `PUT` and `PATCH` take, wrapped in `tax_settings`; both merge. The profile is written as
 * `customTaxProfileId`; `calculatedBy` is read-only.
 */
export class TaxSettingsInput extends Dto {
    static ENVELOPE_KEY = 'tax_settings';

    static FIELDS = {
        taxRateForCustomers: 'string',
        taxRegion: TaxRegionInput,
        customTaxProfileId: 'int',
        isPriceShownWithTax: 'boolean',
        pricesInCatalog: 'string',
        isOutOfRegionTaxFree: 'boolean',
        taxMessage: 'string',
        basePriceRounding: 'string',
    };

    /** @type {string | null} */ taxRateForCustomers = this.declared('taxRateForCustomers');
    /** @type {TaxRegionInput | null} */ taxRegion = this.declared('taxRegion');
    /** @type {number | null} */ customTaxProfileId = this.declared('customTaxProfileId');
    /** @type {boolean | null} */ isPriceShownWithTax = this.declared('isPriceShownWithTax');
    /** @type {string | null} */ pricesInCatalog = this.declared('pricesInCatalog');
    /** @type {boolean | null} */ isOutOfRegionTaxFree = this.declared('isOutOfRegionTaxFree');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
    /** @type {string | null} */ basePriceRounding = this.declared('basePriceRounding');
}

sealDtoSchema(
    TaxRegion,
    TaxProfileReference,
    TaxSettingsAreaMeta,
    TaxSettingsGroupMeta,
    TaxSettings,
    TaxRegionInput,
    TaxSettingsInput,
);
