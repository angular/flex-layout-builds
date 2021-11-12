/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MediaChange } from './media-change';
/**
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function mergeAlias(dest, source) {
    dest = dest ? dest.clone() : new MediaChange();
    if (source) {
        dest.mqAlias = source.alias;
        dest.mediaQuery = source.mediaQuery;
        dest.suffix = source.suffix;
        dest.priority = source.priority;
    }
    return dest;
}
//# sourceMappingURL=add-alias.js.map