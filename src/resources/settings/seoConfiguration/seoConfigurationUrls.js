/** `{config_key}` is a document-root file's store id, not its name. */

export const SEO_CONFIGURATION = '/api/{api_version}/admin/settings/seo_configuration';
export const SEO_CONFIGURATION_SECTION = '/api/{api_version}/admin/settings/seo_configuration/{section}';
export const SEO_CONFIGURATION_DOCUMENT_ROOT = '/api/{api_version}/admin/settings/seo_configuration/document_root';
export const SEO_CONFIGURATION_DOCUMENT_ROOT_FILE =
    '/api/{api_version}/admin/settings/seo_configuration/document_root/{config_key}';
export const SEO_CONFIGURATION_REDIRECTS = '/api/{api_version}/admin/settings/seo_configuration/redirects';
export const SEO_CONFIGURATION_REDIRECT = '/api/{api_version}/admin/settings/seo_configuration/redirects/{redirect_id}';

/**
 * The three values `{section}` takes; `document_root` and `redirects` are collections with their own functions.
 * @type {readonly string[]}
 */
export const SEO_CONFIGURATION_SECTIONS = Object.freeze(['global_store_settings', 'custom_code', 'url_settings']);
