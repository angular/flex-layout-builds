/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __spreadArrays, __extends } from 'tslib';
import { inject, InjectionToken, Inject, Injectable, ContentChildren, Directive, ElementRef, Input, Optional, SkipSelf, NgModule, ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';

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
var BREAKPOINTS = new InjectionToken('Angular Layout Breakpoints');
/** @type {?} */
var BREAKPOINTS_PROVIDER = {
    provide: BREAKPOINTS,
    useValue: DEFAULT_BREAKPOINTS,
    multi: true,
};
/** @type {?} */
var BPS = new InjectionToken('Angular Layout Condensed Breakpoints', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var providedBps = inject(BREAKPOINTS);
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
 * Generated from: uni/src/tags/tag.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
var  /**
 * @abstract
 */
Tag = /** @class */ (function () {
    function Tag() {
        this.cache = new Map();
        this.deps = [];
    }
    /**
     * @protected
     * @param {?} input
     * @param {?} value
     * @return {?}
     */
    Tag.prototype.setCache = /**
     * @protected
     * @param {?} input
     * @param {?} value
     * @return {?}
     */
    function (input, value) {
        this.cache.set(input, value);
    };
    /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    Tag.prototype.getCache = /**
     * @protected
     * @param {?} input
     * @return {?}
     */
    function (input) {
        return this.cache.get(input);
    };
    return Tag;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FlexAlign = /** @class */ (function (_super) {
    __extends(FlexAlign, _super);
    function FlexAlign() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'flexAlign';
        return _this;
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    FlexAlign.prototype.build = /**
     * @param {?=} input
     * @return {?}
     */
    function (input) {
        input = input || 'stretch';
        /** @type {?} */
        var cache = this.getCache(input);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        var styles = new Map();
        // Cross-axis
        /** @type {?} */
        var key = 'align-self';
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
    };
    return FlexAlign;
}(Tag));

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-fill.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var STYLES = new Map()
    .set('margin', { value: '0', priority: 0 })
    .set('width', { value: '100%', priority: 0 })
    .set('height', { value: '100%', priority: 0 })
    .set('min-width', { value: '100%', priority: 0 })
    .set('min-height', { value: '100%', priority: 0 });
var FlexFill = /** @class */ (function (_super) {
    __extends(FlexFill, _super);
    function FlexFill() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'flexFill';
        return _this;
    }
    /**
     * @return {?}
     */
    FlexFill.prototype.build = /**
     * @return {?}
     */
    function () {
        return STYLES;
    };
    return FlexFill;
}(Tag));

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-order.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FlexOrder = /** @class */ (function (_super) {
    __extends(FlexOrder, _super);
    function FlexOrder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'flexOrder';
        return _this;
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    FlexOrder.prototype.build = /**
     * @param {?=} input
     * @return {?}
     */
    function (input) {
        input = input || '0';
        /** @type {?} */
        var cache = this.getCache(input);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        var styles = new Map().set(input, { value: parseInt(input, 10), priority: 0 });
        this.setCache(input, styles);
        return styles;
    };
    return FlexOrder;
}(Tag));

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
var INLINE = 'inline';
/** @type {?} */
var LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
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
    var _a = value.split(' '), direction = _a[0], wrap = _a[1], inline = _a[2];
    // First value must be the `flex-direction`
    if (!LAYOUT_VALUES.find((/**
     * @param {?} x
     * @return {?}
     */
    function (x) { return x === direction; }))) {
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
    var flow = validateValue(value)[0];
    return flow.indexOf('row') > -1;
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex-offset.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FlexOffset = /** @class */ (function (_super) {
    __extends(FlexOffset, _super);
    function FlexOffset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'flexOffset';
        _this.deps = ['parent.layout', 'directionality'];
        return _this;
    }
    /**
     * @param {?} input
     * @param {?} layout
     * @param {?} direction
     * @return {?}
     */
    FlexOffset.prototype.build = /**
     * @param {?} input
     * @param {?} layout
     * @param {?} direction
     * @return {?}
     */
    function (input, layout, direction) {
        input = input || '0';
        /** @type {?} */
        var isRtl = direction === 'rtl';
        /** @type {?} */
        var cacheKey = input + layout + isRtl;
        /** @type {?} */
        var cache = this.getCache(cacheKey);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        var isPercent = input.indexOf('%') > -1;
        /** @type {?} */
        var isPx = input.indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+input)) {
            input = input + '%';
        }
        /** @type {?} */
        var horizontalLayoutKey = isRtl ? 'margin-right' : 'margin-left';
        /** @type {?} */
        var key = isFlowHorizontal(layout) ? horizontalLayoutKey : 'margin-top';
        /** @type {?} */
        var styles = new Map().set(key, input);
        this.setCache(cacheKey, styles);
        return styles;
    };
    return FlexOffset;
}(Tag));

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/layout-align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LayoutAlign = /** @class */ (function (_super) {
    __extends(LayoutAlign, _super);
    function LayoutAlign() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'layoutAlign';
        _this.deps = ['self.layout', 'directionality'];
        return _this;
    }
    /**
     * @param {?} input
     * @param {?} layout
     * @return {?}
     */
    LayoutAlign.prototype.build = /**
     * @param {?} input
     * @param {?} layout
     * @return {?}
     */
    function (input, layout) {
        layout = layout || 'row';
        /** @type {?} */
        var cacheKey = input + layout;
        /** @type {?} */
        var cache = this.getCache(cacheKey);
        if (cache) {
            return cache;
        }
        var _a = input.split(' '), mainAxis = _a[0], crossAxis = _a[1];
        /** @type {?} */
        var maxKey = crossAxis === STRETCH && isFlowHorizontal(layout) ? 'max-height' : 'max-width';
        /** @type {?} */
        var styles = new Map()
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
    };
    return LayoutAlign;
}(Tag));
/** @type {?} */
var JUSTIFY_CONTENT = 'justify-content';
/** @type {?} */
var ALIGN_CONTENT = 'align-content';
/** @type {?} */
var ALIGN_ITEMS = 'align-items';
/** @type {?} */
var CENTER = 'center';
/** @type {?} */
var STRETCH = 'stretch';
/** @type {?} */
var BASELINE = 'baseline';
/** @type {?} */
var END = 'end';
/** @type {?} */
var FLEX_END = 'flex-end';
/** @type {?} */
var START = 'start';
/** @type {?} */
var FLEX_START = 'flex-start';
/** @type {?} */
var SPACE_AROUND = 'space-around';
/** @type {?} */
var SPACE_BETWEEN = 'space-between';
/** @type {?} */
var SPACE_EVENLY = 'space-evenly';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/tags.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var FLEX_TAGS = [FlexAlign, FlexFill, FlexOrder, FlexOffset, LayoutAlign];
/** @type {?} */
var GRID_TAGS = [];
/** @type {?} */
var DEFAULT_TAGS = __spreadArrays(FLEX_TAGS, GRID_TAGS);
/** @type {?} */
var LAYOUT_TAGS = new InjectionToken('Angular Layout Tags');
/** @type {?} */
var FLEX_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: FLEX_TAGS,
    multi: true,
};
/** @type {?} */
var GRID_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: GRID_TAGS,
    multi: true,
};
/** @type {?} */
var TAGS_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: DEFAULT_TAGS,
    multi: true,
};
/** @type {?} */
var TAGS = new InjectionToken('Angular Layout Condensed Tags', {
    providedIn: 'root',
    factory: (/**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var providedTags = inject(LAYOUT_TAGS);
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
var GrandCentral = /** @class */ (function () {
    function GrandCentral(directionality, mediaMatcher, bps, tags) {
        var _this = this;
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
                    _this.dirListeners.clear();
                    _this.computeStyles();
                    _this.activating = true;
                }
            }));
        }));
        this.computeActivations();
        directionality.change.subscribe((/**
         * @return {?}
         */
        function () { return _this.dirListeners.forEach(_this.addStyles); }));
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
        this.dirListeners.delete(dir);
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
            var tag = (/** @type {?} */ (_this.tags.get(key)));
            /** @type {?} */
            var priorityMap = _this.calculateStyle(tag.tag, value, dir);
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
        dir.applyStyles(styles);
    };
    /**
     * @private
     * @param {?} tagName
     * @param {?} value
     * @param {?} dir
     * @return {?}
     */
    GrandCentral.prototype.calculateStyle = /**
     * @private
     * @param {?} tagName
     * @param {?} value
     * @param {?} dir
     * @return {?}
     */
    function (tagName, value, dir) {
        /** @type {?} */
        var tag = (/** @type {?} */ (this.tags.get(tagName)));
        /** @type {?} */
        var args = this.resolve(dir, tag.deps);
        return tag.build.apply(tag, __spreadArrays([value], args));
    };
    /**
     * @private
     * @param {?} dir
     * @param {?} deps
     * @return {?}
     */
    GrandCentral.prototype.resolve = /**
     * @private
     * @param {?} dir
     * @param {?} deps
     * @return {?}
     */
    function (dir, deps) {
        var _this = this;
        return deps.map((/**
         * @param {?} dep
         * @return {?}
         */
        function (dep) {
            var _a, _b;
            /** @type {?} */
            var keys = dep.split(KEY_DELIMITER);
            if (keys.length > 1 && keys[0] === PARENT_KEY || keys[0] === SELF_KEY) {
                // TODO: setup listeners, only get triggered when element is updated in isolation
                // does this account for when that element gets updated by directionality?
                /** @type {?} */
                var dataMap = _this.elementDataMap.get(keys[0] === PARENT_KEY ? dir.parent : dir);
                return _b = (_a = dataMap) === null || _a === void 0 ? void 0 : _a.get(dep), _b !== null && _b !== void 0 ? _b : '';
            }
            else if (dep === DIR_KEY) {
                _this.dirListeners.add(dir);
                return _this.directionality.value;
            }
            else {
                return '';
            }
        }));
    };
    GrandCentral.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */
    GrandCentral.ctorParameters = function () { return [
        { type: Directionality },
        { type: MediaMatcher },
        { type: Array, decorators: [{ type: Inject, args: [BPS,] }] },
        { type: Map, decorators: [{ type: Inject, args: [TAGS,] }] }
    ]; };
    /** @nocollapse */ GrandCentral.ɵprov0 = ɵɵdefineInjectable({ factory: function GrandCentral_Factory() { return new GrandCentral(ɵɵinject(Directionality), ɵɵinject(MediaMatcher), ɵɵinject(BPS), ɵɵinject(TAGS)); }, token: GrandCentral, providedIn: "root" });
    return GrandCentral;
}());
/** @type {?} */
var KEY_DELIMITER = '.';
/** @type {?} */
var PARENT_KEY = 'parent';
/** @type {?} */
var SELF_KEY = 'self';
/** @type {?} */
var DIR_KEY = 'directionality';

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
        { type: Directive, args: [{ selector: "bp" },] },
    ];
    /** @nocollapse */
    BreakpointDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    BreakpointDirective.propDecorators = {
        name: [{ type: Input, args: ['tag',] }]
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
        this.fallbackStyles = new Map();
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
     * @param {?} styles
     * @return {?}
     */
    UnifiedDirective.prototype.applyStyles = /**
     * @param {?} styles
     * @return {?}
     */
    function (styles) {
        var _this = this;
        styles.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        function (value, key) {
            if (!_this.fallbackStyles.get(key)) {
                _this.fallbackStyles.set(key, _this.element.style.getPropertyValue(key));
            }
            _this.element.style.setProperty(key, value.value);
        }));
        // TODO: let's say we go xs and that adds max-width, then we go to md, without,
        // does this clear it?
        this.fallbackStyles.forEach((/**
         * @param {?} _
         * @param {?} key
         * @return {?}
         */
        function (_, key) {
            if (!styles.has(key)) {
                _this.element.style.setProperty(key, _this.fallbackStyles.get(key) || '');
            }
        }));
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
        { type: Directive, args: [{ selector: "[ngl]" },] },
    ];
    /** @nocollapse */
    UnifiedDirective.ctorParameters = function () { return [
        { type: UnifiedDirective, decorators: [{ type: Optional }, { type: SkipSelf }] },
        { type: ElementRef },
        { type: Array, decorators: [{ type: Inject, args: [BPS,] }] },
        { type: Map, decorators: [{ type: Inject, args: [TAGS,] }] },
        { type: GrandCentral }
    ]; };
    UnifiedDirective.propDecorators = {
        bpElements: [{ type: ContentChildren, args: [BreakpointDirective,] }]
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
     * @param {?=} withDefaultBp
     * @return {?}
     */
    UnifiedModule.withDefaults = /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    function (withDefaultBp) {
        if (withDefaultBp === void 0) { withDefaultBp = true; }
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                TAGS_PROVIDER,
                BREAKPOINTS_PROVIDER,
            ] : [TAGS_PROVIDER],
        };
    };
    /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    UnifiedModule.withFlex = /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    function (withDefaultBp) {
        if (withDefaultBp === void 0) { withDefaultBp = true; }
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                FLEX_PROVIDER,
                BREAKPOINTS_PROVIDER
            ] : [FLEX_PROVIDER]
        };
    };
    /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    UnifiedModule.withGrid = /**
     * @param {?=} withDefaultBp
     * @return {?}
     */
    function (withDefaultBp) {
        if (withDefaultBp === void 0) { withDefaultBp = true; }
        return {
            ngModule: UnifiedModule,
            providers: withDefaultBp ? [
                GRID_PROVIDER,
                BREAKPOINTS_PROVIDER
            ] : [GRID_PROVIDER]
        };
    };
    UnifiedModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [UnifiedDirective, BreakpointDirective],
                    exports: [UnifiedDirective, BreakpointDirective]
                },] },
    ];
    return UnifiedModule;
}());

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
//# sourceMappingURL=uni.es5.js.map
