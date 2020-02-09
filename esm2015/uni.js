/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, InjectionToken, Inject, Injectable, ContentChildren, Directive, ElementRef, Input, Optional, SkipSelf, NgModule, ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/breakpoint.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const FALLBACK_BREAKPOINT_KEY = '__FALLBACK__';
/** @type {?} */
const FALLBACK_BREAKPOINT = {
    name: FALLBACK_BREAKPOINT_KEY,
    media: 'all',
    priority: -1,
};
/** @type {?} */
const DEFAULT_BREAKPOINTS = [
    {
        name: 'xs',
        media: 'screen and (min-width: 0px) and (max-width: 599.9px)',
        priority: 1000,
    },
    {
        name: 'sm',
        media: 'screen and (min-width: 600px) and (max-width: 959.9px)',
        priority: 900,
    },
    {
        name: 'md',
        media: 'screen and (min-width: 960px) and (max-width: 1279.9px)',
        priority: 800,
    },
    {
        name: 'lg',
        media: 'screen and (min-width: 1280px) and (max-width: 1919.9px)',
        priority: 700,
    },
    {
        name: 'xl',
        media: 'screen and (min-width: 1920px) and (max-width: 4999.9px)',
        priority: 600,
    },
    {
        name: 'lt-sm',
        media: 'screen and (max-width: 599.9px)',
        priority: 950,
    },
    {
        name: 'lt-md',
        media: 'screen and (max-width: 959.9px)',
        priority: 850,
    },
    {
        name: 'lt-lg',
        media: 'screen and (max-width: 1279.9px)',
        priority: 750,
    },
    {
        name: 'lt-xl',
        priority: 650,
        media: 'screen and (max-width: 1919.9px)',
    },
    {
        name: 'gt-xs',
        media: 'screen and (min-width: 600px)',
        priority: -950,
    },
    {
        name: 'gt-sm',
        media: 'screen and (min-width: 960px)',
        priority: -850,
    }, {
        name: 'gt-md',
        media: 'screen and (min-width: 1280px)',
        priority: -750,
    },
    {
        name: 'gt-lg',
        media: 'screen and (min-width: 1920px)',
        priority: -650,
    }
];
/** @type {?} */
const BREAKPOINTS = new InjectionToken('Angular Layout Breakpoints');
/** @type {?} */
const BREAKPOINTS_PROVIDER = {
    provide: BREAKPOINTS,
    useValue: DEFAULT_BREAKPOINTS,
    multi: true,
};
/** @type {?} */
const BPS = new InjectionToken('Angular Layout Condensed Breakpoints', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    () => {
        /** @type {?} */
        const providedBps = inject(BREAKPOINTS);
        /** @type {?} */
        const bpMap = new Map();
        providedBps.forEach((/**
         * @param {?} bps
         * @return {?}
         */
        bps => {
            bps.forEach((/**
             * @param {?} bp
             * @return {?}
             */
            bp => {
                bpMap.set(bp.name, bp);
            }));
        }));
        return [...Array.from(bpMap.values()), FALLBACK_BREAKPOINT];
    })
});

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/tag.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class Tag {
    constructor() {
        this.cache = new Map();
        this.deps = [];
    }
    /**
     * @protected
     * @param {?} input
     * @param {?} value
     * @return {?}
     */
    setCache(input, value) {
        this.cache.set(input, value);
    }
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    getCache(input) {
        return this.cache.get(input);
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FlexAlign extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'flexAlign';
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    build(input) {
        input = input || 'stretch';
        /** @type {?} */
        const cache = this.getCache(input);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        const styles = new Map();
        // Cross-axis
        /** @type {?} */
        const key = 'align-self';
        switch (input) {
            case 'start':
                styles.set(key, { value: 'flex-start', priority: 0 });
                break;
            case 'end':
                styles.set(key, { value: 'flex-end', priority: 0 });
                break;
            default:
                styles.set(key, { value: input, priority: 0 });
                break;
        }
        this.setCache(input, styles);
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-fill.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const STYLES = new Map()
    .set('margin', { value: '0', priority: 0 })
    .set('width', { value: '100%', priority: 0 })
    .set('height', { value: '100%', priority: 0 })
    .set('min-width', { value: '100%', priority: 0 })
    .set('min-height', { value: '100%', priority: 0 });
class FlexFill extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'flexFill';
    }
    /**
     * @return {?}
     */
    build() {
        return STYLES;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-order.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FlexOrder extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'flexOrder';
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    build(input) {
        input = input || '0';
        /** @type {?} */
        const cache = this.getCache(input);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        const styles = new Map().set(input, { value: parseInt(input, 10), priority: 0 });
        this.setCache(input, styles);
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/utils.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 * @type {?}
 */
const INLINE = 'inline';
/** @type {?} */
const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Convert layout-wrap='<value>' to expected flex-wrap style
 * @param {?} value
 * @return {?}
 */
function validateWrapValue(value) {
    if (!!value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
            case 'reverse-wrap':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            // All other values fallback to 'wrap'
            default:
                value = 'wrap';
        }
    }
    return value;
}
/**
 * Validate the value to be one of the acceptable value options
 * Use default fallback of 'row'
 * @param {?} value
 * @return {?}
 */
function validateValue(value) {
    value = value ? value.toLowerCase() : '';
    let [direction, wrap, inline] = value.split(' ');
    // First value must be the `flex-direction`
    if (!LAYOUT_VALUES.find((/**
     * @param {?} x
     * @return {?}
     */
    x => x === direction))) {
        direction = LAYOUT_VALUES[0];
    }
    if (wrap === INLINE) {
        wrap = (inline !== INLINE) ? inline : '';
        inline = INLINE;
    }
    return [direction, validateWrapValue(wrap), !!inline];
}
/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 * @param {?} value
 * @return {?}
 */
function isFlowHorizontal(value) {
    let [flow,] = validateValue(value);
    return flow.indexOf('row') > -1;
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-offset.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FlexOffset extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'flexOffset';
        this.deps = ['parent.layout', 'directionality'];
    }
    /**
     * @param {?} input
     * @param {?} layout
     * @param {?} direction
     * @return {?}
     */
    build(input, layout, direction) {
        input = input || '0';
        /** @type {?} */
        const isRtl = direction === 'rtl';
        /** @type {?} */
        const cacheKey = input + layout + isRtl;
        /** @type {?} */
        const cache = this.getCache(cacheKey);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        const isPercent = input.indexOf('%') > -1;
        /** @type {?} */
        const isPx = input.indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+input)) {
            input = input + '%';
        }
        /** @type {?} */
        const horizontalLayoutKey = isRtl ? 'margin-right' : 'margin-left';
        /** @type {?} */
        const key = isFlowHorizontal(layout) ? horizontalLayoutKey : 'margin-top';
        /** @type {?} */
        const styles = new Map().set(key, input);
        this.setCache(cacheKey, styles);
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/layout-align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LayoutAlign extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'layoutAlign';
        this.deps = ['self.layout', 'directionality'];
    }
    /**
     * @param {?} input
     * @param {?} layout
     * @return {?}
     */
    build(input, layout) {
        layout = layout || 'row';
        /** @type {?} */
        const cacheKey = input + layout;
        /** @type {?} */
        const cache = this.getCache(cacheKey);
        if (cache) {
            return cache;
        }
        const [mainAxis, crossAxis] = input.split(' ');
        /** @type {?} */
        const maxKey = crossAxis === STRETCH && isFlowHorizontal(layout) ? 'max-height' : 'max-width';
        /** @type {?} */
        const styles = new Map()
            .set('display', { value: 'flex', priority: -1 })
            .set('flex-direction', { value: 'row', priority: -1 })
            .set('box-sizing', { value: 'border-box', priority: 0 })
            .set(maxKey, { value: '100%', priority: 0 });
        switch (mainAxis) {
            case FLEX_START:
            case FLEX_END:
            case SPACE_EVENLY:
            case SPACE_BETWEEN:
            case SPACE_AROUND:
            case CENTER:
                styles.set(JUSTIFY_CONTENT, { value: mainAxis, priority: 0 });
                break;
            case END:
                styles.set(JUSTIFY_CONTENT, { value: FLEX_END, priority: 0 });
                break;
            case START:
            default:
                styles.set(JUSTIFY_CONTENT, { value: FLEX_START, priority: 0 });
        }
        switch (crossAxis) {
            case STRETCH:
            case FLEX_START:
            case FLEX_END:
            case CENTER:
                styles.set(ALIGN_ITEMS, { value: crossAxis, priority: 0 });
                styles.set(ALIGN_CONTENT, { value: crossAxis, priority: 0 });
                break;
            case START:
                styles.set(ALIGN_ITEMS, { value: FLEX_START, priority: 0 });
                styles.set(ALIGN_CONTENT, { value: FLEX_START, priority: 0 });
                break;
            case END:
                styles.set(ALIGN_ITEMS, { value: FLEX_END, priority: 0 });
                styles.set(ALIGN_CONTENT, { value: FLEX_END, priority: 0 });
                break;
            case SPACE_BETWEEN:
            case SPACE_AROUND:
                styles.set(ALIGN_CONTENT, { value: crossAxis, priority: 0 });
                styles.set(ALIGN_ITEMS, { value: STRETCH, priority: 0 });
                break;
            case BASELINE:
                styles.set(ALIGN_CONTENT, { value: STRETCH, priority: 0 });
                styles.set(ALIGN_ITEMS, { value: BASELINE, priority: 0 });
                break;
            default:
                styles.set(ALIGN_CONTENT, { value: STRETCH, priority: 0 });
                styles.set(ALIGN_ITEMS, { value: STRETCH, priority: 0 });
        }
        this.setCache(cacheKey, styles);
        return styles;
    }
}
/** @type {?} */
const JUSTIFY_CONTENT = 'justify-content';
/** @type {?} */
const ALIGN_CONTENT = 'align-content';
/** @type {?} */
const ALIGN_ITEMS = 'align-items';
/** @type {?} */
const CENTER = 'center';
/** @type {?} */
const STRETCH = 'stretch';
/** @type {?} */
const BASELINE = 'baseline';
/** @type {?} */
const END = 'end';
/** @type {?} */
const FLEX_END = 'flex-end';
/** @type {?} */
const START = 'start';
/** @type {?} */
const FLEX_START = 'flex-start';
/** @type {?} */
const SPACE_AROUND = 'space-around';
/** @type {?} */
const SPACE_BETWEEN = 'space-between';
/** @type {?} */
const SPACE_EVENLY = 'space-evenly';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/tags.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const FLEX_TAGS = [FlexAlign, FlexFill, FlexOrder, FlexOffset, LayoutAlign];
/** @type {?} */
const GRID_TAGS = [];
/** @type {?} */
const DEFAULT_TAGS = [...FLEX_TAGS, ...GRID_TAGS];
/** @type {?} */
const LAYOUT_TAGS = new InjectionToken('Angular Layout Tags');
/** @type {?} */
const FLEX_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: FLEX_TAGS,
    multi: true,
};
/** @type {?} */
const GRID_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: GRID_TAGS,
    multi: true,
};
/** @type {?} */
const TAGS_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: DEFAULT_TAGS,
    multi: true,
};
/** @type {?} */
const TAGS = new InjectionToken('Angular Layout Condensed Tags', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    () => {
        /** @type {?} */
        const providedTags = inject(LAYOUT_TAGS);
        /** @type {?} */
        const tagsMap = new Map();
        providedTags.forEach((/**
         * @param {?} tags
         * @return {?}
         */
        tags => {
            tags.forEach((/**
             * @param {?} tag
             * @return {?}
             */
            tag => {
                tagsMap.set(tag.tag, tag.constructor());
            }));
        }));
        return tagsMap;
    })
});

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/central.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GrandCentral {
    /**
     * @param {?} directionality
     * @param {?} mediaMatcher
     * @param {?} bps
     * @param {?} tags
     */
    constructor(directionality, mediaMatcher, bps, tags) {
        this.directionality = directionality;
        this.bps = bps;
        this.tags = tags;
        this.mediaQueries = new Map();
        this.activations = [];
        this.activating = false;
        this.elementsMap = new Map();
        this.elementDataMap = new Map();
        this.dirListeners = new Set();
        bps.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => {
            this.elementsMap.set(bp, new Set());
            /** @type {?} */
            const mediaQueryList = mediaMatcher.matchMedia(bp.media);
            this.mediaQueries.set(bp.name, mediaQueryList);
            mediaQueryList.addListener((/**
             * @param {?} e
             * @return {?}
             */
            e => {
                /** @type {?} */
                const activate = e.matches && this.activations.indexOf(bp) === -1;
                /** @type {?} */
                const deactivate = !e.matches && this.activations.indexOf(bp) > -1;
                if (!this.activating && (activate || deactivate)) {
                    this.dirListeners.clear();
                    this.computeStyles();
                    this.activating = true;
                }
            }));
        }));
        this.computeActivations();
        directionality.change.subscribe((/**
         * @return {?}
         */
        () => this.dirListeners.forEach(this.addStyles)));
    }
    /**
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    addDirective(dir, bp) {
        (/** @type {?} */ (this.elementsMap.get(bp))).add(dir);
        this.updateDirective(dir);
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    updateDirective(dir) {
        this.computeDirective(dir);
        this.addStyles(dir);
    }
    /**
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    removeDirectiveBp(dir, bp) {
        (/** @type {?} */ (this.elementsMap.get(bp))).delete(dir);
        this.updateDirective(dir);
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeDirective(dir) {
        this.dirListeners.delete(dir);
        this.bps.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => (/** @type {?} */ (this.elementsMap.get(bp))).delete(dir)));
    }
    /**
     * @private
     * @return {?}
     */
    computeActivations() {
        this.activations = this.bps
            .filter((/**
         * @param {?} bp
         * @return {?}
         */
        bp => (/** @type {?} */ (this.mediaQueries.get(bp.name))).matches))
            .sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => b.priority - a.priority));
    }
    /**
     * @private
     * @return {?}
     */
    computeStyles() {
        this.computeActivations();
        this.activations.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => (/** @type {?} */ (this.elementsMap.get(bp))).forEach(this.computeDirective.bind(this))));
        Array.from(this.elementDataMap.keys()).forEach(this.addStyles.bind(this));
        this.activating = false;
    }
    /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    computeDirective(dir) {
        /** @type {?} */
        const values = new Map();
        this.activations.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => {
            /** @type {?} */
            const valueMap = dir.valueMap.get(bp.name);
            if (valueMap) {
                valueMap.forEach((/**
                 * @param {?} value
                 * @param {?} key
                 * @return {?}
                 */
                (value, key) => {
                    if (!values.has(key)) {
                        values.set(key, value);
                    }
                }));
            }
        }));
        this.elementDataMap.set(dir, values);
    }
    /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    addStyles(dir) {
        /** @type {?} */
        const values = (/** @type {?} */ (this.elementDataMap.get(dir)));
        /** @type {?} */
        const styles = new Map();
        values.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
            /** @type {?} */
            const tag = (/** @type {?} */ (this.tags.get(key)));
            /** @type {?} */
            const priorityMap = this.calculateStyle(tag.tag, value, dir);
            priorityMap.forEach((/**
             * @param {?} v
             * @param {?} k
             * @return {?}
             */
            (v, k) => {
                /** @type {?} */
                const style = styles.get(k);
                if (!style || style && style.priority < v.priority) {
                    styles.set(k, v);
                }
            }));
        }));
        dir.applyStyles(styles);
    }
    /**
     * @private
     * @param {?} tagName
     * @param {?} value
     * @param {?} dir
     * @return {?}
     */
    calculateStyle(tagName, value, dir) {
        /** @type {?} */
        const tag = (/** @type {?} */ (this.tags.get(tagName)));
        /** @type {?} */
        const args = this.resolve(dir, tag.deps);
        return tag.build(value, ...args);
    }
    /**
     * @private
     * @param {?} dir
     * @param {?} deps
     * @return {?}
     */
    resolve(dir, deps) {
        return deps.map((/**
         * @param {?} dep
         * @return {?}
         */
        dep => {
            var _a, _b;
            /** @type {?} */
            const keys = dep.split(KEY_DELIMITER);
            if (keys.length > 1 && keys[0] === PARENT_KEY || keys[0] === SELF_KEY) {
                // TODO: setup listeners, only get triggered when element is updated in isolation
                // does this account for when that element gets updated by directionality?
                /** @type {?} */
                const dataMap = this.elementDataMap.get(keys[0] === PARENT_KEY ? dir.parent : dir);
                return _b = (_a = dataMap) === null || _a === void 0 ? void 0 : _a.get(dep), _b !== null && _b !== void 0 ? _b : '';
            }
            else if (dep === DIR_KEY) {
                this.dirListeners.add(dir);
                return this.directionality.value;
            }
            else {
                return '';
            }
        }));
    }
}
GrandCentral.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
GrandCentral.ctorParameters = () => [
    { type: Directionality },
    { type: MediaMatcher },
    { type: Array, decorators: [{ type: Inject, args: [BPS,] }] },
    { type: Map, decorators: [{ type: Inject, args: [TAGS,] }] }
];
/** @nocollapse */ GrandCentral.ɵprov0 = ɵɵdefineInjectable({ factory: function GrandCentral_Factory() { return new GrandCentral(ɵɵinject(Directionality), ɵɵinject(MediaMatcher), ɵɵinject(BPS), ɵɵinject(TAGS)); }, token: GrandCentral, providedIn: "root" });
/** @type {?} */
const KEY_DELIMITER = '.';
/** @type {?} */
const PARENT_KEY = 'parent';
/** @type {?} */
const SELF_KEY = 'self';
/** @type {?} */
const DIR_KEY = 'directionality';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/unified.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BreakpointDirective {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.name = '';
        this.element = elementRef.nativeElement;
    }
}
BreakpointDirective.decorators = [
    { type: Directive, args: [{ selector: `bp` },] },
];
/** @nocollapse */
BreakpointDirective.ctorParameters = () => [
    { type: ElementRef }
];
BreakpointDirective.propDecorators = {
    name: [{ type: Input, args: ['tag',] }]
};
class UnifiedDirective {
    /**
     * @param {?} parent
     * @param {?} elementRef
     * @param {?} breakpoints
     * @param {?} tags
     * @param {?} grandCentral
     */
    constructor(parent, elementRef, breakpoints, tags, grandCentral) {
        this.parent = parent;
        this.breakpoints = breakpoints;
        this.tags = tags;
        this.grandCentral = grandCentral;
        this.valueMap = new Map();
        this.observerMap = new Map();
        this.fallbackStyles = new Map();
        breakpoints.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => this.valueMap.set(bp.name, new Map())));
        this.element = elementRef.nativeElement;
        this.tagNames = Array.from(this.tags.keys());
        /** @type {?} */
        const callback = (/**
         * @param {?} mutations
         * @return {?}
         */
        (mutations) => {
            mutations.forEach((/**
             * @param {?} mutation
             * @return {?}
             */
            (mutation) => {
                if (mutation.type === 'attributes') {
                    this.processAttributeMutation(mutation, true);
                }
            }));
        });
        this.tagNames.forEach((/**
         * @param {?} tagName
         * @return {?}
         */
        tagName => {
            /** @type {?} */
            const attr = this.element.getAttribute(tagName);
            if (attr) {
                (/** @type {?} */ (this.valueMap.get(FALLBACK_BREAKPOINT_KEY))).set(tagName, attr);
            }
        }));
        this.grandCentral.addDirective(this, FALLBACK_BREAKPOINT);
        if (typeof MutationObserver !== 'undefined') {
            this.rootObserver = new MutationObserver(callback);
            this.rootObserver.observe(this.element, {
                attributes: true,
                attributeFilter: this.tagNames
            });
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        /** @type {?} */
        const childCallback = (/**
         * @param {?} mutations
         * @return {?}
         */
        (mutations) => {
            mutations.forEach((/**
             * @param {?} mutation
             * @return {?}
             */
            mutation => {
                if (mutation.type === 'attributes') {
                    this.processAttributeMutation(mutation);
                }
            }));
        });
        this.bpElements.forEach((/**
         * @param {?} ref
         * @return {?}
         */
        ref => {
            /** @type {?} */
            const el = ref.element;
            /** @type {?} */
            const breakpoint = (/** @type {?} */ (this.breakpoints.find((/**
             * @param {?} bp
             * @return {?}
             */
            bp => bp.name === ref.name))));
            this.tagNames.forEach((/**
             * @param {?} tagName
             * @return {?}
             */
            tagName => {
                /** @type {?} */
                const attr = el.getAttribute(tagName);
                if (attr) {
                    (/** @type {?} */ (this.valueMap.get(ref.name))).set(tagName, attr);
                }
            }));
            this.grandCentral.addDirective(this, breakpoint);
            if (typeof MutationObserver !== 'undefined') {
                /** @type {?} */
                const mo = new MutationObserver(childCallback);
                mo.observe(el, {
                    attributes: true,
                    attributeFilter: this.tagNames,
                });
                this.observerMap.set(el, mo);
            }
        }));
        // const oldNodes = Array.from(mutation.removedNodes)
        //   .filter(n => isElement(n) && breakpointNames.indexOf(n.tagName) > -1) as Element[];
        // oldNodes.forEach(el => {
        //   const tagName = el.tagName.toLowerCase();
        //   const breakpoint = breakpoints.find(bp => bp.name === tagName)!;
        //   const observer = this.observerMap.get(el);
        //   if (observer) {
        //     grandCentral.removeDirectiveBp(this, breakpoint);
        //     observer.disconnect();
        //   }
        // });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.rootObserver) {
            this.rootObserver.disconnect();
        }
        this.observerMap.forEach((/**
         * @param {?} observer
         * @return {?}
         */
        observer => observer.disconnect()));
        this.grandCentral.removeDirective(this);
    }
    /**
     * @param {?} styles
     * @return {?}
     */
    applyStyles(styles) {
        styles.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
            if (!this.fallbackStyles.get(key)) {
                this.fallbackStyles.set(key, this.element.style.getPropertyValue(key));
            }
            this.element.style.setProperty(key, value.value);
        }));
        // TODO: let's say we go xs and that adds max-width, then we go to md, without,
        // does this clear it?
        this.fallbackStyles.forEach((/**
         * @param {?} _
         * @param {?} key
         * @return {?}
         */
        (_, key) => {
            if (!styles.has(key)) {
                this.element.style.setProperty(key, this.fallbackStyles.get(key) || '');
            }
        }));
    }
    /**
     * @private
     * @param {?} mutation
     * @param {?=} isParent
     * @return {?}
     */
    processAttributeMutation(mutation, isParent = false) {
        if (mutation.attributeName) {
            /** @type {?} */
            const target = (/** @type {?} */ (mutation.target));
            /** @type {?} */
            const newValue = target.getAttribute(mutation.attributeName);
            /** @type {?} */
            const tagName = isParent ? FALLBACK_BREAKPOINT_KEY : target.tagName.toLowerCase();
            if (newValue) {
                (/** @type {?} */ (this.valueMap.get(tagName))).set(mutation.attributeName, newValue);
            }
            else {
                (/** @type {?} */ (this.valueMap.get(tagName))).delete(mutation.attributeName);
            }
            this.grandCentral.updateDirective(this);
        }
    }
}
UnifiedDirective.decorators = [
    { type: Directive, args: [{ selector: `[ngl]` },] },
];
/** @nocollapse */
UnifiedDirective.ctorParameters = () => [
    { type: UnifiedDirective, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: ElementRef },
    { type: Array, decorators: [{ type: Inject, args: [BPS,] }] },
    { type: Map, decorators: [{ type: Inject, args: [TAGS,] }] },
    { type: GrandCentral }
];
UnifiedDirective.propDecorators = {
    bpElements: [{ type: ContentChildren, args: [BreakpointDirective,] }]
};

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/uni.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: uni/module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UnifiedModule {
    /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    static withDefaults(withDefaultBp = true) {
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                TAGS_PROVIDER,
                BREAKPOINTS_PROVIDER,
            ] : [TAGS_PROVIDER],
        };
    }
    /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    static withFlex(withDefaultBp = true) {
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                FLEX_PROVIDER,
                BREAKPOINTS_PROVIDER
            ] : [FLEX_PROVIDER]
        };
    }
    /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    static withGrid(withDefaultBp = true) {
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                GRID_PROVIDER,
                BREAKPOINTS_PROVIDER
            ] : [GRID_PROVIDER]
        };
    }
}
UnifiedModule.decorators = [
    { type: NgModule, args: [{
                declarations: [UnifiedDirective, BreakpointDirective],
                exports: [UnifiedDirective, BreakpointDirective]
            },] },
];

/**
 * @fileoverview added by tsickle
 * Generated from: uni/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: uni/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { BREAKPOINTS, DEFAULT_BREAKPOINTS, FLEX_TAGS, GRID_TAGS, LAYOUT_TAGS, DEFAULT_TAGS, Tag, GrandCentral, BreakpointDirective, UnifiedDirective, UnifiedModule, BPS as ɵb0, BREAKPOINTS_PROVIDER as ɵa0, FlexAlign as ɵg0, FlexFill as ɵh0, FlexOffset as ɵj0, FlexOrder as ɵi0, LayoutAlign as ɵk0, FLEX_PROVIDER as ɵc0, GRID_PROVIDER as ɵd0, TAGS as ɵf0, TAGS_PROVIDER as ɵe0 };
//# sourceMappingURL=uni.js.map
