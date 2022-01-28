/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { buildLayoutCSS } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return buildLayoutCSS(input);
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
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout';
        this.styleCache = layoutCache;
        this.init();
    }
}
LayoutDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
LayoutDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: LayoutDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutStyleBuilder }, { type: i1.MediaMarshaller }]; } });
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
const layoutCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC9sYXlvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFDTCxjQUFjLEVBQ2QsWUFBWSxHQUliLE1BQU0sMkJBQTJCLENBQUM7QUFFbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7QUFHbkUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQVk7SUFDbEQsV0FBVyxDQUFDLEtBQWE7UUFDdkIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7K0dBSFUsa0JBQWtCO21IQUFsQixrQkFBa0IsY0FETixNQUFNOzJGQUNsQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQU9oQyxNQUFNLE1BQU0sR0FBRztJQUNiLFVBQVUsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWE7SUFDdkQsYUFBYSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7SUFDaEUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCO0lBQ3RFLGdCQUFnQixFQUFFLGdCQUFnQjtDQUNuQyxDQUFDO0FBQ0YsTUFBTSxRQUFRLEdBQUc7Ozs7O0NBS2hCLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFFSCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxjQUFjO0lBSWpELFlBQVksS0FBaUIsRUFDakIsVUFBc0IsRUFDdEIsWUFBZ0MsRUFDaEMsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTnhDLGtCQUFhLEdBQUcsUUFBUSxDQUFDO1FBVXpCLGVBQVUsR0FBRyxXQUFXLENBQUM7UUFIakMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7NEdBVlUsZUFBZSxzRUFNQSxrQkFBa0I7Z0dBTmpDLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsU0FBUzs0R0FPa0Isa0JBQWtCO0FBVTlDLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxlQUFlO0lBRDNEOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O21IQUZZLHNCQUFzQjt1R0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDOztBQUs3QixNQUFNLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG4gIE1lZGlhTWFyc2hhbGxlcixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmltcG9ydCB7YnVpbGRMYXlvdXRDU1N9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTGF5b3V0U3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZykge1xuICAgIHJldHVybiBidWlsZExheW91dENTUyhpbnB1dCk7XG4gIH1cbn1cblxuY29uc3QgaW5wdXRzID0gW1xuICAnZnhMYXlvdXQnLCAnZnhMYXlvdXQueHMnLCAnZnhMYXlvdXQuc20nLCAnZnhMYXlvdXQubWQnLFxuICAnZnhMYXlvdXQubGcnLCAnZnhMYXlvdXQueGwnLCAnZnhMYXlvdXQubHQtc20nLCAnZnhMYXlvdXQubHQtbWQnLFxuICAnZnhMYXlvdXQubHQtbGcnLCAnZnhMYXlvdXQubHQteGwnLCAnZnhMYXlvdXQuZ3QteHMnLCAnZnhMYXlvdXQuZ3Qtc20nLFxuICAnZnhMYXlvdXQuZ3QtbWQnLCAnZnhMYXlvdXQuZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtmeExheW91dF0sIFtmeExheW91dC54c10sIFtmeExheW91dC5zbV0sIFtmeExheW91dC5tZF0sXG4gIFtmeExheW91dC5sZ10sIFtmeExheW91dC54bF0sIFtmeExheW91dC5sdC1zbV0sIFtmeExheW91dC5sdC1tZF0sXG4gIFtmeExheW91dC5sdC1sZ10sIFtmeExheW91dC5sdC14bF0sIFtmeExheW91dC5ndC14c10sIFtmeExheW91dC5ndC1zbV0sXG4gIFtmeExheW91dC5ndC1tZF0sIFtmeExheW91dC5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2xheW91dCcgZmxleGJveCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogRGVmaW5lcyB0aGUgcG9zaXRpb25pbmcgZmxvdyBkaXJlY3Rpb24gZm9yIHRoZSBjaGlsZCBlbGVtZW50czogcm93IG9yIGNvbHVtblxuICogT3B0aW9uYWwgdmFsdWVzOiBjb2x1bW4gb3Igcm93IChkZWZhdWx0KVxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9mL2ZsZXgtZGlyZWN0aW9uL1xuICpcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgTGF5b3V0RGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIHByb3RlY3RlZCBESVJFQ1RJVkVfS0VZID0gJ2xheW91dCc7XG5cbiAgY29uc3RydWN0b3IoZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlVXRpbHM6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogTGF5b3V0U3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZVV0aWxzLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdHlsZUNhY2hlID0gbGF5b3V0Q2FjaGU7XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMYXlvdXREaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXREaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5jb25zdCBsYXlvdXRDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbiJdfQ==