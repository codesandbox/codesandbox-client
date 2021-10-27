import Config = require("./Config");
import Context = require("./Context");
import Contracts = require("../Declarations/Contracts");
import Channel = require("./Channel");
import FlushOptions = require("./FlushOptions");
/**
 * Application Insights telemetry client provides interface to track telemetry items, register telemetry initializers and
 * and manually trigger immediate sending (flushing)
 */
declare class TelemetryClient {
    private _telemetryProcessors;
    config: Config;
    context: Context;
    commonProperties: {
        [key: string]: string;
    };
    channel: Channel;
    /**
     * Constructs a new client of the client
     * @param iKey the instrumentation key to use (read from environment variable if not specified)
     */
    constructor(iKey?: string);
    /**
     * Log a trace message
     * @param telemetry      Object encapsulating tracking options
     */
    trackTrace(telemetry: Contracts.TraceTelemetry): void;
    /**
     * Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators.
     * To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the
     * telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.
     * @param telemetry      Object encapsulating tracking options
     */
    trackMetric(telemetry: Contracts.MetricTelemetry): void;
    /**
     * Log an exception
     * @param telemetry      Object encapsulating tracking options
     */
    trackException(telemetry: Contracts.ExceptionTelemetry): void;
    /**
     * Log a user action or other occurrence.
     * @param telemetry      Object encapsulating tracking options
     */
    trackEvent(telemetry: Contracts.EventTelemetry): void;
    /**
     * Log a request. Note that the default client will attempt to collect HTTP requests automatically so only use this for requests
     * that aren't automatically captured or if you've disabled automatic request collection.
     *
     * @param telemetry      Object encapsulating tracking options
     */
    trackRequest(telemetry: Contracts.RequestTelemetry): void;
    /**
     * Log a dependency. Note that the default client will attempt to collect dependencies automatically so only use this for dependencies
     * that aren't automatically captured or if you've disabled automatic dependency collection.
     *
     * @param telemetry      Object encapsulating tracking option
     * */
    trackDependency(telemetry: Contracts.DependencyTelemetry): void;
    /**
     * Immediately send all queued telemetry.
     * @param options Flush options, including indicator whether app is crashing and callback
     */
    flush(options?: FlushOptions): void;
    /**
     * Generic track method for all telemetry types
     * @param data the telemetry to send
     * @param telemetryType specify the type of telemetry you are tracking from the list of Contracts.DataTypes
     */
    track(telemetry: Contracts.Telemetry, telemetryType: Contracts.TelemetryType): void;
    /**
     * Adds telemetry processor to the collection. Telemetry processors will be called one by one
     * before telemetry item is pushed for sending and in the order they were added.
     *
     * @param telemetryProcessor function, takes Envelope, and optional context object and returns boolean
     */
    addTelemetryProcessor(telemetryProcessor: (envelope: Contracts.Envelope, contextObjects?: {
        [name: string]: any;
    }) => boolean): void;
    clearTelemetryProcessors(): void;
    private runTelemetryProcessors(envelope, contextObjects);
}
export = TelemetryClient;
