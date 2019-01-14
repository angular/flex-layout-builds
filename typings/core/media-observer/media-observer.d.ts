import { Observable } from 'rxjs';
import { MediaChange } from '../media-change';
import { MatchMedia } from '../match-media/match-media';
import { PrintHook } from '../media-marshaller/print-hook';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
/**
 * Class internalizes a MatchMedia service and exposes an Observable interface.

 * This exposes an Observable with a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the MediaObserver
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * !! This is not an actual Observable. It is a wrapper of an Observable used to publish additional
 * methods like `isActive(<alias>). To access the Observable and use RxJS operators, use
 * `.media$` with syntax like mediaObserver.asObservable().map(....).
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(media: MediaObserver) {
 *      const onChange = (change: MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g. media.asObservable().subscribe(onChange);
 *
 *      media.asObservable()
 *        .pipe(
 *          filter((change: MediaChange) => true)   // silly noop filter
 *        ).subscribe(onChange);
 *    }
 *  }
 */
export declare class MediaObserver {
    protected breakpoints: BreakPointRegistry;
    protected matchMedia: MatchMedia;
    protected hook: PrintHook;
    /** Filter MediaChange notifications for overlapping breakpoints */
    filterOverlaps: boolean;
    constructor(breakpoints: BreakPointRegistry, matchMedia: MatchMedia, hook: PrintHook);
    /**
     * Observe changes to current activation 'list'
     */
    asObservable(): Observable<MediaChange[]>;
    /**
     * Allow programmatic query to determine if specified query/alias is active.
     */
    isActive(alias: string): boolean;
    /**
     * Subscribers to activation list can use this function to easily exclude overlaps
     */
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    private watchActivations;
    /**
     * Only pass/announce activations (not de-activations)
     *
     * Since multiple-mediaQueries can be activation in a cycle,
     * gather all current activations into a single list of changes to observers
     *
     * Inject associated (if any) alias information into the MediaChange event
     * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     * - Exclude print activations that do not have an associated mediaQuery
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    private buildObservable;
    /**
     * Find all current activations and prepare single list of activations
     * sorted by descending priority.
     */
    private findAllActivations;
    private _media$;
}
/** HOF to sort the breakpoints by priority */
export declare function sortChangesByPriority(a: MediaChange, b: MediaChange): number;
