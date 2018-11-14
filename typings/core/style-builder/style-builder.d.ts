import { StyleDefinition } from '../style-utils/style-utils';
export declare abstract class StyleBuilder {
    abstract buildStyles(input: string, parent?: Object): StyleDefinition;
}
