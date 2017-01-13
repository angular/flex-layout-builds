import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { NgModule } from '@angular/core';
import { MediaMonitor } from '../media-query/media-monitor';
import { MediaQueriesModule } from '../media-query/_module';
import { FlexDirective } from './api/flex';
import { LayoutDirective } from './api/layout';
import { HideDirective } from './api/hide';
import { ShowDirective } from './api/show';
import { FlexAlignDirective } from './api/flex-align';
import { FlexFillDirective } from './api/flex-fill';
import { FlexOffsetDirective } from './api/flex-offset';
import { FlexOrderDirective } from './api/flex-order';
import { LayoutAlignDirective } from './api/layout-align';
import { LayoutWrapDirective } from './api/layout-wrap';
import { LayoutGapDirective } from './api/layout-gap';
/**
 * Since the equivalent results are easily achieved with a css class attached to each
 * layout child, these have been deprecated and removed from the API.
 *
 *  import {LayoutPaddingDirective} from './api/layout-padding';
 *  import {LayoutMarginDirective} from './api/layout-margin';
 */
var ALL_DIRECTIVES = [
    LayoutDirective,
    LayoutWrapDirective,
    LayoutGapDirective,
    LayoutAlignDirective,
    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexFillDirective,
    FlexAlignDirective,
    ShowDirective,
    HideDirective,
];
/**
 *
 */
export var FlexLayoutModule = (function () {
    function FlexLayoutModule() {
    }
    FlexLayoutModule.forRoot = function () {
        return { ngModule: FlexLayoutModule, providers: [MediaMonitor] };
    };
    FlexLayoutModule.decorators = [
        { type: NgModule, args: [{
                    declarations: ALL_DIRECTIVES,
                    imports: [MediaQueriesModule],
                    exports: [MediaQueriesModule].concat(ALL_DIRECTIVES),
                    providers: []
                },] },
    ];
    /** @nocollapse */
    FlexLayoutModule.ctorParameters = function () { return []; };
    return FlexLayoutModule;
}());
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/_module.js.map