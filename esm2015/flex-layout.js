/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Version, Inject, NgModule, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CUSTOM_BREAKPOINTS_PROVIDER_FACTORY, CoreModule, SERVER_TOKEN } from '@angular/flex-layout/core';
export { ɵa0, removeStyles, BROWSER_PROVIDER, CLASS_NAME, CoreModule, MediaQueriesModule, MediaChange, StylesheetMap, SERVER_TOKEN, BaseFxDirective, BaseFxDirectiveAdapter, RESPONSIVE_ALIASES, DEFAULT_BREAKPOINTS, ScreenTypes, ORIENTATION_BREAKPOINTS, BreakPointRegistry, buildMergedBreakPoints, DEFAULT_BREAKPOINTS_PROVIDER_FACTORY, DEFAULT_BREAKPOINTS_PROVIDER, CUSTOM_BREAKPOINTS_PROVIDER_FACTORY, BREAKPOINTS, MatchMedia, MockMatchMedia, MockMediaQueryList, MockMatchMediaProvider, ServerMediaQueryList, ServerMatchMedia, MediaMonitor, MEDIA_MONITOR_PROVIDER_FACTORY, MEDIA_MONITOR_PROVIDER, ObservableMedia, MediaService, OBSERVABLE_MEDIA_PROVIDER_FACTORY, OBSERVABLE_MEDIA_PROVIDER, KeyOptions, ResponsiveActivation, StyleUtils } from '@angular/flex-layout/core';
import { ExtendedModule } from '@angular/flex-layout/extended';
export { ExtendedModule, ClassDirective, ImgSrcDirective, negativeOf, ShowHideDirective, StyleDirective } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
export { FlexModule, FlexDirective, FlexAlignDirective, FlexFillDirective, FlexOffsetDirective, FlexOrderDirective, LayoutDirective, LayoutAlignDirective, LayoutGapDirective } from '@angular/flex-layout/flex';
export { FlexLayoutServerModule, generateStaticFlexLayoutStyles, FLEX_SSR_SERIALIZER_FACTORY, SERVER_PROVIDERS } from '@angular/flex-layout/server';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Current version of Angular Flex-Layout.
 */
const /** @type {?} */ VERSION = new Version('5.0.0-beta.13-bbe4b23');

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
    /**
     * External uses can easily add custom breakpoints AND include internal orientations
     * breakpoints; which are not available by default.
     *
     * !! Selector aliases are not auto-configured. Developers must subclass
     * the API directives to support extra selectors for the orientations breakpoints !!
     * @param {?} breakpoints
     * @param {?=} options
     * @return {?}
     */
    static provideBreakPoints(breakpoints, options) {
        return {
            ngModule: FlexLayoutModule,
            providers: [
                CUSTOM_BREAKPOINTS_PROVIDER_FACTORY(breakpoints, options || { orientations: false })
            ]
        };
    }
}
FlexLayoutModule.decorators = [
    { type: NgModule, args: [{
                imports: [FlexModule, ExtendedModule, CoreModule],
                exports: [FlexModule, ExtendedModule, CoreModule]
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
