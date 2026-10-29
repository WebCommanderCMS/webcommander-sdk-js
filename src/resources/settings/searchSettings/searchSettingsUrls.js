export const SEARCH_SETTINGS = '/api/{api_version}/admin/settings/search_settings';
export const SEARCH_SETTINGS_SECTION = '/api/{api_version}/admin/settings/search_settings/{section}';
export const SEARCH_SETTINGS_REINDEX_STATUS = '/api/{api_version}/admin/settings/search_settings/reindex_status';

/** The three values `{section}` takes, in the facade's order. @type {readonly string[]} */
export const SEARCH_SETTINGS_SECTIONS = Object.freeze(['searchable_content', 'search_fields', 'synonyms']);

/**
 * The one section to leave alone: a write to `synonyms` triggers a store reindex that cannot be undone.
 * @type {string}
 */
export const SEARCH_SETTINGS_REINDEXING_SECTION = 'synonyms';
