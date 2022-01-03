/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Inject } from '@angular/core';
import { BaseDirective2, StyleBuilder, ɵmultiply as multiply, LAYOUT_CONFIG, } from '@angular/flex-layout/core';
import { isFlowHorizontal } from '@angular/flex-layout/_private-utils';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/flex-layout/core";
export class FlexOffsetStyleBuilder extends StyleBuilder {
    constructor(_config) {
        super();
        this._config = _config;
    }
    buildStyles(offset, parent) {
        offset || (offset = '0');
        offset = multiply(offset, this._config.multiplier);
        const isPercent = String(offset).indexOf('%') > -1;
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = `${offset}%`;
        }
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        const styles = isFlowHorizontal(parent.layout) ?
            { [horizontalLayoutKey]: offset } : { 'margin-top': offset };
        return styles;
    }
}
FlexOffsetStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, deps: [{ token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
FlexOffsetStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
const inputs = [
    'fxFlexOffset', 'fxFlexOffset.xs', 'fxFlexOffset.sm', 'fxFlexOffset.md',
    'fxFlexOffset.lg', 'fxFlexOffset.xl', 'fxFlexOffset.lt-sm', 'fxFlexOffset.lt-md',
    'fxFlexOffset.lt-lg', 'fxFlexOffset.lt-xl', 'fxFlexOffset.gt-xs', 'fxFlexOffset.gt-sm',
    'fxFlexOffset.gt-md', 'fxFlexOffset.gt-lg'
];
const selector = `
  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],
  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],
  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],
  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`;
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export class FlexOffsetDirective extends BaseDirective2 {
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
FlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetDirective, deps: [{ token: i0.ElementRef }, { token: i1.Directionality }, { token: FlexOffsetStyleBuilder }, { token: i2.MediaMarshaller }, { token: i2.StyleUtils }], target: i0.ɵɵFactoryTarget.Directive });
FlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: FlexOffsetDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality }, { type: FlexOffsetStyleBuilder }, { type: i2.MediaMarshaller }, { type: i2.StyleUtils }]; } });
export class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultFlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOffsetDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultFlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultFlexOffsetDirective, selector: "\n  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],\n  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],\n  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],\n  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n", inputs: { fxFlexOffset: "fxFlexOffset", "fxFlexOffset.xs": "fxFlexOffset.xs", "fxFlexOffset.sm": "fxFlexOffset.sm", "fxFlexOffset.md": "fxFlexOffset.md", "fxFlexOffset.lg": "fxFlexOffset.lg", "fxFlexOffset.xl": "fxFlexOffset.xl", "fxFlexOffset.lt-sm": "fxFlexOffset.lt-sm", "fxFlexOffset.lt-md": "fxFlexOffset.lt-md", "fxFlexOffset.lt-lg": "fxFlexOffset.lt-lg", "fxFlexOffset.lt-xl": "fxFlexOffset.lt-xl", "fxFlexOffset.gt-xs": "fxFlexOffset.gt-xs", "fxFlexOffset.gt-sm": "fxFlexOffset.gt-sm", "fxFlexOffset.gt-md": "fxFlexOffset.gt-md", "fxFlexOffset.gt-lg": "fxFlexOffset.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOffsetDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const flexOffsetCacheRowRtl = new Map();
const flexOffsetCacheColumnRtl = new Map();
const flexOffsetCacheRowLtr = new Map();
const flexOffsetCacheColumnLtr = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1vZmZzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2ZsZXgvZmxleC1vZmZzZXQvZmxleC1vZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVuRixPQUFPLEVBRUwsY0FBYyxFQUNkLFlBQVksRUFHWixTQUFTLElBQUksUUFBUSxFQUNyQixhQUFhLEdBRWQsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFTekMsTUFBTSxPQUFPLHNCQUF1QixTQUFRLFlBQVk7SUFDdEQsWUFBMkMsT0FBNEI7UUFDckUsS0FBSyxFQUFFLENBQUM7UUFEaUMsWUFBTyxHQUFQLE9BQU8sQ0FBcUI7SUFFdkUsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjLEVBQUUsTUFBd0I7UUFDbEQsTUFBTSxLQUFOLE1BQU0sR0FBSyxHQUFHLEVBQUM7UUFDZixNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFB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O1NBQzVDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7Z0hBMUNVLG1CQUFtQiwwRUFLSixzQkFBc0I7b0dBTHJDLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUQvQixTQUFTO2dIQU1rQixzQkFBc0I7QUF5Q2xELE1BQU0sT0FBTywwQkFBMkIsU0FBUSxtQkFBbUI7SUFEbkU7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7dUhBRlksMEJBQTBCOzJHQUExQiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFEdEMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUM7O0FBSzdCLE1BQU0scUJBQXFCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEUsTUFBTSx3QkFBd0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN6RSxNQUFNLHFCQUFxQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RFLE1BQU0sd0JBQXdCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIEluamVjdGFibGUsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgybVtdWx0aXBseSBhcyBtdWx0aXBseSxcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge2lzRmxvd0hvcml6b250YWx9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBGbGV4T2Zmc2V0UGFyZW50IHtcbiAgbGF5b3V0OiBzdHJpbmc7XG4gIGlzUnRsOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGbGV4T2Zmc2V0U3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoQEluamVjdChMQVlPVVRfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExheW91dENvbmZpZ09wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgYnVpbGRTdHlsZXMob2Zmc2V0OiBzdHJpbmcsIHBhcmVudDogRmxleE9mZnNldFBhcmVudCkge1xuICAgIG9mZnNldCB8fD0gJzAnO1xuICAgIG9mZnNldCA9IG11bHRpcGx5KG9mZnNldCwgdGhpcy5fY29uZmlnLm11bHRpcGxpZXIpO1xuICAgIGNvbnN0IGlzUGVyY2VudCA9IFN0cmluZyhvZmZzZXQpLmluZGV4T2YoJyUnKSA+IC0xO1xuICAgIGNvbnN0IGlzUHggPSBTdHJpbmcob2Zmc2V0KS5pbmRleE9mKCdweCcpID4gLTE7XG4gICAgaWYgKCFpc1B4ICYmICFpc1BlcmNlbnQgJiYgIWlzTmFOKCtvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBgJHtvZmZzZXR9JWA7XG4gICAgfVxuICAgIGNvbnN0IGhvcml6b250YWxMYXlvdXRLZXkgPSBwYXJlbnQuaXNSdGwgPyAnbWFyZ2luLXJpZ2h0JyA6ICdtYXJnaW4tbGVmdCc7XG4gICAgY29uc3Qgc3R5bGVzOiBTdHlsZURlZmluaXRpb24gPSBpc0Zsb3dIb3Jpem9udGFsKHBhcmVudC5sYXlvdXQpID9cbiAgICAgIHtbaG9yaXpvbnRhbExheW91dEtleV06IG9mZnNldH0gOiB7J21hcmdpbi10b3AnOiBvZmZzZXR9O1xuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeEZsZXhPZmZzZXQnLCAnZnhGbGV4T2Zmc2V0LnhzJywgJ2Z4RmxleE9mZnNldC5zbScsICdmeEZsZXhPZmZzZXQubWQnLFxuICAnZnhGbGV4T2Zmc2V0LmxnJywgJ2Z4RmxleE9mZnNldC54bCcsICdmeEZsZXhPZmZzZXQubHQtc20nLCAnZnhGbGV4T2Zmc2V0Lmx0LW1kJyxcbiAgJ2Z4RmxleE9mZnNldC5sdC1sZycsICdmeEZsZXhPZmZzZXQubHQteGwnLCAnZnhGbGV4T2Zmc2V0Lmd0LXhzJywgJ2Z4RmxleE9mZnNldC5ndC1zbScsXG4gICdmeEZsZXhPZmZzZXQuZ3QtbWQnLCAnZnhGbGV4T2Zmc2V0Lmd0LWxnJ1xuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZnhGbGV4T2Zmc2V0XSwgW2Z4RmxleE9mZnNldC54c10sIFtmeEZsZXhPZmZzZXQuc21dLCBbZnhGbGV4T2Zmc2V0Lm1kXSxcbiAgW2Z4RmxleE9mZnNldC5sZ10sIFtmeEZsZXhPZmZzZXQueGxdLCBbZnhGbGV4T2Zmc2V0Lmx0LXNtXSwgW2Z4RmxleE9mZnNldC5sdC1tZF0sXG4gIFtmeEZsZXhPZmZzZXQubHQtbGddLCBbZnhGbGV4T2Zmc2V0Lmx0LXhsXSwgW2Z4RmxleE9mZnNldC5ndC14c10sIFtmeEZsZXhPZmZzZXQuZ3Qtc21dLFxuICBbZnhGbGV4T2Zmc2V0Lmd0LW1kXSwgW2Z4RmxleE9mZnNldC5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2ZsZXgtb2Zmc2V0JyBmbGV4Ym94IHN0eWxpbmcgZGlyZWN0aXZlXG4gKiBDb25maWd1cmVzIHRoZSAnbWFyZ2luLWxlZnQnIG9mIHRoZSBlbGVtZW50IGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBGbGV4T2Zmc2V0RGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdmbGV4LW9mZnNldCc7XG5cbiAgY29uc3RydWN0b3IoZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogRmxleE9mZnNldFN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMpIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZXIsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdChbdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2VdKTtcbiAgICAvLyBQYXJlbnQgRE9NIGBsYXlvdXQtZ2FwYCB3aXRoIGFmZmVjdCB0aGUgbmVzdGVkIGNoaWxkIHdpdGggYGZsZXgtb2Zmc2V0YFxuICAgIGlmICh0aGlzLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMubWFyc2hhbFxuICAgICAgICAudHJhY2tWYWx1ZSh0aGlzLnBhcmVudEVsZW1lbnQsICdsYXlvdXQtZ2FwJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveVN1YmplY3QpKVxuICAgICAgICAuc3Vic2NyaWJlKHRoaXMudHJpZ2dlclVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIFVzaW5nIHRoZSBjdXJyZW50IGZ4RmxleE9mZnNldCB2YWx1ZSwgdXBkYXRlIHRoZSBpbmxpbmUgQ1NTXG4gICAqIE5PVEU6IHRoaXMgd2lsbCBhc3NpZ24gYG1hcmdpbi1sZWZ0YCBpZiB0aGUgcGFyZW50IGZsZXgtZGlyZWN0aW9uID09ICdyb3cnLFxuICAgKiAgICAgICBvdGhlcndpc2UgYG1hcmdpbi10b3BgIGlzIHVzZWQgZm9yIHRoZSBvZmZzZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBzdHJpbmd8bnVtYmVyID0gJycpOiB2b2lkIHtcbiAgICAvLyBUaGUgZmxleC1kaXJlY3Rpb24gb2YgdGhpcyBlbGVtZW50J3MgZmxleCBjb250YWluZXIuIERlZmF1bHRzIHRvICdyb3cnLlxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMuZ2V0RmxleEZsb3dEaXJlY3Rpb24odGhpcy5wYXJlbnRFbGVtZW50ISwgdHJ1ZSk7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlID09PSAncnRsJztcbiAgICBpZiAobGF5b3V0ID09PSAncm93JyAmJiBpc1J0bCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleE9mZnNldENhY2hlUm93UnRsO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAncm93JyAmJiAhaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZVJvd0x0cjtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZUNvbHVtblJ0bDtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgIWlzUnRsKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBmbGV4T2Zmc2V0Q2FjaGVDb2x1bW5MdHI7XG4gICAgfVxuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlICsgJycsIHtsYXlvdXQsIGlzUnRsfSk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEZsZXhPZmZzZXREaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T2Zmc2V0RGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cblxuY29uc3QgZmxleE9mZnNldENhY2hlUm93UnRsOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgZmxleE9mZnNldENhY2hlQ29sdW1uUnRsOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgZmxleE9mZnNldENhY2hlUm93THRyOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgZmxleE9mZnNldENhY2hlQ29sdW1uTHRyOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuIl19