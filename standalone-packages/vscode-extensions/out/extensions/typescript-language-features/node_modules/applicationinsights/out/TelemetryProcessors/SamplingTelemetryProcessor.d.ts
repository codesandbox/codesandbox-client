import Contracts = require("../Declarations/Contracts");
import { CorrelationContext } from "../AutoCollection/CorrelationContextManager";
/**
 *  A telemetry processor that handles sampling.
 */
export declare function samplingTelemetryProcessor(envelope: Contracts.Envelope, contextObjects: {
    correlationContext: CorrelationContext;
}): boolean;
/** Ported from AI .NET SDK */
export declare function getSamplingHashCode(input: string): number;
