/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { BROWSER_PROVIDER } from './browser-provider';
import * as i0 from "@angular/core";
/**
 * *****************************************************************
 * Define module for common Angular Layout utilities
 * *****************************************************************
 */
export class CoreModule {
}
CoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CoreModule });
CoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CoreModule, providers: [BROWSER_PROVIDER] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CoreModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [BROWSER_PROVIDER]
                }]
        }] });
//# sourceMappingURL=module.js.map