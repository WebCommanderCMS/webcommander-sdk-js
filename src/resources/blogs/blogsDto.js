import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** A category a blog is filed under; a write names it `{"id": …}`. */
export class BlogCategoryReference extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
        isDisposable: 'boolean',
        isInTrash: 'boolean',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {boolean | null} */ isDisposable = this.declared('isDisposable');
    /** @type {boolean | null} */ isInTrash = this.declared('isInTrash');
}

/** The cover image, `{}` when there is none. */
export class BlogImage extends Dto {
    static FIELDS = {
        title: 'string',
        alternativeText: 'string',
        fileName: 'string',
        link: 'string',
    };

    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ alternativeText = this.declared('alternativeText');
    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {string | null} */ link = this.declared('link');
}

/** The cover image a write uploads; without `base64` the stored image is left as it was. */
export class BlogImageInput extends Dto {
    static FIELDS = {
        fileName: 'string',
        base64: 'string',
        title: 'string',
        alternativeText: 'string',
    };

    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {string | null} */ base64 = this.declared('base64');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ alternativeText = this.declared('alternativeText');
}

/** `created_by`; `{}` on a row the store recorded no author for. */
export class BlogAuthor extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** One customer, by `internal_id`, or one customer group a restricted blog is shown to. */
export class BlogAudienceMember extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** `selected_customers` once it names anyone; the store sends `[]` when it names no one, which reads `null`. */
export class BlogAudience extends Dto {
    static FIELDS = {
        customers: dtoList(BlogAudienceMember),
        groups: dtoList(BlogAudienceMember),
    };

    /** @type {Array<BlogAudienceMember | null> | null} */ customers = this.declared('customers');
    /** @type {Array<BlogAudienceMember | null> | null} */ groups = this.declared('groups');
}

/** The audience a write names: customer `internal_id` values and customer group ids; a `customer_id` is dropped. */
export class BlogAudienceInput extends Dto {
    static FIELDS = {
        customers: dtoList('int'),
        groups: dtoList('int'),
    };

    /** @type {Array<number | null> | null} */ customers = this.declared('customers');
    /** @type {Array<number | null> | null} */ groups = this.declared('groups');
}

/** One `meta_tag` entry, the same two fields on a write and a read. */
export class BlogMetaTag extends Dto {
    static FIELDS = {
        name: 'string',
        value: 'string',
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ value = this.declared('value');
}

/** `seo_configs`, an object holding the `meta_tag` list. */
export class BlogSeoConfigs extends Dto {
    static FIELDS = {
        metaTag: dtoList(BlogMetaTag),
    };

    /** @type {Array<BlogMetaTag | null> | null} */ metaTag = this.declared('metaTag');
}

/** The one `group_meta` entry: what the collection is, whether it is writable and where. */
export class ResourceMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block the listing, a row read and a `PATCH` answer carry. */
export class GroupMeta extends Dto {
    static FIELDS = {
        blogs: ResourceMeta,
    };

    /** @type {ResourceMeta | null} */ blogs = this.declared('blogs');
}

/** One blog, the same eighteen fields on a listing row, a row read and every write's answer. */
export class Blog extends Dto {
    static ENVELOPE_KEY = 'blog';

    static FIELDS = {
        id: 'int',
        uuid: 'string',
        title: 'string',
        url: 'string',
        content: 'string',
        date: 'string',
        isPublished: 'boolean',
        visibility: 'string',
        visibleTo: 'string',
        categories: dtoList(BlogCategoryReference),
        createdOn: 'string',
        lastUpdatedOn: 'string',
        isDisposable: 'boolean',
        isInTrash: 'boolean',
        image: BlogImage,
        createdBy: BlogAuthor,
        selectedCustomers: BlogAudience,
        seoConfigs: BlogSeoConfigs,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ content = this.declared('content');
    /** @type {string | null} */ date = this.declared('date');
    /** @type {boolean | null} */ isPublished = this.declared('isPublished');
    /** @type {string | null} */ visibility = this.declared('visibility');
    /** @type {string | null} */ visibleTo = this.declared('visibleTo');
    /** @type {Array<BlogCategoryReference | null> | null} */ categories = this.declared('categories');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {boolean | null} */ isDisposable = this.declared('isDisposable');
    /** @type {boolean | null} */ isInTrash = this.declared('isInTrash');
    /** @type {BlogImage | null} */ image = this.declared('image');
    /** @type {BlogAuthor | null} */ createdBy = this.declared('createdBy');
    /** @type {BlogAudience | null} */ selectedCustomers = this.declared('selectedCustomers');
    /** @type {BlogSeoConfigs | null} */ seoConfigs = this.declared('seoConfigs');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/**
 * The writable form of {@link Blog}, for the create, the replace and the patch. `title` is required by the first
 * two and `visibility` by the replace.
 */
export class BlogInput extends Dto {
    static ENVELOPE_KEY = 'blog';

    static FIELDS = {
        title: 'string',
        content: 'string',
        date: 'string',
        isPublished: 'boolean',
        visibility: 'string',
        visibleTo: 'string',
        categories: dtoList(BlogCategoryReference),
        image: BlogImageInput,
        seoConfigs: BlogSeoConfigs,
        selectedCustomers: BlogAudienceInput,
    };

    /** @type {string | null} */ title = this.declared('title');
    /** @type {string | null} */ content = this.declared('content');
    /** @type {string | null} */ date = this.declared('date');
    /** @type {boolean | null} */ isPublished = this.declared('isPublished');
    /** @type {string | null} */ visibility = this.declared('visibility');
    /** @type {string | null} */ visibleTo = this.declared('visibleTo');
    /** @type {Array<BlogCategoryReference | null> | null} */ categories = this.declared('categories');
    /** @type {BlogImageInput | null} */ image = this.declared('image');
    /** @type {BlogSeoConfigs | null} */ seoConfigs = this.declared('seoConfigs');
    /** @type {BlogAudienceInput | null} */ selectedCustomers = this.declared('selectedCustomers');
}

/** The ten-key `pagination` block; `limit` is the size the store applied, capped at 20. */
export class Pagination extends Dto {
    static FIELDS = {
        total: 'int',
        limit: 'int',
        offset: 'int',
        count: 'int',
        currentPage: 'int',
        totalPages: 'int',
        hasNext: 'boolean',
        hasPrevious: 'boolean',
        previousPage: 'string',
        nextPage: 'string',
    };

    /** @type {number | null} */ total = this.declared('total');
    /** @type {number | null} */ limit = this.declared('limit');
    /** @type {number | null} */ offset = this.declared('offset');
    /** @type {number | null} */ count = this.declared('count');
    /** @type {number | null} */ currentPage = this.declared('currentPage');
    /** @type {number | null} */ totalPages = this.declared('totalPages');
    /** @type {boolean | null} */ hasNext = this.declared('hasNext');
    /** @type {boolean | null} */ hasPrevious = this.declared('hasPrevious');
    /** @type {string | null} */ previousPage = this.declared('previousPage');
    /** @type {string | null} */ nextPage = this.declared('nextPage');
}

/** One page of the listing: the rows, `group_meta`, the paging block and any schema. */
export class BlogPage extends Dto {
    static FIELDS = {
        blogs: dtoList(Blog),
        groupMeta: GroupMeta,
        pagination: Pagination,
        fieldMetadata: 'any',
    };

    /** @type {Array<Blog | null> | null} */ blogs = this.declared('blogs');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
    /** @type {any} */ fieldMetadata = this.declared('fieldMetadata');
}

/** The count sub-path's body, `{"blogs": {"count": N}}`. */
export class BlogCount extends Dto {
    static ENVELOPE_KEY = 'blogs';

    static FIELDS = {
        count: 'int',
    };

    /** @type {number | null} */ count = this.declared('count');
}

/** One comment, the same twelve fields in the listing and on its own path. */
export class BlogComment extends Dto {
    static FIELDS = {
        id: 'int',
        status: 'string',
        name: 'string',
        email: 'string',
        postTitle: 'string',
        content: 'string',
        spam: 'boolean',
        likes: 'int',
        totalReply: 'int',
        createdOn: 'string',
        lastUpdatedOn: 'string',
        replies: dtoList('any'),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ status = this.declared('status');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
    /** @type {string | null} */ postTitle = this.declared('postTitle');
    /** @type {string | null} */ content = this.declared('content');
    /** @type {boolean | null} */ spam = this.declared('spam');
    /** @type {number | null} */ likes = this.declared('likes');
    /** @type {number | null} */ totalReply = this.declared('totalReply');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {Array<unknown> | null} */ replies = this.declared('replies');
}

/** The comments sub-path's body: the blog's `id` beside every comment it holds, unpaged. */
export class BlogCommentList extends Dto {
    static FIELDS = {
        id: 'int',
        comments: dtoList(BlogComment),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {Array<BlogComment | null> | null} */ comments = this.declared('comments');
}

/** The blog's `id` beside one `comment`; no `ENVELOPE_KEY`, which would merge that `id` over the comment's own. */
export class BlogCommentEnvelope extends Dto {
    static FIELDS = {
        id: 'int',
        comment: BlogComment,
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {BlogComment | null} */ comment = this.declared('comment');
}

/** The comment a create sends: `content` required, at most 1000 characters; `name` and `email` may be left out. */
export class BlogCommentDraft extends Dto {
    static FIELDS = {
        content: 'string',
        name: 'string',
        email: 'string',
    };

    /** @type {string | null} */ content = this.declared('content');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ email = this.declared('email');
}

/** The comment create's body, `{"blog": {"comment": {...}}}`. */
export class BlogCommentInput extends Dto {
    static ENVELOPE_KEY = 'blog';

    static FIELDS = {
        comment: BlogCommentDraft,
    };

    /** @type {BlogCommentDraft | null} */ comment = this.declared('comment');
}

sealDtoSchema(
    BlogCategoryReference,
    BlogImage,
    BlogImageInput,
    BlogAuthor,
    BlogAudienceMember,
    BlogAudience,
    BlogAudienceInput,
    BlogMetaTag,
    BlogSeoConfigs,
    ResourceMeta,
    GroupMeta,
    Blog,
    BlogInput,
    Pagination,
    BlogPage,
    BlogCount,
    BlogComment,
    BlogCommentList,
    BlogCommentEnvelope,
    BlogCommentDraft,
    BlogCommentInput,
);
