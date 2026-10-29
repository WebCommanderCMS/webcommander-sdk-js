export const CUSTOMER_PORTAL = '/api/{api_version}/admin/settings/customer_portal';
export const CUSTOMER_PORTAL_SECTION = '/api/{api_version}/admin/settings/customer_portal/{section}';

/**
 * The sections `group_meta` marks writable, the only ones a `PATCH` may name; `Allow` is not the authority.
 * @type {readonly string[]}
 */
export const CUSTOMER_PORTAL_WRITABLE_SECTIONS = Object.freeze(['portal', 'registration', 'login', 'sso']);
