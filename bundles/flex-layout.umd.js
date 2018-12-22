/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/flex-layout/core'), require('@angular/flex-layout/extended'), require('@angular/flex-layout/flex'), require('@angular/flex-layout/grid')) :
	typeof define === 'function' && define.amd ? define('@angular/flex-layout', ['exports', '@angular/core', '@angular/common', '@angular/flex-layout/core', '@angular/flex-layout/extended', '@angular/flex-layout/flex', '@angular/flex-layout/grid'], factory) :
	(factory((global.ng = global.ng || {}, global.ng['flex-layout'] = {}),global.ng.core,global.ng.common,global.ng.flexLayout.core,global.ng.flexLayout.extended,global.ng.flexLayout.flex,global.ng.flexLayout.grid));
}(this, (function (exports,core,common,core$1,extended,flex,grid) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Current version of Angular Flex-Layout.
  @type {?} */
var VERSION = new core.Version('7.0.0-beta.22-5db4ccf');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * FlexLayoutModule -- the main import for all utilities in the Angular Layout library
 * * Will automatically provide Flex, Grid, and Extended modules for use in the application
 * * Can be configured using the static withConfig method, options viewable on the Wiki's
 *   Configuration page
 */
var FlexLayoutModule = /** @class */ (function () {
    function FlexLayoutModule(serverModuleLoaded, platformId) {
        if (common.isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     */
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     * @param {?} configOptions
     * @param {?=} breakpoints
     * @return {?}
     */
    FlexLayoutModule.withConfig = /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     * @param {?} configOptions
     * @param {?=} breakpoints
     * @return {?}
     */
    function (configOptions, breakpoints) {
        if (breakpoints === void 0) { breakpoints = []; }
        return {
            ngModule: FlexLayoutModule,
            providers: configOptions.serverLoaded ?
                [
                    { provide: core$1.LAYOUT_CONFIG, useValue: configOptions },
                    { provide: core$1.BREAKPOINT, useValue: breakpoints, multi: true },
                    { provide: core$1.SERVER_TOKEN, useValue: true },
                ] : [
                { provide: core$1.LAYOUT_CONFIG, useValue: configOptions },
                { provide: core$1.BREAKPOINT, useValue: breakpoints, multi: true },
            ]
        };
    };
    FlexLayoutModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [flex.FlexModule, extended.ExtendedModule, grid.GridModule],
                    exports: [flex.FlexModule, extended.ExtendedModule, grid.GridModule]
                },] },
    ];
    /** @nocollapse */
    FlexLayoutModule.ctorParameters = function () { return [
        { type: Boolean, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.SERVER_TOKEN,] }] },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] }
    ]; };
    return FlexLayoutModule;
}());

exports.removeStyles = core$1.removeStyles;
exports.BROWSER_PROVIDER = core$1.BROWSER_PROVIDER;
exports.CLASS_NAME = core$1.CLASS_NAME;
exports.CoreModule = core$1.CoreModule;
exports.MediaChange = core$1.MediaChange;
exports.StylesheetMap = core$1.StylesheetMap;
exports.DEFAULT_CONFIG = core$1.DEFAULT_CONFIG;
exports.LAYOUT_CONFIG = core$1.LAYOUT_CONFIG;
exports.SERVER_TOKEN = core$1.SERVER_TOKEN;
exports.BREAKPOINT = core$1.BREAKPOINT;
exports.BaseDirective2 = core$1.BaseDirective2;
exports.prioritySort = core$1.prioritySort;
exports.RESPONSIVE_ALIASES = core$1.RESPONSIVE_ALIASES;
exports.DEFAULT_BREAKPOINTS = core$1.DEFAULT_BREAKPOINTS;
exports.ScreenTypes = core$1.ScreenTypes;
exports.ORIENTATION_BREAKPOINTS = core$1.ORIENTATION_BREAKPOINTS;
exports.BreakPointRegistry = core$1.BreakPointRegistry;
exports.BREAKPOINTS = core$1.BREAKPOINTS;
exports.MatchMedia = core$1.MatchMedia;
exports.MockMatchMedia = core$1.MockMatchMedia;
exports.MockMediaQueryList = core$1.MockMediaQueryList;
exports.MockMatchMediaProvider = core$1.MockMatchMediaProvider;
exports.ServerMediaQueryList = core$1.ServerMediaQueryList;
exports.ServerMatchMedia = core$1.ServerMatchMedia;
exports.MediaObserver = core$1.MediaObserver;
exports.StyleUtils = core$1.StyleUtils;
exports.StyleBuilder = core$1.StyleBuilder;
exports.validateBasis = core$1.validateBasis;
exports.MediaMarshaller = core$1.MediaMarshaller;
exports.ExtendedModule = extended.ExtendedModule;
exports.ClassDirective = extended.ClassDirective;
exports.DefaultClassDirective = extended.DefaultClassDirective;
exports.ImgSrcStyleBuilder = extended.ImgSrcStyleBuilder;
exports.ImgSrcDirective = extended.ImgSrcDirective;
exports.DefaultImgSrcDirective = extended.DefaultImgSrcDirective;
exports.ShowHideStyleBuilder = extended.ShowHideStyleBuilder;
exports.ShowHideDirective = extended.ShowHideDirective;
exports.DefaultShowHideDirective = extended.DefaultShowHideDirective;
exports.StyleDirective = extended.StyleDirective;
exports.DefaultStyleDirective = extended.DefaultStyleDirective;
exports.FlexModule = flex.FlexModule;
exports.FlexStyleBuilder = flex.FlexStyleBuilder;
exports.FlexDirective = flex.FlexDirective;
exports.DefaultFlexDirective = flex.DefaultFlexDirective;
exports.FlexAlignStyleBuilder = flex.FlexAlignStyleBuilder;
exports.FlexAlignDirective = flex.FlexAlignDirective;
exports.DefaultFlexAlignDirective = flex.DefaultFlexAlignDirective;
exports.FlexFillStyleBuilder = flex.FlexFillStyleBuilder;
exports.FlexFillDirective = flex.FlexFillDirective;
exports.FlexOffsetStyleBuilder = flex.FlexOffsetStyleBuilder;
exports.FlexOffsetDirective = flex.FlexOffsetDirective;
exports.DefaultFlexOffsetDirective = flex.DefaultFlexOffsetDirective;
exports.FlexOrderStyleBuilder = flex.FlexOrderStyleBuilder;
exports.FlexOrderDirective = flex.FlexOrderDirective;
exports.DefaultFlexOrderDirective = flex.DefaultFlexOrderDirective;
exports.LayoutStyleBuilder = flex.LayoutStyleBuilder;
exports.LayoutDirective = flex.LayoutDirective;
exports.DefaultLayoutDirective = flex.DefaultLayoutDirective;
exports.LayoutAlignStyleBuilder = flex.LayoutAlignStyleBuilder;
exports.LayoutAlignDirective = flex.LayoutAlignDirective;
exports.DefaultLayoutAlignDirective = flex.DefaultLayoutAlignDirective;
exports.LayoutGapStyleBuilder = flex.LayoutGapStyleBuilder;
exports.LayoutGapDirective = flex.LayoutGapDirective;
exports.DefaultLayoutGapDirective = flex.DefaultLayoutGapDirective;
exports.ɵf = grid.ɵf;
exports.ɵe = grid.ɵe;
exports.ɵd = grid.ɵd;
exports.ɵi = grid.ɵi;
exports.ɵh = grid.ɵh;
exports.ɵg = grid.ɵg;
exports.ɵl = grid.ɵl;
exports.ɵk = grid.ɵk;
exports.ɵj = grid.ɵj;
exports.ɵo = grid.ɵo;
exports.ɵn = grid.ɵn;
exports.ɵm = grid.ɵm;
exports.ɵr = grid.ɵr;
exports.ɵq = grid.ɵq;
exports.ɵp = grid.ɵp;
exports.ɵu = grid.ɵu;
exports.ɵt = grid.ɵt;
exports.ɵs = grid.ɵs;
exports.ɵx = grid.ɵx;
exports.ɵw = grid.ɵw;
exports.ɵv = grid.ɵv;
exports.ɵba = grid.ɵba;
exports.ɵz = grid.ɵz;
exports.ɵy = grid.ɵy;
exports.ɵc = grid.ɵc;
exports.ɵb = grid.ɵb;
exports.ɵa = grid.ɵa;
exports.ɵbd = grid.ɵbd;
exports.ɵbc = grid.ɵbc;
exports.ɵbb = grid.ɵbb;
exports.ɵbg = grid.ɵbg;
exports.ɵbf = grid.ɵbf;
exports.ɵbe = grid.ɵbe;
exports.GridModule = grid.GridModule;
exports.VERSION = VERSION;
exports.FlexLayoutModule = FlexLayoutModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout.umd.js.map
