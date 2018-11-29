/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { BaseDirective, MediaMonitor, StyleBuilder, StyleDefinition, StyleUtils } from '@angular/flex-layout/core';
export declare class FlexFillStyleBuilder extends StyleBuilder {
    buildStyles(_input: string): {
        'margin': number;
        'width': string;
        'height': string;
        'min-width': string;
        'min-height': string;
    };
}
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
export declare class FlexFillDirective extends BaseDirective {
    elRef: ElementRef;
    constructor(monitor: MediaMonitor, elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: FlexFillStyleBuilder);
    protected _styleCache: Map<string, StyleDefinition>;
}
