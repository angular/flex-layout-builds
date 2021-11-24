/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, Optional, Self, } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseDirective2 } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
import * as i2 from "@angular/common";
export class ClassDirective extends BaseDirective2 {
    constructor(elementRef, styler, marshal, iterableDiffers, keyValueDiffers, renderer2, ngClassInstance) {
        super(elementRef, null, styler, marshal);
        this.ngClassInstance = ngClassInstance;
        this.DIRECTIVE_KEY = 'ngClass';
        if (!this.ngClassInstance) {
            // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
            // the same host element; since the responsive variations may be defined...
            this.ngClassInstance = new NgClass(iterableDiffers, keyValueDiffers, elementRef, renderer2);
        }
        this.init();
        this.setValue('', '');
    }
    /**
     * Capture class assignments so we cache the default classes
     * which are merged with activated styles and used as fallbacks.
     */
    set klass(val) {
        this.ngClassInstance.klass = val;
        this.setValue(val, '');
    }
    updateWithValue(value) {
        this.ngClassInstance.ngClass = value;
        this.ngClassInstance.ngDoCheck();
    }
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     */
    ngDoCheck() {
        this.ngClassInstance.ngDoCheck();
    }
}
ClassDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ClassDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: i0.IterableDiffers }, { token: i0.KeyValueDiffers }, { token: i0.Renderer2 }, { token: i2.NgClass, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
ClassDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: ClassDirective, inputs: { klass: ["class", "klass"] }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ClassDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: i0.IterableDiffers }, { type: i0.KeyValueDiffers }, { type: i0.Renderer2 }, { type: i2.NgClass, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }]; }, propDecorators: { klass: [{
                type: Input,
                args: ['class']
            }] } });
const inputs = [
    'ngClass', 'ngClass.xs', 'ngClass.sm', 'ngClass.md', 'ngClass.lg', 'ngClass.xl',
    'ngClass.lt-sm', 'ngClass.lt-md', 'ngClass.lt-lg', 'ngClass.lt-xl',
    'ngClass.gt-xs', 'ngClass.gt-sm', 'ngClass.gt-md', 'ngClass.gt-lg'
];
const selector = `
  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
`;
/**
 * Directive to add responsive support for ngClass.
 * This maintains the core functionality of 'ngClass' and adds responsive API
 * Note: this class is a no-op when rendered on the server
 */
export class DefaultClassDirective extends ClassDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultClassDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultClassDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultClassDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultClassDirective, selector: "\n  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],\n  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],\n  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]\n", inputs: { ngClass: "ngClass", "ngClass.xs": "ngClass.xs", "ngClass.sm": "ngClass.sm", "ngClass.md": "ngClass.md", "ngClass.lg": "ngClass.lg", "ngClass.xl": "ngClass.xl", "ngClass.lt-sm": "ngClass.lt-sm", "ngClass.lt-md": "ngClass.lt-md", "ngClass.lt-lg": "ngClass.lt-lg", "ngClass.lt-xl": "ngClass.lt-xl", "ngClass.gt-xs": "ngClass.gt-xs", "ngClass.gt-sm": "ngClass.gt-sm", "ngClass.gt-md": "ngClass.gt-md", "ngClass.gt-lg": "ngClass.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultClassDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2V4dGVuZGVkL2NsYXNzL2NsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUdMLFFBQVEsRUFFUixJQUFJLEdBQ0wsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQThCLE1BQU0sMkJBQTJCLENBQUM7Ozs7QUFHdEYsTUFBTSxPQUFPLGNBQWUsU0FBUSxjQUFjO0lBY2hELFlBQVksVUFBc0IsRUFDdEIsTUFBa0IsRUFDbEIsT0FBd0IsRUFDeEIsZUFBZ0MsRUFDaEMsZUFBZ0MsRUFDaEMsU0FBb0IsRUFDbUIsZUFBd0I7UUFDekUsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRE8sb0JBQWUsR0FBZixlQUFlLENBQVM7UUFsQmpFLGtCQUFhLEdBQUcsU0FBUyxDQUFDO1FBb0JsQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6Qiw2RkFBNkY7WUFDN0YsMkVBQTJFO1lBQzNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDN0Y7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBekJEOzs7T0FHRztJQUNILElBQ0ksS0FBSyxDQUFDLEdBQVc7UUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFtQlMsZUFBZSxDQUFDLEtBQVU7UUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSxrQkFBa0I7SUFDbEIscUVBQXFFO0lBRXJFOztPQUVHO0lBQ0gsU0FBUztRQUNQLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7MkdBN0NVLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQUQxQixTQUFTOzswQkFxQkssUUFBUTs7MEJBQUksSUFBSTs0Q0FYekIsS0FBSztzQkFEUixLQUFLO3VCQUFDLE9BQU87O0FBd0NoQixNQUFNLE1BQU0sR0FBRztJQUNiLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWTtJQUMvRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlO0lBQ2xFLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGVBQWU7Q0FDbkUsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7O0NBSWhCLENBQUM7QUFFRjs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLHFCQUFzQixTQUFRLGNBQWM7SUFEekQ7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7a0hBRlkscUJBQXFCO3NHQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdDbGFzc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QmFzZURpcmVjdGl2ZTIsIFN0eWxlVXRpbHMsIE1lZGlhTWFyc2hhbGxlcn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIENsYXNzRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIgaW1wbGVtZW50cyBEb0NoZWNrIHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICduZ0NsYXNzJztcblxuICAvKipcbiAgICogQ2FwdHVyZSBjbGFzcyBhc3NpZ25tZW50cyBzbyB3ZSBjYWNoZSB0aGUgZGVmYXVsdCBjbGFzc2VzXG4gICAqIHdoaWNoIGFyZSBtZXJnZWQgd2l0aCBhY3RpdmF0ZWQgc3R5bGVzIGFuZCB1c2VkIGFzIGZhbGxiYWNrcy5cbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQga2xhc3ModmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLm5nQ2xhc3NJbnN0YW5jZS5rbGFzcyA9IHZhbDtcbiAgICB0aGlzLnNldFZhbHVlKHZhbCwgJycpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgICAgICAgICAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIsXG4gICAgICAgICAgICAgIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgICAgICAgICAgICBrZXlWYWx1ZURpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICAgICAgICAgICAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgcHJvdGVjdGVkIHJlYWRvbmx5IG5nQ2xhc3NJbnN0YW5jZTogTmdDbGFzcykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG51bGwhLCBzdHlsZXIsIG1hcnNoYWwpO1xuICAgIGlmICghdGhpcy5uZ0NsYXNzSW5zdGFuY2UpIHtcbiAgICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBOZ0NsYXNzIERpcmVjdGl2ZSBpbnN0YW5jZSBvbmx5IGlmIGBuZ0NsYXNzPVwiXCJgIGhhcyBOT1QgYmVlbiBkZWZpbmVkIG9uXG4gICAgICAvLyB0aGUgc2FtZSBob3N0IGVsZW1lbnQ7IHNpbmNlIHRoZSByZXNwb25zaXZlIHZhcmlhdGlvbnMgbWF5IGJlIGRlZmluZWQuLi5cbiAgICAgIHRoaXMubmdDbGFzc0luc3RhbmNlID0gbmV3IE5nQ2xhc3MoaXRlcmFibGVEaWZmZXJzLCBrZXlWYWx1ZURpZmZlcnMsIGVsZW1lbnRSZWYsIHJlbmRlcmVyMik7XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuc2V0VmFsdWUoJycsICcnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMubmdDbGFzc0luc3RhbmNlLm5nQ2xhc3MgPSB2YWx1ZTtcbiAgICB0aGlzLm5nQ2xhc3NJbnN0YW5jZS5uZ0RvQ2hlY2soKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBMaWZlY3ljbGUgSG9va3NcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIEZvciBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5vblB1c2ggYW5kIG5nT25DaGFuZ2VzKCkgdXBkYXRlc1xuICAgKi9cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMubmdDbGFzc0luc3RhbmNlLm5nRG9DaGVjaygpO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ25nQ2xhc3MnLCAnbmdDbGFzcy54cycsICduZ0NsYXNzLnNtJywgJ25nQ2xhc3MubWQnLCAnbmdDbGFzcy5sZycsICduZ0NsYXNzLnhsJyxcbiAgJ25nQ2xhc3MubHQtc20nLCAnbmdDbGFzcy5sdC1tZCcsICduZ0NsYXNzLmx0LWxnJywgJ25nQ2xhc3MubHQteGwnLFxuICAnbmdDbGFzcy5ndC14cycsICduZ0NsYXNzLmd0LXNtJywgJ25nQ2xhc3MuZ3QtbWQnLCAnbmdDbGFzcy5ndC1sZydcbl07XG5cbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbbmdDbGFzc10sIFtuZ0NsYXNzLnhzXSwgW25nQ2xhc3Muc21dLCBbbmdDbGFzcy5tZF0sIFtuZ0NsYXNzLmxnXSwgW25nQ2xhc3MueGxdLFxuICBbbmdDbGFzcy5sdC1zbV0sIFtuZ0NsYXNzLmx0LW1kXSwgW25nQ2xhc3MubHQtbGddLCBbbmdDbGFzcy5sdC14bF0sXG4gIFtuZ0NsYXNzLmd0LXhzXSwgW25nQ2xhc3MuZ3Qtc21dLCBbbmdDbGFzcy5ndC1tZF0sIFtuZ0NsYXNzLmd0LWxnXVxuYDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdG8gYWRkIHJlc3BvbnNpdmUgc3VwcG9ydCBmb3IgbmdDbGFzcy5cbiAqIFRoaXMgbWFpbnRhaW5zIHRoZSBjb3JlIGZ1bmN0aW9uYWxpdHkgb2YgJ25nQ2xhc3MnIGFuZCBhZGRzIHJlc3BvbnNpdmUgQVBJXG4gKiBOb3RlOiB0aGlzIGNsYXNzIGlzIGEgbm8tb3Agd2hlbiByZW5kZXJlZCBvbiB0aGUgc2VydmVyXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRDbGFzc0RpcmVjdGl2ZSBleHRlbmRzIENsYXNzRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cbiJdfQ==