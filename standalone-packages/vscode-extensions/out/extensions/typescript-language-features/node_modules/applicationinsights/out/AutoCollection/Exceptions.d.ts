import TelemetryClient = require("../Library/TelemetryClient");
declare class AutoCollectExceptions {
    static INSTANCE: AutoCollectExceptions;
    static readonly UNCAUGHT_EXCEPTION_HANDLER_NAME: string;
    static readonly UNHANDLED_REJECTION_HANDLER_NAME: string;
    private _exceptionListenerHandle;
    private _rejectionListenerHandle;
    private _client;
    private _isInitialized;
    constructor(client: TelemetryClient);
    isInitialized(): boolean;
    enable(isEnabled: boolean): void;
    dispose(): void;
}
export = AutoCollectExceptions;
