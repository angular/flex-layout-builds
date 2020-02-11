/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A bundle used for comparing conflicting CSS styles
 * generated by multiple tags.
 */
export interface ValuePriority {
    /** The value of a corresponding CSS style */
    value: string;
    /**
     * The priority of the associated value compared to
     * other comparable values
     */
    priority: number;
}
/**
 * A tag is a way of consolidating logic about a style pattern. For instance,
 * setting the 'flex' attribute could be done with a Flex Tag. Each tag has an
 * associated name, builder, cache, and dependencies on other builder input
 * values.
 */
export declare abstract class Tag {
    private cache;
    /** The name of the tag, e.g. 'flex' */
    abstract readonly tag: string;
    /**
     * The deps required to build this pattern. This can be from the
     * directive the tag is on, its parent, or other outside dependencies
     * like Directionality.
     */
    readonly deps: string[];
    compute(input: string, ...args: string[]): Map<string, ValuePriority>;
    /**
     * The builder for this tag, outputting a map of computed styles.
     * @param input the value for the tag, e.g. flex="50" the input is "50"
     * @param args the resolved dependencies for this tag
     */
    protected abstract build(input: string, ...args: string[]): Map<string, ValuePriority>;
    private setCache;
    private getCache;
}
