/// <reference types="node" />
import http = require("http");
import TelemetryClient = require("../Library/TelemetryClient");
declare class AutoCollectPerformance {
    static INSTANCE: AutoCollectPerformance;
    private static _totalRequestCount;
    private static _totalFailedRequestCount;
    private static _lastRequestExecutionTime;
    private _client;
    private _handle;
    private _isEnabled;
    private _isInitialized;
    private _lastAppCpuUsage;
    private _lastHrtime;
    private _lastCpus;
    private _lastRequests;
    constructor(client: TelemetryClient);
    enable(isEnabled: boolean): void;
    static countRequest(request: http.ServerRequest, response: http.ServerResponse): void;
    isInitialized(): boolean;
    static isEnabled(): boolean;
    trackPerformance(): void;
    private _trackCpu();
    private _trackMemory();
    private _trackNetwork();
    dispose(): void;
}
export = AutoCollectPerformance;
