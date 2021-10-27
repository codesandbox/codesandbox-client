import Contracts = require("../Declarations/Contracts");
import Sender = require("./Sender");
declare class Channel {
    protected _lastSend: number;
    protected _timeoutHandle: any;
    protected _isDisabled: () => boolean;
    protected _getBatchSize: () => number;
    protected _getBatchIntervalMs: () => number;
    _sender: Sender;
    _buffer: string[];
    constructor(isDisabled: () => boolean, getBatchSize: () => number, getBatchIntervalMs: () => number, sender: Sender);
    /**
     * Enable or disable disk-backed retry caching to cache events when client is offline (enabled by default)
     * These cached events are stored in your system or user's temporary directory and access restricted to your user when possible.
     * @param value if true events that occured while client is offline will be cached on disk
     * @param resendInterval The wait interval for resending cached events.
     * @param maxBytesOnDisk The maximum size (in bytes) that the created temporary directory for cache events can grow to, before caching is disabled.
     * @returns {Configuration} this class
     */
    setUseDiskRetryCaching(value: boolean, resendInterval?: number, maxBytesOnDisk?: number): void;
    /**
     * Add a telemetry item to the send buffer
     */
    send(envelope: Contracts.Envelope): void;
    /**
     * Immediately send buffered data
     */
    triggerSend(isNodeCrashing: boolean, callback?: (v: string) => void): void;
    private _stringify(envelope);
}
export = Channel;
