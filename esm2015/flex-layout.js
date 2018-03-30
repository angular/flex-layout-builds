/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Version, Inject, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { SERVER_TOKEN } from '@angular/flex-layout/core';
export { removeStyles, BROWSER_PROVIDER, CLASS_NAME, CoreModule, MediaChange, StylesheetMap, STYLESHEET_MAP_PROVIDER_FACTORY, STYLESHEET_MAP_PROVIDER, ADD_FLEX_STYLES, SERVER_TOKEN, DISABLE_DEFAULT_BREAKPOINTS, ADD_ORIENTATION_BREAKPOINTS, BREAKPOINT, DISABLE_VENDOR_PREFIXES, BaseFxDirective, BaseFxDirectiveAdapter, RESPONSIVE_ALIASES, DEFAULT_BREAKPOINTS, ScreenTypes, ORIENTATION_BREAKPOINTS, BreakPointRegistry, BREAKPOINTS_PROVIDER_FACTORY, BREAKPOINTS_PROVIDER, BREAKPOINTS, MatchMedia, MockMatchMedia, MockMediaQueryList, MockMatchMediaProvider, ServerMediaQueryList, ServerMatchMedia, MediaMonitor, MEDIA_MONITOR_PROVIDER_FACTORY, MEDIA_MONITOR_PROVIDER, ObservableMedia, MediaService, ObservableMediaProvider, OBSERVABLE_MEDIA_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER, KeyOptions, ResponsiveActivation, StyleUtils } from '@angular/flex-layout/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
export { ExtendedModule, ClassDirective, ImgSrcDirective, negativeOf, ShowHideDirective, StyleDirective } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
export { FlexModule, FlexDirective, FlexAlignDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, LayoutDirective, LayoutAlignDirective, LayoutGapDirective } from '@angular/flex-layout/flex';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Current version of Angular Flex-Layout.
 */
const /** @type {?} */ VERSION = new Version('5.0.0-beta.14-b3f3404');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *
 */
class FlexLayoutModule {
    /**
     * @param {?} serverModuleLoaded
     * @param {?} platformId
     */
    constructor(serverModuleLoaded, platformId) {
        if (isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
}
FlexLayoutModule.decorators = [
    { type: NgModule, args: [{
                imports: [FlexModule, ExtendedModule],
                exports: [FlexModule, ExtendedModule]
            },] },
];
/** @nocollapse */
FlexLayoutModule.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [SERVER_TOKEN,] },] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { VERSION, FlexLayoutModule };
//# sourceMappingURL=flex-layout.js.map
