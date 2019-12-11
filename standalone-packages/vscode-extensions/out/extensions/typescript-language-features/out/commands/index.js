"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const configurePlugin_1 = require("./configurePlugin");
const goToProjectConfiguration_1 = require("./goToProjectConfiguration");
const openTsServerLog_1 = require("./openTsServerLog");
const reloadProject_1 = require("./reloadProject");
const restartTsServer_1 = require("./restartTsServer");
const selectTypeScriptVersion_1 = require("./selectTypeScriptVersion");
function registerCommands(commandManager, lazyClientHost, pluginManager) {
    commandManager.register(new reloadProject_1.ReloadTypeScriptProjectsCommand(lazyClientHost));
    commandManager.register(new reloadProject_1.ReloadJavaScriptProjectsCommand(lazyClientHost));
    commandManager.register(new selectTypeScriptVersion_1.SelectTypeScriptVersionCommand(lazyClientHost));
    commandManager.register(new openTsServerLog_1.OpenTsServerLogCommand(lazyClientHost));
    commandManager.register(new restartTsServer_1.RestartTsServerCommand(lazyClientHost));
    commandManager.register(new goToProjectConfiguration_1.TypeScriptGoToProjectConfigCommand(lazyClientHost));
    commandManager.register(new goToProjectConfiguration_1.JavaScriptGoToProjectConfigCommand(lazyClientHost));
    commandManager.register(new configurePlugin_1.ConfigurePluginCommand(pluginManager));
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=index.js.map