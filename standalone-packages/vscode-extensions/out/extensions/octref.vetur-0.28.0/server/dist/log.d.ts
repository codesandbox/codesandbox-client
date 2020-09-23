declare const enum DEBUG_LEVEL {
    DEBUG = 0,
    INFO = 1
}
export declare const logger: {
    _level: DEBUG_LEVEL;
    setLevel(level: string): void;
    logDebug(msg: string): void;
    logInfo(msg: string): void;
};
export {};
