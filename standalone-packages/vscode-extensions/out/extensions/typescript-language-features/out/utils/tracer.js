"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var Trace;
(function (Trace) {
    Trace[Trace["Off"] = 0] = "Off";
    Trace[Trace["Messages"] = 1] = "Messages";
    Trace[Trace["Verbose"] = 2] = "Verbose";
})(Trace || (Trace = {}));
(function (Trace) {
    function fromString(value) {
        value = value.toLowerCase();
        switch (value) {
            case 'off':
                return Trace.Off;
            case 'messages':
                return Trace.Messages;
            case 'verbose':
                return Trace.Verbose;
            default:
                return Trace.Off;
        }
    }
    Trace.fromString = fromString;
})(Trace || (Trace = {}));
class Tracer {
    constructor(logger) {
        this.logger = logger;
        this.updateConfiguration();
    }
    updateConfiguration() {
        this.trace = Tracer.readTrace();
    }
    static readTrace() {
        let result = Trace.fromString(vscode.workspace.getConfiguration().get('typescript.tsserver.trace', 'off'));
        if (result === Trace.Off && !!process.env.TSS_TRACE) {
            result = Trace.Messages;
        }
        return result;
    }
    traceRequest(serverId, request, responseExpected, queueLength) {
        if (this.trace === Trace.Off) {
            return;
        }
        let data = undefined;
        if (this.trace === Trace.Verbose && request.arguments) {
            data = `Arguments: ${JSON.stringify(request.arguments, null, 4)}`;
        }
        this.logTrace(serverId, `Sending request: ${request.command} (${request.seq}). Response expected: ${responseExpected ? 'yes' : 'no'}. Current queue length: ${queueLength}`, data);
    }
    traceResponse(serverId, response, startTime) {
        if (this.trace === Trace.Off) {
            return;
        }
        let data = undefined;
        if (this.trace === Trace.Verbose && response.body) {
            data = `Result: ${JSON.stringify(response.body, null, 4)}`;
        }
        this.logTrace(serverId, `Response received: ${response.command} (${response.request_seq}). Request took ${Date.now() - startTime} ms. Success: ${response.success} ${!response.success ? '. Message: ' + response.message : ''}`, data);
    }
    traceRequestCompleted(serverId, command, request_seq, startTime) {
        if (this.trace === Trace.Off) {
            return;
        }
        this.logTrace(serverId, `Async response received: ${command} (${request_seq}). Request took ${Date.now() - startTime} ms.`);
    }
    traceEvent(serverId, event) {
        if (this.trace === Trace.Off) {
            return;
        }
        let data = undefined;
        if (this.trace === Trace.Verbose && event.body) {
            data = `Data: ${JSON.stringify(event.body, null, 4)}`;
        }
        this.logTrace(serverId, `Event received: ${event.event} (${event.seq}).`, data);
    }
    logTrace(serverId, message, data) {
        if (this.trace !== Trace.Off) {
            this.logger.logLevel('Trace', `<${serverId}> ${message}`, data);
        }
    }
}
exports.default = Tracer;
//# sourceMappingURL=tracer.js.map