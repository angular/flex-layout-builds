/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Inject, } from '@angular/core';
import { BaseDirective2, StyleBuilder, LAYOUT_CONFIG, ɵmultiply as multiply, } from '@angular/flex-layout/core';
import { LAYOUT_VALUES } from '@angular/flex-layout/_private-utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
import * as i2 from "@angular/cdk/bidi";
const CLEAR_MARGIN_CSS = {
    'margin-left': null,
    'margin-right': null,
    'margin-top': null,
    'margin-bottom': null
};
export class LayoutGapStyleBuilder extends StyleBuilder {
    constructor(_styler, _config) {
        super();
        this._styler = _styler;
        this._config = _config;
    }
    buildStyles(gapValue, parent) {
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            gapValue = multiply(gapValue, this._config.multiplier);
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
            gapValue = multiply(gapValue, this._config.multiplier);
            // For each `element` children, set the padding
            const paddingStyles = buildGridPadding(gapValue, parent.directionality);
            this._styler.applyStyleToElements(paddingStyles, parent.items);
        }
        else {
            gapValue = multiply(gapValue, this._config.multiplier);
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
LayoutGapStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutGapStyleBuilder, deps: [{ token: i1.StyleUtils }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
LayoutGapStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutGapStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutGapStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.StyleUtils }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
const inputs = [
    'fxLayoutGap', 'fxLayoutGap.xs', 'fxLayoutGap.sm', 'fxLayoutGap.md',
    'fxLayoutGap.lg', 'fxLayoutGap.xl', 'fxLayoutGap.lt-sm', 'fxLayoutGap.lt-md',
    'fxLayoutGap.lt-lg', 'fxLayoutGap.lt-xl', 'fxLayoutGap.gt-xs', 'fxLayoutGap.gt-sm',
    'fxLayoutGap.gt-md', 'fxLayoutGap.gt-lg'
];
const selector = `
  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],
  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],
  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],
  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`;
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export class LayoutGapDirective extends BaseDirective2 {
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
LayoutGapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutGapDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i2.Directionality }, { token: i1.StyleUtils }, { token: LayoutGapStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
LayoutGapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: LayoutGapDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutGapDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i2.Directionality }, { type: i1.StyleUtils }, { type: LayoutGapStyleBuilder }, { type: i1.MediaMarshaller }]; } });
export class DefaultLayoutGapDirective extends LayoutGapDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutGapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutGapDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultLayoutGapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultLayoutGapDirective, selector: "\n  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],\n  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],\n  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],\n  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]\n", inputs: { fxLayoutGap: "fxLayoutGap", "fxLayoutGap.xs": "fxLayoutGap.xs", "fxLayoutGap.sm": "fxLayoutGap.sm", "fxLayoutGap.md": "fxLayoutGap.md", "fxLayoutGap.lg": "fxLayoutGap.lg", "fxLayoutGap.xl": "fxLayoutGap.xl", "fxLayoutGap.lt-sm": "fxLayoutGap.lt-sm", "fxLayoutGap.lt-md": "fxLayoutGap.lt-md", "fxLayoutGap.lt-lg": "fxLayoutGap.lt-lg", "fxLayoutGap.lt-xl": "fxLayoutGap.lt-xl", "fxLayoutGap.gt-xs": "fxLayoutGap.gt-xs", "fxLayoutGap.gt-sm": "fxLayoutGap.gt-sm", "fxLayoutGap.gt-md": "fxLayoutGap.gt-md", "fxLayoutGap.gt-lg": "fxLayoutGap.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutGapDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutGapCacheRowRtl = new Map();
const layoutGapCacheColumnRtl = new Map();
const layoutGapCacheRowLtr = new Map();
const layoutGapCacheColumnLtr = new Map();
const GRID_SPECIFIER = ' grid';
function buildGridPadding(value, directionality) {
    const [between, below] = value.split(' ');
    const bottom = below ?? between;
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
    const bottom = below ?? between;
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
    const margins = { ...CLEAR_MARGIN_CSS };
    margins[key] = gapValue;
    return margins;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LWdhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZmxleC9sYXlvdXQtZ2FwL2xheW91dC1nYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUNMLFNBQVMsRUFJVCxVQUFVLEVBRVYsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxjQUFjLEVBQ2QsWUFBWSxFQUtaLGFBQWEsRUFFYixTQUFTLElBQUksUUFBUSxHQUN0QixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVN6QyxNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGVBQWUsRUFBRSxJQUFJO0NBQ3RCLENBQUM7QUFHRixNQUFNLE9BQU8scUJBQXNCLFNBQVEsWUFBWTtJQUNyRCxZQUFvQixPQUFtQixFQUNJLE9BQTRCO1FBQ3JFLEtBQUssRUFBRSxDQUFDO1FBRlUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNJLFlBQU8sR0FBUCxPQUFPLENBQXFCO0lBRXZFLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBZ0IsRUFBRSxNQUF1QjtRQUNuRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDckMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMvRCxRQUFRLEdBQUcsUUFBUSxD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O1lBQ0UsT0FBTyxjQUFjLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztLQUNwRTtBQUNILENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxRQUFnQixFQUNoQixNQUFnRDtJQUNuRSxNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEUsTUFBTSxPQUFPLEdBQW1DLEVBQUMsR0FBRyxnQkFBZ0IsRUFBQyxDQUFDO0lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDeEIsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbiAgSW5qZWN0YWJsZSxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBFbGVtZW50TWF0Y2hlcixcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgybVtdWx0aXBseSBhcyBtdWx0aXBseSxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge0xBWU9VVF9WQUxVRVN9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF5b3V0R2FwUGFyZW50IHtcbiAgZGlyZWN0aW9uYWxpdHk6IHN0cmluZztcbiAgaXRlbXM6IEhUTUxFbGVtZW50W107XG4gIGxheW91dDogc3RyaW5nO1xufVxuXG5jb25zdCBDTEVBUl9NQVJHSU5fQ1NTID0ge1xuICAnbWFyZ2luLWxlZnQnOiBudWxsLFxuICAnbWFyZ2luLXJpZ2h0JzogbnVsbCxcbiAgJ21hcmdpbi10b3AnOiBudWxsLFxuICAnbWFyZ2luLWJvdHRvbSc6IG51bGxcbn07XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIExheW91dEdhcFN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3N0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExheW91dENvbmZpZ09wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgYnVpbGRTdHlsZXMoZ2FwVmFsdWU6IHN0cmluZywgcGFyZW50OiBMYXlvdXRHYXBQYXJlbnQpIHtcbiAgICBpZiAoZ2FwVmFsdWUuZW5kc1dpdGgoR1JJRF9TUEVDSUZJRVIpKSB7XG4gICAgICBnYXBWYWx1ZSA9IGdhcFZhbHVlLnNsaWNlKDAsIGdhcFZhbHVlLmluZGV4T2YoR1JJRF9TUEVDSUZJRVIpKTtcbiAgICAgIGdhcFZhbHVlID0gbXVsdGlwbHkoZ2FwVmFsdWUsIHRoaXMuX2NvbmZpZy5tdWx0aXBsaWVyKTtcblxuICAgICAgLy8gQWRkIHRoZSBtYXJnaW4gdG8gdGhlIGhvc3QgZWxlbWVudFxuICAgICAgcmV0dXJuIGJ1aWxkR3JpZE1hcmdpbihnYXBWYWx1ZSwgcGFyZW50LmRpcmVjdGlvbmFsaXR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIHNpZGVFZmZlY3QoZ2FwVmFsdWU6IHN0cmluZywgX3N0eWxlczogU3R5bGVEZWZpbml0aW9uLCBwYXJlbnQ6IExheW91dEdhcFBhcmVudCkge1xuICAgIGNvbnN0IGl0ZW1zID0gcGFyZW50Lml0ZW1zO1xuICAgIGlmIChnYXBWYWx1ZS5lbmRzV2l0aChHUklEX1NQRUNJRklFUikpIHtcbiAgICAgIGdhcFZhbHVlID0gZ2FwVmFsdWUuc2xpY2UoMCwgZ2FwVmFsdWUuaW5kZXhPZihHUklEX1NQRUNJRklFUikpO1xuICAgICAgZ2FwVmFsdWUgPSBtdWx0aXBseShnYXBWYWx1ZSwgdGhpcy5fY29uZmlnLm11bHRpcGxpZXIpO1xuICAgICAgLy8gRm9yIGVhY2ggYGVsZW1lbnRgIGNoaWxkcmVuLCBzZXQgdGhlIHBhZGRpbmdcbiAgICAgIGNvbnN0IHBhZGRpbmdTdHlsZXMgPSBidWlsZEdyaWRQYWRkaW5nKGdhcFZhbHVlLCBwYXJlbnQuZGlyZWN0aW9uYWxpdHkpO1xuICAgICAgdGhpcy5fc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnRzKHBhZGRpbmdTdHlsZXMsIHBhcmVudC5pdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhcFZhbHVlID0gbXVsdGlwbHkoZ2FwVmFsdWUsIHRoaXMuX2NvbmZpZy5tdWx0aXBsaWVyKTtcbiAgICAgIGNvbnN0IGxhc3RJdGVtID0gaXRlbXMucG9wKCkhO1xuXG4gICAgICAvLyBGb3IgZWFjaCBgZWxlbWVudGAgY2hpbGRyZW4gRVhDRVBUIHRoZSBsYXN0LFxuICAgICAgLy8gc2V0IHRoZSBtYXJnaW4gcmlnaHQvYm90dG9tIHN0eWxlcy4uLlxuICAgICAgY29uc3QgZ2FwQ3NzID0gYnVpbGRHYXBDU1MoZ2FwVmFsdWUsIHBhcmVudCk7XG4gICAgICB0aGlzLl9zdHlsZXIuYXBwbHlTdHlsZVRvRWxlbWVudHMoZ2FwQ3NzLCBpdGVtcyk7XG5cbiAgICAgIC8vIENsZWFyIGFsbCBnYXBzIGZvciBhbGwgdmlzaWJsZSBlbGVtZW50c1xuICAgICAgdGhpcy5fc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnRzKENMRUFSX01BUkdJTl9DU1MsIFtsYXN0SXRlbV0pO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeExheW91dEdhcCcsICdmeExheW91dEdhcC54cycsICdmeExheW91dEdhcC5zbScsICdmeExheW91dEdhcC5tZCcsXG4gICdmeExheW91dEdhcC5sZycsICdmeExheW91dEdhcC54bCcsICdmeExheW91dEdhcC5sdC1zbScsICdmeExheW91dEdhcC5sdC1tZCcsXG4gICdmeExheW91dEdhcC5sdC1sZycsICdmeExheW91dEdhcC5sdC14bCcsICdmeExheW91dEdhcC5ndC14cycsICdmeExheW91dEdhcC5ndC1zbScsXG4gICdmeExheW91dEdhcC5ndC1tZCcsICdmeExheW91dEdhcC5ndC1sZydcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4TGF5b3V0R2FwXSwgW2Z4TGF5b3V0R2FwLnhzXSwgW2Z4TGF5b3V0R2FwLnNtXSwgW2Z4TGF5b3V0R2FwLm1kXSxcbiAgW2Z4TGF5b3V0R2FwLmxnXSwgW2Z4TGF5b3V0R2FwLnhsXSwgW2Z4TGF5b3V0R2FwLmx0LXNtXSwgW2Z4TGF5b3V0R2FwLmx0LW1kXSxcbiAgW2Z4TGF5b3V0R2FwLmx0LWxnXSwgW2Z4TGF5b3V0R2FwLmx0LXhsXSwgW2Z4TGF5b3V0R2FwLmd0LXhzXSwgW2Z4TGF5b3V0R2FwLmd0LXNtXSxcbiAgW2Z4TGF5b3V0R2FwLmd0LW1kXSwgW2Z4TGF5b3V0R2FwLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnbGF5b3V0LXBhZGRpbmcnIHN0eWxpbmcgZGlyZWN0aXZlXG4gKiAgRGVmaW5lcyBwYWRkaW5nIG9mIGNoaWxkIGVsZW1lbnRzIGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBMYXlvdXRHYXBEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHByb3RlY3RlZCBsYXlvdXQgPSAncm93JzsgIC8vIGRlZmF1bHQgZmxleC1kaXJlY3Rpb25cbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnbGF5b3V0LWdhcCc7XG4gIHByb3RlY3RlZCBvYnNlcnZlclN1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBTcGVjaWFsIGFjY2Vzc29yIHRvIHF1ZXJ5IGZvciBhbGwgY2hpbGQgJ2VsZW1lbnQnIG5vZGVzIHJlZ2FyZGxlc3Mgb2YgdHlwZSwgY2xhc3MsIGV0YyAqL1xuICBwcm90ZWN0ZWQgZ2V0IGNoaWxkcmVuTm9kZXMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xuICAgIGNvbnN0IGJ1ZmZlcjogYW55W10gPSBbXTtcblxuICAgIC8vIGl0ZXJhdGUgYmFja3dhcmRzIGVuc3VyaW5nIHRoYXQgbGVuZ3RoIGlzIGFuIFVJbnQzMlxuICAgIGZvciAobGV0IGkgPSBvYmoubGVuZ3RoOyBpLS07KSB7XG4gICAgICBidWZmZXJbaV0gPSBvYmpbaV07XG4gICAgfVxuICAgIHJldHVybiBidWZmZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHN0eWxlVXRpbHM6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogTGF5b3V0R2FwU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZVV0aWxzLCBtYXJzaGFsKTtcbiAgICBjb25zdCBleHRyYVRyaWdnZXJzID0gW3RoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlLCB0aGlzLm9ic2VydmVyU3ViamVjdC5hc09ic2VydmFibGUoKV07XG4gICAgdGhpcy5pbml0KGV4dHJhVHJpZ2dlcnMpO1xuICAgIHRoaXMubWFyc2hhbFxuICAgICAgLnRyYWNrVmFsdWUodGhpcy5uYXRpdmVFbGVtZW50LCAnbGF5b3V0JylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3lTdWJqZWN0KSlcbiAgICAgIC5zdWJzY3JpYmUodGhpcy5vbkxheW91dENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBMaWZlY3ljbGUgTWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5idWlsZENoaWxkT2JzZXJ2YWJsZSgpO1xuICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBDYWNoZSB0aGUgcGFyZW50IGNvbnRhaW5lciAnZmxleC1kaXJlY3Rpb24nIGFuZCB1cGRhdGUgdGhlICdtYXJnaW4nIHN0eWxlc1xuICAgKi9cbiAgcHJvdGVjdGVkIG9uTGF5b3V0Q2hhbmdlKG1hdGNoZXI6IEVsZW1lbnRNYXRjaGVyKSB7XG4gICAgY29uc3QgbGF5b3V0OiBzdHJpbmcgPSBtYXRjaGVyLnZhbHVlO1xuICAgIC8vIE1ha2Ugc3VyZSB0byBmaWx0ZXIgb3V0ICd3cmFwJyBvcHRpb25cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBsYXlvdXQuc3BsaXQoJyAnKTtcbiAgICB0aGlzLmxheW91dCA9IGRpcmVjdGlvblswXTtcbiAgICBpZiAoIUxBWU9VVF9WQUxVRVMuZmluZCh4ID0+IHggPT09IHRoaXMubGF5b3V0KSkge1xuICAgICAgdGhpcy5sYXlvdXQgPSAncm93JztcbiAgICB9XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIC8vIEdhdGhlciBhbGwgbm9uLWhpZGRlbiBFbGVtZW50IG5vZGVzXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmNoaWxkcmVuTm9kZXNcbiAgICAgIC5maWx0ZXIoZWwgPT4gZWwubm9kZVR5cGUgPT09IDEgJiYgdGhpcy53aWxsRGlzcGxheShlbCkpXG4gICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBvcmRlckEgPSArdGhpcy5zdHlsZXIubG9va3VwU3R5bGUoYSwgJ29yZGVyJyk7XG4gICAgICAgIGNvbnN0IG9yZGVyQiA9ICt0aGlzLnN0eWxlci5sb29rdXBTdHlsZShiLCAnb3JkZXInKTtcbiAgICAgICAgaWYgKGlzTmFOKG9yZGVyQSkgfHwgaXNOYU4ob3JkZXJCKSB8fCBvcmRlckEgPT09IG9yZGVyQikge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvcmRlckEgPiBvcmRlckIgPyAxIDogLTE7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbmFsaXR5ID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgZGlyZWN0aW9uYWxpdHkgPT09ICdydGwnKSB7XG4gICAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEdhcENhY2hlUm93UnRsO1xuICAgICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdyb3cnICYmIGRpcmVjdGlvbmFsaXR5ICE9PSAncnRsJykge1xuICAgICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRHYXBDYWNoZVJvd0x0cjtcbiAgICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcpIHtcbiAgICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0R2FwQ2FjaGVDb2x1bW5SdGw7XG4gICAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgZGlyZWN0aW9uYWxpdHkgIT09ICdydGwnKSB7XG4gICAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEdhcENhY2hlQ29sdW1uTHRyO1xuICAgICAgfVxuICAgICAgdGhpcy5hZGRTdHlsZXModmFsdWUsIHtkaXJlY3Rpb25hbGl0eSwgaXRlbXMsIGxheW91dH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXZSBuZWVkIHRvIG92ZXJyaWRlIGNsZWFyU3R5bGVzIGJlY2F1c2UgaW4gbW9zdCBjYXNlcyBtcnUgaXNuJ3QgcG9wdWxhdGVkICovXG4gIHByb3RlY3RlZCBjbGVhclN0eWxlcygpIHtcbiAgICBjb25zdCBncmlkTW9kZSA9IE9iamVjdC5rZXlzKHRoaXMubXJ1KS5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGNoaWxkcmVuU3R5bGUgPSBncmlkTW9kZSA/ICdwYWRkaW5nJyA6XG4gICAgICBnZXRNYXJnaW5UeXBlKHRoaXMuZGlyZWN0aW9uYWxpdHkudmFsdWUsIHRoaXMubGF5b3V0KTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBzdHlsZXMgb24gdGhlIHBhcmVudCByZW1vdmUgdGhlbVxuICAgIGlmIChncmlkTW9kZSkge1xuICAgICAgc3VwZXIuY2xlYXJTdHlsZXMoKTtcbiAgICB9XG5cbiAgICAvLyBUaGVuIHJlbW92ZSB0aGUgY2hpbGRyZW4gc3R5bGVzIHRvb1xuICAgIHRoaXMuc3R5bGVVdGlscy5hcHBseVN0eWxlVG9FbGVtZW50cyh7W2NoaWxkcmVuU3R5bGVdOiAnJ30sIHRoaXMuY2hpbGRyZW5Ob2Rlcyk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgd2lsbCBzaG93IG9yIGhpZGUgYmFzZWQgb24gY3VycmVudCBhY3RpdmF0aW9uICovXG4gIHByb3RlY3RlZCB3aWxsRGlzcGxheShzb3VyY2U6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLm1hcnNoYWwuZ2V0VmFsdWUoc291cmNlLCAnc2hvdy1oaWRlJyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnN0eWxlVXRpbHMubG9va3VwU3R5bGUoc291cmNlLCAnZGlzcGxheScpICE9PSAnbm9uZScpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkQ2hpbGRPYnNlcnZhYmxlKCk6IHZvaWQge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsaWRhdGVkQ2hhbmdlcyA9IChpdDogTXV0YXRpb25SZWNvcmQpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoaXQuYWRkZWROb2RlcyAmJiBpdC5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHx8XG4gICAgICAgICAgICAgIChpdC5yZW1vdmVkTm9kZXMgJiYgaXQucmVtb3ZlZE5vZGVzLmxlbmd0aCA+IDApO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyB1cGRhdGUgZ2FwIHN0eWxlcyBvbmx5IGZvciBjaGlsZCAnYWRkZWQnIG9yICdyZW1vdmVkJyBldmVudHNcbiAgICAgICAgICBpZiAobXV0YXRpb25zLnNvbWUodmFsaWRhdGVkQ2hhbmdlcykpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJTdWJqZWN0Lm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGhpcy5uYXRpdmVFbGVtZW50LCB7Y2hpbGRMaXN0OiB0cnVlfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb2JzZXJ2ZXI/OiBNdXRhdGlvbk9ic2VydmVyO1xufVxuXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TGF5b3V0R2FwRGlyZWN0aXZlIGV4dGVuZHMgTGF5b3V0R2FwRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cblxuY29uc3QgbGF5b3V0R2FwQ2FjaGVSb3dSdGw6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRHYXBDYWNoZUNvbHVtblJ0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEdhcENhY2hlUm93THRyOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0R2FwQ2FjaGVDb2x1bW5MdHI6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IEdSSURfU1BFQ0lGSUVSID0gJyBncmlkJztcblxuZnVuY3Rpb24gYnVpbGRHcmlkUGFkZGluZyh2YWx1ZTogc3RyaW5nLCBkaXJlY3Rpb25hbGl0eTogc3RyaW5nKTogU3R5bGVEZWZpbml0aW9uIHtcbiAgY29uc3QgW2JldHdlZW4sIGJlbG93XSA9IHZhbHVlLnNwbGl0KCcgJyk7XG4gIGNvbnN0IGJvdHRvbSA9IGJlbG93ID8/IGJldHdlZW47XG4gIGxldCBwYWRkaW5nUmlnaHQgPSAnMHB4JywgcGFkZGluZ0JvdHRvbSA9IGJvdHRvbSwgcGFkZGluZ0xlZnQgPSAnMHB4JztcblxuICBpZiAoZGlyZWN0aW9uYWxpdHkgPT09ICdydGwnKSB7XG4gICAgcGFkZGluZ0xlZnQgPSBiZXR3ZWVuO1xuICB9IGVsc2Uge1xuICAgIHBhZGRpbmdSaWdodCA9IGJldHdlZW47XG4gIH1cblxuICByZXR1cm4geydwYWRkaW5nJzogYDBweCAke3BhZGRpbmdSaWdodH0gJHtwYWRkaW5nQm90dG9tfSAke3BhZGRpbmdMZWZ0fWB9O1xufVxuXG5mdW5jdGlvbiBidWlsZEdyaWRNYXJnaW4odmFsdWU6IHN0cmluZywgZGlyZWN0aW9uYWxpdHk6IHN0cmluZyk6IFN0eWxlRGVmaW5pdGlvbiB7XG4gIGNvbnN0IFtiZXR3ZWVuLCBiZWxvd10gPSB2YWx1ZS5zcGxpdCgnICcpO1xuICBjb25zdCBib3R0b20gPSBiZWxvdyA/PyBiZXR3ZWVuO1xuICBjb25zdCBtaW51cyA9IChzdHI6IHN0cmluZykgPT4gYC0ke3N0cn1gO1xuICBsZXQgbWFyZ2luUmlnaHQgPSAnMHB4JywgbWFyZ2luQm90dG9tID0gbWludXMoYm90dG9tKSwgbWFyZ2luTGVmdCA9ICcwcHgnO1xuXG4gIGlmIChkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcpIHtcbiAgICBtYXJnaW5MZWZ0ID0gbWludXMoYmV0d2Vlbik7XG4gIH0gZWxzZSB7XG4gICAgbWFyZ2luUmlnaHQgPSBtaW51cyhiZXR3ZWVuKTtcbiAgfVxuXG4gIHJldHVybiB7J21hcmdpbic6IGAwcHggJHttYXJnaW5SaWdodH0gJHttYXJnaW5Cb3R0b219ICR7bWFyZ2luTGVmdH1gfTtcbn1cblxuZnVuY3Rpb24gZ2V0TWFyZ2luVHlwZShkaXJlY3Rpb25hbGl0eTogc3RyaW5nLCBsYXlvdXQ6IHN0cmluZykge1xuICBzd2l0Y2ggKGxheW91dCkge1xuICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICByZXR1cm4gJ21hcmdpbi1ib3R0b20nO1xuICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzpcbiAgICAgIHJldHVybiAnbWFyZ2luLXRvcCc7XG4gICAgY2FzZSAncm93JzpcbiAgICAgIHJldHVybiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1yaWdodCc7XG4gICAgY2FzZSAncm93LXJldmVyc2UnOlxuICAgICAgcmV0dXJuIGRpcmVjdGlvbmFsaXR5ID09PSAncnRsJyA/ICdtYXJnaW4tcmlnaHQnIDogJ21hcmdpbi1sZWZ0JztcbiAgICBkZWZhdWx0IDpcbiAgICAgIHJldHVybiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1yaWdodCc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHYXBDU1MoZ2FwVmFsdWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgIHBhcmVudDoge2RpcmVjdGlvbmFsaXR5OiBzdHJpbmcsIGxheW91dDogc3RyaW5nfSk6IFN0eWxlRGVmaW5pdGlvbiB7XG4gIGNvbnN0IGtleSA9IGdldE1hcmdpblR5cGUocGFyZW50LmRpcmVjdGlvbmFsaXR5LCBwYXJlbnQubGF5b3V0KTtcbiAgY29uc3QgbWFyZ2luczoge1trZXk6IHN0cmluZ106IHN0cmluZyB8IG51bGx9ID0gey4uLkNMRUFSX01BUkdJTl9DU1N9O1xuICBtYXJnaW5zW2tleV0gPSBnYXBWYWx1ZTtcbiAgcmV0dXJuIG1hcmdpbnM7XG59XG4iXX0=