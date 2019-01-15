import { MatchMedia } from '../match-media/match-media';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
/**
 * Class
 */
export declare class MediaTrigger {
    protected breakpoints: BreakPointRegistry;
    protected matchMedia: MatchMedia;
    protected _platformId: Object;
    protected _document: any;
    constructor(breakpoints: BreakPointRegistry, matchMedia: MatchMedia, _platformId: Object, _document: any);
    /**
     * Manually activate range of breakpoints
     * @param list array of mediaQuery or alias strings
     */
    activate(list: string[]): void;
    /**
     * Restore original, 'real' breakpoints and emit events
     * to trigger stream notification
     */
    restore(): void;
    /**
     * Whenever window resizes, immediately auto-restore original
     * activations (if we are simulating activations)
     */
    private prepareAutoRestore;
    /**
     * Notify all matchMedia subscribers of de-activations
     *
     * Note: we must force 'matches' updates for
     *       future matchMedia::activation lookups
     */
    private deactivateAll;
    /**
     * Cache current activations as sorted, prioritized list of MediaChanges
     */
    private saveActivations;
    /**
     * Force set manual activations for specified mediaQuery list
     */
    private setActivations;
    /**
     * For specified mediaQuery list manually simulate activations or deactivations
     */
    private simulateMediaChanges;
    /**
     * Replace current registry with simulated registry...
     * Note: this is required since MediaQueryList::matches is 'readOnly'
     */
    forceRegistryMatches(queries: string[], match: boolean): void;
    /**
     * Restore original, 'true' registry
     */
    restoreRegistryMatches(): void;
    /**
     * Manually emit a MediaChange event via the MatchMedia to MediaMarshaller and MediaObserver
     */
    emitChangeEvent(matches: boolean, query: string): void;
    private readonly currentActivations;
    private hasCachedOriginals;
    private originalActivations;
    private originalRegistry;
    private resizeSubscription;
}
