/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { Builder } from './builder';
export interface Tag {
    tag: string;
    builder: Builder;
}
export declare const DEFAULT_TAGS: Tag[];
export declare const LAYOUT_TAGS: InjectionToken<Tag[][]>;
export declare const TAGS: InjectionToken<Map<string, Builder>>;
