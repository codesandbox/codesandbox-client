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
var url = require("url");
var Contracts = require("../Declarations/Contracts");
var Util = require("../Library/Util");
var RequestResponseHeaders = require("../Library/RequestResponseHeaders");
var RequestParser = require("./RequestParser");
var CorrelationIdManager = require("../Library/CorrelationIdManager");
/**
 * Helper class to read data from the requst/response objects and convert them into the telemetry contract
 */
var HttpDependencyParser = (function (_super) {
    __extends(HttpDependencyParser, _super);
    function HttpDependencyParser(requestOptions, request) {
        var _this = _super.call(this) || this;
        if (request && request.method && requestOptions) {
            // The ClientRequest.method property isn't documented, but is always there.
            _this.method = request.method;
            _this.url = HttpDependencyParser._getUrlFromRequestOptions(requestOptions, request);
            _this.startTime = +new Date();
        }
        return _this;
    }
    /**
     * Called when the ClientRequest emits an error event.
     */
    HttpDependencyParser.prototype.onError = function (error) {
        this._setStatus(undefined, error);
    };
    /**
     * Called when the ClientRequest emits a response event.
     */
    HttpDependencyParser.prototype.onResponse = function (response) {
        this._setStatus(response.statusCode, undefined);
        this.correlationId = Util.getCorrelationContextTarget(response, RequestResponseHeaders.requestContextTargetKey);
    };
    /**
     * Gets a dependency data contract object for a completed ClientRequest.
     */
    HttpDependencyParser.prototype.getDependencyTelemetry = function (baseTelemetry, dependencyId) {
        var urlObject = url.parse(this.url);
        urlObject.search = undefined;
        urlObject.hash = undefined;
        var dependencyName = this.method.toUpperCase() + " " + urlObject.pathname;
        var remoteDependencyType = Contracts.RemoteDependencyDataConstants.TYPE_HTTP;
        var remoteDependencyTarget = urlObject.hostname;
        if (this.correlationId) {
            remoteDependencyType = Contracts.RemoteDependencyDataConstants.TYPE_AI;
            if (this.correlationId !== CorrelationIdManager.correlationIdPrefix) {
                remoteDependencyTarget = urlObject.hostname + " | " + this.correlationId;
            }
        }
        else {
            remoteDependencyType = Contracts.RemoteDependencyDataConstants.TYPE_HTTP;
        }
        var dependencyTelemetry = {
            id: dependencyId,
            name: dependencyName,
            data: this.url,
            duration: this.duration,
            success: this._isSuccess(),
            resultCode: this.statusCode ? this.statusCode.toString() : null,
            properties: this.properties || {},
            dependencyTypeName: remoteDependencyType,
            target: remoteDependencyTarget
        };
        // We should keep any parameters the user passed in
        // Except the fields defined above in requestTelemetry, which take priority
        // Except the properties field, where they're merged instead, with baseTelemetry taking priority
        if (baseTelemetry) {
            // Copy missing fields
            for (var key in baseTelemetry) {
                if (!dependencyTelemetry[key]) {
                    dependencyTelemetry[key] = baseTelemetry[key];
                }
            }
            // Merge properties
            if (baseTelemetry.properties) {
                for (var key in baseTelemetry.properties) {
                    dependencyTelemetry.properties[key] = baseTelemetry.properties[key];
                }
            }
        }
        return dependencyTelemetry;
    };
    /**
     * Builds a URL from request options, using the same logic as http.request(). This is
     * necessary because a ClientRequest object does not expose a url property.
     */
    HttpDependencyParser._getUrlFromRequestOptions = function (options, request) {
        if (typeof options === 'string') {
            options = url.parse(options);
        }
        else {
            // Avoid modifying the original options object.
            var originalOptions_1 = options;
            options = {};
            if (originalOptions_1) {
                Object.keys(originalOptions_1).forEach(function (key) {
                    options[key] = originalOptions_1[key];
                });
            }
        }
        // Oddly, url.format ignores path and only uses pathname and search,
        // so create them from the path, if path was specified
        if (options.path) {
            var parsedQuery = url.parse(options.path);
            options.pathname = parsedQuery.pathname;
            options.search = parsedQuery.search;
        }
        // Simiarly, url.format ignores hostname and port if host is specified,
        // even if host doesn't have the port, but http.request does not work
        // this way. It will use the port if one is not specified in host,
        // effectively treating host as hostname, but will use the port specified
        // in host if it exists.
        if (options.host && options.port) {
            // Force a protocol so it will parse the host as the host, not path.
            // It is discarded and not used, so it doesn't matter if it doesn't match
            var parsedHost = url.parse("http://" + options.host);
            if (!parsedHost.port && options.port) {
                options.hostname = options.host;
                delete options.host;
            }
        }
        // Mix in default values used by http.request and others
        options.protocol = options.protocol || (request.agent && request.agent.protocol) || undefined;
        options.hostname = options.hostname || 'localhost';
        return url.format(options);
    };
    return HttpDependencyParser;
}(RequestParser));
module.exports = HttpDependencyParser;
//# sourceMappingURL=HttpDependencyParser.js.map