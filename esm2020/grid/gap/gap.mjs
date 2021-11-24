/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
const DEFAULT_VALUE = '0';
export class GridGapStyleBuilder extends StyleBuilder {
    buildStyles(input, parent) {
        return {
            'display': parent.inline ? 'inline-grid' : 'grid',
            'grid-gap': input || DEFAULT_VALUE
        };
    }
}
GridGapStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridGapStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridGapStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridGapStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridGapStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridGapDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'grid-gap';
        this._inline = false;
        this.init();
    }
    get inline() { return this._inline; }
    set inline(val) { this._inline = coerceBooleanProperty(val); }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? gapInlineCache : gapCache;
        this.addStyles(value, { inline: this.inline });
    }
}
GridGapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridGapDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: GridGapStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridGapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridGapDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridGapDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: GridGapStyleBuilder }, { type: i1.MediaMarshaller }]; }, propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const gapCache = new Map();
const gapInlineCache = new Map();
const inputs = [
    'gdGap',
    'gdGap.xs', 'gdGap.sm', 'gdGap.md', 'gdGap.lg', 'gdGap.xl',
    'gdGap.lt-sm', 'gdGap.lt-md', 'gdGap.lt-lg', 'gdGap.lt-xl',
    'gdGap.gt-xs', 'gdGap.gt-sm', 'gdGap.gt-md', 'gdGap.gt-lg'
];
const selector = `
  [gdGap],
  [gdGap.xs], [gdGap.sm], [gdGap.md], [gdGap.lg], [gdGap.xl],
  [gdGap.lt-sm], [gdGap.lt-md], [gdGap.lt-lg], [gdGap.lt-xl],
  [gdGap.gt-xs], [gdGap.gt-sm], [gdGap.gt-md], [gdGap.gt-lg]
`;
/**
 * 'grid-gap' CSS Grid styling directive
 * Configures the gap between items in the grid
 * Syntax: <row gap> [<column-gap>]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-17
 */
export class DefaultGridGapDirective extends GridGapDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridGapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridGapDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridGapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridGapDirective, selector: "\n  [gdGap],\n  [gdGap.xs], [gdGap.sm], [gdGap.md], [gdGap.lg], [gdGap.xl],\n  [gdGap.lt-sm], [gdGap.lt-md], [gdGap.lt-lg], [gdGap.lt-xl],\n  [gdGap.gt-xs], [gdGap.gt-sm], [gdGap.gt-md], [gdGap.gt-lg]\n", inputs: { gdGap: "gdGap", "gdGap.xs": "gdGap.xs", "gdGap.sm": "gdGap.sm", "gdGap.md": "gdGap.md", "gdGap.lg": "gdGap.lg", "gdGap.xl": "gdGap.xl", "gdGap.lt-sm": "gdGap.lt-sm", "gdGap.lt-md": "gdGap.lt-md", "gdGap.lt-lg": "gdGap.lt-lg", "gdGap.lt-xl": "gdGap.lt-xl", "gdGap.gt-xs": "gdGap.gt-xs", "gdGap.gt-sm": "gdGap.gt-sm", "gdGap.gt-md": "gdGap.gt-md", "gdGap.gt-lg": "gdGap.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridGapDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL2dhcC9nYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxLQUFLLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxjQUFjLEVBR2QsWUFBWSxHQUViLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUU1RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUM7QUFPMUIsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFlBQVk7SUFDbkQsV0FBVyxDQUFDLEtBQWEsRUFBRSxNQUFxQjtRQUM5QyxPQUFPO1lBQ0wsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNqRCxVQUFVLEVBQUUsS0FBSyxJQUFJLGFBQWE7U0FDbkMsQ0FBQztJQUNKLENBQUM7O2dIQU5VLG1CQUFtQjtvSEFBbkIsbUJBQW1CLGNBRFAsTUFBTTsyRkFDbEIsbUJBQW1CO2tCQUQvQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFXaEMsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGNBQWM7SUFRbEQsWUFBWSxLQUFpQixFQUNqQixVQUFzQixFQUN0QixZQUFpQyxFQUNqQyxPQUF3QjtRQUNsQyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFYeEMsa0JBQWEsR0FBRyxVQUFVLENBQUM7UUFLM0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQU94QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBWEQsSUFDSSxNQUFNLEtBQWMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5QyxJQUFJLE1BQU0sQ0FBQyxHQUFZLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFXdkUsZ0RBQWdEO0lBQ2hELG9CQUFvQjtJQUNwQixnREFBZ0Q7SUFFdEMsZUFBZSxDQUFDLEtBQWE7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs2R0F2QlUsZ0JBQWdCLHNFQVVELG1CQUFtQjtpR0FWbEMsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFNBQVM7NEdBV2tCLG1CQUFtQix3REFOekMsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLFVBQVU7O0FBdUJuQixNQUFNLFFBQVEsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN6RCxNQUFNLGNBQWMsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUUvRCxNQUFNLE1BQU0sR0FBRztJQUNiLE9BQU87SUFDUCxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVTtJQUMxRCxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhO0lBQzFELGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWE7Q0FDM0QsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsZ0JBQWdCO0lBRDdEOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O29IQUZZLHVCQUF1Qjt3R0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlVXRpbHMsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IERFRkFVTFRfVkFMVUUgPSAnMCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZEdhcFBhcmVudCB7XG4gIGlubGluZTogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR3JpZEdhcFN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGlucHV0OiBzdHJpbmcsIHBhcmVudDogR3JpZEdhcFBhcmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAnZGlzcGxheSc6IHBhcmVudC5pbmxpbmUgPyAnaW5saW5lLWdyaWQnIDogJ2dyaWQnLFxuICAgICAgJ2dyaWQtZ2FwJzogaW5wdXQgfHwgREVGQVVMVF9WQUxVRVxuICAgIH07XG4gIH1cbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgR3JpZEdhcERpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnZ3JpZC1nYXAnO1xuXG4gIEBJbnB1dCgnZ2RJbmxpbmUnKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW5saW5lOyB9XG4gIHNldCBpbmxpbmUodmFsOiBib29sZWFuKSB7IHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpOyB9XG4gIHByb3RlY3RlZCBfaW5saW5lID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlVXRpbHM6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogR3JpZEdhcFN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdHlsZUNhY2hlID0gdGhpcy5pbmxpbmUgPyBnYXBJbmxpbmVDYWNoZSA6IGdhcENhY2hlO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlLCB7aW5saW5lOiB0aGlzLmlubGluZX0pO1xuICB9XG59XG5cbmNvbnN0IGdhcENhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgZ2FwSW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkR2FwJyxcbiAgJ2dkR2FwLnhzJywgJ2dkR2FwLnNtJywgJ2dkR2FwLm1kJywgJ2dkR2FwLmxnJywgJ2dkR2FwLnhsJyxcbiAgJ2dkR2FwLmx0LXNtJywgJ2dkR2FwLmx0LW1kJywgJ2dkR2FwLmx0LWxnJywgJ2dkR2FwLmx0LXhsJyxcbiAgJ2dkR2FwLmd0LXhzJywgJ2dkR2FwLmd0LXNtJywgJ2dkR2FwLmd0LW1kJywgJ2dkR2FwLmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZEdhcF0sXG4gIFtnZEdhcC54c10sIFtnZEdhcC5zbV0sIFtnZEdhcC5tZF0sIFtnZEdhcC5sZ10sIFtnZEdhcC54bF0sXG4gIFtnZEdhcC5sdC1zbV0sIFtnZEdhcC5sdC1tZF0sIFtnZEdhcC5sdC1sZ10sIFtnZEdhcC5sdC14bF0sXG4gIFtnZEdhcC5ndC14c10sIFtnZEdhcC5ndC1zbV0sIFtnZEdhcC5ndC1tZF0sIFtnZEdhcC5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2dyaWQtZ2FwJyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgZ2FwIGJldHdlZW4gaXRlbXMgaW4gdGhlIGdyaWRcbiAqIFN5bnRheDogPHJvdyBnYXA+IFs8Y29sdW1uLWdhcD5dXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI2FydGljbGUtaGVhZGVyLWlkLTE3XG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRHcmlkR2FwRGlyZWN0aXZlIGV4dGVuZHMgR3JpZEdhcERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbnB1dHM7XG59XG4iXX0=