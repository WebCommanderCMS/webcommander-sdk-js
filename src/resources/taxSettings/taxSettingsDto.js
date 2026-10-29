import {Dto, sealDtoSchema} from '../../dto.js';

/** The nine flat keys the settings facade sends; the `PUT` takes {@link TaxSettingsInput}'s `settings` wrapper. */
export class TaxSettings extends Dto {
    static ENVELOPE_KEY = 'tax_settings';

    static FIELDS = {
        configurationType: 'string',
        systemDefaultTax: 'boolean',
        defaultCountry: 'string',
        customTaxProfileId: 'int',
        defaultTaxProfile: 'int',
        showPriceWithTax: 'boolean',
        isPriceWithTax: 'boolean',
        defaultTaxCode: 'string',
        taxMessage: 'string',
    };

    /** @type {string | null} */ configurationType = this.declared('configurationType');
    /** @type {boolean | null} */ systemDefaultTax = this.declared('systemDefaultTax');
    /** @type {string | null} */ defaultCountry = this.declared('defaultCountry');
    /** @type {number | null} */ customTaxProfileId = this.declared('customTaxProfileId');
    /** @type {number | null} */ defaultTaxProfile = this.declared('defaultTaxProfile');
    /** @type {boolean | null} */ showPriceWithTax = this.declared('showPriceWithTax');
    /** @type {boolean | null} */ isPriceWithTax = this.declared('isPriceWithTax');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
}

/** The body the settings `PUT` takes, wrapped in `settings`; a merge. `defaultTaxProfile` must name a live row. */
export class TaxSettingsInput extends Dto {
    static ENVELOPE_KEY = 'settings';

    static FIELDS = {
        configurationType: 'string',
        systemDefaultTax: 'boolean',
        defaultCountry: 'string',
        customTaxProfileId: 'int',
        defaultTaxProfile: 'int',
        showPriceWithTax: 'boolean',
        isPriceWithTax: 'boolean',
        defaultTaxCode: 'string',
        taxMessage: 'string',
    };

    /** @type {string | null} */ configurationType = this.declared('configurationType');
    /** @type {boolean | null} */ systemDefaultTax = this.declared('systemDefaultTax');
    /** @type {string | null} */ defaultCountry = this.declared('defaultCountry');
    /** @type {number | null} */ customTaxProfileId = this.declared('customTaxProfileId');
    /** @type {number | null} */ defaultTaxProfile = this.declared('defaultTaxProfile');
    /** @type {boolean | null} */ showPriceWithTax = this.declared('showPriceWithTax');
    /** @type {boolean | null} */ isPriceWithTax = this.declared('isPriceWithTax');
    /** @type {string | null} */ defaultTaxCode = this.declared('defaultTaxCode');
    /** @type {string | null} */ taxMessage = this.declared('taxMessage');
}

sealDtoSchema(TaxSettings, TaxSettingsInput);
