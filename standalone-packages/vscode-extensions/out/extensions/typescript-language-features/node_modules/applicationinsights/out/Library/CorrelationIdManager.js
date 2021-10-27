"use strict";
var Util = require("./Util");
var Logging = require("./Logging");
var CorrelationIdManager = (function () {
    function CorrelationIdManager() {
    }
    CorrelationIdManager.queryCorrelationId = function (config, callback) {
        // GET request to `${this.endpointBase}/api/profiles/${this.instrumentationKey}/appId`
        // If it 404s, the iKey is bad and we should give up
        // If it fails otherwise, try again later
        var appIdUrlString = config.profileQueryEndpoint + "/api/profiles/" + config.instrumentationKey + "/appId";
        if (CorrelationIdManager.completedLookups.hasOwnProperty(appIdUrlString)) {
            callback(CorrelationIdManager.completedLookups[appIdUrlString]);
            return;
        }
        else if (CorrelationIdManager.pendingLookups[appIdUrlString]) {
            CorrelationIdManager.pendingLookups[appIdUrlString].push(callback);
            return;
        }
        CorrelationIdManager.pendingLookups[appIdUrlString] = [callback];
        var fetchAppId = function () {
            if (!CorrelationIdManager.pendingLookups[appIdUrlString]) {
                // This query has been cancelled.
                return;
            }
            var requestOptions = {
                method: 'GET',
                // Ensure this request is not captured by auto-collection.
                // Note: we don't refer to the property in HttpDependencyParser because that would cause a cyclical dependency
                disableAppInsightsAutoCollection: true
            };
            Logging.info(CorrelationIdManager.TAG, requestOptions);
            var req = Util.makeRequest(config, appIdUrlString, requestOptions, function (res) {
                if (res.statusCode === 200) {
                    // Success; extract the appId from the body
                    var appId_1 = "";
                    res.setEncoding("utf-8");
                    res.on('data', function (data) {
                        appId_1 += data;
                    });
                    res.on('end', function () {
                        Logging.info(CorrelationIdManager.TAG, appId_1);
                        var result = CorrelationIdManager.correlationIdPrefix + appId_1;
                        CorrelationIdManager.completedLookups[appIdUrlString] = result;
                        if (CorrelationIdManager.pendingLookups[appIdUrlString]) {
                            CorrelationIdManager.pendingLookups[appIdUrlString].forEach(function (cb) { return cb(result); });
                        }
                        delete CorrelationIdManager.pendingLookups[appIdUrlString];
                    });
                }
                else if (res.statusCode >= 400 && res.statusCode < 500) {
                    // Not found, probably a bad key. Do not try again.
                    CorrelationIdManager.completedLookups[appIdUrlString] = undefined;
                    delete CorrelationIdManager.pendingLookups[appIdUrlString];
                }
                else {
                    // Retry after timeout.
                    setTimeout(fetchAppId, config.correlationIdRetryIntervalMs);
                }
            });
            if (req) {
                req.on('error', function (error) {
                    // Unable to contact endpoint.
                    // Do nothing for now.
                    Logging.warn(CorrelationIdManager.TAG, error);
                });
                req.end();
            }
        };
        setTimeout(fetchAppId, 0);
    };
    CorrelationIdManager.cancelCorrelationIdQuery = function (config, callback) {
        var appIdUrlString = config.profileQueryEndpoint + "/api/profiles/" + config.instrumentationKey + "/appId";
        var pendingLookups = CorrelationIdManager.pendingLookups[appIdUrlString];
        if (pendingLookups) {
            CorrelationIdManager.pendingLookups[appIdUrlString] = pendingLookups.filter(function (cb) { return cb != callback; });
            if (CorrelationIdManager.pendingLookups[appIdUrlString].length == 0) {
                delete CorrelationIdManager.pendingLookups[appIdUrlString];
            }
        }
    };
    /**
     * Generate a request Id according to https://github.com/lmolkova/correlation/blob/master/hierarchical_request_id.md
     * @param parentId
     */
    CorrelationIdManager.generateRequestId = function (parentId) {
        if (parentId) {
            parentId = parentId[0] == '|' ? parentId : '|' + parentId;
            if (parentId[parentId.length - 1] !== '.') {
                parentId += '.';
            }
            var suffix = (CorrelationIdManager.currentRootId++).toString(16);
            return CorrelationIdManager.appendSuffix(parentId, suffix, '_');
        }
        else {
            return CorrelationIdManager.generateRootId();
        }
    };
    /**
     * Given a hierarchical identifier of the form |X.*
     * return the root identifier X
     * @param id
     */
    CorrelationIdManager.getRootId = function (id) {
        var endIndex = id.indexOf('.');
        if (endIndex < 0) {
            endIndex = id.length;
        }
        var startIndex = id[0] === '|' ? 1 : 0;
        return id.substring(startIndex, endIndex);
    };
    CorrelationIdManager.generateRootId = function () {
        return '|' + Util.w3cTraceId() + '.';
    };
    CorrelationIdManager.appendSuffix = function (parentId, suffix, delimiter) {
        if (parentId.length + suffix.length < CorrelationIdManager.requestIdMaxLength) {
            return parentId + suffix + delimiter;
        }
        // Combined identifier would be too long, so we must truncate it.
        // We need 9 characters of space: 8 for the overflow ID, 1 for the
        // overflow delimiter '#'
        var trimPosition = CorrelationIdManager.requestIdMaxLength - 9;
        if (parentId.length > trimPosition) {
            for (; trimPosition > 1; --trimPosition) {
                var c = parentId[trimPosition - 1];
                if (c === '.' || c === '_') {
                    break;
                }
            }
        }
        if (trimPosition <= 1) {
            // parentId is not a valid ID
            return CorrelationIdManager.generateRootId();
        }
        suffix = Util.randomu32().toString(16);
        while (suffix.length < 8) {
            suffix = '0' + suffix;
        }
        return parentId.substring(0, trimPosition) + suffix + '#';
    };
    CorrelationIdManager.TAG = "CorrelationIdManager";
    CorrelationIdManager.correlationIdPrefix = "cid-v1:";
    // To avoid extraneous HTTP requests, we maintain a queue of callbacks waiting on a particular appId lookup,
    // as well as a cache of completed lookups so future requests can be resolved immediately.
    CorrelationIdManager.pendingLookups = {};
    CorrelationIdManager.completedLookups = {};
    CorrelationIdManager.requestIdMaxLength = 1024;
    CorrelationIdManager.currentRootId = Util.randomu32();
    return CorrelationIdManager;
}());
module.exports = CorrelationIdManager;
//# sourceMappingURL=CorrelationIdManager.js.map