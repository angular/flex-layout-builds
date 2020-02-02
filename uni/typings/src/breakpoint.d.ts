/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
export interface Breakpoint {
    name: string;
    media: string;
    priority: number;
}
export declare const FALLBACK_BREAKPOINT_KEY: string;
export declare const FALLBACK_BREAKPOINT: Breakpoint;
export declare const DEFAULT_BREAKPOINTS: Breakpoint[];
export declare const BREAKPOINTS: InjectionToken<Breakpoint[][]>;
export declare const BPS: InjectionToken<Breakpoint[]>;
