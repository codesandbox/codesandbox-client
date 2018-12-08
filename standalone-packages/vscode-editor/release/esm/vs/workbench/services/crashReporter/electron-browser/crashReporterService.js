/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls.js';
import { assign, deepClone } from '../../../../base/common/objects.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWindowsService } from '../../../../platform/windows/common/windows.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { crashReporter } from '../../../../../electron.js';
import product from '../../../../platform/node/product.js';
import pkg from '../../../../platform/node/package.js';
import * as os from '../../../../../os.js';
import { isWindows, isMacintosh, isLinux } from '../../../../base/common/platform.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
export var ICrashReporterService = createDecorator('crashReporterService');
export var TELEMETRY_SECTION_ID = 'telemetry';
var configurationRegistry = Registry.as(Extensions.Configuration);
configurationRegistry.registerConfiguration({
    'id': TELEMETRY_SECTION_ID,
    'order': 110,
    title: nls.localize('telemetryConfigurationTitle', "Telemetry"),
    'type': 'object',
    'properties': {
        'telemetry.enableCrashReporter': {
            'type': 'boolean',
            'description': nls.localize('telemetry.enableCrashReporting', "Enable crash reports to be sent to a Microsoft online service. \nThis option requires restart to take effect."),
            'default': true,
            'tags': ['usesOnlineServices']
        }
    }
});
export var NullCrashReporterService = {
    _serviceBrand: undefined,
    getChildProcessStartOptions: function (processName) { return undefined; }
};
var CrashReporterService = /** @class */ (function () {
    function CrashReporterService(telemetryService, windowsService, configurationService) {
        this.telemetryService = telemetryService;
        this.windowsService = windowsService;
        var config = configurationService.getValue(TELEMETRY_SECTION_ID);
        this.isEnabled = !!config.enableCrashReporter;
        if (this.isEnabled) {
            this.startCrashReporter();
        }
    }
    CrashReporterService.prototype.startCrashReporter = function () {
        var _this = this;
        // base options with product info
        this.options = {
            companyName: product.crashReporter.companyName,
            productName: product.crashReporter.productName,
            submitURL: this.getSubmitURL(),
            extra: {
                vscode_version: pkg.version,
                vscode_commit: product.commit
            }
        };
        // mixin telemetry info
        this.telemetryService.getTelemetryInfo()
            .then(function (info) {
            assign(_this.options.extra, {
                vscode_sessionId: info.sessionId
            });
            // start crash reporter right here
            crashReporter.start(deepClone(_this.options));
            // start crash reporter in the main process
            return _this.windowsService.startCrashReporter(_this.options);
        });
    };
    CrashReporterService.prototype.getSubmitURL = function () {
        if (isWindows) {
            return product.hockeyApp["win32-" + process.arch];
        }
        else if (isMacintosh) {
            return product.hockeyApp.darwin;
        }
        else if (isLinux) {
            return product.hockeyApp["linux-" + process.arch];
        }
        throw new Error('Unknown platform');
    };
    CrashReporterService.prototype.getChildProcessStartOptions = function (name) {
        // Experimental crash reporting support for child processes on Mac only for now
        if (this.isEnabled && isMacintosh) {
            var childProcessOptions = deepClone(this.options);
            childProcessOptions.extra.processName = name;
            childProcessOptions.crashesDirectory = os.tmpdir();
            return childProcessOptions;
        }
        return void 0;
    };
    CrashReporterService = __decorate([
        __param(0, ITelemetryService),
        __param(1, IWindowsService),
        __param(2, IConfigurationService)
    ], CrashReporterService);
    return CrashReporterService;
}());
export { CrashReporterService };
