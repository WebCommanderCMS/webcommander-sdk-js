import {Dto, dtoList, dtoOneOf, sealDtoSchema} from '../../dto.js';

/** An `{id, name}` pair: the gateway's `zone`, and each audience member it names. */
export class PaymentGatewayReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** Who sees the gateway at checkout; the lists fill only under `type` `selected`. */
export class PaymentGatewayVisibility extends Dto {
    static FIELDS = {
        type: 'string',
        customers: dtoList(PaymentGatewayReference),
        customerGroups: dtoList(PaymentGatewayReference),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {Array<PaymentGatewayReference | null> | null} */ customers = this.declared('customers');
    /** @type {Array<PaymentGatewayReference | null> | null} */ customerGroups = this.declared('customerGroups');
}

/** The delivery types the gateway is offered for; `null` on gateways without the choice. */
export class PaymentGatewayAllowedFor extends Dto {
    static FIELDS = {
        shipping: 'boolean',
        delivery: 'boolean',
        storePickup: 'boolean',
    };

    /** @type {boolean | null} */ shipping = this.declared('shipping');
    /** @type {boolean | null} */ delivery = this.declared('delivery');
    /** @type {boolean | null} */ storePickup = this.declared('storePickup');
}

/**
 * The surcharge block, `null` on gateways without one, and its write; `percentAmount` reads `null` when no
 * percentage is set.
 */
export class PaymentGatewaySurcharge extends Dto {
    static FIELDS = {
        type: 'string',
        flatAmount: 'float',
        percentAmount: 'float',
        // Each range stays a mapping (`id`, `from`, `to`, `amount`).
        ranges: dtoList('any'),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {number | null} */ flatAmount = this.declared('flatAmount');
    /** @type {number | null} */ percentAmount = this.declared('percentAmount');
    /** @type {Array<any> | null} */ ranges = this.declared('ranges');
}

/** The pending and completed messages; a message the gateway's form lacks reads `null`. */
export class PaymentGatewayMessages extends Dto {
    static FIELDS = {
        pending: 'string',
        completed: 'string',
    };

    /** @type {string | null} */ pending = this.declared('pending');
    /** @type {string | null} */ completed = this.declared('completed');
}

/** PayPal's `standard` credentials. */
export class PaymentGatewayPayPalStandard extends Dto {
    static FIELDS = {
        clientId: 'string',
        clientSecret: 'string',
    };

    /** @type {string | null} */ clientId = this.declared('clientId');
    /** @type {string | null} */ clientSecret = this.declared('clientSecret');
}

/** PayPal's `classic` account. */
export class PaymentGatewayPayPalClassic extends Dto {
    static FIELDS = {
        emailAddress: 'string',
    };

    /** @type {string | null} */ emailAddress = this.declared('emailAddress');
}

/** A one-key `{"enabled": ...}` switch. */
export class PaymentGatewayToggle extends Dto {
    static FIELDS = {
        enabled: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
}

/** The card gateway's processor; the client id and secret read `********` when set. */
export class PaymentGatewayCardProcessor extends Dto {
    static FIELDS = {
        type: 'string',
        mode: 'string',
        merchantCode: 'string',
        clientId: 'string',
        clientSecret: 'string',
        walletPayment: PaymentGatewayToggle,
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ mode = this.declared('mode');
    /** @type {string | null} */ merchantCode = this.declared('merchantCode');
    /** @type {string | null} */ clientId = this.declared('clientId');
    /** @type {string | null} */ clientSecret = this.declared('clientSecret');
    /** @type {PaymentGatewayToggle | null} */ walletPayment = this.declared('walletPayment');
}

/** The card logos shown at checkout. */
export class PaymentGatewayCardLogo extends Dto {
    static FIELDS = {
        type: 'string',
        cards: dtoList('string'),
        customImage: 'any',
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {Array<string | null> | null} */ cards = this.declared('cards');
    /** @type {any} */ customImage = this.declared('customImage');
}

/** Express Checkout's Google Pay block. */
export class PaymentGatewayGooglePay extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        paymentMode: 'string',
        merchantName: 'string',
        merchantId: 'string',
        processor: 'string',
        secretKey: 'string',
        publicKey: 'string',
        freeShippingConditionAmount: 'float',
        shippingCost: 'float',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ paymentMode = this.declared('paymentMode');
    /** @type {string | null} */ merchantName = this.declared('merchantName');
    /** @type {string | null} */ merchantId = this.declared('merchantId');
    /** @type {string | null} */ processor = this.declared('processor');
    /** @type {string | null} */ secretKey = this.declared('secretKey');
    /** @type {string | null} */ publicKey = this.declared('publicKey');
    /** @type {number | null} */ freeShippingConditionAmount = this.declared('freeShippingConditionAmount');
    /** @type {number | null} */ shippingCost = this.declared('shippingCost');
}

/** Express Checkout's Apple Pay block. */
export class PaymentGatewayApplePay extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        paymentMode: 'string',
        merchantIdentifier: 'string',
        domainName: 'string',
        displayName: 'string',
        processor: 'string',
        secretKey: 'string',
        publicKey: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ paymentMode = this.declared('paymentMode');
    /** @type {string | null} */ merchantIdentifier = this.declared('merchantIdentifier');
    /** @type {string | null} */ domainName = this.declared('domainName');
    /** @type {string | null} */ displayName = this.declared('displayName');
    /** @type {string | null} */ processor = this.declared('processor');
    /** @type {string | null} */ secretKey = this.declared('secretKey');
    /** @type {string | null} */ publicKey = this.declared('publicKey');
}

/** Express Checkout's PayPal block. */
export class PaymentGatewayExpressPayPal extends Dto {
    static FIELDS = {
        showInstallmentAmount: 'boolean',
    };

    /** @type {boolean | null} */ showInstallmentAmount = this.declared('showInstallmentAmount');
}

/**
 * The row read's gateway-specific `settings`, every key any gateway answers; each gateway fills its own few and
 * offline gateways answer `{}`.
 */
export class PaymentGatewaySettings extends Dto {
    static FIELDS = {
        version: 'string',
        mode: 'string',
        standard: PaymentGatewayPayPalStandard,
        classic: PaymentGatewayPayPalClassic,
        processor: PaymentGatewayCardProcessor,
        cardLogo: PaymentGatewayCardLogo,
        googlePay: PaymentGatewayGooglePay,
        applePay: PaymentGatewayApplePay,
        paypal: PaymentGatewayExpressPayPal,
        showInstallmentAmount: 'boolean',
        showInProductDetails: 'boolean',
        apiKey: 'string',
        defaultTerm: 'int',
        amountPer100Points: 'float',
        merchantId: 'string',
        merchantSecretKey: 'string',
        image: 'any',
    };

    /** @type {string | null} */ version = this.declared('version');
    /** @type {string | null} */ mode = this.declared('mode');
    /** @type {PaymentGatewayPayPalStandard | null} */ standard = this.declared('standard');
    /** @type {PaymentGatewayPayPalClassic | null} */ classic = this.declared('classic');
    /** @type {PaymentGatewayCardProcessor | null} */ processor = this.declared('processor');
    /** @type {PaymentGatewayCardLogo | null} */ cardLogo = this.declared('cardLogo');
    /** @type {PaymentGatewayGooglePay | null} */ googlePay = this.declared('googlePay');
    /** @type {PaymentGatewayApplePay | null} */ applePay = this.declared('applePay');
    /** @type {PaymentGatewayExpressPayPal | null} */ paypal = this.declared('paypal');
    /** @type {boolean | null} */ showInstallmentAmount = this.declared('showInstallmentAmount');
    /** @type {boolean | null} */ showInProductDetails = this.declared('showInProductDetails');
    /** @type {string | null} */ apiKey = this.declared('apiKey');
    /** @type {number | null} */ defaultTerm = this.declared('defaultTerm');
    /** @type {number | null} */ amountPer100Points = this.declared('amountPer100Points');
    /** @type {string | null} */ merchantId = this.declared('merchantId');
    /** @type {string | null} */ merchantSecretKey = this.declared('merchantSecretKey');
    /** @type {any} */ image = this.declared('image');
}

/** One gateway: a listing row, and the row path's and every write's body, which add `settings`. */
export class PaymentGateway extends Dto {
    static ENVELOPE_KEY = 'payment_gateway';

    static FIELDS = {
        id: 'int',
        code: 'string',
        name: 'string',
        added: 'boolean',
        enabled: 'boolean',
        default: 'boolean',
        promotional: 'boolean',
        zone: PaymentGatewayReference,
        information: 'string',
        visibility: PaymentGatewayVisibility,
        allowedFor: PaymentGatewayAllowedFor,
        surcharge: PaymentGatewaySurcharge,
        messages: PaymentGatewayMessages,
        settings: PaymentGatewaySettings,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ added = this.declared('added');
    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {boolean | null} */ promotional = this.declared('promotional');
    /** @type {PaymentGatewayReference | null} */ zone = this.declared('zone');
    /** @type {string | null} */ information = this.declared('information');
    /** @type {PaymentGatewayVisibility | null} */ visibility = this.declared('visibility');
    /** @type {PaymentGatewayAllowedFor | null} */ allowedFor = this.declared('allowedFor');
    /** @type {PaymentGatewaySurcharge | null} */ surcharge = this.declared('surcharge');
    /** @type {PaymentGatewayMessages | null} */ messages = this.declared('messages');
    /** @type {PaymentGatewaySettings | null} */ settings = this.declared('settings');
}

/** The visibility a write takes: customers and customer groups by id. */
export class PaymentGatewayVisibilityInput extends Dto {
    static FIELDS = {
        type: 'string',
        customers: dtoList('int'),
        customerGroups: dtoList('int'),
    };

    /** @type {string | null} */ type = this.declared('type');
    /** @type {Array<number | null> | null} */ customers = this.declared('customers');
    /** @type {Array<number | null> | null} */ customerGroups = this.declared('customerGroups');
}

/**
 * The writable fields, for the `PUT` and the `PATCH`, sent bare. `zone` takes a zone's id or `{"id": ...}`;
 * `code` and `promotional` are read-only.
 */
export class PaymentGatewayInput extends Dto {
    static FIELDS = {
        name: 'string',
        added: 'boolean',
        enabled: 'boolean',
        default: 'boolean',
        zone: dtoOneOf('int', PaymentGatewayReference),
        information: 'string',
        visibility: PaymentGatewayVisibilityInput,
        allowedFor: PaymentGatewayAllowedFor,
        surcharge: PaymentGatewaySurcharge,
        messages: PaymentGatewayMessages,
        settings: PaymentGatewaySettings,
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ added = this.declared('added');
    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {number | PaymentGatewayReference | null} */ zone = this.declared('zone');
    /** @type {string | null} */ information = this.declared('information');
    /** @type {PaymentGatewayVisibilityInput | null} */ visibility = this.declared('visibility');
    /** @type {PaymentGatewayAllowedFor | null} */ allowedFor = this.declared('allowedFor');
    /** @type {PaymentGatewaySurcharge | null} */ surcharge = this.declared('surcharge');
    /** @type {PaymentGatewayMessages | null} */ messages = this.declared('messages');
    /** @type {PaymentGatewaySettings | null} */ settings = this.declared('settings');
}

/**
 * The five-key `pagination` block; `limit` is the page size applied. `hasPrevious` is `true` past the first page
 * and `false` on a page past the end.
 */
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

/** One page of the listing: the rows, without `settings`, and where they sit. */
export class PaymentGatewayPage extends Dto {
    static FIELDS = {
        paymentGateways: dtoList(PaymentGateway),
        pagination: Pagination,
    };

    /** @type {Array<PaymentGateway | null> | null} */ paymentGateways = this.declared('paymentGateways');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

/** The count sub-path's body, a bare `{"total": N}`. */
export class PaymentGatewayCount extends Dto {
    static FIELDS = {
        total: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
}

sealDtoSchema(
    PaymentGatewayReference,
    PaymentGatewayVisibility,
    PaymentGatewayAllowedFor,
    PaymentGatewaySurcharge,
    PaymentGatewayMessages,
    PaymentGatewayPayPalStandard,
    PaymentGatewayPayPalClassic,
    PaymentGatewayToggle,
    PaymentGatewayCardProcessor,
    PaymentGatewayCardLogo,
    PaymentGatewayGooglePay,
    PaymentGatewayApplePay,
    PaymentGatewayExpressPayPal,
    PaymentGatewaySettings,
    PaymentGateway,
    PaymentGatewayVisibilityInput,
    PaymentGatewayInput,
    Pagination,
    PaymentGatewayPage,
    PaymentGatewayCount,
);
