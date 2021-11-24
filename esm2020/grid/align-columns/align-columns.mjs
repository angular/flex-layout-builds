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
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
export class GridAlignColumnsStyleBuilder extends StyleBuilder {
    buildStyles(input, parent) {
        return buildCss(input || `${DEFAULT_MAIN} ${DEFAULT_CROSS}`, parent.inline);
    }
}
GridAlignColumnsStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignColumnsStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAlignColumnsStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignColumnsStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignColumnsStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignColumnsDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align-columns';
        this._inline = false;
        this.init();
    }
    get inline() { return this._inline; }
    set inline(val) { this._inline = coerceBooleanProperty(val); }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? alignColumnsInlineCache : alignColumnsCache;
        this.addStyles(value, { inline: this.inline });
    }
}
GridAlignColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignColumnsDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignColumnsStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAlignColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridAlignColumnsDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignColumnsDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridAlignColumnsStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; }, propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const alignColumnsCache = new Map();
const alignColumnsInlineCache = new Map();
const inputs = [
    'gdAlignColumns',
    'gdAlignColumns.xs', 'gdAlignColumns.sm', 'gdAlignColumns.md',
    'gdAlignColumns.lg', 'gdAlignColumns.xl', 'gdAlignColumns.lt-sm',
    'gdAlignColumns.lt-md', 'gdAlignColumns.lt-lg', 'gdAlignColumns.lt-xl',
    'gdAlignColumns.gt-xs', 'gdAlignColumns.gt-sm', 'gdAlignColumns.gt-md',
    'gdAlignColumns.gt-lg'
];
const selector = `
  [gdAlignColumns],
  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],
  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],
  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],
  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],
  [gdAlignColumns.gt-lg]
`;
/**
 * 'column alignment' CSS Grid styling directive
 * Configures the alignment in the column direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21
 */
export class DefaultGridAlignColumnsDirective extends GridAlignColumnsDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAlignColumnsDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAlignColumnsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAlignColumnsDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridAlignColumnsDirective, selector: "\n  [gdAlignColumns],\n  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],\n  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],\n  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],\n  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],\n  [gdAlignColumns.gt-lg]\n", inputs: { gdAlignColumns: "gdAlignColumns", "gdAlignColumns.xs": "gdAlignColumns.xs", "gdAlignColumns.sm": "gdAlignColumns.sm", "gdAlignColumns.md": "gdAlignColumns.md", "gdAlignColumns.lg": "gdAlignColumns.lg", "gdAlignColumns.xl": "gdAlignColumns.xl", "gdAlignColumns.lt-sm": "gdAlignColumns.lt-sm", "gdAlignColumns.lt-md": "gdAlignColumns.lt-md", "gdAlignColumns.lt-lg": "gdAlignColumns.lt-lg", "gdAlignColumns.lt-xl": "gdAlignColumns.lt-xl", "gdAlignColumns.gt-xs": "gdAlignColumns.gt-xs", "gdAlignColumns.gt-sm": "gdAlignColumns.gt-sm", "gdAlignColumns.gt-md": "gdAlignColumns.gt-md", "gdAlignColumns.gt-lg": "gdAlignColumns.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAlignColumnsDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align, inline) {
    const css = {}, [mainAxis, crossAxis] = align.split(' ');
    // Main axis
    switch (mainAxis) {
        case 'center':
            css['align-content'] = 'center';
            break;
        case 'space-around':
            css['align-content'] = 'space-around';
            break;
        case 'space-between':
            css['align-content'] = 'space-between';
            break;
        case 'space-evenly':
            css['align-content'] = 'space-evenly';
            break;
        case 'end':
            css['align-content'] = 'end';
            break;
        case 'start':
            css['align-content'] = 'start';
            break;
        case 'stretch':
            css['align-content'] = 'stretch';
            break;
        default:
            css['align-content'] = DEFAULT_MAIN; // default main axis
            break;
    }
    // Cross-axis
    switch (crossAxis) {
        case 'start':
            css['align-items'] = 'start';
            break;
        case 'center':
            css['align-items'] = 'center';
            break;
        case 'end':
            css['align-items'] = 'end';
            break;
        case 'stretch':
            css['align-items'] = 'stretch';
            break;
        default: // 'stretch'
            css['align-items'] = DEFAULT_CROSS; // default cross axis
            break;
    }
    css['display'] = inline ? 'inline-grid' : 'grid';
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpZ24tY29sdW1ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9hbGlnbi1jb2x1bW5zL2FsaWduLWNvbHVtbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxjQUFjLEVBRWQsWUFBWSxHQUdiLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7OztBQUU1RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDN0IsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBT2hDLE1BQU0sT0FBTyw0QkFBNkIsU0FBUSxZQUFZO0lBQzVELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBOEI7UUFDdkQsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsWUFBWSxJQUFJLGFBQWEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RSxDQUFDOzt5SEFIVSw0QkFBNEI7NkhBQTVCLDRCQUE0QixjQURoQixNQUFNOzJGQUNsQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQVFoQyxNQUFNLE9BQU8seUJBQTBCLFNBQVEsY0FBYztJQVMzRCxZQUFZLFVBQXNCLEVBQ3RCLFlBQTBDLEVBQzFDLE1BQWtCLEVBQ2xCLE9BQXdCO1FBQ2xDLEtBQUssQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVh6QyxrQkFBYSxHQUFHLG9CQUFvQixDQUFDO1FBS3JDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFPeEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFD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Q0FBQztZQUM3QixNQUFNO1FBQ1IsS0FBSyxRQUFRO1lBQ1gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUM5QixNQUFNO1FBQ1IsS0FBSyxLQUFLO1lBQ1IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMzQixNQUFNO1FBQ1IsS0FBSyxTQUFTO1lBQ1osR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUMvQixNQUFNO1FBQ1IsU0FBVSxZQUFZO1lBQ3BCLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBRyxxQkFBcUI7WUFDM0QsTUFBTTtLQUNUO0lBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFakQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlVXRpbHMsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBNZWRpYU1hcnNoYWxsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmNvbnN0IERFRkFVTFRfTUFJTiA9ICdzdGFydCc7XG5jb25zdCBERUZBVUxUX0NST1NTID0gJ3N0cmV0Y2gnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdyaWRBbGlnbkNvbHVtbnNQYXJlbnQge1xuICBpbmxpbmU6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEdyaWRBbGlnbkNvbHVtbnNTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nLCBwYXJlbnQ6IEdyaWRBbGlnbkNvbHVtbnNQYXJlbnQpIHtcbiAgICByZXR1cm4gYnVpbGRDc3MoaW5wdXQgfHwgYCR7REVGQVVMVF9NQUlOfSAke0RFRkFVTFRfQ1JPU1N9YCwgcGFyZW50LmlubGluZSk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgR3JpZEFsaWduQ29sdW1uc0RpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdncmlkLWFsaWduLWNvbHVtbnMnO1xuXG4gIEBJbnB1dCgnZ2RJbmxpbmUnKVxuICBnZXQgaW5saW5lKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faW5saW5lOyB9XG4gIHNldCBpbmxpbmUodmFsOiBib29sZWFuKSB7IHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpOyB9XG4gIHByb3RlY3RlZCBfaW5saW5lID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBHcmlkQWxpZ25Db2x1bW5zU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnN0eWxlQ2FjaGUgPSB0aGlzLmlubGluZSA/IGFsaWduQ29sdW1uc0lubGluZUNhY2hlIDogYWxpZ25Db2x1bW5zQ2FjaGU7XG4gICAgdGhpcy5hZGRTdHlsZXModmFsdWUsIHtpbmxpbmU6IHRoaXMuaW5saW5lfSk7XG4gIH1cbn1cblxuY29uc3QgYWxpZ25Db2x1bW5zQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBhbGlnbkNvbHVtbnNJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcblxuY29uc3QgaW5wdXRzID0gW1xuICAnZ2RBbGlnbkNvbHVtbnMnLFxuICAnZ2RBbGlnbkNvbHVtbnMueHMnLCAnZ2RBbGlnbkNvbHVtbnMuc20nLCAnZ2RBbGlnbkNvbHVtbnMubWQnLFxuICAnZ2RBbGlnbkNvbHVtbnMubGcnLCAnZ2RBbGlnbkNvbHVtbnMueGwnLCAnZ2RBbGlnbkNvbHVtbnMubHQtc20nLFxuICAnZ2RBbGlnbkNvbHVtbnMubHQtbWQnLCAnZ2RBbGlnbkNvbHVtbnMubHQtbGcnLCAnZ2RBbGlnbkNvbHVtbnMubHQteGwnLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3QteHMnLCAnZ2RBbGlnbkNvbHVtbnMuZ3Qtc20nLCAnZ2RBbGlnbkNvbHVtbnMuZ3QtbWQnLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtnZEFsaWduQ29sdW1uc10sXG4gIFtnZEFsaWduQ29sdW1ucy54c10sIFtnZEFsaWduQ29sdW1ucy5zbV0sIFtnZEFsaWduQ29sdW1ucy5tZF0sXG4gIFtnZEFsaWduQ29sdW1ucy5sZ10sIFtnZEFsaWduQ29sdW1ucy54bF0sIFtnZEFsaWduQ29sdW1ucy5sdC1zbV0sXG4gIFtnZEFsaWduQ29sdW1ucy5sdC1tZF0sIFtnZEFsaWduQ29sdW1ucy5sdC1sZ10sIFtnZEFsaWduQ29sdW1ucy5sdC14bF0sXG4gIFtnZEFsaWduQ29sdW1ucy5ndC14c10sIFtnZEFsaWduQ29sdW1ucy5ndC1zbV0sIFtnZEFsaWduQ29sdW1ucy5ndC1tZF0sXG4gIFtnZEFsaWduQ29sdW1ucy5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2NvbHVtbiBhbGlnbm1lbnQnIENTUyBHcmlkIHN0eWxpbmcgZGlyZWN0aXZlXG4gKiBDb25maWd1cmVzIHRoZSBhbGlnbm1lbnQgaW4gdGhlIGNvbHVtbiBkaXJlY3Rpb25cbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jYXJ0aWNsZS1oZWFkZXItaWQtMTlcbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jYXJ0aWNsZS1oZWFkZXItaWQtMjFcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQWxpZ25Db2x1bW5zRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cblxuZnVuY3Rpb24gYnVpbGRDc3MoYWxpZ246IHN0cmluZywgaW5saW5lOiBib29sZWFuKTogU3R5bGVEZWZpbml0aW9uIHtcbiAgY29uc3QgY3NzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9LCBbbWFpbkF4aXMsIGNyb3NzQXhpc10gPSBhbGlnbi5zcGxpdCgnICcpO1xuXG4gIC8vIE1haW4gYXhpc1xuICBzd2l0Y2ggKG1haW5BeGlzKSB7XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ2NlbnRlcic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzcGFjZS1hcm91bmQnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3BhY2UtYXJvdW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3NwYWNlLWJldHdlZW4nOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3BhY2UtYmV0d2Vlbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzcGFjZS1ldmVubHknOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3BhY2UtZXZlbmx5JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdlbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3RhcnQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdzdHJldGNoJztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9IERFRkFVTFRfTUFJTjsgIC8vIGRlZmF1bHQgbWFpbiBheGlzXG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIENyb3NzLWF4aXNcbiAgc3dpdGNoIChjcm9zc0F4aXMpIHtcbiAgICBjYXNlICdzdGFydCc6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RhcnQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZW5kJzpcbiAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdlbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RyZXRjaCc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0IDogLy8gJ3N0cmV0Y2gnXG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSBERUZBVUxUX0NST1NTOyAgIC8vIGRlZmF1bHQgY3Jvc3MgYXhpc1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBjc3NbJ2Rpc3BsYXknXSA9IGlubGluZSA/ICdpbmxpbmUtZ3JpZCcgOiAnZ3JpZCc7XG5cbiAgcmV0dXJuIGNzcztcbn1cbiJdfQ==