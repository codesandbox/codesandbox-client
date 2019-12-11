import { Telemetry } from "./Telemetry";
import Contracts = require("../");
/**
 * Trace telemetry reports technical, usually detailed information about the environment,
 * usage of resources, performance, capacity etc
 */
export interface TraceTelemetry extends Telemetry {
    /**
     * Trace message
     */
    message: string;
    /**
     * Trace severity level
     */
    severity?: Contracts.SeverityLevel;
}
