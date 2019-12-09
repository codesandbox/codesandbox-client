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
var HttpRequestParser = (function (_super) {
    __extends(HttpRequestParser, _super);
    function HttpRequestParser(request, requestId) {
        var _this = _super.call(this) || this;
        if (request) {
            _this.method = request.method;
            _this.url = _this._getAbsoluteUrl(request);
            _this.startTime = +new Date();
            _this.socketRemoteAddress = request.socket && request.socket.remoteAddress;
            _this.parseHeaders(request, requestId);
            if (request.connection) {
                _this.connectionRemoteAddress = request.connection.remoteAddress;
                _this.legacySocketRemoteAddress = request.connection["socket"] && request.connection["socket"].remoteAddress;
            }
        }
        return _this;
    }
    HttpRequestParser.prototype.onError = function (error, ellapsedMilliseconds) {
        this._setStatus(undefined, error);
        // This parameter is only for overrides. setStatus handles this internally for the autocollected case
        if (ellapsedMilliseconds) {
            this.duration = ellapsedMilliseconds;
        }
    };
    HttpRequestParser.prototype.onResponse = function (response, ellapsedMilliseconds) {
        this._setStatus(response.statusCode, undefined);
        // This parameter is only for overrides. setStatus handles this internally for the autocollected case
        if (ellapsedMilliseconds) {
            this.duration = ellapsedMilliseconds;
        }
    };
    HttpRequestParser.prototype.getRequestTelemetry = function (baseTelemetry) {
        var requestTelemetry = {
            id: this.requestId,
            name: this.method + " " + url.parse(this.url).pathname,
            url: this.url,
            /*
            See https://github.com/Microsoft/ApplicationInsights-dotnet-server/blob/25d695e6a906fbe977f67be3966d25dbf1c50a79/Src/Web/Web.Shared.Net/RequestTrackingTelemetryModule.cs#L250
            for reference
            */
            source: this.sourceCorrelationId,
            duration: this.duration,
            resultCode: this.statusCode ? this.statusCode.toString() : null,
            success: this._isSuccess(),
            properties: this.properties
        };
        // We should keep any parameters the user passed in
        // Except the fields defined above in requestTelemetry, which take priority
        // Except the properties field, where they're merged instead, with baseTelemetry taking priority
        if (baseTelemetry) {
            // Copy missing fields
            for (var key in baseTelemetry) {
                if (!requestTelemetry[key]) {
                    requestTelemetry[key] = baseTelemetry[key];
                }
            }
            // Merge properties
            if (baseTelemetry.properties) {
                for (var key in baseTelemetry.properties) {
                    requestTelemetry.properties[key] = baseTelemetry.properties[key];
                }
            }
        }
        return requestTelemetry;
    };
    HttpRequestParser.prototype.getRequestTags = function (tags) {
        // create a copy of the context for requests since client info will be used here
        var newTags = {};
        for (var key in tags) {
            newTags[key] = tags[key];
        }
        // don't override tags if they are already set
        newTags[HttpRequestParser.keys.locationIp] = tags[HttpRequestParser.keys.locationIp] || this._getIp();
        newTags[HttpRequestParser.keys.sessionId] = tags[HttpRequestParser.keys.sessionId] || this._getId("ai_session");
        newTags[HttpRequestParser.keys.userId] = tags[HttpRequestParser.keys.userId] || this._getId("ai_user");
        newTags[HttpRequestParser.keys.userAuthUserId] = tags[HttpRequestParser.keys.userAuthUserId] || this._getId("ai_authUser");
        newTags[HttpRequestParser.keys.operationName] = this.getOperationName(tags);
        newTags[HttpRequestParser.keys.operationParentId] = this.getOperationParentId(tags);
        newTags[HttpRequestParser.keys.operationId] = this.getOperationId(tags);
        return newTags;
    };
    HttpRequestParser.prototype.getOperationId = function (tags) {
        return tags[HttpRequestParser.keys.operationId] || this.operationId;
    };
    HttpRequestParser.prototype.getOperationParentId = function (tags) {
        return tags[HttpRequestParser.keys.operationParentId] || this.parentId || this.getOperationId(tags);
    };
    HttpRequestParser.prototype.getOperationName = function (tags) {
        return tags[HttpRequestParser.keys.operationName] || this.method + " " + url.parse(this.url).pathname;
    };
    HttpRequestParser.prototype.getRequestId = function () {
        return this.requestId;
    };
    HttpRequestParser.prototype.getCorrelationContextHeader = function () {
        return this.correlationContextHeader;
    };
    HttpRequestParser.prototype._getAbsoluteUrl = function (request) {
        if (!request.headers) {
            return request.url;
        }
        var encrypted = request.connection ? request.connection.encrypted : null;
        var requestUrl = url.parse(request.url);
        var pathName = requestUrl.pathname;
        var search = requestUrl.search;
        var absoluteUrl = url.format({
            protocol: encrypted ? "https" : "http",
            host: request.headers.host,
            pathname: pathName,
            search: search
        });
        return absoluteUrl;
    };
    HttpRequestParser.prototype._getIp = function () {
        // regex to match ipv4 without port
        // Note: including the port would cause the payload to be rejected by the data collector
        var ipMatch = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
        var check = function (str) {
            var results = ipMatch.exec(str);
            if (results) {
                return results[0];
            }
        };
        var ip = check(this.rawHeaders["x-forwarded-for"])
            || check(this.rawHeaders["x-client-ip"])
            || check(this.rawHeaders["x-real-ip"])
            || check(this.connectionRemoteAddress)
            || check(this.socketRemoteAddress)
            || check(this.legacySocketRemoteAddress);
        // node v12 returns this if the address is "localhost"
        if (!ip
            && this.connectionRemoteAddress
            && this.connectionRemoteAddress.substr
            && this.connectionRemoteAddress.substr(0, 2) === "::") {
            ip = "127.0.0.1";
        }
        return ip;
    };
    HttpRequestParser.prototype._getId = function (name) {
        var cookie = (this.rawHeaders && this.rawHeaders["cookie"] &&
            typeof this.rawHeaders["cookie"] === 'string' && this.rawHeaders["cookie"]) || "";
        var value = HttpRequestParser.parseId(Util.getCookie(name, cookie));
        return value;
    };
    HttpRequestParser.prototype.parseHeaders = function (request, requestId) {
        this.rawHeaders = request.headers || request.rawHeaders;
        this.userAgent = request.headers && request.headers["user-agent"];
        this.sourceCorrelationId = Util.getCorrelationContextTarget(request, RequestResponseHeaders.requestContextSourceKey);
        if (request.headers) {
            this.correlationContextHeader = request.headers[RequestResponseHeaders.correlationContextHeader];
            if (request.headers[RequestResponseHeaders.requestIdHeader]) {
                this.parentId = request.headers[RequestResponseHeaders.requestIdHeader];
                this.requestId = CorrelationIdManager.generateRequestId(this.parentId);
                this.correlationContextHeader = request.headers[RequestResponseHeaders.correlationContextHeader];
            }
            else {
                // Legacy fallback
                var rootId = request.headers[RequestResponseHeaders.rootIdHeader];
                this.parentId = request.headers[RequestResponseHeaders.parentIdHeader];
                this.requestId = CorrelationIdManager.generateRequestId(rootId || this.parentId);
                this.correlationContextHeader = null;
            }
            if (requestId) {
                // For the scenarios that don't guarantee an AI-created context,
                // override the requestId with the provided one.
                this.requestId = requestId;
            }
            this.operationId = CorrelationIdManager.getRootId(this.requestId);
        }
    };
    HttpRequestParser.parseId = function (cookieValue) {
        return cookieValue.substr(0, cookieValue.indexOf('|'));
    };
    HttpRequestParser.keys = new Contracts.ContextTagKeys();
    return HttpRequestParser;
}(RequestParser));
module.exports = HttpRequestParser;
//# sourceMappingURL=HttpRequestParser.js.map