/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
const DEFAULT_VALUE = 'auto';
export class GridRowStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return { 'grid-row': input || DEFAULT_VALUE };
    }
}
GridRowStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridRowStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridRowStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridRowStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridRowStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridRowDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-row';
        this.styleCache = rowCache;
        this.init();
    }
}
GridRowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridRowDirective, deps: [{ token: i0.ElementRef }, { token: GridRowStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridRowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridRowDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridRowDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridRowStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; } });
const rowCache = new Map();
const inputs = [
    'gdRow',
    'gdRow.xs', 'gdRow.sm', 'gdRow.md', 'gdRow.lg', 'gdRow.xl',
    'gdRow.lt-sm', 'gdRow.lt-md', 'gdRow.lt-lg', 'gdRow.lt-xl',
    'gdRow.gt-xs', 'gdRow.gt-sm', 'gdRow.gt-md', 'gdRow.gt-lg'
];
const selector = `
  [gdRow],
  [gdRow.xs], [gdRow.sm], [gdRow.md], [gdRow.lg], [gdRow.xl],
  [gdRow.lt-sm], [gdRow.lt-md], [gdRow.lt-lg], [gdRow.lt-xl],
  [gdRow.gt-xs], [gdRow.gt-sm], [gdRow.gt-md], [gdRow.gt-lg]
`;
/**
 * 'grid-row' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-26
 */
export class DefaultGridRowDirective extends GridRowDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridRowDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridRowDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridRowDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridRowDirective, selector: "\n  [gdRow],\n  [gdRow.xs], [gdRow.sm], [gdRow.md], [gdRow.lg], [gdRow.xl],\n  [gdRow.lt-sm], [gdRow.lt-md], [gdRow.lt-lg], [gdRow.lt-xl],\n  [gdRow.gt-xs], [gdRow.gt-sm], [gdRow.gt-md], [gdRow.gt-lg]\n", inputs: { gdRow: "gdRow", "gdRow.xs": "gdRow.xs", "gdRow.sm": "gdRow.sm", "gdRow.md": "gdRow.md", "gdRow.lg": "gdRow.lg", "gdRow.xl": "gdRow.xl", "gdRow.lt-sm": "gdRow.lt-sm", "gdRow.lt-md": "gdRow.lt-md", "gdRow.lt-lg": "gdRow.lt-lg", "gdRow.lt-xl": "gdRow.lt-xl", "gdRow.gt-xs": "gdRow.gt-xs", "gdRow.gt-sm": "gdRow.gt-sm", "gdRow.gt-md": "gdRow.gt-md", "gdRow.gt-lg": "gdRow.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridRowDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL3Jvdy9yb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBRWIsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUc3QixNQUFNLE9BQU8sbUJBQW9CLFNBQVEsWUFBWTtJQUNuRCxXQUFXLENBQUMsS0FBYTtRQUN2QixPQUFPLEVBQUMsVUFBVSxFQUFFLEtBQUssSUFBSSxhQUFhLEVBQUMsQ0FBQztJQUM5QyxDQUFDOztnSEFIVSxtQkFBbUI7b0hBQW5CLG1CQUFtQixjQURQLE1BQU07MkZBQ2xCLG1CQUFtQjtrQkFEL0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBUWhDLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxjQUFjO0lBR2xELFlBQVksVUFBc0IsRUFDdEIsWUFBaUMsRUFDakMsTUFBa0IsRUFDbEIsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTnpDLGtCQUFhLEdBQUcsVUFBVSxDQUFDO1FBVTNCLGVBQVUsR0FBRyxRQUFRLENBQUM7UUFIOUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7NkdBVFUsZ0JBQWdCLDRDQUlELG1CQUFtQjtpR0FKbEMsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFNBQVM7bUZBS2tCLG1CQUFtQjtBQVUvQyxNQUFNLFFBQVEsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUV6RCxNQUFNLE1BQU0sR0FBRztJQUNiLE9BQU87SUFDUCxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVTtJQUMxRCxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhO0lBQzFELGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWE7Q0FDM0QsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxnQkFBZ0I7SUFEN0Q7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7b0hBRlksdUJBQXVCO3dHQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZVV0aWxzLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuY29uc3QgREVGQVVMVF9WQUxVRSA9ICdhdXRvJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR3JpZFJvd1N0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGlucHV0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4geydncmlkLXJvdyc6IGlucHV0IHx8IERFRkFVTFRfVkFMVUV9O1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRSb3dEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG4gIHByb3RlY3RlZCBESVJFQ1RJVkVfS0VZID0gJ2dyaWQtcm93JztcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IEdyaWRSb3dTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZXIsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2FjaGUgPSByb3dDYWNoZTtcbn1cblxuY29uc3Qgcm93Q2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkUm93JyxcbiAgJ2dkUm93LnhzJywgJ2dkUm93LnNtJywgJ2dkUm93Lm1kJywgJ2dkUm93LmxnJywgJ2dkUm93LnhsJyxcbiAgJ2dkUm93Lmx0LXNtJywgJ2dkUm93Lmx0LW1kJywgJ2dkUm93Lmx0LWxnJywgJ2dkUm93Lmx0LXhsJyxcbiAgJ2dkUm93Lmd0LXhzJywgJ2dkUm93Lmd0LXNtJywgJ2dkUm93Lmd0LW1kJywgJ2dkUm93Lmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZFJvd10sXG4gIFtnZFJvdy54c10sIFtnZFJvdy5zbV0sIFtnZFJvdy5tZF0sIFtnZFJvdy5sZ10sIFtnZFJvdy54bF0sXG4gIFtnZFJvdy5sdC1zbV0sIFtnZFJvdy5sdC1tZF0sIFtnZFJvdy5sdC1sZ10sIFtnZFJvdy5sdC14bF0sXG4gIFtnZFJvdy5ndC14c10sIFtnZFJvdy5ndC1zbV0sIFtnZFJvdy5ndC1tZF0sIFtnZFJvdy5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2dyaWQtcm93JyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgbmFtZSBvciBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZ3JpZFxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2Nzcy9jb21wbGV0ZS1ndWlkZS1ncmlkLyNhcnRpY2xlLWhlYWRlci1pZC0yNlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0R3JpZFJvd0RpcmVjdGl2ZSBleHRlbmRzIEdyaWRSb3dEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19