"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const fs = require("fs");
const vscode = require("vscode");
const api_1 = require("./api");
const commandManager_1 = require("./commands/commandManager");
const index_1 = require("./commands/index");
const languageConfiguration_1 = require("./languageFeatures/languageConfiguration");
const lazyClientHost_1 = require("./lazyClientHost");
const cancellation_electron_1 = require("./tsServer/cancellation.electron");
const logDirectoryProvider_electron_1 = require("./tsServer/logDirectoryProvider.electron");
const serverProcess_electron_1 = require("./tsServer/serverProcess.electron");
const versionProvider_electron_1 = require("./tsServer/versionProvider.electron");
const activeJsTsEditorTracker_1 = require("./utils/activeJsTsEditorTracker");
const configuration_electron_1 = require("./utils/configuration.electron");
const fileSystem_electron_1 = require("./utils/fileSystem.electron");
const plugins_1 = require("./utils/plugins");
const temp = require("./utils/temp.electron");
function activate(context) {
    const pluginManager = new plugins_1.PluginManager();
    context.subscriptions.push(pluginManager);
    const commandManager = new commandManager_1.CommandManager();
    context.subscriptions.push(commandManager);
    const onCompletionAccepted = new vscode.EventEmitter();
    context.subscriptions.push(onCompletionAccepted);
    const logDirectoryProvider = new logDirectoryProvider_electron_1.NodeLogDirectoryProvider(context);
    const versionProvider = new versionProvider_electron_1.DiskTypeScriptVersionProvider();
    context.subscriptions.push(new languageConfiguration_1.LanguageConfigurationManager());
    const activeJsTsEditorTracker = new activeJsTsEditorTracker_1.ActiveJsTsEditorTracker();
    context.subscriptions.push(activeJsTsEditorTracker);
    const lazyClientHost = (0, lazyClientHost_1.createLazyClientHost)(context, (0, fileSystem_electron_1.onCaseInsensitiveFileSystem)(), {
        pluginManager,
        commandManager,
        logDirectoryProvider,
        cancellerFactory: cancellation_electron_1.nodeRequestCancellerFactory,
        versionProvider,
        processFactory: serverProcess_electron_1.ChildServerProcess,
        activeJsTsEditorTracker,
        serviceConfigurationProvider: new configuration_electron_1.ElectronServiceConfigurationProvider(),
    }, item => {
        onCompletionAccepted.fire(item);
    });
    (0, index_1.registerBaseCommands)(commandManager, lazyClientHost, pluginManager, activeJsTsEditorTracker);
    Promise.resolve().then(() => require('./task/taskProvider')).then(module => {
        context.subscriptions.push(module.register(lazyClientHost.map(x => x.serviceClient)));
    });
    Promise.resolve().then(() => require('./languageFeatures/tsconfig')).then(module => {
        context.subscriptions.push(module.register());
    });
    context.subscriptions.push((0, lazyClientHost_1.lazilyActivateClient)(lazyClientHost, pluginManager, activeJsTsEditorTracker));
    return (0, api_1.getExtensionApi)(onCompletionAccepted.event, pluginManager);
}
exports.activate = activate;
function deactivate() {
    fs.rmdirSync(temp.getInstanceTempDir(), { recursive: true });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map