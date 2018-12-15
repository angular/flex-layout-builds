import { Observable } from 'rxjs';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MatchMedia } from '../match-media/match-media';
import { MediaChange } from '../media-change';
declare type Builder = Function;
export interface ElementMatcher {
    element: HTMLElement;
    key: string;
    value: any;
}
/**
 * MediaMarshaller - register responsive values from directives and
 *                   trigger them based on media query events
 */
export declare class MediaMarshaller {
    protected matchMedia: MatchMedia;
    protected breakpoints: BreakPointRegistry;
    private activatedBreakpoints;
    private elementMap;
    private watcherMap;
    private builderMap;
    private subject;
    readonly activatedBreakpoint: string;
    constructor(matchMedia: MatchMedia, breakpoints: BreakPointRegistry);
    /**
     * activate or deactivate a given breakpoint
     * @param mc
     */
    activate(mc: MediaChange): void;
    /**
     * initialize the marshaller with necessary elements for delegation on an element
     * @param element
     * @param key
     * @param builder optional so that custom bp directives don't have to re-provide this
     * @param observables
     */
    init(element: HTMLElement, key: string, builder?: Builder, observables?: Observable<any>[]): void;
    /**
     * get the value for an element and key and optionally a given breakpoint
     * @param element
     * @param key
     * @param bp
     */
    getValue(element: HTMLElement, key: string, bp?: string): any;
    /**
     * whether the element has values for a given key
     * @param element
     * @param key
     */
    hasValue(element: HTMLElement, key: string): boolean;
    /**
     * Set the value for an input on a directive
     * @param element the element in question
     * @param key the type of the directive (e.g. flex, layout-gap, etc)
     * @param bp the breakpoint suffix (empty string = default)
     * @param val the value for the breakpoint
     */
    setValue(element: HTMLElement, key: string, val: any, bp: string): void;
    trackValue(element: HTMLElement, key: string): Observable<ElementMatcher>;
    /** update all styles for all elements on the current breakpoint */
    updateStyles(): void;
    /**
     * update a given element with the activated values for a given key
     * @param element
     * @param key
     * @param value
     */
    updateElement(element: HTMLElement, key: string, value: any): void;
    /**
     * release all references to a given element
     * @param element
     */
    releaseElement(element: HTMLElement): void;
    /** Breakpoint locator by mediaQuery */
    private findByQuery;
    /**
     * get the fallback breakpoint for a given element, starting with the current breakpoint
     * @param bpMap
     * @param key
     */
    private getFallbackForKey;
    private registerBreakpoints;
}
export {};
