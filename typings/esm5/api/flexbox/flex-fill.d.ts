/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { MediaMonitor } from '../../media-query/media-monitor';
import { BaseFxDirective } from '../core/base';
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
export declare class FlexFillDirective extends BaseFxDirective {
    elRef: ElementRef;
    renderer: Renderer2;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2, platformId: Object);
}
