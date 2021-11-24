/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { CoreModule } from '@angular/flex-layout/core';
import { DefaultLayoutDirective } from './layout/layout';
import { DefaultLayoutGapDirective } from './layout-gap/layout-gap';
import { DefaultFlexDirective } from './flex/flex';
import { DefaultFlexOrderDirective } from './flex-order/flex-order';
import { DefaultFlexOffsetDirective } from './flex-offset/flex-offset';
import { DefaultFlexAlignDirective } from './flex-align/flex-align';
import { FlexFillDirective } from './flex-fill/flex-fill';
import { DefaultLayoutAlignDirective } from './layout-align/layout-align';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexOrderDirective,
    DefaultFlexOffsetDirective,
    FlexFillDirective,
    DefaultFlexAlignDirective,
    DefaultFlexDirective,
];
/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */
export class FlexModule {
}
FlexModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FlexModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexModule, declarations: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective], imports: [CoreModule, BidiModule], exports: [DefaultLayoutDirective,
        DefaultLayoutGapDirective,
        DefaultLayoutAlignDirective,
        DefaultFlexOrderDirective,
        DefaultFlexOffsetDirective,
        FlexFillDirective,
        DefaultFlexAlignDirective,
        DefaultFlexDirective] });
FlexModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexModule, imports: [[CoreModule, BidiModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule, BidiModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDdkQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLDZCQUE2QixDQUFDOztBQUd4RSxNQUFNLGNBQWMsR0FBRztJQUNyQixzQkFBc0I7SUFDdEIseUJBQXlCO0lBQ3pCLDJCQUEyQjtJQUMzQix5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLGlCQUFpQjtJQUNqQix5QkFBeUI7SUFDekIsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjs7OztHQUlHO0FBT0gsTUFBTSxPQUFPLFVBQVU7O3VHQUFWLFVBQVU7d0dBQVYsVUFBVSxpQkFyQnJCLHNCQUFzQjtRQUN0Qix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLHlCQUF5QjtRQUN6QiwwQkFBMEI7UUFDMUIsaUJBQWlCO1FBQ2pCLHlCQUF5QjtRQUN6QixvQkFBb0IsYUFVVixVQUFVLEVBQUUsVUFBVSxhQWpCaEMsc0JBQXNCO1FBQ3RCLHlCQUF5QjtRQUN6QiwyQkFBMkI7UUFDM0IseUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQixpQkFBaUI7UUFDakIseUJBQXlCO1FBQ3pCLG9CQUFvQjt3R0FjVCxVQUFVLFlBSlosQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDOzJGQUl0QixVQUFVO2tCQUx0QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7b0JBQ2pDLFlBQVksRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO29CQUNqQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCaWRpTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0NvcmVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuXG5pbXBvcnQge0RlZmF1bHRMYXlvdXREaXJlY3RpdmV9IGZyb20gJy4vbGF5b3V0L2xheW91dCc7XG5pbXBvcnQge0RlZmF1bHRMYXlvdXRHYXBEaXJlY3RpdmV9IGZyb20gJy4vbGF5b3V0LWdhcC9sYXlvdXQtZ2FwJztcbmltcG9ydCB7RGVmYXVsdEZsZXhEaXJlY3RpdmV9IGZyb20gJy4vZmxleC9mbGV4JztcbmltcG9ydCB7RGVmYXVsdEZsZXhPcmRlckRpcmVjdGl2ZX0gZnJvbSAnLi9mbGV4LW9yZGVyL2ZsZXgtb3JkZXInO1xuaW1wb3J0IHtEZWZhdWx0RmxleE9mZnNldERpcmVjdGl2ZX0gZnJvbSAnLi9mbGV4LW9mZnNldC9mbGV4LW9mZnNldCc7XG5pbXBvcnQge0RlZmF1bHRGbGV4QWxpZ25EaXJlY3RpdmV9IGZyb20gJy4vZmxleC1hbGlnbi9mbGV4LWFsaWduJztcbmltcG9ydCB7RmxleEZpbGxEaXJlY3RpdmV9IGZyb20gJy4vZmxleC1maWxsL2ZsZXgtZmlsbCc7XG5pbXBvcnQge0RlZmF1bHRMYXlvdXRBbGlnbkRpcmVjdGl2ZX0gZnJvbSAnLi9sYXlvdXQtYWxpZ24vbGF5b3V0LWFsaWduJztcblxuXG5jb25zdCBBTExfRElSRUNUSVZFUyA9IFtcbiAgRGVmYXVsdExheW91dERpcmVjdGl2ZSxcbiAgRGVmYXVsdExheW91dEdhcERpcmVjdGl2ZSxcbiAgRGVmYXVsdExheW91dEFsaWduRGlyZWN0aXZlLFxuICBEZWZhdWx0RmxleE9yZGVyRGlyZWN0aXZlLFxuICBEZWZhdWx0RmxleE9mZnNldERpcmVjdGl2ZSxcbiAgRmxleEZpbGxEaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4QWxpZ25EaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4RGlyZWN0aXZlLFxuXTtcblxuLyoqXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogRGVmaW5lIG1vZHVsZSBmb3IgdGhlIEZsZXggQVBJXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb3JlTW9kdWxlLCBCaWRpTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbLi4uQUxMX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbLi4uQUxMX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEZsZXhNb2R1bGUge1xufVxuIl19