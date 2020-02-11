import { Tag, ValuePriority } from '../tag';
export declare class Hide extends Tag {
    readonly tag = "hide";
    readonly deps: string[];
    build(input: string, show: string): Map<string, ValuePriority>;
}
export declare class Show extends Tag {
    readonly tag = "show";
    build(): Map<string, ValuePriority>;
}
