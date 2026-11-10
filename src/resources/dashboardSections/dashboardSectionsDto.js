import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The period a section covers and the one before it, as dates; `timeZone` is the store's and `currency` the code money figures are in. */
export class SectionPeriod extends Dto {
    static FIELDS = {
        duration: 'string',
        startDate: 'string',
        endDate: 'string',
        previousStartDate: 'string',
        previousEndDate: 'string',
        timeZone: 'string',
        currency: 'string',
    };

    /** @type {string | null} */ duration = this.declared('duration');
    /** @type {string | null} */ startDate = this.declared('startDate');
    /** @type {string | null} */ endDate = this.declared('endDate');
    /** @type {string | null} */ previousStartDate = this.declared('previousStartDate');
    /** @type {string | null} */ previousEndDate = this.declared('previousEndDate');
    /** @type {string | null} */ timeZone = this.declared('timeZone');
    /** @type {string | null} */ currency = this.declared('currency');
}

/** A product, page or post by id and name. */
export class SectionEntity extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** What needs attention now; `pendingFulfillment` is the orders waiting to ship. */
export class SectionOrderUpdates extends Dto {
    static FIELDS = {
        lowStockItems: 'int',
        pendingFulfillment: 'int',
        paymentsToCapture: 'int',
    };

    /** @type {number | null} */ lowStockItems = this.declared('lowStockItems');
    /** @type {number | null} */ pendingFulfillment = this.declared('pendingFulfillment');
    /** @type {number | null} */ paymentsToCapture = this.declared('paymentsToCapture');
}

/** A product and the units sold, highest first. */
export class SectionBestSeller extends Dto {
    static FIELDS = {
        product: SectionEntity,
        unitsSold: 'int',
    };

    /** @type {SectionEntity | null} */ product = this.declared('product');
    /** @type {number | null} */ unitsSold = this.declared('unitsSold');
}

/** One content item to review; `count` is an empty string on the rows measured. */
export class SectionContentUpdate extends Dto {
    static FIELDS = {
        key: 'string',
        label: 'string',
        count: 'string',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ count = this.declared('count');
}

/** A page and its views. */
export class SectionTopPage extends Dto {
    static FIELDS = {
        page: SectionEntity,
        views: 'int',
    };

    /** @type {SectionEntity | null} */ page = this.declared('page');
    /** @type {number | null} */ views = this.declared('views');
}

/** The bookings that need attention: how many, and the latest of them. `latest` is empty on the store measured, so the row's shape is not known. */
export class SectionNeedsAttention extends Dto {
    static FIELDS = {
        count: 'int',
        latest: dtoList('any'),
    };

    /** @type {number | null} */ count = this.declared('count');
    /** @type {Array<any> | null} */ latest = this.declared('latest');
}

/** A blog draft waiting to be published. */
export class SectionDraft extends Dto {
    static FIELDS = {
        post: SectionEntity,
        updatedAt: 'string',
    };

    /** @type {SectionEntity | null} */ post = this.declared('post');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The blog drafts to publish: how many, and the latest. */
export class SectionDrafts extends Dto {
    static FIELDS = {
        count: 'int',
        latest: dtoList(SectionDraft),
    };

    /** @type {number | null} */ count = this.declared('count');
    /** @type {Array<SectionDraft | null> | null} */ latest = this.declared('latest');
}

/** A blog post and its views. */
export class SectionViewedPost extends Dto {
    static FIELDS = {
        post: SectionEntity,
        views: 'int',
    };

    /** @type {SectionEntity | null} */ post = this.declared('post');
    /** @type {number | null} */ views = this.declared('views');
}

/** One tab of the Dashboard. `section` echoes the path value, and only the fields of that tab are present. `ecommerce`: `orderUpdates`, `bestSellingProducts`. `content`: `contentUpdates`, `topPages`. `bookings`: `needsAttention`, `upcoming`. `courses`: `newEnrolments`, `unpaidOrders`, `popularCourses`. `blog`: `commentsToModerate`, `draftsToPublish`, `mostViewedPosts`. `upcoming` and `popularCourses` are empty on the store measured, so the row's shape is not known. */
export class DashboardSectionReport extends Dto {
    static FIELDS = {
        section: 'string',
        period: SectionPeriod,
        orderUpdates: SectionOrderUpdates,
        bestSellingProducts: dtoList(SectionBestSeller),
        contentUpdates: dtoList(SectionContentUpdate),
        topPages: dtoList(SectionTopPage),
        needsAttention: SectionNeedsAttention,
        upcoming: dtoList('any'),
        newEnrolments: 'int',
        unpaidOrders: 'int',
        popularCourses: dtoList('any'),
        commentsToModerate: 'int',
        draftsToPublish: SectionDrafts,
        mostViewedPosts: dtoList(SectionViewedPost),
    };

    /** @type {string | null} */ section = this.declared('section');
    /** @type {SectionPeriod | null} */ period = this.declared('period');
    /** @type {SectionOrderUpdates | null} */ orderUpdates = this.declared('orderUpdates');
    /** @type {Array<SectionBestSeller | null> | null} */ bestSellingProducts = this.declared('bestSellingProducts');
    /** @type {Array<SectionContentUpdate | null> | null} */ contentUpdates = this.declared('contentUpdates');
    /** @type {Array<SectionTopPage | null> | null} */ topPages = this.declared('topPages');
    /** @type {SectionNeedsAttention | null} */ needsAttention = this.declared('needsAttention');
    /** @type {Array<any> | null} */ upcoming = this.declared('upcoming');
    /** @type {number | null} */ newEnrolments = this.declared('newEnrolments');
    /** @type {number | null} */ unpaidOrders = this.declared('unpaidOrders');
    /** @type {Array<any> | null} */ popularCourses = this.declared('popularCourses');
    /** @type {number | null} */ commentsToModerate = this.declared('commentsToModerate');
    /** @type {SectionDrafts | null} */ draftsToPublish = this.declared('draftsToPublish');
    /** @type {Array<SectionViewedPost | null> | null} */ mostViewedPosts = this.declared('mostViewedPosts');
}

sealDtoSchema(
    SectionPeriod,
    SectionEntity,
    SectionOrderUpdates,
    SectionBestSeller,
    SectionContentUpdate,
    SectionTopPage,
    SectionNeedsAttention,
    SectionDraft,
    SectionDrafts,
    SectionViewedPost,
    DashboardSectionReport,
);
