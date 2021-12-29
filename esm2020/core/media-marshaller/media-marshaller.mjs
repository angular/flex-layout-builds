/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { sortDescendingPriority } from '../utils/sort';
import { mergeAlias } from '../add-alias';
import * as i0 from "@angular/core";
import * as i1 from "../match-media/match-media";
import * as i2 from "../breakpoints/break-point-registry";
import * as i3 from "./print-hook";
/**
 * MediaMarshaller - register responsive values from directives and
 *                   trigger them based on media query events
 */
export class MediaMarshaller {
    constructor(matchMedia, breakpoints, hook) {
        this.matchMedia = matchMedia;
        this.breakpoints = breakpoints;
        this.hook = hook;
        this._useFallbacks = true;
        this._activatedBreakpoints = [];
        this.elementMap = new Map();
        this.elementKeyMap = new WeakMap();
        this.watcherMap = new WeakMap(); // special triggers to update elements
        this.updateMap = new WeakMap(); // callback functions to update styles
        this.clearMap = new WeakMap(); // callback functions to clear styles
        this.subject = new Subject();
        this.observeActivations();
    }
    get activatedAlias() {
        return this.activatedBreakpoints[0]?.alias ?? '';
    }
    set activatedBreakpoints(bps) {
        this._activatedBreakpoints = [...bps];
    }
    get activatedBreakpoints() {
        return [...this._activatedBreakpoints];
    }
    set useFallbacks(value) {
        this._useFallbacks = value;
    }
    /**
     * Update styles on breakpoint activates or deactivates
     * @param mc
     */
    onMediaChange(mc) {
        const bp = this.findByQuery(mc.mediaQuery);
        if (bp) {
            mc = mergeAlias(mc, bp);
            const bpIndex = this.activatedBreakpoints.indexOf(bp);
            if (mc.matches && bpIndex === -1) {
                this._activatedBreakpoints.push(bp);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
            else if (!mc.matches && bpIndex !== -1) {
                // Remove the breakpoint when it's deactivated
                this._activatedBreakpoints.splice(bpIndex, 1);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
        }
    }
    /**
     * initialize the marshaller with necessary elements for delegation on an element
     * @param element
     * @param key
     * @param updateFn optional callback so that custom bp directives don't have to re-provide this
     * @param clearFn optional callback so that custom bp directives don't have to re-provide this
     * @param extraTriggers other triggers to force style updates (e.g. layout, directionality, etc)
     */
    init(element, key, updateFn, clearFn, extraTriggers = []) {
        initBuilderMap(this.updateMap, element, key, updateFn);
        initBuilderMap(this.clearMap, element, key, clearFn);
        this.buildElementKeyMap(element, key);
        this.watchExtraTriggers(element, key, extraTriggers);
    }
    /**
     * get the value for an element and key and optionally a given breakpoint
     * @param element
     * @param key
     * @param bp
     */
    getValue(element, key, bp) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = bp !== undefined ? bpMap.get(bp) : this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key);
            }
        }
        return undefined;
    }
    /**
     * whether the element has values for a given key
     * @param element
     * @param key
     */
    hasValue(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key) !== undefined || false;
            }
        }
        return false;
    }
    /**
     * Set the value for an input on a directive
     * @param element the element in question
     * @param key the type of the directive (e.g. flex, layout-gap, etc)
     * @param bp the breakpoint suffix (empty string = default)
     * @param val the value for the breakpoint
     */
    setValue(element, key, val, bp) {
        let bpMap = this.elementMap.get(element);
        if (!bpMap) {
            bpMap = new Map().set(bp, new Map().set(key, val));
            this.elementMap.set(element, bpMap);
        }
        else {
            const values = (bpMap.get(bp) ?? new Map()).set(key, val);
            bpMap.set(bp, values);
            this.elementMap.set(element, bpMap);
        }
        const value = this.getValue(element, key);
        if (value !== undefined) {
            this.updateElement(element, key, value);
        }
    }
    /** Track element value changes for a specific key */
    trackValue(element, key) {
        return this.subject
            .asObservable()
            .pipe(filter(v => v.element === element && v.key === key));
    }
    /** update all styles for all elements on the current breakpoint */
    updateStyles() {
        this.elementMap.forEach((bpMap, el) => {
            const keyMap = new Set(this.elementKeyMap.get(el));
            let valueMap = this.getActivatedValues(bpMap);
            if (valueMap) {
                valueMap.forEach((v, k) => {
                    this.updateElement(el, k, v);
                    keyMap.delete(k);
                });
            }
            keyMap.forEach(k => {
                valueMap = this.getActivatedValues(bpMap, k);
                if (valueMap) {
                    const value = valueMap.get(k);
                    this.updateElement(el, k, value);
                }
                else {
                    this.clearElement(el, k);
                }
            });
        });
    }
    /**
     * clear the styles for a given element
     * @param element
     * @param key
     */
    clearElement(element, key) {
        const builders = this.clearMap.get(element);
        if (builders) {
            const clearFn = builders.get(key);
            if (!!clearFn) {
                clearFn();
                this.subject.next({ element, key, value: '' });
            }
        }
    }
    /**
     * update a given element with the activated values for a given key
     * @param element
     * @param key
     * @param value
     */
    updateElement(element, key, value) {
        const builders = this.updateMap.get(element);
        if (builders) {
            const updateFn = builders.get(key);
            if (!!updateFn) {
                updateFn(value);
                this.subject.next({ element, key, value });
            }
        }
    }
    /**
     * release all references to a given element
     * @param element
     */
    releaseElement(element) {
        const watcherMap = this.watcherMap.get(element);
        if (watcherMap) {
            watcherMap.forEach(s => s.unsubscribe());
            this.watcherMap.delete(element);
        }
        const elementMap = this.elementMap.get(element);
        if (elementMap) {
            elementMap.forEach((_, s) => elementMap.delete(s));
            this.elementMap.delete(element);
        }
    }
    /**
     * trigger an update for a given element and key (e.g. layout)
     * @param element
     * @param key
     */
    triggerUpdate(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const valueMap = this.getActivatedValues(bpMap, key);
            if (valueMap) {
                if (key) {
                    this.updateElement(element, key, valueMap.get(key));
                }
                else {
                    valueMap.forEach((v, k) => this.updateElement(element, k, v));
                }
            }
        }
    }
    /** Cross-reference for HTMLElement with directive key */
    buildElementKeyMap(element, key) {
        let keyMap = this.elementKeyMap.get(element);
        if (!keyMap) {
            keyMap = new Set();
            this.elementKeyMap.set(element, keyMap);
        }
        keyMap.add(key);
    }
    /**
     * Other triggers that should force style updates:
     * - directionality
     * - layout changes
     * - mutationobserver updates
     */
    watchExtraTriggers(element, key, triggers) {
        if (triggers && triggers.length) {
            let watchers = this.watcherMap.get(element);
            if (!watchers) {
                watchers = new Map();
                this.watcherMap.set(element, watchers);
            }
            const subscription = watchers.get(key);
            if (!subscription) {
                const newSubscription = merge(...triggers).subscribe(() => {
                    const currentValue = this.getValue(element, key);
                    this.updateElement(element, key, currentValue);
                });
                watchers.set(key, newSubscription);
            }
        }
    }
    /** Breakpoint locator by mediaQuery */
    findByQuery(query) {
        return this.breakpoints.findByQuery(query);
    }
    /**
     * get the fallback breakpoint for a given element, starting with the current breakpoint
     * @param bpMap
     * @param key
     */
    getActivatedValues(bpMap, key) {
        for (let i = 0; i < this.activatedBreakpoints.length; i++) {
            const activatedBp = this.activatedBreakpoints[i];
            const valueMap = bpMap.get(activatedBp.alias);
            if (valueMap) {
                if (key === undefined || (valueMap.has(key) && valueMap.get(key) != null)) {
                    return valueMap;
                }
            }
        }
        // On the server, we explicitly have an "all" section filled in to begin with.
        // So we don't need to aggressively find a fallback if no explicit value exists.
        if (!this._useFallbacks) {
            return undefined;
        }
        const lastHope = bpMap.get('');
        return (key === undefined || lastHope && lastHope.has(key)) ? lastHope : undefined;
    }
    /**
     * Watch for mediaQuery breakpoint activations
     */
    observeActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        this.matchMedia
            .observe(this.hook.withPrintQuery(queries))
            .pipe(tap(this.hook.interceptEvents(this)), filter(this.hook.blockPropagation()))
            .subscribe(this.onMediaChange.bind(this));
    }
}
MediaMarshaller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaMarshaller, deps: [{ token: i1.MatchMedia }, { token: i2.BreakPointRegistry }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable });
MediaMarshaller.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaMarshaller, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaMarshaller, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.MatchMedia }, { type: i2.BreakPointRegistry }, { type: i3.PrintHook }]; } });
function initBuilderMap(map, element, key, input) {
    if (input !== undefined) {
        const oldMap = map.get(element) ?? new Map();
        oldMap.set(key, input);
        map.set(element, oldMap);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWFyc2hhbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU1yRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQW9CeEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGVBQWU7SUEyQjFCLFlBQXNCLFVBQXNCLEVBQ3RCLFdBQStCLEVBQy9CLElBQWU7UUFGZixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixTQUFJLEdBQUosSUFBSSxDQUFXO1FBNUI3QixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQiwwQkFBcUIsR0FBaUIsRUFBRSxDQUFDO1FBQ3pDLGVBQVUsR0FBZSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25DLGtCQUFhLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDN0MsZUFBVSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBSyxzQ0FBc0M7UUFDbEYsY0FBUyxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTSxzQ0FBc0M7UUFDbEYsYUFBUSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTyxxQ0FBcUM7UUFFakYsWUFBTyxHQUE0QixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBcUJ2RCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBcEJELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLG9CQUFvQixDQUFDLEdBQWlCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLFlBQVksQ0FBQyxLQUFjO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFRRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsRUFBZTtRQUMzQixNQUFNLEVBQUUsR0FBc0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUQsSUFBSSxFQUFFLEVBQUU7WUFDTixFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUV4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXRELElBQUksRUFBRSxDQUFDLE9BQU8sSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFFeEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3JCO2lCQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDeEMsOENBQThDO2dCQUM5QyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDckI7U0FDRjtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsSUFBSSxDQUFDLE9BQW9CLEVBQ3BCLEdBQVcsRUFDWCxRQUF5QixFQUN6QixPQUF1QixFQUN2QixnQkFBbUMsRUFBRTtRQUV4QyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxRQUFRLENBQUMsT0FBb0IsRUFBRSxHQUFXLEVBQUUsRUFBVztRQUNyRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sTUFBTSxHQUFHLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEYsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxPQUFvQixFQUFFLEdBQVc7UUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksTUFBTSxFQUFFO2dCQUNWLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDO2FBQy9DO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxRQUFRLENBQUMsT0FBb0IsRUFBRSxHQUFXLEVBQUUsR0FBUSxFQUFFLEVBQVU7UUFDOUQsSUFBSSxLQUFLLEdBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNyQzthQUFNO1lBQ0wsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQscURBQXFEO0lBQ3JELFVBQVUsQ0FBQyxPQUFvQixFQUFFLEdBQVc7UUFDMUMsT0FBTyxJQUFJLENBQUMsT0FBTzthQUNkLFlBQVksRUFBRTthQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxZQUFZO1FBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQztZQUNwRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFOUMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUMsQ0FBQzthQUNKO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakIsUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksUUFBUSxFQUFFO29CQUNaLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDbEM7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzFCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsWUFBWSxDQUFDLE9BQW9CLEVBQUUsR0FBVztRQUM1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1QyxJQUFJLFFBQVEsRUFBRTtZQUNaLE1BQU0sT0FBTyxHQUFrQixRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBa0IsQ0FBQztZQUNsRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxhQUFhLENBQUMsT0FBb0IsRUFBRSxHQUFXLEVBQUUsS0FBVTtRQUN6RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFJLFFBQVEsRUFBRTtZQUNaLE1BQU0sUUFBUSxHQUFtQixRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBbUIsQ0FBQztZQUNyRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzthQUMxQztTQUNGO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQztRQUNELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLE9BQW9CLEVBQUUsR0FBWTtRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osSUFBSSxHQUFHLEVBQUU7b0JBQ1AsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDckQ7cUJBQU07b0JBQ0wsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDthQUNGO1NBQ0Y7SUFDSCxDQUFDO0lBRUQseURBQXlEO0lBQ2pELGtCQUFrQixDQUFDLE9BQW9CLEVBQUUsR0FBVztRQUMxRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxrQkFBa0IsQ0FBQyxPQUFvQixFQUNwQixHQUFXLEVBQ1gsUUFBMkI7UUFDcEQsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUMvQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDeEM7WUFDRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2pCLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ3hELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsdUNBQXVDO0lBQy9CLFdBQVcsQ0FBQyxLQUFhO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxrQkFBa0IsQ0FBQyxLQUFvQixFQUFFLEdBQVk7UUFDM0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlDLElBQUksUUFBUSxFQUFFO2dCQUNaLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtvQkFDekUsT0FBTyxRQUFRLENBQUM7aUJBQ2pCO2FBQ0Y7U0FDRjtRQUVELDhFQUE4RTtRQUM5RSxnRkFBZ0Y7UUFDaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNLLGtCQUFrQjtRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLFVBQVU7YUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDMUMsSUFBSSxDQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQ3ZDO2FBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7NEdBaFVVLGVBQWU7Z0hBQWYsZUFBZSxjQURILE1BQU07MkZBQ2xCLGVBQWU7a0JBRDNCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQXFVaEMsU0FBUyxjQUFjLENBQUMsR0FBZSxFQUNmLE9BQW9CLEVBQ3BCLEdBQVcsRUFDWCxLQUFlO0lBQ3JDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0JyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50JztcbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeX0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG5pbXBvcnQge1ByaW50SG9vaywgSG9va1RhcmdldH0gZnJvbSAnLi9wcmludC1ob29rJztcbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcblxudHlwZSBDbGVhckNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgVXBkYXRlQ2FsbGJhY2sgPSAodmFsOiBhbnkpID0+IHZvaWQ7XG50eXBlIEJ1aWxkZXIgPSBVcGRhdGVDYWxsYmFjayB8IENsZWFyQ2FsbGJhY2s7XG5cbnR5cGUgVmFsdWVNYXAgPSBNYXA8c3RyaW5nLCBzdHJpbmc+O1xudHlwZSBCcmVha3BvaW50TWFwID0gTWFwPHN0cmluZywgVmFsdWVNYXA+O1xudHlwZSBFbGVtZW50TWFwID0gTWFwPEhUTUxFbGVtZW50LCBCcmVha3BvaW50TWFwPjtcbnR5cGUgRWxlbWVudEtleU1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFNldDxzdHJpbmc+PjtcbnR5cGUgU3Vic2NyaXB0aW9uTWFwID0gTWFwPHN0cmluZywgU3Vic2NyaXB0aW9uPjtcbnR5cGUgV2F0Y2hlck1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFN1YnNjcmlwdGlvbk1hcD47XG50eXBlIEJ1aWxkZXJNYXAgPSBXZWFrTWFwPEhUTUxFbGVtZW50LCBNYXA8c3RyaW5nLCBCdWlsZGVyPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudE1hdGNoZXIge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbi8qKlxuICogTWVkaWFNYXJzaGFsbGVyIC0gcmVnaXN0ZXIgcmVzcG9uc2l2ZSB2YWx1ZXMgZnJvbSBkaXJlY3RpdmVzIGFuZFxuICogICAgICAgICAgICAgICAgICAgdHJpZ2dlciB0aGVtIGJhc2VkIG9uIG1lZGlhIHF1ZXJ5IGV2ZW50c1xuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNZWRpYU1hcnNoYWxsZXIge1xuICBwcml2YXRlIF91c2VGYWxsYmFja3MgPSB0cnVlO1xuICBwcml2YXRlIF9hY3RpdmF0ZWRCcmVha3BvaW50czogQnJlYWtQb2ludFtdID0gW107XG4gIHByaXZhdGUgZWxlbWVudE1hcDogRWxlbWVudE1hcCA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBlbGVtZW50S2V5TWFwOiBFbGVtZW50S2V5TWFwID0gbmV3IFdlYWtNYXAoKTtcbiAgcHJpdmF0ZSB3YXRjaGVyTWFwOiBXYXRjaGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgIC8vIHNwZWNpYWwgdHJpZ2dlcnMgdG8gdXBkYXRlIGVsZW1lbnRzXG4gIHByaXZhdGUgdXBkYXRlTWFwOiBCdWlsZGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnMgdG8gdXBkYXRlIHN0eWxlc1xuICBwcml2YXRlIGNsZWFyTWFwOiBCdWlsZGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgICAgLy8gY2FsbGJhY2sgZnVuY3Rpb25zIHRvIGNsZWFyIHN0eWxlc1xuXG4gIHByaXZhdGUgc3ViamVjdDogU3ViamVjdDxFbGVtZW50TWF0Y2hlcj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGdldCBhY3RpdmF0ZWRBbGlhcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzWzBdPy5hbGlhcyA/PyAnJztcbiAgfVxuXG4gIHNldCBhY3RpdmF0ZWRCcmVha3BvaW50cyhicHM6IEJyZWFrUG9pbnRbXSkge1xuICAgIHRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzID0gWy4uLmJwc107XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkQnJlYWtwb2ludHMoKTogQnJlYWtQb2ludFtdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzXTtcbiAgfVxuXG4gIHNldCB1c2VGYWxsYmFja3ModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl91c2VGYWxsYmFja3MgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBtYXRjaE1lZGlhOiBNYXRjaE1lZGlhLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRSZWdpc3RyeSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGhvb2s6IFByaW50SG9vaykge1xuICAgIHRoaXMub2JzZXJ2ZUFjdGl2YXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHN0eWxlcyBvbiBicmVha3BvaW50IGFjdGl2YXRlcyBvciBkZWFjdGl2YXRlc1xuICAgKiBAcGFyYW0gbWNcbiAgICovXG4gIG9uTWVkaWFDaGFuZ2UobWM6IE1lZGlhQ2hhbmdlKSB7XG4gICAgY29uc3QgYnA6IEJyZWFrUG9pbnQgfCBudWxsID0gdGhpcy5maW5kQnlRdWVyeShtYy5tZWRpYVF1ZXJ5KTtcblxuICAgIGlmIChicCkge1xuICAgICAgbWMgPSBtZXJnZUFsaWFzKG1jLCBicCk7XG5cbiAgICAgIGNvbnN0IGJwSW5kZXggPSB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLmluZGV4T2YoYnApO1xuXG4gICAgICBpZiAobWMubWF0Y2hlcyAmJiBicEluZGV4ID09PSAtMSkge1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZWRCcmVha3BvaW50cy5wdXNoKGJwKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgICAgfSBlbHNlIGlmICghbWMubWF0Y2hlcyAmJiBicEluZGV4ICE9PSAtMSkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGJyZWFrcG9pbnQgd2hlbiBpdCdzIGRlYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzLnNwbGljZShicEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0aWFsaXplIHRoZSBtYXJzaGFsbGVyIHdpdGggbmVjZXNzYXJ5IGVsZW1lbnRzIGZvciBkZWxlZ2F0aW9uIG9uIGFuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gdXBkYXRlRm4gb3B0aW9uYWwgY2FsbGJhY2sgc28gdGhhdCBjdXN0b20gYnAgZGlyZWN0aXZlcyBkb24ndCBoYXZlIHRvIHJlLXByb3ZpZGUgdGhpc1xuICAgKiBAcGFyYW0gY2xlYXJGbiBvcHRpb25hbCBjYWxsYmFjayBzbyB0aGF0IGN1c3RvbSBicCBkaXJlY3RpdmVzIGRvbid0IGhhdmUgdG8gcmUtcHJvdmlkZSB0aGlzXG4gICAqIEBwYXJhbSBleHRyYVRyaWdnZXJzIG90aGVyIHRyaWdnZXJzIHRvIGZvcmNlIHN0eWxlIHVwZGF0ZXMgKGUuZy4gbGF5b3V0LCBkaXJlY3Rpb25hbGl0eSwgZXRjKVxuICAgKi9cbiAgaW5pdChlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICB1cGRhdGVGbj86IFVwZGF0ZUNhbGxiYWNrLFxuICAgICAgIGNsZWFyRm4/OiBDbGVhckNhbGxiYWNrLFxuICAgICAgIGV4dHJhVHJpZ2dlcnM6IE9ic2VydmFibGU8YW55PltdID0gW10pOiB2b2lkIHtcblxuICAgIGluaXRCdWlsZGVyTWFwKHRoaXMudXBkYXRlTWFwLCBlbGVtZW50LCBrZXksIHVwZGF0ZUZuKTtcbiAgICBpbml0QnVpbGRlck1hcCh0aGlzLmNsZWFyTWFwLCBlbGVtZW50LCBrZXksIGNsZWFyRm4pO1xuXG4gICAgdGhpcy5idWlsZEVsZW1lbnRLZXlNYXAoZWxlbWVudCwga2V5KTtcbiAgICB0aGlzLndhdGNoRXh0cmFUcmlnZ2VycyhlbGVtZW50LCBrZXksIGV4dHJhVHJpZ2dlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgdmFsdWUgZm9yIGFuIGVsZW1lbnQgYW5kIGtleSBhbmQgb3B0aW9uYWxseSBhIGdpdmVuIGJyZWFrcG9pbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gYnBcbiAgICovXG4gIGdldFZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgYnA/OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGJwTWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnBNYXApIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGJwICE9PSB1bmRlZmluZWQgPyBicE1hcC5nZXQoYnApIDogdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGtleSk7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXMuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogd2hldGhlciB0aGUgZWxlbWVudCBoYXMgdmFsdWVzIGZvciBhIGdpdmVuIGtleVxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBoYXNWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBicE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJwTWFwKSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkIHx8IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB2YWx1ZSBmb3IgYW4gaW5wdXQgb24gYSBkaXJlY3RpdmVcbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgaW4gcXVlc3Rpb25cbiAgICogQHBhcmFtIGtleSB0aGUgdHlwZSBvZiB0aGUgZGlyZWN0aXZlIChlLmcuIGZsZXgsIGxheW91dC1nYXAsIGV0YylcbiAgICogQHBhcmFtIGJwIHRoZSBicmVha3BvaW50IHN1ZmZpeCAoZW1wdHkgc3RyaW5nID0gZGVmYXVsdClcbiAgICogQHBhcmFtIHZhbCB0aGUgdmFsdWUgZm9yIHRoZSBicmVha3BvaW50XG4gICAqL1xuICBzZXRWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcsIHZhbDogYW55LCBicDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGJwTWFwOiBCcmVha3BvaW50TWFwIHwgdW5kZWZpbmVkID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoIWJwTWFwKSB7XG4gICAgICBicE1hcCA9IG5ldyBNYXAoKS5zZXQoYnAsIG5ldyBNYXAoKS5zZXQoa2V5LCB2YWwpKTtcbiAgICAgIHRoaXMuZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgYnBNYXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSAoYnBNYXAuZ2V0KGJwKSA/PyBuZXcgTWFwKCkpLnNldChrZXksIHZhbCk7XG4gICAgICBicE1hcC5zZXQoYnAsIHZhbHVlcyk7XG4gICAgICB0aGlzLmVsZW1lbnRNYXAuc2V0KGVsZW1lbnQsIGJwTWFwKTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGVsZW1lbnQsIGtleSk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogVHJhY2sgZWxlbWVudCB2YWx1ZSBjaGFuZ2VzIGZvciBhIHNwZWNpZmljIGtleSAqL1xuICB0cmFja1ZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8RWxlbWVudE1hdGNoZXI+IHtcbiAgICByZXR1cm4gdGhpcy5zdWJqZWN0XG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZShmaWx0ZXIodiA9PiB2LmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgdi5rZXkgPT09IGtleSkpO1xuICB9XG5cbiAgLyoqIHVwZGF0ZSBhbGwgc3R5bGVzIGZvciBhbGwgZWxlbWVudHMgb24gdGhlIGN1cnJlbnQgYnJlYWtwb2ludCAqL1xuICB1cGRhdGVTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50TWFwLmZvckVhY2goKGJwTWFwLCBlbCkgPT4ge1xuICAgICAgY29uc3Qga2V5TWFwID0gbmV3IFNldCh0aGlzLmVsZW1lbnRLZXlNYXAuZ2V0KGVsKSEpO1xuICAgICAgbGV0IHZhbHVlTWFwID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXApO1xuXG4gICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgdmFsdWVNYXAuZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbCwgaywgdik7XG4gICAgICAgICAga2V5TWFwLmRlbGV0ZShrKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGtleU1hcC5mb3JFYWNoKGsgPT4ge1xuICAgICAgICB2YWx1ZU1hcCA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrKTtcbiAgICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZU1hcC5nZXQoayk7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsLCBrLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbGVhckVsZW1lbnQoZWwsIGspO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhciB0aGUgc3R5bGVzIGZvciBhIGdpdmVuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gdGhpcy5jbGVhck1hcC5nZXQoZWxlbWVudCk7XG5cbiAgICBpZiAoYnVpbGRlcnMpIHtcbiAgICAgIGNvbnN0IGNsZWFyRm46IENsZWFyQ2FsbGJhY2sgPSBidWlsZGVycy5nZXQoa2V5KSBhcyBDbGVhckNhbGxiYWNrO1xuICAgICAgaWYgKCEhY2xlYXJGbikge1xuICAgICAgICBjbGVhckZuKCk7XG4gICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtlbGVtZW50LCBrZXksIHZhbHVlOiAnJ30pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGUgYSBnaXZlbiBlbGVtZW50IHdpdGggdGhlIGFjdGl2YXRlZCB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB1cGRhdGVFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gdGhpcy51cGRhdGVNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChidWlsZGVycykge1xuICAgICAgY29uc3QgdXBkYXRlRm46IFVwZGF0ZUNhbGxiYWNrID0gYnVpbGRlcnMuZ2V0KGtleSkgYXMgVXBkYXRlQ2FsbGJhY2s7XG4gICAgICBpZiAoISF1cGRhdGVGbikge1xuICAgICAgICB1cGRhdGVGbih2YWx1ZSk7XG4gICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtlbGVtZW50LCBrZXksIHZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJlbGVhc2UgYWxsIHJlZmVyZW5jZXMgdG8gYSBnaXZlbiBlbGVtZW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqL1xuICByZWxlYXNlRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHdhdGNoZXJNYXAgPSB0aGlzLndhdGNoZXJNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICh3YXRjaGVyTWFwKSB7XG4gICAgICB3YXRjaGVyTWFwLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICAgICAgdGhpcy53YXRjaGVyTWFwLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGVsZW1lbnRNYXApIHtcbiAgICAgIGVsZW1lbnRNYXAuZm9yRWFjaCgoXywgcykgPT4gZWxlbWVudE1hcC5kZWxldGUocykpO1xuICAgICAgdGhpcy5lbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdHJpZ2dlciBhbiB1cGRhdGUgZm9yIGEgZ2l2ZW4gZWxlbWVudCBhbmQga2V5IChlLmcuIGxheW91dClcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgdHJpZ2dlclVwZGF0ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5Pzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYnBNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChicE1hcCkge1xuICAgICAgY29uc3QgdmFsdWVNYXAgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWVNYXAuZ2V0KGtleSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlTWFwLmZvckVhY2goKHYsIGspID0+IHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrLCB2KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ3Jvc3MtcmVmZXJlbmNlIGZvciBIVE1MRWxlbWVudCB3aXRoIGRpcmVjdGl2ZSBrZXkgKi9cbiAgcHJpdmF0ZSBidWlsZEVsZW1lbnRLZXlNYXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKSB7XG4gICAgbGV0IGtleU1hcCA9IHRoaXMuZWxlbWVudEtleU1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKCFrZXlNYXApIHtcbiAgICAgIGtleU1hcCA9IG5ldyBTZXQoKTtcbiAgICAgIHRoaXMuZWxlbWVudEtleU1hcC5zZXQoZWxlbWVudCwga2V5TWFwKTtcbiAgICB9XG4gICAga2V5TWFwLmFkZChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE90aGVyIHRyaWdnZXJzIHRoYXQgc2hvdWxkIGZvcmNlIHN0eWxlIHVwZGF0ZXM6XG4gICAqIC0gZGlyZWN0aW9uYWxpdHlcbiAgICogLSBsYXlvdXQgY2hhbmdlc1xuICAgKiAtIG11dGF0aW9ub2JzZXJ2ZXIgdXBkYXRlc1xuICAgKi9cbiAgcHJpdmF0ZSB3YXRjaEV4dHJhVHJpZ2dlcnMoZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyczogT2JzZXJ2YWJsZTxhbnk+W10pIHtcbiAgICBpZiAodHJpZ2dlcnMgJiYgdHJpZ2dlcnMubGVuZ3RoKSB7XG4gICAgICBsZXQgd2F0Y2hlcnMgPSB0aGlzLndhdGNoZXJNYXAuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKCF3YXRjaGVycykge1xuICAgICAgICB3YXRjaGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy53YXRjaGVyTWFwLnNldChlbGVtZW50LCB3YXRjaGVycyk7XG4gICAgICB9XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB3YXRjaGVycy5nZXQoa2V5KTtcbiAgICAgIGlmICghc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IG5ld1N1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLnRyaWdnZXJzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoZWxlbWVudCwga2V5KTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwga2V5LCBjdXJyZW50VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgd2F0Y2hlcnMuc2V0KGtleSwgbmV3U3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQnJlYWtwb2ludCBsb2NhdG9yIGJ5IG1lZGlhUXVlcnkgKi9cbiAgcHJpdmF0ZSBmaW5kQnlRdWVyeShxdWVyeTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5UXVlcnkocXVlcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgZmFsbGJhY2sgYnJlYWtwb2ludCBmb3IgYSBnaXZlbiBlbGVtZW50LCBzdGFydGluZyB3aXRoIHRoZSBjdXJyZW50IGJyZWFrcG9pbnRcbiAgICogQHBhcmFtIGJwTWFwXG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIHByaXZhdGUgZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwOiBCcmVha3BvaW50TWFwLCBrZXk/OiBzdHJpbmcpOiBWYWx1ZU1hcCB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhY3RpdmF0ZWRCcCA9IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHNbaV07XG4gICAgICBjb25zdCB2YWx1ZU1hcCA9IGJwTWFwLmdldChhY3RpdmF0ZWRCcC5hbGlhcyk7XG5cbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwgKHZhbHVlTWFwLmhhcyhrZXkpICYmIHZhbHVlTWFwLmdldChrZXkpICE9IG51bGwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlTWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT24gdGhlIHNlcnZlciwgd2UgZXhwbGljaXRseSBoYXZlIGFuIFwiYWxsXCIgc2VjdGlvbiBmaWxsZWQgaW4gdG8gYmVnaW4gd2l0aC5cbiAgICAvLyBTbyB3ZSBkb24ndCBuZWVkIHRvIGFnZ3Jlc3NpdmVseSBmaW5kIGEgZmFsbGJhY2sgaWYgbm8gZXhwbGljaXQgdmFsdWUgZXhpc3RzLlxuICAgIGlmICghdGhpcy5fdXNlRmFsbGJhY2tzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RIb3BlID0gYnBNYXAuZ2V0KCcnKTtcbiAgICByZXR1cm4gKGtleSA9PT0gdW5kZWZpbmVkIHx8IGxhc3RIb3BlICYmIGxhc3RIb3BlLmhhcyhrZXkpKSA/IGxhc3RIb3BlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIGZvciBtZWRpYVF1ZXJ5IGJyZWFrcG9pbnQgYWN0aXZhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgb2JzZXJ2ZUFjdGl2YXRpb25zKCkge1xuICAgIGNvbnN0IHF1ZXJpZXMgPSB0aGlzLmJyZWFrcG9pbnRzLml0ZW1zLm1hcChicCA9PiBicC5tZWRpYVF1ZXJ5KTtcblxuICAgIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAub2JzZXJ2ZSh0aGlzLmhvb2sud2l0aFByaW50UXVlcnkocXVlcmllcykpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFwKHRoaXMuaG9vay5pbnRlcmNlcHRFdmVudHModGhpcykpLFxuICAgICAgICAgICAgZmlsdGVyKHRoaXMuaG9vay5ibG9ja1Byb3BhZ2F0aW9uKCkpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLm9uTWVkaWFDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBpbml0QnVpbGRlck1hcChtYXA6IEJ1aWxkZXJNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ/OiBCdWlsZGVyKTogdm9pZCB7XG4gIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb2xkTWFwID0gbWFwLmdldChlbGVtZW50KSA/PyBuZXcgTWFwKCk7XG4gICAgb2xkTWFwLnNldChrZXksIGlucHV0KTtcbiAgICBtYXAuc2V0KGVsZW1lbnQsIG9sZE1hcCk7XG4gIH1cbn1cblxuIl19