/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject, asapScheduler, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, } from 'rxjs/operators';
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
        this.media$ = this._media$.pipe(filter((changes) => changes.length > 0), map((changes) => changes[0]));
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
        const replaceWithPrintAlias = (change) => {
            return this.hook.isPrintEvent(change) ? this.hook.updateEvent(change) : change;
        };
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
    return queries.map((query) => query.split(','))
        .reduce((a1, a2) => a1.concat(a2))
        .map(query => query.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUNMLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLEdBQUcsRUFDSCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFLNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQVl4QixZQUFzQixXQUErQixFQUMvQixVQUFzQixFQUN0QixJQUFlO1FBRmYsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQy9CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBVztRQUxyQyxtRUFBbUU7UUFDbkUsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFzSU4sZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFqSWhELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1B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RUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3RhYmxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0LCBhc2FwU2NoZWR1bGVyLCBPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHttZXJnZUFsaWFzfSBmcm9tICcuLi9hZGQtYWxpYXMnO1xuaW1wb3J0IHtNZWRpYUNoYW5nZX0gZnJvbSAnLi4vbWVkaWEtY2hhbmdlJztcbmltcG9ydCB7TWF0Y2hNZWRpYX0gZnJvbSAnLi4vbWF0Y2gtbWVkaWEvbWF0Y2gtbWVkaWEnO1xuaW1wb3J0IHtQcmludEhvb2t9IGZyb20gJy4uL21lZGlhLW1hcnNoYWxsZXIvcHJpbnQtaG9vayc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeSwgT3B0aW9uYWxCcmVha1BvaW50fSBmcm9tICcuLi9icmVha3BvaW50cy9icmVhay1wb2ludC1yZWdpc3RyeSc7XG5cbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge2NvZXJjZUFycmF5fSBmcm9tICcuLi91dGlscy9hcnJheSc7XG5cblxuLyoqXG4gKiBNZWRpYU9ic2VydmVyIGVuYWJsZXMgYXBwbGljYXRpb25zIHRvIGxpc3RlbiBmb3IgMS4ubiBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIGFuZCB0byBkZXRlcm1pbmVcbiAqIGlmIGEgbWVkaWFRdWVyeSBpcyBjdXJyZW50bHkgYWN0aXZhdGVkLlxuICpcbiAqIFNpbmNlIGEgYnJlYWtwb2ludCBjaGFuZ2Ugd2lsbCBmaXJzdCBkZWFjdGl2YXRlIDEuLi5uIG1lZGlhUXVlcmllcyBhbmQgdGhlbiBwb3NzaWJseSBhY3RpdmF0ZVxuICogMS4ubiBtZWRpYVF1ZXJpZXMsIHRoZSBNZWRpYU9ic2VydmVyIHdpbGwgZGVib3VuY2Ugbm90aWZpY2F0aW9ucyBhbmQgcmVwb3J0IEFMTCAqYWN0aXZhdGlvbnMqXG4gKiBpbiAxIGV2ZW50IG5vdGlmaWNhdGlvbi4gVGhlIHJlcG9ydGVkIGFjdGl2YXRpb25zIHdpbGwgYmUgc29ydGVkIGluIGRlc2NlbmRpbmcgcHJpb3JpdHkgb3JkZXIuXG4gKlxuICogVGhpcyBjbGFzcyB1c2VzIHRoZSBCcmVha1BvaW50IFJlZ2lzdHJ5IHRvIGluamVjdCBhbGlhcyBpbmZvcm1hdGlvbiBpbnRvIHRoZSByYXcgTWVkaWFDaGFuZ2VcbiAqIG5vdGlmaWNhdGlvbi4gRm9yIGN1c3RvbSBtZWRpYVF1ZXJ5IG5vdGlmaWNhdGlvbnMsIGFsaWFzIGluZm9ybWF0aW9uIHdpbGwgbm90IGJlIGluamVjdGVkIGFuZFxuICogdGhvc2UgZmllbGRzIHdpbGwgYmUgJycuXG4gKlxuICogTm90ZTogRGV2ZWxvcGVycyBzaG91bGQgbm90ZSB0aGF0IG9ubHkgbWVkaWFDaGFuZ2UgYWN0aXZhdGlvbnMgKG5vdCBkZS1hY3RpdmF0aW9ucylcbiAqICAgICAgIGFyZSBhbm5vdW5jZWQgYnkgdGhlIE1lZGlhT2JzZXJ2ZXIuXG4gKlxuICogIEB1c2FnZVxuICpcbiAqICAvLyBSeEpTXG4gKiAgaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogIGltcG9ydCB7IE1lZGlhT2JzZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG4gKlxuICogIEBDb21wb25lbnQoeyAuLi4gfSlcbiAqICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAqICAgIHN0YXR1czogc3RyaW5nID0gJyc7XG4gKlxuICogICAgY29uc3RydWN0b3IobWVkaWFPYnNlcnZlcjogTWVkaWFPYnNlcnZlcikge1xuICogICAgICBjb25zdCBtZWRpYSQgPSBtZWRpYU9ic2VydmVyLmFzT2JzZXJ2YWJsZSgpLnBpcGUoXG4gKiAgICAgICAgZmlsdGVyKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB0cnVlKSAgIC8vIHNpbGx5IG5vb3AgZmlsdGVyXG4gKiAgICAgICk7XG4gKlxuICogICAgICBtZWRpYSQuc3Vic2NyaWJlKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gKiAgICAgICAgbGV0IHN0YXR1cyA9ICcnO1xuICogICAgICAgIGNoYW5nZXMuZm9yRWFjaCggY2hhbmdlID0+IHtcbiAqICAgICAgICAgIHN0YXR1cyArPSBgJyR7Y2hhbmdlLm1xQWxpYXN9JyA9ICgke2NoYW5nZS5tZWRpYVF1ZXJ5fSkgPGJyLz5gIDtcbiAqICAgICAgICB9KTtcbiAqICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAqICAgICB9KTtcbiAqXG4gKiAgICB9XG4gKiAgfVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNZWRpYU9ic2VydmVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhc09ic2VydmFibGUoKWAgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMC1iZXRhLjI1XG4gICAqIEBkZWxldGlvbi10YXJnZXQgMTAuMC4wXG4gICAqL1xuICByZWFkb25seSBtZWRpYSQ6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+O1xuXG4gIC8qKiBGaWx0ZXIgTWVkaWFDaGFuZ2Ugbm90aWZpY2F0aW9ucyBmb3Igb3ZlcmxhcHBpbmcgYnJlYWtwb2ludHMgKi9cbiAgZmlsdGVyT3ZlcmxhcHMgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRSZWdpc3RyeSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIG1hdGNoTWVkaWE6IE1hdGNoTWVkaWEsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBob29rOiBQcmludEhvb2spIHtcbiAgICB0aGlzLl9tZWRpYSQgPSB0aGlzLndhdGNoQWN0aXZhdGlvbnMoKTtcbiAgICB0aGlzLm1lZGlhJCA9IHRoaXMuX21lZGlhJC5waXBlKFxuICAgICAgZmlsdGVyKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiBjaGFuZ2VzLmxlbmd0aCA+IDApLFxuICAgICAgbWFwKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiBjaGFuZ2VzWzBdKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcGxldGVzIHRoZSBhY3RpdmUgc3ViamVjdCwgc2lnbmFsbGluZyB0byBhbGwgY29tcGxldGUgZm9yIGFsbFxuICAgKiBNZWRpYU9ic2VydmVyIHN1YnNjcmliZXJzXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZCQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveWVkJC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFB1YmxpYyBNZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBPYnNlcnZlIGNoYW5nZXMgdG8gY3VycmVudCBhY3RpdmF0aW9uICdsaXN0J1xuICAgKi9cbiAgYXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2VbXT4ge1xuICAgIHJldHVybiB0aGlzLl9tZWRpYSQ7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgcHJvZ3JhbW1hdGljIHF1ZXJ5IHRvIGRldGVybWluZSBpZiBvbmUgb3IgbW9yZSBtZWRpYSBxdWVyeS9hbGlhcyBtYXRjaFxuICAgKiB0aGUgY3VycmVudCB2aWV3cG9ydCBzaXplLlxuICAgKiBAcGFyYW0gdmFsdWUgT25lIG9yIG1vcmUgbWVkaWEgcXVlcmllcyAob3IgYWxpYXNlcykgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgYW55IG9mIHRoZSBtZWRpYSBxdWVyaWVzIG1hdGNoLlxuICAgKi9cbiAgaXNBY3RpdmUodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgYWxpYXNlcyA9IHNwbGl0UXVlcmllcyhjb2VyY2VBcnJheSh2YWx1ZSkpO1xuICAgIHJldHVybiBhbGlhc2VzLnNvbWUoYWxpYXMgPT4ge1xuICAgICAgY29uc3QgcXVlcnkgPSB0b01lZGlhUXVlcnkoYWxpYXMsIHRoaXMuYnJlYWtwb2ludHMpO1xuICAgICAgcmV0dXJuIHF1ZXJ5ICE9PSBudWxsICYmIHRoaXMubWF0Y2hNZWRpYS5pc0FjdGl2ZShxdWVyeSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gSW50ZXJuYWwgTWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYWxsIHRoZSBtZWRpYVF1ZXJpZXMgcmVnaXN0ZXJlZCBpbiB0aGUgQnJlYWtQb2ludFJlZ2lzdHJ5XG4gICAqIFRoaXMgaXMgbmVlZGVkIHNvIHN1YnNjcmliZXJzIGNhbiBiZSBhdXRvLW5vdGlmaWVkIG9mIGFsbCBzdGFuZGFyZCwgcmVnaXN0ZXJlZFxuICAgKiBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zXG4gICAqL1xuICBwcml2YXRlIHdhdGNoQWN0aXZhdGlvbnMoKSB7XG4gICAgY29uc3QgcXVlcmllcyA9IHRoaXMuYnJlYWtwb2ludHMuaXRlbXMubWFwKGJwID0+IGJwLm1lZGlhUXVlcnkpO1xuICAgIHJldHVybiB0aGlzLmJ1aWxkT2JzZXJ2YWJsZShxdWVyaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbmx5IHBhc3MvYW5ub3VuY2UgYWN0aXZhdGlvbnMgKG5vdCBkZS1hY3RpdmF0aW9ucylcbiAgICpcbiAgICogU2luY2UgbXVsdGlwbGUtbWVkaWFRdWVyaWVzIGNhbiBiZSBhY3RpdmF0aW9uIGluIGEgY3ljbGUsXG4gICAqIGdhdGhlciBhbGwgY3VycmVudCBhY3RpdmF0aW9ucyBpbnRvIGEgc2luZ2xlIGxpc3Qgb2YgY2hhbmdlcyB0byBvYnNlcnZlcnNcbiAgICpcbiAgICogSW5qZWN0IGFzc29jaWF0ZWQgKGlmIGFueSkgYWxpYXMgaW5mb3JtYXRpb24gaW50byB0aGUgTWVkaWFDaGFuZ2UgZXZlbnRcbiAgICogLSBFeGNsdWRlIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIG1Rcy4gTGlzdCBib3VuZGVkIG1RIHJhbmdlcyBvbmx5XG4gICAqIC0gRXhjbHVkZSBwcmludCBhY3RpdmF0aW9ucyB0aGF0IGRvIG5vdCBoYXZlIGFuIGFzc29jaWF0ZWQgbWVkaWFRdWVyeVxuICAgKlxuICAgKiBOT1RFOiB0aGUgcmF3IE1lZGlhQ2hhbmdlIGV2ZW50cyBbZnJvbSBNYXRjaE1lZGlhXSBkbyBub3RcbiAgICogICAgICAgY29udGFpbiBpbXBvcnRhbnQgYWxpYXMgaW5mb3JtYXRpb247IGFzIHN1Y2ggdGhpcyBpbmZvXG4gICAqICAgICAgIG11c3QgYmUgaW5qZWN0ZWQgaW50byB0aGUgTWVkaWFDaGFuZ2VcbiAgICovXG4gIHByaXZhdGUgYnVpbGRPYnNlcnZhYmxlKG1xTGlzdDogc3RyaW5nW10pOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+IHtcbiAgICBjb25zdCBoYXNDaGFuZ2VzID0gKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAgICAgIGNvbnN0IGlzVmFsaWRRdWVyeSA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiAoY2hhbmdlLm1lZGlhUXVlcnkubGVuZ3RoID4gMCk7XG4gICAgICByZXR1cm4gKGNoYW5nZXMuZmlsdGVyKGlzVmFsaWRRdWVyeSkubGVuZ3RoID4gMCk7XG4gICAgfTtcbiAgICBjb25zdCBleGNsdWRlT3ZlcmxhcHMgPSAoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgcmV0dXJuICF0aGlzLmZpbHRlck92ZXJsYXBzID8gY2hhbmdlcyA6IGNoYW5nZXMuZmlsdGVyKGNoYW5nZSA9PiB7XG4gICAgICAgIGNvbnN0IGJwID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShjaGFuZ2UubWVkaWFRdWVyeSk7XG4gICAgICAgIHJldHVybiBicD8ub3ZlcmxhcHBpbmcgPz8gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgaWdub3JlRHVwbGljYXRlcyA9IChwcmV2aW91czogTWVkaWFDaGFuZ2VbXSwgY3VycmVudDogTWVkaWFDaGFuZ2VbXSk6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHByZXZpb3VzLmxlbmd0aCAhPT0gY3VycmVudC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBwcmV2aW91c01xcyA9IHByZXZpb3VzLm1hcChtYyA9PiBtYy5tZWRpYVF1ZXJ5KTtcbiAgICAgIGNvbnN0IGN1cnJlbnRNcXMgPSBuZXcgU2V0KGN1cnJlbnQubWFwKG1jID0+IG1jLm1lZGlhUXVlcnkpKTtcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBuZXcgU2V0KHByZXZpb3VzTXFzLmZpbHRlcihtcSA9PiAhY3VycmVudE1xcy5oYXMobXEpKSk7XG5cbiAgICAgIHJldHVybiBkaWZmZXJlbmNlLnNpemUgPT09IDA7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqL1xuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLm9ic2VydmUodGhpcy5ob29rLndpdGhQcmludFF1ZXJ5KG1xTGlzdCkpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiBjaGFuZ2UubWF0Y2hlcyksXG4gICAgICAgICAgICBkZWJvdW5jZVRpbWUoMCwgYXNhcFNjaGVkdWxlciksXG4gICAgICAgICAgICBzd2l0Y2hNYXAoXyA9PiBvZih0aGlzLmZpbmRBbGxBY3RpdmF0aW9ucygpKSksXG4gICAgICAgICAgICBtYXAoZXhjbHVkZU92ZXJsYXBzKSxcbiAgICAgICAgICAgIGZpbHRlcihoYXNDaGFuZ2VzKSxcbiAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKGlnbm9yZUR1cGxpY2F0ZXMpLFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJClcbiAgICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGFuZCBwcmVwYXJlIHNpbmdsZSBsaXN0IG9mIGFjdGl2YXRpb25zXG4gICAqIHNvcnRlZCBieSBkZXNjZW5kaW5nIHByaW9yaXR5LlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kQWxsQWN0aXZhdGlvbnMoKTogTWVkaWFDaGFuZ2VbXSB7XG4gICAgY29uc3QgbWVyZ2VNUUFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGNvbnN0IGJwOiBPcHRpb25hbEJyZWFrUG9pbnQgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGNoYW5nZS5tZWRpYVF1ZXJ5KTtcbiAgICAgIHJldHVybiBtZXJnZUFsaWFzKGNoYW5nZSwgYnApO1xuICAgIH07XG4gICAgY29uc3QgcmVwbGFjZVdpdGhQcmludEFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhvb2suaXNQcmludEV2ZW50KGNoYW5nZSkgPyB0aGlzLmhvb2sudXBkYXRlRXZlbnQoY2hhbmdlKSA6IGNoYW5nZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAuYWN0aXZhdGlvbnNcbiAgICAgICAgLm1hcChxdWVyeSA9PiBuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgcXVlcnkpKVxuICAgICAgICAubWFwKHJlcGxhY2VXaXRoUHJpbnRBbGlhcylcbiAgICAgICAgLm1hcChtZXJnZU1RQWxpYXMpXG4gICAgICAgIC5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfbWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+O1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xufVxuXG4vKipcbiAqIEZpbmQgYXNzb2NpYXRlZCBicmVha3BvaW50IChpZiBhbnkpXG4gKi9cbmZ1bmN0aW9uIHRvTWVkaWFRdWVyeShxdWVyeTogc3RyaW5nLCBsb2NhdG9yOiBCcmVha1BvaW50UmVnaXN0cnkpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYnAgPSBsb2NhdG9yLmZpbmRCeUFsaWFzKHF1ZXJ5KSA/PyBsb2NhdG9yLmZpbmRCeVF1ZXJ5KHF1ZXJ5KTtcbiAgcmV0dXJuIGJwPy5tZWRpYVF1ZXJ5ID8/IG51bGw7XG59XG5cbi8qKlxuICogU3BsaXQgZWFjaCBxdWVyeSBzdHJpbmcgaW50byBzZXBhcmF0ZSBxdWVyeSBzdHJpbmdzIGlmIHR3byBxdWVyaWVzIGFyZSBwcm92aWRlZCBhcyBjb21tYVxuICogc2VwYXJhdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdFF1ZXJpZXMocXVlcmllczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBxdWVyaWVzLm1hcCgocXVlcnk6IHN0cmluZykgPT4gcXVlcnkuc3BsaXQoJywnKSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhMTogc3RyaW5nW10sIGEyOiBzdHJpbmdbXSkgPT4gYTEuY29uY2F0KGEyKSlcbiAgICAgICAgICAgICAgICAubWFwKHF1ZXJ5ID0+IHF1ZXJ5LnRyaW0oKSk7XG59XG4iXX0=