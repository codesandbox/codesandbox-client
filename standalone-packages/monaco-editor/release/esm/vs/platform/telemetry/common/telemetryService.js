/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { localize } from '../../../nls.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { optional } from '../../instantiation/common/instantiation.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { Extensions } from '../../configuration/common/configurationRegistry.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { cloneAndChange, mixin } from '../../../base/common/objects.js';
import { Registry } from '../../registry/common/platform.js';
var TelemetryService = /** @class */ (function () {
    function TelemetryService(config, _configurationService) {
        this._configurationService = _configurationService;
        this._disposables = [];
        this._cleanupPatterns = [];
        this._appender = config.appender;
        this._commonProperties = config.commonProperties || TPromise.as({});
        this._piiPaths = config.piiPaths || [];
        this._userOptIn = true;
        // static cleanup pattern for: `file:///DANGEROUS/PATH/resources/app/Useful/Information`
        this._cleanupPatterns = [/file:\/\/\/.*?\/resources\/app\//gi];
        for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
            var piiPath = _a[_i];
            this._cleanupPatterns.push(new RegExp(escapeRegExpCharacters(piiPath), 'gi'));
        }
        if (this._configurationService) {
            this._updateUserOptIn();
            this._configurationService.onDidChangeConfiguration(this._updateUserOptIn, this, this._disposables);
            /* __GDPR__
                "optInStatus" : {
                    "optIn" : { "classification": "SystemMetaData", "purpose": "BusinessInsight", "isMeasurement": true }
                }
            */
            this.publicLog('optInStatus', { optIn: this._userOptIn });
        }
    }
    TelemetryService.prototype._updateUserOptIn = function () {
        var config = this._configurationService.getValue(TELEMETRY_SECTION_ID);
        this._userOptIn = config ? config.enableTelemetry : this._userOptIn;
    };
    Object.defineProperty(TelemetryService.prototype, "isOptedIn", {
        get: function () {
            return this._userOptIn;
        },
        enumerable: true,
        configurable: true
    });
    TelemetryService.prototype.getTelemetryInfo = function () {
        return this._commonProperties.then(function (values) {
            // well known properties
            var sessionId = values['sessionID'];
            var instanceId = values['common.instanceId'];
            var machineId = values['common.machineId'];
            return { sessionId: sessionId, instanceId: instanceId, machineId: machineId };
        });
    };
    TelemetryService.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
    };
    TelemetryService.prototype.publicLog = function (eventName, data, anonymizeFilePaths) {
        var _this = this;
        // don't send events when the user is optout
        if (!this._userOptIn) {
            return TPromise.as(undefined);
        }
        return this._commonProperties.then(function (values) {
            // (first) add common properties
            data = mixin(data, values);
            // (last) remove all PII from data
            data = cloneAndChange(data, function (value) {
                if (typeof value === 'string') {
                    return _this._cleanupInfo(value, anonymizeFilePaths);
                }
                return undefined;
            });
            _this._appender.log(eventName, data);
        }, function (err) {
            // unsure what to do now...
            console.error(err);
        });
    };
    TelemetryService.prototype._cleanupInfo = function (stack, anonymizeFilePaths) {
        var updatedStack = stack;
        if (anonymizeFilePaths) {
            var cleanUpIndexes = [];
            for (var _i = 0, _a = this._cleanupPatterns; _i < _a.length; _i++) {
                var regexp = _a[_i];
                while (true) {
                    var result = regexp.exec(stack);
                    if (!result) {
                        break;
                    }
                    cleanUpIndexes.push([result.index, regexp.lastIndex]);
                }
            }
            var nodeModulesRegex = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
            var fileRegex = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
            var _loop_1 = function () {
                var result = fileRegex.exec(stack);
                if (!result) {
                    return "break";
                }
                // Anoynimize user file paths that do not need to be retained or cleaned up.
                if (!nodeModulesRegex.test(result[0]) && cleanUpIndexes.every(function (_a) {
                    var x = _a[0], y = _a[1];
                    return result.index < x || result.index >= y;
                })) {
                    updatedStack = updatedStack.slice(0, result.index) + result[0].replace(/./g, 'a') + updatedStack.slice(fileRegex.lastIndex);
                }
            };
            while (true) {
                var state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
        }
        // sanitize with configured cleanup patterns
        for (var _b = 0, _c = this._cleanupPatterns; _b < _c.length; _b++) {
            var regexp = _c[_b];
            updatedStack = updatedStack.replace(regexp, '');
        }
        return updatedStack;
    };
    TelemetryService.IDLE_START_EVENT_NAME = 'UserIdleStart';
    TelemetryService.IDLE_STOP_EVENT_NAME = 'UserIdleStop';
    TelemetryService = __decorate([
        __param(1, optional(IConfigurationService))
    ], TelemetryService);
    return TelemetryService;
}());
export { TelemetryService };
var TELEMETRY_SECTION_ID = 'telemetry';
Registry.as(Extensions.Configuration).registerConfiguration({
    'id': TELEMETRY_SECTION_ID,
    'order': 110,
    'type': 'object',
    'title': localize('telemetryConfigurationTitle', "Telemetry"),
    'properties': {
        'telemetry.enableTelemetry': {
            'type': 'boolean',
            'description': localize('telemetry.enableTelemetry', "Enable usage data and errors to be sent to a Microsoft online service."),
            'default': true,
            'tags': ['usesOnlineServices']
        }
    }
});
