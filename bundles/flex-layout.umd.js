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
	(factory((global.ng = global.ng || {}, global.ng.flexLayout = {}),global.ng.core,global.ng.common,global.ng.flexLayout.core,global.ng.flexLayout.extended,global.ng.flexLayout.flex,global.ng.flexLayout.grid));
}(this, (function (exports,core,common,core$1,extended,flex,grid) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * @fileoverview added by tsickle
 * Generated from: version.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Current version of Angular Flex-Layout.
 * @type {?}
 */
var VERSION = new core.Version('9.0.0-beta.31-e83b2cc');

/**
 * @fileoverview added by tsickle
 * Generated from: module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    function (configOptions, 
    // tslint:disable-next-line:max-line-length
    breakpoints) {
        if (breakpoints === void 0) { breakpoints = []; }
        return {
            ngModule: FlexLayoutModule,
            providers: configOptions.serverLoaded ?
                [
                    { provide: core$1.LAYOUT_CONFIG, useValue: __assign(__assign({}, core$1.DEFAULT_CONFIG), configOptions) },
                    { provide: core$1.BREAKPOINT, useValue: breakpoints, multi: true },
                    { provide: core$1.SERVER_TOKEN, useValue: true },
                ] : [
                { provide: core$1.LAYOUT_CONFIG, useValue: __assign(__assign({}, core$1.DEFAULT_CONFIG), configOptions) },
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
        { type: Boolean, decorators: [{ type: core.Inject, args: [core$1.SERVER_TOKEN,] }] },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] }
    ]; };
    return FlexLayoutModule;
}());

exports.ɵMatchMedia = core$1.ɵMatchMedia;
exports.ɵMockMatchMedia = core$1.ɵMockMatchMedia;
exports.ɵMockMatchMediaProvider = core$1.ɵMockMatchMediaProvider;
exports.CoreModule = core$1.CoreModule;
exports.removeStyles = core$1.removeStyles;
exports.BROWSER_PROVIDER = core$1.BROWSER_PROVIDER;
exports.CLASS_NAME = core$1.CLASS_NAME;
exports.MediaChange = core$1.MediaChange;
exports.StylesheetMap = core$1.StylesheetMap;
exports.DEFAULT_CONFIG = core$1.DEFAULT_CONFIG;
exports.LAYOUT_CONFIG = core$1.LAYOUT_CONFIG;
exports.SERVER_TOKEN = core$1.SERVER_TOKEN;
exports.BREAKPOINT = core$1.BREAKPOINT;
exports.mergeAlias = core$1.mergeAlias;
exports.BaseDirective2 = core$1.BaseDirective2;
exports.DEFAULT_BREAKPOINTS = core$1.DEFAULT_BREAKPOINTS;
exports.ScreenTypes = core$1.ScreenTypes;
exports.ORIENTATION_BREAKPOINTS = core$1.ORIENTATION_BREAKPOINTS;
exports.BreakPointRegistry = core$1.BreakPointRegistry;
exports.BREAKPOINTS = core$1.BREAKPOINTS;
exports.MediaObserver = core$1.MediaObserver;
exports.MediaTrigger = core$1.MediaTrigger;
exports.sortDescendingPriority = core$1.sortDescendingPriority;
exports.sortAscendingPriority = core$1.sortAscendingPriority;
exports.coerceArray = core$1.coerceArray;
exports.StyleUtils = core$1.StyleUtils;
exports.StyleBuilder = core$1.StyleBuilder;
exports.validateBasis = core$1.validateBasis;
exports.MediaMarshaller = core$1.MediaMarshaller;
exports.BREAKPOINT_PRINT = core$1.BREAKPOINT_PRINT;
exports.PrintHook = core$1.PrintHook;
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
exports.ɵgrid_privatef = grid.ɵgrid_privatef;
exports.ɵgrid_privatee = grid.ɵgrid_privatee;
exports.ɵgrid_privated = grid.ɵgrid_privated;
exports.ɵgrid_privatei = grid.ɵgrid_privatei;
exports.ɵgrid_privateh = grid.ɵgrid_privateh;
exports.ɵgrid_privateg = grid.ɵgrid_privateg;
exports.ɵgrid_privatel = grid.ɵgrid_privatel;
exports.ɵgrid_privatek = grid.ɵgrid_privatek;
exports.ɵgrid_privatej = grid.ɵgrid_privatej;
exports.ɵgrid_privateo = grid.ɵgrid_privateo;
exports.ɵgrid_privaten = grid.ɵgrid_privaten;
exports.ɵgrid_privatem = grid.ɵgrid_privatem;
exports.ɵgrid_privater = grid.ɵgrid_privater;
exports.ɵgrid_privateq = grid.ɵgrid_privateq;
exports.ɵgrid_privatep = grid.ɵgrid_privatep;
exports.ɵgrid_privateu = grid.ɵgrid_privateu;
exports.ɵgrid_privatet = grid.ɵgrid_privatet;
exports.ɵgrid_privates = grid.ɵgrid_privates;
exports.ɵgrid_privatex = grid.ɵgrid_privatex;
exports.ɵgrid_privatew = grid.ɵgrid_privatew;
exports.ɵgrid_privatev = grid.ɵgrid_privatev;
exports.ɵgrid_privateba = grid.ɵgrid_privateba;
exports.ɵgrid_privatez = grid.ɵgrid_privatez;
exports.ɵgrid_privatey = grid.ɵgrid_privatey;
exports.ɵgrid_privatec = grid.ɵgrid_privatec;
exports.ɵgrid_privateb = grid.ɵgrid_privateb;
exports.ɵgrid_privatea = grid.ɵgrid_privatea;
exports.ɵgrid_privatebd = grid.ɵgrid_privatebd;
exports.ɵgrid_privatebc = grid.ɵgrid_privatebc;
exports.ɵgrid_privatebb = grid.ɵgrid_privatebb;
exports.ɵgrid_privatebg = grid.ɵgrid_privatebg;
exports.ɵgrid_privatebf = grid.ɵgrid_privatebf;
exports.ɵgrid_privatebe = grid.ɵgrid_privatebe;
exports.GridModule = grid.GridModule;
exports.VERSION = VERSION;
exports.FlexLayoutModule = FlexLayoutModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout.umd.js.map
