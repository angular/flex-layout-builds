/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Input, Injectable, NgModule, Self, Optional, NgZone, Inject, SkipSelf, defineInjectable, inject } from '@angular/core';
import { BaseDirective, MediaMonitor, StyleBuilder, StyleUtils, CoreModule, LAYOUT_CONFIG, validateBasis } from '@angular/flex-layout/core';
import { ReplaySubject } from 'rxjs';
import { Directionality, BidiModule } from '@angular/cdk/bidi';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
  @type {?} */
const INLINE = 'inline';
/** @type {?} */
const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Validate the direction|'direction wrap' value and then update the host's inline flexbox styles
 * @param {?} value
 * @return {?}
 */
function buildLayoutCSS(value) {
    let [direction, wrap, isInline] = validateValue(value);
    return buildCSS(direction, wrap, isInline);
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
    if (!LAYOUT_VALUES.find(x => x === direction)) {
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
                break;
        }
    }
    return value;
}
/**
 * Build the CSS that should be assigned to the element instance
 * BUG:
 *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
 *      Use height instead if possible; height : <xxx>vh;
 *
 *  This way any padding or border specified on the child elements are
 *  laid out and drawn inside that element's specified width and height.
 * @param {?} direction
 * @param {?=} wrap
 * @param {?=} inline
 * @return {?}
 */
function buildCSS(direction, wrap = null, inline = false) {
    return {
        'display': inline ? 'inline-flex' : 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LayoutStyleBuilder extends StyleBuilder {
    /**
     * @param {?} input
     * @param {?} _parent
     * @return {?}
     */
    buildStyles(input, _parent) {
        /** @type {?} */
        const styles = buildLayoutCSS(input);
        return styles;
    }
    /**
     * @param {?} _input
     * @param {?} styles
     * @param {?} parent
     * @return {?}
     */
    sideEffect(_input, styles, parent) {
        parent.announcer.next({
            direction: /** @type {?} */ (styles['flex-direction']),
            wrap: !!styles['flex-wrap'] && styles['flex-wrap'] !== 'nowrap'
        });
    }
}
LayoutStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ LayoutStyleBuilder.ngInjectableDef = defineInjectable({ factory: function LayoutStyleBuilder_Factory() { return new LayoutStyleBuilder(); }, token: LayoutStyleBuilder, providedIn: "root" });
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
class LayoutDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._styleCache = layoutCache;
        this._announcer = new ReplaySubject(1);
        this.layout$ = this._announcer.asObservable();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set layout(val) { this._cacheInput('layout', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutXs(val) { this._cacheInput('layoutXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutSm(val) { this._cacheInput('layoutSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutMd(val) { this._cacheInput('layoutMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLg(val) { this._cacheInput('layoutLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutXl(val) { this._cacheInput('layoutXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtXs(val) { this._cacheInput('layoutGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtSm(val) { this._cacheInput('layoutGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtMd(val) { this._cacheInput('layoutGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutGtLg(val) { this._cacheInput('layoutGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtSm(val) { this._cacheInput('layoutLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtMd(val) { this._cacheInput('layoutLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtLg(val) { this._cacheInput('layoutLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set layoutLtXl(val) { this._cacheInput('layoutLtXl', val); }
    ;
    /**
     * On changes to any \@Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['layout'] != null || this._mqActivation) {
            this._updateWithDirection();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('layout', 'row', (changes) => {
            this._updateWithDirection(changes.value);
        });
    }
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     * @param {?=} value
     * @return {?}
     */
    _updateWithDirection(value) {
        value = value || this._queryInput('layout') || 'row';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this.addStyles(value || '', { announcer: this._announcer });
    }
}
LayoutDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayout],
  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],
  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],
  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]
` },] },
];
/** @nocollapse */
LayoutDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: StyleUtils },
    { type: LayoutStyleBuilder }
];
LayoutDirective.propDecorators = {
    layout: [{ type: Input, args: ['fxLayout',] }],
    layoutXs: [{ type: Input, args: ['fxLayout.xs',] }],
    layoutSm: [{ type: Input, args: ['fxLayout.sm',] }],
    layoutMd: [{ type: Input, args: ['fxLayout.md',] }],
    layoutLg: [{ type: Input, args: ['fxLayout.lg',] }],
    layoutXl: [{ type: Input, args: ['fxLayout.xl',] }],
    layoutGtXs: [{ type: Input, args: ['fxLayout.gt-xs',] }],
    layoutGtSm: [{ type: Input, args: ['fxLayout.gt-sm',] }],
    layoutGtMd: [{ type: Input, args: ['fxLayout.gt-md',] }],
    layoutGtLg: [{ type: Input, args: ['fxLayout.gt-lg',] }],
    layoutLtSm: [{ type: Input, args: ['fxLayout.lt-sm',] }],
    layoutLtMd: [{ type: Input, args: ['fxLayout.lt-md',] }],
    layoutLtLg: [{ type: Input, args: ['fxLayout.lt-lg',] }],
    layoutLtXl: [{ type: Input, args: ['fxLayout.lt-xl',] }]
};
/** @type {?} */
const layoutCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const CLEAR_MARGIN_CSS = {
    'margin-left': null,
    'margin-right': null,
    'margin-top': null,
    'margin-bottom': null
};
class LayoutGapStyleBuilder extends StyleBuilder {
    /**
     * @param {?} _styler
     */
    constructor(_styler) {
        super();
        this._styler = _styler;
    }
    /**
     * @param {?} gapValue
     * @param {?} parent
     * @return {?}
     */
    buildStyles(gapValue, parent) {
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            // Add the margin to the host element
            return buildGridMargin(gapValue, parent.directionality);
        }
        else {
            return {};
        }
    }
    /**
     * @param {?} gapValue
     * @param {?} _styles
     * @param {?} parent
     * @return {?}
     */
    sideEffect(gapValue, _styles, parent) {
        /** @type {?} */
        const items = parent.items;
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            /** @type {?} */
            const paddingStyles = buildGridPadding(gapValue, parent.directionality);
            this._styler.applyStyleToElements(paddingStyles, parent.items);
        }
        else {
            /** @type {?} */
            const lastItem = items.pop();
            /** @type {?} */
            const gapCss = buildGapCSS(gapValue, parent);
            this._styler.applyStyleToElements(gapCss, items);
            // Clear all gaps for all visible elements
            this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [/** @type {?} */ ((lastItem))]);
        }
    }
}
LayoutGapStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
LayoutGapStyleBuilder.ctorParameters = () => [
    { type: StyleUtils }
];
/** @nocollapse */ LayoutGapStyleBuilder.ngInjectableDef = defineInjectable({ factory: function LayoutGapStyleBuilder_Factory() { return new LayoutGapStyleBuilder(inject(StyleUtils)); }, token: LayoutGapStyleBuilder, providedIn: "root" });
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
class LayoutGapDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} container
     * @param {?} _zone
     * @param {?} _directionality
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, container, _zone, _directionality, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this.monitor = monitor;
        this.elRef = elRef;
        this.container = container;
        this._zone = _zone;
        this._directionality = _directionality;
        this.styleUtils = styleUtils;
        this.styleBuilder = styleBuilder;
        this._layout = 'row'; // default flex-direction
        if (container) { // Subscribe to layout direction changes
            // Subscribe to layout direction changes
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
        this._directionWatcher =
            this._directionality.change.subscribe(this._updateWithValue.bind(this));
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set gap(val) { this._cacheInput('gap', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set gapXs(val) { this._cacheInput('gapXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set gapSm(val) { this._cacheInput('gapSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapMd(val) { this._cacheInput('gapMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLg(val) { this._cacheInput('gapLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapXl(val) { this._cacheInput('gapXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtXs(val) { this._cacheInput('gapGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtSm(val) { this._cacheInput('gapGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtMd(val) { this._cacheInput('gapGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapGtLg(val) { this._cacheInput('gapGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtSm(val) { this._cacheInput('gapLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtMd(val) { this._cacheInput('gapLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtLg(val) { this._cacheInput('gapLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set gapLtXl(val) { this._cacheInput('gapLtXl', val); }
    ;
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['gap'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngAfterContentInit() {
        this._watchContentChanges();
        this._listenForMediaQueryChanges('gap', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
        this._updateWithValue();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._observer) {
            this._observer.disconnect();
        }
        if (this._directionWatcher) {
            this._directionWatcher.unsubscribe();
        }
    }
    /**
     * Watch for child nodes to be added... and apply the layout gap styles to each.
     * NOTE: this does NOT! differentiate between viewChildren and contentChildren
     * @return {?}
     */
    _watchContentChanges() {
        this._zone.runOutsideAngular(() => {
            if (typeof MutationObserver !== 'undefined') {
                this._observer = new MutationObserver((mutations) => {
                    /** @type {?} */
                    const validatedChanges = (it) => {
                        return (it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0);
                    };
                    // update gap styles only for child 'added' or 'removed' events
                    if (mutations.some(validatedChanges)) {
                        this._updateWithValue();
                    }
                });
                this._observer.observe(this.nativeElement, { childList: true });
            }
        });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     * @param {?} layout
     * @return {?}
     */
    _onLayoutChange(layout) {
        this._layout = (layout.direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        this._updateWithValue();
    }
    /**
     *
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        /** @type {?} */
        let gapValue = value || this._queryInput('gap') || '0';
        if (this._mqActivation) {
            gapValue = this._mqActivation.activatedInput;
        }
        /** @type {?} */
        const items = this.childrenNodes
            .filter(el => el.nodeType === 1 && this._getDisplayStyle(el) != 'none')
            .sort((a, b) => {
            /** @type {?} */
            const orderA = +this._styler.lookupStyle(a, 'order');
            /** @type {?} */
            const orderB = +this._styler.lookupStyle(b, 'order');
            if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
                return 0;
            }
            else {
                return orderA > orderB ? 1 : -1;
            }
        });
        if (items.length > 0) {
            /** @type {?} */
            const directionality = this._directionality.value;
            /** @type {?} */
            const layout = this._layout;
            if (layout === 'row' && directionality === 'rtl') {
                this._styleCache = layoutGapCacheRowRtl;
            }
            else if (layout === 'row' && directionality !== 'rtl') {
                this._styleCache = layoutGapCacheRowLtr;
            }
            else if (layout === 'column' && directionality === 'rtl') {
                this._styleCache = layoutGapCacheColumnRtl;
            }
            else if (layout === 'column' && directionality !== 'rtl') {
                this._styleCache = layoutGapCacheColumnLtr;
            }
            this.addStyles(gapValue, { directionality, items, layout });
        }
    }
}
LayoutGapDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxLayoutGap],
  [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md], [fxLayoutGap.lg], [fxLayoutGap.xl],
  [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md], [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl],
  [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm], [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`
            },] },
];
/** @nocollapse */
LayoutGapDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self }] },
    { type: NgZone },
    { type: Directionality },
    { type: StyleUtils },
    { type: LayoutGapStyleBuilder }
];
LayoutGapDirective.propDecorators = {
    gap: [{ type: Input, args: ['fxLayoutGap',] }],
    gapXs: [{ type: Input, args: ['fxLayoutGap.xs',] }],
    gapSm: [{ type: Input, args: ['fxLayoutGap.sm',] }],
    gapMd: [{ type: Input, args: ['fxLayoutGap.md',] }],
    gapLg: [{ type: Input, args: ['fxLayoutGap.lg',] }],
    gapXl: [{ type: Input, args: ['fxLayoutGap.xl',] }],
    gapGtXs: [{ type: Input, args: ['fxLayoutGap.gt-xs',] }],
    gapGtSm: [{ type: Input, args: ['fxLayoutGap.gt-sm',] }],
    gapGtMd: [{ type: Input, args: ['fxLayoutGap.gt-md',] }],
    gapGtLg: [{ type: Input, args: ['fxLayoutGap.gt-lg',] }],
    gapLtSm: [{ type: Input, args: ['fxLayoutGap.lt-sm',] }],
    gapLtMd: [{ type: Input, args: ['fxLayoutGap.lt-md',] }],
    gapLtLg: [{ type: Input, args: ['fxLayoutGap.lt-lg',] }],
    gapLtXl: [{ type: Input, args: ['fxLayoutGap.lt-xl',] }]
};
/** @type {?} */
const layoutGapCacheRowRtl = new Map();
/** @type {?} */
const layoutGapCacheColumnRtl = new Map();
/** @type {?} */
const layoutGapCacheRowLtr = new Map();
/** @type {?} */
const layoutGapCacheColumnLtr = new Map();
/** @type {?} */
const GRID_SPECIFIER = ' grid';
/**
 * @param {?} value
 * @param {?} directionality
 * @return {?}
 */
function buildGridPadding(value, directionality) {
    /** @type {?} */
    let paddingTop = '0px';
    /** @type {?} */
    let paddingRight = '0px';
    /** @type {?} */
    let paddingBottom = value;
    /** @type {?} */
    let paddingLeft = '0px';
    if (directionality === 'rtl') {
        paddingLeft = value;
    }
    else {
        paddingRight = value;
    }
    return { 'padding': `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}` };
}
/**
 * @param {?} value
 * @param {?} directionality
 * @return {?}
 */
function buildGridMargin(value, directionality) {
    /** @type {?} */
    let marginTop = '0px';
    /** @type {?} */
    let marginRight = '0px';
    /** @type {?} */
    let marginBottom = '-' + value;
    /** @type {?} */
    let marginLeft = '0px';
    if (directionality === 'rtl') {
        marginLeft = '-' + value;
    }
    else {
        marginRight = '-' + value;
    }
    return { 'margin': `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}` };
}
/**
 * @param {?} gapValue
 * @param {?} parent
 * @return {?}
 */
function buildGapCSS(gapValue, parent) {
    /** @type {?} */
    let key;
    /** @type {?} */
    let margins = Object.assign({}, CLEAR_MARGIN_CSS);
    switch (parent.layout) {
        case 'column':
            key = 'margin-bottom';
            break;
        case 'column-reverse':
            key = 'margin-top';
            break;
        case 'row':
            key = parent.directionality === 'rtl' ? 'margin-left' : 'margin-right';
            break;
        case 'row-reverse':
            key = parent.directionality === 'rtl' ? 'margin-right' : 'margin-left';
            break;
        default:
            key = parent.directionality === 'rtl' ? 'margin-left' : 'margin-right';
            break;
    }
    margins[key] = gapValue;
    return margins;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param {?} dest The object which will have properties copied to it.
 * @param {...?} sources The source objects from which properties will be copied.
 * @return {?}
 */
function extendObject(dest, ...sources) {
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (let source of sources) {
        if (source != null) {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexStyleBuilder extends StyleBuilder {
    /**
     * @param {?} layoutConfig
     */
    constructor(layoutConfig) {
        super();
        this.layoutConfig = layoutConfig;
    }
    /**
     * @param {?} input
     * @param {?} parent
     * @return {?}
     */
    buildStyles(input, parent) {
        let [grow, shrink, ...basisParts] = input.split(' ');
        /** @type {?} */
        let basis = basisParts.join(' ');
        /** @type {?} */
        const direction = (parent.direction.indexOf('column') > -1) ? 'column' : 'row';
        /** @type {?} */
        const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        /** @type {?} */
        const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        /** @type {?} */
        const hasCalc = String(basis).indexOf('calc') > -1;
        /** @type {?} */
        const usingCalc = hasCalc || (basis === 'auto');
        /** @type {?} */
        const isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
        /** @type {?} */
        const hasUnits = String(basis).indexOf('px') > -1 || String(basis).indexOf('em') > -1 ||
            String(basis).indexOf('vw') > -1 || String(basis).indexOf('vh') > -1;
        /** @type {?} */
        const isPx = String(basis).indexOf('px') > -1 || usingCalc;
        /** @type {?} */
        let isValue = (hasCalc || hasUnits);
        grow = (grow == '0') ? 0 : grow;
        shrink = (shrink == '0') ? 0 : shrink;
        /** @type {?} */
        const isFixed = !grow && !shrink;
        /** @type {?} */
        let css = {};
        /** @type {?} */
        const clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
                /** @type {?} */
                const useColumnBasisZero = this.layoutConfig.useColumnBasisZero !== false;
                basis = direction === 'row' ? '0%' : (useColumnBasisZero ? '0.000000001px' : 'auto');
                break;
            case 'initial': // default
            case 'nogrow':
                grow = 0;
                basis = 'auto';
                break;
            case 'grow':
                basis = '100%';
                break;
            case 'noshrink':
                shrink = 0;
                basis = 'auto';
                break;
            case 'auto':
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                basis = 'auto';
                break;
            default:
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN(/** @type {?} */ (basis))) {
                    basis = basis + '%';
                }
                // Fix for issue 280
                if (basis === '0%') {
                    isValue = true;
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                // fix issue #5345
                if (hasCalc) {
                    css = extendObject(clearStyles, {
                        'flex-grow': grow,
                        'flex-shrink': shrink,
                        'flex-basis': isValue ? basis : '100%'
                    });
                }
                else {
                    css = extendObject(clearStyles, {
                        'flex': `${grow} ${shrink} ${isValue ? basis : '100%'}`
                    });
                }
                break;
        }
        if (!(css['flex'] || css['flex-grow'])) {
            if (hasCalc) {
                css = extendObject(clearStyles, {
                    'flex-grow': grow,
                    'flex-shrink': shrink,
                    'flex-basis': basis
                });
            }
            else {
                css = extendObject(clearStyles, {
                    'flex': `${grow} ${shrink} ${basis}`
                });
            }
        }
        // Fix for issues 277, 534, and 728
        if (basis !== '0%' && basis !== '0px' && basis !== '0.000000001px' && basis !== 'auto') {
            css[min] = isFixed || (isPx && grow) ? basis : null;
            css[max] = isFixed || (!usingCalc && shrink) ? basis : null;
        }
        // Fix for issue 528
        if (!css[min] && !css[max]) {
            if (hasCalc) {
                css = extendObject(clearStyles, {
                    'flex-grow': grow,
                    'flex-shrink': shrink,
                    'flex-basis': basis
                });
            }
            else {
                css = extendObject(clearStyles, {
                    'flex': `${grow} ${shrink} ${basis}`
                });
            }
        }
        else {
            // Fix for issue 660
            if (parent.hasWrap) {
                css[hasCalc ? 'flex-basis' : 'flex'] = css[max] ?
                    (hasCalc ? css[max] : `${grow} ${shrink} ${css[max]}`) :
                    (hasCalc ? css[min] : `${grow} ${shrink} ${css[min]}`);
            }
        }
        return /** @type {?} */ (extendObject(css, { 'box-sizing': 'border-box' }));
    }
}
FlexStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
FlexStyleBuilder.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LAYOUT_CONFIG,] }] }
];
/** @nocollapse */ FlexStyleBuilder.ngInjectableDef = defineInjectable({ factory: function FlexStyleBuilder_Factory() { return new FlexStyleBuilder(inject(LAYOUT_CONFIG)); }, token: FlexStyleBuilder, providedIn: "root" });
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
class FlexDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} _container
     * @param {?} styleUtils
     * @param {?} layoutConfig
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, _container, styleUtils, layoutConfig, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._container = _container;
        this.styleUtils = styleUtils;
        this.layoutConfig = layoutConfig;
        this.styleBuilder = styleBuilder;
        this._cacheInput('flex', '');
        this._cacheInput('shrink', 1);
        this._cacheInput('grow', 1);
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set shrink(val) { this._cacheInput('shrink', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set grow(val) { this._cacheInput('grow', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flex(val) { this._cacheInput('flex', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexXs(val) { this._cacheInput('flexXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexSm(val) { this._cacheInput('flexSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexMd(val) { this._cacheInput('flexMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLg(val) { this._cacheInput('flexLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexXl(val) { this._cacheInput('flexXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtXs(val) { this._cacheInput('flexGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtSm(val) { this._cacheInput('flexGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtMd(val) { this._cacheInput('flexGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexGtLg(val) { this._cacheInput('flexGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtSm(val) { this._cacheInput('flexLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtMd(val) { this._cacheInput('flexLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtLg(val) { this._cacheInput('flexLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set flexLtXl(val) { this._cacheInput('flexLtXl', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['flex'] != null || this._mqActivation) {
            this._updateStyle();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('flex', '', (changes) => {
            this._updateStyle(changes.value);
        });
        if (this._container) {
            // If this flex item is inside of a flex container marked with
            // Subscribe to layout immediate parent direction changes
            this._layoutWatcher = this._container.layout$.subscribe((layout) => {
                // `direction` === null if parent container does not have a `fxLayout`
                this._onLayoutChange(layout);
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     * @param {?=} layout
     * @return {?}
     */
    _onLayoutChange(layout) {
        this._layout = layout || this._layout || { direction: 'row', wrap: false };
        this._updateStyle();
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateStyle(value) {
        /** @type {?} */
        let flexBasis = value || this._queryInput('flex') || '';
        if (this._mqActivation) {
            flexBasis = this._mqActivation.activatedInput;
        }
        /** @type {?} */
        const basis = String(flexBasis).replace(';', '');
        /** @type {?} */
        const parts = validateBasis(basis, this._queryInput('grow'), this._queryInput('shrink'));
        /** @type {?} */
        const addFlexToParent = this.layoutConfig.addFlexToParent !== false;
        /** @type {?} */
        const direction = this._getFlexFlowDirection(this.parentElement, addFlexToParent);
        /** @type {?} */
        const hasWrap = this._layout && this._layout.wrap;
        if (direction === 'row' && hasWrap) {
            this._styleCache = flexRowWrapCache;
        }
        else if (direction === 'row' && !hasWrap) {
            this._styleCache = flexRowCache;
        }
        else if (direction === 'column' && hasWrap) {
            this._styleCache = flexColumnWrapCache;
        }
        else if (direction === 'column' && !hasWrap) {
            this._styleCache = flexColumnCache;
        }
        this.addStyles(parts.join(' '), { direction, hasWrap });
    }
}
FlexDirective.decorators = [
    { type: Directive, args: [{
                selector: `
    [fxFlex],
    [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl],
    [fxFlex.lt-sm], [fxFlex.lt-md], [fxFlex.lt-lg], [fxFlex.lt-xl],
    [fxFlex.gt-xs], [fxFlex.gt-sm], [fxFlex.gt-md], [fxFlex.gt-lg],
  `,
            },] },
];
/** @nocollapse */
FlexDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: StyleUtils },
    { type: undefined, decorators: [{ type: Inject, args: [LAYOUT_CONFIG,] }] },
    { type: FlexStyleBuilder }
];
FlexDirective.propDecorators = {
    shrink: [{ type: Input, args: ['fxShrink',] }],
    grow: [{ type: Input, args: ['fxGrow',] }],
    flex: [{ type: Input, args: ['fxFlex',] }],
    flexXs: [{ type: Input, args: ['fxFlex.xs',] }],
    flexSm: [{ type: Input, args: ['fxFlex.sm',] }],
    flexMd: [{ type: Input, args: ['fxFlex.md',] }],
    flexLg: [{ type: Input, args: ['fxFlex.lg',] }],
    flexXl: [{ type: Input, args: ['fxFlex.xl',] }],
    flexGtXs: [{ type: Input, args: ['fxFlex.gt-xs',] }],
    flexGtSm: [{ type: Input, args: ['fxFlex.gt-sm',] }],
    flexGtMd: [{ type: Input, args: ['fxFlex.gt-md',] }],
    flexGtLg: [{ type: Input, args: ['fxFlex.gt-lg',] }],
    flexLtSm: [{ type: Input, args: ['fxFlex.lt-sm',] }],
    flexLtMd: [{ type: Input, args: ['fxFlex.lt-md',] }],
    flexLtLg: [{ type: Input, args: ['fxFlex.lt-lg',] }],
    flexLtXl: [{ type: Input, args: ['fxFlex.lt-xl',] }]
};
/** @type {?} */
const flexRowCache = new Map();
/** @type {?} */
const flexColumnCache = new Map();
/** @type {?} */
const flexRowWrapCache = new Map();
/** @type {?} */
const flexColumnWrapCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexOrderStyleBuilder extends StyleBuilder {
    /**
     * @param {?} value
     * @return {?}
     */
    buildStyles(value) {
        /** @type {?} */
        const val = parseInt(value, 10);
        /** @type {?} */
        const styles = { order: isNaN(val) ? 0 : val };
        return styles;
    }
}
FlexOrderStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ FlexOrderStyleBuilder.ngInjectableDef = defineInjectable({ factory: function FlexOrderStyleBuilder_Factory() { return new FlexOrderStyleBuilder(); }, token: FlexOrderStyleBuilder, providedIn: "root" });
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
class FlexOrderDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._styleCache = flexOrderCache;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set order(val) { this._cacheInput('order', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set orderXs(val) { this._cacheInput('orderXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set orderSm(val) { this._cacheInput('orderSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderMd(val) { this._cacheInput('orderMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLg(val) { this._cacheInput('orderLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderXl(val) { this._cacheInput('orderXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtXs(val) { this._cacheInput('orderGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtSm(val) { this._cacheInput('orderGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtMd(val) { this._cacheInput('orderGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderGtLg(val) { this._cacheInput('orderGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtSm(val) { this._cacheInput('orderLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtMd(val) { this._cacheInput('orderLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtLg(val) { this._cacheInput('orderLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set orderLtXl(val) { this._cacheInput('orderLtXl', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['order'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('order', '0', (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('order') || '0';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this.addStyles(value || '');
    }
}
FlexOrderDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOrder],
  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],
  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],
  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
` },] },
];
/** @nocollapse */
FlexOrderDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: StyleUtils },
    { type: FlexOrderStyleBuilder }
];
FlexOrderDirective.propDecorators = {
    order: [{ type: Input, args: ['fxFlexOrder',] }],
    orderXs: [{ type: Input, args: ['fxFlexOrder.xs',] }],
    orderSm: [{ type: Input, args: ['fxFlexOrder.sm',] }],
    orderMd: [{ type: Input, args: ['fxFlexOrder.md',] }],
    orderLg: [{ type: Input, args: ['fxFlexOrder.lg',] }],
    orderXl: [{ type: Input, args: ['fxFlexOrder.xl',] }],
    orderGtXs: [{ type: Input, args: ['fxFlexOrder.gt-xs',] }],
    orderGtSm: [{ type: Input, args: ['fxFlexOrder.gt-sm',] }],
    orderGtMd: [{ type: Input, args: ['fxFlexOrder.gt-md',] }],
    orderGtLg: [{ type: Input, args: ['fxFlexOrder.gt-lg',] }],
    orderLtSm: [{ type: Input, args: ['fxFlexOrder.lt-sm',] }],
    orderLtMd: [{ type: Input, args: ['fxFlexOrder.lt-md',] }],
    orderLtLg: [{ type: Input, args: ['fxFlexOrder.lt-lg',] }],
    orderLtXl: [{ type: Input, args: ['fxFlexOrder.lt-xl',] }]
};
/** @type {?} */
const flexOrderCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexOffsetStyleBuilder extends StyleBuilder {
    /**
     * @param {?} offset
     * @param {?} parent
     * @return {?}
     */
    buildStyles(offset, parent) {
        /** @type {?} */
        const isPercent = String(offset).indexOf('%') > -1;
        /** @type {?} */
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = offset + '%';
        }
        /** @type {?} */
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        /** @type {?} */
        const styles = isFlowHorizontal(parent.layout) ? { [horizontalLayoutKey]: `${offset}` } :
            { 'margin-top': `${offset}` };
        return styles;
    }
}
FlexOffsetStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ FlexOffsetStyleBuilder.ngInjectableDef = defineInjectable({ factory: function FlexOffsetStyleBuilder_Factory() { return new FlexOffsetStyleBuilder(); }, token: FlexOffsetStyleBuilder, providedIn: "root" });
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
class FlexOffsetDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} _container
     * @param {?} _directionality
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, _container, _directionality, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._container = _container;
        this._directionality = _directionality;
        /**
         * The flex-direction of this element's host container. Defaults to 'row'.
         */
        this._layout = { direction: 'row', wrap: false };
        this._directionWatcher =
            this._directionality.change.subscribe(this._updateWithValue.bind(this));
        this.watchParentFlow();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set offset(val) { this._cacheInput('offset', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetXs(val) { this._cacheInput('offsetXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetSm(val) { this._cacheInput('offsetSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetMd(val) { this._cacheInput('offsetMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLg(val) { this._cacheInput('offsetLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetXl(val) { this._cacheInput('offsetXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtSm(val) { this._cacheInput('offsetLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtMd(val) { this._cacheInput('offsetLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtLg(val) { this._cacheInput('offsetLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetLtXl(val) { this._cacheInput('offsetLtXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtXs(val) { this._cacheInput('offsetGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtSm(val) { this._cacheInput('offsetGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtMd(val) { this._cacheInput('offsetGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set offsetGtLg(val) { this._cacheInput('offsetGtLg', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['offset'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * Cleanup
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
        if (this._directionWatcher) {
            this._directionWatcher.unsubscribe();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('offset', 0, (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    /**
     * If parent flow-direction changes, then update the margin property
     * used to offset
     * @return {?}
     */
    watchParentFlow() {
        if (this._container) {
            // Subscribe to layout immediate parent direction changes (if any)
            this._layoutWatcher = this._container.layout$.subscribe((layout) => {
                // `direction` === null if parent container does not have a `fxLayout`
                this._onLayoutChange(layout);
            });
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     * @param {?=} layout
     * @return {?}
     */
    _onLayoutChange(layout) {
        this._layout = layout || this._layout || { direction: 'row', wrap: false };
        this._updateWithValue();
    }
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('offset') || 0;
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        /** @type {?} */
        const layout = this._getFlexFlowDirection(this.parentElement, true);
        /** @type {?} */
        const isRtl = this._directionality.value === 'rtl';
        if (layout === 'row' && isRtl) {
            this._styleCache = flexOffsetCacheRowRtl;
        }
        else if (layout === 'row' && !isRtl) {
            this._styleCache = flexOffsetCacheRowLtr;
        }
        else if (layout === 'column' && isRtl) {
            this._styleCache = flexOffsetCacheColumnRtl;
        }
        else if (layout === 'column' && !isRtl) {
            this._styleCache = flexOffsetCacheColumnLtr;
        }
        this.addStyles((value && (value + '') || ''), { layout, isRtl });
    }
}
FlexOffsetDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFlexOffset],
  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],
  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],
  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
` },] },
];
/** @nocollapse */
FlexOffsetDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: Directionality },
    { type: StyleUtils },
    { type: FlexOffsetStyleBuilder }
];
FlexOffsetDirective.propDecorators = {
    offset: [{ type: Input, args: ['fxFlexOffset',] }],
    offsetXs: [{ type: Input, args: ['fxFlexOffset.xs',] }],
    offsetSm: [{ type: Input, args: ['fxFlexOffset.sm',] }],
    offsetMd: [{ type: Input, args: ['fxFlexOffset.md',] }],
    offsetLg: [{ type: Input, args: ['fxFlexOffset.lg',] }],
    offsetXl: [{ type: Input, args: ['fxFlexOffset.xl',] }],
    offsetLtSm: [{ type: Input, args: ['fxFlexOffset.lt-sm',] }],
    offsetLtMd: [{ type: Input, args: ['fxFlexOffset.lt-md',] }],
    offsetLtLg: [{ type: Input, args: ['fxFlexOffset.lt-lg',] }],
    offsetLtXl: [{ type: Input, args: ['fxFlexOffset.lt-xl',] }],
    offsetGtXs: [{ type: Input, args: ['fxFlexOffset.gt-xs',] }],
    offsetGtSm: [{ type: Input, args: ['fxFlexOffset.gt-sm',] }],
    offsetGtMd: [{ type: Input, args: ['fxFlexOffset.gt-md',] }],
    offsetGtLg: [{ type: Input, args: ['fxFlexOffset.gt-lg',] }]
};
/** @type {?} */
const flexOffsetCacheRowRtl = new Map();
/** @type {?} */
const flexOffsetCacheColumnRtl = new Map();
/** @type {?} */
const flexOffsetCacheRowLtr = new Map();
/** @type {?} */
const flexOffsetCacheColumnLtr = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexAlignStyleBuilder extends StyleBuilder {
    /**
     * @param {?} input
     * @return {?}
     */
    buildStyles(input) {
        /** @type {?} */
        const styles = {};
        // Cross-axis
        switch (input) {
            case 'start':
                styles['align-self'] = 'flex-start';
                break;
            case 'end':
                styles['align-self'] = 'flex-end';
                break;
            default:
                styles['align-self'] = input;
                break;
        }
        return styles;
    }
}
FlexAlignStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ FlexAlignStyleBuilder.ngInjectableDef = defineInjectable({ factory: function FlexAlignStyleBuilder_Factory() { return new FlexAlignStyleBuilder(); }, token: FlexAlignStyleBuilder, providedIn: "root" });
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
class FlexAlignDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._styleCache = flexAlignCache;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set align(val) { this._cacheInput('align', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXs(val) { this._cacheInput('alignXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    /**
     * For \@Input changes on the current mq activation property, see onMediaQueryChanges()
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    /**
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this.addStyles(value && (value + '') || '');
    }
}
FlexAlignDirective.decorators = [
    { type: Directive, args: [{
                selector: `
  [fxFlexAlign],
  [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md], [fxFlexAlign.lg], [fxFlexAlign.xl],
  [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md], [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl],
  [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm], [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`
            },] },
];
/** @nocollapse */
FlexAlignDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: StyleUtils },
    { type: FlexAlignStyleBuilder }
];
FlexAlignDirective.propDecorators = {
    align: [{ type: Input, args: ['fxFlexAlign',] }],
    alignXs: [{ type: Input, args: ['fxFlexAlign.xs',] }],
    alignSm: [{ type: Input, args: ['fxFlexAlign.sm',] }],
    alignMd: [{ type: Input, args: ['fxFlexAlign.md',] }],
    alignLg: [{ type: Input, args: ['fxFlexAlign.lg',] }],
    alignXl: [{ type: Input, args: ['fxFlexAlign.xl',] }],
    alignLtSm: [{ type: Input, args: ['fxFlexAlign.lt-sm',] }],
    alignLtMd: [{ type: Input, args: ['fxFlexAlign.lt-md',] }],
    alignLtLg: [{ type: Input, args: ['fxFlexAlign.lt-lg',] }],
    alignLtXl: [{ type: Input, args: ['fxFlexAlign.lt-xl',] }],
    alignGtXs: [{ type: Input, args: ['fxFlexAlign.gt-xs',] }],
    alignGtSm: [{ type: Input, args: ['fxFlexAlign.gt-sm',] }],
    alignGtMd: [{ type: Input, args: ['fxFlexAlign.gt-md',] }],
    alignGtLg: [{ type: Input, args: ['fxFlexAlign.gt-lg',] }]
};
/** @type {?} */
const flexAlignCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
class FlexFillStyleBuilder extends StyleBuilder {
    /**
     * @param {?} _input
     * @return {?}
     */
    buildStyles(_input) {
        return FLEX_FILL_CSS;
    }
}
FlexFillStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ FlexFillStyleBuilder.ngInjectableDef = defineInjectable({ factory: function FlexFillStyleBuilder_Factory() { return new FlexFillStyleBuilder(); }, token: FlexFillStyleBuilder, providedIn: "root" });
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
class FlexFillDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this.elRef = elRef;
        this._styleCache = flexFillCache;
        this.addStyles('');
    }
}
FlexFillDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxFill],
  [fxFlexFill]
` },] },
];
/** @nocollapse */
FlexFillDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: StyleUtils },
    { type: FlexFillStyleBuilder }
];
/** @type {?} */
const flexFillCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LayoutAlignStyleBuilder extends StyleBuilder {
    /**
     * @param {?} align
     * @param {?} parent
     * @return {?}
     */
    buildStyles(align, parent) {
        /** @type {?} */
        const css = {};
        const [mainAxis, crossAxis] = align.split(' ');
        // Main axis
        switch (mainAxis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
                break;
            case 'end':
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default:
                css['justify-content'] = 'flex-start'; // default main axis
                break;
        }
        // Cross-axis
        switch (crossAxis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'space-between':
                css['align-content'] = 'space-between';
                css['align-items'] = 'stretch';
                break;
            case 'space-around':
                css['align-content'] = 'space-around';
                css['align-items'] = 'stretch';
                break;
            case 'baseline':
                css['align-content'] = 'stretch';
                css['align-items'] = 'baseline';
                break;
            case 'stretch':
            default: // 'stretch'
                // 'stretch'
                css['align-items'] = css['align-content'] = 'stretch'; // default cross axis
                break;
        }
        return /** @type {?} */ (extendObject(css, {
            'display': 'flex',
            'flex-direction': parent.layout,
            'box-sizing': 'border-box',
            'max-width': crossAxis === 'stretch' ?
                !isFlowHorizontal(parent.layout) ? '100%' : null : null,
            'max-height': crossAxis === 'stretch' ?
                isFlowHorizontal(parent.layout) ? '100%' : null : null,
        }));
    }
}
LayoutAlignStyleBuilder.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ LayoutAlignStyleBuilder.ngInjectableDef = defineInjectable({ factory: function LayoutAlignStyleBuilder_Factory() { return new LayoutAlignStyleBuilder(); }, token: LayoutAlignStyleBuilder, providedIn: "root" });
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 * @see https://css-tricks.com/almanac/properties/j/justify-content/
 * @see https://css-tricks.com/almanac/properties/a/align-items/
 * @see https://css-tricks.com/almanac/properties/a/align-content/
 */
class LayoutAlignDirective extends BaseDirective {
    /**
     * @param {?} monitor
     * @param {?} elRef
     * @param {?} container
     * @param {?} styleUtils
     * @param {?} styleBuilder
     */
    constructor(monitor, elRef, container, styleUtils, styleBuilder) {
        super(monitor, elRef, styleUtils, styleBuilder);
        this._layout = 'row'; // default flex-direction
        if (container) { // Subscribe to layout direction changes
            // Subscribe to layout direction changes
            this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set align(val) { this._cacheInput('align', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXs(val) { this._cacheInput('alignXs', val); }
    /**
     * @param {?} val
     * @return {?}
     */
    set alignSm(val) { this._cacheInput('alignSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignMd(val) { this._cacheInput('alignMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLg(val) { this._cacheInput('alignLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignXl(val) { this._cacheInput('alignXl', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtXs(val) { this._cacheInput('alignGtXs', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtSm(val) { this._cacheInput('alignGtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtMd(val) { this._cacheInput('alignGtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignGtLg(val) { this._cacheInput('alignGtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtSm(val) { this._cacheInput('alignLtSm', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtMd(val) { this._cacheInput('alignLtMd', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtLg(val) { this._cacheInput('alignLtLg', val); }
    ;
    /**
     * @param {?} val
     * @return {?}
     */
    set alignLtXl(val) { this._cacheInput('alignLtXl', val); }
    ;
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['align'] != null || this._mqActivation) {
            this._updateWithValue();
        }
    }
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._listenForMediaQueryChanges('align', 'start stretch', (changes) => {
            this._updateWithValue(changes.value);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._layoutWatcher) {
            this._layoutWatcher.unsubscribe();
        }
    }
    /**
     *
     * @param {?=} value
     * @return {?}
     */
    _updateWithValue(value) {
        value = value || this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        /** @type {?} */
        const layout = this._layout || 'row';
        this._styleCache = layout === 'row' ?
            layoutAlignHorizontalCache : layoutAlignVerticalCache;
        this.addStyles(value || '', { layout });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     * @param {?} layout
     * @return {?}
     */
    _onLayoutChange(layout) {
        this._layout = (layout.direction || '').toLowerCase();
        if (!LAYOUT_VALUES.find(x => x === this._layout)) {
            this._layout = 'row';
        }
        /** @type {?} */
        let value = this._queryInput('align') || 'start stretch';
        if (this._mqActivation) {
            value = this._mqActivation.activatedInput;
        }
        this.addStyles(value, { layout: this._layout || 'row' });
    }
}
LayoutAlignDirective.decorators = [
    { type: Directive, args: [{ selector: `
  [fxLayoutAlign],
  [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg],[fxLayoutAlign.xl],
  [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md], [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl],
  [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm], [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
` },] },
];
/** @nocollapse */
LayoutAlignDirective.ctorParameters = () => [
    { type: MediaMonitor },
    { type: ElementRef },
    { type: LayoutDirective, decorators: [{ type: Optional }, { type: Self }] },
    { type: StyleUtils },
    { type: LayoutAlignStyleBuilder }
];
LayoutAlignDirective.propDecorators = {
    align: [{ type: Input, args: ['fxLayoutAlign',] }],
    alignXs: [{ type: Input, args: ['fxLayoutAlign.xs',] }],
    alignSm: [{ type: Input, args: ['fxLayoutAlign.sm',] }],
    alignMd: [{ type: Input, args: ['fxLayoutAlign.md',] }],
    alignLg: [{ type: Input, args: ['fxLayoutAlign.lg',] }],
    alignXl: [{ type: Input, args: ['fxLayoutAlign.xl',] }],
    alignGtXs: [{ type: Input, args: ['fxLayoutAlign.gt-xs',] }],
    alignGtSm: [{ type: Input, args: ['fxLayoutAlign.gt-sm',] }],
    alignGtMd: [{ type: Input, args: ['fxLayoutAlign.gt-md',] }],
    alignGtLg: [{ type: Input, args: ['fxLayoutAlign.gt-lg',] }],
    alignLtSm: [{ type: Input, args: ['fxLayoutAlign.lt-sm',] }],
    alignLtMd: [{ type: Input, args: ['fxLayoutAlign.lt-md',] }],
    alignLtLg: [{ type: Input, args: ['fxLayoutAlign.lt-lg',] }],
    alignLtXl: [{ type: Input, args: ['fxLayoutAlign.lt-xl',] }]
};
/** @type {?} */
const layoutAlignHorizontalCache = new Map();
/** @type {?} */
const layoutAlignVerticalCache = new Map();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const ALL_DIRECTIVES = [
    LayoutDirective,
    LayoutGapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective,
];
/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */
class FlexModule {
}
FlexModule.decorators = [
    { type: NgModule, args: [{
                imports: [CoreModule, BidiModule],
                declarations: [...ALL_DIRECTIVES],
                exports: [...ALL_DIRECTIVES]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { FlexModule, FlexStyleBuilder, FlexDirective, FlexAlignStyleBuilder, FlexAlignDirective, FlexFillStyleBuilder, FlexFillDirective, FlexOffsetStyleBuilder, FlexOffsetDirective, FlexOrderStyleBuilder, FlexOrderDirective, LayoutStyleBuilder, LayoutDirective, LayoutAlignStyleBuilder, LayoutAlignDirective, LayoutGapStyleBuilder, LayoutGapDirective };
//# sourceMappingURL=flex.js.map
