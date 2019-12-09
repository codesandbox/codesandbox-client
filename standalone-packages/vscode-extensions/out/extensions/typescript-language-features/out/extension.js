"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("./api");
const index_1 = require("./commands/index");
const languageConfiguration_1 = require("./features/languageConfiguration");
const typeScriptServiceClientHost_1 = require("./typeScriptServiceClientHost");
const arrays_1 = require("./utils/arrays");
const electron = require("./utils/electron");
const rimraf = require("rimraf");
const commandManager_1 = require("./utils/commandManager");
const fileSchemes = require("./utils/fileSchemes");
const languageDescription_1 = require("./utils/languageDescription");
const lazy_1 = require("./utils/lazy");
const logDirectoryProvider_1 = require("./utils/logDirectoryProvider");
const managedFileContext_1 = require("./utils/managedFileContext");
const plugins_1 = require("./utils/plugins");
const ProjectStatus = require("./utils/projectStatus");
const surveyor_1 = require("./utils/surveyor");
const task_1 = require("./features/task");
function activate(context) {
    const pluginManager = new plugins_1.PluginManager();
    context.subscriptions.push(pluginManager);
    const commandManager = new commandManager_1.CommandManager();
    context.subscriptions.push(commandManager);
    const onCompletionAccepted = new vscode.EventEmitter();
    context.subscriptions.push(onCompletionAccepted);
    const lazyClientHost = createLazyClientHost(context, pluginManager, commandManager, item => {
        onCompletionAccepted.fire(item);
    });
    index_1.registerCommands(commandManager, lazyClientHost, pluginManager);
    context.subscriptions.push(vscode.workspace.registerTaskProvider('typescript', new task_1.default(lazyClientHost.map(x => x.serviceClient))));
    context.subscriptions.push(new languageConfiguration_1.LanguageConfigurationManager());
    Promise.resolve().then(() => require('./features/tsconfig')).then(module => {
        context.subscriptions.push(module.register());
    });
    context.subscriptions.push(lazilyActivateClient(lazyClientHost, pluginManager));
    return api_1.getExtensionApi(onCompletionAccepted.event, pluginManager);
}
exports.activate = activate;
function createLazyClientHost(context, pluginManager, commandManager, onCompletionAccepted) {
    return lazy_1.lazy(() => {
        const logDirectoryProvider = new logDirectoryProvider_1.default(context);
        const clientHost = new typeScriptServiceClientHost_1.default(languageDescription_1.standardLanguageDescriptions, context.workspaceState, pluginManager, commandManager, logDirectoryProvider, onCompletionAccepted);
        context.subscriptions.push(clientHost);
        context.subscriptions.push(new surveyor_1.Surveyor(context.globalState, clientHost.serviceClient));
        clientHost.serviceClient.onReady(() => {
            context.subscriptions.push(ProjectStatus.create(clientHost.serviceClient, clientHost.serviceClient.telemetryReporter));
        });
        return clientHost;
    });
}
function lazilyActivateClient(lazyClientHost, pluginManager) {
    const disposables = [];
    const supportedLanguage = arrays_1.flatten([
        ...languageDescription_1.standardLanguageDescriptions.map(x => x.modeIds),
        ...pluginManager.plugins.map(x => x.languages)
    ]);
    let hasActivated = false;
    const maybeActivate = (textDocument) => {
        if (!hasActivated && isSupportedDocument(supportedLanguage, textDocument)) {
            hasActivated = true;
            // Force activation
            // tslint:disable-next-line:no-unused-expression
            void lazyClientHost.value;
            disposables.push(new managedFileContext_1.default(resource => {
                return lazyClientHost.value.serviceClient.toPath(resource);
            }));
            return true;
        }
        return false;
    };
    const didActivate = vscode.workspace.textDocuments.some(maybeActivate);
    if (!didActivate) {
        const openListener = vscode.workspace.onDidOpenTextDocument(doc => {
            if (maybeActivate(doc)) {
                openListener.dispose();
            }
        }, undefined, disposables);
    }
    return vscode.Disposable.from(...disposables);
}
function isSupportedDocument(supportedLanguage, document) {
    if (supportedLanguage.indexOf(document.languageId) < 0) {
        return false;
    }
    return fileSchemes.isSupportedScheme(document.uri.scheme);
}
function deactivate() {
    rimraf.sync(electron.getInstanceDir());
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map