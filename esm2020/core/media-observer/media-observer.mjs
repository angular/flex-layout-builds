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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUs1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdDRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBWXhCLFlBQXNCLFdBQStCLEVBQy9CLFVBQXNCLEVBQ3RCLElBQWU7UUFGZixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDL0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFXO1FBTHJDLG1FQUFtRTtRQUNuRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQXNJTixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWpJaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFB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QUFFLENBQUMsQ0FBQztBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3QsIGFzYXBTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcbmltcG9ydCB7TWVkaWFDaGFuZ2V9IGZyb20gJy4uL21lZGlhLWNoYW5nZSc7XG5pbXBvcnQge01hdGNoTWVkaWF9IGZyb20gJy4uL21hdGNoLW1lZGlhL21hdGNoLW1lZGlhJztcbmltcG9ydCB7UHJpbnRIb29rfSBmcm9tICcuLi9tZWRpYS1tYXJzaGFsbGVyL3ByaW50LWhvb2snO1xuaW1wb3J0IHtCcmVha1BvaW50UmVnaXN0cnksIE9wdGlvbmFsQnJlYWtQb2ludH0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuXG5pbXBvcnQge3NvcnREZXNjZW5kaW5nUHJpb3JpdHl9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xuaW1wb3J0IHtjb2VyY2VBcnJheX0gZnJvbSAnLi4vdXRpbHMvYXJyYXknO1xuXG5cbi8qKlxuICogTWVkaWFPYnNlcnZlciBlbmFibGVzIGFwcGxpY2F0aW9ucyB0byBsaXN0ZW4gZm9yIDEuLm4gbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBhbmQgdG8gZGV0ZXJtaW5lXG4gKiBpZiBhIG1lZGlhUXVlcnkgaXMgY3VycmVudGx5IGFjdGl2YXRlZC5cbiAqXG4gKiBTaW5jZSBhIGJyZWFrcG9pbnQgY2hhbmdlIHdpbGwgZmlyc3QgZGVhY3RpdmF0ZSAxLi4ubiBtZWRpYVF1ZXJpZXMgYW5kIHRoZW4gcG9zc2libHkgYWN0aXZhdGVcbiAqIDEuLm4gbWVkaWFRdWVyaWVzLCB0aGUgTWVkaWFPYnNlcnZlciB3aWxsIGRlYm91bmNlIG5vdGlmaWNhdGlvbnMgYW5kIHJlcG9ydCBBTEwgKmFjdGl2YXRpb25zKlxuICogaW4gMSBldmVudCBub3RpZmljYXRpb24uIFRoZSByZXBvcnRlZCBhY3RpdmF0aW9ucyB3aWxsIGJlIHNvcnRlZCBpbiBkZXNjZW5kaW5nIHByaW9yaXR5IG9yZGVyLlxuICpcbiAqIFRoaXMgY2xhc3MgdXNlcyB0aGUgQnJlYWtQb2ludCBSZWdpc3RyeSB0byBpbmplY3QgYWxpYXMgaW5mb3JtYXRpb24gaW50byB0aGUgcmF3IE1lZGlhQ2hhbmdlXG4gKiBub3RpZmljYXRpb24uIEZvciBjdXN0b20gbWVkaWFRdWVyeSBub3RpZmljYXRpb25zLCBhbGlhcyBpbmZvcm1hdGlvbiB3aWxsIG5vdCBiZSBpbmplY3RlZCBhbmRcbiAqIHRob3NlIGZpZWxkcyB3aWxsIGJlICcnLlxuICpcbiAqIE5vdGU6IERldmVsb3BlcnMgc2hvdWxkIG5vdGUgdGhhdCBvbmx5IG1lZGlhQ2hhbmdlIGFjdGl2YXRpb25zIChub3QgZGUtYWN0aXZhdGlvbnMpXG4gKiAgICAgICBhcmUgYW5ub3VuY2VkIGJ5IHRoZSBNZWRpYU9ic2VydmVyLlxuICpcbiAqICBAdXNhZ2VcbiAqXG4gKiAgLy8gUnhKU1xuICogIGltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqICBpbXBvcnQgeyBNZWRpYU9ic2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuICpcbiAqICBAQ29tcG9uZW50KHsgLi4uIH0pXG4gKiAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gKiAgICBzdGF0dXM6IHN0cmluZyA9ICcnO1xuICpcbiAqICAgIGNvbnN0cnVjdG9yKG1lZGlhT2JzZXJ2ZXI6IE1lZGlhT2JzZXJ2ZXIpIHtcbiAqICAgICAgY29uc3QgbWVkaWEkID0gbWVkaWFPYnNlcnZlci5hc09ic2VydmFibGUoKS5waXBlKFxuICogICAgICAgIGZpbHRlcigoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4gdHJ1ZSkgICAvLyBzaWxseSBub29wIGZpbHRlclxuICogICAgICApO1xuICpcbiAqICAgICAgbWVkaWEkLnN1YnNjcmliZSgoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICogICAgICAgIGxldCBzdGF0dXMgPSAnJztcbiAqICAgICAgICBjaGFuZ2VzLmZvckVhY2goIGNoYW5nZSA9PiB7XG4gKiAgICAgICAgICBzdGF0dXMgKz0gYCcke2NoYW5nZS5tcUFsaWFzfScgPSAoJHtjaGFuZ2UubWVkaWFRdWVyeX0pIDxici8+YCA7XG4gKiAgICAgICAgfSk7XG4gKiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gKiAgICAgfSk7XG4gKlxuICogICAgfVxuICogIH1cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWVkaWFPYnNlcnZlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYXNPYnNlcnZhYmxlKClgIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAtYmV0YS4yNVxuICAgKiBAZGVsZXRpb24tdGFyZ2V0IDEwLjAuMFxuICAgKi9cbiAgcmVhZG9ubHkgbWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlPjtcblxuICAvKiogRmlsdGVyIE1lZGlhQ2hhbmdlIG5vdGlmaWNhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIGJyZWFrcG9pbnRzICovXG4gIGZpbHRlck92ZXJsYXBzID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnksXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBtYXRjaE1lZGlhOiBNYXRjaE1lZGlhLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaG9vazogUHJpbnRIb29rKSB7XG4gICAgdGhpcy5fbWVkaWEkID0gdGhpcy53YXRjaEFjdGl2YXRpb25zKCk7XG4gICAgdGhpcy5tZWRpYSQgPSB0aGlzLl9tZWRpYSQucGlwZShcbiAgICAgIGZpbHRlcigoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4gY2hhbmdlcy5sZW5ndGggPiAwKSxcbiAgICAgIG1hcCgoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4gY2hhbmdlc1swXSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBsZXRlcyB0aGUgYWN0aXZlIHN1YmplY3QsIHNpZ25hbGxpbmcgdG8gYWxsIGNvbXBsZXRlIGZvciBhbGxcbiAgICogTWVkaWFPYnNlcnZlciBzdWJzY3JpYmVyc1xuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95ZWQkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3llZCQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQdWJsaWMgTWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICogT2JzZXJ2ZSBjaGFuZ2VzIHRvIGN1cnJlbnQgYWN0aXZhdGlvbiAnbGlzdCdcbiAgICovXG4gIGFzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+IHtcbiAgICByZXR1cm4gdGhpcy5fbWVkaWEkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHByb2dyYW1tYXRpYyBxdWVyeSB0byBkZXRlcm1pbmUgaWYgb25lIG9yIG1vcmUgbWVkaWEgcXVlcnkvYWxpYXMgbWF0Y2hcbiAgICogdGhlIGN1cnJlbnQgdmlld3BvcnQgc2l6ZS5cbiAgICogQHBhcmFtIHZhbHVlIE9uZSBvciBtb3JlIG1lZGlhIHF1ZXJpZXMgKG9yIGFsaWFzZXMpIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIGFueSBvZiB0aGUgbWVkaWEgcXVlcmllcyBtYXRjaC5cbiAgICovXG4gIGlzQWN0aXZlKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFsaWFzZXMgPSBzcGxpdFF1ZXJpZXMoY29lcmNlQXJyYXkodmFsdWUpKTtcbiAgICByZXR1cm4gYWxpYXNlcy5zb21lKGFsaWFzID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9NZWRpYVF1ZXJ5KGFsaWFzLCB0aGlzLmJyZWFrcG9pbnRzKTtcbiAgICAgIHJldHVybiBxdWVyeSAhPT0gbnVsbCAmJiB0aGlzLm1hdGNoTWVkaWEuaXNBY3RpdmUocXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIEludGVybmFsIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFsbCB0aGUgbWVkaWFRdWVyaWVzIHJlZ2lzdGVyZWQgaW4gdGhlIEJyZWFrUG9pbnRSZWdpc3RyeVxuICAgKiBUaGlzIGlzIG5lZWRlZCBzbyBzdWJzY3JpYmVycyBjYW4gYmUgYXV0by1ub3RpZmllZCBvZiBhbGwgc3RhbmRhcmQsIHJlZ2lzdGVyZWRcbiAgICogbWVkaWFRdWVyeSBhY3RpdmF0aW9uc1xuICAgKi9cbiAgcHJpdmF0ZSB3YXRjaEFjdGl2YXRpb25zKCkge1xuICAgIGNvbnN0IHF1ZXJpZXMgPSB0aGlzLmJyZWFrcG9pbnRzLml0ZW1zLm1hcChicCA9PiBicC5tZWRpYVF1ZXJ5KTtcbiAgICByZXR1cm4gdGhpcy5idWlsZE9ic2VydmFibGUocXVlcmllcyk7XG4gIH1cblxuICAvKipcbiAgICogT25seSBwYXNzL2Fubm91bmNlIGFjdGl2YXRpb25zIChub3QgZGUtYWN0aXZhdGlvbnMpXG4gICAqXG4gICAqIFNpbmNlIG11bHRpcGxlLW1lZGlhUXVlcmllcyBjYW4gYmUgYWN0aXZhdGlvbiBpbiBhIGN5Y2xlLFxuICAgKiBnYXRoZXIgYWxsIGN1cnJlbnQgYWN0aXZhdGlvbnMgaW50byBhIHNpbmdsZSBsaXN0IG9mIGNoYW5nZXMgdG8gb2JzZXJ2ZXJzXG4gICAqXG4gICAqIEluamVjdCBhc3NvY2lhdGVkIChpZiBhbnkpIGFsaWFzIGluZm9ybWF0aW9uIGludG8gdGhlIE1lZGlhQ2hhbmdlIGV2ZW50XG4gICAqIC0gRXhjbHVkZSBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIGZvciBvdmVybGFwcGluZyBtUXMuIExpc3QgYm91bmRlZCBtUSByYW5nZXMgb25seVxuICAgKiAtIEV4Y2x1ZGUgcHJpbnQgYWN0aXZhdGlvbnMgdGhhdCBkbyBub3QgaGF2ZSBhbiBhc3NvY2lhdGVkIG1lZGlhUXVlcnlcbiAgICpcbiAgICogTk9URTogdGhlIHJhdyBNZWRpYUNoYW5nZSBldmVudHMgW2Zyb20gTWF0Y2hNZWRpYV0gZG8gbm90XG4gICAqICAgICAgIGNvbnRhaW4gaW1wb3J0YW50IGFsaWFzIGluZm9ybWF0aW9uOyBhcyBzdWNoIHRoaXMgaW5mb1xuICAgKiAgICAgICBtdXN0IGJlIGluamVjdGVkIGludG8gdGhlIE1lZGlhQ2hhbmdlXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkT2JzZXJ2YWJsZShtcUxpc3Q6IHN0cmluZ1tdKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPiB7XG4gICAgY29uc3QgaGFzQ2hhbmdlcyA9IChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICBjb25zdCBpc1ZhbGlkUXVlcnkgPSAoY2hhbmdlOiBNZWRpYUNoYW5nZSkgPT4gKGNoYW5nZS5tZWRpYVF1ZXJ5Lmxlbmd0aCA+IDApO1xuICAgICAgcmV0dXJuIChjaGFuZ2VzLmZpbHRlcihpc1ZhbGlkUXVlcnkpLmxlbmd0aCA+IDApO1xuICAgIH07XG4gICAgY29uc3QgZXhjbHVkZU92ZXJsYXBzID0gKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAgICAgIHJldHVybiAhdGhpcy5maWx0ZXJPdmVybGFwcyA/IGNoYW5nZXMgOiBjaGFuZ2VzLmZpbHRlcihjaGFuZ2UgPT4ge1xuICAgICAgICBjb25zdCBicCA9IHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5UXVlcnkoY2hhbmdlLm1lZGlhUXVlcnkpO1xuICAgICAgICByZXR1cm4gYnA/Lm92ZXJsYXBwaW5nID8/IHRydWU7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGlnbm9yZUR1cGxpY2F0ZXMgPSAocHJldmlvdXM6IE1lZGlhQ2hhbmdlW10sIGN1cnJlbnQ6IE1lZGlhQ2hhbmdlW10pOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChwcmV2aW91cy5sZW5ndGggIT09IGN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJldmlvdXNNcXMgPSBwcmV2aW91cy5tYXAobWMgPT4gbWMubWVkaWFRdWVyeSk7XG4gICAgICBjb25zdCBjdXJyZW50TXFzID0gbmV3IFNldChjdXJyZW50Lm1hcChtYyA9PiBtYy5tZWRpYVF1ZXJ5KSk7XG4gICAgICBjb25zdCBkaWZmZXJlbmNlID0gbmV3IFNldChwcmV2aW91c01xcy5maWx0ZXIobXEgPT4gIWN1cnJlbnRNcXMuaGFzKG1xKSkpO1xuXG4gICAgICByZXR1cm4gZGlmZmVyZW5jZS5zaXplID09PSAwO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5tYXRjaE1lZGlhXG4gICAgICAgIC5vYnNlcnZlKHRoaXMuaG9vay53aXRoUHJpbnRRdWVyeShtcUxpc3QpKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcigoY2hhbmdlOiBNZWRpYUNoYW5nZSkgPT4gY2hhbmdlLm1hdGNoZXMpLFxuICAgICAgICAgICAgZGVib3VuY2VUaW1lKDAsIGFzYXBTY2hlZHVsZXIpLFxuICAgICAgICAgICAgc3dpdGNoTWFwKF8gPT4gb2YodGhpcy5maW5kQWxsQWN0aXZhdGlvbnMoKSkpLFxuICAgICAgICAgICAgbWFwKGV4Y2x1ZGVPdmVybGFwcyksXG4gICAgICAgICAgICBmaWx0ZXIoaGFzQ2hhbmdlcyksXG4gICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZChpZ25vcmVEdXBsaWNhdGVzKSxcbiAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpXG4gICAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRmluZCBhbGwgY3VycmVudCBhY3RpdmF0aW9ucyBhbmQgcHJlcGFyZSBzaW5nbGUgbGlzdCBvZiBhY3RpdmF0aW9uc1xuICAgKiBzb3J0ZWQgYnkgZGVzY2VuZGluZyBwcmlvcml0eS5cbiAgICovXG4gIHByaXZhdGUgZmluZEFsbEFjdGl2YXRpb25zKCk6IE1lZGlhQ2hhbmdlW10ge1xuICAgIGNvbnN0IG1lcmdlTVFBbGlhcyA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiB7XG4gICAgICBjb25zdCBicDogT3B0aW9uYWxCcmVha1BvaW50ID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShjaGFuZ2UubWVkaWFRdWVyeSk7XG4gICAgICByZXR1cm4gbWVyZ2VBbGlhcyhjaGFuZ2UsIGJwKTtcbiAgICB9O1xuICAgIGNvbnN0IHJlcGxhY2VXaXRoUHJpbnRBbGlhcyA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5ob29rLmlzUHJpbnRFdmVudChjaGFuZ2UpID8gdGhpcy5ob29rLnVwZGF0ZUV2ZW50KGNoYW5nZSkgOiBjaGFuZ2U7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLmFjdGl2YXRpb25zXG4gICAgICAgIC5tYXAocXVlcnkgPT4gbmV3IE1lZGlhQ2hhbmdlKHRydWUsIHF1ZXJ5KSlcbiAgICAgICAgLm1hcChyZXBsYWNlV2l0aFByaW50QWxpYXMpXG4gICAgICAgIC5tYXAobWVyZ2VNUUFsaWFzKVxuICAgICAgICAuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX21lZGlhJDogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPjtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95ZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbn1cblxuLyoqXG4gKiBGaW5kIGFzc29jaWF0ZWQgYnJlYWtwb2ludCAoaWYgYW55KVxuICovXG5mdW5jdGlvbiB0b01lZGlhUXVlcnkocXVlcnk6IHN0cmluZywgbG9jYXRvcjogQnJlYWtQb2ludFJlZ2lzdHJ5KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGJwID0gbG9jYXRvci5maW5kQnlBbGlhcyhxdWVyeSkgPz8gbG9jYXRvci5maW5kQnlRdWVyeShxdWVyeSk7XG4gIHJldHVybiBicD8ubWVkaWFRdWVyeSA/PyBudWxsO1xufVxuXG4vKipcbiAqIFNwbGl0IGVhY2ggcXVlcnkgc3RyaW5nIGludG8gc2VwYXJhdGUgcXVlcnkgc3RyaW5ncyBpZiB0d28gcXVlcmllcyBhcmUgcHJvdmlkZWQgYXMgY29tbWFcbiAqIHNlcGFyYXRlZC5cbiAqL1xuZnVuY3Rpb24gc3BsaXRRdWVyaWVzKHF1ZXJpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICByZXR1cm4gcXVlcmllcy5tYXAoKHF1ZXJ5OiBzdHJpbmcpID0+IHF1ZXJ5LnNwbGl0KCcsJykpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYTE6IHN0cmluZ1tdLCBhMjogc3RyaW5nW10pID0+IGExLmNvbmNhdChhMikpXG4gICAgICAgICAgICAgICAgLm1hcChxdWVyeSA9PiBxdWVyeS50cmltKCkpO1xufVxuIl19