/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { URI } from '../../../base/common/uri.js';
import * as typeConverters from './extHostTypeConverters.js';
import * as types from './extHostTypes.js';
import { PreviewHTMLAPICommand, OpenFolderAPICommand, DiffAPICommand, OpenAPICommand, RemoveFromRecentlyOpenedAPICommand, SetEditorLayoutAPICommand } from './apiCommands.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
var ExtHostApiCommands = /** @class */ (function () {
    function ExtHostApiCommands(commands) {
        this._disposables = [];
        this._commands = commands;
    }
    ExtHostApiCommands.register = function (commands) {
        return new ExtHostApiCommands(commands).registerCommands();
    };
    ExtHostApiCommands.prototype.registerCommands = function () {
        var _this = this;
        this._register('vscode.executeWorkspaceSymbolProvider', this._executeWorkspaceSymbolProvider, {
            description: 'Execute all workspace symbol provider.',
            args: [{ name: 'query', description: 'Search string', constraint: String }],
            returns: 'A promise that resolves to an array of SymbolInformation-instances.'
        });
        this._register('vscode.executeDefinitionProvider', this._executeDefinitionProvider, {
            description: 'Execute all definition provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position of a symbol', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Location-instances.'
        });
        this._register('vscode.executeDeclarationProvider', this._executeDeclaraionProvider, {
            description: 'Execute all declaration provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position of a symbol', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Location-instances.'
        });
        this._register('vscode.executeTypeDefinitionProvider', this._executeTypeDefinitionProvider, {
            description: 'Execute all type definition providers.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position of a symbol', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Location-instances.'
        });
        this._register('vscode.executeImplementationProvider', this._executeImplementationProvider, {
            description: 'Execute all implementation providers.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position of a symbol', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Location-instance.'
        });
        this._register('vscode.executeHoverProvider', this._executeHoverProvider, {
            description: 'Execute all hover provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position of a symbol', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Hover-instances.'
        });
        this._register('vscode.executeDocumentHighlights', this._executeDocumentHighlights, {
            description: 'Execute document highlight provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of DocumentHighlight-instances.'
        });
        this._register('vscode.executeReferenceProvider', this._executeReferenceProvider, {
            description: 'Execute reference provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position }
            ],
            returns: 'A promise that resolves to an array of Location-instances.'
        });
        this._register('vscode.executeDocumentRenameProvider', this._executeDocumentRenameProvider, {
            description: 'Execute rename provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position },
                { name: 'newName', description: 'The new symbol name', constraint: String }
            ],
            returns: 'A promise that resolves to a WorkspaceEdit.'
        });
        this._register('vscode.executeSignatureHelpProvider', this._executeSignatureHelpProvider, {
            description: 'Execute signature help provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position },
                { name: 'triggerCharacter', description: '(optional) Trigger signature help when the user types the character, like `,` or `(`', constraint: function (value) { return value === void 0 || typeof value === 'string'; } }
            ],
            returns: 'A promise that resolves to SignatureHelp.'
        });
        this._register('vscode.executeDocumentSymbolProvider', this._executeDocumentSymbolProvider, {
            description: 'Execute document symbol provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI }
            ],
            returns: 'A promise that resolves to an array of SymbolInformation and DocumentSymbol instances.'
        });
        this._register('vscode.executeCompletionItemProvider', this._executeCompletionItemProvider, {
            description: 'Execute completion item provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position },
                { name: 'triggerCharacter', description: '(optional) Trigger completion when the user types the character, like `,` or `(`', constraint: function (value) { return value === void 0 || typeof value === 'string'; } },
                { name: 'itemResolveCount', description: '(optional) Number of completions to resolve (too large numbers slow down completions)', constraint: function (value) { return value === void 0 || typeof value === 'number'; } }
            ],
            returns: 'A promise that resolves to a CompletionList-instance.'
        });
        this._register('vscode.executeCodeActionProvider', this._executeCodeActionProvider, {
            description: 'Execute code action provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'range', description: 'Range in a text document', constraint: types.Range }
            ],
            returns: 'A promise that resolves to an array of Command-instances.'
        });
        this._register('vscode.executeCodeLensProvider', this._executeCodeLensProvider, {
            description: 'Execute CodeLens provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'itemResolveCount', description: '(optional) Number of lenses that should be resolved and returned. Will only retrun resolved lenses, will impact performance)', constraint: function (value) { return value === void 0 || typeof value === 'number'; } }
            ],
            returns: 'A promise that resolves to an array of CodeLens-instances.'
        });
        this._register('vscode.executeFormatDocumentProvider', this._executeFormatDocumentProvider, {
            description: 'Execute document format provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'options', description: 'Formatting options' }
            ],
            returns: 'A promise that resolves to an array of TextEdits.'
        });
        this._register('vscode.executeFormatRangeProvider', this._executeFormatRangeProvider, {
            description: 'Execute range format provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'range', description: 'Range in a text document', constraint: types.Range },
                { name: 'options', description: 'Formatting options' }
            ],
            returns: 'A promise that resolves to an array of TextEdits.'
        });
        this._register('vscode.executeFormatOnTypeProvider', this._executeFormatOnTypeProvider, {
            description: 'Execute document format provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
                { name: 'position', description: 'Position in a text document', constraint: types.Position },
                { name: 'ch', description: 'Character that got typed', constraint: String },
                { name: 'options', description: 'Formatting options' }
            ],
            returns: 'A promise that resolves to an array of TextEdits.'
        });
        this._register('vscode.executeLinkProvider', this._executeDocumentLinkProvider, {
            description: 'Execute document link provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI }
            ],
            returns: 'A promise that resolves to an array of DocumentLink-instances.'
        });
        this._register('vscode.executeDocumentColorProvider', this._executeDocumentColorProvider, {
            description: 'Execute document color provider.',
            args: [
                { name: 'uri', description: 'Uri of a text document', constraint: URI },
            ],
            returns: 'A promise that resolves to an array of ColorInformation objects.'
        });
        this._register('vscode.executeColorPresentationProvider', this._executeColorPresentationProvider, {
            description: 'Execute color presentation provider.',
            args: [
                { name: 'color', description: 'The color to show and insert', constraint: types.Color },
                { name: 'context', description: 'Context object with uri and range' }
            ],
            returns: 'A promise that resolves to an array of ColorPresentation objects.'
        });
        var adjustHandler = function (handler) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return handler.apply(void 0, [_this._commands].concat(args));
            };
        };
        this._register(PreviewHTMLAPICommand.ID, adjustHandler(PreviewHTMLAPICommand.execute), {
            description: "\n\t\t\t\t\tRender the HTML of the resource in an editor view.\n\n\t\t\t\t\tSee [working with the HTML preview](https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands#working-with-the-html-preview) for more information about the HTML preview's integration with the editor and for best practices for extension authors.\n\t\t\t\t",
            args: [
                { name: 'uri', description: 'Uri of the resource to preview.', constraint: function (value) { return value instanceof URI || typeof value === 'string'; } },
                { name: 'column', description: '(optional) Column in which to preview.', constraint: function (value) { return typeof value === 'undefined' || (typeof value === 'number' && typeof types.ViewColumn[value] === 'string'); } },
                { name: 'label', description: '(optional) An human readable string that is used as title for the preview.', constraint: function (v) { return typeof v === 'string' || typeof v === 'undefined'; } },
                { name: 'options', description: '(optional) Options for controlling webview environment.', constraint: function (v) { return typeof v === 'object' || typeof v === 'undefined'; } }
            ]
        });
        this._register(OpenFolderAPICommand.ID, adjustHandler(OpenFolderAPICommand.execute), {
            description: 'Open a folder or workspace in the current window or new window depending on the newWindow argument. Note that opening in the same window will shutdown the current extension host process and start a new one on the given folder/workspace unless the newWindow parameter is set to true.',
            args: [
                { name: 'uri', description: '(optional) Uri of the folder or workspace file to open. If not provided, a native dialog will ask the user for the folder', constraint: function (value) { return value === void 0 || value instanceof URI; } },
                { name: 'newWindow', description: '(optional) Whether to open the folder/workspace in a new window or the same. Defaults to opening in the same window.', constraint: function (value) { return value === void 0 || typeof value === 'boolean'; } }
            ]
        });
        this._register(DiffAPICommand.ID, adjustHandler(DiffAPICommand.execute), {
            description: 'Opens the provided resources in the diff editor to compare their contents.',
            args: [
                { name: 'left', description: 'Left-hand side resource of the diff editor', constraint: URI },
                { name: 'right', description: 'Right-hand side resource of the diff editor', constraint: URI },
                { name: 'title', description: '(optional) Human readable title for the diff editor', constraint: function (v) { return v === void 0 || typeof v === 'string'; } },
                { name: 'options', description: '(optional) Editor options, see vscode.TextDocumentShowOptions' }
            ]
        });
        this._register(OpenAPICommand.ID, adjustHandler(OpenAPICommand.execute), {
            description: 'Opens the provided resource in the editor. Can be a text or binary file, or a http(s) url. If you need more control over the options for opening a text file, use vscode.window.showTextDocument instead.',
            args: [
                { name: 'resource', description: 'Resource to open', constraint: URI },
                { name: 'columnOrOptions', description: '(optional) Either the column in which to open or editor options, see vscode.TextDocumentShowOptions', constraint: function (v) { return v === void 0 || typeof v === 'number' || typeof v === 'object'; } }
            ]
        });
        this._register(RemoveFromRecentlyOpenedAPICommand.ID, adjustHandler(RemoveFromRecentlyOpenedAPICommand.execute), {
            description: 'Removes an entry with the given path from the recently opened list.',
            args: [
                { name: 'path', description: 'Path to remove from recently opened.', constraint: function (value) { return typeof value === 'string'; } }
            ]
        });
        this._register(SetEditorLayoutAPICommand.ID, adjustHandler(SetEditorLayoutAPICommand.execute), {
            description: 'Sets the editor layout. The layout is described as object with an initial (optional) orientation (0 = horizontal, 1 = vertical) and an array of editor groups within. Each editor group can have a size and another array of editor groups that will be laid out orthogonal to the orientation. If editor group sizes are provided, their sum must be 1 to be applied per row or column. Example for a 2x2 grid: `{ orientation: 0, groups: [{ groups: [{}, {}], size: 0.5 }, { groups: [{}, {}], size: 0.5 }] }`',
            args: [
                { name: 'layout', description: 'The editor layout to set.', constraint: function (value) { return typeof value === 'object' && Array.isArray(value.groups); } }
            ]
        });
    };
    // --- command impl
    ExtHostApiCommands.prototype._register = function (id, handler, description) {
        var disposable = this._commands.registerCommand(false, id, handler, this, description);
        this._disposables.push(disposable);
    };
    /**
     * Execute workspace symbol provider.
     *
     * @param query Search string to match query symbol names
     * @return A promise that resolves to an array of symbol information.
     */
    ExtHostApiCommands.prototype._executeWorkspaceSymbolProvider = function (query) {
        return this._commands.executeCommand('_executeWorkspaceSymbolProvider', { query: query }).then(function (value) {
            var result = [];
            if (Array.isArray(value)) {
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var tuple = value_1[_i];
                    result.push.apply(result, tuple[1].map(typeConverters.WorkspaceSymbol.to));
                }
            }
            return result;
        });
    };
    ExtHostApiCommands.prototype._executeDefinitionProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeDefinitionProvider', args)
            .then(tryMapWith(typeConverters.location.to));
    };
    ExtHostApiCommands.prototype._executeDeclaraionProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeDeclarationProvider', args)
            .then(tryMapWith(typeConverters.location.to));
    };
    ExtHostApiCommands.prototype._executeTypeDefinitionProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeTypeDefinitionProvider', args)
            .then(tryMapWith(typeConverters.location.to));
    };
    ExtHostApiCommands.prototype._executeImplementationProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeImplementationProvider', args)
            .then(tryMapWith(typeConverters.location.to));
    };
    ExtHostApiCommands.prototype._executeHoverProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeHoverProvider', args)
            .then(tryMapWith(typeConverters.Hover.to));
    };
    ExtHostApiCommands.prototype._executeDocumentHighlights = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeDocumentHighlights', args)
            .then(tryMapWith(typeConverters.DocumentHighlight.to));
    };
    ExtHostApiCommands.prototype._executeReferenceProvider = function (resource, position) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position)
        };
        return this._commands.executeCommand('_executeReferenceProvider', args)
            .then(tryMapWith(typeConverters.location.to));
    };
    ExtHostApiCommands.prototype._executeDocumentRenameProvider = function (resource, position, newName) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position),
            newName: newName
        };
        return this._commands.executeCommand('_executeDocumentRenameProvider', args).then(function (value) {
            if (!value) {
                return undefined;
            }
            if (value.rejectReason) {
                return Promise.reject(new Error(value.rejectReason));
            }
            return typeConverters.WorkspaceEdit.to(value);
        });
    };
    ExtHostApiCommands.prototype._executeSignatureHelpProvider = function (resource, position, triggerCharacter) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position),
            triggerCharacter: triggerCharacter
        };
        return this._commands.executeCommand('_executeSignatureHelpProvider', args).then(function (value) {
            if (value) {
                return typeConverters.SignatureHelp.to(value);
            }
            return undefined;
        });
    };
    ExtHostApiCommands.prototype._executeCompletionItemProvider = function (resource, position, triggerCharacter, maxItemsToResolve) {
        var args = {
            resource: resource,
            position: position && typeConverters.Position.from(position),
            triggerCharacter: triggerCharacter,
            maxItemsToResolve: maxItemsToResolve
        };
        return this._commands.executeCommand('_executeCompletionItemProvider', args).then(function (result) {
            if (result) {
                var items = result.suggestions.map(function (suggestion) { return typeConverters.CompletionItem.to(suggestion); });
                return new types.CompletionList(items, result.incomplete);
            }
            return undefined;
        });
    };
    ExtHostApiCommands.prototype._executeDocumentColorProvider = function (resource) {
        var args = {
            resource: resource
        };
        return this._commands.executeCommand('_executeDocumentColorProvider', args).then(function (result) {
            if (result) {
                return result.map(function (ci) { return ({ range: typeConverters.Range.to(ci.range), color: typeConverters.Color.to(ci.color) }); });
            }
            return [];
        });
    };
    ExtHostApiCommands.prototype._executeColorPresentationProvider = function (color, context) {
        var args = {
            resource: context.uri,
            color: typeConverters.Color.from(color),
            range: typeConverters.Range.from(context.range),
        };
        return this._commands.executeCommand('_executeColorPresentationProvider', args).then(function (result) {
            if (result) {
                return result.map(typeConverters.ColorPresentation.to);
            }
            return [];
        });
    };
    ExtHostApiCommands.prototype._executeDocumentSymbolProvider = function (resource) {
        var args = {
            resource: resource
        };
        return this._commands.executeCommand('_executeDocumentSymbolProvider', args).then(function (value) {
            if (isFalsyOrEmpty(value)) {
                return undefined;
            }
            var MergedInfo = /** @class */ (function (_super) {
                __extends(MergedInfo, _super);
                function MergedInfo() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MergedInfo.to = function (symbol) {
                    var res = new MergedInfo(symbol.name, typeConverters.SymbolKind.to(symbol.kind), symbol.containerName, new types.Location(resource, typeConverters.Range.to(symbol.range)));
                    res.detail = symbol.detail;
                    res.range = res.location.range;
                    res.selectionRange = typeConverters.Range.to(symbol.selectionRange);
                    res.children = symbol.children && symbol.children.map(MergedInfo.to);
                    return res;
                };
                return MergedInfo;
            }(types.SymbolInformation));
            return value.map(MergedInfo.to);
        });
    };
    ExtHostApiCommands.prototype._executeCodeActionProvider = function (resource, range) {
        var _this = this;
        var args = {
            resource: resource,
            range: typeConverters.Range.from(range)
        };
        return this._commands.executeCommand('_executeCodeActionProvider', args)
            .then(tryMapWith(function (codeAction) {
            if (codeAction._isSynthetic) {
                return _this._commands.converter.fromInternal(codeAction.command);
            }
            else {
                var ret = new types.CodeAction(codeAction.title, codeAction.kind ? new types.CodeActionKind(codeAction.kind) : undefined);
                if (codeAction.edit) {
                    ret.edit = typeConverters.WorkspaceEdit.to(codeAction.edit);
                }
                if (codeAction.command) {
                    ret.command = _this._commands.converter.fromInternal(codeAction.command);
                }
                return ret;
            }
        }));
    };
    ExtHostApiCommands.prototype._executeCodeLensProvider = function (resource, itemResolveCount) {
        var _this = this;
        var args = { resource: resource, itemResolveCount: itemResolveCount };
        return this._commands.executeCommand('_executeCodeLensProvider', args)
            .then(tryMapWith(function (item) {
            return new types.CodeLens(typeConverters.Range.to(item.range), _this._commands.converter.fromInternal(item.command));
        }));
    };
    ExtHostApiCommands.prototype._executeFormatDocumentProvider = function (resource, options) {
        var args = {
            resource: resource,
            options: options
        };
        return this._commands.executeCommand('_executeFormatDocumentProvider', args)
            .then(tryMapWith(function (edit) { return new types.TextEdit(typeConverters.Range.to(edit.range), edit.text); }));
    };
    ExtHostApiCommands.prototype._executeFormatRangeProvider = function (resource, range, options) {
        var args = {
            resource: resource,
            range: typeConverters.Range.from(range),
            options: options
        };
        return this._commands.executeCommand('_executeFormatRangeProvider', args)
            .then(tryMapWith(function (edit) { return new types.TextEdit(typeConverters.Range.to(edit.range), edit.text); }));
    };
    ExtHostApiCommands.prototype._executeFormatOnTypeProvider = function (resource, position, ch, options) {
        var args = {
            resource: resource,
            position: typeConverters.Position.from(position),
            ch: ch,
            options: options
        };
        return this._commands.executeCommand('_executeFormatOnTypeProvider', args)
            .then(tryMapWith(function (edit) { return new types.TextEdit(typeConverters.Range.to(edit.range), edit.text); }));
    };
    ExtHostApiCommands.prototype._executeDocumentLinkProvider = function (resource) {
        return this._commands.executeCommand('_executeLinkProvider', resource)
            .then(tryMapWith(typeConverters.DocumentLink.to));
    };
    return ExtHostApiCommands;
}());
export { ExtHostApiCommands };
function tryMapWith(f) {
    return function (value) {
        if (Array.isArray(value)) {
            return value.map(f);
        }
        return undefined;
    };
}
