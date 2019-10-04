import { Telemetry } from "./Telemetry";
/**
 * Telemetry about the exception thrown by the application
 */
export interface ExceptionTelemetry extends Telemetry {
    /**
     * Exception thrown
     */
    exception: Error;
    /**
     * Metrics associated with this exception, displayed in Metrics Explorer on the portal. Defaults to empty
     */
    measurements?: {
        [key: string]: number;
    };
}
