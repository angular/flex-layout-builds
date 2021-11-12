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
ServerMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ServerMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: BREAKPOINTS }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
ServerMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ServerMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: ServerMatchMedia, decorators: [{
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
//# sourceMappingURL=server-match-media.js.map