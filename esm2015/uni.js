/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, InjectionToken, Inject, Injectable, ContentChildren, Directive, ElementRef, Input, Optional, SkipSelf, NgModule, ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
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
        priority: 1,
    },
    {
        name: 'md',
        media: 'screen and (min-width: 960px) and (max-width: 1279.9px)',
        priority: 1,
    }
];
/** @type {?} */
const BREAKPOINTS = new InjectionToken('Angular Layout Breakpoints');
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
 * Generated from: uni/src/builder.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/flex-align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
const ɵ0 = /**
 * @param {?} input
 * @return {?}
 */
(input) => {
    input = input || 'stretch';
    /** @type {?} */
    const key = 'align-self';
    /** @type {?} */
    const styles = new Map();
    // Cross-axis
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
    return styles;
};
/** @type {?} */
const FLEX_ALIGN_TAG = {
    tag: 'flexAlign',
    builder: (ɵ0)
};

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_TAGS = [FLEX_ALIGN_TAG];
/** @type {?} */
const LAYOUT_TAGS = new InjectionToken('Angular Layout Tags');
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
                tagsMap.set(tag.tag, tag.builder);
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
     * @param {?} mediaMatcher
     * @param {?} bps
     * @param {?} tags
     */
    constructor(mediaMatcher, bps, tags) {
        this.bps = bps;
        this.tags = tags;
        this.mediaQueries = new Map();
        this.activations = [];
        this.activating = false;
        this.elementsMap = new Map();
        this.elementDataMap = new Map();
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
                    this.computeStyles();
                    this.activating = true;
                }
            }));
        }));
        this.computeActivations();
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
        const element = dir.element;
        /** @type {?} */
        const parent = dir.parent;
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
            const builder = (/** @type {?} */ (this.tags.get(key)));
            /** @type {?} */
            const priorityMap = builder(value, parent);
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
        styles.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => element.style.setProperty(key, value.value)));
    }
}
GrandCentral.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
GrandCentral.ctorParameters = () => [
    { type: MediaMatcher },
    { type: Array, decorators: [{ type: Inject, args: [BPS,] }] },
    { type: Map, decorators: [{ type: Inject, args: [TAGS,] }] }
];
/** @nocollapse */ GrandCentral.ɵprov0 = ɵɵdefineInjectable({ factory: function GrandCentral_Factory() { return new GrandCentral(ɵɵinject(MediaMatcher), ɵɵinject(BPS), ɵɵinject(TAGS)); }, token: GrandCentral, providedIn: "root" });

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
     * @return {?}
     */
    static withDefaults() {
        return {
            ngModule: UnifiedModule,
            providers: [
                {
                    provide: LAYOUT_TAGS,
                    useValue: DEFAULT_TAGS,
                    multi: true,
                },
                {
                    provide: BREAKPOINTS,
                    useValue: DEFAULT_BREAKPOINTS,
                    multi: true,
                }
            ]
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

export { BREAKPOINTS, DEFAULT_BREAKPOINTS, LAYOUT_TAGS, DEFAULT_TAGS, GrandCentral, FLEX_ALIGN_TAG, BreakpointDirective, UnifiedDirective, UnifiedModule, BPS as ɵa0, TAGS as ɵb0 };
//# sourceMappingURL=uni.js.map
