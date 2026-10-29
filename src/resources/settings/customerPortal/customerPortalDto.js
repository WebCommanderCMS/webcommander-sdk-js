import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** One entry of `default_groups` or `approval_groups` as a read sends it; a write takes bare ids instead. */
export class CustomerGroup extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `portal` section — the one switch that turns the customer portal on. */
export class Portal extends Dto {
    static ENVELOPE_KEY = 'portal';

    static FIELDS = {
        enabled: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
}

/** The `terms` block — the terms line on the registration form; enabling it needs a `reference`. */
export class RegistrationTerms extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        text: 'string',
        anchorText: 'string',
        type: 'string',
        reference: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ text = this.declared('text');
    /** @type {string | null} */ anchorText = this.declared('anchorText');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ reference = this.declared('reference');
}

/** The `facebook` block — registering through Facebook. */
export class FacebookLogin extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        appId: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ appId = this.declared('appId');
}

/** The `google` block — registering through Google. */
export class GoogleLogin extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        clientId: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ clientId = this.declared('clientId');
}

/** The `b2b_configuration` block — what a new registrant is created as. */
export class B2bConfiguration extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        createAsOrganisation: 'boolean',
        createAsCustomer: 'boolean',
        organisationSelected: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ createAsOrganisation = this.declared('createAsOrganisation');
    /** @type {boolean | null} */ createAsCustomer = this.declared('createAsCustomer');
    /** @type {boolean | null} */ organisationSelected = this.declared('organisationSelected');
}

/** The `alternate_login` block — third-party login and whether it offers an email field. */
export class AlternateLogin extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        enableEmailField: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ enableEmailField = this.declared('enableEmailField');
}

/** The `registration` section — whether customers may register, as what, and what they must accept. */
export class Registration extends Dto {
    static ENVELOPE_KEY = 'registration';

    static FIELDS = {
        enabled: 'boolean',
        closeRegistrationMessage: 'string',
        assignDefaultGroup: 'boolean',
        defaultGroups: dtoList(CustomerGroup),
        requiresApproval: 'boolean',
        approvalGroups: dtoList(CustomerGroup),
        terms: RegistrationTerms,
        facebook: FacebookLogin,
        google: GoogleLogin,
        b2bConfiguration: B2bConfiguration,
        alternateLogin: AlternateLogin,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ closeRegistrationMessage = this.declared('closeRegistrationMessage');
    /** @type {boolean | null} */ assignDefaultGroup = this.declared('assignDefaultGroup');
    /** @type {Array<CustomerGroup | null> | null} */ defaultGroups = this.declared('defaultGroups');
    /** @type {boolean | null} */ requiresApproval = this.declared('requiresApproval');
    /** @type {Array<CustomerGroup | null> | null} */ approvalGroups = this.declared('approvalGroups');
    /** @type {RegistrationTerms | null} */ terms = this.declared('terms');
    /** @type {FacebookLogin | null} */ facebook = this.declared('facebook');
    /** @type {GoogleLogin | null} */ google = this.declared('google');
    /** @type {B2bConfiguration | null} */ b2bConfiguration = this.declared('b2bConfiguration');
    /** @type {AlternateLogin | null} */ alternateLogin = this.declared('alternateLogin');
}

/** The `captcha` block — the challenge shown after failed logins. */
export class LoginCaptcha extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        failCount: 'int',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ failCount = this.declared('failCount');
}

/** The `login` section — whether customers may sign in and what the sign-in page offers. */
export class Login extends Dto {
    static ENVELOPE_KEY = 'login';

    static FIELDS = {
        enabled: 'boolean',
        loginDisabledMessage: 'string',
        awaitingApprovalMessage: 'string',
        passwordRecovery: 'boolean',
        registrationLink: 'boolean',
        captcha: LoginCaptcha,
        enableLandingPageAfterSuccessfulLogin: 'boolean',
        landingPageAfterSuccessfulLogin: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ loginDisabledMessage = this.declared('loginDisabledMessage');
    /** @type {string | null} */ awaitingApprovalMessage = this.declared('awaitingApprovalMessage');
    /** @type {boolean | null} */ passwordRecovery = this.declared('passwordRecovery');
    /** @type {boolean | null} */ registrationLink = this.declared('registrationLink');
    /** @type {LoginCaptcha | null} */ captcha = this.declared('captcha');
    /** @type {boolean | null} */ enableLandingPageAfterSuccessfulLogin = this.declared(
        'enableLandingPageAfterSuccessfulLogin',
    );
    /** @type {string | null} */ landingPageAfterSuccessfulLogin = this.declared('landingPageAfterSuccessfulLogin');
}

/** The `azure_ad.data_mapping` block — which assertion attribute fills which field; `country_id` is an integer. */
export class AzureAdDataMapping extends Dto {
    static FIELDS = {
        addressLine1: 'string',
        addressLine2: 'string',
        postCode: 'string',
        phone: 'string',
        mobile: 'string',
        countryId: 'int',
        state: 'string',
        city: 'string',
    };

    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {number | null} */ countryId = this.declared('countryId');
    /** @type {string | null} */ state = this.declared('state');
    /** @type {string | null} */ city = this.declared('city');
}

/** The `azure_ad` block — the SAML provider. */
export class AzureAd extends Dto {
    static FIELDS = {
        dataMapping: AzureAdDataMapping,
        identifier: 'string',
        loginUrl: 'string',
        replyUrlPostfix: 'string',
    };

    /** @type {AzureAdDataMapping | null} */ dataMapping = this.declared('dataMapping');
    /** @type {string | null} */ identifier = this.declared('identifier');
    /** @type {string | null} */ loginUrl = this.declared('loginUrl');
    /** @type {string | null} */ replyUrlPostfix = this.declared('replyUrlPostfix');
}

/** The `azure_ad_b2c` block — the B2C provider, carrying `client_secret`. */
export class AzureAdB2c extends Dto {
    static FIELDS = {
        tenantName: 'string',
        policyName: 'string',
        clientId: 'string',
        clientSecret: 'string',
        replyUrlPrefix: 'string',
        replyUrlPostfix: 'string',
    };

    /** @type {string | null} */ tenantName = this.declared('tenantName');
    /** @type {string | null} */ policyName = this.declared('policyName');
    /** @type {string | null} */ clientId = this.declared('clientId');
    /** @type {string | null} */ clientSecret = this.declared('clientSecret');
    /** @type {string | null} */ replyUrlPrefix = this.declared('replyUrlPrefix');
    /** @type {string | null} */ replyUrlPostfix = this.declared('replyUrlPostfix');
}

/** The `sso` section — single sign-on; turning `enabled` on needs the whole `azure_ad_b2c` block. */
export class Sso extends Dto {
    static ENVELOPE_KEY = 'sso';

    static FIELDS = {
        enabled: 'boolean',
        requireSiteAccess: 'boolean',
        serviceProvider: 'string',
        azureAd: AzureAd,
        azureAdB2c: AzureAdB2c,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ requireSiteAccess = this.declared('requireSiteAccess');
    /** @type {string | null} */ serviceProvider = this.declared('serviceProvider');
    /** @type {AzureAd | null} */ azureAd = this.declared('azureAd');
    /** @type {AzureAdB2c | null} */ azureAdB2c = this.declared('azureAdB2c');
}

/** One row of an address or account form on the profile page. */
export class ProfileField extends Dto {
    static FIELDS = {
        key: 'string',
        active: 'boolean',
        order: 'int',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {number | null} */ order = this.declared('order');
}

/** One named row on the profile page: {@link ProfileField} plus a `label`. */
export class ProfileEntry extends ProfileField {
    static FIELDS = {
        key: 'string',
        active: 'boolean',
        order: 'int',
        label: 'string',
    };

    /** @type {string | null} */ label = this.declared('label');
}

/** One row of `overview`; `show_product_info` is sent on some entries and not others. */
export class ProfileOverviewEntry extends ProfileEntry {
    static FIELDS = {
        key: 'string',
        active: 'boolean',
        order: 'int',
        label: 'string',
        showProductInfo: 'boolean',
    };

    /** @type {boolean | null} */ showProductInfo = this.declared('showProductInfo');
}

/** The `manage_my_account` block — the account screen's sections and the fields each form draws. */
export class ManageMyAccount extends Dto {
    static FIELDS = {
        sections: dtoList(ProfileEntry),
        accountInformation: dtoList(ProfileField),
        billingAddress: dtoList(ProfileField),
        shippingAddress: dtoList(ProfileField),
    };

    /** @type {Array<ProfileEntry | null> | null} */ sections = this.declared('sections');
    /** @type {Array<ProfileField | null> | null} */ accountInformation = this.declared('accountInformation');
    /** @type {Array<ProfileField | null> | null} */ billingAddress = this.declared('billingAddress');
    /** @type {Array<ProfileField | null> | null} */ shippingAddress = this.declared('shippingAddress');
}

/** The `my_orders.flags` block — six booleans. */
export class MyOrderFlags extends Dto {
    static FIELDS = {
        enableDuePayment: 'boolean',
        showTrackMyOrders: 'boolean',
        displayTrackInColumn: 'boolean',
        showOrderChannel: 'boolean',
        showPayNow: 'boolean',
        allowOrderShare: 'boolean',
    };

    /** @type {boolean | null} */ enableDuePayment = this.declared('enableDuePayment');
    /** @type {boolean | null} */ showTrackMyOrders = this.declared('showTrackMyOrders');
    /** @type {boolean | null} */ displayTrackInColumn = this.declared('displayTrackInColumn');
    /** @type {boolean | null} */ showOrderChannel = this.declared('showOrderChannel');
    /** @type {boolean | null} */ showPayNow = this.declared('showPayNow');
    /** @type {boolean | null} */ allowOrderShare = this.declared('allowOrderShare');
}

/** The `my_orders` block — what the orders tab shows and which order lists it offers. */
export class MyOrders extends Dto {
    static FIELDS = {
        flags: MyOrderFlags,
        sections: dtoList(ProfileEntry),
    };

    /** @type {MyOrderFlags | null} */ flags = this.declared('flags');
    /** @type {Array<ProfileEntry | null> | null} */ sections = this.declared('sections');
}

/** The `assign_to_customer` block — the assigned-pages tab and how it paginates. */
export class AssignToCustomer extends Dto {
    static FIELDS = {
        items: dtoList(ProfileEntry),
        showPagination: 'string',
        itemPerPage: 'int',
    };

    /** @type {Array<ProfileEntry | null> | null} */ items = this.declared('items');
    /** @type {string | null} */ showPagination = this.declared('showPagination');
    /** @type {number | null} */ itemPerPage = this.declared('itemPerPage');
}

/** The `profile_page` section, read-only: `group_meta` marks it `writable: false`. */
export class ProfilePage extends Dto {
    static ENVELOPE_KEY = 'profile_page';

    static FIELDS = {
        pageHtml: 'string',
        tabs: dtoList(ProfileEntry),
        overview: dtoList(ProfileOverviewEntry),
        manageMyAccount: ManageMyAccount,
        myOrders: MyOrders,
        myEntitlements: dtoList(ProfileEntry),
        assignToCustomer: AssignToCustomer,
    };

    /** @type {string | null} */ pageHtml = this.declared('pageHtml');
    /** @type {Array<ProfileEntry | null> | null} */ tabs = this.declared('tabs');
    /** @type {Array<ProfileOverviewEntry | null> | null} */ overview = this.declared('overview');
    /** @type {ManageMyAccount | null} */ manageMyAccount = this.declared('manageMyAccount');
    /** @type {MyOrders | null} */ myOrders = this.declared('myOrders');
    /** @type {Array<ProfileEntry | null> | null} */ myEntitlements = this.declared('myEntitlements');
    /** @type {AssignToCustomer | null} */ assignToCustomer = this.declared('assignToCustomer');
}

/** One row of the registration form's field catalog; `placeholder` is absent from rows with no text box. */
export class RegistrationField extends Dto {
    static FIELDS = {
        key: 'string',
        label: 'string',
        defaultLabel: 'string',
        active: 'boolean',
        required: 'boolean',
        system: 'boolean',
        order: 'int',
        placeholder: 'string',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ defaultLabel = this.declared('defaultLabel');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ required = this.declared('required');
    /** @type {boolean | null} */ system = this.declared('system');
    /** @type {number | null} */ order = this.declared('order');
    /** @type {string | null} */ placeholder = this.declared('placeholder');
}

/** The `registration_fields` section, read-only. */
export class RegistrationFields extends Dto {
    static ENVELOPE_KEY = 'registration_fields';

    static FIELDS = {
        fields: dtoList(RegistrationField),
    };

    /** @type {Array<RegistrationField | null> | null} */ fields = this.declared('fields');
}

/** One entry of `group_meta`: what a section is, whether it can be written and where it is managed. */
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

/** The `group_meta` block — one {@link SectionMeta} per section; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        portal: SectionMeta,
        registration: SectionMeta,
        login: SectionMeta,
        sso: SectionMeta,
        profilePage: SectionMeta,
        registrationFields: SectionMeta,
    };

    /** @type {SectionMeta | null} */ portal = this.declared('portal');
    /** @type {SectionMeta | null} */ registration = this.declared('registration');
    /** @type {SectionMeta | null} */ login = this.declared('login');
    /** @type {SectionMeta | null} */ sso = this.declared('sso');
    /** @type {SectionMeta | null} */ profilePage = this.declared('profilePage');
    /** @type {SectionMeta | null} */ registrationFields = this.declared('registrationFields');
}

/** The customer portal settings in either form the API sends. */
export class CustomerPortal extends Dto {
    static ENVELOPE_KEY = 'customer_portal';

    static FIELDS = {
        portal: Portal,
        registration: Registration,
        login: Login,
        sso: Sso,
        profilePage: ProfilePage,
        registrationFields: RegistrationFields,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Portal | null} */ portal = this.declared('portal');
    /** @type {Registration | null} */ registration = this.declared('registration');
    /** @type {Login | null} */ login = this.declared('login');
    /** @type {Sso | null} */ sso = this.declared('sso');
    /** @type {ProfilePage | null} */ profilePage = this.declared('profilePage');
    /** @type {RegistrationFields | null} */ registrationFields = this.declared('registrationFields');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    CustomerGroup,
    Portal,
    RegistrationTerms,
    FacebookLogin,
    GoogleLogin,
    B2bConfiguration,
    AlternateLogin,
    Registration,
    LoginCaptcha,
    Login,
    AzureAdDataMapping,
    AzureAd,
    AzureAdB2c,
    Sso,
    ProfileField,
    ProfileEntry,
    ProfileOverviewEntry,
    ManageMyAccount,
    MyOrderFlags,
    MyOrders,
    AssignToCustomer,
    ProfilePage,
    RegistrationField,
    RegistrationFields,
    SectionMeta,
    GroupMeta,
    CustomerPortal,
);
