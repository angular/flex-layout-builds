/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CoreModule } from '@angular/flex-layout/core';
import { DefaultGridAlignDirective } from './grid-align/grid-align';
import { DefaultGridAlignColumnsDirective } from './align-columns/align-columns';
import { DefaultGridAlignRowsDirective } from './align-rows/align-rows';
import { DefaultGridAreaDirective } from './area/area';
import { DefaultGridAreasDirective } from './areas/areas';
import { DefaultGridAutoDirective } from './auto/auto';
import { DefaultGridColumnDirective } from './column/column';
import { DefaultGridColumnsDirective } from './columns/columns';
import { DefaultGridGapDirective } from './gap/gap';
import { DefaultGridRowDirective } from './row/row';
import { DefaultGridRowsDirective } from './rows/rows';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultGridAlignDirective,
    DefaultGridAlignColumnsDirective,
    DefaultGridAlignRowsDirective,
    DefaultGridAreaDirective,
    DefaultGridAreasDirective,
    DefaultGridAutoDirective,
    DefaultGridColumnDirective,
    DefaultGridColumnsDirective,
    DefaultGridGapDirective,
    DefaultGridRowDirective,
    DefaultGridRowsDirective,
];
/**
 * *****************************************************************
 * Define module for the CSS Grid API
 * *****************************************************************
 */
export class GridModule {
}
GridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridModule, declarations: [DefaultGridAlignDirective,
        DefaultGridAlignColumnsDirective,
        DefaultGridAlignRowsDirective,
        DefaultGridAreaDirective,
        DefaultGridAreasDirective,
        DefaultGridAutoDirective,
        DefaultGridColumnDirective,
        DefaultGridColumnsDirective,
        DefaultGridGapDirective,
        DefaultGridRowDirective,
        DefaultGridRowsDirective], imports: [CoreModule], exports: [DefaultGridAlignDirective,
        DefaultGridAlignColumnsDirective,
        DefaultGridAlignRowsDirective,
        DefaultGridAreaDirective,
        DefaultGridAreasDirective,
        DefaultGridAutoDirective,
        DefaultGridColumnDirective,
        DefaultGridColumnsDirective,
        DefaultGridGapDirective,
        DefaultGridRowDirective,
        DefaultGridRowsDirective] });
GridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridModule, imports: [[CoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUVyRCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZ0NBQWdDLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMvRSxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDckQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNyRCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFHckQsTUFBTSxjQUFjLEdBQUc7SUFDckIseUJBQXlCO0lBQ3pCLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0Isd0JBQXdCO0lBQ3hCLHlCQUF5QjtJQUN6Qix3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtDQUN6QixDQUFDO0FBRUY7Ozs7R0FJRztBQU9ILE1BQU0sT0FBTyxVQUFVOzt1R0FBVixVQUFVO3dHQUFWLFVBQVUsaUJBeEJyQix5QkFBeUI7UUFDekIsZ0NBQWdDO1FBQ2hDLDZCQUE2QjtRQUM3Qix3QkFBd0I7UUFDeEIseUJBQXlCO1FBQ3pCLHdCQUF3QjtRQUN4QiwwQkFBMEI7UUFDMUIsMkJBQTJCO1FBQzNCLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsd0JBQXdCLGFBVWQsVUFBVSxhQXBCcEIseUJBQXlCO1FBQ3pCLGdDQUFnQztRQUNoQyw2QkFBNkI7UUFDN0Isd0JBQXdCO1FBQ3hCLHlCQUF5QjtRQUN6Qix3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLDJCQUEyQjtRQUMzQix1QkFBdUI7UUFDdkIsdUJBQXVCO1FBQ3ZCLHdCQUF3Qjt3R0FjYixVQUFVLFlBSlosQ0FBQyxVQUFVLENBQUM7MkZBSVYsVUFBVTtrQkFMdEIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLFlBQVksRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO29CQUNqQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb3JlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcblxuaW1wb3J0IHtEZWZhdWx0R3JpZEFsaWduRGlyZWN0aXZlfSBmcm9tICcuL2dyaWQtYWxpZ24vZ3JpZC1hbGlnbic7XG5pbXBvcnQge0RlZmF1bHRHcmlkQWxpZ25Db2x1bW5zRGlyZWN0aXZlfSBmcm9tICcuL2FsaWduLWNvbHVtbnMvYWxpZ24tY29sdW1ucyc7XG5pbXBvcnQge0RlZmF1bHRHcmlkQWxpZ25Sb3dzRGlyZWN0aXZlfSBmcm9tICcuL2FsaWduLXJvd3MvYWxpZ24tcm93cyc7XG5pbXBvcnQge0RlZmF1bHRHcmlkQXJlYURpcmVjdGl2ZX0gZnJvbSAnLi9hcmVhL2FyZWEnO1xuaW1wb3J0IHtEZWZhdWx0R3JpZEFyZWFzRGlyZWN0aXZlfSBmcm9tICcuL2FyZWFzL2FyZWFzJztcbmltcG9ydCB7RGVmYXVsdEdyaWRBdXRvRGlyZWN0aXZlfSBmcm9tICcuL2F1dG8vYXV0byc7XG5pbXBvcnQge0RlZmF1bHRHcmlkQ29sdW1uRGlyZWN0aXZlfSBmcm9tICcuL2NvbHVtbi9jb2x1bW4nO1xuaW1wb3J0IHtEZWZhdWx0R3JpZENvbHVtbnNEaXJlY3RpdmV9IGZyb20gJy4vY29sdW1ucy9jb2x1bW5zJztcbmltcG9ydCB7RGVmYXVsdEdyaWRHYXBEaXJlY3RpdmV9IGZyb20gJy4vZ2FwL2dhcCc7XG5pbXBvcnQge0RlZmF1bHRHcmlkUm93RGlyZWN0aXZlfSBmcm9tICcuL3Jvdy9yb3cnO1xuaW1wb3J0IHtEZWZhdWx0R3JpZFJvd3NEaXJlY3RpdmV9IGZyb20gJy4vcm93cy9yb3dzJztcblxuXG5jb25zdCBBTExfRElSRUNUSVZFUyA9IFtcbiAgRGVmYXVsdEdyaWRBbGlnbkRpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQWxpZ25Sb3dzRGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZEFyZWFEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQXJlYXNEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQXV0b0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRDb2x1bW5EaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQ29sdW1uc0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRHYXBEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkUm93RGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZFJvd3NEaXJlY3RpdmUsXG5dO1xuXG4vKipcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBEZWZpbmUgbW9kdWxlIGZvciB0aGUgQ1NTIEdyaWQgQVBJXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb3JlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbLi4uQUxMX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbLi4uQUxMX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRNb2R1bGUge1xufVxuIl19