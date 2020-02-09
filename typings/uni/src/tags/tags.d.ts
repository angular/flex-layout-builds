/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { Tag } from './tag';
import { FlexAlign } from './flex/flex-align';
import { FlexFill } from './flex/flex-fill';
import { FlexOrder } from './flex/flex-order';
import { FlexOffset } from './flex/flex-offset';
import { LayoutAlign } from './flex/layout-align';
export declare const FLEX_TAGS: (typeof FlexAlign | typeof FlexFill | typeof FlexOrder | typeof FlexOffset | typeof LayoutAlign)[];
export declare const GRID_TAGS: never[];
export declare const DEFAULT_TAGS: (typeof FlexAlign | typeof FlexFill | typeof FlexOrder | typeof FlexOffset | typeof LayoutAlign)[];
export declare const LAYOUT_TAGS: InjectionToken<Tag[][]>;
export declare const FLEX_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: (typeof FlexAlign | typeof FlexFill | typeof FlexOrder | typeof FlexOffset | typeof LayoutAlign)[];
    multi: boolean;
};
export declare const GRID_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: never[];
    multi: boolean;
};
export declare const TAGS_PROVIDER: {
    provide: InjectionToken<Tag[][]>;
    useValue: (typeof FlexAlign | typeof FlexFill | typeof FlexOrder | typeof FlexOffset | typeof LayoutAlign)[];
    multi: boolean;
};
export declare const TAGS: InjectionToken<Map<string, Tag>>;
