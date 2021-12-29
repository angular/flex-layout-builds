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
        // a `beforeprint` event handler. This prevents the typical `stopPrinting`
        // form `interceptEvents` so that printing is not stopped while the dialog
        // is still open. This is an extension of the `isPrinting` property on
        // browsers which support `beforeprint` and `afterprint` events.
        this.isPrintingBeforeAfterEvent = false;
        this.beforePrintEventListeners = [];
        this.afterPrintEventListeners = [];
        // Is this service currently in print mode
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
        return this.layoutConfig.printWithBreakpoints ?? [];
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
            event.mediaQuery = bp?.mediaQuery ?? '';
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
     * Prepare RxJS tap operator with partial application
     * @return pipeable tap predicate
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
                // Deactivating a breakpoint
                if (bp) {
                    this.deactivations.push(bp);
                    this.deactivations.sort(sortDescendingPriority);
                }
            }
            else if (!this.isPrintingBeforeAfterEvent) {
                // Only clear deactivations if we aren't printing from a `beforeprint` event.
                // Otherwise, this will clear before `stopPrinting()` is called to restore
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
    return bp?.mediaQuery.startsWith(PRINT) ?? false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnQtaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL3ByaW50LWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFVekMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLEtBQUssRUFBRSxLQUFLO0lBQ1osVUFBVSxFQUFFLEtBQUs7SUFDakIsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBRUY7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUNjLFdBQStCLEVBQ1IsWUFBaUMsRUFDdEMsU0FBYztRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDUixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDdEMsY0FBUyxHQUFULFNBQVMsQ0FBSztRQTZDOUMsNEVBQTRFO1FBQzVFLHFDQUFxQztRQUM3QixvQ0FBK0IsR0FBRyxLQUFLLENBQUM7UUFFaEQsNkVBQTZFO1FBQzdFLDBFQUEwRTtRQUMxRSwwRUFBMEU7UUFDMUUsc0VBQXNFO1FBQ3RFLGdFQUFnRTtRQUN4RCwrQkFBMEIsR0FBRyxLQUFLLENBQUM7UUFFbkMsOEJBQXlCLEdBQWUsRUFBRSxDQUFDO1FBQzNDLDZCQUF3QixHQUFlLEVBQUUsQ0FBQztRQW9JbEQsMENBQTBDO1FBQ2xDLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsVUFBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDekIsa0JBQWEsR0FBaUIsRUFBRSxDQUFDO0lBL0x6QyxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLGNBQWMsQ0FBQyxPQUFpQjtRQUM5QixPQUFPLENBQUMsR0FBRyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxZQUFZLENBQUMsQ0FBYztRQUN6QixPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx5REFBeUQ7SUFDekQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixJQUFJLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFVBQVU7YUFDakIsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBaUIsQ0FBQztJQUNqRCxDQUFDO0lBRUQsbURBQW1EO0lBQ25ELG1CQUFtQixDQUFDLEVBQUMsVUFBVSxFQUFjO1FBQzNDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRXpFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCwwREFBMEQ7SUFDMUQsV0FBVyxDQUFDLEtBQWtCO1FBQzVCLElBQUksRUFBRSxHQUF1QixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLGtFQUFrRTtZQUNsRSxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUM7U0FDekM7UUFDRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQWlCRCwrRUFBK0U7SUFDL0UscUVBQXFFO0lBQ3JFLDhFQUE4RTtJQUM5RSxrQ0FBa0M7SUFDMUIsNkJBQTZCLENBQUMsTUFBa0I7UUFDdEQsK0VBQStFO1FBQy9FLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsK0JBQStCLEVBQUU7WUFDdkUsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLCtCQUErQixHQUFHLElBQUksQ0FBQztRQUU1QyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtZQUMvQix5RUFBeUU7WUFDekUsK0RBQStEO1lBQy9ELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO2dCQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkYsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7WUFDOUIseUVBQXlFO1lBQ3pFLCtEQUErRDtZQUMvRCxJQUFJLENBQUMsMEJBQTBCLEdBQUcsS0FBSyxDQUFDO1lBQ3hDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYscUZBQXFGO1FBQ3JGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRTlFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxNQUFrQjtRQUNoQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0MsT0FBTyxDQUFDLEtBQWtCLEVBQUUsRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVCLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7aUJBQ3ZCO3FCQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7b0JBQ2hGLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztpQkFDdkI7YUFDRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsMERBQTBEO0lBQzFELGdCQUFnQjtRQUNkLE9BQU8sQ0FBQyxLQUFrQixFQUFXLEVBQUU7WUFDckMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNPLGFBQWEsQ0FBQyxNQUFrQixFQUFFLE1BQTRCO1FBQ3RFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxpRUFBaUU7SUFDdkQsWUFBWSxDQUFDLE1BQWtCO1FBQ3ZDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ2pELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNILGtCQUFrQixDQUFDLEtBQWtCO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQywwQkFBMEIsRUFBRTtZQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtnQkFDbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMxRCw0QkFBNEI7Z0JBQzVCLElBQUksRUFBRSxFQUFFO29CQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2lCQUNqRDthQUNGO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7Z0JBQzNDLDZFQUE2RTtnQkFDN0UsMEVBQTBFO2dCQUMxRSw2QkFBNkI7Z0JBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2FBQ3pCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQzlCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0c7SUFDSCxDQUFDOztzR0EvTFUsU0FBUyxvREFHUixhQUFhLGFBQ2IsUUFBUTswR0FKVCxTQUFTLGNBREcsTUFBTTsyRkFDbEIsU0FBUztrQkFEckIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OzBCQUl6QixNQUFNOzJCQUFDLGFBQWE7OzBCQUNwQixNQUFNOzJCQUFDLFFBQVE7O0FBbU10QiwyRUFBMkU7QUFDM0Usc0NBQXNDO0FBQ3RDLDJFQUEyRTtBQUUzRTs7O0dBR0c7QUFDSCxNQUFNLFVBQVU7SUFBaEI7UUFDRSxzREFBc0Q7UUFDdEQscUJBQWdCLEdBQWlCLEVBQUUsQ0FBQztJQTRCdEMsQ0FBQztJQTFCQyxtQkFBbUIsQ0FBQyxNQUE0QjtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFN0MsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxhQUFhLENBQUMsRUFBc0I7UUFDbEMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ1IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRW5GLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsbUZBQW1GO2dCQUNuRiw0Q0FBNEM7Z0JBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7b0JBQzFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3RDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLEtBQUs7UUFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQUVELDJFQUEyRTtBQUMzRSwyQkFBMkI7QUFDM0IsMkVBQTJFO0FBRTNFLGdGQUFnRjtBQUNoRixTQUFTLGlCQUFpQixDQUFDLEVBQXNCO0lBQy9DLE9BQU8sRUFBRSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDO0FBQ25ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge21lcmdlQWxpYXN9IGZyb20gJy4uL2FkZC1hbGlhcyc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuaW1wb3J0IHtCcmVha1BvaW50fSBmcm9tICcuLi9icmVha3BvaW50cy9icmVhay1wb2ludCc7XG5pbXBvcnQge0xBWU9VVF9DT05GSUcsIExheW91dENvbmZpZ09wdGlvbnN9IGZyb20gJy4uL3Rva2Vucy9saWJyYXJ5LWNvbmZpZyc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeSwgT3B0aW9uYWxCcmVha1BvaW50fSBmcm9tICcuLi9icmVha3BvaW50cy9icmVhay1wb2ludC1yZWdpc3RyeSc7XG5pbXBvcnQge3NvcnREZXNjZW5kaW5nUHJpb3JpdHl9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgdG8gYXBwbHkgUHJpbnRIb29rIHRvIGNhbGwgYW5vbnltb3VzIGB0YXJnZXQudXBkYXRlU3R5bGVzKClgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9va1RhcmdldCB7XG4gIGFjdGl2YXRlZEJyZWFrcG9pbnRzOiBCcmVha1BvaW50W107XG4gIHVwZGF0ZVN0eWxlcygpOiB2b2lkO1xufVxuXG5jb25zdCBQUklOVCA9ICdwcmludCc7XG5leHBvcnQgY29uc3QgQlJFQUtQT0lOVF9QUklOVCA9IHtcbiAgYWxpYXM6IFBSSU5ULFxuICBtZWRpYVF1ZXJ5OiBQUklOVCxcbiAgcHJpb3JpdHk6IDEwMDBcbn07XG5cbi8qKlxuICogUHJpbnRIb29rIC0gVXNlIHRvIGludGVyY2VwdCBwcmludCBNZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIGFuZCBmb3JjZVxuICogICAgICAgICAgICAgbGF5b3V0cyB0byByZW5kZXIgd2l0aCB0aGUgc3BlY2lmaWVkIHByaW50IGFsaWFzL2JyZWFrcG9pbnRcbiAqXG4gKiBVc2VkIGluIE1lZGlhTWFyc2hhbGxlciBhbmQgTWVkaWFPYnNlcnZlclxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBQcmludEhvb2sgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFJlZ2lzdHJ5LFxuICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcm90ZWN0ZWQgbGF5b3V0Q29uZmlnOiBMYXlvdXRDb25maWdPcHRpb25zLFxuICAgICAgQEluamVjdChET0NVTUVOVCkgcHJvdGVjdGVkIF9kb2N1bWVudDogYW55KSB7XG4gIH1cblxuICAvKiogQWRkICdwcmludCcgbWVkaWFRdWVyeTogdG8gbGlzdGVuIGZvciBtYXRjaE1lZGlhIGFjdGl2YXRpb25zICovXG4gIHdpdGhQcmludFF1ZXJ5KHF1ZXJpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbLi4ucXVlcmllcywgUFJJTlRdO1xuICB9XG5cbiAgLyoqIElzIHRoZSBNZWRpYUNoYW5nZSBldmVudCBmb3IgYW55ICdwcmludCcgQG1lZGlhICovXG4gIGlzUHJpbnRFdmVudChlOiBNZWRpYUNoYW5nZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlLm1lZGlhUXVlcnkuc3RhcnRzV2l0aChQUklOVCk7XG4gIH1cblxuICAvKiogV2hhdCBpcyB0aGUgZGVzaXJlZCBtcUFsaWFzIHRvIHVzZSB3aGlsZSBwcmludGluZz8gKi9cbiAgZ2V0IHByaW50QWxpYXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmxheW91dENvbmZpZy5wcmludFdpdGhCcmVha3BvaW50cyA/PyBbXTtcbiAgfVxuXG4gIC8qKiBMb29rdXAgYnJlYWtwb2ludHMgYXNzb2NpYXRlZCB3aXRoIHByaW50IGFsaWFzZXMuICovXG4gIGdldCBwcmludEJyZWFrUG9pbnRzKCk6IEJyZWFrUG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucHJpbnRBbGlhc1xuICAgICAgICAubWFwKGFsaWFzID0+IHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5QWxpYXMoYWxpYXMpKVxuICAgICAgICAuZmlsdGVyKGJwID0+IGJwICE9PSBudWxsKSBhcyBCcmVha1BvaW50W107XG4gIH1cblxuICAvKiogTG9va3VwIGJyZWFrcG9pbnQgYXNzb2NpYXRlZCB3aXRoIG1lZGlhUXVlcnkgKi9cbiAgZ2V0RXZlbnRCcmVha3BvaW50cyh7bWVkaWFRdWVyeX06IE1lZGlhQ2hhbmdlKTogQnJlYWtQb2ludFtdIHtcbiAgICBjb25zdCBicCA9IHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5UXVlcnkobWVkaWFRdWVyeSk7XG4gICAgY29uc3QgbGlzdCA9IGJwID8gWy4uLnRoaXMucHJpbnRCcmVha1BvaW50cywgYnBdIDogdGhpcy5wcmludEJyZWFrUG9pbnRzO1xuXG4gICAgcmV0dXJuIGxpc3Quc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgZXZlbnQgd2l0aCBwcmludEFsaWFzIG1lZGlhUXVlcnkgaW5mb3JtYXRpb24gKi9cbiAgdXBkYXRlRXZlbnQoZXZlbnQ6IE1lZGlhQ2hhbmdlKTogTWVkaWFDaGFuZ2Uge1xuICAgIGxldCBicDogT3B0aW9uYWxCcmVha1BvaW50ID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShldmVudC5tZWRpYVF1ZXJ5KTtcbiAgICBpZiAodGhpcy5pc1ByaW50RXZlbnQoZXZlbnQpKSB7XG4gICAgICAvLyBSZXNldCBmcm9tICdwcmludCcgdG8gZmlyc3QgKGhpZ2hlc3QgcHJpb3JpdHkpIHByaW50IGJyZWFrcG9pbnRcbiAgICAgIGJwID0gdGhpcy5nZXRFdmVudEJyZWFrcG9pbnRzKGV2ZW50KVswXTtcbiAgICAgIGV2ZW50Lm1lZGlhUXVlcnkgPSBicD8ubWVkaWFRdWVyeSA/PyAnJztcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlQWxpYXMoZXZlbnQsIGJwKTtcbiAgfVxuXG5cbiAgLy8gcmVnaXN0ZXJlZEJlZm9yZUFmdGVyUHJpbnRIb29rcyB0cmFja3MgaWYgd2UgcmVnaXN0ZXJlZCB0aGUgYGJlZm9yZXByaW50YFxuICAvLyAgYW5kIGBhZnRlcnByaW50YCBldmVudCBsaXN0ZW5lcnMuXG4gIHByaXZhdGUgcmVnaXN0ZXJlZEJlZm9yZUFmdGVyUHJpbnRIb29rcyA9IGZhbHNlO1xuXG4gIC8vIGlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50IGlzIHVzZWQgdG8gdHJhY2sgaWYgd2UgYXJlIHByaW50aW5nIGZyb20gd2l0aGluXG4gIC8vIGEgYGJlZm9yZXByaW50YCBldmVudCBoYW5kbGVyLiBUaGlzIHByZXZlbnRzIHRoZSB0eXBpY2FsIGBzdG9wUHJpbnRpbmdgXG4gIC8vIGZvcm0gYGludGVyY2VwdEV2ZW50c2Agc28gdGhhdCBwcmludGluZyBpcyBub3Qgc3RvcHBlZCB3aGlsZSB0aGUgZGlhbG9nXG4gIC8vIGlzIHN0aWxsIG9wZW4uIFRoaXMgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSBgaXNQcmludGluZ2AgcHJvcGVydHkgb25cbiAgLy8gYnJvd3NlcnMgd2hpY2ggc3VwcG9ydCBgYmVmb3JlcHJpbnRgIGFuZCBgYWZ0ZXJwcmludGAgZXZlbnRzLlxuICBwcml2YXRlIGlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBiZWZvcmVQcmludEV2ZW50TGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgYWZ0ZXJQcmludEV2ZW50TGlzdGVuZXJzOiBGdW5jdGlvbltdID0gW107XG5cbiAgLy8gcmVnaXN0ZXJCZWZvcmVBZnRlclByaW50SG9va3MgcmVnaXN0ZXJzIGEgYGJlZm9yZXByaW50YCBldmVudCBob29rIHNvIHdlIGNhblxuICAvLyB0cmlnZ2VyIHByaW50IHN0eWxlcyBzeW5jaHJvbm91c2x5IGFuZCBhcHBseSBwcm9wZXIgbGF5b3V0IHN0eWxlcy5cbiAgLy8gSXQgaXMgYSBub29wIGlmIHRoZSBob29rcyBoYXZlIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIG9yIGlmIHRoZSBkb2N1bWVudCdzXG4gIC8vIGBkZWZhdWx0Vmlld2AgaXMgbm90IGF2YWlsYWJsZS5cbiAgcHJpdmF0ZSByZWdpc3RlckJlZm9yZUFmdGVyUHJpbnRIb29rcyh0YXJnZXQ6IEhvb2tUYXJnZXQpIHtcbiAgICAvLyBgZGVmYXVsdFZpZXdgIG1heSBiZSBudWxsIHdoZW4gcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIgb3IgaW4gb3RoZXIgY29udGV4dHMuXG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudC5kZWZhdWx0VmlldyB8fCB0aGlzLnJlZ2lzdGVyZWRCZWZvcmVBZnRlclByaW50SG9va3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdGVyZWRCZWZvcmVBZnRlclByaW50SG9va3MgPSB0cnVlO1xuXG4gICAgY29uc3QgYmVmb3JlUHJpbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgIC8vIElmIHdlIGFyZW4ndCBhbHJlYWR5IHByaW50aW5nLCBzdGFydCBwcmludGluZyBhbmQgdXBkYXRlIHRoZSBzdHlsZXMgYXNcbiAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHJlZ3VsYXIgcHJpbnQgYE1lZGlhQ2hhbmdlYChmcm9tIG1hdGNoTWVkaWEpLlxuICAgICAgaWYgKCF0aGlzLmlzUHJpbnRpbmcpIHtcbiAgICAgICAgdGhpcy5pc1ByaW50aW5nQmVmb3JlQWZ0ZXJFdmVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuc3RhcnRQcmludGluZyh0YXJnZXQsIHRoaXMuZ2V0RXZlbnRCcmVha3BvaW50cyhuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgUFJJTlQpKSk7XG4gICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYWZ0ZXJQcmludExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgLy8gSWYgd2UgYXJlbid0IGFscmVhZHkgcHJpbnRpbmcsIHN0YXJ0IHByaW50aW5nIGFuZCB1cGRhdGUgdGhlIHN0eWxlcyBhc1xuICAgICAgLy8gaWYgdGhlcmUgd2FzIGEgcmVndWxhciBwcmludCBgTWVkaWFDaGFuZ2VgKGZyb20gbWF0Y2hNZWRpYSkuXG4gICAgICB0aGlzLmlzUHJpbnRpbmdCZWZvcmVBZnRlckV2ZW50ID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5pc1ByaW50aW5nKSB7XG4gICAgICAgIHRoaXMuc3RvcFByaW50aW5nKHRhcmdldCk7XG4gICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ291bGQgd2UgaGF2ZSB0ZWFyZG93biBsb2dpYyB0byByZW1vdmUgaWYgdGhlcmUgYXJlIG5vIHByaW50IGxpc3RlbmVycyBiZWluZyB1c2VkP1xuICAgIHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50JywgYmVmb3JlUHJpbnRMaXN0ZW5lcik7XG4gICAgdGhpcy5fZG9jdW1lbnQuZGVmYXVsdFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignYWZ0ZXJwcmludCcsIGFmdGVyUHJpbnRMaXN0ZW5lcik7XG5cbiAgICB0aGlzLmJlZm9yZVByaW50RXZlbnRMaXN0ZW5lcnMucHVzaChiZWZvcmVQcmludExpc3RlbmVyKTtcbiAgICB0aGlzLmFmdGVyUHJpbnRFdmVudExpc3RlbmVycy5wdXNoKGFmdGVyUHJpbnRMaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZSBSeEpTIHRhcCBvcGVyYXRvciB3aXRoIHBhcnRpYWwgYXBwbGljYXRpb25cbiAgICogQHJldHVybiBwaXBlYWJsZSB0YXAgcHJlZGljYXRlXG4gICAqL1xuICBpbnRlcmNlcHRFdmVudHModGFyZ2V0OiBIb29rVGFyZ2V0KSB7XG4gICAgdGhpcy5yZWdpc3RlckJlZm9yZUFmdGVyUHJpbnRIb29rcyh0YXJnZXQpO1xuXG4gICAgcmV0dXJuIChldmVudDogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzUHJpbnRFdmVudChldmVudCkpIHtcbiAgICAgICAgaWYgKGV2ZW50Lm1hdGNoZXMgJiYgIXRoaXMuaXNQcmludGluZykge1xuICAgICAgICAgIHRoaXMuc3RhcnRQcmludGluZyh0YXJnZXQsIHRoaXMuZ2V0RXZlbnRCcmVha3BvaW50cyhldmVudCkpO1xuICAgICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgICAgfSBlbHNlIGlmICghZXZlbnQubWF0Y2hlcyAmJiB0aGlzLmlzUHJpbnRpbmcgJiYgIXRoaXMuaXNQcmludGluZ0JlZm9yZUFmdGVyRXZlbnQpIHtcbiAgICAgICAgICB0aGlzLnN0b3BQcmludGluZyh0YXJnZXQpO1xuICAgICAgICAgIHRhcmdldC51cGRhdGVTdHlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0QWN0aXZhdGlvbnMoZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKiogU3RvcCBtZWRpYUNoYW5nZSBldmVudCBwcm9wYWdhdGlvbiBpbiBldmVudCBzdHJlYW1zICovXG4gIGJsb2NrUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIChldmVudDogTWVkaWFDaGFuZ2UpOiBib29sZWFuID0+IHtcbiAgICAgIHJldHVybiAhKHRoaXMuaXNQcmludGluZyB8fCB0aGlzLmlzUHJpbnRFdmVudChldmVudCkpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjdXJyZW50IGFjdGl2YXRlQnJlYWtwb2ludHMgKGZvciBsYXRlciByZXN0b3JlKVxuICAgKiBhbmQgc3Vic3RpdHV0ZSBvbmx5IHRoZSBwcmludEFsaWFzIGJyZWFrcG9pbnRcbiAgICovXG4gIHByb3RlY3RlZCBzdGFydFByaW50aW5nKHRhcmdldDogSG9va1RhcmdldCwgYnBMaXN0OiBPcHRpb25hbEJyZWFrUG9pbnRbXSkge1xuICAgIHRoaXMuaXNQcmludGluZyA9IHRydWU7XG4gICAgdGFyZ2V0LmFjdGl2YXRlZEJyZWFrcG9pbnRzID0gdGhpcy5xdWV1ZS5hZGRQcmludEJyZWFrcG9pbnRzKGJwTGlzdCk7XG4gIH1cblxuICAvKiogRm9yIGFueSBwcmludCBkZS1hY3RpdmF0aW9ucywgcmVzZXQgdGhlIGVudGlyZSBwcmludCBxdWV1ZSAqL1xuICBwcm90ZWN0ZWQgc3RvcFByaW50aW5nKHRhcmdldDogSG9va1RhcmdldCkge1xuICAgIHRhcmdldC5hY3RpdmF0ZWRCcmVha3BvaW50cyA9IHRoaXMuZGVhY3RpdmF0aW9ucztcbiAgICB0aGlzLmRlYWN0aXZhdGlvbnMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlLmNsZWFyKCk7XG4gICAgdGhpcy5pc1ByaW50aW5nID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVG8gcmVzdG9yZSBwcmUtUHJpbnQgQWN0aXZhdGlvbnMsIHdlIG11c3QgY2FwdHVyZSB0aGUgcHJvcGVyXG4gICAqIGxpc3Qgb2YgYnJlYWtwb2ludCBhY3RpdmF0aW9ucyBCRUZPUkUgcHJpbnQgc3RhcnRzLiBPbkJlZm9yZVByaW50KClcbiAgICogaXMgc3VwcG9ydGVkOyBzbyAncHJpbnQnIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgYXJlIHVzZWQgYXMgYSBmYWxsYmFja1xuICAgKiBpbiBicm93c2VycyB3aXRob3V0IGBiZWZvcmVwcmludGAgc3VwcG9ydC5cbiAgICpcbiAgICogPiAgQnV0IGFjdGl2YXRlZCBicmVha3BvaW50cyBhcmUgZGVhY3RpdmF0ZWQgQkVGT1JFICdwcmludCcgYWN0aXZhdGlvbi5cbiAgICpcbiAgICogTGV0J3MgY2FwdHVyZSBhbGwgZGUtYWN0aXZhdGlvbnMgdXNpbmcgdGhlIGZvbGxvd2luZyBsb2dpYzpcbiAgICpcbiAgICogIFdoZW4gbm90IHByaW50aW5nOlxuICAgKiAgICAtIGNsZWFyIGNhY2hlIHdoZW4gYWN0aXZhdGluZyBub24tcHJpbnQgYnJlYWtwb2ludFxuICAgKiAgICAtIHVwZGF0ZSBjYWNoZSAoYW5kIHNvcnQpIHdoZW4gZGVhY3RpdmF0aW5nXG4gICAqXG4gICAqICBXaGVuIHByaW50aW5nOlxuICAgKiAgICAtIHNvcnQgYW5kIHNhdmUgd2hlbiBzdGFydGluZyBwcmludFxuICAgKiAgICAtIHJlc3RvcmUgYXMgYWN0aXZhdGVkVGFyZ2V0cyBhbmQgY2xlYXIgd2hlbiBzdG9wIHByaW50aW5nXG4gICAqL1xuICBjb2xsZWN0QWN0aXZhdGlvbnMoZXZlbnQ6IE1lZGlhQ2hhbmdlKSB7XG4gICAgaWYgKCF0aGlzLmlzUHJpbnRpbmcgfHwgdGhpcy5pc1ByaW50aW5nQmVmb3JlQWZ0ZXJFdmVudCkge1xuICAgICAgaWYgKCFldmVudC5tYXRjaGVzKSB7XG4gICAgICAgIGNvbnN0IGJwID0gdGhpcy5icmVha3BvaW50cy5maW5kQnlRdWVyeShldmVudC5tZWRpYVF1ZXJ5KTtcbiAgICAgICAgLy8gRGVhY3RpdmF0aW5nIGEgYnJlYWtwb2ludFxuICAgICAgICBpZiAoYnApIHtcbiAgICAgICAgICB0aGlzLmRlYWN0aXZhdGlvbnMucHVzaChicCk7XG4gICAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zLnNvcnQoc29ydERlc2NlbmRpbmdQcmlvcml0eSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNQcmludGluZ0JlZm9yZUFmdGVyRXZlbnQpIHtcbiAgICAgICAgLy8gT25seSBjbGVhciBkZWFjdGl2YXRpb25zIGlmIHdlIGFyZW4ndCBwcmludGluZyBmcm9tIGEgYGJlZm9yZXByaW50YCBldmVudC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB0aGlzIHdpbGwgY2xlYXIgYmVmb3JlIGBzdG9wUHJpbnRpbmcoKWAgaXMgY2FsbGVkIHRvIHJlc3RvcmVcbiAgICAgICAgLy8gdGhlIHByZS1QcmludCBBY3RpdmF0aW9ucy5cbiAgICAgICAgdGhpcy5kZWFjdGl2YXRpb25zID0gW107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRlYXJkb3duIGxvZ2ljIGZvciB0aGUgc2VydmljZS4gKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3KSB7XG4gICAgICB0aGlzLmJlZm9yZVByaW50RXZlbnRMaXN0ZW5lcnMuZm9yRWFjaChsID0+IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXByaW50JywgbCkpO1xuICAgICAgdGhpcy5hZnRlclByaW50RXZlbnRMaXN0ZW5lcnMuZm9yRWFjaChsID0+IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FmdGVycHJpbnQnLCBsKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gSXMgdGhpcyBzZXJ2aWNlIGN1cnJlbnRseSBpbiBwcmludCBtb2RlXG4gIHByaXZhdGUgaXNQcmludGluZyA9IGZhbHNlO1xuICBwcml2YXRlIHF1ZXVlID0gbmV3IFByaW50UXVldWUoKTtcbiAgcHJpdmF0ZSBkZWFjdGl2YXRpb25zOiBCcmVha1BvaW50W10gPSBbXTtcbn1cblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBJbnRlcm5hbCBVdGlsaXR5IGNsYXNzICdQcmludFF1ZXVlJ1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8qKlxuICogVXRpbGl0eSBjbGFzcyB0byBtYW5hZ2UgcHJpbnQgYnJlYWtwb2ludHMgKyBhY3RpdmF0ZWRCcmVha3BvaW50c1xuICogd2l0aCBjb3JyZWN0IHNvcnRpbmcgV0hJTEUgcHJpbnRpbmdcbiAqL1xuY2xhc3MgUHJpbnRRdWV1ZSB7XG4gIC8qKiBTb3J0ZWQgcXVldWUgd2l0aCBwcmlvcml0aXplZCBwcmludCBicmVha3BvaW50cyAqL1xuICBwcmludEJyZWFrcG9pbnRzOiBCcmVha1BvaW50W10gPSBbXTtcblxuICBhZGRQcmludEJyZWFrcG9pbnRzKGJwTGlzdDogT3B0aW9uYWxCcmVha1BvaW50W10pOiBCcmVha1BvaW50W10ge1xuICAgIGJwTGlzdC5wdXNoKEJSRUFLUE9JTlRfUFJJTlQpO1xuICAgIGJwTGlzdC5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICAgIGJwTGlzdC5mb3JFYWNoKGJwID0+IHRoaXMuYWRkQnJlYWtwb2ludChicCkpO1xuXG4gICAgcmV0dXJuIHRoaXMucHJpbnRCcmVha3BvaW50cztcbiAgfVxuXG4gIC8qKiBBZGQgUHJpbnQgYnJlYWtwb2ludCB0byBxdWV1ZSAqL1xuICBhZGRCcmVha3BvaW50KGJwOiBPcHRpb25hbEJyZWFrUG9pbnQpIHtcbiAgICBpZiAoISFicCkge1xuICAgICAgY29uc3QgYnBJbkxpc3QgPSB0aGlzLnByaW50QnJlYWtwb2ludHMuZmluZChpdCA9PiBpdC5tZWRpYVF1ZXJ5ID09PSBicC5tZWRpYVF1ZXJ5KTtcblxuICAgICAgaWYgKGJwSW5MaXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGBwcmludEFsaWFzYCBicmVha3BvaW50LCB0aGVuIGFwcGVuZC4gSWYgYSB0cnVlICdwcmludCcgYnJlYWtwb2ludCxcbiAgICAgICAgLy8gcmVnaXN0ZXIgYXMgaGlnaGVzdCBwcmlvcml0eSBpbiB0aGUgcXVldWVcbiAgICAgICAgdGhpcy5wcmludEJyZWFrcG9pbnRzID0gaXNQcmludEJyZWFrUG9pbnQoYnApID8gW2JwLCAuLi50aGlzLnByaW50QnJlYWtwb2ludHNdXG4gICAgICAgICAgICA6IFsuLi50aGlzLnByaW50QnJlYWtwb2ludHMsIGJwXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZSBvcmlnaW5hbCBhY3RpdmF0ZWQgYnJlYWtwb2ludHMgYW5kIGNsZWFyIGludGVybmFsIGNhY2hlcyAqL1xuICBjbGVhcigpIHtcbiAgICB0aGlzLnByaW50QnJlYWtwb2ludHMgPSBbXTtcbiAgfVxufVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEludGVybmFsIFV0aWxpdHkgbWV0aG9kc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8qKiBPbmx5IHN1cHBvcnQgaW50ZXJjZXB0IHF1ZXVlaW5nIGlmIHRoZSBCcmVha3BvaW50IGlzIGEgcHJpbnQgQG1lZGlhIHF1ZXJ5ICovXG5mdW5jdGlvbiBpc1ByaW50QnJlYWtQb2ludChicDogT3B0aW9uYWxCcmVha1BvaW50KTogYm9vbGVhbiB7XG4gIHJldHVybiBicD8ubWVkaWFRdWVyeS5zdGFydHNXaXRoKFBSSU5UKSA/PyBmYWxzZTtcbn1cbiJdfQ==