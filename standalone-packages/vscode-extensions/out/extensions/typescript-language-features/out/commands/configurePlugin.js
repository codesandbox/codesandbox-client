"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurePluginCommand = void 0;
class ConfigurePluginCommand {
    constructor(pluginManager) {
        this.pluginManager = pluginManager;
        this.id = '_typescript.configurePlugin';
    }
    execute(pluginId, configuration) {
        this.pluginManager.setConfiguration(pluginId, configuration);
    }
}
exports.ConfigurePluginCommand = ConfigurePluginCommand;
//# sourceMappingURL=configurePlugin.js.map