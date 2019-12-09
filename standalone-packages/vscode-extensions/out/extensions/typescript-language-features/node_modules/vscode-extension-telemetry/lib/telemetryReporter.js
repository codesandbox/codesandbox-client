/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
process.env['APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL'] = true;
var fs = require("fs");
var os = require("os");
var path = require("path");
var vscode = require("vscode");
var appInsights = require("applicationinsights");
var TelemetryReporter = /** @class */ (function () {
    // tslint:disable-next-line
    function TelemetryReporter(extensionId, extensionVersion, key) {
        var _this = this;
        this.extensionId = extensionId;
        this.extensionVersion = extensionVersion;
        this.userOptIn = false;
        var logFilePath = process.env['VSCODE_LOGS'] || '';
        if (logFilePath && extensionId && process.env['VSCODE_LOG_LEVEL'] === 'trace') {
            logFilePath = path.join(logFilePath, extensionId + ".txt");
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a', encoding: 'utf8', autoClose: true });
        }
        this.updateUserOptIn(key);
        this.configListener = vscode.workspace.onDidChangeConfiguration(function () { return _this.updateUserOptIn(key); });
    }
    TelemetryReporter.prototype.updateUserOptIn = function (key) {
        var config = vscode.workspace.getConfiguration(TelemetryReporter.TELEMETRY_CONFIG_ID);
        if (this.userOptIn !== config.get(TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID, true)) {
            this.userOptIn = config.get(TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID, true);
            if (this.userOptIn) {
                this.createAppInsightsClient(key);
            }
            else {
                this.dispose();
            }
        }
    };
    TelemetryReporter.prototype.createAppInsightsClient = function (key) {
        //check if another instance is already initialized
        if (appInsights.defaultClient) {
            this.appInsightsClient = new appInsights.TelemetryClient(key);
            // no other way to enable offline mode
            this.appInsightsClient.channel.setUseDiskRetryCaching(true);
        }
        else {
            appInsights.setup(key)
                .setAutoCollectRequests(false)
                .setAutoCollectPerformance(false)
                .setAutoCollectExceptions(false)
                .setAutoCollectDependencies(false)
                .setAutoDependencyCorrelation(false)
                .setAutoCollectConsole(false)
                .setUseDiskRetryCaching(true)
                .start();
            this.appInsightsClient = appInsights.defaultClient;
        }
        this.appInsightsClient.commonProperties = this.getCommonProperties();
        if (vscode && vscode.env) {
            this.appInsightsClient.context.tags[this.appInsightsClient.context.keys.userId] = vscode.env.machineId;
            this.appInsightsClient.context.tags[this.appInsightsClient.context.keys.sessionId] = vscode.env.sessionId;
        }
        //check if it's an Asimov key to change the endpoint
        if (key && key.indexOf('AIF-') === 0) {
            this.appInsightsClient.config.endpointUrl = "https://vortex.data.microsoft.com/collect/v1";
        }
    };
    // __GDPR__COMMON__ "common.os" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.platformversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extname" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extversion" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodemachineid" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodesessionid" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    TelemetryReporter.prototype.getCommonProperties = function () {
        var commonProperties = Object.create(null);
        commonProperties['common.os'] = os.platform();
        commonProperties['common.platformversion'] = (os.release() || '').replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, '$1$2$3');
        commonProperties['common.extname'] = this.extensionId;
        commonProperties['common.extversion'] = this.extensionVersion;
        if (vscode && vscode.env) {
            commonProperties['common.vscodemachineid'] = vscode.env.machineId;
            commonProperties['common.vscodesessionid'] = vscode.env.sessionId;
            commonProperties['common.vscodeversion'] = vscode.version;
        }
        return commonProperties;
    };
    TelemetryReporter.prototype.sendTelemetryEvent = function (eventName, properties, measurements) {
        if (this.userOptIn && eventName && this.appInsightsClient) {
            this.appInsightsClient.trackEvent({
                name: this.extensionId + "/" + eventName,
                properties: properties,
                measurements: measurements
            });
            if (this.logStream) {
                this.logStream.write("telemetry/" + eventName + " " + JSON.stringify({ properties: properties, measurements: measurements }) + "\n");
            }
        }
    };
    TelemetryReporter.prototype.dispose = function () {
        var _this = this;
        this.configListener.dispose();
        var flushEventsToLogger = new Promise(function (resolve) {
            if (!_this.logStream) {
                return resolve(void 0);
            }
            _this.logStream.on('finish', resolve);
            _this.logStream.end();
        });
        var flushEventsToAI = new Promise(function (resolve) {
            if (_this.appInsightsClient) {
                _this.appInsightsClient.flush({
                    callback: function () {
                        // all data flushed
                        _this.appInsightsClient = undefined;
                        resolve(void 0);
                    }
                });
            }
            else {
                resolve(void 0);
            }
        });
        return Promise.all([flushEventsToAI, flushEventsToLogger]);
    };
    TelemetryReporter.TELEMETRY_CONFIG_ID = 'telemetry';
    TelemetryReporter.TELEMETRY_CONFIG_ENABLED_ID = 'enableTelemetry';
    return TelemetryReporter;
}());
exports.default = TelemetryReporter;
//# sourceMappingURL=telemetryReporter.js.map