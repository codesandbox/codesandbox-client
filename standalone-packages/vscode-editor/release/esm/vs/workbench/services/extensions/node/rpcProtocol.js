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
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import * as errors from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { LazyPromise } from './lazyPromise.js';
import { ProxyIdentifier, getStringIdentifierForProxy } from './proxyIdentifier.js';
function safeStringify(obj, replacer) {
    try {
        return JSON.stringify(obj, replacer);
    }
    catch (err) {
        return 'null';
    }
}
function createURIReplacer(transformer) {
    if (!transformer) {
        return null;
    }
    return function (key, value) {
        if (value && value.$mid === 1) {
            return transformer.transformOutgoing(value);
        }
        return value;
    };
}
function _transformOutgoingURIs(obj, transformer, depth) {
    if (!obj || depth > 200) {
        return null;
    }
    if (typeof obj === 'object') {
        if (obj instanceof URI) {
            return transformer.transformOutgoing(obj);
        }
        // walk object (or array)
        for (var key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                var r = _transformOutgoingURIs(obj[key], transformer, depth + 1);
                if (r !== null) {
                    obj[key] = r;
                }
            }
        }
    }
    return null;
}
export function transformOutgoingURIs(obj, transformer) {
    var result = _transformOutgoingURIs(obj, transformer, 0);
    if (result === null) {
        // no change
        return obj;
    }
    return result;
}
function _transformIncomingURIs(obj, transformer, depth) {
    if (!obj || depth > 200) {
        return null;
    }
    if (typeof obj === 'object') {
        if (obj.$mid === 1) {
            return transformer.transformIncoming(obj);
        }
        // walk object (or array)
        for (var key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                var r = _transformIncomingURIs(obj[key], transformer, depth + 1);
                if (r !== null) {
                    obj[key] = r;
                }
            }
        }
    }
    return null;
}
function transformIncomingURIs(obj, transformer) {
    var result = _transformIncomingURIs(obj, transformer, 0);
    if (result === null) {
        // no change
        return obj;
    }
    return result;
}
var noop = function () { };
var RPCProtocol = /** @class */ (function (_super) {
    __extends(RPCProtocol, _super);
    function RPCProtocol(protocol, logger, transformer) {
        if (logger === void 0) { logger = null; }
        if (transformer === void 0) { transformer = null; }
        var _this = _super.call(this) || this;
        _this._onDidChangeResponsiveState = _this._register(new Emitter());
        _this.onDidChangeResponsiveState = _this._onDidChangeResponsiveState.event;
        _this._protocol = protocol;
        _this._logger = logger;
        _this._uriTransformer = transformer;
        _this._uriReplacer = createURIReplacer(_this._uriTransformer);
        _this._isDisposed = false;
        _this._locals = [];
        _this._proxies = [];
        for (var i = 0, len = ProxyIdentifier.count; i < len; i++) {
            _this._locals[i] = null;
            _this._proxies[i] = null;
        }
        _this._lastMessageId = 0;
        _this._cancelInvokedHandlers = Object.create(null);
        _this._pendingRPCReplies = {};
        _this._responsiveState = 0 /* Responsive */;
        _this._unacknowledgedCount = 0;
        _this._unresponsiveTime = 0;
        _this._asyncCheckUresponsive = _this._register(new RunOnceScheduler(function () { return _this._checkUnresponsive(); }, 1000));
        _this._protocol.onMessage(function (msg) { return _this._receiveOneMessage(msg); });
        return _this;
    }
    RPCProtocol.prototype.dispose = function () {
        var _this = this;
        this._isDisposed = true;
        // Release all outstanding promises with a canceled error
        Object.keys(this._pendingRPCReplies).forEach(function (msgId) {
            var pending = _this._pendingRPCReplies[msgId];
            pending.resolveErr(errors.canceled());
        });
    };
    RPCProtocol.prototype._onWillSendRequest = function (req) {
        if (this._unacknowledgedCount === 0) {
            // Since this is the first request we are sending in a while,
            // mark this moment as the start for the countdown to unresponsive time
            this._unresponsiveTime = Date.now() + RPCProtocol.UNRESPONSIVE_TIME;
        }
        this._unacknowledgedCount++;
        if (!this._asyncCheckUresponsive.isScheduled()) {
            this._asyncCheckUresponsive.schedule();
        }
    };
    RPCProtocol.prototype._onDidReceiveAcknowledge = function (req) {
        // The next possible unresponsive time is now + delta.
        this._unresponsiveTime = Date.now() + RPCProtocol.UNRESPONSIVE_TIME;
        this._unacknowledgedCount--;
        if (this._unacknowledgedCount === 0) {
            // No more need to check for unresponsive
            this._asyncCheckUresponsive.cancel();
        }
        // The ext host is responsive!
        this._setResponsiveState(0 /* Responsive */);
    };
    RPCProtocol.prototype._checkUnresponsive = function () {
        if (this._unacknowledgedCount === 0) {
            // Not waiting for anything => cannot say if it is responsive or not
            return;
        }
        if (Date.now() > this._unresponsiveTime) {
            // Unresponsive!!
            this._setResponsiveState(1 /* Unresponsive */);
        }
        else {
            // Not (yet) unresponsive, be sure to check again soon
            this._asyncCheckUresponsive.schedule();
        }
    };
    RPCProtocol.prototype._setResponsiveState = function (newResponsiveState) {
        if (this._responsiveState === newResponsiveState) {
            // no change
            return;
        }
        this._responsiveState = newResponsiveState;
        this._onDidChangeResponsiveState.fire(this._responsiveState);
    };
    Object.defineProperty(RPCProtocol.prototype, "responsiveState", {
        get: function () {
            return this._responsiveState;
        },
        enumerable: true,
        configurable: true
    });
    RPCProtocol.prototype.transformIncomingURIs = function (obj) {
        if (!this._uriTransformer) {
            return obj;
        }
        return transformIncomingURIs(obj, this._uriTransformer);
    };
    RPCProtocol.prototype.getProxy = function (identifier) {
        var rpcId = identifier.nid;
        if (!this._proxies[rpcId]) {
            this._proxies[rpcId] = this._createProxy(rpcId);
        }
        return this._proxies[rpcId];
    };
    RPCProtocol.prototype._createProxy = function (rpcId) {
        var _this = this;
        var handler = {
            get: function (target, name) {
                if (!target[name] && name.charCodeAt(0) === 36 /* DollarSign */) {
                    target[name] = function () {
                        var myArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            myArgs[_i] = arguments[_i];
                        }
                        return _this._remoteCall(rpcId, name, myArgs);
                    };
                }
                return target[name];
            }
        };
        return new Proxy(Object.create(null), handler);
    };
    RPCProtocol.prototype.set = function (identifier, value) {
        this._locals[identifier.nid] = value;
        return value;
    };
    RPCProtocol.prototype.assertRegistered = function (identifiers) {
        for (var i = 0, len = identifiers.length; i < len; i++) {
            var identifier = identifiers[i];
            if (!this._locals[identifier.nid]) {
                throw new Error("Missing actor " + identifier.sid + " (isMain: " + identifier.isMain + ")");
            }
        }
    };
    RPCProtocol.prototype._receiveOneMessage = function (rawmsg) {
        if (this._isDisposed) {
            return;
        }
        var msgLength = rawmsg.length;
        var buff = MessageBuffer.read(rawmsg, 0);
        var messageType = buff.readUInt8();
        var req = buff.readUInt32();
        switch (messageType) {
            case 1 /* RequestJSONArgs */:
            case 2 /* RequestJSONArgsWithCancellation */: {
                var _a = MessageIO.deserializeRequestJSONArgs(buff), rpcId = _a.rpcId, method = _a.method, args = _a.args;
                if (this._uriTransformer) {
                    args = transformIncomingURIs(args, this._uriTransformer);
                }
                this._receiveRequest(msgLength, req, rpcId, method, args, (messageType === 2 /* RequestJSONArgsWithCancellation */));
                break;
            }
            case 3 /* RequestMixedArgs */:
            case 4 /* RequestMixedArgsWithCancellation */: {
                var _b = MessageIO.deserializeRequestMixedArgs(buff), rpcId = _b.rpcId, method = _b.method, args = _b.args;
                if (this._uriTransformer) {
                    args = transformIncomingURIs(args, this._uriTransformer);
                }
                this._receiveRequest(msgLength, req, rpcId, method, args, (messageType === 4 /* RequestMixedArgsWithCancellation */));
                break;
            }
            case 5 /* Acknowledged */: {
                if (this._logger) {
                    this._logger.logIncoming(msgLength, req, 0 /* LocalSide */, "ack");
                }
                this._onDidReceiveAcknowledge(req);
                break;
            }
            case 6 /* Cancel */: {
                this._receiveCancel(msgLength, req);
                break;
            }
            case 7 /* ReplyOKEmpty */: {
                this._receiveReply(msgLength, req, undefined);
                break;
            }
            case 9 /* ReplyOKJSON */: {
                var value = MessageIO.deserializeReplyOKJSON(buff);
                if (this._uriTransformer) {
                    value = transformIncomingURIs(value, this._uriTransformer);
                }
                this._receiveReply(msgLength, req, value);
                break;
            }
            case 8 /* ReplyOKBuffer */: {
                var value = MessageIO.deserializeReplyOKBuffer(buff);
                this._receiveReply(msgLength, req, value);
                break;
            }
            case 10 /* ReplyErrError */: {
                var err = MessageIO.deserializeReplyErrError(buff);
                if (this._uriTransformer) {
                    err = transformIncomingURIs(err, this._uriTransformer);
                }
                this._receiveReplyErr(msgLength, req, err);
                break;
            }
            case 11 /* ReplyErrEmpty */: {
                this._receiveReplyErr(msgLength, req, undefined);
                break;
            }
        }
    };
    RPCProtocol.prototype._receiveRequest = function (msgLength, req, rpcId, method, args, usesCancellationToken) {
        var _this = this;
        if (this._logger) {
            this._logger.logIncoming(msgLength, req, 1 /* OtherSide */, "receiveRequest " + getStringIdentifierForProxy(rpcId) + "." + method + "(", args);
        }
        var callId = String(req);
        var promise;
        var cancel;
        if (usesCancellationToken) {
            var cancellationTokenSource_1 = new CancellationTokenSource();
            args.push(cancellationTokenSource_1.token);
            promise = this._invokeHandler(rpcId, method, args);
            cancel = function () { return cancellationTokenSource_1.cancel(); };
        }
        else {
            // cannot be cancelled
            promise = this._invokeHandler(rpcId, method, args);
            cancel = noop;
        }
        this._cancelInvokedHandlers[callId] = cancel;
        // Acknowledge the request
        var msg = MessageIO.serializeAcknowledged(req);
        if (this._logger) {
            this._logger.logOutgoing(msg.byteLength, req, 1 /* OtherSide */, "ack");
        }
        this._protocol.send(msg);
        promise.then(function (r) {
            delete _this._cancelInvokedHandlers[callId];
            var msg = MessageIO.serializeReplyOK(req, r, _this._uriReplacer);
            if (_this._logger) {
                _this._logger.logOutgoing(msg.byteLength, req, 1 /* OtherSide */, "reply:", r);
            }
            _this._protocol.send(msg);
        }, function (err) {
            delete _this._cancelInvokedHandlers[callId];
            var msg = MessageIO.serializeReplyErr(req, err);
            if (_this._logger) {
                _this._logger.logOutgoing(msg.byteLength, req, 1 /* OtherSide */, "replyErr:", err);
            }
            _this._protocol.send(msg);
        });
    };
    RPCProtocol.prototype._receiveCancel = function (msgLength, req) {
        if (this._logger) {
            this._logger.logIncoming(msgLength, req, 1 /* OtherSide */, "receiveCancel");
        }
        var callId = String(req);
        if (this._cancelInvokedHandlers[callId]) {
            this._cancelInvokedHandlers[callId]();
        }
    };
    RPCProtocol.prototype._receiveReply = function (msgLength, req, value) {
        if (this._logger) {
            this._logger.logIncoming(msgLength, req, 0 /* LocalSide */, "receiveReply:", value);
        }
        var callId = String(req);
        if (!this._pendingRPCReplies.hasOwnProperty(callId)) {
            return;
        }
        var pendingReply = this._pendingRPCReplies[callId];
        delete this._pendingRPCReplies[callId];
        pendingReply.resolveOk(value);
    };
    RPCProtocol.prototype._receiveReplyErr = function (msgLength, req, value) {
        if (this._logger) {
            this._logger.logIncoming(msgLength, req, 0 /* LocalSide */, "receiveReplyErr:", value);
        }
        var callId = String(req);
        if (!this._pendingRPCReplies.hasOwnProperty(callId)) {
            return;
        }
        var pendingReply = this._pendingRPCReplies[callId];
        delete this._pendingRPCReplies[callId];
        var err = null;
        if (value && value.$isError) {
            err = new Error();
            err.name = value.name;
            err.message = value.message;
            err.stack = value.stack;
        }
        pendingReply.resolveErr(err);
    };
    RPCProtocol.prototype._invokeHandler = function (rpcId, methodName, args) {
        try {
            return Promise.resolve(this._doInvokeHandler(rpcId, methodName, args));
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    RPCProtocol.prototype._doInvokeHandler = function (rpcId, methodName, args) {
        var actor = this._locals[rpcId];
        if (!actor) {
            throw new Error('Unknown actor ' + getStringIdentifierForProxy(rpcId));
        }
        var method = actor[methodName];
        if (typeof method !== 'function') {
            throw new Error('Unknown method ' + methodName + ' on actor ' + getStringIdentifierForProxy(rpcId));
        }
        return method.apply(actor, args);
    };
    RPCProtocol.prototype._remoteCall = function (rpcId, methodName, args) {
        var _this = this;
        if (this._isDisposed) {
            return Promise.reject(errors.canceled());
        }
        var cancellationToken = null;
        if (args.length > 0 && CancellationToken.isCancellationToken(args[args.length - 1])) {
            cancellationToken = args.pop();
        }
        if (cancellationToken && cancellationToken.isCancellationRequested) {
            // No need to do anything...
            return Promise.reject(errors.canceled());
        }
        var req = ++this._lastMessageId;
        var callId = String(req);
        var result = new LazyPromise();
        if (cancellationToken) {
            cancellationToken.onCancellationRequested(function () {
                var msg = MessageIO.serializeCancel(req);
                if (_this._logger) {
                    _this._logger.logOutgoing(msg.byteLength, req, 0 /* LocalSide */, "cancel");
                }
                _this._protocol.send(MessageIO.serializeCancel(req));
            });
        }
        this._pendingRPCReplies[callId] = result;
        this._onWillSendRequest(req);
        var msg = MessageIO.serializeRequest(req, rpcId, methodName, args, !!cancellationToken, this._uriReplacer);
        if (this._logger) {
            this._logger.logOutgoing(msg.byteLength, req, 0 /* LocalSide */, "request: " + getStringIdentifierForProxy(rpcId) + "." + methodName + "(", args);
        }
        this._protocol.send(msg);
        return result;
    };
    RPCProtocol.UNRESPONSIVE_TIME = 3 * 1000; // 3s
    return RPCProtocol;
}(Disposable));
export { RPCProtocol };
var MessageBuffer = /** @class */ (function () {
    function MessageBuffer(buff, offset) {
        this._buff = buff;
        this._offset = offset;
    }
    MessageBuffer.alloc = function (type, req, messageSize) {
        var result = new MessageBuffer(Buffer.allocUnsafe(messageSize + 1 /* type */ + 4 /* req */), 0);
        result.writeUInt8(type);
        result.writeUInt32(req);
        return result;
    };
    MessageBuffer.read = function (buff, offset) {
        return new MessageBuffer(buff, offset);
    };
    Object.defineProperty(MessageBuffer.prototype, "buffer", {
        get: function () {
            return this._buff;
        },
        enumerable: true,
        configurable: true
    });
    MessageBuffer.sizeUInt8 = function () {
        return 1;
    };
    MessageBuffer.prototype.writeUInt8 = function (n) {
        this._buff.writeUInt8(n, this._offset, true);
        this._offset += 1;
    };
    MessageBuffer.prototype.readUInt8 = function () {
        var n = this._buff.readUInt8(this._offset, true);
        this._offset += 1;
        return n;
    };
    MessageBuffer.prototype.writeUInt32 = function (n) {
        this._buff.writeUInt32BE(n, this._offset, true);
        this._offset += 4;
    };
    MessageBuffer.prototype.readUInt32 = function () {
        var n = this._buff.readUInt32BE(this._offset, true);
        this._offset += 4;
        return n;
    };
    MessageBuffer.sizeShortString = function (str, strByteLength) {
        return 1 /* string length */ + strByteLength /* actual string */;
    };
    MessageBuffer.prototype.writeShortString = function (str, strByteLength) {
        this._buff.writeUInt8(strByteLength, this._offset, true);
        this._offset += 1;
        this._buff.write(str, this._offset, strByteLength, 'utf8');
        this._offset += strByteLength;
    };
    MessageBuffer.prototype.readShortString = function () {
        var strLength = this._buff.readUInt8(this._offset, true);
        this._offset += 1;
        var str = this._buff.toString('utf8', this._offset, this._offset + strLength);
        this._offset += strLength;
        return str;
    };
    MessageBuffer.sizeLongString = function (str, strByteLength) {
        return 4 /* string length */ + strByteLength /* actual string */;
    };
    MessageBuffer.prototype.writeLongString = function (str, strByteLength) {
        this._buff.writeUInt32LE(strByteLength, this._offset, true);
        this._offset += 4;
        this._buff.write(str, this._offset, strByteLength, 'utf8');
        this._offset += strByteLength;
    };
    MessageBuffer.prototype.readLongString = function () {
        var strLength = this._buff.readUInt32LE(this._offset, true);
        this._offset += 4;
        var str = this._buff.toString('utf8', this._offset, this._offset + strLength);
        this._offset += strLength;
        return str;
    };
    MessageBuffer.sizeBuffer = function (buff, buffByteLength) {
        return 4 /* buffer length */ + buffByteLength /* actual buffer */;
    };
    MessageBuffer.prototype.writeBuffer = function (buff, buffByteLength) {
        this._buff.writeUInt32LE(buffByteLength, this._offset, true);
        this._offset += 4;
        buff.copy(this._buff, this._offset);
        this._offset += buffByteLength;
    };
    MessageBuffer.prototype.readBuffer = function () {
        var buffLength = this._buff.readUInt32LE(this._offset, true);
        this._offset += 4;
        var buff = this._buff.slice(this._offset, this._offset + buffLength);
        this._offset += buffLength;
        return buff;
    };
    MessageBuffer.sizeMixedArray = function (arr, arrLengths) {
        var size = 0;
        size += 1; // arr length
        for (var i = 0, len = arr.length; i < len; i++) {
            var el = arr[i];
            var elLength = arrLengths[i];
            size += 1; // arg type
            if (typeof el === 'string') {
                size += this.sizeLongString(el, elLength);
            }
            else {
                size += this.sizeBuffer(el, elLength);
            }
        }
        return size;
    };
    MessageBuffer.prototype.writeMixedArray = function (arr, arrLengths) {
        this._buff.writeUInt8(arr.length, this._offset, true);
        this._offset += 1;
        for (var i = 0, len = arr.length; i < len; i++) {
            var el = arr[i];
            var elLength = arrLengths[i];
            if (typeof el === 'string') {
                this.writeUInt8(1 /* String */);
                this.writeLongString(el, elLength);
            }
            else {
                this.writeUInt8(2 /* Buffer */);
                this.writeBuffer(el, elLength);
            }
        }
    };
    MessageBuffer.prototype.readMixedArray = function () {
        var arrLen = this._buff.readUInt8(this._offset, true);
        this._offset += 1;
        var arr = new Array(arrLen);
        for (var i = 0; i < arrLen; i++) {
            var argType = this.readUInt8();
            if (argType === 1 /* String */) {
                arr[i] = this.readLongString();
            }
            else {
                arr[i] = this.readBuffer();
            }
        }
        return arr;
    };
    return MessageBuffer;
}());
var MessageIO = /** @class */ (function () {
    function MessageIO() {
    }
    MessageIO._arrayContainsBuffer = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (Buffer.isBuffer(arr[i])) {
                return true;
            }
        }
        return false;
    };
    MessageIO.serializeRequest = function (req, rpcId, method, args, usesCancellationToken, replacer) {
        if (this._arrayContainsBuffer(args)) {
            var massagedArgs = new Array(args.length);
            var argsLengths = new Array(args.length);
            for (var i = 0, len = args.length; i < len; i++) {
                var arg = args[i];
                if (Buffer.isBuffer(arg)) {
                    massagedArgs[i] = arg;
                    argsLengths[i] = arg.byteLength;
                }
                else {
                    massagedArgs[i] = safeStringify(arg, replacer);
                    argsLengths[i] = Buffer.byteLength(massagedArgs[i], 'utf8');
                }
            }
            return this._requestMixedArgs(req, rpcId, method, massagedArgs, argsLengths, usesCancellationToken);
        }
        return this._requestJSONArgs(req, rpcId, method, safeStringify(args, replacer), usesCancellationToken);
    };
    MessageIO._requestJSONArgs = function (req, rpcId, method, args, usesCancellationToken) {
        var methodByteLength = Buffer.byteLength(method, 'utf8');
        var argsByteLength = Buffer.byteLength(args, 'utf8');
        var len = 0;
        len += MessageBuffer.sizeUInt8();
        len += MessageBuffer.sizeShortString(method, methodByteLength);
        len += MessageBuffer.sizeLongString(args, argsByteLength);
        var result = MessageBuffer.alloc(usesCancellationToken ? 2 /* RequestJSONArgsWithCancellation */ : 1 /* RequestJSONArgs */, req, len);
        result.writeUInt8(rpcId);
        result.writeShortString(method, methodByteLength);
        result.writeLongString(args, argsByteLength);
        return result.buffer;
    };
    MessageIO.deserializeRequestJSONArgs = function (buff) {
        var rpcId = buff.readUInt8();
        var method = buff.readShortString();
        var args = buff.readLongString();
        return {
            rpcId: rpcId,
            method: method,
            args: JSON.parse(args)
        };
    };
    MessageIO._requestMixedArgs = function (req, rpcId, method, args, argsLengths, usesCancellationToken) {
        var methodByteLength = Buffer.byteLength(method, 'utf8');
        var len = 0;
        len += MessageBuffer.sizeUInt8();
        len += MessageBuffer.sizeShortString(method, methodByteLength);
        len += MessageBuffer.sizeMixedArray(args, argsLengths);
        var result = MessageBuffer.alloc(usesCancellationToken ? 4 /* RequestMixedArgsWithCancellation */ : 3 /* RequestMixedArgs */, req, len);
        result.writeUInt8(rpcId);
        result.writeShortString(method, methodByteLength);
        result.writeMixedArray(args, argsLengths);
        return result.buffer;
    };
    MessageIO.deserializeRequestMixedArgs = function (buff) {
        var rpcId = buff.readUInt8();
        var method = buff.readShortString();
        var rawargs = buff.readMixedArray();
        var args = new Array(rawargs.length);
        for (var i = 0, len = rawargs.length; i < len; i++) {
            var rawarg = rawargs[i];
            if (typeof rawarg === 'string') {
                args[i] = JSON.parse(rawarg);
            }
            else {
                args[i] = rawarg;
            }
        }
        return {
            rpcId: rpcId,
            method: method,
            args: args
        };
    };
    MessageIO.serializeAcknowledged = function (req) {
        return MessageBuffer.alloc(5 /* Acknowledged */, req, 0).buffer;
    };
    MessageIO.serializeCancel = function (req) {
        return MessageBuffer.alloc(6 /* Cancel */, req, 0).buffer;
    };
    MessageIO.serializeReplyOK = function (req, res, replacer) {
        if (typeof res === 'undefined') {
            return this._serializeReplyOKEmpty(req);
        }
        if (Buffer.isBuffer(res)) {
            return this._serializeReplyOKBuffer(req, res);
        }
        return this._serializeReplyOKJSON(req, safeStringify(res, replacer));
    };
    MessageIO._serializeReplyOKEmpty = function (req) {
        return MessageBuffer.alloc(7 /* ReplyOKEmpty */, req, 0).buffer;
    };
    MessageIO._serializeReplyOKBuffer = function (req, res) {
        var resByteLength = res.byteLength;
        var len = 0;
        len += MessageBuffer.sizeBuffer(res, resByteLength);
        var result = MessageBuffer.alloc(8 /* ReplyOKBuffer */, req, len);
        result.writeBuffer(res, resByteLength);
        return result.buffer;
    };
    MessageIO.deserializeReplyOKBuffer = function (buff) {
        return buff.readBuffer();
    };
    MessageIO._serializeReplyOKJSON = function (req, res) {
        var resByteLength = Buffer.byteLength(res, 'utf8');
        var len = 0;
        len += MessageBuffer.sizeLongString(res, resByteLength);
        var result = MessageBuffer.alloc(9 /* ReplyOKJSON */, req, len);
        result.writeLongString(res, resByteLength);
        return result.buffer;
    };
    MessageIO.deserializeReplyOKJSON = function (buff) {
        var res = buff.readLongString();
        return JSON.parse(res);
    };
    MessageIO.serializeReplyErr = function (req, err) {
        if (err instanceof Error) {
            return this._serializeReplyErrEror(req, err);
        }
        return this._serializeReplyErrEmpty(req);
    };
    MessageIO._serializeReplyErrEror = function (req, _err) {
        var err = safeStringify(errors.transformErrorForSerialization(_err), null);
        var errByteLength = Buffer.byteLength(err, 'utf8');
        var len = 0;
        len += MessageBuffer.sizeLongString(err, errByteLength);
        var result = MessageBuffer.alloc(10 /* ReplyErrError */, req, len);
        result.writeLongString(err, errByteLength);
        return result.buffer;
    };
    MessageIO.deserializeReplyErrError = function (buff) {
        var err = buff.readLongString();
        return JSON.parse(err);
    };
    MessageIO._serializeReplyErrEmpty = function (req) {
        return MessageBuffer.alloc(11 /* ReplyErrEmpty */, req, 0).buffer;
    };
    return MessageIO;
}());
