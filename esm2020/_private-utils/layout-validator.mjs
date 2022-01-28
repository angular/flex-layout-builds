/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const INLINE = 'inline';
export const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Validate the direction|'direction wrap' value and then update the host's inline flexbox styles
 */
export function buildLayoutCSS(value) {
    let [direction, wrap, isInline] = validateValue(value);
    return buildCSS(direction, wrap, isInline);
}
/**
  * Validate the value to be one of the acceptable value options
  * Use default fallback of 'row'
  */
export function validateValue(value) {
    value = value ? value.toLowerCase() : '';
    let [direction, wrap, inline] = value.split(' ');
    // First value must be the `flex-direction`
    if (!LAYOUT_VALUES.find(x => x === direction)) {
        direction = LAYOUT_VALUES[0];
    }
    if (wrap === INLINE) {
        wrap = (inline !== INLINE) ? inline : '';
        inline = INLINE;
    }
    return [direction, validateWrapValue(wrap), !!inline];
}
/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 */
export function isFlowHorizontal(value) {
    let [flow,] = validateValue(value);
    return flow.indexOf('row') > -1;
}
/**
 * Convert layout-wrap='<value>' to expected flex-wrap style
 */
export function validateWrapValue(value) {
    if (!!value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
            case 'reverse-wrap':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            // All other values fallback to 'wrap'
            default:
                value = 'wrap';
                break;
        }
    }
    return value;
}
/**
 * Build the CSS that should be assigned to the element instance
 * BUG:
 *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
 *      Use height instead if possible; height : <xxx>vh;
 *
 *  This way any padding or border specified on the child elements are
 *  laid out and drawn inside that element's specified width and height.
 */
function buildCSS(direction, wrap = null, inline = false) {
    return {
        'display': inline ? 'inline-flex' : 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': !!wrap ? wrap : null
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMvbGF5b3V0LXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFaEY7O0dBRUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLEtBQWE7SUFDMUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVGOzs7SUFHSTtBQUNKLE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYTtJQUN6QyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN6QyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpELDJDQUEyQztJQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsRUFBRTtRQUM3QyxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ25CLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUNqQjtJQUVELE9BQU8sQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsS0FBYTtJQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBYTtJQUM3QyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFDWCxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUMzQixLQUFLLFNBQVMsQ0FBQztZQUNmLEtBQUssY0FBYyxDQUFDO1lBQ3BCLEtBQUssY0FBYztnQkFDakIsS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDdkIsTUFBTTtZQUVSLEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLFFBQVE7Z0JBQ1gsS0FBSyxHQUFHLFFBQVEsQ0FBQztnQkFDakIsTUFBTTtZQUVSLHNDQUFzQztZQUN0QztnQkFDRSxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUNmLE1BQU07U0FDVDtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxTQUFpQixFQUFFLE9BQXNCLElBQUksRUFBRSxNQUFNLEdBQUcsS0FBSztJQUM3RSxPQUFPO1FBQ0wsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQzFDLFlBQVksRUFBRSxZQUFZO1FBQzFCLGdCQUFnQixFQUFFLFNBQVM7UUFDM0IsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSTtLQUNsQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuZXhwb3J0IGNvbnN0IElOTElORSA9ICdpbmxpbmUnO1xuZXhwb3J0IGNvbnN0IExBWU9VVF9WQUxVRVMgPSBbJ3JvdycsICdjb2x1bW4nLCAncm93LXJldmVyc2UnLCAnY29sdW1uLXJldmVyc2UnXTtcblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgZGlyZWN0aW9ufCdkaXJlY3Rpb24gd3JhcCcgdmFsdWUgYW5kIHRoZW4gdXBkYXRlIHRoZSBob3N0J3MgaW5saW5lIGZsZXhib3ggc3R5bGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExheW91dENTUyh2YWx1ZTogc3RyaW5nKSB7XG4gIGxldCBbZGlyZWN0aW9uLCB3cmFwLCBpc0lubGluZV0gPSB2YWxpZGF0ZVZhbHVlKHZhbHVlKTtcbiAgcmV0dXJuIGJ1aWxkQ1NTKGRpcmVjdGlvbiwgd3JhcCwgaXNJbmxpbmUpO1xuIH1cblxuLyoqXG4gICogVmFsaWRhdGUgdGhlIHZhbHVlIHRvIGJlIG9uZSBvZiB0aGUgYWNjZXB0YWJsZSB2YWx1ZSBvcHRpb25zXG4gICogVXNlIGRlZmF1bHQgZmFsbGJhY2sgb2YgJ3JvdydcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmcsIGJvb2xlYW5dIHtcbiAgdmFsdWUgPSB2YWx1ZSA/IHZhbHVlLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgbGV0IFtkaXJlY3Rpb24sIHdyYXAsIGlubGluZV0gPSB2YWx1ZS5zcGxpdCgnICcpO1xuXG4gIC8vIEZpcnN0IHZhbHVlIG11c3QgYmUgdGhlIGBmbGV4LWRpcmVjdGlvbmBcbiAgaWYgKCFMQVlPVVRfVkFMVUVTLmZpbmQoeCA9PiB4ID09PSBkaXJlY3Rpb24pKSB7XG4gICAgZGlyZWN0aW9uID0gTEFZT1VUX1ZBTFVFU1swXTtcbiAgfVxuXG4gIGlmICh3cmFwID09PSBJTkxJTkUpIHtcbiAgICB3cmFwID0gKGlubGluZSAhPT0gSU5MSU5FKSA/IGlubGluZSA6ICcnO1xuICAgIGlubGluZSA9IElOTElORTtcbiAgfVxuXG4gIHJldHVybiBbZGlyZWN0aW9uLCB2YWxpZGF0ZVdyYXBWYWx1ZSh3cmFwKSwgISFpbmxpbmVdO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGUgdmFsaWRhdGVkLCBmbGV4LWRpcmVjdGlvbiB2YWx1ZSBzcGVjaWZpZXNcbiAqIGEgaG9yaXpvbnRhbC9yb3cgZmxvdy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRmxvd0hvcml6b250YWwodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBsZXQgW2Zsb3csIF0gPSB2YWxpZGF0ZVZhbHVlKHZhbHVlKTtcbiAgcmV0dXJuIGZsb3cuaW5kZXhPZigncm93JykgPiAtMTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGxheW91dC13cmFwPSc8dmFsdWU+JyB0byBleHBlY3RlZCBmbGV4LXdyYXAgc3R5bGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlV3JhcFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgaWYgKCEhdmFsdWUpIHtcbiAgICBzd2l0Y2ggKHZhbHVlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgJ3JldmVyc2UnOlxuICAgICAgY2FzZSAnd3JhcC1yZXZlcnNlJzpcbiAgICAgIGNhc2UgJ3JldmVyc2Utd3JhcCc6XG4gICAgICAgIHZhbHVlID0gJ3dyYXAtcmV2ZXJzZSc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdubyc6XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgIGNhc2UgJ25vd3JhcCc6XG4gICAgICAgIHZhbHVlID0gJ25vd3JhcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBBbGwgb3RoZXIgdmFsdWVzIGZhbGxiYWNrIHRvICd3cmFwJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsdWUgPSAnd3JhcCc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIENTUyB0aGF0IHNob3VsZCBiZSBhc3NpZ25lZCB0byB0aGUgZWxlbWVudCBpbnN0YW5jZVxuICogQlVHOlxuICogICAxKSBtaW4taGVpZ2h0IG9uIGEgY29sdW1uIGZsZXggY29udGFpbmVyIHdvbuKAmXQgYXBwbHkgdG8gaXRzIGZsZXggaXRlbSBjaGlsZHJlbiBpbiBJRSAxMC0xMS5cbiAqICAgICAgVXNlIGhlaWdodCBpbnN0ZWFkIGlmIHBvc3NpYmxlOyBoZWlnaHQgOiA8eHh4PnZoO1xuICpcbiAqICBUaGlzIHdheSBhbnkgcGFkZGluZyBvciBib3JkZXIgc3BlY2lmaWVkIG9uIHRoZSBjaGlsZCBlbGVtZW50cyBhcmVcbiAqICBsYWlkIG91dCBhbmQgZHJhd24gaW5zaWRlIHRoYXQgZWxlbWVudCdzIHNwZWNpZmllZCB3aWR0aCBhbmQgaGVpZ2h0LlxuICovXG5mdW5jdGlvbiBidWlsZENTUyhkaXJlY3Rpb246IHN0cmluZywgd3JhcDogc3RyaW5nIHwgbnVsbCA9IG51bGwsIGlubGluZSA9IGZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgJ2Rpc3BsYXknOiBpbmxpbmUgPyAnaW5saW5lLWZsZXgnIDogJ2ZsZXgnLFxuICAgICdib3gtc2l6aW5nJzogJ2JvcmRlci1ib3gnLFxuICAgICdmbGV4LWRpcmVjdGlvbic6IGRpcmVjdGlvbixcbiAgICAnZmxleC13cmFwJzogISF3cmFwID8gd3JhcCA6IG51bGxcbiAgfTtcbn1cbiJdfQ==