/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, PLATFORM_ID, Injectable, Input } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BaseDirective2, SERVER_TOKEN, StyleBuilder, } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class ImgSrcStyleBuilder extends StyleBuilder {
    buildStyles(url) {
        return { 'content': url ? `url(${url})` : '' };
    }
}
ImgSrcStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ImgSrcStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ImgSrcStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ImgSrcStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ImgSrcStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ImgSrcDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'img-src';
        this.defaultSrc = '';
        this.styleCache = imgSrcCache;
        this.init();
        this.setValue(this.nativeElement.getAttribute('src') || '', '');
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.nativeElement.setAttribute('src', '');
        }
    }
    set src(val) {
        this.defaultSrc = val;
        this.setValue(this.defaultSrc, '');
    }
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     */
    updateWithValue(value) {
        const url = value || this.defaultSrc;
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.addStyles(url);
        }
        else {
            this.nativeElement.setAttribute('src', url);
        }
    }
}
ImgSrcDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ImgSrcDirective, deps: [{ token: i0.ElementRef }, { token: ImgSrcStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive });
ImgSrcDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: ImgSrcDirective, inputs: { src: "src" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ImgSrcDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ImgSrcStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }]; }, propDecorators: { src: [{
                type: Input,
                args: ['src']
            }] } });
const imgSrcCache = new Map();
const inputs = [
    'src.xs', 'src.sm', 'src.md', 'src.lg', 'src.xl',
    'src.lt-sm', 'src.lt-md', 'src.lt-lg', 'src.lt-xl',
    'src.gt-xs', 'src.gt-sm', 'src.gt-md', 'src.gt-lg'
];
const selector = `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`;
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
export class DefaultImgSrcDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultImgSrcDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultImgSrcDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultImgSrcDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultImgSrcDirective, selector: "\n  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],\n  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],\n  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]\n", inputs: { "src.xs": "src.xs", "src.sm": "src.sm", "src.md": "src.md", "src.lg": "src.lg", "src.xl": "src.xl", "src.lt-sm": "src.lt-sm", "src.lt-md": "src.lt-md", "src.lt-lg": "src.lt-lg", "src.lt-xl": "src.lt-xl", "src.gt-xs": "src.gt-xs", "src.gt-sm": "src.gt-sm", "src.gt-md": "src.gt-md", "src.gt-lg": "src.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultImgSrcDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1nLXNyYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZXh0ZW5kZWQvaW1nLXNyYy9pbWctc3JjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxTQUFTLEVBQWMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2pELE9BQU8sRUFFTCxjQUFjLEVBQ2QsWUFBWSxFQUNaLFlBQVksR0FHYixNQUFNLDJCQUEyQixDQUFDOzs7QUFHbkMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQVk7SUFDbEQsV0FBVyxDQUFDLEdBQVc7UUFDckIsT0FBTyxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFDO0lBQy9DLENBQUM7OytHQUhVLGtCQUFrQjttSEFBbEIsa0JBQWtCLGNBRE4sTUFBTTsyRkFDbEIsa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFRaEMsTUFBTSxPQUFPLGVBQWdCLFNBQVEsY0FBYztJQVVqRCxZQUFZLFVBQXNCLEVBQ3RCLFlBQWdDLEVBQ2hDLE1BQWtCLEVBQ2xCLE9BQXdCLEVBQ08sVUFBa0IsRUFDakIsa0JBQTJCO1FBQ3JFLEtBQUssQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUZSLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDakIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFTO1FBZDdELGtCQUFhLEdBQUcsU0FBUyxDQUFDO1FBQzFCLGVBQVUsR0FBRyxFQUFFLENBQUM7UUF1Q2hCLGVBQVUsR0FBRyxXQUFXLENBQUM7UUF4QmpDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBbEJELElBQ0ksR0FBRyxDQUFDLEdBQVc7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFnQkQ7Ozs7Ozs7T0FPRztJQUNPLGVBQWUsQ0FBQyxLQUFjO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDOzs0R0F2Q1UsZUFBZSw0Q0FXQSxrQkFBa0Isc0VBR3hCLFdBQVcsYUFDWCxZQUFZO2dHQWZyQixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUZBWWtCLGtCQUFrQixtRUFHVyxNQUFNOzBCQUFoRCxNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLFlBQVk7NENBVjVCLEdBQUc7c0JBRE4sS0FBSzt1QkFBQyxLQUFLOztBQXdDZCxNQUFNLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRztJQUNiLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRO0lBQ2hELFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVc7SUFDbEQsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVztDQUNuRCxDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUc7Ozs7Q0FJaEIsQ0FBQztBQUVGOzs7Ozs7OztHQVFHO0FBRUgsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGVBQWU7SUFEM0Q7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7bUhBRlksc0JBQXNCO3VHQUF0QixzQkFBc0I7MkZBQXRCLHNCQUFzQjtrQkFEbEMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIFBMQVRGT1JNX0lELCBJbmplY3RhYmxlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBNZWRpYU1hcnNoYWxsZXIsXG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTRVJWRVJfVE9LRU4sXG4gIFN0eWxlQnVpbGRlcixcbiAgU3R5bGVEZWZpbml0aW9uLFxuICBTdHlsZVV0aWxzLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgSW1nU3JjU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXModXJsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4geydjb250ZW50JzogdXJsID8gYHVybCgke3VybH0pYCA6ICcnfTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBJbWdTcmNEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG4gIHByb3RlY3RlZCBESVJFQ1RJVkVfS0VZID0gJ2ltZy1zcmMnO1xuICBwcm90ZWN0ZWQgZGVmYXVsdFNyYyA9ICcnO1xuXG4gIEBJbnB1dCgnc3JjJylcbiAgc2V0IHNyYyh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuZGVmYXVsdFNyYyA9IHZhbDtcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMuZGVmYXVsdFNyYywgJycpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgc3R5bGVCdWlsZGVyOiBJbWdTcmNTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KFNFUlZFUl9UT0tFTikgcHJvdGVjdGVkIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhbikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpIHx8ICcnLCAnJyk7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSAmJiB0aGlzLnNlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgJycpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIFtyZXNwb25zaXZlbHldIGFjdGl2YXRlZCBpbnB1dCB2YWx1ZSB0byB1cGRhdGVcbiAgICogdGhlIGhvc3QgaW1nIHNyYyBhdHRyaWJ1dGUgb3IgYXNzaWduIGEgZGVmYXVsdCBgaW1nLnNyYz0nJ2BcbiAgICogaWYgdGhlIHNyYyBoYXMgbm90IGJlZW4gZGVmaW5lZC5cbiAgICpcbiAgICogRG8gbm90aGluZyB0byBzdGFuZGFyZCBgPGltZyBzcmM9XCJcIj5gIHVzYWdlcywgb25seSB3aGVuIHJlc3BvbnNpdmVcbiAgICoga2V5cyBhcmUgcHJlc2VudCBkbyB3ZSBhY3R1YWxseSBjYWxsIGBzZXRBdHRyaWJ1dGUoKWBcbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVXaXRoVmFsdWUodmFsdWU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB1cmwgPSB2YWx1ZSB8fCB0aGlzLmRlZmF1bHRTcmM7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSAmJiB0aGlzLnNlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgdGhpcy5hZGRTdHlsZXModXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc3R5bGVDYWNoZSA9IGltZ1NyY0NhY2hlO1xufVxuXG5jb25zdCBpbWdTcmNDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcblxuY29uc3QgaW5wdXRzID0gW1xuICAnc3JjLnhzJywgJ3NyYy5zbScsICdzcmMubWQnLCAnc3JjLmxnJywgJ3NyYy54bCcsXG4gICdzcmMubHQtc20nLCAnc3JjLmx0LW1kJywgJ3NyYy5sdC1sZycsICdzcmMubHQteGwnLFxuICAnc3JjLmd0LXhzJywgJ3NyYy5ndC1zbScsICdzcmMuZ3QtbWQnLCAnc3JjLmd0LWxnJ1xuXTtcblxuY29uc3Qgc2VsZWN0b3IgPSBgXG4gIGltZ1tzcmMueHNdLCAgICBpbWdbc3JjLnNtXSwgICAgaW1nW3NyYy5tZF0sICAgIGltZ1tzcmMubGddLCAgIGltZ1tzcmMueGxdLFxuICBpbWdbc3JjLmx0LXNtXSwgaW1nW3NyYy5sdC1tZF0sIGltZ1tzcmMubHQtbGddLCBpbWdbc3JjLmx0LXhsXSxcbiAgaW1nW3NyYy5ndC14c10sIGltZ1tzcmMuZ3Qtc21dLCBpbWdbc3JjLmd0LW1kXSwgaW1nW3NyYy5ndC1sZ11cbmA7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgcHJvdmlkZXMgYSByZXNwb25zaXZlIEFQSSBmb3IgdGhlIEhUTUwgPGltZz4gJ3NyYycgYXR0cmlidXRlXG4gKiBhbmQgd2lsbCB1cGRhdGUgdGhlIGltZy5zcmMgcHJvcGVydHkgdXBvbiBlYWNoIHJlc3BvbnNpdmUgYWN0aXZhdGlvbi5cbiAqXG4gKiBlLmcuXG4gKiAgICAgIDxpbWcgc3JjPVwiZGVmYXVsdFNjZW5lLmpwZ1wiIHNyYy54cz1cIm1vYmlsZVNjZW5lLmpwZ1wiPjwvaW1nPlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9yZXNwb25zaXZlLWltYWdlcy15b3VyZS1qdXN0LWNoYW5naW5nLXJlc29sdXRpb25zLXVzZS1zcmMvXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRJbWdTcmNEaXJlY3RpdmUgZXh0ZW5kcyBJbWdTcmNEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19