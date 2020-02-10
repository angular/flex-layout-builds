/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * A breakpoint is a wrapper interface around the browser's mediaQuery,
 * which is a condition string used for matching based on browser window
 * parameters. Here, a breakpoint has a shortcut name, e.g. 'xs', the
 * corresponding mediaQuery, and a priority in case the mediaQuery overlaps
 * with other registered breakpoints.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
 */
export interface Breakpoint {
    /** The shortcut name for the breakpoint, e.g. 'xs' */
    name: string;
    /** The mediaQuery for the breakpoint, e.g. 'screen and (max-width: 500px)' */
    media: string;
    /** The priority of the breakpoint compared to other breakpoints */
    priority: number;
}
export declare const FALLBACK_BREAKPOINT_KEY: string;
/**
 * The fallback breakpoint, which has no real name and is
 * superseded by any other breakpoint value
 */
export declare const FALLBACK_BREAKPOINT: Breakpoint;
/**
 * The default breakpoints as provided by Google's Material Design.
 * These do not include orientation breakpoints or device breakpoints.
 */
export declare const DEFAULT_BREAKPOINTS: Breakpoint[];
/**
 * The user-facing injection token for providing breakpoints,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 */
export declare const BREAKPOINTS: InjectionToken<Breakpoint[][]>;
/** An internal-facing provider for the default breakpoints */
export declare const BREAKPOINTS_PROVIDER: {
    provide: InjectionToken<Breakpoint[][]>;
    useValue: Breakpoint[];
    multi: boolean;
};
/**
 * An internal-facing injection token to consolidate all registered
 * breakpoints for use in the application.
 */
export declare const BPS: InjectionToken<Breakpoint[]>;
