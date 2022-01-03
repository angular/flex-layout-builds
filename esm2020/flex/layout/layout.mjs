/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Inject } from '@angular/core';
import { BaseDirective2, StyleBuilder, LAYOUT_CONFIG, } from '@angular/flex-layout/core';
import { buildLayoutCSS } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input, { display }) {
        const css = buildLayoutCSS(input);
        return {
            ...css,
            display: display === 'none' ? display : css.display,
        };
    }
}
LayoutStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
LayoutStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutStyleBuilder, decorators: [{
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
export class LayoutDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal, _config) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this._config = _config;
        this.DIRECTIVE_KEY = 'layout';
        this.init();
    }
    updateWithValue(input) {
        const detectLayoutDisplay = this._config.detectLayoutDisplay;
        const display = detectLayoutDisplay ? this.styler.lookupStyle(this.nativeElement, 'display') : '';
        this.styleCache = cacheMap.get(display) ?? new Map();
        cacheMap.set(display, this.styleCache);
        if (this.currentValue !== input) {
            this.addStyles(input, { display });
            this.currentValue = input;
        }
    }
}
LayoutDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutStyleBuilder }, { token: i1.MediaMarshaller }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Directive });
LayoutDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: LayoutDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutStyleBuilder }, { type: i1.MediaMarshaller }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
export class DefaultLayoutDirective extends LayoutDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultLayoutDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultLayoutDirective, selector: "\n  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],\n  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],\n  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],\n  [fxLayout.gt-md], [fxLayout.gt-lg]\n", inputs: { fxLayout: "fxLayout", "fxLayout.xs": "fxLayout.xs", "fxLayout.sm": "fxLayout.sm", "fxLayout.md": "fxLayout.md", "fxLayout.lg": "fxLayout.lg", "fxLayout.xl": "fxLayout.xl", "fxLayout.lt-sm": "fxLayout.lt-sm", "fxLayout.lt-md": "fxLayout.lt-md", "fxLayout.lt-lg": "fxLayout.lt-lg", "fxLayout.lt-xl": "fxLayout.lt-xl", "fxLayout.gt-xs": "fxLayout.gt-xs", "fxLayout.gt-sm": "fxLayout.gt-sm", "fxLayout.gt-md": "fxLayout.gt-md", "fxLayout.gt-lg": "fxLayout.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const cacheMap = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC9sYXlvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQ0wsY0FBYyxFQUNkLFlBQVksRUFJWixhQUFhLEdBRWQsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUNBQXFDLENBQUM7OztBQU9uRSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsWUFBWTtJQUNsRCxXQUFXLENBQUMsS0FBYSxFQUFFLEVBQUMsT0FBTyxFQUFxQjtRQUN0RCxNQUFNLEdBQUcsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsT0FBTztZQUNMLEdBQUcsR0FBRztZQUNOLE9BQU8sRUFBRSxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1NBQ3BELENBQUM7SUFDSixDQUFDOzsrR0FQVSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUROLE1BQU07MkZBQ2xCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBV2hDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsVUFBVSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYTtJQUN2RCxhQUFhLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQjtJQUNoRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7SUFDdEUsZ0JBQWdCLEVBQUUsZ0JBQWdCO0NBQ25DLENBQUM7QUFDRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxlQUFnQixTQUFRLGNBQWM7SUFJakQsWUFBWSxLQUFpQixFQUNqQixVQUFzQixFQUN0QixZQUFnQyxFQUNoQyxPQUF3QixFQUNPLE9BQTRCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQURQLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBTjdELGtCQUFhLEdBQUcsUUFBUSxDQUFDO1FBUWpDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFUyxlQUFlLENBQUMsS0FBYTtRQUNyQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNyRCxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEtBQUssRUFBRTtZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7U0FDM0I7SUFDSCxDQUFDOzs0R0F2QlUsZUFBZSxzRUFNQSxrQkFBa0IsNENBRXhCLGFBQWE7Z0dBUnRCLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsU0FBUzs0R0FPa0Isa0JBQWtCOzBCQUUvQixNQUFNOzJCQUFDLGFBQWE7O0FBbUJuQyxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsZUFBZTtJQUQzRDs7UUFFWSxXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQzNCOzttSEFGWSxzQkFBc0I7dUdBQXRCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQzs7QUFNN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIEluamVjdGFibGUsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmltcG9ydCB7YnVpbGRMYXlvdXRDU1N9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBMYXlvdXRTdHlsZURpc3BsYXkge1xuICByZWFkb25seSBkaXNwbGF5OiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIExheW91dFN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGlucHV0OiBzdHJpbmcsIHtkaXNwbGF5fTogTGF5b3V0U3R5bGVEaXNwbGF5KSB7XG4gICAgY29uc3QgY3NzID0gYnVpbGRMYXlvdXRDU1MoaW5wdXQpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jc3MsXG4gICAgICBkaXNwbGF5OiBkaXNwbGF5ID09PSAnbm9uZScgPyBkaXNwbGF5IDogY3NzLmRpc3BsYXksXG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeExheW91dCcsICdmeExheW91dC54cycsICdmeExheW91dC5zbScsICdmeExheW91dC5tZCcsXG4gICdmeExheW91dC5sZycsICdmeExheW91dC54bCcsICdmeExheW91dC5sdC1zbScsICdmeExheW91dC5sdC1tZCcsXG4gICdmeExheW91dC5sdC1sZycsICdmeExheW91dC5sdC14bCcsICdmeExheW91dC5ndC14cycsICdmeExheW91dC5ndC1zbScsXG4gICdmeExheW91dC5ndC1tZCcsICdmeExheW91dC5ndC1sZydcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4TGF5b3V0XSwgW2Z4TGF5b3V0LnhzXSwgW2Z4TGF5b3V0LnNtXSwgW2Z4TGF5b3V0Lm1kXSxcbiAgW2Z4TGF5b3V0LmxnXSwgW2Z4TGF5b3V0LnhsXSwgW2Z4TGF5b3V0Lmx0LXNtXSwgW2Z4TGF5b3V0Lmx0LW1kXSxcbiAgW2Z4TGF5b3V0Lmx0LWxnXSwgW2Z4TGF5b3V0Lmx0LXhsXSwgW2Z4TGF5b3V0Lmd0LXhzXSwgW2Z4TGF5b3V0Lmd0LXNtXSxcbiAgW2Z4TGF5b3V0Lmd0LW1kXSwgW2Z4TGF5b3V0Lmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnbGF5b3V0JyBmbGV4Ym94IHN0eWxpbmcgZGlyZWN0aXZlXG4gKiBEZWZpbmVzIHRoZSBwb3NpdGlvbmluZyBmbG93IGRpcmVjdGlvbiBmb3IgdGhlIGNoaWxkIGVsZW1lbnRzOiByb3cgb3IgY29sdW1uXG4gKiBPcHRpb25hbCB2YWx1ZXM6IGNvbHVtbiBvciByb3cgKGRlZmF1bHQpXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL2YvZmxleC1kaXJlY3Rpb24vXG4gKlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBMYXlvdXREaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnbGF5b3V0JztcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBMYXlvdXRTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICAgICAgICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExheW91dENvbmZpZ09wdGlvbnMpIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZVV0aWxzLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVXaXRoVmFsdWUoaW5wdXQ6IHN0cmluZykge1xuICAgIGNvbnN0IGRldGVjdExheW91dERpc3BsYXkgPSB0aGlzLl9jb25maWcuZGV0ZWN0TGF5b3V0RGlzcGxheTtcbiAgICBjb25zdCBkaXNwbGF5ID0gZGV0ZWN0TGF5b3V0RGlzcGxheSA/IHRoaXMuc3R5bGVyLmxvb2t1cFN0eWxlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknKSA6ICcnO1xuICAgIHRoaXMuc3R5bGVDYWNoZSA9IGNhY2hlTWFwLmdldChkaXNwbGF5KSA/PyBuZXcgTWFwKCk7XG4gICAgY2FjaGVNYXAuc2V0KGRpc3BsYXksIHRoaXMuc3R5bGVDYWNoZSk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgIT09IGlucHV0KSB7XG4gICAgICB0aGlzLmFkZFN0eWxlcyhpbnB1dCwge2Rpc3BsYXl9KTtcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gaW5wdXQ7XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMYXlvdXREaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuXG50eXBlIENhY2hlTWFwID0gTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPjtcbmNvbnN0IGNhY2hlTWFwID0gbmV3IE1hcDxzdHJpbmcsIENhY2hlTWFwPigpO1xuIl19