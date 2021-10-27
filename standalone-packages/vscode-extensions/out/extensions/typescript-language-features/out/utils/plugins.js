"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const arrays = require("./arrays");
const dispose_1 = require("./dispose");
var TypeScriptServerPlugin;
(function (TypeScriptServerPlugin) {
    function equals(a, b) {
        return a.path === b.path
            && a.name === b.name
            && a.enableForWorkspaceTypeScriptVersions === b.enableForWorkspaceTypeScriptVersions
            && arrays.equals(a.languages, b.languages);
    }
    TypeScriptServerPlugin.equals = equals;
})(TypeScriptServerPlugin || (TypeScriptServerPlugin = {}));
class PluginManager extends dispose_1.Disposable {
    constructor() {
        super();
        this._pluginConfigurations = new Map();
        this._onDidUpdatePlugins = this._register(new vscode.EventEmitter());
        this.onDidChangePlugins = this._onDidUpdatePlugins.event;
        this._onDidUpdateConfig = this._register(new vscode.EventEmitter());
        this.onDidUpdateConfig = this._onDidUpdateConfig.event;
        vscode.extensions.onDidChange(() => {
            if (!this._plugins) {
                return;
            }
            const newPlugins = this.readPlugins();
            if (!arrays.equals(arrays.flatten(Array.from(this._plugins.values())), arrays.flatten(Array.from(newPlugins.values())), TypeScriptServerPlugin.equals)) {
                this._plugins = newPlugins;
                this._onDidUpdatePlugins.fire(this);
            }
        }, undefined, this._disposables);
    }
    get plugins() {
        if (!this._plugins) {
            this._plugins = this.readPlugins();
        }
        return arrays.flatten(Array.from(this._plugins.values()));
    }
    setConfiguration(pluginId, config) {
        this._pluginConfigurations.set(pluginId, config);
        this._onDidUpdateConfig.fire({ pluginId, config });
    }
    configurations() {
        return this._pluginConfigurations.entries();
    }
    readPlugins() {
        const pluginMap = new Map();
        for (const extension of vscode.extensions.all) {
            const pack = extension.packageJSON;
            if (pack.contributes && Array.isArray(pack.contributes.typescriptServerPlugins)) {
                const plugins = [];
                for (const plugin of pack.contributes.typescriptServerPlugins) {
                    plugins.push({
                        name: plugin.name,
                        enableForWorkspaceTypeScriptVersions: !!plugin.enableForWorkspaceTypeScriptVersions,
                        path: extension.extensionPath,
                        languages: Array.isArray(plugin.languages) ? plugin.languages : [],
                    });
                }
                if (plugins.length) {
                    pluginMap.set(extension.id, plugins);
                }
            }
        }
        return pluginMap;
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=plugins.js.map