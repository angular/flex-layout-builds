/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BaseDirective, MediaMonitor, StyleBuilder, StyleDefinition, StyleUtils } from '@angular/flex-layout/core';
import { Observable, ReplaySubject } from 'rxjs';
export declare type Layout = {
    direction: string;
    wrap: boolean;
};
export interface LayoutParent {
    announcer: ReplaySubject<Layout>;
}
export declare class LayoutStyleBuilder extends StyleBuilder {
    buildStyles(input: string, _parent: LayoutParent): {
        'display': string;
        'box-sizing': string;
        'flex-direction': string;
        'flex-wrap': string | null;
    };
    sideEffect(_input: string, styles: StyleDefinition, parent: LayoutParent): void;
}
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export declare class LayoutDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * Create Observable for nested/child 'flex' directives. This allows
     * child flex directives to subscribe/listen for flexbox direction changes.
     */
    protected _announcer: ReplaySubject<Layout>;
    /**
     * Publish observer to enabled nested, dependent directives to listen
     * to parent 'layout' direction changes
     */
    layout$: Observable<Layout>;
    layout: string;
    layoutXs: string;
    layoutSm: string;
    layoutMd: string;
    layoutLg: string;
    layoutXl: string;
    layoutGtXs: string;
    layoutGtSm: string;
    layoutGtMd: string;
    layoutGtLg: string;
    layoutLtSm: string;
    layoutLtMd: string;
    layoutLtLg: string;
    layoutLtXl: string;
    constructor(monitor: MediaMonitor, elRef: ElementRef, styleUtils: StyleUtils, styleBuilder: LayoutStyleBuilder);
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    /** Validate the direction value and then update the host's inline flexbox styles */
    protected _updateWithDirection(value?: string): void;
    protected _styleCache: Map<string, StyleDefinition>;
}
