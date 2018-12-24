import { MediaChange } from '../media-change';
import { BreakPoint } from '../breakpoints/break-point';
import { LayoutConfigOptions } from '../tokens/library-config';
import { BreakPointRegistry, OptionalBreakPoint } from '../breakpoints/break-point-registry';
/**
 * Interface to apply PrintHook to call anonymous `target.updateStyles()`
 */
export interface HookTarget {
    activatedBreakpoints: BreakPoint[];
    updateStyles(): void;
}
/**
 * PrintHook - Use to intercept print MediaQuery activations and force
 *             layouts to render with the specified print alias/breakpoint
 *
 * Used in MediaMarshaller and MediaObserver
 */
export declare class PrintHook {
    protected breakpoints: BreakPointRegistry;
    protected layoutConfig: LayoutConfigOptions;
    protected _isPrinting: boolean;
    constructor(breakpoints: BreakPointRegistry, layoutConfig: LayoutConfigOptions);
    /** Add 'print' mediaQuery: to listen for matchMedia activations */
    withPrintQuery(queries: string[]): string[];
    /** Is the MediaChange event for any 'print' @media */
    isPrintEvent(e: MediaChange): Boolean;
    /** Is this service currently in Print-mode ? */
    readonly isPrinting: boolean;
    /** What is the desired mqAlias to use while printing? */
    readonly printAlias: string[];
    /** Lookup breakpoints associated with print aliases. */
    readonly printBreakPoints: BreakPoint[];
    /** Lookup breakpoint associated with mediaQuery */
    getEventBreakpoints({ mediaQuery }: MediaChange): BreakPoint[];
    /**
     * Prepare RxJs filter operator with partial application
     * @return pipeable filter predicate
     */
    interceptEvents(target: HookTarget): (event: MediaChange) => boolean;
    /** Update event with printAlias mediaQuery information */
    updateEvent(event: MediaChange): MediaChange;
    /**
     * Save current activateBreakpoints (for later restore)
     * and substitute only the printAlias breakpoint
     */
    protected startPrinting(target: HookTarget, bpList: OptionalBreakPoint[]): void;
    /** For any print deactivations, reset the entire print queue */
    protected stopPrinting(target: HookTarget): void;
    private queue;
}
