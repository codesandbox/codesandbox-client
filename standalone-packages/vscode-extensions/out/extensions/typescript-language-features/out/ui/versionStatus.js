"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionStatus = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const selectTypeScriptVersion_1 = require("../commands/selectTypeScriptVersion");
const dispose_1 = require("../utils/dispose");
const languageModeIds_1 = require("../utils/languageModeIds");
const localize = nls.loadMessageBundle();
class VersionStatus extends dispose_1.Disposable {
    constructor(_client) {
        super();
        this._client = _client;
        this._statusItem = this._register(vscode.languages.createLanguageStatusItem('typescript.version', languageModeIds_1.jsTsLanguageModes));
        this._statusItem.name = localize('versionStatus.name', "TypeScript Version");
        this._statusItem.detail = localize('versionStatus.detail', "TypeScript Version");
        this._register(this._client.onTsServerStarted(({ version }) => this.onDidChangeTypeScriptVersion(version)));
    }
    onDidChangeTypeScriptVersion(version) {
        this._statusItem.text = version.displayName;
        this._statusItem.command = {
            command: selectTypeScriptVersion_1.SelectTypeScriptVersionCommand.id,
            title: localize('versionStatus.command', "Select Version"),
            tooltip: version.path
        };
    }
}
exports.VersionStatus = VersionStatus;
//# sourceMappingURL=versionStatus.js.map