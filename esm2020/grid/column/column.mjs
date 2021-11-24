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
export class GridColumnStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return { 'grid-column': input || DEFAULT_VALUE };
    }
}
GridColumnStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridColumnStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridColumnDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-column';
        this.styleCache = columnCache;
        this.init();
    }
}
GridColumnDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnDirective, deps: [{ token: i0.ElementRef }, { token: GridColumnStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridColumnDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridColumnDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridColumnStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; } });
const columnCache = new Map();
const inputs = [
    'gdColumn',
    'gdColumn.xs', 'gdColumn.sm', 'gdColumn.md', 'gdColumn.lg', 'gdColumn.xl',
    'gdColumn.lt-sm', 'gdColumn.lt-md', 'gdColumn.lt-lg', 'gdColumn.lt-xl',
    'gdColumn.gt-xs', 'gdColumn.gt-sm', 'gdColumn.gt-md', 'gdColumn.gt-lg'
];
const selector = `
  [gdColumn],
  [gdColumn.xs], [gdColumn.sm], [gdColumn.md], [gdColumn.lg], [gdColumn.xl],
  [gdColumn.lt-sm], [gdColumn.lt-md], [gdColumn.lt-lg], [gdColumn.lt-xl],
  [gdColumn.gt-xs], [gdColumn.gt-sm], [gdColumn.gt-md], [gdColumn.gt-lg]
`;
/**
 * 'grid-column' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-26
 */
export class DefaultGridColumnDirective extends GridColumnDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridColumnDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridColumnDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridColumnDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridColumnDirective, selector: "\n  [gdColumn],\n  [gdColumn.xs], [gdColumn.sm], [gdColumn.md], [gdColumn.lg], [gdColumn.xl],\n  [gdColumn.lt-sm], [gdColumn.lt-md], [gdColumn.lt-lg], [gdColumn.lt-xl],\n  [gdColumn.gt-xs], [gdColumn.gt-sm], [gdColumn.gt-md], [gdColumn.gt-lg]\n", inputs: { gdColumn: "gdColumn", "gdColumn.xs": "gdColumn.xs", "gdColumn.sm": "gdColumn.sm", "gdColumn.md": "gdColumn.md", "gdColumn.lg": "gdColumn.lg", "gdColumn.xl": "gdColumn.xl", "gdColumn.lt-sm": "gdColumn.lt-sm", "gdColumn.lt-md": "gdColumn.lt-md", "gdColumn.lt-lg": "gdColumn.lt-lg", "gdColumn.lt-xl": "gdColumn.lt-xl", "gdColumn.gt-xs": "gdColumn.gt-xs", "gdColumn.gt-sm": "gdColumn.gt-sm", "gdColumn.gt-md": "gdColumn.gt-md", "gdColumn.gt-lg": "gdColumn.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridColumnDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL2NvbHVtbi9jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBRWIsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUc3QixNQUFNLE9BQU8sc0JBQXVCLFNBQVEsWUFBWTtJQUN0RCxXQUFXLENBQUMsS0FBYTtRQUN2QixPQUFPLEVBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxhQUFhLEVBQUMsQ0FBQztJQUNqRCxDQUFDOzttSEFIVSxzQkFBc0I7dUhBQXRCLHNCQUFzQixjQURWLE1BQU07MkZBQ2xCLHNCQUFzQjtrQkFEbEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBUWhDLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxjQUFjO0lBR3JELFlBQVksVUFBc0IsRUFDdEIsWUFBb0MsRUFDcEMsTUFBa0IsRUFDbEIsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTnpDLGtCQUFhLEdBQUcsYUFBYSxDQUFDO1FBVTlCLGVBQVUsR0FBRyxXQUFXLENBQUM7UUFIakMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7Z0hBVFUsbUJBQW1CLDRDQUlKLHNCQUFzQjtvR0FKckMsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFNBQVM7bUZBS2tCLHNCQUFzQjtBQVVsRCxNQUFNLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRztJQUNiLFVBQVU7SUFDVixhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYTtJQUN6RSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7SUFDdEUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCO0NBQ3ZFLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsbUJBQW1CO0lBRG5FOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O3VIQUZZLDBCQUEwQjsyR0FBMUIsMEJBQTBCOzJGQUExQiwwQkFBMEI7a0JBRHRDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVVdGlscyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbmNvbnN0IERFRkFVTFRfVkFMVUUgPSAnYXV0byc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEdyaWRDb2x1bW5TdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHsnZ3JpZC1jb2x1bW4nOiBpbnB1dCB8fCBERUZBVUxUX1ZBTFVFfTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBHcmlkQ29sdW1uRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdncmlkLWNvbHVtbic7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBHcmlkQ29sdW1uU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdHlsZUNhY2hlID0gY29sdW1uQ2FjaGU7XG59XG5cbmNvbnN0IGNvbHVtbkNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdnZENvbHVtbicsXG4gICdnZENvbHVtbi54cycsICdnZENvbHVtbi5zbScsICdnZENvbHVtbi5tZCcsICdnZENvbHVtbi5sZycsICdnZENvbHVtbi54bCcsXG4gICdnZENvbHVtbi5sdC1zbScsICdnZENvbHVtbi5sdC1tZCcsICdnZENvbHVtbi5sdC1sZycsICdnZENvbHVtbi5sdC14bCcsXG4gICdnZENvbHVtbi5ndC14cycsICdnZENvbHVtbi5ndC1zbScsICdnZENvbHVtbi5ndC1tZCcsICdnZENvbHVtbi5ndC1sZydcbl07XG5cbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZ2RDb2x1bW5dLFxuICBbZ2RDb2x1bW4ueHNdLCBbZ2RDb2x1bW4uc21dLCBbZ2RDb2x1bW4ubWRdLCBbZ2RDb2x1bW4ubGddLCBbZ2RDb2x1bW4ueGxdLFxuICBbZ2RDb2x1bW4ubHQtc21dLCBbZ2RDb2x1bW4ubHQtbWRdLCBbZ2RDb2x1bW4ubHQtbGddLCBbZ2RDb2x1bW4ubHQteGxdLFxuICBbZ2RDb2x1bW4uZ3QteHNdLCBbZ2RDb2x1bW4uZ3Qtc21dLCBbZ2RDb2x1bW4uZ3QtbWRdLCBbZ2RDb2x1bW4uZ3QtbGddXG5gO1xuXG4vKipcbiAqICdncmlkLWNvbHVtbicgQ1NTIEdyaWQgc3R5bGluZyBkaXJlY3RpdmVcbiAqIENvbmZpZ3VyZXMgdGhlIG5hbWUgb3IgcG9zaXRpb24gb2YgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGdyaWRcbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jYXJ0aWNsZS1oZWFkZXItaWQtMjZcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRDb2x1bW5EaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQ29sdW1uRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cbiJdfQ==