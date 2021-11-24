/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { SERVER_TOKEN, LAYOUT_CONFIG, DEFAULT_CONFIG, BREAKPOINT, } from '@angular/flex-layout/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { GridModule } from '@angular/flex-layout/grid';
import * as i0 from "@angular/core";
/**
 * FlexLayoutModule -- the main import for all utilities in the Angular Layout library
 * * Will automatically provide Flex, Grid, and Extended modules for use in the application
 * * Can be configured using the static withConfig method, options viewable on the Wiki's
 *   Configuration page
 */
export class FlexLayoutModule {
    constructor(serverModuleLoaded, platformId) {
        if (isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     */
    static withConfig(configOptions, 
    // tslint:disable-next-line:max-line-length
    breakpoints = []) {
        return {
            ngModule: FlexLayoutModule,
            providers: configOptions.serverLoaded ?
                [
                    { provide: LAYOUT_CONFIG, useValue: { ...DEFAULT_CONFIG, ...configOptions } },
                    { provide: BREAKPOINT, useValue: breakpoints, multi: true },
                    { provide: SERVER_TOKEN, useValue: true },
                ] : [
                { provide: LAYOUT_CONFIG, useValue: { ...DEFAULT_CONFIG, ...configOptions } },
                { provide: BREAKPOINT, useValue: breakpoints, multi: true },
            ]
        };
    }
}
FlexLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexLayoutModule, deps: [{ token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.NgModule });
FlexLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule], exports: [FlexModule, ExtendedModule, GridModule] });
FlexLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexLayoutModule, imports: [[FlexModule, ExtendedModule, GridModule], FlexModule, ExtendedModule, GridModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: FlexLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FlexModule, ExtendedModule, GridModule],
                    exports: [FlexModule, ExtendedModule, GridModule]
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRCxPQUFPLEVBQ0wsWUFBWSxFQUVaLGFBQWEsRUFDYixjQUFjLEVBRWQsVUFBVSxHQUNYLE1BQU0sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRXJEOzs7OztHQUtHO0FBS0gsTUFBTSxPQUFPLGdCQUFnQjtJQXVCM0IsWUFBa0Msa0JBQTJCLEVBQzVCLFVBQWtCO1FBQ2pELElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDMUY7SUFDSCxDQUFDO0lBMUJEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBa0M7SUFDbEMsMkNBQTJDO0lBQzNDLGNBQXVDLEVBQUU7UUFDekQsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDckM7b0JBQ0UsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUFDLEdBQUcsY0FBYyxFQUFFLEdBQUcsYUFBYSxFQUFDLEVBQUM7b0JBQ3pFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQ3pELEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2lCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDRixFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxjQUFjLEVBQUUsR0FBRyxhQUFhLEVBQUMsRUFBQztnQkFDekUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQzthQUMxRDtTQUNKLENBQUM7SUFDSixDQUFDOzs2R0FyQlUsZ0JBQWdCLGtCQXVCUCxZQUFZLGFBQ1osV0FBVzs4R0F4QnBCLGdCQUFnQixZQUhqQixVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsYUFDdEMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVOzhHQUVyQyxnQkFBZ0IsWUFIbEIsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUN2QyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVU7MkZBRXJDLGdCQUFnQjtrQkFKNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQztvQkFDakQsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7aUJBQ2xEOzswQkF3QmMsTUFBTTsyQkFBQyxZQUFZOzhCQUNhLE1BQU07MEJBQXRDLE1BQU07MkJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3QsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7XG4gIFNFUlZFUl9UT0tFTixcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgTEFZT1VUX0NPTkZJRyxcbiAgREVGQVVMVF9DT05GSUcsXG4gIEJyZWFrUG9pbnQsXG4gIEJSRUFLUE9JTlQsXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHtFeHRlbmRlZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvZXh0ZW5kZWQnO1xuaW1wb3J0IHtGbGV4TW9kdWxlfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9mbGV4JztcbmltcG9ydCB7R3JpZE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvZ3JpZCc7XG5cbi8qKlxuICogRmxleExheW91dE1vZHVsZSAtLSB0aGUgbWFpbiBpbXBvcnQgZm9yIGFsbCB1dGlsaXRpZXMgaW4gdGhlIEFuZ3VsYXIgTGF5b3V0IGxpYnJhcnlcbiAqICogV2lsbCBhdXRvbWF0aWNhbGx5IHByb3ZpZGUgRmxleCwgR3JpZCwgYW5kIEV4dGVuZGVkIG1vZHVsZXMgZm9yIHVzZSBpbiB0aGUgYXBwbGljYXRpb25cbiAqICogQ2FuIGJlIGNvbmZpZ3VyZWQgdXNpbmcgdGhlIHN0YXRpYyB3aXRoQ29uZmlnIG1ldGhvZCwgb3B0aW9ucyB2aWV3YWJsZSBvbiB0aGUgV2lraSdzXG4gKiAgIENvbmZpZ3VyYXRpb24gcGFnZVxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbRmxleE1vZHVsZSwgRXh0ZW5kZWRNb2R1bGUsIEdyaWRNb2R1bGVdLFxuICBleHBvcnRzOiBbRmxleE1vZHVsZSwgRXh0ZW5kZWRNb2R1bGUsIEdyaWRNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIEZsZXhMYXlvdXRNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBGbGV4TGF5b3V0TW9kdWxlIHdpdGggYSBzZXQgb2YgY29uZmlnIG9wdGlvbnMsXG4gICAqIHdoaWNoIHNldHMgdGhlIGNvcnJlc3BvbmRpbmcgdG9rZW5zIGFjY29yZGluZ2x5XG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhjb25maWdPcHRpb25zOiBMYXlvdXRDb25maWdPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50fEJyZWFrUG9pbnRbXSA9IFtdKTogTW9kdWxlV2l0aFByb3ZpZGVyczxGbGV4TGF5b3V0TW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBGbGV4TGF5b3V0TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBjb25maWdPcHRpb25zLnNlcnZlckxvYWRlZCA/XG4gICAgICAgIFtcbiAgICAgICAgICB7cHJvdmlkZTogTEFZT1VUX0NPTkZJRywgdXNlVmFsdWU6IHsuLi5ERUZBVUxUX0NPTkZJRywgLi4uY29uZmlnT3B0aW9uc319LFxuICAgICAgICAgIHtwcm92aWRlOiBCUkVBS1BPSU5ULCB1c2VWYWx1ZTogYnJlYWtwb2ludHMsIG11bHRpOiB0cnVlfSxcbiAgICAgICAgICB7cHJvdmlkZTogU0VSVkVSX1RPS0VOLCB1c2VWYWx1ZTogdHJ1ZX0sXG4gICAgICAgIF0gOiBbXG4gICAgICAgICAge3Byb3ZpZGU6IExBWU9VVF9DT05GSUcsIHVzZVZhbHVlOiB7Li4uREVGQVVMVF9DT05GSUcsIC4uLmNvbmZpZ09wdGlvbnN9fSxcbiAgICAgICAgICB7cHJvdmlkZTogQlJFQUtQT0lOVCwgdXNlVmFsdWU6IGJyZWFrcG9pbnRzLCBtdWx0aTogdHJ1ZX0sXG4gICAgICAgIF1cbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChTRVJWRVJfVE9LRU4pIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0KSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCkgJiYgIXNlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiBGbGV4IExheW91dCBsb2FkZWQgb24gdGhlIHNlcnZlciB3aXRob3V0IEZsZXhMYXlvdXRTZXJ2ZXJNb2R1bGUnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==