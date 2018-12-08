/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
import * as nls from '../../../../nls.js';
import * as os from '../../../../../os.js';
import * as path from '../../../../../path.js';
import { getPathFromAmdModule } from '../../../../base/common/amd.js';
import { isFalsyOrEmpty } from '../../../../base/common/arrays.js';
import { Barrier, runWhenIdle } from '../../../../base/common/async.js';
import * as errors from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as objects from '../../../../base/common/objects.js';
import * as perf from '../../../../base/common/performance.js';
import * as platform from '../../../../base/common/platform.js';
import { fsPath, isEqualOrParent } from '../../../../base/common/resources.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import * as pfs from '../../../../base/node/pfs.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IExtensionEnablementService, IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { BetterMergeDisabledNowKey, BetterMergeId, areSameExtensions, getGalleryExtensionIdFromLocal } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { BUILTIN_MANIFEST_CACHE_FILE, MANIFEST_CACHE_FOLDER, USER_MANIFEST_CACHE_FILE } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import pkg from '../../../../platform/node/package.js';
import product from '../../../../platform/node/product.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWindowService, IWindowsService } from '../../../../platform/windows/common/windows.js';
import { ExtHostCustomersRegistry } from '../../../api/electron-browser/extHostCustomers.js';
import { ExtHostContext, MainContext } from '../../../api/node/extHost.protocol.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { ActivationTimes, ExtensionPointContribution } from '../common/extensions.js';
import { ExtensionMessageCollector, ExtensionsRegistry, schema } from '../common/extensionsRegistry.js';
import { ExtensionHostProcessWorker } from './extensionHost.js';
import { ExtensionHostProfiler } from './extensionHostProfiler.js';
import { RuntimeExtensionsInput } from './runtimeExtensionsInput.js';
import { ExtensionDescriptionRegistry } from '../node/extensionDescriptionRegistry.js';
import { ExtensionScanner, ExtensionScannerInput } from '../node/extensionPoints.js';
import { RPCProtocol } from '../node/rpcProtocol.js';
// Enable to see detailed message communication between window and extension host
var LOG_EXTENSION_HOST_COMMUNICATION = false;
var LOG_USE_COLORS = true;
var _SystemExtensionsRoot = null;
function getSystemExtensionsRoot() {
    if (!_SystemExtensionsRoot) {
        _SystemExtensionsRoot = path.normalize(path.join(getPathFromAmdModule(require, ''), '..', 'extensions'));
    }
    return _SystemExtensionsRoot;
}
var _ExtraDevSystemExtensionsRoot = null;
function getExtraDevSystemExtensionsRoot() {
    if (!_ExtraDevSystemExtensionsRoot) {
        _ExtraDevSystemExtensionsRoot = path.normalize(path.join(getPathFromAmdModule(require, ''), '..', '.build', 'builtInExtensions'));
    }
    return _ExtraDevSystemExtensionsRoot;
}
var ExtraBuiltInExtensionResolver = /** @class */ (function () {
    function ExtraBuiltInExtensionResolver(builtInExtensions, control) {
        this.builtInExtensions = builtInExtensions;
        this.control = control;
    }
    ExtraBuiltInExtensionResolver.prototype.resolveExtensions = function () {
        var result = [];
        for (var _i = 0, _a = this.builtInExtensions; _i < _a.length; _i++) {
            var ext = _a[_i];
            var controlState = this.control[ext.name] || 'marketplace';
            switch (controlState) {
                case 'disabled':
                    break;
                case 'marketplace':
                    result.push({ name: ext.name, path: path.join(getExtraDevSystemExtensionsRoot(), ext.name) });
                    break;
                default:
                    result.push({ name: ext.name, path: controlState });
                    break;
            }
        }
        return Promise.resolve(result);
    };
    return ExtraBuiltInExtensionResolver;
}());
function messageWithSource(source, message) {
    if (source) {
        return "[" + source + "]: " + message;
    }
    return message;
}
var hasOwnProperty = Object.hasOwnProperty;
var NO_OP_VOID_PROMISE = Promise.resolve(void 0);
var ExtensionHostProcessManager = /** @class */ (function (_super) {
    __extends(ExtensionHostProcessManager, _super);
    function ExtensionHostProcessManager(extensionHostProcessWorker, _remoteAuthority, initialActivationEvents, _instantiationService, _environmentService) {
        var _this = _super.call(this) || this;
        _this._remoteAuthority = _remoteAuthority;
        _this._instantiationService = _instantiationService;
        _this._environmentService = _environmentService;
        _this._onDidChangeResponsiveState = _this._register(new Emitter());
        _this.onDidChangeResponsiveState = _this._onDidChangeResponsiveState.event;
        _this._extensionHostProcessFinishedActivateEvents = Object.create(null);
        _this._extensionHostProcessRPCProtocol = null;
        _this._extensionHostProcessCustomers = [];
        _this._extensionHostProcessWorker = extensionHostProcessWorker;
        _this.onDidCrash = _this._extensionHostProcessWorker.onCrashed;
        _this._extensionHostProcessProxy = _this._extensionHostProcessWorker.start().then(function (protocol) {
            return { value: _this._createExtensionHostCustomers(protocol) };
        }, function (err) {
            console.error('Error received from starting extension host');
            console.error(err);
            return null;
        });
        _this._extensionHostProcessProxy.then(function () {
            initialActivationEvents.forEach(function (activationEvent) { return _this.activateByEvent(activationEvent); });
        });
        return _this;
    }
    ExtensionHostProcessManager.prototype.dispose = function () {
        if (this._extensionHostProcessWorker) {
            this._extensionHostProcessWorker.dispose();
        }
        if (this._extensionHostProcessRPCProtocol) {
            this._extensionHostProcessRPCProtocol.dispose();
        }
        for (var i = 0, len = this._extensionHostProcessCustomers.length; i < len; i++) {
            var customer = this._extensionHostProcessCustomers[i];
            try {
                customer.dispose();
            }
            catch (err) {
                errors.onUnexpectedError(err);
            }
        }
        this._extensionHostProcessProxy = null;
        _super.prototype.dispose.call(this);
    };
    ExtensionHostProcessManager.prototype.canProfileExtensionHost = function () {
        return this._extensionHostProcessWorker && Boolean(this._extensionHostProcessWorker.getInspectPort());
    };
    ExtensionHostProcessManager.prototype._createExtensionHostCustomers = function (protocol) {
        var _this = this;
        var logger = null;
        if (LOG_EXTENSION_HOST_COMMUNICATION || this._environmentService.logExtensionHostCommunication) {
            logger = new RPCLogger();
        }
        this._extensionHostProcessRPCProtocol = new RPCProtocol(protocol, logger);
        this._register(this._extensionHostProcessRPCProtocol.onDidChangeResponsiveState(function (responsiveState) { return _this._onDidChangeResponsiveState.fire(responsiveState); }));
        var extHostContext = {
            remoteAuthority: this._remoteAuthority,
            getProxy: function (identifier) { return _this._extensionHostProcessRPCProtocol.getProxy(identifier); },
            set: function (identifier, instance) { return _this._extensionHostProcessRPCProtocol.set(identifier, instance); },
            assertRegistered: function (identifiers) { return _this._extensionHostProcessRPCProtocol.assertRegistered(identifiers); },
        };
        // Named customers
        var namedCustomers = ExtHostCustomersRegistry.getNamedCustomers();
        for (var i = 0, len = namedCustomers.length; i < len; i++) {
            var _a = namedCustomers[i], id = _a[0], ctor = _a[1];
            var instance = this._instantiationService.createInstance(ctor, extHostContext);
            this._extensionHostProcessCustomers.push(instance);
            this._extensionHostProcessRPCProtocol.set(id, instance);
        }
        // Customers
        var customers = ExtHostCustomersRegistry.getCustomers();
        for (var i = 0, len = customers.length; i < len; i++) {
            var ctor = customers[i];
            var instance = this._instantiationService.createInstance(ctor, extHostContext);
            this._extensionHostProcessCustomers.push(instance);
        }
        // Check that no named customers are missing
        var expected = Object.keys(MainContext).map(function (key) { return MainContext[key]; });
        this._extensionHostProcessRPCProtocol.assertRegistered(expected);
        return this._extensionHostProcessRPCProtocol.getProxy(ExtHostContext.ExtHostExtensionService);
    };
    ExtensionHostProcessManager.prototype.activateByEvent = function (activationEvent) {
        var _this = this;
        if (this._extensionHostProcessFinishedActivateEvents[activationEvent] || !this._extensionHostProcessProxy) {
            return NO_OP_VOID_PROMISE;
        }
        return this._extensionHostProcessProxy.then(function (proxy) {
            if (!proxy) {
                // this case is already covered above and logged.
                // i.e. the extension host could not be started
                return NO_OP_VOID_PROMISE;
            }
            return proxy.value.$activateByEvent(activationEvent);
        }).then(function () {
            _this._extensionHostProcessFinishedActivateEvents[activationEvent] = true;
        });
    };
    ExtensionHostProcessManager.prototype.startExtensionHostProfile = function () {
        if (this._extensionHostProcessWorker) {
            var port = this._extensionHostProcessWorker.getInspectPort();
            if (port) {
                return this._instantiationService.createInstance(ExtensionHostProfiler, port).start();
            }
        }
        throw new Error('Extension host not running or no inspect port available');
    };
    ExtensionHostProcessManager.prototype.getInspectPort = function () {
        if (this._extensionHostProcessWorker) {
            var port = this._extensionHostProcessWorker.getInspectPort();
            if (port) {
                return port;
            }
        }
        return 0;
    };
    ExtensionHostProcessManager = __decorate([
        __param(3, IInstantiationService),
        __param(4, IEnvironmentService)
    ], ExtensionHostProcessManager);
    return ExtensionHostProcessManager;
}(Disposable));
export { ExtensionHostProcessManager };
schema.properties.engines.properties.vscode.default = "^" + pkg.version;
var ExtensionService = /** @class */ (function (_super) {
    __extends(ExtensionService, _super);
    function ExtensionService(_instantiationService, _notificationService, _environmentService, _telemetryService, _extensionEnablementService, _storageService, _windowService, lifecycleService, extensionManagementService) {
        var _this = _super.call(this) || this;
        _this._instantiationService = _instantiationService;
        _this._notificationService = _notificationService;
        _this._environmentService = _environmentService;
        _this._telemetryService = _telemetryService;
        _this._extensionEnablementService = _extensionEnablementService;
        _this._storageService = _storageService;
        _this._windowService = _windowService;
        _this.extensionManagementService = extensionManagementService;
        _this._onDidChangeExtensionsStatus = _this._register(new Emitter());
        _this.onDidChangeExtensionsStatus = _this._onDidChangeExtensionsStatus.event;
        _this._onWillActivateByEvent = new Emitter();
        _this.onWillActivateByEvent = _this._onWillActivateByEvent.event;
        _this._onDidChangeResponsiveChange = new Emitter();
        _this.onDidChangeResponsiveChange = _this._onDidChangeResponsiveChange.event;
        _this._extensionHostLogsLocation = URI.file(path.posix.join(_this._environmentService.logsPath, "exthost" + _this._windowService.getCurrentWindowId()));
        _this._registry = null;
        _this._installedExtensionsReady = new Barrier();
        _this._isDev = !_this._environmentService.isBuilt || _this._environmentService.isExtensionDevelopment;
        _this._extensionsMessages = {};
        _this._allRequestedActivateEvents = Object.create(null);
        _this._onDidRegisterExtensions = new Emitter();
        _this._unresponsiveNotificationHandle = null;
        _this._extensionHostProcessManagers = [];
        _this._extensionHostProcessActivationTimes = Object.create(null);
        _this._extensionHostExtensionRuntimeErrors = Object.create(null);
        _this._startDelayed(lifecycleService);
        if (_this._extensionEnablementService.allUserExtensionsDisabled) {
            _this._notificationService.prompt(Severity.Info, nls.localize('extensionsDisabled', "All installed extensions are temporarily disabled. Reload the window to return to the previous state."), [{
                    label: nls.localize('Reload', "Reload"),
                    run: function () {
                        _this._windowService.reloadWindow();
                    }
                }]);
        }
        return _this;
    }
    ExtensionService.prototype._startDelayed = function (lifecycleService) {
        var _this = this;
        // delay extension host creation and extension scanning
        // until the workbench is restoring. we cannot defer the
        // extension host more (LifecyclePhase.Running) because
        // some editors require the extension host to restore
        // and this would result in a deadlock
        // see https://github.com/Microsoft/vscode/issues/41322
        lifecycleService.when(2 /* Restoring */).then(function () {
            // reschedule to ensure this runs after restoring viewlets, panels, and editors
            runWhenIdle(function () {
                perf.mark('willLoadExtensions');
                _this._scanAndHandleExtensions();
                _this._startExtensionHostProcess([]);
                _this.whenInstalledExtensionsRegistered().then(function () { return perf.mark('didLoadExtensions'); });
            }, 50 /*max delay*/);
        });
    };
    ExtensionService.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._onWillActivateByEvent.dispose();
        this._onDidChangeResponsiveChange.dispose();
    };
    Object.defineProperty(ExtensionService.prototype, "onDidRegisterExtensions", {
        get: function () {
            return this._onDidRegisterExtensions.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtensionService.prototype.restartExtensionHost = function () {
        this._stopExtensionHostProcess();
        this._startExtensionHostProcess(Object.keys(this._allRequestedActivateEvents));
    };
    ExtensionService.prototype.startExtensionHost = function () {
        this._startExtensionHostProcess(Object.keys(this._allRequestedActivateEvents));
    };
    ExtensionService.prototype.stopExtensionHost = function () {
        this._stopExtensionHostProcess();
    };
    ExtensionService.prototype._stopExtensionHostProcess = function () {
        var previouslyActivatedExtensionIds = Object.keys(this._extensionHostProcessActivationTimes);
        for (var i = 0; i < this._extensionHostProcessManagers.length; i++) {
            this._extensionHostProcessManagers[i].dispose();
        }
        this._extensionHostProcessManagers = [];
        this._extensionHostProcessActivationTimes = Object.create(null);
        this._extensionHostExtensionRuntimeErrors = Object.create(null);
        if (previouslyActivatedExtensionIds.length > 0) {
            this._onDidChangeExtensionsStatus.fire(previouslyActivatedExtensionIds);
        }
    };
    ExtensionService.prototype._startExtensionHostProcess = function (initialActivationEvents) {
        var _this = this;
        this._stopExtensionHostProcess();
        var extHostProcessWorker = this._instantiationService.createInstance(ExtensionHostProcessWorker, this.getExtensions(), this._extensionHostLogsLocation);
        var extHostProcessManager = this._instantiationService.createInstance(ExtensionHostProcessManager, extHostProcessWorker, null, initialActivationEvents);
        extHostProcessManager.onDidCrash(function (_a) {
            var code = _a[0], signal = _a[1];
            return _this._onExtensionHostCrashed(code, signal);
        });
        extHostProcessManager.onDidChangeResponsiveState(function (responsiveState) { return _this._onResponsiveStateChanged(responsiveState, extHostProcessManager); });
        this._extensionHostProcessManagers.push(extHostProcessManager);
    };
    ExtensionService.prototype._onExtensionHostCrashed = function (code, signal) {
        var _this = this;
        console.error('Extension host terminated unexpectedly. Code: ', code, ' Signal: ', signal);
        this._stopExtensionHostProcess();
        if (code === 55) {
            this._notificationService.prompt(Severity.Error, nls.localize('extensionHostProcess.versionMismatchCrash', "Extension host cannot start: version mismatch."), [{
                    label: nls.localize('relaunch', "Relaunch VS Code"),
                    run: function () {
                        _this._instantiationService.invokeFunction(function (accessor) {
                            var windowsService = accessor.get(IWindowsService);
                            windowsService.relaunch({});
                        });
                    }
                }]);
            return;
        }
        var message = nls.localize('extensionHostProcess.crash', "Extension host terminated unexpectedly.");
        if (code === 87) {
            message = nls.localize('extensionHostProcess.unresponsiveCrash', "Extension host terminated because it was not responsive.");
        }
        this._notificationService.prompt(Severity.Error, message, [{
                label: nls.localize('devTools', "Open Developer Tools"),
                run: function () { return _this._windowService.openDevTools(); }
            },
            {
                label: nls.localize('restart', "Restart Extension Host"),
                run: function () { return _this._startExtensionHostProcess(Object.keys(_this._allRequestedActivateEvents)); }
            }]);
    };
    ExtensionService.prototype._onResponsiveStateChanged = function (state, manager) {
        var _this = this;
        // fire an event when an extension host is changing its state.
        this._onDidChangeResponsiveChange.fire({
            target: manager,
            isResponsive: state === 0 /* Responsive */
        });
        // Do not show the notification anymore
        // See https://github.com/Microsoft/vscode/issues/60318
        var DISABLE_PROMPT = true;
        if (this._isDev || DISABLE_PROMPT) {
            return; // do not show any notification when developing an extension (https://github.com/Microsoft/vscode/issues/59251)
        }
        if (this._unresponsiveNotificationHandle) {
            this._unresponsiveNotificationHandle.close();
            this._unresponsiveNotificationHandle = null;
        }
        var showRunningExtensions = {
            keepOpen: true,
            label: nls.localize('extensionHostProcess.unresponsive.inspect', "Show running extensions"),
            run: function () {
                _this._instantiationService.invokeFunction(function (accessor) {
                    var editorService = accessor.get(IEditorService);
                    editorService.openEditor(_this._instantiationService.createInstance(RuntimeExtensionsInput), { revealIfOpened: true });
                });
            }
        };
        var restartExtensionHost = {
            label: nls.localize('extensionHostProcess.unresponsive.restart', "Restart Extension Host"),
            run: function () {
                _this.restartExtensionHost();
            }
        };
        if (state === 1 /* Unresponsive */) {
            this._unresponsiveNotificationHandle = this._notificationService.prompt(Severity.Warning, nls.localize('extensionHostProcess.unresponsive', "Extension Host is unresponsive."), [showRunningExtensions, restartExtensionHost]);
        }
        else {
            this._unresponsiveNotificationHandle = this._notificationService.prompt(Severity.Info, nls.localize('extensionHostProcess.responsive', "Extension Host is now responsive."), [showRunningExtensions]);
        }
    };
    // ---- begin IExtensionService
    ExtensionService.prototype.activateByEvent = function (activationEvent) {
        var _this = this;
        if (this._installedExtensionsReady.isOpen()) {
            // Extensions have been scanned and interpreted
            if (!this._registry.containsActivationEvent(activationEvent)) {
                // There is no extension that is interested in this activation event
                return NO_OP_VOID_PROMISE;
            }
            // Record the fact that this activationEvent was requested (in case of a restart)
            this._allRequestedActivateEvents[activationEvent] = true;
            return this._activateByEvent(activationEvent);
        }
        else {
            // Extensions have not been scanned yet.
            // Record the fact that this activationEvent was requested (in case of a restart)
            this._allRequestedActivateEvents[activationEvent] = true;
            return this._installedExtensionsReady.wait().then(function () { return _this._activateByEvent(activationEvent); });
        }
    };
    ExtensionService.prototype._activateByEvent = function (activationEvent) {
        var result = Promise.all(this._extensionHostProcessManagers.map(function (extHostManager) { return extHostManager.activateByEvent(activationEvent); })).then(function () { });
        this._onWillActivateByEvent.fire({
            event: activationEvent,
            activation: result
        });
        return result;
    };
    ExtensionService.prototype.whenInstalledExtensionsRegistered = function () {
        return this._installedExtensionsReady.wait();
    };
    ExtensionService.prototype.getExtensions = function () {
        var _this = this;
        return this._installedExtensionsReady.wait().then(function () {
            return _this._registry.getAllExtensionDescriptions();
        });
    };
    ExtensionService.prototype.readExtensionPointContributions = function (extPoint) {
        var _this = this;
        return this._installedExtensionsReady.wait().then(function () {
            var availableExtensions = _this._registry.getAllExtensionDescriptions();
            var result = [], resultLen = 0;
            for (var i = 0, len = availableExtensions.length; i < len; i++) {
                var desc = availableExtensions[i];
                if (desc.contributes && hasOwnProperty.call(desc.contributes, extPoint.name)) {
                    result[resultLen++] = new ExtensionPointContribution(desc, desc.contributes[extPoint.name]);
                }
            }
            return result;
        });
    };
    ExtensionService.prototype.getExtensionsStatus = function () {
        var result = Object.create(null);
        if (this._registry) {
            var extensions = this._registry.getAllExtensionDescriptions();
            for (var i = 0, len = extensions.length; i < len; i++) {
                var extension = extensions[i];
                var id = extension.id;
                result[id] = {
                    messages: this._extensionsMessages[id],
                    activationTimes: this._extensionHostProcessActivationTimes[id],
                    runtimeErrors: this._extensionHostExtensionRuntimeErrors[id],
                };
            }
        }
        return result;
    };
    ExtensionService.prototype.canProfileExtensionHost = function () {
        for (var i = 0, len = this._extensionHostProcessManagers.length; i < len; i++) {
            var extHostProcessManager = this._extensionHostProcessManagers[i];
            if (extHostProcessManager.canProfileExtensionHost()) {
                return true;
            }
        }
        return false;
    };
    ExtensionService.prototype.startExtensionHostProfile = function () {
        for (var i = 0, len = this._extensionHostProcessManagers.length; i < len; i++) {
            var extHostProcessManager = this._extensionHostProcessManagers[i];
            if (extHostProcessManager.canProfileExtensionHost()) {
                return extHostProcessManager.startExtensionHostProfile();
            }
        }
        throw new Error('Extension host not running or no inspect port available');
    };
    ExtensionService.prototype.getInspectPort = function () {
        if (this._extensionHostProcessManagers.length > 0) {
            return this._extensionHostProcessManagers[0].getInspectPort();
        }
        return 0;
    };
    // ---- end IExtensionService
    // --- impl
    ExtensionService.prototype._scanAndHandleExtensions = function () {
        var _this = this;
        this._scanExtensions()
            .then(function (allExtensions) { return _this._getRuntimeExtensions(allExtensions); })
            .then(function (allExtensions) {
            _this._registry = new ExtensionDescriptionRegistry(allExtensions);
            var availableExtensions = _this._registry.getAllExtensionDescriptions();
            var extensionPoints = ExtensionsRegistry.getExtensionPoints();
            var messageHandler = function (msg) { return _this._handleExtensionPointMessage(msg); };
            for (var i = 0, len = extensionPoints.length; i < len; i++) {
                ExtensionService._handleExtensionPoint(extensionPoints[i], availableExtensions, messageHandler);
            }
            perf.mark('extensionHostReady');
            _this._installedExtensionsReady.open();
            _this._onDidRegisterExtensions.fire(void 0);
            _this._onDidChangeExtensionsStatus.fire(availableExtensions.map(function (e) { return e.id; }));
        });
    };
    ExtensionService.prototype._scanExtensions = function () {
        var _this = this;
        var log = new Logger(function (severity, source, message) {
            _this._logOrShowMessage(severity, _this._isDev ? messageWithSource(source, message) : message);
        });
        return ExtensionService._scanInstalledExtensions(this._windowService, this._notificationService, this._environmentService, this._extensionEnablementService, log)
            .then(function (_a) {
            var system = _a.system, user = _a.user, development = _a.development;
            var result = {};
            system.forEach(function (systemExtension) {
                result[systemExtension.id] = systemExtension;
            });
            user.forEach(function (userExtension) {
                if (result.hasOwnProperty(userExtension.id)) {
                    log.warn(userExtension.extensionLocation.fsPath, nls.localize('overwritingExtension', "Overwriting extension {0} with {1}.", result[userExtension.id].extensionLocation.fsPath, userExtension.extensionLocation.fsPath));
                }
                result[userExtension.id] = userExtension;
            });
            development.forEach(function (developedExtension) {
                log.info('', nls.localize('extensionUnderDevelopment', "Loading development extension at {0}", developedExtension.extensionLocation.fsPath));
                if (result.hasOwnProperty(developedExtension.id)) {
                    log.warn(developedExtension.extensionLocation.fsPath, nls.localize('overwritingExtension', "Overwriting extension {0} with {1}.", result[developedExtension.id].extensionLocation.fsPath, developedExtension.extensionLocation.fsPath));
                }
                result[developedExtension.id] = developedExtension;
            });
            return Object.keys(result).map(function (name) { return result[name]; });
        });
    };
    ExtensionService.prototype._getRuntimeExtensions = function (allExtensions) {
        var _this = this;
        return this._extensionEnablementService.getDisabledExtensions()
            .then(function (disabledExtensions) {
            var result = {};
            var extensionsToDisable = [];
            var userMigratedSystemExtensions = [{ id: BetterMergeId }];
            var enableProposedApiFor = _this._environmentService.args['enable-proposed-api'] || [];
            var notFound = function (id) { return nls.localize('notFound', "Extension \`{0}\` cannot use PROPOSED API as it cannot be found", id); };
            if (enableProposedApiFor.length) {
                var allProposed = (enableProposedApiFor instanceof Array ? enableProposedApiFor : [enableProposedApiFor]);
                allProposed.forEach(function (id) {
                    if (!allExtensions.some(function (description) { return description.id === id; })) {
                        console.error(notFound(id));
                    }
                });
            }
            var enableProposedApiForAll = !_this._environmentService.isBuilt ||
                (!!_this._environmentService.extensionDevelopmentLocationURI && product.nameLong.indexOf('Insiders') >= 0) ||
                (enableProposedApiFor.length === 0 && 'enable-proposed-api' in _this._environmentService.args);
            var _loop_1 = function (extension) {
                var isExtensionUnderDevelopment = _this._environmentService.isExtensionDevelopment && isEqualOrParent(extension.extensionLocation, _this._environmentService.extensionDevelopmentLocationURI);
                // Do not disable extensions under development
                if (!isExtensionUnderDevelopment) {
                    if (disabledExtensions.some(function (disabled) { return areSameExtensions(disabled, extension); })) {
                        return "continue";
                    }
                }
                if (!extension.isBuiltin) {
                    // Check if the extension is changed to system extension
                    var userMigratedSystemExtension = userMigratedSystemExtensions.filter(function (userMigratedSystemExtension) { return areSameExtensions(userMigratedSystemExtension, { id: extension.id }); })[0];
                    if (userMigratedSystemExtension) {
                        extensionsToDisable.push(userMigratedSystemExtension);
                        return "continue";
                    }
                }
                result[extension.id] = _this._updateEnableProposedApi(extension, enableProposedApiForAll, enableProposedApiFor);
            };
            for (var _i = 0, allExtensions_1 = allExtensions; _i < allExtensions_1.length; _i++) {
                var extension = allExtensions_1[_i];
                _loop_1(extension);
            }
            var runtimeExtensions = Object.keys(result).map(function (name) { return result[name]; });
            _this._telemetryService.publicLog('extensionsScanned', {
                totalCount: runtimeExtensions.length,
                disabledCount: disabledExtensions.length
            });
            if (extensionsToDisable.length) {
                return _this.extensionManagementService.getInstalled(1 /* User */)
                    .then(function (installed) {
                    var toDisable = installed.filter(function (i) { return extensionsToDisable.some(function (e) { return areSameExtensions({ id: getGalleryExtensionIdFromLocal(i) }, e); }); });
                    return Promise.all(toDisable.map(function (e) { return _this._extensionEnablementService.setEnablement(e, 0 /* Disabled */); }));
                })
                    .then(function () {
                    _this._storageService.store(BetterMergeDisabledNowKey, true, 0 /* GLOBAL */);
                    return runtimeExtensions;
                });
            }
            else {
                return runtimeExtensions;
            }
        });
    };
    ExtensionService.prototype._updateEnableProposedApi = function (extension, enableProposedApiForAll, enableProposedApiFor) {
        if (!isFalsyOrEmpty(product.extensionAllowedProposedApi)
            && product.extensionAllowedProposedApi.indexOf(extension.id) >= 0) {
            // fast lane -> proposed api is available to all extensions
            // that are listed in product.json-files
            extension.enableProposedApi = true;
        }
        else if (extension.enableProposedApi && !extension.isBuiltin) {
            if (!enableProposedApiForAll &&
                enableProposedApiFor.indexOf(extension.id) < 0) {
                extension.enableProposedApi = false;
                console.error("Extension '" + extension.id + " cannot use PROPOSED API (must started out of dev or enabled via --enable-proposed-api)");
            }
            else {
                // proposed api is available when developing or when an extension was explicitly
                // spelled out via a command line argument
                console.warn("Extension '" + extension.id + "' uses PROPOSED API which is subject to change and removal without notice.");
            }
        }
        return extension;
    };
    ExtensionService.prototype._handleExtensionPointMessage = function (msg) {
        if (!this._extensionsMessages[msg.extensionId]) {
            this._extensionsMessages[msg.extensionId] = [];
        }
        this._extensionsMessages[msg.extensionId].push(msg);
        var extension = this._registry.getExtensionDescription(msg.extensionId);
        var strMsg = "[" + msg.extensionId + "]: " + msg.message;
        if (extension && extension.isUnderDevelopment) {
            // This message is about the extension currently being developed
            this._showMessageToUser(msg.type, strMsg);
        }
        else {
            this._logMessageInConsole(msg.type, strMsg);
        }
        if (!this._isDev && msg.extensionId) {
            var type = msg.type, extensionId = msg.extensionId, extensionPointId = msg.extensionPointId, message = msg.message;
            /* __GDPR__
                "extensionsMessage" : {
                    "type" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
                    "extensionId": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "extensionPointId": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                    "message": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
                }
            */
            this._telemetryService.publicLog('extensionsMessage', {
                type: type, extensionId: extensionId, extensionPointId: extensionPointId, message: message
            });
        }
    };
    ExtensionService._validateExtensionsCache = function (windowService, notificationService, environmentService, cacheKey, input) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheFolder, cacheFile, expected, _a, _b, _c, _d, cacheContents, actual, err_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        cacheFolder = path.join(environmentService.userDataPath, MANIFEST_CACHE_FOLDER);
                        cacheFile = path.join(cacheFolder, cacheKey);
                        _b = (_a = JSON).parse;
                        _d = (_c = JSON).stringify;
                        return [4 /*yield*/, ExtensionScanner.scanExtensions(input, new NullLogger())];
                    case 1:
                        expected = _b.apply(_a, [_d.apply(_c, [_e.sent()])]);
                        return [4 /*yield*/, this._readExtensionCache(environmentService, cacheKey)];
                    case 2:
                        cacheContents = _e.sent();
                        if (!cacheContents) {
                            // Cache has been deleted by someone else, which is perfectly fine...
                            return [2 /*return*/];
                        }
                        actual = cacheContents.result;
                        if (objects.equals(expected, actual)) {
                            // Cache is valid and running with it is perfectly fine...
                            return [2 /*return*/];
                        }
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, pfs.del(cacheFile)];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _e.sent();
                        errors.onUnexpectedError(err_1);
                        console.error(err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        notificationService.prompt(Severity.Error, nls.localize('extensionCache.invalid', "Extensions have been modified on disk. Please reload the window."), [{
                                label: nls.localize('reloadWindow', "Reload Window"),
                                run: function () { return windowService.reloadWindow(); }
                            }]);
                        return [2 /*return*/];
                }
            });
        });
    };
    ExtensionService._readExtensionCache = function (environmentService, cacheKey) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheFolder, cacheFile, cacheRawContents, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheFolder = path.join(environmentService.userDataPath, MANIFEST_CACHE_FOLDER);
                        cacheFile = path.join(cacheFolder, cacheKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pfs.readFile(cacheFile, 'utf8')];
                    case 2:
                        cacheRawContents = _a.sent();
                        return [2 /*return*/, JSON.parse(cacheRawContents)];
                    case 3:
                        err_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    ExtensionService._writeExtensionCache = function (environmentService, cacheKey, cacheContents) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheFolder, cacheFile, err_3, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheFolder = path.join(environmentService.userDataPath, MANIFEST_CACHE_FOLDER);
                        cacheFile = path.join(cacheFolder, cacheKey);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pfs.mkdirp(cacheFolder)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, pfs.writeFile(cacheFile, JSON.stringify(cacheContents))];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_4 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ExtensionService._scanExtensionsWithCache = function (windowService, notificationService, environmentService, cacheKey, input, log) {
        return __awaiter(this, void 0, void 0, function () {
            var folderStat, err_5, cacheContents, counterLogger, result, cacheContents_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (input.devMode) {
                            // Do not cache when running out of sources...
                            return [2 /*return*/, ExtensionScanner.scanExtensions(input, log)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pfs.stat(input.absoluteFolderPath)];
                    case 2:
                        folderStat = _a.sent();
                        input.mtime = folderStat.mtime.getTime();
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this._readExtensionCache(environmentService, cacheKey)];
                    case 5:
                        cacheContents = _a.sent();
                        if (cacheContents && cacheContents.input && ExtensionScannerInput.equals(cacheContents.input, input)) {
                            // Validate the cache asynchronously after 5s
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var err_6;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this._validateExtensionsCache(windowService, notificationService, environmentService, cacheKey, input)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_6 = _a.sent();
                                            errors.onUnexpectedError(err_6);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 5000);
                            return [2 /*return*/, cacheContents.result.map(function (extensionDescription) {
                                    // revive URI object
                                    extensionDescription.extensionLocation = URI.revive(extensionDescription.extensionLocation);
                                    return extensionDescription;
                                })];
                        }
                        counterLogger = new CounterLogger(log);
                        return [4 /*yield*/, ExtensionScanner.scanExtensions(input, counterLogger)];
                    case 6:
                        result = _a.sent();
                        if (!(counterLogger.errorCnt === 0)) return [3 /*break*/, 8];
                        cacheContents_1 = {
                            input: input,
                            result: result
                        };
                        return [4 /*yield*/, this._writeExtensionCache(environmentService, cacheKey, cacheContents_1)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    ExtensionService._scanInstalledExtensions = function (windowService, notificationService, environmentService, extensionEnablementService, log) {
        var _this = this;
        var translationConfig = platform.translationsConfigFile
            ? pfs.readFile(platform.translationsConfigFile, 'utf8').then(function (content) {
                try {
                    return JSON.parse(content);
                }
                catch (err) {
                    return Object.create(null);
                }
            }, function (err) {
                return Object.create(null);
            })
            : Promise.resolve(Object.create(null));
        return translationConfig.then(function (translations) {
            var version = pkg.version;
            var commit = product.commit;
            var devMode = !!process.env['VSCODE_DEV'];
            var locale = platform.locale;
            var builtinExtensions = _this._scanExtensionsWithCache(windowService, notificationService, environmentService, BUILTIN_MANIFEST_CACHE_FILE, new ExtensionScannerInput(version, commit, locale, devMode, getSystemExtensionsRoot(), true, false, translations), log);
            var finalBuiltinExtensions = builtinExtensions;
            if (devMode) {
                var builtInExtensionsFilePath = path.normalize(path.join(getPathFromAmdModule(require, ''), '..', 'build', 'builtInExtensions.json'));
                var builtInExtensions = pfs.readFile(builtInExtensionsFilePath, 'utf8')
                    .then(function (raw) { return JSON.parse(raw); });
                var controlFilePath = path.join(os.homedir(), '.vscode-oss-dev', 'extensions', 'control.json');
                var controlFile = pfs.readFile(controlFilePath, 'utf8')
                    .then(function (raw) { return JSON.parse(raw); }, function () { return ({}); });
                var input_1 = new ExtensionScannerInput(version, commit, locale, devMode, getExtraDevSystemExtensionsRoot(), true, false, translations);
                var extraBuiltinExtensions = Promise.all([builtInExtensions, controlFile])
                    .then(function (_a) {
                    var builtInExtensions = _a[0], control = _a[1];
                    return new ExtraBuiltInExtensionResolver(builtInExtensions, control);
                })
                    .then(function (resolver) { return ExtensionScanner.scanExtensions(input_1, log, resolver); });
                finalBuiltinExtensions = Promise.all([builtinExtensions, extraBuiltinExtensions]).then(function (_a) {
                    var builtinExtensions = _a[0], extraBuiltinExtensions = _a[1];
                    var resultMap = Object.create(null);
                    for (var i = 0, len = builtinExtensions.length; i < len; i++) {
                        resultMap[builtinExtensions[i].id] = builtinExtensions[i];
                    }
                    // Overwrite with extensions found in extra
                    for (var i = 0, len = extraBuiltinExtensions.length; i < len; i++) {
                        resultMap[extraBuiltinExtensions[i].id] = extraBuiltinExtensions[i];
                    }
                    var resultArr = Object.keys(resultMap).map(function (id) { return resultMap[id]; });
                    resultArr.sort(function (a, b) {
                        var aLastSegment = path.basename(a.extensionLocation.fsPath);
                        var bLastSegment = path.basename(b.extensionLocation.fsPath);
                        if (aLastSegment < bLastSegment) {
                            return -1;
                        }
                        if (aLastSegment > bLastSegment) {
                            return 1;
                        }
                        return 0;
                    });
                    return resultArr;
                });
            }
            var userExtensions = (extensionEnablementService.allUserExtensionsDisabled || !environmentService.extensionsPath
                ? Promise.resolve([])
                : _this._scanExtensionsWithCache(windowService, notificationService, environmentService, USER_MANIFEST_CACHE_FILE, new ExtensionScannerInput(version, commit, locale, devMode, environmentService.extensionsPath, false, false, translations), log));
            // Always load developed extensions while extensions development
            var developedExtensions = Promise.resolve([]);
            if (environmentService.isExtensionDevelopment && environmentService.extensionDevelopmentLocationURI.scheme === Schemas.file) {
                developedExtensions = ExtensionScanner.scanOneOrMultipleExtensions(new ExtensionScannerInput(version, commit, locale, devMode, fsPath(environmentService.extensionDevelopmentLocationURI), false, true, translations), log);
            }
            return Promise.all([finalBuiltinExtensions, userExtensions, developedExtensions]).then(function (extensionDescriptions) {
                var system = extensionDescriptions[0];
                var user = extensionDescriptions[1];
                var development = extensionDescriptions[2];
                return { system: system, user: user, development: development };
            }).then(null, function (err) {
                log.error('', err);
                return { system: [], user: [], development: [] };
            });
        });
    };
    ExtensionService._handleExtensionPoint = function (extensionPoint, availableExtensions, messageHandler) {
        var users = [], usersLen = 0;
        for (var i = 0, len = availableExtensions.length; i < len; i++) {
            var desc = availableExtensions[i];
            if (desc.contributes && hasOwnProperty.call(desc.contributes, extensionPoint.name)) {
                users[usersLen++] = {
                    description: desc,
                    value: desc.contributes[extensionPoint.name],
                    collector: new ExtensionMessageCollector(messageHandler, desc, extensionPoint.name)
                };
            }
        }
        extensionPoint.acceptUsers(users);
    };
    ExtensionService.prototype._showMessageToUser = function (severity, msg) {
        if (severity === Severity.Error || severity === Severity.Warning) {
            this._notificationService.notify({ severity: severity, message: msg });
        }
        else {
            this._logMessageInConsole(severity, msg);
        }
    };
    ExtensionService.prototype._logMessageInConsole = function (severity, msg) {
        if (severity === Severity.Error) {
            console.error(msg);
        }
        else if (severity === Severity.Warning) {
            console.warn(msg);
        }
        else {
            console.log(msg);
        }
    };
    // -- called by extension host
    ExtensionService.prototype._logOrShowMessage = function (severity, msg) {
        if (this._isDev) {
            this._showMessageToUser(severity, msg);
        }
        else {
            this._logMessageInConsole(severity, msg);
        }
    };
    ExtensionService.prototype._onExtensionActivated = function (extensionId, startup, codeLoadingTime, activateCallTime, activateResolvedTime, activationEvent) {
        this._extensionHostProcessActivationTimes[extensionId] = new ActivationTimes(startup, codeLoadingTime, activateCallTime, activateResolvedTime, activationEvent);
        this._onDidChangeExtensionsStatus.fire([extensionId]);
    };
    ExtensionService.prototype._onExtensionRuntimeError = function (extensionId, err) {
        if (!this._extensionHostExtensionRuntimeErrors[extensionId]) {
            this._extensionHostExtensionRuntimeErrors[extensionId] = [];
        }
        this._extensionHostExtensionRuntimeErrors[extensionId].push(err);
        this._onDidChangeExtensionsStatus.fire([extensionId]);
    };
    ExtensionService.prototype._addMessage = function (extensionId, severity, message) {
        if (!this._extensionsMessages[extensionId]) {
            this._extensionsMessages[extensionId] = [];
        }
        this._extensionsMessages[extensionId].push({
            type: severity,
            message: message,
            extensionId: null,
            extensionPointId: null
        });
        this._onDidChangeExtensionsStatus.fire([extensionId]);
    };
    ExtensionService = __decorate([
        __param(0, IInstantiationService),
        __param(1, INotificationService),
        __param(2, IEnvironmentService),
        __param(3, ITelemetryService),
        __param(4, IExtensionEnablementService),
        __param(5, IStorageService),
        __param(6, IWindowService),
        __param(7, ILifecycleService),
        __param(8, IExtensionManagementService)
    ], ExtensionService);
    return ExtensionService;
}(Disposable));
export { ExtensionService };
var colorTables = [
    ['#2977B1', '#FC802D', '#34A13A', '#D3282F', '#9366BA'],
    ['#8B564C', '#E177C0', '#7F7F7F', '#BBBE3D', '#2EBECD']
];
function prettyWithoutArrays(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (data && typeof data === 'object' && typeof data.toString === 'function') {
        var result = data.toString();
        if (result !== '[object Object]') {
            return result;
        }
    }
    return data;
}
function pretty(data) {
    if (Array.isArray(data)) {
        return data.map(prettyWithoutArrays);
    }
    return prettyWithoutArrays(data);
}
var RPCLogger = /** @class */ (function () {
    function RPCLogger() {
        this._totalIncoming = 0;
        this._totalOutgoing = 0;
    }
    RPCLogger.prototype._log = function (direction, totalLength, msgLength, req, initiator, str, data) {
        data = pretty(data);
        var colorTable = colorTables[initiator];
        var color = LOG_USE_COLORS ? colorTable[req % colorTable.length] : '#000000';
        var args = ["%c[" + direction + "]%c[" + strings.pad(totalLength, 7, ' ') + "]%c[len: " + strings.pad(msgLength, 5, ' ') + "]%c" + strings.pad(req, 5, ' ') + " - " + str, 'color: darkgreen', 'color: grey', 'color: grey', "color: " + color];
        if (/\($/.test(str)) {
            args = args.concat(data);
            args.push(')');
        }
        else {
            args.push(data);
        }
        console.log.apply(console, args);
    };
    RPCLogger.prototype.logIncoming = function (msgLength, req, initiator, str, data) {
        this._totalIncoming += msgLength;
        this._log('Ext \u2192 Win', this._totalIncoming, msgLength, req, initiator, str, data);
    };
    RPCLogger.prototype.logOutgoing = function (msgLength, req, initiator, str, data) {
        this._totalOutgoing += msgLength;
        this._log('Win \u2192 Ext', this._totalOutgoing, msgLength, req, initiator, str, data);
    };
    return RPCLogger;
}());
var Logger = /** @class */ (function () {
    function Logger(messageHandler) {
        this._messageHandler = messageHandler;
    }
    Logger.prototype.error = function (source, message) {
        this._messageHandler(Severity.Error, source, message);
    };
    Logger.prototype.warn = function (source, message) {
        this._messageHandler(Severity.Warning, source, message);
    };
    Logger.prototype.info = function (source, message) {
        this._messageHandler(Severity.Info, source, message);
    };
    return Logger;
}());
export { Logger };
var CounterLogger = /** @class */ (function () {
    function CounterLogger(_actual) {
        this._actual = _actual;
        this.errorCnt = 0;
        this.warnCnt = 0;
        this.infoCnt = 0;
    }
    CounterLogger.prototype.error = function (source, message) {
        this._actual.error(source, message);
    };
    CounterLogger.prototype.warn = function (source, message) {
        this._actual.warn(source, message);
    };
    CounterLogger.prototype.info = function (source, message) {
        this._actual.info(source, message);
    };
    return CounterLogger;
}());
var NullLogger = /** @class */ (function () {
    function NullLogger() {
    }
    NullLogger.prototype.error = function (source, message) {
    };
    NullLogger.prototype.warn = function (source, message) {
    };
    NullLogger.prototype.info = function (source, message) {
    };
    return NullLogger;
}());
