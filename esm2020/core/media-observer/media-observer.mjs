/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject, asapScheduler, of, distinctUntilChanged } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { mergeAlias } from '../add-alias';
import { MediaChange } from '../media-change';
import { sortDescendingPriority } from '../utils/sort';
import { coerceArray } from '../utils/array';
import * as i0 from "@angular/core";
import * as i1 from "../breakpoints/break-point-registry";
import * as i2 from "../match-media/match-media";
import * as i3 from "../media-marshaller/print-hook";
/**
 * MediaObserver enables applications to listen for 1..n mediaQuery activations and to determine
 * if a mediaQuery is currently activated.
 *
 * Since a breakpoint change will first deactivate 1...n mediaQueries and then possibly activate
 * 1..n mediaQueries, the MediaObserver will debounce notifications and report ALL *activations*
 * in 1 event notification. The reported activations will be sorted in descending priority order.
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * Note: Developers should note that only mediaChange activations (not de-activations)
 *       are announced by the MediaObserver.
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(mediaObserver: MediaObserver) {
 *      const media$ = mediaObserver.asObservable().pipe(
 *        filter((changes: MediaChange[]) => true)   // silly noop filter
 *      );
 *
 *      media$.subscribe((changes: MediaChange[]) => {
 *        let status = '';
 *        changes.forEach( change => {
 *          status += `'${change.mqAlias}' = (${change.mediaQuery}) <br/>` ;
 *        });
 *        this.status = status;
 *     });
 *
 *    }
 *  }
 */
export class MediaObserver {
    constructor(breakpoints, matchMedia, hook) {
        this.breakpoints = breakpoints;
        this.matchMedia = matchMedia;
        this.hook = hook;
        /** Filter MediaChange notifications for overlapping breakpoints */
        this.filterOverlaps = false;
        this.destroyed$ = new Subject();
        this._media$ = this.watchActivations();
    }
    /**
     * Completes the active subject, signalling to all complete for all
     * MediaObserver subscribers
     */
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    // ************************************************
    // Public Methods
    // ************************************************
    /**
     * Observe changes to current activation 'list'
     */
    asObservable() {
        return this._media$;
    }
    /**
     * Allow programmatic query to determine if one or more media query/alias match
     * the current viewport size.
     * @param value One or more media queries (or aliases) to check.
     * @returns Whether any of the media queries match.
     */
    isActive(value) {
        const aliases = splitQueries(coerceArray(value));
        return aliases.some(alias => {
            const query = toMediaQuery(alias, this.breakpoints);
            return query !== null && this.matchMedia.isActive(query);
        });
    }
    // ************************************************
    // Internal Methods
    // ************************************************
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    watchActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        return this.buildObservable(queries);
    }
    /**
     * Only pass/announce activations (not de-activations)
     *
     * Since multiple-mediaQueries can be activation in a cycle,
     * gather all current activations into a single list of changes to observers
     *
     * Inject associated (if any) alias information into the MediaChange event
     * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     * - Exclude print activations that do not have an associated mediaQuery
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    buildObservable(mqList) {
        const hasChanges = (changes) => {
            const isValidQuery = (change) => (change.mediaQuery.length > 0);
            return (changes.filter(isValidQuery).length > 0);
        };
        const excludeOverlaps = (changes) => {
            return !this.filterOverlaps ? changes : changes.filter(change => {
                const bp = this.breakpoints.findByQuery(change.mediaQuery);
                return bp?.overlapping ?? true;
            });
        };
        const ignoreDuplicates = (previous, current) => {
            if (previous.length !== current.length) {
                return false;
            }
            const previousMqs = previous.map(mc => mc.mediaQuery);
            const currentMqs = new Set(current.map(mc => mc.mediaQuery));
            const difference = new Set(previousMqs.filter(mq => !currentMqs.has(mq)));
            return difference.size === 0;
        };
        /**
         */
        return this.matchMedia
            .observe(this.hook.withPrintQuery(mqList))
            .pipe(filter((change) => change.matches), debounceTime(0, asapScheduler), switchMap(_ => of(this.findAllActivations())), map(excludeOverlaps), filter(hasChanges), distinctUntilChanged(ignoreDuplicates), takeUntil(this.destroyed$));
    }
    /**
     * Find all current activations and prepare single list of activations
     * sorted by descending priority.
     */
    findAllActivations() {
        const mergeMQAlias = (change) => {
            const bp = this.breakpoints.findByQuery(change.mediaQuery);
            return mergeAlias(change, bp);
        };
        const replaceWithPrintAlias = (change) => this.hook.isPrintEvent(change) ? this.hook.updateEvent(change) : change;
        return this.matchMedia
            .activations
            .map(query => new MediaChange(true, query))
            .map(replaceWithPrintAlias)
            .map(mergeMQAlias)
            .sort(sortDescendingPriority);
    }
}
MediaObserver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaObserver, deps: [{ token: i1.BreakPointRegistry }, { token: i2.MatchMedia }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable });
MediaObserver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaObserver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MediaObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.BreakPointRegistry }, { type: i2.MatchMedia }, { type: i3.PrintHook }]; } });
/**
 * Find associated breakpoint (if any)
 */
function toMediaQuery(query, locator) {
    const bp = locator.findByAlias(query) ?? locator.findByQuery(query);
    return bp?.mediaQuery ?? null;
}
/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries) {
    return queries.flatMap(query => query.split(','))
        .map(query => query.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUs1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdDRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBSXhCLFlBQXNCLFdBQStCLEVBQy9CLFVBQXNCLEVBQ3RCLElBQWU7UUFGZixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDL0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFXO1FBTHJDLG1FQUFtRTtRQUNuRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQWlJTixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQTVIaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7OztP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QVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDMUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO2FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDcEMsQ0FBQzs7MEdBaElVLGFBQWE7OEdBQWIsYUFBYSxjQURELE1BQU07MkZBQ2xCLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQXVJaEM7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxLQUFhLEVBQUUsT0FBMkI7SUFDOUQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sRUFBRSxFQUFFLFVBQVUsSUFBSSxJQUFJLENBQUM7QUFDaEMsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsWUFBWSxDQUFDLE9BQWlCO0lBQ3JDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDOUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3RhYmxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0LCBhc2FwU2NoZWR1bGVyLCBPYnNlcnZhYmxlLCBvZiwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIGZpbHRlciwgbWFwLCBzd2l0Y2hNYXAsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge21lcmdlQWxpYXN9IGZyb20gJy4uL2FkZC1hbGlhcyc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge1ByaW50SG9va30gZnJvbSAnLi4vbWVkaWEtbWFyc2hhbGxlci9wcmludC1ob29rJztcbmltcG9ydCB7QnJlYWtQb2ludFJlZ2lzdHJ5LCBPcHRpb25hbEJyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50LXJlZ2lzdHJ5JztcblxuaW1wb3J0IHtzb3J0RGVzY2VuZGluZ1ByaW9yaXR5fSBmcm9tICcuLi91dGlscy9zb3J0JztcbmltcG9ydCB7Y29lcmNlQXJyYXl9IGZyb20gJy4uL3V0aWxzL2FycmF5JztcblxuXG4vKipcbiAqIE1lZGlhT2JzZXJ2ZXIgZW5hYmxlcyBhcHBsaWNhdGlvbnMgdG8gbGlzdGVuIGZvciAxLi5uIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgYW5kIHRvIGRldGVybWluZVxuICogaWYgYSBtZWRpYVF1ZXJ5IGlzIGN1cnJlbnRseSBhY3RpdmF0ZWQuXG4gKlxuICogU2luY2UgYSBicmVha3BvaW50IGNoYW5nZSB3aWxsIGZpcnN0IGRlYWN0aXZhdGUgMS4uLm4gbWVkaWFRdWVyaWVzIGFuZCB0aGVuIHBvc3NpYmx5IGFjdGl2YXRlXG4gKiAxLi5uIG1lZGlhUXVlcmllcywgdGhlIE1lZGlhT2JzZXJ2ZXIgd2lsbCBkZWJvdW5jZSBub3RpZmljYXRpb25zIGFuZCByZXBvcnQgQUxMICphY3RpdmF0aW9ucypcbiAqIGluIDEgZXZlbnQgbm90aWZpY2F0aW9uLiBUaGUgcmVwb3J0ZWQgYWN0aXZhdGlvbnMgd2lsbCBiZSBzb3J0ZWQgaW4gZGVzY2VuZGluZyBwcmlvcml0eSBvcmRlci5cbiAqXG4gKiBUaGlzIGNsYXNzIHVzZXMgdGhlIEJyZWFrUG9pbnQgUmVnaXN0cnkgdG8gaW5qZWN0IGFsaWFzIGluZm9ybWF0aW9uIGludG8gdGhlIHJhdyBNZWRpYUNoYW5nZVxuICogbm90aWZpY2F0aW9uLiBGb3IgY3VzdG9tIG1lZGlhUXVlcnkgbm90aWZpY2F0aW9ucywgYWxpYXMgaW5mb3JtYXRpb24gd2lsbCBub3QgYmUgaW5qZWN0ZWQgYW5kXG4gKiB0aG9zZSBmaWVsZHMgd2lsbCBiZSAnJy5cbiAqXG4gKiBOb3RlOiBEZXZlbG9wZXJzIHNob3VsZCBub3RlIHRoYXQgb25seSBtZWRpYUNoYW5nZSBhY3RpdmF0aW9ucyAobm90IGRlLWFjdGl2YXRpb25zKVxuICogICAgICAgYXJlIGFubm91bmNlZCBieSB0aGUgTWVkaWFPYnNlcnZlci5cbiAqXG4gKiAgQHVzYWdlXG4gKlxuICogIC8vIFJ4SlNcbiAqICBpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiAgaW1wb3J0IHsgTWVkaWFPYnNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcbiAqXG4gKiAgQENvbXBvbmVudCh7IC4uLiB9KVxuICogIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICogICAgc3RhdHVzOiBzdHJpbmcgPSAnJztcbiAqXG4gKiAgICBjb25zdHJ1Y3RvcihtZWRpYU9ic2VydmVyOiBNZWRpYU9ic2VydmVyKSB7XG4gKiAgICAgIGNvbnN0IG1lZGlhJCA9IG1lZGlhT2JzZXJ2ZXIuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAqICAgICAgICBmaWx0ZXIoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHRydWUpICAgLy8gc2lsbHkgbm9vcCBmaWx0ZXJcbiAqICAgICAgKTtcbiAqXG4gKiAgICAgIG1lZGlhJC5zdWJzY3JpYmUoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAqICAgICAgICBsZXQgc3RhdHVzID0gJyc7XG4gKiAgICAgICAgY2hhbmdlcy5mb3JFYWNoKCBjaGFuZ2UgPT4ge1xuICogICAgICAgICAgc3RhdHVzICs9IGAnJHtjaGFuZ2UubXFBbGlhc30nID0gKCR7Y2hhbmdlLm1lZGlhUXVlcnl9KSA8YnIvPmAgO1xuICogICAgICAgIH0pO1xuICogICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICogICAgIH0pO1xuICpcbiAqICAgIH1cbiAqICB9XG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1lZGlhT2JzZXJ2ZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogRmlsdGVyIE1lZGlhQ2hhbmdlIG5vdGlmaWNhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIGJyZWFrcG9pbnRzICovXG4gIGZpbHRlck92ZXJsYXBzID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnksXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBtYXRjaE1lZGlhOiBNYXRjaE1lZGlhLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaG9vazogUHJpbnRIb29rKSB7XG4gICAgdGhpcy5fbWVkaWEkID0gdGhpcy53YXRjaEFjdGl2YXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGxldGVzIHRoZSBhY3RpdmUgc3ViamVjdCwgc2lnbmFsbGluZyB0byBhbGwgY29tcGxldGUgZm9yIGFsbFxuICAgKiBNZWRpYU9ic2VydmVyIHN1YnNjcmliZXJzXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZCQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveWVkJC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFB1YmxpYyBNZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBPYnNlcnZlIGNoYW5nZXMgdG8gY3VycmVudCBhY3RpdmF0aW9uICdsaXN0J1xuICAgKi9cbiAgYXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2VbXT4ge1xuICAgIHJldHVybiB0aGlzLl9tZWRpYSQ7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgcHJvZ3JhbW1hdGljIHF1ZXJ5IHRvIGRldGVybWluZSBpZiBvbmUgb3IgbW9yZSBtZWRpYSBxdWVyeS9hbGlhcyBtYXRjaFxuICAgKiB0aGUgY3VycmVudCB2aWV3cG9ydCBzaXplLlxuICAgKiBAcGFyYW0gdmFsdWUgT25lIG9yIG1vcmUgbWVkaWEgcXVlcmllcyAob3IgYWxpYXNlcykgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgYW55IG9mIHRoZSBtZWRpYSBxdWVyaWVzIG1hdGNoLlxuICAgKi9cbiAgaXNBY3RpdmUodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWxpYXNlcyA9IHNwbGl0UXVlcmllcyhjb2VyY2VBcnJheSh2YWx1ZSkpO1xuICAgIHJldHVybiBhbGlhc2VzLnNvbWUoYWxpYXMgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0b01lZGlhUXVlcnkoYWxpYXMsIHRoaXMuYnJlYWtwb2ludHMpO1xuICAgICAgcmV0dXJuIHF1ZXJ5ICE9PSBudWxsICYmIHRoaXMubWF0Y2hNZWRpYS5pc0FjdGl2ZShxdWVyeSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gSW50ZXJuYWwgTWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYWxsIHRoZSBtZWRpYVF1ZXJpZXMgcmVnaXN0ZXJlZCBpbiB0aGUgQnJlYWtQb2ludFJlZ2lzdHJ5XG4gICAqIFRoaXMgaXMgbmVlZGVkIHNvIHN1YnNjcmliZXJzIGNhbiBiZSBhdXRvLW5vdGlmaWVkIG9mIGFsbCBzdGFuZGFyZCwgcmVnaXN0ZXJlZFxuICAgKiBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zXG4gICAqL1xuICBwcml2YXRlIHdhdGNoQWN0aXZhdGlvbnMoKSB7XG4gICAgY29uc3QgcXVlcmllcyA9IHRoaXMuYnJlYWtwb2ludHMuaXRlbXMubWFwKGJwID0+IGJwLm1lZGlhUXVlcnkpO1xuICAgIHJldHVybiB0aGlzLmJ1aWxkT2JzZXJ2YWJsZShxdWVyaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbmx5IHBhc3MvYW5ub3VuY2UgYWN0aXZhdGlvbnMgKG5vdCBkZS1hY3RpdmF0aW9ucylcbiAgICpcbiAgICogU2luY2UgbXVsdGlwbGUtbWVkaWFRdWVyaWVzIGNhbiBiZSBhY3RpdmF0aW9uIGluIGEgY3ljbGUsXG4gICAqIGdhdGhlciBhbGwgY3VycmVudCBhY3RpdmF0aW9ucyBpbnRvIGEgc2luZ2xlIGxpc3Qgb2YgY2hhbmdlcyB0byBvYnNlcnZlcnNcbiAgICpcbiAgICogSW5qZWN0IGFzc29jaWF0ZWQgKGlmIGFueSkgYWxpYXMgaW5mb3JtYXRpb24gaW50byB0aGUgTWVkaWFDaGFuZ2UgZXZlbnRcbiAgICogLSBFeGNsdWRlIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIG1Rcy4gTGlzdCBib3VuZGVkIG1RIHJhbmdlcyBvbmx5XG4gICAqIC0gRXhjbHVkZSBwcmludCBhY3RpdmF0aW9ucyB0aGF0IGRvIG5vdCBoYXZlIGFuIGFzc29jaWF0ZWQgbWVkaWFRdWVyeVxuICAgKlxuICAgKiBOT1RFOiB0aGUgcmF3IE1lZGlhQ2hhbmdlIGV2ZW50cyBbZnJvbSBNYXRjaE1lZGlhXSBkbyBub3RcbiAgICogICAgICAgY29udGFpbiBpbXBvcnRhbnQgYWxpYXMgaW5mb3JtYXRpb247IGFzIHN1Y2ggdGhpcyBpbmZvXG4gICAqICAgICAgIG11c3QgYmUgaW5qZWN0ZWQgaW50byB0aGUgTWVkaWFDaGFuZ2VcbiAgICovXG4gIHByaXZhdGUgYnVpbGRPYnNlcnZhYmxlKG1xTGlzdDogc3RyaW5nW10pOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+IHtcbiAgICBjb25zdCBoYXNDaGFuZ2VzID0gKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAgICAgIGNvbnN0IGlzVmFsaWRRdWVyeSA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiAoY2hhbmdlLm1lZGlhUXVlcnkubGVuZ3RoID4gMCk7XG4gICAgICByZXR1cm4gKGNoYW5nZXMuZmlsdGVyKGlzVmFsaWRRdWVyeSkubGVuZ3RoID4gMCk7XG4gICAgfTtcbiAgICBjb25zdCBleGNsdWRlT3ZlcmxhcHMgPSAoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgcmV0dXJuICF0aGlzLmZpbHRlck92ZXJsYXBzID8gY2hhbmdlcyA6IGNoYW5nZXMuZmlsdGVyKGNoYW5nZSA9PiB7XG4gICAgICAgIGNvbnN0IGJwID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShjaGFuZ2UubWVkaWFRdWVyeSk7XG4gICAgICAgIHJldHVybiBicD8ub3ZlcmxhcHBpbmcgPz8gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaWdub3JlRHVwbGljYXRlcyA9IChwcmV2aW91czogTWVkaWFDaGFuZ2VbXSwgY3VycmVudDogTWVkaWFDaGFuZ2VbXSk6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHByZXZpb3VzLmxlbmd0aCAhPT0gY3VycmVudC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcmV2aW91c01xcyA9IHByZXZpb3VzLm1hcChtYyA9PiBtYy5tZWRpYVF1ZXJ5KTtcbiAgICAgIGNvbnN0IGN1cnJlbnRNcXMgPSBuZXcgU2V0KGN1cnJlbnQubWFwKG1jID0+IG1jLm1lZGlhUXVlcnkpKTtcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBuZXcgU2V0KHByZXZpb3VzTXFzLmZpbHRlcihtcSA9PiAhY3VycmVudE1xcy5oYXMobXEpKSk7XG5cbiAgICAgIHJldHVybiBkaWZmZXJlbmNlLnNpemUgPT09IDA7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLm9ic2VydmUodGhpcy5ob29rLndpdGhQcmludFF1ZXJ5KG1xTGlzdCkpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiBjaGFuZ2UubWF0Y2hlcyksXG4gICAgICAgICAgICBkZWJvdW5jZVRpbWUoMCwgYXNhcFNjaGVkdWxlciksXG4gICAgICAgICAgICBzd2l0Y2hNYXAoXyA9PiBvZih0aGlzLmZpbmRBbGxBY3RpdmF0aW9ucygpKSksXG4gICAgICAgICAgICBtYXAoZXhjbHVkZU92ZXJsYXBzKSxcbiAgICAgICAgICAgIGZpbHRlcihoYXNDaGFuZ2VzKSxcbiAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKGlnbm9yZUR1cGxpY2F0ZXMpLFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJClcbiAgICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGFuZCBwcmVwYXJlIHNpbmdsZSBsaXN0IG9mIGFjdGl2YXRpb25zXG4gICAqIHNvcnRlZCBieSBkZXNjZW5kaW5nIHByaW9yaXR5LlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kQWxsQWN0aXZhdGlvbnMoKTogTWVkaWFDaGFuZ2VbXSB7XG4gICAgY29uc3QgbWVyZ2VNUUFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGNvbnN0IGJwOiBPcHRpb25hbEJyZWFrUG9pbnQgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGNoYW5nZS5tZWRpYVF1ZXJ5KTtcbiAgICAgIHJldHVybiBtZXJnZUFsaWFzKGNoYW5nZSwgYnApO1xuICAgIH07XG4gICAgY29uc3QgcmVwbGFjZVdpdGhQcmludEFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+XG4gICAgICB0aGlzLmhvb2suaXNQcmludEV2ZW50KGNoYW5nZSkgPyB0aGlzLmhvb2sudXBkYXRlRXZlbnQoY2hhbmdlKSA6IGNoYW5nZTtcblxuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLmFjdGl2YXRpb25zXG4gICAgICAgIC5tYXAocXVlcnkgPT4gbmV3IE1lZGlhQ2hhbmdlKHRydWUsIHF1ZXJ5KSlcbiAgICAgICAgLm1hcChyZXBsYWNlV2l0aFByaW50QWxpYXMpXG4gICAgICAgIC5tYXAobWVyZ2VNUUFsaWFzKVxuICAgICAgICAuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX21lZGlhJDogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPjtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFzc29jaWF0ZWQgYnJlYWtwb2ludCAoaWYgYW55KVxuICovXG5mdW5jdGlvbiB0b01lZGlhUXVlcnkocXVlcnk6IHN0cmluZywgbG9jYXRvcjogQnJlYWtQb2ludFJlZ2lzdHJ5KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJwID0gbG9jYXRvci5maW5kQnlBbGlhcyhxdWVyeSkgPz8gbG9jYXRvci5maW5kQnlRdWVyeShxdWVyeSk7XG4gIHJldHVybiBicD8ubWVkaWFRdWVyeSA/PyBudWxsO1xufVxuXG4vKipcbiAqIFNwbGl0IGVhY2ggcXVlcnkgc3RyaW5nIGludG8gc2VwYXJhdGUgcXVlcnkgc3RyaW5ncyBpZiB0d28gcXVlcmllcyBhcmUgcHJvdmlkZWQgYXMgY29tbWFcbiAqIHNlcGFyYXRlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXRRdWVyaWVzKHF1ZXJpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gcXVlcmllcy5mbGF0TWFwKHF1ZXJ5ID0+IHF1ZXJ5LnNwbGl0KCcsJykpXG4gICAgLm1hcChxdWVyeSA9PiBxdWVyeS50cmltKCkpO1xufVxuIl19