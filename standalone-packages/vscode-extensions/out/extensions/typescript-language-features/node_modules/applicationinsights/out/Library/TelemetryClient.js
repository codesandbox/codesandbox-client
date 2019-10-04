"use strict";
var url = require("url");
var Config = require("./Config");
var Context = require("./Context");
var Contracts = require("../Declarations/Contracts");
var Channel = require("./Channel");
var TelemetryProcessors = require("../TelemetryProcessors");
var CorrelationContextManager_1 = require("../AutoCollection/CorrelationContextManager");
var Sender = require("./Sender");
var Util = require("./Util");
var Logging = require("./Logging");
var EnvelopeFactory = require("./EnvelopeFactory");
/**
 * Application Insights telemetry client provides interface to track telemetry items, register telemetry initializers and
 * and manually trigger immediate sending (flushing)
 */
var TelemetryClient = (function () {
    /**
     * Constructs a new client of the client
     * @param iKey the instrumentation key to use (read from environment variable if not specified)
     */
    function TelemetryClient(iKey) {
        this._telemetryProcessors = [];
        var config = new Config(iKey);
        this.config = config;
        this.context = new Context();
        this.commonProperties = {};
        var sender = new Sender(this.config);
        this.channel = new Channel(function () { return config.disableAppInsights; }, function () { return config.maxBatchSize; }, function () { return config.maxBatchIntervalMs; }, sender);
    }
    /**
     * Log a trace message
     * @param telemetry      Object encapsulating tracking options
     */
    TelemetryClient.prototype.trackTrace = function (telemetry) {
        this.track(telemetry, Contracts.TelemetryType.Trace);
    };
    /**
     * Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators.
     * To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the
     * telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.
     * @param telemetry      Object encapsulating tracking options
     */
    TelemetryClient.prototype.trackMetric = function (telemetry) {
        this.track(telemetry, Contracts.TelemetryType.Metric);
    };
    /**
     * Log an exception
     * @param telemetry      Object encapsulating tracking options
     */
    TelemetryClient.prototype.trackException = function (telemetry) {
        if (telemetry && telemetry.exception && !Util.isError(telemetry.exception)) {
            telemetry.exception = new Error(telemetry.exception.toString());
        }
        this.track(telemetry, Contracts.TelemetryType.Exception);
    };
    /**
     * Log a user action or other occurrence.
     * @param telemetry      Object encapsulating tracking options
     */
    TelemetryClient.prototype.trackEvent = function (telemetry) {
        this.track(telemetry, Contracts.TelemetryType.Event);
    };
    /**
     * Log a request. Note that the default client will attempt to collect HTTP requests automatically so only use this for requests
     * that aren't automatically captured or if you've disabled automatic request collection.
     *
     * @param telemetry      Object encapsulating tracking options
     */
    TelemetryClient.prototype.trackRequest = function (telemetry) {
        this.track(telemetry, Contracts.TelemetryType.Request);
    };
    /**
     * Log a dependency. Note that the default client will attempt to collect dependencies automatically so only use this for dependencies
     * that aren't automatically captured or if you've disabled automatic dependency collection.
     *
     * @param telemetry      Object encapsulating tracking option
     * */
    TelemetryClient.prototype.trackDependency = function (telemetry) {
        if (telemetry && !telemetry.target && telemetry.data) {
            // url.parse().host returns null for non-urls,
            // making this essentially a no-op in those cases
            // If this logic is moved, update jsdoc in DependencyTelemetry.target
            telemetry.target = url.parse(telemetry.data).host;
        }
        this.track(telemetry, Contracts.TelemetryType.Dependency);
    };
    /**
     * Immediately send all queued telemetry.
     * @param options Flush options, including indicator whether app is crashing and callback
     */
    TelemetryClient.prototype.flush = function (options) {
        this.channel.triggerSend(options ? !!options.isAppCrashing : false, options ? options.callback : undefined);
    };
    /**
     * Generic track method for all telemetry types
     * @param data the telemetry to send
     * @param telemetryType specify the type of telemetry you are tracking from the list of Contracts.DataTypes
     */
    TelemetryClient.prototype.track = function (telemetry, telemetryType) {
        if (telemetry && Contracts.telemetryTypeToBaseType(telemetryType)) {
            var envelope = EnvelopeFactory.createEnvelope(telemetry, telemetryType, this.commonProperties, this.context, this.config);
            // Set time on the envelope if it was set on the telemetry item
            if (telemetry.time) {
                envelope.time = telemetry.time.toISOString();
            }
            var accepted = this.runTelemetryProcessors(envelope, telemetry.contextObjects);
            // Ideally we would have a central place for "internal" telemetry processors and users can configure which ones are in use.
            // This will do for now. Otherwise clearTelemetryProcessors() would be problematic.
            accepted = accepted && TelemetryProcessors.samplingTelemetryProcessor(envelope, { correlationContext: CorrelationContextManager_1.CorrelationContextManager.getCurrentContext() });
            if (accepted) {
                this.channel.send(envelope);
            }
        }
        else {
            Logging.warn("track() requires telemetry object and telemetryType to be specified.");
        }
    };
    /**
     * Adds telemetry processor to the collection. Telemetry processors will be called one by one
     * before telemetry item is pushed for sending and in the order they were added.
     *
     * @param telemetryProcessor function, takes Envelope, and optional context object and returns boolean
     */
    TelemetryClient.prototype.addTelemetryProcessor = function (telemetryProcessor) {
        this._telemetryProcessors.push(telemetryProcessor);
    };
    /*
     * Removes all telemetry processors
     */
    TelemetryClient.prototype.clearTelemetryProcessors = function () {
        this._telemetryProcessors = [];
    };
    TelemetryClient.prototype.runTelemetryProcessors = function (envelope, contextObjects) {
        var accepted = true;
        var telemetryProcessorsCount = this._telemetryProcessors.length;
        if (telemetryProcessorsCount === 0) {
            return accepted;
        }
        contextObjects = contextObjects || {};
        contextObjects['correlationContext'] = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
        for (var i = 0; i < telemetryProcessorsCount; ++i) {
            try {
                var processor = this._telemetryProcessors[i];
                if (processor) {
                    if (processor.apply(null, [envelope, contextObjects]) === false) {
                        accepted = false;
                        break;
                    }
                }
            }
            catch (error) {
                accepted = true;
                Logging.warn("One of telemetry processors failed, telemetry item will be sent.", error, envelope);
            }
        }
        return accepted;
    };
    return TelemetryClient;
}());
module.exports = TelemetryClient;
//# sourceMappingURL=TelemetryClient.js.map