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
import * as dom from '../../../base/browser/dom.js';
import { parse } from '../../../base/common/marshalling.js';
import { Schemas } from '../../../base/common/network.js';
import * as resources from '../../../base/common/resources.js';
import { ICodeEditorService } from './codeEditorService.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
import { optional } from '../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../platform/telemetry/common/telemetryUtils.js';
var OpenerService = /** @class */ (function () {
    function OpenerService(_editorService, _commandService, _telemetryService) {
        if (_telemetryService === void 0) { _telemetryService = NullTelemetryService; }
        this._editorService = _editorService;
        this._commandService = _commandService;
        this._telemetryService = _telemetryService;
        //
    }
    OpenerService.prototype.open = function (resource, options) {
        var _a;
        if (this._telemetryService) {
            /* __GDPR__
                "openerService" : {
                    "scheme" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            this._telemetryService.publicLog('openerService', { scheme: resource.scheme });
        }
        var scheme = resource.scheme, path = resource.path, query = resource.query, fragment = resource.fragment;
        var promise = undefined;
        if (scheme === Schemas.http || scheme === Schemas.https || scheme === Schemas.mailto) {
            // open http or default mail application
            dom.windowOpenNoOpener(resource.toString(true));
        }
        else if (scheme === 'command' && CommandsRegistry.getCommand(path)) {
            // execute as command
            var args = [];
            try {
                args = parse(query);
                if (!Array.isArray(args)) {
                    args = [args];
                }
            }
            catch (e) {
                //
            }
            promise = (_a = this._commandService).executeCommand.apply(_a, [path].concat(args));
        }
        else {
            var selection = undefined;
            var match = /^L?(\d+)(?:,(\d+))?/.exec(fragment);
            if (match) {
                // support file:///some/file.js#73,84
                // support file:///some/file.js#L73
                selection = {
                    startLineNumber: parseInt(match[1]),
                    startColumn: match[2] ? parseInt(match[2]) : 1
                };
                // remove fragment
                resource = resource.with({ fragment: '' });
            }
            if (!resource.scheme) {
                // we cannot handle those
                return Promise.resolve(undefined);
            }
            else if (resource.scheme === Schemas.file) {
                resource = resources.normalizePath(resource); // workaround for non-normalized paths (https://github.com/Microsoft/vscode/issues/12954)
            }
            promise = this._editorService.openCodeEditor({ resource: resource, options: { selection: selection, } }, this._editorService.getFocusedCodeEditor(), options && options.openToSide);
        }
        return Promise.resolve(promise);
    };
    OpenerService = __decorate([
        __param(0, ICodeEditorService),
        __param(1, ICommandService),
        __param(2, optional(ITelemetryService))
    ], OpenerService);
    return OpenerService;
}());
export { OpenerService };
