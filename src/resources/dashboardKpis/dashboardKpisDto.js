import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The default layout the KPI tiles belong to; `id` is its `dashboardId`. */
export class DashboardRef extends Dto {
    static FIELDS = {
        id: 'string',
        name: 'string',
    };

    /** @type {string | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The period a figure covers and the one before it, as dates; `timeZone` is the store's and `currency` the code money figures are in. */
export class KpiPeriod extends Dto {
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

/** One metric a tile can show. `key` is what a selection takes; `code` is the report's own name for it and differs for some, such as `aov` and `average_order_value`. */
export class KpiMetric extends Dto {
    static FIELDS = {
        key: 'string',
        code: 'string',
        label: 'string',
        format: 'string',
        inUse: 'boolean',
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ format = this.declared('format');
    /** @type {boolean | null} */ inUse = this.declared('inUse');
}

/** A group of metrics: `ecommerce`, `content`, `blog`, `bookings` or `courses`. */
export class KpiGroup extends Dto {
    static FIELDS = {
        key: 'string',
        label: 'string',
        metrics: dtoList(KpiMetric),
    };

    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {Array<KpiMetric | null> | null} */ metrics = this.declared('metrics');
}

/** Every metric a tile can show. `min` and `max` bound the number of tiles, and `selected` lists the keys in use, in tile order. */
export class KpiOptions extends Dto {
    static FIELDS = {
        dashboard: DashboardRef,
        min: 'int',
        max: 'int',
        selected: dtoList('string'),
        groups: dtoList(KpiGroup),
    };

    /** @type {DashboardRef | null} */ dashboard = this.declared('dashboard');
    /** @type {number | null} */ min = this.declared('min');
    /** @type {number | null} */ max = this.declared('max');
    /** @type {Array<string | null> | null} */ selected = this.declared('selected');
    /** @type {Array<KpiGroup | null> | null} */ groups = this.declared('groups');
}

/** One selected tile with its figure. `format` is `money`, `count` or `percent` and `direction` is `up`, `down` or `flat`; `changePercent` is `null` when the previous period was zero. Every count is a float on the wire. */
export class KpiTile extends Dto {
    static FIELDS = {
        position: 'int',
        key: 'string',
        code: 'string',
        label: 'string',
        group: 'string',
        format: 'string',
        value: 'float',
        previousValue: 'float',
        changePercent: 'float',
        direction: 'string',
    };

    /** @type {number | null} */ position = this.declared('position');
    /** @type {string | null} */ key = this.declared('key');
    /** @type {string | null} */ code = this.declared('code');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ group = this.declared('group');
    /** @type {string | null} */ format = this.declared('format');
    /** @type {number | null} */ value = this.declared('value');
    /** @type {number | null} */ previousValue = this.declared('previousValue');
    /** @type {number | null} */ changePercent = this.declared('changePercent');
    /** @type {string | null} */ direction = this.declared('direction');
}

/** The tiles in use with their figures for the period; the read and the save answer alike. */
export class KpiSelection extends Dto {
    static FIELDS = {
        dashboard: DashboardRef,
        onlineStore: 'boolean',
        period: KpiPeriod,
        selected: dtoList(KpiTile),
    };

    /** @type {DashboardRef | null} */ dashboard = this.declared('dashboard');
    /** @type {boolean | null} */ onlineStore = this.declared('onlineStore');
    /** @type {KpiPeriod | null} */ period = this.declared('period');
    /** @type {Array<KpiTile | null> | null} */ selected = this.declared('selected');
}

/** The save body, bare: `metrics` is the full list of 2 to 5 distinct metric keys, in tile order. It replaces the default layout's tiles. */
export class KpiSelectionInput extends Dto {
    static FIELDS = {
        metrics: dtoList('string'),
    };

    /** @type {Array<string | null> | null} */ metrics = this.declared('metrics');
}

sealDtoSchema(DashboardRef, KpiPeriod, KpiMetric, KpiGroup, KpiOptions, KpiTile, KpiSelection, KpiSelectionInput);
