/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, InjectionToken, Inject, Injectable, ContentChildren, Directive, ElementRef, Input, Optional, SkipSelf, NgModule, ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/breakpoint.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const FALLBACK_BREAKPOINT_KEY = '__FALLBACK__';
/**
 * The fallback breakpoint, which has no real name and is
 * superseded by any other breakpoint value
 * @type {?}
 */
const FALLBACK_BREAKPOINT = {
    name: FALLBACK_BREAKPOINT_KEY,
    media: 'all',
    priority: -Number.MAX_SAFE_INTEGER,
};
/**
 * The default breakpoints as provided by Google's Material Design.
 * These do not include orientation breakpoints or device breakpoints.
 * @type {?}
 */
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
/**
 * The user-facing injection token for providing breakpoints,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 * @type {?}
 */
const BREAKPOINTS = new InjectionToken('Angular Layout Breakpoints');
/**
 * An internal-facing provider for the default breakpoints
 * @type {?}
 */
const BREAKPOINTS_PROVIDER = {
    provide: BREAKPOINTS,
    useValue: DEFAULT_BREAKPOINTS,
    multi: true,
};
/**
 * An internal-facing injection token to consolidate all registered
 * breakpoints for use in the application.
 * @type {?}
 */
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
 * A tag is a way of consolidating logic about a style pattern. For instance,
 * setting the 'flex' attribute could be done with a Flex Tag. Each tag has an
 * associated name, builder, cache, and dependencies on other builder input
 * values.
 * @abstract
 */
class Tag {
    constructor() {
        this.cache = new Map();
        /**
         * The deps required to build this pattern. This can be from the
         * directive the tag is on, its parent, or other outside dependencies
         * like Directionality.
         */
        this.deps = [];
    }
    /**
     * @param {?} input
     * @param {...?} args
     * @return {?}
     */
    compute(input, ...args) {
        /** @type {?} */
        const cacheKey = input + args.join('');
        /** @type {?} */
        const cache = this.getCache(cacheKey);
        if (cache) {
            return cache;
        }
        /** @type {?} */
        const map = this.build(input, ...args);
        this.setCache(input, map);
        return map;
    }
    /**
     * @private
     * @param {?} input
     * @param {?} value
     * @return {?}
     */
    setCache(input, value) {
        this.cache.set(input, value);
    }
    /**
     * @private
     * @param {?} input
     * @return {?}
     */
    getCache(input) {
        return this.cache.get(input);
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/core/fill.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const STYLES = new Map()
    .set('margin', { value: '0', priority: 0 })
    .set('width', { value: '100%', priority: 0 })
    .set('height', { value: '100%', priority: 0 })
    .set('min-width', { value: '100%', priority: 0 })
    .set('min-height', { value: '100%', priority: 0 });
class Fill extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'fill';
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
 * Generated from: uni/src/tags/core/gap.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Gap extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'gap';
        this.deps = ['self.layout', 'directionality'];
    }
    /**
     * @param {?} _
     * @param {?} __
     * @param {?} ___
     * @return {?}
     */
    build(_, __, ___) {
        /** @type {?} */
        const styles = new Map();
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/utils.ts
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
 * Generated from: uni/src/tags/core/offset.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Offset extends Tag {
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
        return new Map().set(key, input);
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/core/order.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Order extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'order';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || '0';
        return new Map().set('order', { value: parseInt(input, 10), priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/constants.ts
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
const JUSTIFY_CONTENT = 'justify-content';
/** @type {?} */
const JUSTIFY_ITEMS = 'justify-items';
/** @type {?} */
const JUSTIFY_SELF = 'justify-self';
/** @type {?} */
const ALIGN_CONTENT = 'align-content';
/** @type {?} */
const ALIGN_ITEMS = 'align-items';
/** @type {?} */
const ALIGN_SELF = 'align-self';
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
/** @type {?} */
const KEY_DELIMITER = '.';
/** @type {?} */
const PARENT_KEY = 'parent';
/** @type {?} */
const SELF_KEY = 'self';
/** @type {?} */
const DIR_KEY = 'directionality';
/** @type {?} */
const CLASS_KEY = 'class';
/** @type {?} */
const STYLE_KEY = 'style';
/** @type {?} */
const ATTR_KEY = 'attr';
/**
 * Special key to clear an applied value and restore the fallback
 * @type {?}
 */
const CLEAR_VALUE = '__CLEAR__';
/**
 * Special key indicating that a value cannot be resolved for a dependency
 * @type {?}
 */
const NO_VALUE = '__NO_VALUE__';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/core/show-hide.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const HIDE_STYLES = new Map().set('display', { value: 'none', priority: 100 });
/** @type {?} */
const EMPTY_MAP = new Map();
class Hide extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'hide';
        this.deps = ['self.show'];
    }
    /**
     * @param {?} input
     * @param {?} show
     * @return {?}
     */
    build(input, show) {
        return coerceBooleanProperty(input) && show === NO_VALUE ? HIDE_STYLES : EMPTY_MAP;
    }
}
class Show extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'show';
    }
    /**
     * @return {?}
     */
    build() {
        return EMPTY_MAP;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/flex.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Flex extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'flex';
        this.deps = ['parent.layout'];
    }
    /**
     * @param {?} input
     * @param {?} layout
     * @return {?}
     */
    build(input, layout) {
        /** @type {?} */
        const styles = new Map()
            .set('box-sizing', { value: 'border-box', priority: 0 });
        /** @type {?} */
        const wrap = layout.indexOf('wrap') > -1;
        let [grow, shrink, ...basisParts] = input.split(' ');
        /** @type {?} */
        const zeroIndex = basisParts.indexOf('zero');
        /** @type {?} */
        const useColumnBasisZero = zeroIndex > -1;
        /** @type {?} */
        let basis = !useColumnBasisZero ? basisParts.join(' ') : basisParts.splice(zeroIndex, 1).join(' ');
        // The flex-direction of this element's flex container. Defaults to 'row'.
        /** @type {?} */
        const direction = layout.indexOf('column') > -1 ? 'column' : 'row';
        /** @type {?} */
        const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        /** @type {?} */
        const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        /** @type {?} */
        const hasCalc = basis.indexOf('calc') > -1;
        /** @type {?} */
        const usingCalc = hasCalc || (basis === 'auto');
        /** @type {?} */
        const isPercent = basis.indexOf('%') > -1 && !hasCalc;
        /** @type {?} */
        const hasUnits = basis.indexOf('px') > -1 || basis.indexOf('rem') > -1 ||
            basis.indexOf('em') > -1 || basis.indexOf('vw') > -1 || basis.indexOf('vh') > -1;
        /** @type {?} */
        let isValue = (hasCalc || hasUnits);
        // make box inflexible when shrink and grow are both zero
        // should not set a min when the grow is zero
        // should not set a max when the shrink is zero
        /** @type {?} */
        const isFixed = !grow && !shrink;
        // flex-basis allows you to specify the initial/starting main-axis size of the element,
        // before anything else is computed. It can either be a percentage or an absolute value.
        // It is, however, not the breaking point for flex-grow/shrink properties
        //
        // flex-grow can be seen as this:
        //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
        //   1: (Default value). Stretch; will be the same size to all other flex items on
        //       the same row since they have a default value of 1.
        //   ≥2 (integer n): Stretch. Will be n times the size of other elements
        //      with 'flex-grow: 1' on the same row.
        switch (basis) {
            case '':
                basis = direction === 'row' ? '0%' : (useColumnBasisZero ? '0.000000001px' : 'auto');
                break;
            // default
            case 'initial':
            case 'nogrow':
                grow = '0';
                basis = 'auto';
                break;
            case 'grow':
                basis = '100%';
                break;
            case 'noshrink':
                shrink = '0';
                basis = 'auto';
                break;
            case 'auto':
                break;
            case 'none':
                grow = '0';
                shrink = '0';
                basis = 'auto';
                break;
            default:
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN((/** @type {?} */ (basis)))) {
                    basis = basis + '%';
                }
                // Fix for issue #280
                if (basis === '0%') {
                    isValue = true;
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                // Fix for issue #5345
                if (hasCalc) {
                    styles.set('flex-grow', { value: grow, priority: 0 });
                    styles.set('flex-shrink', { value: shrink, priority: 0 });
                    styles.set('flex-basis', { value: isValue ? basis : '100%', priority: 0 });
                }
                else {
                    styles.set('flex', { value: `${grow} ${shrink} ${isValue ? basis : '100%'}`, priority: 0 });
                }
                break;
        }
        if (!styles.has('flex') || !styles.has('flex-grow')) {
            if (hasCalc) {
                styles.set('flex-grow', { value: grow, priority: 0 });
                styles.set('flex-shrink', { value: shrink, priority: 0 });
                styles.set('flex-basis', { value: basis, priority: 0 });
            }
            else {
                styles.set('flex', { value: `${grow} ${shrink} ${basis}`, priority: 0 });
            }
        }
        // Fix for issues #277, #534, and #728
        if (basis !== '0%' && basis !== '0px' && basis !== '0.000000001px' && basis !== 'auto') {
            if (isFixed) {
                styles.set(min, { value: basis, priority: 0 });
                styles.set(max, { value: basis, priority: 0 });
            }
            else {
                if (isValue && grow) {
                    styles.set(min, { value: basis, priority: 0 });
                }
                if (!usingCalc && shrink) {
                    styles.set(max, { value: basis, priority: 0 });
                }
            }
        }
        // Fix for issue #528
        if (!styles.has(min) && !styles.has(max)) {
            if (hasCalc) {
                styles.set('flex-grow', { value: grow, priority: 0 });
                styles.set('flex-shrink', { value: shrink, priority: 0 });
                styles.set('flex-basis', { value: basis, priority: 0 });
            }
            else {
                styles.set('flex', { value: `${grow} ${shrink} ${basis}`, priority: 0 });
            }
        }
        else {
            // Fix for issue #660
            if (wrap) {
                /** @type {?} */
                const value = styles.has(max) ? (/** @type {?} */ (styles.get(max))).value : (/** @type {?} */ (styles.get(min))).value;
                styles.set(hasCalc ? 'flex-basis' : 'flex', { value: hasCalc ? value : `${grow} ${shrink} ${value}`, priority: 0 });
            }
        }
        return styles;
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
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || STRETCH;
        /** @type {?} */
        const styles = new Map();
        // Cross-axis
        switch (input) {
            case START:
                styles.set(ALIGN_SELF, { value: FLEX_START, priority: 0 });
                break;
            case END:
                styles.set(ALIGN_SELF, { value: FLEX_END, priority: 0 });
                break;
            default:
                styles.set(ALIGN_SELF, { value: input, priority: 0 });
                break;
        }
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
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/flex/layout.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Layout extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'layout';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        const [direction, wrap, isInline] = validateValue(input);
        /** @type {?} */
        const styles = new Map()
            .set('display', { value: isInline ? 'inline-flex' : 'flex', priority: 1 })
            .set('box-sizing', { value: 'border-box', priority: 0 })
            .set('flex-direction', { value: direction, priority: 0 });
        if (!!wrap) {
            styles.set('flex-wrap', { value: wrap, priority: 0 });
        }
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/gap.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * 'grid-gap' CSS Grid styling directive
 * Configures the gap between items in the grid
 * Syntax: <row gap> [<column-gap>]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-17
 */
class GridGap extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'gridGap';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || '0';
        return new Map()
            .set('display', { value: 'grid', priority: -1 })
            .set('grid-gap', { value: input, priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/inline.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const INLINE_STYLES = new Map().set('display', { value: 'inline-grid', priority: 1 });
class Inline extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'inline';
    }
    /**
     * @return {?}
     */
    build() {
        return INLINE_STYLES;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/align-columns.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AlignColumns extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'alignColumns';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        const [mainAxis, crossAxis] = input.split(' ');
        /** @type {?} */
        const styles = new Map();
        // Main axis
        switch (mainAxis) {
            case CENTER:
            case SPACE_AROUND:
            case SPACE_BETWEEN:
            case SPACE_EVENLY:
            case END:
            case START:
            case STRETCH:
                styles.set(ALIGN_CONTENT, { value: mainAxis, priority: 0 });
                break;
            default:
                styles.set(ALIGN_CONTENT, { value: DEFAULT_MAIN, priority: 0 });
        }
        // Cross-axis
        switch (crossAxis) {
            case START:
            case CENTER:
            case END:
            case STRETCH:
                styles.set(ALIGN_ITEMS, { value: crossAxis, priority: 0 });
                break;
            default:
                styles.set(ALIGN_ITEMS, { value: DEFAULT_CROSS, priority: 0 });
        }
        return styles;
    }
}
/** @type {?} */
const DEFAULT_MAIN = 'start';
/** @type {?} */
const DEFAULT_CROSS = 'stretch';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/align-rows.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AlignRows extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'alignRows';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        const [mainAxis, crossAxis] = input.split(' ');
        /** @type {?} */
        const styles = new Map();
        // Main axis
        switch (mainAxis) {
            case CENTER:
            case SPACE_AROUND:
            case SPACE_BETWEEN:
            case SPACE_EVENLY:
            case END:
            case START:
            case STRETCH:
                styles.set(JUSTIFY_CONTENT, { value: mainAxis, priority: 0 });
                break;
            default:
                styles.set(JUSTIFY_CONTENT, { value: DEFAULT_MAIN$1, priority: 0 });
        }
        // Cross-axis
        switch (crossAxis) {
            case START:
            case CENTER:
            case END:
            case STRETCH:
                styles.set(JUSTIFY_ITEMS, { value: crossAxis, priority: 0 });
                break;
            default:
                styles.set(JUSTIFY_ITEMS, { value: DEFAULT_CROSS$1, priority: 0 });
        }
        return styles;
    }
}
/** @type {?} */
const DEFAULT_MAIN$1 = 'start';
/** @type {?} */
const DEFAULT_CROSS$1 = 'stretch';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/area.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Area extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'area';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'auto';
        return new Map().set('grid-area', { value: input, priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/areas.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Areas extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'areas';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        /** @type {?} */
        const areas = (input || DEFAULT_VALUE).split(DELIMETER).map((/**
         * @param {?} v
         * @return {?}
         */
        v => `"${v.trim()}"`));
        return new Map()
            .set('display', { value: 'grid', priority: 0 })
            .set('grid-template-areas', { value: areas.join(' '), priority: 0 });
    }
}
/** @type {?} */
const DEFAULT_VALUE = 'none';
/** @type {?} */
const DELIMETER = '|';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/auto.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Auto extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'auto';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'initial';
        let [direction, dense] = input.split(' ');
        if (direction !== 'column' && direction !== 'row' && direction !== 'dense') {
            direction = 'row';
        }
        dense = (dense === 'dense' && direction !== 'dense') ? ' dense' : '';
        return new Map()
            .set('display', { value: 'grid', priority: 0 })
            .set('grid-auto-flow', { value: direction + dense, priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/align.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Align extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'gridAlign';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'stretch';
        /** @type {?} */
        const styles = new Map();
        const [rowAxis, columnAxis] = input.split(' ');
        // Row axis
        switch (rowAxis) {
            case END:
            case CENTER:
            case STRETCH:
            case START:
                styles.set(JUSTIFY_SELF, { value: rowAxis, priority: 0 });
                break;
            default:
                styles.set(JUSTIFY_SELF, { value: STRETCH, priority: 0 });
        }
        // Column axis
        switch (columnAxis) {
            case END:
            case CENTER:
            case STRETCH:
            case START:
                styles.set(ALIGN_SELF, { value: rowAxis, priority: 0 });
                break;
            default:
                styles.set(ALIGN_SELF, { value: STRETCH, priority: 0 });
        }
        return styles;
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/column.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Column extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'column';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'auto';
        return new Map().set('grid-column', { value: input, priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/columns.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Columns extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'columns';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'none';
        /** @type {?} */
        let auto = false;
        if (input.endsWith(AUTO_SPECIFIER)) {
            input = input.substring(0, input.indexOf(AUTO_SPECIFIER));
            auto = true;
        }
        /** @type {?} */
        const key = auto ? 'grid-auto-columns' : 'grid-template-columns';
        return new Map()
            .set('display', { value: 'grid', priority: 0 })
            .set(key, { value: input, priority: 0 });
    }
}
/** @type {?} */
const AUTO_SPECIFIER = '!';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/row.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Row extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'row';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'auto';
        return new Map().set('grid-row', { value: input, priority: 0 });
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/grid/rows.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Rows extends Tag {
    constructor() {
        super(...arguments);
        this.tag = 'rows';
    }
    /**
     * @param {?} input
     * @return {?}
     */
    build(input) {
        input = input || 'none';
        /** @type {?} */
        let auto = false;
        if (input.endsWith(AUTO_SPECIFIER$1)) {
            input = input.substring(0, input.indexOf(AUTO_SPECIFIER$1));
            auto = true;
        }
        /** @type {?} */
        const key = auto ? 'grid-auto-rows' : 'grid-template-rows';
        return new Map()
            .set('display', { value: 'grid', priority: 0 })
            .set(key, { value: input, priority: 0 });
    }
}
/** @type {?} */
const AUTO_SPECIFIER$1 = '!';

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/tags/tags.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * All of the extended features that are not CSS standard
 * @type {?}
 */
const CORE_TAGS = [
    new Fill(),
    new Gap(),
    new Hide(),
    new Offset(),
    new Order(),
    new Show()
];
/**
 * All of the standard CSS flexbox-related tags
 * @type {?}
 */
const FLEX_TAGS = [
    new Flex(),
    new FlexAlign(),
    new LayoutAlign(),
    new Layout(),
];
/**
 * All of the standard CSS grid-related tags
 * @type {?}
 */
const GRID_TAGS = [
    new Inline(),
    new GridGap(),
    new AlignColumns(),
    new AlignRows(),
    new Area(),
    new Areas(),
    new Auto(),
    new Align(),
    new Column(),
    new Columns(),
    new Row(),
    new Rows(),
];
/**
 * The default tags as provided by Angular Layout. These include both
 * flex and grid type tags.
 * @type {?}
 */
const DEFAULT_TAGS = [...CORE_TAGS, ...FLEX_TAGS, ...GRID_TAGS];
/**
 * The user-facing injection token for providing tags,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 * @type {?}
 */
const LAYOUT_TAGS = new InjectionToken('Angular Layout Tags');
/**
 * An internal-facing provider for the default flex tags
 * @type {?}
 */
const FLEX_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: FLEX_TAGS,
    multi: true,
};
/**
 * An internal-facing provider for the default grid tags
 * @type {?}
 */
const GRID_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: GRID_TAGS,
    multi: true,
};
/**
 * An internal-facing provider for the default tags
 * @type {?}
 */
const TAGS_PROVIDER = {
    provide: LAYOUT_TAGS,
    useValue: DEFAULT_TAGS,
    multi: true,
};
/**
 * An internal-facing injection token to consolidate all registered
 * tags for use in the application.
 * @type {?}
 */
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
                tagsMap.set(tag.tag, tag);
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
/**
 * GrandCentral is a switchyard for all of the various Layout directives
 * registered in an application. It is the single source of truth for all of
 * the layout changes that occur in an application. For instance, any changes
 * to the browser state via registered media queries are monitored and updated
 * in this service. The directives themselves simply store their respective values
 * for each of the media states.
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
        this.elListeners = new Map();
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
                    this.elListeners.clear();
                    this.activating = true;
                    this.computeValues();
                }
            }));
        }));
        this.computeActivations();
        directionality.change.subscribe((/**
         * @return {?}
         */
        () => this.dirListeners.forEach(this.addValues)));
    }
    /**
     * Add a directive for a corresponding breakpoint
     * @param {?} dir
     * @param {?} bp
     * @return {?}
     */
    addDirective(dir, bp) {
        (/** @type {?} */ (this.elementsMap.get(bp))).add(dir);
        this.updateDirective(dir);
    }
    /**
     * Trigger an update for a directive
     * @param {?} dir
     * @return {?}
     */
    updateDirective(dir) {
        this.computeDirective(dir);
        this.addValues(dir);
        /** @type {?} */
        const listeners = this.elListeners.get(dir);
        if (listeners) {
            listeners.forEach(this.addValues);
        }
    }
    /**
     * Remove a directive from all future updates
     * @param {?} dir
     * @return {?}
     */
    removeDirective(dir) {
        this.dirListeners.delete(dir);
        /** @type {?} */
        const parentListeners = this.elListeners.get(dir.parent);
        if (parentListeners) {
            parentListeners.delete(dir);
        }
        this.bps.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => (/** @type {?} */ (this.elementsMap.get(bp))).delete(dir)));
    }
    /**
     * Compute the active breakpoints and sort by descending priority
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
     * Compute the values and update the directives for all active breakpoints
     * @private
     * @return {?}
     */
    computeValues() {
        this.computeActivations();
        this.activations.forEach((/**
         * @param {?} bp
         * @return {?}
         */
        bp => (/** @type {?} */ (this.elementsMap.get(bp))).forEach(this.computeDirective.bind(this))));
        Array.from(this.elementDataMap.keys()).forEach(this.addValues.bind(this));
        this.activating = false;
    }
    /**
     * Compute the values for an individual directive
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
     * Add the computed values for an individual directive
     * @private
     * @param {?} dir
     * @return {?}
     */
    addValues(dir) {
        /** @type {?} */
        const values = (/** @type {?} */ (this.elementDataMap.get(dir)));
        /** @type {?} */
        const map = new Map();
        values.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
            /** @type {?} */
            const tag = (/** @type {?} */ (this.tags.get(key)));
            /** @type {?} */
            const priorityMap = this.calculate(tag.tag, value, dir);
            priorityMap.forEach((/**
             * @param {?} v
             * @param {?} k
             * @return {?}
             */
            (v, k) => {
                let [type, typeKey] = k.split(KEY_DELIMITER);
                if (typeKey === undefined) {
                    typeKey = type;
                    type = STYLE_KEY;
                }
                k = [type, typeKey].join(KEY_DELIMITER);
                /** @type {?} */
                const valuePriority = map.get(k);
                if (!valuePriority || valuePriority.priority < v.priority) {
                    map.set(k, v);
                }
            }));
        }));
        dir.apply(map);
    }
    /**
     * Compute the values to apply for a directive given a tag and input value
     * @private
     * @param {?} tagName
     * @param {?} value
     * @param {?} dir
     * @return {?}
     */
    calculate(tagName, value, dir) {
        /** @type {?} */
        const tag = (/** @type {?} */ (this.tags.get(tagName)));
        /** @type {?} */
        const args = this.resolve(dir, tag.deps);
        return tag.compute(value, ...args);
    }
    /**
     * Resolve the arguments for a builder given a directive
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
            var _a;
            /** @type {?} */
            const keys = dep.split(KEY_DELIMITER);
            if (keys.length > 1 && keys[0] === PARENT_KEY || keys[0] === SELF_KEY) {
                // NOTE: elListeners does not account for directionality change, because
                // the assumption is that directionality does not change the parent values
                /** @type {?} */
                const dataMap = this.elementDataMap.get(keys[0] === PARENT_KEY ? dir.parent : dir);
                if (dataMap) {
                    /** @type {?} */
                    const elements = this.elListeners.get(dir.parent) || new Set();
                    elements.add(dir);
                    this.elListeners.set(dir.parent, elements);
                    return _a = dataMap.get(keys[1]), _a !== null && _a !== void 0 ? _a : NO_VALUE;
                }
            }
            else if (dep === DIR_KEY) {
                this.dirListeners.add(dir);
                return this.directionality.value;
            }
            return NO_VALUE;
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
/** @nocollapse */ GrandCentral.ɵprov = ɵɵdefineInjectable({ factory: function GrandCentral_Factory() { return new GrandCentral(ɵɵinject(Directionality), ɵɵinject(MediaMatcher), ɵɵinject(BPS), ɵɵinject(TAGS)); }, token: GrandCentral, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: uni/src/unified.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * This is a simplistic, wrapping directive meant only to
 * capture and record values for individual breakpoints.
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
/**
 * One directive to rule them all. This directive is responsible for
 * tagging an HTML element as part of the layout system, and then
 * coordinating all updates with GrandCentral.
 */
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
        this.fallbacks = new Map(Array.from(this.element.classList).map((/**
         * @param {?} c
         * @return {?}
         */
        c => [c, ''])));
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
            if (attr !== null) {
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
                if (attr !== null) {
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
     * Apply the given styles, attributes, and classes to the underlying HTMLElement
     * @param {?} map
     * @return {?}
     */
    apply(map) {
        /** @type {?} */
        const keys = new Set(this.fallbacks.keys());
        map.forEach((/**
         * @param {?} value
         * @param {?} key
         * @return {?}
         */
        (value, key) => {
            let [type, typeKey] = key.split(KEY_DELIMITER);
            if (typeKey === undefined) {
                typeKey = type;
                type = STYLE_KEY;
            }
            if (!this.fallbacks.has(key)) {
                switch (type) {
                    case ATTR_KEY:
                        this.fallbacks.set(key, (/** @type {?} */ (this.element.getAttribute(typeKey))));
                        break;
                    case STYLE_KEY:
                    default:
                        this.fallbacks.set(key, this.element.style.getPropertyValue(typeKey));
                }
            }
            if (value.value === CLEAR_VALUE) {
                return;
            }
            this.addToElement(type, typeKey, value.value);
            keys.delete(key);
        }));
        keys.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            let [type, typeKey] = key.split(KEY_DELIMITER);
            if (typeKey === undefined) {
                typeKey = type;
                type = STYLE_KEY;
            }
            /** @type {?} */
            const value = (/** @type {?} */ (this.fallbacks.get(key)));
            this.addToElement(type, typeKey, value);
        }));
    }
    /**
     * Apply the given value to the underlying HTMLElement
     * @private
     * @param {?} type
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    addToElement(type, key, value) {
        switch (type) {
            case ATTR_KEY:
                this.element.setAttribute(key, value);
                break;
            case CLASS_KEY:
                this.element.classList.add(key);
                break;
            case STYLE_KEY:
            default:
                this.element.style.setProperty(key, value);
        }
    }
    /**
     * Process a MutationObserver's attribute-type mutation
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

export { BREAKPOINTS, DEFAULT_BREAKPOINTS, FLEX_TAGS, GRID_TAGS, LAYOUT_TAGS, DEFAULT_TAGS, Tag, GrandCentral, BreakpointDirective, UnifiedDirective, UnifiedModule, BPS as ɵflex_layout_privateb, BREAKPOINTS_PROVIDER as ɵflex_layout_privatea, Fill as ɵflex_layout_privatex, Gap as ɵflex_layout_privatey, Offset as ɵflex_layout_privatebb, Order as ɵflex_layout_privatebc, Hide as ɵflex_layout_privatez, Show as ɵflex_layout_privateba, Flex as ɵflex_layout_privateh, FlexAlign as ɵflex_layout_privatei, Layout as ɵflex_layout_privatek, LayoutAlign as ɵflex_layout_privatej, Align as ɵflex_layout_privates, AlignColumns as ɵflex_layout_privaten, AlignRows as ɵflex_layout_privateo, Area as ɵflex_layout_privatep, Areas as ɵflex_layout_privateq, Auto as ɵflex_layout_privater, Column as ɵflex_layout_privatet, Columns as ɵflex_layout_privateu, GridGap as ɵflex_layout_privatem, Inline as ɵflex_layout_privatel, Row as ɵflex_layout_privatev, Rows as ɵflex_layout_privatew, CORE_TAGS as ɵflex_layout_privatec, FLEX_PROVIDER as ɵflex_layout_privated, GRID_PROVIDER as ɵflex_layout_privatee, TAGS as ɵflex_layout_privateg, TAGS_PROVIDER as ɵflex_layout_privatef };
//# sourceMappingURL=uni.js.map
