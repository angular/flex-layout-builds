/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tag, ValuePriority } from '../tag';
export declare class Flex extends Tag {
    readonly tag = "flex";
    readonly deps: string[];
    build(input: string, layout: string): Map<string, ValuePriority>;
}
