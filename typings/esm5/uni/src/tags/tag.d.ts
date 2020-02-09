/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface ValuePriority {
    value: string;
    priority: number;
}
export declare abstract class Tag {
    private cache;
    abstract readonly tag: string;
    readonly deps: string[];
    abstract build(input?: string, ...args: string[]): Map<string, ValuePriority>;
    protected setCache(input: string, value: Map<string, ValuePriority>): void;
    protected getCache(input: string): Map<string, ValuePriority> | undefined;
}
