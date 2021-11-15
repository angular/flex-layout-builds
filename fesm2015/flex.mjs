/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as i0 from '@angular/core';
import { Directive, Injectable, NgModule, Inject, Input, ɵɵngDeclareFactory, ɵɵFactoryTarget, ɵɵngDeclareNgModule, ɵɵngDeclareInjector, ɵɵngDeclareClassMetadata, ɵɵngDeclareInjectable, ElementRef, ɵɵngDeclareDirective, NgZone } from '@angular/core';
import { BaseDirective2, StyleBuilder, CoreModule, LAYOUT_CONFIG, validateBasis, StyleUtils, MediaMarshaller } from '@angular/flex-layout/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BidiModule, Directionality } from '@angular/cdk/bidi';

const INLINE = 'inline';
const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Validate the direction|'direction wrap' value and then update the host's inline flexbox styles
 */
function buildLayoutCSS(value) {
    let [direction, wrap, isInline] = validateValue(value);
    return buildCSS(direction, wrap, isInline);
}
/**
  * Validate the value to be one of the acceptable value options
  * Use default fallback of 'row'
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
 */
function isFlowHorizontal(value) {
    let [flow,] = validateValue(value);
    return flow.indexOf('row') > -1;
}
/**
 * Convert layout-wrap='<value>' to expected flex-wrap style
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
 */
function buildCSS(direction, wrap = null, inline = false) {
    return {
        'display': inline ? 'inline-flex' : 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}

class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return buildLayoutCSS(input);
    }
}
LayoutStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
LayoutStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxLayout', 'fxLayout.xs', 'fxLayout.sm', 'fxLayout.md',
    'fxLayout.lg', 'fxLayout.xl', 'fxLayout.lt-sm', 'fxLayout.lt-md',
    'fxLayout.lt-lg', 'fxLayout.lt-xl', 'fxLayout.gt-xs', 'fxLayout.gt-sm',
    'fxLayout.gt-md', 'fxLayout.gt-lg'
];
const selector = `
  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],
  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],
  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],
  [fxLayout.gt-md], [fxLayout.gt-lg]
`;
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
class LayoutDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout';
        this.styleCache = layoutCache;
        this.init();
    }
}
LayoutDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: LayoutStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
LayoutDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: LayoutDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: LayoutStyleBuilder }, { type: MediaMarshaller }]; } });
class DefaultLayoutDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultLayoutDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultLayoutDirective, selector: "\n  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],\n  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],\n  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],\n  [fxLayout.gt-md], [fxLayout.gt-lg]\n", inputs: { fxLayout: "fxLayout", "fxLayout.xs": "fxLayout.xs", "fxLayout.sm": "fxLayout.sm", "fxLayout.md": "fxLayout.md", "fxLayout.lg": "fxLayout.lg", "fxLayout.xl": "fxLayout.xl", "fxLayout.lt-sm": "fxLayout.lt-sm", "fxLayout.lt-md": "fxLayout.lt-md", "fxLayout.lt-lg": "fxLayout.lt-lg", "fxLayout.lt-xl": "fxLayout.lt-xl", "fxLayout.gt-xs": "fxLayout.gt-xs", "fxLayout.gt-sm": "fxLayout.gt-sm", "fxLayout.gt-md": "fxLayout.gt-md", "fxLayout.gt-lg": "fxLayout.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutCache = new Map();

const CLEAR_MARGIN_CSS = {
    'margin-left': null,
    'margin-right': null,
    'margin-top': null,
    'margin-bottom': null
};
class LayoutGapStyleBuilder extends StyleBuilder {
    constructor(_styler) {
        super();
        this._styler = _styler;
    }
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
    sideEffect(gapValue, _styles, parent) {
        const items = parent.items;
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            // For each `element` children, set the padding
            const paddingStyles = buildGridPadding(gapValue, parent.directionality);
            this._styler.applyStyleToElements(paddingStyles, parent.items);
        }
        else {
            const lastItem = items.pop();
            // For each `element` children EXCEPT the last,
            // set the margin right/bottom styles...
            const gapCss = buildGapCSS(gapValue, parent);
            this._styler.applyStyleToElements(gapCss, items);
            // Clear all gaps for all visible elements
            this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [lastItem]);
        }
    }
}
LayoutGapStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutGapStyleBuilder, deps: [{ token: StyleUtils }], target: ɵɵFactoryTarget.Injectable });
LayoutGapStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutGapStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutGapStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: StyleUtils }]; } });
const inputs$1 = [
    'fxLayoutGap', 'fxLayoutGap.xs', 'fxLayoutGap.sm', 'fxLayoutGap.md',
    'fxLayoutGap.lg', 'fxLayoutGap.xl', 'fxLayoutGap.lt-sm', 'fxLayoutGap.lt-md',
    'fxLayoutGap.lt-lg', 'fxLayoutGap.lt-xl', 'fxLayoutGap.gt-xs', 'fxLayoutGap.gt-sm',
    'fxLayoutGap.gt-md', 'fxLayoutGap.gt-lg'
];
const selector$1 = `
  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],
  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],
  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],
  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`;
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
class LayoutGapDirective extends BaseDirective2 {
    constructor(elRef, zone, directionality, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.zone = zone;
        this.directionality = directionality;
        this.styleUtils = styleUtils;
        this.layout = 'row'; // default flex-direction
        this.DIRECTIVE_KEY = 'layout-gap';
        this.observerSubject = new Subject();
        const extraTriggers = [this.directionality.change, this.observerSubject.asObservable()];
        this.init(extraTriggers);
        this.marshal
            .trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    /** Special accessor to query for all child 'element' nodes regardless of type, class, etc */
    get childrenNodes() {
        const obj = this.nativeElement.children;
        const buffer = [];
        // iterate backwards ensuring that length is an UInt32
        for (let i = obj.length; i--;) {
            buffer[i] = obj[i];
        }
        return buffer;
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    ngAfterContentInit() {
        this.buildChildObservable();
        this.triggerUpdate();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.observer) {
            this.observer.disconnect();
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     */
    onLayoutChange(matcher) {
        const layout = matcher.value;
        // Make sure to filter out 'wrap' option
        const direction = layout.split(' ');
        this.layout = direction[0];
        if (!LAYOUT_VALUES.find(x => x === this.layout)) {
            this.layout = 'row';
        }
        this.triggerUpdate();
    }
    /**
     *
     */
    updateWithValue(value) {
        // Gather all non-hidden Element nodes
        const items = this.childrenNodes
            .filter(el => el.nodeType === 1 && this.willDisplay(el))
            .sort((a, b) => {
            const orderA = +this.styler.lookupStyle(a, 'order');
            const orderB = +this.styler.lookupStyle(b, 'order');
            if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
                return 0;
            }
            else {
                return orderA > orderB ? 1 : -1;
            }
        });
        if (items.length > 0) {
            const directionality = this.directionality.value;
            const layout = this.layout;
            if (layout === 'row' && directionality === 'rtl') {
                this.styleCache = layoutGapCacheRowRtl;
            }
            else if (layout === 'row' && directionality !== 'rtl') {
                this.styleCache = layoutGapCacheRowLtr;
            }
            else if (layout === 'column' && directionality === 'rtl') {
                this.styleCache = layoutGapCacheColumnRtl;
            }
            else if (layout === 'column' && directionality !== 'rtl') {
                this.styleCache = layoutGapCacheColumnLtr;
            }
            this.addStyles(value, { directionality, items, layout });
        }
    }
    /** We need to override clearStyles because in most cases mru isn't populated */
    clearStyles() {
        const gridMode = Object.keys(this.mru).length > 0;
        const childrenStyle = gridMode ? 'padding' :
            getMarginType(this.directionality.value, this.layout);
        // If there are styles on the parent remove them
        if (gridMode) {
            super.clearStyles();
        }
        // Then remove the children styles too
        this.styleUtils.applyStyleToElements({ [childrenStyle]: '' }, this.childrenNodes);
    }
    /** Determine if an element will show or hide based on current activation */
    willDisplay(source) {
        const value = this.marshal.getValue(source, 'show-hide');
        return value === true ||
            (value === undefined && this.styleUtils.lookupStyle(source, 'display') !== 'none');
    }
    buildChildObservable() {
        this.zone.runOutsideAngular(() => {
            if (typeof MutationObserver !== 'undefined') {
                this.observer = new MutationObserver((mutations) => {
                    const validatedChanges = (it) => {
                        return (it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0);
                    };
                    // update gap styles only for child 'added' or 'removed' events
                    if (mutations.some(validatedChanges)) {
                        this.observerSubject.next();
                    }
                });
                this.observer.observe(this.nativeElement, { childList: true });
            }
        });
    }
}
LayoutGapDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutGapDirective, deps: [{ token: ElementRef }, { token: NgZone }, { token: Directionality }, { token: StyleUtils }, { token: LayoutGapStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
LayoutGapDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: LayoutGapDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutGapDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: NgZone }, { type: Directionality }, { type: StyleUtils }, { type: LayoutGapStyleBuilder }, { type: MediaMarshaller }]; } });
class DefaultLayoutGapDirective extends LayoutGapDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$1;
    }
}
DefaultLayoutGapDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutGapDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultLayoutGapDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultLayoutGapDirective, selector: "\n  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],\n  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],\n  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],\n  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]\n", inputs: { fxLayoutGap: "fxLayoutGap", "fxLayoutGap.xs": "fxLayoutGap.xs", "fxLayoutGap.sm": "fxLayoutGap.sm", "fxLayoutGap.md": "fxLayoutGap.md", "fxLayoutGap.lg": "fxLayoutGap.lg", "fxLayoutGap.xl": "fxLayoutGap.xl", "fxLayoutGap.lt-sm": "fxLayoutGap.lt-sm", "fxLayoutGap.lt-md": "fxLayoutGap.lt-md", "fxLayoutGap.lt-lg": "fxLayoutGap.lt-lg", "fxLayoutGap.lt-xl": "fxLayoutGap.lt-xl", "fxLayoutGap.gt-xs": "fxLayoutGap.gt-xs", "fxLayoutGap.gt-sm": "fxLayoutGap.gt-sm", "fxLayoutGap.gt-md": "fxLayoutGap.gt-md", "fxLayoutGap.gt-lg": "fxLayoutGap.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutGapDirective, decorators: [{
            type: Directive,
            args: [{ selector: selector$1, inputs: inputs$1 }]
        }] });
const layoutGapCacheRowRtl = new Map();
const layoutGapCacheColumnRtl = new Map();
const layoutGapCacheRowLtr = new Map();
const layoutGapCacheColumnLtr = new Map();
const GRID_SPECIFIER = ' grid';
function buildGridPadding(value, directionality) {
    const [between, below] = value.split(' ');
    const bottom = below || between;
    let paddingRight = '0px', paddingBottom = bottom, paddingLeft = '0px';
    if (directionality === 'rtl') {
        paddingLeft = between;
    }
    else {
        paddingRight = between;
    }
    return { 'padding': `0px ${paddingRight} ${paddingBottom} ${paddingLeft}` };
}
function buildGridMargin(value, directionality) {
    const [between, below] = value.split(' ');
    const bottom = below || between;
    const minus = (str) => `-${str}`;
    let marginRight = '0px', marginBottom = minus(bottom), marginLeft = '0px';
    if (directionality === 'rtl') {
        marginLeft = minus(between);
    }
    else {
        marginRight = minus(between);
    }
    return { 'margin': `0px ${marginRight} ${marginBottom} ${marginLeft}` };
}
function getMarginType(directionality, layout) {
    switch (layout) {
        case 'column':
            return 'margin-bottom';
        case 'column-reverse':
            return 'margin-top';
        case 'row':
            return directionality === 'rtl' ? 'margin-left' : 'margin-right';
        case 'row-reverse':
            return directionality === 'rtl' ? 'margin-right' : 'margin-left';
        default:
            return directionality === 'rtl' ? 'margin-left' : 'margin-right';
    }
}
function buildGapCSS(gapValue, parent) {
    const key = getMarginType(parent.directionality, parent.layout);
    const margins = Object.assign({}, CLEAR_MARGIN_CSS);
    margins[key] = gapValue;
    return margins;
}

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
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

class FlexStyleBuilder extends StyleBuilder {
    constructor(layoutConfig) {
        super();
        this.layoutConfig = layoutConfig;
    }
    buildStyles(input, parent) {
        let [grow, shrink, ...basisParts] = input.split(' ');
        let basis = basisParts.join(' ');
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const direction = (parent.direction.indexOf('column') > -1) ? 'column' : 'row';
        const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        const hasCalc = String(basis).indexOf('calc') > -1;
        const usingCalc = hasCalc || (basis === 'auto');
        const isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
        const hasUnits = String(basis).indexOf('px') > -1 || String(basis).indexOf('rem') > -1 ||
            String(basis).indexOf('em') > -1 || String(basis).indexOf('vw') > -1 ||
            String(basis).indexOf('vh') > -1;
        let isValue = (hasCalc || hasUnits);
        grow = (grow == '0') ? 0 : grow;
        shrink = (shrink == '0') ? 0 : shrink;
        // make box inflexible when shrink and grow are both zero
        // should not set a min when the grow is zero
        // should not set a max when the shrink is zero
        const isFixed = !grow && !shrink;
        let css = {};
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
        // Use `null` to clear existing styles.
        const clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null
        };
        switch (basis || '') {
            case '':
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
                if (!isValue && !isPercent && !isNaN(basis)) {
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
            css[min] = isFixed || (isValue && grow) ? basis : null;
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
        return extendObject(css, { 'box-sizing': 'border-box' });
    }
}
FlexStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexStyleBuilder, deps: [{ token: LAYOUT_CONFIG }], target: ɵɵFactoryTarget.Injectable });
FlexStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
const inputs$2 = [
    'fxFlex', 'fxFlex.xs', 'fxFlex.sm', 'fxFlex.md',
    'fxFlex.lg', 'fxFlex.xl', 'fxFlex.lt-sm', 'fxFlex.lt-md',
    'fxFlex.lt-lg', 'fxFlex.lt-xl', 'fxFlex.gt-xs', 'fxFlex.gt-sm',
    'fxFlex.gt-md', 'fxFlex.gt-lg'
];
const selector$2 = `
  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],
  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],
  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],
  [fxFlex.gt-md], [fxFlex.gt-lg]
`;
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
class FlexDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, layoutConfig, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.layoutConfig = layoutConfig;
        this.marshal = marshal;
        this.DIRECTIVE_KEY = 'flex';
        this.direction = undefined;
        this.wrap = undefined;
        this.flexGrow = '1';
        this.flexShrink = '1';
        this.init();
    }
    get shrink() { return this.flexShrink; }
    set shrink(value) {
        this.flexShrink = value || '1';
        this.triggerReflow();
    }
    get grow() { return this.flexGrow; }
    set grow(value) {
        this.flexGrow = value || '1';
        this.triggerReflow();
    }
    ngOnInit() {
        if (this.parentElement) {
            this.marshal.trackValue(this.parentElement, 'layout')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.onLayoutChange.bind(this));
            this.marshal.trackValue(this.nativeElement, 'layout-align')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerReflow.bind(this));
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     */
    onLayoutChange(matcher) {
        const layout = matcher.value;
        const layoutParts = layout.split(' ');
        this.direction = layoutParts[0];
        this.wrap = layoutParts[1] !== undefined && layoutParts[1] === 'wrap';
        this.triggerUpdate();
    }
    /** Input to this is exclusively the basis input value */
    updateWithValue(value) {
        const addFlexToParent = this.layoutConfig.addFlexToParent !== false;
        if (this.direction === undefined) {
            this.direction = this.getFlexFlowDirection(this.parentElement, addFlexToParent);
        }
        if (this.wrap === undefined) {
            this.wrap = this.hasWrap(this.parentElement);
        }
        const direction = this.direction;
        const isHorizontal = direction.startsWith('row');
        const hasWrap = this.wrap;
        if (isHorizontal && hasWrap) {
            this.styleCache = flexRowWrapCache;
        }
        else if (isHorizontal && !hasWrap) {
            this.styleCache = flexRowCache;
        }
        else if (!isHorizontal && hasWrap) {
            this.styleCache = flexColumnWrapCache;
        }
        else if (!isHorizontal && !hasWrap) {
            this.styleCache = flexColumnCache;
        }
        const basis = String(value).replace(';', '');
        const parts = validateBasis(basis, this.flexGrow, this.flexShrink);
        this.addStyles(parts.join(' '), { direction, hasWrap });
    }
    /** Trigger a style reflow, usually based on a shrink/grow input event */
    triggerReflow() {
        const activatedValue = this.activatedValue;
        if (activatedValue !== undefined) {
            const parts = validateBasis(activatedValue + '', this.flexGrow, this.flexShrink);
            this.marshal.updateElement(this.nativeElement, this.DIRECTIVE_KEY, parts.join(' '));
        }
    }
}
FlexDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: LAYOUT_CONFIG }, { token: FlexStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
FlexDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: FlexDirective, inputs: { shrink: ["fxShrink", "shrink"], grow: ["fxGrow", "grow"] }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: FlexStyleBuilder }, { type: MediaMarshaller }]; }, propDecorators: { shrink: [{
                type: Input,
                args: ['fxShrink']
            }], grow: [{
                type: Input,
                args: ['fxGrow']
            }] } });
class DefaultFlexDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$2;
    }
}
DefaultFlexDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultFlexDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultFlexDirective, selector: "\n  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],\n  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],\n  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],\n  [fxFlex.gt-md], [fxFlex.gt-lg]\n", inputs: { fxFlex: "fxFlex", "fxFlex.xs": "fxFlex.xs", "fxFlex.sm": "fxFlex.sm", "fxFlex.md": "fxFlex.md", "fxFlex.lg": "fxFlex.lg", "fxFlex.xl": "fxFlex.xl", "fxFlex.lt-sm": "fxFlex.lt-sm", "fxFlex.lt-md": "fxFlex.lt-md", "fxFlex.lt-lg": "fxFlex.lt-lg", "fxFlex.lt-xl": "fxFlex.lt-xl", "fxFlex.gt-xs": "fxFlex.gt-xs", "fxFlex.gt-sm": "fxFlex.gt-sm", "fxFlex.gt-md": "fxFlex.gt-md", "fxFlex.gt-lg": "fxFlex.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexDirective, decorators: [{
            type: Directive,
            args: [{ inputs: inputs$2, selector: selector$2 }]
        }] });
const flexRowCache = new Map();
const flexColumnCache = new Map();
const flexRowWrapCache = new Map();
const flexColumnWrapCache = new Map();

class FlexOrderStyleBuilder extends StyleBuilder {
    buildStyles(value) {
        return { order: (value && parseInt(value, 10)) || '' };
    }
}
FlexOrderStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOrderStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
FlexOrderStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOrderStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOrderStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs$3 = [
    'fxFlexOrder', 'fxFlexOrder.xs', 'fxFlexOrder.sm', 'fxFlexOrder.md',
    'fxFlexOrder.lg', 'fxFlexOrder.xl', 'fxFlexOrder.lt-sm', 'fxFlexOrder.lt-md',
    'fxFlexOrder.lt-lg', 'fxFlexOrder.lt-xl', 'fxFlexOrder.gt-xs', 'fxFlexOrder.gt-sm',
    'fxFlexOrder.gt-md', 'fxFlexOrder.gt-lg'
];
const selector$3 = `
  [fxFlexOrder], [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md],
  [fxFlexOrder.lg], [fxFlexOrder.xl], [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md],
  [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl], [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm],
  [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
`;
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
class FlexOrderDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'flex-order';
        this.styleCache = flexOrderCache;
        this.init();
    }
}
FlexOrderDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOrderDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: FlexOrderStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
FlexOrderDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: FlexOrderDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOrderDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: FlexOrderStyleBuilder }, { type: MediaMarshaller }]; } });
const flexOrderCache = new Map();
class DefaultFlexOrderDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$3;
    }
}
DefaultFlexOrderDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexOrderDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultFlexOrderDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultFlexOrderDirective, selector: "\n  [fxFlexOrder], [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md],\n  [fxFlexOrder.lg], [fxFlexOrder.xl], [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md],\n  [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl], [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm],\n  [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]\n", inputs: { fxFlexOrder: "fxFlexOrder", "fxFlexOrder.xs": "fxFlexOrder.xs", "fxFlexOrder.sm": "fxFlexOrder.sm", "fxFlexOrder.md": "fxFlexOrder.md", "fxFlexOrder.lg": "fxFlexOrder.lg", "fxFlexOrder.xl": "fxFlexOrder.xl", "fxFlexOrder.lt-sm": "fxFlexOrder.lt-sm", "fxFlexOrder.lt-md": "fxFlexOrder.lt-md", "fxFlexOrder.lt-lg": "fxFlexOrder.lt-lg", "fxFlexOrder.lt-xl": "fxFlexOrder.lt-xl", "fxFlexOrder.gt-xs": "fxFlexOrder.gt-xs", "fxFlexOrder.gt-sm": "fxFlexOrder.gt-sm", "fxFlexOrder.gt-md": "fxFlexOrder.gt-md", "fxFlexOrder.gt-lg": "fxFlexOrder.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexOrderDirective, decorators: [{
            type: Directive,
            args: [{ selector: selector$3, inputs: inputs$3 }]
        }] });

class FlexOffsetStyleBuilder extends StyleBuilder {
    buildStyles(offset, parent) {
        if (offset === '') {
            offset = '0';
        }
        const isPercent = String(offset).indexOf('%') > -1;
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = offset + '%';
        }
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        const styles = isFlowHorizontal(parent.layout) ?
            { [horizontalLayoutKey]: `${offset}` } : { 'margin-top': `${offset}` };
        return styles;
    }
}
FlexOffsetStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOffsetStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
FlexOffsetStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOffsetStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOffsetStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs$4 = [
    'fxFlexOffset', 'fxFlexOffset.xs', 'fxFlexOffset.sm', 'fxFlexOffset.md',
    'fxFlexOffset.lg', 'fxFlexOffset.xl', 'fxFlexOffset.lt-sm', 'fxFlexOffset.lt-md',
    'fxFlexOffset.lt-lg', 'fxFlexOffset.lt-xl', 'fxFlexOffset.gt-xs', 'fxFlexOffset.gt-sm',
    'fxFlexOffset.gt-md', 'fxFlexOffset.gt-lg'
];
const selector$4 = `
  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],
  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],
  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],
  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`;
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
class FlexOffsetDirective extends BaseDirective2 {
    constructor(elRef, directionality, styleBuilder, marshal, styler) {
        super(elRef, styleBuilder, styler, marshal);
        this.directionality = directionality;
        this.DIRECTIVE_KEY = 'flex-offset';
        this.init([this.directionality.change]);
        // Parent DOM `layout-gap` with affect the nested child with `flex-offset`
        if (this.parentElement) {
            this.marshal
                .trackValue(this.parentElement, 'layout-gap')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     */
    updateWithValue(value = '') {
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const layout = this.getFlexFlowDirection(this.parentElement, true);
        const isRtl = this.directionality.value === 'rtl';
        if (layout === 'row' && isRtl) {
            this.styleCache = flexOffsetCacheRowRtl;
        }
        else if (layout === 'row' && !isRtl) {
            this.styleCache = flexOffsetCacheRowLtr;
        }
        else if (layout === 'column' && isRtl) {
            this.styleCache = flexOffsetCacheColumnRtl;
        }
        else if (layout === 'column' && !isRtl) {
            this.styleCache = flexOffsetCacheColumnLtr;
        }
        this.addStyles(value + '', { layout, isRtl });
    }
}
FlexOffsetDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOffsetDirective, deps: [{ token: ElementRef }, { token: Directionality }, { token: FlexOffsetStyleBuilder }, { token: MediaMarshaller }, { token: StyleUtils }], target: ɵɵFactoryTarget.Directive });
FlexOffsetDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: FlexOffsetDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexOffsetDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: Directionality }, { type: FlexOffsetStyleBuilder }, { type: MediaMarshaller }, { type: StyleUtils }]; } });
class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$4;
    }
}
DefaultFlexOffsetDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexOffsetDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultFlexOffsetDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultFlexOffsetDirective, selector: "\n  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],\n  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],\n  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],\n  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n", inputs: { fxFlexOffset: "fxFlexOffset", "fxFlexOffset.xs": "fxFlexOffset.xs", "fxFlexOffset.sm": "fxFlexOffset.sm", "fxFlexOffset.md": "fxFlexOffset.md", "fxFlexOffset.lg": "fxFlexOffset.lg", "fxFlexOffset.xl": "fxFlexOffset.xl", "fxFlexOffset.lt-sm": "fxFlexOffset.lt-sm", "fxFlexOffset.lt-md": "fxFlexOffset.lt-md", "fxFlexOffset.lt-lg": "fxFlexOffset.lt-lg", "fxFlexOffset.lt-xl": "fxFlexOffset.lt-xl", "fxFlexOffset.gt-xs": "fxFlexOffset.gt-xs", "fxFlexOffset.gt-sm": "fxFlexOffset.gt-sm", "fxFlexOffset.gt-md": "fxFlexOffset.gt-md", "fxFlexOffset.gt-lg": "fxFlexOffset.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexOffsetDirective, decorators: [{
            type: Directive,
            args: [{ selector: selector$4, inputs: inputs$4 }]
        }] });
const flexOffsetCacheRowRtl = new Map();
const flexOffsetCacheColumnRtl = new Map();
const flexOffsetCacheRowLtr = new Map();
const flexOffsetCacheColumnLtr = new Map();

class FlexAlignStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        input = input || 'stretch';
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
FlexAlignStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexAlignStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
FlexAlignStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexAlignStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs$5 = [
    'fxFlexAlign', 'fxFlexAlign.xs', 'fxFlexAlign.sm', 'fxFlexAlign.md',
    'fxFlexAlign.lg', 'fxFlexAlign.xl', 'fxFlexAlign.lt-sm', 'fxFlexAlign.lt-md',
    'fxFlexAlign.lt-lg', 'fxFlexAlign.lt-xl', 'fxFlexAlign.gt-xs', 'fxFlexAlign.gt-sm',
    'fxFlexAlign.gt-md', 'fxFlexAlign.gt-lg'
];
const selector$5 = `
  [fxFlexAlign], [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md],
  [fxFlexAlign.lg], [fxFlexAlign.xl], [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md],
  [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl], [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm],
  [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`;
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
class FlexAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'flex-align';
        this.styleCache = flexAlignCache;
        this.init();
    }
}
FlexAlignDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexAlignDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: FlexAlignStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
FlexAlignDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: FlexAlignDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: FlexAlignStyleBuilder }, { type: MediaMarshaller }]; } });
const flexAlignCache = new Map();
class DefaultFlexAlignDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$5;
    }
}
DefaultFlexAlignDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexAlignDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultFlexAlignDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultFlexAlignDirective, selector: "\n  [fxFlexAlign], [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md],\n  [fxFlexAlign.lg], [fxFlexAlign.xl], [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md],\n  [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl], [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm],\n  [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]\n", inputs: { fxFlexAlign: "fxFlexAlign", "fxFlexAlign.xs": "fxFlexAlign.xs", "fxFlexAlign.sm": "fxFlexAlign.sm", "fxFlexAlign.md": "fxFlexAlign.md", "fxFlexAlign.lg": "fxFlexAlign.lg", "fxFlexAlign.xl": "fxFlexAlign.xl", "fxFlexAlign.lt-sm": "fxFlexAlign.lt-sm", "fxFlexAlign.lt-md": "fxFlexAlign.lt-md", "fxFlexAlign.lt-lg": "fxFlexAlign.lt-lg", "fxFlexAlign.lt-xl": "fxFlexAlign.lt-xl", "fxFlexAlign.gt-xs": "fxFlexAlign.gt-xs", "fxFlexAlign.gt-sm": "fxFlexAlign.gt-sm", "fxFlexAlign.gt-md": "fxFlexAlign.gt-md", "fxFlexAlign.gt-lg": "fxFlexAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultFlexAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector: selector$5, inputs: inputs$5 }]
        }] });

const FLEX_FILL_CSS = {
    'margin': 0,
    'width': '100%',
    'height': '100%',
    'min-width': '100%',
    'min-height': '100%'
};
class FlexFillStyleBuilder extends StyleBuilder {
    buildStyles(_input) {
        return FLEX_FILL_CSS;
    }
}
FlexFillStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexFillStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
FlexFillStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexFillStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexFillStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
class FlexFillDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.styleCache = flexFillCache;
        this.addStyles('');
    }
}
FlexFillDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexFillDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: FlexFillStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
FlexFillDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: FlexFillDirective, selector: "[fxFill], [fxFlexFill]", usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexFillDirective, decorators: [{
            type: Directive,
            args: [{ selector: `[fxFill], [fxFlexFill]` }]
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: FlexFillStyleBuilder }, { type: MediaMarshaller }]; } });
const flexFillCache = new Map();

class LayoutAlignStyleBuilder extends StyleBuilder {
    buildStyles(align, parent) {
        const css = {}, [mainAxis, crossAxis] = align.split(' ');
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
                css['align-items'] = css['align-content'] = 'stretch'; // default cross axis
                break;
        }
        return extendObject(css, {
            'display': parent.inline ? 'inline-flex' : 'flex',
            'flex-direction': parent.layout,
            'box-sizing': 'border-box',
            'max-width': crossAxis === 'stretch' ?
                !isFlowHorizontal(parent.layout) ? '100%' : null : null,
            'max-height': crossAxis === 'stretch' ?
                isFlowHorizontal(parent.layout) ? '100%' : null : null,
        });
    }
}
LayoutAlignStyleBuilder.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutAlignStyleBuilder, deps: null, target: ɵɵFactoryTarget.Injectable });
LayoutAlignStyleBuilder.ɵprov = ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutAlignStyleBuilder, providedIn: 'root' });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs$6 = [
    'fxLayoutAlign', 'fxLayoutAlign.xs', 'fxLayoutAlign.sm', 'fxLayoutAlign.md',
    'fxLayoutAlign.lg', 'fxLayoutAlign.xl', 'fxLayoutAlign.lt-sm', 'fxLayoutAlign.lt-md',
    'fxLayoutAlign.lt-lg', 'fxLayoutAlign.lt-xl', 'fxLayoutAlign.gt-xs', 'fxLayoutAlign.gt-sm',
    'fxLayoutAlign.gt-md', 'fxLayoutAlign.gt-lg'
];
const selector$6 = `
  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],
  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],
  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],
  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
`;
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
class LayoutAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout-align';
        this.layout = 'row'; // default flex-direction
        this.inline = false; // default inline value
        this.init();
        this.marshal.trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    updateWithValue(value) {
        const layout = this.layout || 'row';
        const inline = this.inline;
        if (layout === 'row' && inline) {
            this.styleCache = layoutAlignHorizontalInlineCache;
        }
        else if (layout === 'row' && !inline) {
            this.styleCache = layoutAlignHorizontalCache;
        }
        else if (layout === 'row-reverse' && inline) {
            this.styleCache = layoutAlignHorizontalRevInlineCache;
        }
        else if (layout === 'row-reverse' && !inline) {
            this.styleCache = layoutAlignHorizontalRevCache;
        }
        else if (layout === 'column' && inline) {
            this.styleCache = layoutAlignVerticalInlineCache;
        }
        else if (layout === 'column' && !inline) {
            this.styleCache = layoutAlignVerticalCache;
        }
        else if (layout === 'column-reverse' && inline) {
            this.styleCache = layoutAlignVerticalRevInlineCache;
        }
        else if (layout === 'column-reverse' && !inline) {
            this.styleCache = layoutAlignVerticalRevCache;
        }
        this.addStyles(value, { layout, inline });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    onLayoutChange(matcher) {
        const layoutKeys = matcher.value.split(' ');
        this.layout = layoutKeys[0];
        this.inline = matcher.value.includes('inline');
        if (!LAYOUT_VALUES.find(x => x === this.layout)) {
            this.layout = 'row';
        }
        this.triggerUpdate();
    }
}
LayoutAlignDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutAlignDirective, deps: [{ token: ElementRef }, { token: StyleUtils }, { token: LayoutAlignStyleBuilder }, { token: MediaMarshaller }], target: ɵɵFactoryTarget.Directive });
LayoutAlignDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: LayoutAlignDirective, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LayoutAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: ElementRef }, { type: StyleUtils }, { type: LayoutAlignStyleBuilder }, { type: MediaMarshaller }]; } });
class DefaultLayoutAlignDirective extends LayoutAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs$6;
    }
}
DefaultLayoutAlignDirective.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutAlignDirective, deps: null, target: ɵɵFactoryTarget.Directive });
DefaultLayoutAlignDirective.ɵdir = ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: DefaultLayoutAlignDirective, selector: "\n  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],\n  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],\n  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],\n  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]\n", inputs: { fxLayoutAlign: "fxLayoutAlign", "fxLayoutAlign.xs": "fxLayoutAlign.xs", "fxLayoutAlign.sm": "fxLayoutAlign.sm", "fxLayoutAlign.md": "fxLayoutAlign.md", "fxLayoutAlign.lg": "fxLayoutAlign.lg", "fxLayoutAlign.xl": "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm": "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md": "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg": "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl": "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs": "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm": "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md": "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg": "fxLayoutAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: DefaultLayoutAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector: selector$6, inputs: inputs$6 }]
        }] });
const layoutAlignHorizontalCache = new Map();
const layoutAlignVerticalCache = new Map();
const layoutAlignHorizontalRevCache = new Map();
const layoutAlignVerticalRevCache = new Map();
const layoutAlignHorizontalInlineCache = new Map();
const layoutAlignVerticalInlineCache = new Map();
const layoutAlignHorizontalRevInlineCache = new Map();
const layoutAlignVerticalRevInlineCache = new Map();

const ALL_DIRECTIVES = [
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexOrderDirective,
    DefaultFlexOffsetDirective,
    FlexFillDirective,
    DefaultFlexAlignDirective,
    DefaultFlexDirective,
];
/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */
class FlexModule {
}
FlexModule.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, deps: [], target: ɵɵFactoryTarget.NgModule });
FlexModule.ɵmod = ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, declarations: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective], imports: [CoreModule, BidiModule], exports: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective] });
FlexModule.ɵinj = ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, imports: [[CoreModule, BidiModule]] });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule, BidiModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { FlexModule, FlexStyleBuilder, FlexDirective, DefaultFlexDirective, FlexAlignStyleBuilder, FlexAlignDirective, DefaultFlexAlignDirective, FlexFillStyleBuilder, FlexFillDirective, FlexOffsetStyleBuilder, FlexOffsetDirective, DefaultFlexOffsetDirective, FlexOrderStyleBuilder, FlexOrderDirective, DefaultFlexOrderDirective, LayoutStyleBuilder, LayoutDirective, DefaultLayoutDirective, LayoutAlignStyleBuilder, LayoutAlignDirective, DefaultLayoutAlignDirective, LayoutGapStyleBuilder, LayoutGapDirective, DefaultLayoutGapDirective };
//# sourceMappingURL=flex.mjs.map
