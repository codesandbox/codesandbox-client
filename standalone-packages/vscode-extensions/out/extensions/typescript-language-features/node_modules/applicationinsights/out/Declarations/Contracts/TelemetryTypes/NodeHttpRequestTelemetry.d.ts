/// <reference types="node" />
import { Telemetry } from "./Telemetry";
import http = require("http");
/**
 * Object encapsulating information about the incoming HTTP request
 */
export interface NodeHttpRequestTelemetry extends Telemetry {
    /**
     * HTTP request object
     */
    request: http.IncomingMessage;
    /**
     * HTTP response object
     */
    response: http.ServerResponse;
    /**
     * HTTP request duration. Used only for synchronous tracks.
     */
    duration?: number;
    /**
     * Error that occurred while processing the request. Used only for synchronous tracks.
     */
    error?: any;
}
