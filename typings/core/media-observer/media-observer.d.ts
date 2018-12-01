import { Observable } from 'rxjs';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MediaChange } from '../media-change';
import { MatchMedia } from '../match-media/match-media';
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
 * `.media$` with syntax like mediaObserver.media$.map(....).
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
 *    constructor(mediaObserver: MediaObserver) {
 *      const onChange = (change: MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g. mediaObserver.media$.subscribe(onChange);
 *
 *      mediaObserver.media$()
 *        .pipe(
 *          filter((change: MediaChange) => true)   // silly noop filter
 *        ).subscribe(onChange);
 *    }
 *  }
 */
export declare class MediaObserver {
    private breakpoints;
    private mediaWatcher;
    /**
     * Whether to announce gt-<xxx> breakpoint activations
     */
    filterOverlaps: boolean;
    readonly media$: Observable<MediaChange>;
    constructor(breakpoints: BreakPointRegistry, mediaWatcher: MatchMedia);
    /**
     * Test if specified query/alias is active.
     */
    isActive(alias: string): boolean;
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    private _registerBreakPoints;
    /**
     * Prepare internal observable
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    private _buildObservable;
    /**
     * Breakpoint locator by alias
     */
    private _findByAlias;
    /**
     * Breakpoint locator by mediaQuery
     */
    private _findByQuery;
    /**
     * Find associated breakpoint (if any)
     */
    private _toMediaQuery;
}
