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
import * as fs from '../../../../../fs.js';
import * as cp from '../../../../../child_process.js';
import * as nls from '../../../../nls.js';
import * as net from '../../../../../net.js';
import * as paths from '../../../../base/common/paths.js';
import * as strings from '../../../../base/common/strings.js';
import * as objects from '../../../../base/common/objects.js';
import * as platform from '../../../../base/common/platform.js';
import { Emitter } from '../../../../base/common/event.js';
import { ExtensionsChannelId } from '../../../../platform/extensionManagement/common/extensionManagement.js';
/**
 * Abstract implementation of the low level API for a debug adapter.
 * Missing is how this API communicates with the debug adapter.
 */
var AbstractDebugAdapter = /** @class */ (function () {
    function AbstractDebugAdapter() {
        this.sequence = 1;
        this.pendingRequests = new Map();
        this._onError = new Emitter();
        this._onExit = new Emitter();
    }
    Object.defineProperty(AbstractDebugAdapter.prototype, "onError", {
        get: function () {
            return this._onError.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractDebugAdapter.prototype, "onExit", {
        get: function () {
            return this._onExit.event;
        },
        enumerable: true,
        configurable: true
    });
    AbstractDebugAdapter.prototype.onMessage = function (callback) {
        if (this.eventCallback) {
            this._onError.fire(new Error("attempt to set more than one 'Message' callback"));
        }
        this.messageCallback = callback;
    };
    AbstractDebugAdapter.prototype.onEvent = function (callback) {
        if (this.eventCallback) {
            this._onError.fire(new Error("attempt to set more than one 'Event' callback"));
        }
        this.eventCallback = callback;
    };
    AbstractDebugAdapter.prototype.onRequest = function (callback) {
        if (this.requestCallback) {
            this._onError.fire(new Error("attempt to set more than one 'Request' callback"));
        }
        this.requestCallback = callback;
    };
    AbstractDebugAdapter.prototype.sendResponse = function (response) {
        if (response.seq > 0) {
            this._onError.fire(new Error("attempt to send more than one response for command " + response.command));
        }
        else {
            this.internalSend('response', response);
        }
    };
    AbstractDebugAdapter.prototype.sendRequest = function (command, args, clb, timeout) {
        var _this = this;
        var request = {
            command: command
        };
        if (args && Object.keys(args).length > 0) {
            request.arguments = args;
        }
        this.internalSend('request', request);
        if (typeof timeout === 'number') {
            var timer_1 = setTimeout(function () {
                clearTimeout(timer_1);
                var clb = _this.pendingRequests.get(request.seq);
                if (clb) {
                    _this.pendingRequests.delete(request.seq);
                    var err = {
                        type: 'response',
                        seq: 0,
                        request_seq: request.seq,
                        success: false,
                        command: command,
                        message: "timeout after " + timeout + " ms"
                    };
                    clb(err);
                }
            }, timeout);
        }
        if (clb) {
            // store callback for this request
            this.pendingRequests.set(request.seq, clb);
        }
    };
    AbstractDebugAdapter.prototype.acceptMessage = function (message) {
        if (this.messageCallback) {
            this.messageCallback(message);
        }
        else {
            switch (message.type) {
                case 'event':
                    if (this.eventCallback) {
                        this.eventCallback(message);
                    }
                    break;
                case 'request':
                    if (this.requestCallback) {
                        this.requestCallback(message);
                    }
                    break;
                case 'response':
                    var response = message;
                    var clb = this.pendingRequests.get(response.request_seq);
                    if (clb) {
                        this.pendingRequests.delete(response.request_seq);
                        clb(response);
                    }
                    break;
            }
        }
    };
    AbstractDebugAdapter.prototype.internalSend = function (typ, message) {
        message.type = typ;
        message.seq = this.sequence++;
        this.sendMessage(message);
    };
    AbstractDebugAdapter.prototype.cancelPending = function () {
        var pending = this.pendingRequests;
        this.pendingRequests = new Map();
        setTimeout(function (_) {
            pending.forEach(function (callback, request_seq) {
                var err = {
                    type: 'response',
                    seq: 0,
                    request_seq: request_seq,
                    success: false,
                    command: 'canceled',
                    message: 'canceled'
                };
                callback(err);
            });
        }, 1000);
    };
    AbstractDebugAdapter.prototype.dispose = function () {
        this.cancelPending();
    };
    return AbstractDebugAdapter;
}());
export { AbstractDebugAdapter };
/**
 * An implementation that communicates via two streams with the debug adapter.
 */
var StreamDebugAdapter = /** @class */ (function (_super) {
    __extends(StreamDebugAdapter, _super);
    function StreamDebugAdapter() {
        return _super.call(this) || this;
    }
    StreamDebugAdapter.prototype.connect = function (readable, writable) {
        var _this = this;
        this.outputStream = writable;
        this.rawData = Buffer.allocUnsafe(0);
        this.contentLength = -1;
        readable.on('data', function (data) { return _this.handleData(data); });
    };
    StreamDebugAdapter.prototype.sendMessage = function (message) {
        if (this.outputStream) {
            var json = JSON.stringify(message);
            this.outputStream.write("Content-Length: " + Buffer.byteLength(json, 'utf8') + StreamDebugAdapter.TWO_CRLF + json, 'utf8');
        }
    };
    StreamDebugAdapter.prototype.handleData = function (data) {
        this.rawData = Buffer.concat([this.rawData, data]);
        while (true) {
            if (this.contentLength >= 0) {
                if (this.rawData.length >= this.contentLength) {
                    var message = this.rawData.toString('utf8', 0, this.contentLength);
                    this.rawData = this.rawData.slice(this.contentLength);
                    this.contentLength = -1;
                    if (message.length > 0) {
                        try {
                            this.acceptMessage(JSON.parse(message));
                        }
                        catch (e) {
                            this._onError.fire(new Error((e.message || e) + '\n' + message));
                        }
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                var idx = this.rawData.indexOf(StreamDebugAdapter.TWO_CRLF);
                if (idx !== -1) {
                    var header = this.rawData.toString('utf8', 0, idx);
                    var lines = header.split(StreamDebugAdapter.HEADER_LINESEPARATOR);
                    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        var h = lines_1[_i];
                        var kvPair = h.split(StreamDebugAdapter.HEADER_FIELDSEPARATOR);
                        if (kvPair[0] === 'Content-Length') {
                            this.contentLength = Number(kvPair[1]);
                        }
                    }
                    this.rawData = this.rawData.slice(idx + StreamDebugAdapter.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    };
    StreamDebugAdapter.TWO_CRLF = '\r\n\r\n';
    StreamDebugAdapter.HEADER_LINESEPARATOR = /\r?\n/; // allow for non-RFC 2822 conforming line separators
    StreamDebugAdapter.HEADER_FIELDSEPARATOR = /: */;
    return StreamDebugAdapter;
}(AbstractDebugAdapter));
export { StreamDebugAdapter };
/**
 * An implementation that connects to a debug adapter via a socket.
*/
var SocketDebugAdapter = /** @class */ (function (_super) {
    __extends(SocketDebugAdapter, _super);
    function SocketDebugAdapter(adapterServer) {
        var _this = _super.call(this) || this;
        _this.adapterServer = adapterServer;
        return _this;
    }
    SocketDebugAdapter.prototype.startSession = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var connected = false;
            _this.socket = net.createConnection(_this.adapterServer.port, _this.adapterServer.host || '127.0.0.1', function () {
                _this.connect(_this.socket, _this.socket);
                resolve(null);
                connected = true;
            });
            _this.socket.on('close', function () {
                if (connected) {
                    _this._onError.fire(new Error('connection closed'));
                }
                else {
                    reject(new Error('connection closed'));
                }
            });
            _this.socket.on('error', function (error) {
                if (connected) {
                    _this._onError.fire(error);
                }
                else {
                    reject(error);
                }
            });
        });
    };
    SocketDebugAdapter.prototype.stopSession = function () {
        // Cancel all sent promises on disconnect so debug trees are not left in a broken state #3666.
        this.cancelPending();
        if (this.socket) {
            this.socket.end();
            this.socket = undefined;
        }
        return Promise.resolve(undefined);
    };
    return SocketDebugAdapter;
}(StreamDebugAdapter));
export { SocketDebugAdapter };
/**
 * An implementation that launches the debug adapter as a separate process and communicates via stdin/stdout.
*/
var ExecutableDebugAdapter = /** @class */ (function (_super) {
    __extends(ExecutableDebugAdapter, _super);
    function ExecutableDebugAdapter(adapterExecutable, debugType, outputService) {
        var _this = _super.call(this) || this;
        _this.adapterExecutable = adapterExecutable;
        _this.debugType = debugType;
        _this.outputService = outputService;
        return _this;
    }
    ExecutableDebugAdapter.prototype.startSession = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // verify executables
            if (_this.adapterExecutable.command) {
                if (paths.isAbsolute(_this.adapterExecutable.command)) {
                    if (!fs.existsSync(_this.adapterExecutable.command)) {
                        reject(new Error(nls.localize('debugAdapterBinNotFound', "Debug adapter executable '{0}' does not exist.", _this.adapterExecutable.command)));
                    }
                }
                else {
                    // relative path
                    if (_this.adapterExecutable.command.indexOf('/') < 0 && _this.adapterExecutable.command.indexOf('\\') < 0) {
                        // no separators: command looks like a runtime name like 'node' or 'mono'
                        // TODO: check that the runtime is available on PATH
                    }
                }
            }
            else {
                reject(new Error(nls.localize({ key: 'debugAdapterCannotDetermineExecutable', comment: ['Adapter executable file not found'] }, "Cannot determine executable for debug adapter '{0}'.", _this.debugType)));
            }
            if (_this.adapterExecutable.command === 'node') {
                if (Array.isArray(_this.adapterExecutable.args) && _this.adapterExecutable.args.length > 0) {
                    var isElectron = !!process.env['ELECTRON_RUN_AS_NODE'] || !!process.versions['electron'];
                    var options = {
                        env: _this.adapterExecutable.env
                            ? objects.mixin(objects.mixin({}, process.env), _this.adapterExecutable.env)
                            : process.env,
                        execArgv: isElectron ? ['-e', 'delete process.env.ELECTRON_RUN_AS_NODE;require(process.argv[1])'] : [],
                        silent: true
                    };
                    if (_this.adapterExecutable.cwd) {
                        options.cwd = _this.adapterExecutable.cwd;
                    }
                    var child = cp.fork(_this.adapterExecutable.args[0], _this.adapterExecutable.args.slice(1), options);
                    if (!child.pid) {
                        reject(new Error(nls.localize('unableToLaunchDebugAdapter', "Unable to launch debug adapter from '{0}'.", _this.adapterExecutable.args[0])));
                    }
                    _this.serverProcess = child;
                    resolve(null);
                }
                else {
                    reject(new Error(nls.localize('unableToLaunchDebugAdapterNoArgs', "Unable to launch debug adapter.")));
                }
            }
            else {
                var options = {
                    env: _this.adapterExecutable.env
                        ? objects.mixin(objects.mixin({}, process.env), _this.adapterExecutable.env)
                        : process.env
                };
                if (_this.adapterExecutable.cwd) {
                    options.cwd = _this.adapterExecutable.cwd;
                }
                _this.serverProcess = cp.spawn(_this.adapterExecutable.command, _this.adapterExecutable.args, options);
                resolve(null);
            }
        }).then(function (_) {
            _this.serverProcess.on('error', function (err) {
                _this._onError.fire(err);
            });
            _this.serverProcess.on('exit', function (code, signal) {
                _this._onExit.fire(code);
            });
            _this.serverProcess.stdout.on('close', function () {
                _this._onError.fire(new Error('read error'));
            });
            _this.serverProcess.stdout.on('error', function (error) {
                _this._onError.fire(error);
            });
            _this.serverProcess.stdin.on('error', function (error) {
                _this._onError.fire(error);
            });
            if (_this.outputService) {
                var sanitize_1 = function (s) { return s.toString().replace(/\r?\n$/mg, ''); };
                // this.serverProcess.stdout.on('data', (data: string) => {
                // 	console.log('%c' + sanitize(data), 'background: #ddd; font-style: italic;');
                // });
                _this.serverProcess.stderr.on('data', function (data) {
                    _this.outputService.getChannel(ExtensionsChannelId).append(sanitize_1(data));
                });
            }
            _this.connect(_this.serverProcess.stdout, _this.serverProcess.stdin);
        }, function (err) {
            _this._onError.fire(err);
        });
    };
    ExecutableDebugAdapter.prototype.stopSession = function () {
        var _this = this;
        // Cancel all sent promises on disconnect so debug trees are not left in a broken state #3666.
        this.cancelPending();
        if (!this.serverProcess) {
            return Promise.resolve(null);
        }
        // when killing a process in windows its child
        // processes are *not* killed but become root
        // processes. Therefore we use TASKKILL.EXE
        if (platform.isWindows) {
            return new Promise(function (c, e) {
                var killer = cp.exec("taskkill /F /T /PID " + _this.serverProcess.pid, function (err, stdout, stderr) {
                    if (err) {
                        return e(err);
                    }
                });
                killer.on('exit', c);
                killer.on('error', e);
            });
        }
        else {
            this.serverProcess.kill('SIGTERM');
            return Promise.resolve(null);
        }
    };
    ExecutableDebugAdapter.extract = function (contribution, extensionFolderPath) {
        if (!contribution) {
            return undefined;
        }
        var result = Object.create(null);
        if (contribution.runtime) {
            if (contribution.runtime.indexOf('./') === 0) { // TODO
                result.runtime = paths.join(extensionFolderPath, contribution.runtime);
            }
            else {
                result.runtime = contribution.runtime;
            }
        }
        if (contribution.runtimeArgs) {
            result.runtimeArgs = contribution.runtimeArgs;
        }
        if (contribution.program) {
            if (!paths.isAbsolute(contribution.program)) {
                result.program = paths.join(extensionFolderPath, contribution.program);
            }
            else {
                result.program = contribution.program;
            }
        }
        if (contribution.args) {
            result.args = contribution.args;
        }
        if (contribution.win) {
            result.win = ExecutableDebugAdapter.extract(contribution.win, extensionFolderPath);
        }
        if (contribution.winx86) {
            result.winx86 = ExecutableDebugAdapter.extract(contribution.winx86, extensionFolderPath);
        }
        if (contribution.windows) {
            result.windows = ExecutableDebugAdapter.extract(contribution.windows, extensionFolderPath);
        }
        if (contribution.osx) {
            result.osx = ExecutableDebugAdapter.extract(contribution.osx, extensionFolderPath);
        }
        if (contribution.linux) {
            result.linux = ExecutableDebugAdapter.extract(contribution.linux, extensionFolderPath);
        }
        return result;
    };
    ExecutableDebugAdapter.platformAdapterExecutable = function (extensionDescriptions, debugType) {
        var result = Object.create(null);
        debugType = debugType.toLowerCase();
        var _loop_1 = function (ed) {
            if (ed.contributes) {
                var debuggers = ed.contributes['debuggers'];
                if (debuggers && debuggers.length > 0) {
                    debuggers.filter(function (dbg) { return strings.equalsIgnoreCase(dbg.type, debugType); }).forEach(function (dbg) {
                        // extract relevant attributes and make then absolute where needed
                        var extractedDbg = ExecutableDebugAdapter.extract(dbg, ed.extensionLocation.fsPath);
                        // merge
                        objects.mixin(result, extractedDbg, ed.isBuiltin);
                    });
                }
            }
        };
        // merge all contributions into one
        for (var _i = 0, extensionDescriptions_1 = extensionDescriptions; _i < extensionDescriptions_1.length; _i++) {
            var ed = extensionDescriptions_1[_i];
            _loop_1(ed);
        }
        // select the right platform
        var platformInfo;
        if (platform.isWindows && !process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')) {
            platformInfo = result.winx86 || result.win || result.windows;
        }
        else if (platform.isWindows) {
            platformInfo = result.win || result.windows;
        }
        else if (platform.isMacintosh) {
            platformInfo = result.osx;
        }
        else if (platform.isLinux) {
            platformInfo = result.linux;
        }
        platformInfo = platformInfo || result;
        // these are the relevant attributes
        var program = platformInfo.program || result.program;
        var args = platformInfo.args || result.args;
        var runtime = platformInfo.runtime || result.runtime;
        var runtimeArgs = platformInfo.runtimeArgs || result.runtimeArgs;
        if (runtime) {
            return {
                type: 'executable',
                command: runtime,
                args: (runtimeArgs || []).concat([program]).concat(args || [])
            };
        }
        else {
            return {
                type: 'executable',
                command: program,
                args: args || []
            };
        }
    };
    return ExecutableDebugAdapter;
}(StreamDebugAdapter));
export { ExecutableDebugAdapter };
