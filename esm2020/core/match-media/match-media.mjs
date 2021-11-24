/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MediaChange } from '../media-change';
import * as i0 from "@angular/core";
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
export class MatchMedia {
    constructor(_zone, _platformId, _document) {
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        /** Initialize source with 'all' so all non-responsive APIs trigger style updates */
        this.source = new BehaviorSubject(new MediaChange(true));
        this.registry = new Map();
        this.pendingRemoveListenerFns = [];
        this._observable$ = this.source.asObservable();
    }
    /**
     * Publish list of all current activations
     */
    get activations() {
        const results = [];
        this.registry.forEach((mql, key) => {
            if (mql.matches) {
                results.push(key);
            }
        });
        return results;
    }
    /**
     * For the specified mediaQuery?
     */
    isActive(mediaQuery) {
        const mql = this.registry.get(mediaQuery);
        return !!mql ? mql.matches : this.registerQuery(mediaQuery).some(m => m.matches);
    }
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * Use deferred registration process to register breakpoints only on subscription
     * This logic also enforces logic to register all mediaQueries BEFORE notify
     * subscribers of notifications.
     */
    observe(mqList, filterOthers = false) {
        if (mqList && mqList.length) {
            const matchMedia$ = this._observable$.pipe(filter((change) => !filterOthers ? true : (mqList.indexOf(change.mediaQuery) > -1)));
            const registration$ = new Observable((observer) => {
                const matches = this.registerQuery(mqList);
                if (matches.length) {
                    const lastChange = matches.pop();
                    matches.forEach((e) => {
                        observer.next(e);
                    });
                    this.source.next(lastChange); // last match is cached
                }
                observer.complete();
            });
            return merge(registration$, matchMedia$);
        }
        return this._observable$;
    }
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique
     * mediaQuery. Each listener emits specific MediaChange data to observers
     */
    registerQuery(mediaQuery) {
        const list = Array.isArray(mediaQuery) ? mediaQuery : [mediaQuery];
        const matches = [];
        buildQueryCss(list, this._document);
        list.forEach((query) => {
            const onMQLEvent = (e) => {
                this._zone.run(() => this.source.next(new MediaChange(e.matches, query)));
            };
            let mql = this.registry.get(query);
            if (!mql) {
                mql = this.buildMQL(query);
                mql.addListener(onMQLEvent);
                this.pendingRemoveListenerFns.push(() => mql.removeListener(onMQLEvent));
                this.registry.set(query, mql);
            }
            if (mql.matches) {
                matches.push(new MediaChange(true, query));
            }
        });
        return matches;
    }
    ngOnDestroy() {
        let fn;
        while (fn = this.pendingRemoveListenerFns.pop()) {
            fn();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        return constructMql(query, isPlatformBrowser(this._platformId));
    }
}
MatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
MatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MatchMedia, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MatchMedia, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};
/**
 * For Webkit engines that only trigger the MediaQueryList Listener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param mediaQueries
 * @param _document
 */
function buildQueryCss(mediaQueries, _document) {
    const list = mediaQueries.filter(it => !ALL_STYLES[it]);
    if (list.length > 0) {
        const query = list.join(', ');
        try {
            const styleEl = _document.createElement('style');
            styleEl.setAttribute('type', 'text/css');
            if (!styleEl.styleSheet) {
                const cssText = `
/*
  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
`;
                styleEl.appendChild(_document.createTextNode(cssText));
            }
            _document.head.appendChild(styleEl);
            // Store in private global registry
            list.forEach(mq => ALL_STYLES[mq] = styleEl);
        }
        catch (e) {
            console.error(e);
        }
    }
}
function constructMql(query, isBrowser) {
    const canListen = isBrowser && !!window.matchMedia('all').addListener;
    return canListen ? window.matchMedia(query) : {
        matches: query === 'all' || query === '',
        media: query,
        addListener: () => {
        },
        removeListener: () => {
        },
        onchange: null,
        addEventListener() {
        },
        removeEventListener() {
        },
        dispatchEvent() {
            return false;
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtbWVkaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWF0Y2gtbWVkaWEvbWF0Y2gtbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQXFCLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFXLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7O0FBRTVDOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxVQUFVO0lBTXJCLFlBQXNCLEtBQWEsRUFDUSxXQUFtQixFQUN0QixTQUFjO1FBRmhDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDUSxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUN0QixjQUFTLEdBQVQsU0FBUyxDQUFLO1FBUHRELG9GQUFvRjtRQUMzRSxXQUFNLEdBQUcsSUFBSSxlQUFlLENBQWMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxRSxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFDNUIsNkJBQXdCLEdBQXNCLEVBQUUsQ0FBQztRQW9IeEQsaUJBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBL0dwRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFdBQVc7UUFDYixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMs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TyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsT0FBTyxFQUFFLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDeEMsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ2xCLENBQUM7UUFDRCxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLENBQUM7UUFDRCxRQUFRLEVBQUUsSUFBSTtRQUNkLGdCQUFnQjtRQUNoQixDQUFDO1FBQ0QsbUJBQW1CO1FBQ25CLENBQUM7UUFDRCxhQUFhO1lBQ1gsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0tBQ2dCLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSwgT25EZXN0cm95LCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBtZXJnZSwgT2JzZXJ2ZXJ9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNZWRpYUNoYW5nZX0gZnJvbSAnLi4vbWVkaWEtY2hhbmdlJztcblxuLyoqXG4gKiBNZWRpYU1vbml0b3IgY29uZmlndXJlcyBsaXN0ZW5lcnMgdG8gbWVkaWFRdWVyeSBjaGFuZ2VzIGFuZCBwdWJsaXNoZXMgYW4gT2JzZXJ2YWJsZSBmYWNhZGUgdG9cbiAqIGNvbnZlcnQgbWVkaWFRdWVyeSBjaGFuZ2UgY2FsbGJhY2tzIHRvIHN1YnNjcmliZXIgbm90aWZpY2F0aW9ucy4gVGhlc2Ugbm90aWZpY2F0aW9ucyB3aWxsIGJlXG4gKiBwZXJmb3JtZWQgd2l0aGluIHRoZSBuZyBab25lIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbnMgYW5kIGNvbXBvbmVudCB1cGRhdGVzLlxuICpcbiAqIE5PVEU6IGJvdGggbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBhbmQgZGUtYWN0aXZhdGlvbnMgYXJlIGFubm91bmNlZCBpbiBub3RpZmljYXRpb25zXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdGNoTWVkaWEgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogSW5pdGlhbGl6ZSBzb3VyY2Ugd2l0aCAnYWxsJyBzbyBhbGwgbm9uLXJlc3BvbnNpdmUgQVBJcyB0cmlnZ2VyIHN0eWxlIHVwZGF0ZXMgKi9cbiAgcmVhZG9ubHkgc291cmNlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNZWRpYUNoYW5nZT4obmV3IE1lZGlhQ2hhbmdlKHRydWUpKTtcbiAgcmVnaXN0cnkgPSBuZXcgTWFwPHN0cmluZywgTWVkaWFRdWVyeUxpc3Q+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGVuZGluZ1JlbW92ZUxpc3RlbmVyRm5zOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfem9uZTogTmdab25lLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJvdGVjdGVkIF9kb2N1bWVudDogYW55KSB7XG4gIH1cblxuICAvKipcbiAgICogUHVibGlzaCBsaXN0IG9mIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zXG4gICAqL1xuICBnZXQgYWN0aXZhdGlvbnMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gICAgdGhpcy5yZWdpc3RyeS5mb3JFYWNoKChtcWw6IE1lZGlhUXVlcnlMaXN0LCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKG1xbC5tYXRjaGVzKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciB0aGUgc3BlY2lmaWVkIG1lZGlhUXVlcnk/XG4gICAqL1xuICBpc0FjdGl2ZShtZWRpYVF1ZXJ5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBtcWwgPSB0aGlzLnJlZ2lzdHJ5LmdldChtZWRpYVF1ZXJ5KTtcbiAgICByZXR1cm4gISFtcWwgPyBtcWwubWF0Y2hlcyA6IHRoaXMucmVnaXN0ZXJRdWVyeShtZWRpYVF1ZXJ5KS5zb21lKG0gPT4gbS5tYXRjaGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBvYnNlcnZlcnMgY2FuIHdhdGNoIGZvciBhbGwgKG9yIGEgc3BlY2lmaWMpIG1xbCBjaGFuZ2VzLlxuICAgKlxuICAgKiBJZiBhIG1lZGlhUXVlcnkgaXMgbm90IHNwZWNpZmllZCwgdGhlbiBBTEwgbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyB3aWxsXG4gICAqIGJlIGFubm91bmNlZC5cbiAgICovXG4gIG9ic2VydmUoKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT47XG4gIG9ic2VydmUobWVkaWFRdWVyaWVzOiBzdHJpbmdbXSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+O1xuICBvYnNlcnZlKG1lZGlhUXVlcmllczogc3RyaW5nW10sIGZpbHRlck90aGVyczogYm9vbGVhbik6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+O1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBvYnNlcnZlcnMgY2FuIHdhdGNoIGZvciBhbGwgKG9yIGEgc3BlY2lmaWMpIG1xbCBjaGFuZ2VzLlxuICAgKiBUeXBpY2FsbHkgdXNlZCBieSB0aGUgTWVkaWFRdWVyeUFkYXB0b3I7IG9wdGlvbmFsbHkgYXZhaWxhYmxlIHRvIGNvbXBvbmVudHNcbiAgICogd2hvIHdpc2ggdG8gdXNlIHRoZSBNZWRpYU1vbml0b3IgYXMgbWVkaWFNb25pdG9yJCBvYnNlcnZhYmxlIHNlcnZpY2UuXG4gICAqXG4gICAqIFVzZSBkZWZlcnJlZCByZWdpc3RyYXRpb24gcHJvY2VzcyB0byByZWdpc3RlciBicmVha3BvaW50cyBvbmx5IG9uIHN1YnNjcmlwdGlvblxuICAgKiBUaGlzIGxvZ2ljIGFsc28gZW5mb3JjZXMgbG9naWMgdG8gcmVnaXN0ZXIgYWxsIG1lZGlhUXVlcmllcyBCRUZPUkUgbm90aWZ5XG4gICAqIHN1YnNjcmliZXJzIG9mIG5vdGlmaWNhdGlvbnMuXG4gICAqL1xuICBvYnNlcnZlKG1xTGlzdD86IHN0cmluZ1tdLCBmaWx0ZXJPdGhlcnMgPSBmYWxzZSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+IHtcbiAgICBpZiAobXFMaXN0ICYmIG1xTGlzdC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG1hdGNoTWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlPiA9IHRoaXMuX29ic2VydmFibGUkLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PlxuICAgICAgICAgICAgIWZpbHRlck90aGVycyA/IHRydWUgOiAobXFMaXN0LmluZGV4T2YoY2hhbmdlLm1lZGlhUXVlcnkpID4gLTEpKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiQ6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+ID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBPYnNlcnZlcjxNZWRpYUNoYW5nZT4pID0+IHsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgIGNvbnN0IG1hdGNoZXM6IEFycmF5PE1lZGlhQ2hhbmdlPiA9IHRoaXMucmVnaXN0ZXJRdWVyeShtcUxpc3QpO1xuICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBsYXN0Q2hhbmdlID0gbWF0Y2hlcy5wb3AoKSE7XG4gICAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKChlOiBNZWRpYUNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnNvdXJjZS5uZXh0KGxhc3RDaGFuZ2UpOyAvLyBsYXN0IG1hdGNoIGlzIGNhY2hlZFxuICAgICAgICB9XG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtZXJnZShyZWdpc3RyYXRpb24kLCBtYXRjaE1lZGlhJCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX29ic2VydmFibGUkO1xuICB9XG5cbiAgLyoqXG4gICAqIEJhc2VkIG9uIHRoZSBCcmVha1BvaW50UmVnaXN0cnkgcHJvdmlkZXIsIHJlZ2lzdGVyIGludGVybmFsIGxpc3RlbmVycyBmb3IgZWFjaCB1bmlxdWVcbiAgICogbWVkaWFRdWVyeS4gRWFjaCBsaXN0ZW5lciBlbWl0cyBzcGVjaWZpYyBNZWRpYUNoYW5nZSBkYXRhIHRvIG9ic2VydmVyc1xuICAgKi9cbiAgcmVnaXN0ZXJRdWVyeShtZWRpYVF1ZXJ5OiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIGNvbnN0IGxpc3QgPSBBcnJheS5pc0FycmF5KG1lZGlhUXVlcnkpID8gbWVkaWFRdWVyeSA6IFttZWRpYVF1ZXJ5XTtcbiAgICBjb25zdCBtYXRjaGVzOiBNZWRpYUNoYW5nZVtdID0gW107XG5cbiAgICBidWlsZFF1ZXJ5Q3NzKGxpc3QsIHRoaXMuX2RvY3VtZW50KTtcblxuICAgIGxpc3QuZm9yRWFjaCgocXVlcnk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3Qgb25NUUxFdmVudCA9IChlOiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuc291cmNlLm5leHQobmV3IE1lZGlhQ2hhbmdlKGUubWF0Y2hlcywgcXVlcnkpKSk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgbXFsID0gdGhpcy5yZWdpc3RyeS5nZXQocXVlcnkpO1xuICAgICAgaWYgKCFtcWwpIHtcbiAgICAgICAgbXFsID0gdGhpcy5idWlsZE1RTChxdWVyeSk7XG4gICAgICAgIG1xbC5hZGRMaXN0ZW5lcihvbk1RTEV2ZW50KTtcbiAgICAgICAgdGhpcy5wZW5kaW5nUmVtb3ZlTGlzdGVuZXJGbnMucHVzaCgoKSA9PiBtcWwhLnJlbW92ZUxpc3RlbmVyKG9uTVFMRXZlbnQpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RyeS5zZXQocXVlcnksIG1xbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtcWwubWF0Y2hlcykge1xuICAgICAgICBtYXRjaGVzLnB1c2gobmV3IE1lZGlhQ2hhbmdlKHRydWUsIHF1ZXJ5KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGxldCBmbjtcbiAgICB3aGlsZSAoZm4gPSB0aGlzLnBlbmRpbmdSZW1vdmVMaXN0ZW5lckZucy5wb3AoKSkge1xuICAgICAgZm4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCB3aW5kb3cubWF0Y2hNZWRpYSgpIHRvIGJ1aWxkIGEgTWVkaWFRdWVyeUxpc3Q7IHdoaWNoXG4gICAqIHN1cHBvcnRzIDAuLm4gbGlzdGVuZXJzIGZvciBhY3RpdmF0aW9uL2RlYWN0aXZhdGlvblxuICAgKi9cbiAgcHJvdGVjdGVkIGJ1aWxkTVFMKHF1ZXJ5OiBzdHJpbmcpOiBNZWRpYVF1ZXJ5TGlzdCB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdE1xbChxdWVyeSwgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vYnNlcnZhYmxlJCA9IHRoaXMuc291cmNlLmFzT2JzZXJ2YWJsZSgpO1xufVxuXG4vKipcbiAqIFByaXZhdGUgZ2xvYmFsIHJlZ2lzdHJ5IGZvciBhbGwgZHluYW1pY2FsbHktY3JlYXRlZCwgaW5qZWN0ZWQgc3R5bGUgdGFnc1xuICogQHNlZSBwcmVwYXJlKHF1ZXJ5KVxuICovXG5jb25zdCBBTExfU1RZTEVTOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbi8qKlxuICogRm9yIFdlYmtpdCBlbmdpbmVzIHRoYXQgb25seSB0cmlnZ2VyIHRoZSBNZWRpYVF1ZXJ5TGlzdCBMaXN0ZW5lclxuICogd2hlbiB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgQ1NTIHNlbGVjdG9yIGZvciB0aGUgcmVzcGVjdGl2ZSBtZWRpYSBxdWVyeS5cbiAqXG4gKiBAcGFyYW0gbWVkaWFRdWVyaWVzXG4gKiBAcGFyYW0gX2RvY3VtZW50XG4gKi9cbmZ1bmN0aW9uIGJ1aWxkUXVlcnlDc3MobWVkaWFRdWVyaWVzOiBzdHJpbmdbXSwgX2RvY3VtZW50OiBEb2N1bWVudCkge1xuICBjb25zdCBsaXN0ID0gbWVkaWFRdWVyaWVzLmZpbHRlcihpdCA9PiAhQUxMX1NUWUxFU1tpdF0pO1xuICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcXVlcnkgPSBsaXN0LmpvaW4oJywgJyk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3R5bGVFbCA9IF9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICBzdHlsZUVsLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgaWYgKCEoc3R5bGVFbCBhcyBhbnkpLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgY29uc3QgY3NzVGV4dCA9IGBcbi8qXG4gIEBhbmd1bGFyL2ZsZXgtbGF5b3V0IC0gd29ya2Fyb3VuZCBmb3IgcG9zc2libGUgYnJvd3NlciBxdWlyayB3aXRoIG1lZGlhUXVlcnkgbGlzdGVuZXJzXG4gIHNlZSBodHRwOi8vYml0Lmx5LzJzZDRITVBcbiovXG5AbWVkaWEgJHtxdWVyeX0gey5meC1xdWVyeS10ZXN0eyB9fVxuYDtcbiAgICAgICAgc3R5bGVFbC5hcHBlbmRDaGlsZChfZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICAgICAgfVxuXG4gICAgICBfZG9jdW1lbnQuaGVhZCEuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG5cbiAgICAgIC8vIFN0b3JlIGluIHByaXZhdGUgZ2xvYmFsIHJlZ2lzdHJ5XG4gICAgICBsaXN0LmZvckVhY2gobXEgPT4gQUxMX1NUWUxFU1ttcV0gPSBzdHlsZUVsKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdE1xbChxdWVyeTogc3RyaW5nLCBpc0Jyb3dzZXI6IGJvb2xlYW4pOiBNZWRpYVF1ZXJ5TGlzdCB7XG4gIGNvbnN0IGNhbkxpc3RlbiA9IGlzQnJvd3NlciAmJiAhISg8V2luZG93PndpbmRvdykubWF0Y2hNZWRpYSgnYWxsJykuYWRkTGlzdGVuZXI7XG5cbiAgcmV0dXJuIGNhbkxpc3RlbiA/ICg8V2luZG93PndpbmRvdykubWF0Y2hNZWRpYShxdWVyeSkgOiB7XG4gICAgbWF0Y2hlczogcXVlcnkgPT09ICdhbGwnIHx8IHF1ZXJ5ID09PSAnJyxcbiAgICBtZWRpYTogcXVlcnksXG4gICAgYWRkTGlzdGVuZXI6ICgpID0+IHtcbiAgICB9LFxuICAgIHJlbW92ZUxpc3RlbmVyOiAoKSA9PiB7XG4gICAgfSxcbiAgICBvbmNoYW5nZTogbnVsbCxcbiAgICBhZGRFdmVudExpc3RlbmVyKCkge1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcbiAgICB9LFxuICAgIGRpc3BhdGNoRXZlbnQoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGFzIE1lZGlhUXVlcnlMaXN0O1xufVxuIl19