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
import { fork } from '../../../../../child_process.js';
import { toDisposable, dispose } from '../../../common/lifecycle.js';
import { Delayer, always, createCancelablePromise } from '../../../common/async.js';
import { deepClone, assign } from '../../../common/objects.js';
import { Emitter, fromNodeEventEmitter, Event } from '../../../common/event.js';
import { createQueuedSender } from '../../../node/processes.js';
import { ChannelServer as IPCServer, ChannelClient as IPCClient } from './ipc.js';
import { isRemoteConsoleLog, log } from '../../../node/console.js';
import { CancellationToken } from '../../../common/cancellation.js';
import * as errors from '../../../common/errors.js';
/**
 * This implementation doesn't perform well since it uses base64 encoding for buffers.
 * We should move all implementations to use named ipc.net, so we stop depending on cp.fork.
 */
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server() {
        var _this = _super.call(this, {
            send: function (r) {
                try {
                    if (process.send) {
                        process.send(r.toString('base64'));
                    }
                }
                catch (e) { /* not much to do */ }
            },
            onMessage: fromNodeEventEmitter(process, 'message', function (msg) { return Buffer.from(msg, 'base64'); })
        }) || this;
        process.once('disconnect', function () { return _this.dispose(); });
        return _this;
    }
    return Server;
}(IPCServer));
export { Server };
var Client = /** @class */ (function () {
    function Client(modulePath, options) {
        this.modulePath = modulePath;
        this.options = options;
        this.activeRequests = new Set();
        this.channels = new Map();
        this._onDidProcessExit = new Emitter();
        this.onDidProcessExit = this._onDidProcessExit.event;
        var timeout = options && options.timeout ? options.timeout : 60000;
        this.disposeDelayer = new Delayer(timeout);
        this.child = null;
        this._client = null;
    }
    Client.prototype.getChannel = function (channelName) {
        var that = this;
        return {
            call: function (command, arg, cancellationToken) {
                return that.requestPromise(channelName, command, arg, cancellationToken);
            },
            listen: function (event, arg) {
                return that.requestEvent(channelName, event, arg);
            }
        };
    };
    Client.prototype.requestPromise = function (channelName, name, arg, cancellationToken) {
        var _this = this;
        if (cancellationToken === void 0) { cancellationToken = CancellationToken.None; }
        if (!this.disposeDelayer) {
            return Promise.reject(new Error('disposed'));
        }
        if (cancellationToken.isCancellationRequested) {
            return Promise.reject(errors.canceled());
        }
        this.disposeDelayer.cancel();
        var channel = this.getCachedChannel(channelName);
        var result = createCancelablePromise(function (token) { return channel.call(name, arg, token); });
        var cancellationTokenListener = cancellationToken.onCancellationRequested(function () { return result.cancel(); });
        var disposable = toDisposable(function () { return result.cancel(); });
        this.activeRequests.add(disposable);
        always(result, function () {
            cancellationTokenListener.dispose();
            _this.activeRequests.delete(disposable);
            if (_this.activeRequests.size === 0) {
                _this.disposeDelayer.trigger(function () { return _this.disposeClient(); });
            }
        });
        return result;
    };
    Client.prototype.requestEvent = function (channelName, name, arg) {
        var _this = this;
        if (!this.disposeDelayer) {
            return Event.None;
        }
        this.disposeDelayer.cancel();
        var listener;
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                var channel = _this.getCachedChannel(channelName);
                var event = channel.listen(name, arg);
                listener = event(emitter.fire, emitter);
                _this.activeRequests.add(listener);
            },
            onLastListenerRemove: function () {
                _this.activeRequests.delete(listener);
                listener.dispose();
                if (_this.activeRequests.size === 0 && _this.disposeDelayer) {
                    _this.disposeDelayer.trigger(function () { return _this.disposeClient(); });
                }
            }
        });
        return emitter.event;
    };
    Object.defineProperty(Client.prototype, "client", {
        get: function () {
            var _this = this;
            if (!this._client) {
                var args = this.options && this.options.args ? this.options.args : [];
                var forkOpts = Object.create(null);
                forkOpts.env = assign(deepClone(process.env), { 'VSCODE_PARENT_PID': String(process.pid) });
                if (this.options && this.options.env) {
                    forkOpts.env = assign(forkOpts.env, this.options.env);
                }
                if (this.options && this.options.freshExecArgv) {
                    forkOpts.execArgv = [];
                }
                if (this.options && typeof this.options.debug === 'number') {
                    forkOpts.execArgv = ['--nolazy', '--inspect=' + this.options.debug];
                }
                if (this.options && typeof this.options.debugBrk === 'number') {
                    forkOpts.execArgv = ['--nolazy', '--inspect-brk=' + this.options.debugBrk];
                }
                this.child = fork(this.modulePath, args, forkOpts);
                var onMessageEmitter_1 = new Emitter();
                var onRawMessage = fromNodeEventEmitter(this.child, 'message', function (msg) { return msg; });
                onRawMessage(function (msg) {
                    // Handle remote console logs specially
                    if (isRemoteConsoleLog(msg)) {
                        log(msg, "IPC Library: " + _this.options.serverName);
                        return;
                    }
                    // Anything else goes to the outside
                    onMessageEmitter_1.fire(Buffer.from(msg, 'base64'));
                });
                var sender_1 = this.options.useQueue ? createQueuedSender(this.child) : this.child;
                var send = function (r) { return _this.child && _this.child.connected && sender_1.send(r.toString('base64')); };
                var onMessage = onMessageEmitter_1.event;
                var protocol = { send: send, onMessage: onMessage };
                this._client = new IPCClient(protocol);
                var onExit_1 = function () { return _this.disposeClient(); };
                process.once('exit', onExit_1);
                this.child.on('error', function (err) { return console.warn('IPC "' + _this.options.serverName + '" errored with ' + err); });
                this.child.on('exit', function (code, signal) {
                    process.removeListener('exit', onExit_1);
                    _this.activeRequests.forEach(function (r) { return dispose(r); });
                    _this.activeRequests.clear();
                    if (code !== 0 && signal !== 'SIGTERM') {
                        console.warn('IPC "' + _this.options.serverName + '" crashed with exit code ' + code + ' and signal ' + signal);
                    }
                    if (_this.disposeDelayer) {
                        _this.disposeDelayer.cancel();
                    }
                    _this.disposeClient();
                    _this._onDidProcessExit.fire({ code: code, signal: signal });
                });
            }
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Client.prototype.getCachedChannel = function (name) {
        var channel = this.channels.get(name);
        if (!channel) {
            channel = this.client.getChannel(name);
            this.channels.set(name, channel);
        }
        return channel;
    };
    Client.prototype.disposeClient = function () {
        if (this._client) {
            if (this.child) {
                this.child.kill();
                this.child = null;
            }
            this._client = null;
            this.channels.clear();
        }
    };
    Client.prototype.dispose = function () {
        this._onDidProcessExit.dispose();
        this.disposeDelayer.cancel();
        this.disposeDelayer = null; // StrictNullOverride: nulling out ok in dispose
        this.disposeClient();
        this.activeRequests.clear();
    };
    return Client;
}());
export { Client };
