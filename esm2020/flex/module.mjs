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
FlexModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FlexModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, declarations: [DefaultLayoutDirective,
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
FlexModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, imports: [[CoreModule, BidiModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: FlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule, BidiModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=module.js.map