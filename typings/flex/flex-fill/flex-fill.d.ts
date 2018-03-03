/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { BaseFxDirective, MediaMonitor, StyleUtils } from '@angular/flex-layout/core';
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
export declare class FlexFillDirective extends BaseFxDirective {
    elRef: ElementRef;
    constructor(monitor: MediaMonitor, elRef: ElementRef, styleUtils: StyleUtils);
}
