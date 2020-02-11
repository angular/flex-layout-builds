/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Tag, ValuePriority } from '../tag';
export declare class Layout extends Tag {
    readonly tag = "layout";
    build(input: string): Map<string, ValuePriority>;
}
