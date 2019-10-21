import { IModulePatcher } from "./patchRequire";
export { PatchFunction, IModulePatcher, makePatchingRequire } from "./patchRequire";
export interface IStandardEvent<T> {
    timestamp: number;
    data: T;
}
export declare type ISubscriber<T> = (event: IStandardEvent<T>) => void;
export declare type IFilter = (publishing: boolean) => boolean;
export interface IChannel {
    shouldPublish(name: string): boolean;
    publish<T>(name: string, event: T): void;
    subscribe<T>(name: string, listener: ISubscriber<T>, filter?: IFilter): void;
    unsubscribe<T>(name: string, listener: ISubscriber<T>, filter?: IFilter): void;
    bindToContext<T extends Function>(cb: T): T;
    addContextPreservation<T extends Function>(preserver: (cb: T) => T): void;
    registerMonkeyPatch(packageName: string, patcher: IModulePatcher): void;
}
export declare const channel: IChannel;
