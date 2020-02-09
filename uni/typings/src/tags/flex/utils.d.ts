/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare const INLINE = "inline";
export declare const LAYOUT_VALUES: string[];
/** Convert layout-wrap='<value>' to expected flex-wrap style */
export declare function validateWrapValue(value: string): string;
/**
 * Validate the value to be one of the acceptable value options
 * Use default fallback of 'row'
 */
export declare function validateValue(value: string): [string, string, boolean];
/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 */
export declare function isFlowHorizontal(value: string): boolean;
