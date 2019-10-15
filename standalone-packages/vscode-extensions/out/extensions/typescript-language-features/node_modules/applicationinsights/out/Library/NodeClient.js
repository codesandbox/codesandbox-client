"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TelemetryClient = require("./TelemetryClient");
var ServerRequestTracking = require("../AutoCollection/HttpRequests");
var ClientRequestTracking = require("../AutoCollection/HttpDependencies");
var Logging = require("./Logging");
/**
 * Application Insights Telemetry Client for Node.JS. Provides the Application Insights TelemetryClient API
 * in addition to Node-specific helper functions.
 * Construct a new TelemetryClient to have an instance with a different configuration than the default client.
 * In most cases, `appInsights.defaultClient` should be used instead.
 */
var NodeClient = (function (_super) {
    __extends(NodeClient, _super);
    function NodeClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Log RequestTelemetry from HTTP request and response. This method will log immediately without waitng for request completion
     * and it requires duration parameter to be specified on NodeHttpRequestTelemetry object.
     * Use trackNodeHttpRequest function to log the telemetry after request completion
     * @param telemetry Object encapsulating incoming request, response and duration information
     */
    NodeClient.prototype.trackNodeHttpRequestSync = function (telemetry) {
        if (telemetry && telemetry.request && telemetry.response && telemetry.duration) {
            ServerRequestTracking.trackRequestSync(this, telemetry);
        }
        else {
            Logging.warn("trackNodeHttpRequestSync requires NodeHttpRequestTelemetry object with request, response and duration specified.");
        }
    };
    /**
     * Log RequestTelemetry from HTTP request and response. This method will `follow` the request to completion.
     * Use trackNodeHttpRequestSync function to log telemetry immediately without waiting for request completion
     * @param telemetry Object encapsulating incoming request and response information
     */
    NodeClient.prototype.trackNodeHttpRequest = function (telemetry) {
        if (telemetry.duration || telemetry.error) {
            Logging.warn("trackNodeHttpRequest will ignore supplied duration and error parameters. These values are collected from the request and response objects.");
        }
        if (telemetry && telemetry.request && telemetry.response) {
            ServerRequestTracking.trackRequest(this, telemetry);
        }
        else {
            Logging.warn("trackNodeHttpRequest requires NodeHttpRequestTelemetry object with request and response specified.");
        }
    };
    /**
     * Log DependencyTelemetry from outgoing HTTP request. This method will instrument the outgoing request and append
     * the specified headers and will log the telemetry when outgoing request is complete
     * @param telemetry Object encapsulating outgoing request information
     */
    NodeClient.prototype.trackNodeHttpDependency = function (telemetry) {
        if (telemetry && telemetry.request) {
            ClientRequestTracking.trackRequest(this, telemetry);
        }
        else {
            Logging.warn("trackNodeHttpDependency requires NodeHttpDependencyTelemetry object with request specified.");
        }
    };
    return NodeClient;
}(TelemetryClient));
module.exports = NodeClient;
//# sourceMappingURL=NodeClient.js.map