/**
 * Base telemetry interface encapsulating comming properties
 */
export interface Telemetry {
    /**
     * Telemetry time stamp. When it is not specified, current tiestamp will be used.
     */
    time?: Date;
    /**
     * Additional data used to filter events and metrics in the portal. Defaults to empty.
     */
    properties?: {
        [key: string]: string;
    };
    /**
     * An event-specific context that will be passed to telemetry processors handling this event before it is sent. For a context spanning your entire operation, consider appInsights.getCorrelationContext
     */
    contextObjects?: {
        [name: string]: any;
    };
    /**
     * The context tags to use for this telemetry which overwrite default context values
     */
    tagOverrides?: {
        [key: string]: string;
    };
}
