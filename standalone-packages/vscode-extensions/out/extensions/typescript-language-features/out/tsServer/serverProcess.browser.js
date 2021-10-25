"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerServerProcess = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const memoize_1 = require("../utils/memoize");
const localize = nls.loadMessageBundle();
class WorkerServerProcess {
    constructor(worker, args) {
        this.worker = worker;
        this._onDataHandlers = new Set();
        this._onErrorHandlers = new Set();
        this._onExitHandlers = new Set();
        worker.addEventListener('message', (msg) => {
            if (msg.data.type === 'log') {
                this.output.appendLine(msg.data.body);
                return;
            }
            for (const handler of this._onDataHandlers) {
                handler(msg.data);
            }
        });
        worker.onerror = (err) => {
            for (const handler of this._onErrorHandlers) {
                handler(err);
            }
        };
        worker.postMessage(args);
    }
    static fork(tsServerPath, args, _kind, _configuration) {
        const worker = new Worker(tsServerPath);
        return new WorkerServerProcess(worker, [
            ...args,
            // Explicitly give TS Server its path so it can
            // load local resources
            '--executingFilePath', tsServerPath,
        ]);
    }
    get output() {
        return vscode.window.createOutputChannel(localize('channelName', 'TypeScript Server Log'));
    }
    write(serverRequest) {
        this.worker.postMessage(serverRequest);
    }
    onData(handler) {
        this._onDataHandlers.add(handler);
    }
    onError(handler) {
        this._onErrorHandlers.add(handler);
    }
    onExit(handler) {
        this._onExitHandlers.add(handler);
        // Todo: not implemented
    }
    kill() {
        this.worker.terminate();
    }
}
__decorate([
    memoize_1.memoize
], WorkerServerProcess.prototype, "output", null);
exports.WorkerServerProcess = WorkerServerProcess;
//# sourceMappingURL=serverProcess.browser.js.map