/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@angular/flex-layout/core';
import { takeUntil } from 'rxjs/operators';
import { extendObject } from '@angular/flex-layout/_private-utils';
import { LAYOUT_VALUES, isFlowHorizontal } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/flex-layout/core";
export class LayoutAlignStyleBuilder extends StyleBuilder {
    buildStyles(align, parent) {
        const css = {}, [mainAxis, crossAxis] = align.split(' ');
        // Main axis
        switch (mainAxis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
                break;
            case 'end':
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default:
                css['justify-content'] = 'flex-start'; // default main axis
                break;
        }
        // Cross-axis
        switch (crossAxis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'space-between':
                css['align-content'] = 'space-between';
                css['align-items'] = 'stretch';
                break;
            case 'space-around':
                css['align-content'] = 'space-around';
                css['align-items'] = 'stretch';
                break;
            case 'baseline':
                css['align-content'] = 'stretch';
                css['align-items'] = 'baseline';
                break;
            case 'stretch':
            default: // 'stretch'
                css['align-items'] = css['align-content'] = 'stretch'; // default cross axis
                break;
        }
        return extendObject(css, {
            'display': parent.inline ? 'inline-flex' : 'flex',
            'flex-direction': parent.layout,
            'box-sizing': 'border-box',
            'max-width': crossAxis === 'stretch' ?
                !isFlowHorizontal(parent.layout) ? '100%' : null : null,
            'max-height': crossAxis === 'stretch' ?
                isFlowHorizontal(parent.layout) ? '100%' : null : null,
        });
    }
}
LayoutAlignStyleBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
LayoutAlignStyleBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutAlignStyleBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxLayoutAlign', 'fxLayoutAlign.xs', 'fxLayoutAlign.sm', 'fxLayoutAlign.md',
    'fxLayoutAlign.lg', 'fxLayoutAlign.xl', 'fxLayoutAlign.lt-sm', 'fxLayoutAlign.lt-md',
    'fxLayoutAlign.lt-lg', 'fxLayoutAlign.lt-xl', 'fxLayoutAlign.gt-xs', 'fxLayoutAlign.gt-sm',
    'fxLayoutAlign.gt-md', 'fxLayoutAlign.gt-lg'
];
const selector = `
  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],
  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],
  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],
  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
`;
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
export class LayoutAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout-align';
        this.layout = 'row'; // default flex-direction
        this.inline = false; // default inline value
        this.init();
        this.marshal.trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    updateWithValue(value) {
        const layout = this.layout || 'row';
        const inline = this.inline;
        if (layout === 'row' && inline) {
            this.styleCache = layoutAlignHorizontalInlineCache;
        }
        else if (layout === 'row' && !inline) {
            this.styleCache = layoutAlignHorizontalCache;
        }
        else if (layout === 'row-reverse' && inline) {
            this.styleCache = layoutAlignHorizontalRevInlineCache;
        }
        else if (layout === 'row-reverse' && !inline) {
            this.styleCache = layoutAlignHorizontalRevCache;
        }
        else if (layout === 'column' && inline) {
            this.styleCache = layoutAlignVerticalInlineCache;
        }
        else if (layout === 'column' && !inline) {
            this.styleCache = layoutAlignVerticalCache;
        }
        else if (layout === 'column-reverse' && inline) {
            this.styleCache = layoutAlignVerticalRevInlineCache;
        }
        else if (layout === 'column-reverse' && !inline) {
            this.styleCache = layoutAlignVerticalRevCache;
        }
        this.addStyles(value, { layout, inline });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    onLayoutChange(matcher) {
        const layoutKeys = matcher.value.split(' ');
        this.layout = layoutKeys[0];
        this.inline = matcher.value.includes('inline');
        if (!LAYOUT_VALUES.find(x => x === this.layout)) {
            this.layout = 'row';
        }
        this.triggerUpdate();
    }
}
LayoutAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutAlignDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutAlignStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
LayoutAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: LayoutAlignDirective, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: LayoutAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutAlignStyleBuilder }, { type: i1.MediaMarshaller }]; } });
export class DefaultLayoutAlignDirective extends LayoutAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
}
DefaultLayoutAlignDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
DefaultLayoutAlignDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: DefaultLayoutAlignDirective, selector: "\n  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],\n  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],\n  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],\n  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]\n", inputs: { fxLayoutAlign: "fxLayoutAlign", "fxLayoutAlign.xs": "fxLayoutAlign.xs", "fxLayoutAlign.sm": "fxLayoutAlign.sm", "fxLayoutAlign.md": "fxLayoutAlign.md", "fxLayoutAlign.lg": "fxLayoutAlign.lg", "fxLayoutAlign.xl": "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm": "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md": "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg": "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl": "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs": "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm": "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md": "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg": "fxLayoutAlign.gt-lg" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: DefaultLayoutAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutAlignHorizontalCache = new Map();
const layoutAlignVerticalCache = new Map();
const layoutAlignHorizontalRevCache = new Map();
const layoutAlignVerticalRevCache = new Map();
const layoutAlignHorizontalInlineCache = new Map();
const layoutAlignVerticalInlineCache = new Map();
const layoutAlignHorizontalRevInlineCache = new Map();
const layoutAlignVerticalRevInlineCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LWFsaWduLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC1hbGlnbi9sYXlvdXQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFNBQVMsRUFBYyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUNMLGNBQWMsRUFDZCxZQUFZLEdBS2IsTUFBTSwyQkFBMkIsQ0FBQztBQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBUXBGLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxZQUFZO0lBQ3ZELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBeUI7UUFDbEQsTUFBTSxHQUFHLEdBQW9CLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFFLFlBQVk7UUFDWixRQUFRLFFBQVEsRUFBRTtZQUNoQixLQUFLLFFBQVE7Z0JBQ1gsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUNsQyxNQUFNO1lBQ1IsS0FBSyxjQUFjO2dCQUNqQixHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxjQUFjLENBQUM7Z0JBQ3hDLE1BQU07WUFDUixLQUFLLGVBQWU7Z0JBQ2xCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLGVBQWUsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssY0FBYztnQkFDakIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsY0FBYyxDQUFDO2dCQUN4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SyxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7O2lIQXpEVSxvQkFBb0Isc0VBT0wsdUJBQXVCO3FHQVB0QyxvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsU0FBUzs0R0FRa0IsdUJBQXVCO0FBc0RuRCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsb0JBQW9CO0lBRHJFOztRQUVZLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDM0I7O3dIQUZZLDJCQUEyQjs0R0FBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBRHZDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDOztBQUs3QixNQUFNLDBCQUEwQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzNFLE1BQU0sd0JBQXdCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekUsTUFBTSw2QkFBNkIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM5RSxNQUFNLDJCQUEyQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVFLE1BQU0sZ0NBQWdDLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDakYsTUFBTSw4QkFBOEIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMvRSxNQUFNLG1DQUFtQyxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3BGLE1BQU0saUNBQWlDLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBFbGVtZW50TWF0Y2hlcixcbn0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvY29yZSc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge2V4dGVuZE9iamVjdH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuaW1wb3J0IHtMQVlPVVRfVkFMVUVTLCBpc0Zsb3dIb3Jpem9udGFsfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9fcHJpdmF0ZS11dGlscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF5b3V0QWxpZ25QYXJlbnQge1xuICBsYXlvdXQ6IHN0cmluZztcbiAgaW5saW5lOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBMYXlvdXRBbGlnblN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGJ1aWxkU3R5bGVzKGFsaWduOiBzdHJpbmcsIHBhcmVudDogTGF5b3V0QWxpZ25QYXJlbnQpIHtcbiAgICBjb25zdCBjc3M6IFN0eWxlRGVmaW5pdGlvbiA9IHt9LCBbbWFpbkF4aXMsIGNyb3NzQXhpc10gPSBhbGlnbi5zcGxpdCgnICcpO1xuXG4gICAgLy8gTWFpbiBheGlzXG4gICAgc3dpdGNoIChtYWluQXhpcykge1xuICAgICAgY2FzZSAnY2VudGVyJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdjZW50ZXInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWFyb3VuZCc6XG4gICAgICAgIGNzc1snanVzdGlmeS1jb250ZW50J10gPSAnc3BhY2UtYXJvdW5kJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1iZXR3ZWVuJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1ldmVubHknOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ3NwYWNlLWV2ZW5seSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgIGNhc2UgJ2ZsZXgtZW5kJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdmbGV4LWVuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY2FzZSAnZmxleC1zdGFydCc6XG4gICAgICBkZWZhdWx0IDpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdmbGV4LXN0YXJ0JzsgIC8vIGRlZmF1bHQgbWFpbiBheGlzXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIENyb3NzLWF4aXNcbiAgICBzd2l0Y2ggKGNyb3NzQXhpcykge1xuICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY2FzZSAnZmxleC1zdGFydCc6XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9IGNzc1snYWxpZ24tY29udGVudCddID0gJ2ZsZXgtc3RhcnQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9IGNzc1snYWxpZ24tY29udGVudCddID0gJ2NlbnRlcic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgIGNhc2UgJ2ZsZXgtZW5kJzpcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gY3NzWydhbGlnbi1jb250ZW50J10gPSAnZmxleC1lbmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWJldHdlZW4nOlxuICAgICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gJ3N0cmV0Y2gnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWFyb3VuZCc6XG4gICAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWFyb3VuZCc7XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdzdHJldGNoJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiYXNlbGluZSc6XG4gICAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3N0cmV0Y2gnO1xuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnYmFzZWxpbmUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N0cmV0Y2gnOlxuICAgICAgZGVmYXVsdCA6IC8vICdzdHJldGNoJ1xuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdzdHJldGNoJzsgICAvLyBkZWZhdWx0IGNyb3NzIGF4aXNcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dGVuZE9iamVjdChjc3MsIHtcbiAgICAgICdkaXNwbGF5JyA6IHBhcmVudC5pbmxpbmUgPyAnaW5saW5lLWZsZXgnIDogJ2ZsZXgnLFxuICAgICAgJ2ZsZXgtZGlyZWN0aW9uJyA6IHBhcmVudC5sYXlvdXQsXG4gICAgICAnYm94LXNpemluZycgOiAnYm9yZGVyLWJveCcsXG4gICAgICAnbWF4LXdpZHRoJzogY3Jvc3NBeGlzID09PSAnc3RyZXRjaCcgP1xuICAgICAgICAhaXNGbG93SG9yaXpvbnRhbChwYXJlbnQubGF5b3V0KSA/ICcxMDAlJyA6IG51bGwgOiBudWxsLFxuICAgICAgJ21heC1oZWlnaHQnOiBjcm9zc0F4aXMgPT09ICdzdHJldGNoJyA/XG4gICAgICAgIGlzRmxvd0hvcml6b250YWwocGFyZW50LmxheW91dCkgPyAnMTAwJScgOiBudWxsIDogbnVsbCxcbiAgICB9KSBhcyBTdHlsZURlZmluaXRpb247XG4gIH1cbn1cblxuY29uc3QgaW5wdXRzID0gW1xuICAnZnhMYXlvdXRBbGlnbicsICdmeExheW91dEFsaWduLnhzJywgJ2Z4TGF5b3V0QWxpZ24uc20nLCAnZnhMYXlvdXRBbGlnbi5tZCcsXG4gICdmeExheW91dEFsaWduLmxnJywgJ2Z4TGF5b3V0QWxpZ24ueGwnLCAnZnhMYXlvdXRBbGlnbi5sdC1zbScsICdmeExheW91dEFsaWduLmx0LW1kJyxcbiAgJ2Z4TGF5b3V0QWxpZ24ubHQtbGcnLCAnZnhMYXlvdXRBbGlnbi5sdC14bCcsICdmeExheW91dEFsaWduLmd0LXhzJywgJ2Z4TGF5b3V0QWxpZ24uZ3Qtc20nLFxuICAnZnhMYXlvdXRBbGlnbi5ndC1tZCcsICdmeExheW91dEFsaWduLmd0LWxnJ1xuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZnhMYXlvdXRBbGlnbl0sIFtmeExheW91dEFsaWduLnhzXSwgW2Z4TGF5b3V0QWxpZ24uc21dLCBbZnhMYXlvdXRBbGlnbi5tZF0sXG4gIFtmeExheW91dEFsaWduLmxnXSwgW2Z4TGF5b3V0QWxpZ24ueGxdLCBbZnhMYXlvdXRBbGlnbi5sdC1zbV0sIFtmeExheW91dEFsaWduLmx0LW1kXSxcbiAgW2Z4TGF5b3V0QWxpZ24ubHQtbGddLCBbZnhMYXlvdXRBbGlnbi5sdC14bF0sIFtmeExheW91dEFsaWduLmd0LXhzXSwgW2Z4TGF5b3V0QWxpZ24uZ3Qtc21dLFxuICBbZnhMYXlvdXRBbGlnbi5ndC1tZF0sIFtmeExheW91dEFsaWduLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnbGF5b3V0LWFsaWduJyBmbGV4Ym94IHN0eWxpbmcgZGlyZWN0aXZlXG4gKiAgRGVmaW5lcyBwb3NpdGlvbmluZyBvZiBjaGlsZCBlbGVtZW50cyBhbG9uZyBtYWluIGFuZCBjcm9zcyBheGlzIGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICogIE9wdGlvbmFsIHZhbHVlczoge21haW4tYXhpc30gdmFsdWVzIG9yIHttYWluLWF4aXMgY3Jvc3MtYXhpc30gdmFsdWUgcGFpcnNcbiAqXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9qL2p1c3RpZnktY29udGVudC9cbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL2EvYWxpZ24taXRlbXMvXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9hL2FsaWduLWNvbnRlbnQvXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIExheW91dEFsaWduRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICdsYXlvdXQtYWxpZ24nO1xuICBwcm90ZWN0ZWQgbGF5b3V0ID0gJ3Jvdyc7ICAvLyBkZWZhdWx0IGZsZXgtZGlyZWN0aW9uXG4gIHByb3RlY3RlZCBpbmxpbmUgPSBmYWxzZTsgIC8vIGRlZmF1bHQgaW5saW5lIHZhbHVlXG5cbiAgY29uc3RydWN0b3IoZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHN0eWxlVXRpbHM6IFN0eWxlVXRpbHMsXG4gICAgICAgICAgICAgIHN0eWxlQnVpbGRlcjogTGF5b3V0QWxpZ25TdHlsZUJ1aWxkZXIsXG4gICAgICAgICAgICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcikge1xuICAgIHN1cGVyKGVsUmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlVXRpbHMsIG1hcnNoYWwpO1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMubWFyc2hhbC50cmFja1ZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2xheW91dCcpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95U3ViamVjdCkpXG4gICAgICAuc3Vic2NyaWJlKHRoaXMub25MYXlvdXRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlV2l0aFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmxheW91dCB8fCAncm93JztcbiAgICBjb25zdCBpbmxpbmUgPSB0aGlzLmlubGluZTtcbiAgICBpZiAobGF5b3V0ID09PSAncm93JyAmJiBpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduSG9yaXpvbnRhbElubGluZUNhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAncm93JyAmJiAhaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnbkhvcml6b250YWxDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ3Jvdy1yZXZlcnNlJyAmJiBpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduSG9yaXpvbnRhbFJldklubGluZUNhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAncm93LXJldmVyc2UnICYmICFpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduSG9yaXpvbnRhbFJldkNhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiBpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduVmVydGljYWxJbmxpbmVDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgIWlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25WZXJ0aWNhbENhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uLXJldmVyc2UnICYmIGlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25WZXJ0aWNhbFJldklubGluZUNhY2hlO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uLXJldmVyc2UnICYmICFpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduVmVydGljYWxSZXZDYWNoZTtcbiAgICB9XG4gICAgdGhpcy5hZGRTdHlsZXModmFsdWUsIHtsYXlvdXQsIGlubGluZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHRoZSBwYXJlbnQgY29udGFpbmVyICdmbGV4LWRpcmVjdGlvbicgYW5kIHVwZGF0ZSB0aGUgJ2ZsZXgnIHN0eWxlc1xuICAgKi9cbiAgcHJvdGVjdGVkIG9uTGF5b3V0Q2hhbmdlKG1hdGNoZXI6IEVsZW1lbnRNYXRjaGVyKSB7XG4gICAgY29uc3QgbGF5b3V0S2V5czogc3RyaW5nW10gPSBtYXRjaGVyLnZhbHVlLnNwbGl0KCcgJyk7XG4gICAgdGhpcy5sYXlvdXQgPSBsYXlvdXRLZXlzWzBdO1xuICAgIHRoaXMuaW5saW5lID0gbWF0Y2hlci52YWx1ZS5pbmNsdWRlcygnaW5saW5lJyk7XG4gICAgaWYgKCFMQVlPVVRfVkFMVUVTLmZpbmQoeCA9PiB4ID09PSB0aGlzLmxheW91dCkpIHtcbiAgICAgIHRoaXMubGF5b3V0ID0gJ3Jvdyc7XG4gICAgfVxuICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yLCBpbnB1dHN9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMYXlvdXRBbGlnbkRpcmVjdGl2ZSBleHRlbmRzIExheW91dEFsaWduRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIGlucHV0cyA9IGlucHV0cztcbn1cblxuY29uc3QgbGF5b3V0QWxpZ25Ib3Jpem9udGFsQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnblZlcnRpY2FsQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnbkhvcml6b250YWxSZXZDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduVmVydGljYWxSZXZDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduSG9yaXpvbnRhbElubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25WZXJ0aWNhbElubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25Ib3Jpem9udGFsUmV2SW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnblZlcnRpY2FsUmV2SW5saW5lQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG4iXX0=