/// <reference types="node" />
import { Telemetry } from "./Telemetry";
import http = require("http");
/**
 * An interface describing the standard Node.js options parameter
 * for http requests.
 */
export interface httpRequestOptions {
    protocol?: string;
    host?: string;
    hostname?: string;
    family?: number;
    port?: number;
    localAddress?: string;
    socketPath?: string;
    method?: string;
    path?: string;
    headers?: {
        [key: string]: any;
    };
    auth?: string;
}
/**
 * Object encapsulating information about the outgoing request
 */
export interface NodeHttpDependencyTelemetry extends Telemetry {
    /**
     * Request options that will be used to instrument outgoing request
     */
    options: string | httpRequestOptions;
    /**
     * Outgoing HTTP request object
     */
    request: http.ClientRequest;
}
