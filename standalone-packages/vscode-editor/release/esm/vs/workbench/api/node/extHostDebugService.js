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
import * as paths from '../../../base/common/paths.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { Emitter } from '../../../base/common/event.js';
import { asThenable } from '../../../base/common/async.js';
import * as nls from '../../../nls.js';
import { MainContext } from './extHost.protocol.js';
import { Disposable, Position, Location, SourceBreakpoint, FunctionBreakpoint, DebugAdapterServer, DebugAdapterExecutable } from './extHostTypes.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { ExecutableDebugAdapter, SocketDebugAdapter, AbstractDebugAdapter } from '../../parts/debug/node/debugAdapter.js';
import { getTerminalLauncher, hasChildprocesses, prepareCommand } from '../../parts/debug/node/terminals.js';
import { AbstractVariableResolverService } from '../../services/configurationResolver/node/variableResolver.js';
import { convertToVSCPaths, convertToDAPaths, stringToUri, uriToString } from '../../parts/debug/common/debugUtils.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
var ExtHostDebugService = /** @class */ (function () {
    function ExtHostDebugService(mainContext, _workspaceService, _extensionService, _editorsService, _configurationService, _terminalService, _commandService) {
        var _this = this;
        this._workspaceService = _workspaceService;
        this._extensionService = _extensionService;
        this._editorsService = _editorsService;
        this._configurationService = _configurationService;
        this._terminalService = _terminalService;
        this._commandService = _commandService;
        this._debugSessions = new Map();
        this._providerHandleCounter = 0;
        this._providerByHandle = new Map();
        this._providerByType = new Map();
        this._providers = [];
        this._aexCommands = new Map();
        this._debugAdapters = new Map();
        this._debugAdaptersTrackers = new Map();
        this._onDidStartDebugSession = new Emitter();
        this._onDidTerminateDebugSession = new Emitter();
        this._onDidChangeActiveDebugSession = new Emitter();
        this._onDidReceiveDebugSessionCustomEvent = new Emitter();
        this._debugServiceProxy = mainContext.getProxy(MainContext.MainThreadDebugService);
        this._onDidChangeBreakpoints = new Emitter({
            onFirstListenerAdd: function () {
                _this.startBreakpoints();
            }
        });
        this._activeDebugConsole = new ExtHostDebugConsole(this._debugServiceProxy);
        this._breakpoints = new Map();
        this._breakpointEventsActive = false;
        // register all debug extensions
        var debugTypes = [];
        for (var _i = 0, _a = this._extensionService.getAllExtensionDescriptions(); _i < _a.length; _i++) {
            var ed = _a[_i];
            if (ed.contributes) {
                var debuggers = ed.contributes['debuggers'];
                if (debuggers && debuggers.length > 0) {
                    for (var _b = 0, debuggers_1 = debuggers; _b < debuggers_1.length; _b++) {
                        var dbg = debuggers_1[_b];
                        // only debugger contributions with a "label" are considered a "defining" debugger contribution
                        if (dbg.type && dbg.label) {
                            debugTypes.push(dbg.type);
                            if (dbg.adapterExecutableCommand) {
                                this._aexCommands.set(dbg.type, dbg.adapterExecutableCommand);
                            }
                        }
                    }
                }
            }
        }
        if (debugTypes.length > 0) {
            this._debugServiceProxy.$registerDebugTypes(debugTypes);
        }
    }
    Object.defineProperty(ExtHostDebugService.prototype, "onDidStartDebugSession", {
        get: function () { return this._onDidStartDebugSession.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "onDidTerminateDebugSession", {
        get: function () { return this._onDidTerminateDebugSession.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "onDidChangeActiveDebugSession", {
        get: function () { return this._onDidChangeActiveDebugSession.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "activeDebugSession", {
        get: function () { return this._activeDebugSession; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "onDidReceiveDebugSessionCustomEvent", {
        get: function () { return this._onDidReceiveDebugSessionCustomEvent.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "activeDebugConsole", {
        get: function () { return this._activeDebugConsole; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "onDidChangeBreakpoints", {
        // extension debug API
        get: function () {
            return this._onDidChangeBreakpoints.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugService.prototype, "breakpoints", {
        get: function () {
            this.startBreakpoints();
            var result = [];
            this._breakpoints.forEach(function (bp) { return result.push(bp); });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostDebugService.prototype.addBreakpoints = function (breakpoints0) {
        this.startBreakpoints();
        // assign uuids for brand new breakpoints
        var breakpoints = [];
        for (var _i = 0, breakpoints0_1 = breakpoints0; _i < breakpoints0_1.length; _i++) {
            var bp = breakpoints0_1[_i];
            var id = bp['_id'];
            if (id) { // has already id
                if (this._breakpoints.has(id)) {
                    // already there
                }
                else {
                    breakpoints.push(bp);
                }
            }
            else {
                id = generateUuid();
                bp['_id'] = id;
                this._breakpoints.set(id, bp);
                breakpoints.push(bp);
            }
        }
        // send notification for added breakpoints
        this.fireBreakpointChanges(breakpoints, [], []);
        // convert added breakpoints to DTOs
        var dtos = [];
        var map = new Map();
        for (var _a = 0, breakpoints_1 = breakpoints; _a < breakpoints_1.length; _a++) {
            var bp = breakpoints_1[_a];
            if (bp instanceof SourceBreakpoint) {
                var dto = map.get(bp.location.uri.toString());
                if (!dto) {
                    dto = {
                        type: 'sourceMulti',
                        uri: bp.location.uri,
                        lines: []
                    };
                    map.set(bp.location.uri.toString(), dto);
                    dtos.push(dto);
                }
                dto.lines.push({
                    id: bp['_id'],
                    enabled: bp.enabled,
                    condition: bp.condition,
                    hitCondition: bp.hitCondition,
                    logMessage: bp.logMessage,
                    line: bp.location.range.start.line,
                    character: bp.location.range.start.character
                });
            }
            else if (bp instanceof FunctionBreakpoint) {
                dtos.push({
                    type: 'function',
                    id: bp['_id'],
                    enabled: bp.enabled,
                    hitCondition: bp.hitCondition,
                    logMessage: bp.logMessage,
                    condition: bp.condition,
                    functionName: bp.functionName
                });
            }
        }
        // send DTOs to VS Code
        return this._debugServiceProxy.$registerBreakpoints(dtos);
    };
    ExtHostDebugService.prototype.removeBreakpoints = function (breakpoints0) {
        this.startBreakpoints();
        // remove from array
        var breakpoints = [];
        for (var _i = 0, breakpoints0_2 = breakpoints0; _i < breakpoints0_2.length; _i++) {
            var b = breakpoints0_2[_i];
            var id = b['_id'];
            if (id && this._breakpoints.delete(id)) {
                breakpoints.push(b);
            }
        }
        // send notification
        this.fireBreakpointChanges([], breakpoints, []);
        // unregister with VS Code
        var ids = breakpoints.filter(function (bp) { return bp instanceof SourceBreakpoint; }).map(function (bp) { return bp['_id']; });
        var fids = breakpoints.filter(function (bp) { return bp instanceof FunctionBreakpoint; }).map(function (bp) { return bp['_id']; });
        return this._debugServiceProxy.$unregisterBreakpoints(ids, fids);
    };
    ExtHostDebugService.prototype.startDebugging = function (folder, nameOrConfig) {
        return this._debugServiceProxy.$startDebugging(folder ? folder.uri : undefined, nameOrConfig);
    };
    ExtHostDebugService.prototype.registerDebugConfigurationProvider = function (extension, type, provider) {
        var _this = this;
        if (!provider) {
            return new Disposable(function () { });
        }
        // if a provider has a provideDebugAdapter method, we check the constraints specified in the API doc
        if (provider.provideDebugAdapter) {
            // a provider with this method can only be registered in the extension that contributes the debugger
            if (!this.definesDebugType(extension, type)) {
                throw new Error("method 'provideDebugAdapter' must only be called from the extension that defines the '" + type + "' debugger.");
            }
            // make sure that only one provider for this type is registered
            if (this._providerByType.has(type)) {
                throw new Error("a provider with method 'provideDebugAdapter' can only be registered once per a type.");
            }
            else {
                this._providerByType.set(type, provider);
            }
        }
        var handle = this._providerHandleCounter++;
        this._providerByHandle.set(handle, provider);
        this._providers.push({ type: type, provider: provider });
        this._debugServiceProxy.$registerDebugConfigurationProvider(type, !!provider.provideDebugConfigurations, !!provider.resolveDebugConfiguration, !!provider.debugAdapterExecutable || !!provider.provideDebugAdapter, !!provider.provideDebugAdapterTracker, handle);
        return new Disposable(function () {
            _this._providerByHandle.delete(handle);
            _this._providerByType.delete(type);
            _this._providers = _this._providers.filter(function (p) { return p.provider !== provider; }); // remove
            _this._debugServiceProxy.$unregisterDebugConfigurationProvider(handle);
        });
    };
    // RPC methods (ExtHostDebugServiceShape)
    ExtHostDebugService.prototype.$runInTerminal = function (args, config) {
        var _this = this;
        if (args.kind === 'integrated') {
            if (!this._terminalDisposedListener) {
                // React on terminal disposed and check if that is the debug terminal #12956
                this._terminalDisposedListener = this._terminalService.onDidCloseTerminal(function (terminal) {
                    if (_this._integratedTerminalInstance && _this._integratedTerminalInstance === terminal) {
                        _this._integratedTerminalInstance = null;
                    }
                });
            }
            return new Promise(function (resolve) {
                if (_this._integratedTerminalInstance) {
                    _this._integratedTerminalInstance.processId.then(function (pid) {
                        resolve(hasChildprocesses(pid));
                    }, function (err) {
                        resolve(true);
                    });
                }
                else {
                    resolve(true);
                }
            }).then(function (needNewTerminal) {
                if (needNewTerminal) {
                    _this._integratedTerminalInstance = _this._terminalService.createTerminal(args.title || nls.localize('debug.terminal.title', "debuggee"));
                }
                _this._integratedTerminalInstance.show();
                return new Promise(function (resolve) {
                    setTimeout(function (_) {
                        var command = prepareCommand(args, config);
                        _this._integratedTerminalInstance.sendText(command, true);
                        resolve(void 0);
                    }, 500);
                });
            });
        }
        else if (args.kind === 'external') {
            var terminalLauncher = getTerminalLauncher();
            if (terminalLauncher) {
                return terminalLauncher.runInTerminal(args, config);
            }
        }
        return void 0;
    };
    ExtHostDebugService.prototype.$substituteVariables = function (folderUri, config) {
        if (!this._variableResolver) {
            this._variableResolver = new ExtHostVariableResolverService(this._workspaceService, this._editorsService, this._configurationService);
        }
        var ws;
        var folder = this.getFolder(folderUri);
        if (folder) {
            ws = {
                uri: folder.uri,
                name: folder.name,
                index: folder.index,
                toResource: function () {
                    throw new Error('Not implemented');
                }
            };
        }
        return Promise.resolve(this._variableResolver.resolveAny(ws, config));
    };
    ExtHostDebugService.prototype.$startDASession = function (handle, sessionDto, folderUri, config) {
        var _this = this;
        var mythis = this;
        return this.getAdapterDescriptor(this._providerByType.get(config.type), sessionDto, folderUri, config).then(function (adapter) {
            var da = undefined;
            switch (adapter.type) {
                case 'server':
                    da = new SocketDebugAdapter(adapter);
                    break;
                case 'executable':
                    da = new ExecutableDebugAdapter(adapter, config.type);
                    break;
                case 'implementation':
                    da = new DirectDebugAdapter(adapter.implementation);
                    break;
                default:
                    break;
            }
            if (da) {
                _this._debugAdapters.set(handle, da);
                return _this.getDebugAdapterTrackers(sessionDto, folderUri, config).then(function (tracker) {
                    if (tracker) {
                        _this._debugAdaptersTrackers.set(handle, tracker);
                    }
                    da.onMessage(function (message) {
                        if (tracker) {
                            tracker.fromDebugAdapter(message);
                        }
                        // DA -> VS Code
                        message = convertToVSCPaths(message, function (source) { return stringToUri(source); });
                        mythis._debugServiceProxy.$acceptDAMessage(handle, message);
                    });
                    da.onError(function (err) {
                        if (tracker) {
                            tracker.debugAdapterError(err);
                        }
                        _this._debugServiceProxy.$acceptDAError(handle, err.name, err.message, err.stack);
                    });
                    da.onExit(function (code) {
                        if (tracker) {
                            tracker.debugAdapterExit(code, null);
                        }
                        _this._debugServiceProxy.$acceptDAExit(handle, code, null);
                    });
                    if (tracker) {
                        tracker.startDebugAdapter();
                    }
                    return da.startSession();
                });
            }
            return undefined;
        });
    };
    ExtHostDebugService.prototype.$sendDAMessage = function (handle, message) {
        // VS Code -> DA
        message = convertToDAPaths(message, function (source) { return uriToString(source); });
        var tracker = this._debugAdaptersTrackers.get(handle);
        if (tracker) {
            tracker.toDebugAdapter(message);
        }
        var da = this._debugAdapters.get(handle);
        if (da) {
            da.sendMessage(message);
        }
        return void 0;
    };
    ExtHostDebugService.prototype.$stopDASession = function (handle) {
        var tracker = this._debugAdaptersTrackers.get(handle);
        this._debugAdaptersTrackers.delete(handle);
        if (tracker) {
            tracker.stopDebugAdapter();
        }
        var da = this._debugAdapters.get(handle);
        this._debugAdapters.delete(handle);
        if (da) {
            return da.stopSession();
        }
        else {
            return void 0;
        }
    };
    ExtHostDebugService.prototype.$acceptBreakpointsDelta = function (delta) {
        var a = [];
        var r = [];
        var c = [];
        if (delta.added) {
            for (var _i = 0, _a = delta.added; _i < _a.length; _i++) {
                var bpd = _a[_i];
                if (!this._breakpoints.has(bpd.id)) {
                    var bp = void 0;
                    if (bpd.type === 'function') {
                        bp = new FunctionBreakpoint(bpd.functionName, bpd.enabled, bpd.condition, bpd.hitCondition, bpd.logMessage);
                    }
                    else {
                        var uri = URI.revive(bpd.uri);
                        bp = new SourceBreakpoint(new Location(uri, new Position(bpd.line, bpd.character)), bpd.enabled, bpd.condition, bpd.hitCondition, bpd.logMessage);
                    }
                    bp['_id'] = bpd.id;
                    this._breakpoints.set(bpd.id, bp);
                    a.push(bp);
                }
            }
        }
        if (delta.removed) {
            for (var _b = 0, _c = delta.removed; _b < _c.length; _b++) {
                var id = _c[_b];
                var bp = this._breakpoints.get(id);
                if (bp) {
                    this._breakpoints.delete(id);
                    r.push(bp);
                }
            }
        }
        if (delta.changed) {
            for (var _d = 0, _e = delta.changed; _d < _e.length; _d++) {
                var bpd = _e[_d];
                var bp = this._breakpoints.get(bpd.id);
                if (bp) {
                    if (bp instanceof FunctionBreakpoint && bpd.type === 'function') {
                        var fbp = bp;
                        fbp.enabled = bpd.enabled;
                        fbp.condition = bpd.condition;
                        fbp.hitCondition = bpd.hitCondition;
                        fbp.logMessage = bpd.logMessage;
                        fbp.functionName = bpd.functionName;
                    }
                    else if (bp instanceof SourceBreakpoint && bpd.type === 'source') {
                        var sbp = bp;
                        sbp.enabled = bpd.enabled;
                        sbp.condition = bpd.condition;
                        sbp.hitCondition = bpd.hitCondition;
                        sbp.logMessage = bpd.logMessage;
                        sbp.location = new Location(URI.revive(bpd.uri), new Position(bpd.line, bpd.character));
                    }
                    c.push(bp);
                }
            }
        }
        this.fireBreakpointChanges(a, r, c);
    };
    ExtHostDebugService.prototype.$provideDebugConfigurations = function (handle, folderUri) {
        var _this = this;
        var provider = this._providerByHandle.get(handle);
        if (!provider) {
            return Promise.reject(new Error('no handler found'));
        }
        if (!provider.provideDebugConfigurations) {
            return Promise.reject(new Error('handler has no method provideDebugConfigurations'));
        }
        return asThenable(function () { return provider.provideDebugConfigurations(_this.getFolder(folderUri), CancellationToken.None); });
    };
    ExtHostDebugService.prototype.$resolveDebugConfiguration = function (handle, folderUri, debugConfiguration) {
        var _this = this;
        var provider = this._providerByHandle.get(handle);
        if (!provider) {
            return Promise.reject(new Error('no handler found'));
        }
        if (!provider.resolveDebugConfiguration) {
            return Promise.reject(new Error('handler has no method resolveDebugConfiguration'));
        }
        return asThenable(function () { return provider.resolveDebugConfiguration(_this.getFolder(folderUri), debugConfiguration, CancellationToken.None); });
    };
    ExtHostDebugService.prototype.$provideDebugAdapter = function (handle, sessionDto, folderUri, config) {
        var provider = this._providerByHandle.get(handle);
        if (!provider) {
            return Promise.reject(new Error('no handler found'));
        }
        if (!provider.debugAdapterExecutable && !provider.provideDebugAdapter) {
            return Promise.reject(new Error('handler has no methods provideDebugAdapter or debugAdapterExecutable'));
        }
        return this.getAdapterDescriptor(provider, this.getSession(sessionDto), folderUri, config);
    };
    ExtHostDebugService.prototype.$acceptDebugSessionStarted = function (sessionDto) {
        this._onDidStartDebugSession.fire(this.getSession(sessionDto));
    };
    ExtHostDebugService.prototype.$acceptDebugSessionTerminated = function (sessionDto) {
        this._onDidTerminateDebugSession.fire(this.getSession(sessionDto));
        this._debugSessions.delete(sessionDto.id);
    };
    ExtHostDebugService.prototype.$acceptDebugSessionActiveChanged = function (sessionDto) {
        this._activeDebugSession = sessionDto ? this.getSession(sessionDto) : undefined;
        this._onDidChangeActiveDebugSession.fire(this._activeDebugSession);
    };
    ExtHostDebugService.prototype.$acceptDebugSessionCustomEvent = function (sessionDto, event) {
        var ee = {
            session: this.getSession(sessionDto),
            event: event.event,
            body: event.body
        };
        this._onDidReceiveDebugSessionCustomEvent.fire(ee);
    };
    // private & dto helpers
    ExtHostDebugService.prototype.definesDebugType = function (ed, type) {
        if (ed.contributes) {
            var debuggers = ed.contributes['debuggers'];
            if (debuggers && debuggers.length > 0) {
                for (var _i = 0, debuggers_2 = debuggers; _i < debuggers_2.length; _i++) {
                    var dbg = debuggers_2[_i];
                    // only debugger contributions with a "label" are considered a "defining" debugger contribution
                    if (dbg.label && dbg.type) {
                        if (dbg.type === type) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ExtHostDebugService.prototype.getDebugAdapterTrackers = function (sessionDto, folderUri, config) {
        var session = this.getSession(sessionDto);
        var folder = this.getFolder(folderUri);
        var type = config.type;
        var promises = this._providers
            .filter(function (pair) { return pair.provider.provideDebugAdapterTracker && (pair.type === type || pair.type === '*'); })
            .map(function (pair) { return asThenable(function () { return pair.provider.provideDebugAdapterTracker(session, folder, config, CancellationToken.None); }).then(function (p) { return p; }).catch(function (err) { return null; }); });
        return Promise.race([
            Promise.all(promises).then(function (trackers) {
                trackers = trackers.filter(function (t) { return t; }); // filter null
                if (trackers.length > 0) {
                    return new MultiTracker(trackers);
                }
                return undefined;
            }),
            new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    reject(new Error('timeout'));
                }, 1000);
            })
        ]).catch(function (err) {
            // ignore errors
            return undefined;
        });
    };
    ExtHostDebugService.prototype.getAdapterDescriptor = function (debugConfigProvider, sessionDto, folderUri, config) {
        var _this = this;
        // a "debugServer" attribute in the launch config takes precedence
        if (typeof config.debugServer === 'number') {
            return Promise.resolve(new DebugAdapterServer(config.debugServer));
        }
        if (debugConfigProvider) {
            // try the proposed "provideDebugAdapter" API
            if (debugConfigProvider.provideDebugAdapter) {
                var adapterExecutable_1 = ExecutableDebugAdapter.platformAdapterExecutable(this._extensionService.getAllExtensionDescriptions(), config.type);
                return asThenable(function () { return debugConfigProvider.provideDebugAdapter(_this.getSession(sessionDto), _this.getFolder(folderUri), adapterExecutable_1, config, CancellationToken.None); });
            }
            // try the deprecated "debugAdapterExecutable" API
            if (debugConfigProvider.debugAdapterExecutable) {
                return asThenable(function () { return debugConfigProvider.debugAdapterExecutable(_this.getFolder(folderUri), CancellationToken.None); });
            }
        }
        // try deprecated command based extension API "adapterExecutableCommand" to determine the executable
        var aex = this._aexCommands.get(config.type);
        if (aex) {
            var rootFolder = folderUri ? URI.revive(folderUri).toString() : undefined;
            return this._commandService.executeCommand(aex, rootFolder).then(function (ae) {
                return new DebugAdapterExecutable(ae.command, ae.args || []);
            });
        }
        // fallback: use executable information from package.json
        return Promise.resolve(ExecutableDebugAdapter.platformAdapterExecutable(this._extensionService.getAllExtensionDescriptions(), config.type));
    };
    ExtHostDebugService.prototype.startBreakpoints = function () {
        if (!this._breakpointEventsActive) {
            this._breakpointEventsActive = true;
            this._debugServiceProxy.$startBreakpointEvents();
        }
    };
    ExtHostDebugService.prototype.fireBreakpointChanges = function (added, removed, changed) {
        if (added.length > 0 || removed.length > 0 || changed.length > 0) {
            this._onDidChangeBreakpoints.fire(Object.freeze({
                added: added,
                removed: removed,
                changed: changed,
            }));
        }
    };
    ExtHostDebugService.prototype.getSession = function (dto) {
        if (dto) {
            var debugSession = this._debugSessions.get(dto.id);
            if (!debugSession) {
                debugSession = new ExtHostDebugSession(this._debugServiceProxy, dto.id, dto.type, dto.name);
                this._debugSessions.set(dto.id, debugSession);
            }
            return debugSession;
        }
        return undefined;
    };
    ExtHostDebugService.prototype.getFolder = function (_folderUri) {
        if (_folderUri) {
            var folderURI = URI.revive(_folderUri);
            return this._workspaceService.resolveWorkspaceFolder(folderURI);
        }
        return undefined;
    };
    return ExtHostDebugService;
}());
export { ExtHostDebugService };
var ExtHostDebugSession = /** @class */ (function () {
    function ExtHostDebugSession(proxy, id, type, name) {
        this._debugServiceProxy = proxy;
        this._id = id;
        this._type = type;
        this._name = name;
    }
    Object.defineProperty(ExtHostDebugSession.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugSession.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostDebugSession.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostDebugSession.prototype.customRequest = function (command, args) {
        return this._debugServiceProxy.$customDebugAdapterRequest(this._id, command, args);
    };
    return ExtHostDebugSession;
}());
export { ExtHostDebugSession };
var ExtHostDebugConsole = /** @class */ (function () {
    function ExtHostDebugConsole(proxy) {
        this._debugServiceProxy = proxy;
    }
    ExtHostDebugConsole.prototype.append = function (value) {
        this._debugServiceProxy.$appendDebugConsole(value);
    };
    ExtHostDebugConsole.prototype.appendLine = function (value) {
        this.append(value + '\n');
    };
    return ExtHostDebugConsole;
}());
export { ExtHostDebugConsole };
var ExtHostVariableResolverService = /** @class */ (function (_super) {
    __extends(ExtHostVariableResolverService, _super);
    function ExtHostVariableResolverService(workspaceService, editorService, configurationService) {
        return _super.call(this, {
            getFolderUri: function (folderName) {
                var folders = workspaceService.getWorkspaceFolders();
                var found = folders.filter(function (f) { return f.name === folderName; });
                if (found && found.length > 0) {
                    return found[0].uri;
                }
                return undefined;
            },
            getWorkspaceFolderCount: function () {
                return workspaceService.getWorkspaceFolders().length;
            },
            getConfigurationValue: function (folderUri, section) {
                return configurationService.getConfiguration(undefined, folderUri).get(section);
            },
            getExecPath: function () {
                return process.env['VSCODE_EXEC_PATH'];
            },
            getFilePath: function () {
                var activeEditor = editorService.activeEditor();
                if (activeEditor) {
                    var resource = activeEditor.document.uri;
                    if (resource.scheme === Schemas.file) {
                        return paths.normalize(resource.fsPath, true);
                    }
                }
                return undefined;
            },
            getSelectedText: function () {
                var activeEditor = editorService.activeEditor();
                if (activeEditor && !activeEditor.selection.isEmpty) {
                    return activeEditor.document.getText(activeEditor.selection);
                }
                return undefined;
            },
            getLineNumber: function () {
                var activeEditor = editorService.activeEditor();
                if (activeEditor) {
                    return String(activeEditor.selection.end.line + 1);
                }
                return undefined;
            }
        }) || this;
    }
    return ExtHostVariableResolverService;
}(AbstractVariableResolverService));
export { ExtHostVariableResolverService };
var MultiTracker = /** @class */ (function () {
    function MultiTracker(trackers) {
        this.trackers = trackers;
    }
    MultiTracker.prototype.startDebugAdapter = function () {
        this.trackers.forEach(function (t) { return t.startDebugAdapter ? t.startDebugAdapter() : void 0; });
    };
    MultiTracker.prototype.toDebugAdapter = function (message) {
        this.trackers.forEach(function (t) { return t.toDebugAdapter ? t.toDebugAdapter(message) : void 0; });
    };
    MultiTracker.prototype.fromDebugAdapter = function (message) {
        this.trackers.forEach(function (t) { return t.fromDebugAdapter ? t.fromDebugAdapter(message) : void 0; });
    };
    MultiTracker.prototype.debugAdapterError = function (error) {
        this.trackers.forEach(function (t) { return t.debugAdapterError ? t.debugAdapterError(error) : void 0; });
    };
    MultiTracker.prototype.debugAdapterExit = function (code, signal) {
        this.trackers.forEach(function (t) { return t.debugAdapterExit ? t.debugAdapterExit(code, signal) : void 0; });
    };
    MultiTracker.prototype.stopDebugAdapter = function () {
        this.trackers.forEach(function (t) { return t.stopDebugAdapter ? t.stopDebugAdapter() : void 0; });
    };
    return MultiTracker;
}());
var DirectTransport = /** @class */ (function () {
    function DirectTransport(da) {
        this.da = da;
    }
    DirectTransport.prototype.start = function (cb, errorcb) {
        this._sendUp = cb;
    };
    DirectTransport.prototype.sendUp = function (message) {
        this._sendUp(message);
    };
    // DA -> VSCode
    DirectTransport.prototype.send = function (message) {
        this.da.acceptMessage(message);
    };
    DirectTransport.prototype.stop = function () {
        throw new Error('Method not implemented.');
    };
    return DirectTransport;
}());
var DirectDebugAdapter = /** @class */ (function (_super) {
    __extends(DirectDebugAdapter, _super);
    function DirectDebugAdapter(implementation) {
        var _this = _super.call(this) || this;
        if (implementation.__setTransport) {
            _this.transport = new DirectTransport(_this);
            implementation.__setTransport(_this.transport);
        }
        return _this;
    }
    DirectDebugAdapter.prototype.startSession = function () {
        return Promise.resolve(void 0);
    };
    // VSCode -> DA
    DirectDebugAdapter.prototype.sendMessage = function (message) {
        this.transport.sendUp(message);
    };
    DirectDebugAdapter.prototype.stopSession = function () {
        this.transport.stop();
        return Promise.resolve(void 0);
    };
    return DirectDebugAdapter;
}(AbstractDebugAdapter));
