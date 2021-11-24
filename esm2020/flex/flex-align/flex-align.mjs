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
export class FlexAlignStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        input = input || 'stretch';
        const styles = {};
        // Cross-axis
        switch (input) {
            case 'start':
                styles['align-self'] = 'flex-start';
                break;
            case 'end':
                styles['align-self'] = 'flex-end';
                break;
            default:
                styles['align-self'] = input;
                break;
        }
        return styles;
    }
}
FlexAlignStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
FlexAlignStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexAlignStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxFlexAlign', 'fxFlexAlign.xs', 'fxFlexAlign.sm', 'fxFlexAlign.md',
    'fxFlexAlign.lg', 'fxFlexAlign.xl', 'fxFlexAlign.lt-sm', 'fxFlexAlign.lt-md',
    'fxFlexAlign.lt-lg', 'fxFlexAlign.lt-xl', 'fxFlexAlign.gt-xs', 'fxFlexAlign.gt-sm',
    'fxFlexAlign.gt-md', 'fxFlexAlign.gt-lg'
];
const selector = `
  [fxFlexAlign], [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md],
  [fxFlexAlign.lg], [fxFlexAlign.xl], [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md],
  [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl], [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm],
  [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`;
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
export class FlexAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'flex-align';
        this.styleCache = flexAlignCache;
        this.init();
    }
}
FlexAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexAlignDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: FlexAlignStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
FlexAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: FlexAlignDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: FlexAlignStyleBuilder }, { type: i1.MediaMarshaller }]; } });
const flexAlignCache = new Map();
export class DefaultFlexAlignDirective extends FlexAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultFlexAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultFlexAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultFlexAlignDirective, selector: "\n  [fxFlexAlign], [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md],\n  [fxFlexAlign.lg], [fxFlexAlign.xl], [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md],\n  [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl], [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm],\n  [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]\n", inputs: { fxFlexAlign: "fxFlexAlign", "fxFlexAlign.xs": "fxFlexAlign.xs", "fxFlexAlign.sm": "fxFlexAlign.sm", "fxFlexAlign.md": "fxFlexAlign.md", "fxFlexAlign.lg": "fxFlexAlign.lg", "fxFlexAlign.xl": "fxFlexAlign.xl", "fxFlexAlign.lt-sm": "fxFlexAlign.lt-sm", "fxFlexAlign.lt-md": "fxFlexAlign.lt-md", "fxFlexAlign.lt-lg": "fxFlexAlign.lt-lg", "fxFlexAlign.lt-xl": "fxFlexAlign.lt-xl", "fxFlexAlign.gt-xs": "fxFlexAlign.gt-xs", "fxFlexAlign.gt-sm": "fxFlexAlign.gt-sm", "fxFlexAlign.gt-md": "fxFlexAlign.gt-md", "fxFlexAlign.gt-lg": "fxFlexAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1hbGlnbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZmxleC9mbGV4LWFsaWduL2ZsZXgtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUVMLGNBQWMsRUFDZCxZQUFZLEdBR2IsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBR25DLE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxZQUFZO0lBQ3JELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLEtBQUssR0FBRyxLQUFLLElBQUksU0FBUyxDQUFDO1FBQzNCLE1BQU0sTUFBTSxHQUFvQixFQUFFLENBQUM7UUFFbkMsYUFBYTtRQUNiLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxPQUFPO2dCQUNWLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxZQUFZLENBQUM7Z0JBQ3BDLE1BQU07WUFDUixLQUFLLEtBQUs7Z0JBQ1IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDbEMsTUFBTTtZQUNSO2dCQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQzdCLE1BQU07U0FDVDtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2tIQW5CVSxxQkFBcUI7c0hBQXJCLHFCQUFxQixjQURULE1BQU07MkZBQ2xCLHFCQUFxQjtrQkFEakMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBdUJoQyxNQUFNLE1BQU0sR0FBRztJQUNiLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7SUFDbkUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CO0lBQzVFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLG1CQUFtQjtJQUNsRixtQkFBbUIsRUFBRSxtQkFBbUI7Q0FDekMsQ0FBQztBQUNGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxjQUFjO0lBSXBELFlBQVksS0FBaUIsRUFDakIsVUFBc0IsRUFDdEIsWUFBbUMsRUFDbkMsT0FBd0I7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBTnhDLGtCQUFhLEdBQUcsWUFBWSxDQUFDO1FBVTdCLGVBQVUsR0FBRyxjQUFjLENBQUM7UUFIcEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7K0dBVlUsa0JBQWtCLHNFQU1ILHFCQUFxQjttR0FOcEMsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLFNBQVM7NEdBT2tCLHFCQUFxQjtBQVNqRCxNQUFNLGNBQWMsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUcvRCxNQUFNLE9BQU8seUJBQTBCLFNBQVEsa0JBQWtCO0lBRGpFOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O3NIQUZZLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBRHJDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEZsZXhBbGlnblN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGlucHV0OiBzdHJpbmcpIHtcbiAgICBpbnB1dCA9IGlucHV0IHx8ICdzdHJldGNoJztcbiAgICBjb25zdCBzdHlsZXM6IFN0eWxlRGVmaW5pdGlvbiA9IHt9O1xuXG4gICAgLy8gQ3Jvc3MtYXhpc1xuICAgIHN3aXRjaCAoaW5wdXQpIHtcbiAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgc3R5bGVzWydhbGlnbi1zZWxmJ10gPSAnZmxleC1zdGFydCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgc3R5bGVzWydhbGlnbi1zZWxmJ10gPSAnZmxleC1lbmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN0eWxlc1snYWxpZ24tc2VsZiddID0gaW5wdXQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cbn1cblxuY29uc3QgaW5wdXRzID0gW1xuICAnZnhGbGV4QWxpZ24nLCAnZnhGbGV4QWxpZ24ueHMnLCAnZnhGbGV4QWxpZ24uc20nLCAnZnhGbGV4QWxpZ24ubWQnLFxuICAnZnhGbGV4QWxpZ24ubGcnLCAnZnhGbGV4QWxpZ24ueGwnLCAnZnhGbGV4QWxpZ24ubHQtc20nLCAnZnhGbGV4QWxpZ24ubHQtbWQnLFxuICAnZnhGbGV4QWxpZ24ubHQtbGcnLCAnZnhGbGV4QWxpZ24ubHQteGwnLCAnZnhGbGV4QWxpZ24uZ3QteHMnLCAnZnhGbGV4QWxpZ24uZ3Qtc20nLFxuICAnZnhGbGV4QWxpZ24uZ3QtbWQnLCAnZnhGbGV4QWxpZ24uZ3QtbGcnXG5dO1xuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIFtmeEZsZXhBbGlnbl0sIFtmeEZsZXhBbGlnbi54c10sIFtmeEZsZXhBbGlnbi5zbV0sIFtmeEZsZXhBbGlnbi5tZF0sXG4gIFtmeEZsZXhBbGlnbi5sZ10sIFtmeEZsZXhBbGlnbi54bF0sIFtmeEZsZXhBbGlnbi5sdC1zbV0sIFtmeEZsZXhBbGlnbi5sdC1tZF0sXG4gIFtmeEZsZXhBbGlnbi5sdC1sZ10sIFtmeEZsZXhBbGlnbi5sdC14bF0sIFtmeEZsZXhBbGlnbi5ndC14c10sIFtmeEZsZXhBbGlnbi5ndC1zbV0sXG4gIFtmeEZsZXhBbGlnbi5ndC1tZF0sIFtmeEZsZXhBbGlnbi5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2ZsZXgtYWxpZ24nIGZsZXhib3ggc3R5bGluZyBkaXJlY3RpdmVcbiAqIEFsbG93cyBlbGVtZW50LXNwZWNpZmljIG92ZXJyaWRlcyBmb3IgY3Jvc3MtYXhpcyBhbGlnbm1lbnRzIGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9hL2FsaWduLXNlbGYvXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEZsZXhBbGlnbkRpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdmbGV4LWFsaWduJztcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBGbGV4QWxpZ25TdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsUmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlVXRpbHMsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2FjaGUgPSBmbGV4QWxpZ25DYWNoZTtcbn1cblxuY29uc3QgZmxleEFsaWduQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRGbGV4QWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBGbGV4QWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19