import { IModulePatcher } from "diagnostic-channel";
export interface IConsoleData {
    message: string;
    stderr?: boolean;
}
export declare const console: IModulePatcher;
export declare function enable(): void;
