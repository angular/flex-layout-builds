/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as i0 from '@angular/core';
import { Version, Inject, NgModule, PLATFORM_ID, ɵɵngDeclareFactory, ɵɵFactoryTarget, ɵɵngDeclareNgModule, ɵɵngDeclareInjector, ɵɵngDeclareClassMetadata } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { SERVER_TOKEN, LAYOUT_CONFIG, DEFAULT_CONFIG, BREAKPOINT } from '@angular/flex-layout/core';
export * from '@angular/flex-layout/core';
export { FlexLayoutModule } from '@angular/flex-layout/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
export * from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
export * from '@angular/flex-layout/flex';
import { GridModule } from '@angular/flex-layout/grid';
export * from '@angular/flex-layout/grid';

/** Current version of Angular Flex-Layout. */
const VERSION = new Version('12.0.0-beta.35-517de2a');

/**
 * FlexLayoutModule -- the main import for all utilities in the Angular Layout library
 * * Will automatically provide Flex, Grid, and Extended modules for use in the application
 * * Can be configured using the static withConfig method, options viewable on the Wiki's
 *   Configuration page
 */
class FlexLayoutModule {
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
FlexLayoutModule.ɵfac = ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexLayoutModule, deps: [{ token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: ɵɵFactoryTarget.NgModule });
FlexLayoutModule.ɵmod = ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule], exports: [FlexModule, ExtendedModule, GridModule] });
FlexLayoutModule.ɵinj = ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexLayoutModule, imports: [[FlexModule, ExtendedModule, GridModule], FlexModule, ExtendedModule, GridModule] });
ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexLayoutModule, decorators: [{
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

/**
 * Generated bundle index. Do not edit.
 */

export { VERSION };
//# sourceMappingURL=flex-layout.mjs.map
