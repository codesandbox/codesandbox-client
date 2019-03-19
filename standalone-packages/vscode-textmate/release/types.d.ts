export interface ILocation {
    readonly filename: string;
    readonly line: number;
    readonly char: number;
}
export interface ILocatable {
    readonly $vscodeTextmateLocation?: ILocation;
}
export interface IRawGrammar extends ILocatable {
    repository: IRawRepository;
    readonly scopeName: string;
    readonly patterns: IRawRule[];
    readonly injections?: {
        [expression: string]: IRawRule;
    };
    readonly injectionSelector?: string;
    readonly fileTypes?: string[];
    readonly name?: string;
    readonly firstLineMatch?: string;
}
export interface IRawRepositoryMap {
    [name: string]: IRawRule;
    $self: IRawRule;
    $base: IRawRule;
}
export declare type IRawRepository = IRawRepositoryMap & ILocatable;
export interface IRawRule extends ILocatable {
    id?: number;
    readonly include?: string;
    readonly name?: string;
    readonly contentName?: string;
    readonly match?: string;
    readonly captures?: IRawCaptures;
    readonly begin?: string;
    readonly beginCaptures?: IRawCaptures;
    readonly end?: string;
    readonly endCaptures?: IRawCaptures;
    readonly while?: string;
    readonly whileCaptures?: IRawCaptures;
    readonly patterns?: IRawRule[];
    readonly repository?: IRawRepository;
    readonly applyEndPatternLast?: boolean;
}
export interface IRawCapturesMap {
    [captureId: string]: IRawRule;
}
export declare type IRawCaptures = IRawCapturesMap & ILocatable;
export interface IOnigLib {
    createOnigScanner(sources: string[]): OnigScanner;
    createOnigString(sources: string): OnigString;
}
export interface IOnigCaptureIndex {
    start: number;
    end: number;
    length: number;
}
export interface IOnigMatch {
    index: number;
    captureIndices: IOnigCaptureIndex[];
    scanner: OnigScanner;
}
export interface OnigScanner {
    findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch;
}
export interface OnigString {
    readonly content: string;
    readonly dispose?: () => void;
}
