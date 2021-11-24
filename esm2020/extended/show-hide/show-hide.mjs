/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, PLATFORM_ID, Injectable, } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BaseDirective2, LAYOUT_CONFIG, SERVER_TOKEN, StyleBuilder, } from '@angular/flex-layout/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class ShowHideStyleBuilder extends StyleBuilder {
    buildStyles(show, parent) {
        const shouldShow = show === 'true';
        return { 'display': shouldShow ? parent.display || (parent.isServer ? 'initial' : '') : 'none' };
    }
}
ShowHideStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ShowHideStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ShowHideStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ShowHideStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ShowHideStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ShowHideDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal, layoutConfig, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.layoutConfig = layoutConfig;
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'show-hide';
        /** Original DOM Element CSS display style */
        this.display = '';
        this.hasLayout = false;
        this.hasFlexChild = false;
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    ngAfterViewInit() {
        this.trackExtraTriggers();
        const children = Array.from(this.nativeElement.children);
        for (let i = 0; i < children.length; i++) {
            if (this.marshal.hasValue(children[i], 'flex')) {
                this.hasFlexChild = true;
                break;
            }
        }
        if (DISPLAY_MAP.has(this.nativeElement)) {
            this.display = DISPLAY_MAP.get(this.nativeElement);
        }
        else {
            this.display = this.getDisplayStyle();
            DISPLAY_MAP.set(this.nativeElement, this.display);
        }
        this.init();
        // set the default to show unless explicitly overridden
        const defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
        if (defaultValue === undefined || defaultValue === '') {
            this.setValue(true, '');
        }
        else {
            this.triggerUpdate();
        }
    }
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes) {
        Object.keys(changes).forEach(key => {
            if (this.inputs.indexOf(key) !== -1) {
                const inputKey = key.split('.');
                const bp = inputKey.slice(1).join('.');
                const inputValue = changes[key].currentValue;
                let shouldShow = inputValue !== '' ?
                    inputValue !== 0 ? coerceBooleanProperty(inputValue) : false
                    : true;
                if (inputKey[0] === 'fxHide') {
                    shouldShow = !shouldShow;
                }
                this.setValue(shouldShow, bp);
            }
        });
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *  Watch for these extra triggers to update fxShow, fxHide stylings
     */
    trackExtraTriggers() {
        this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');
        ['layout', 'layout-align'].forEach(key => {
            this.marshal
                .trackValue(this.nativeElement, key)
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        });
    }
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     */
    getDisplayStyle() {
        return (this.hasLayout || (this.hasFlexChild && this.layoutConfig.addFlexToParent)) ?
            'flex' : this.styler.lookupStyle(this.nativeElement, 'display', true);
    }
    /** Validate the visibility value and then update the host's inline display style */
    updateWithValue(value = true) {
        if (value === '') {
            return;
        }
        const isServer = isPlatformServer(this.platformId);
        this.addStyles(value ? 'true' : 'false', { display: this.display, isServer });
        if (isServer && this.serverModuleLoaded) {
            this.nativeElement.style.setProperty('display', '');
        }
        this.marshal.triggerUpdate(this.parentElement, 'layout-gap');
    }
}
ShowHideDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ShowHideDirective, deps: [{ token: i0.ElementRef }, { token: ShowHideStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: LAYOUT_CONFIG }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive });
ShowHideDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: ShowHideDirective, usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: ShowHideDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: ShowHideStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }]; } });
const DISPLAY_MAP = new WeakMap();
const inputs = [
    'fxShow', 'fxShow.print',
    'fxShow.xs', 'fxShow.sm', 'fxShow.md', 'fxShow.lg', 'fxShow.xl',
    'fxShow.lt-sm', 'fxShow.lt-md', 'fxShow.lt-lg', 'fxShow.lt-xl',
    'fxShow.gt-xs', 'fxShow.gt-sm', 'fxShow.gt-md', 'fxShow.gt-lg',
    'fxHide', 'fxHide.print',
    'fxHide.xs', 'fxHide.sm', 'fxHide.md', 'fxHide.lg', 'fxHide.xl',
    'fxHide.lt-sm', 'fxHide.lt-md', 'fxHide.lt-lg', 'fxHide.lt-xl',
    'fxHide.gt-xs', 'fxHide.gt-sm', 'fxHide.gt-md', 'fxHide.gt-lg'
];
const selector = `
  [fxShow], [fxShow.print],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide], [fxHide.print],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`;
/**
 * 'show' Layout API directive
 */
export class DefaultShowHideDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultShowHideDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultShowHideDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultShowHideDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultShowHideDirective, selector: "\n  [fxShow], [fxShow.print],\n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],\n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide], [fxHide.print],\n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],\n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n", inputs: { fxShow: "fxShow", "fxShow.print": "fxShow.print", "fxShow.xs": "fxShow.xs", "fxShow.sm": "fxShow.sm", "fxShow.md": "fxShow.md", "fxShow.lg": "fxShow.lg", "fxShow.xl": "fxShow.xl", "fxShow.lt-sm": "fxShow.lt-sm", "fxShow.lt-md": "fxShow.lt-md", "fxShow.lt-lg": "fxShow.lt-lg", "fxShow.lt-xl": "fxShow.lt-xl", "fxShow.gt-xs": "fxShow.gt-xs", "fxShow.gt-sm": "fxShow.gt-sm", "fxShow.gt-md": "fxShow.gt-md", "fxShow.gt-lg": "fxShow.gt-lg", fxHide: "fxHide", "fxHide.print": "fxHide.print", "fxHide.xs": "fxHide.xs", "fxHide.sm": "fxHide.sm", "fxHide.md": "fxHide.md", "fxHide.lg": "fxHide.lg", "fxHide.xl": "fxHide.xl", "fxHide.lt-sm": "fxHide.lt-sm", "fxHide.lt-md": "fxHide.lt-md", "fxHide.lt-lg": "fxHide.lt-lg", "fxHide.lt-xl": "fxHide.lt-xl", "fxHide.gt-xs": "fxHide.gt-xs", "fxHide.gt-sm": "fxHide.gt-sm", "fxHide.gt-md": "fxHide.gt-md", "fxHide.gt-lg": "fxHide.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultShowHideDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1oaWRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9leHRlbmRlZC9zaG93LWhpZGUvc2hvdy1oaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxTQUFTLEVBSVQsTUFBTSxFQUNOLFdBQVcsRUFDWCxVQUFVLEdBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUNMLGNBQWMsRUFDZCxhQUFhLEVBR2IsWUFBWSxFQUVaLFlBQVksR0FDYixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBUXpDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxZQUFZO0lBQ3BELFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBc0I7UUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLE1BQU0sQ0FBQztRQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ2pHLENBQUM7O2lIQUpVLG9CQUFvQjtxSEFBcEIsb0JBQW9CLGNBRFIsTUFBTTsyRkFDbEIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUFTaEMsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGNBQWM7SUFRbkQsWUFBWSxVQUFzQixFQUN0QixZQUFrQyxFQUNsQyxN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QVc7SUFDL0QsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYztJQUM5RCxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0NBQy9ELENBQUM7QUFFRixNQUFNLFFBQVEsR0FBRzs7Ozs7Ozs7O0NBU2hCLENBQUM7QUFFRjs7R0FFRztBQUVILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxpQkFBaUI7SUFEL0Q7O1FBRVksV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUMzQjs7cUhBRlksd0JBQXdCO3lHQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFEcEMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lELFxuICBJbmplY3RhYmxlLFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybVNlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBMQVlPVVRfQ09ORklHLFxuICBMYXlvdXRDb25maWdPcHRpb25zLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFNFUlZFUl9UT0tFTixcbiAgU3R5bGVVdGlscyxcbiAgU3R5bGVCdWlsZGVyLFxufSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9jb3JlJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGludGVyZmFjZSBTaG93SGlkZVBhcmVudCB7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgaXNTZXJ2ZXI6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFNob3dIaWRlU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoc2hvdzogc3RyaW5nLCBwYXJlbnQ6IFNob3dIaWRlUGFyZW50KSB7XG4gICAgY29uc3Qgc2hvdWxkU2hvdyA9IHNob3cgPT09ICd0cnVlJztcbiAgICByZXR1cm4geydkaXNwbGF5Jzogc2hvdWxkU2hvdyA/IHBhcmVudC5kaXNwbGF5IHx8IChwYXJlbnQuaXNTZXJ2ZXIgPyAnaW5pdGlhbCcgOiAnJykgOiAnbm9uZSd9O1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIFNob3dIaWRlRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdzaG93LWhpZGUnO1xuXG4gIC8qKiBPcmlnaW5hbCBET00gRWxlbWVudCBDU1MgZGlzcGxheSBzdHlsZSAqL1xuICBwcm90ZWN0ZWQgZGlzcGxheTogc3RyaW5nID0gJyc7XG4gIHByb3RlY3RlZCBoYXNMYXlvdXQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGhhc0ZsZXhDaGlsZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogU2hvd0hpZGVTdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgbWFyc2hhbDogTWVkaWFNYXJzaGFsbGVyLFxuICAgICAgICAgICAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgICAgICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByb3RlY3RlZCBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgICAgICAgICAgIEBJbmplY3QoU0VSVkVSX1RPS0VOKSBwcm90ZWN0ZWQgc2VydmVyTW9kdWxlTG9hZGVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZXIsIG1hcnNoYWwpO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIExpZmVjeWNsZSBNZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnRyYWNrRXh0cmFUcmlnZ2VycygpO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKHRoaXMubmF0aXZlRWxlbWVudC5jaGlsZHJlbik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMubWFyc2hhbC5oYXNWYWx1ZShjaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCwgJ2ZsZXgnKSkge1xuICAgICAgICB0aGlzLmhhc0ZsZXhDaGlsZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChESVNQTEFZX01BUC5oYXModGhpcy5uYXRpdmVFbGVtZW50KSkge1xuICAgICAgdGhpcy5kaXNwbGF5ID0gRElTUExBWV9NQVAuZ2V0KHRoaXMubmF0aXZlRWxlbWVudCkhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXkgPSB0aGlzLmdldERpc3BsYXlTdHlsZSgpO1xuICAgICAgRElTUExBWV9NQVAuc2V0KHRoaXMubmF0aXZlRWxlbWVudCwgdGhpcy5kaXNwbGF5KTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgICAvLyBzZXQgdGhlIGRlZmF1bHQgdG8gc2hvdyB1bmxlc3MgZXhwbGljaXRseSBvdmVycmlkZGVuXG4gICAgY29uc3QgZGVmYXVsdFZhbHVlID0gdGhpcy5tYXJzaGFsLmdldFZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgdGhpcy5ESVJFQ1RJVkVfS0VZLCAnJyk7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGRlZmF1bHRWYWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuc2V0VmFsdWUodHJ1ZSwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXJVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gY2hhbmdlcyB0byBhbnkgQElucHV0IHByb3BlcnRpZXMuLi5cbiAgICogRGVmYXVsdCB0byB1c2UgdGhlIG5vbi1yZXNwb25zaXZlIElucHV0IHZhbHVlICgnZnhTaG93JylcbiAgICogVGhlbiBjb25kaXRpb25hbGx5IG92ZXJyaWRlIHdpdGggdGhlIG1xLWFjdGl2YXRlZCBJbnB1dCdzIGN1cnJlbnQgdmFsdWVcbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAodGhpcy5pbnB1dHMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICBjb25zdCBpbnB1dEtleSA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICBjb25zdCBicCA9IGlucHV0S2V5LnNsaWNlKDEpLmpvaW4oJy4nKTtcbiAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IGNoYW5nZXNba2V5XS5jdXJyZW50VmFsdWU7XG4gICAgICAgIGxldCBzaG91bGRTaG93ID0gaW5wdXRWYWx1ZSAhPT0gJycgP1xuICAgICAgICAgICAgaW5wdXRWYWx1ZSAhPT0gMCA/IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShpbnB1dFZhbHVlKSA6IGZhbHNlXG4gICAgICAgICAgICA6IHRydWU7XG4gICAgICAgIGlmIChpbnB1dEtleVswXSA9PT0gJ2Z4SGlkZScpIHtcbiAgICAgICAgICBzaG91bGRTaG93ID0gIXNob3VsZFNob3c7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRWYWx1ZShzaG91bGRTaG93LCBicCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqICBXYXRjaCBmb3IgdGhlc2UgZXh0cmEgdHJpZ2dlcnMgdG8gdXBkYXRlIGZ4U2hvdywgZnhIaWRlIHN0eWxpbmdzXG4gICAqL1xuICBwcm90ZWN0ZWQgdHJhY2tFeHRyYVRyaWdnZXJzKCkge1xuICAgIHRoaXMuaGFzTGF5b3V0ID0gdGhpcy5tYXJzaGFsLmhhc1ZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2xheW91dCcpO1xuXG4gICAgWydsYXlvdXQnLCAnbGF5b3V0LWFsaWduJ10uZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy5tYXJzaGFsXG4gICAgICAgICAgLnRyYWNrVmFsdWUodGhpcy5uYXRpdmVFbGVtZW50LCBrZXkpXG4gICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveVN1YmplY3QpKVxuICAgICAgICAgIC5zdWJzY3JpYmUodGhpcy50cmlnZ2VyVXBkYXRlLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGFjY2Vzc29yIHRvIHRoZSBjdXJyZW50IEhUTUxFbGVtZW50J3MgYGRpc3BsYXlgIHN0eWxlXG4gICAqIE5vdGU6IFNob3cvSGlkZSB3aWxsIG5vdCBjaGFuZ2UgdGhlIGRpc3BsYXkgdG8gJ2ZsZXgnIGJ1dCB3aWxsIHNldCBpdCB0byAnYmxvY2snXG4gICAqIHVubGVzcyBpdCB3YXMgYWxyZWFkeSBleHBsaWNpdGx5IHNwZWNpZmllZCBpbmxpbmUgb3IgaW4gYSBDU1Mgc3R5bGVzaGVldC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXREaXNwbGF5U3R5bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHRoaXMuaGFzTGF5b3V0IHx8ICh0aGlzLmhhc0ZsZXhDaGlsZCAmJiB0aGlzLmxheW91dENvbmZpZy5hZGRGbGV4VG9QYXJlbnQpKSA/XG4gICAgICAgICdmbGV4JyA6IHRoaXMuc3R5bGVyLmxvb2t1cFN0eWxlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgdmlzaWJpbGl0eSB2YWx1ZSBhbmQgdGhlbiB1cGRhdGUgdGhlIGhvc3QncyBpbmxpbmUgZGlzcGxheSBzdHlsZSAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNTZXJ2ZXIgPSBpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCk7XG4gICAgdGhpcy5hZGRTdHlsZXModmFsdWUgPyAndHJ1ZScgOiAnZmFsc2UnLCB7ZGlzcGxheTogdGhpcy5kaXNwbGF5LCBpc1NlcnZlcn0pO1xuICAgIGlmIChpc1NlcnZlciAmJiB0aGlzLnNlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJycpO1xuICAgIH1cbiAgICB0aGlzLm1hcnNoYWwudHJpZ2dlclVwZGF0ZSh0aGlzLnBhcmVudEVsZW1lbnQhLCAnbGF5b3V0LWdhcCcpO1xuICB9XG59XG5cbmNvbnN0IERJU1BMQVlfTUFQOiBXZWFrTWFwPEhUTUxFbGVtZW50LCBzdHJpbmc+ID0gbmV3IFdlYWtNYXAoKTtcblxuY29uc3QgaW5wdXRzID0gW1xuICAnZnhTaG93JywgJ2Z4U2hvdy5wcmludCcsXG4gICdmeFNob3cueHMnLCAnZnhTaG93LnNtJywgJ2Z4U2hvdy5tZCcsICdmeFNob3cubGcnLCAnZnhTaG93LnhsJyxcbiAgJ2Z4U2hvdy5sdC1zbScsICdmeFNob3cubHQtbWQnLCAnZnhTaG93Lmx0LWxnJywgJ2Z4U2hvdy5sdC14bCcsXG4gICdmeFNob3cuZ3QteHMnLCAnZnhTaG93Lmd0LXNtJywgJ2Z4U2hvdy5ndC1tZCcsICdmeFNob3cuZ3QtbGcnLFxuICAnZnhIaWRlJywgJ2Z4SGlkZS5wcmludCcsXG4gICdmeEhpZGUueHMnLCAnZnhIaWRlLnNtJywgJ2Z4SGlkZS5tZCcsICdmeEhpZGUubGcnLCAnZnhIaWRlLnhsJyxcbiAgJ2Z4SGlkZS5sdC1zbScsICdmeEhpZGUubHQtbWQnLCAnZnhIaWRlLmx0LWxnJywgJ2Z4SGlkZS5sdC14bCcsXG4gICdmeEhpZGUuZ3QteHMnLCAnZnhIaWRlLmd0LXNtJywgJ2Z4SGlkZS5ndC1tZCcsICdmeEhpZGUuZ3QtbGcnXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4U2hvd10sIFtmeFNob3cucHJpbnRdLFxuICBbZnhTaG93LnhzXSwgW2Z4U2hvdy5zbV0sIFtmeFNob3cubWRdLCBbZnhTaG93LmxnXSwgW2Z4U2hvdy54bF0sXG4gIFtmeFNob3cubHQtc21dLCBbZnhTaG93Lmx0LW1kXSwgW2Z4U2hvdy5sdC1sZ10sIFtmeFNob3cubHQteGxdLFxuICBbZnhTaG93Lmd0LXhzXSwgW2Z4U2hvdy5ndC1zbV0sIFtmeFNob3cuZ3QtbWRdLCBbZnhTaG93Lmd0LWxnXSxcbiAgW2Z4SGlkZV0sIFtmeEhpZGUucHJpbnRdLFxuICBbZnhIaWRlLnhzXSwgW2Z4SGlkZS5zbV0sIFtmeEhpZGUubWRdLCBbZnhIaWRlLmxnXSwgW2Z4SGlkZS54bF0sXG4gIFtmeEhpZGUubHQtc21dLCBbZnhIaWRlLmx0LW1kXSwgW2Z4SGlkZS5sdC1sZ10sIFtmeEhpZGUubHQteGxdLFxuICBbZnhIaWRlLmd0LXhzXSwgW2Z4SGlkZS5ndC1zbV0sIFtmeEhpZGUuZ3QtbWRdLCBbZnhIaWRlLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnc2hvdycgTGF5b3V0IEFQSSBkaXJlY3RpdmVcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3IsIGlucHV0c30pXG5leHBvcnQgY2xhc3MgRGVmYXVsdFNob3dIaWRlRGlyZWN0aXZlIGV4dGVuZHMgU2hvd0hpZGVEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgaW5wdXRzID0gaW5wdXRzO1xufVxuIl19