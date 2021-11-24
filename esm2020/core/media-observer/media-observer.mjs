/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject, asapScheduler, of } from 'rxjs';
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
                return !bp ? true : !bp.overlapping;
            });
        };
        /**
         */
        return this.matchMedia
            .observe(this.hook.withPrintQuery(mqList))
            .pipe(filter((change) => change.matches), debounceTime(0, asapScheduler), switchMap(_ => of(this.findAllActivations())), map(excludeOverlaps), filter(hasChanges), takeUntil(this.destroyed$));
    }
    /**
     * Find all current activations and prepare single list of activations
     * sorted by descending priority.
     */
    findAllActivations() {
        const mergeMQAlias = (change) => {
            let bp = this.breakpoints.findByQuery(change.mediaQuery);
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
    const bp = locator.findByAlias(query) || locator.findByQuery(query);
    return bp ? bp.mediaQuery : null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUs1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdDRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBWXhCLFlBQXNCLFdBQStCLEVBQy9CLFVBQXNCLEVBQ3RCLElBQWU7UUFGZixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDL0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFXO1FBTHJDLG1FQUFtRTtRQUNuRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQTBITixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQXJIaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUks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QUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbkMsQ0FBQztBQUVEOzs7R0FHRztBQUNILFNBQVMsWUFBWSxDQUFDLE9BQWlCO0lBQ3JDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN4QyxNQUFNLENBQUMsQ0FBQyxFQUFZLEVBQUUsRUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3JELEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgYXNhcFNjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWUsIGZpbHRlciwgbWFwLCBzd2l0Y2hNYXAsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge21lcmdlQWxpYXN9IGZyb20gJy4uL2FkZC1hbGlhcyc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge1ByaW50SG9va30gZnJvbSAnLi4vbWVkaWEtbWFyc2hhbGxlci9wcmludC1ob29rJztcbmltcG9ydCB7QnJlYWtQb2ludFJlZ2lzdHJ5LCBPcHRpb25hbEJyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50LXJlZ2lzdHJ5JztcblxuaW1wb3J0IHtzb3J0RGVzY2VuZGluZ1ByaW9yaXR5fSBmcm9tICcuLi91dGlscy9zb3J0JztcbmltcG9ydCB7Y29lcmNlQXJyYXl9IGZyb20gJy4uL3V0aWxzL2FycmF5JztcblxuXG4vKipcbiAqIE1lZGlhT2JzZXJ2ZXIgZW5hYmxlcyBhcHBsaWNhdGlvbnMgdG8gbGlzdGVuIGZvciAxLi5uIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgYW5kIHRvIGRldGVybWluZVxuICogaWYgYSBtZWRpYVF1ZXJ5IGlzIGN1cnJlbnRseSBhY3RpdmF0ZWQuXG4gKlxuICogU2luY2UgYSBicmVha3BvaW50IGNoYW5nZSB3aWxsIGZpcnN0IGRlYWN0aXZhdGUgMS4uLm4gbWVkaWFRdWVyaWVzIGFuZCB0aGVuIHBvc3NpYmx5IGFjdGl2YXRlXG4gKiAxLi5uIG1lZGlhUXVlcmllcywgdGhlIE1lZGlhT2JzZXJ2ZXIgd2lsbCBkZWJvdW5jZSBub3RpZmljYXRpb25zIGFuZCByZXBvcnQgQUxMICphY3RpdmF0aW9ucypcbiAqIGluIDEgZXZlbnQgbm90aWZpY2F0aW9uLiBUaGUgcmVwb3J0ZWQgYWN0aXZhdGlvbnMgd2lsbCBiZSBzb3J0ZWQgaW4gZGVzY2VuZGluZyBwcmlvcml0eSBvcmRlci5cbiAqXG4gKiBUaGlzIGNsYXNzIHVzZXMgdGhlIEJyZWFrUG9pbnQgUmVnaXN0cnkgdG8gaW5qZWN0IGFsaWFzIGluZm9ybWF0aW9uIGludG8gdGhlIHJhdyBNZWRpYUNoYW5nZVxuICogbm90aWZpY2F0aW9uLiBGb3IgY3VzdG9tIG1lZGlhUXVlcnkgbm90aWZpY2F0aW9ucywgYWxpYXMgaW5mb3JtYXRpb24gd2lsbCBub3QgYmUgaW5qZWN0ZWQgYW5kXG4gKiB0aG9zZSBmaWVsZHMgd2lsbCBiZSAnJy5cbiAqXG4gKiBOb3RlOiBEZXZlbG9wZXJzIHNob3VsZCBub3RlIHRoYXQgb25seSBtZWRpYUNoYW5nZSBhY3RpdmF0aW9ucyAobm90IGRlLWFjdGl2YXRpb25zKVxuICogICAgICAgYXJlIGFubm91bmNlZCBieSB0aGUgTWVkaWFPYnNlcnZlci5cbiAqXG4gKiAgQHVzYWdlXG4gKlxuICogIC8vIFJ4SlNcbiAqICBpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiAgaW1wb3J0IHsgTWVkaWFPYnNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcbiAqXG4gKiAgQENvbXBvbmVudCh7IC4uLiB9KVxuICogIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICogICAgc3RhdHVzOiBzdHJpbmcgPSAnJztcbiAqXG4gKiAgICBjb25zdHJ1Y3RvcihtZWRpYU9ic2VydmVyOiBNZWRpYU9ic2VydmVyKSB7XG4gKiAgICAgIGNvbnN0IG1lZGlhJCA9IG1lZGlhT2JzZXJ2ZXIuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAqICAgICAgICBmaWx0ZXIoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHRydWUpICAgLy8gc2lsbHkgbm9vcCBmaWx0ZXJcbiAqICAgICAgKTtcbiAqXG4gKiAgICAgIG1lZGlhJC5zdWJzY3JpYmUoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAqICAgICAgICBsZXQgc3RhdHVzID0gJyc7XG4gKiAgICAgICAgY2hhbmdlcy5mb3JFYWNoKCBjaGFuZ2UgPT4ge1xuICogICAgICAgICAgc3RhdHVzICs9IGAnJHtjaGFuZ2UubXFBbGlhc30nID0gKCR7Y2hhbmdlLm1lZGlhUXVlcnl9KSA8YnIvPmAgO1xuICogICAgICAgIH0pO1xuICogICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICogICAgIH0pO1xuICpcbiAqICAgIH1cbiAqICB9XG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1lZGlhT2JzZXJ2ZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGFzT2JzZXJ2YWJsZSgpYCBpbnN0ZWFkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wLWJldGEuMjVcbiAgICogQGRlbGV0aW9uLXRhcmdldCAxMC4wLjBcbiAgICovXG4gIHJlYWRvbmx5IG1lZGlhJDogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT47XG5cbiAgLyoqIEZpbHRlciBNZWRpYUNoYW5nZSBub3RpZmljYXRpb25zIGZvciBvdmVybGFwcGluZyBicmVha3BvaW50cyAqL1xuICBmaWx0ZXJPdmVybGFwcyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFJlZ2lzdHJ5LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgbWF0Y2hNZWRpYTogTWF0Y2hNZWRpYSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGhvb2s6IFByaW50SG9vaykge1xuICAgIHRoaXMuX21lZGlhJCA9IHRoaXMud2F0Y2hBY3RpdmF0aW9ucygpO1xuICAgIHRoaXMubWVkaWEkID0gdGhpcy5fbWVkaWEkLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IGNoYW5nZXMubGVuZ3RoID4gMCksXG4gICAgICBtYXAoKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IGNoYW5nZXNbMF0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGFjdGl2ZSBzdWJqZWN0LCBzaWduYWxsaW5nIHRvIGFsbCBjb21wbGV0ZSBmb3IgYWxsXG4gICAqIE1lZGlhT2JzZXJ2ZXIgc3Vic2NyaWJlcnNcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkJC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHVibGljIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIE9ic2VydmUgY2hhbmdlcyB0byBjdXJyZW50IGFjdGl2YXRpb24gJ2xpc3QnXG4gICAqL1xuICBhc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPiB7XG4gICAgcmV0dXJuIHRoaXMuX21lZGlhJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBwcm9ncmFtbWF0aWMgcXVlcnkgdG8gZGV0ZXJtaW5lIGlmIG9uZSBvciBtb3JlIG1lZGlhIHF1ZXJ5L2FsaWFzIG1hdGNoXG4gICAqIHRoZSBjdXJyZW50IHZpZXdwb3J0IHNpemUuXG4gICAqIEBwYXJhbSB2YWx1ZSBPbmUgb3IgbW9yZSBtZWRpYSBxdWVyaWVzIChvciBhbGlhc2VzKSB0byBjaGVjay5cbiAgICogQHJldHVybnMgV2hldGhlciBhbnkgb2YgdGhlIG1lZGlhIHF1ZXJpZXMgbWF0Y2guXG4gICAqL1xuICBpc0FjdGl2ZSh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhbGlhc2VzID0gc3BsaXRRdWVyaWVzKGNvZXJjZUFycmF5KHZhbHVlKSk7XG4gICAgcmV0dXJuIGFsaWFzZXMuc29tZShhbGlhcyA9PiB7XG4gICAgICBjb25zdCBxdWVyeSA9IHRvTWVkaWFRdWVyeShhbGlhcywgdGhpcy5icmVha3BvaW50cyk7XG4gICAgICByZXR1cm4gcXVlcnkgIT09IG51bGwgJiYgdGhpcy5tYXRjaE1lZGlhLmlzQWN0aXZlKHF1ZXJ5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBJbnRlcm5hbCBNZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbGwgdGhlIG1lZGlhUXVlcmllcyByZWdpc3RlcmVkIGluIHRoZSBCcmVha1BvaW50UmVnaXN0cnlcbiAgICogVGhpcyBpcyBuZWVkZWQgc28gc3Vic2NyaWJlcnMgY2FuIGJlIGF1dG8tbm90aWZpZWQgb2YgYWxsIHN0YW5kYXJkLCByZWdpc3RlcmVkXG4gICAqIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgd2F0Y2hBY3RpdmF0aW9ucygpIHtcbiAgICBjb25zdCBxdWVyaWVzID0gdGhpcy5icmVha3BvaW50cy5pdGVtcy5tYXAoYnAgPT4gYnAubWVkaWFRdWVyeSk7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRPYnNlcnZhYmxlKHF1ZXJpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9ubHkgcGFzcy9hbm5vdW5jZSBhY3RpdmF0aW9ucyAobm90IGRlLWFjdGl2YXRpb25zKVxuICAgKlxuICAgKiBTaW5jZSBtdWx0aXBsZS1tZWRpYVF1ZXJpZXMgY2FuIGJlIGFjdGl2YXRpb24gaW4gYSBjeWNsZSxcbiAgICogZ2F0aGVyIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGludG8gYSBzaW5nbGUgbGlzdCBvZiBjaGFuZ2VzIHRvIG9ic2VydmVyc1xuICAgKlxuICAgKiBJbmplY3QgYXNzb2NpYXRlZCAoaWYgYW55KSBhbGlhcyBpbmZvcm1hdGlvbiBpbnRvIHRoZSBNZWRpYUNoYW5nZSBldmVudFxuICAgKiAtIEV4Y2x1ZGUgbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBmb3Igb3ZlcmxhcHBpbmcgbVFzLiBMaXN0IGJvdW5kZWQgbVEgcmFuZ2VzIG9ubHlcbiAgICogLSBFeGNsdWRlIHByaW50IGFjdGl2YXRpb25zIHRoYXQgZG8gbm90IGhhdmUgYW4gYXNzb2NpYXRlZCBtZWRpYVF1ZXJ5XG4gICAqXG4gICAqIE5PVEU6IHRoZSByYXcgTWVkaWFDaGFuZ2UgZXZlbnRzIFtmcm9tIE1hdGNoTWVkaWFdIGRvIG5vdFxuICAgKiAgICAgICBjb250YWluIGltcG9ydGFudCBhbGlhcyBpbmZvcm1hdGlvbjsgYXMgc3VjaCB0aGlzIGluZm9cbiAgICogICAgICAgbXVzdCBiZSBpbmplY3RlZCBpbnRvIHRoZSBNZWRpYUNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBidWlsZE9ic2VydmFibGUobXFMaXN0OiBzdHJpbmdbXSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2VbXT4ge1xuICAgIGNvbnN0IGhhc0NoYW5nZXMgPSAoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgY29uc3QgaXNWYWxpZFF1ZXJ5ID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IChjaGFuZ2UubWVkaWFRdWVyeS5sZW5ndGggPiAwKTtcbiAgICAgIHJldHVybiAoY2hhbmdlcy5maWx0ZXIoaXNWYWxpZFF1ZXJ5KS5sZW5ndGggPiAwKTtcbiAgICB9O1xuICAgIGNvbnN0IGV4Y2x1ZGVPdmVybGFwcyA9IChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICByZXR1cm4gIXRoaXMuZmlsdGVyT3ZlcmxhcHMgPyBjaGFuZ2VzIDogY2hhbmdlcy5maWx0ZXIoY2hhbmdlID0+IHtcbiAgICAgICAgY29uc3QgYnAgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGNoYW5nZS5tZWRpYVF1ZXJ5KTtcbiAgICAgICAgcmV0dXJuICFicCA/IHRydWUgOiAhYnAub3ZlcmxhcHBpbmc7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAub2JzZXJ2ZSh0aGlzLmhvb2sud2l0aFByaW50UXVlcnkobXFMaXN0KSlcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IGNoYW5nZS5tYXRjaGVzKSxcbiAgICAgICAgICAgIGRlYm91bmNlVGltZSgwLCBhc2FwU2NoZWR1bGVyKSxcbiAgICAgICAgICAgIHN3aXRjaE1hcChfID0+IG9mKHRoaXMuZmluZEFsbEFjdGl2YXRpb25zKCkpKSxcbiAgICAgICAgICAgIG1hcChleGNsdWRlT3ZlcmxhcHMpLFxuICAgICAgICAgICAgZmlsdGVyKGhhc0NoYW5nZXMpLFxuICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJClcbiAgICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGFuZCBwcmVwYXJlIHNpbmdsZSBsaXN0IG9mIGFjdGl2YXRpb25zXG4gICAqIHNvcnRlZCBieSBkZXNjZW5kaW5nIHByaW9yaXR5LlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kQWxsQWN0aXZhdGlvbnMoKTogTWVkaWFDaGFuZ2VbXSB7XG4gICAgY29uc3QgbWVyZ2VNUUFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGxldCBicDogT3B0aW9uYWxCcmVha1BvaW50ID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShjaGFuZ2UubWVkaWFRdWVyeSk7XG4gICAgICByZXR1cm4gbWVyZ2VBbGlhcyhjaGFuZ2UsIGJwKTtcbiAgICB9O1xuICAgIGNvbnN0IHJlcGxhY2VXaXRoUHJpbnRBbGlhcyA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5ob29rLmlzUHJpbnRFdmVudChjaGFuZ2UpID8gdGhpcy5ob29rLnVwZGF0ZUV2ZW50KGNoYW5nZSkgOiBjaGFuZ2U7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLmFjdGl2YXRpb25zXG4gICAgICAgIC5tYXAocXVlcnkgPT4gbmV3IE1lZGlhQ2hhbmdlKHRydWUsIHF1ZXJ5KSlcbiAgICAgICAgLm1hcChyZXBsYWNlV2l0aFByaW50QWxpYXMpXG4gICAgICAgIC5tYXAobWVyZ2VNUUFsaWFzKVxuICAgICAgICAuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX21lZGlhJDogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPjtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFzc29jaWF0ZWQgYnJlYWtwb2ludCAoaWYgYW55KVxuICovXG5mdW5jdGlvbiB0b01lZGlhUXVlcnkocXVlcnk6IHN0cmluZywgbG9jYXRvcjogQnJlYWtQb2ludFJlZ2lzdHJ5KSB7XG4gIGNvbnN0IGJwID0gbG9jYXRvci5maW5kQnlBbGlhcyhxdWVyeSkgfHwgbG9jYXRvci5maW5kQnlRdWVyeShxdWVyeSk7XG4gIHJldHVybiBicCA/IGJwLm1lZGlhUXVlcnkgOiBudWxsO1xufVxuXG4vKipcbiAqIFNwbGl0IGVhY2ggcXVlcnkgc3RyaW5nIGludG8gc2VwYXJhdGUgcXVlcnkgc3RyaW5ncyBpZiB0d28gcXVlcmllcyBhcmUgcHJvdmlkZWQgYXMgY29tbWFcbiAqIHNlcGFyYXRlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXRRdWVyaWVzKHF1ZXJpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gcXVlcmllcy5tYXAoKHF1ZXJ5OiBzdHJpbmcpID0+IHF1ZXJ5LnNwbGl0KCcsJykpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYTE6IHN0cmluZ1tdLCBhMjogc3RyaW5nW10pID0+IGExLmNvbmNhdChhMikpXG4gICAgICAgICAgICAgICAgLm1hcChxdWVyeSA9PiBxdWVyeS50cmltKCkpO1xufVxuIl19