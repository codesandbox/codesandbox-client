import { IModulePatcher } from "diagnostic-channel";
export interface IRedisData {
    duration: number;
    address: string;
    commandObj: any;
    err: Error;
    result: any;
}
export declare const redis: IModulePatcher;
export declare function enable(): void;
