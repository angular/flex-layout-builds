/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/flex-layout/core'), require('@angular/flex-layout/extended'), require('@angular/flex-layout/flex')) :
	typeof define === 'function' && define.amd ? define('@angular/flex-layout', ['exports', '@angular/core', '@angular/common', '@angular/flex-layout/core', '@angular/flex-layout/extended', '@angular/flex-layout/flex'], factory) :
	(factory((global.ng = global.ng || {}, global.ng['flex-layout'] = {}),global.ng.core,global.ng.common,global.ng.flexLayout.core,global.ng.flexLayout.extended,global.ng.flexLayout.flex));
}(this, (function (exports,core,common,core$1,extended,flex) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Current version of Angular Flex-Layout.
 */
var /** @type {?} */ VERSION = new core.Version('5.0.0-beta.14-17a70ee');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 *
 */
var FlexLayoutModule = /** @class */ (function () {
    function FlexLayoutModule(serverModuleLoaded, platformId) {
        if (common.isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    FlexLayoutModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [flex.FlexModule, extended.ExtendedModule],
                    exports: [flex.FlexModule, extended.ExtendedModule]
                },] },
    ];
    /** @nocollapse */
    FlexLayoutModule.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.SERVER_TOKEN,] },] },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
    ]; };
    return FlexLayoutModule;
}());

exports.removeStyles = core$1.removeStyles;
exports.BROWSER_PROVIDER = core$1.BROWSER_PROVIDER;
exports.CLASS_NAME = core$1.CLASS_NAME;
exports.CoreModule = core$1.CoreModule;
exports.MediaChange = core$1.MediaChange;
exports.StylesheetMap = core$1.StylesheetMap;
exports.STYLESHEET_MAP_PROVIDER_FACTORY = core$1.STYLESHEET_MAP_PROVIDER_FACTORY;
exports.STYLESHEET_MAP_PROVIDER = core$1.STYLESHEET_MAP_PROVIDER;
exports.ADD_FLEX_STYLES = core$1.ADD_FLEX_STYLES;
exports.SERVER_TOKEN = core$1.SERVER_TOKEN;
exports.DISABLE_DEFAULT_BREAKPOINTS = core$1.DISABLE_DEFAULT_BREAKPOINTS;
exports.ADD_ORIENTATION_BREAKPOINTS = core$1.ADD_ORIENTATION_BREAKPOINTS;
exports.BREAKPOINT = core$1.BREAKPOINT;
exports.DISABLE_VENDOR_PREFIXES = core$1.DISABLE_VENDOR_PREFIXES;
exports.BaseFxDirective = core$1.BaseFxDirective;
exports.BaseFxDirectiveAdapter = core$1.BaseFxDirectiveAdapter;
exports.RESPONSIVE_ALIASES = core$1.RESPONSIVE_ALIASES;
exports.DEFAULT_BREAKPOINTS = core$1.DEFAULT_BREAKPOINTS;
exports.ScreenTypes = core$1.ScreenTypes;
exports.ORIENTATION_BREAKPOINTS = core$1.ORIENTATION_BREAKPOINTS;
exports.BreakPointRegistry = core$1.BreakPointRegistry;
exports.BREAKPOINTS_PROVIDER_FACTORY = core$1.BREAKPOINTS_PROVIDER_FACTORY;
exports.BREAKPOINTS_PROVIDER = core$1.BREAKPOINTS_PROVIDER;
exports.BREAKPOINTS = core$1.BREAKPOINTS;
exports.MatchMedia = core$1.MatchMedia;
exports.MockMatchMedia = core$1.MockMatchMedia;
exports.MockMediaQueryList = core$1.MockMediaQueryList;
exports.MockMatchMediaProvider = core$1.MockMatchMediaProvider;
exports.ServerMediaQueryList = core$1.ServerMediaQueryList;
exports.ServerMatchMedia = core$1.ServerMatchMedia;
exports.MediaMonitor = core$1.MediaMonitor;
exports.MEDIA_MONITOR_PROVIDER_FACTORY = core$1.MEDIA_MONITOR_PROVIDER_FACTORY;
exports.MEDIA_MONITOR_PROVIDER = core$1.MEDIA_MONITOR_PROVIDER;
exports.ObservableMedia = core$1.ObservableMedia;
exports.MediaService = core$1.MediaService;
exports.ObservableMediaProvider = core$1.ObservableMediaProvider;
exports.OBSERVABLE_MEDIA_PROVIDER_FACTORY = core$1.OBSERVABLE_MEDIA_PROVIDER_FACTORY;
exports.OBSERVABLE_MEDIA_PROVIDER = core$1.OBSERVABLE_MEDIA_PROVIDER;
exports.KeyOptions = core$1.KeyOptions;
exports.ResponsiveActivation = core$1.ResponsiveActivation;
exports.StyleUtils = core$1.StyleUtils;
exports.validateBasis = core$1.validateBasis;
exports.ExtendedModule = extended.ExtendedModule;
exports.ClassDirective = extended.ClassDirective;
exports.ImgSrcDirective = extended.ImgSrcDirective;
exports.negativeOf = extended.negativeOf;
exports.ShowHideDirective = extended.ShowHideDirective;
exports.StyleDirective = extended.StyleDirective;
exports.FlexModule = flex.FlexModule;
exports.FlexDirective = flex.FlexDirective;
exports.FlexAlignDirective = flex.FlexAlignDirective;
exports.FlexFillDirective = flex.FlexFillDirective;
exports.FlexOffsetDirective = flex.FlexOffsetDirective;
exports.FlexOrderDirective = flex.FlexOrderDirective;
exports.LayoutDirective = flex.LayoutDirective;
exports.LayoutAlignDirective = flex.LayoutAlignDirective;
exports.LayoutGapDirective = flex.LayoutGapDirective;
exports.VERSION = VERSION;
exports.FlexLayoutModule = FlexLayoutModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout.umd.js.map
