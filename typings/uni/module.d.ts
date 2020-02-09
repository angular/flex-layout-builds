/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ModuleWithProviders } from '@angular/core';
export declare class UnifiedModule {
    static withDefaults(withDefaultBp?: boolean): ModuleWithProviders<UnifiedModule>;
    static withFlex(withDefaultBp?: boolean): ModuleWithProviders<UnifiedModule>;
    static withGrid(withDefaultBp?: boolean): ModuleWithProviders<UnifiedModule>;
}
