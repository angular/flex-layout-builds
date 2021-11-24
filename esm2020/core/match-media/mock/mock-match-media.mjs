/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatchMedia } from '../match-media';
import * as i0 from "@angular/core";
import * as i1 from "../../breakpoints/break-point-registry";
/**
 * MockMatchMedia mocks calls to the Window API matchMedia with a build of a simulated
 * MockMediaQueryListener. Methods are available to simulate an activation of a mediaQuery
 * range and to clearAll mediaQuery listeners.
 */
export class MockMatchMedia extends MatchMedia {
    constructor(_zone, _platformId, _document, _breakpoints) {
        super(_zone, _platformId, _document);
        this._breakpoints = _breakpoints;
        this.autoRegisterQueries = true; // Used for testing BreakPoint registrations
        this.useOverlaps = false; // Allow fallback to overlapping mediaQueries
    }
    /** Easy method to clear all listeners for all mediaQueries */
    clearAll() {
        this.registry.forEach((mql) => {
            mql.destroy();
        });
        this.registry.clear();
        this.useOverlaps = false;
    }
    /** Feature to support manual, simulated activation of a mediaQuery. */
    activate(mediaQuery, useOverlaps = false) {
        useOverlaps = useOverlaps || this.useOverlaps;
        mediaQuery = this._validateQuery(mediaQuery);
        if (useOverlaps || !this.isActive(mediaQuery)) {
            this._deactivateAll();
            this._registerMediaQuery(mediaQuery);
            this._activateWithOverlaps(mediaQuery, useOverlaps);
        }
        return this.hasActivated;
    }
    /** Converts an optional mediaQuery alias to a specific, valid mediaQuery */
    _validateQuery(queryOrAlias) {
        const bp = this._breakpoints.findByAlias(queryOrAlias);
        return (bp && bp.mediaQuery) || queryOrAlias;
    }
    /**
     * Manually onMediaChange any overlapping mediaQueries to simulate
     * similar functionality in the window.matchMedia()
     */
    _activateWithOverlaps(mediaQuery, useOverlaps) {
        if (useOverlaps) {
            const bp = this._breakpoints.findByQuery(mediaQuery);
            const alias = bp ? bp.alias : 'unknown';
            // Simulate activation of overlapping lt-<XXX> ranges
            switch (alias) {
                case 'lg':
                    this._activateByAlias(['lt-xl']);
                    break;
                case 'md':
                    this._activateByAlias(['lt-xl', 'lt-lg']);
                    break;
                case 'sm':
                    this._activateByAlias(['lt-xl', 'lt-lg', 'lt-md']);
                    break;
                case 'xs':
                    this._activateByAlias(['lt-xl', 'lt-lg', 'lt-md', 'lt-sm']);
                    break;
            }
            // Simulate activation of overlapping gt-<xxxx> mediaQuery ranges
            switch (alias) {
                case 'xl':
                    this._activateByAlias(['gt-lg', 'gt-md', 'gt-sm', 'gt-xs']);
                    break;
                case 'lg':
                    this._activateByAlias(['gt-md', 'gt-sm', 'gt-xs']);
                    break;
                case 'md':
                    this._activateByAlias(['gt-sm', 'gt-xs']);
                    break;
                case 'sm':
                    this._activateByAlias(['gt-xs']);
                    break;
            }
        }
        // Activate last since the responsiveActivation is watching *this* mediaQuery
        return this._activateByQuery(mediaQuery);
    }
    /**
     *
     */
    _activateByAlias(aliases) {
        const activate = (alias) => {
            const bp = this._breakpoints.findByAlias(alias);
            this._activateByQuery(bp ? bp.mediaQuery : alias);
        };
        aliases.forEach(activate);
    }
    /**
     *
     */
    _activateByQuery(mediaQuery) {
        if (!this.registry.has(mediaQuery) && this.autoRegisterQueries) {
            this._registerMediaQuery(mediaQuery);
        }
        const mql = this.registry.get(mediaQuery);
        if (mql && !this.isActive(mediaQuery)) {
            this.registry.set(mediaQuery, mql.activate());
        }
        return this.hasActivated;
    }
    /** Deactivate all current MQLs and reset the buffer */
    _deactivateAll() {
        this.registry.forEach((it) => {
            it.deactivate();
        });
        return this;
    }
    /** Insure the mediaQuery is registered with MatchMedia */
    _registerMediaQuery(mediaQuery) {
        if (!this.registry.has(mediaQuery) && this.autoRegisterQueries) {
            this.registerQuery(mediaQuery);
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        return new MockMediaQueryList(query);
    }
    get hasActivated() {
        return this.activations.length > 0;
    }
}
MockMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MockMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: i1.BreakPointRegistry }], target: i0.ɵɵFactoryTarget.Injectable });
MockMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MockMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: MockMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.BreakPointRegistry }]; } });
/**
 * Special internal class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class MockMediaQueryList {
    constructor(_mediaQuery) {
        this._mediaQuery = _mediaQuery;
        this._isActive = false;
        this._listeners = [];
        this.onchange = null;
    }
    get matches() {
        return this._isActive;
    }
    get media() {
        return this._mediaQuery;
    }
    /**
     * Destroy the current list by deactivating the
     * listeners and clearing the internal list
     */
    destroy() {
        this.deactivate();
        this._listeners = [];
    }
    /** Notify all listeners that 'matches === TRUE' */
    activate() {
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Notify all listeners that 'matches === false' */
    deactivate() {
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Add a listener to our internal list to activate later */
    addListener(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            const cb = listener;
            cb.call(this, { matches: this.matches, media: this.media });
        }
    }
    /** Don't need to remove listeners in the testing environment */
    removeListener(_) {
    }
    addEventListener(_, __, ___) {
    }
    removeEventListener(_, __, ___) {
    }
    dispatchEvent(_) {
        return false;
    }
}
/**
 * Pre-configured provider for MockMatchMedia
 */
export const MockMatchMediaProvider = {
    provide: MatchMedia,
    useClass: MockMatchMedia
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay1tYXRjaC1tZWRpYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tYXRjaC1tZWRpYS9tb2NrL21vY2stbWF0Y2gtbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQUcxQzs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGNBQWUsU0FBUSxVQUFVO0lBTTVDLFlBQVksS0FBYSxFQUNRLFdBQW1CLEVBQ3RCLFNBQWMsRUFDeEIsWUFBZ0M7UUFDbEQsS0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFEbkIsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBTnBELHdCQUFtQixHQUFHLElBQUksQ0FBQyxDQUFHLDRDQUE0QztRQUMxRSxnQkFBVyxHQUFHLEtBQUssQ0FBQyxDQUFVLDZDQUE2QztJQU8zRSxDQUFDO0lBRUQsOERBQThEO0lBQzlELFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQW1CLEVBQUUsRUFBRTtZQUMzQyxHQUEwQixDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLFFBQVEsQ0FBQyxVQUFrQixFQUFFLFdBQVcsR0FBRyxLQUFLO1FBQzlDLFdBQVcsR0FBRyxX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M0MsQ0FBQztJQVFELG1CQUFtQixDQUNmLENBQVMsRUFDVCxFQUFzQyxFQUN0QyxHQUFvQztJQUN4QyxDQUFDO0lBRUQsYUFBYSxDQUFDLENBQVE7UUFDcEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBR0Y7QUFFRDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLE9BQU8sRUFBRSxVQUFVO0lBQ25CLFFBQVEsRUFBRSxjQUFjO0NBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TWF0Y2hNZWRpYX0gZnJvbSAnLi4vbWF0Y2gtbWVkaWEnO1xuaW1wb3J0IHtCcmVha1BvaW50UmVnaXN0cnl9IGZyb20gJy4uLy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50LXJlZ2lzdHJ5JztcblxuLyoqXG4gKiBNb2NrTWF0Y2hNZWRpYSBtb2NrcyBjYWxscyB0byB0aGUgV2luZG93IEFQSSBtYXRjaE1lZGlhIHdpdGggYSBidWlsZCBvZiBhIHNpbXVsYXRlZFxuICogTW9ja01lZGlhUXVlcnlMaXN0ZW5lci4gTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIHNpbXVsYXRlIGFuIGFjdGl2YXRpb24gb2YgYSBtZWRpYVF1ZXJ5XG4gKiByYW5nZSBhbmQgdG8gY2xlYXJBbGwgbWVkaWFRdWVyeSBsaXN0ZW5lcnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNb2NrTWF0Y2hNZWRpYSBleHRlbmRzIE1hdGNoTWVkaWEge1xuXG5cbiAgYXV0b1JlZ2lzdGVyUXVlcmllcyA9IHRydWU7ICAgLy8gVXNlZCBmb3IgdGVzdGluZyBCcmVha1BvaW50IHJlZ2lzdHJhdGlvbnNcbiAgdXNlT3ZlcmxhcHMgPSBmYWxzZTsgICAgICAgICAgLy8gQWxsb3cgZmFsbGJhY2sgdG8gb3ZlcmxhcHBpbmcgbWVkaWFRdWVyaWVzXG5cbiAgY29uc3RydWN0b3IoX3pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2JyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnkpIHtcbiAgICBzdXBlcihfem9uZSwgX3BsYXRmb3JtSWQsIF9kb2N1bWVudCk7XG4gIH1cblxuICAvKiogRWFzeSBtZXRob2QgdG8gY2xlYXIgYWxsIGxpc3RlbmVycyBmb3IgYWxsIG1lZGlhUXVlcmllcyAqL1xuICBjbGVhckFsbCgpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5LmZvckVhY2goKG1xbDogTWVkaWFRdWVyeUxpc3QpID0+IHtcbiAgICAgIChtcWwgYXMgTW9ja01lZGlhUXVlcnlMaXN0KS5kZXN0cm95KCk7XG4gICAgfSk7XG4gICAgdGhpcy5yZWdpc3RyeS5jbGVhcigpO1xuICAgIHRoaXMudXNlT3ZlcmxhcHMgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBGZWF0dXJlIHRvIHN1cHBvcnQgbWFudWFsLCBzaW11bGF0ZWQgYWN0aXZhdGlvbiBvZiBhIG1lZGlhUXVlcnkuICovXG4gIGFjdGl2YXRlKG1lZGlhUXVlcnk6IHN0cmluZywgdXNlT3ZlcmxhcHMgPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIHVzZU92ZXJsYXBzID0gdXNlT3ZlcmxhcHMgfHwgdGhpcy51c2VPdmVybGFwcztcbiAgICBtZWRpYVF1ZXJ5ID0gdGhpcy5fdmFsaWRhdGVRdWVyeShtZWRpYVF1ZXJ5KTtcblxuICAgIGlmICh1c2VPdmVybGFwcyB8fCAhdGhpcy5pc0FjdGl2ZShtZWRpYVF1ZXJ5KSkge1xuICAgICAgdGhpcy5fZGVhY3RpdmF0ZUFsbCgpO1xuXG4gICAgICB0aGlzLl9yZWdpc3Rlck1lZGlhUXVlcnkobWVkaWFRdWVyeSk7XG4gICAgICB0aGlzLl9hY3RpdmF0ZVdpdGhPdmVybGFwcyhtZWRpYVF1ZXJ5LCB1c2VPdmVybGFwcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFzQWN0aXZhdGVkO1xuICB9XG5cbiAgLyoqIENvbnZlcnRzIGFuIG9wdGlvbmFsIG1lZGlhUXVlcnkgYWxpYXMgdG8gYSBzcGVjaWZpYywgdmFsaWQgbWVkaWFRdWVyeSAqL1xuICBfdmFsaWRhdGVRdWVyeShxdWVyeU9yQWxpYXM6IHN0cmluZykge1xuICAgIGNvbnN0IGJwID0gdGhpcy5fYnJlYWtwb2ludHMuZmluZEJ5QWxpYXMocXVlcnlPckFsaWFzKTtcbiAgICByZXR1cm4gKGJwICYmIGJwLm1lZGlhUXVlcnkpIHx8IHF1ZXJ5T3JBbGlhcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSBvbk1lZGlhQ2hhbmdlIGFueSBvdmVybGFwcGluZyBtZWRpYVF1ZXJpZXMgdG8gc2ltdWxhdGVcbiAgICogc2ltaWxhciBmdW5jdGlvbmFsaXR5IGluIHRoZSB3aW5kb3cubWF0Y2hNZWRpYSgpXG4gICAqL1xuICBwcml2YXRlIF9hY3RpdmF0ZVdpdGhPdmVybGFwcyhtZWRpYVF1ZXJ5OiBzdHJpbmcsIHVzZU92ZXJsYXBzOiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHVzZU92ZXJsYXBzKSB7XG4gICAgICBjb25zdCBicCA9IHRoaXMuX2JyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KG1lZGlhUXVlcnkpO1xuICAgICAgY29uc3QgYWxpYXMgPSBicCA/IGJwLmFsaWFzIDogJ3Vua25vd24nO1xuXG4gICAgICAvLyBTaW11bGF0ZSBhY3RpdmF0aW9uIG9mIG92ZXJsYXBwaW5nIGx0LTxYWFg+IHJhbmdlc1xuICAgICAgc3dpdGNoIChhbGlhcykge1xuICAgICAgICBjYXNlICdsZycgICA6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnbHQteGwnXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21kJyAgIDpcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZUJ5QWxpYXMoWydsdC14bCcsICdsdC1sZyddKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc20nICAgOlxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlQnlBbGlhcyhbJ2x0LXhsJywgJ2x0LWxnJywgJ2x0LW1kJ10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd4cycgICA6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnbHQteGwnLCAnbHQtbGcnLCAnbHQtbWQnLCAnbHQtc20nXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIFNpbXVsYXRlIGFjdGl2YXRpb24gb2Ygb3ZlcmxhcHBpbmcgZ3QtPHh4eHg+IG1lZGlhUXVlcnkgcmFuZ2VzXG4gICAgICBzd2l0Y2ggKGFsaWFzKSB7XG4gICAgICAgIGNhc2UgJ3hsJyAgIDpcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZUJ5QWxpYXMoWydndC1sZycsICdndC1tZCcsICdndC1zbScsICdndC14cyddKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbGcnICAgOlxuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlQnlBbGlhcyhbJ2d0LW1kJywgJ2d0LXNtJywgJ2d0LXhzJ10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtZCcgICA6XG4gICAgICAgICAgdGhpcy5fYWN0aXZhdGVCeUFsaWFzKFsnZ3Qtc20nLCAnZ3QteHMnXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NtJyAgIDpcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZUJ5QWxpYXMoWydndC14cyddKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBY3RpdmF0ZSBsYXN0IHNpbmNlIHRoZSByZXNwb25zaXZlQWN0aXZhdGlvbiBpcyB3YXRjaGluZyAqdGhpcyogbWVkaWFRdWVyeVxuICAgIHJldHVybiB0aGlzLl9hY3RpdmF0ZUJ5UXVlcnkobWVkaWFRdWVyeSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByaXZhdGUgX2FjdGl2YXRlQnlBbGlhcyhhbGlhc2VzOiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IGFjdGl2YXRlID0gKGFsaWFzOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGJwID0gdGhpcy5fYnJlYWtwb2ludHMuZmluZEJ5QWxpYXMoYWxpYXMpO1xuICAgICAgdGhpcy5fYWN0aXZhdGVCeVF1ZXJ5KGJwID8gYnAubWVkaWFRdWVyeSA6IGFsaWFzKTtcbiAgICB9O1xuICAgIGFsaWFzZXMuZm9yRWFjaChhY3RpdmF0ZSk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByaXZhdGUgX2FjdGl2YXRlQnlRdWVyeShtZWRpYVF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMucmVnaXN0cnkuaGFzKG1lZGlhUXVlcnkpICYmIHRoaXMuYXV0b1JlZ2lzdGVyUXVlcmllcykge1xuICAgICAgdGhpcy5fcmVnaXN0ZXJNZWRpYVF1ZXJ5KG1lZGlhUXVlcnkpO1xuICAgIH1cbiAgICBjb25zdCBtcWw6IE1vY2tNZWRpYVF1ZXJ5TGlzdCA9IHRoaXMucmVnaXN0cnkuZ2V0KG1lZGlhUXVlcnkpIGFzIE1vY2tNZWRpYVF1ZXJ5TGlzdDtcblxuICAgIGlmIChtcWwgJiYgIXRoaXMuaXNBY3RpdmUobWVkaWFRdWVyeSkpIHtcbiAgICAgIHRoaXMucmVnaXN0cnkuc2V0KG1lZGlhUXVlcnksIG1xbC5hY3RpdmF0ZSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaGFzQWN0aXZhdGVkO1xuICB9XG5cbiAgLyoqIERlYWN0aXZhdGUgYWxsIGN1cnJlbnQgTVFMcyBhbmQgcmVzZXQgdGhlIGJ1ZmZlciAqL1xuICBwcml2YXRlIF9kZWFjdGl2YXRlQWxsKCkge1xuICAgIHRoaXMucmVnaXN0cnkuZm9yRWFjaCgoaXQ6IE1lZGlhUXVlcnlMaXN0KSA9PiB7XG4gICAgICAoaXQgYXMgTW9ja01lZGlhUXVlcnlMaXN0KS5kZWFjdGl2YXRlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogSW5zdXJlIHRoZSBtZWRpYVF1ZXJ5IGlzIHJlZ2lzdGVyZWQgd2l0aCBNYXRjaE1lZGlhICovXG4gIHByaXZhdGUgX3JlZ2lzdGVyTWVkaWFRdWVyeShtZWRpYVF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMucmVnaXN0cnkuaGFzKG1lZGlhUXVlcnkpICYmIHRoaXMuYXV0b1JlZ2lzdGVyUXVlcmllcykge1xuICAgICAgdGhpcy5yZWdpc3RlclF1ZXJ5KG1lZGlhUXVlcnkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHdpbmRvdy5tYXRjaE1lZGlhKCkgdG8gYnVpbGQgYSBNZWRpYVF1ZXJ5TGlzdDsgd2hpY2hcbiAgICogc3VwcG9ydHMgMC4ubiBsaXN0ZW5lcnMgZm9yIGFjdGl2YXRpb24vZGVhY3RpdmF0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgYnVpbGRNUUwocXVlcnk6IHN0cmluZyk6IE1lZGlhUXVlcnlMaXN0IHtcbiAgICByZXR1cm4gbmV3IE1vY2tNZWRpYVF1ZXJ5TGlzdChxdWVyeSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGhhc0FjdGl2YXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmF0aW9ucy5sZW5ndGggPiAwO1xuICB9XG5cbn1cblxuLyoqXG4gKiBTcGVjaWFsIGludGVybmFsIGNsYXNzIHRvIHNpbXVsYXRlIGEgTWVkaWFRdWVyeUxpc3QgYW5kXG4gKiAtIHN1cHBvcnRzIG1hbnVhbCBhY3RpdmF0aW9uIHRvIHNpbXVsYXRlIG1lZGlhUXVlcnkgbWF0Y2hpbmdcbiAqIC0gbWFuYWdlcyBsaXN0ZW5lcnNcbiAqL1xuZXhwb3J0IGNsYXNzIE1vY2tNZWRpYVF1ZXJ5TGlzdCBpbXBsZW1lbnRzIE1lZGlhUXVlcnlMaXN0IHtcbiAgcHJpdmF0ZSBfaXNBY3RpdmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbGlzdGVuZXJzOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyW10gPSBbXTtcblxuICBnZXQgbWF0Y2hlcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNBY3RpdmU7XG4gIH1cblxuICBnZXQgbWVkaWEoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVkaWFRdWVyeTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lZGlhUXVlcnk6IHN0cmluZykge1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGN1cnJlbnQgbGlzdCBieSBkZWFjdGl2YXRpbmcgdGhlXG4gICAqIGxpc3RlbmVycyBhbmQgY2xlYXJpbmcgdGhlIGludGVybmFsIGxpc3RcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKiogTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCAnbWF0Y2hlcyA9PT0gVFJVRScgKi9cbiAgYWN0aXZhdGUoKTogTW9ja01lZGlhUXVlcnlMaXN0IHtcbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgY2I6ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpID0gY2FsbGJhY2shO1xuICAgICAgICBjYi5jYWxsKHRoaXMsIHttYXRjaGVzOiB0aGlzLm1hdGNoZXMsIG1lZGlhOiB0aGlzLm1lZGlhfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBOb3RpZnkgYWxsIGxpc3RlbmVycyB0aGF0ICdtYXRjaGVzID09PSBmYWxzZScgKi9cbiAgZGVhY3RpdmF0ZSgpOiBNb2NrTWVkaWFRdWVyeUxpc3Qge1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zdCBjYjogKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSkgPSBjYWxsYmFjayE7XG4gICAgICAgIGNiLmNhbGwodGhpcywge21hdGNoZXM6IHRoaXMubWF0Y2hlcywgbWVkaWE6IHRoaXMubWVkaWF9IGFzIE1lZGlhUXVlcnlMaXN0RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIEFkZCBhIGxpc3RlbmVyIHRvIG91ciBpbnRlcm5hbCBsaXN0IHRvIGFjdGl2YXRlIGxhdGVyICovXG4gIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBNZWRpYVF1ZXJ5TGlzdExpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICBjb25zdCBjYjogKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSkgPSBsaXN0ZW5lciE7XG4gICAgICBjYi5jYWxsKHRoaXMsIHttYXRjaGVzOiB0aGlzLm1hdGNoZXMsIG1lZGlhOiB0aGlzLm1lZGlhfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9uJ3QgbmVlZCB0byByZW1vdmUgbGlzdGVuZXJzIGluIHRoZSB0ZXN0aW5nIGVudmlyb25tZW50ICovXG4gIHJlbW92ZUxpc3RlbmVyKF86IE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgfCBudWxsKSB7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwPihcbiAgICAgIF86IEssXG4gICAgICBfXzogKHRoaXM6IE1lZGlhUXVlcnlMaXN0LFxuICAgICAgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnRNYXBbS10pID0+IGFueSxcbiAgICAgIF9fXz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIF86IHN0cmluZyxcbiAgICAgIF9fOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0LFxuICAgICAgX19fPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKSB7XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwPihcbiAgICAgIF86IEssXG4gICAgICBfXzogKHRoaXM6IE1lZGlhUXVlcnlMaXN0LFxuICAgICAgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnRNYXBbS10pID0+IGFueSxcbiAgICAgIF9fXz86IGJvb2xlYW4gfCBFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIF86IHN0cmluZyxcbiAgICAgIF9fOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0LFxuICAgICAgX19fPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zKSB7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KF86IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb25jaGFuZ2U6IE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgPSBudWxsO1xufVxuXG4vKipcbiAqIFByZS1jb25maWd1cmVkIHByb3ZpZGVyIGZvciBNb2NrTWF0Y2hNZWRpYVxuICovXG5leHBvcnQgY29uc3QgTW9ja01hdGNoTWVkaWFQcm92aWRlciA9IHsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcm92aWRlOiBNYXRjaE1lZGlhLFxuICB1c2VDbGFzczogTW9ja01hdGNoTWVkaWFcbn07XG5cbnR5cGUgTWVkaWFRdWVyeUxpc3RMaXN0ZW5lciA9ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpIHwgbnVsbDtcbiJdfQ==