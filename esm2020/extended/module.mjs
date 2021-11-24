/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout/core';
import { DefaultImgSrcDirective } from './img-src/img-src';
import { DefaultClassDirective } from './class/class';
import { DefaultShowHideDirective } from './show-hide/show-hide';
import { DefaultStyleDirective } from './style/style';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultShowHideDirective,
    DefaultClassDirective,
    DefaultStyleDirective,
    DefaultImgSrcDirective,
];
/**
 * *****************************************************************
 * Define module for the Extended API
 * *****************************************************************
 */
export class ExtendedModule {
}
ExtendedModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ExtendedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ExtendedModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ExtendedModule, declarations: [DefaultShowHideDirective,
        DefaultClassDirective,
        DefaultStyleDirective,
        DefaultImgSrcDirective], imports: [CoreModule], exports: [DefaultShowHideDirective,
        DefaultClassDirective,
        DefaultStyleDirective,
        DefaultImgSrcDirective] });
ExtendedModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ExtendedModule, imports: [[CoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ExtendedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9leHRlbmRlZC9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFHcEQsTUFBTSxjQUFjLEdBQUc7SUFDckIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQixxQkFBcUI7SUFDckIsc0JBQXNCO0NBQ3ZCLENBQUM7QUFFRjs7OztHQUlHO0FBT0gsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkFqQnpCLHdCQUF3QjtRQUN4QixxQkFBcUI7UUFDckIscUJBQXFCO1FBQ3JCLHNCQUFzQixhQVVaLFVBQVUsYUFicEIsd0JBQXdCO1FBQ3hCLHFCQUFxQjtRQUNyQixxQkFBcUI7UUFDckIsc0JBQXNCOzRHQWNYLGNBQWMsWUFKaEIsQ0FBQyxVQUFVLENBQUM7MkZBSVYsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLFlBQVksRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO29CQUNqQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb3JlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuaW1wb3J0IHtEZWZhdWx0SW1nU3JjRGlyZWN0aXZlfSBmcm9tICcuL2ltZy1zcmMvaW1nLXNyYyc7XG5pbXBvcnQge0RlZmF1bHRDbGFzc0RpcmVjdGl2ZX0gZnJvbSAnLi9jbGFzcy9jbGFzcyc7XG5pbXBvcnQge0RlZmF1bHRTaG93SGlkZURpcmVjdGl2ZX0gZnJvbSAnLi9zaG93LWhpZGUvc2hvdy1oaWRlJztcbmltcG9ydCB7RGVmYXVsdFN0eWxlRGlyZWN0aXZlfSBmcm9tICcuL3N0eWxlL3N0eWxlJztcblxuXG5jb25zdCBBTExfRElSRUNUSVZFUyA9IFtcbiAgRGVmYXVsdFNob3dIaWRlRGlyZWN0aXZlLFxuICBEZWZhdWx0Q2xhc3NEaXJlY3RpdmUsXG4gIERlZmF1bHRTdHlsZURpcmVjdGl2ZSxcbiAgRGVmYXVsdEltZ1NyY0RpcmVjdGl2ZSxcbl07XG5cbi8qKlxuICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIERlZmluZSBtb2R1bGUgZm9yIHRoZSBFeHRlbmRlZCBBUElcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvcmVNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5BTExfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFsuLi5BTExfRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5kZWRNb2R1bGUge1xufVxuIl19