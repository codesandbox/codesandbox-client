declare class Logging {
    static enableDebug: boolean;
    static disableWarnings: boolean;
    private static TAG;
    static info(message?: any, ...optionalParams: any[]): void;
    static warn(message?: any, ...optionalParams: any[]): void;
}
export = Logging;
