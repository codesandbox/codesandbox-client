/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isMalformedFileUri } from '../../../base/common/resources.js';
import * as typeConverters from './extHostTypeConverters.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
function adjustHandler(handler) {
    return function (accessor) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return handler.apply(void 0, [accessor.get(ICommandService)].concat(args));
    };
}
var PreviewHTMLAPICommand = /** @class */ (function () {
    function PreviewHTMLAPICommand() {
    }
    PreviewHTMLAPICommand.execute = function (executor, uri, position, label, options) {
        return executor.executeCommand('_workbench.previewHtml', uri, typeof position === 'number' && typeConverters.ViewColumn.from(position), label, options);
    };
    PreviewHTMLAPICommand.ID = 'vscode.previewHtml';
    return PreviewHTMLAPICommand;
}());
export { PreviewHTMLAPICommand };
CommandsRegistry.registerCommand(PreviewHTMLAPICommand.ID, adjustHandler(PreviewHTMLAPICommand.execute));
var OpenFolderAPICommand = /** @class */ (function () {
    function OpenFolderAPICommand() {
    }
    OpenFolderAPICommand.execute = function (executor, uri, forceNewWindow) {
        if (!uri) {
            return executor.executeCommand('_files.pickFolderAndOpen', forceNewWindow);
        }
        var correctedUri = isMalformedFileUri(uri);
        if (correctedUri) {
            // workaround for #55916 and #55891, will be removed in 1.28
            console.warn("'vscode.openFolder' command invoked with an invalid URI (file:// scheme missing): '" + uri + "'. Converted to a 'file://' URI: " + correctedUri);
            uri = correctedUri;
        }
        return executor.executeCommand('_files.windowOpen', [uri], forceNewWindow);
    };
    OpenFolderAPICommand.ID = 'vscode.openFolder';
    return OpenFolderAPICommand;
}());
export { OpenFolderAPICommand };
CommandsRegistry.registerCommand(OpenFolderAPICommand.ID, adjustHandler(OpenFolderAPICommand.execute));
var DiffAPICommand = /** @class */ (function () {
    function DiffAPICommand() {
    }
    DiffAPICommand.execute = function (executor, left, right, label, options) {
        return executor.executeCommand('_workbench.diff', [
            left, right,
            label,
            undefined,
            typeConverters.TextEditorOptions.from(options),
            options ? typeConverters.ViewColumn.from(options.viewColumn) : undefined
        ]);
    };
    DiffAPICommand.ID = 'vscode.diff';
    return DiffAPICommand;
}());
export { DiffAPICommand };
CommandsRegistry.registerCommand(DiffAPICommand.ID, adjustHandler(DiffAPICommand.execute));
var OpenAPICommand = /** @class */ (function () {
    function OpenAPICommand() {
    }
    OpenAPICommand.execute = function (executor, resource, columnOrOptions, label) {
        var options;
        var position;
        if (columnOrOptions) {
            if (typeof columnOrOptions === 'number') {
                position = typeConverters.ViewColumn.from(columnOrOptions);
            }
            else {
                options = typeConverters.TextEditorOptions.from(columnOrOptions);
                position = typeConverters.ViewColumn.from(columnOrOptions.viewColumn);
            }
        }
        return executor.executeCommand('_workbench.open', [
            resource,
            options,
            position,
            label
        ]);
    };
    OpenAPICommand.ID = 'vscode.open';
    return OpenAPICommand;
}());
export { OpenAPICommand };
CommandsRegistry.registerCommand(OpenAPICommand.ID, adjustHandler(OpenAPICommand.execute));
var RemoveFromRecentlyOpenedAPICommand = /** @class */ (function () {
    function RemoveFromRecentlyOpenedAPICommand() {
    }
    RemoveFromRecentlyOpenedAPICommand.execute = function (executor, path) {
        return executor.executeCommand('_workbench.removeFromRecentlyOpened', path);
    };
    RemoveFromRecentlyOpenedAPICommand.ID = 'vscode.removeFromRecentlyOpened';
    return RemoveFromRecentlyOpenedAPICommand;
}());
export { RemoveFromRecentlyOpenedAPICommand };
CommandsRegistry.registerCommand(RemoveFromRecentlyOpenedAPICommand.ID, adjustHandler(RemoveFromRecentlyOpenedAPICommand.execute));
var SetEditorLayoutAPICommand = /** @class */ (function () {
    function SetEditorLayoutAPICommand() {
    }
    SetEditorLayoutAPICommand.execute = function (executor, layout) {
        return executor.executeCommand('layoutEditorGroups', layout);
    };
    SetEditorLayoutAPICommand.ID = 'vscode.setEditorLayout';
    return SetEditorLayoutAPICommand;
}());
export { SetEditorLayoutAPICommand };
CommandsRegistry.registerCommand(SetEditorLayoutAPICommand.ID, adjustHandler(SetEditorLayoutAPICommand.execute));
