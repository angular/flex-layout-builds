/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { GrandCentral } from './central';
import { Breakpoint } from './breakpoint';
import { Tag, ValuePriority } from './tags/tag';
/**
 * This is a simplistic, wrapping directive meant only to
 * capture and record values for individual breakpoints.
 */
export declare class BreakpointDirective {
    name: string;
    readonly element: HTMLElement;
    constructor(elementRef: ElementRef<HTMLElement>);
}
/**
 * One directive to rule them all. This directive is responsible for
 * tagging an HTML element as part of the layout system, and then
 * coordinating all updates with GrandCentral.
 */
export declare class UnifiedDirective implements AfterContentInit, OnDestroy {
    readonly parent: UnifiedDirective;
    private readonly breakpoints;
    private readonly tags;
    private readonly grandCentral;
    readonly element: HTMLElement;
    readonly valueMap: Map<string, Map<string, string>>;
    bpElements: QueryList<BreakpointDirective>;
    private readonly rootObserver;
    private readonly observerMap;
    private readonly tagNames;
    private readonly fallbackStyles;
    constructor(parent: UnifiedDirective, elementRef: ElementRef<HTMLElement>, breakpoints: Breakpoint[], tags: Map<string, Tag>, grandCentral: GrandCentral);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Apply the given styles to the underlying HTMLElement */
    applyStyles(styles: Map<string, ValuePriority>): void;
    /** Process a MutationObserver's attribute-type mutation */
    private processAttributeMutation;
}
