"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const stream = require("stream");
const cancellation_electron_1 = require("../../tsServer/cancellation.electron");
const server_1 = require("../../tsServer/server");
const typescriptService_1 = require("../../typescriptService");
const cancellation_1 = require("../../utils/cancellation");
const logger_1 = require("../../utils/logger");
const tracer_1 = require("../../utils/tracer");
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
    onData(_handler) { }
    onError(_handler) { }
    onExit(_handler) { }
    kill() { }
    onWrite() {
        return new Promise((resolve) => {
            this.writeListeners.add((data) => {
                resolve(JSON.parse(data.toString()));
            });
        });
    }
}
suite.skip('Server', () => {
    const tracer = new tracer_1.default(new logger_1.Logger());
    test('should send requests with increasing sequence numbers', async () => {
        const process = new FakeServerProcess();
        const server = new server_1.ProcessBasedTsServer('semantic', typescriptService_1.ServerType.Semantic, process, undefined, new cancellation_electron_1.NodeRequestCanceller('semantic', tracer), undefined, NoopTelemetryReporter, tracer);
        const onWrite1 = process.onWrite();
        server.executeImpl('geterr', {}, { isAsync: false, token: cancellation_1.nulToken, expectsResult: true });
        assert.strictEqual((await onWrite1).seq, 0);
        const onWrite2 = process.onWrite();
        server.executeImpl('geterr', {}, { isAsync: false, token: cancellation_1.nulToken, expectsResult: true });
        assert.strictEqual((await onWrite2).seq, 1);
    });
});
//# sourceMappingURL=server.test.js.map