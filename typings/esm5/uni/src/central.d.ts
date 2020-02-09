import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { UnifiedDirective } from './unified';
import { Breakpoint } from './breakpoint';
import { Tag } from './tags/tag';
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
    constructor(directionality: Directionality, mediaMatcher: MediaMatcher, bps: Breakpoint[], tags: Map<string, Tag>);
    addDirective(dir: UnifiedDirective, bp: Breakpoint): void;
    updateDirective(dir: UnifiedDirective): void;
    removeDirectiveBp(dir: UnifiedDirective, bp: Breakpoint): void;
    removeDirective(dir: UnifiedDirective): void;
    private computeActivations;
    private computeStyles;
    private computeDirective;
    private addStyles;
    private calculateStyle;
    private resolve;
}
