import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** A country or a state; a write may send a bare id, code or name in place of the record. */
export class Region extends Dto {
    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `auto_suggest.addresses` block. */
export class AutoSuggestAddresses extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        validate: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ validate = this.declared('validate');
}

/** The `auto_suggest` block — address and suburb suggestions. */
export class AutoSuggest extends Dto {
    static FIELDS = {
        addresses: AutoSuggestAddresses,
        suburbsCities: 'boolean',
    };

    /** @type {AutoSuggestAddresses | null} */ addresses = this.declared('addresses');
    /** @type {boolean | null} */ suburbsCities = this.declared('suburbsCities');
}

/** The `captcha` block; `minimumScore` is a float, as the store sends `0.5`. */
export class Captcha extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        minimumScore: 'float',
        privateKey: 'string',
        privateKeyTurnstile: 'string',
        private_key_v3: 'string',
        publicKey: 'string',
        publicKeyTurnstile: 'string',
        public_key_v3: 'string',
        type: 'string',
        useOwn: 'boolean',
        version: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {number | null} */ minimumScore = this.declared('minimumScore');
    /** @type {string | null} */ privateKey = this.declared('privateKey');
    /** @type {string | null} */ privateKeyTurnstile = this.declared('privateKeyTurnstile');
    /** @type {string | null} */ private_key_v3 = this.declared('private_key_v3');
    /** @type {string | null} */ publicKey = this.declared('publicKey');
    /** @type {string | null} */ publicKeyTurnstile = this.declared('publicKeyTurnstile');
    /** @type {string | null} */ public_key_v3 = this.declared('public_key_v3');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {boolean | null} */ useOwn = this.declared('useOwn');
    /** @type {string | null} */ version = this.declared('version');
}

/** The `administration` section. */
export class Administration extends Dto {
    static ENVELOPE_KEY = 'administration';

    static FIELDS = {
        autoSuggest: AutoSuggest,
        captcha: Captcha,
        defaultCountry: Region,
        defaultState: Region,
        ecommerceEnabled: 'boolean',
        maxPrecision: 'int',
        page_403: 'string',
        page_404: 'string',
        unitLength: 'string',
        unitWeight: 'string',
    };

    /** @type {AutoSuggest | null} */ autoSuggest = this.declared('autoSuggest');
    /** @type {Captcha | null} */ captcha = this.declared('captcha');
    /** @type {Region | null} */ defaultCountry = this.declared('defaultCountry');
    /** @type {Region | null} */ defaultState = this.declared('defaultState');
    /** @type {boolean | null} */ ecommerceEnabled = this.declared('ecommerceEnabled');
    /** @type {number | null} */ maxPrecision = this.declared('maxPrecision');
    /** @type {string | null} */ page_403 = this.declared('page_403');
    /** @type {string | null} */ page_404 = this.declared('page_404');
    /** @type {string | null} */ unitLength = this.declared('unitLength');
    /** @type {string | null} */ unitWeight = this.declared('unitWeight');
}

/** The `brand_kit.colors` block: six roles, each a hex colour. */
export class BrandColors extends Dto {
    static FIELDS = {
        accent: 'string',
        background: 'string',
        primary: 'string',
        secondary: 'string',
        surface: 'string',
        text: 'string',
    };

    /** @type {string | null} */ accent = this.declared('accent');
    /** @type {string | null} */ background = this.declared('background');
    /** @type {string | null} */ primary = this.declared('primary');
    /** @type {string | null} */ secondary = this.declared('secondary');
    /** @type {string | null} */ surface = this.declared('surface');
    /** @type {string | null} */ text = this.declared('text');
}

/** The `brand_kit` section — the site-wide palette. */
export class BrandKit extends Dto {
    static ENVELOPE_KEY = 'brand_kit';

    static FIELDS = {
        colors: BrandColors,
        enabled: 'boolean',
        paletteName: 'string',
    };

    /** @type {BrandColors | null} */ colors = this.declared('colors');
    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ paletteName = this.declared('paletteName');
}

/** The three fields every `date_time` audience block carries. */
export class DateTimeFormat extends Dto {
    static FIELDS = {
        dateFormat: 'string',
        timeFormat: 'string',
        timeZone: 'string',
    };

    /** @type {string | null} */ dateFormat = this.declared('dateFormat');
    /** @type {string | null} */ timeFormat = this.declared('timeFormat');
    /** @type {string | null} */ timeZone = this.declared('timeZone');
}

/** The `date_time.admin` block; `FIELDS` is redeclared whole, as a subclass's own replaces the inherited one. */
export class AdminDateTime extends DateTimeFormat {
    static FIELDS = {
        dateFormat: 'string',
        timeFormat: 'string',
        timeZone: 'string',
        firstDayOfWeek: 'string',
    };

    /** @type {string | null} */ firstDayOfWeek = this.declared('firstDayOfWeek');
}

/** The `date_time.email` and `date_time.user` blocks: the three formats and a `separate` flag. */
export class SeparableDateTime extends DateTimeFormat {
    static FIELDS = {
        dateFormat: 'string',
        timeFormat: 'string',
        timeZone: 'string',
        separate: 'boolean',
    };

    /** @type {boolean | null} */ separate = this.declared('separate');
}

/** The `date_time` section: formats and zones for the admin area, emails and the storefront. */
export class DateTime extends Dto {
    static ENVELOPE_KEY = 'date_time';

    static FIELDS = {
        admin: AdminDateTime,
        email: SeparableDateTime,
        hideTimeZone: 'boolean',
        user: SeparableDateTime,
    };

    /** @type {AdminDateTime | null} */ admin = this.declared('admin');
    /** @type {SeparableDateTime | null} */ email = this.declared('email');
    /** @type {boolean | null} */ hideTimeZone = this.declared('hideTimeZone');
    /** @type {SeparableDateTime | null} */ user = this.declared('user');
}

/** The `maintenance` block — whether the storefront is closed and what it says while it is. */
export class Maintenance extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        message: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ message = this.declared('message');
}

/** The `security_code` block — the site lock; `code` reads back masked once set. */
export class SecurityCode extends Dto {
    static FIELDS = {
        code: 'string',
        enabled: 'boolean',
        numberOnly: 'boolean',
    };

    /** @type {string | null} */ code = this.declared('code');
    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ numberOnly = this.declared('numberOnly');
}

/** The `ssl.key_file` block — what is stored for the private key, never the key itself. */
export class SslKeyFile extends Dto {
    static FIELDS = {
        fileName: 'string',
        uploaded: 'boolean',
    };

    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {boolean | null} */ uploaded = this.declared('uploaded');
}

/** The `ssl.certificate_file` block — {@link SslKeyFile}'s fields plus the certificate's subject and expiry. */
export class SslCertificateFile extends SslKeyFile {
    static FIELDS = {
        fileName: 'string',
        uploaded: 'boolean',
        expiresAt: 'string',
        subject: 'string',
    };

    /** @type {string | null} */ expiresAt = this.declared('expiresAt');
    /** @type {string | null} */ subject = this.declared('subject');
}

/** The `ssl` block; its read keys differ from the `*_base64` write-only keys `field_metadata` declares. */
export class Ssl extends Dto {
    static FIELDS = {
        certificateFile: SslCertificateFile,
        keyFile: SslKeyFile,
    };

    /** @type {SslCertificateFile | null} */ certificateFile = this.declared('certificateFile');
    /** @type {SslKeyFile | null} */ keyFile = this.declared('keyFile');
}

/** The `domain_settings` section; `aliases` is read-only here and managed by the aliases resource. */
export class DomainSettings extends Dto {
    static ENVELOPE_KEY = 'domain_settings';

    static FIELDS = {
        aliases: dtoList('string'),
        httpsEnabled: 'boolean',
        maintenance: Maintenance,
        securityCode: SecurityCode,
        ssl: Ssl,
        websiteAddress: 'string',
    };

    /** @type {Array<string | null> | null} */ aliases = this.declared('aliases');
    /** @type {boolean | null} */ httpsEnabled = this.declared('httpsEnabled');
    /** @type {Maintenance | null} */ maintenance = this.declared('maintenance');
    /** @type {SecurityCode | null} */ securityCode = this.declared('securityCode');
    /** @type {Ssl | null} */ ssl = this.declared('ssl');
    /** @type {string | null} */ websiteAddress = this.declared('websiteAddress');
}

/** One entry of `available` — a provider the store can send through; only OAuth ones carry `connect_url`. */
export class EmailProvider extends Dto {
    static FIELDS = {
        key: 'string',
        label: 'string',
        type: 'string',
        connectUrl: 'string',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ connectUrl = this.declared('connectUrl');
}

/** A `reply` block — whether replies go elsewhere than the sender address, and where. */
export class ReplyTo extends Dto {
    static FIELDS = {
        different: 'boolean',
        toEmail: 'string',
        toName: 'string',
    };

    /** @type {boolean | null} */ different = this.declared('different');
    /** @type {string | null} */ toEmail = this.declared('toEmail');
    /** @type {string | null} */ toName = this.declared('toName');
}

/** One entry of `default.domains` — a platform sending domain and this store's sender identity on it. */
export class DefaultDomain extends Dto {
    static FIELDS = {
        configure: 'boolean',
        domain: 'string',
        emailPrefix: 'string',
        reply: ReplyTo,
        senderName: 'string',
    };

    /** @type {boolean | null} */ configure = this.declared('configure');
    /** @type {string | null} */ domain = this.declared('domain');
    /** @type {string | null} */ emailPrefix = this.declared('emailPrefix');
    /** @type {ReplyTo | null} */ reply = this.declared('reply');
    /** @type {string | null} */ senderName = this.declared('senderName');
}

/** The `default` block — the platform's own sending domains. */
export class DefaultEmail extends Dto {
    static FIELDS = {
        domains: dtoList(DefaultDomain),
    };

    /** @type {Array<DefaultDomain | null> | null} */ domains = this.declared('domains');
}

/** The `gmail` and `office365` blocks — one read-only `connect_url` each. */
export class OauthProvider extends Dto {
    static FIELDS = {
        connectUrl: 'string',
    };

    /** @type {string | null} */ connectUrl = this.declared('connectUrl');
}

/** The `sendgrid` block; `api_key` reads back as `***`, so echoing a read would store the mask. */
export class SendGrid extends Dto {
    static FIELDS = {
        apiKey: 'string',
        reply: ReplyTo,
        senderEmail: 'string',
        senderName: 'string',
    };

    /** @type {string | null} */ apiKey = this.declared('apiKey');
    /** @type {ReplyTo | null} */ reply = this.declared('reply');
    /** @type {string | null} */ senderEmail = this.declared('senderEmail');
    /** @type {string | null} */ senderName = this.declared('senderName');
}

/** The `smtp.authentication` block; `password` reads back as `***`. */
export class SmtpAuthentication extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        password: 'string',
        username: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ password = this.declared('password');
    /** @type {string | null} */ username = this.declared('username');
}

/** The `smtp` block — the server the store sends through and who it sends as. */
export class Smtp extends Dto {
    static FIELDS = {
        authentication: SmtpAuthentication,
        encryption: 'string',
        host: 'string',
        port: 'int',
        senderEmail: 'string',
        senderName: 'string',
    };

    /** @type {SmtpAuthentication | null} */ authentication = this.declared('authentication');
    /** @type {string | null} */ encryption = this.declared('encryption');
    /** @type {string | null} */ host = this.declared('host');
    /** @type {number | null} */ port = this.declared('port');
    /** @type {string | null} */ senderEmail = this.declared('senderEmail');
    /** @type {string | null} */ senderName = this.declared('senderName');
}

/** The `email_settings` section; `office365` keeps the wire spelling, which a derived name would split. */
export class EmailSettings extends Dto {
    static ENVELOPE_KEY = 'email_settings';

    static FIELDS = {
        available: dtoList(EmailProvider),
        default: DefaultEmail,
        gmail: OauthProvider,
        office365: OauthProvider,
        sendgrid: SendGrid,
        serviceProvider: 'string',
        smtp: Smtp,
    };

    /** @type {Array<EmailProvider | null> | null} */ available = this.declared('available');
    /** @type {DefaultEmail | null} */ default = this.declared('default');
    /** @type {OauthProvider | null} */ gmail = this.declared('gmail');
    /** @type {OauthProvider | null} */ office365 = this.declared('office365');
    /** @type {SendGrid | null} */ sendgrid = this.declared('sendgrid');
    /** @type {string | null} */ serviceProvider = this.declared('serviceProvider');
    /** @type {Smtp | null} */ smtp = this.declared('smtp');
}

/** The `image` record of either media section — what the store holds and where it serves it. */
export class MediaImage extends Dto {
    static FIELDS = {
        contentType: 'string',
        fileName: 'string',
        height: 'int',
        sizeBytes: 'int',
        url: 'string',
        width: 'int',
    };

    /** @type {string | null} */ contentType = this.declared('contentType');
    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {number | null} */ height = this.declared('height');
    /** @type {number | null} */ sizeBytes = this.declared('sizeBytes');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {number | null} */ width = this.declared('width');
}

/** The `favicon` section, read-only here: its only writes, an upload and a removal, cannot be undone. */
export class Favicon extends Dto {
    static ENVELOPE_KEY = 'favicon';

    static FIELDS = {
        enabled: 'boolean',
        image: MediaImage,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {MediaImage | null} */ image = this.declared('image');
}

/** The `store_logo.variants` block: the logos for dark backgrounds and the sticky header. */
export class StoreLogoVariants extends Dto {
    // Both read null while the main logo is used; a set variant's shape has not been measured.
    static FIELDS = {
        darkBackground: 'any',
        stickyHeader: 'any',
    };

    /** @type {unknown} */ darkBackground = this.declared('darkBackground');
    /** @type {unknown} */ stickyHeader = this.declared('stickyHeader');
}

/** The `store_logo` section, read-only here like {@link Favicon}. */
export class StoreLogo extends Dto {
    static ENVELOPE_KEY = 'store_logo';

    static FIELDS = {
        image: MediaImage,
        variants: StoreLogoVariants,
    };

    /** @type {MediaImage | null} */ image = this.declared('image');
    /** @type {StoreLogoVariants | null} */ variants = this.declared('variants');
}

/** The `store_details.address` block. */
export class StoreAddress extends Dto {
    static FIELDS = {
        addressLine1: 'string',
        addressLine2: 'string',
        city: 'string',
        country: Region,
        postCode: 'string',
        state: Region,
    };

    /** @type {string | null} */ addressLine1 = this.declared('addressLine1');
    /** @type {string | null} */ addressLine2 = this.declared('addressLine2');
    /** @type {string | null} */ city = this.declared('city');
    /** @type {Region | null} */ country = this.declared('country');
    /** @type {string | null} */ postCode = this.declared('postCode');
    /** @type {Region | null} */ state = this.declared('state');
}

/** The `store_details.contact` block — the three numbers the store publishes. */
export class StoreContact extends Dto {
    static FIELDS = {
        fax: 'string',
        mobile: 'string',
        phone: 'string',
    };

    /** @type {string | null} */ fax = this.declared('fax');
    /** @type {string | null} */ mobile = this.declared('mobile');
    /** @type {string | null} */ phone = this.declared('phone');
}

/** The `store_details` section — every field writable; `company_name` and `email` are required. */
export class StoreDetails extends Dto {
    static ENVELOPE_KEY = 'store_details';

    static FIELDS = {
        abn: 'string',
        address: StoreAddress,
        companyName: 'string',
        contact: StoreContact,
        email: 'string',
    };

    /** @type {string | null} */ abn = this.declared('abn');
    /** @type {StoreAddress | null} */ address = this.declared('address');
    /** @type {string | null} */ companyName = this.declared('companyName');
    /** @type {StoreContact | null} */ contact = this.declared('contact');
    /** @type {string | null} */ email = this.declared('email');
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
        administration: SectionMeta,
        brandKit: SectionMeta,
        dateTime: SectionMeta,
        domainSettings: SectionMeta,
        emailSettings: SectionMeta,
        favicon: SectionMeta,
        storeDetails: SectionMeta,
        storeLogo: SectionMeta,
    };

    /** @type {SectionMeta | null} */ administration = this.declared('administration');
    /** @type {SectionMeta | null} */ brandKit = this.declared('brandKit');
    /** @type {SectionMeta | null} */ dateTime = this.declared('dateTime');
    /** @type {SectionMeta | null} */ domainSettings = this.declared('domainSettings');
    /** @type {SectionMeta | null} */ emailSettings = this.declared('emailSettings');
    /** @type {SectionMeta | null} */ favicon = this.declared('favicon');
    /** @type {SectionMeta | null} */ storeDetails = this.declared('storeDetails');
    /** @type {SectionMeta | null} */ storeLogo = this.declared('storeLogo');
}

/** The site settings in either form the API sends. */
export class SiteSettings extends Dto {
    static ENVELOPE_KEY = 'site_settings';

    static FIELDS = {
        administration: Administration,
        brandKit: BrandKit,
        dateTime: DateTime,
        domainSettings: DomainSettings,
        emailSettings: EmailSettings,
        favicon: Favicon,
        storeDetails: StoreDetails,
        storeLogo: StoreLogo,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {Administration | null} */ administration = this.declared('administration');
    /** @type {BrandKit | null} */ brandKit = this.declared('brandKit');
    /** @type {DateTime | null} */ dateTime = this.declared('dateTime');
    /** @type {DomainSettings | null} */ domainSettings = this.declared('domainSettings');
    /** @type {EmailSettings | null} */ emailSettings = this.declared('emailSettings');
    /** @type {Favicon | null} */ favicon = this.declared('favicon');
    /** @type {StoreDetails | null} */ storeDetails = this.declared('storeDetails');
    /** @type {StoreLogo | null} */ storeLogo = this.declared('storeLogo');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    Region,
    AutoSuggestAddresses,
    AutoSuggest,
    Captcha,
    Administration,
    BrandColors,
    BrandKit,
    DateTimeFormat,
    AdminDateTime,
    SeparableDateTime,
    DateTime,
    Maintenance,
    SecurityCode,
    SslKeyFile,
    SslCertificateFile,
    Ssl,
    DomainSettings,
    EmailProvider,
    ReplyTo,
    DefaultDomain,
    DefaultEmail,
    OauthProvider,
    SendGrid,
    SmtpAuthentication,
    Smtp,
    EmailSettings,
    MediaImage,
    Favicon,
    StoreLogoVariants,
    StoreLogo,
    StoreAddress,
    StoreContact,
    StoreDetails,
    SectionMeta,
    GroupMeta,
    SiteSettings,
);
