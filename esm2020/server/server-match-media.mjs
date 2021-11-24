/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ɵMatchMedia as MatchMedia, BREAKPOINTS, LAYOUT_CONFIG } from '@angular/flex-layout/core';
import * as i0 from "@angular/core";
/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class ServerMediaQueryList {
    constructor(_mediaQuery, _isActive = false) {
        this._mediaQuery = _mediaQuery;
        this._isActive = _isActive;
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
    /** Don't need to remove listeners in the server environment */
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
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
export class ServerMatchMedia extends MatchMedia {
    constructor(_zone, _platformId, _document, breakpoints, layoutConfig) {
        super(_zone, _platformId, _document);
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this.breakpoints = breakpoints;
        this.layoutConfig = layoutConfig;
        this._activeBreakpoints = [];
        const serverBps = layoutConfig.ssrObserveBreakpoints;
        if (serverBps) {
            this._activeBreakpoints = serverBps
                .reduce((acc, serverBp) => {
                const foundBp = breakpoints.find(bp => serverBp === bp.alias);
                if (!foundBp) {
                    console.warn(`FlexLayoutServerModule: unknown breakpoint alias "${serverBp}"`);
                }
                else {
                    acc.push(foundBp);
                }
                return acc;
            }, []);
        }
    }
    /** Activate the specified breakpoint if we're on the server, no-op otherwise */
    activateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.activate();
        }
    }
    /** Deactivate the specified breakpoint if we're on the server, no-op otherwise */
    deactivateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.deactivate();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        const isActive = this._activeBreakpoints.some(ab => ab.mediaQuery === query);
        return new ServerMediaQueryList(query, isActive);
    }
}
ServerMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ServerMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: BREAKPOINTS }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
ServerMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ServerMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ServerMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [BREAKPOINTS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLW1hdGNoLW1lZGlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9zZXJ2ZXIvc2VydmVyLW1hdGNoLW1lZGlhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBVSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUVMLFdBQVcsSUFBSSxVQUFVLEVBQ3pCLFdBQVcsRUFDWCxhQUFhLEVBRWQsTUFBTSwyQkFBMkIsQ0FBQzs7QUFFbkM7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxvQkFBb0I7SUFXL0IsWUFBb0IsV0FBbUIsRUFBVSxZQUFZLEtBQUs7UUFBOUMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBVjFELGVBQVUsR0FBNkIsRUFBRSxDQUFDO1FBb0ZsRCxhQUFRLEdBQTJCLElBQUksQ0FBQztJQTFFNkIsQ0FBQztJQVJ0RSxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBSUQ7OztPQUdHO0lBQ0gsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsbURBQW1EO0lBQ25ELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEs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bGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE5nWm9uZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQnJlYWtQb2ludCxcbiAgybVNYXRjaE1lZGlhIGFzIE1hdGNoTWVkaWEsXG4gIEJSRUFLUE9JTlRTLFxuICBMQVlPVVRfQ09ORklHLFxuICBMYXlvdXRDb25maWdPcHRpb25zXG59IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0L2NvcmUnO1xuXG4vKipcbiAqIFNwZWNpYWwgc2VydmVyLW9ubHkgY2xhc3MgdG8gc2ltdWxhdGUgYSBNZWRpYVF1ZXJ5TGlzdCBhbmRcbiAqIC0gc3VwcG9ydHMgbWFudWFsIGFjdGl2YXRpb24gdG8gc2ltdWxhdGUgbWVkaWFRdWVyeSBtYXRjaGluZ1xuICogLSBtYW5hZ2VzIGxpc3RlbmVyc1xuICovXG5leHBvcnQgY2xhc3MgU2VydmVyTWVkaWFRdWVyeUxpc3QgaW1wbGVtZW50cyBNZWRpYVF1ZXJ5TGlzdCB7XG4gIHByaXZhdGUgX2xpc3RlbmVyczogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lcltdID0gW107XG5cbiAgZ2V0IG1hdGNoZXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlO1xuICB9XG5cbiAgZ2V0IG1lZGlhKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lZGlhUXVlcnk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZWRpYVF1ZXJ5OiBzdHJpbmcsIHByaXZhdGUgX2lzQWN0aXZlID0gZmFsc2UpIHt9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGN1cnJlbnQgbGlzdCBieSBkZWFjdGl2YXRpbmcgdGhlXG4gICAqIGxpc3RlbmVycyBhbmQgY2xlYXJpbmcgdGhlIGludGVybmFsIGxpc3RcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICAvKiogTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCAnbWF0Y2hlcyA9PT0gVFJVRScgKi9cbiAgYWN0aXZhdGUoKTogU2VydmVyTWVkaWFRdWVyeUxpc3Qge1xuICAgIGlmICghdGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zdCBjYjogKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSkgPSBjYWxsYmFjayE7XG4gICAgICAgIGNiLmNhbGwodGhpcywge21hdGNoZXM6IHRoaXMubWF0Y2hlcywgbWVkaWE6IHRoaXMubWVkaWF9IGFzIE1lZGlhUXVlcnlMaXN0RXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIE5vdGlmeSBhbGwgbGlzdGVuZXJzIHRoYXQgJ21hdGNoZXMgPT09IGZhbHNlJyAqL1xuICBkZWFjdGl2YXRlKCk6IFNlcnZlck1lZGlhUXVlcnlMaXN0IHtcbiAgICBpZiAodGhpcy5faXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgY2I6ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpID0gY2FsbGJhY2shO1xuICAgICAgICBjYi5jYWxsKHRoaXMsIHttYXRjaGVzOiB0aGlzLm1hdGNoZXMsIG1lZGlhOiB0aGlzLm1lZGlhfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBsaXN0ZW5lciB0byBvdXIgaW50ZXJuYWwgbGlzdCB0byBhY3RpdmF0ZSBsYXRlciAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgY29uc3QgY2I6ICgodGhpczogTWVkaWFRdWVyeUxpc3QsIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50KSA9PiBhbnkpID0gbGlzdGVuZXIhO1xuICAgICAgY2IuY2FsbCh0aGlzLCB7bWF0Y2hlczogdGhpcy5tYXRjaGVzLCBtZWRpYTogdGhpcy5tZWRpYX0gYXMgTWVkaWFRdWVyeUxpc3RFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvbid0IG5lZWQgdG8gcmVtb3ZlIGxpc3RlbmVycyBpbiB0aGUgc2VydmVyIGVudmlyb25tZW50ICovXG4gIHJlbW92ZUxpc3RlbmVyKF86IE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgfCBudWxsKSB7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZlxuICAgIE1lZGlhUXVlcnlMaXN0RXZlbnRNYXA+KF86IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX186ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwW0tdKSA9PiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX19fPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcbiAgYWRkRXZlbnRMaXN0ZW5lcihfOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgX186IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgX19fPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKSB7XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZlxuICAgIE1lZGlhUXVlcnlMaXN0RXZlbnRNYXA+KF86IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX186ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2OiBNZWRpYVF1ZXJ5TGlzdEV2ZW50TWFwW0tdKSA9PiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX19fPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihfOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgX186IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgX19fPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zKSB7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KF86IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb25jaGFuZ2U6IE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgPSBudWxsO1xufVxuXG4vKipcbiAqIFNwZWNpYWwgc2VydmVyLW9ubHkgaW1wbGVtZW50YXRpb24gb2YgTWF0Y2hNZWRpYSB0aGF0IHVzZXMgdGhlIGFib3ZlXG4gKiBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdCBhcyBpdHMgaW50ZXJuYWwgcmVwcmVzZW50YXRpb25cbiAqXG4gKiBBbHNvIGNvbnRhaW5zIG1ldGhvZHMgdG8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgYnJlYWtwb2ludHNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlcnZlck1hdGNoTWVkaWEgZXh0ZW5kcyBNYXRjaE1lZGlhIHtcbiAgcHJpdmF0ZSBfYWN0aXZlQnJlYWtwb2ludHM6IEJyZWFrUG9pbnRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfem9uZTogTmdab25lLFxuICAgICAgICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJvdGVjdGVkIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBASW5qZWN0KEJSRUFLUE9JTlRTKSBwcm90ZWN0ZWQgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRbXSxcbiAgICAgICAgICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcm90ZWN0ZWQgbGF5b3V0Q29uZmlnOiBMYXlvdXRDb25maWdPcHRpb25zKSB7XG4gICAgc3VwZXIoX3pvbmUsIF9wbGF0Zm9ybUlkLCBfZG9jdW1lbnQpO1xuXG4gICAgY29uc3Qgc2VydmVyQnBzID0gbGF5b3V0Q29uZmlnLnNzck9ic2VydmVCcmVha3BvaW50cztcbiAgICBpZiAoc2VydmVyQnBzKSB7XG4gICAgICB0aGlzLl9hY3RpdmVCcmVha3BvaW50cyA9IHNlcnZlckJwc1xuICAgICAgICAucmVkdWNlKChhY2M6IEJyZWFrUG9pbnRbXSwgc2VydmVyQnA6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGZvdW5kQnAgPSBicmVha3BvaW50cy5maW5kKGJwID0+IHNlcnZlckJwID09PSBicC5hbGlhcyk7XG4gICAgICAgICAgaWYgKCFmb3VuZEJwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEZsZXhMYXlvdXRTZXJ2ZXJNb2R1bGU6IHVua25vd24gYnJlYWtwb2ludCBhbGlhcyBcIiR7c2VydmVyQnB9XCJgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWNjLnB1c2goZm91bmRCcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWN0aXZhdGUgdGhlIHNwZWNpZmllZCBicmVha3BvaW50IGlmIHdlJ3JlIG9uIHRoZSBzZXJ2ZXIsIG5vLW9wIG90aGVyd2lzZSAqL1xuICBhY3RpdmF0ZUJyZWFrcG9pbnQoYnA6IEJyZWFrUG9pbnQpIHtcbiAgICBjb25zdCBsb29rdXBCcmVha3BvaW50ID0gdGhpcy5yZWdpc3RyeS5nZXQoYnAubWVkaWFRdWVyeSkgYXMgU2VydmVyTWVkaWFRdWVyeUxpc3Q7XG4gICAgaWYgKGxvb2t1cEJyZWFrcG9pbnQpIHtcbiAgICAgIGxvb2t1cEJyZWFrcG9pbnQuYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVhY3RpdmF0ZSB0aGUgc3BlY2lmaWVkIGJyZWFrcG9pbnQgaWYgd2UncmUgb24gdGhlIHNlcnZlciwgbm8tb3Agb3RoZXJ3aXNlICovXG4gIGRlYWN0aXZhdGVCcmVha3BvaW50KGJwOiBCcmVha1BvaW50KSB7XG4gICAgY29uc3QgbG9va3VwQnJlYWtwb2ludCA9IHRoaXMucmVnaXN0cnkuZ2V0KGJwLm1lZGlhUXVlcnkpIGFzIFNlcnZlck1lZGlhUXVlcnlMaXN0O1xuICAgIGlmIChsb29rdXBCcmVha3BvaW50KSB7XG4gICAgICBsb29rdXBCcmVha3BvaW50LmRlYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbCB3aW5kb3cubWF0Y2hNZWRpYSgpIHRvIGJ1aWxkIGEgTWVkaWFRdWVyeUxpc3Q7IHdoaWNoXG4gICAqIHN1cHBvcnRzIDAuLm4gbGlzdGVuZXJzIGZvciBhY3RpdmF0aW9uL2RlYWN0aXZhdGlvblxuICAgKi9cbiAgcHJvdGVjdGVkIGJ1aWxkTVFMKHF1ZXJ5OiBzdHJpbmcpOiBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdCB7XG4gICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLl9hY3RpdmVCcmVha3BvaW50cy5zb21lKGFiID0+IGFiLm1lZGlhUXVlcnkgPT09IHF1ZXJ5KTtcblxuICAgIHJldHVybiBuZXcgU2VydmVyTWVkaWFRdWVyeUxpc3QocXVlcnksIGlzQWN0aXZlKTtcbiAgfVxufVxuXG50eXBlIE1lZGlhUXVlcnlMaXN0TGlzdGVuZXIgPSAoKHRoaXM6IE1lZGlhUXVlcnlMaXN0LCBldjogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gYW55KSB8IG51bGw7XG4iXX0=