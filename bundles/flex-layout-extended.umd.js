/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/flex-layout/core'), require('@angular/cdk/coercion'), require('rxjs/operators'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define('@angular/flex-layout/extended', ['exports', '@angular/core', '@angular/common', '@angular/flex-layout/core', '@angular/cdk/coercion', 'rxjs/operators', '@angular/platform-browser'], factory) :
	(factory((global.ng = global.ng || {}, global.ng['flex-layout'] = global.ng['flex-layout'] || {}, global.ng['flex-layout'].extended = {}),global.ng.core,global.ng.common,global.ng.flexLayout.core,global.ng.cdk.coercion,global.rxjs.operators,global.ng.platformBrowser));
}(this, (function (exports,core,common,core$1,coercion,operators,platformBrowser) { 'use strict';

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ImgSrcStyleBuilder = /** @class */ (function (_super) {
    __extends(ImgSrcStyleBuilder, _super);
    function ImgSrcStyleBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    ImgSrcStyleBuilder.prototype.buildStyles = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        return { 'content': url ? "url(" + url + ")" : '' };
    };
    ImgSrcStyleBuilder.decorators = [
        { type: core.Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */ ImgSrcStyleBuilder.ngInjectableDef = core.defineInjectable({ factory: function ImgSrcStyleBuilder_Factory() { return new ImgSrcStyleBuilder(); }, token: ImgSrcStyleBuilder, providedIn: "root" });
    return ImgSrcStyleBuilder;
}(core$1.StyleBuilder));
var ImgSrcDirective = /** @class */ (function (_super) {
    __extends(ImgSrcDirective, _super);
    function ImgSrcDirective(elementRef, styleBuilder, styler, marshal, platformId, serverModuleLoaded) {
        var _this = _super.call(this, elementRef, styleBuilder, styler, marshal) || this;
        _this.elementRef = elementRef;
        _this.styleBuilder = styleBuilder;
        _this.styler = styler;
        _this.marshal = marshal;
        _this.platformId = platformId;
        _this.serverModuleLoaded = serverModuleLoaded;
        _this.DIRECTIVE_KEY = 'img-src';
        _this.defaultSrc = '';
        _this.styleCache = imgSrcCache;
        _this.marshal.init(_this.elementRef.nativeElement, _this.DIRECTIVE_KEY, _this.updateSrcFor.bind(_this));
        _this.setValue('', _this.nativeElement.getAttribute('src') || '');
        if (common.isPlatformServer(_this.platformId) && _this.serverModuleLoaded) {
            _this.nativeElement.setAttribute('src', '');
        }
        return _this;
    }
    Object.defineProperty(ImgSrcDirective.prototype, "src", {
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this.defaultSrc = val;
            this.setValue('', this.defaultSrc);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     */
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     * @return {?}
     */
    ImgSrcDirective.prototype.updateSrcFor = /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     * @return {?}
     */
    function () {
        /** @type {?} */
        var url = this.activatedValue || this.defaultSrc;
        if (common.isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.addStyles(url);
        }
        else {
            this.nativeElement.setAttribute('src', String(url));
        }
    };
    /** @nocollapse */
    ImgSrcDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: ImgSrcStyleBuilder },
        { type: core$1.StyleUtils },
        { type: core$1.MediaMarshaller },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
        { type: Boolean, decorators: [{ type: core.Inject, args: [core$1.SERVER_TOKEN,] }] }
    ]; };
    ImgSrcDirective.propDecorators = {
        src: [{ type: core.Input, args: ['src',] }]
    };
    return ImgSrcDirective;
}(core$1.BaseDirective2));
/** @type {?} */
var imgSrcCache = new Map();
/** @type {?} */
var inputs = [
    'src.xs', 'src.sm', 'src.md', 'src.lg', 'src.xl',
    'src.lt-sm', 'src.lt-md', 'src.lt-lg', 'src.lt-xl',
    'src.gt-xs', 'src.gt-sm', 'src.gt-md', 'src.gt-lg'
];
/** @type {?} */
var selector = "\n  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],\n  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],\n  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]\n";
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
var DefaultImgSrcDirective = /** @class */ (function (_super) {
    __extends(DefaultImgSrcDirective, _super);
    function DefaultImgSrcDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputs = inputs;
        return _this;
    }
    DefaultImgSrcDirective.decorators = [
        { type: core.Directive, args: [{ selector: selector, inputs: inputs },] },
    ];
    return DefaultImgSrcDirective;
}(ImgSrcDirective));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ClassDirective = /** @class */ (function (_super) {
    __extends(ClassDirective, _super);
    function ClassDirective(elementRef, styler, marshal, iterableDiffers, keyValueDiffers, renderer, ngClassInstance) {
        var _this = _super.call(this, elementRef, /** @type {?} */ ((null)), styler, marshal) || this;
        _this.elementRef = elementRef;
        _this.styler = styler;
        _this.marshal = marshal;
        _this.iterableDiffers = iterableDiffers;
        _this.keyValueDiffers = keyValueDiffers;
        _this.renderer = renderer;
        _this.ngClassInstance = ngClassInstance;
        _this.DIRECTIVE_KEY = 'ngClass';
        if (!_this.ngClassInstance) {
            // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
            // the same host element; since the responsive variations may be defined...
            _this.ngClassInstance = new common.NgClass(_this.iterableDiffers, _this.keyValueDiffers, _this.elementRef, _this.renderer);
        }
        _this.marshal.init(_this.nativeElement, _this.DIRECTIVE_KEY, _this.updateWithValue.bind(_this));
        return _this;
    }
    Object.defineProperty(ClassDirective.prototype, "klass", {
        /**
         * Capture class assignments so we cache the default classes
         * which are merged with activated styles and used as fallbacks.
         */
        set: /**
         * Capture class assignments so we cache the default classes
         * which are merged with activated styles and used as fallbacks.
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this.ngClassInstance.klass = val;
            this.setValue(val, '');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @return {?}
     */
    ClassDirective.prototype.updateWithValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.ngClassInstance.ngClass = value;
        this.ngClassInstance.ngDoCheck();
    };
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     */
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    ClassDirective.prototype.ngDoCheck = /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    function () {
        this.ngClassInstance.ngDoCheck();
    };
    /** @nocollapse */
    ClassDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core$1.StyleUtils },
        { type: core$1.MediaMarshaller },
        { type: core.IterableDiffers },
        { type: core.KeyValueDiffers },
        { type: core.Renderer2 },
        { type: common.NgClass, decorators: [{ type: core.Optional }, { type: core.Self }] }
    ]; };
    ClassDirective.propDecorators = {
        klass: [{ type: core.Input, args: ['class',] }]
    };
    return ClassDirective;
}(core$1.BaseDirective2));
/** @type {?} */
var inputs$1 = [
    'ngClass', 'ngClass.xs', 'ngClass.sm', 'ngClass.md', 'ngClass.lg', 'ngClass.xl',
    'ngClass.lt-sm', 'ngClass.lt-md', 'ngClass.lt-lg', 'ngClass.lt-xl',
    'ngClass.gt-xs', 'ngClass.gt-sm', 'ngClass.gt-md', 'ngClass.gt-lg'
];
/** @type {?} */
var selector$1 = "\n  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],\n  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],\n  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]\n";
/**
 * Directive to add responsive support for ngClass.
 * This maintains the core functionality of 'ngClass' and adds responsive API
 * Note: this class is a no-op when rendered on the server
 */
var DefaultClassDirective = /** @class */ (function (_super) {
    __extends(DefaultClassDirective, _super);
    function DefaultClassDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputs = inputs$1;
        return _this;
    }
    DefaultClassDirective.decorators = [
        { type: core.Directive, args: [{ selector: selector$1, inputs: inputs$1 },] },
    ];
    return DefaultClassDirective;
}(ClassDirective));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ShowHideStyleBuilder = /** @class */ (function (_super) {
    __extends(ShowHideStyleBuilder, _super);
    function ShowHideStyleBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} show
     * @param {?} parent
     * @return {?}
     */
    ShowHideStyleBuilder.prototype.buildStyles = /**
     * @param {?} show
     * @param {?} parent
     * @return {?}
     */
    function (show, parent) {
        /** @type {?} */
        var shouldShow = show === 'true';
        return { 'display': shouldShow ? parent.display : 'none' };
    };
    ShowHideStyleBuilder.decorators = [
        { type: core.Injectable, args: [{ providedIn: 'root' },] },
    ];
    /** @nocollapse */ ShowHideStyleBuilder.ngInjectableDef = core.defineInjectable({ factory: function ShowHideStyleBuilder_Factory() { return new ShowHideStyleBuilder(); }, token: ShowHideStyleBuilder, providedIn: "root" });
    return ShowHideStyleBuilder;
}(core$1.StyleBuilder));
var ShowHideDirective = /** @class */ (function (_super) {
    __extends(ShowHideDirective, _super);
    function ShowHideDirective(elementRef, styleBuilder, styler, marshal, layoutConfig, platformId, serverModuleLoaded) {
        var _this = _super.call(this, elementRef, styleBuilder, styler, marshal) || this;
        _this.elementRef = elementRef;
        _this.styleBuilder = styleBuilder;
        _this.styler = styler;
        _this.marshal = marshal;
        _this.layoutConfig = layoutConfig;
        _this.platformId = platformId;
        _this.serverModuleLoaded = serverModuleLoaded;
        _this.DIRECTIVE_KEY = 'show-hide';
        /**
         * Original dom Elements CSS display style
         */
        _this.display = '';
        _this.hasLayout = false;
        _this.hasFlexChild = false;
        return _this;
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    /**
     * @return {?}
     */
    ShowHideDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');
        this.marshal.trackValue(this.nativeElement, 'layout')
            .pipe(operators.takeUntil(this.destroySubject))
            .subscribe(this.updateWithValue.bind(this));
        /** @type {?} */
        var children = Array.from(this.nativeElement.children);
        for (var i = 0; i < children.length; i++) {
            if (this.marshal.hasValue(/** @type {?} */ (children[i]), 'flex')) {
                this.hasFlexChild = true;
                break;
            }
        }
        if (DISPLAY_MAP.has(this.nativeElement)) {
            this.display = /** @type {?} */ ((DISPLAY_MAP.get(this.nativeElement)));
        }
        else {
            this.display = this.getDisplayStyle();
            DISPLAY_MAP.set(this.nativeElement, this.display);
        }
        this.marshal.init(this.elementRef.nativeElement, this.DIRECTIVE_KEY, this.updateWithValue.bind(this));
        /** @type {?} */
        var defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
        if (defaultValue === undefined || defaultValue === '') {
            this.setValue(true, '');
        }
        else {
            this.triggerUpdate();
        }
    };
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    /**
     * On changes to any \@Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     * @param {?} changes
     * @return {?}
     */
    ShowHideDirective.prototype.ngOnChanges = /**
     * On changes to any \@Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        Object.keys(changes).forEach(function (key) {
            if (_this.inputs.indexOf(key) !== -1) {
                /** @type {?} */
                var inputKey = key.split('.');
                /** @type {?} */
                var bp = inputKey.slice(1).join('.');
                /** @type {?} */
                var inputValue = changes[key].currentValue;
                /** @type {?} */
                var shouldShow = inputValue !== '' ?
                    inputValue !== 0 ? coercion.coerceBooleanProperty(inputValue) : false
                    : true;
                if (inputKey[0] === 'fxHide') {
                    shouldShow = !shouldShow;
                }
                _this.setValue(shouldShow, bp);
            }
        });
    };
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     */
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     * @return {?}
     */
    ShowHideDirective.prototype.getDisplayStyle = /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     * @return {?}
     */
    function () {
        return (this.hasLayout || (this.hasFlexChild && this.layoutConfig.addFlexToParent)) ?
            'flex' : this.styler.lookupStyle(this.nativeElement, 'display', true);
    };
    /** Validate the visibility value and then update the host's inline display style */
    /**
     * Validate the visibility value and then update the host's inline display style
     * @param {?=} value
     * @return {?}
     */
    ShowHideDirective.prototype.updateWithValue = /**
     * Validate the visibility value and then update the host's inline display style
     * @param {?=} value
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = true; }
        if (value === '') {
            return;
        }
        this.addStyles(value ? 'true' : 'false', { display: this.display });
        if (common.isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.nativeElement.style.setProperty('display', '');
        }
    };
    /** @nocollapse */
    ShowHideDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: ShowHideStyleBuilder },
        { type: core$1.StyleUtils },
        { type: core$1.MediaMarshaller },
        { type: undefined, decorators: [{ type: core.Inject, args: [core$1.LAYOUT_CONFIG,] }] },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
        { type: Boolean, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core$1.SERVER_TOKEN,] }] }
    ]; };
    return ShowHideDirective;
}(core$1.BaseDirective2));
/** @type {?} */
var DISPLAY_MAP = new WeakMap();
/** @type {?} */
var inputs$2 = [
    'fxShow',
    'fxShow.xs', 'fxShow.sm', 'fxShow.md', 'fxShow.lg', 'fxShow.xl',
    'fxShow.lt-sm', 'fxShow.lt-md', 'fxShow.lt-lg', 'fxShow.lt-xl',
    'fxShow.gt-xs', 'fxShow.gt-sm', 'fxShow.gt-md', 'fxShow.gt-lg',
    'fxHide',
    'fxHide.xs', 'fxHide.sm', 'fxHide.md', 'fxHide.lg', 'fxHide.xl',
    'fxHide.lt-sm', 'fxHide.lt-md', 'fxHide.lt-lg', 'fxHide.lt-xl',
    'fxHide.gt-xs', 'fxHide.gt-sm', 'fxHide.gt-md', 'fxHide.gt-lg'
];
/** @type {?} */
var selector$2 = "\n  [fxShow],\n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],\n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide],\n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],\n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n";
/**
 * 'show' Layout API directive
 */
var DefaultShowHideDirective = /** @class */ (function (_super) {
    __extends(DefaultShowHideDirective, _super);
    function DefaultShowHideDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputs = inputs$2;
        return _this;
    }
    DefaultShowHideDirective.decorators = [
        { type: core.Directive, args: [{ selector: selector$2, inputs: inputs$2 },] },
    ];
    return DefaultShowHideDirective;
}(ShowHideDirective));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * NgStyle allowed inputs
 */
var /**
 * NgStyle allowed inputs
 */
NgStyleKeyValue = /** @class */ (function () {
    function NgStyleKeyValue(key, value, noQuotes) {
        if (noQuotes === void 0) { noQuotes = true; }
        this.key = key;
        this.value = value;
        this.key = noQuotes ? key.replace(/['"]/g, '').trim() : key.trim();
        this.value = noQuotes ? value.replace(/['"]/g, '').trim() : value.trim();
        this.value = this.value.replace(/;/, '');
    }
    return NgStyleKeyValue;
}());
/**
 * @param {?} target
 * @return {?}
 */
function getType(target) {
    /** @type {?} */
    var what = typeof target;
    if (what === 'object') {
        return (target.constructor === Array) ? 'array' :
            (target.constructor === Set) ? 'set' : 'object';
    }
    return what;
}
/**
 * Split string of key:value pairs into Array of k-v pairs
 * e.g.  'key:value; key:value; key:value;' -> ['key:value',...]
 * @param {?} source
 * @param {?=} delimiter
 * @return {?}
 */
function buildRawList(source, delimiter) {
    if (delimiter === void 0) { delimiter = ';'; }
    return String(source)
        .trim()
        .split(delimiter)
        .map(function (val) { return val.trim(); })
        .filter(function (val) { return val !== ''; });
}
/**
 * Convert array of key:value strings to a iterable map object
 * @param {?} styles
 * @param {?=} sanitize
 * @return {?}
 */
function buildMapFromList(styles, sanitize) {
    /** @type {?} */
    var sanitizeValue = function (it) {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(function (entry) { return !!entry; })
        .map(sanitizeValue)
        .reduce(keyValuesToMap, /** @type {?} */ ({}));
}
/**
 * Convert Set<string> or raw Object to an iterable NgStyleMap
 * @param {?} source
 * @param {?=} sanitize
 * @return {?}
 */
function buildMapFromSet(source, sanitize) {
    /** @type {?} */
    var list = [];
    if (getType(source) === 'set') {
        (/** @type {?} */ (source)).forEach(function (entry) { return list.push(entry); });
    }
    else {
        Object.keys(source).forEach(function (key) {
            list.push(key + ":" + ((/** @type {?} */ (source)))[key]);
        });
    }
    return buildMapFromList(list, sanitize);
}
/**
 * Convert 'key:value' -> [key, value]
 * @param {?} it
 * @return {?}
 */
function stringToKeyValue(it) {
    var _a = it.split(':'), key = _a[0], val = _a[1];
    return new NgStyleKeyValue(key, val);
}
/**
 * Convert [ [key,value] ] -> { key : value }
 * @param {?} map
 * @param {?} entry
 * @return {?}
 */
function keyValuesToMap(map, entry) {
    if (!!entry.key) {
        map[entry.key] = entry.value;
    }
    return map;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var StyleDirective = /** @class */ (function (_super) {
    __extends(StyleDirective, _super);
    function StyleDirective(elementRef, styler, marshal, keyValueDiffers, renderer, sanitizer, ngStyleInstance) {
        var _this = _super.call(this, elementRef, /** @type {?} */ ((null)), styler, marshal) || this;
        _this.elementRef = elementRef;
        _this.styler = styler;
        _this.marshal = marshal;
        _this.keyValueDiffers = keyValueDiffers;
        _this.renderer = renderer;
        _this.sanitizer = sanitizer;
        _this.ngStyleInstance = ngStyleInstance;
        _this.DIRECTIVE_KEY = 'ngStyle';
        if (!_this.ngStyleInstance) {
            // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been
            // defined on the same host element; since the responsive variations may be defined...
            _this.ngStyleInstance = new common.NgStyle(_this.keyValueDiffers, _this.elementRef, _this.renderer);
        }
        _this.marshal.init(_this.nativeElement, _this.DIRECTIVE_KEY, _this.updateWithValue.bind(_this));
        _this.setValue(_this.nativeElement.getAttribute('style') || '', '');
        return _this;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    StyleDirective.prototype.updateWithValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        /** @type {?} */
        var styles = this.buildStyleMap(value);
        /** @type {?} */
        var defaultStyles = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
        /** @type {?} */
        var fallback = this.buildStyleMap(defaultStyles);
        this.ngStyleInstance.ngStyle = __assign({}, fallback, styles);
        this.ngStyleInstance.ngDoCheck();
    };
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     */
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     * @param {?} styles
     * @return {?}
     */
    StyleDirective.prototype.buildStyleMap = /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     * @param {?} styles
     * @return {?}
     */
    function (styles) {
        var _this = this;
        /** @type {?} */
        var sanitizer = function (val) {
            return _this.sanitizer.sanitize(core.SecurityContext.STYLE, val) || '';
        };
        if (styles) {
            switch (getType(styles)) {
                case 'string': return buildMapFromList$1(buildRawList(styles), sanitizer);
                case 'array': return buildMapFromList$1(/** @type {?} */ (styles), sanitizer);
                case 'set': return buildMapFromSet(styles, sanitizer);
                default: return buildMapFromSet(styles, sanitizer);
            }
        }
        return {};
    };
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /** For ChangeDetectionStrategy.onPush and ngOnChanges() updates */
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    StyleDirective.prototype.ngDoCheck = /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     * @return {?}
     */
    function () {
        this.ngStyleInstance.ngDoCheck();
    };
    /** @nocollapse */
    StyleDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core$1.StyleUtils },
        { type: core$1.MediaMarshaller },
        { type: core.KeyValueDiffers },
        { type: core.Renderer2 },
        { type: platformBrowser.DomSanitizer },
        { type: common.NgStyle, decorators: [{ type: core.Optional }, { type: core.Self }] }
    ]; };
    return StyleDirective;
}(core$1.BaseDirective2));
/** @type {?} */
var inputs$3 = [
    'ngStyle',
    'ngStyle.xs', 'ngStyle.sm', 'ngStyle.md', 'ngStyle.lg', 'ngStyle.xl',
    'ngStyle.lt-sm', 'ngStyle.lt-md', 'ngStyle.lt-lg', 'ngStyle.lt-xl',
    'ngStyle.gt-xs', 'ngStyle.gt-sm', 'ngStyle.gt-md', 'ngStyle.gt-lg'
];
/** @type {?} */
var selector$3 = "\n  [ngStyle],\n  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],\n  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],\n  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]\n";
/**
 * Directive to add responsive support for ngStyle.
 *
 */
var DefaultStyleDirective = /** @class */ (function (_super) {
    __extends(DefaultStyleDirective, _super);
    function DefaultStyleDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputs = inputs$3;
        return _this;
    }
    DefaultStyleDirective.decorators = [
        { type: core.Directive, args: [{ selector: selector$3, inputs: inputs$3 },] },
    ];
    return DefaultStyleDirective;
}(StyleDirective));
/**
 * Build a styles map from a list of styles, while sanitizing bad values first
 * @param {?} styles
 * @param {?=} sanitize
 * @return {?}
 */
function buildMapFromList$1(styles, sanitize) {
    /** @type {?} */
    var sanitizeValue = function (it) {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter(function (entry) { return !!entry; })
        .map(sanitizeValue)
        .reduce(keyValuesToMap, /** @type {?} */ ({}));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var ALL_DIRECTIVES = [
    DefaultShowHideDirective,
    DefaultClassDirective,
    DefaultStyleDirective,
    DefaultImgSrcDirective
];
/**
 * *****************************************************************
 * Define module for the Extended API
 * *****************************************************************
 */
var ExtendedModule = /** @class */ (function () {
    function ExtendedModule() {
    }
    ExtendedModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [core$1.CoreModule],
                    declarations: ALL_DIRECTIVES.slice(),
                    exports: ALL_DIRECTIVES.slice()
                },] },
    ];
    return ExtendedModule;
}());

exports.ExtendedModule = ExtendedModule;
exports.ClassDirective = ClassDirective;
exports.DefaultClassDirective = DefaultClassDirective;
exports.ImgSrcStyleBuilder = ImgSrcStyleBuilder;
exports.ImgSrcDirective = ImgSrcDirective;
exports.DefaultImgSrcDirective = DefaultImgSrcDirective;
exports.ShowHideStyleBuilder = ShowHideStyleBuilder;
exports.ShowHideDirective = ShowHideDirective;
exports.DefaultShowHideDirective = DefaultShowHideDirective;
exports.StyleDirective = StyleDirective;
exports.DefaultStyleDirective = DefaultStyleDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flex-layout-extended.umd.js.map
