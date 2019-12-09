import { Telemetry } from "./Telemetry";
/**
 * Telemetry about the incoming request processsed by the application
 */
export interface RequestTelemetry extends Telemetry {
    /**
     * Request name
     */
    name: string;
    /**
     * Request url
     */
    url: string;
    /**
     * Request source. This encapsulates the information about the component that initiated the request
     */
    source?: string;
    /**
     * Request duration in ms
     */
    duration: number;
    /**
     * Result code reported by the application
     */
    resultCode: string | number;
    /**
     * Whether the request was successful
     */
    success: boolean;
}
