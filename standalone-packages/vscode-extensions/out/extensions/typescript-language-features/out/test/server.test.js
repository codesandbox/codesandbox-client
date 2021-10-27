"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const stream = require("stream");
const server_1 = require("../tsServer/server");
const cancellation_1 = require("../utils/cancellation");
const logger_1 = require("../utils/logger");
const tracer_1 = require("../utils/tracer");
const NoopTelemetryReporter = new class {
    logTelemetry() { }
    dispose() { }
};
class FakeServerProcess {
    constructor() {
        this.writeListeners = new Set();
        this._out = new stream.PassThrough();
        this.stdout = this._out;
    }
    write(data) {
        const listeners = Array.from(this.writeListeners);
        this.writeListeners.clear();
        setImmediate(() => {
            for (const listener of listeners) {
                listener(Buffer.from(JSON.stringify(data), 'utf8'));
            }
            const body = Buffer.from(JSON.stringify({ 'seq': data.seq, 'type': 'response', 'command': data.command, 'request_seq': data.seq, 'success': true }), 'utf8');
            this._out.write(Buffer.from(`Content-Length: ${body.length}\r\n\r\n${body}`, 'utf8'));
        });
    }
    on(_name, _handler) { }
    kill() { }
    onWrite() {
        return new Promise((resolve) => {
            this.writeListeners.add((data) => {
                resolve(JSON.parse(data.toString()));
            });
        });
    }
}
suite('Server', () => {
    const tracer = new tracer_1.default(new logger_1.default());
    test('should send requests with increasing sequence numbers', async () => {
        const process = new FakeServerProcess();
        const server = new server_1.ProcessBasedTsServer('semantic', process, undefined, new server_1.PipeRequestCanceller('semantic', undefined, tracer), undefined, NoopTelemetryReporter, tracer);
        const onWrite1 = process.onWrite();
        server.executeImpl('geterr', {}, { isAsync: false, token: cancellation_1.nulToken, expectsResult: true });
        assert.strictEqual((await onWrite1).seq, 0);
        const onWrite2 = process.onWrite();
        server.executeImpl('geterr', {}, { isAsync: false, token: cancellation_1.nulToken, expectsResult: true });
        assert.strictEqual((await onWrite2).seq, 1);
    });
});
//# sourceMappingURL=server.test.js.map