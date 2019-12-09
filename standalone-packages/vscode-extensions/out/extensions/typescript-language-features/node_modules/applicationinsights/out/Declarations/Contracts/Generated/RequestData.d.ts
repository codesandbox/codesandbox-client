import Domain = require('./Domain');
/**
 * An instance of Request represents completion of an external request to the application to do work and contains a summary of that request execution and the results.
 */
declare class RequestData extends Domain {
    /**
     * Schema version
     */
    ver: number;
    /**
     * Identifier of a request call instance. Used for correlation between request and other telemetry items.
     */
    id: string;
    /**
     * Source of the request. Examples are the instrumentation key of the caller or the ip address of the caller.
     */
    source: string;
    /**
     * Name of the request. Represents code path taken to process request. Low cardinality value to allow better grouping of requests. For HTTP requests it represents the HTTP method and URL path template like 'GET /values/{id}'.
     */
    name: string;
    /**
     * Request duration in format: DD.HH:MM:SS.MMMMMM. Must be less than 1000 days.
     */
    duration: string;
    /**
     * Result of a request execution. HTTP status code for HTTP requests.
     */
    responseCode: string;
    /**
     * Indication of successfull or unsuccessfull call.
     */
    success: boolean;
    /**
     * Request URL with all query string parameters.
     */
    url: string;
    /**
     * Collection of custom properties.
     */
    properties: any;
    /**
     * Collection of custom measurements.
     */
    measurements: any;
    constructor();
}
export = RequestData;
