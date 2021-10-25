"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxRoutingTsServer = exports.GetErrRoutingTsServer = exports.ProcessBasedTsServer = exports.ExecutionTarget = void 0;
const vscode = require("vscode");
const protocol_const_1 = require("../protocol.const");
const callbackMap_1 = require("../tsServer/callbackMap");
const requestQueue_1 = require("../tsServer/requestQueue");
const serverError_1 = require("../tsServer/serverError");
const typescriptService_1 = require("../typescriptService");
const dispose_1 = require("../utils/dispose");
var ExecutionTarget;
(function (ExecutionTarget) {
    ExecutionTarget[ExecutionTarget["Semantic"] = 0] = "Semantic";
    ExecutionTarget[ExecutionTarget["Syntax"] = 1] = "Syntax";
})(ExecutionTarget = exports.ExecutionTarget || (exports.ExecutionTarget = {}));
class ProcessBasedTsServer extends dispose_1.Disposable {
    constructor(_serverId, _serverSource, _process, _tsServerLogFile, _requestCanceller, _version, _telemetryReporter, _tracer) {
        super();
        this._serverId = _serverId;
        this._serverSource = _serverSource;
        this._process = _process;
        this._tsServerLogFile = _tsServerLogFile;
        this._requestCanceller = _requestCanceller;
        this._version = _version;
        this._telemetryReporter = _telemetryReporter;
        this._tracer = _tracer;
        this._requestQueue = new requestQueue_1.RequestQueue();
        this._callbacks = new callbackMap_1.CallbackMap();
        this._pendingResponses = new Set();
        this._onEvent = this._register(new vscode.EventEmitter());
        this.onEvent = this._onEvent.event;
        this._onExit = this._register(new vscode.EventEmitter());
        this.onExit = this._onExit.event;
        this._onError = this._register(new vscode.EventEmitter());
        this.onError = this._onError.event;
        this._process.onData(msg => {
            this.dispatchMessage(msg);
        });
        this._process.onExit((code, signal) => {
            this._onExit.fire({ code, signal });
            this._callbacks.destroy('server exited');
        });
        this._process.onError(error => {
            this._onError.fire(error);
            this._callbacks.destroy('server errored');
        });
    }
    get tsServerLogFile() { return this._tsServerLogFile; }
    write(serverRequest) {
        this._process.write(serverRequest);
    }
    dispose() {
        super.dispose();
        this._callbacks.destroy('server disposed');
        this._pendingResponses.clear();
    }
    kill() {
        this._process.kill();
    }
    dispatchMessage(message) {
        try {
            switch (message.type) {
                case 'response':
                    if (this._serverSource) {
                        this.dispatchResponse({
                            ...message,
                            _serverType: this._serverSource
                        });
                    }
                    else {
                        this.dispatchResponse(message);
                    }
                    break;
                case 'event':
                    const event = message;
                    if (event.event === 'requestCompleted') {
                        const seq = event.body.request_seq;
                        const callback = this._callbacks.fetch(seq);
                        if (callback) {
                            this._tracer.traceRequestCompleted(this._serverId, 'requestCompleted', seq, callback);
                            callback.onSuccess(undefined);
                        }
                    }
                    else {
                        this._tracer.traceEvent(this._serverId, event);
                        this._onEvent.fire(event);
                    }
                    break;
                default:
                    throw new Error(`Unknown message type ${message.type} received`);
            }
        }
        finally {
            this.sendNextRequests();
        }
    }
    tryCancelRequest(seq, command) {
        try {
            if (this._requestQueue.tryDeletePendingRequest(seq)) {
                this.logTrace(`Canceled request with sequence number ${seq}`);
                return true;
            }
            if (this._requestCanceller.tryCancelOngoingRequest(seq)) {
                return true;
            }
            this.logTrace(`Tried to cancel request with sequence number ${seq}. But request got already delivered.`);
            return false;
        }
        finally {
            const callback = this.fetchCallback(seq);
            if (callback) {
                callback.onSuccess(new typescriptService_1.ServerResponse.Cancelled(`Cancelled request ${seq} - ${command}`));
            }
        }
    }
    dispatchResponse(response) {
        const callback = this.fetchCallback(response.request_seq);
        if (!callback) {
            return;
        }
        this._tracer.traceResponse(this._serverId, response, callback);
        if (response.success) {
            callback.onSuccess(response);
        }
        else if (response.message === 'No content available.') {
            // Special case where response itself is successful but there is not any data to return.
            callback.onSuccess(typescriptService_1.ServerResponse.NoContent);
        }
        else {
            callback.onError(serverError_1.TypeScriptServerError.create(this._serverId, this._version, response));
        }
    }
    executeImpl(command, args, executeInfo) {
        const request = this._requestQueue.createRequest(command, args);
        const requestInfo = {
            request,
            expectsResponse: executeInfo.expectsResult,
            isAsync: executeInfo.isAsync,
            queueingType: ProcessBasedTsServer.getQueueingType(command, executeInfo.lowPriority)
        };
        let result;
        if (executeInfo.expectsResult) {
            result = new Promise((resolve, reject) => {
                this._callbacks.add(request.seq, { onSuccess: resolve, onError: reject, queuingStartTime: Date.now(), isAsync: executeInfo.isAsync }, executeInfo.isAsync);
                if (executeInfo.token) {
                    executeInfo.token.onCancellationRequested(() => {
                        this.tryCancelRequest(request.seq, command);
                    });
                }
            }).catch((err) => {
                if (err instanceof serverError_1.TypeScriptServerError) {
                    if (!executeInfo.token || !executeInfo.token.isCancellationRequested) {
                        /* __GDPR__
                            "languageServiceErrorResponse" : {
                                "${include}": [
                                    "${TypeScriptCommonProperties}",
                                    "${TypeScriptRequestErrorProperties}"
                                ]
                            }
                        */
                        this._telemetryReporter.logTelemetry('languageServiceErrorResponse', err.telemetry);
                    }
                }
                throw err;
            });
        }
        this._requestQueue.enqueue(requestInfo);
        this.sendNextRequests();
        return [result];
    }
    sendNextRequests() {
        while (this._pendingResponses.size === 0 && this._requestQueue.length > 0) {
            const item = this._requestQueue.dequeue();
            if (item) {
                this.sendRequest(item);
            }
        }
    }
    sendRequest(requestItem) {
        const serverRequest = requestItem.request;
        this._tracer.traceRequest(this._serverId, serverRequest, requestItem.expectsResponse, this._requestQueue.length);
        if (requestItem.expectsResponse && !requestItem.isAsync) {
            this._pendingResponses.add(requestItem.request.seq);
        }
        try {
            this.write(serverRequest);
        }
        catch (err) {
            const callback = this.fetchCallback(serverRequest.seq);
            if (callback) {
                callback.onError(err);
            }
        }
    }
    fetchCallback(seq) {
        const callback = this._callbacks.fetch(seq);
        if (!callback) {
            return undefined;
        }
        this._pendingResponses.delete(seq);
        return callback;
    }
    logTrace(message) {
        this._tracer.logTrace(this._serverId, message);
    }
    static getQueueingType(command, lowPriority) {
        if (ProcessBasedTsServer.fenceCommands.has(command)) {
            return requestQueue_1.RequestQueueingType.Fence;
        }
        return lowPriority ? requestQueue_1.RequestQueueingType.LowPriority : requestQueue_1.RequestQueueingType.Normal;
    }
}
exports.ProcessBasedTsServer = ProcessBasedTsServer;
ProcessBasedTsServer.fenceCommands = new Set(['change', 'close', 'open', 'updateOpen']);
class RequestRouter {
    constructor(servers, delegate) {
        this.servers = servers;
        this.delegate = delegate;
    }
    execute(command, args, executeInfo) {
        if (RequestRouter.sharedCommands.has(command) && typeof executeInfo.executionTarget === 'undefined') {
            // Dispatch shared commands to all servers but use first one as the primary response
            const requestStates = this.servers.map(() => RequestState.Unresolved);
            // Also make sure we never cancel requests to just one server
            let token = undefined;
            if (executeInfo.token) {
                const source = new vscode.CancellationTokenSource();
                executeInfo.token.onCancellationRequested(() => {
                    if (requestStates.some(state => state === RequestState.Resolved)) {
                        // Don't cancel.
                        // One of the servers completed this request so we don't want to leave the other
                        // in a different state.
                        return;
                    }
                    source.cancel();
                });
                token = source.token;
            }
            const allRequests = [];
            for (let serverIndex = 0; serverIndex < this.servers.length; ++serverIndex) {
                const server = this.servers[serverIndex].server;
                const request = server.executeImpl(command, args, { ...executeInfo, token })[0];
                allRequests.push(request);
                if (request) {
                    request
                        .then(result => {
                        requestStates[serverIndex] = RequestState.Resolved;
                        const erroredRequest = requestStates.find(state => state.type === 2 /* Errored */);
                        if (erroredRequest) {
                            // We've gone out of sync
                            this.delegate.onFatalError(command, erroredRequest.err);
                        }
                        return result;
                    }, err => {
                        requestStates[serverIndex] = new RequestState.Errored(err);
                        if (requestStates.some(state => state === RequestState.Resolved)) {
                            // We've gone out of sync
                            this.delegate.onFatalError(command, err);
                        }
                        throw err;
                    });
                }
            }
            return allRequests;
        }
        for (const { canRun, server } of this.servers) {
            if (!canRun || canRun(command, executeInfo)) {
                return server.executeImpl(command, args, executeInfo);
            }
        }
        throw new Error(`Could not find server for command: '${command}'`);
    }
}
RequestRouter.sharedCommands = new Set([
    'change',
    'close',
    'open',
    'updateOpen',
    'configure',
]);
class GetErrRoutingTsServer extends dispose_1.Disposable {
    constructor(servers, delegate) {
        super();
        this._onEvent = this._register(new vscode.EventEmitter());
        this.onEvent = this._onEvent.event;
        this._onExit = this._register(new vscode.EventEmitter());
        this.onExit = this._onExit.event;
        this._onError = this._register(new vscode.EventEmitter());
        this.onError = this._onError.event;
        this.getErrServer = servers.getErr;
        this.mainServer = servers.primary;
        this.router = new RequestRouter([
            { server: this.getErrServer, canRun: (command) => ['geterr', 'geterrForProject'].includes(command) },
            { server: this.mainServer, canRun: undefined /* gets all other commands */ }
        ], delegate);
        this._register(this.getErrServer.onEvent(e => {
            if (GetErrRoutingTsServer.diagnosticEvents.has(e.event)) {
                this._onEvent.fire(e);
            }
            // Ignore all other events
        }));
        this._register(this.mainServer.onEvent(e => {
            if (!GetErrRoutingTsServer.diagnosticEvents.has(e.event)) {
                this._onEvent.fire(e);
            }
            // Ignore all other events
        }));
        this._register(this.getErrServer.onError(e => this._onError.fire(e)));
        this._register(this.mainServer.onError(e => this._onError.fire(e)));
        this._register(this.mainServer.onExit(e => {
            this._onExit.fire(e);
            this.getErrServer.kill();
        }));
    }
    get tsServerLogFile() { return this.mainServer.tsServerLogFile; }
    kill() {
        this.getErrServer.kill();
        this.mainServer.kill();
    }
    executeImpl(command, args, executeInfo) {
        return this.router.execute(command, args, executeInfo);
    }
}
exports.GetErrRoutingTsServer = GetErrRoutingTsServer;
GetErrRoutingTsServer.diagnosticEvents = new Set([
    protocol_const_1.EventName.configFileDiag,
    protocol_const_1.EventName.syntaxDiag,
    protocol_const_1.EventName.semanticDiag,
    protocol_const_1.EventName.suggestionDiag
]);
class SyntaxRoutingTsServer extends dispose_1.Disposable {
    constructor(servers, delegate, enableDynamicRouting) {
        super();
        this._projectLoading = true;
        this._onEvent = this._register(new vscode.EventEmitter());
        this.onEvent = this._onEvent.event;
        this._onExit = this._register(new vscode.EventEmitter());
        this.onExit = this._onExit.event;
        this._onError = this._register(new vscode.EventEmitter());
        this.onError = this._onError.event;
        this.syntaxServer = servers.syntax;
        this.semanticServer = servers.semantic;
        this.router = new RequestRouter([
            {
                server: this.syntaxServer,
                canRun: (command, execInfo) => {
                    switch (execInfo.executionTarget) {
                        case ExecutionTarget.Semantic: return false;
                        case ExecutionTarget.Syntax: return true;
                    }
                    if (SyntaxRoutingTsServer.syntaxAlwaysCommands.has(command)) {
                        return true;
                    }
                    if (SyntaxRoutingTsServer.semanticCommands.has(command)) {
                        return false;
                    }
                    if (enableDynamicRouting && this.projectLoading && SyntaxRoutingTsServer.syntaxAllowedCommands.has(command)) {
                        return true;
                    }
                    return false;
                }
            }, {
                server: this.semanticServer,
                canRun: undefined /* gets all other commands */
            }
        ], delegate);
        this._register(this.syntaxServer.onEvent(e => {
            return this._onEvent.fire(e);
        }));
        this._register(this.semanticServer.onEvent(e => {
            switch (e.event) {
                case protocol_const_1.EventName.projectLoadingStart:
                    this._projectLoading = true;
                    break;
                case protocol_const_1.EventName.projectLoadingFinish:
                case protocol_const_1.EventName.semanticDiag:
                case protocol_const_1.EventName.syntaxDiag:
                case protocol_const_1.EventName.suggestionDiag:
                case protocol_const_1.EventName.configFileDiag:
                    this._projectLoading = false;
                    break;
            }
            return this._onEvent.fire(e);
        }));
        this._register(this.semanticServer.onExit(e => {
            this._onExit.fire(e);
            this.syntaxServer.kill();
        }));
        this._register(this.semanticServer.onError(e => this._onError.fire(e)));
    }
    get projectLoading() { return this._projectLoading; }
    get tsServerLogFile() { return this.semanticServer.tsServerLogFile; }
    kill() {
        this.syntaxServer.kill();
        this.semanticServer.kill();
    }
    executeImpl(command, args, executeInfo) {
        return this.router.execute(command, args, executeInfo);
    }
}
exports.SyntaxRoutingTsServer = SyntaxRoutingTsServer;
/**
 * Commands that should always be run on the syntax server.
 */
SyntaxRoutingTsServer.syntaxAlwaysCommands = new Set([
    'navtree',
    'getOutliningSpans',
    'jsxClosingTag',
    'selectionRange',
    'format',
    'formatonkey',
    'docCommentTemplate',
]);
/**
 * Commands that should always be run on the semantic server.
 */
SyntaxRoutingTsServer.semanticCommands = new Set([
    'geterr',
    'geterrForProject',
    'projectInfo',
    'configurePlugin',
]);
/**
 * Commands that can be run on the syntax server but would benefit from being upgraded to the semantic server.
 */
SyntaxRoutingTsServer.syntaxAllowedCommands = new Set([
    'completions',
    'completionEntryDetails',
    'completionInfo',
    'definition',
    'definitionAndBoundSpan',
    'documentHighlights',
    'implementation',
    'navto',
    'quickinfo',
    'references',
    'rename',
    'signatureHelp',
]);
var RequestState;
(function (RequestState) {
    RequestState.Unresolved = { type: 0 /* Unresolved */ };
    RequestState.Resolved = { type: 1 /* Resolved */ };
    class Errored {
        constructor(err) {
            this.err = err;
            this.type = 2 /* Errored */;
        }
    }
    RequestState.Errored = Errored;
})(RequestState || (RequestState = {}));
//# sourceMappingURL=server.js.map