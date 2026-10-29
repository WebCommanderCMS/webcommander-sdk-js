import {Dto, dtoList, sealDtoSchema} from '../../../dto.js';

/** The uploaded loader behind `enable_custom_preloader`; read-only. */
export class CustomLoader extends Dto {
    static FIELDS = {
        enabled: 'boolean',
        fileName: 'string',
        fileUrl: 'string',
    };

    /** @type {boolean | null} */ enabled = this.declared('enabled');
    /** @type {string | null} */ fileName = this.declared('fileName');
    /** @type {string | null} */ fileUrl = this.declared('fileUrl');
}

/** One entry of `preloader_custom_page` as a read sends it; a write takes page ids instead. */
export class PreloaderPage extends Dto {
    static FIELDS = {
        id: 'int',
        name: 'string',
    };

    /** @type {number | null} */ id = this.declared('id');
    /** @type {string | null} */ name = this.declared('name');
}

/** The `preloader_design` section — the loader shown while a page loads, and when and where it shows. */
export class PreloaderDesign extends Dto {
    static ENVELOPE_KEY = 'preloader_design';

    static FIELDS = {
        enablePreloader: 'boolean',
        enableCustomPreloader: 'boolean',
        preloaderPreset: 'string',
        preloaderSize: 'int',
        preloaderBackgroundOpacity: 'float',
        backgroundPreloader: 'string',
        preloaderHideCondition: 'string',
        preloaderShowTimeCondition: 'string',
        preloaderHideAfterTime: 'float',
        preloaderPage: 'string',
        preloaderCustomPage: dtoList(PreloaderPage),
        customLoader: CustomLoader,
    };

    /** @type {boolean | null} */ enablePreloader = this.declared('enablePreloader');
    /** @type {boolean | null} */ enableCustomPreloader = this.declared('enableCustomPreloader');
    /** @type {string | null} */ preloaderPreset = this.declared('preloaderPreset');
    /** @type {number | null} */ preloaderSize = this.declared('preloaderSize');
    /** @type {number | null} */ preloaderBackgroundOpacity = this.declared('preloaderBackgroundOpacity');
    /** @type {string | null} */ backgroundPreloader = this.declared('backgroundPreloader');
    /** @type {string | null} */ preloaderHideCondition = this.declared('preloaderHideCondition');
    /** @type {string | null} */ preloaderShowTimeCondition = this.declared('preloaderShowTimeCondition');
    /** @type {number | null} */ preloaderHideAfterTime = this.declared('preloaderHideAfterTime');
    /** @type {string | null} */ preloaderPage = this.declared('preloaderPage');
    /** @type {PreloaderPage[] | null} */ preloaderCustomPage = this.declared('preloaderCustomPage');
    /** @type {CustomLoader | null} */ customLoader = this.declared('customLoader');
}

/** The `widget_transition` section — whether widgets fade in, and over how long. */
export class WidgetTransition extends Dto {
    static ENVELOPE_KEY = 'widget_transition';

    static FIELDS = {
        widgetSmoothRender: 'boolean',
        widgetSmoothRenderDuration: 'int',
    };

    /** @type {boolean | null} */ widgetSmoothRender = this.declared('widgetSmoothRender');
    /** @type {number | null} */ widgetSmoothRenderDuration = this.declared('widgetSmoothRenderDuration');
}

/** The `page_transition` section — the animation between pages and when it plays. */
export class PageTransition extends Dto {
    static ENVELOPE_KEY = 'page_transition';

    static FIELDS = {
        pageTransitionAnimationType: 'string',
        transitionAnimationDuration: 'float',
        animationBeforeEnteringNewPage: 'boolean',
        animationAfterEnteringNewPage: 'boolean',
    };

    /** @type {string | null} */ pageTransitionAnimationType = this.declared('pageTransitionAnimationType');
    /** @type {number | null} */ transitionAnimationDuration = this.declared('transitionAnimationDuration');
    /** @type {boolean | null} */ animationBeforeEnteringNewPage = this.declared('animationBeforeEnteringNewPage');
    /** @type {boolean | null} */ animationAfterEnteringNewPage = this.declared('animationAfterEnteringNewPage');
}

/** The `image_lazy_effect` section — which pages lazy-load images, and what stands in while one loads. */
export class ImageLazyEffect extends Dto {
    static ENVELOPE_KEY = 'image_lazy_effect';

    static FIELDS = {
        preloaderImageLazyEffectPreset: 'string',
        productDetailsPageImageLazyEffect: 'boolean',
        flyingCartImageLazyEffect: 'boolean',
        productListImageLazyEffect: 'boolean',
        propertyListImageLazyEffect: 'boolean',
        propertyDetailsPageImageLazyEffect: 'boolean',
        blogListImageLazyEffect: 'boolean',
        blogDetailsPageImageLazyEffect: 'boolean',
        lazyLoaderSize: 'int',
        backgroundLazyLoader: 'string',
        contentImageLazyLoadBackground: 'string',
    };

    /** @type {string | null} */ preloaderImageLazyEffectPreset = this.declared('preloaderImageLazyEffectPreset');
    /** @type {boolean | null} */ productDetailsPageImageLazyEffect = this.declared(
        'productDetailsPageImageLazyEffect',
    );
    /** @type {boolean | null} */ flyingCartImageLazyEffect = this.declared('flyingCartImageLazyEffect');
    /** @type {boolean | null} */ productListImageLazyEffect = this.declared('productListImageLazyEffect');
    /** @type {boolean | null} */ propertyListImageLazyEffect = this.declared('propertyListImageLazyEffect');
    /** @type {boolean | null} */ propertyDetailsPageImageLazyEffect = this.declared(
        'propertyDetailsPageImageLazyEffect',
    );
    /** @type {boolean | null} */ blogListImageLazyEffect = this.declared('blogListImageLazyEffect');
    /** @type {boolean | null} */ blogDetailsPageImageLazyEffect = this.declared('blogDetailsPageImageLazyEffect');
    /** @type {number | null} */ lazyLoaderSize = this.declared('lazyLoaderSize');
    /** @type {string | null} */ backgroundLazyLoader = this.declared('backgroundLazyLoader');
    /** @type {string | null} */ contentImageLazyLoadBackground = this.declared('contentImageLazyLoadBackground');
}

/** The `page_skeleton` section — one field. */
export class PageSkeleton extends Dto {
    static ENVELOPE_KEY = 'page_skeleton';

    static FIELDS = {
        checkoutPageSkeleton: 'boolean',
    };

    /** @type {boolean | null} */ checkoutPageSkeleton = this.declared('checkoutPageSkeleton');
}

/** One entry of `group_meta`: what a section is, whether it can be written and where it is managed. */
export class SectionMeta extends Dto {
    static FIELDS = {
        kind: 'string',
        writable: 'boolean',
        href: 'string',
    };

    /** @type {string | null} */ kind = this.declared('kind');
    /** @type {boolean | null} */ writable = this.declared('writable');
    /** @type {string | null} */ href = this.declared('href');
}

/** The `group_meta` block — one {@link SectionMeta} per section; only the facade sends it. */
export class GroupMeta extends Dto {
    static FIELDS = {
        preloaderDesign: SectionMeta,
        widgetTransition: SectionMeta,
        pageTransition: SectionMeta,
        imageLazyEffect: SectionMeta,
        pageSkeleton: SectionMeta,
    };

    /** @type {SectionMeta | null} */ preloaderDesign = this.declared('preloaderDesign');
    /** @type {SectionMeta | null} */ widgetTransition = this.declared('widgetTransition');
    /** @type {SectionMeta | null} */ pageTransition = this.declared('pageTransition');
    /** @type {SectionMeta | null} */ imageLazyEffect = this.declared('imageLazyEffect');
    /** @type {SectionMeta | null} */ pageSkeleton = this.declared('pageSkeleton');
}

/** The animation effects settings, as the facade or one section sends them. */
export class AnimationEffects extends Dto {
    static ENVELOPE_KEY = 'animation_effects';

    static FIELDS = {
        preloaderDesign: PreloaderDesign,
        widgetTransition: WidgetTransition,
        pageTransition: PageTransition,
        imageLazyEffect: ImageLazyEffect,
        pageSkeleton: PageSkeleton,
        groupMeta: GroupMeta,
        fieldMetadata: 'any',
    };

    /** @type {PreloaderDesign | null} */ preloaderDesign = this.declared('preloaderDesign');
    /** @type {WidgetTransition | null} */ widgetTransition = this.declared('widgetTransition');
    /** @type {PageTransition | null} */ pageTransition = this.declared('pageTransition');
    /** @type {ImageLazyEffect | null} */ imageLazyEffect = this.declared('imageLazyEffect');
    /** @type {PageSkeleton | null} */ pageSkeleton = this.declared('pageSkeleton');
    /** @type {GroupMeta | null} */ groupMeta = this.declared('groupMeta');
    /** @type {unknown} */ fieldMetadata = this.declared('fieldMetadata');
}

sealDtoSchema(
    CustomLoader,
    PreloaderPage,
    PreloaderDesign,
    WidgetTransition,
    PageTransition,
    ImageLazyEffect,
    PageSkeleton,
    SectionMeta,
    GroupMeta,
    AnimationEffects,
);
