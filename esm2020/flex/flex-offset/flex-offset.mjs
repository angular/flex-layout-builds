/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { takeUntil } from 'rxjs/operators';
import { isFlowHorizontal } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/flex-layout/core";
export class FlexOffsetStyleBuilder extends StyleBuilder {
    buildStyles(offset, parent) {
        if (offset === '') {
            offset = '0';
        }
        const isPercent = String(offset).indexOf('%') > -1;
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = offset + '%';
        }
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        const styles = isFlowHorizontal(parent.layout) ?
            { [horizontalLayoutKey]: `${offset}` } : { 'margin-top': `${offset}` };
        return styles;
    }
}
FlexOffsetStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
FlexOffsetStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxFlexOffset', 'fxFlexOffset.xs', 'fxFlexOffset.sm', 'fxFlexOffset.md',
    'fxFlexOffset.lg', 'fxFlexOffset.xl', 'fxFlexOffset.lt-sm', 'fxFlexOffset.lt-md',
    'fxFlexOffset.lt-lg', 'fxFlexOffset.lt-xl', 'fxFlexOffset.gt-xs', 'fxFlexOffset.gt-sm',
    'fxFlexOffset.gt-md', 'fxFlexOffset.gt-lg'
];
const selector = `
  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],
  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],
  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],
  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`;
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export class FlexOffsetDirective extends BaseDirective2 {
    constructor(elRef, directionality, styleBuilder, marshal, styler) {
        super(elRef, styleBuilder, styler, marshal);
        this.directionality = directionality;
        this.DIRECTIVE_KEY = 'flex-offset';
        this.init([this.directionality.change]);
        // Parent DOM `layout-gap` with affect the nested child with `flex-offset`
        if (this.parentElement) {
            this.marshal
                .trackValue(this.parentElement, 'layout-gap')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     */
    updateWithValue(value = '') {
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const layout = this.getFlexFlowDirection(this.parentElement, true);
        const isRtl = this.directionality.value === 'rtl';
        if (layout === 'row' && isRtl) {
            this.styleCache = flexOffsetCacheRowRtl;
        }
        else if (layout === 'row' && !isRtl) {
            this.styleCache = flexOffsetCacheRowLtr;
        }
        else if (layout === 'column' && isRtl) {
            this.styleCache = flexOffsetCacheColumnRtl;
        }
        else if (layout === 'column' && !isRtl) {
            this.styleCache = flexOffsetCacheColumnLtr;
        }
        this.addStyles(value + '', { layout, isRtl });
    }
}
FlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetDirective, deps: [{ token: i0.ElementRef }, { token: i1.Directionality }, { token: FlexOffsetStyleBuilder }, { token: i2.MediaMarshaller }, { token: i2.StyleUtils }], target: i0.ɵɵFactoryTarget.Directive });
FlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: FlexOffsetDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexOffsetDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality }, { type: FlexOffsetStyleBuilder }, { type: i2.MediaMarshaller }, { type: i2.StyleUtils }]; } });
export class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultFlexOffsetDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOffsetDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultFlexOffsetDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultFlexOffsetDirective, selector: "\n  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],\n  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],\n  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],\n  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n", inputs: { fxFlexOffset: "fxFlexOffset", "fxFlexOffset.xs": "fxFlexOffset.xs", "fxFlexOffset.sm": "fxFlexOffset.sm", "fxFlexOffset.md": "fxFlexOffset.md", "fxFlexOffset.lg": "fxFlexOffset.lg", "fxFlexOffset.xl": "fxFlexOffset.xl", "fxFlexOffset.lt-sm": "fxFlexOffset.lt-sm", "fxFlexOffset.lt-md": "fxFlexOffset.lt-md", "fxFlexOffset.lt-lg": "fxFlexOffset.lt-lg", "fxFlexOffset.lt-xl": "fxFlexOffset.lt-xl", "fxFlexOffset.gt-xs": "fxFlexOffset.gt-xs", "fxFlexOffset.gt-sm": "fxFlexOffset.gt-sm", "fxFlexOffset.gt-md": "fxFlexOffset.gt-md", "fxFlexOffset.gt-lg": "fxFlexOffset.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultFlexOffsetDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const flexOffsetCacheRowRtl = new Map();
const flexOffsetCacheColumnRtl = new Map();
const flexOffsetCacheRowLtr = new Map();
const flexOffsetCacheColumnLtr = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1vZmZzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2ZsZXgvZmxleC1vZmZzZXQvZmxleC1vZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBeUIsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTNFLE9BQU8sRUFFTCxjQUFjLEVBQ2QsWUFBWSxHQUdiLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7O0FBUXJFLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxZQUFZO0lBQ3RELFdBQVcsQ0FBQyxNQUFjLEVBQUUsTUFBd0I7UUFDbEQsSUFBSSxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUM7U0FDZDtRQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7U0FDdkI7UUFDRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQzFFLE1BQU0sTUFBTSxHQUFvQixnQkFB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QjtBQXlDbEQsTUFBTSxPQUFPLDBCQUEyQixTQUFRLG1CQUFtQjtJQURuRTs7UUFFWSxXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQzNCOzt1SEFGWSwwQkFBMEI7MkdBQTFCLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQUR0QyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQzs7QUFLN0IsTUFBTSxxQkFBcUIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0RSxNQUFNLHdCQUF3QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3pFLE1BQU0scUJBQXFCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDdEUsTUFBTSx3QkFBd0IsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge2lzRmxvd0hvcml6b250YWx9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBGbGV4T2Zmc2V0UGFyZW50IHtcbiAgbGF5b3V0OiBzdHJpbmc7XG4gIGlzUnRsOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGbGV4T2Zmc2V0U3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMob2Zmc2V0OiBzdHJpbmcsIHBhcmVudDogRmxleE9mZnNldFBhcmVudCkge1xuICAgIGlmIChvZmZzZXQgPT09ICcnKSB7XG4gICAgICBvZmZzZXQgPSAnMCc7XG4gICAgfVxuICAgIGNvbnN0IGlzUGVyY2VudCA9IFN0cmluZyhvZmZzZXQpLmluZGV4T2YoJyUnKSA+IC0xO1xuICAgIGNvbnN0IGlzUHggPSBTdHJpbmcob2Zmc2V0KS5pbmRleE9mKCdweCcpID4gLTE7XG4gICAgaWYgKCFpc1B4ICYmICFpc1BlcmNlbnQgJiYgIWlzTmFOKCtvZmZzZXQpKSB7XG4gICAgICBvZmZzZXQgPSBvZmZzZXQgKyAnJSc7XG4gICAgfVxuICAgIGNvbnN0IGhvcml6b250YWxMYXlvdXRLZXkgPSBwYXJlbnQuaXNSdGwgPyAnbWFyZ2luLXJpZ2h0JyA6ICdtYXJnaW4tbGVmdCc7XG4gICAgY29uc3Qgc3R5bGVzOiBTdHlsZURlZmluaXRpb24gPSBpc0Zsb3dIb3Jpem9udGFsKHBhcmVudC5sYXlvdXQpID9cbiAgICAgIHtbaG9yaXpvbnRhbExheW91dEtleV06IGAke29mZnNldH1gfSA6IHsnbWFyZ2luLXRvcCc6IGAke29mZnNldH1gfTtcblxuICAgIHJldHVybiBzdHlsZXM7XG4gIH1cbn1cblxuY29uc3QgaW5wdXRzID0gW1xuICAnZnhGbGV4T2Zmc2V0JywgJ2Z4RmxleE9mZnNldC54cycsICdmeEZsZXhPZmZzZXQuc20nLCAnZnhGbGV4T2Zmc2V0Lm1kJyxcbiAgJ2Z4RmxleE9mZnNldC5sZycsICdmeEZsZXhPZmZzZXQueGwnLCAnZnhGbGV4T2Zmc2V0Lmx0LXNtJywgJ2Z4RmxleE9mZnNldC5sdC1tZCcsXG4gICdmeEZsZXhPZmZzZXQubHQtbGcnLCAnZnhGbGV4T2Zmc2V0Lmx0LXhsJywgJ2Z4RmxleE9mZnNldC5ndC14cycsICdmeEZsZXhPZmZzZXQuZ3Qtc20nLFxuICAnZnhGbGV4T2Zmc2V0Lmd0LW1kJywgJ2Z4RmxleE9mZnNldC5ndC1sZydcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4RmxleE9mZnNldF0sIFtmeEZsZXhPZmZzZXQueHNdLCBbZnhGbGV4T2Zmc2V0LnNtXSwgW2Z4RmxleE9mZnNldC5tZF0sXG4gIFtmeEZsZXhPZmZzZXQubGddLCBbZnhGbGV4T2Zmc2V0LnhsXSwgW2Z4RmxleE9mZnNldC5sdC1zbV0sIFtmeEZsZXhPZmZzZXQubHQtbWRdLFxuICBbZnhGbGV4T2Zmc2V0Lmx0LWxnXSwgW2Z4RmxleE9mZnNldC5sdC14bF0sIFtmeEZsZXhPZmZzZXQuZ3QteHNdLCBbZnhGbGV4T2Zmc2V0Lmd0LXNtXSxcbiAgW2Z4RmxleE9mZnNldC5ndC1tZF0sIFtmeEZsZXhPZmZzZXQuZ3QtbGddXG5gO1xuXG4vKipcbiAqICdmbGV4LW9mZnNldCcgZmxleGJveCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgJ21hcmdpbi1sZWZ0JyBvZiB0aGUgZWxlbWVudCBpbiBhIGxheW91dCBjb250YWluZXJcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgRmxleE9mZnNldERpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcHJvdGVjdGVkIERJUkVDVElWRV9LRVkgPSAnZmxleC1vZmZzZXQnO1xuXG4gIGNvbnN0cnVjdG9yKGVsUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBzdHlsZUJ1aWxkZXI6IEZsZXhPZmZzZXRTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICAgICAgICAgICAgc3R5bGVyOiBTdHlsZVV0aWxzKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoW3RoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlXSk7XG4gICAgLy8gUGFyZW50IERPTSBgbGF5b3V0LWdhcGAgd2l0aCBhZmZlY3QgdGhlIG5lc3RlZCBjaGlsZCB3aXRoIGBmbGV4LW9mZnNldGBcbiAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLm1hcnNoYWxcbiAgICAgICAgLnRyYWNrVmFsdWUodGhpcy5wYXJlbnRFbGVtZW50LCAnbGF5b3V0LWdhcCcpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3lTdWJqZWN0KSlcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLnRyaWdnZXJVcGRhdGUuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBVc2luZyB0aGUgY3VycmVudCBmeEZsZXhPZmZzZXQgdmFsdWUsIHVwZGF0ZSB0aGUgaW5saW5lIENTU1xuICAgKiBOT1RFOiB0aGlzIHdpbGwgYXNzaWduIGBtYXJnaW4tbGVmdGAgaWYgdGhlIHBhcmVudCBmbGV4LWRpcmVjdGlvbiA9PSAncm93JyxcbiAgICogICAgICAgb3RoZXJ3aXNlIGBtYXJnaW4tdG9wYCBpcyB1c2VkIGZvciB0aGUgb2Zmc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nfG51bWJlciA9ICcnKTogdm9pZCB7XG4gICAgLy8gVGhlIGZsZXgtZGlyZWN0aW9uIG9mIHRoaXMgZWxlbWVudCdzIGZsZXggY29udGFpbmVyLiBEZWZhdWx0cyB0byAncm93Jy5cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmdldEZsZXhGbG93RGlyZWN0aW9uKHRoaXMucGFyZW50RWxlbWVudCEsIHRydWUpO1xuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZSA9PT0gJ3J0bCc7XG4gICAgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZVJvd1J0bDtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgIWlzUnRsKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBmbGV4T2Zmc2V0Q2FjaGVSb3dMdHI7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4nICYmIGlzUnRsKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBmbGV4T2Zmc2V0Q2FjaGVDb2x1bW5SdGw7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4nICYmICFpc1J0bCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleE9mZnNldENhY2hlQ29sdW1uTHRyO1xuICAgIH1cbiAgICB0aGlzLmFkZFN0eWxlcyh2YWx1ZSArICcnLCB7bGF5b3V0LCBpc1J0bH0pO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRGbGV4T2Zmc2V0RGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbmNvbnN0IGZsZXhPZmZzZXRDYWNoZVJvd1J0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZUNvbHVtblJ0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZVJvd0x0cjogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZUNvbHVtbkx0cjogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbiJdfQ==