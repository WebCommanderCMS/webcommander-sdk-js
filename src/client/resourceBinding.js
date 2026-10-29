import {SdkAttributeError, SdkUsageError} from '../errors.js';
import * as adminCustomers from '../resources/customers/adminCustomers.js';
import * as orderFlags from '../resources/orderFlags/orderFlags.js';
import * as inventoryLocations from '../resources/inventoryLocations/inventoryLocations.js';
import * as shippingMethods from '../resources/shippingMethods/shippingMethods.js';
import * as shippingClasses from '../resources/shippingClasses/shippingClasses.js';
import * as aliases from '../resources/aliases/aliases.js';
import * as orders from '../resources/orders/orders.js';
import * as orderCustomFields from '../resources/orderCustomFields/orderCustomFields.js';
import * as blogCategories from '../resources/blogCategories/blogCategories.js';
import * as categories from '../resources/categories/categories.js';
import * as discountProfiles from '../resources/discountProfiles/discountProfiles.js';
import * as blogs from '../resources/blogs/blogs.js';
import * as carts from '../resources/carts/carts.js';
import * as products from '../resources/products/products.js';
import * as countries from '../resources/countries/countries.js';
import * as customerGroups from '../resources/customerGroups/customerGroups.js';
import * as currencies from '../resources/currencies/currencies.js';
import * as variations from '../resources/variations/variations.js';
import * as cities from '../resources/cities/cities.js';
import * as paymentGateways from '../resources/paymentGateways/paymentGateways.js';
import * as taxCodes from '../resources/taxCodes/taxCodes.js';
import * as taxProfiles from '../resources/taxProfiles/taxProfiles.js';
import * as taxRules from '../resources/taxRules/taxRules.js';
import * as taxZones from '../resources/taxZones/taxZones.js';
import * as taxSettings from '../resources/taxSettings/taxSettings.js';
import * as taxCountryTaxes from '../resources/taxCountryTaxes/taxCountryTaxes.js';
import * as taxCustomProfiles from '../resources/taxCustomProfiles/taxCustomProfiles.js';
import * as transactions from '../resources/transactions/transactions.js';
import * as trash from '../resources/trash/trash.js';
import * as email from '../resources/email/email.js';
import * as commonSettings from '../resources/commonSettings/commonSettings.js';
import * as pages from '../resources/pages/pages.js';
import * as categoryPage from '../resources/settings/pageSettings/categoryPage.js';
import * as checkoutPage from '../resources/settings/pageSettings/checkoutPage.js';
import * as productPage from '../resources/settings/pageSettings/productPage.js';
import * as searchResultPage from '../resources/settings/pageSettings/searchResultPage.js';
import * as shoppingCart from '../resources/settings/pageSettings/shoppingCart.js';
import * as priceDisplaySettings from '../resources/settings/priceDisplaySettings/priceDisplaySettings.js';
import * as animationEffects from '../resources/settings/animationEffects/animationEffects.js';
import * as productListing from '../resources/settings/productListing/productListing.js';
import * as customerPortal from '../resources/settings/customerPortal/customerPortal.js';
import * as siteSettings from '../resources/settings/siteSettings/siteSettings.js';
import * as shippingSettings from '../resources/settings/shippingSettings/shippingSettings.js';
import * as searchSettings from '../resources/settings/searchSettings/searchSettings.js';
import * as ecommerceSettings from '../resources/settings/ecommerceSettings/ecommerceSettings.js';
import * as seoConfiguration from '../resources/settings/seoConfiguration/seoConfiguration.js';

/**
 * Name to module, seeded here rather than in the barrel, which a subpath import never evaluates.
 * @type {Map<string, any>}
 */
const RESOURCE_MODULES = new Map(
    /** @type {Array<[string, any]>} */ ([
        ['adminCustomers', adminCustomers],
        ['orderFlags', orderFlags],
        ['inventoryLocations', inventoryLocations],
        ['shippingMethods', shippingMethods],
        ['shippingClasses', shippingClasses],
        ['aliases', aliases],
        ['orders', orders],
        ['orderCustomFields', orderCustomFields],
        ['blogCategories', blogCategories],
        ['categories', categories],
        ['discountProfiles', discountProfiles],
        ['blogs', blogs],
        ['carts', carts],
        ['products', products],
        ['countries', countries],
        ['customerGroups', customerGroups],
        ['currencies', currencies],
        ['variations', variations],
        ['cities', cities],
        ['paymentGateways', paymentGateways],
        ['taxCodes', taxCodes],
        ['taxProfiles', taxProfiles],
        ['taxRules', taxRules],
        ['taxZones', taxZones],
        ['taxSettings', taxSettings],
        ['taxCountryTaxes', taxCountryTaxes],
        ['taxCustomProfiles', taxCustomProfiles],
        ['transactions', transactions],
        ['trash', trash],
        ['email', email],
        ['commonSettings', commonSettings],
        ['pages', pages],
        ['categoryPage', categoryPage],
        ['checkoutPage', checkoutPage],
        ['productPage', productPage],
        ['searchResultPage', searchResultPage],
        ['shoppingCart', shoppingCart],
        ['priceDisplaySettings', priceDisplaySettings],
        ['animationEffects', animationEffects],
        ['productListing', productListing],
        ['customerPortal', customerPortal],
        ['siteSettings', siteSettings],
        ['shippingSettings', shippingSettings],
        ['searchSettings', searchSettings],
        ['ecommerceSettings', ecommerceSettings],
        ['seoConfiguration', seoConfiguration],
    ]),
);

const JS_KEYWORDS = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'let',
    'static',
    'enum',
    'await',
    'null',
    'true',
    'false',
]);

/** Names a `WebCommanderClient` already answers, which a resource must not shadow. */
const RESERVED_CLIENT_NAMES = new Set([
    'config',
    'name',
    'sendApiRequest',
    'sendGetRequest',
    'sendPostRequest',
    'sendPutRequest',
    'sendPatchRequest',
    'sendDeleteRequest',
    'closeClient',
    'listResourceNames',
    'constructor',
    'then',
    'toString',
    'inspect',
]);

// A JavaScript identifier, so the name survives access as `client.<name>`.
const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Make a resource module reachable as `client.<resourceName>`, with the client pre-applied.
 * @param {string} resourceName @param {any} module
 */
export function registerResourceModule(resourceName, module) {
    if (
        typeof resourceName !== 'string' ||
        resourceName.startsWith('_') ||
        !IDENTIFIER_PATTERN.test(resourceName) ||
        JS_KEYWORDS.has(resourceName)
    ) {
        throw new SdkUsageError(
            `cannot register resource ${JSON.stringify(resourceName)}: a resource name must be an identifier that is not a ` +
                'keyword and does not start with an underscore — pick another name',
        );
    }
    if (RESERVED_CLIENT_NAMES.has(resourceName)) {
        throw new SdkUsageError(
            `cannot register resource ${JSON.stringify(resourceName)}: WebCommanderClient already has an attribute of that ` +
                'name, and it would win every lookup — pick another name',
        );
    }
    const registered = RESOURCE_MODULES.get(resourceName);
    if (registered !== undefined && registered !== module) {
        throw new SdkUsageError(
            `cannot register resource ${JSON.stringify(resourceName)} against a different module: it is already registered, ` +
                'and clients built before the change would keep the old one — pick another name',
        );
    }
    if (!module || (typeof module !== 'object' && typeof module !== 'function')) {
        throw new SdkUsageError(
            `cannot register resource ${JSON.stringify(resourceName)}: the module is not importable`,
        );
    }
    RESOURCE_MODULES.set(resourceName, module);
}

/** Every registered resource name, sorted — e.g. `['adminCustomers', 'seoConfiguration']`. @returns {string[]} */
export function registeredResourceNames() {
    return [...RESOURCE_MODULES.keys()].sort();
}

/** The module registered under a name, or `SdkAttributeError` listing the available ones. @param {string} resourceName @returns {any} */
export function resolveResourceModule(resourceName) {
    const module = RESOURCE_MODULES.get(resourceName);
    if (module === undefined) {
        const available = registeredResourceNames().join(', ') || 'none registered yet';
        throw new SdkAttributeError(`no resource ${JSON.stringify(resourceName)}; available: ${available}`);
    }
    return module;
}

/**
 * The endpoints a module exposes: its `ENDPOINTS` array if it has one, else every exported function.
 * @param {any} module @returns {string[]}
 */
function publicFunctionNames(module) {
    const declared = module.ENDPOINTS;
    if (Array.isArray(declared)) return declared.map((entry) => String(entry)).sort();
    return Object.keys(module)
        .filter((key) => !key.startsWith('_') && key !== 'default' && typeof module[key] === 'function')
        .sort();
}

/** The nearest name for a "did you mean", or null when nothing is close. @param {string} name @param {string[]} candidates @returns {string | null} */
function closestMatch(name, candidates) {
    let best = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
        const distance = levenshtein(name, candidate);
        if (distance < bestDistance) {
            bestDistance = distance;
            best = candidate;
        }
    }
    // Past ~40% of the longer name a suggestion is a red herring, not a hint.
    return best !== null && bestDistance <= Math.ceil(Math.max(name.length, best.length) * 0.4) ? best : null;
}

/** Edit distance between two names, only to rank suggestions. @param {string} a @param {string} b @returns {number} */
function levenshtein(a, b) {
    const rows = Array.from({length: a.length + 1}, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
        }
    }
    return rows[a.length][b.length];
}

/** A `Proxy` where `new BoundResource(client, module).fn(x)` calls `module.fn(client, x)`. */
export class BoundResource {
    /** @param {any} client @param {any} module */
    constructor(client, module) {
        /** @private */
        this._client = client;
        /** @private */
        this._module = module;
        const available = publicFunctionNames(module);
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (typeof prop === 'symbol' || prop.startsWith('_') || prop === 'then') {
                    return Reflect.get(target, prop, receiver);
                }
                if (!available.includes(prop)) {
                    const suggestion = closestMatch(prop, available);
                    const hint = suggestion ? `; did you mean ${suggestion}?` : '';
                    throw new SdkAttributeError(`resource has no ${JSON.stringify(prop)}${hint}`);
                }
                const fn = module[prop];
                if (typeof fn !== 'function') {
                    throw new SdkAttributeError(
                        `resource lists ${JSON.stringify(prop)} but it is not callable, so it is not an endpoint`,
                    );
                }
                return (...args) => fn(client, ...args);
            },
        });
    }

    [Symbol.for('nodejs.util.inspect.custom')]() {
        return `BoundResource(${publicFunctionNames(this._module).join(', ')})`;
    }
}
