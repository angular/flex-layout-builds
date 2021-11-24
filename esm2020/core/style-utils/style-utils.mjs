/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { applyCssPrefixes } from '@angular/flex-layout/_private-utils';
import { SERVER_TOKEN } from '../tokens/server-token';
import { LAYOUT_CONFIG } from '../tokens/library-config';
import * as i0 from "@angular/core";
import * as i1 from "../stylesheet-map/stylesheet-map";
export class StyleUtils {
    constructor(_serverStylesheet, _serverModuleLoaded, _platformId, layoutConfig) {
        this._serverStylesheet = _serverStylesheet;
        this._serverModuleLoaded = _serverModuleLoaded;
        this._platformId = _platformId;
        this.layoutConfig = layoutConfig;
    }
    /**
     * Applies styles given via string pair or object map to the directive element
     */
    applyStyleToElement(element, style, value = null) {
        let styles = {};
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
        this._applyMultiValueStyleToElement(styles, element);
    }
    /**
     * Applies styles given via string pair or object map to the directive's element
     */
    applyStyleToElements(style, elements = []) {
        const styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
        elements.forEach(el => {
            this._applyMultiValueStyleToElement(styles, el);
        });
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction)
     *
     * Check inline style first then check computed (stylesheet) style
     */
    getFlowDirection(target) {
        const query = 'flex-direction';
        let value = this.lookupStyle(target, query);
        const hasInlineValue = this.lookupInlineStyle(target, query) ||
            (isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';
        return [value || 'row', hasInlineValue];
    }
    hasWrap(target) {
        const query = 'flex-wrap';
        return this.lookupStyle(target, query) === 'wrap';
    }
    /**
     * Find the DOM element's raw attribute value (if any)
     */
    lookupAttributeValue(element, attribute) {
        return element.getAttribute(attribute) || '';
    }
    /**
     * Find the DOM element's inline style value (if any)
     */
    lookupInlineStyle(element, styleName) {
        return isPlatformBrowser(this._platformId) ?
            element.style.getPropertyValue(styleName) : this._getServerStyle(element, styleName);
    }
    /**
     * Determine the inline or inherited CSS style
     * NOTE: platform-server has no implementation for getComputedStyle
     */
    lookupStyle(element, styleName, inlineOnly = false) {
        let value = '';
        if (element) {
            let immediateValue = value = this.lookupInlineStyle(element, styleName);
            if (!immediateValue) {
                if (isPlatformBrowser(this._platformId)) {
                    if (!inlineOnly) {
                        value = getComputedStyle(element).getPropertyValue(styleName);
                    }
                }
                else {
                    if (this._serverModuleLoaded) {
                        value = this._serverStylesheet.getStyleForElement(element, styleName);
                    }
                }
            }
        }
        // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
        //       in which case getComputedStyle() should determine a valid value.
        return value ? value.trim() : '';
    }
    /**
     * Applies the styles to the element. The styles object map may contain an array of values
     * Each value will be added as element style
     * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
     */
    _applyMultiValueStyleToElement(styles, element) {
        Object.keys(styles).sort().forEach(key => {
            const el = styles[key];
            const values = Array.isArray(el) ? el : [el];
            values.sort();
            for (let value of values) {
                value = value ? value + '' : '';
                if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
                    isPlatformBrowser(this._platformId) ?
                        element.style.setProperty(key, value) : this._setServerStyle(element, key, value);
                }
                else {
                    this._serverStylesheet.addStyleToElement(element, key, value);
                }
            }
        });
    }
    _setServerStyle(element, styleName, styleValue) {
        styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const styleMap = this._readStyleAttribute(element);
        styleMap[styleName] = styleValue || '';
        this._writeStyleAttribute(element, styleMap);
    }
    _getServerStyle(element, styleName) {
        const styleMap = this._readStyleAttribute(element);
        return styleMap[styleName] || '';
    }
    _readStyleAttribute(element) {
        const styleMap = {};
        const styleAttribute = element.getAttribute('style');
        if (styleAttribute) {
            const styleList = styleAttribute.split(/;+/g);
            for (let i = 0; i < styleList.length; i++) {
                const style = styleList[i].trim();
                if (style.length > 0) {
                    const colonIndex = style.indexOf(':');
                    if (colonIndex === -1) {
                        throw new Error(`Invalid CSS style: ${style}`);
                    }
                    const name = style.substr(0, colonIndex).trim();
                    styleMap[name] = style.substr(colonIndex + 1).trim();
                }
            }
        }
        return styleMap;
    }
    _writeStyleAttribute(element, styleMap) {
        let styleAttrValue = '';
        for (const key in styleMap) {
            const newValue = styleMap[key];
            if (newValue) {
                styleAttrValue += key + ':' + styleMap[key] + ';';
            }
        }
        element.setAttribute('style', styleAttrValue);
    }
}
StyleUtils.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: StyleUtils, deps: [{ token: i1.StylesheetMap }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
StyleUtils.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: StyleUtils, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: StyleUtils, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.StylesheetMap }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvc3R5bGUtdXRpbHMvc3R5bGUtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXBFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBRXJFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsYUFBYSxFQUFzQixNQUFNLDBCQUEwQixDQUFDOzs7QUFHNUUsTUFBTSxPQUFPLFVBQVU7SUFFckIsWUFBb0IsaUJBQWdDLEVBQ1YsbUJBQTRCLEVBQzdCLFdBQW1CLEVBQ2pCLFlBQWlDO1FBSHhELHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBZTtRQUNWLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBUztRQUM3QixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFBRyxDQUFDO0lBRWhGOztPQUVHO0lBQ0gsbUJBQW1CLENBQUMsT0FBb0IsRUFDcEIsS0FBK0IsRUFDL0IsUUFBZ0MsSUFBSTtRQUN0RCxJQUFJLE1BQU0sR0FBb0IsRUFBRSxDQUFDO1FBQ2pDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNoQjtRQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsb0JBQW9CLENBQUMsS0FBc0IsRUFBRSxXQUEwQixFQUFFO1FBQ3ZFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekYsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsOEJBQThCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxnQkFBZ0IsQ0FBQyxNQUFtQjtRQUNsQyxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUM1RCxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFOUUsT0FBTyxDQUFDLEtBQUssSUFBSSxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFtQjtRQUN6QixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxNQUFNLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsb0JBQW9CLENBQUMsT0FBb0IsRUFBRSxTQUFpQjtRQUMxRCxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQixDQUFDLE9BQW9CLEVBQUUsU0FBaUI7UUFDdkQsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVyxDQUFDLE9BQW9CLEVBQUUsU0FBaUIsRUFBRSxVQUFVLEdBQUcsS0FBSztRQUNyRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksY0FBYyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25CLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUN2QyxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNmLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDL0Q7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7d0JBQzVCLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO3FCQUN2RTtpQkFDRjthQUNGO1NBQ0Y7UUFFRCxpRkFBaUY7UUFDakYseUVBQXlFO1FBQ3pFLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLDhCQUE4QixDQUFDLE1BQXVCLEVBQ3ZCLE9BQW9CO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixNQUFNLE1BQU0sR0FBK0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUN4QixLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO29CQUNwRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3JGO3FCQUFNO29CQUNMLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMvRDthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sZUFBZSxDQUFDLE9BQVksRUFBRSxTQUFpQixFQUFFLFVBQXdCO1FBQy9FLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyxlQUFlLENBQUMsT0FBWSxFQUFFLFNBQWlCO1FBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVPLG1CQUFtQixDQUFDLE9BQVk7UUFDdEMsTUFBTSxRQUFRLEdBQTZCLEVBQUUsQ0FBQztRQUM5QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELElBQUksY0FBYyxFQUFFO1lBQ2xCLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDcEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEtBQUssRUFBRSxDQUFDLENBQUM7cUJBQ2hEO29CQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3REO2FBQ0Y7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxPQUFZLEVBQUUsUUFBa0M7UUFDM0UsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFO1lBQzFCLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFJLFFBQVEsRUFBRTtnQkFDWixjQUFjLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ25EO1NBQ0Y7UUFDRCxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDOzt1R0E1SlUsVUFBVSwrQ0FHRCxZQUFZLGFBQ1osV0FBVyxhQUNYLGFBQWE7MkdBTHRCLFVBQVUsY0FERSxNQUFNOzJGQUNsQixVQUFVO2tCQUR0QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBSWpCLE1BQU07MkJBQUMsWUFBWTs4QkFDc0IsTUFBTTswQkFBL0MsTUFBTTsyQkFBQyxXQUFXOzswQkFDbEIsTUFBTTsyQkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3NlciwgaXNQbGF0Zm9ybVNlcnZlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHthcHBseUNzc1ByZWZpeGVzfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dC9fcHJpdmF0ZS11dGlscyc7XG5pbXBvcnQge1N0eWxlc2hlZXRNYXB9IGZyb20gJy4uL3N0eWxlc2hlZXQtbWFwL3N0eWxlc2hlZXQtbWFwJztcbmltcG9ydCB7U0VSVkVSX1RPS0VOfSBmcm9tICcuLi90b2tlbnMvc2VydmVyLXRva2VuJztcbmltcG9ydCB7TEFZT1VUX0NPTkZJRywgTGF5b3V0Q29uZmlnT3B0aW9uc30gZnJvbSAnLi4vdG9rZW5zL2xpYnJhcnktY29uZmlnJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgU3R5bGVVdGlscyB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2VydmVyU3R5bGVzaGVldDogU3R5bGVzaGVldE1hcCxcbiAgICAgICAgICAgICAgQEluamVjdChTRVJWRVJfVE9LRU4pIHByaXZhdGUgX3NlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICAgICAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByaXZhdGUgbGF5b3V0Q29uZmlnOiBMYXlvdXRDb25maWdPcHRpb25zKSB7fVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHN0eWxlcyBnaXZlbiB2aWEgc3RyaW5nIHBhaXIgb3Igb2JqZWN0IG1hcCB0byB0aGUgZGlyZWN0aXZlIGVsZW1lbnRcbiAgICovXG4gIGFwcGx5U3R5bGVUb0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IFN0eWxlRGVmaW5pdGlvbiB8IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IG51bGwpIHtcbiAgICBsZXQgc3R5bGVzOiBTdHlsZURlZmluaXRpb24gPSB7fTtcbiAgICBpZiAodHlwZW9mIHN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgc3R5bGVzW3N0eWxlXSA9IHZhbHVlO1xuICAgICAgc3R5bGUgPSBzdHlsZXM7XG4gICAgfVxuICAgIHN0eWxlcyA9IHRoaXMubGF5b3V0Q29uZmlnLmRpc2FibGVWZW5kb3JQcmVmaXhlcyA/IHN0eWxlIDogYXBwbHlDc3NQcmVmaXhlcyhzdHlsZSk7XG4gICAgdGhpcy5fYXBwbHlNdWx0aVZhbHVlU3R5bGVUb0VsZW1lbnQoc3R5bGVzLCBlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHN0eWxlcyBnaXZlbiB2aWEgc3RyaW5nIHBhaXIgb3Igb2JqZWN0IG1hcCB0byB0aGUgZGlyZWN0aXZlJ3MgZWxlbWVudFxuICAgKi9cbiAgYXBwbHlTdHlsZVRvRWxlbWVudHMoc3R5bGU6IFN0eWxlRGVmaW5pdGlvbiwgZWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSBbXSkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMubGF5b3V0Q29uZmlnLmRpc2FibGVWZW5kb3JQcmVmaXhlcyA/IHN0eWxlIDogYXBwbHlDc3NQcmVmaXhlcyhzdHlsZSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICB0aGlzLl9hcHBseU11bHRpVmFsdWVTdHlsZVRvRWxlbWVudChzdHlsZXMsIGVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIERPTSBlbGVtZW50J3MgRmxleGJveCBmbG93IChmbGV4LWRpcmVjdGlvbilcbiAgICpcbiAgICogQ2hlY2sgaW5saW5lIHN0eWxlIGZpcnN0IHRoZW4gY2hlY2sgY29tcHV0ZWQgKHN0eWxlc2hlZXQpIHN0eWxlXG4gICAqL1xuICBnZXRGbG93RGlyZWN0aW9uKHRhcmdldDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICBjb25zdCBxdWVyeSA9ICdmbGV4LWRpcmVjdGlvbic7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5sb29rdXBTdHlsZSh0YXJnZXQsIHF1ZXJ5KTtcbiAgICBjb25zdCBoYXNJbmxpbmVWYWx1ZSA9IHRoaXMubG9va3VwSW5saW5lU3R5bGUodGFyZ2V0LCBxdWVyeSkgfHxcbiAgICAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLl9wbGF0Zm9ybUlkKSAmJiB0aGlzLl9zZXJ2ZXJNb2R1bGVMb2FkZWQpID8gdmFsdWUgOiAnJztcblxuICAgIHJldHVybiBbdmFsdWUgfHwgJ3JvdycsIGhhc0lubGluZVZhbHVlXTtcbiAgfVxuXG4gIGhhc1dyYXAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gJ2ZsZXgtd3JhcCc7XG4gICAgcmV0dXJuIHRoaXMubG9va3VwU3R5bGUodGFyZ2V0LCBxdWVyeSkgPT09ICd3cmFwJztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBET00gZWxlbWVudCdzIHJhdyBhdHRyaWJ1dGUgdmFsdWUgKGlmIGFueSlcbiAgICovXG4gIGxvb2t1cEF0dHJpYnV0ZVZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhdHRyaWJ1dGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgRE9NIGVsZW1lbnQncyBpbmxpbmUgc3R5bGUgdmFsdWUgKGlmIGFueSlcbiAgICovXG4gIGxvb2t1cElubGluZVN0eWxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdHlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpID9cbiAgICAgIGVsZW1lbnQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZU5hbWUpIDogdGhpcy5fZ2V0U2VydmVyU3R5bGUoZWxlbWVudCwgc3R5bGVOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIGlubGluZSBvciBpbmhlcml0ZWQgQ1NTIHN0eWxlXG4gICAqIE5PVEU6IHBsYXRmb3JtLXNlcnZlciBoYXMgbm8gaW1wbGVtZW50YXRpb24gZm9yIGdldENvbXB1dGVkU3R5bGVcbiAgICovXG4gIGxvb2t1cFN0eWxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdHlsZU5hbWU6IHN0cmluZywgaW5saW5lT25seSA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgdmFsdWUgPSAnJztcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgbGV0IGltbWVkaWF0ZVZhbHVlID0gdmFsdWUgPSB0aGlzLmxvb2t1cElubGluZVN0eWxlKGVsZW1lbnQsIHN0eWxlTmFtZSk7XG4gICAgICBpZiAoIWltbWVkaWF0ZVZhbHVlKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgIGlmICghaW5saW5lT25seSkge1xuICAgICAgICAgICAgdmFsdWUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3NlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9zZXJ2ZXJTdHlsZXNoZWV0LmdldFN0eWxlRm9yRWxlbWVudChlbGVtZW50LCBzdHlsZU5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGU6ICdpbmxpbmUnIGlzIHRoZSBkZWZhdWx0IG9mIGFsbCBlbGVtZW50cywgdW5sZXNzIFVBIHN0eWxlc2hlZXQgb3ZlcnJpZGVzO1xuICAgIC8vICAgICAgIGluIHdoaWNoIGNhc2UgZ2V0Q29tcHV0ZWRTdHlsZSgpIHNob3VsZCBkZXRlcm1pbmUgYSB2YWxpZCB2YWx1ZS5cbiAgICByZXR1cm4gdmFsdWUgPyB2YWx1ZS50cmltKCkgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzdHlsZXMgdG8gdGhlIGVsZW1lbnQuIFRoZSBzdHlsZXMgb2JqZWN0IG1hcCBtYXkgY29udGFpbiBhbiBhcnJheSBvZiB2YWx1ZXNcbiAgICogRWFjaCB2YWx1ZSB3aWxsIGJlIGFkZGVkIGFzIGVsZW1lbnQgc3R5bGVcbiAgICogS2V5cyBhcmUgc29ydGVkIHRvIGFkZCBwcmVmaXhlZCBzdHlsZXMgKGxpa2UgLXdlYmtpdC14KSBmaXJzdCwgYmVmb3JlIHRoZSBzdGFuZGFyZCBvbmVzXG4gICAqL1xuICBwcml2YXRlIF9hcHBseU11bHRpVmFsdWVTdHlsZVRvRWxlbWVudChzdHlsZXM6IFN0eWxlRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLnNvcnQoKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBlbCA9IHN0eWxlc1trZXldO1xuICAgICAgY29uc3QgdmFsdWVzOiAoc3RyaW5nIHwgbnVtYmVyIHwgbnVsbClbXSA9IEFycmF5LmlzQXJyYXkoZWwpID8gZWwgOiBbZWxdO1xuICAgICAgdmFsdWVzLnNvcnQoKTtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlID8gdmFsdWUgKyAnJyA6ICcnO1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkgfHwgIXRoaXMuX3NlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpID9cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSkgOiB0aGlzLl9zZXRTZXJ2ZXJTdHlsZShlbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9zZXJ2ZXJTdHlsZXNoZWV0LmFkZFN0eWxlVG9FbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTZXJ2ZXJTdHlsZShlbGVtZW50OiBhbnksIHN0eWxlTmFtZTogc3RyaW5nLCBzdHlsZVZhbHVlPzogc3RyaW5nfG51bGwpIHtcbiAgICBzdHlsZU5hbWUgPSBzdHlsZU5hbWUucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBzdHlsZU1hcCA9IHRoaXMuX3JlYWRTdHlsZUF0dHJpYnV0ZShlbGVtZW50KTtcbiAgICBzdHlsZU1hcFtzdHlsZU5hbWVdID0gc3R5bGVWYWx1ZSB8fCAnJztcbiAgICB0aGlzLl93cml0ZVN0eWxlQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlTWFwKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNlcnZlclN0eWxlKGVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0eWxlTWFwID0gdGhpcy5fcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQpO1xuICAgIHJldHVybiBzdHlsZU1hcFtzdHlsZU5hbWVdIHx8ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQ6IGFueSk6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSB7XG4gICAgY29uc3Qgc3R5bGVNYXA6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGNvbnN0IHN0eWxlQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgaWYgKHN0eWxlQXR0cmlidXRlKSB7XG4gICAgICBjb25zdCBzdHlsZUxpc3QgPSBzdHlsZUF0dHJpYnV0ZS5zcGxpdCgvOysvZyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdHlsZSA9IHN0eWxlTGlzdFtpXS50cmltKCk7XG4gICAgICAgIGlmIChzdHlsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgY29sb25JbmRleCA9IHN0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgICAgICBpZiAoY29sb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDU1Mgc3R5bGU6ICR7c3R5bGV9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG5hbWUgPSBzdHlsZS5zdWJzdHIoMCwgY29sb25JbmRleCkudHJpbSgpO1xuICAgICAgICAgIHN0eWxlTWFwW25hbWVdID0gc3R5bGUuc3Vic3RyKGNvbG9uSW5kZXggKyAxKS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlTWFwO1xuICB9XG5cbiAgcHJpdmF0ZSBfd3JpdGVTdHlsZUF0dHJpYnV0ZShlbGVtZW50OiBhbnksIHN0eWxlTWFwOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30pIHtcbiAgICBsZXQgc3R5bGVBdHRyVmFsdWUgPSAnJztcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzdHlsZU1hcCkge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSBzdHlsZU1hcFtrZXldO1xuICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgIHN0eWxlQXR0clZhbHVlICs9IGtleSArICc6JyArIHN0eWxlTWFwW2tleV0gKyAnOyc7XG4gICAgICB9XG4gICAgfVxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlQXR0clZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBjc3Mgc3R5bGUuIEVpdGhlciBhIHByb3BlcnR5IG5hbWUgKGUuZy4gXCJmbGV4LWJhc2lzXCIpIG9yIGFuIG9iamVjdFxuICogbWFwIG9mIHByb3BlcnR5IG5hbWUgYW5kIHZhbHVlIChlLmcuIHtkaXNwbGF5OiAnbm9uZScsIGZsZXgtb3JkZXI6IDV9KVxuICovXG5leHBvcnQgdHlwZSBTdHlsZURlZmluaXRpb24gPSB7IFtwcm9wZXJ0eTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB9O1xuIl19