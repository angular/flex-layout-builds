/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaChange {
    /**
     * @param matches whether the mediaQuery is currently activated
     * @param mediaQuery e.g. (min-width: 600px) and (max-width: 959px)
     * @param mqAlias e.g. gt-sm, md, gt-lg
     * @param suffix e.g. GtSM, Md, GtLg
     * @param priority the priority of activation for the given breakpoint
     */
    constructor(matches = false, mediaQuery = 'all', mqAlias = '', suffix = '', priority = 0) {
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
        this.priority = priority;
        this.property = '';
    }
    /** Create an exact copy of the MediaChange */
    clone() {
        return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
    }
}
//# sourceMappingURL=media-change.js.map