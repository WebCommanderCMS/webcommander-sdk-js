import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One step of an `open_modal` banner's walkthrough. */
export class BannerStep extends Dto {
    static FIELDS = {
        title: 'string',
        description: 'string',
    };

    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ description = this.declared('description');
}

/** What the banner's learn-more button does. `action` is `open_link`, with an `https` `url`, or `open_modal`, with a `title`, a `subtitle` and at least one of `steps`. A patch replaces the whole block, so an `open_modal` block sent over an `open_link` one drops the `url`. */
export class BannerLearnMore extends Dto {
    static FIELDS = {
        action: 'string',
        label: 'string',
        url: 'string',
        title: 'string',
        subtitle: 'string',
        steps: dtoList(BannerStep),
    };

    /** @type {string | null} */ action = this.declared('action');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ subtitle = this.declared('subtitle');
    /** @type {Array<BannerStep | null> | null} */ steps = this.declared('steps');
}

/** The optional second button; both fields are needed. */
export class BannerTryIt extends Dto {
    static FIELDS = {
        label: 'string',
        url: 'string',
    };

    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ url = this.declared('url');
}

/** One banner. `key` is the `bannerKey` of the other calls. `position` counts from 1 over every banner, hidden ones included, and `active` false hides it from the Dashboard feed only. */
export class DashboardBanner extends Dto {
    static FIELDS = {
        key: 'string',
        position: 'int',
        active: 'boolean',
        icon: 'string',
        title: 'string',
        description: 'string',
        tags: dtoList('string'),
        learnMore: BannerLearnMore,
        tryIt: BannerTryIt,
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {number | null} */ position = this.declared('position');
    /** @type {boolean | null} */ active = this.declared('active');
    /** @type {string | null} */ icon = this.declared('icon');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {Array<string | null> | null} */ tags = this.declared('tags');
    /** @type {BannerLearnMore | null} */ learnMore = this.declared('learnMore');
    /** @type {BannerTryIt | null} */ tryIt = this.declared('tryIt');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The management list: every banner, active or not, in position order. */
export class DashboardBannerListing extends Dto {
    static FIELDS = {
        banners: dtoList(DashboardBanner),
    };

    /** @type {Array<DashboardBanner | null> | null} */ banners = this.declared('banners');
}

/** The write body, bare. A create needs `key` (`a-z`, `0-9` and `_`, starting with a letter, up to 64 characters, unique), `title` (1 to 80 characters), `description` (1 to 200) and `learnMore`; `tags` holds at most 3, `active` defaults to `true` and `position` to the end of the list. A patch sends only what changes and cannot send `key`. `icon` is stored as sent. `position` runs from 1 to one past the banner count, and the banners after it shift down. A `null` field is not sent: to remove the second button, pass a mapping holding `try_it: null`. */
export class DashboardBannerInput extends Dto {
    static FIELDS = {
        key: 'string',
        icon: 'string',
        title: 'string',
        description: 'string',
        tags: dtoList('string'),
        learnMore: BannerLearnMore,
        tryIt: BannerTryIt,
        position: 'int',
        active: 'boolean',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ icon = this.declared('icon');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {Array<string | null> | null} */ tags = this.declared('tags');
    /** @type {BannerLearnMore | null} */ learnMore = this.declared('learnMore');
    /** @type {BannerTryIt | null} */ tryIt = this.declared('tryIt');
    /** @type {number | null} */ position = this.declared('position');
    /** @type {boolean | null} */ active = this.declared('active');
}

/** The support card of the Dashboard. */
export class BannerContact extends Dto {
    static FIELDS = {
        email: 'string',
        phone: 'string',
        liveChat: 'string',
        helpCenterUrl: 'string',
    };

    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ phone = this.declared('phone');
    /** @type {string | null} */ liveChat = this.declared('liveChat');
    /** @type {string | null} */ helpCenterUrl = this.declared('helpCenterUrl');
}

/** The Dashboard's feed: only the active banners, in position order, the support card, whether the store is an online store and the label of the membership. */
export class DashboardContentInfo extends Dto {
    static FIELDS = {
        banners: dtoList(DashboardBanner),
        contact: BannerContact,
        onlineStore: 'boolean',
        memberLabel: 'string',
    };

    /** @type {Array<DashboardBanner | null> | null} */ banners = this.declared('banners');
    /** @type {BannerContact | null} */ contact = this.declared('contact');
    /** @type {boolean | null} */ onlineStore = this.declared('onlineStore');
    /** @type {string | null} */ memberLabel = this.declared('memberLabel');
}

sealDtoSchema(
    BannerStep,
    BannerLearnMore,
    BannerTryIt,
    DashboardBanner,
    DashboardBannerListing,
    DashboardBannerInput,
    BannerContact,
    DashboardContentInfo,
);
