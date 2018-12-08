/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../nls.js';
import { join } from '../../../path.js';
import { timeout } from '../../base/common/async.js';
import { CancellationTokenSource } from '../../base/common/cancellation.js';
import * as errors from '../../base/common/errors.js';
import { dispose } from '../../base/common/lifecycle.js';
import { Counter } from '../../base/common/numbers.js';
import { URI, setUriThrowOnMissingScheme } from '../../base/common/uri.js';
import * as pfs from '../../base/node/pfs.js';
import { MainContext } from '../api/node/extHost.protocol.js';
import { ExtHostConfiguration } from '../api/node/extHostConfiguration.js';
import { ExtensionActivatedByEvent } from '../api/node/extHostExtensionActivator.js';
import { ExtHostExtensionService } from '../api/node/extHostExtensionService.js';
import { ExtHostLogService } from '../api/node/extHostLogService.js';
import { ExtHostWorkspace } from '../api/node/extHostWorkspace.js';
import { RPCProtocol } from '../services/extensions/node/rpcProtocol.js';
// we don't (yet) throw when extensions parse
// uris that have no scheme
setUriThrowOnMissingScheme(false);
var nativeExit = process.exit.bind(process);
function patchProcess(allowExit) {
    process.exit = function (code) {
        if (allowExit) {
            exit(code);
        }
        else {
            var err = new Error('An extension called process.exit() and this was prevented.');
            console.warn(err.stack);
        }
    };
    process.crash = function () {
        var err = new Error('An extension called process.crash() and this was prevented.');
        console.warn(err.stack);
    };
}
export function exit(code) {
    nativeExit(code);
}
var ExtensionHostMain = /** @class */ (function () {
    function ExtensionHostMain(protocol, initData) {
        this._isTerminating = false;
        this.disposables = [];
        var uriTransformer = null;
        var rpcProtocol = new RPCProtocol(protocol, null, uriTransformer);
        // ensure URIs are transformed and revived
        initData = this.transform(initData, rpcProtocol);
        this._environment = initData.environment;
        this._workspace = initData.workspace;
        var allowExit = !!this._environment.extensionTestsPath; // to support other test frameworks like Jasmin that use process.exit (https://github.com/Microsoft/vscode/issues/37708)
        patchProcess(allowExit);
        // services
        this._extHostLogService = new ExtHostLogService(initData.logLevel, initData.logsLocation.fsPath);
        this.disposables.push(this._extHostLogService);
        this._searchRequestIdProvider = new Counter();
        var extHostWorkspace = new ExtHostWorkspace(rpcProtocol, initData.workspace, this._extHostLogService, this._searchRequestIdProvider);
        console.log('extension host started', initData);
        this._extHostLogService.info('extension host started');
        this._extHostLogService.trace('initData', initData);
        this._extHostConfiguration = new ExtHostConfiguration(rpcProtocol.getProxy(MainContext.MainThreadConfiguration), extHostWorkspace, initData.configuration);
        var mainThreadTelemetry = rpcProtocol.getProxy(MainContext.MainThreadTelemetry);
        this._extensionService = new ExtHostExtensionService(initData, rpcProtocol, extHostWorkspace, this._extHostConfiguration, this._extHostLogService, mainThreadTelemetry);
        // error forwarding and stack trace scanning
        Error.stackTraceLimit = 100; // increase number of stack frames (from 10, https://github.com/v8/v8/wiki/Stack-Trace-API)
        var extensionErrors = new WeakMap();
        this._extensionService.getExtensionPathIndex().then(function (map) {
            Error.prepareStackTrace = function (error, stackTrace) {
                var stackTraceMessage = '';
                var extension;
                var fileName;
                for (var _i = 0, stackTrace_1 = stackTrace; _i < stackTrace_1.length; _i++) {
                    var call = stackTrace_1[_i];
                    stackTraceMessage += "\n\tat " + call.toString();
                    fileName = call.getFileName();
                    if (!extension && fileName) {
                        extension = map.findSubstr(fileName);
                    }
                }
                extensionErrors.set(error, extension);
                return (error.name || 'Error') + ": " + (error.message || '') + stackTraceMessage;
            };
        });
        var mainThreadExtensions = rpcProtocol.getProxy(MainContext.MainThreadExtensionService);
        var mainThreadErrors = rpcProtocol.getProxy(MainContext.MainThreadErrors);
        errors.setUnexpectedErrorHandler(function (err) {
            var data = errors.transformErrorForSerialization(err);
            var extension = extensionErrors.get(err);
            if (extension) {
                mainThreadExtensions.$onExtensionRuntimeError(extension.id, data);
            }
            else {
                mainThreadErrors.$onUnexpectedError(data);
            }
        });
        this._mainThreadWorkspace = rpcProtocol.getProxy(MainContext.MainThreadWorkspace);
    }
    ExtensionHostMain.prototype.start = function () {
        var _this = this;
        return this._extensionService.onExtensionAPIReady()
            .then(function () { return _this.handleEagerExtensions(); })
            .then(function () { return _this.handleExtensionTests(); })
            .then(function () {
            _this._extHostLogService.info("eager extensions activated");
        });
    };
    ExtensionHostMain.prototype.terminate = function () {
        var _this = this;
        if (this._isTerminating) {
            // we are already shutting down...
            return;
        }
        this._isTerminating = true;
        this.disposables = dispose(this.disposables);
        errors.setUnexpectedErrorHandler(function (err) {
            // TODO: write to log once we have one
        });
        var allPromises = [];
        try {
            var allExtensions = this._extensionService.getAllExtensionDescriptions();
            var allExtensionsIds = allExtensions.map(function (ext) { return ext.id; });
            var activatedExtensions = allExtensionsIds.filter(function (id) { return _this._extensionService.isActivated(id); });
            allPromises = activatedExtensions.map(function (extensionId) {
                return _this._extensionService.deactivate(extensionId);
            });
        }
        catch (err) {
            // TODO: write to log once we have one
        }
        var extensionsDeactivated = Promise.all(allPromises).then(function () { return void 0; });
        // Give extensions 1 second to wrap up any async dispose, then exit
        setTimeout(function () {
            Promise.race([timeout(4000), extensionsDeactivated]).then(function () { return exit(); }, function () { return exit(); });
        }, 1000);
    };
    // Handle "eager" activation extensions
    ExtensionHostMain.prototype.handleEagerExtensions = function () {
        this._extensionService.activateByEvent('*', true).then(null, function (err) {
            console.error(err);
        });
        return this.handleWorkspaceContainsEagerExtensions();
    };
    ExtensionHostMain.prototype.handleWorkspaceContainsEagerExtensions = function () {
        var _this = this;
        if (!this._workspace || this._workspace.folders.length === 0) {
            return Promise.resolve(null);
        }
        return Promise.all(this._extensionService.getAllExtensionDescriptions().map(function (desc) {
            return _this.handleWorkspaceContainsEagerExtension(desc);
        })).then(function () { });
    };
    ExtensionHostMain.prototype.handleWorkspaceContainsEagerExtension = function (desc) {
        var _this = this;
        var activationEvents = desc.activationEvents;
        if (!activationEvents) {
            return Promise.resolve(void 0);
        }
        var fileNames = [];
        var globPatterns = [];
        for (var i = 0; i < activationEvents.length; i++) {
            if (/^workspaceContains:/.test(activationEvents[i])) {
                var fileNameOrGlob = activationEvents[i].substr('workspaceContains:'.length);
                if (fileNameOrGlob.indexOf('*') >= 0 || fileNameOrGlob.indexOf('?') >= 0) {
                    globPatterns.push(fileNameOrGlob);
                }
                else {
                    fileNames.push(fileNameOrGlob);
                }
            }
        }
        if (fileNames.length === 0 && globPatterns.length === 0) {
            return Promise.resolve(void 0);
        }
        var fileNamePromise = Promise.all(fileNames.map(function (fileName) { return _this.activateIfFileName(desc.id, fileName); })).then(function () { });
        var globPatternPromise = this.activateIfGlobPatterns(desc.id, globPatterns);
        return Promise.all([fileNamePromise, globPatternPromise]).then(function () { });
    };
    ExtensionHostMain.prototype.activateIfFileName = function (extensionId, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, uri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this._workspace.folders;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        uri = _a[_i].uri;
                        return [4 /*yield*/, pfs.exists(join(URI.revive(uri).fsPath, fileName))];
                    case 2:
                        if (_b.sent()) {
                            // the file was found
                            return [2 /*return*/, (this._extensionService.activateById(extensionId, new ExtensionActivatedByEvent(true, "workspaceContains:" + fileName))
                                    .then(null, function (err) { return console.error(err); }))];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    ExtensionHostMain.prototype.activateIfGlobPatterns = function (extensionId, globPatterns) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenSource, searchP, timer, exists, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._extHostLogService.trace("extensionHostMain#activateIfGlobPatterns: fileSearch, extension: " + extensionId + ", entryPoint: workspaceContains");
                        if (globPatterns.length === 0) {
                            return [2 /*return*/, Promise.resolve(void 0)];
                        }
                        tokenSource = new CancellationTokenSource();
                        searchP = this._mainThreadWorkspace.$checkExists(globPatterns, tokenSource.token);
                        timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                tokenSource.cancel();
                                this._extensionService.activateById(extensionId, new ExtensionActivatedByEvent(true, "workspaceContainsTimeout:" + globPatterns.join(',')))
                                    .then(null, function (err) { return console.error(err); });
                                return [2 /*return*/];
                            });
                        }); }, ExtensionHostMain.WORKSPACE_CONTAINS_TIMEOUT);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, searchP];
                    case 2:
                        exists = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (!errors.isPromiseCanceledError(err_1)) {
                            console.error(err_1);
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        tokenSource.dispose();
                        clearTimeout(timer);
                        if (exists) {
                            // a file was found matching one of the glob patterns
                            return [2 /*return*/, (this._extensionService.activateById(extensionId, new ExtensionActivatedByEvent(true, "workspaceContains:" + globPatterns.join(',')))
                                    .then(null, function (err) { return console.error(err); }))];
                        }
                        return [2 /*return*/, Promise.resolve(void 0)];
                }
            });
        });
    };
    ExtensionHostMain.prototype.handleExtensionTests = function () {
        var _this = this;
        if (!this._environment.extensionTestsPath || !this._environment.extensionDevelopmentLocationURI) {
            return Promise.resolve(null);
        }
        // Require the test runner via node require from the provided path
        var testRunner;
        var requireError;
        try {
            testRunner = require.__$__nodeRequire(this._environment.extensionTestsPath);
        }
        catch (error) {
            requireError = error;
        }
        // Execute the runner if it follows our spec
        if (testRunner && typeof testRunner.run === 'function') {
            return new Promise(function (c, e) {
                testRunner.run(_this._environment.extensionTestsPath, function (error, failures) {
                    if (error) {
                        e(error.toString());
                    }
                    else {
                        c(null);
                    }
                    // after tests have run, we shutdown the host
                    _this.gracefulExit(failures && failures > 0 ? 1 /* ERROR */ : 0 /* OK */);
                });
            });
        }
        // Otherwise make sure to shutdown anyway even in case of an error
        else {
            this.gracefulExit(1 /* ERROR */);
        }
        return Promise.reject(new Error(requireError ? requireError.toString() : nls.localize('extensionTestError', "Path {0} does not point to a valid extension test runner.", this._environment.extensionTestsPath)));
    };
    ExtensionHostMain.prototype.transform = function (initData, rpcProtocol) {
        initData.extensions.forEach(function (ext) { return ext.extensionLocation = URI.revive(rpcProtocol.transformIncomingURIs(ext.extensionLocation)); });
        initData.environment.appRoot = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.appRoot));
        initData.environment.appSettingsHome = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.appSettingsHome));
        initData.environment.extensionDevelopmentLocationURI = URI.revive(rpcProtocol.transformIncomingURIs(initData.environment.extensionDevelopmentLocationURI));
        initData.logsLocation = URI.revive(rpcProtocol.transformIncomingURIs(initData.logsLocation));
        initData.workspace = rpcProtocol.transformIncomingURIs(initData.workspace);
        return initData;
    };
    ExtensionHostMain.prototype.gracefulExit = function (code) {
        // to give the PH process a chance to flush any outstanding console
        // messages to the main process, we delay the exit() by some time
        setTimeout(function () { return exit(code); }, 500);
    };
    ExtensionHostMain.WORKSPACE_CONTAINS_TIMEOUT = 7000;
    return ExtensionHostMain;
}());
export { ExtensionHostMain };
