import { IModulePatcher } from "diagnostic-channel";
export interface IBunyanData {
    level: number;
    result: string;
}
export declare const bunyan: IModulePatcher;
export declare function enable(): void;
