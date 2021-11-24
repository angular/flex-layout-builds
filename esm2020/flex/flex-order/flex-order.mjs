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
export class FlexOrderStyleBuilder extends StyleBuilder {
    buildStyles(value) {
        return { order: (value && parseInt(value, 10)) || '' };
    }
}
FlexOrderStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOrderStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
FlexOrderStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOrderStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOrderStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxFlexOrder', 'fxFlexOrder.xs', 'fxFlexOrder.sm', 'fxFlexOrder.md',
    'fxFlexOrder.lg', 'fxFlexOrder.xl', 'fxFlexOrder.lt-sm', 'fxFlexOrder.lt-md',
    'fxFlexOrder.lt-lg', 'fxFlexOrder.lt-xl', 'fxFlexOrder.gt-xs', 'fxFlexOrder.gt-sm',
    'fxFlexOrder.gt-md', 'fxFlexOrder.gt-lg'
];
const selector = `
  [fxFlexOrder], [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md],
  [fxFlexOrder.lg], [fxFlexOrder.xl], [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md],
  [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl], [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm],
  [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
`;
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
export class FlexOrderDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'flex-order';
        this.styleCache = flexOrderCache;
        this.init();
    }
}
FlexOrderDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOrderDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: FlexOrderStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
FlexOrderDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: FlexOrderDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOrderDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: FlexOrderStyleBuilder }, { type: i1.MediaMarshaller }]; } });
const flexOrderCache = new Map();
export class DefaultFlexOrderDirective extends FlexOrderDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultFlexOrderDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOrderDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultFlexOrderDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultFlexOrderDirective, selector: "\n  [fxFlexOrder], [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md],\n  [fxFlexOrder.lg], [fxFlexOrder.xl], [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md],\n  [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl], [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm],\n  [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]\n", inputs: { fxFlexOrder: "fxFlexOrder", "fxFlexOrder.xs": "fxFlexOrder.xs", "fxFlexOrder.sm": "fxFlexOrder.sm", "fxFlexOrder.md": "fxFlexOrder.md", "fxFlexOrder.lg": "fxFlexOrder.lg", "fxFlexOrder.xl": "fxFlexOrder.xl", "fxFlexOrder.lt-sm": "fxFlexOrder.lt-sm", "fxFlexOrder.lt-md": "fxFlexOrder.lt-md", "fxFlexOrder.lt-lg": "fxFlexOrder.lt-lg", "fxFlexOrder.lt-xl": "fxFlexOrder.lt-xl", "fxFlexOrder.gt-xs": "fxFlexOrder.gt-xs", "fxFlexOrder.gt-sm": "fxFlexOrder.gt-sm", "fxFlexOrder.gt-md": "fxFlexOrder.gt-md", "fxFlexOrder.gt-lg": "fxFlexOrder.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOrderDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1vcmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZmxleC9mbGV4LW9yZGVyL2ZsZXgtb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFDTCxjQUFjLEVBQ2QsWUFBWSxHQUliLE1BQU0sMkJBQTJCLENBQUM7OztBQUduQyxNQUFNLE9BQU8scUJBQXNCLFNBQVEsWUFBWTtJQUNyRCxXQUFXLENBQUMsS0FBYTtRQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUMsQ0FBQztJQUN2RCxDQUFDOztrSEFIVSxxQkFBcUI7c0hBQXJCLHFCQUFxQixjQURULE1BQU07MkZBQ2xCLHFCQUFxQjtrQkFEakMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7O0FBT2hDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQjtJQUNuRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUI7SUFDNUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CO0lBQ2xGLG1CQUFtQixFQUFFLG1CQUFtQjtDQUN6QyxDQUFDO0FBQ0YsTUFBTSxRQUFRLEdBQUc7Ozs7O0NBS2hCLENBQUM7QUFFRjs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFJcEQsWUFBWSxLQUFpQixFQUNqQixVQUFzQixFQUN0QixZQUFtQyxFQUNuQyxPQUF3QjtRQUNsQyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFOeEMsa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFVN0IsZUFBVSxHQUFHLGNBQWMsQ0FBQztRQUhwQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDOzsrR0FWVSxrQkFBa0Isc0VBTUgscUJBQXFCO21HQU5wQyxrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsU0FBUzs0R0FPa0IscUJBQXFCO0FBU2pELE1BQU0sY0FBYyxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRy9ELE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxrQkFBa0I7SUFEakU7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7c0hBRlkseUJBQXlCOzBHQUF6Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFEckMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBTdHlsZVV0aWxzLFxuICBNZWRpYU1hcnNoYWxsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGbGV4T3JkZXJTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtvcmRlcjogKHZhbHVlICYmIHBhcnNlSW50KHZhbHVlLCAxMCkpIHx8ICcnfTtcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeEZsZXhPcmRlcicsICdmeEZsZXhPcmRlci54cycsICdmeEZsZXhPcmRlci5zbScsICdmeEZsZXhPcmRlci5tZCcsXG4gICdmeEZsZXhPcmRlci5sZycsICdmeEZsZXhPcmRlci54bCcsICdmeEZsZXhPcmRlci5sdC1zbScsICdmeEZsZXhPcmRlci5sdC1tZCcsXG4gICdmeEZsZXhPcmRlci5sdC1sZycsICdmeEZsZXhPcmRlci5sdC14bCcsICdmeEZsZXhPcmRlci5ndC14cycsICdmeEZsZXhPcmRlci5ndC1zbScsXG4gICdmeEZsZXhPcmRlci5ndC1tZCcsICdmeEZsZXhPcmRlci5ndC1sZydcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4RmxleE9yZGVyXSwgW2Z4RmxleE9yZGVyLnhzXSwgW2Z4RmxleE9yZGVyLnNtXSwgW2Z4RmxleE9yZGVyLm1kXSxcbiAgW2Z4RmxleE9yZGVyLmxnXSwgW2Z4RmxleE9yZGVyLnhsXSwgW2Z4RmxleE9yZGVyLmx0LXNtXSwgW2Z4RmxleE9yZGVyLmx0LW1kXSxcbiAgW2Z4RmxleE9yZGVyLmx0LWxnXSwgW2Z4RmxleE9yZGVyLmx0LXhsXSwgW2Z4RmxleE9yZGVyLmd0LXhzXSwgW2Z4RmxleE9yZGVyLmd0LXNtXSxcbiAgW2Z4RmxleE9yZGVyLmd0LW1kXSwgW2Z4RmxleE9yZGVyLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnZmxleC1vcmRlcicgZmxleGJveCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgcG9zaXRpb25hbCBvcmRlcmluZyBvZiB0aGUgZWxlbWVudCBpbiBhIHNvcnRlZCBsYXlvdXQgY29udGFpbmVyXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL28vb3JkZXIvXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEZsZXhPcmRlckRpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdmbGV4LW9yZGVyJztcblxuICBjb25zdHJ1Y3RvcihlbFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBGbGV4T3JkZXJTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsUmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlVXRpbHMsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2FjaGUgPSBmbGV4T3JkZXJDYWNoZTtcbn1cblxuY29uc3QgZmxleE9yZGVyQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRGbGV4T3JkZXJEaXJlY3RpdmUgZXh0ZW5kcyBGbGV4T3JkZXJEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19