/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, Optional, PLATFORM_ID, SecurityContext, Self, } from '@angular/core';
import { isPlatformServer, NgStyle } from '@angular/common';
import { BaseDirective2, SERVER_TOKEN, } from '@angular/flex-layout/core';
import { buildRawList, getType, buildMapFromSet, stringToKeyValue, keyValuesToMap, } from './style-transforms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
export class StyleDirective extends BaseDirective2 {
    constructor(elementRef, styler, marshal, sanitizer, differs, renderer2, ngStyleInstance, serverLoaded, platformId) {
        super(elementRef, null, styler, marshal);
        this.sanitizer = sanitizer;
        this.ngStyleInstance = ngStyleInstance;
        this.DIRECTIVE_KEY = 'ngStyle';
        if (!this.ngStyleInstance) {
            // Create an instance NgStyle Directive instance only if `ngStyle=""` has NOT been
            // defined on the same host element; since the responsive variations may be defined...
            this.ngStyleInstance = new NgStyle(elementRef, differs, renderer2);
        }
        this.init();
        const styles = this.nativeElement.getAttribute('style') ?? '';
        this.fallbackStyles = this.buildStyleMap(styles);
        this.isServer = serverLoaded && isPlatformServer(platformId);
    }
    /** Add generated styles */
    updateWithValue(value) {
        const styles = this.buildStyleMap(value);
        this.ngStyleInstance.ngStyle = { ...this.fallbackStyles, ...styles };
        if (this.isServer) {
            this.applyStyleToElement(styles);
        }
        this.ngStyleInstance.ngDoCheck();
    }
    /** Remove generated styles */
    clearStyles() {
        this.ngStyleInstance.ngStyle = this.fallbackStyles;
        this.ngStyleInstance.ngDoCheck();
    }
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     */
    buildStyleMap(styles) {
        // Always safe-guard (aka sanitize) style property values
        const sanitizer = (val) => this.sanitizer.sanitize(SecurityContext.STYLE, val) ?? '';
        if (styles) {
            switch (getType(styles)) {
                case 'string': return buildMapFromList(buildRawList(styles), sanitizer);
                case 'array': return buildMapFromList(styles, sanitizer);
                case 'set': return buildMapFromSet(styles, sanitizer);
                default: return buildMapFromSet(styles, sanitizer);
            }
        }
        return {};
    }
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /** For ChangeDetectionStrategy.onPush and ngOnChanges() updates */
    ngDoCheck() {
        this.ngStyleInstance.ngDoCheck();
    }
}
StyleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: StyleDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: i2.DomSanitizer }, { token: i0.KeyValueDiffers }, { token: i0.Renderer2 }, { token: i3.NgStyle, optional: true, self: true }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
StyleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: StyleDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: StyleDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: i2.DomSanitizer }, { type: i0.KeyValueDiffers }, { type: i0.Renderer2 }, { type: i3.NgStyle, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
const inputs = [
    'ngStyle',
    'ngStyle.xs', 'ngStyle.sm', 'ngStyle.md', 'ngStyle.lg', 'ngStyle.xl',
    'ngStyle.lt-sm', 'ngStyle.lt-md', 'ngStyle.lt-lg', 'ngStyle.lt-xl',
    'ngStyle.gt-xs', 'ngStyle.gt-sm', 'ngStyle.gt-md', 'ngStyle.gt-lg'
];
const selector = `
  [ngStyle],
  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
`;
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export class DefaultStyleDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultStyleDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultStyleDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultStyleDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultStyleDirective, selector: "\n  [ngStyle],\n  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],\n  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],\n  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]\n", inputs: { ngStyle: "ngStyle", "ngStyle.xs": "ngStyle.xs", "ngStyle.sm": "ngStyle.sm", "ngStyle.md": "ngStyle.md", "ngStyle.lg": "ngStyle.lg", "ngStyle.xl": "ngStyle.xl", "ngStyle.lt-sm": "ngStyle.lt-sm", "ngStyle.lt-md": "ngStyle.lt-md", "ngStyle.lt-lg": "ngStyle.lt-lg", "ngStyle.lt-xl": "ngStyle.lt-xl", "ngStyle.gt-xs": "ngStyle.gt-xs", "ngStyle.gt-sm": "ngStyle.gt-sm", "ngStyle.gt-md": "ngStyle.gt-md", "ngStyle.gt-lg": "ngStyle.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultStyleDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
/** Build a styles map from a list of styles, while sanitizing bad values first */
function buildMapFromList(styles, sanitize) {
    const sanitizeValue = (it) => {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(entry => !!entry)
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2V4dGVuZGVkL3N0eWxlL3N0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxTQUFTLEVBR1QsTUFBTSxFQUVOLFFBQVEsRUFDUixXQUFXLEVBRVgsZUFBZSxFQUNmLElBQUksR0FDTCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsT0FBTyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFMUQsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBQ2IsTUFBTSwyQkFBMkIsQ0FBQztBQUVuQyxPQUFPLEVBSUwsWUFBWSxFQUNaLE9BQU8sRUFDUCxlQUFlLEVBR2YsZ0JBQWdCLEVBQ2hCLGNBQWMsR0FDZixNQUFNLG9CQUFvQixDQUFDOzs7OztBQUc1QixNQUFNLE9BQU8sY0FBZSxTQUFRLGNBQWM7SUFNaEQsWUFBWSxVQUFzQixFQUN0QixNQUFrQixFQUNsQixPQUF3QixFQUNkLFNBQXVCLEVBQ2pDLE9BQXdCLEVBQ3hCLFNBQW9CLEVBQ2lCLGVBQXdCLEVBQ3ZDLFlBQXFCLEVBQ3RCLFVBQWtCO1FBQ2pELEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQU50QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBR0ksb0JBQWUsR0FBZixlQUFlLENBQVM7UUFWL0Qsa0JBQWEsR0FBRyxTQUFTLENBQUM7UUFjbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsa0ZBQWtGO1lBQ2xGLHNGQUFzRjtZQUN0RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsSUFB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QixxQkFBcUI7a0JBRGpDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDOztBQUs3QixrRkFBa0Y7QUFDbEYsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFzQixFQUFFLFFBQTJCO0lBQzNFLE1BQU0sYUFBYSxHQUFHLENBQUMsRUFBbUIsRUFBRSxFQUFFO1FBQzVDLElBQUksUUFBUSxFQUFFO1lBQ1osRUFBRSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUM7SUFFRixPQUFPLE1BQU07U0FDVixHQUFHLENBQUMsZ0JBQWdCLENBQUM7U0FDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUN4QixHQUFHLENBQUMsYUFBYSxDQUFDO1NBQ2xCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBZ0IsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBLZXlWYWx1ZURpZmZlcnMsXG4gIE9wdGlvbmFsLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWN1cml0eUNvbnRleHQsXG4gIFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtU2VydmVyLCBOZ1N0eWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXJ9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIFN0eWxlVXRpbHMsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU0VSVkVSX1RPS0VOLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuaW1wb3J0IHtcbiAgTmdTdHlsZVJhd0xpc3QsXG4gIE5nU3R5bGVUeXBlLFxuICBOZ1N0eWxlU2FuaXRpemVyLFxuICBidWlsZFJhd0xpc3QsXG4gIGdldFR5cGUsXG4gIGJ1aWxkTWFwRnJvbVNldCxcbiAgTmdTdHlsZU1hcCxcbiAgTmdTdHlsZUtleVZhbHVlLFxuICBzdHJpbmdUb0tleVZhbHVlLFxuICBrZXlWYWx1ZXNUb01hcCxcbn0gZnJvbSAnLi9zdHlsZS10cmFuc2Zvcm1zJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgU3R5bGVEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIERvQ2hlY2sge1xuXG4gIHByb3RlY3RlZCBESVJFQ1RJVkVfS0VZID0gJ25nU3R5bGUnO1xuICBwcm90ZWN0ZWQgZmFsbGJhY2tTdHlsZXM6IE5nU3R5bGVNYXA7XG4gIHByb3RlY3RlZCBpc1NlcnZlcjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBzdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgICAgICAgICAgICBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG4gICAgICAgICAgICAgIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHByaXZhdGUgcmVhZG9ubHkgbmdTdHlsZUluc3RhbmNlOiBOZ1N0eWxlLFxuICAgICAgICAgICAgICBASW5qZWN0KFNFUlZFUl9UT0tFTikgc2VydmVyTG9hZGVkOiBib29sZWFuLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3QpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBudWxsISwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICBpZiAoIXRoaXMubmdTdHlsZUluc3RhbmNlKSB7XG4gICAgICAvLyBDcmVhdGUgYW4gaW5zdGFuY2UgTmdTdHlsZSBEaXJlY3RpdmUgaW5zdGFuY2Ugb25seSBpZiBgbmdTdHlsZT1cIlwiYCBoYXMgTk9UIGJlZW5cbiAgICAgIC8vIGRlZmluZWQgb24gdGhlIHNhbWUgaG9zdCBlbGVtZW50OyBzaW5jZSB0aGUgcmVzcG9uc2l2ZSB2YXJpYXRpb25zIG1heSBiZSBkZWZpbmVkLi4uXG4gICAgICB0aGlzLm5nU3R5bGVJbnN0YW5jZSA9IG5ldyBOZ1N0eWxlKGVsZW1lbnRSZWYsIGRpZmZlcnMsIHJlbmRlcmVyMik7XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJykgPz8gJyc7XG4gICAgdGhpcy5mYWxsYmFja1N0eWxlcyA9IHRoaXMuYnVpbGRTdHlsZU1hcChzdHlsZXMpO1xuICAgIHRoaXMuaXNTZXJ2ZXIgPSBzZXJ2ZXJMb2FkZWQgJiYgaXNQbGF0Zm9ybVNlcnZlcihwbGF0Zm9ybUlkKTtcbiAgfVxuXG4gIC8qKiBBZGQgZ2VuZXJhdGVkIHN0eWxlcyAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmJ1aWxkU3R5bGVNYXAodmFsdWUpO1xuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nU3R5bGUgPSB7Li4udGhpcy5mYWxsYmFja1N0eWxlcywgLi4uc3R5bGVzfTtcbiAgICBpZiAodGhpcy5pc1NlcnZlcikge1xuICAgICAgdGhpcy5hcHBseVN0eWxlVG9FbGVtZW50KHN0eWxlcyk7XG4gICAgfVxuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nRG9DaGVjaygpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBnZW5lcmF0ZWQgc3R5bGVzICovXG4gIHByb3RlY3RlZCBjbGVhclN0eWxlcygpIHtcbiAgICB0aGlzLm5nU3R5bGVJbnN0YW5jZS5uZ1N0eWxlID0gdGhpcy5mYWxsYmFja1N0eWxlcztcbiAgICB0aGlzLm5nU3R5bGVJbnN0YW5jZS5uZ0RvQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHJhdyBzdHJpbmdzIHRvIG5nU3R5bGVNYXA7IHdoaWNoIGlzIHJlcXVpcmVkIGJ5IG5nU3R5bGVcbiAgICogTk9URTogUmF3IHN0cmluZyBrZXktdmFsdWUgcGFpcnMgTVVTVCBiZSBkZWxpbWl0ZWQgYnkgYDtgXG4gICAqICAgICAgIENvbW1hLWRlbGltaXRlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgZHVlIHRvIGNvbXBsZXhpdGllcyBvZlxuICAgKiAgICAgICBwb3NzaWJsZSBzdHlsZSB2YWx1ZXMgc3VjaCBhcyBgcmdiYSh4LHgseCx4KWAgYW5kIG90aGVyc1xuICAgKi9cbiAgcHJvdGVjdGVkIGJ1aWxkU3R5bGVNYXAoc3R5bGVzOiBOZ1N0eWxlVHlwZSk6IE5nU3R5bGVNYXAge1xuICAgIC8vIEFsd2F5cyBzYWZlLWd1YXJkIChha2Egc2FuaXRpemUpIHN0eWxlIHByb3BlcnR5IHZhbHVlc1xuICAgIGNvbnN0IHNhbml0aXplcjogTmdTdHlsZVNhbml0aXplciA9ICh2YWw6IGFueSkgPT5cbiAgICAgIHRoaXMuc2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5TVFlMRSwgdmFsKSA/PyAnJztcbiAgICBpZiAoc3R5bGVzKSB7XG4gICAgICBzd2l0Y2ggKGdldFR5cGUoc3R5bGVzKSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOiAgcmV0dXJuIGJ1aWxkTWFwRnJvbUxpc3QoYnVpbGRSYXdMaXN0KHN0eWxlcyksXG4gICAgICAgICAgc2FuaXRpemVyKTtcbiAgICAgICAgY2FzZSAnYXJyYXknIDogIHJldHVybiBidWlsZE1hcEZyb21MaXN0KHN0eWxlcyBhcyBOZ1N0eWxlUmF3TGlzdCwgc2FuaXRpemVyKTtcbiAgICAgICAgY2FzZSAnc2V0JyAgIDogIHJldHVybiBidWlsZE1hcEZyb21TZXQoc3R5bGVzLCBzYW5pdGl6ZXIpO1xuICAgICAgICBkZWZhdWx0ICAgICAgOiAgcmV0dXJuIGJ1aWxkTWFwRnJvbVNldChzdHlsZXMsIHNhbml0aXplcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIExpZmVjeWNsZSBIb29rc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKiogRm9yIENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lm9uUHVzaCBhbmQgbmdPbkNoYW5nZXMoKSB1cGRhdGVzICovXG4gIG5nRG9DaGVjaygpIHtcbiAgICB0aGlzLm5nU3R5bGVJbnN0YW5jZS5uZ0RvQ2hlY2soKTtcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICduZ1N0eWxlJyxcbiAgJ25nU3R5bGUueHMnLCAnbmdTdHlsZS5zbScsICduZ1N0eWxlLm1kJywgJ25nU3R5bGUubGcnLCAnbmdTdHlsZS54bCcsXG4gICduZ1N0eWxlLmx0LXNtJywgJ25nU3R5bGUubHQtbWQnLCAnbmdTdHlsZS5sdC1sZycsICduZ1N0eWxlLmx0LXhsJyxcbiAgJ25nU3R5bGUuZ3QteHMnLCAnbmdTdHlsZS5ndC1zbScsICduZ1N0eWxlLmd0LW1kJywgJ25nU3R5bGUuZ3QtbGcnXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW25nU3R5bGVdLFxuICBbbmdTdHlsZS54c10sIFtuZ1N0eWxlLnNtXSwgW25nU3R5bGUubWRdLCBbbmdTdHlsZS5sZ10sIFtuZ1N0eWxlLnhsXSxcbiAgW25nU3R5bGUubHQtc21dLCBbbmdTdHlsZS5sdC1tZF0sIFtuZ1N0eWxlLmx0LWxnXSwgW25nU3R5bGUubHQteGxdLFxuICBbbmdTdHlsZS5ndC14c10sIFtuZ1N0eWxlLmd0LXNtXSwgW25nU3R5bGUuZ3QtbWRdLCBbbmdTdHlsZS5ndC1sZ11cbmA7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGFkZCByZXNwb25zaXZlIHN1cHBvcnQgZm9yIG5nU3R5bGUuXG4gKlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvciwgaW5wdXRzfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0U3R5bGVEaXJlY3RpdmUgZXh0ZW5kcyBTdHlsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIERvQ2hlY2sge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuXG4vKiogQnVpbGQgYSBzdHlsZXMgbWFwIGZyb20gYSBsaXN0IG9mIHN0eWxlcywgd2hpbGUgc2FuaXRpemluZyBiYWQgdmFsdWVzIGZpcnN0ICovXG5mdW5jdGlvbiBidWlsZE1hcEZyb21MaXN0KHN0eWxlczogTmdTdHlsZVJhd0xpc3QsIHNhbml0aXplPzogTmdTdHlsZVNhbml0aXplcik6IE5nU3R5bGVNYXAge1xuICBjb25zdCBzYW5pdGl6ZVZhbHVlID0gKGl0OiBOZ1N0eWxlS2V5VmFsdWUpID0+IHtcbiAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgIGl0LnZhbHVlID0gc2FuaXRpemUoaXQudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gaXQ7XG4gIH07XG5cbiAgcmV0dXJuIHN0eWxlc1xuICAgIC5tYXAoc3RyaW5nVG9LZXlWYWx1ZSlcbiAgICAuZmlsdGVyKGVudHJ5ID0+ICEhZW50cnkpXG4gICAgLm1hcChzYW5pdGl6ZVZhbHVlKVxuICAgIC5yZWR1Y2Uoa2V5VmFsdWVzVG9NYXAsIHt9IGFzIE5nU3R5bGVNYXApO1xufVxuIl19