/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable, Input } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
const DEFAULT_VALUE = 'none';
const DELIMETER = '|';
export class GridAreasStyleBuiler extends StyleBuilder {
    buildStyles(input, parent) {
        const areas = (input || DEFAULT_VALUE).split(DELIMETER).map(v => `"${v.trim()}"`);
        return {
            'display': parent.inline ? 'inline-grid' : 'grid',
            'grid-template-areas': areas.join(' ')
        };
    }
}
GridAreasStyleBuiler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreasStyleBuiler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAreasStyleBuiler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreasStyleBuiler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreasStyleBuiler, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAreasDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'grid-areas';
        this._inline = false;
        this.init();
    }
    get inline() { return this._inline; }
    set inline(val) { this._inline = coerceBooleanProperty(val); }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? areasInlineCache : areasCache;
        this.addStyles(value, { inline: this.inline });
    }
}
GridAreasDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreasDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: GridAreasStyleBuiler }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAreasDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridAreasDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAreasDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: GridAreasStyleBuiler }, { type: i1.MediaMarshaller }]; }, propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const areasCache = new Map();
const areasInlineCache = new Map();
const inputs = [
    'gdAreas',
    'gdAreas.xs', 'gdAreas.sm', 'gdAreas.md', 'gdAreas.lg', 'gdAreas.xl',
    'gdAreas.lt-sm', 'gdAreas.lt-md', 'gdAreas.lt-lg', 'gdAreas.lt-xl',
    'gdAreas.gt-xs', 'gdAreas.gt-sm', 'gdAreas.gt-md', 'gdAreas.gt-lg'
];
const selector = `
  [gdAreas],
  [gdAreas.xs], [gdAreas.sm], [gdAreas.md], [gdAreas.lg], [gdAreas.xl],
  [gdAreas.lt-sm], [gdAreas.lt-md], [gdAreas.lt-lg], [gdAreas.lt-xl],
  [gdAreas.gt-xs], [gdAreas.gt-sm], [gdAreas.gt-md], [gdAreas.gt-lg]
`;
/**
 * 'grid-template-areas' CSS Grid styling directive
 * Configures the names of elements within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-14
 */
export class DefaultGridAreasDirective extends GridAreasDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAreasDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAreasDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAreasDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridAreasDirective, selector: "\n  [gdAreas],\n  [gdAreas.xs], [gdAreas.sm], [gdAreas.md], [gdAreas.lg], [gdAreas.xl],\n  [gdAreas.lt-sm], [gdAreas.lt-md], [gdAreas.lt-lg], [gdAreas.lt-xl],\n  [gdAreas.gt-xs], [gdAreas.gt-sm], [gdAreas.gt-md], [gdAreas.gt-lg]\n", inputs: { gdAreas: "gdAreas", "gdAreas.xs": "gdAreas.xs", "gdAreas.sm": "gdAreas.sm", "gdAreas.md": "gdAreas.md", "gdAreas.lg": "gdAreas.lg", "gdAreas.xl": "gdAreas.xl", "gdAreas.lt-sm": "gdAreas.lt-sm", "gdAreas.lt-md": "gdAreas.lt-md", "gdAreas.lt-lg": "gdAreas.lt-lg", "gdAreas.lt-xl": "gdAreas.lt-xl", "gdAreas.gt-xs": "gdAreas.gt-xs", "gdAreas.gt-sm": "gdAreas.gt-sm", "gdAreas.gt-md": "gdAreas.gt-md", "gdAreas.gt-lg": "gdAreas.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAreasDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2dyaWQvYXJlYXMvYXJlYXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxjQUFjLEVBRWQsWUFBWSxHQUdiLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUU1RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBT3RCLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxZQUFZO0lBQ3BELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBdUI7UUFDaEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVsRixPQUFPO1lBQ0wsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNqRCxxQkFBcUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUN2QyxDQUFDO0lBQ0osQ0FBQzs7aUhBUlUsb0JBQW9CO3FIQUFwQixvQkFBb0IsY0FEUixNQUFNOzJGQUNsQixvQkFBb0I7a0JBRGhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQWFoQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsY0FBYztJQVNwRCxZQUFZLEtBQWlCLEVBQ2pCLFVBQXNCLEVBQ3RCLFlBQWtDLEVBQ2xDLE9BQXdCO1FBQ2xDLEtBQUssQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQVh4QyxrQkFBYSxHQUFHLFlBQVksQ0FBQztRQUs3QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBT3hCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFYRCxJQUNJLE1BQU0sS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzlDLElBQUksTUFBTSxDQUFDLEdBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQVd2RSxnREFBZ0Q7SUFDaEQsb0JBQW9CO0lBQ3BCLGdEQUFnRDtJQUV0QyxlQUFlLENBQUMsS0FBYTtRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDOUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7K0dBeEJVLGtCQUFrQixzRUFXSCxvQkFBb0I7bUdBWG5DLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUQ5QixTQUFTOzRHQVlrQixvQkFBb0Isd0RBTjFDLE1BQU07c0JBRFQsS0FBSzt1QkFBQyxVQUFVOztBQXVCbkIsTUFBTSxVQUFVLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDM0QsTUFBTSxnQkFBZ0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUVqRSxNQUFNLE1BQU0sR0FBRztJQUNiLFNBQVM7SUFDVCxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWTtJQUNwRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlO0lBQ2xFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWU7Q0FDbkUsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxrQkFBa0I7SUFEakU7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7c0hBRlkseUJBQXlCOzBHQUF6Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFEckMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVVdGlscyxcbiAgU3R5bGVCdWlsZGVyLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcblxuY29uc3QgREVGQVVMVF9WQUxVRSA9ICdub25lJztcbmNvbnN0IERFTElNRVRFUiA9ICd8JztcblxuZXhwb3J0IGludGVyZmFjZSBHcmlkQXJlYXNQYXJlbnQge1xuICBpbmxpbmU6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEdyaWRBcmVhc1N0eWxlQnVpbGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZywgcGFyZW50OiBHcmlkQXJlYXNQYXJlbnQpIHtcbiAgICBjb25zdCBhcmVhcyA9IChpbnB1dCB8fCBERUZBVUxUX1ZBTFVFKS5zcGxpdChERUxJTUVURVIpLm1hcCh2ID0+IGBcIiR7di50cmltKCl9XCJgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAnZGlzcGxheSc6IHBhcmVudC5pbmxpbmUgPyAnaW5saW5lLWdyaWQnIDogJ2dyaWQnLFxuICAgICAgJ2dyaWQtdGVtcGxhdGUtYXJlYXMnOiBhcmVhcy5qb2luKCcgJylcbiAgICB9O1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRBcmVhc0RpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdncmlkLWFyZWFzJztcblxuICBASW5wdXQoJ2dkSW5saW5lJylcbiAgZ2V0IGlubGluZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lubGluZTsgfVxuICBzZXQgaW5saW5lKHZhbDogYm9vbGVhbikgeyB0aGlzLl9pbmxpbmUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTsgfVxuICBwcm90ZWN0ZWQgX2lubGluZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGVsUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZVV0aWxzOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IEdyaWRBcmVhc1N0eWxlQnVpbGVyLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZVV0aWxzLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnN0eWxlQ2FjaGUgPSB0aGlzLmlubGluZSA/IGFyZWFzSW5saW5lQ2FjaGUgOiBhcmVhc0NhY2hlO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlLCB7aW5saW5lOiB0aGlzLmlubGluZX0pO1xuICB9XG59XG5cbmNvbnN0IGFyZWFzQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBhcmVhc0lubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdnZEFyZWFzJyxcbiAgJ2dkQXJlYXMueHMnLCAnZ2RBcmVhcy5zbScsICdnZEFyZWFzLm1kJywgJ2dkQXJlYXMubGcnLCAnZ2RBcmVhcy54bCcsXG4gICdnZEFyZWFzLmx0LXNtJywgJ2dkQXJlYXMubHQtbWQnLCAnZ2RBcmVhcy5sdC1sZycsICdnZEFyZWFzLmx0LXhsJyxcbiAgJ2dkQXJlYXMuZ3QteHMnLCAnZ2RBcmVhcy5ndC1zbScsICdnZEFyZWFzLmd0LW1kJywgJ2dkQXJlYXMuZ3QtbGcnXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2dkQXJlYXNdLFxuICBbZ2RBcmVhcy54c10sIFtnZEFyZWFzLnNtXSwgW2dkQXJlYXMubWRdLCBbZ2RBcmVhcy5sZ10sIFtnZEFyZWFzLnhsXSxcbiAgW2dkQXJlYXMubHQtc21dLCBbZ2RBcmVhcy5sdC1tZF0sIFtnZEFyZWFzLmx0LWxnXSwgW2dkQXJlYXMubHQteGxdLFxuICBbZ2RBcmVhcy5ndC14c10sIFtnZEFyZWFzLmd0LXNtXSwgW2dkQXJlYXMuZ3QtbWRdLCBbZ2RBcmVhcy5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2dyaWQtdGVtcGxhdGUtYXJlYXMnIENTUyBHcmlkIHN0eWxpbmcgZGlyZWN0aXZlXG4gKiBDb25maWd1cmVzIHRoZSBuYW1lcyBvZiBlbGVtZW50cyB3aXRoaW4gdGhlIGdyaWRcbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jYXJ0aWNsZS1oZWFkZXItaWQtMTRcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRBcmVhc0RpcmVjdGl2ZSBleHRlbmRzIEdyaWRBcmVhc0RpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbnB1dHM7XG59XG4iXX0=