/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { BreakPoint, MatchMedia, ServerStylesheet, ServerMatchMedia } from '@angular/flex-layout';
/**
 * Activate all of the registered breakpoints in sequence, and then
 * retrieve the associated stylings from the virtual stylesheet
 * @param serverSheet the virtual stylesheet that stores styles for each
 *        element
 * @param matchMedia the service to activate/deactive breakpoints
 * @param breakpoints the registered breakpoints to activate/deactivate
 */
export declare function generateStaticFlexLayoutStyles(serverSheet: ServerStylesheet, matchMedia: MatchMedia, breakpoints: BreakPoint[]): string;
/**
 * Create a style tag populated with the dynamic stylings from Flex
 * components and attach it to the head of the DOM
 */
export declare function FLEX_SSR_SERIALIZER_FACTORY(serverSheet: ServerStylesheet, matchMedia: MatchMedia, _document: Document, breakpoints: BreakPoint[]): () => void;
/**
 *  Provider to set static styles on the server
 */
export declare const SERVER_PROVIDERS: ({
    provide: InjectionToken<() => void>;
    useFactory: (serverSheet: ServerStylesheet, matchMedia: MatchMedia, _document: Document, breakpoints: BreakPoint[]) => () => void;
    deps: (typeof ServerStylesheet | typeof MatchMedia | InjectionToken<Document>)[];
    multi: boolean;
} | {
    provide: InjectionToken<boolean>;
    useValue: boolean;
} | {
    provide: typeof MatchMedia;
    useClass: typeof ServerMatchMedia;
})[];
export declare type StyleSheet = Map<HTMLElement, Map<string, string | number>>;
export declare type ClassMap = Map<HTMLElement, string>;