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
        return this.activatedBreakpoints[0] ? this.activatedBreakpoints[0].alias : '';
    }
    /**
     * Update styles on breakpoint activates or deactivates
     * @param mc
     */
    onMediaChange(mc) {
        const bp = this.findByQuery(mc.mediaQuery);
        if (bp) {
            mc = mergeAlias(mc, bp);
            if (mc.matches && this.activatedBreakpoints.indexOf(bp) === -1) {
                this.activatedBreakpoints.push(bp);
                this.activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
            else if (!mc.matches && this.activatedBreakpoints.indexOf(bp) !== -1) {
                // Remove the breakpoint when it's deactivated
                this.activatedBreakpoints.splice(this.activatedBreakpoints.indexOf(bp), 1);
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
            const values = (bpMap.get(bp) || new Map()).set(key, val);
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
        let oldMap = map.get(element);
        if (!oldMap) {
            oldMap = new Map();
            map.set(element, oldMap);
        }
        oldMap.set(key, input);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWFyc2hhbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU1yRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQW9CeEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGVBQWU7SUFjMUIsWUFBc0IsVUFBc0IsRUFDdEIsV0FBK0IsRUFDL0IsSUFBZTtRQUZmLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQy9CLFNBQUksR0FBSixJQUFJLENBQVc7UUFmN0IseUJBQW9CLEdBQWlCLEVBQUUsQ0FBQztRQUN4QyxlQUFVLEdBQWUsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNuQyxrQkFBYSxHQUFrQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzdDLGVBQVUsR0FBZSxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUssc0NBQXNDO1FBQ2xGLGNBQVMsR0FBZSxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQU0sc0NBQXNDO1FBQ2xGLGFBQVEsR0FBZSxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQU8scUNBQXFDO1FBRWpGLFlBQU8sR0FBNEIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQVN2RCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJ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LENBQUM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxVQUFVO2FBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzFDLElBQUksQ0FDRCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUN2QzthQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7OzRHQTFTVSxlQUFlO2dIQUFmLGVBQWUsY0FESCxNQUFNOzJGQUNsQixlQUFlO2tCQUQzQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUErU2hDLFNBQVMsY0FBYyxDQUFDLEdBQWUsRUFDZixPQUFvQixFQUNwQixHQUFXLEVBQ1gsS0FBc0M7SUFDNUQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0JyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50JztcbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeX0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG5pbXBvcnQge1ByaW50SG9vaywgSG9va1RhcmdldH0gZnJvbSAnLi9wcmludC1ob29rJztcbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcblxudHlwZSBDbGVhckNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgVXBkYXRlQ2FsbGJhY2sgPSAodmFsOiBhbnkpID0+IHZvaWQ7XG50eXBlIEJ1aWxkZXIgPSBVcGRhdGVDYWxsYmFjayB8IENsZWFyQ2FsbGJhY2s7XG5cbnR5cGUgVmFsdWVNYXAgPSBNYXA8c3RyaW5nLCBzdHJpbmc+O1xudHlwZSBCcmVha3BvaW50TWFwID0gTWFwPHN0cmluZywgVmFsdWVNYXA+O1xudHlwZSBFbGVtZW50TWFwID0gTWFwPEhUTUxFbGVtZW50LCBCcmVha3BvaW50TWFwPjtcbnR5cGUgRWxlbWVudEtleU1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFNldDxzdHJpbmc+PjtcbnR5cGUgU3Vic2NyaXB0aW9uTWFwID0gTWFwPHN0cmluZywgU3Vic2NyaXB0aW9uPjtcbnR5cGUgV2F0Y2hlck1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFN1YnNjcmlwdGlvbk1hcD47XG50eXBlIEJ1aWxkZXJNYXAgPSBXZWFrTWFwPEhUTUxFbGVtZW50LCBNYXA8c3RyaW5nLCBCdWlsZGVyPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudE1hdGNoZXIge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbi8qKlxuICogTWVkaWFNYXJzaGFsbGVyIC0gcmVnaXN0ZXIgcmVzcG9uc2l2ZSB2YWx1ZXMgZnJvbSBkaXJlY3RpdmVzIGFuZFxuICogICAgICAgICAgICAgICAgICAgdHJpZ2dlciB0aGVtIGJhc2VkIG9uIG1lZGlhIHF1ZXJ5IGV2ZW50c1xuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNZWRpYU1hcnNoYWxsZXIge1xuICBwcml2YXRlIGFjdGl2YXRlZEJyZWFrcG9pbnRzOiBCcmVha1BvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBlbGVtZW50TWFwOiBFbGVtZW50TWFwID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGVsZW1lbnRLZXlNYXA6IEVsZW1lbnRLZXlNYXAgPSBuZXcgV2Vha01hcCgpO1xuICBwcml2YXRlIHdhdGNoZXJNYXA6IFdhdGNoZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgLy8gc3BlY2lhbCB0cmlnZ2VycyB0byB1cGRhdGUgZWxlbWVudHNcbiAgcHJpdmF0ZSB1cGRhdGVNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgIC8vIGNhbGxiYWNrIGZ1bmN0aW9ucyB0byB1cGRhdGUgc3R5bGVzXG4gIHByaXZhdGUgY2xlYXJNYXA6IEJ1aWxkZXJNYXAgPSBuZXcgV2Vha01hcCgpOyAgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnMgdG8gY2xlYXIgc3R5bGVzXG5cbiAgcHJpdmF0ZSBzdWJqZWN0OiBTdWJqZWN0PEVsZW1lbnRNYXRjaGVyPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZ2V0IGFjdGl2YXRlZEFsaWFzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHNbMF0gPyB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzWzBdLmFsaWFzIDogJyc7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbWF0Y2hNZWRpYTogTWF0Y2hNZWRpYSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnksXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBob29rOiBQcmludEhvb2spIHtcbiAgICB0aGlzLm9ic2VydmVBY3RpdmF0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBzdHlsZXMgb24gYnJlYWtwb2ludCBhY3RpdmF0ZXMgb3IgZGVhY3RpdmF0ZXNcbiAgICogQHBhcmFtIG1jXG4gICAqL1xuICBvbk1lZGlhQ2hhbmdlKG1jOiBNZWRpYUNoYW5nZSkge1xuICAgIGNvbnN0IGJwOiBCcmVha1BvaW50IHwgbnVsbCA9IHRoaXMuZmluZEJ5UXVlcnkobWMubWVkaWFRdWVyeSk7XG4gICAgaWYgKGJwKSB7XG4gICAgICBtYyA9IG1lcmdlQWxpYXMobWMsIGJwKTtcblxuICAgICAgaWYgKG1jLm1hdGNoZXMgJiYgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5pbmRleE9mKGJwKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5wdXNoKGJwKTtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3R5bGVzKCk7XG5cbiAgICAgIH0gZWxzZSBpZiAoIW1jLm1hdGNoZXMgJiYgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5pbmRleE9mKGJwKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBicmVha3BvaW50IHdoZW4gaXQncyBkZWFjdGl2YXRlZFxuICAgICAgICB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLnNwbGljZSh0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLmluZGV4T2YoYnApLCAxKTtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50cy5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3R5bGVzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluaXRpYWxpemUgdGhlIG1hcnNoYWxsZXIgd2l0aCBuZWNlc3NhcnkgZWxlbWVudHMgZm9yIGRlbGVnYXRpb24gb24gYW4gZWxlbWVudFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSB1cGRhdGVGbiBvcHRpb25hbCBjYWxsYmFjayBzbyB0aGF0IGN1c3RvbSBicCBkaXJlY3RpdmVzIGRvbid0IGhhdmUgdG8gcmUtcHJvdmlkZSB0aGlzXG4gICAqIEBwYXJhbSBjbGVhckZuIG9wdGlvbmFsIGNhbGxiYWNrIHNvIHRoYXQgY3VzdG9tIGJwIGRpcmVjdGl2ZXMgZG9uJ3QgaGF2ZSB0byByZS1wcm92aWRlIHRoaXNcbiAgICogQHBhcmFtIGV4dHJhVHJpZ2dlcnMgb3RoZXIgdHJpZ2dlcnMgdG8gZm9yY2Ugc3R5bGUgdXBkYXRlcyAoZS5nLiBsYXlvdXQsIGRpcmVjdGlvbmFsaXR5LCBldGMpXG4gICAqL1xuICBpbml0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgIHVwZGF0ZUZuPzogVXBkYXRlQ2FsbGJhY2ssXG4gICAgICAgY2xlYXJGbj86IENsZWFyQ2FsbGJhY2ssXG4gICAgICAgZXh0cmFUcmlnZ2VyczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXSk6IHZvaWQge1xuXG4gICAgaW5pdEJ1aWxkZXJNYXAodGhpcy51cGRhdGVNYXAsIGVsZW1lbnQsIGtleSwgdXBkYXRlRm4pO1xuICAgIGluaXRCdWlsZGVyTWFwKHRoaXMuY2xlYXJNYXAsIGVsZW1lbnQsIGtleSwgY2xlYXJGbik7XG5cbiAgICB0aGlzLmJ1aWxkRWxlbWVudEtleU1hcChlbGVtZW50LCBrZXkpO1xuICAgIHRoaXMud2F0Y2hFeHRyYVRyaWdnZXJzKGVsZW1lbnQsIGtleSwgZXh0cmFUcmlnZ2Vycyk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSB2YWx1ZSBmb3IgYW4gZWxlbWVudCBhbmQga2V5IGFuZCBvcHRpb25hbGx5IGEgZ2l2ZW4gYnJlYWtwb2ludFxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqIEBwYXJhbSBicFxuICAgKi9cbiAgZ2V0VmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCBicD86IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgYnBNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChicE1hcCkge1xuICAgICAgY29uc3QgdmFsdWVzID0gYnAgIT09IHVuZGVmaW5lZCA/IGJwTWFwLmdldChicCkgOiB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5nZXQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiB3aGV0aGVyIHRoZSBlbGVtZW50IGhhcyB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGhhc1ZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGJwTWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnBNYXApIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrZXkpO1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gdmFsdWVzLmdldChrZXkpICE9PSB1bmRlZmluZWQgfHwgZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZhbHVlIGZvciBhbiBpbnB1dCBvbiBhIGRpcmVjdGl2ZVxuICAgKiBAcGFyYW0gZWxlbWVudCB0aGUgZWxlbWVudCBpbiBxdWVzdGlvblxuICAgKiBAcGFyYW0ga2V5IHRoZSB0eXBlIG9mIHRoZSBkaXJlY3RpdmUgKGUuZy4gZmxleCwgbGF5b3V0LWdhcCwgZXRjKVxuICAgKiBAcGFyYW0gYnAgdGhlIGJyZWFrcG9pbnQgc3VmZml4IChlbXB0eSBzdHJpbmcgPSBkZWZhdWx0KVxuICAgKiBAcGFyYW0gdmFsIHRoZSB2YWx1ZSBmb3IgdGhlIGJyZWFrcG9pbnRcbiAgICovXG4gIHNldFZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdmFsOiBhbnksIGJwOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgYnBNYXA6IEJyZWFrcG9pbnRNYXAgfCB1bmRlZmluZWQgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICghYnBNYXApIHtcbiAgICAgIGJwTWFwID0gbmV3IE1hcCgpLnNldChicCwgbmV3IE1hcCgpLnNldChrZXksIHZhbCkpO1xuICAgICAgdGhpcy5lbGVtZW50TWFwLnNldChlbGVtZW50LCBicE1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IChicE1hcC5nZXQoYnApIHx8IG5ldyBNYXAoKSkuc2V0KGtleSwgdmFsKTtcbiAgICAgIGJwTWFwLnNldChicCwgdmFsdWVzKTtcbiAgICAgIHRoaXMuZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgYnBNYXApO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoZWxlbWVudCwga2V5KTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUcmFjayBlbGVtZW50IHZhbHVlIGNoYW5nZXMgZm9yIGEgc3BlY2lmaWMga2V5ICovXG4gIHRyYWNrVmFsdWUoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxFbGVtZW50TWF0Y2hlcj4ge1xuICAgIHJldHVybiB0aGlzLnN1YmplY3RcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKGZpbHRlcih2ID0+IHYuZWxlbWVudCA9PT0gZWxlbWVudCAmJiB2LmtleSA9PT0ga2V5KSk7XG4gIH1cblxuICAvKiogdXBkYXRlIGFsbCBzdHlsZXMgZm9yIGFsbCBlbGVtZW50cyBvbiB0aGUgY3VycmVudCBicmVha3BvaW50ICovXG4gIHVwZGF0ZVN0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnRNYXAuZm9yRWFjaCgoYnBNYXAsIGVsKSA9PiB7XG4gICAgICBjb25zdCBrZXlNYXAgPSBuZXcgU2V0KHRoaXMuZWxlbWVudEtleU1hcC5nZXQoZWwpISk7XG4gICAgICBsZXQgdmFsdWVNYXAgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCk7XG5cbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICB2YWx1ZU1hcC5mb3JFYWNoKCh2LCBrKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsLCBrLCB2KTtcbiAgICAgICAgICBrZXlNYXAuZGVsZXRlKGspO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAga2V5TWFwLmZvckVhY2goayA9PiB7XG4gICAgICAgIHZhbHVlTWFwID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGspO1xuICAgICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlTWFwLmdldChrKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWwsIGssIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsZWFyRWxlbWVudChlbCwgayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXIgdGhlIHN0eWxlcyBmb3IgYSBnaXZlbiBlbGVtZW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIGNsZWFyRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBidWlsZGVycyA9IHRoaXMuY2xlYXJNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChidWlsZGVycykge1xuICAgICAgY29uc3QgY2xlYXJGbjogQ2xlYXJDYWxsYmFjayA9IGJ1aWxkZXJzLmdldChrZXkpIGFzIENsZWFyQ2FsbGJhY2s7XG4gICAgICBpZiAoISFjbGVhckZuKSB7XG4gICAgICAgIGNsZWFyRm4oKTtcbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoe2VsZW1lbnQsIGtleSwgdmFsdWU6ICcnfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZSBhIGdpdmVuIGVsZW1lbnQgd2l0aCB0aGUgYWN0aXZhdGVkIHZhbHVlcyBmb3IgYSBnaXZlbiBrZXlcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHVwZGF0ZUVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgYnVpbGRlcnMgPSB0aGlzLnVwZGF0ZU1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJ1aWxkZXJzKSB7XG4gICAgICBjb25zdCB1cGRhdGVGbjogVXBkYXRlQ2FsbGJhY2sgPSBidWlsZGVycy5nZXQoa2V5KSBhcyBVcGRhdGVDYWxsYmFjaztcbiAgICAgIGlmICghIXVwZGF0ZUZuKSB7XG4gICAgICAgIHVwZGF0ZUZuKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdWJqZWN0Lm5leHQoe2VsZW1lbnQsIGtleSwgdmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcmVsZWFzZSBhbGwgcmVmZXJlbmNlcyB0byBhIGdpdmVuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICovXG4gIHJlbGVhc2VFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3Qgd2F0Y2hlck1hcCA9IHRoaXMud2F0Y2hlck1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHdhdGNoZXJNYXApIHtcbiAgICAgIHdhdGNoZXJNYXAuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gICAgICB0aGlzLndhdGNoZXJNYXAuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50TWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoZWxlbWVudE1hcCkge1xuICAgICAgZWxlbWVudE1hcC5mb3JFYWNoKChfLCBzKSA9PiBlbGVtZW50TWFwLmRlbGV0ZShzKSk7XG4gICAgICB0aGlzLmVsZW1lbnRNYXAuZGVsZXRlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0cmlnZ2VyIGFuIHVwZGF0ZSBmb3IgYSBnaXZlbiBlbGVtZW50IGFuZCBrZXkgKGUuZy4gbGF5b3V0KVxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICB0cmlnZ2VyVXBkYXRlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBicE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJwTWFwKSB7XG4gICAgICBjb25zdCB2YWx1ZU1hcCA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrZXkpO1xuICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwga2V5LCB2YWx1ZU1hcC5nZXQoa2V5KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWVNYXAuZm9yRWFjaCgodiwgaykgPT4gdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGssIHYpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDcm9zcy1yZWZlcmVuY2UgZm9yIEhUTUxFbGVtZW50IHdpdGggZGlyZWN0aXZlIGtleSAqL1xuICBwcml2YXRlIGJ1aWxkRWxlbWVudEtleU1hcChlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpIHtcbiAgICBsZXQga2V5TWFwID0gdGhpcy5lbGVtZW50S2V5TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoIWtleU1hcCkge1xuICAgICAga2V5TWFwID0gbmV3IFNldCgpO1xuICAgICAgdGhpcy5lbGVtZW50S2V5TWFwLnNldChlbGVtZW50LCBrZXlNYXApO1xuICAgIH1cbiAgICBrZXlNYXAuYWRkKGtleSk7XG4gIH1cblxuICAvKipcbiAgICogT3RoZXIgdHJpZ2dlcnMgdGhhdCBzaG91bGQgZm9yY2Ugc3R5bGUgdXBkYXRlczpcbiAgICogLSBkaXJlY3Rpb25hbGl0eVxuICAgKiAtIGxheW91dCBjaGFuZ2VzXG4gICAqIC0gbXV0YXRpb25vYnNlcnZlciB1cGRhdGVzXG4gICAqL1xuICBwcml2YXRlIHdhdGNoRXh0cmFUcmlnZ2VycyhlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJzOiBPYnNlcnZhYmxlPGFueT5bXSkge1xuICAgIGlmICh0cmlnZ2VycyAmJiB0cmlnZ2Vycy5sZW5ndGgpIHtcbiAgICAgIGxldCB3YXRjaGVycyA9IHRoaXMud2F0Y2hlck1hcC5nZXQoZWxlbWVudCk7XG4gICAgICBpZiAoIXdhdGNoZXJzKSB7XG4gICAgICAgIHdhdGNoZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLndhdGNoZXJNYXAuc2V0KGVsZW1lbnQsIHdhdGNoZXJzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHdhdGNoZXJzLmdldChrZXkpO1xuICAgICAgaWYgKCFzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgbmV3U3Vic2NyaXB0aW9uID0gbWVyZ2UoLi4udHJpZ2dlcnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5nZXRWYWx1ZShlbGVtZW50LCBrZXkpO1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrZXksIGN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3YXRjaGVycy5zZXQoa2V5LCBuZXdTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBCcmVha3BvaW50IGxvY2F0b3IgYnkgbWVkaWFRdWVyeSAqL1xuICBwcml2YXRlIGZpbmRCeVF1ZXJ5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShxdWVyeSk7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBmYWxsYmFjayBicmVha3BvaW50IGZvciBhIGdpdmVuIGVsZW1lbnQsIHN0YXJ0aW5nIHdpdGggdGhlIGN1cnJlbnQgYnJlYWtwb2ludFxuICAgKiBAcGFyYW0gYnBNYXBcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXA6IEJyZWFrcG9pbnRNYXAsIGtleT86IHN0cmluZyk6IFZhbHVlTWFwIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGFjdGl2YXRlZEJwID0gdGhpcy5hY3RpdmF0ZWRCcmVha3BvaW50c1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlTWFwID0gYnBNYXAuZ2V0KGFjdGl2YXRlZEJwLmFsaWFzKTtcbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwgKHZhbHVlTWFwLmhhcyhrZXkpICYmIHZhbHVlTWFwLmdldChrZXkpICE9IG51bGwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlTWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxhc3RIb3BlID0gYnBNYXAuZ2V0KCcnKTtcbiAgICByZXR1cm4gKGtleSA9PT0gdW5kZWZpbmVkIHx8IGxhc3RIb3BlICYmIGxhc3RIb3BlLmhhcyhrZXkpKSA/IGxhc3RIb3BlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIGZvciBtZWRpYVF1ZXJ5IGJyZWFrcG9pbnQgYWN0aXZhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgb2JzZXJ2ZUFjdGl2YXRpb25zKCkge1xuICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgYXMgdW5rbm93biBhcyBIb29rVGFyZ2V0O1xuICAgIGNvbnN0IHF1ZXJpZXMgPSB0aGlzLmJyZWFrcG9pbnRzLml0ZW1zLm1hcChicCA9PiBicC5tZWRpYVF1ZXJ5KTtcblxuICAgIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAub2JzZXJ2ZSh0aGlzLmhvb2sud2l0aFByaW50UXVlcnkocXVlcmllcykpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFwKHRoaXMuaG9vay5pbnRlcmNlcHRFdmVudHModGFyZ2V0KSksXG4gICAgICAgICAgICBmaWx0ZXIodGhpcy5ob29rLmJsb2NrUHJvcGFnYXRpb24oKSlcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKHRoaXMub25NZWRpYUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGluaXRCdWlsZGVyTWFwKG1hcDogQnVpbGRlck1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dD86IFVwZGF0ZUNhbGxiYWNrIHwgQ2xlYXJDYWxsYmFjayk6IHZvaWQge1xuICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGxldCBvbGRNYXAgPSBtYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICghb2xkTWFwKSB7XG4gICAgICBvbGRNYXAgPSBuZXcgTWFwKCk7XG4gICAgICBtYXAuc2V0KGVsZW1lbnQsIG9sZE1hcCk7XG4gICAgfVxuICAgIG9sZE1hcC5zZXQoa2V5LCBpbnB1dCk7XG4gIH1cbn1cblxuIl19