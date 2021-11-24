/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { buildLayoutCSS } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "../style-builder/style-builder";
import * as i2 from "../style-utils/style-utils";
import * as i3 from "../media-marshaller/media-marshaller";
export class BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        this.elementRef = elementRef;
        this.styleBuilder = styleBuilder;
        this.styler = styler;
        this.marshal = marshal;
        this.DIRECTIVE_KEY = '';
        this.inputs = [];
        /** The most recently used styles for the builder */
        this.mru = {};
        this.destroySubject = new Subject();
        /** Cache map for style computation */
        this.styleCache = new Map();
    }
    /** Access to host element's parent DOM node */
    get parentElement() {
        return this.elementRef.nativeElement.parentElement;
    }
    /** Access to the HTMLElement for the directive */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /** Access to the activated value for the directive */
    get activatedValue() {
        return this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY);
    }
    set activatedValue(value) {
        this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, value, this.marshal.activatedAlias);
    }
    /** For @Input changes */
    ngOnChanges(changes) {
        Object.keys(changes).forEach(key => {
            if (this.inputs.indexOf(key) !== -1) {
                const bp = key.split('.').slice(1).join('.');
                const val = changes[key].currentValue;
                this.setValue(val, bp);
            }
        });
    }
    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
        this.marshal.releaseElement(this.nativeElement);
    }
    /** Register with central marshaller service */
    init(extraTriggers = []) {
        this.marshal.init(this.elementRef.nativeElement, this.DIRECTIVE_KEY, this.updateWithValue.bind(this), this.clearStyles.bind(this), extraTriggers);
    }
    /** Add styles to the element using predefined style builder */
    addStyles(input, parent) {
        const builder = this.styleBuilder;
        const useCache = builder.shouldCache;
        let genStyles = this.styleCache.get(input);
        if (!genStyles || !useCache) {
            genStyles = builder.buildStyles(input, parent);
            if (useCache) {
                this.styleCache.set(input, genStyles);
            }
        }
        this.mru = { ...genStyles };
        this.applyStyleToElement(genStyles);
        builder.sideEffect(input, genStyles, parent);
    }
    /** Remove generated styles from an element using predefined style builder */
    clearStyles() {
        Object.keys(this.mru).forEach(k => {
            this.mru[k] = '';
        });
        this.applyStyleToElement(this.mru);
        this.mru = {};
    }
    /** Force trigger style updates on DOM element */
    triggerUpdate() {
        this.marshal.triggerUpdate(this.nativeElement, this.DIRECTIVE_KEY);
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction).
     *
     * Check inline style first then check computed (stylesheet) style.
     * And optionally add the flow value to element's inline style.
     */
    getFlexFlowDirection(target, addIfMissing = false) {
        if (target) {
            const [value, hasInlineValue] = this.styler.getFlowDirection(target);
            if (!hasInlineValue && addIfMissing) {
                const style = buildLayoutCSS(value);
                const elements = [target];
                this.styler.applyStyleToElements(style, elements);
            }
            return value.trim();
        }
        return 'row';
    }
    hasWrap(target) {
        return this.styler.hasWrap(target);
    }
    /** Applies styles given via string pair or object map to the directive element */
    applyStyleToElement(style, value, element = this.nativeElement) {
        this.styler.applyStyleToElement(element, style, value);
    }
    setValue(val, bp) {
        this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, val, bp);
    }
    updateWithValue(input) {
        if (this.currentValue !== input) {
            this.addStyles(input);
            this.currentValue = input;
        }
    }
}
BaseDirective2.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: BaseDirective2, deps: [{ token: i0.ElementRef }, { token: i1.StyleBuilder }, { token: i2.StyleUtils }, { token: i3.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
BaseDirective2.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: BaseDirective2, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: BaseDirective2, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleBuilder }, { type: i2.StyleUtils }, { type: i3.MediaMarshaller }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvYmFzZS9iYXNlMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsU0FBUyxFQUFrRCxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBS3pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7Ozs7QUFHbkUsTUFBTSxPQUFnQixjQUFjO0lBK0JsQyxZQUFnQyxVQUFzQixFQUN0QixZQUEwQixFQUMxQixNQUFrQixFQUNsQixPQUF3QjtRQUh4QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVk7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFoQzlDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLFdBQU0sR0FBYSxFQUFFLENBQUM7UUFDaEMsb0RBQW9EO1FBQzFDLFFBQUcsR0FBb0IsRUFBRSxDQUFDO1FBQzFCLG1CQUFjLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFzQnhELHNDQUFzQztRQUM1QixlQUFVLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7SUFNL0QsQ0FBQztJQTFCRCwrQ0FBK0M7SUFDL0MsSUFBYyxhQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3JELENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsSUFBYyxhQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFB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Q3JDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVTLGVBQWUsQ0FBQyxLQUFhO1FBQ3JDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxLQUFLLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUMzQjtJQUNILENBQUM7OzJHQTVJbUIsY0FBYzsrRkFBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRG5DLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1N0eWxlRGVmaW5pdGlvbiwgU3R5bGVVdGlsc30gZnJvbSAnLi4vc3R5bGUtdXRpbHMvc3R5bGUtdXRpbHMnO1xuaW1wb3J0IHtTdHlsZUJ1aWxkZXJ9IGZyb20gJy4uL3N0eWxlLWJ1aWxkZXIvc3R5bGUtYnVpbGRlcic7XG5pbXBvcnQge01lZGlhTWFyc2hhbGxlcn0gZnJvbSAnLi4vbWVkaWEtbWFyc2hhbGxlci9tZWRpYS1tYXJzaGFsbGVyJztcbmltcG9ydCB7YnVpbGRMYXlvdXRDU1N9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZURpcmVjdGl2ZTIgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnJztcbiAgcHJvdGVjdGVkIGlucHV0czogc3RyaW5nW10gPSBbXTtcbiAgLyoqIFRoZSBtb3N0IHJlY2VudGx5IHVzZWQgc3R5bGVzIGZvciB0aGUgYnVpbGRlciAqL1xuICBwcm90ZWN0ZWQgbXJ1OiBTdHlsZURlZmluaXRpb24gPSB7fTtcbiAgcHJvdGVjdGVkIGRlc3Ryb3lTdWJqZWN0OiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJvdGVjdGVkIGN1cnJlbnRWYWx1ZTogYW55O1xuXG4gIC8qKiBBY2Nlc3MgdG8gaG9zdCBlbGVtZW50J3MgcGFyZW50IERPTSBub2RlICovXG4gIHByb3RlY3RlZCBnZXQgcGFyZW50RWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB9XG5cbiAgLyoqIEFjY2VzcyB0byB0aGUgSFRNTEVsZW1lbnQgZm9yIHRoZSBkaXJlY3RpdmUgKi9cbiAgcHJvdGVjdGVkIGdldCBuYXRpdmVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogQWNjZXNzIHRvIHRoZSBhY3RpdmF0ZWQgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUgKi9cbiAgZ2V0IGFjdGl2YXRlZFZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubWFyc2hhbC5nZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuRElSRUNUSVZFX0tFWSk7XG4gIH1cbiAgc2V0IGFjdGl2YXRlZFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1hcnNoYWwuc2V0VmFsdWUodGhpcy5uYXRpdmVFbGVtZW50LCB0aGlzLkRJUkVDVElWRV9LRVksIHZhbHVlLFxuICAgICAgdGhpcy5tYXJzaGFsLmFjdGl2YXRlZEFsaWFzKTtcbiAgfVxuXG4gIC8qKiBDYWNoZSBtYXAgZm9yIHN0eWxlIGNvbXB1dGF0aW9uICovXG4gIHByb3RlY3RlZCBzdHlsZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RlY3RlZCBzdHlsZUJ1aWxkZXI6IFN0eWxlQnVpbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RlY3RlZCBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyKSB7XG4gIH1cblxuICAvKiogRm9yIEBJbnB1dCBjaGFuZ2VzICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAodGhpcy5pbnB1dHMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICBjb25zdCBicCA9IGtleS5zcGxpdCgnLicpLnNsaWNlKDEpLmpvaW4oJy4nKTtcbiAgICAgICAgY29uc3QgdmFsID0gY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWwsIGJwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveVN1YmplY3QubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveVN1YmplY3QuY29tcGxldGUoKTtcbiAgICB0aGlzLm1hcnNoYWwucmVsZWFzZUVsZW1lbnQodGhpcy5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBSZWdpc3RlciB3aXRoIGNlbnRyYWwgbWFyc2hhbGxlciBzZXJ2aWNlICovXG4gIHByb3RlY3RlZCBpbml0KGV4dHJhVHJpZ2dlcnM6IE9ic2VydmFibGU8YW55PltdID0gW10pOiB2b2lkIHtcbiAgICB0aGlzLm1hcnNoYWwuaW5pdChcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5ESVJFQ1RJVkVfS0VZLFxuICAgICAgdGhpcy51cGRhdGVXaXRoVmFsdWUuYmluZCh0aGlzKSxcbiAgICAgIHRoaXMuY2xlYXJTdHlsZXMuYmluZCh0aGlzKSxcbiAgICAgIGV4dHJhVHJpZ2dlcnNcbiAgICApO1xuICB9XG5cbiAgLyoqIEFkZCBzdHlsZXMgdG8gdGhlIGVsZW1lbnQgdXNpbmcgcHJlZGVmaW5lZCBzdHlsZSBidWlsZGVyICovXG4gIHByb3RlY3RlZCBhZGRTdHlsZXMoaW5wdXQ6IHN0cmluZywgcGFyZW50PzogT2JqZWN0KSB7XG4gICAgY29uc3QgYnVpbGRlciA9IHRoaXMuc3R5bGVCdWlsZGVyO1xuICAgIGNvbnN0IHVzZUNhY2hlID0gYnVpbGRlci5zaG91bGRDYWNoZTtcblxuICAgIGxldCBnZW5TdHlsZXM6IFN0eWxlRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCA9IHRoaXMuc3R5bGVDYWNoZS5nZXQoaW5wdXQpO1xuXG4gICAgaWYgKCFnZW5TdHlsZXMgfHwgIXVzZUNhY2hlKSB7XG4gICAgICBnZW5TdHlsZXMgPSBidWlsZGVyLmJ1aWxkU3R5bGVzKGlucHV0LCBwYXJlbnQpO1xuICAgICAgaWYgKHVzZUNhY2hlKSB7XG4gICAgICAgIHRoaXMuc3R5bGVDYWNoZS5zZXQoaW5wdXQsIGdlblN0eWxlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tcnUgPSB7Li4uZ2VuU3R5bGVzfTtcbiAgICB0aGlzLmFwcGx5U3R5bGVUb0VsZW1lbnQoZ2VuU3R5bGVzKTtcbiAgICBidWlsZGVyLnNpZGVFZmZlY3QoaW5wdXQsIGdlblN0eWxlcywgcGFyZW50KTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZ2VuZXJhdGVkIHN0eWxlcyBmcm9tIGFuIGVsZW1lbnQgdXNpbmcgcHJlZGVmaW5lZCBzdHlsZSBidWlsZGVyICovXG4gIHByb3RlY3RlZCBjbGVhclN0eWxlcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLm1ydSkuZm9yRWFjaChrID0+IHtcbiAgICAgIHRoaXMubXJ1W2tdID0gJyc7XG4gICAgfSk7XG4gICAgdGhpcy5hcHBseVN0eWxlVG9FbGVtZW50KHRoaXMubXJ1KTtcbiAgICB0aGlzLm1ydSA9IHt9O1xuICB9XG5cbiAgLyoqIEZvcmNlIHRyaWdnZXIgc3R5bGUgdXBkYXRlcyBvbiBET00gZWxlbWVudCAqL1xuICBwcm90ZWN0ZWQgdHJpZ2dlclVwZGF0ZSgpIHtcbiAgICB0aGlzLm1hcnNoYWwudHJpZ2dlclVwZGF0ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuRElSRUNUSVZFX0tFWSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBET00gZWxlbWVudCdzIEZsZXhib3ggZmxvdyAoZmxleC1kaXJlY3Rpb24pLlxuICAgKlxuICAgKiBDaGVjayBpbmxpbmUgc3R5bGUgZmlyc3QgdGhlbiBjaGVjayBjb21wdXRlZCAoc3R5bGVzaGVldCkgc3R5bGUuXG4gICAqIEFuZCBvcHRpb25hbGx5IGFkZCB0aGUgZmxvdyB2YWx1ZSB0byBlbGVtZW50J3MgaW5saW5lIHN0eWxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIGdldEZsZXhGbG93RGlyZWN0aW9uKHRhcmdldDogSFRNTEVsZW1lbnQsIGFkZElmTWlzc2luZyA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBjb25zdCBbdmFsdWUsIGhhc0lubGluZVZhbHVlXSA9IHRoaXMuc3R5bGVyLmdldEZsb3dEaXJlY3Rpb24odGFyZ2V0KTtcblxuICAgICAgaWYgKCFoYXNJbmxpbmVWYWx1ZSAmJiBhZGRJZk1pc3NpbmcpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBidWlsZExheW91dENTUyh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gW3RhcmdldF07XG4gICAgICAgIHRoaXMuc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnRzKHN0eWxlLCBlbGVtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZS50cmltKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICdyb3cnO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhc1dyYXAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0eWxlci5oYXNXcmFwKHRhcmdldCk7XG4gIH1cblxuICAvKiogQXBwbGllcyBzdHlsZXMgZ2l2ZW4gdmlhIHN0cmluZyBwYWlyIG9yIG9iamVjdCBtYXAgdG8gdGhlIGRpcmVjdGl2ZSBlbGVtZW50ICovXG4gIHByb3RlY3RlZCBhcHBseVN0eWxlVG9FbGVtZW50KHN0eWxlOiBTdHlsZURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPzogc3RyaW5nIHwgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMubmF0aXZlRWxlbWVudCkge1xuICAgIHRoaXMuc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnQoZWxlbWVudCwgc3R5bGUsIHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRWYWx1ZSh2YWw6IGFueSwgYnA6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubWFyc2hhbC5zZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuRElSRUNUSVZFX0tFWSwgdmFsLCBicCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKGlucHV0OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgIT09IGlucHV0KSB7XG4gICAgICB0aGlzLmFkZFN0eWxlcyhpbnB1dCk7XG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IGlucHV0O1xuICAgIH1cbiAgfVxufVxuIl19