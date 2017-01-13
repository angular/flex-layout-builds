import { extendObject } from './object-extend';
/**
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function mergeAlias(dest, source) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/utils/add-alias.js.map