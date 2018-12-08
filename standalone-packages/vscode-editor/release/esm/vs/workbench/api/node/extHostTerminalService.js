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
import * as os from '../../../../os.js';
import * as platform from '../../../base/common/platform.js';
import * as terminalEnvironment from '../../parts/terminal/node/terminalEnvironment.js';
import { Emitter } from '../../../base/common/event.js';
import { MainContext } from './extHost.protocol.js';
import { EXT_HOST_CREATION_DELAY } from '../../parts/terminal/common/terminal.js';
import { TerminalProcess } from '../../parts/terminal/node/terminalProcess.js';
import { timeout } from '../../../base/common/async.js';
var RENDERER_NO_PROCESS_ID = -1;
var BaseExtHostTerminal = /** @class */ (function () {
    function BaseExtHostTerminal(_proxy, id) {
        var _this = this;
        this._proxy = _proxy;
        this._disposed = false;
        this._queuedRequests = [];
        this._idPromise = new Promise(function (c) {
            if (id !== undefined) {
                _this._id = id;
                c(id);
            }
            else {
                _this._idPromiseComplete = c;
            }
        });
    }
    BaseExtHostTerminal.prototype.dispose = function () {
        if (!this._disposed) {
            this._disposed = true;
            this._queueApiRequest(this._proxy.$dispose, []);
        }
    };
    BaseExtHostTerminal.prototype._checkDisposed = function () {
        if (this._disposed) {
            throw new Error('Terminal has already been disposed');
        }
    };
    BaseExtHostTerminal.prototype._queueApiRequest = function (callback, args) {
        var request = new ApiRequest(callback, args);
        if (!this._id) {
            this._queuedRequests.push(request);
            return;
        }
        request.run(this._proxy, this._id);
    };
    BaseExtHostTerminal.prototype._runQueuedRequests = function (id) {
        var _this = this;
        this._id = id;
        this._idPromiseComplete(id);
        this._queuedRequests.forEach(function (r) {
            r.run(_this._proxy, _this._id);
        });
        this._queuedRequests.length = 0;
    };
    return BaseExtHostTerminal;
}());
export { BaseExtHostTerminal };
var ExtHostTerminal = /** @class */ (function (_super) {
    __extends(ExtHostTerminal, _super);
    function ExtHostTerminal(proxy, _name, id, pid) {
        var _this = _super.call(this, proxy, id) || this;
        _this._name = _name;
        _this._onData = new Emitter();
        _this._pidPromise = new Promise(function (c) {
            if (pid === RENDERER_NO_PROCESS_ID) {
                c(undefined);
            }
            else {
                _this._pidPromiseComplete = c;
            }
        });
        return _this;
    }
    Object.defineProperty(ExtHostTerminal.prototype, "onDidWriteData", {
        get: function () {
            var _this = this;
            // Tell the main side to start sending data if it's not already
            this._idPromise.then(function (c) {
                _this._proxy.$registerOnDataListener(_this._id);
            });
            return this._onData && this._onData.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTerminal.prototype.create = function (shellPath, shellArgs, cwd, env, waitOnExit) {
        var _this = this;
        this._proxy.$createTerminal(this._name, shellPath, shellArgs, cwd, env, waitOnExit).then(function (id) {
            _this._runQueuedRequests(id);
        });
    };
    Object.defineProperty(ExtHostTerminal.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminal.prototype, "processId", {
        get: function () {
            return this._pidPromise;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTerminal.prototype.sendText = function (text, addNewLine) {
        if (addNewLine === void 0) { addNewLine = true; }
        this._checkDisposed();
        this._queueApiRequest(this._proxy.$sendText, [text, addNewLine]);
    };
    ExtHostTerminal.prototype.show = function (preserveFocus) {
        this._checkDisposed();
        this._queueApiRequest(this._proxy.$show, [preserveFocus]);
    };
    ExtHostTerminal.prototype.hide = function () {
        this._checkDisposed();
        this._queueApiRequest(this._proxy.$hide, []);
    };
    ExtHostTerminal.prototype._setProcessId = function (processId) {
        // The event may fire 2 times when the panel is restored
        if (this._pidPromiseComplete) {
            this._pidPromiseComplete(processId);
            this._pidPromiseComplete = null;
        }
    };
    ExtHostTerminal.prototype._fireOnData = function (data) {
        this._onData.fire(data);
    };
    return ExtHostTerminal;
}(BaseExtHostTerminal));
export { ExtHostTerminal };
var ExtHostTerminalRenderer = /** @class */ (function (_super) {
    __extends(ExtHostTerminalRenderer, _super);
    function ExtHostTerminalRenderer(proxy, _name, _terminal) {
        var _this = _super.call(this, proxy) || this;
        _this._name = _name;
        _this._terminal = _terminal;
        _this._onInput = new Emitter();
        _this._onDidChangeMaximumDimensions = new Emitter();
        _this._proxy.$createTerminalRenderer(_this._name).then(function (id) {
            _this._runQueuedRequests(id);
            _this._terminal._runQueuedRequests(id);
        });
        return _this;
    }
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "name", {
        get: function () { return this._name; },
        set: function (newName) {
            this._name = newName;
            this._checkDisposed();
            this._queueApiRequest(this._proxy.$terminalRendererSetName, [this._name]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "onDidAcceptInput", {
        get: function () {
            this._checkDisposed();
            this._queueApiRequest(this._proxy.$terminalRendererRegisterOnInputListener, [this._id]);
            // Tell the main side to start sending data if it's not already
            // this._proxy.$terminalRendererRegisterOnDataListener(this._id);
            return this._onInput && this._onInput.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "dimensions", {
        get: function () { return this._dimensions; },
        set: function (dimensions) {
            this._checkDisposed();
            this._dimensions = dimensions;
            this._queueApiRequest(this._proxy.$terminalRendererSetDimensions, [dimensions]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "maximumDimensions", {
        get: function () {
            if (!this._maximumDimensions) {
                return undefined;
            }
            return {
                rows: this._maximumDimensions.rows,
                columns: this._maximumDimensions.columns
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "onDidChangeMaximumDimensions", {
        get: function () {
            return this._onDidChangeMaximumDimensions && this._onDidChangeMaximumDimensions.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalRenderer.prototype, "terminal", {
        get: function () {
            return this._terminal;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTerminalRenderer.prototype.write = function (data) {
        this._checkDisposed();
        this._queueApiRequest(this._proxy.$terminalRendererWrite, [data]);
    };
    ExtHostTerminalRenderer.prototype._fireOnInput = function (data) {
        this._onInput.fire(data);
    };
    ExtHostTerminalRenderer.prototype._setMaximumDimensions = function (columns, rows) {
        if (this._maximumDimensions && this._maximumDimensions.columns === columns && this._maximumDimensions.rows === rows) {
            return;
        }
        this._maximumDimensions = { columns: columns, rows: rows };
        this._onDidChangeMaximumDimensions.fire(this.maximumDimensions);
    };
    return ExtHostTerminalRenderer;
}(BaseExtHostTerminal));
export { ExtHostTerminalRenderer };
var ExtHostTerminalService = /** @class */ (function () {
    function ExtHostTerminalService(mainContext, _extHostConfiguration, _logService) {
        this._extHostConfiguration = _extHostConfiguration;
        this._logService = _logService;
        this._terminals = [];
        this._terminalProcesses = {};
        this._terminalRenderers = [];
        this._getTerminalPromises = {};
        this._onDidCloseTerminal = new Emitter();
        this._onDidOpenTerminal = new Emitter();
        this._onDidChangeActiveTerminal = new Emitter();
        this._proxy = mainContext.getProxy(MainContext.MainThreadTerminalService);
    }
    Object.defineProperty(ExtHostTerminalService.prototype, "activeTerminal", {
        get: function () { return this._activeTerminal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalService.prototype, "terminals", {
        get: function () { return this._terminals; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalService.prototype, "onDidCloseTerminal", {
        get: function () { return this._onDidCloseTerminal && this._onDidCloseTerminal.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalService.prototype, "onDidOpenTerminal", {
        get: function () { return this._onDidOpenTerminal && this._onDidOpenTerminal.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTerminalService.prototype, "onDidChangeActiveTerminal", {
        get: function () { return this._onDidChangeActiveTerminal && this._onDidChangeActiveTerminal.event; },
        enumerable: true,
        configurable: true
    });
    ExtHostTerminalService.prototype.createTerminal = function (name, shellPath, shellArgs) {
        var terminal = new ExtHostTerminal(this._proxy, name);
        terminal.create(shellPath, shellArgs);
        this._terminals.push(terminal);
        return terminal;
    };
    ExtHostTerminalService.prototype.createTerminalFromOptions = function (options) {
        var terminal = new ExtHostTerminal(this._proxy, options.name);
        terminal.create(options.shellPath, options.shellArgs, options.cwd, options.env /*, options.waitOnExit*/);
        this._terminals.push(terminal);
        return terminal;
    };
    ExtHostTerminalService.prototype.createTerminalRenderer = function (name) {
        var terminal = new ExtHostTerminal(this._proxy, name);
        terminal._setProcessId(undefined);
        this._terminals.push(terminal);
        var renderer = new ExtHostTerminalRenderer(this._proxy, name, terminal);
        this._terminalRenderers.push(renderer);
        return renderer;
    };
    ExtHostTerminalService.prototype.$acceptActiveTerminalChanged = function (id) {
        var _this = this;
        var original = this._activeTerminal;
        if (id === null) {
            this._activeTerminal = undefined;
            if (original !== this._activeTerminal) {
                this._onDidChangeActiveTerminal.fire(this._activeTerminal);
            }
        }
        this._performTerminalIdAction(id, function (terminal) {
            if (terminal) {
                _this._activeTerminal = terminal;
                if (original !== _this._activeTerminal) {
                    _this._onDidChangeActiveTerminal.fire(_this._activeTerminal);
                }
            }
        });
    };
    ExtHostTerminalService.prototype.$acceptTerminalProcessData = function (id, data) {
        this._getTerminalByIdEventually(id).then(function (terminal) {
            if (terminal) {
                terminal._fireOnData(data);
            }
        });
    };
    ExtHostTerminalService.prototype.$acceptTerminalRendererDimensions = function (id, cols, rows) {
        var renderer = this._getTerminalRendererById(id);
        if (renderer) {
            renderer._setMaximumDimensions(cols, rows);
        }
    };
    ExtHostTerminalService.prototype.$acceptTerminalRendererInput = function (id, data) {
        var renderer = this._getTerminalRendererById(id);
        if (renderer) {
            renderer._fireOnInput(data);
        }
    };
    ExtHostTerminalService.prototype.$acceptTerminalTitleChange = function (id, name) {
        var extHostTerminal = this._getTerminalObjectById(this.terminals, id);
        if (extHostTerminal) {
            extHostTerminal.name = name;
        }
    };
    ExtHostTerminalService.prototype.$acceptTerminalClosed = function (id) {
        var index = this._getTerminalObjectIndexById(this.terminals, id);
        if (index === null) {
            return;
        }
        var terminal = this._terminals.splice(index, 1)[0];
        this._onDidCloseTerminal.fire(terminal);
    };
    ExtHostTerminalService.prototype.$acceptTerminalOpened = function (id, name) {
        var index = this._getTerminalObjectIndexById(this._terminals, id);
        if (index !== null) {
            // The terminal has already been created (via createTerminal*), only fire the event
            this._onDidOpenTerminal.fire(this.terminals[index]);
            return;
        }
        var renderer = this._getTerminalRendererById(id);
        var terminal = new ExtHostTerminal(this._proxy, name, id, renderer ? RENDERER_NO_PROCESS_ID : undefined);
        this._terminals.push(terminal);
        this._onDidOpenTerminal.fire(terminal);
    };
    ExtHostTerminalService.prototype.$acceptTerminalProcessId = function (id, processId) {
        this._performTerminalIdAction(id, function (terminal) { return terminal._setProcessId(processId); });
    };
    ExtHostTerminalService.prototype._performTerminalIdAction = function (id, callback) {
        var _this = this;
        var terminal = this._getTerminalById(id);
        if (terminal) {
            callback(terminal);
        }
        else {
            // Retry one more time in case the terminal has not yet been initialized.
            setTimeout(function () {
                terminal = _this._getTerminalById(id);
                if (terminal) {
                    callback(terminal);
                }
            }, EXT_HOST_CREATION_DELAY);
        }
    };
    ExtHostTerminalService.prototype.$createProcess = function (id, shellLaunchConfig, cols, rows) {
        // TODO: This function duplicates a lot of TerminalProcessManager.createProcess, ideally
        // they would be merged into a single implementation.
        var _this = this;
        var terminalConfig = this._extHostConfiguration.getConfiguration('terminal.integrated');
        if (!shellLaunchConfig.executable) {
            // TODO: This duplicates some of TerminalConfigHelper.mergeDefaultShellPathAndArgs and should be merged
            // this._configHelper.mergeDefaultShellPathAndArgs(shellLaunchConfig);
            var platformKey = platform.isWindows ? 'windows' : platform.isMacintosh ? 'osx' : 'linux';
            var shellConfigValue = terminalConfig.get("shell." + platformKey);
            var shellArgsConfigValue = terminalConfig.get("shellArgs." + platformKey);
            shellLaunchConfig.executable = shellConfigValue;
            shellLaunchConfig.args = shellArgsConfigValue;
        }
        // TODO: Base the cwd on the last active workspace root
        // const lastActiveWorkspaceRootUri = this._historyService.getLastActiveWorkspaceRoot(Schemas.file);
        // this.initialCwd = terminalEnvironment.getCwd(shellLaunchConfig, lastActiveWorkspaceRootUri, this._configHelper);
        var initialCwd = os.homedir();
        // TODO: Pull in and resolve config settings
        // // Resolve env vars from config and shell
        // const lastActiveWorkspaceRoot = this._workspaceContextService.getWorkspaceFolder(lastActiveWorkspaceRootUri);
        // const platformKey = platform.isWindows ? 'windows' : (platform.isMacintosh ? 'osx' : 'linux');
        // const envFromConfig = terminalEnvironment.resolveConfigurationVariables(this._configurationResolverService, { ...this._configHelper.config.env[platformKey] }, lastActiveWorkspaceRoot);
        // const envFromShell = terminalEnvironment.resolveConfigurationVariables(this._configurationResolverService, { ...shellLaunchConfig.env }, lastActiveWorkspaceRoot);
        // Merge process env with the env from config
        var env = __assign({}, process.env);
        // terminalEnvironment.mergeEnvironments(env, envFromConfig);
        terminalEnvironment.mergeEnvironments(env, shellLaunchConfig.env);
        // Continue env initialization, merging in the env from the launch
        // config and adding keys that are needed to create the process
        var locale = terminalConfig.get('setLocaleVariables') ? platform.locale : undefined;
        terminalEnvironment.addTerminalEnvironmentKeys(env, locale);
        // Fork the process and listen for messages
        this._logService.debug("Terminal process launching on ext host", shellLaunchConfig, initialCwd, cols, rows, env);
        this._terminalProcesses[id] = new TerminalProcess(shellLaunchConfig, initialCwd, cols, rows, env);
        this._terminalProcesses[id].onProcessIdReady(function (pid) { return _this._proxy.$sendProcessPid(id, pid); });
        this._terminalProcesses[id].onProcessTitleChanged(function (title) { return _this._proxy.$sendProcessTitle(id, title); });
        this._terminalProcesses[id].onProcessData(function (data) { return _this._proxy.$sendProcessData(id, data); });
        this._terminalProcesses[id].onProcessExit(function (exitCode) { return _this._onProcessExit(id, exitCode); });
    };
    ExtHostTerminalService.prototype.$acceptProcessInput = function (id, data) {
        this._terminalProcesses[id].input(data);
    };
    ExtHostTerminalService.prototype.$acceptProcessResize = function (id, cols, rows) {
        try {
            this._terminalProcesses[id].resize(cols, rows);
        }
        catch (error) {
            // We tried to write to a closed pipe / channel.
            if (error.code !== 'EPIPE' && error.code !== 'ERR_IPC_CHANNEL_CLOSED') {
                throw (error);
            }
        }
    };
    ExtHostTerminalService.prototype.$acceptProcessShutdown = function (id, immediate) {
        this._terminalProcesses[id].shutdown(immediate);
    };
    ExtHostTerminalService.prototype._onProcessExit = function (id, exitCode) {
        // Remove listeners
        this._terminalProcesses[id].dispose();
        // Remove process reference
        delete this._terminalProcesses[id];
        // Send exit event to main side
        this._proxy.$sendProcessExit(id, exitCode);
    };
    ExtHostTerminalService.prototype._getTerminalByIdEventually = function (id, retries) {
        var _this = this;
        if (retries === void 0) { retries = 5; }
        if (!this._getTerminalPromises[id]) {
            this._getTerminalPromises[id] = this._createGetTerminalPromise(id, retries);
        }
        else {
            this._getTerminalPromises[id].then(function (c) {
                return _this._createGetTerminalPromise(id, retries);
            });
        }
        return this._getTerminalPromises[id];
    };
    ExtHostTerminalService.prototype._createGetTerminalPromise = function (id, retries) {
        var _this = this;
        if (retries === void 0) { retries = 5; }
        return new Promise(function (c) {
            if (retries === 0) {
                c(undefined);
                return;
            }
            var terminal = _this._getTerminalById(id);
            if (terminal) {
                c(terminal);
            }
            else {
                // This should only be needed immediately after createTerminalRenderer is called as
                // the ExtHostTerminal has not yet been iniitalized
                timeout(200).then(function () { return c(_this._getTerminalByIdEventually(id, retries - 1)); });
            }
        });
    };
    ExtHostTerminalService.prototype._getTerminalById = function (id) {
        return this._getTerminalObjectById(this._terminals, id);
    };
    ExtHostTerminalService.prototype._getTerminalRendererById = function (id) {
        return this._getTerminalObjectById(this._terminalRenderers, id);
    };
    ExtHostTerminalService.prototype._getTerminalObjectById = function (array, id) {
        var index = this._getTerminalObjectIndexById(array, id);
        return index !== null ? array[index] : null;
    };
    ExtHostTerminalService.prototype._getTerminalObjectIndexById = function (array, id) {
        var index = null;
        array.some(function (item, i) {
            var thisId = item._id;
            if (thisId === id) {
                index = i;
                return true;
            }
            return false;
        });
        return index;
    };
    return ExtHostTerminalService;
}());
export { ExtHostTerminalService };
var ApiRequest = /** @class */ (function () {
    function ApiRequest(callback, args) {
        this._callback = callback;
        this._args = args;
    }
    ApiRequest.prototype.run = function (proxy, id) {
        this._callback.apply(proxy, [id].concat(this._args));
    };
    return ApiRequest;
}());
