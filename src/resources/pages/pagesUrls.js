export const PAGES = '/api/{api_version}/admin/pages';
export const PAGES_COUNT = '/api/{api_version}/admin/pages/count';
export const PAGE = '/api/{api_version}/admin/pages/{page_id}';
export const PAGE_URL = '/api/{api_version}/admin/pages/{page_id}/url';
export const PAGE_LANDING = '/api/{api_version}/admin/pages/{page_id}/landing';
export const PAGE_DELETE_BLOCKERS = '/api/{api_version}/admin/pages/{page_id}/delete-blockers';
export const PAGE_DUPLICATE = '/api/{api_version}/admin/pages/{page_id}/duplicate';

/** Carries the `ETag` a read answered; a stale one makes the write `412`. @type {string} */
export const IF_MATCH_HEADER = 'If-Match';
