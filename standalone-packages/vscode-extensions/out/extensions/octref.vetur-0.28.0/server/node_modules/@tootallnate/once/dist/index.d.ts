/// <reference types="node" />
import { EventEmitter } from 'events';
declare function once<T>(emitter: EventEmitter, name: string): once.CancellablePromise<T>;
declare namespace once {
    interface CancelFunction {
        (): void;
    }
    interface CancellablePromise<T> extends Promise<T> {
        cancel: CancelFunction;
    }
}
export = once;
