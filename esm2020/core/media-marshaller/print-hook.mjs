/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable } from '@angular/core';
import { mergeAlias } from '../add-alias';
import { MediaChange } from '../media-change';
import { LAYOUT_CONFIG } from '../tokens/library-config';
import { sortDescendingPriority } from '../utils/sort';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "../breakpoints/break-point-registry";
const PRINT = 'print';
export const BREAKPOINT_PRINT = {
    alias: PRINT,
    mediaQuery: PRINT,
    priority: 1000
};
/**
 * PrintHook - Use to intercept print MediaQuery activations and force
 *             layouts to render with the specified print alias/breakpoint
 *
 * Used in MediaMarshaller and MediaObserver
 */
export class PrintHook {
    constructor(breakpoints, layoutConfig, _document) {
        this.breakpoints = breakpoints;
        this.layoutConfig = layoutConfig;
        this._document = _document;
        // registeredBeforeAfterPrintHooks tracks if we registered the `beforeprint`
        //  and `afterprint` event listeners.
        this.registeredBeforeAfterPrintHooks = false;
        // isPrintingBeforeAfterEvent is used to track if we are printing from within
        // a `beforeprint` event handler. This prevents the typicall `stopPrinting`
        // form `interceptEvents` so that printing is not stopped while the dialog
        // is still open. This is an extension of the `isPrinting` property on
        // browsers which support `beforeprint` and `afterprint` events.
        this.isPrintingBeforeAfterEvent = false;
        this.beforePrintEventListeners = [];
        this.afterPrintEventListeners = [];
        /** Is this service currently in Print-mode ? */
        this.isPrinting = false;
        this.queue = new PrintQueue();
        this.deactivations = [];
    }
    /** Add 'print' mediaQuery: to listen for matchMedia activations */
    withPrintQuery(queries) {
        return [...queries, PRINT];
    }
    /** Is the MediaChange event for any 'print' @media */
    isPrintEvent(e) {
        return e.mediaQuery.startsWith(PRINT);
    }
    /** What is the desired mqAlias to use while printing? */
    get printAlias() {
        return this.layoutConfig.printWithBreakpoints || [];
    }
    /** Lookup breakpoints associated with print aliases. */
    get printBreakPoints() {
        return this.printAlias
            .map(alias => this.breakpoints.findByAlias(alias))
            .filter(bp => bp !== null);
    }
    /** Lookup breakpoint associated with mediaQuery */
    getEventBreakpoints({ mediaQuery }) {
        const bp = this.breakpoints.findByQuery(mediaQuery);
        const list = bp ? [...this.printBreakPoints, bp] : this.printBreakPoints;
        return list.sort(sortDescendingPriority);
    }
    /** Update event with printAlias mediaQuery information */
    updateEvent(event) {
        let bp = this.breakpoints.findByQuery(event.mediaQuery);
        if (this.isPrintEvent(event)) {
            // Reset from 'print' to first (highest priority) print breakpoint
            bp = this.getEventBreakpoints(event)[0];
            event.mediaQuery = bp ? bp.mediaQuery : '';
        }
        return mergeAlias(event, bp);
    }
    // registerBeforeAfterPrintHooks registers a `beforeprint` event hook so we can
    // trigger print styles synchronously and apply proper layout styles.
    // It is a noop if the hooks have already been registered or if the document's
    // `defaultView` is not available.
    registerBeforeAfterPrintHooks(target) {
        // `defaultView` may be null when rendering on the server or in other contexts.
        if (!this._document.defaultView || this.registeredBeforeAfterPrintHooks) {
            return;
        }
        this.registeredBeforeAfterPrintHooks = true;
        const beforePrintListener = () => {
            // If we aren't already printing, start printing and update the styles as
            // if there was a regular print `MediaChange`(from matchMedia).
            if (!this.isPrinting) {
                this.isPrintingBeforeAfterEvent = true;
                this.startPrinting(target, this.getEventBreakpoints(new MediaChange(true, PRINT)));
                target.updateStyles();
            }
        };
        const afterPrintListener = () => {
            // If we aren't already printing, start printing and update the styles as
            // if there was a regular print `MediaChange`(from matchMedia).
            this.isPrintingBeforeAfterEvent = false;
            if (this.isPrinting) {
                this.stopPrinting(target);
                target.updateStyles();
            }
        };
        // Could we have teardown logic to remove if there are no print listeners being used?
        this._document.defaultView.addEventListener('beforeprint', beforePrintListener);
        this._document.defaultView.addEventListener('afterprint', afterPrintListener);
        this.beforePrintEventListeners.push(beforePrintListener);
        this.afterPrintEventListeners.push(afterPrintListener);
    }
    /**
     * Prepare RxJS filter operator with partial application
     * @return pipeable filter predicate
     */
    interceptEvents(target) {
        this.registerBeforeAfterPrintHooks(target);
        return (event) => {
            if (this.isPrintEvent(event)) {
                if (event.matches && !this.isPrinting) {
                    this.startPrinting(target, this.getEventBreakpoints(event));
                    target.updateStyles();
                }
                else if (!event.matches && this.isPrinting && !this.isPrintingBeforeAfterEvent) {
                    this.stopPrinting(target);
                    target.updateStyles();
                }
            }
            else {
                this.collectActivations(event);
            }
        };
    }
    /** Stop mediaChange event propagation in event streams */
    blockPropagation() {
        return (event) => {
            return !(this.isPrinting || this.isPrintEvent(event));
        };
    }
    /**
     * Save current activateBreakpoints (for later restore)
     * and substitute only the printAlias breakpoint
     */
    startPrinting(target, bpList) {
        this.isPrinting = true;
        target.activatedBreakpoints = this.queue.addPrintBreakpoints(bpList);
    }
    /** For any print de-activations, reset the entire print queue */
    stopPrinting(target) {
        target.activatedBreakpoints = this.deactivations;
        this.deactivations = [];
        this.queue.clear();
        this.isPrinting = false;
    }
    /**
     * To restore pre-Print Activations, we must capture the proper
     * list of breakpoint activations BEFORE print starts. OnBeforePrint()
     * is supported; so 'print' mediaQuery activations are used as a fallback
     * in browsers without `beforeprint` support.
     *
     * >  But activated breakpoints are deactivated BEFORE 'print' activation.
     *
     * Let's capture all de-activations using the following logic:
     *
     *  When not printing:
     *    - clear cache when activating non-print breakpoint
     *    - update cache (and sort) when deactivating
     *
     *  When printing:
     *    - sort and save when starting print
     *    - restore as activatedTargets and clear when stop printing
     */
    collectActivations(event) {
        if (!this.isPrinting || this.isPrintingBeforeAfterEvent) {
            if (!event.matches) {
                const bp = this.breakpoints.findByQuery(event.mediaQuery);
                if (bp) { // Deactivating a breakpoint
                    this.deactivations.push(bp);
                    this.deactivations.sort(sortDescendingPriority);
                }
            }
            else if (!this.isPrintingBeforeAfterEvent) {
                // Only clear deactivations if we aren't printing from a `beforeprint` event.
                // Otherwise this will clear before `stopPrinting()` is called to restore
                // the pre-Print Activations.
                this.deactivations = [];
            }
        }
    }
    /** Teardown logic for the service. */
    ngOnDestroy() {
        if (this._document.defaultView) {
            this.beforePrintEventListeners.forEach(l => this._document.defaultView.removeEventListener('beforeprint', l));
            this.afterPrintEventListeners.forEach(l => this._document.defaultView.removeEventListener('afterprint', l));
        }
    }
}
PrintHook.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PrintHook, deps: [{ token: i1.BreakPointRegistry }, { token: LAYOUT_CONFIG }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
PrintHook.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PrintHook, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PrintHook, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.BreakPointRegistry }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
// ************************************************************************
// Internal Utility class 'PrintQueue'
// ************************************************************************
/**
 * Utility class to manage print breakpoints + activatedBreakpoints
 * with correct sorting WHILE printing
 */
class PrintQueue {
    constructor() {
        /** Sorted queue with prioritized print breakpoints */
        this.printBreakpoints = [];
    }
    addPrintBreakpoints(bpList) {
        bpList.push(BREAKPOINT_PRINT);
        bpList.sort(sortDescendingPriority);
        bpList.forEach(bp => this.addBreakpoint(bp));
        return this.printBreakpoints;
    }
    /** Add Print breakpoint to queue */
    addBreakpoint(bp) {
        if (!!bp) {
            const bpInList = this.printBreakpoints.find(it => it.mediaQuery === bp.mediaQuery);
            if (bpInList === undefined) {
                // If this is a `printAlias` breakpoint, then append. If a true 'print' breakpoint,
                // register as highest priority in the queue
                this.printBreakpoints = isPrintBreakPoint(bp) ? [bp, ...this.printBreakpoints]
                    : [...this.printBreakpoints, bp];
            }
        }
    }
    /** Restore original activated breakpoints and clear internal caches */
    clear() {
        this.printBreakpoints = [];
    }
}
// ************************************************************************
// Internal Utility methods
// ************************************************************************
/** Only support intercept queueing if the Breakpoint is a print @media query */
function isPrintBreakPoint(bp) {
    return bp ? bp.mediaQuery.startsWith(PRINT) : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnQtaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL3ByaW50LWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFVekMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLEtBQUssRUFBRSxLQUFLO0lBQ1osVUFBVSxFQUFFLEtBQUs7SUFDakIsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBRUY7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUNjLFdBQStCLEVBQ1IsWUFBaUMsRUFDdEMsU0FBYztRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDUixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDdEMsY0FBUyxHQUFULFNBQVMsQ0FBSztRQTZDOUMsNEVBQTRFO1FBQzVFLHFDQUFxQztRQUM3QixvQ0FBK0IsR0FBWSxLQUFLLENBQUM7UUFFekQsNkVBQTZFO1FBQzdFLDJFQUEyRTtRQUMzRSwwRUFBMEU7UUFDMUUsc0VBQXNFO1FBQ3RFLGdFQUFnRTtRQUN4RCwrQkFBMEIsR0FBWSxLQUFLLENBQUM7UUFFNUMsOEJBQXlC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aUJBQWlCLENBQUMsRUFBc0I7SUFDL0MsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcbmltcG9ydCB7TWVkaWFDaGFuZ2V9IGZyb20gJy4uL21lZGlhLWNoYW5nZSc7XG5pbXBvcnQge0JyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50JztcbmltcG9ydCB7TEFZT1VUX0NPTkZJRywgTGF5b3V0Q29uZmlnT3B0aW9uc30gZnJvbSAnLi4vdG9rZW5zL2xpYnJhcnktY29uZmlnJztcbmltcG9ydCB7QnJlYWtQb2ludFJlZ2lzdHJ5LCBPcHRpb25hbEJyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50LXJlZ2lzdHJ5JztcbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG4vKipcbiAqIEludGVyZmFjZSB0byBhcHBseSBQcmludEhvb2sgdG8gY2FsbCBhbm9ueW1vdXMgYHRhcmdldC51cGRhdGVTdHlsZXMoKWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb29rVGFyZ2V0IHtcbiAgYWN0aXZhdGVkQnJlYWtwb2ludHM6IEJyZWFrUG9pbnRbXTtcbiAgdXBkYXRlU3R5bGVzKCk6IHZvaWQ7XG59XG5cbmNvbnN0IFBSSU5UID0gJ3ByaW50JztcbmV4cG9ydCBjb25zdCBCUkVBS1BPSU5UX1BSSU5UID0ge1xuICBhbGlhczogUFJJTlQsXG4gIG1lZGlhUXVlcnk6IFBSSU5ULFxuICBwcmlvcml0eTogMTAwMFxufTtcblxuLyoqXG4gKiBQcmludEhvb2sgLSBVc2UgdG8gaW50ZXJjZXB0IHByaW50IE1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgYW5kIGZvcmNlXG4gKiAgICAgICAgICAgICBsYXlvdXRzIHRvIHJlbmRlciB3aXRoIHRoZSBzcGVjaWZpZWQgcHJpbnQgYWxpYXMvYnJlYWtwb2ludFxuICpcbiAqIFVzZWQgaW4gTWVkaWFNYXJzaGFsbGVyIGFuZCBNZWRpYU9ic2VydmVyXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFByaW50SG9vayBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJvdGVjdGVkIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnksXG4gICAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcm90ZWN0ZWQgX2RvY3VtZW50OiBhbnkpIHtcbiAgfVxuXG4gIC8qKiBBZGQgJ3ByaW50JyBtZWRpYVF1ZXJ5OiB0byBsaXN0ZW4gZm9yIG1hdGNoTWVkaWEgYWN0aXZhdGlvbnMgKi9cbiAgd2l0aFByaW50UXVlcnkocXVlcmllczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFsuLi5xdWVyaWVzLCBQUklOVF07XG4gIH1cblxuICAvKiogSXMgdGhlIE1lZGlhQ2hhbmdlIGV2ZW50IGZvciBhbnkgJ3ByaW50JyBAbWVkaWEgKi9cbiAgaXNQcmludEV2ZW50KGU6IE1lZGlhQ2hhbmdlKTogQm9vbGVhbiB7XG4gICAgcmV0dXJuIGUubWVkaWFRdWVyeS5zdGFydHNXaXRoKFBSSU5UKTtcbiAgfVxuXG4gIC8qKiBXaGF0IGlzIHRoZSBkZXNpcmVkIG1xQWxpYXMgdG8gdXNlIHdoaWxlIHByaW50aW5nPyAqL1xuICBnZXQgcHJpbnRBbGlhcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMubGF5b3V0Q29uZmlnLnByaW50V2l0aEJyZWFrcG9pbnRzIHx8IFtdO1xuICB9XG5cbiAgLyoqIExvb2t1cCBicmVha3BvaW50cyBhc3NvY2lhdGVkIHdpdGggcHJpbnQgYWxpYXNlcy4gKi9cbiAgZ2V0IHByaW50QnJlYWtQb2ludHMoKTogQnJlYWtQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wcmludEFsaWFzXG4gICAgICAgIC5tYXAoYWxpYXMgPT4gdGhpcy5icmVha3BvaW50cy5maW5kQnlBbGlhcyhhbGlhcykpXG4gICAgICAgIC5maWx0ZXIoYnAgPT4gYnAgIT09IG51bGwpIGFzIEJyZWFrUG9pbnRbXTtcbiAgfVxuXG4gIC8qKiBMb29rdXAgYnJlYWtwb2ludCBhc3NvY2lhdGVkIHdpdGggbWVkaWFRdWVyeSAqL1xuICBnZXRFdmVudEJyZWFrcG9pbnRzKHttZWRpYVF1ZXJ5fTogTWVkaWFDaGFuZ2UpOiBCcmVha1BvaW50W10ge1xuICAgIGNvbnN0IGJwID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShtZWRpYVF1ZXJ5KTtcbiAgICBjb25zdCBsaXN0ID0gYnAgPyBbLi4udGhpcy5wcmludEJyZWFrUG9pbnRzLCBicF0gOiB0aGlzLnByaW50QnJlYWtQb2ludHM7XG5cbiAgICByZXR1cm4gbGlzdC5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICB9XG5cbiAgLyoqIFVwZGF0ZSBldmVudCB3aXRoIHByaW50QWxpYXMgbWVkaWFRdWVyeSBpbmZvcm1hdGlvbiAqL1xuICB1cGRhdGVFdmVudChldmVudDogTWVkaWFDaGFuZ2UpOiBNZWRpYUNoYW5nZSB7XG4gICAgbGV0IGJwOiBPcHRpb25hbEJyZWFrUG9pbnQgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGV2ZW50Lm1lZGlhUXVlcnkpO1xuICAgIGlmICh0aGlzLmlzUHJpbnRFdmVudChldmVudCkpIHtcbiAgICAgIC8vIFJlc2V0IGZyb20gJ3ByaW50JyB0byBmaXJzdCAoaGlnaGVzdCBwcmlvcml0eSkgcHJpbnQgYnJlYWtwb2ludFxuICAgICAgYnAgPSB0aGlzLmdldEV2ZW50QnJlYWtwb2ludHMoZXZlbnQpWzBdO1xuICAgICAgZXZlbnQubWVkaWFRdWVyeSA9IGJwID8gYnAubWVkaWFRdWVyeSA6ICcnO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VBbGlhcyhldmVudCwgYnApO1xuICB9XG5cblxuICAvLyByZWdpc3RlcmVkQmVmb3JlQWZ0ZXJQcmludEhvb2tzIHRyYWNrcyBpZiB3ZSByZWdpc3RlcmVkIHRoZSBgYmVmb3JlcHJpbnRgXG4gIC8vICBhbmQgYGFmdGVycHJpbnRgIGV2ZW50IGxpc3RlbmVycy5cbiAgcHJpdmF0ZSByZWdpc3RlcmVkQmVmb3JlQWZ0ZXJQcmludEhvb2tzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gaXNQcmludGluZ0JlZm9yZUFmdGVyRXZlbnQgaXMgdXNlZCB0byB0cmFjayBpZiB3ZSBhcmUgcHJpbnRpbmcgZnJvbSB3aXRoaW5cbiAgLy8gYSBgYmVmb3JlcHJpbnRgIGV2ZW50IGhhbmRsZXIuIFRoaXMgcHJldmVudHMgdGhlIHR5cGljYWxsIGBzdG9wUHJpbnRpbmdgXG4gIC8vIGZvcm0gYGludGVyY2VwdEV2ZW50c2Agc28gdGhhdCBwcmludGluZyBpcyBub3Qgc3RvcHBlZCB3aGlsZSB0aGUgZGlhbG9nXG4gIC8vIGlzIHN0aWxsIG9wZW4uIFRoaXMgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSBgaXNQcmludGluZ2AgcHJvcGVydHkgb25cbiAgLy8gYnJvd3NlcnMgd2hpY2ggc3VwcG9ydCBgYmVmb3JlcHJpbnRgIGFuZCBgYWZ0ZXJwcmludGAgZXZlbnRzLlxuICBwcml2YXRlIGlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBiZWZvcmVQcmludEV2ZW50TGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgYWZ0ZXJQcmludEV2ZW50TGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG5cbiAgLy8gcmVnaXN0ZXJCZWZvcmVBZnRlclByaW50SG9va3MgcmVnaXN0ZXJzIGEgYGJlZm9yZXByaW50YCBldmVudCBob29rIHNvIHdlIGNhblxuICAvLyB0cmlnZ2VyIHByaW50IHN0eWxlcyBzeW5jaHJvbm91c2x5IGFuZCBhcHBseSBwcm9wZXIgbGF5b3V0IHN0eWxlcy5cbiAgLy8gSXQgaXMgYSBub29wIGlmIHRoZSBob29rcyBoYXZlIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIG9yIGlmIHRoZSBkb2N1bWVudCdzXG4gIC8vIGBkZWZhdWx0Vmlld2AgaXMgbm90IGF2YWlsYWJsZS5cbiAgcHJpdmF0ZSByZWdpc3RlckJlZm9yZUFmdGVyUHJpbnRIb29rcyh0YXJnZXQ6IEhvb2tUYXJnZXQpIHtcbiAgICAvLyBgZGVmYXVsdFZpZXdgIG1heSBiZSBudWxsIHdoZW4gcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIgb3IgaW4gb3RoZXIgY29udGV4dHMuXG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudC5kZWZhdWx0VmlldyB8fCB0aGlzLnJlZ2lzdGVyZWRCZWZvcmVBZnRlclByaW50SG9va3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdGVyZWRCZWZvcmVBZnRlclByaW50SG9va3MgPSB0cnVlO1xuXG4gICAgY29uc3QgYmVmb3JlUHJpbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgIC8vIElmIHdlIGFyZW4ndCBhbHJlYWR5IHByaW50aW5nLCBzdGFydCBwcmludGluZyBhbmQgdXBkYXRlIHRoZSBzdHlsZXMgYXNcbiAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJlZ3VsYXIgcHJpbnQgYE1lZGlhQ2hhbmdlYChmcm9tIG1hdGNoTWVkaWEpLlxuICAgICAgaWYgKCF0aGlzLmlzUHJpbnRpbmcpIHtcbiAgICAgICAgdGhpcy5pc1ByaW50aW5nQmVmb3JlQWZ0ZXJFdmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhcnRQcmludGluZyh0YXJnZXQsIHRoaXMuZ2V0RXZlbnRCcmVha3BvaW50cyhuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgUFJJTlQpKSk7XG4gICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYWZ0ZXJQcmludExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgLy8gSWYgd2UgYXJlbid0IGFscmVhZHkgcHJpbnRpbmcsIHN0YXJ0IHByaW50aW5nIGFuZCB1cGRhdGUgdGhlIHN0eWxlcyBhc1xuICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgcmVndWxhciBwcmludCBgTWVkaWFDaGFuZ2VgKGZyb20gbWF0Y2hNZWRpYSkuXG4gICAgICB0aGlzLmlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50ID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5pc1ByaW50aW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcFByaW50aW5nKHRhcmdldCk7XG4gICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ291bGQgd2UgaGF2ZSB0ZWFyZG93biBsb2dpYyB0byByZW1vdmUgaWYgdGhlcmUgYXJlIG5vIHByaW50IGxpc3RlbmVycyBiZWluZyB1c2VkP1xuICAgIHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50JywgYmVmb3JlUHJpbnRMaXN0ZW5lcik7XG4gICAgdGhpcy5fZG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignYWZ0ZXJwcmludCcsIGFmdGVyUHJpbnRMaXN0ZW5lcik7XG5cbiAgICB0aGlzLmJlZm9yZVByaW50RXZlbnRMaXN0ZW5lcnMucHVzaChiZWZvcmVQcmludExpc3RlbmVyKTtcbiAgICB0aGlzLmFmdGVyUHJpbnRFdmVudExpc3RlbmVycy5wdXNoKGFmdGVyUHJpbnRMaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZSBSeEpTIGZpbHRlciBvcGVyYXRvciB3aXRoIHBhcnRpYWwgYXBwbGljYXRpb25cbiAgICogQHJldHVybiBwaXBlYWJsZSBmaWx0ZXIgcHJlZGljYXRlXG4gICAqL1xuICBpbnRlcmNlcHRFdmVudHModGFyZ2V0OiBIb29rVGFyZ2V0KSB7XG4gICAgdGhpcy5yZWdpc3RlckJlZm9yZUFmdGVyUHJpbnRIb29rcyh0YXJnZXQpO1xuXG4gICAgcmV0dXJuIChldmVudDogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUHJpbnRFdmVudChldmVudCkpIHtcbiAgICAgICAgaWYgKGV2ZW50Lm1hdGNoZXMgJiYgIXRoaXMuaXNQcmludGluZykge1xuICAgICAgICAgIHRoaXMuc3RhcnRQcmludGluZyh0YXJnZXQsIHRoaXMuZ2V0RXZlbnRCcmVha3BvaW50cyhldmVudCkpO1xuICAgICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCFldmVudC5tYXRjaGVzICYmIHRoaXMuaXNQcmludGluZyAmJiAhdGhpcy5pc1ByaW50aW5nQmVmb3JlQWZ0ZXJFdmVudCkge1xuICAgICAgICAgIHRoaXMuc3RvcFByaW50aW5nKHRhcmdldCk7XG4gICAgICAgICAgdGFyZ2V0LnVwZGF0ZVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbGxlY3RBY3RpdmF0aW9ucyhldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBTdG9wIG1lZGlhQ2hhbmdlIGV2ZW50IHByb3BhZ2F0aW9uIGluIGV2ZW50IHN0cmVhbXMgKi9cbiAgYmxvY2tQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gKGV2ZW50OiBNZWRpYUNoYW5nZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgcmV0dXJuICEodGhpcy5pc1ByaW50aW5nIHx8IHRoaXMuaXNQcmludEV2ZW50KGV2ZW50KSk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGN1cnJlbnQgYWN0aXZhdGVCcmVha3BvaW50cyAoZm9yIGxhdGVyIHJlc3RvcmUpXG4gICAqIGFuZCBzdWJzdGl0dXRlIG9ubHkgdGhlIHByaW50QWxpYXMgYnJlYWtwb2ludFxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXJ0UHJpbnRpbmcodGFyZ2V0OiBIb29rVGFyZ2V0LCBicExpc3Q6IE9wdGlvbmFsQnJlYWtQb2ludFtdKSB7XG4gICAgdGhpcy5pc1ByaW50aW5nID0gdHJ1ZTtcbiAgICB0YXJnZXQuYWN0aXZhdGVkQnJlYWtwb2ludHMgPSB0aGlzLnF1ZXVlLmFkZFByaW50QnJlYWtwb2ludHMoYnBMaXN0KTtcbiAgfVxuXG4gIC8qKiBGb3IgYW55IHByaW50IGRlLWFjdGl2YXRpb25zLCByZXNldCB0aGUgZW50aXJlIHByaW50IHF1ZXVlICovXG4gIHByb3RlY3RlZCBzdG9wUHJpbnRpbmcodGFyZ2V0OiBIb29rVGFyZ2V0KSB7XG4gICAgdGFyZ2V0LmFjdGl2YXRlZEJyZWFrcG9pbnRzID0gdGhpcy5kZWFjdGl2YXRpb25zO1xuICAgIHRoaXMuZGVhY3RpdmF0aW9ucyA9IFtdO1xuICAgIHRoaXMucXVldWUuY2xlYXIoKTtcbiAgICB0aGlzLmlzUHJpbnRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZXN0b3JlIHByZS1QcmludCBBY3RpdmF0aW9ucywgd2UgbXVzdCBjYXB0dXJlIHRoZSBwcm9wZXJcbiAgICogbGlzdCBvZiBicmVha3BvaW50IGFjdGl2YXRpb25zIEJFRk9SRSBwcmludCBzdGFydHMuIE9uQmVmb3JlUHJpbnQoKVxuICAgKiBpcyBzdXBwb3J0ZWQ7IHNvICdwcmludCcgbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBhcmUgdXNlZCBhcyBhIGZhbGxiYWNrXG4gICAqIGluIGJyb3dzZXJzIHdpdGhvdXQgYGJlZm9yZXByaW50YCBzdXBwb3J0LlxuICAgKlxuICAgKiA+ICBCdXQgYWN0aXZhdGVkIGJyZWFrcG9pbnRzIGFyZSBkZWFjdGl2YXRlZCBCRUZPUkUgJ3ByaW50JyBhY3RpdmF0aW9uLlxuICAgKlxuICAgKiBMZXQncyBjYXB0dXJlIGFsbCBkZS1hY3RpdmF0aW9ucyB1c2luZyB0aGUgZm9sbG93aW5nIGxvZ2ljOlxuICAgKlxuICAgKiAgV2hlbiBub3QgcHJpbnRpbmc6XG4gICAqICAgIC0gY2xlYXIgY2FjaGUgd2hlbiBhY3RpdmF0aW5nIG5vbi1wcmludCBicmVha3BvaW50XG4gICAqICAgIC0gdXBkYXRlIGNhY2hlIChhbmQgc29ydCkgd2hlbiBkZWFjdGl2YXRpbmdcbiAgICpcbiAgICogIFdoZW4gcHJpbnRpbmc6XG4gICAqICAgIC0gc29ydCBhbmQgc2F2ZSB3aGVuIHN0YXJ0aW5nIHByaW50XG4gICAqICAgIC0gcmVzdG9yZSBhcyBhY3RpdmF0ZWRUYXJnZXRzIGFuZCBjbGVhciB3aGVuIHN0b3AgcHJpbnRpbmdcbiAgICovXG4gIGNvbGxlY3RBY3RpdmF0aW9ucyhldmVudDogTWVkaWFDaGFuZ2UpIHtcbiAgICBpZiAoIXRoaXMuaXNQcmludGluZyB8fCB0aGlzLmlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50KSB7XG4gICAgICBpZiAoIWV2ZW50Lm1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgYnAgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGV2ZW50Lm1lZGlhUXVlcnkpO1xuICAgICAgICBpZiAoYnApIHsgICAvLyBEZWFjdGl2YXRpbmcgYSBicmVha3BvaW50XG4gICAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zLnB1c2goYnApO1xuICAgICAgICAgIHRoaXMuZGVhY3RpdmF0aW9ucy5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50KSB7XG4gICAgICAgIC8vIE9ubHkgY2xlYXIgZGVhY3RpdmF0aW9ucyBpZiB3ZSBhcmVuJ3QgcHJpbnRpbmcgZnJvbSBhIGBiZWZvcmVwcmludGAgZXZlbnQuXG4gICAgICAgIC8vIE90aGVyd2lzZSB0aGlzIHdpbGwgY2xlYXIgYmVmb3JlIGBzdG9wUHJpbnRpbmcoKWAgaXMgY2FsbGVkIHRvIHJlc3RvcmVcbiAgICAgICAgLy8gdGhlIHByZS1QcmludCBBY3RpdmF0aW9ucy5cbiAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zID0gW107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRlYXJkb3duIGxvZ2ljIGZvciB0aGUgc2VydmljZS4gKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3KSB7XG4gICAgICB0aGlzLmJlZm9yZVByaW50RXZlbnRMaXN0ZW5lcnMuZm9yRWFjaChsID0+IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50JywgbCkpO1xuICAgICAgdGhpcy5hZnRlclByaW50RXZlbnRMaXN0ZW5lcnMuZm9yRWFjaChsID0+IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FmdGVycHJpbnQnLCBsKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIElzIHRoaXMgc2VydmljZSBjdXJyZW50bHkgaW4gUHJpbnQtbW9kZSA/ICovXG4gIHByaXZhdGUgaXNQcmludGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHF1ZXVlOiBQcmludFF1ZXVlID0gbmV3IFByaW50UXVldWUoKTtcbiAgcHJpdmF0ZSBkZWFjdGl2YXRpb25zOiBCcmVha1BvaW50W10gPSBbXTtcblxufVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEludGVybmFsIFV0aWxpdHkgY2xhc3MgJ1ByaW50UXVldWUnXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLyoqXG4gKiBVdGlsaXR5IGNsYXNzIHRvIG1hbmFnZSBwcmludCBicmVha3BvaW50cyArIGFjdGl2YXRlZEJyZWFrcG9pbnRzXG4gKiB3aXRoIGNvcnJlY3Qgc29ydGluZyBXSElMRSBwcmludGluZ1xuICovXG5jbGFzcyBQcmludFF1ZXVlIHtcbiAgLyoqIFNvcnRlZCBxdWV1ZSB3aXRoIHByaW9yaXRpemVkIHByaW50IGJyZWFrcG9pbnRzICovXG4gIHByaW50QnJlYWtwb2ludHM6IEJyZWFrUG9pbnRbXSA9IFtdO1xuXG4gIGFkZFByaW50QnJlYWtwb2ludHMoYnBMaXN0OiBPcHRpb25hbEJyZWFrUG9pbnRbXSk6IEJyZWFrUG9pbnRbXSB7XG4gICAgYnBMaXN0LnB1c2goQlJFQUtQT0lOVF9QUklOVCk7XG4gICAgYnBMaXN0LnNvcnQoc29ydERlc2NlbmRpbmdQcmlvcml0eSk7XG4gICAgYnBMaXN0LmZvckVhY2goYnAgPT4gdGhpcy5hZGRCcmVha3BvaW50KGJwKSk7XG5cbiAgICByZXR1cm4gdGhpcy5wcmludEJyZWFrcG9pbnRzO1xuICB9XG5cbiAgLyoqIEFkZCBQcmludCBicmVha3BvaW50IHRvIHF1ZXVlICovXG4gIGFkZEJyZWFrcG9pbnQoYnA6IE9wdGlvbmFsQnJlYWtQb2ludCkge1xuICAgIGlmICghIWJwKSB7XG4gICAgICBjb25zdCBicEluTGlzdCA9IHRoaXMucHJpbnRCcmVha3BvaW50cy5maW5kKGl0ID0+IGl0Lm1lZGlhUXVlcnkgPT09IGJwLm1lZGlhUXVlcnkpO1xuICAgICAgaWYgKGJwSW5MaXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGBwcmludEFsaWFzYCBicmVha3BvaW50LCB0aGVuIGFwcGVuZC4gSWYgYSB0cnVlICdwcmludCcgYnJlYWtwb2ludCxcbiAgICAgICAgLy8gcmVnaXN0ZXIgYXMgaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICAgICAgdGhpcy5wcmludEJyZWFrcG9pbnRzID0gaXNQcmludEJyZWFrUG9pbnQoYnApID8gW2JwLCAuLi50aGlzLnByaW50QnJlYWtwb2ludHNdXG4gICAgICAgICAgICA6IFsuLi50aGlzLnByaW50QnJlYWtwb2ludHMsIGJwXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZSBvcmlnaW5hbCBhY3RpdmF0ZWQgYnJlYWtwb2ludHMgYW5kIGNsZWFyIGludGVybmFsIGNhY2hlcyAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLnByaW50QnJlYWtwb2ludHMgPSBbXTtcbiAgfVxufVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEludGVybmFsIFV0aWxpdHkgbWV0aG9kc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8qKiBPbmx5IHN1cHBvcnQgaW50ZXJjZXB0IHF1ZXVlaW5nIGlmIHRoZSBCcmVha3BvaW50IGlzIGEgcHJpbnQgQG1lZGlhIHF1ZXJ5ICovXG5mdW5jdGlvbiBpc1ByaW50QnJlYWtQb2ludChicDogT3B0aW9uYWxCcmVha1BvaW50KSB7XG4gIHJldHVybiBicCA/IGJwLm1lZGlhUXVlcnkuc3RhcnRzV2l0aChQUklOVCkgOiBmYWxzZTtcbn1cbiJdfQ==