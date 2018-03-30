/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Optional } from '@angular/core';
import { BreakPoint } from './break-point';
/**
 * Factory that combines the configured breakpoints into one array and then merges
 * them using a utility function
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export declare function BREAKPOINTS_PROVIDER_FACTORY(parentBreakpoints: BreakPoint[], breakpoints: (BreakPoint | BreakPoint[])[], disableDefaults: boolean, addOrientation: boolean): BreakPoint[];
/**
 * Provider that combines the provided extra breakpoints with the default and
 * orientation breakpoints based on configuration
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export declare const BREAKPOINTS_PROVIDER: {
    provide: InjectionToken<BreakPoint[]>;
    useFactory: typeof BREAKPOINTS_PROVIDER_FACTORY;
    deps: Optional[][];
};
