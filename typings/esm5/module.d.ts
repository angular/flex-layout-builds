/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ModuleWithProviders } from '@angular/core';
import { LayoutConfigOptions, BreakPoint } from '@angular/flex-layout/core';
/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/flexbox/layout-padding';
 *  import {LayoutMarginDirective} from './api/flexbox/layout-margin';
 */
/**
 *
 */
export declare class FlexLayoutModule {
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     */
    static withConfig(configOptions: LayoutConfigOptions, breakpoints?: BreakPoint | BreakPoint[]): ModuleWithProviders;
    constructor(serverModuleLoaded: boolean, platformId: Object);
}
