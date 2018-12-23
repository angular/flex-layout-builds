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
    /** Is the MediaChange event for a 'print' @media */
    isPrintEvent(e: MediaChange): boolean;
    /** Is this service currently in Print-mode ? */
    readonly isPrinting: boolean;
    /** What is the desired mqAlias to use while printing? */
    readonly printAlias: string;
    /** Lookup breakpoint associated with print alias. */
    readonly printBreakPoint: OptionalBreakPoint;
    /**
     * Prepare RxJs filter operator with partial application
     * @return pipeable filter predicate
     */
    interceptEvents(target: HookTarget): (event: MediaChange) => boolean;
    updateEvent(event: MediaChange): MediaChange;
    /**
     * Save current activateBreakpoints (for later restore)
     * and substitute only the printAlias breakpoint
     */
    protected startPrinting(target: HookTarget, bp: OptionalBreakPoint): void;
    /** Remove the print breakpoint */
    protected stopPrinting(target: HookTarget): void;
}
