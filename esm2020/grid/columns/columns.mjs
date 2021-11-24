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
const DEFAULT_VALUE = 'none';
const AUTO_SPECIFIER = '!';
export class GridColumnsStyleBuilder extends StyleBuilder {
    buildStyles(input, parent) {
        input = input || DEFAULT_VALUE;
        let auto = false;
        if (input.endsWith(AUTO_SPECIFIER)) {
            input = input.substring(0, input.indexOf(AUTO_SPECIFIER));
            auto = true;
        }
        const css = {
            'display': parent.inline ? 'inline-grid' : 'grid',
            'grid-auto-columns': '',
            'grid-template-columns': '',
        };
        const key = (auto ? 'grid-auto-columns' : 'grid-template-columns');
        css[key] = input;
        return css;
    }
}
GridColumnsStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnsStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridColumnsStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnsStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnsStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridColumnsDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-columns';
        this._inline = false;
        this.init();
    }
    get inline() { return this._inline; }
    set inline(val) { this._inline = coerceBooleanProperty(val); }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? columnsInlineCache : columnsCache;
        this.addStyles(value, { inline: this.inline });
    }
}
GridColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnsDirective, deps: [{ token: i0.ElementRef }, { token: GridColumnsStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridColumnsDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridColumnsDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridColumnsStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; }, propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const columnsCache = new Map();
const columnsInlineCache = new Map();
const inputs = [
    'gdColumns',
    'gdColumns.xs', 'gdColumns.sm', 'gdColumns.md', 'gdColumns.lg', 'gdColumns.xl',
    'gdColumns.lt-sm', 'gdColumns.lt-md', 'gdColumns.lt-lg', 'gdColumns.lt-xl',
    'gdColumns.gt-xs', 'gdColumns.gt-sm', 'gdColumns.gt-md', 'gdColumns.gt-lg'
];
const selector = `
  [gdColumns],
  [gdColumns.xs], [gdColumns.sm], [gdColumns.md], [gdColumns.lg], [gdColumns.xl],
  [gdColumns.lt-sm], [gdColumns.lt-md], [gdColumns.lt-lg], [gdColumns.lt-xl],
  [gdColumns.gt-xs], [gdColumns.gt-sm], [gdColumns.gt-md], [gdColumns.gt-lg]
`;
/**
 * 'grid-template-columns' CSS Grid styling directive
 * Configures the sizing for the columns in the grid
 * Syntax: <column value> [auto]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-13
 */
export class DefaultGridColumnsDirective extends GridColumnsDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridColumnsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridColumnsDirective, selector: "\n  [gdColumns],\n  [gdColumns.xs], [gdColumns.sm], [gdColumns.md], [gdColumns.lg], [gdColumns.xl],\n  [gdColumns.lt-sm], [gdColumns.lt-md], [gdColumns.lt-lg], [gdColumns.lt-xl],\n  [gdColumns.gt-xs], [gdColumns.gt-sm], [gdColumns.gt-md], [gdColumns.gt-lg]\n", inputs: { gdColumns: "gdColumns", "gdColumns.xs": "gdColumns.xs", "gdColumns.sm": "gdColumns.sm", "gdColumns.md": "gdColumns.md", "gdColumns.lg": "gdColumns.lg", "gdColumns.xl": "gdColumns.xl", "gdColumns.lt-sm": "gdColumns.lt-sm", "gdColumns.lt-md": "gdColumns.lt-md", "gdColumns.lt-lg": "gdColumns.lt-lg", "gdColumns.lt-xl": "gdColumns.lt-xl", "gdColumns.gt-xs": "gdColumns.gt-xs", "gdColumns.gt-sm": "gdColumns.gt-sm", "gdColumns.gt-md": "gdColumns.gt-md", "gdColumns.gt-lg": "gdColumns.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridColumnsDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9jb2x1bW5zL2NvbHVtbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxLQUFLLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFFTCxjQUFjLEVBQ2QsWUFBWSxHQUdiLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUU1RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDN0IsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBTzNCLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxZQUFZO0lBQ3ZELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBeUI7UUFDbEQsS0FBSyxHQUFHLEtBQUssSUFBSSxhQUFhLENBQUM7UUFDL0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNsQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUksR0FBRyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sR0FBRyxHQUFHO1lBQ1YsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUNqRCxtQkFBbUIsRUFBRSxFQUFFO1lBQ3ZCLHVCQUF1QixFQUFFLEVBQUU7U0FDNUIsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNuRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRWpCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQzs7b0hBbEJVLHVCQUF1Qjt3SEFBdkIsdUJBQXVCLGNBRFgsTUFBTTsyRkFDbEIsdUJBQXVCO2tCQURuQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUF1QmhDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxjQUFjO0lBUXRELFlBQVksVUFBc0IsRUFDdEIsWUFBcUMsRUFDckMsTUFBa0IsRUFDbEIsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBWHpDLGtCQUFhLEdBQUcsY0FBYyxDQUFDO1FBSy9CLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFPeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQVhELElBQ0ksTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSSxNQUFNLENBQUMsR0FBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBV3ZFLGdEQUFnRDtJQUNoRCxvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRXRDLGVBQWUsQ0FBQyxLQUFhO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUNsRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDOztpSEF2QlUsb0JBQW9CLDRDQVNMLHVCQUF1QjtxR0FUdEMsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFNBQVM7bUZBVWtCLHVCQUF1QixpRkFMN0MsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLFVBQVU7O0FBdUJuQixNQUFNLFlBQVksR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3RCxNQUFNLGtCQUFrQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRW5FLE1BQU0sTUFBTSxHQUFHO0lBQ2IsV0FBVztJQUNYLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBQzlFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQjtJQUMxRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUI7Q0FDM0UsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsb0JBQW9CO0lBRHJFOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O3dIQUZZLDJCQUEyQjs0R0FBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBRHZDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBCYXNlRGlyZWN0aXZlMixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IERFRkFVTFRfVkFMVUUgPSAnbm9uZSc7XG5jb25zdCBBVVRPX1NQRUNJRklFUiA9ICchJztcblxuZXhwb3J0IGludGVyZmFjZSBHcmlkQ29sdW1uc1BhcmVudCB7XG4gIGlubGluZTogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR3JpZENvbHVtbnNTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nLCBwYXJlbnQ6IEdyaWRDb2x1bW5zUGFyZW50KSB7XG4gICAgaW5wdXQgPSBpbnB1dCB8fCBERUZBVUxUX1ZBTFVFO1xuICAgIGxldCBhdXRvID0gZmFsc2U7XG4gICAgaWYgKGlucHV0LmVuZHNXaXRoKEFVVE9fU1BFQ0lGSUVSKSkge1xuICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwgaW5wdXQuaW5kZXhPZihBVVRPX1NQRUNJRklFUikpO1xuICAgICAgYXV0byA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY3NzID0ge1xuICAgICAgJ2Rpc3BsYXknOiBwYXJlbnQuaW5saW5lID8gJ2lubGluZS1ncmlkJyA6ICdncmlkJyxcbiAgICAgICdncmlkLWF1dG8tY29sdW1ucyc6ICcnLFxuICAgICAgJ2dyaWQtdGVtcGxhdGUtY29sdW1ucyc6ICcnLFxuICAgIH07XG4gICAgY29uc3Qga2V5ID0gKGF1dG8gPyAnZ3JpZC1hdXRvLWNvbHVtbnMnIDogJ2dyaWQtdGVtcGxhdGUtY29sdW1ucycpO1xuICAgIGNzc1trZXldID0gaW5wdXQ7XG5cbiAgICByZXR1cm4gY3NzO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRDb2x1bW5zRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdncmlkLWNvbHVtbnMnO1xuXG4gIEBJbnB1dCgnZ2RJbmxpbmUnKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW5saW5lOyB9XG4gIHNldCBpbmxpbmUodmFsOiBib29sZWFuKSB7IHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpOyB9XG4gIHByb3RlY3RlZCBfaW5saW5lID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBHcmlkQ29sdW1uc1N0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdHlsZUNhY2hlID0gdGhpcy5pbmxpbmUgPyBjb2x1bW5zSW5saW5lQ2FjaGUgOiBjb2x1bW5zQ2FjaGU7XG4gICAgdGhpcy5hZGRTdHlsZXModmFsdWUsIHtpbmxpbmU6IHRoaXMuaW5saW5lfSk7XG4gIH1cbn1cblxuY29uc3QgY29sdW1uc0NhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgY29sdW1uc0lubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdnZENvbHVtbnMnLFxuICAnZ2RDb2x1bW5zLnhzJywgJ2dkQ29sdW1ucy5zbScsICdnZENvbHVtbnMubWQnLCAnZ2RDb2x1bW5zLmxnJywgJ2dkQ29sdW1ucy54bCcsXG4gICdnZENvbHVtbnMubHQtc20nLCAnZ2RDb2x1bW5zLmx0LW1kJywgJ2dkQ29sdW1ucy5sdC1sZycsICdnZENvbHVtbnMubHQteGwnLFxuICAnZ2RDb2x1bW5zLmd0LXhzJywgJ2dkQ29sdW1ucy5ndC1zbScsICdnZENvbHVtbnMuZ3QtbWQnLCAnZ2RDb2x1bW5zLmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZENvbHVtbnNdLFxuICBbZ2RDb2x1bW5zLnhzXSwgW2dkQ29sdW1ucy5zbV0sIFtnZENvbHVtbnMubWRdLCBbZ2RDb2x1bW5zLmxnXSwgW2dkQ29sdW1ucy54bF0sXG4gIFtnZENvbHVtbnMubHQtc21dLCBbZ2RDb2x1bW5zLmx0LW1kXSwgW2dkQ29sdW1ucy5sdC1sZ10sIFtnZENvbHVtbnMubHQteGxdLFxuICBbZ2RDb2x1bW5zLmd0LXhzXSwgW2dkQ29sdW1ucy5ndC1zbV0sIFtnZENvbHVtbnMuZ3QtbWRdLCBbZ2RDb2x1bW5zLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zJyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgc2l6aW5nIGZvciB0aGUgY29sdW1ucyBpbiB0aGUgZ3JpZFxuICogU3ludGF4OiA8Y29sdW1uIHZhbHVlPiBbYXV0b11cbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jYXJ0aWNsZS1oZWFkZXItaWQtMTNcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRDb2x1bW5zRGlyZWN0aXZlIGV4dGVuZHMgR3JpZENvbHVtbnNEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19