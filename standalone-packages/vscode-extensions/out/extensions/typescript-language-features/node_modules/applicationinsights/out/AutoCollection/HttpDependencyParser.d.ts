/// <reference types="node" />
import http = require("http");
import https = require("https");
import Contracts = require("../Declarations/Contracts");
import RequestParser = require("./RequestParser");
/**
 * Helper class to read data from the requst/response objects and convert them into the telemetry contract
 */
declare class HttpDependencyParser extends RequestParser {
    private correlationId;
    constructor(requestOptions: string | http.RequestOptions | https.RequestOptions, request: http.ClientRequest);
    /**
     * Called when the ClientRequest emits an error event.
     */
    onError(error: Error): void;
    /**
     * Called when the ClientRequest emits a response event.
     */
    onResponse(response: http.ClientResponse): void;
    /**
     * Gets a dependency data contract object for a completed ClientRequest.
     */
    getDependencyTelemetry(baseTelemetry?: Contracts.Telemetry, dependencyId?: string): Contracts.DependencyTelemetry;
    /**
     * Builds a URL from request options, using the same logic as http.request(). This is
     * necessary because a ClientRequest object does not expose a url property.
     */
    private static _getUrlFromRequestOptions(options, request);
}
export = HttpDependencyParser;
