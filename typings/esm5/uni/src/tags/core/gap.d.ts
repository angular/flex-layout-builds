/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Direction } from '@angular/cdk/bidi';
import { Tag, ValuePriority } from '../tag';
export declare class Gap extends Tag {
    readonly tag = "gap";
    readonly deps: string[];
    build(input: string, _: string, __: Direction): Map<string, ValuePriority>;
}
