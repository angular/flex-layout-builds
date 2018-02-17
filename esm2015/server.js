/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { BREAKPOINTS, CLASS_NAME, MatchMedia, SERVER_TOKEN, ServerMatchMedia, ServerStylesheet } from '@angular/flex-layout';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
let nextId = 0;
const IS_DEBUG_MODE = false;
/**
 * create \@media queries based on a virtual stylesheet
 * * Adds a unique class to each element and stores it
 *   in a shared classMap for later reuse
 * @param {?} stylesheet the virtual stylesheet that stores styles for each
 *        element
 * @param {?} mediaQuery the given \@media CSS selector for the current breakpoint
 * @param {?} classMap the map of HTML elements to class names to avoid duplications
 * @return {?}
 */
function generateCss(stylesheet, mediaQuery, classMap) {
    let /** @type {?} */ styleText = IS_DEBUG_MODE ? `
        @media ${mediaQuery} {` : `@media ${mediaQuery}{`;
    stylesheet.forEach((styles, el) => {
        let /** @type {?} */ className = classMap.get(el);
        if (!className) {
            className = `${CLASS_NAME}${nextId++}`;
            classMap.set(el, className);
        }
        el.classList.add(className);
        styleText += IS_DEBUG_MODE ? `
          .${className} {` : `.${className}{`;
        styles.forEach((v, k) => {
            if (v) {
                styleText += IS_DEBUG_MODE ? `
              ${k}: ${v};` : `${k}:${v};`;
            }
        });
        styleText += IS_DEBUG_MODE ? `
          }` : '}';
    });
    styleText += IS_DEBUG_MODE ? `
        }\n` : '}';
    return styleText;
}
/**
 * Activate all of the registered breakpoints in sequence, and then
 * retrieve the associated stylings from the virtual stylesheet
 * @param {?} serverSheet the virtual stylesheet that stores styles for each
 *        element
 * @param {?} matchMedia the service to activate/deactive breakpoints
 * @param {?} breakpoints the registered breakpoints to activate/deactivate
 * @return {?}
 */
function generateStaticFlexLayoutStyles(serverSheet, matchMedia, breakpoints) {
    // Store the custom classes in the following map, that way only
    // one class gets allocated per HTMLElement, and each class can
    // be referenced in the static media queries
    const /** @type {?} */ classMap = new Map();
    // Get the initial stylings for all of the directives, and initialize
    // the fallback block of stylings, then reverse the breakpoints list
    // to traverse in the proper order
    const /** @type {?} */ defaultStyles = new Map(serverSheet.stylesheet);
    let /** @type {?} */ styleText = generateCss(defaultStyles, 'all', classMap);
    breakpoints.reverse();
    breakpoints.forEach((bp, i) => {
        serverSheet.clearStyles();
        (/** @type {?} */ (matchMedia)).activateBreakpoint(bp);
        const /** @type {?} */ stylesheet = new Map(serverSheet.stylesheet);
        if (stylesheet.size > 0) {
            styleText += generateCss(stylesheet, bp.mediaQuery, classMap);
        }
        (/** @type {?} */ (matchMedia)).deactivateBreakpoint(breakpoints[i]);
    });
    return styleText;
}
/**
 * Create a style tag populated with the dynamic stylings from Flex
 * components and attach it to the head of the DOM
 * @param {?} serverSheet
 * @param {?} matchMedia
 * @param {?} _document
 * @param {?} breakpoints
 * @return {?}
 */
function FLEX_SSR_SERIALIZER_FACTORY(serverSheet, matchMedia, _document, breakpoints) {
    return () => {
        // This is the style tag that gets inserted into the head of the DOM,
        // populated with the manual media queries
        const /** @type {?} */ styleTag = _document.createElement('style');
        const /** @type {?} */ styleText = generateStaticFlexLayoutStyles(serverSheet, matchMedia, breakpoints);
        styleTag.classList.add(`${CLASS_NAME}ssr`);
        styleTag.textContent = styleText;
        _document.head.appendChild(styleTag);
    };
}
/**
 *  Provider to set static styles on the server
 */
const SERVER_PROVIDERS = [
    {
        provide: /** @type {?} */ (BEFORE_APP_SERIALIZED),
        useFactory: FLEX_SSR_SERIALIZER_FACTORY,
        deps: [
            ServerStylesheet,
            MatchMedia,
            DOCUMENT,
            BREAKPOINTS,
        ],
        multi: true
    },
    {
        provide: SERVER_TOKEN,
        useValue: true
    },
    {
        provide: MatchMedia,
        useClass: ServerMatchMedia
    }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlexLayoutServerModule {
}
FlexLayoutServerModule.decorators = [
    { type: NgModule, args: [{
                providers: [SERVER_PROVIDERS]
            },] },
];
/** @nocollapse */
FlexLayoutServerModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { FlexLayoutServerModule, generateStaticFlexLayoutStyles, FLEX_SSR_SERIALIZER_FACTORY, SERVER_PROVIDERS };
//# sourceMappingURL=server.js.map
