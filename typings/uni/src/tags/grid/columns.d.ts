/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tag, ValuePriority } from '../tag';
export declare class Columns extends Tag {
    readonly tag = "columns";
    build(input: string): Map<string, ValuePriority>;
}
