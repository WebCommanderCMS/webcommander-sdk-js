import {Dto, dtoList, sealDtoSchema} from '../../dto.js';

/** A category's `image`, `{}` until one is uploaded. */
export class BlogCategoryImage extends Dto {
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

/** One `seo_configs` entry; no write here sets the list, so a created category's is empty. */
export class BlogCategorySeoConfig extends Dto {
    static FIELDS = {
        id: 'int',
        value: 'string',
        type: 'string',
        configKey: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ value = this.declared('value');
    /** @type {string | null} */ type = this.declared('type');
    /** @type {string | null} */ configKey = this.declared('configKey');
}

/**
 * One blog category: a listing row, a row path's body and every write's answer, the same eleven fields each time. The
 * row never lists the blogs it holds.
 */
export class BlogCategory extends Dto {
    static ENVELOPE_KEY = 'blog_category';

    static FIELDS = {
        id: 'int',
        uuid: 'string',
        name: 'string',
        url: 'string',
        description: 'string',
        isDisposable: 'boolean',
        isInTrash: 'boolean',
        image: BlogCategoryImage,
        createdOn: 'string',
        lastUpdatedOn: 'string',
        seoConfigs: dtoList(BlogCategorySeoConfig),
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ uuid = this.declared('uuid');
    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {boolean | null} */ isDisposable = this.declared('isDisposable');
    /** @type {boolean | null} */ isInTrash = this.declared('isInTrash');
    /** @type {BlogCategoryImage | null} */ image = this.declared('image');
    /** @type {string | null} */ createdOn = this.declared('createdOn');
    /** @type {string | null} */ lastUpdatedOn = this.declared('lastUpdatedOn');
    /** @type {Array<BlogCategorySeoConfig | null> | null} */ seoConfigs = this.declared('seoConfigs');
}

/** An image upload; `title` and `alternative_text` are stored only beside a `base64`. */
export class BlogCategoryImageInput extends Dto {
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

/** A blog the category is linked to, by `id`. */
export class BlogCategoryBlog extends Dto {
    static FIELDS = {
        id: 'int',
    };

    /** @type {number | null} */ id = this.declared('id');
}

/** The writable form of {@link BlogCategory}, inside the wrapper both writes require. */
export class BlogCategoryInput extends Dto {
    static ENVELOPE_KEY = 'blog_category';

    static FIELDS = {
        name: 'string',
        url: 'string',
        description: 'string',
        image: BlogCategoryImageInput,
        blogs: dtoList(BlogCategoryBlog),
    };

    /** @type {string | null} */ name = this.declared('name');
    /** @type {string | null} */ url = this.declared('url');
    /** @type {string | null} */ description = this.declared('description');
    /** @type {BlogCategoryImageInput | null} */ image = this.declared('image');
    /** @type {Array<BlogCategoryBlog | null> | null} */ blogs = this.declared('blogs');
}

/** The listing's ten-key `pagination` block; `limit` is the size the store applied. */
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

/** One page of the listing. `field_metadata` is accepted and adds no key. */
export class BlogCategoryPage extends Dto {
    static FIELDS = {
        blogCategories: dtoList(BlogCategory),
        pagination: Pagination,
    };

    /** @type {Array<BlogCategory | null> | null} */ blogCategories = this.declared('blogCategories');
    /** @type {Pagination | null} */ pagination = this.declared('pagination');
}

sealDtoSchema(
    BlogCategoryImage,
    BlogCategorySeoConfig,
    BlogCategory,
    BlogCategoryImageInput,
    BlogCategoryBlog,
    BlogCategoryInput,
    Pagination,
    BlogCategoryPage,
);
