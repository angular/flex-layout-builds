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
        this.activatedBreakpoints = [];
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
                this.activatedBreakpoints.push(bp);
                this.activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
            else if (!mc.matches && bpIndex !== -1) {
                // Remove the breakpoint when it's deactivated
                this.activatedBreakpoints.splice(bpIndex, 1);
                this.activatedBreakpoints.sort(sortDescendingPriority);
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
        const target = this;
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        this.matchMedia
            .observe(this.hook.withPrintQuery(queries))
            .pipe(tap(this.hook.interceptEvents(target)), filter(this.hook.blockPropagation()))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWFyc2hhbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU1yRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQW9CeEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGVBQWU7SUFtQjFCLFlBQXNCLFVBQXNCLEVBQ3RCLFdBQStCLEVBQy9CLElBQWU7UUFGZixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixTQUFJLEdBQUosSUFBSSxDQUFXO1FBcEI3QixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQix5QkFBb0IsR0FBaUIsRUFBRSxDQUFDO1FBQ3hDLGVBQVUsR0FBZSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ25DLGtCQUFhLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDN0MsZUFBVSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBSyxzQ0FBc0M7UUFDbEYsY0FBUyxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTSxzQ0FBc0M7UUFDbEYsYUFBUSxHQUFlLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBTyxxQ0FBcUM7UUFFakYsWUFBTyxHQUE0QixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBYXZE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ICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0JyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50JztcbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeX0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG5pbXBvcnQge1ByaW50SG9vaywgSG9va1RhcmdldH0gZnJvbSAnLi9wcmludC1ob29rJztcbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcblxudHlwZSBDbGVhckNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgVXBkYXRlQ2FsbGJhY2sgPSAodmFsOiBhbnkpID0+IHZvaWQ7XG50eXBlIEJ1aWxkZXIgPSBVcGRhdGVDYWxsYmFjayB8IENsZWFyQ2FsbGJhY2s7XG5cbnR5cGUgVmFsdWVNYXAgPSBNYXA8c3RyaW5nLCBzdHJpbmc+O1xudHlwZSBCcmVha3BvaW50TWFwID0gTWFwPHN0cmluZywgVmFsdWVNYXA+O1xudHlwZSBFbGVtZW50TWFwID0gTWFwPEhUTUxFbGVtZW50LCBCcmVha3BvaW50TWFwPjtcbnR5cGUgRWxlbWVudEtleU1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFNldDxzdHJpbmc+PjtcbnR5cGUgU3Vic2NyaXB0aW9uTWFwID0gTWFwPHN0cmluZywgU3Vic2NyaXB0aW9uPjtcbnR5cGUgV2F0Y2hlck1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFN1YnNjcmlwdGlvbk1hcD47XG50eXBlIEJ1aWxkZXJNYXAgPSBXZWFrTWFwPEhUTUxFbGVtZW50LCBNYXA8c3RyaW5nLCBCdWlsZGVyPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudE1hdGNoZXIge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbi8qKlxuICogTWVkaWFNYXJzaGFsbGVyIC0gcmVnaXN0ZXIgcmVzcG9uc2l2ZSB2YWx1ZXMgZnJvbSBkaXJlY3RpdmVzIGFuZFxuICogICAgICAgICAgICAgICAgICAgdHJpZ2dlciB0aGVtIGJhc2VkIG9uIG1lZGlhIHF1ZXJ5IGV2ZW50c1xuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNZWRpYU1hcnNoYWxsZXIge1xuICBwcml2YXRlIF91c2VGYWxsYmFja3MgPSB0cnVlO1xuICBwcml2YXRlIGFjdGl2YXRlZEJyZWFrcG9pbnRzOiBCcmVha1BvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBlbGVtZW50TWFwOiBFbGVtZW50TWFwID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGVsZW1lbnRLZXlNYXA6IEVsZW1lbnRLZXlNYXAgPSBuZXcgV2Vha01hcCgpO1xuICBwcml2YXRlIHdhdGNoZXJNYXA6IFdhdGNoZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgLy8gc3BlY2lhbCB0cmlnZ2VycyB0byB1cGRhdGUgZWxlbWVudHNcbiAgcHJpdmF0ZSB1cGRhdGVNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgIC8vIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byB1cGRhdGUgc3R5bGVzXG4gIHByaXZhdGUgY2xlYXJNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnMgdG8gY2xlYXIgc3R5bGVzXG5cbiAgcHJpdmF0ZSBzdWJqZWN0OiBTdWJqZWN0PEVsZW1lbnRNYXRjaGVyPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZ2V0IGFjdGl2YXRlZEFsaWFzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHNbMF0/LmFsaWFzID8/ICcnO1xuICB9XG5cbiAgc2V0IHVzZUZhbGxiYWNrcyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3VzZUZhbGxiYWNrcyA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG1hdGNoTWVkaWE6IE1hdGNoTWVkaWEsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFJlZ2lzdHJ5LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaG9vazogUHJpbnRIb29rKSB7XG4gICAgdGhpcy5vYnNlcnZlQWN0aXZhdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgc3R5bGVzIG9uIGJyZWFrcG9pbnQgYWN0aXZhdGVzIG9yIGRlYWN0aXZhdGVzXG4gICAqIEBwYXJhbSBtY1xuICAgKi9cbiAgb25NZWRpYUNoYW5nZShtYzogTWVkaWFDaGFuZ2UpIHtcbiAgICBjb25zdCBicDogQnJlYWtQb2ludCB8IG51bGwgPSB0aGlzLmZpbmRCeVF1ZXJ5KG1jLm1lZGlhUXVlcnkpO1xuXG4gICAgaWYgKGJwKSB7XG4gICAgICBtYyA9IG1lcmdlQWxpYXMobWMsIGJwKTtcblxuICAgICAgY29uc3QgYnBJbmRleCA9IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMuaW5kZXhPZihicCk7XG5cbiAgICAgIGlmIChtYy5tYXRjaGVzICYmIGJwSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMucHVzaChicCk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgICAgfSBlbHNlIGlmICghbWMubWF0Y2hlcyAmJiBicEluZGV4ICE9PSAtMSkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGJyZWFrcG9pbnQgd2hlbiBpdCdzIGRlYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMuc3BsaWNlKGJwSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLnNvcnQoc29ydERlc2NlbmRpbmdQcmlvcml0eSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbGl6ZSB0aGUgbWFyc2hhbGxlciB3aXRoIG5lY2Vzc2FyeSBlbGVtZW50cyBmb3IgZGVsZWdhdGlvbiBvbiBhbiBlbGVtZW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHBhcmFtIHVwZGF0ZUZuIG9wdGlvbmFsIGNhbGxiYWNrIHNvIHRoYXQgY3VzdG9tIGJwIGRpcmVjdGl2ZXMgZG9uJ3QgaGF2ZSB0byByZS1wcm92aWRlIHRoaXNcbiAgICogQHBhcmFtIGNsZWFyRm4gb3B0aW9uYWwgY2FsbGJhY2sgc28gdGhhdCBjdXN0b20gYnAgZGlyZWN0aXZlcyBkb24ndCBoYXZlIHRvIHJlLXByb3ZpZGUgdGhpc1xuICAgKiBAcGFyYW0gZXh0cmFUcmlnZ2VycyBvdGhlciB0cmlnZ2VycyB0byBmb3JjZSBzdHlsZSB1cGRhdGVzIChlLmcuIGxheW91dCwgZGlyZWN0aW9uYWxpdHksIGV0YylcbiAgICovXG4gIGluaXQoZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgdXBkYXRlRm4/OiBVcGRhdGVDYWxsYmFjayxcbiAgICAgICBjbGVhckZuPzogQ2xlYXJDYWxsYmFjayxcbiAgICAgICBleHRyYVRyaWdnZXJzOiBPYnNlcnZhYmxlPGFueT5bXSA9IFtdKTogdm9pZCB7XG5cbiAgICBpbml0QnVpbGRlck1hcCh0aGlzLnVwZGF0ZU1hcCwgZWxlbWVudCwga2V5LCB1cGRhdGVGbik7XG4gICAgaW5pdEJ1aWxkZXJNYXAodGhpcy5jbGVhck1hcCwgZWxlbWVudCwga2V5LCBjbGVhckZuKTtcblxuICAgIHRoaXMuYnVpbGRFbGVtZW50S2V5TWFwKGVsZW1lbnQsIGtleSk7XG4gICAgdGhpcy53YXRjaEV4dHJhVHJpZ2dlcnMoZWxlbWVudCwga2V5LCBleHRyYVRyaWdnZXJzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIHZhbHVlIGZvciBhbiBlbGVtZW50IGFuZCBrZXkgYW5kIG9wdGlvbmFsbHkgYSBnaXZlbiBicmVha3BvaW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHBhcmFtIGJwXG4gICAqL1xuICBnZXRWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcsIGJwPzogc3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBicE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJwTWFwKSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSBicCAhPT0gdW5kZWZpbmVkID8gYnBNYXAuZ2V0KGJwKSA6IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrZXkpO1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gdmFsdWVzLmdldChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHdoZXRoZXIgdGhlIGVsZW1lbnQgaGFzIHZhbHVlcyBmb3IgYSBnaXZlbiBrZXlcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgaGFzVmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYnBNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChicE1hcCkge1xuICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGtleSk7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXMuZ2V0KGtleSkgIT09IHVuZGVmaW5lZCB8fCBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmFsdWUgZm9yIGFuIGlucHV0IG9uIGEgZGlyZWN0aXZlXG4gICAqIEBwYXJhbSBlbGVtZW50IHRoZSBlbGVtZW50IGluIHF1ZXN0aW9uXG4gICAqIEBwYXJhbSBrZXkgdGhlIHR5cGUgb2YgdGhlIGRpcmVjdGl2ZSAoZS5nLiBmbGV4LCBsYXlvdXQtZ2FwLCBldGMpXG4gICAqIEBwYXJhbSBicCB0aGUgYnJlYWtwb2ludCBzdWZmaXggKGVtcHR5IHN0cmluZyA9IGRlZmF1bHQpXG4gICAqIEBwYXJhbSB2YWwgdGhlIHZhbHVlIGZvciB0aGUgYnJlYWtwb2ludFxuICAgKi9cbiAgc2V0VmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB2YWw6IGFueSwgYnA6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBicE1hcDogQnJlYWtwb2ludE1hcCB8IHVuZGVmaW5lZCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKCFicE1hcCkge1xuICAgICAgYnBNYXAgPSBuZXcgTWFwKCkuc2V0KGJwLCBuZXcgTWFwKCkuc2V0KGtleSwgdmFsKSk7XG4gICAgICB0aGlzLmVsZW1lbnRNYXAuc2V0KGVsZW1lbnQsIGJwTWFwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdmFsdWVzID0gKGJwTWFwLmdldChicCkgPz8gbmV3IE1hcCgpKS5zZXQoa2V5LCB2YWwpO1xuICAgICAgYnBNYXAuc2V0KGJwLCB2YWx1ZXMpO1xuICAgICAgdGhpcy5lbGVtZW50TWFwLnNldChlbGVtZW50LCBicE1hcCk7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShlbGVtZW50LCBrZXkpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRyYWNrIGVsZW1lbnQgdmFsdWUgY2hhbmdlcyBmb3IgYSBzcGVjaWZpYyBrZXkgKi9cbiAgdHJhY2tWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPEVsZW1lbnRNYXRjaGVyPiB7XG4gICAgcmV0dXJuIHRoaXMuc3ViamVjdFxuICAgICAgICAuYXNPYnNlcnZhYmxlKClcbiAgICAgICAgLnBpcGUoZmlsdGVyKHYgPT4gdi5lbGVtZW50ID09PSBlbGVtZW50ICYmIHYua2V5ID09PSBrZXkpKTtcbiAgfVxuXG4gIC8qKiB1cGRhdGUgYWxsIHN0eWxlcyBmb3IgYWxsIGVsZW1lbnRzIG9uIHRoZSBjdXJyZW50IGJyZWFrcG9pbnQgKi9cbiAgdXBkYXRlU3R5bGVzKCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudE1hcC5mb3JFYWNoKChicE1hcCwgZWwpID0+IHtcbiAgICAgIGNvbnN0IGtleU1hcCA9IG5ldyBTZXQodGhpcy5lbGVtZW50S2V5TWFwLmdldChlbCkhKTtcbiAgICAgIGxldCB2YWx1ZU1hcCA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwKTtcblxuICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgIHZhbHVlTWFwLmZvckVhY2goKHYsIGspID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWwsIGssIHYpO1xuICAgICAgICAgIGtleU1hcC5kZWxldGUoayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBrZXlNYXAuZm9yRWFjaChrID0+IHtcbiAgICAgICAgdmFsdWVNYXAgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwgayk7XG4gICAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVNYXAuZ2V0KGspO1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbCwgaywgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xlYXJFbGVtZW50KGVsLCBrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXIgdGhlIHN0eWxlcyBmb3IgYSBnaXZlbiBlbGVtZW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGNsZWFyRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMuY2xlYXJNYXAuZ2V0KGVsZW1lbnQpO1xuXG4gICAgaWYgKGJ1aWxkZXJzKSB7XG4gICAgICBjb25zdCBjbGVhckZuOiBDbGVhckNhbGxiYWNrID0gYnVpbGRlcnMuZ2V0KGtleSkgYXMgQ2xlYXJDYWxsYmFjaztcbiAgICAgIGlmICghIWNsZWFyRm4pIHtcbiAgICAgICAgY2xlYXJGbigpO1xuICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7ZWxlbWVudCwga2V5LCB2YWx1ZTogJyd9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlIGEgZ2l2ZW4gZWxlbWVudCB3aXRoIHRoZSBhY3RpdmF0ZWQgdmFsdWVzIGZvciBhIGdpdmVuIGtleVxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgdXBkYXRlRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMudXBkYXRlTWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnVpbGRlcnMpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZUZuOiBVcGRhdGVDYWxsYmFjayA9IGJ1aWxkZXJzLmdldChrZXkpIGFzIFVwZGF0ZUNhbGxiYWNrO1xuICAgICAgaWYgKCEhdXBkYXRlRm4pIHtcbiAgICAgICAgdXBkYXRlRm4odmFsdWUpO1xuICAgICAgICB0aGlzLnN1YmplY3QubmV4dCh7ZWxlbWVudCwga2V5LCB2YWx1ZX0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZWxlYXNlIGFsbCByZWZlcmVuY2VzIHRvIGEgZ2l2ZW4gZWxlbWVudFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKi9cbiAgcmVsZWFzZUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCB3YXRjaGVyTWFwID0gdGhpcy53YXRjaGVyTWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAod2F0Y2hlck1hcCkge1xuICAgICAgd2F0Y2hlck1hcC5mb3JFYWNoKHMgPT4gcy51bnN1YnNjcmliZSgpKTtcbiAgICAgIHRoaXMud2F0Y2hlck1hcC5kZWxldGUoZWxlbWVudCk7XG4gICAgfVxuICAgIGNvbnN0IGVsZW1lbnRNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChlbGVtZW50TWFwKSB7XG4gICAgICBlbGVtZW50TWFwLmZvckVhY2goKF8sIHMpID0+IGVsZW1lbnRNYXAuZGVsZXRlKHMpKTtcbiAgICAgIHRoaXMuZWxlbWVudE1hcC5kZWxldGUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRyaWdnZXIgYW4gdXBkYXRlIGZvciBhIGdpdmVuIGVsZW1lbnQgYW5kIGtleSAoZS5nLiBsYXlvdXQpXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIHRyaWdnZXJVcGRhdGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleT86IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGJwTWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnBNYXApIHtcbiAgICAgIGNvbnN0IHZhbHVlTWFwID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGtleSk7XG4gICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrZXksIHZhbHVlTWFwLmdldChrZXkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZU1hcC5mb3JFYWNoKCh2LCBrKSA9PiB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwgaywgdikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENyb3NzLXJlZmVyZW5jZSBmb3IgSFRNTEVsZW1lbnQgd2l0aCBkaXJlY3RpdmUga2V5ICovXG4gIHByaXZhdGUgYnVpbGRFbGVtZW50S2V5TWFwKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZykge1xuICAgIGxldCBrZXlNYXAgPSB0aGlzLmVsZW1lbnRLZXlNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICgha2V5TWFwKSB7XG4gICAgICBrZXlNYXAgPSBuZXcgU2V0KCk7XG4gICAgICB0aGlzLmVsZW1lbnRLZXlNYXAuc2V0KGVsZW1lbnQsIGtleU1hcCk7XG4gICAgfVxuICAgIGtleU1hcC5hZGQoa2V5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdGhlciB0cmlnZ2VycyB0aGF0IHNob3VsZCBmb3JjZSBzdHlsZSB1cGRhdGVzOlxuICAgKiAtIGRpcmVjdGlvbmFsaXR5XG4gICAqIC0gbGF5b3V0IGNoYW5nZXNcbiAgICogLSBtdXRhdGlvbm9ic2VydmVyIHVwZGF0ZXNcbiAgICovXG4gIHByaXZhdGUgd2F0Y2hFeHRyYVRyaWdnZXJzKGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcnM6IE9ic2VydmFibGU8YW55PltdKSB7XG4gICAgaWYgKHRyaWdnZXJzICYmIHRyaWdnZXJzLmxlbmd0aCkge1xuICAgICAgbGV0IHdhdGNoZXJzID0gdGhpcy53YXRjaGVyTWFwLmdldChlbGVtZW50KTtcbiAgICAgIGlmICghd2F0Y2hlcnMpIHtcbiAgICAgICAgd2F0Y2hlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMud2F0Y2hlck1hcC5zZXQoZWxlbWVudCwgd2F0Y2hlcnMpO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gd2F0Y2hlcnMuZ2V0KGtleSk7XG4gICAgICBpZiAoIXN1YnNjcmlwdGlvbikge1xuICAgICAgICBjb25zdCBuZXdTdWJzY3JpcHRpb24gPSBtZXJnZSguLi50cmlnZ2Vycykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0aGlzLmdldFZhbHVlKGVsZW1lbnQsIGtleSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGtleSwgY3VycmVudFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHdhdGNoZXJzLnNldChrZXksIG5ld1N1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEJyZWFrcG9pbnQgbG9jYXRvciBieSBtZWRpYVF1ZXJ5ICovXG4gIHByaXZhdGUgZmluZEJ5UXVlcnkocXVlcnk6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KHF1ZXJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBnZXQgdGhlIGZhbGxiYWNrIGJyZWFrcG9pbnQgZm9yIGEgZ2l2ZW4gZWxlbWVudCwgc3RhcnRpbmcgd2l0aCB0aGUgY3VycmVudCBicmVha3BvaW50XG4gICAqIEBwYXJhbSBicE1hcFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBwcml2YXRlIGdldEFjdGl2YXRlZFZhbHVlcyhicE1hcDogQnJlYWtwb2ludE1hcCwga2V5Pzogc3RyaW5nKTogVmFsdWVNYXAgfCB1bmRlZmluZWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYWN0aXZhdGVkQnAgPSB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzW2ldO1xuICAgICAgY29uc3QgdmFsdWVNYXAgPSBicE1hcC5nZXQoYWN0aXZhdGVkQnAuYWxpYXMpO1xuXG4gICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8ICh2YWx1ZU1hcC5oYXMoa2V5KSAmJiB2YWx1ZU1hcC5nZXQoa2V5KSAhPSBudWxsKSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZU1hcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE9uIHRoZSBzZXJ2ZXIsIHdlIGV4cGxpY2l0bHkgaGF2ZSBhbiBcImFsbFwiIHNlY3Rpb24gZmlsbGVkIGluIHRvIGJlZ2luIHdpdGguXG4gICAgLy8gU28gd2UgZG9uJ3QgbmVlZCB0byBhZ2dyZXNzaXZlbHkgZmluZCBhIGZhbGxiYWNrIGlmIG5vIGV4cGxpY2l0IHZhbHVlIGV4aXN0cy5cbiAgICBpZiAoIXRoaXMuX3VzZUZhbGxiYWNrcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0SG9wZSA9IGJwTWFwLmdldCgnJyk7XG4gICAgcmV0dXJuIChrZXkgPT09IHVuZGVmaW5lZCB8fCBsYXN0SG9wZSAmJiBsYXN0SG9wZS5oYXMoa2V5KSkgPyBsYXN0SG9wZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaCBmb3IgbWVkaWFRdWVyeSBicmVha3BvaW50IGFjdGl2YXRpb25zXG4gICAqL1xuICBwcml2YXRlIG9ic2VydmVBY3RpdmF0aW9ucygpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9va1RhcmdldDtcbiAgICBjb25zdCBxdWVyaWVzID0gdGhpcy5icmVha3BvaW50cy5pdGVtcy5tYXAoYnAgPT4gYnAubWVkaWFRdWVyeSk7XG5cbiAgICB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLm9ic2VydmUodGhpcy5ob29rLndpdGhQcmludFF1ZXJ5KHF1ZXJpZXMpKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIHRhcCh0aGlzLmhvb2suaW50ZXJjZXB0RXZlbnRzKHRhcmdldCkpLFxuICAgICAgICAgICAgZmlsdGVyKHRoaXMuaG9vay5ibG9ja1Byb3BhZ2F0aW9uKCkpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLm9uTWVkaWFDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxufVxuXG5mdW5jdGlvbiBpbml0QnVpbGRlck1hcChtYXA6IEJ1aWxkZXJNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ/OiBCdWlsZGVyKTogdm9pZCB7XG4gIGlmIChpbnB1dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3Qgb2xkTWFwID0gbWFwLmdldChlbGVtZW50KSA/PyBuZXcgTWFwKCk7XG4gICAgb2xkTWFwLnNldChrZXksIGlucHV0KTtcbiAgICBtYXAuc2V0KGVsZW1lbnQsIG9sZE1hcCk7XG4gIH1cbn1cblxuIl19