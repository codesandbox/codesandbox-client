"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtaProgressReporter = void 0;
const vscode = require("vscode");
const vscode_nls_1 = require("vscode-nls");
const dispose_1 = require("./dispose");
const localize = (0, vscode_nls_1.loadMessageBundle)();
const typingsInstallTimeout = 30 * 1000;
class TypingsStatus extends dispose_1.Disposable {
    constructor(client) {
        super();
        this._acquiringTypings = new Map();
        this._client = client;
        this._register(this._client.onDidBeginInstallTypings(event => this.onBeginInstallTypings(event.eventId)));
        this._register(this._client.onDidEndInstallTypings(event => this.onEndInstallTypings(event.eventId)));
    }
    dispose() {
        super.dispose();
        for (const timeout of this._acquiringTypings.values()) {
            clearTimeout(timeout);
        }
    }
    get isAcquiringTypings() {
        return Object.keys(this._acquiringTypings).length > 0;
    }
    onBeginInstallTypings(eventId) {
        if (this._acquiringTypings.has(eventId)) {
            return;
        }
        this._acquiringTypings.set(eventId, setTimeout(() => {
            this.onEndInstallTypings(eventId);
        }, typingsInstallTimeout));
    }
    onEndInstallTypings(eventId) {
        const timer = this._acquiringTypings.get(eventId);
        if (timer) {
            clearTimeout(timer);
        }
        this._acquiringTypings.delete(eventId);
    }
}
exports.default = TypingsStatus;
class AtaProgressReporter extends dispose_1.Disposable {
    constructor(client) {
        super();
        this._promises = new Map();
        this._register(client.onDidBeginInstallTypings(e => this._onBegin(e.eventId)));
        this._register(client.onDidEndInstallTypings(e => this._onEndOrTimeout(e.eventId)));
        this._register(client.onTypesInstallerInitializationFailed(_ => this.onTypesInstallerInitializationFailed()));
    }
    dispose() {
        super.dispose();
        this._promises.forEach(value => value());
    }
    _onBegin(eventId) {
        const handle = setTimeout(() => this._onEndOrTimeout(eventId), typingsInstallTimeout);
        const promise = new Promise(resolve => {
            this._promises.set(eventId, () => {
                clearTimeout(handle);
                resolve();
            });
        });
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: localize('installingPackages', "Fetching data for better TypeScript IntelliSense")
        }, () => promise);
    }
    _onEndOrTimeout(eventId) {
        const resolve = this._promises.get(eventId);
        if (resolve) {
            this._promises.delete(eventId);
            resolve();
        }
    }
    async onTypesInstallerInitializationFailed() {
        const config = vscode.workspace.getConfiguration('typescript');
        if (config.get('check.npmIsInstalled', true)) {
            const dontShowAgain = {
                title: localize('typesInstallerInitializationFailed.doNotCheckAgain', "Don't Show Again"),
            };
            const selected = await vscode.window.showWarningMessage(localize('typesInstallerInitializationFailed.title', "Could not install typings files for JavaScript language features. Please ensure that NPM is installed or configure 'typescript.npm' in your user settings. Click [here]({0}) to learn more.", 'https://go.microsoft.com/fwlink/?linkid=847635'), dontShowAgain);
            if (selected === dontShowAgain) {
                config.update('check.npmIsInstalled', false, true);
            }
        }
    }
}
exports.AtaProgressReporter = AtaProgressReporter;
//# sourceMappingURL=typingsStatus.js.map