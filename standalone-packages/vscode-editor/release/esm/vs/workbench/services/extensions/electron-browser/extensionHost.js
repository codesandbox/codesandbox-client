/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { fork } from '../../../../../child_process.js';
import { ipcRenderer as ipc } from '../../../../../electron.js';
import { createServer } from '../../../../../net.js';
import { getPathFromAmdModule } from '../../../../base/common/amd.js';
import { timeout } from '../../../../base/common/async.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, anyEvent, debounceEvent, fromNodeEventEmitter, mapEvent } from '../../../../base/common/event.js';
import { dispose, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as objects from '../../../../base/common/objects.js';
import { isWindows } from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { log, parse } from '../../../../base/node/console.js';
import { findFreePort } from '../../../../base/node/ports.js';
import { Protocol, generateRandomPipeName } from '../../../../base/parts/ipc/node/ipc.net.js';
import { IBroadcastService } from '../../../../platform/broadcast/electron-browser/broadcastService.js';
import { getScopes } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { EXTENSION_CLOSE_EXTHOST_BROADCAST_CHANNEL, EXTENSION_LOG_BROADCAST_CHANNEL, EXTENSION_RELOAD_BROADCAST_CHANNEL, EXTENSION_TERMINATE_BROADCAST_CHANNEL } from '../../../../platform/extensions/common/extensionHost.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import product from '../../../../platform/node/product.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWindowService, IWindowsService } from '../../../../platform/windows/common/windows.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { createMessageOfType, isMessageOfType } from '../../../common/extensionHostProtocol.js';
import { IWorkspaceConfigurationService } from '../../configuration/common/configuration.js';
import { ICrashReporterService } from '../../crashReporter/electron-browser/crashReporterService.js';
export function parseExtensionDevOptions(environmentService) {
    // handle extension host lifecycle a bit special when we know we are developing an extension that runs inside
    var isExtensionDevHost = environmentService.isExtensionDevelopment;
    var extDevLoc = environmentService.extensionDevelopmentLocationURI;
    var debugOk = !extDevLoc || extDevLoc.scheme === Schemas.file;
    var isExtensionDevDebug = debugOk && typeof environmentService.debugExtensionHost.port === 'number';
    var isExtensionDevDebugBrk = debugOk && !!environmentService.debugExtensionHost.break;
    var isExtensionDevTestFromCli = isExtensionDevHost && !!environmentService.extensionTestsPath && !environmentService.debugExtensionHost.break;
    return {
        isExtensionDevHost: isExtensionDevHost,
        isExtensionDevDebug: isExtensionDevDebug,
        isExtensionDevDebugBrk: isExtensionDevDebugBrk,
        isExtensionDevTestFromCli: isExtensionDevTestFromCli,
    };
}
var ExtensionHostProcessWorker = /** @class */ (function () {
    function ExtensionHostProcessWorker(_extensions, _extensionHostLogsLocation, _contextService, _notificationService, _windowsService, _windowService, _broadcastService, _lifecycleService, _environmentService, _configurationService, _telemetryService, _crashReporterService, _logService, _labelService) {
        var _this = this;
        this._extensions = _extensions;
        this._extensionHostLogsLocation = _extensionHostLogsLocation;
        this._contextService = _contextService;
        this._notificationService = _notificationService;
        this._windowsService = _windowsService;
        this._windowService = _windowService;
        this._broadcastService = _broadcastService;
        this._lifecycleService = _lifecycleService;
        this._environmentService = _environmentService;
        this._configurationService = _configurationService;
        this._telemetryService = _telemetryService;
        this._crashReporterService = _crashReporterService;
        this._logService = _logService;
        this._labelService = _labelService;
        this._onCrashed = new Emitter();
        this.onCrashed = this._onCrashed.event;
        var devOpts = parseExtensionDevOptions(this._environmentService);
        this._isExtensionDevHost = devOpts.isExtensionDevHost;
        this._isExtensionDevDebug = devOpts.isExtensionDevDebug;
        this._isExtensionDevDebugBrk = devOpts.isExtensionDevDebugBrk;
        this._isExtensionDevTestFromCli = devOpts.isExtensionDevTestFromCli;
        this._lastExtensionHostError = null;
        this._terminating = false;
        this._namedPipeServer = null;
        this._extensionHostProcess = null;
        this._extensionHostConnection = null;
        this._messageProtocol = null;
        this._toDispose = [];
        this._toDispose.push(this._onCrashed);
        this._toDispose.push(this._lifecycleService.onWillShutdown(function (e) { return _this._onWillShutdown(e); }));
        this._toDispose.push(this._lifecycleService.onShutdown(function (reason) { return _this.terminate(); }));
        this._toDispose.push(this._broadcastService.onBroadcast(function (b) { return _this._onBroadcast(b); }));
        var globalExitListener = function () { return _this.terminate(); };
        process.once('exit', globalExitListener);
        this._toDispose.push(toDisposable(function () {
            process.removeListener('exit', globalExitListener);
        }));
    }
    ExtensionHostProcessWorker.prototype.dispose = function () {
        this.terminate();
    };
    ExtensionHostProcessWorker.prototype._onBroadcast = function (broadcast) {
        var _this = this;
        // Close Ext Host Window Request
        if (broadcast.channel === EXTENSION_CLOSE_EXTHOST_BROADCAST_CHANNEL && this._isExtensionDevHost) {
            var extensionLocations = broadcast.payload;
            if (Array.isArray(extensionLocations) && extensionLocations.some(function (uriString) { return isEqual(_this._environmentService.extensionDevelopmentLocationURI, URI.parse(uriString)); })) {
                this._windowService.closeWindow();
            }
        }
        if (broadcast.channel === EXTENSION_RELOAD_BROADCAST_CHANNEL && this._isExtensionDevHost) {
            var extensionPaths = broadcast.payload;
            if (Array.isArray(extensionPaths) && extensionPaths.some(function (uriString) { return isEqual(_this._environmentService.extensionDevelopmentLocationURI, URI.parse(uriString)); })) {
                this._windowService.reloadWindow();
            }
        }
    };
    ExtensionHostProcessWorker.prototype.start = function () {
        var _this = this;
        if (this._terminating) {
            // .terminate() was called
            return null;
        }
        if (!this._messageProtocol) {
            // CODESANDBOX-CHANGE: remove the debug listen
            // this._messageProtocol = TPromise.join([this._tryListenOnPipe(), this._tryFindDebugPort()]).then(data => {
            this._messageProtocol = TPromise.join([this._tryListenOnPipe()]).then(function (data) {
                var pipeName = data[0];
                // const portData = data[1];
                var opts = {
                    env: objects.mixin(objects.deepClone(process.env), {
                        AMD_ENTRYPOINT: 'vs/workbench/node/extensionHostProcess',
                        PIPE_LOGGING: 'true',
                        VERBOSE_LOGGING: true,
                        VSCODE_IPC_HOOK_EXTHOST: pipeName,
                        VSCODE_HANDLES_UNCAUGHT_ERRORS: true,
                        VSCODE_LOG_STACK: !_this._isExtensionDevTestFromCli && (_this._isExtensionDevHost || !_this._environmentService.isBuilt || product.quality !== 'stable' || _this._environmentService.verbose),
                        VSCODE_LOG_LEVEL: _this._environmentService.verbose ? 'trace' : _this._environmentService.log
                    }),
                    // We only detach the extension host on windows. Linux and Mac orphan by default
                    // and detach under Linux and Mac create another process group.
                    // We detach because we have noticed that when the renderer exits, its child processes
                    // (i.e. extension host) are taken down in a brutal fashion by the OS
                    detached: !!isWindows,
                    execArgv: undefined,
                    silent: true
                };
                // if (portData.actual) {
                // 	opts.execArgv = [
                // 		'--nolazy',
                // 		(this._isExtensionDevDebugBrk ? '--inspect-brk=' : '--inspect=') + portData.actual
                // 	];
                // 	if (!portData.expected) {
                // 		// No one asked for 'inspect' or 'inspect-brk', only us. We add another
                // 		// option such that the extension host can manipulate the execArgv array
                // 		opts.env.VSCODE_PREVENT_FOREIGN_INSPECT = true;
                // 	}
                // }
                var crashReporterOptions = _this._crashReporterService.getChildProcessStartOptions('extensionHost');
                if (crashReporterOptions) {
                    opts.env.CRASH_REPORTER_START_OPTIONS = JSON.stringify(crashReporterOptions);
                }
                // Run Extension Host as fork of current process
                _this._extensionHostProcess = fork(getPathFromAmdModule(require, 'bootstrap-fork'), ['--type=extensionHost'], opts);
                _this._extensionHostProcess.stdout.setEncoding('utf8');
                _this._extensionHostProcess.stderr.setEncoding('utf8');
                var onStdout = fromNodeEventEmitter(_this._extensionHostProcess.stdout, 'data');
                var onStderr = fromNodeEventEmitter(_this._extensionHostProcess.stderr, 'data');
                var onOutput = anyEvent(mapEvent(onStdout, function (o) { return ({ data: "%c" + o, format: [''] }); }), mapEvent(onStderr, function (o) { return ({ data: "%c" + o, format: ['color: red'] }); }));
                // Debounce all output, so we can render it in the Chrome console as a group
                var onDebouncedOutput = debounceEvent(onOutput, function (r, o) {
                    return r
                        ? { data: r.data + o.data, format: r.format.concat(o.format) }
                        : { data: o.data, format: o.format };
                }, 100);
                // Print out extension host output
                onDebouncedOutput(function (output) {
                    var inspectorUrlMatch = !_this._environmentService.isBuilt && output.data && output.data.match(/ws:\/\/([^\s]+)/);
                    if (inspectorUrlMatch) {
                        console.log("%c[Extension Host] %cdebugger inspector at chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=" + inspectorUrlMatch[1], 'color: blue', 'color: black');
                    }
                    else {
                        console.group('Extension Host');
                        console.log.apply(console, [output.data].concat(output.format));
                        console.groupEnd();
                    }
                });
                // Support logging from extension host
                _this._extensionHostProcess.on('message', function (msg) {
                    if (msg && msg.type === '__$console') {
                        _this._logExtensionHostMessage(msg);
                    }
                });
                // Lifecycle
                _this._extensionHostProcess.on('error', function (err) { return _this._onExtHostProcessError(err); });
                _this._extensionHostProcess.on('exit', function (code, signal) { return _this._onExtHostProcessExit(code, signal); });
                // // Notify debugger that we are ready to attach to the process if we run a development extension
                // if (this._isExtensionDevHost && portData.actual && this._isExtensionDevDebug) {
                // 	this._broadcastService.broadcast({
                // 		channel: EXTENSION_ATTACH_BROADCAST_CHANNEL,
                // 		payload: {
                // 			debugId: this._environmentService.debugExtensionHost.debugId,
                // 			port: portData.actual
                // 		}
                // 	});
                // }
                // this._inspectPort = portData.actual;
                // Help in case we fail to start it
                var startupTimeoutHandle;
                if (!_this._environmentService.isBuilt && !_this._windowService.getConfiguration().remoteAuthority || _this._isExtensionDevHost) {
                    startupTimeoutHandle = setTimeout(function () {
                        var msg = _this._isExtensionDevDebugBrk
                            ? nls.localize('extensionHostProcess.startupFailDebug', "Extension host did not start in 10 seconds, it might be stopped on the first line and needs a debugger to continue.")
                            : nls.localize('extensionHostProcess.startupFail', "Extension host did not start in 10 seconds, that might be a problem.");
                        _this._notificationService.prompt(Severity.Warning, msg, [{
                                label: nls.localize('reloadWindow', "Reload Window"),
                                run: function () { return _this._windowService.reloadWindow(); }
                            }], { sticky: true });
                    }, 10000);
                }
                // Initialize extension host process with hand shakes
                return _this._tryExtHostHandshake().then(function (protocol) {
                    clearTimeout(startupTimeoutHandle);
                    return protocol;
                });
            });
        }
        return this._messageProtocol;
    };
    /**
     * Start a server (`this._namedPipeServer`) that listens on a named pipe and return the named pipe name.
     */
    ExtensionHostProcessWorker.prototype._tryListenOnPipe = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pipeName = generateRandomPipeName();
            _this._namedPipeServer = createServer();
            _this._namedPipeServer.on('error', reject);
            _this._namedPipeServer.listen(pipeName, function () {
                _this._namedPipeServer.removeListener('error', reject);
                resolve(pipeName);
            });
        });
    };
    /**
     * Find a free port if extension host debugging is enabled.
     */
    ExtensionHostProcessWorker.prototype._tryFindDebugPort = function () {
        var _this = this;
        var expected;
        var startPort = 9333;
        if (typeof this._environmentService.debugExtensionHost.port === 'number') {
            startPort = expected = this._environmentService.debugExtensionHost.port;
        }
        return new Promise(function (resolve) {
            return findFreePort(startPort, 10 /* try 10 ports */, 5000 /* try up to 5 seconds */).then(function (port) {
                if (!port) {
                    console.warn('%c[Extension Host] %cCould not find a free port for debugging', 'color: blue', 'color: black');
                }
                else {
                    if (expected && port !== expected) {
                        console.warn("%c[Extension Host] %cProvided debugging port " + expected + " is not free, using " + port + " instead.", 'color: blue', 'color: black');
                    }
                    if (_this._isExtensionDevDebugBrk) {
                        console.warn("%c[Extension Host] %cSTOPPED on first line for debugging on port " + port, 'color: blue', 'color: black');
                    }
                    else {
                        console.info("%c[Extension Host] %cdebugger listening on port " + port, 'color: blue', 'color: black');
                    }
                }
                return resolve({ expected: expected, actual: port });
            });
        });
    };
    ExtensionHostProcessWorker.prototype._tryExtHostHandshake = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Wait for the extension host to connect to our named pipe
            // and wrap the socket in the message passing protocol
            var handle = setTimeout(function () {
                _this._namedPipeServer.close();
                _this._namedPipeServer = null;
                reject('timeout');
            }, 60 * 1000);
            _this._namedPipeServer.on('connection', function (socket) {
                clearTimeout(handle);
                _this._namedPipeServer.close();
                _this._namedPipeServer = null;
                _this._extensionHostConnection = socket;
                resolve(new Protocol(_this._extensionHostConnection));
            });
        }).then(function (protocol) {
            // 1) wait for the incoming `ready` event and send the initialization data.
            // 2) wait for the incoming `initialized` event.
            return new Promise(function (resolve, reject) {
                var timeoutHandle;
                var installTimeoutCheck = function () {
                    timeoutHandle = setTimeout(function () {
                        reject('timeout');
                    }, 60 * 1000);
                };
                var uninstallTimeoutCheck = function () {
                    clearTimeout(timeoutHandle);
                };
                // Wait 60s for the ready message
                installTimeoutCheck();
                var disposable = protocol.onMessage(function (msg) {
                    if (isMessageOfType(msg, 1 /* Ready */)) {
                        // 1) Extension Host is ready to receive messages, initialize it
                        uninstallTimeoutCheck();
                        _this._createExtHostInitData().then(function (data) {
                            // Wait 60s for the initialized message
                            installTimeoutCheck();
                            protocol.send(Buffer.from(JSON.stringify(data)));
                        });
                        return;
                    }
                    if (isMessageOfType(msg, 0 /* Initialized */)) {
                        // 2) Extension Host is initialized
                        uninstallTimeoutCheck();
                        // stop listening for messages here
                        disposable.dispose();
                        // release this promise
                        // using a buffered message protocol here because between now
                        // and the first time a `then` executes some messages might be lost
                        // unless we immediately register a listener for `onMessage`.
                        resolve(new BufferedMessagePassingProtocol(protocol));
                        return;
                    }
                    console.error("received unexpected message during handshake phase from the extension host: ", msg);
                });
            });
        });
    };
    ExtensionHostProcessWorker.prototype._createExtHostInitData = function () {
        var _this = this;
        return TPromise.join([this._telemetryService.getTelemetryInfo(), this._extensions])
            .then(function (_a) {
            var telemetryInfo = _a[0], extensionDescriptions = _a[1];
            var configurationData = __assign({}, _this._configurationService.getConfigurationData(), { configurationScopes: {} });
            var workspace = _this._contextService.getWorkspace();
            var r = {
                commit: product.commit,
                parentPid: process.pid,
                environment: {
                    isExtensionDevelopmentDebug: _this._isExtensionDevDebug,
                    appRoot: _this._environmentService.appRoot ? URI.file(_this._environmentService.appRoot) : void 0,
                    appSettingsHome: _this._environmentService.appSettingsHome ? URI.file(_this._environmentService.appSettingsHome) : void 0,
                    extensionDevelopmentLocationURI: _this._environmentService.extensionDevelopmentLocationURI,
                    extensionTestsPath: _this._environmentService.extensionTestsPath
                },
                workspace: _this._contextService.getWorkbenchState() === 1 /* EMPTY */ ? null : {
                    configuration: workspace.configuration,
                    folders: workspace.folders,
                    id: workspace.id,
                    name: _this._labelService.getWorkspaceLabel(workspace)
                },
                extensions: extensionDescriptions,
                // Send configurations scopes only in development mode.
                configuration: !_this._environmentService.isBuilt || _this._environmentService.isExtensionDevelopment ? __assign({}, configurationData, { configurationScopes: getScopes() }) : configurationData,
                telemetryInfo: telemetryInfo,
                logLevel: _this._logService.getLevel(),
                logsLocation: _this._extensionHostLogsLocation
            };
            return r;
        });
    };
    ExtensionHostProcessWorker.prototype._logExtensionHostMessage = function (entry) {
        var _a;
        // Send to local console unless we run tests from cli
        if (!this._isExtensionDevTestFromCli) {
            log(entry, 'Extension Host');
        }
        // Log on main side if running tests from cli
        if (this._isExtensionDevTestFromCli) {
            (_a = this._windowsService).log.apply(_a, [entry.severity].concat(parse(entry).args));
        }
        // Broadcast to other windows if we are in development mode
        else if (!this._environmentService.isBuilt || this._isExtensionDevHost) {
            this._broadcastService.broadcast({
                channel: EXTENSION_LOG_BROADCAST_CHANNEL,
                payload: {
                    logEntry: entry,
                    debugId: this._environmentService.debugExtensionHost.debugId
                }
            });
        }
    };
    ExtensionHostProcessWorker.prototype._onExtHostProcessError = function (err) {
        var errorMessage = toErrorMessage(err);
        if (errorMessage === this._lastExtensionHostError) {
            return; // prevent error spam
        }
        this._lastExtensionHostError = errorMessage;
        this._notificationService.error(nls.localize('extensionHostProcess.error', "Error from the extension host: {0}", errorMessage));
    };
    ExtensionHostProcessWorker.prototype._onExtHostProcessExit = function (code, signal) {
        if (this._terminating) {
            // Expected termination path (we asked the process to terminate)
            return;
        }
        // Unexpected termination
        if (!this._isExtensionDevHost) {
            this._onCrashed.fire([code, signal]);
        }
        // Expected development extension termination: When the extension host goes down we also shutdown the window
        else if (!this._isExtensionDevTestFromCli) {
            this._windowService.closeWindow();
        }
        // When CLI testing make sure to exit with proper exit code
        else {
            ipc.send('vscode:exit', code);
        }
    };
    ExtensionHostProcessWorker.prototype.getInspectPort = function () {
        return this._inspectPort;
    };
    ExtensionHostProcessWorker.prototype.terminate = function () {
        var _this = this;
        if (this._terminating) {
            return;
        }
        this._terminating = true;
        dispose(this._toDispose);
        if (!this._messageProtocol) {
            // .start() was not called
            return;
        }
        this._messageProtocol.then(function (protocol) {
            // Send the extension host a request to terminate itself
            // (graceful termination)
            protocol.send(createMessageOfType(2 /* Terminate */));
            // Give the extension host 10s, after which we will
            // try to kill the process and release any resources
            setTimeout(function () { return _this._cleanResources(); }, 10 * 1000);
        }, function (err) {
            // Establishing a protocol with the extension host failed, so
            // try to kill the process and release any resources.
            _this._cleanResources();
        });
    };
    ExtensionHostProcessWorker.prototype._cleanResources = function () {
        if (this._namedPipeServer) {
            this._namedPipeServer.close();
            this._namedPipeServer = null;
        }
        if (this._extensionHostConnection) {
            this._extensionHostConnection.end();
            this._extensionHostConnection = null;
        }
        if (this._extensionHostProcess) {
            this._extensionHostProcess.kill();
            this._extensionHostProcess = null;
        }
    };
    ExtensionHostProcessWorker.prototype._onWillShutdown = function (event) {
        // If the extension development host was started without debugger attached we need
        // to communicate this back to the main side to terminate the debug session
        if (this._isExtensionDevHost && !this._isExtensionDevTestFromCli && !this._isExtensionDevDebug) {
            this._broadcastService.broadcast({
                channel: EXTENSION_TERMINATE_BROADCAST_CHANNEL,
                payload: {
                    debugId: this._environmentService.debugExtensionHost.debugId
                }
            });
            event.veto(timeout(100 /* wait a bit for IPC to get delivered */).then(function () { return false; }));
        }
    };
    ExtensionHostProcessWorker = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, INotificationService),
        __param(4, IWindowsService),
        __param(5, IWindowService),
        __param(6, IBroadcastService),
        __param(7, ILifecycleService),
        __param(8, IEnvironmentService),
        __param(9, IWorkspaceConfigurationService),
        __param(10, ITelemetryService),
        __param(11, ICrashReporterService),
        __param(12, ILogService),
        __param(13, ILabelService)
    ], ExtensionHostProcessWorker);
    return ExtensionHostProcessWorker;
}());
export { ExtensionHostProcessWorker };
/**
 * Will ensure no messages are lost from creation time until the first user of onMessage comes in.
 */
var BufferedMessagePassingProtocol = /** @class */ (function () {
    function BufferedMessagePassingProtocol(actual) {
        var _this = this;
        this._actual = actual;
        this._bufferedMessages = [];
        this._bufferedMessagesListener = this._actual.onMessage(function (buff) { return _this._bufferedMessages.push(buff); });
    }
    BufferedMessagePassingProtocol.prototype.send = function (buffer) {
        this._actual.send(buffer);
    };
    BufferedMessagePassingProtocol.prototype.onMessage = function (listener, thisArgs, disposables) {
        if (!this._bufferedMessages) {
            // second caller gets nothing
            return this._actual.onMessage(listener, thisArgs, disposables);
        }
        // prepare result
        var result = this._actual.onMessage(listener, thisArgs, disposables);
        // stop listening to buffered messages
        this._bufferedMessagesListener.dispose();
        // capture buffered messages
        var bufferedMessages = this._bufferedMessages;
        this._bufferedMessages = null;
        // it is important to deliver these messages after this call, but before
        // other messages have a chance to be received (to guarantee in order delivery)
        // that's why we're using here nextTick and not other types of timeouts
        process.nextTick(function () {
            // deliver buffered messages
            while (bufferedMessages.length > 0) {
                var msg = bufferedMessages.shift();
                try {
                    listener.call(thisArgs, msg);
                }
                catch (e) {
                    onUnexpectedError(e);
                }
            }
        });
        return result;
    };
    return BufferedMessagePassingProtocol;
}());
