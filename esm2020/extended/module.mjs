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
ExtendedModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ExtendedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ExtendedModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ExtendedModule, declarations: [DefaultShowHideDirective,
        DefaultClassDirective,
        DefaultStyleDirective,
        DefaultImgSrcDirective], imports: [CoreModule], exports: [DefaultShowHideDirective,
        DefaultClassDirective,
        DefaultStyleDirective,
        DefaultImgSrcDirective] });
ExtendedModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ExtendedModule, imports: [[CoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ExtendedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=module.js.map