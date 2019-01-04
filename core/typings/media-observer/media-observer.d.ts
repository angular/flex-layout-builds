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
    protected mediaWatcher: MatchMedia;
    protected hook: PrintHook;
    /**
     * Whether to announce gt-<xxx> breakpoint activations
     */
    filterOverlaps: boolean;
    /**
     * @deprecated Use `asObservable()` instead.
     * @deletion-target v7.0.0-beta.23
     * @breaking-change 7.0.0-beta.23
     */
    readonly media$: Observable<MediaChange>;
    constructor(breakpoints: BreakPointRegistry, mediaWatcher: MatchMedia, hook: PrintHook);
    asObservable(): Observable<MediaChange>;
    /**
     * Test if specified query/alias is active.
     */
    isActive(alias: string): boolean;
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    private watchActivations;
    /**
     * Prepare internal observable
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    private buildObservable;
    /**
     * Find associated breakpoint (if any)
     */
    private toMediaQuery;
    readonly _media$: Observable<MediaChange>;
}
