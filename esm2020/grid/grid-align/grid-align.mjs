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
const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';
export class GridAlignStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return buildCss(input || ROW_DEFAULT);
    }
}
GridAlignStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GridAlignStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align';
        this.styleCache = alignCache;
        this.init();
    }
}
GridAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
GridAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: GridAlignDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: GridAlignStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }]; } });
const alignCache = new Map();
const inputs = [
    'gdGridAlign',
    'gdGridAlign.xs', 'gdGridAlign.sm', 'gdGridAlign.md', 'gdGridAlign.lg', 'gdGridAlign.xl',
    'gdGridAlign.lt-sm', 'gdGridAlign.lt-md', 'gdGridAlign.lt-lg', 'gdGridAlign.lt-xl',
    'gdGridAlign.gt-xs', 'gdGridAlign.gt-sm', 'gdGridAlign.gt-md', 'gdGridAlign.gt-lg'
];
const selector = `
  [gdGridAlign],
  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],
  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],
  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]
`;
/**
 * 'align' CSS Grid styling directive for grid children
 *  Defines positioning of child elements along row and column axis in a grid container
 *  Optional values: {row-axis} values or {row-axis column-axis} value pairs
 *
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-justify-self
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-align-self
 */
export class DefaultGridAlignDirective extends GridAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultGridAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultGridAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultGridAlignDirective, selector: "\n  [gdGridAlign],\n  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],\n  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],\n  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]\n", inputs: { gdGridAlign: "gdGridAlign", "gdGridAlign.xs": "gdGridAlign.xs", "gdGridAlign.sm": "gdGridAlign.sm", "gdGridAlign.md": "gdGridAlign.md", "gdGridAlign.lg": "gdGridAlign.lg", "gdGridAlign.xl": "gdGridAlign.xl", "gdGridAlign.lt-sm": "gdGridAlign.lt-sm", "gdGridAlign.lt-md": "gdGridAlign.lt-md", "gdGridAlign.lt-lg": "gdGridAlign.lt-lg", "gdGridAlign.lt-xl": "gdGridAlign.lt-xl", "gdGridAlign.gt-xs": "gdGridAlign.gt-xs", "gdGridAlign.gt-sm": "gdGridAlign.gt-sm", "gdGridAlign.gt-md": "gdGridAlign.gt-md", "gdGridAlign.gt-lg": "gdGridAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultGridAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align = '') {
    const css = {}, [rowAxis, columnAxis] = align.split(' ');
    // Row axis
    switch (rowAxis) {
        case 'end':
            css['justify-self'] = 'end';
            break;
        case 'center':
            css['justify-self'] = 'center';
            break;
        case 'stretch':
            css['justify-self'] = 'stretch';
            break;
        case 'start':
            css['justify-self'] = 'start';
            break;
        default:
            css['justify-self'] = ROW_DEFAULT; // default row axis
            break;
    }
    // Column axis
    switch (columnAxis) {
        case 'end':
            css['align-self'] = 'end';
            break;
        case 'center':
            css['align-self'] = 'center';
            break;
        case 'stretch':
            css['align-self'] = 'stretch';
            break;
        case 'start':
            css['align-self'] = 'start';
            break;
        default:
            css['align-self'] = COL_DEFAULT; // default column axis
            break;
    }
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1hbGlnbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9ncmlkLWFsaWduL2dyaWQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUVMLGNBQWMsRUFDZCxZQUFZLEdBR2IsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBRW5DLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFHOUIsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFlBQVk7SUFDckQsV0FBVyxDQUFDLEtBQWE7UUFDdkIsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7O2tIQUhVLHFCQUFxQjtzSEFBckIscUJBQXFCLGNBRFQsTUFBTTsyRkFDbEIscUJBQXFCO2tCQURqQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFRaEMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFJcEQsWUFBWSxVQUFzQixFQUN0QixZQUFtQyxFQUNuQyxNQUFrQixFQUNsQixPQUF3QjtRQUNsQyxLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFOekMsa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFVN0IsZUFBVSxHQUFHLFVBQVUsQ0FBQztRQUhoQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDOzsrR0FWVSxrQkFBa0IsNENBS0gscUJBQXFCO21HQUxwQyxrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsU0FBUzttRkFNa0IscUJBQXFCO0FBVWpELE1BQU0sVUFBVSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTNELE1BQU0sTUFBTSxHQUFHO0lBQ2IsYUFBYTtJQUNiLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQjtJQUN4RixtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUI7SUFDbEYsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CO0NBQ25GLENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRzs7Ozs7Q0FLaEIsQ0FBQztBQUVGOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCO0lBRGpFOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O3NIQUZZLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBRHJDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDOztBQUs3QixTQUFTLFFBQVEsQ0FBQyxRQUFnQixFQUFFO0lBQ2xDLE1BQU0sR0FBRyxHQUE0QixFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVsRixXQUFXO0lBQ1gsUUFBUSxPQUFPLEVBQUU7UUFDZixLQUFLLEtBQUs7WUFDUixHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE1BQU07UUFDUixLQUFLLFFBQVE7WUFDWCxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQy9CLE1BQU07UUFDUixLQUFLLFNBQVM7WUFDWixHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQ2hDLE1BQU07UUFDUixLQUFLLE9BQU87WUFDVixHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzlCLE1BQU07UUFDUjtZQUNFLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBRSxtQkFBbUI7WUFDdkQsTUFBTTtLQUNUO0lBRUQsY0FBYztJQUNkLFFBQVEsVUFBVSxFQUFFO1FBQ2xCLEtBQUssS0FBSztZQUNSLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDMUIsTUFBTTtRQUNSLEtBQUssUUFBUTtZQUNYLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDN0IsTUFBTTtRQUNSLEtBQUssU0FBUztZQUNaLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDOUIsTUFBTTtRQUNSLEtBQUssT0FBTztZQUNWLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDNUIsTUFBTTtRQUNSO1lBQ0UsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFFLHNCQUFzQjtZQUN4RCxNQUFNO0tBQ1Q7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBTdHlsZVV0aWxzLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuY29uc3QgUk9XX0RFRkFVTFQgPSAnc3RyZXRjaCc7XG5jb25zdCBDT0xfREVGQVVMVCA9ICdzdHJldGNoJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgR3JpZEFsaWduU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZykge1xuICAgIHJldHVybiBidWlsZENzcyhpbnB1dCB8fCBST1dfREVGQVVMVCk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgR3JpZEFsaWduRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuXG4gIHByb3RlY3RlZCBESVJFQ1RJVkVfS0VZID0gJ2dyaWQtYWxpZ24nO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogR3JpZEFsaWduU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdHlsZUNhY2hlID0gYWxpZ25DYWNoZTtcbn1cblxuY29uc3QgYWxpZ25DYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcblxuY29uc3QgaW5wdXRzID0gW1xuICAnZ2RHcmlkQWxpZ24nLFxuICAnZ2RHcmlkQWxpZ24ueHMnLCAnZ2RHcmlkQWxpZ24uc20nLCAnZ2RHcmlkQWxpZ24ubWQnLCAnZ2RHcmlkQWxpZ24ubGcnLCAnZ2RHcmlkQWxpZ24ueGwnLFxuICAnZ2RHcmlkQWxpZ24ubHQtc20nLCAnZ2RHcmlkQWxpZ24ubHQtbWQnLCAnZ2RHcmlkQWxpZ24ubHQtbGcnLCAnZ2RHcmlkQWxpZ24ubHQteGwnLFxuICAnZ2RHcmlkQWxpZ24uZ3QteHMnLCAnZ2RHcmlkQWxpZ24uZ3Qtc20nLCAnZ2RHcmlkQWxpZ24uZ3QtbWQnLCAnZ2RHcmlkQWxpZ24uZ3QtbGcnXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2dkR3JpZEFsaWduXSxcbiAgW2dkR3JpZEFsaWduLnhzXSwgW2dkR3JpZEFsaWduLnNtXSwgW2dkR3JpZEFsaWduLm1kXSwgW2dkR3JpZEFsaWduLmxnXSxbZ2RHcmlkQWxpZ24ueGxdLFxuICBbZ2RHcmlkQWxpZ24ubHQtc21dLCBbZ2RHcmlkQWxpZ24ubHQtbWRdLCBbZ2RHcmlkQWxpZ24ubHQtbGddLCBbZ2RHcmlkQWxpZ24ubHQteGxdLFxuICBbZ2RHcmlkQWxpZ24uZ3QteHNdLCBbZ2RHcmlkQWxpZ24uZ3Qtc21dLCBbZ2RHcmlkQWxpZ24uZ3QtbWRdLCBbZ2RHcmlkQWxpZ24uZ3QtbGddXG5gO1xuXG4vKipcbiAqICdhbGlnbicgQ1NTIEdyaWQgc3R5bGluZyBkaXJlY3RpdmUgZm9yIGdyaWQgY2hpbGRyZW5cbiAqICBEZWZpbmVzIHBvc2l0aW9uaW5nIG9mIGNoaWxkIGVsZW1lbnRzIGFsb25nIHJvdyBhbmQgY29sdW1uIGF4aXMgaW4gYSBncmlkIGNvbnRhaW5lclxuICogIE9wdGlvbmFsIHZhbHVlczoge3Jvdy1heGlzfSB2YWx1ZXMgb3Ige3Jvdy1heGlzIGNvbHVtbi1heGlzfSB2YWx1ZSBwYWlyc1xuICpcbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI3Byb3AtanVzdGlmeS1zZWxmXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2Nzcy9jb21wbGV0ZS1ndWlkZS1ncmlkLyNwcm9wLWFsaWduLXNlbGZcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRBbGlnbkRpcmVjdGl2ZSBleHRlbmRzIEdyaWRBbGlnbkRpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3NzKGFsaWduOiBzdHJpbmcgPSAnJykge1xuICBjb25zdCBjc3M6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge30sIFtyb3dBeGlzLCBjb2x1bW5BeGlzXSA9IGFsaWduLnNwbGl0KCcgJyk7XG5cbiAgLy8gUm93IGF4aXNcbiAgc3dpdGNoIChyb3dBeGlzKSB7XG4gICAgY2FzZSAnZW5kJzpcbiAgICAgIGNzc1snanVzdGlmeS1zZWxmJ10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2p1c3RpZnktc2VsZiddID0gJ2NlbnRlcic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdHJldGNoJzpcbiAgICAgIGNzc1snanVzdGlmeS1zZWxmJ10gPSAnc3RyZXRjaCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdGFydCc6XG4gICAgICBjc3NbJ2p1c3RpZnktc2VsZiddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjc3NbJ2p1c3RpZnktc2VsZiddID0gUk9XX0RFRkFVTFQ7ICAvLyBkZWZhdWx0IHJvdyBheGlzXG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIENvbHVtbiBheGlzXG4gIHN3aXRjaCAoY29sdW1uQXhpcykge1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9ICdlbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gJ2NlbnRlcic7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdHJldGNoJzpcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gJ3N0cmV0Y2gnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY3NzWydhbGlnbi1zZWxmJ10gPSAnc3RhcnQnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gQ09MX0RFRkFVTFQ7ICAvLyBkZWZhdWx0IGNvbHVtbiBheGlzXG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBjc3M7XG59XG4iXX0=