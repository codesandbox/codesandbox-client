export interface ILocation {
    readonly filename: string;
    readonly line: number;
    readonly char: number;
}
export declare function parse(source: string, filename: string, withMetadata: boolean): any;
