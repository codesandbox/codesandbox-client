import { Telemetry } from "./Telemetry";
/**
 * Telemetry about the custom event of interest, such application workflow event, business logic event (purchase) and anything that
 * you would like to track and aggregate by count. Event can contain measurements such as purchase amount associated with purchase event
 */
export interface EventTelemetry extends Telemetry {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Metrics associated with this event, displayed in Metrics Explorer on the portal.
     */
    measurements?: {
        [key: string]: number;
    };
}
