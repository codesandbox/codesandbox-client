"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskTypeScriptVersionProvider = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const api_1 = require("../utils/api");
const relativePathResolver_1 = require("../utils/relativePathResolver");
const versionProvider_1 = require("./versionProvider");
class DiskTypeScriptVersionProvider {
    constructor(configuration) {
        this.configuration = configuration;
    }
    updateConfiguration(configuration) {
        this.configuration = configuration;
    }
    get defaultVersion() {
        return this.globalVersion || this.bundledVersion;
    }
    get globalVersion() {
        if (this.configuration?.globalTsdk) {
            const globals = this.loadVersionsFromSetting("user-setting" /* UserSetting */, this.configuration.globalTsdk);
            if (globals && globals.length) {
                return globals[0];
            }
        }
        return this.contributedTsNextVersion;
    }
    get localVersion() {
        const tsdkVersions = this.localTsdkVersions;
        if (tsdkVersions && tsdkVersions.length) {
            return tsdkVersions[0];
        }
        const nodeVersions = this.localNodeModulesVersions;
        if (nodeVersions && nodeVersions.length === 1) {
            return nodeVersions[0];
        }
        return undefined;
    }
    get localVersions() {
        const allVersions = this.localTsdkVersions.concat(this.localNodeModulesVersions);
        const paths = new Set();
        return allVersions.filter(x => {
            if (paths.has(x.path)) {
                return false;
            }
            paths.add(x.path);
            return true;
        });
    }
    get bundledVersion() {
        const version = this.getContributedVersion("bundled" /* Bundled */, 'vscode.typescript-language-features', ['..', 'node_modules']);
        if (version) {
            return version;
        }
        vscode.window.showErrorMessage((0, versionProvider_1.localize)('noBundledServerFound', 'VS Code\'s tsserver was deleted by another application such as a misbehaving virus detection tool. Please reinstall VS Code.'));
        throw new Error('Could not find bundled tsserver.js');
    }
    get contributedTsNextVersion() {
        return this.getContributedVersion("ts-nightly-extension" /* TsNightlyExtension */, 'ms-vscode.vscode-typescript-next', ['node_modules']);
    }
    getContributedVersion(source, extensionId, pathToTs) {
        try {
            const extension = vscode.extensions.getExtension(extensionId);
            if (extension) {
                const serverPath = path.join(extension.extensionPath, ...pathToTs, 'typescript', 'lib', 'tsserver.js');
                const bundledVersion = new versionProvider_1.TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), '');
                if (bundledVersion.isValid) {
                    return bundledVersion;
                }
            }
        }
        catch {
            // noop
        }
        return undefined;
    }
    get localTsdkVersions() {
        const localTsdk = this.configuration?.localTsdk;
        return localTsdk ? this.loadVersionsFromSetting("workspace-setting" /* WorkspaceSetting */, localTsdk) : [];
    }
    loadVersionsFromSetting(source, tsdkPathSetting) {
        if (path.isAbsolute(tsdkPathSetting)) {
            const serverPath = path.join(tsdkPathSetting, 'tsserver.js');
            return [
                new versionProvider_1.TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), tsdkPathSetting)
            ];
        }
        const workspacePath = relativePathResolver_1.RelativeWorkspacePathResolver.asAbsoluteWorkspacePath(tsdkPathSetting);
        if (workspacePath !== undefined) {
            const serverPath = path.join(workspacePath, 'tsserver.js');
            return [
                new versionProvider_1.TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), tsdkPathSetting)
            ];
        }
        return this.loadTypeScriptVersionsFromPath(source, tsdkPathSetting);
    }
    get localNodeModulesVersions() {
        return this.loadTypeScriptVersionsFromPath("node-modules" /* NodeModules */, path.join('node_modules', 'typescript', 'lib'))
            .filter(x => x.isValid);
    }
    loadTypeScriptVersionsFromPath(source, relativePath) {
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }
        const versions = [];
        for (const root of vscode.workspace.workspaceFolders) {
            let label = relativePath;
            if (vscode.workspace.workspaceFolders.length > 1) {
                label = path.join(root.name, relativePath);
            }
            const serverPath = path.join(root.uri.fsPath, relativePath, 'tsserver.js');
            versions.push(new versionProvider_1.TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), label));
        }
        return versions;
    }
    static getApiVersion(serverPath) {
        const version = DiskTypeScriptVersionProvider.getTypeScriptVersion(serverPath);
        if (version) {
            return version;
        }
        // Allow TS developers to provide custom version
        const tsdkVersion = vscode.workspace.getConfiguration().get('typescript.tsdk_version', undefined);
        if (tsdkVersion) {
            return api_1.default.fromVersionString(tsdkVersion);
        }
        return undefined;
    }
    static getTypeScriptVersion(serverPath) {
        if (!fs.existsSync(serverPath)) {
            return undefined;
        }
        const p = serverPath.split(path.sep);
        if (p.length <= 2) {
            return undefined;
        }
        const p2 = p.slice(0, -2);
        const modulePath = p2.join(path.sep);
        let fileName = path.join(modulePath, 'package.json');
        if (!fs.existsSync(fileName)) {
            // Special case for ts dev versions
            if (path.basename(modulePath) === 'built') {
                fileName = path.join(modulePath, '..', 'package.json');
            }
        }
        if (!fs.existsSync(fileName)) {
            return undefined;
        }
        const contents = fs.readFileSync(fileName).toString();
        let desc = null;
        try {
            desc = JSON.parse(contents);
        }
        catch (err) {
            return undefined;
        }
        if (!desc || !desc.version) {
            return undefined;
        }
        return desc.version ? api_1.default.fromVersionString(desc.version) : undefined;
    }
}
exports.DiskTypeScriptVersionProvider = DiskTypeScriptVersionProvider;
//# sourceMappingURL=versionProvider.electron.js.map