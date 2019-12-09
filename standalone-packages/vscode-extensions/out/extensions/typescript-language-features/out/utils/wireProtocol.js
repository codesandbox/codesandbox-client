"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const dispose_1 = require("./dispose");
const defaultSize = 8192;
const contentLength = 'Content-Length: ';
const contentLengthSize = Buffer.byteLength(contentLength, 'utf8');
const blank = Buffer.from(' ', 'utf8')[0];
const backslashR = Buffer.from('\r', 'utf8')[0];
const backslashN = Buffer.from('\n', 'utf8')[0];
class ProtocolBuffer {
    constructor() {
        this.index = 0;
        this.buffer = Buffer.allocUnsafe(defaultSize);
    }
    append(data) {
        let toAppend = null;
        if (Buffer.isBuffer(data)) {
            toAppend = data;
        }
        else {
            toAppend = Buffer.from(data, 'utf8');
        }
        if (this.buffer.length - this.index >= toAppend.length) {
            toAppend.copy(this.buffer, this.index, 0, toAppend.length);
        }
        else {
            let newSize = (Math.ceil((this.index + toAppend.length) / defaultSize) + 1) * defaultSize;
            if (this.index === 0) {
                this.buffer = Buffer.allocUnsafe(newSize);
                toAppend.copy(this.buffer, 0, 0, toAppend.length);
            }
            else {
                this.buffer = Buffer.concat([this.buffer.slice(0, this.index), toAppend], newSize);
            }
        }
        this.index += toAppend.length;
    }
    tryReadContentLength() {
        let result = -1;
        let current = 0;
        // we are utf8 encoding...
        while (current < this.index && (this.buffer[current] === blank || this.buffer[current] === backslashR || this.buffer[current] === backslashN)) {
            current++;
        }
        if (this.index < current + contentLengthSize) {
            return result;
        }
        current += contentLengthSize;
        let start = current;
        while (current < this.index && this.buffer[current] !== backslashR) {
            current++;
        }
        if (current + 3 >= this.index || this.buffer[current + 1] !== backslashN || this.buffer[current + 2] !== backslashR || this.buffer[current + 3] !== backslashN) {
            return result;
        }
        let data = this.buffer.toString('utf8', start, current);
        result = parseInt(data);
        this.buffer = this.buffer.slice(current + 4);
        this.index = this.index - (current + 4);
        return result;
    }
    tryReadContent(length) {
        if (this.index < length) {
            return null;
        }
        let result = this.buffer.toString('utf8', 0, length);
        let sourceStart = length;
        while (sourceStart < this.index && (this.buffer[sourceStart] === backslashR || this.buffer[sourceStart] === backslashN)) {
            sourceStart++;
        }
        this.buffer.copy(this.buffer, 0, sourceStart);
        this.index = this.index - sourceStart;
        return result;
    }
}
class Reader extends dispose_1.Disposable {
    constructor(readable) {
        super();
        this.buffer = new ProtocolBuffer();
        this.nextMessageLength = -1;
        this._onError = this._register(new vscode.EventEmitter());
        this.onError = this._onError.event;
        this._onData = this._register(new vscode.EventEmitter());
        this.onData = this._onData.event;
        readable.on('data', data => this.onLengthData(data));
    }
    onLengthData(data) {
        if (this.isDisposed) {
            return;
        }
        try {
            this.buffer.append(data);
            while (true) {
                if (this.nextMessageLength === -1) {
                    this.nextMessageLength = this.buffer.tryReadContentLength();
                    if (this.nextMessageLength === -1) {
                        return;
                    }
                }
                const msg = this.buffer.tryReadContent(this.nextMessageLength);
                if (msg === null) {
                    return;
                }
                this.nextMessageLength = -1;
                const json = JSON.parse(msg);
                this._onData.fire(json);
            }
        }
        catch (e) {
            this._onError.fire(e);
        }
    }
}
exports.Reader = Reader;
//# sourceMappingURL=wireProtocol.js.map