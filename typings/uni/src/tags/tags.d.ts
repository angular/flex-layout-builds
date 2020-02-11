/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { Tag } from './tag';
/** All of the extended features that are not CSS standard */
export declare const CORE_TAGS: Tag[];
/** All of the standard CSS flexbox-related tags */
export declare const FLEX_TAGS: Tag[];
/** All of the standard CSS grid-related tags */
export declare const GRID_TAGS: Tag[];
/**
 * The default tags as provided by Angular Layout. These include both
 * flex and grid type tags.
*/
export declare const DEFAULT_TAGS: Tag[];
/**
 * The user-facing injection token for providing tags,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 */
export declare const LAYOUT_TAGS: InjectionToken<Tag[][]>;
/** An internal-facing provider for the default flex tags */
export declare const FLEX_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: Tag[];
    multi: boolean;
};
/** An internal-facing provider for the default grid tags */
export declare const GRID_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: Tag[];
    multi: boolean;
};
/** An internal-facing provider for the default tags */
export declare const TAGS_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: Tag[];
    multi: boolean;
};
/**
 * An internal-facing injection token to consolidate all registered
 * tags for use in the application.
 */
export declare const TAGS: InjectionToken<Map<string, Tag>>;
