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
export declare class PrintHookService {
    protected layoutConfig: LayoutConfigOptions;
    protected breakpoints: BreakPointRegistry;
    protected offlineActivations: BreakPoint[] | null;
    constructor(layoutConfig: LayoutConfigOptions, breakpoints: BreakPointRegistry);
    /**
     * Add 'print' mediaQuery: to listen for matchMedia activations
     */
    addPrintListener(queries: string[]): string[];
    /**
     * Is this service currently in Print-mode ?
     */
    readonly isPrinting: boolean;
    /**
     * What is the desired mqAlias to use while printing?
     */
    readonly printAlias: string;
    /**
     * Lookup breakpoint associated with print alias.
     */
    readonly printBreakPoint: OptionalBreakPoint;
    /**
     * Prepare RxJs filter operator with partial application
     * @return pipeable filter predicate
     */
    interceptEvents(target: HookTarget): (change: MediaChange) => boolean;
    /**
     * Save current activateBreakpoints (for later restore)
     * and substitute only the printAlias breakpoint
     */
    protected enablePrintMode(target: HookTarget, bp: OptionalBreakPoint): void;
    /**
     * Restore cached activatedBreakpoints and clear isPrinting
     * state
     */
    protected disablePrintMode(target: HookTarget): void;
}
