/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Renderer2 } from '@angular/core';
/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export declare type StyleDefinition = string | {
    [property: string]: string | number | null;
};
/**
 * Applies styles given via string pair or object map to the directive element.
 */
export declare function applyStyleToElement(renderer: Renderer2, element: any, style: StyleDefinition, value?: string | number): void;
/**
 * Applies styles given via string pair or object map to the directive's element.
 */
export declare function applyStyleToElements(renderer: Renderer2, style: StyleDefinition, elements: HTMLElement[]): void;
/**
 * Applies the styles to the element. The styles object map may contain an array of values.
 * Each value will be added as element style.
 * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones.
 */
export declare function applyMultiValueStyleToElement(styles: {}, element: any, renderer: Renderer2): void;
/**
 * Find the DOM element's raw attribute value (if any)
 */
export declare function lookupAttributeValue(element: HTMLElement, attribute: string): string;
/**
 * Find the DOM element's inline style value (if any)
 */
export declare function lookupInlineStyle(element: HTMLElement, styleName: string): string;
/**
 * Determine the inline or inherited CSS style
 * @TODO(CaerusKaru): platform-server has no implementation for getComputedStyle
 */
export declare function lookupStyle(_platformId: Object, element: HTMLElement, styleName: string, inlineOnly?: boolean): string;
