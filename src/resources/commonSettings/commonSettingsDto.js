import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One entry of a settings group, for a write's lists; a read's entries have the same keys, `***` when masked. */
export class Setting extends Dto {
    static FIELDS = {
        configKey: 'string',
        value: 'string',
    };

    /** @type {string | null} */ configKey = this.declared('configKey');
    /** @type {string | null} */ value = this.declared('value');
}

/**
 * What the read and both writes answer: `settings`, group name to a list of `{"config_key", "value"}` mappings. The
 * `notifications` group alone is a name to boolean map, so the groups stay a plain mapping.
 */
export class CommonSettings extends Dto {
    static FIELDS = {
        settings: 'any',
    };

    /** @type {any} */ settings = this.declared('settings');
}

/**
 * The list form both writes take: `settings` maps a group name to a list of `Setting` entries. A group may instead be
 * `{config_key: value}` or `{name: {"config_key", "value"}}`; send those as a mapping or a JSON string.
 */
export class CommonSettingsInput extends Dto {
    static FIELDS = {
        // Keyed by group name, so each group's list is not a declared field.
        settings: 'any',
    };

    /** @type {Record<string, Array<Setting | Record<string, unknown>>> | null} */ settings = this.declared('settings');
}

/**
 * The registration form's `fields_configs`: six keys for each of the store's 20 fields. `_order` reads as text;
 * `_active` and `_required` are booleans here, though the settings read answers them as text.
 */
export class CustomerFieldConfigs extends Dto {
    static FIELDS = {
        firstNameOrder: 'string',
        firstNameKey: 'string',
        firstNameLabel: 'string',
        firstNamePlaceholder: 'string',
        firstNameActive: 'boolean',
        firstNameRequired: 'boolean',
        lastNameOrder: 'string',
        lastNameKey: 'string',
        lastNameLabel: 'string',
        lastNamePlaceholder: 'string',
        lastNameActive: 'boolean',
        lastNameRequired: 'boolean',
        addressLine1Order: 'string',
        addressLine1Key: 'string',
        addressLine1Label: 'string',
        addressLine1Placeholder: 'string',
        addressLine1Active: 'boolean',
        addressLine1Required: 'boolean',
        addressLine2Order: 'string',
        addressLine2Key: 'string',
        addressLine2Label: 'string',
        addressLine2Placeholder: 'string',
        addressLine2Active: 'boolean',
        addressLine2Required: 'boolean',
        postCodeOrder: 'string',
        postCodeKey: 'string',
        postCodeLabel: 'string',
        postCodePlaceholder: 'string',
        postCodeActive: 'boolean',
        postCodeRequired: 'boolean',
        cityOrder: 'string',
        cityKey: 'string',
        cityLabel: 'string',
        cityPlaceholder: 'string',
        cityActive: 'boolean',
        cityRequired: 'boolean',
        phoneOrder: 'string',
        phoneKey: 'string',
        phoneLabel: 'string',
        phonePlaceholder: 'string',
        phoneActive: 'boolean',
        phoneRequired: 'boolean',
        mobileOrder: 'string',
        mobileKey: 'string',
        mobileLabel: 'string',
        mobilePlaceholder: 'string',
        mobileActive: 'boolean',
        mobileRequired: 'boolean',
        faxOrder: 'string',
        faxKey: 'string',
        faxLabel: 'string',
        faxPlaceholder: 'string',
        faxActive: 'boolean',
        faxRequired: 'boolean',
        emailOrder: 'string',
        emailKey: 'string',
        emailLabel: 'string',
        emailPlaceholder: 'string',
        emailActive: 'boolean',
        emailRequired: 'boolean',
        confirmEmailOrder: 'string',
        confirmEmailKey: 'string',
        confirmEmailLabel: 'string',
        confirmEmailPlaceholder: 'string',
        confirmEmailActive: 'boolean',
        confirmEmailRequired: 'boolean',
        passwordOrder: 'string',
        passwordKey: 'string',
        passwordLabel: 'string',
        passwordPlaceholder: 'string',
        passwordActive: 'boolean',
        passwordRequired: 'boolean',
        retypePasswordOrder: 'string',
        retypePasswordKey: 'string',
        retypePasswordLabel: 'string',
        retypePasswordPlaceholder: 'string',
        retypePasswordActive: 'boolean',
        retypePasswordRequired: 'boolean',
        countryOrder: 'string',
        countryKey: 'string',
        countryLabel: 'string',
        countryPlaceholder: 'string',
        countryActive: 'boolean',
        countryRequired: 'boolean',
        customerTypeOrder: 'string',
        customerTypeKey: 'string',
        customerTypeLabel: 'string',
        customerTypePlaceholder: 'string',
        customerTypeActive: 'boolean',
        customerTypeRequired: 'boolean',
        sexOrder: 'string',
        sexKey: 'string',
        sexLabel: 'string',
        sexPlaceholder: 'string',
        sexActive: 'boolean',
        sexRequired: 'boolean',
        abnOrder: 'string',
        abnKey: 'string',
        abnLabel: 'string',
        abnPlaceholder: 'string',
        abnActive: 'boolean',
        abnRequired: 'boolean',
        abnBranchOrder: 'string',
        abnBranchKey: 'string',
        abnBranchLabel: 'string',
        abnBranchPlaceholder: 'string',
        abnBranchActive: 'boolean',
        abnBranchRequired: 'boolean',
        companyNameOrder: 'string',
        companyNameKey: 'string',
        companyNameLabel: 'string',
        companyNamePlaceholder: 'string',
        companyNameActive: 'boolean',
        companyNameRequired: 'boolean',
        dateOfBirthOrder: 'string',
        dateOfBirthKey: 'string',
        dateOfBirthLabel: 'string',
        dateOfBirthPlaceholder: 'string',
        dateOfBirthActive: 'boolean',
        dateOfBirthRequired: 'boolean',
    };

    /** @type {string | null} */ firstNameOrder = this.declared('firstNameOrder');
    /** @type {string | null} */ firstNameKey = this.declared('firstNameKey');
    /** @type {string | null} */ firstNameLabel = this.declared('firstNameLabel');
    /** @type {string | null} */ firstNamePlaceholder = this.declared('firstNamePlaceholder');
    /** @type {boolean | null} */ firstNameActive = this.declared('firstNameActive');
    /** @type {boolean | null} */ firstNameRequired = this.declared('firstNameRequired');
    /** @type {string | null} */ lastNameOrder = this.declared('lastNameOrder');
    /** @type {string | null} */ lastNameKey = this.declared('lastNameKey');
    /** @type {string | null} */ lastNameLabel = this.declared('lastNameLabel');
    /** @type {string | null} */ lastNamePlaceholder = this.declared('lastNamePlaceholder');
    /** @type {boolean | null} */ lastNameActive = this.declared('lastNameActive');
    /** @type {boolean | null} */ lastNameRequired = this.declared('lastNameRequired');
    /** @type {string | null} */ addressLine1Order = this.declared('addressLine1Order');
    /** @type {string | null} */ addressLine1Key = this.declared('addressLine1Key');
    /** @type {string | null} */ addressLine1Label = this.declared('addressLine1Label');
    /** @type {string | null} */ addressLine1Placeholder = this.declared('addressLine1Placeholder');
    /** @type {boolean | null} */ addressLine1Active = this.declared('addressLine1Active');
    /** @type {boolean | null} */ addressLine1Required = this.declared('addressLine1Required');
    /** @type {string | null} */ addressLine2Order = this.declared('addressLine2Order');
    /** @type {string | null} */ addressLine2Key = this.declared('addressLine2Key');
    /** @type {string | null} */ addressLine2Label = this.declared('addressLine2Label');
    /** @type {string | null} */ addressLine2Placeholder = this.declared('addressLine2Placeholder');
    /** @type {boolean | null} */ addressLine2Active = this.declared('addressLine2Active');
    /** @type {boolean | null} */ addressLine2Required = this.declared('addressLine2Required');
    /** @type {string | null} */ postCodeOrder = this.declared('postCodeOrder');
    /** @type {string | null} */ postCodeKey = this.declared('postCodeKey');
    /** @type {string | null} */ postCodeLabel = this.declared('postCodeLabel');
    /** @type {string | null} */ postCodePlaceholder = this.declared('postCodePlaceholder');
    /** @type {boolean | null} */ postCodeActive = this.declared('postCodeActive');
    /** @type {boolean | null} */ postCodeRequired = this.declared('postCodeRequired');
    /** @type {string | null} */ cityOrder = this.declared('cityOrder');
    /** @type {string | null} */ cityKey = this.declared('cityKey');
    /** @type {string | null} */ cityLabel = this.declared('cityLabel');
    /** @type {string | null} */ cityPlaceholder = this.declared('cityPlaceholder');
    /** @type {boolean | null} */ cityActive = this.declared('cityActive');
    /** @type {boolean | null} */ cityRequired = this.declared('cityRequired');
    /** @type {string | null} */ phoneOrder = this.declared('phoneOrder');
    /** @type {string | null} */ phoneKey = this.declared('phoneKey');
    /** @type {string | null} */ phoneLabel = this.declared('phoneLabel');
    /** @type {string | null} */ phonePlaceholder = this.declared('phonePlaceholder');
    /** @type {boolean | null} */ phoneActive = this.declared('phoneActive');
    /** @type {boolean | null} */ phoneRequired = this.declared('phoneRequired');
    /** @type {string | null} */ mobileOrder = this.declared('mobileOrder');
    /** @type {string | null} */ mobileKey = this.declared('mobileKey');
    /** @type {string | null} */ mobileLabel = this.declared('mobileLabel');
    /** @type {string | null} */ mobilePlaceholder = this.declared('mobilePlaceholder');
    /** @type {boolean | null} */ mobileActive = this.declared('mobileActive');
    /** @type {boolean | null} */ mobileRequired = this.declared('mobileRequired');
    /** @type {string | null} */ faxOrder = this.declared('faxOrder');
    /** @type {string | null} */ faxKey = this.declared('faxKey');
    /** @type {string | null} */ faxLabel = this.declared('faxLabel');
    /** @type {string | null} */ faxPlaceholder = this.declared('faxPlaceholder');
    /** @type {boolean | null} */ faxActive = this.declared('faxActive');
    /** @type {boolean | null} */ faxRequired = this.declared('faxRequired');
    /** @type {string | null} */ emailOrder = this.declared('emailOrder');
    /** @type {string | null} */ emailKey = this.declared('emailKey');
    /** @type {string | null} */ emailLabel = this.declared('emailLabel');
    /** @type {string | null} */ emailPlaceholder = this.declared('emailPlaceholder');
    /** @type {boolean | null} */ emailActive = this.declared('emailActive');
    /** @type {boolean | null} */ emailRequired = this.declared('emailRequired');
    /** @type {string | null} */ confirmEmailOrder = this.declared('confirmEmailOrder');
    /** @type {string | null} */ confirmEmailKey = this.declared('confirmEmailKey');
    /** @type {string | null} */ confirmEmailLabel = this.declared('confirmEmailLabel');
    /** @type {string | null} */ confirmEmailPlaceholder = this.declared('confirmEmailPlaceholder');
    /** @type {boolean | null} */ confirmEmailActive = this.declared('confirmEmailActive');
    /** @type {boolean | null} */ confirmEmailRequired = this.declared('confirmEmailRequired');
    /** @type {string | null} */ passwordOrder = this.declared('passwordOrder');
    /** @type {string | null} */ passwordKey = this.declared('passwordKey');
    /** @type {string | null} */ passwordLabel = this.declared('passwordLabel');
    /** @type {string | null} */ passwordPlaceholder = this.declared('passwordPlaceholder');
    /** @type {boolean | null} */ passwordActive = this.declared('passwordActive');
    /** @type {boolean | null} */ passwordRequired = this.declared('passwordRequired');
    /** @type {string | null} */ retypePasswordOrder = this.declared('retypePasswordOrder');
    /** @type {string | null} */ retypePasswordKey = this.declared('retypePasswordKey');
    /** @type {string | null} */ retypePasswordLabel = this.declared('retypePasswordLabel');
    /** @type {string | null} */ retypePasswordPlaceholder = this.declared('retypePasswordPlaceholder');
    /** @type {boolean | null} */ retypePasswordActive = this.declared('retypePasswordActive');
    /** @type {boolean | null} */ retypePasswordRequired = this.declared('retypePasswordRequired');
    /** @type {string | null} */ countryOrder = this.declared('countryOrder');
    /** @type {string | null} */ countryKey = this.declared('countryKey');
    /** @type {string | null} */ countryLabel = this.declared('countryLabel');
    /** @type {string | null} */ countryPlaceholder = this.declared('countryPlaceholder');
    /** @type {boolean | null} */ countryActive = this.declared('countryActive');
    /** @type {boolean | null} */ countryRequired = this.declared('countryRequired');
    /** @type {string | null} */ customerTypeOrder = this.declared('customerTypeOrder');
    /** @type {string | null} */ customerTypeKey = this.declared('customerTypeKey');
    /** @type {string | null} */ customerTypeLabel = this.declared('customerTypeLabel');
    /** @type {string | null} */ customerTypePlaceholder = this.declared('customerTypePlaceholder');
    /** @type {boolean | null} */ customerTypeActive = this.declared('customerTypeActive');
    /** @type {boolean | null} */ customerTypeRequired = this.declared('customerTypeRequired');
    /** @type {string | null} */ sexOrder = this.declared('sexOrder');
    /** @type {string | null} */ sexKey = this.declared('sexKey');
    /** @type {string | null} */ sexLabel = this.declared('sexLabel');
    /** @type {string | null} */ sexPlaceholder = this.declared('sexPlaceholder');
    /** @type {boolean | null} */ sexActive = this.declared('sexActive');
    /** @type {boolean | null} */ sexRequired = this.declared('sexRequired');
    /** @type {string | null} */ abnOrder = this.declared('abnOrder');
    /** @type {string | null} */ abnKey = this.declared('abnKey');
    /** @type {string | null} */ abnLabel = this.declared('abnLabel');
    /** @type {string | null} */ abnPlaceholder = this.declared('abnPlaceholder');
    /** @type {boolean | null} */ abnActive = this.declared('abnActive');
    /** @type {boolean | null} */ abnRequired = this.declared('abnRequired');
    /** @type {string | null} */ abnBranchOrder = this.declared('abnBranchOrder');
    /** @type {string | null} */ abnBranchKey = this.declared('abnBranchKey');
    /** @type {string | null} */ abnBranchLabel = this.declared('abnBranchLabel');
    /** @type {string | null} */ abnBranchPlaceholder = this.declared('abnBranchPlaceholder');
    /** @type {boolean | null} */ abnBranchActive = this.declared('abnBranchActive');
    /** @type {boolean | null} */ abnBranchRequired = this.declared('abnBranchRequired');
    /** @type {string | null} */ companyNameOrder = this.declared('companyNameOrder');
    /** @type {string | null} */ companyNameKey = this.declared('companyNameKey');
    /** @type {string | null} */ companyNameLabel = this.declared('companyNameLabel');
    /** @type {string | null} */ companyNamePlaceholder = this.declared('companyNamePlaceholder');
    /** @type {boolean | null} */ companyNameActive = this.declared('companyNameActive');
    /** @type {boolean | null} */ companyNameRequired = this.declared('companyNameRequired');
    /** @type {string | null} */ dateOfBirthOrder = this.declared('dateOfBirthOrder');
    /** @type {string | null} */ dateOfBirthKey = this.declared('dateOfBirthKey');
    /** @type {string | null} */ dateOfBirthLabel = this.declared('dateOfBirthLabel');
    /** @type {string | null} */ dateOfBirthPlaceholder = this.declared('dateOfBirthPlaceholder');
    /** @type {boolean | null} */ dateOfBirthActive = this.declared('dateOfBirthActive');
    /** @type {boolean | null} */ dateOfBirthRequired = this.declared('dateOfBirthRequired');
}

/** The registration form: the active `fields` in their order, and `fieldsConfigs` for every field. */
export class CustomerFields extends Dto {
    static FIELDS = {
        fields: dtoList('string'),
        fieldsConfigs: CustomerFieldConfigs,
    };

    /** @type {Array<string | null> | null} */ fields = this.declared('fields');
    /** @type {CustomerFieldConfigs | null} */ fieldsConfigs = this.declared('fieldsConfigs');
}

sealDtoSchema(Setting, CommonSettings, CommonSettingsInput, CustomerFieldConfigs, CustomerFields);
