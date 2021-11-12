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
GridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: GridModule, declarations: [DefaultGridAlignDirective,
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
GridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: GridModule, imports: [[CoreModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=module.js.map