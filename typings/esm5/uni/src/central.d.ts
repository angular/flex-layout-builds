import { MediaMatcher } from '@angular/cdk/layout';
import { UnifiedDirective } from './unified';
import { Breakpoint } from './breakpoint';
import { Builder } from './builder';
export declare class GrandCentral {
    private readonly bps;
    private readonly tags;
    private mediaQueries;
    private activations;
    private activating;
    private elementsMap;
    private elementDataMap;
    constructor(mediaMatcher: MediaMatcher, bps: Breakpoint[], tags: Map<string, Builder>);
    addDirective(dir: UnifiedDirective, bp: Breakpoint): void;
    updateDirective(dir: UnifiedDirective): void;
    removeDirectiveBp(dir: UnifiedDirective, bp: Breakpoint): void;
    removeDirective(dir: UnifiedDirective): void;
    private computeActivations;
    private computeStyles;
    private computeDirective;
    private addStyles;
}
