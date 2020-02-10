import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { UnifiedDirective } from './unified';
import { Breakpoint } from './breakpoint';
import { Tag } from './tags/tag';
/**
 * GrandCentral is a switchyard for all of the various Layout directives
 * registered in an application. It is the single source of truth for all of
 * the layout changes that occur in an application. For instance, any changes
 * to the browser state via registered media queries are monitored and updated
 * in this service. The directives themselves simply store their respective values
 * for each of the media states.
 */
export declare class GrandCentral {
    private readonly directionality;
    private readonly bps;
    private readonly tags;
    private mediaQueries;
    private activations;
    private activating;
    private elementsMap;
    private elementDataMap;
    private dirListeners;
    private elListeners;
    constructor(directionality: Directionality, mediaMatcher: MediaMatcher, bps: Breakpoint[], tags: Map<string, Tag>);
    /** Add a directive for a corresponding breakpoint */
    addDirective(dir: UnifiedDirective, bp: Breakpoint): void;
    /** Trigger an update for a directive */
    updateDirective(dir: UnifiedDirective): void;
    /** Remove a directive from all future updates */
    removeDirective(dir: UnifiedDirective): void;
    /** Compute the active breakpoints and sort by descending priority */
    private computeActivations;
    /** Compute the styles and update the directives for all active breakpoints */
    private computeStyles;
    /** Compute the styles for an individual directive */
    private computeDirective;
    /** Add the computed styles for an individual directive */
    private addStyles;
    /** Compute the CSS styles for a directive given a tag and value */
    private calculateStyle;
    /** Resolve the arguments for a builder given a directive */
    private resolve;
}
