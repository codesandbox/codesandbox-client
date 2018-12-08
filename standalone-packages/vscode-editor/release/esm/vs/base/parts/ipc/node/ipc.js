/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { toDisposable, combinedDisposable } from '../../../common/lifecycle.js';
import { Emitter, once, filterEvent, toPromise, Relay } from '../../../common/event.js';
import { always, createCancelablePromise, timeout } from '../../../common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../common/cancellation.js';
import * as errors from '../../../common/errors.js';
var State;
(function (State) {
    State[State["Uninitialized"] = 0] = "Uninitialized";
    State[State["Idle"] = 1] = "Idle";
})(State || (State = {}));
var BufferReader = /** @class */ (function () {
    function BufferReader(buffer) {
        this.buffer = buffer;
        this.pos = 0;
    }
    BufferReader.prototype.read = function (bytes) {
        var result = this.buffer.slice(this.pos, this.pos + bytes);
        this.pos += result.length;
        return result;
    };
    return BufferReader;
}());
var BufferWriter = /** @class */ (function () {
    function BufferWriter() {
        this.buffers = [];
    }
    Object.defineProperty(BufferWriter.prototype, "buffer", {
        get: function () {
            return Buffer.concat(this.buffers);
        },
        enumerable: true,
        configurable: true
    });
    BufferWriter.prototype.write = function (buffer) {
        this.buffers.push(buffer);
    };
    return BufferWriter;
}());
var DataType;
(function (DataType) {
    DataType[DataType["Undefined"] = 0] = "Undefined";
    DataType[DataType["String"] = 1] = "String";
    DataType[DataType["Buffer"] = 2] = "Buffer";
    DataType[DataType["Array"] = 3] = "Array";
    DataType[DataType["Object"] = 4] = "Object";
})(DataType || (DataType = {}));
function createSizeBuffer(size) {
    var result = Buffer.allocUnsafe(4);
    result.writeUInt32BE(size, 0);
    return result;
}
function readSizeBuffer(reader) {
    return reader.read(4).readUInt32BE(0);
}
var BufferPresets = {
    Undefined: Buffer.alloc(1, DataType.Undefined),
    String: Buffer.alloc(1, DataType.String),
    Buffer: Buffer.alloc(1, DataType.Buffer),
    Array: Buffer.alloc(1, DataType.Array),
    Object: Buffer.alloc(1, DataType.Object)
};
function serialize(writer, data) {
    if (typeof data === 'undefined') {
        writer.write(BufferPresets.Undefined);
    }
    else if (typeof data === 'string') {
        var buffer = Buffer.from(data);
        writer.write(BufferPresets.String);
        writer.write(createSizeBuffer(buffer.length));
        writer.write(buffer);
    }
    else if (Buffer.isBuffer(data)) {
        writer.write(BufferPresets.Buffer);
        writer.write(createSizeBuffer(data.length));
        writer.write(data);
    }
    else if (Array.isArray(data)) {
        writer.write(BufferPresets.Array);
        writer.write(createSizeBuffer(data.length));
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var el = data_1[_i];
            serialize(writer, el);
        }
    }
    else {
        var buffer = Buffer.from(JSON.stringify(data));
        writer.write(BufferPresets.Object);
        writer.write(createSizeBuffer(buffer.length));
        writer.write(buffer);
    }
}
function deserialize(reader) {
    var type = reader.read(1).readUInt8(0);
    switch (type) {
        case DataType.Undefined: return undefined;
        case DataType.String: return reader.read(readSizeBuffer(reader)).toString();
        case DataType.Buffer: return reader.read(readSizeBuffer(reader));
        case DataType.Array: {
            var length_1 = readSizeBuffer(reader);
            var result = [];
            for (var i = 0; i < length_1; i++) {
                result.push(deserialize(reader));
            }
            return result;
        }
        case DataType.Object: return JSON.parse(reader.read(readSizeBuffer(reader)).toString());
    }
}
var ChannelServer = /** @class */ (function () {
    function ChannelServer(protocol) {
        var _this = this;
        this.protocol = protocol;
        this.channels = new Map();
        this.activeRequests = new Map();
        this.protocolListener = this.protocol.onMessage(function (msg) { return _this.onRawMessage(msg); });
        this.sendResponse({ type: 200 /* Initialize */ });
    }
    ChannelServer.prototype.registerChannel = function (channelName, channel) {
        this.channels.set(channelName, channel);
    };
    ChannelServer.prototype.sendResponse = function (response) {
        switch (response.type) {
            case 200 /* Initialize */:
                return this.send([response.type]);
            case 201 /* PromiseSuccess */:
            case 202 /* PromiseError */:
            case 204 /* EventFire */:
            case 203 /* PromiseErrorObj */:
                return this.send([response.type, response.id], response.data);
        }
    };
    ChannelServer.prototype.send = function (header, body) {
        if (body === void 0) { body = undefined; }
        var writer = new BufferWriter();
        serialize(writer, header);
        serialize(writer, body);
        this.sendBuffer(writer.buffer);
    };
    ChannelServer.prototype.sendBuffer = function (message) {
        try {
            this.protocol.send(message);
        }
        catch (err) {
            // noop
        }
    };
    ChannelServer.prototype.onRawMessage = function (message) {
        var reader = new BufferReader(message);
        var header = deserialize(reader);
        var body = deserialize(reader);
        var type = header[0];
        switch (type) {
            case 100 /* Promise */:
                return this.onPromise({ type: type, id: header[1], channelName: header[2], name: header[3], arg: body });
            case 102 /* EventListen */:
                return this.onEventListen({ type: type, id: header[1], channelName: header[2], name: header[3], arg: body });
            case 101 /* PromiseCancel */:
                return this.disposeActiveRequest({ type: type, id: header[1] });
            case 103 /* EventDispose */:
                return this.disposeActiveRequest({ type: type, id: header[1] });
        }
    };
    ChannelServer.prototype.onPromise = function (request) {
        var _this = this;
        var channel = this.channels.get(request.channelName);
        var cancellationTokenSource = new CancellationTokenSource();
        var promise;
        try {
            promise = channel.call(request.name, request.arg, cancellationTokenSource.token);
        }
        catch (err) {
            promise = Promise.reject(err);
        }
        var id = request.id;
        promise.then(function (data) {
            _this.sendResponse({ id: id, data: data, type: 201 /* PromiseSuccess */ });
            _this.activeRequests.delete(request.id);
        }, function (err) {
            if (err instanceof Error) {
                _this.sendResponse({
                    id: id, data: {
                        message: err.message,
                        name: err.name,
                        stack: err.stack ? (err.stack.split ? err.stack.split('\n') : err.stack) : void 0
                    }, type: 202 /* PromiseError */
                });
            }
            else {
                _this.sendResponse({ id: id, data: err, type: 203 /* PromiseErrorObj */ });
            }
            _this.activeRequests.delete(request.id);
        });
        var disposable = toDisposable(function () { return cancellationTokenSource.cancel(); });
        this.activeRequests.set(request.id, disposable);
    };
    ChannelServer.prototype.onEventListen = function (request) {
        var _this = this;
        var channel = this.channels.get(request.channelName);
        var id = request.id;
        var event = channel.listen(request.name, request.arg);
        var disposable = event(function (data) { return _this.sendResponse({ id: id, data: data, type: 204 /* EventFire */ }); });
        this.activeRequests.set(request.id, disposable);
    };
    ChannelServer.prototype.disposeActiveRequest = function (request) {
        var disposable = this.activeRequests.get(request.id);
        if (disposable) {
            disposable.dispose();
            this.activeRequests.delete(request.id);
        }
    };
    ChannelServer.prototype.dispose = function () {
        if (this.protocolListener) {
            this.protocolListener.dispose();
            this.protocolListener = null;
        }
        this.activeRequests.forEach(function (d) { return d.dispose(); });
        this.activeRequests.clear();
    };
    return ChannelServer;
}());
export { ChannelServer };
var ChannelClient = /** @class */ (function () {
    function ChannelClient(protocol) {
        var _this = this;
        this.protocol = protocol;
        this.state = State.Uninitialized;
        this.activeRequests = new Set();
        this.handlers = new Map();
        this.lastRequestId = 0;
        this._onDidInitialize = new Emitter();
        this.onDidInitialize = this._onDidInitialize.event;
        this.protocolListener = this.protocol.onMessage(function (msg) { return _this.onBuffer(msg); });
    }
    ChannelClient.prototype.getChannel = function (channelName) {
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
    ChannelClient.prototype.requestPromise = function (channelName, name, arg, cancellationToken) {
        var _this = this;
        if (cancellationToken === void 0) { cancellationToken = CancellationToken.None; }
        var id = this.lastRequestId++;
        var type = 100 /* Promise */;
        var request = { id: id, type: type, channelName: channelName, name: name, arg: arg };
        if (cancellationToken.isCancellationRequested) {
            return Promise.reject(errors.canceled());
        }
        var disposable;
        var result = new Promise(function (c, e) {
            if (cancellationToken.isCancellationRequested) {
                return e(errors.canceled());
            }
            var uninitializedPromise = createCancelablePromise(function (_) { return _this.whenInitialized(); });
            uninitializedPromise.then(function () {
                uninitializedPromise = null;
                var handler = function (response) {
                    switch (response.type) {
                        case 201 /* PromiseSuccess */:
                            _this.handlers.delete(id);
                            c(response.data);
                            break;
                        case 202 /* PromiseError */:
                            _this.handlers.delete(id);
                            var error = new Error(response.data.message);
                            error.stack = response.data.stack;
                            error.name = response.data.name;
                            e(error);
                            break;
                        case 203 /* PromiseErrorObj */:
                            _this.handlers.delete(id);
                            e(response.data);
                            break;
                    }
                };
                _this.handlers.set(id, handler);
                _this.sendRequest(request);
            });
            var cancel = function () {
                if (uninitializedPromise) {
                    uninitializedPromise.cancel();
                    uninitializedPromise = null;
                }
                else {
                    _this.sendRequest({ id: id, type: 101 /* PromiseCancel */ });
                }
                e(errors.canceled());
            };
            var cancellationTokenListener = cancellationToken.onCancellationRequested(cancel);
            disposable = combinedDisposable([toDisposable(cancel), cancellationTokenListener]);
            _this.activeRequests.add(disposable);
        });
        always(result, function () { return _this.activeRequests.delete(disposable); });
        return result;
    };
    ChannelClient.prototype.requestEvent = function (channelName, name, arg) {
        var _this = this;
        var id = this.lastRequestId++;
        var type = 102 /* EventListen */;
        var request = { id: id, type: type, channelName: channelName, name: name, arg: arg };
        var uninitializedPromise = null;
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                uninitializedPromise = createCancelablePromise(function (_) { return _this.whenInitialized(); });
                uninitializedPromise.then(function () {
                    uninitializedPromise = null;
                    _this.activeRequests.add(emitter);
                    _this.sendRequest(request);
                });
            },
            onLastListenerRemove: function () {
                if (uninitializedPromise) {
                    uninitializedPromise.cancel();
                    uninitializedPromise = null;
                }
                else {
                    _this.activeRequests.delete(emitter);
                    _this.sendRequest({ id: id, type: 103 /* EventDispose */ });
                }
            }
        });
        var handler = function (res) { return emitter.fire(res.data); };
        this.handlers.set(id, handler);
        return emitter.event;
    };
    ChannelClient.prototype.sendRequest = function (request) {
        switch (request.type) {
            case 100 /* Promise */:
            case 102 /* EventListen */:
                return this.send([request.type, request.id, request.channelName, request.name], request.arg);
            case 101 /* PromiseCancel */:
            case 103 /* EventDispose */:
                return this.send([request.type, request.id]);
        }
    };
    ChannelClient.prototype.send = function (header, body) {
        if (body === void 0) { body = undefined; }
        var writer = new BufferWriter();
        serialize(writer, header);
        serialize(writer, body);
        this.sendBuffer(writer.buffer);
    };
    ChannelClient.prototype.sendBuffer = function (message) {
        try {
            this.protocol.send(message);
        }
        catch (err) {
            // noop
        }
    };
    ChannelClient.prototype.onBuffer = function (message) {
        var reader = new BufferReader(message);
        var header = deserialize(reader);
        var body = deserialize(reader);
        var type = header[0];
        switch (type) {
            case 200 /* Initialize */:
                return this.onResponse({ type: header[0] });
            case 201 /* PromiseSuccess */:
            case 202 /* PromiseError */:
            case 204 /* EventFire */:
            case 203 /* PromiseErrorObj */:
                return this.onResponse({ type: header[0], id: header[1], data: body });
        }
    };
    ChannelClient.prototype.onResponse = function (response) {
        if (response.type === 200 /* Initialize */) {
            this.state = State.Idle;
            this._onDidInitialize.fire();
            return;
        }
        var handler = this.handlers.get(response.id);
        if (handler) {
            handler(response);
        }
    };
    ChannelClient.prototype.whenInitialized = function () {
        if (this.state === State.Idle) {
            return Promise.resolve();
        }
        else {
            return toPromise(this.onDidInitialize);
        }
    };
    ChannelClient.prototype.dispose = function () {
        if (this.protocolListener) {
            this.protocolListener.dispose();
            this.protocolListener = null;
        }
        this.activeRequests.forEach(function (p) { return p.dispose(); });
        this.activeRequests.clear();
    };
    return ChannelClient;
}());
export { ChannelClient };
/**
 * An `IPCServer` is both a channel server and a routing channel
 * client.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
var IPCServer = /** @class */ (function () {
    function IPCServer(onDidClientConnect) {
        var _this = this;
        this.channels = new Map();
        this.channelClients = new Map();
        this.onClientAdded = new Emitter();
        onDidClientConnect(function (_a) {
            var protocol = _a.protocol, onDidClientDisconnect = _a.onDidClientDisconnect;
            var onFirstMessage = once(protocol.onMessage);
            onFirstMessage(function (rawId) {
                var channelServer = new ChannelServer(protocol);
                var channelClient = new ChannelClient(protocol);
                _this.channels.forEach(function (channel, name) { return channelServer.registerChannel(name, channel); });
                var id = rawId.toString();
                if (_this.channelClients.has(id)) {
                    console.warn("IPC client with id '" + id + "' is already registered.");
                }
                _this.channelClients.set(id, channelClient);
                _this.onClientAdded.fire(id);
                onDidClientDisconnect(function () {
                    channelServer.dispose();
                    channelClient.dispose();
                    _this.channelClients.delete(id);
                });
            });
        });
    }
    Object.defineProperty(IPCServer.prototype, "clientKeys", {
        get: function () {
            var result = [];
            this.channelClients.forEach(function (_, key) { return result.push(key); });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    IPCServer.prototype.getChannel = function (channelName, router) {
        var that = this;
        return {
            call: function (command, arg, cancellationToken) {
                var channelPromise = router.routeCall(that.clientKeys, command, arg)
                    .then(function (id) { return that.getClient(id); })
                    .then(function (client) { return client.getChannel(channelName); });
                return getDelayedChannel(channelPromise)
                    .call(command, arg, cancellationToken);
            },
            listen: function (event, arg) {
                var channelPromise = router.routeEvent(that.clientKeys, event, arg)
                    .then(function (id) { return that.getClient(id); })
                    .then(function (client) { return client.getChannel(channelName); });
                return getDelayedChannel(channelPromise)
                    .listen(event, arg);
            }
        };
    };
    IPCServer.prototype.registerChannel = function (channelName, channel) {
        this.channels.set(channelName, channel);
    };
    IPCServer.prototype.getClient = function (clientId) {
        var _this = this;
        if (!clientId) {
            return Promise.reject(new Error('Client id should be provided'));
        }
        var client = this.channelClients.get(clientId);
        if (client) {
            return Promise.resolve(client);
        }
        return new Promise(function (c) {
            var onClient = once(filterEvent(_this.onClientAdded.event, function (id) { return id === clientId; }));
            onClient(function () { return c(_this.channelClients.get(clientId)); });
        });
    };
    IPCServer.prototype.dispose = function () {
        this.channels.clear();
        this.channelClients.clear();
        this.onClientAdded.dispose();
    };
    return IPCServer;
}());
export { IPCServer };
/**
 * An `IPCClient` is both a channel client and a channel server.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
var IPCClient = /** @class */ (function () {
    function IPCClient(protocol, id) {
        protocol.send(Buffer.from(id));
        this.channelClient = new ChannelClient(protocol);
        this.channelServer = new ChannelServer(protocol);
    }
    IPCClient.prototype.getChannel = function (channelName) {
        return this.channelClient.getChannel(channelName);
    };
    IPCClient.prototype.registerChannel = function (channelName, channel) {
        this.channelServer.registerChannel(channelName, channel);
    };
    IPCClient.prototype.dispose = function () {
        this.channelClient.dispose();
        this.channelServer.dispose();
    };
    return IPCClient;
}());
export { IPCClient };
export function getDelayedChannel(promise) {
    return {
        call: function (command, arg, cancellationToken) {
            return promise.then(function (c) { return c.call(command, arg, cancellationToken); });
        },
        listen: function (event, arg) {
            var relay = new Relay();
            promise.then(function (c) { return relay.input = c.listen(event, arg); });
            return relay.event;
        }
    };
}
export function getNextTickChannel(channel) {
    var didTick = false;
    return {
        call: function (command, arg, cancellationToken) {
            if (didTick) {
                return channel.call(command, arg, cancellationToken);
            }
            return timeout(0)
                .then(function () { return didTick = true; })
                .then(function () { return channel.call(command, arg, cancellationToken); });
        },
        listen: function (event, arg) {
            if (didTick) {
                return channel.listen(event, arg);
            }
            var relay = new Relay();
            timeout(0)
                .then(function () { return didTick = true; })
                .then(function () { return relay.input = channel.listen(event, arg); });
            return relay.event;
        }
    };
}
