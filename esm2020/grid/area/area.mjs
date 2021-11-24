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
export class GridAreaStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return { 'grid-area': input || DEFAULT_VALUE };
    }
}
GridAreaStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreaStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAreaStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreaStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreaStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAreaDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'grid-area';
        this.styleCache = gridAreaCache;
        this.init();
    }
}
GridAreaDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreaDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: GridAreaStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAreaDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridAreaDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreaDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: GridAreaStyleBuilder }, { type: i1.MediaMarshaller }]; } });
const gridAreaCache = new Map();
const inputs = [
    'gdArea',
    'gdArea.xs', 'gdArea.sm', 'gdArea.md', 'gdArea.lg', 'gdArea.xl',
    'gdArea.lt-sm', 'gdArea.lt-md', 'gdArea.lt-lg', 'gdArea.lt-xl',
    'gdArea.gt-xs', 'gdArea.gt-sm', 'gdArea.gt-md', 'gdArea.gt-lg'
];
const selector = `
  [gdArea],
  [gdArea.xs], [gdArea.sm], [gdArea.md], [gdArea.lg], [gdArea.xl],
  [gdArea.lt-sm], [gdArea.lt-md], [gdArea.lt-lg], [gdArea.lt-xl],
  [gdArea.gt-xs], [gdArea.gt-sm], [gdArea.gt-md], [gdArea.gt-lg]
`;
/**
 * 'grid-area' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-27
 */
export class DefaultGridAreaDirective extends GridAreaDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAreaDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAreaDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAreaDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridAreaDirective, selector: "\n  [gdArea],\n  [gdArea.xs], [gdArea.sm], [gdArea.md], [gdArea.lg], [gdArea.xl],\n  [gdArea.lt-sm], [gdArea.lt-md], [gdArea.lt-lg], [gdArea.lt-xl],\n  [gdArea.gt-xs], [gdArea.gt-sm], [gdArea.gt-md], [gdArea.gt-lg]\n", inputs: { gdArea: "gdArea", "gdArea.xs": "gdArea.xs", "gdArea.sm": "gdArea.sm", "gdArea.md": "gdArea.md", "gdArea.lg": "gdArea.lg", "gdArea.xl": "gdArea.xl", "gdArea.lt-sm": "gdArea.lt-sm", "gdArea.lt-md": "gdArea.lt-md", "gdArea.lt-lg": "gdArea.lt-lg", "gdArea.lt-xl": "gdArea.lt-xl", "gdArea.gt-xs": "gdArea.gt-xs", "gdArea.gt-sm": "gdArea.gt-sm", "gdArea.gt-md": "gdArea.gt-md", "gdArea.gt-lg": "gdArea.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAreaDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9hcmVhL2FyZWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBRWIsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUc3QixNQUFNLE9BQU8sb0JBQXFCLFNBQVEsWUFBWTtJQUNwRCxXQUFXLENBQUMsS0FBYTtRQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxhQUFhLEVBQUMsQ0FBQztJQUMvQyxDQUFDOztpSEFIVSxvQkFBb0I7cUhBQXBCLG9CQUFvQixjQURSLE1BQU07MkZBQ2xCLG9CQUFvQjtrQkFEaEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBUWhDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxjQUFjO0lBSW5ELFlBQVksS0FBaUIsRUFDakIsVUFBc0IsRUFDdEIsWUFBa0MsRUFDbEMsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTnhDLGtCQUFhLEdBQUcsV0FBVyxDQUFDO1FBVTVCLGVBQVUsR0FBRyxhQUFhLENBQUM7UUFIbkMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7OEdBVlUsaUJBQWlCLHNFQU1GLG9CQUFvQjtrR0FObkMsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFNBQVM7NEdBT2tCLG9CQUFvQjtBQVNoRCxNQUFNLGFBQWEsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU5RCxNQUFNLE1BQU0sR0FBRztJQUNiLFFBQVE7SUFDUixXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVztJQUMvRCxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBQzlELGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWM7Q0FDL0QsQ0FBQztBQUNGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxpQkFBaUI7SUFEL0Q7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7cUhBRlksd0JBQXdCO3lHQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZVV0aWxzLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuY29uc3QgREVGQVVMVF9WQUxVRSA9ICdhdXRvJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR3JpZEFyZWFTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHsnZ3JpZC1hcmVhJzogaW5wdXQgfHwgREVGQVVMVF9WQUxVRX07XG4gIH1cbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgR3JpZEFyZWFEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG5cbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnZ3JpZC1hcmVhJztcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBHcmlkQXJlYVN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3R5bGVDYWNoZSA9IGdyaWRBcmVhQ2FjaGU7XG59XG5cbmNvbnN0IGdyaWRBcmVhQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkQXJlYScsXG4gICdnZEFyZWEueHMnLCAnZ2RBcmVhLnNtJywgJ2dkQXJlYS5tZCcsICdnZEFyZWEubGcnLCAnZ2RBcmVhLnhsJyxcbiAgJ2dkQXJlYS5sdC1zbScsICdnZEFyZWEubHQtbWQnLCAnZ2RBcmVhLmx0LWxnJywgJ2dkQXJlYS5sdC14bCcsXG4gICdnZEFyZWEuZ3QteHMnLCAnZ2RBcmVhLmd0LXNtJywgJ2dkQXJlYS5ndC1tZCcsICdnZEFyZWEuZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZEFyZWFdLFxuICBbZ2RBcmVhLnhzXSwgW2dkQXJlYS5zbV0sIFtnZEFyZWEubWRdLCBbZ2RBcmVhLmxnXSwgW2dkQXJlYS54bF0sXG4gIFtnZEFyZWEubHQtc21dLCBbZ2RBcmVhLmx0LW1kXSwgW2dkQXJlYS5sdC1sZ10sIFtnZEFyZWEubHQteGxdLFxuICBbZ2RBcmVhLmd0LXhzXSwgW2dkQXJlYS5ndC1zbV0sIFtnZEFyZWEuZ3QtbWRdLCBbZ2RBcmVhLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnZ3JpZC1hcmVhJyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgbmFtZSBvciBwb3NpdGlvbiBvZiBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZ3JpZFxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2Nzcy9jb21wbGV0ZS1ndWlkZS1ncmlkLyNhcnRpY2xlLWhlYWRlci1pZC0yN1xuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0R3JpZEFyZWFEaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQXJlYURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbnB1dHM7XG59XG4iXX0=