import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** One entry of an address section's `fields` — a form field and how it is drawn. */
export class AddressField extends Dto {
    static FIELDS = {
        key: 'string',
        label: 'string',
        active: 'boolean',
        required: 'boolean',
        order: 'int',
        group: 'string',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {boolean | null} */ required = this.declared('required');
    /** @type {number | null} */ order = this.declared('order');
    /** @type {string | null} */ group = this.declared('group');
}

/** An address section's record: the facade sends `active_fields`, the section endpoint every catalog field. */
export class AddressForm extends Dto {
    static FIELDS = {
        activeFields: dtoList('string'),
        fields: dtoList(AddressField),
    };

    /** @type {Array<string | null> | null} */ activeFields = this.declared('activeFields');
    /** @type {Array<AddressField | null> | null} */ fields = this.declared('fields');
}

/** The `billing_address` section, read-only. */
export class BillingAddress extends AddressForm {
    static ENVELOPE_KEY = 'billing_address';
}

/** The `shipping_address` section, read-only. */
export class ShippingAddress extends AddressForm {
    static ENVELOPE_KEY = 'shipping_address';
}

/** The `allow_sign_up` block — whether checkout may create an account, and whether it must. */
export class SignUp extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        required: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ required = this.declared('required');
}

/** The `checkout_as_guest` block — guest orders, and the one-click sign-up offered to a guest. */
export class GuestCheckout extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        quickSignup: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ quickSignup = this.declared('quickSignup');
}

/** The `customer_checkout` section — who may check out and how; turning all three routes off is `400`. */
export class CustomerCheckout extends Dto {
    static ENVELOPE_KEY = 'customer_checkout';

    static FIELDS = {
        allowSignIn: 'boolean',
        allowSignUp: SignUp,
        checkoutAsGuest: GuestCheckout,
        newsletterSubscription: 'boolean',
        multipleShippingMethods: 'boolean',
    };

    /** @type {boolean | null} */ allowSignIn = this.declared('allowSignIn');
    /** @type {SignUp | null} */ allowSignUp = this.declared('allowSignUp');
    /** @type {GuestCheckout | null} */ checkoutAsGuest = this.declared('checkoutAsGuest');
    /** @type {boolean | null} */ newsletterSubscription = this.declared('newsletterSubscription');
    /** @type {boolean | null} */ multipleShippingMethods = this.declared('multipleShippingMethods');
}

/** The `delivery_options` section — which delivery choices checkout offers; turning all four off is `400`. */
export class DeliveryOptions extends Dto {
    static ENVELOPE_KEY = 'delivery_options';

    static FIELDS = {
        enableShipping: 'boolean',
        enableStorePickup: 'boolean',
        enableShippingQuote: 'boolean',
        enableDeliveryService: 'boolean',
    };

    /** @type {boolean | null} */ enableShipping = this.declared('enableShipping');
    /** @type {boolean | null} */ enableStorePickup = this.declared('enableStorePickup');
    /** @type {boolean | null} */ enableShippingQuote = this.declared('enableShippingQuote');
    /** @type {boolean | null} */ enableDeliveryService = this.declared('enableDeliveryService');
}

/** The `order_summary` section — what the checkout's summary panel shows. */
export class OrderSummary extends Dto {
    static ENVELOPE_KEY = 'order_summary';

    static FIELDS = {
        showProductThumbnail: 'boolean',
        showQuantity: 'boolean',
        enablePaymentExpandView: 'boolean',
        orderConfirmCaptcha: 'boolean',
    };

    /** @type {boolean | null} */ showProductThumbnail = this.declared('showProductThumbnail');
    /** @type {boolean | null} */ showQuantity = this.declared('showQuantity');
    /** @type {boolean | null} */ enablePaymentExpandView = this.declared('enablePaymentExpandView');
    /** @type {boolean | null} */ orderConfirmCaptcha = this.declared('orderConfirmCaptcha');
}

/** The `comment` block — whether an order may carry a comment and whether staff are notified. */
export class OrderComment extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        sendNotification: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ sendNotification = this.declared('sendNotification');
}

/** The `terms_and_condition.ref` block; `page` is `'any'`, as the store types it a string but sends a record. */
export class TermsReference extends Dto {
    static FIELDS = {
        page: 'any',
        link: 'string',
        text: 'string',
    };

    /** @type {unknown} */ page = this.declared('page');
    /** @type {string | null} */ link = this.declared('link');
    /** @type {string | null} */ text = this.declared('text');
}

/** The `terms_and_condition` block — whether terms must be accepted, the wording and where the terms live. */
export class TermsAndCondition extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        text: 'string',
        linkLabel: 'string',
        type: 'string',
        ref: TermsReference,
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ text = this.declared('text');
    /** @type {string | null} */ linkLabel = this.declared('linkLabel');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {TermsReference | null} */ ref = this.declared('ref');
}

/** The `others` section — the checkout page's logo, login link, HTML and two blocks. */
export class Others extends Dto {
    static ENVELOPE_KEY = 'others';

    static FIELDS = {
        showLogo: 'boolean',
        loginUrl: 'string',
        customHtml: 'string',
        comment: OrderComment,
        termsAndCondition: TermsAndCondition,
    };

    /** @type {boolean | null} */ showLogo = this.declared('showLogo');
    /** @type {string | null} */ loginUrl = this.declared('loginUrl');
    /** @type {string | null} */ customHtml = this.declared('customHtml');
    /** @type {OrderComment | null} */ comment = this.declared('comment');
    /** @type {TermsAndCondition | null} */ termsAndCondition = this.declared('termsAndCondition');
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
        billingAddress: SectionMeta,
        shippingAddress: SectionMeta,
        customerCheckout: SectionMeta,
        deliveryOptions: SectionMeta,
        orderSummary: SectionMeta,
        others: SectionMeta,
    };

    /** @type {SectionMeta | null} */ billingAddress = this.declared('billingAddress');
    /** @type {SectionMeta | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {SectionMeta | null} */ customerCheckout = this.declared('customerCheckout');
    /** @type {SectionMeta | null} */ deliveryOptions = this.declared('deliveryOptions');
    /** @type {SectionMeta | null} */ orderSummary = this.declared('orderSummary');
    /** @type {SectionMeta | null} */ others = this.declared('others');
}

/** The checkout page settings, as the facade or one section sends them. */
export class CheckoutPage extends Dto {
    static ENVELOPE_KEY = 'checkout_page';

    static FIELDS = {
        billingAddress: BillingAddress,
        shippingAddress: ShippingAddress,
        customerCheckout: CustomerCheckout,
        deliveryOptions: DeliveryOptions,
        orderSummary: OrderSummary,
        others: Others,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {BillingAddress | null} */ billingAddress = this.declared('billingAddress');
    /** @type {ShippingAddress | null} */ shippingAddress = this.declared('shippingAddress');
    /** @type {CustomerCheckout | null} */ customerCheckout = this.declared('customerCheckout');
    /** @type {DeliveryOptions | null} */ deliveryOptions = this.declared('deliveryOptions');
    /** @type {OrderSummary | null} */ orderSummary = this.declared('orderSummary');
    /** @type {Others | null} */ others = this.declared('others');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    AddressField,
    AddressForm,
    BillingAddress,
    ShippingAddress,
    SignUp,
    GuestCheckout,
    CustomerCheckout,
    DeliveryOptions,
    OrderSummary,
    OrderComment,
    TermsReference,
    TermsAndCondition,
    Others,
    SectionMeta,
    GroupMeta,
    CheckoutPage,
);
