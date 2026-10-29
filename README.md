# WebCommander JavaScript SDK

A Node.js client for the WebCommander v4 REST API, with OAuth2 token management, retries and secret
redaction, and no runtime dependencies.

## Requirements

- Node.js 20.19 or later (`engines.node` in `package.json`).
- An ES module project: use `import`, and set `"type": "module"` in your `package.json` or name your
  files `.mjs`. On Node 20.19+ and 22.12+, `require('@webcommander/webcommander')` also works, because those
  versions can `require()` an ES module.
- API credentials for a WebCommander instance: base URL, client ID, client secret, redirect URI and
  auth string.

## Installation

```bash
npm install @webcommander/webcommander
```

The package ships its own TypeScript declarations.

## Quick start

```js
import {AuthConfig, SdkConfig, WebCommanderClient} from '@webcommander/webcommander';

const client = new WebCommanderClient(
    new SdkConfig(
        new AuthConfig({
            clientName: 'default',
            baseUrl: process.env.WC_BASE_URL,
            clientId: process.env.WC_CLIENT_ID,
            clientSecret: process.env.WC_CLIENT_SECRET,
            redirectUri: process.env.WC_REDIRECT_URI,
            authString: process.env.WC_AUTH_STRING,
        }),
    ),
);

try {
    const response = await client.adminCustomers.getCustomers({limit: 20});
    if (response.succeeded) {
        for (const customer of response.data.customers) {
            console.log(customer.customer_id, customer.email);
        }
    } else {
        console.error(response.statusCode, response.getErrorMessages());
    }
} finally {
    await client.closeClient();
}
```

- The first call fetches a token, caches it and renews it before it expires.
- A failed call returns a response with `succeeded` set to `false`; it does not throw unless you set
  `raiseOnError: true`.
- Call `closeClient()` when you are done. It waits for calls in flight, then releases the connection
  pool and any log file. A later call on that client raises `SdkUsageError`; calling `closeClient()`
  twice is harmless. Build one client and share it rather than building one per request.

The SDK never reads credentials from the environment; the example reads them in your code. Node can
load a `.env` file for you with `process.loadEnvFile('.env')`.

## Configuration

Credentials go in an `AuthConfig`, and behaviour settings go in an `SdkConfig` or the options of
`buildClient()`. To register several instances once and pick one by name:

```js
import {AuthConfig, buildClient, registerInstances} from '@webcommander/webcommander';

const liveAuth = new AuthConfig({clientName: 'live' /* baseUrl, clientId, ... */});
const stagingAuth = new AuthConfig({clientName: 'staging' /* baseUrl, clientId, ... */});
registerInstances([liveAuth, stagingAuth]);

const live = await buildClient(); // the first registered instance
const staging = await buildClient('staging', {timeoutSeconds: 60, raiseOnError: true});
```

The settings you are most likely to change:

| Option           | Default   | Meaning                                                                 |
| ---------------- | --------- | ----------------------------------------------------------------------- |
| `raiseOnError`   | `false`   | Throw an `SdkError` on a failed call instead of returning the response. |
| `responseFormat` | `'map'`   | What `response.data` holds: `'map'`, `'json'` or `'dto'`.               |
| `timeoutSeconds` | `30`      | Per-attempt time limit; also the idle limit between response chunks.    |
| `maxRetries`     | `1`       | Total attempts, so `1` means no retry.                                  |
| `logLevel`       | `WARNING` | Lowest level passed to log sinks and `logFile`.                         |
| `printApiInfo`   | `false`   | Print method, URL, status and timing for each call.                     |
| `tokenCachePath` | per user  | On `AuthConfig`: where the token is cached; `null` keeps it in memory.  |

`raiseOnError` and `responseFormat` can also be set per call, in the options object every endpoint
function takes last.

## Usage

### Bound and explicit calls

Every endpoint is a function that takes the client first. The client also exposes each resource as a
property with the client already bound. Both forms call the same function:

```js
import {adminCustomers} from '@webcommander/webcommander';

await adminCustomers.getCustomer(client, 1192); // explicit client
await client.adminCustomers.getCustomer(1192); // bound client
```

A misspelt function name on a bound resource throws `SdkAttributeError` with the closest real name.

For an endpoint the SDK has no function for, call `client.sendGetRequest(path, options)` or one of the
other verb methods.

### Payload forms

A write accepts a plain object, a JSON string or a payload DTO. All three send the same bytes:

```js
import {adminCustomersDto} from '@webcommander/webcommander';

await client.adminCustomers.createCustomer({customer: {first_name: 'Ada', email: 'ada@example.com'}});
await client.adminCustomers.createCustomer('{"customer": {"first_name": "Ada", "email": "ada@example.com"}}');
await client.adminCustomers.createCustomer(
    new adminCustomersDto.CustomerInput({firstName: 'Ada', email: 'ada@example.com'}),
);
```

Query parameter and body field names go to the API exactly as you write them.

### Response forms

Every call returns an `ApiResponse`. The body is available in four forms:

```js
const response = await client.adminCustomers.getCustomers({limit: 5});

response.data; // the form selected by responseFormat; the decoded body by default
response.map; // always the decoded body: object, array, string or Uint8Array
response.json; // always the body text as received
response.dto; // always the typed view, or null where the endpoint declares no type
```

Choose the form per call, per client, or with the `WC_RESPONSE_FORMAT` environment variable:

```js
const page = await client.adminCustomers.getCustomers({limit: 5}, {responseFormat: 'dto'});
page.data.items[0].email;
```

### Pagination

`iterPages` and `iterRecords` follow `pagination.next_page` for you:

```js
import {iterRecords} from '@webcommander/webcommander';

for await (const customer of iterRecords(client, '/api/{api_version}/admin/customers', 'customers')) {
    console.log(customer.customer_id);
}
```

Most listings cap `limit` at 20.

## Error handling

By default a failed call returns its response. Check `succeeded`, then read the status and messages:

```js
const response = await client.adminCustomers.getCustomer(1192);
if (!response.succeeded) {
    console.error(response.statusCode, response.errorType, response.getErrorMessages());
}
```

With `raiseOnError: true`, a failed call throws an `SdkError`, the base class of every error the SDK
raises:

```js
import {SdkError} from '@webcommander/webcommander';

try {
    await client.adminCustomers.getCustomer(1192, {raiseOnError: true});
} catch (error) {
    if (!(error instanceof SdkError)) throw error;
    console.error(error.statusCode, error.getHint());
}
```

Connection failures, timeouts and a rejected token request always throw, because there is no response
to return.

## Resources

The client exposes 46 resources with 349 operations. The [API reference](https://newlify.mintlify.app)
lists the method, path and behaviour of each one.

| Resource                    | Client accessor               | Operations |
| --------------------------- | ----------------------------- | ---------: |
| Customers                   | `client.adminCustomers`       |         15 |
| Aliases                     | `client.aliases`              |          4 |
| Animation effects settings  | `client.animationEffects`     |          5 |
| Blog categories             | `client.blogCategories`       |          5 |
| Blogs                       | `client.blogs`                |         12 |
| Carts                       | `client.carts`                |          7 |
| Categories                  | `client.categories`           |         10 |
| Category page settings      | `client.categoryPage`         |          5 |
| Checkout page settings      | `client.checkoutPage`         |          5 |
| Cities                      | `client.cities`               |          2 |
| Common settings             | `client.commonSettings`       |          6 |
| Countries                   | `client.countries`            |          8 |
| Currencies                  | `client.currencies`           |         11 |
| Customer groups             | `client.customerGroups`       |          9 |
| Customer portal settings    | `client.customerPortal`       |          5 |
| Discount profiles           | `client.discountProfiles`     |          7 |
| Ecommerce settings          | `client.ecommerceSettings`    |          5 |
| Email                       | `client.email`                |          1 |
| Inventory locations         | `client.inventoryLocations`   |         11 |
| Order custom fields         | `client.orderCustomFields`    |          4 |
| Order flags                 | `client.orderFlags`           |          7 |
| Orders                      | `client.orders`               |         25 |
| Pages                       | `client.pages`                |         15 |
| Payment gateways            | `client.paymentGateways`      |          8 |
| Price display settings      | `client.priceDisplaySettings` |          5 |
| Product listing settings    | `client.productListing`       |          3 |
| Product page settings       | `client.productPage`          |          5 |
| Products                    | `client.products`             |         10 |
| Search result page settings | `client.searchResultPage`     |         13 |
| Search settings             | `client.searchSettings`       |          9 |
| SEO configuration           | `client.seoConfiguration`     |         18 |
| Shipping classes            | `client.shippingClasses`      |          9 |
| Shipping methods            | `client.shippingMethods`      |          9 |
| Shipping settings           | `client.shippingSettings`     |          3 |
| Shopping cart settings      | `client.shoppingCart`         |          5 |
| Site settings               | `client.siteSettings`         |          5 |
| Tax codes                   | `client.taxCodes`             |          7 |
| Tax country taxes           | `client.taxCountryTaxes`      |          5 |
| Tax custom profiles         | `client.taxCustomProfiles`    |          5 |
| Tax profiles                | `client.taxProfiles`          |          7 |
| Tax rules                   | `client.taxRules`             |          7 |
| Tax settings                | `client.taxSettings`          |          2 |
| Tax zones                   | `client.taxZones`             |          7 |
| Transactions                | `client.transactions`         |          6 |
| Trash                       | `client.trash`                |          8 |
| Variations                  | `client.variations`           |         12 |

Each resource module is also importable by name (`import {orders} from '@webcommander/webcommander'`), with its
typed views in `<resource>Dto` and its path constants in `<resource>Urls`. Every public module also has
its own subpath, listed in the `exports` field of `package.json`
(`import {SdkConfig} from '@webcommander/webcommander/config/sdkConfig'`); a file under `src/` that is not listed
there is internal.

## Documentation

- API reference: <https://newlify.mintlify.app>

## License

MIT. See [LICENSE](LICENSE).
