"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var http = require("http");
var https = require("https");
var url = require("url");
var constants = require("constants");
var Logging = require("./Logging");
var RequestResponseHeaders = require("./RequestResponseHeaders");
var Util = (function () {
    function Util() {
    }
    /**
     * helper method to access userId and sessionId cookie
     */
    Util.getCookie = function (name, cookie) {
        var value = "";
        if (name && name.length && typeof cookie === "string") {
            var cookieName = name + "=";
            var cookies = cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                cookie = Util.trim(cookie);
                if (cookie && cookie.indexOf(cookieName) === 0) {
                    value = cookie.substring(cookieName.length, cookies[i].length);
                    break;
                }
            }
        }
        return value;
    };
    /**
     * helper method to trim strings (IE8 does not implement String.prototype.trim)
     */
    Util.trim = function (str) {
        if (typeof str === "string") {
            return str.replace(/^\s+|\s+$/g, "");
        }
        else {
            return "";
        }
    };
    /**
     * Convert an array of int32 to Base64 (no '==' at the end).
     * MSB first.
     */
    Util.int32ArrayToBase64 = function (array) {
        var toChar = function (v, i) {
            return String.fromCharCode((v >> i) & 0xFF);
        };
        var int32AsString = function (v) {
            return toChar(v, 24) + toChar(v, 16) + toChar(v, 8) + toChar(v, 0);
        };
        var x = array.map(int32AsString).join("");
        var b = Buffer.from ? Buffer.from(x, "binary") : new Buffer(x, "binary");
        var s = b.toString("base64");
        return s.substr(0, s.indexOf("="));
    };
    /**
     * generate a random 32bit number (-0x80000000..0x7FFFFFFF).
     */
    Util.random32 = function () {
        return (0x100000000 * Math.random()) | 0;
    };
    /**
     * generate a random 32bit number (0x00000000..0xFFFFFFFF).
     */
    Util.randomu32 = function () {
        return Util.random32() + 0x80000000;
    };
    /**
     * generate W3C-compatible trace id
     * https://github.com/w3c/distributed-tracing/blob/master/trace_context/HTTP_HEADER_FORMAT.md#trace-id
     */
    Util.w3cTraceId = function () {
        var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        // rfc4122 version 4 UUID without dashes and with lowercase letters
        var oct = "", tmp;
        for (var a = 0; a < 4; a++) {
            tmp = Util.random32();
            oct +=
                hexValues[tmp & 0xF] +
                    hexValues[tmp >> 4 & 0xF] +
                    hexValues[tmp >> 8 & 0xF] +
                    hexValues[tmp >> 12 & 0xF] +
                    hexValues[tmp >> 16 & 0xF] +
                    hexValues[tmp >> 20 & 0xF] +
                    hexValues[tmp >> 24 & 0xF] +
                    hexValues[tmp >> 28 & 0xF];
        }
        // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
        var clockSequenceHi = hexValues[8 + (Math.random() * 4) | 0];
        return oct.substr(0, 8) + oct.substr(9, 4) + "4" + oct.substr(13, 3) + clockSequenceHi + oct.substr(16, 3) + oct.substr(19, 12);
    };
    /**
     * Check if an object is of type Array
     */
    Util.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
    /**
     * Check if an object is of type Error
     */
    Util.isError = function (obj) {
        return obj instanceof Error;
    };
    Util.isPrimitive = function (input) {
        var propType = typeof input;
        return propType === "string" || propType === "number" || propType === "boolean";
    };
    /**
     * Check if an object is of type Date
     */
    Util.isDate = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Date]";
    };
    /**
     * Convert ms to c# time span format
     */
    Util.msToTimeSpan = function (totalms) {
        if (isNaN(totalms) || totalms < 0) {
            totalms = 0;
        }
        var sec = ((totalms / 1000) % 60).toFixed(7).replace(/0{0,4}$/, "");
        var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
        var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;
        var days = Math.floor(totalms / (1000 * 60 * 60 * 24));
        sec = sec.indexOf(".") < 2 ? "0" + sec : sec;
        min = min.length < 2 ? "0" + min : min;
        hour = hour.length < 2 ? "0" + hour : hour;
        var daysText = days > 0 ? days + "." : "";
        return daysText + hour + ":" + min + ":" + sec;
    };
    /**
     * Using JSON.stringify, by default Errors do not serialize to something useful:
     * Simplify a generic Node Error into a simpler map for customDimensions
     * Custom errors can still implement toJSON to override this functionality
     */
    Util.extractError = function (err) {
        // Error is often subclassed so may have code OR id properties:
        // https://nodejs.org/api/errors.html#errors_error_code
        var looseError = err;
        return {
            message: err.message,
            code: looseError.code || looseError.id || "",
        };
    };
    /**
     * Manually call toJSON if available to pre-convert the value.
     * If a primitive is returned, then the consumer of this function can skip JSON.stringify.
     * This avoids double escaping of quotes for Date objects, for example.
     */
    Util.extractObject = function (origProperty) {
        if (origProperty instanceof Error) {
            return Util.extractError(origProperty);
        }
        if (typeof origProperty.toJSON === "function") {
            return origProperty.toJSON();
        }
        return origProperty;
    };
    /**
     * Validate that an object is of type { [key: string]: string }
     */
    Util.validateStringMap = function (obj) {
        if (typeof obj !== "object") {
            Logging.info("Invalid properties dropped from payload");
            return;
        }
        var map = {};
        for (var field in obj) {
            var property = '';
            var origProperty = obj[field];
            var propType = typeof origProperty;
            if (Util.isPrimitive(origProperty)) {
                property = origProperty.toString();
            }
            else if (origProperty === null || propType === "undefined") {
                property = "";
            }
            else if (propType === "function") {
                Logging.info("key: " + field + " was function; will not serialize");
                continue;
            }
            else {
                var stringTarget = Util.isArray(origProperty) ? origProperty : Util.extractObject(origProperty);
                try {
                    if (Util.isPrimitive(stringTarget)) {
                        property = stringTarget;
                    }
                    else {
                        property = JSON.stringify(stringTarget);
                    }
                }
                catch (e) {
                    property = origProperty.constructor.name.toString() + " (Error: " + e.message + ")";
                    Logging.info("key: " + field + ", could not be serialized");
                }
            }
            map[field] = property.substring(0, Util.MAX_PROPERTY_LENGTH);
        }
        return map;
    };
    /**
     * Checks if a request url is not on a excluded domain list
     * and if it is safe to add correlation headers
     */
    Util.canIncludeCorrelationHeader = function (client, requestUrl) {
        var excludedDomains = client && client.config && client.config.correlationHeaderExcludedDomains;
        if (!excludedDomains || excludedDomains.length == 0 || !requestUrl) {
            return true;
        }
        for (var i = 0; i < excludedDomains.length; i++) {
            var regex = new RegExp(excludedDomains[i].replace(/\./g, "\.").replace(/\*/g, ".*"));
            if (regex.test(url.parse(requestUrl).hostname)) {
                return false;
            }
        }
        return true;
    };
    Util.getCorrelationContextTarget = function (response, key) {
        var contextHeaders = response.headers && response.headers[RequestResponseHeaders.requestContextHeader];
        if (contextHeaders) {
            var keyValues = contextHeaders.split(",");
            for (var i = 0; i < keyValues.length; ++i) {
                var keyValue = keyValues[i].split("=");
                if (keyValue.length == 2 && keyValue[0] == key) {
                    return keyValue[1];
                }
            }
        }
    };
    /**
     * Generate request
     *
     * Proxify the request creation to handle proxy http
     *
     * @param {string} requestUrl url endpoint
     * @param {Object} requestOptions Request option
     * @param {Function} requestCallback callback on request
     * @returns {http.ClientRequest} request object
     */
    Util.makeRequest = function (config, requestUrl, requestOptions, requestCallback) {
        if (requestUrl && requestUrl.indexOf('//') === 0) {
            requestUrl = 'https:' + requestUrl;
        }
        var requestUrlParsed = url.parse(requestUrl);
        var options = __assign({}, requestOptions, { host: requestUrlParsed.hostname, port: requestUrlParsed.port, path: requestUrlParsed.pathname });
        var proxyUrl = undefined;
        if (requestUrlParsed.protocol === 'https:') {
            proxyUrl = config.proxyHttpsUrl || undefined;
        }
        if (requestUrlParsed.protocol === 'http:') {
            proxyUrl = config.proxyHttpUrl || undefined;
        }
        if (proxyUrl) {
            if (proxyUrl.indexOf('//') === 0) {
                proxyUrl = 'http:' + proxyUrl;
            }
            var proxyUrlParsed = url.parse(proxyUrl);
            // https is not supported at the moment
            if (proxyUrlParsed.protocol === 'https:') {
                Logging.info("Proxies that use HTTPS are not supported");
                proxyUrl = undefined;
            }
            else {
                options = __assign({}, options, { host: proxyUrlParsed.hostname, port: proxyUrlParsed.port || "80", path: requestUrl, headers: __assign({}, options.headers, { Host: requestUrlParsed.hostname }) });
            }
        }
        var isHttps = requestUrlParsed.protocol === 'https:' && !proxyUrl;
        if (isHttps && config.httpsAgent !== undefined) {
            options.agent = config.httpsAgent;
        }
        else if (!isHttps && config.httpAgent !== undefined) {
            options.agent = config.httpAgent;
        }
        else if (isHttps) {
            // HTTPS without a passed in agent. Use one that enforces our TLS rules
            options.agent = Util.tlsRestrictedAgent;
        }
        if (isHttps) {
            return https.request(options, requestCallback);
        }
        else {
            return http.request(options, requestCallback);
        }
    };
    ;
    Util.MAX_PROPERTY_LENGTH = 8192;
    Util.tlsRestrictedAgent = new https.Agent({
        secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 |
            constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1
    });
    return Util;
}());
module.exports = Util;
//# sourceMappingURL=Util.js.map