import Contracts = require("../Declarations/Contracts");
import Config = require("./Config");
import Context = require("./Context");
/**
 * Manages the logic of creating envelopes from Telemetry objects
 */
declare class EnvelopeFactory {
    /**
     * Creates envelope ready to be sent by Channel
     * @param telemetry Telemetry data
     * @param telemetryType Type of telemetry
     * @param commonProperties Bag of custom common properties to be added to the envelope
     * @param context Client context
     * @param config Client configuration
     */
    static createEnvelope(telemetry: Contracts.Telemetry, telemetryType: Contracts.TelemetryType, commonProperties?: {
        [key: string]: string;
    }, context?: Context, config?: Config): Contracts.Envelope;
    private static createTraceData(telemetry);
    private static createDependencyData(telemetry);
    private static createEventData(telemetry);
    private static createExceptionData(telemetry);
    private static createRequestData(telemetry);
    private static createMetricData(telemetry);
    private static getTags(context, tagOverrides?);
    private static parseStack(stack);
}
export = EnvelopeFactory;
