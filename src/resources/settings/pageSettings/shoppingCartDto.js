import {Dto, sealDtoSchema} from '../../../dto.js';

/** The `cart_page` section — what the cart page offers a shopper. */
export class CartPage extends Dto {
    static ENVELOPE_KEY = 'cart_page';

    static FIELDS = {
        showProductThumbnail: 'boolean',
        enableClearCart: 'boolean',
        saveCart: 'boolean',
    };

    /** @type {boolean | null} */ showProductThumbnail = this.declared('showProductThumbnail');
    /** @type {boolean | null} */ enableClearCart = this.declared('enableClearCart');
    /** @type {boolean | null} */ saveCart = this.declared('saveCart');
}

/** The `flying_cart` section — the slide-out cart and what it offers. */
export class FlyingCart extends Dto {
    static ENVELOPE_KEY = 'flying_cart';

    static FIELDS = {
        enabled: 'boolean',
        enableClearCart: 'boolean',
        saveCart: 'boolean',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {boolean | null} */ enableClearCart = this.declared('enableClearCart');
    /** @type {boolean | null} */ saveCart = this.declared('saveCart');
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
        cartPage: SectionMeta,
        flyingCart: SectionMeta,
    };

    /** @type {SectionMeta | null} */ cartPage = this.declared('cartPage');
    /** @type {SectionMeta | null} */ flyingCart = this.declared('flyingCart');
}

/** The shopping cart settings, as the facade or one section sends them. */
export class ShoppingCart extends Dto {
    static ENVELOPE_KEY = 'shopping_cart';

    static FIELDS = {
        cartPage: CartPage,
        flyingCart: FlyingCart,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {CartPage | null} */ cartPage = this.declared('cartPage');
    /** @type {FlyingCart | null} */ flyingCart = this.declared('flyingCart');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(CartPage, FlyingCart, SectionMeta, GroupMeta, ShoppingCart);
