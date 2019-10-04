import TelemetryClient = require("../Library/TelemetryClient");
declare class AutoCollectConsole {
    static originalMethods: {
        [name: string]: (message?: any, ...optionalParams: any[]) => void;
    };
    static INSTANCE: AutoCollectConsole;
    private static _methodNames;
    private _client;
    private _isInitialized;
    constructor(client: TelemetryClient);
    enable(isEnabled: boolean, collectConsoleLog: boolean): void;
    isInitialized(): boolean;
    dispose(): void;
}
export = AutoCollectConsole;
