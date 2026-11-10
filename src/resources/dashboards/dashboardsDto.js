import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** One part of the `seo` section. Read back, the title and `canHide` come with it; a write needs only `key` and `visible`. The `kpis` part cannot be hidden. */
export class DashboardPart extends Dto {
    static FIELDS = {
        key: 'string',
        title: 'string',
        visible: 'boolean',
        canHide: 'boolean',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {boolean | null} */ visible = this.declared('visible');
    /** @type {boolean | null} */ canHide = this.declared('canHide');
}

/** One tab of the `section_tabs` section: `ecommerce`, `content`, `bookings`, `courses` or `blog`. A write needs `key` and sets `visible` or `position`, counted from 1 among the tabs. */
export class DashboardTab extends Dto {
    static FIELDS = {
        key: 'string',
        title: 'string',
        description: 'string',
        visible: 'boolean',
        canHide: 'boolean',
        position: 'int',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ visible = this.declared('visible');
    /** @type {boolean | null} */ canHide = this.declared('canHide');
    /** @type {number | null} */ position = this.declared('position');
}

/** A section of a layout. The standard ones are `announcement`, `performance`, `activity` and `contact`; they only show or hide, and `contact` cannot hide. The customisable ones are `setup_guide`, `section_tabs` (with `tabs`) and `seo` (with `parts`); they also take a `position`. Read back, the title, description and `canHide` come with it; a write needs only `key` and what changes. */
export class DashboardSection extends Dto {
    static FIELDS = {
        key: 'string',
        title: 'string',
        description: 'string',
        visible: 'boolean',
        canHide: 'boolean',
        position: 'int',
        tabs: dtoList(DashboardTab),
        parts: dtoList(DashboardPart),
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ visible = this.declared('visible');
    /** @type {boolean | null} */ canHide = this.declared('canHide');
    /** @type {number | null} */ position = this.declared('position');
    /** @type {Array<DashboardTab | null> | null} */ tabs = this.declared('tabs');
    /** @type {Array<DashboardPart | null> | null} */ parts = this.declared('parts');
}

/** One KPI tile of a layout, in tile order. `key` is a `kpi_options` metric key. */
export class DashboardKpi extends Dto {
    static FIELDS = {
        position: 'int',
        key: 'string',
        label: 'string',
        group: 'string',
    };

    /** @type {number | null} */ position = this.declared('position');
    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ group = this.declared('group');
}

/** One layout. `id` is the `dashboardId` of the other calls, a UUID. Exactly one layout is the default. */
export class Dashboard extends Dto {
    static FIELDS = {
        id: 'string',
        name: 'string',
        default: 'boolean',
        standardSections: dtoList(DashboardSection),
        customisableSections: dtoList(DashboardSection),
        kpis: dtoList(DashboardKpi),
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {string | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {Array<DashboardSection | null> | null} */ standardSections = this.declared('standardSections');
    /** @type {Array<DashboardSection | null> | null} */ customisableSections = this.declared('customisableSections');
    /** @type {Array<DashboardKpi | null> | null} */ kpis = this.declared('kpis');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** A layout as the listing shows it, without its sections and tiles. */
export class DashboardSummary extends Dto {
    static FIELDS = {
        id: 'string',
        name: 'string',
        default: 'boolean',
        createdAt: 'string',
        updatedAt: 'string',
    };

    /** @type {string | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ createdAt = this.declared('createdAt');
    /** @type {string | null} */ updatedAt = this.declared('updatedAt');
}

/** The listing: every layout of the admin, with no paging. */
export class DashboardListing extends Dto {
    static FIELDS = {
        dashboards: dtoList(DashboardSummary),
    };

    /** @type {Array<DashboardSummary | null> | null} */ dashboards = this.declared('dashboards');
}

/** The write body, bare. A create needs `name`, unique among the admin's layouts (`409`); it starts as a copy of the `copyFrom` layout, the default one when that is left out. A patch sends only what changes; the sections named are merged into the layout, the rest is kept. `kpis` is the full list of 2 to 5 metric keys in tile order. A standard section takes no `position` (`400`). `default` `true` makes this layout the store's default layout; `false` on the default layout is `409`, as the default moves only by making another layout the default. */
export class DashboardInput extends Dto {
    static FIELDS = {
        name: 'string',
        default: 'boolean',
        copyFrom: 'string',
        standardSections: dtoList(DashboardSection),
        customisableSections: dtoList(DashboardSection),
        kpis: dtoList('string'),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ default = this.declared('default');
    /** @type {string | null} */ copyFrom = this.declared('copyFrom');
    /** @type {Array<DashboardSection | null> | null} */ standardSections = this.declared('standardSections');
    /** @type {Array<DashboardSection | null> | null} */ customisableSections = this.declared('customisableSections');
    /** @type {Array<string | null> | null} */ kpis = this.declared('kpis');
}

sealDtoSchema(
    DashboardPart,
    DashboardTab,
    DashboardSection,
    DashboardKpi,
    Dashboard,
    DashboardSummary,
    DashboardListing,
    DashboardInput,
);
