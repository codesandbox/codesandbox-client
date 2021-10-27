"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("../utils/api");
const async_1 = require("../utils/async");
const dispose_1 = require("../utils/dispose");
const languageModeIds = require("../utils/languageModeIds");
const resourceMap_1 = require("../utils/resourceMap");
const typeConverters = require("../utils/typeConverters");
function mode2ScriptKind(mode) {
    switch (mode) {
        case languageModeIds.typescript: return 'TS';
        case languageModeIds.typescriptreact: return 'TSX';
        case languageModeIds.javascript: return 'JS';
        case languageModeIds.javascriptreact: return 'JSX';
    }
    return undefined;
}
class CloseOperation {
    constructor(args) {
        this.args = args;
        this.type = 'close';
    }
}
class OpenOperation {
    constructor(args) {
        this.args = args;
        this.type = 'open';
    }
}
class ChangeOperation {
    constructor(args) {
        this.args = args;
        this.type = 'change';
    }
}
/**
 * Manages synchronization of buffers with the TS server.
 *
 * If supported, batches together file changes. This allows the TS server to more efficiently process changes.
 */
class BufferSynchronizer {
    constructor(client) {
        this.client = client;
        this._pending = new Map();
    }
    open(args) {
        if (this.supportsBatching) {
            this.updatePending(args.file, pending => {
                pending.set(args.file, new OpenOperation(args));
            });
        }
        else {
            this.client.executeWithoutWaitingForResponse('open', args);
        }
    }
    close(filepath) {
        if (this.supportsBatching) {
            this.updatePending(filepath, pending => {
                pending.set(filepath, new CloseOperation(filepath));
            });
        }
        else {
            const args = { file: filepath };
            this.client.executeWithoutWaitingForResponse('close', args);
        }
    }
    change(filepath, events) {
        if (!events.length) {
            return;
        }
        if (this.supportsBatching) {
            this.updatePending(filepath, pending => {
                pending.set(filepath, new ChangeOperation({
                    fileName: filepath,
                    textChanges: events.map((change) => ({
                        newText: change.text,
                        start: typeConverters.Position.toLocation(change.range.start),
                        end: typeConverters.Position.toLocation(change.range.end),
                    })).reverse(),
                }));
            });
        }
        else {
            for (const { range, text } of events) {
                const args = {
                    insertString: text,
                    ...typeConverters.Range.toFormattingRequestArgs(filepath, range)
                };
                this.client.executeWithoutWaitingForResponse('change', args);
            }
        }
    }
    beforeCommand(command) {
        if (command === 'updateOpen') {
            return;
        }
        this.flush();
    }
    flush() {
        if (!this.supportsBatching) {
            // We've already eagerly synchronized
            this._pending.clear();
            return;
        }
        if (this._pending.size > 0) {
            const closedFiles = [];
            const openFiles = [];
            const changedFiles = [];
            for (const change of this._pending.values()) {
                switch (change.type) {
                    case 'change':
                        changedFiles.push(change.args);
                        break;
                    case 'open':
                        openFiles.push(change.args);
                        break;
                    case 'close':
                        closedFiles.push(change.args);
                        break;
                }
            }
            this.client.executeWithoutWaitingForResponse('updateOpen', { changedFiles, closedFiles, openFiles });
            this._pending.clear();
        }
    }
    get supportsBatching() {
        return this.client.apiVersion.gte(api_1.default.v340) && vscode.workspace.getConfiguration('typescript', null).get('useBatchedBufferSync', true);
    }
    updatePending(filepath, f) {
        if (this._pending.has(filepath)) {
            // we saw this file before, make sure we flush before working with it again
            this.flush();
        }
        f(this._pending);
    }
}
class SyncedBuffer {
    constructor(document, filepath, client, synchronizer) {
        this.document = document;
        this.filepath = filepath;
        this.client = client;
        this.synchronizer = synchronizer;
        this.state = 1 /* Initial */;
    }
    open() {
        const args = {
            file: this.filepath,
            fileContent: this.document.getText(),
        };
        if (this.client.apiVersion.gte(api_1.default.v203)) {
            const scriptKind = mode2ScriptKind(this.document.languageId);
            if (scriptKind) {
                args.scriptKindName = scriptKind;
            }
        }
        if (this.client.apiVersion.gte(api_1.default.v230)) {
            args.projectRootPath = this.client.getWorkspaceRootForResource(this.document.uri);
        }
        if (this.client.apiVersion.gte(api_1.default.v240)) {
            const tsPluginsForDocument = this.client.pluginManager.plugins
                .filter(x => x.languages.indexOf(this.document.languageId) >= 0);
            if (tsPluginsForDocument.length) {
                args.plugins = tsPluginsForDocument.map(plugin => plugin.name);
            }
        }
        this.synchronizer.open(args);
        this.state = 2 /* Open */;
    }
    get resource() {
        return this.document.uri;
    }
    get lineCount() {
        return this.document.lineCount;
    }
    get kind() {
        switch (this.document.languageId) {
            case languageModeIds.javascript:
            case languageModeIds.javascriptreact:
                return 2 /* JavaScript */;
            case languageModeIds.typescript:
            case languageModeIds.typescriptreact:
            default:
                return 1 /* TypeScript */;
        }
    }
    close() {
        this.synchronizer.close(this.filepath);
        this.state = 2 /* Closed */;
    }
    onContentChanged(events) {
        if (this.state !== 2 /* Open */) {
            console.error(`Unexpected buffer state: ${this.state}`);
        }
        this.synchronizer.change(this.filepath, events);
    }
}
class SyncedBufferMap extends resourceMap_1.ResourceMap {
    getForPath(filePath) {
        return this.get(vscode.Uri.file(filePath));
    }
    get allBuffers() {
        return this.values;
    }
}
class PendingDiagnostics extends resourceMap_1.ResourceMap {
    getOrderedFileSet() {
        const orderedResources = Array.from(this.entries)
            .sort((a, b) => a.value - b.value)
            .map(entry => entry.resource);
        const map = new resourceMap_1.ResourceMap();
        for (const resource of orderedResources) {
            map.set(resource, undefined);
        }
        return map;
    }
}
class GetErrRequest {
    constructor(client, files, _token, onDone) {
        this.files = files;
        this._token = _token;
        this._done = false;
        const args = {
            delay: 0,
            files: Array.from(files.entries)
                .map(entry => client.normalizedPath(entry.resource))
                .filter(x => !!x)
        };
        client.executeAsync('geterr', args, _token.token)
            .finally(() => {
            if (this._done) {
                return;
            }
            this._done = true;
            onDone();
        });
    }
    static executeGetErrRequest(client, files, onDone) {
        const token = new vscode.CancellationTokenSource();
        return new GetErrRequest(client, files, token, onDone);
    }
    cancel() {
        if (!this._done) {
            this._token.cancel();
        }
        this._token.dispose();
    }
}
class BufferSyncSupport extends dispose_1.Disposable {
    constructor(client, modeIds) {
        super();
        this._validateJavaScript = true;
        this._validateTypeScript = true;
        this.listening = false;
        this._onDelete = this._register(new vscode.EventEmitter());
        this.onDelete = this._onDelete.event;
        this.client = client;
        this.modeIds = new Set(modeIds);
        this.diagnosticDelayer = new async_1.Delayer(300);
        const pathNormalizer = (path) => this.client.normalizedPath(path);
        this.syncedBuffers = new SyncedBufferMap(pathNormalizer);
        this.pendingDiagnostics = new PendingDiagnostics(pathNormalizer);
        this.synchronizer = new BufferSynchronizer(client);
        this.updateConfiguration();
        vscode.workspace.onDidChangeConfiguration(this.updateConfiguration, this, this._disposables);
    }
    listen() {
        if (this.listening) {
            return;
        }
        this.listening = true;
        vscode.workspace.onDidOpenTextDocument(this.openTextDocument, this, this._disposables);
        vscode.workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, this._disposables);
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, this._disposables);
        vscode.workspace.textDocuments.forEach(this.openTextDocument, this);
    }
    handles(resource) {
        return this.syncedBuffers.has(resource);
    }
    toResource(filePath) {
        const buffer = this.syncedBuffers.getForPath(filePath);
        if (buffer) {
            return buffer.resource;
        }
        return vscode.Uri.file(filePath);
    }
    reOpenDocuments() {
        for (const buffer of this.syncedBuffers.allBuffers) {
            buffer.open();
        }
    }
    openTextDocument(document) {
        if (!this.modeIds.has(document.languageId)) {
            return;
        }
        const resource = document.uri;
        const filepath = this.client.normalizedPath(resource);
        if (!filepath) {
            return;
        }
        if (this.syncedBuffers.has(resource)) {
            return;
        }
        const syncedBuffer = new SyncedBuffer(document, filepath, this.client, this.synchronizer);
        this.syncedBuffers.set(resource, syncedBuffer);
        syncedBuffer.open();
        this.requestDiagnostic(syncedBuffer);
    }
    closeResource(resource) {
        const syncedBuffer = this.syncedBuffers.get(resource);
        if (!syncedBuffer) {
            return;
        }
        this.pendingDiagnostics.delete(resource);
        this.syncedBuffers.delete(resource);
        syncedBuffer.close();
        this._onDelete.fire(resource);
        this.requestAllDiagnostics();
    }
    interuptGetErr(f) {
        if (!this.pendingGetErr) {
            return f();
        }
        this.pendingGetErr.cancel();
        this.pendingGetErr = undefined;
        const result = f();
        this.triggerDiagnostics();
        return result;
    }
    beforeCommand(command) {
        this.synchronizer.beforeCommand(command);
    }
    onDidCloseTextDocument(document) {
        this.closeResource(document.uri);
    }
    onDidChangeTextDocument(e) {
        const syncedBuffer = this.syncedBuffers.get(e.document.uri);
        if (!syncedBuffer) {
            return;
        }
        syncedBuffer.onContentChanged(e.contentChanges);
        const didTrigger = this.requestDiagnostic(syncedBuffer);
        if (!didTrigger && this.pendingGetErr) {
            // In this case we always want to re-trigger all diagnostics
            this.pendingGetErr.cancel();
            this.pendingGetErr = undefined;
            this.triggerDiagnostics();
        }
    }
    requestAllDiagnostics() {
        for (const buffer of this.syncedBuffers.allBuffers) {
            if (this.shouldValidate(buffer)) {
                this.pendingDiagnostics.set(buffer.resource, Date.now());
            }
        }
        this.triggerDiagnostics();
    }
    getErr(resources) {
        const handledResources = resources.filter(resource => this.handles(resource));
        if (!handledResources.length) {
            return;
        }
        for (const resource of handledResources) {
            this.pendingDiagnostics.set(resource, Date.now());
        }
        this.triggerDiagnostics();
    }
    triggerDiagnostics(delay = 200) {
        this.diagnosticDelayer.trigger(() => {
            this.sendPendingDiagnostics();
        }, delay);
    }
    requestDiagnostic(buffer) {
        if (!this.shouldValidate(buffer)) {
            return false;
        }
        this.pendingDiagnostics.set(buffer.resource, Date.now());
        const delay = Math.min(Math.max(Math.ceil(buffer.lineCount / 20), 300), 800);
        this.triggerDiagnostics(delay);
        return true;
    }
    hasPendingDiagnostics(resource) {
        return this.pendingDiagnostics.has(resource);
    }
    sendPendingDiagnostics() {
        const orderedFileSet = this.pendingDiagnostics.getOrderedFileSet();
        if (this.pendingGetErr) {
            this.pendingGetErr.cancel();
            for (const file of this.pendingGetErr.files.entries) {
                orderedFileSet.set(file.resource, undefined);
            }
        }
        // Add all open TS buffers to the geterr request. They might be visible
        for (const buffer of this.syncedBuffers.values) {
            orderedFileSet.set(buffer.resource, undefined);
        }
        if (orderedFileSet.size) {
            const getErr = this.pendingGetErr = GetErrRequest.executeGetErrRequest(this.client, orderedFileSet, () => {
                if (this.pendingGetErr === getErr) {
                    this.pendingGetErr = undefined;
                }
            });
        }
        this.pendingDiagnostics.clear();
    }
    updateConfiguration() {
        const jsConfig = vscode.workspace.getConfiguration('javascript', null);
        const tsConfig = vscode.workspace.getConfiguration('typescript', null);
        this._validateJavaScript = jsConfig.get('validate.enable', true);
        this._validateTypeScript = tsConfig.get('validate.enable', true);
    }
    shouldValidate(buffer) {
        switch (buffer.kind) {
            case 2 /* JavaScript */:
                return this._validateJavaScript;
            case 1 /* TypeScript */:
            default:
                return this._validateTypeScript;
        }
    }
}
exports.default = BufferSyncSupport;
//# sourceMappingURL=bufferSyncSupport.js.map