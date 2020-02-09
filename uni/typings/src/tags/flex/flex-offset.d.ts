/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Direction } from '@angular/cdk/bidi';
import { Tag, ValuePriority } from '../tag';
export declare class FlexOffset extends Tag {
    readonly tag = "flexOffset";
    readonly deps: string[];
    build(input: string, layout: string, direction: Direction): Map<string, ValuePriority>;
}
