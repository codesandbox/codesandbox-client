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
import { createConnection, createServer } from '../../../../../net.js';
import { Emitter, once, mapEvent, fromNodeEventEmitter } from '../../../common/event.js';
import { IPCServer, IPCClient } from './ipc.js';
import { join } from '../../../../../path.js';
import { tmpdir } from '../../../../../os.js';
import { generateUuid } from '../../../common/uuid.js';
import { TimeoutTimer } from '../../../common/async.js';
export function generateRandomPipeName() {
    var randomSuffix = generateUuid();
    if (process.platform === 'win32') {
        return "\\\\.\\pipe\\vscode-ipc-" + randomSuffix + "-sock";
    }
    else {
        // Mac/Unix: use socket file
        return join(tmpdir(), "vscode-ipc-" + randomSuffix + ".sock");
    }
}
/**
 * A message has the following format:
 *
 * 		[bodyLen|message]
 * 		[header^|data^^^]
 * 		[u32be^^|buffer^]
 */
var Protocol = /** @class */ (function () {
    function Protocol(_socket, firstDataChunk) {
        var _this = this;
        this._socket = _socket;
        this._onMessage = new Emitter();
        this.onMessage = this._onMessage.event;
        this._onClose = new Emitter();
        this.onClose = this._onClose.event;
        this._writeBuffer = new /** @class */ (function () {
            function class_1() {
                this._data = [];
                this._totalLength = 0;
            }
            class_1.prototype.add = function (head, body) {
                var wasEmpty = this._totalLength === 0;
                this._data.push(head, body);
                this._totalLength += head.length + body.length;
                return wasEmpty;
            };
            class_1.prototype.take = function () {
                var ret = Buffer.concat(this._data, this._totalLength);
                this._data.length = 0;
                this._totalLength = 0;
                return ret;
            };
            return class_1;
        }());
        this._isDisposed = false;
        this._chunks = [];
        var totalLength = 0;
        var state = {
            readHead: true,
            bodyLen: -1,
        };
        var acceptChunk = function (data) {
            _this._chunks.push(data);
            totalLength += data.length;
            while (totalLength > 0) {
                if (state.readHead) {
                    // expecting header -> read 5bytes for header
                    // information: `bodyIsJson` and `bodyLen`
                    if (totalLength >= Protocol._headerLen) {
                        var all = Buffer.concat(_this._chunks);
                        state.bodyLen = all.readUInt32BE(0);
                        state.readHead = false;
                        var rest = all.slice(Protocol._headerLen);
                        totalLength = rest.length;
                        _this._chunks = [rest];
                    }
                    else {
                        break;
                    }
                }
                if (!state.readHead) {
                    // expecting body -> read bodyLen-bytes for
                    // the actual message or wait for more data
                    if (totalLength >= state.bodyLen) {
                        var all = Buffer.concat(_this._chunks);
                        var buffer = all.slice(0, state.bodyLen);
                        // ensure the getBuffer returns a valid value if invoked from the event listeners
                        var rest = all.slice(state.bodyLen);
                        totalLength = rest.length;
                        _this._chunks = [rest];
                        state.bodyLen = -1;
                        state.readHead = true;
                        _this._onMessage.fire(buffer);
                        if (_this._isDisposed) {
                            // check if an event listener lead to our disposal
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        };
        var acceptFirstDataChunk = function () {
            if (firstDataChunk && firstDataChunk.length > 0) {
                var tmp = firstDataChunk;
                firstDataChunk = undefined;
                acceptChunk(tmp);
            }
        };
        // Make sure to always handle the firstDataChunk if no more `data` event comes in
        this._firstChunkTimer = new TimeoutTimer();
        this._firstChunkTimer.setIfNotSet(function () {
            acceptFirstDataChunk();
        }, 0);
        this._socketDataListener = function (data) {
            acceptFirstDataChunk();
            acceptChunk(data);
        };
        _socket.on('data', this._socketDataListener);
        this._socketEndListener = function () {
            acceptFirstDataChunk();
        };
        _socket.on('end', this._socketEndListener);
        this._socketCloseListener = function () {
            _this._onClose.fire();
        };
        _socket.once('close', this._socketCloseListener);
    }
    Protocol.prototype.dispose = function () {
        this._isDisposed = true;
        this._firstChunkTimer.dispose();
        this._socket.removeListener('data', this._socketDataListener);
        this._socket.removeListener('end', this._socketEndListener);
        this._socket.removeListener('close', this._socketCloseListener);
    };
    Protocol.prototype.end = function () {
        this._socket.end();
    };
    Protocol.prototype.getBuffer = function () {
        return Buffer.concat(this._chunks);
    };
    Protocol.prototype.send = function (buffer) {
        var header = Buffer.allocUnsafe(Protocol._headerLen);
        header.writeUInt32BE(buffer.length, 0, true);
        this._writeSoon(header, buffer);
    };
    Protocol.prototype._writeSoon = function (header, data) {
        var _this = this;
        if (this._writeBuffer.add(header, data)) {
            setImmediate(function () {
                // return early if socket has been destroyed in the meantime
                if (_this._socket.destroyed) {
                    return;
                }
                // we ignore the returned value from `write` because we would have to cached the data
                // anyways and nodejs is already doing that for us:
                // > https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
                // > However, the false return value is only advisory and the writable stream will unconditionally
                // > accept and buffer chunk even if it has not not been allowed to drain.
                _this._socket.write(_this._writeBuffer.take());
            });
        }
    };
    Protocol._headerLen = 4;
    return Protocol;
}());
export { Protocol };
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(server) {
        var _this = _super.call(this, Server.toClientConnectionEvent(server)) || this;
        _this.server = server;
        return _this;
    }
    Server.toClientConnectionEvent = function (server) {
        var onConnection = fromNodeEventEmitter(server, 'connection');
        return mapEvent(onConnection, function (socket) { return ({
            protocol: new Protocol(socket),
            onDidClientDisconnect: once(fromNodeEventEmitter(socket, 'close'))
        }); });
    };
    Server.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    };
    return Server;
}(IPCServer));
export { Server };
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(protocol, id) {
        var _this = _super.call(this, protocol, id) || this;
        _this.protocol = protocol;
        return _this;
    }
    Client.fromSocket = function (socket, id) {
        return new Client(new Protocol(socket), id);
    };
    Object.defineProperty(Client.prototype, "onClose", {
        get: function () { return this.protocol.onClose; },
        enumerable: true,
        configurable: true
    });
    Client.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.protocol.end();
    };
    return Client;
}(IPCClient));
export { Client };
export function serve(hook) {
    return new Promise(function (c, e) {
        var server = createServer();
        server.on('error', e);
        server.listen(hook, function () {
            server.removeListener('error', e);
            c(new Server(server));
        });
    });
}
export function connect(hook, clientId) {
    return new Promise(function (c, e) {
        var socket = createConnection(hook, function () {
            socket.removeListener('error', e);
            c(Client.fromSocket(socket, clientId));
        });
        socket.once('error', e);
    });
}
