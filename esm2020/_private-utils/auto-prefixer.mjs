/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Applies CSS prefixes to appropriate style keys.
 *
 * Note: `-ms-`, `-moz` and `-webkit-box` are no longer supported. e.g.
 *    {
 *      display: -webkit-flex;     NEW - Safari 6.1+. iOS 7.1+, BB10
 *      display: flex;             NEW, Spec - Firefox, Chrome, Opera
 *      // display: -webkit-box;   OLD - iOS 6-, Safari 3.1-6, BB7
 *      // display: -ms-flexbox;   TWEENER - IE 10
 *      // display: -moz-flexbox;  OLD - Firefox
 *    }
 */
export function applyCssPrefixes(target) {
    for (let key in target) {
        let value = target[key] || '';
        switch (key) {
            case 'display':
                if (value === 'flex') {
                    target['display'] = [
                        '-webkit-flex',
                        'flex'
                    ];
                }
                else if (value === 'inline-flex') {
                    target['display'] = [
                        '-webkit-inline-flex',
                        'inline-flex'
                    ];
                }
                else {
                    target['display'] = value;
                }
                break;
            case 'align-items':
            case 'align-self':
            case 'align-content':
            case 'flex':
            case 'flex-basis':
            case 'flex-flow':
            case 'flex-grow':
            case 'flex-shrink':
            case 'flex-wrap':
            case 'justify-content':
                target['-webkit-' + key] = value;
                break;
            case 'flex-direction':
                value = value || 'row';
                target['-webkit-flex-direction'] = value;
                target['flex-direction'] = value;
                break;
            case 'order':
                target['order'] = target['-webkit-' + key] = isNaN(+value) ? '0' : value;
                break;
        }
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1wcmVmaXhlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMvYXV0by1wcmVmaXhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxNQUFtQztJQUNsRSxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN0QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTlCLFFBQVEsR0FBRyxFQUFFO1lBQ1gsS0FBSyxTQUFTO2dCQUNaLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtvQkFDcEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO3dCQUNsQixjQUFjO3dCQUNkLE1BQU07cUJBQ1AsQ0FBQztpQkFDSDtxQkFBTSxJQUFJLEtBQUssS0FBSyxhQUFhLEVBQUU7b0JBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRzt3QkFDbEIscUJBQXFCO3dCQUNyQixhQUFhO3FCQUNkLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDM0I7Z0JBQ0QsTUFBTTtZQUVSLEtBQUssYUFBYSxDQUFDO1lBQ25CLEtBQUssWUFBWSxDQUFDO1lBQ2xCLEtBQUssZUFBZSxDQUFDO1lBQ3JCLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxZQUFZLENBQUM7WUFDbEIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxpQkFBaUI7Z0JBQ3BCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxNQUFNO1lBRVIsS0FBSyxnQkFBZ0I7Z0JBQ25CLEtBQUssR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO2dCQUN2QixNQUFNLENBQUMsd0JBQXdCLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDakMsTUFBTTtZQUVSLEtBQUssT0FBTztnQkFDVixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3pFLE1BQU07U0FDVDtLQUNGO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBBcHBsaWVzIENTUyBwcmVmaXhlcyB0byBhcHByb3ByaWF0ZSBzdHlsZSBrZXlzLlxuICpcbiAqIE5vdGU6IGAtbXMtYCwgYC1tb3pgIGFuZCBgLXdlYmtpdC1ib3hgIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkLiBlLmcuXG4gKiAgICB7XG4gKiAgICAgIGRpc3BsYXk6IC13ZWJraXQtZmxleDsgICAgIE5FVyAtIFNhZmFyaSA2LjErLiBpT1MgNy4xKywgQkIxMFxuICogICAgICBkaXNwbGF5OiBmbGV4OyAgICAgICAgICAgICBORVcsIFNwZWMgLSBGaXJlZm94LCBDaHJvbWUsIE9wZXJhXG4gKiAgICAgIC8vIGRpc3BsYXk6IC13ZWJraXQtYm94OyAgIE9MRCAtIGlPUyA2LSwgU2FmYXJpIDMuMS02LCBCQjdcbiAqICAgICAgLy8gZGlzcGxheTogLW1zLWZsZXhib3g7ICAgVFdFRU5FUiAtIElFIDEwXG4gKiAgICAgIC8vIGRpc3BsYXk6IC1tb3otZmxleGJveDsgIE9MRCAtIEZpcmVmb3hcbiAqICAgIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q3NzUHJlZml4ZXModGFyZ2V0OiB7W2tleTogc3RyaW5nXTogYW55IHwgbnVsbH0pIHtcbiAgZm9yIChsZXQga2V5IGluIHRhcmdldCkge1xuICAgIGxldCB2YWx1ZSA9IHRhcmdldFtrZXldIHx8ICcnO1xuXG4gICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2UgJ2Rpc3BsYXknOlxuICAgICAgICBpZiAodmFsdWUgPT09ICdmbGV4Jykge1xuICAgICAgICAgIHRhcmdldFsnZGlzcGxheSddID0gW1xuICAgICAgICAgICAgJy13ZWJraXQtZmxleCcsXG4gICAgICAgICAgICAnZmxleCdcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnaW5saW5lLWZsZXgnKSB7XG4gICAgICAgICAgdGFyZ2V0WydkaXNwbGF5J10gPSBbXG4gICAgICAgICAgICAnLXdlYmtpdC1pbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAnaW5saW5lLWZsZXgnXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRbJ2Rpc3BsYXknXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdhbGlnbi1pdGVtcyc6XG4gICAgICBjYXNlICdhbGlnbi1zZWxmJzpcbiAgICAgIGNhc2UgJ2FsaWduLWNvbnRlbnQnOlxuICAgICAgY2FzZSAnZmxleCc6XG4gICAgICBjYXNlICdmbGV4LWJhc2lzJzpcbiAgICAgIGNhc2UgJ2ZsZXgtZmxvdyc6XG4gICAgICBjYXNlICdmbGV4LWdyb3cnOlxuICAgICAgY2FzZSAnZmxleC1zaHJpbmsnOlxuICAgICAgY2FzZSAnZmxleC13cmFwJzpcbiAgICAgIGNhc2UgJ2p1c3RpZnktY29udGVudCc6XG4gICAgICAgIHRhcmdldFsnLXdlYmtpdC0nICsga2V5XSA9IHZhbHVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZmxleC1kaXJlY3Rpb24nOlxuICAgICAgICB2YWx1ZSA9IHZhbHVlIHx8ICdyb3cnO1xuICAgICAgICB0YXJnZXRbJy13ZWJraXQtZmxleC1kaXJlY3Rpb24nXSA9IHZhbHVlO1xuICAgICAgICB0YXJnZXRbJ2ZsZXgtZGlyZWN0aW9uJ10gPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29yZGVyJzpcbiAgICAgICAgdGFyZ2V0WydvcmRlciddID0gdGFyZ2V0Wyctd2Via2l0LScgKyBrZXldID0gaXNOYU4oK3ZhbHVlKSA/ICcwJyA6IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cbiJdfQ==