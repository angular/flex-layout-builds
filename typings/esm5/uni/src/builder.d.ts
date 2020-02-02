/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UnifiedDirective } from './unified';
export interface ValuePriority {
    value: string;
    priority: number;
}
export declare type Builder = (value: string, parent?: UnifiedDirective) => Map<string, ValuePriority>;
