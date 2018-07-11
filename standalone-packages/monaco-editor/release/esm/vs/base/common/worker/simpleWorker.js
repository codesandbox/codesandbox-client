/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { transformErrorForSerialization } from '../errors.js';
import { Disposable } from '../lifecycle.js';
import { TPromise } from '../winjs.base.js';
import { ShallowCancelThenPromise } from '../async.js';
import { isWeb } from '../platform.js';
var INITIALIZE = '$initialize';
var webWorkerWarningLogged = false;
export function logOnceWebWorkerWarning(err) {
    if (!isWeb) {
        // running tests
        return;
    }
    if (!webWorkerWarningLogged) {
        webWorkerWarningLogged = true;
        console.warn('Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/Microsoft/monaco-editor#faq');
    }
    console.warn(err.message);
}
var SimpleWorkerProtocol = /** @class */ (function () {
    function SimpleWorkerProtocol(handler) {
        this._workerId = -1;
        this._handler = handler;
        this._lastSentReq = 0;
        this._pendingReplies = Object.create(null);
    }
    SimpleWorkerProtocol.prototype.setWorkerId = function (workerId) {
        this._workerId = workerId;
    };
    SimpleWorkerProtocol.prototype.sendMessage = function (method, args) {
        var req = String(++this._lastSentReq);
        var reply = {
            c: null,
            e: null
        };
        var result = new TPromise(function (c, e) {
            reply.c = c;
            reply.e = e;
        }, function () {
            // Cancel not supported
        });
        this._pendingReplies[req] = reply;
        this._send({
            vsWorker: this._workerId,
            req: req,
            method: method,
            args: args
        });
        return result;
    };
    SimpleWorkerProtocol.prototype.handleMessage = function (serializedMessage) {
        var message;
        try {
            message = JSON.parse(serializedMessage);
        }
        catch (e) {
            // nothing
        }
        if (!message || !message.vsWorker) {
            return;
        }
        if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
            return;
        }
        this._handleMessage(message);
    };
    SimpleWorkerProtocol.prototype._handleMessage = function (msg) {
        var _this = this;
        if (msg.seq) {
            var replyMessage = msg;
            if (!this._pendingReplies[replyMessage.seq]) {
                console.warn('Got reply to unknown seq');
                return;
            }
            var reply = this._pendingReplies[replyMessage.seq];
            delete this._pendingReplies[replyMessage.seq];
            if (replyMessage.err) {
                var err = replyMessage.err;
                if (replyMessage.err.$isError) {
                    err = new Error();
                    err.name = replyMessage.err.name;
                    err.message = replyMessage.err.message;
                    err.stack = replyMessage.err.stack;
                }
                reply.e(err);
                return;
            }
            reply.c(replyMessage.res);
            return;
        }
        var requestMessage = msg;
        var req = requestMessage.req;
        var result = this._handler.handleMessage(requestMessage.method, requestMessage.args);
        result.then(function (r) {
            _this._send({
                vsWorker: _this._workerId,
                seq: req,
                res: r,
                err: undefined
            });
        }, function (e) {
            if (e.detail instanceof Error) {
                // Loading errors have a detail property that points to the actual error
                e.detail = transformErrorForSerialization(e.detail);
            }
            _this._send({
                vsWorker: _this._workerId,
                seq: req,
                res: undefined,
                err: transformErrorForSerialization(e)
            });
        });
    };
    SimpleWorkerProtocol.prototype._send = function (msg) {
        var strMsg = JSON.stringify(msg);
        // console.log('SENDING: ' + strMsg);
        this._handler.sendMessage(strMsg);
    };
    return SimpleWorkerProtocol;
}());
/**
 * Main thread side
 */
var SimpleWorkerClient = /** @class */ (function (_super) {
    __extends(SimpleWorkerClient, _super);
    function SimpleWorkerClient(workerFactory, moduleId) {
        var _this = _super.call(this) || this;
        var lazyProxyFulfill = null;
        var lazyProxyReject = null;
        _this._worker = _this._register(workerFactory.create('vs/base/common/worker/simpleWorker', function (msg) {
            _this._protocol.handleMessage(msg);
        }, function (err) {
            // in Firefox, web workers fail lazily :(
            // we will reject the proxy
            lazyProxyReject(err);
        }));
        _this._protocol = new SimpleWorkerProtocol({
            sendMessage: function (msg) {
                _this._worker.postMessage(msg);
            },
            handleMessage: function (method, args) {
                // Intentionally not supporting worker -> main requests
                return TPromise.as(null);
            }
        });
        _this._protocol.setWorkerId(_this._worker.getId());
        // Gather loader configuration
        var loaderConfiguration = null;
        if (typeof self.require !== 'undefined' && typeof self.require.getConfig === 'function') {
            // Get the configuration from the Monaco AMD Loader
            loaderConfiguration = self.require.getConfig();
        }
        else if (typeof self.requirejs !== 'undefined') {
            // Get the configuration from requirejs
            loaderConfiguration = self.requirejs.s.contexts._.config;
        }
        _this._lazyProxy = new TPromise(function (c, e) {
            lazyProxyFulfill = c;
            lazyProxyReject = e;
        }, function () { });
        // Send initialize message
        _this._onModuleLoaded = _this._protocol.sendMessage(INITIALIZE, [
            _this._worker.getId(),
            moduleId,
            loaderConfiguration
        ]);
        _this._onModuleLoaded.then(function (availableMethods) {
            var proxy = {};
            for (var i = 0; i < availableMethods.length; i++) {
                proxy[availableMethods[i]] = createProxyMethod(availableMethods[i], proxyMethodRequest);
            }
            lazyProxyFulfill(proxy);
        }, function (e) {
            lazyProxyReject(e);
            _this._onError('Worker failed to load ' + moduleId, e);
        });
        // Create proxy to loaded code
        var proxyMethodRequest = function (method, args) {
            return _this._request(method, args);
        };
        var createProxyMethod = function (method, proxyMethodRequest) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);
                return proxyMethodRequest(method, args);
            };
        };
        return _this;
    }
    SimpleWorkerClient.prototype.getProxyObject = function () {
        // Do not allow chaining promises to cancel the proxy creation
        return new ShallowCancelThenPromise(this._lazyProxy);
    };
    SimpleWorkerClient.prototype._request = function (method, args) {
        var _this = this;
        return new TPromise(function (c, e) {
            _this._onModuleLoaded.then(function () {
                _this._protocol.sendMessage(method, args).then(c, e);
            }, e);
        }, function () {
            // Cancel intentionally not supported
        });
    };
    SimpleWorkerClient.prototype._onError = function (message, error) {
        console.error(message);
        console.info(error);
    };
    return SimpleWorkerClient;
}(Disposable));
export { SimpleWorkerClient };
/**
 * Worker side
 */
var SimpleWorkerServer = /** @class */ (function () {
    function SimpleWorkerServer(postSerializedMessage, requestHandler) {
        var _this = this;
        this._requestHandler = requestHandler;
        this._protocol = new SimpleWorkerProtocol({
            sendMessage: function (msg) {
                postSerializedMessage(msg);
            },
            handleMessage: function (method, args) { return _this._handleMessage(method, args); }
        });
    }
    SimpleWorkerServer.prototype.onmessage = function (msg) {
        this._protocol.handleMessage(msg);
    };
    SimpleWorkerServer.prototype._handleMessage = function (method, args) {
        if (method === INITIALIZE) {
            return this.initialize(args[0], args[1], args[2]);
        }
        if (!this._requestHandler || typeof this._requestHandler[method] !== 'function') {
            return TPromise.wrapError(new Error('Missing requestHandler or method: ' + method));
        }
        try {
            return TPromise.as(this._requestHandler[method].apply(this._requestHandler, args));
        }
        catch (e) {
            return TPromise.wrapError(e);
        }
    };
    SimpleWorkerServer.prototype.initialize = function (workerId, moduleId, loaderConfig) {
        var _this = this;
        this._protocol.setWorkerId(workerId);
        if (this._requestHandler) {
            // static request handler
            var methods = [];
            for (var prop in this._requestHandler) {
                if (typeof this._requestHandler[prop] === 'function') {
                    methods.push(prop);
                }
            }
            return TPromise.as(methods);
        }
        if (loaderConfig) {
            // Remove 'baseUrl', handling it is beyond scope for now
            if (typeof loaderConfig.baseUrl !== 'undefined') {
                delete loaderConfig['baseUrl'];
            }
            if (typeof loaderConfig.paths !== 'undefined') {
                if (typeof loaderConfig.paths.vs !== 'undefined') {
                    delete loaderConfig.paths['vs'];
                }
            }
            // Since this is in a web worker, enable catching errors
            loaderConfig.catchError = true;
            self.require.config(loaderConfig);
        }
        var cc;
        var ee;
        var r = new TPromise(function (c, e) {
            cc = c;
            ee = e;
        });
        // Use the global require to be sure to get the global config
        self.require([moduleId], function () {
            var result = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                result[_i] = arguments[_i];
            }
            var handlerModule = result[0];
            _this._requestHandler = handlerModule.create();
            var methods = [];
            for (var prop in _this._requestHandler) {
                if (typeof _this._requestHandler[prop] === 'function') {
                    methods.push(prop);
                }
            }
            cc(methods);
        }, ee);
        return r;
    };
    return SimpleWorkerServer;
}());
export { SimpleWorkerServer };
/**
 * Called on the worker side
 */
export function create(postMessage) {
    return new SimpleWorkerServer(postMessage, null);
}
