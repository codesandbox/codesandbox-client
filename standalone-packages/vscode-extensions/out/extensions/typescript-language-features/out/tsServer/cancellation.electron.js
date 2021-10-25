"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeRequestCancellerFactory = exports.NodeRequestCanceller = void 0;
const fs = require("fs");
const temp_electron_1 = require("../utils/temp.electron");
class NodeRequestCanceller {
    constructor(_serverId, _tracer) {
        this._serverId = _serverId;
        this._tracer = _tracer;
        this.cancellationPipeName = (0, temp_electron_1.getTempFile)('tscancellation');
    }
    tryCancelOngoingRequest(seq) {
        if (!this.cancellationPipeName) {
            return false;
        }
        this._tracer.logTrace(this._serverId, `TypeScript Server: trying to cancel ongoing request with sequence number ${seq}`);
        try {
            fs.writeFileSync(this.cancellationPipeName + seq, '');
        }
        catch {
            // noop
        }
        return true;
    }
}
exports.NodeRequestCanceller = NodeRequestCanceller;
exports.nodeRequestCancellerFactory = new class {
    create(serverId, tracer) {
        return new NodeRequestCanceller(serverId, tracer);
    }
};
//# sourceMappingURL=cancellation.electron.js.map