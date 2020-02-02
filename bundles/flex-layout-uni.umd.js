/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/layout')) :
	typeof define === 'function' && define.amd ? define('@angular/flex-layout/uni', ['exports', '@angular/core', '@angular/cdk/layout'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.flexLayout = global.ng.flexLayout || {}, global.ng.flexLayout.uni = {}),global.ng.core,global.ng.cdk.layout));
}(this, (function (exports,core,layout) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/breakpoint.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var FALLBACK_BREAKPOINT_KEY = '__FALLBACK__';
/** @type {?} */
var FALLBACK_BREAKPOINT = {
    name: FALLBACK_BREAKPOINT_KEY,
    media: 'all',
    priority: -1,
};
/** @type {?} */
var DEFAULT_BREAKPOINTS = [
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
var BREAKPOINTS = new core.InjectionToken('Angular Layout Breakpoints');
/** @type {?} */
var BPS = new core.InjectionToken('Angular Layout Condensed Breakpoints', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var providedBps = core.inject(BREAKPOINTS);
        /** @type {?} */
        var bpMap = new Map();
        providedBps.forEach((/**
         * @param {?} bps
         * @return {?}
         */
        function (bps) {
            bps.forEach((/**
             * @param {?} bp
             * @return {?}
             */
            function (bp) {
                bpMap.set(bp.name, bp);
            }));
        }));
        return __spreadArrays(Array.from(bpMap.values()), [FALLBACK_BREAKPOINT]);
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
var ɵ0 = /**
 * @param {?} input
 * @return {?}
 */
function (input) {
    input = input || 'stretch';
    /** @type {?} */
    var key = 'align-self';
    /** @type {?} */
    var styles = new Map();
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
var FLEX_ALIGN_TAG = {
    tag: 'flexAlign',
    builder: (ɵ0)
};

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var DEFAULT_TAGS = [FLEX_ALIGN_TAG];
/** @type {?} */
var LAYOUT_TAGS = new core.InjectionToken('Angular Layout Tags');
/** @type {?} */
var TAGS = new core.InjectionToken('Angular Layout Condensed Tags', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var providedTags = core.inject(LAYOUT_TAGS);
        /** @type {?} */
        var tagsMap = new Map();
        providedTags.forEach((/**
         * @param {?} tags
         * @return {?}
         */
        function (tags) {
            tags.forEach((/**
             * @param {?} tag
             * @return {?}
             */
            function (tag) {
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
var GrandCentral = /** @class */ (function () {
    function GrandCentral(mediaMatcher, bps, tags) {
        var _this = this;
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
        function (bp) {
            _this.elementsMap.set(bp, new Set());
            /** @type {?} */
            var mediaQueryList = mediaMatcher.matchMedia(bp.media);
            _this.mediaQueries.set(bp.name, mediaQueryList);
            mediaQueryList.addListener((/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                /** @type {?} */
                var activate = e.matches && _this.activations.indexOf(bp) === -1;
                /** @type {?} */
                var deactivate = !e.matches && _this.activations.indexOf(bp) > -1;
                if (!_this.activating && (activate || deactivate)) {
                    _this.computeStyles();
                    _this.activating = true;
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
    GrandCentral.prototype.addDirective = /**
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    function (dir, bp) {
        (/** @type {?} */ (this.elementsMap.get(bp))).add(dir);
        this.updateDirective(dir);
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    GrandCentral.prototype.updateDirective = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        this.computeDirective(dir);
        this.addStyles(dir);
    };
    /**
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    GrandCentral.prototype.removeDirectiveBp = /**
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    function (dir, bp) {
        (/** @type {?} */ (this.elementsMap.get(bp))).delete(dir);
        this.updateDirective(dir);
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    GrandCentral.prototype.removeDirective = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        var _this = this;
        this.bps.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        function (bp) { return (/** @type {?} */ (_this.elementsMap.get(bp))).delete(dir); }));
    };
    /**
     * @private
     * @return {?}
     */
    GrandCentral.prototype.computeActivations = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.activations = this.bps
            .filter((/**
         * @param {?} bp
         * @return {?}
         */
        function (bp) { return (/** @type {?} */ (_this.mediaQueries.get(bp.name))).matches; }))
            .sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return b.priority - a.priority; }));
    };
    /**
     * @private
     * @return {?}
     */
    GrandCentral.prototype.computeStyles = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.computeActivations();
        this.activations.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        function (bp) {
            return (/** @type {?} */ (_this.elementsMap.get(bp))).forEach(_this.computeDirective.bind(_this));
        }));
        Array.from(this.elementDataMap.keys()).forEach(this.addStyles.bind(this));
        this.activating = false;
    };
    /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    GrandCentral.prototype.computeDirective = /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        /** @type {?} */
        var values = new Map();
        this.activations.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        function (bp) {
            /** @type {?} */
            var valueMap = dir.valueMap.get(bp.name);
            if (valueMap) {
                valueMap.forEach((/**
                 * @param {?} value
                 * @param {?} key
                 * @return {?}
                 */
                function (value, key) {
                    if (!values.has(key)) {
                        values.set(key, value);
                    }
                }));
            }
        }));
        this.elementDataMap.set(dir, values);
    };
    /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    GrandCentral.prototype.addStyles = /**
     * @private
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        var _this = this;
        /** @type {?} */
        var element = dir.element;
        /** @type {?} */
        var parent = dir.parent;
        /** @type {?} */
        var values = (/** @type {?} */ (this.elementDataMap.get(dir)));
        /** @type {?} */
        var styles = new Map();
        values.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        function (value, key) {
            /** @type {?} */
            var builder = (/** @type {?} */ (_this.tags.get(key)));
            /** @type {?} */
            var priorityMap = builder(value, parent);
            priorityMap.forEach((/**
             * @param {?} v
             * @param {?} k
             * @return {?}
             */
            function (v, k) {
                /** @type {?} */
                var style = styles.get(k);
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
        function (value, key) { return element.style.setProperty(key, value.value); }));
    };
    GrandCentral.decorators = [
        { type: core.Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    GrandCentral.ctorParameters = function () { return [
        { type: layout.MediaMatcher },
        { type: Array, decorators: [{ type: core.Inject, args: [BPS,] }] },
        { type: Map, decorators: [{ type: core.Inject, args: [TAGS,] }] }
    ]; };
    /** @nocollapse */ GrandCentral.ɵprov0 = core.ɵɵdefineInjectable({ factory: function GrandCentral_Factory() { return new GrandCentral(core.ɵɵinject(layout.MediaMatcher), core.ɵɵinject(BPS), core.ɵɵinject(TAGS)); }, token: GrandCentral, providedIn: "root" });
    return GrandCentral;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/unified.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var BreakpointDirective = /** @class */ (function () {
    function BreakpointDirective(elementRef) {
        this.name = '';
        this.element = elementRef.nativeElement;
    }
    BreakpointDirective.decorators = [
        { type: core.Directive, args: [{ selector: "bp" },] },
    ];
    /** @nocollapse */
    BreakpointDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    BreakpointDirective.propDecorators = {
        name: [{ type: core.Input, args: ['tag',] }]
    };
    return BreakpointDirective;
}());
var UnifiedDirective = /** @class */ (function () {
    function UnifiedDirective(parent, elementRef, breakpoints, tags, grandCentral) {
        var _this = this;
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
        function (bp) { return _this.valueMap.set(bp.name, new Map()); }));
        this.element = elementRef.nativeElement;
        this.tagNames = Array.from(this.tags.keys());
        /** @type {?} */
        var callback = (/**
         * @param {?} mutations
         * @return {?}
         */
        function (mutations) {
            mutations.forEach((/**
             * @param {?} mutation
             * @return {?}
             */
            function (mutation) {
                if (mutation.type === 'attributes') {
                    _this.processAttributeMutation(mutation, true);
                }
            }));
        });
        this.tagNames.forEach((/**
         * @param {?} tagName
         * @return {?}
         */
        function (tagName) {
            /** @type {?} */
            var attr = _this.element.getAttribute(tagName);
            if (attr) {
                (/** @type {?} */ (_this.valueMap.get(FALLBACK_BREAKPOINT_KEY))).set(tagName, attr);
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
    UnifiedDirective.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var childCallback = (/**
         * @param {?} mutations
         * @return {?}
         */
        function (mutations) {
            mutations.forEach((/**
             * @param {?} mutation
             * @return {?}
             */
            function (mutation) {
                if (mutation.type === 'attributes') {
                    _this.processAttributeMutation(mutation);
                }
            }));
        });
        this.bpElements.forEach((/**
         * @param {?} ref
         * @return {?}
         */
        function (ref) {
            /** @type {?} */
            var el = ref.element;
            /** @type {?} */
            var breakpoint = (/** @type {?} */ (_this.breakpoints.find((/**
             * @param {?} bp
             * @return {?}
             */
            function (bp) { return bp.name === ref.name; }))));
            _this.tagNames.forEach((/**
             * @param {?} tagName
             * @return {?}
             */
            function (tagName) {
                /** @type {?} */
                var attr = el.getAttribute(tagName);
                if (attr) {
                    (/** @type {?} */ (_this.valueMap.get(ref.name))).set(tagName, attr);
                }
            }));
            _this.grandCentral.addDirective(_this, breakpoint);
            if (typeof MutationObserver !== 'undefined') {
                /** @type {?} */
                var mo = new MutationObserver(childCallback);
                mo.observe(el, {
                    attributes: true,
                    attributeFilter: _this.tagNames,
                });
                _this.observerMap.set(el, mo);
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
    };
    /**
     * @return {?}
     */
    UnifiedDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.rootObserver) {
            this.rootObserver.disconnect();
        }
        this.observerMap.forEach((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) { return observer.disconnect(); }));
        this.grandCentral.removeDirective(this);
    };
    /**
     * @private
     * @param {?} mutation
     * @param {?=} isParent
     * @return {?}
     */
    UnifiedDirective.prototype.processAttributeMutation = /**
     * @private
     * @param {?} mutation
     * @param {?=} isParent
     * @return {?}
     */
    function (mutation, isParent) {
        if (isParent === void 0) { isParent = false; }
        if (mutation.attributeName) {
            /** @type {?} */
            var target = (/** @type {?} */ (mutation.target));
            /** @type {?} */
            var newValue = target.getAttribute(mutation.attributeName);
            /** @type {?} */
            var tagName = isParent ? FALLBACK_BREAKPOINT_KEY : target.tagName.toLowerCase();
            if (newValue) {
                (/** @type {?} */ (this.valueMap.get(tagName))).set(mutation.attributeName, newValue);
            }
            else {
                (/** @type {?} */ (this.valueMap.get(tagName))).delete(mutation.attributeName);
            }
            this.grandCentral.updateDirective(this);
        }
    };
    UnifiedDirective.decorators = [
        { type: core.Directive, args: [{ selector: "[ngl]" },] },
    ];
    /** @nocollapse */
    UnifiedDirective.ctorParameters = function () { return [
        { type: UnifiedDirective, decorators: [{ type: core.Optional }, { type: core.SkipSelf }] },
        { type: core.ElementRef },
        { type: Array, decorators: [{ type: core.Inject, args: [BPS,] }] },
        { type: Map, decorators: [{ type: core.Inject, args: [TAGS,] }] },
        { type: GrandCentral }
    ]; };
    UnifiedDirective.propDecorators = {
        bpElements: [{ type: core.ContentChildren, args: [BreakpointDirective,] }]
    };
    return UnifiedDirective;
}());

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
var UnifiedModule = /** @class */ (function () {
    function UnifiedModule() {
    }
    /**
     * @return {?}
     */
    UnifiedModule.withDefaults = /**
     * @return {?}
     */
    function () {
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
    };
    UnifiedModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [UnifiedDirective, BreakpointDirective],
                    exports: [UnifiedDirective, BreakpointDirective]
                },] },
    ];
    return UnifiedModule;
}());

exports.BREAKPOINTS = BREAKPOINTS;
exports.DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS;
exports.LAYOUT_TAGS = LAYOUT_TAGS;
exports.DEFAULT_TAGS = DEFAULT_TAGS;
exports.GrandCentral = GrandCentral;
exports.FLEX_ALIGN_TAG = FLEX_ALIGN_TAG;
exports.BreakpointDirective = BreakpointDirective;
exports.UnifiedDirective = UnifiedDirective;
exports.UnifiedModule = UnifiedModule;
exports.ɵa0 = BPS;
exports.ɵb0 = TAGS;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout-uni.umd.js.map
