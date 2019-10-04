"use strict";
/**
 * Base class for helpers that read data from HTTP requst/response objects and convert them
 * into the telemetry contract objects.
 */
var RequestParser = (function () {
    function RequestParser() {
    }
    /**
     * Gets a url parsed out from request options
     */
    RequestParser.prototype.getUrl = function () {
        return this.url;
    };
    RequestParser.prototype.RequestParser = function () {
        this.startTime = +new Date();
    };
    RequestParser.prototype._setStatus = function (status, error) {
        var endTime = +new Date();
        this.duration = endTime - this.startTime;
        this.statusCode = status;
        var properties = this.properties || {};
        if (error) {
            if (typeof error === "string") {
                properties["error"] = error;
            }
            else if (error instanceof Error) {
                properties["error"] = error.message;
            }
            else if (typeof error === "object") {
                for (var key in error) {
                    properties[key] = error[key] && error[key].toString && error[key].toString();
                }
            }
        }
        this.properties = properties;
    };
    RequestParser.prototype._isSuccess = function () {
        return (0 < this.statusCode) && (this.statusCode < 400);
    };
    return RequestParser;
}());
module.exports = RequestParser;
//# sourceMappingURL=RequestParser.js.map