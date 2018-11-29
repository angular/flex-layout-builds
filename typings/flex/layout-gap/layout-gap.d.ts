/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, SimpleChanges, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { BaseDirective, MediaMonitor, StyleBuilder, StyleDefinition, StyleUtils } from '@angular/flex-layout/core';
import { Subscription } from 'rxjs';
import { Layout, LayoutDirective } from '../layout/layout';
export interface LayoutGapParent {
    directionality: string;
    items: HTMLElement[];
    layout: string;
}
export declare class LayoutGapStyleBuilder extends StyleBuilder {
    private _styler;
    constructor(_styler: StyleUtils);
    buildStyles(gapValue: string, parent: LayoutGapParent): StyleDefinition;
    sideEffect(gapValue: string, _styles: StyleDefinition, parent: LayoutGapParent): void;
}
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export declare class LayoutGapDirective extends BaseDirective implements AfterContentInit, OnChanges, OnDestroy {
    protected monitor: MediaMonitor;
    protected elRef: ElementRef;
    protected container: LayoutDirective;
    protected _zone: NgZone;
    protected _directionality: Directionality;
    protected styleUtils: StyleUtils;
    protected styleBuilder: LayoutGapStyleBuilder;
    protected _layout: string;
    protected _layoutWatcher?: Subscription;
    protected _observer?: MutationObserver;
    private readonly _directionWatcher;
    gap: string;
    gapXs: string;
    gapSm: string;
    gapMd: string;
    gapLg: string;
    gapXl: string;
    gapGtXs: string;
    gapGtSm: string;
    gapGtMd: string;
    gapGtLg: string;
    gapLtSm: string;
    gapLtMd: string;
    gapLtLg: string;
    gapLtXl: string;
    constructor(monitor: MediaMonitor, elRef: ElementRef, container: LayoutDirective, _zone: NgZone, _directionality: Directionality, styleUtils: StyleUtils, styleBuilder: LayoutGapStyleBuilder);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Watch for child nodes to be added... and apply the layout gap styles to each.
     * NOTE: this does NOT! differentiate between viewChildren and contentChildren
     */
    protected _watchContentChanges(): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     */
    protected _onLayoutChange(layout: Layout): void;
    /**
     *
     */
    protected _updateWithValue(value?: string): void;
}
