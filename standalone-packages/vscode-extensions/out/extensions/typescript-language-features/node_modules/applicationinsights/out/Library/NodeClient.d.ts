import TelemetryClient = require("./TelemetryClient");
import Contracts = require("../Declarations/Contracts");
/**
 * Application Insights Telemetry Client for Node.JS. Provides the Application Insights TelemetryClient API
 * in addition to Node-specific helper functions.
 * Construct a new TelemetryClient to have an instance with a different configuration than the default client.
 * In most cases, `appInsights.defaultClient` should be used instead.
 */
declare class NodeClient extends TelemetryClient {
    /**
     * Log RequestTelemetry from HTTP request and response. This method will log immediately without waitng for request completion
     * and it requires duration parameter to be specified on NodeHttpRequestTelemetry object.
     * Use trackNodeHttpRequest function to log the telemetry after request completion
     * @param telemetry Object encapsulating incoming request, response and duration information
     */
    trackNodeHttpRequestSync(telemetry: Contracts.NodeHttpRequestTelemetry): void;
    /**
     * Log RequestTelemetry from HTTP request and response. This method will `follow` the request to completion.
     * Use trackNodeHttpRequestSync function to log telemetry immediately without waiting for request completion
     * @param telemetry Object encapsulating incoming request and response information
     */
    trackNodeHttpRequest(telemetry: Contracts.NodeHttpRequestTelemetry): void;
    /**
     * Log DependencyTelemetry from outgoing HTTP request. This method will instrument the outgoing request and append
     * the specified headers and will log the telemetry when outgoing request is complete
     * @param telemetry Object encapsulating outgoing request information
     */
    trackNodeHttpDependency(telemetry: Contracts.NodeHttpDependencyTelemetry): void;
}
export = NodeClient;
