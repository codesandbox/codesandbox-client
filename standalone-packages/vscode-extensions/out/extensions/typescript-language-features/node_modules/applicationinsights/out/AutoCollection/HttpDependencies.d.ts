import Contracts = require("../Declarations/Contracts");
import TelemetryClient = require("../Library/TelemetryClient");
declare class AutoCollectHttpDependencies {
    static disableCollectionRequestOption: string;
    static INSTANCE: AutoCollectHttpDependencies;
    private static requestNumber;
    private static alreadyAutoCollectedFlag;
    private _client;
    private _isEnabled;
    private _isInitialized;
    constructor(client: TelemetryClient);
    enable(isEnabled: boolean): void;
    isInitialized(): boolean;
    private _initialize();
    /**
     * Tracks an outgoing request. Because it may set headers this method must be called before
     * writing content to or ending the request.
     */
    static trackRequest(client: TelemetryClient, telemetry: Contracts.NodeHttpDependencyTelemetry): void;
    dispose(): void;
}
export = AutoCollectHttpDependencies;
