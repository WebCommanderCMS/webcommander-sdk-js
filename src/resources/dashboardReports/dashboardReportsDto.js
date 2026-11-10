import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** The period a report covers and the one before it, as dates; `timeZone` is the store's and `currency` the code money figures are in. `duration` is `custom` for a date range. */
export class ReportPeriod extends Dto {
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

/** One figure with the previous period's. `format` is `money`, `count` or `percent` and `direction` is `up`, `down` or `flat`; `changePercent` is `null` when the previous value was zero. In `trends` there is no `group`. */
export class ReportKpi extends Dto {
    static FIELDS = {
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

/** Order counts of the period. */
export class ReportOrders extends Dto {
    static FIELDS = {
        count: 'int',
        pending: 'int',
        cancelled: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
    /** @type {number | null} */ pending = this.declared('pending');
    /** @type {number | null} */ cancelled = this.declared('cancelled');
}

/** Sales figures of the period, rounded to 2 decimals. */
export class ReportSales extends Dto {
    static FIELDS = {
        subtotal: 'float',
        total: 'float',
        itemsSold: 'int',
        averageOrderValue: 'float',
    };

    /** @type {number | null} */ subtotal = this.declared('subtotal');
    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ itemsSold = this.declared('itemsSold');
    /** @type {number | null} */ averageOrderValue = this.declared('averageOrderValue');
}

/** Customers registered in the period. */
export class ReportCustomers extends Dto {
    static FIELDS = {
        new: 'int',
    };

    /** @type {number | null} */ new = this.declared('new');
}

/** Products added in the period, and those out of stock now. */
export class ReportProducts extends Dto {
    static FIELDS = {
        new: 'int',
        outOfStock: 'int',
    };

    /** @type {number | null} */ new = this.declared('new');
    /** @type {number | null} */ outOfStock = this.declared('outOfStock');
}

/** Page views of the period. */
export class ReportPageViews extends Dto {
    static FIELDS = {
        total: 'int',
        unique: 'int',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ unique = this.declared('unique');
}

/** A page, product or post by id and name. */
export class ReportEntity extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One row of the most viewed list: a `page` or, with `entity_name` `product`, a `product`. */
export class ReportViewItem extends Dto {
    static FIELDS = {
        page: ReportEntity,
        product: ReportEntity,
        views: 'int',
    };

    /** @type {ReportEntity | null} */ page = this.declared('page');
    /** @type {ReportEntity | null} */ product = this.declared('product');
    /** @type {number | null} */ views = this.declared('views');
}

/** The most viewed pages, or products when the query's `entity_name` is `product`; `entity` says which. */
export class ReportViews extends Dto {
    static FIELDS = {
        entity: 'string',
        items: dtoList(ReportViewItem),
    };

    /** @type {string | null} */ entity = this.declared('entity');
    /** @type {Array<ReportViewItem | null> | null} */ items = this.declared('items');
}

/** The quick report. `kpis` holds the 27 metrics, or only the ones the query's `kpis` names, in that order. Inside a summary only the grouped totals and `viewReport` are present. */
export class QuickReport extends Dto {
    static FIELDS = {
        period: ReportPeriod,
        kpis: dtoList(ReportKpi),
        orders: ReportOrders,
        sales: ReportSales,
        customers: ReportCustomers,
        products: ReportProducts,
        pageViews: ReportPageViews,
        viewReport: ReportViews,
        trends: dtoList(ReportKpi),
    };

    /** @type {ReportPeriod | null} */ period = this.declared('period');
    /** @type {Array<ReportKpi | null> | null} */ kpis = this.declared('kpis');
    /** @type {ReportOrders | null} */ orders = this.declared('orders');
    /** @type {ReportSales | null} */ sales = this.declared('sales');
    /** @type {ReportCustomers | null} */ customers = this.declared('customers');
    /** @type {ReportProducts | null} */ products = this.declared('products');
    /** @type {ReportPageViews | null} */ pageViews = this.declared('pageViews');
    /** @type {ReportViews | null} */ viewReport = this.declared('viewReport');
    /** @type {Array<ReportKpi | null> | null} */ trends = this.declared('trends');
}

/** One row of the sales report: a day for a period up to a month, else a month. Without `breakdown` only the date fields, `label`, `monthName`, `sales` and `totalSales` are present; `day` is present on day rows only. */
export class SalesRow extends Dto {
    static FIELDS = {
        date: 'string',
        year: 'int',
        month: 'int',
        day: 'int',
        label: 'string',
        monthName: 'string',
        sales: 'float',
        totalSales: 'float',
        orders: 'int',
        ordersValue: 'float',
        grossSales: 'float',
        shipping: 'float',
        handling: 'float',
        tax: 'float',
        discount: 'float',
        refunds: 'float',
        averageOrderValue: 'float',
        topProduct: ReportEntity,
    };

    /** @type {string | null} */ date = this.declared('date');
    /** @type {number | null} */ year = this.declared('year');
    /** @type {number | null} */ month = this.declared('month');
    /** @type {number | null} */ day = this.declared('day');
    /** @type {string | null} */ label = this.declared('label');
    /** @type {string | null} */ monthName = this.declared('monthName');
    /** @type {number | null} */ sales = this.declared('sales');
    /** @type {number | null} */ totalSales = this.declared('totalSales');
    /** @type {number | null} */ orders = this.declared('orders');
    /** @type {number | null} */ ordersValue = this.declared('ordersValue');
    /** @type {number | null} */ grossSales = this.declared('grossSales');
    /** @type {number | null} */ shipping = this.declared('shipping');
    /** @type {number | null} */ handling = this.declared('handling');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ refunds = this.declared('refunds');
    /** @type {number | null} */ averageOrderValue = this.declared('averageOrderValue');
    /** @type {ReportEntity | null} */ topProduct = this.declared('topProduct');
}

/** The rows added up; `sales` always, the rest with `breakdown`. */
export class SalesTotals extends Dto {
    static FIELDS = {
        sales: 'float',
        orders: 'int',
        ordersValue: 'float',
        grossSales: 'float',
        shipping: 'float',
        handling: 'float',
        tax: 'float',
        discount: 'float',
        refunds: 'float',
        averageOrderValue: 'float',
    };

    /** @type {number | null} */ sales = this.declared('sales');
    /** @type {number | null} */ orders = this.declared('orders');
    /** @type {number | null} */ ordersValue = this.declared('ordersValue');
    /** @type {number | null} */ grossSales = this.declared('grossSales');
    /** @type {number | null} */ shipping = this.declared('shipping');
    /** @type {number | null} */ handling = this.declared('handling');
    /** @type {number | null} */ tax = this.declared('tax');
    /** @type {number | null} */ discount = this.declared('discount');
    /** @type {number | null} */ refunds = this.declared('refunds');
    /** @type {number | null} */ averageOrderValue = this.declared('averageOrderValue');
}

/** The sales report. `groupBy` is `day` for a period up to a month and `month` for a longer one; `sort` (`date` or `sales`) and `order` (`asc` or `desc`) echo what was applied. A period with no sales has no rows. */
export class SalesReport extends Dto {
    static FIELDS = {
        period: ReportPeriod,
        groupBy: 'string',
        sort: 'string',
        order: 'string',
        rows: dtoList(SalesRow),
        totals: SalesTotals,
    };

    /** @type {ReportPeriod | null} */ period = this.declared('period');
    /** @type {string | null} */ groupBy = this.declared('groupBy');
    /** @type {string | null} */ sort = this.declared('sort');
    /** @type {string | null} */ order = this.declared('order');
    /** @type {Array<SalesRow | null> | null} */ rows = this.declared('rows');
    /** @type {SalesTotals | null} */ totals = this.declared('totals');
}

/** Orders placed in one month. */
export class OrderCount extends Dto {
    static FIELDS = {
        date: 'string',
        year: 'int',
        month: 'int',
        count: 'int',
    };

    /** @type {string | null} */ date = this.declared('date');
    /** @type {number | null} */ year = this.declared('year');
    /** @type {number | null} */ month = this.declared('month');
    /** @type {number | null} */ count = this.declared('count');
}

/** A product and its views. */
export class MostVisitedProduct extends Dto {
    static FIELDS = {
        product: ReportEntity,
        views: 'int',
    };

    /** @type {ReportEntity | null} */ product = this.declared('product');
    /** @type {number | null} */ views = this.declared('views');
}

/** A product and the units sold, highest first. */
export class BestSellingProduct extends Dto {
    static FIELDS = {
        product: ReportEntity,
        unitsSold: 'int',
    };

    /** @type {ReportEntity | null} */ product = this.declared('product');
    /** @type {number | null} */ unitsSold = this.declared('unitsSold');
}

/** What needs attention now; `pendingFulfillment` is the orders waiting to ship. */
export class OrderUpdates extends Dto {
    static FIELDS = {
        lowStockItems: 'int',
        pendingFulfillment: 'int',
        paymentsToCapture: 'int',
    };

    /** @type {number | null} */ lowStockItems = this.declared('lowStockItems');
    /** @type {number | null} */ pendingFulfillment = this.declared('pendingFulfillment');
    /** @type {number | null} */ paymentsToCapture = this.declared('paymentsToCapture');
}

/** The summary: every section of the Dashboard in one answer. `quickReport` has no `kpis`. */
export class SummaryReport extends Dto {
    static FIELDS = {
        period: ReportPeriod,
        quickReport: QuickReport,
        orderByMonth: dtoList(OrderCount),
        ordersOverTime: dtoList(OrderCount),
        salesReport: dtoList(SalesRow),
        mostVisitedProducts: dtoList(MostVisitedProduct),
        bestSellingProducts: dtoList(BestSellingProduct),
        orderUpdates: OrderUpdates,
    };

    /** @type {ReportPeriod | null} */ period = this.declared('period');
    /** @type {QuickReport | null} */ quickReport = this.declared('quickReport');
    /** @type {Array<OrderCount | null> | null} */ orderByMonth = this.declared('orderByMonth');
    /** @type {Array<OrderCount | null> | null} */ ordersOverTime = this.declared('ordersOverTime');
    /** @type {Array<SalesRow | null> | null} */ salesReport = this.declared('salesReport');
    /** @type {Array<MostVisitedProduct | null> | null} */ mostVisitedProducts = this.declared('mostVisitedProducts');
    /** @type {Array<BestSellingProduct | null> | null} */ bestSellingProducts = this.declared('bestSellingProducts');
    /** @type {OrderUpdates | null} */ orderUpdates = this.declared('orderUpdates');
}

sealDtoSchema(
    ReportPeriod,
    ReportKpi,
    ReportOrders,
    ReportSales,
    ReportCustomers,
    ReportProducts,
    ReportPageViews,
    ReportEntity,
    ReportViewItem,
    ReportViews,
    QuickReport,
    SalesRow,
    SalesTotals,
    SalesReport,
    OrderCount,
    MostVisitedProduct,
    BestSellingProduct,
    OrderUpdates,
    SummaryReport,
);
