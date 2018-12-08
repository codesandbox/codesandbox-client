/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../base/common/event.js';
import * as modes from '../../../editor/common/modes.js';
import * as search from '../../parts/search/common/search.js';
import { ExtHostContext, MainContext, reviveWorkspaceEditDto } from '../node/extHost.protocol.js';
import { LanguageConfigurationRegistry } from '../../../editor/common/modes/languageConfigurationRegistry.js';
import { IHeapService } from './mainThreadHeapService.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import * as typeConverters from '../node/extHostTypeConverters.js';
import { URI } from '../../../base/common/uri.js';
var MainThreadLanguageFeatures = /** @class */ (function () {
    function MainThreadLanguageFeatures(extHostContext, heapService, modeService) {
        this._registrations = Object.create(null);
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostLanguageFeatures);
        this._heapService = heapService;
        this._modeService = modeService;
    }
    MainThreadLanguageFeatures_1 = MainThreadLanguageFeatures;
    MainThreadLanguageFeatures.prototype.dispose = function () {
        for (var key in this._registrations) {
            this._registrations[key].dispose();
        }
    };
    MainThreadLanguageFeatures.prototype.$unregister = function (handle) {
        var registration = this._registrations[handle];
        if (registration) {
            registration.dispose();
            delete this._registrations[handle];
        }
    };
    MainThreadLanguageFeatures._reviveLocationDto = function (data) {
        if (!data) {
            return data;
        }
        else if (Array.isArray(data)) {
            data.forEach(function (l) { return MainThreadLanguageFeatures_1._reviveLocationDto(l); });
            return data;
        }
        else {
            data.uri = URI.revive(data.uri);
            return data;
        }
    };
    MainThreadLanguageFeatures._reviveDefinitionLinkDto = function (data) {
        if (!data) {
            return data;
        }
        else if (Array.isArray(data)) {
            data.forEach(function (l) { return MainThreadLanguageFeatures_1._reviveDefinitionLinkDto(l); });
            return data;
        }
        else {
            data.uri = URI.revive(data.uri);
            return data;
        }
    };
    MainThreadLanguageFeatures._reviveWorkspaceSymbolDto = function (data) {
        if (!data) {
            return data;
        }
        else if (Array.isArray(data)) {
            data.forEach(MainThreadLanguageFeatures_1._reviveWorkspaceSymbolDto);
            return data;
        }
        else {
            data.location = MainThreadLanguageFeatures_1._reviveLocationDto(data.location);
            return data;
        }
    };
    MainThreadLanguageFeatures._reviveCodeActionDto = function (data) {
        if (data) {
            data.forEach(function (code) { return reviveWorkspaceEditDto(code.edit); });
        }
        return data;
    };
    //#endregion
    // --- outline
    MainThreadLanguageFeatures.prototype.$registerOutlineSupport = function (handle, selector, displayName) {
        var _this = this;
        this._registrations[handle] = modes.DocumentSymbolProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            displayName: displayName,
            provideDocumentSymbols: function (model, token) {
                return _this._proxy.$provideDocumentSymbols(handle, model.uri, token);
            }
        });
    };
    // --- code lens
    MainThreadLanguageFeatures.prototype.$registerCodeLensSupport = function (handle, selector, eventHandle) {
        var _this = this;
        var provider = {
            provideCodeLenses: function (model, token) {
                return _this._heapService.trackRecursive(_this._proxy.$provideCodeLenses(handle, model.uri, token));
            },
            resolveCodeLens: function (model, codeLens, token) {
                return _this._heapService.trackRecursive(_this._proxy.$resolveCodeLens(handle, model.uri, codeLens, token));
            }
        };
        if (typeof eventHandle === 'number') {
            var emitter = new Emitter();
            this._registrations[eventHandle] = emitter;
            provider.onDidChange = emitter.event;
        }
        this._registrations[handle] = modes.CodeLensProviderRegistry.register(typeConverters.LanguageSelector.from(selector), provider);
    };
    MainThreadLanguageFeatures.prototype.$emitCodeLensEvent = function (eventHandle, event) {
        var obj = this._registrations[eventHandle];
        if (obj instanceof Emitter) {
            obj.fire(event);
        }
    };
    // --- declaration
    MainThreadLanguageFeatures.prototype.$registerDefinitionSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.DefinitionProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDefinition: function (model, position, token) {
                return _this._proxy.$provideDefinition(handle, model.uri, position, token).then(MainThreadLanguageFeatures_1._reviveDefinitionLinkDto);
            }
        });
    };
    MainThreadLanguageFeatures.prototype.$registerDeclarationSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.DeclarationProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDeclaration: function (model, position, token) {
                return _this._proxy.$provideDeclaration(handle, model.uri, position, token).then(MainThreadLanguageFeatures_1._reviveDefinitionLinkDto);
            }
        });
    };
    MainThreadLanguageFeatures.prototype.$registerImplementationSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.ImplementationProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideImplementation: function (model, position, token) {
                return _this._proxy.$provideImplementation(handle, model.uri, position, token).then(MainThreadLanguageFeatures_1._reviveDefinitionLinkDto);
            }
        });
    };
    MainThreadLanguageFeatures.prototype.$registerTypeDefinitionSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.TypeDefinitionProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideTypeDefinition: function (model, position, token) {
                return _this._proxy.$provideTypeDefinition(handle, model.uri, position, token).then(MainThreadLanguageFeatures_1._reviveDefinitionLinkDto);
            }
        });
    };
    // --- extra info
    MainThreadLanguageFeatures.prototype.$registerHoverProvider = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.HoverProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideHover: function (model, position, token) {
                return _this._proxy.$provideHover(handle, model.uri, position, token);
            }
        });
    };
    // --- occurrences
    MainThreadLanguageFeatures.prototype.$registerDocumentHighlightProvider = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.DocumentHighlightProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDocumentHighlights: function (model, position, token) {
                return _this._proxy.$provideDocumentHighlights(handle, model.uri, position, token);
            }
        });
    };
    // --- references
    MainThreadLanguageFeatures.prototype.$registerReferenceSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.ReferenceProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideReferences: function (model, position, context, token) {
                return _this._proxy.$provideReferences(handle, model.uri, position, context, token).then(MainThreadLanguageFeatures_1._reviveLocationDto);
            }
        });
    };
    // --- quick fix
    MainThreadLanguageFeatures.prototype.$registerQuickFixSupport = function (handle, selector, providedCodeActionKinds) {
        var _this = this;
        this._registrations[handle] = modes.CodeActionProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideCodeActions: function (model, rangeOrSelection, context, token) {
                return _this._heapService.trackRecursive(_this._proxy.$provideCodeActions(handle, model.uri, rangeOrSelection, context, token)).then(MainThreadLanguageFeatures_1._reviveCodeActionDto);
            },
            providedCodeActionKinds: providedCodeActionKinds
        });
    };
    // --- formatting
    MainThreadLanguageFeatures.prototype.$registerDocumentFormattingSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.DocumentFormattingEditProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDocumentFormattingEdits: function (model, options, token) {
                return _this._proxy.$provideDocumentFormattingEdits(handle, model.uri, options, token);
            }
        });
    };
    MainThreadLanguageFeatures.prototype.$registerRangeFormattingSupport = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.DocumentRangeFormattingEditProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDocumentRangeFormattingEdits: function (model, range, options, token) {
                return _this._proxy.$provideDocumentRangeFormattingEdits(handle, model.uri, range, options, token);
            }
        });
    };
    MainThreadLanguageFeatures.prototype.$registerOnTypeFormattingSupport = function (handle, selector, autoFormatTriggerCharacters) {
        var _this = this;
        this._registrations[handle] = modes.OnTypeFormattingEditProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            autoFormatTriggerCharacters: autoFormatTriggerCharacters,
            provideOnTypeFormattingEdits: function (model, position, ch, options, token) {
                return _this._proxy.$provideOnTypeFormattingEdits(handle, model.uri, position, ch, options, token);
            }
        });
    };
    // --- navigate type
    MainThreadLanguageFeatures.prototype.$registerNavigateTypeSupport = function (handle) {
        var _this = this;
        var lastResultId;
        this._registrations[handle] = search.WorkspaceSymbolProviderRegistry.register({
            provideWorkspaceSymbols: function (search, token) {
                return _this._proxy.$provideWorkspaceSymbols(handle, search, token).then(function (result) {
                    if (lastResultId !== undefined) {
                        _this._proxy.$releaseWorkspaceSymbols(handle, lastResultId);
                    }
                    lastResultId = result._id;
                    return MainThreadLanguageFeatures_1._reviveWorkspaceSymbolDto(result.symbols);
                });
            },
            resolveWorkspaceSymbol: function (item, token) {
                return _this._proxy.$resolveWorkspaceSymbol(handle, item, token).then(function (i) { return MainThreadLanguageFeatures_1._reviveWorkspaceSymbolDto(i); });
            }
        });
    };
    // --- rename
    MainThreadLanguageFeatures.prototype.$registerRenameSupport = function (handle, selector, supportResolveLocation) {
        var _this = this;
        this._registrations[handle] = modes.RenameProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideRenameEdits: function (model, position, newName, token) {
                return _this._proxy.$provideRenameEdits(handle, model.uri, position, newName, token).then(reviveWorkspaceEditDto);
            },
            resolveRenameLocation: supportResolveLocation
                ? function (model, position, token) { return _this._proxy.$resolveRenameLocation(handle, model.uri, position, token); }
                : undefined
        });
    };
    // --- suggest
    MainThreadLanguageFeatures.prototype.$registerSuggestSupport = function (handle, selector, triggerCharacters, supportsResolveDetails) {
        var _this = this;
        this._registrations[handle] = modes.CompletionProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            triggerCharacters: triggerCharacters,
            provideCompletionItems: function (model, position, context, token) {
                return _this._proxy.$provideCompletionItems(handle, model.uri, position, context, token).then(function (result) {
                    if (!result) {
                        return result;
                    }
                    return {
                        suggestions: result.suggestions,
                        incomplete: result.incomplete,
                        dispose: function () { return _this._proxy.$releaseCompletionItems(handle, result._id); }
                    };
                });
            },
            resolveCompletionItem: supportsResolveDetails
                ? function (model, position, suggestion, token) { return _this._proxy.$resolveCompletionItem(handle, model.uri, position, suggestion, token); }
                : undefined
        });
    };
    // --- parameter hints
    MainThreadLanguageFeatures.prototype.$registerSignatureHelpProvider = function (handle, selector, metadata) {
        var _this = this;
        this._registrations[handle] = modes.SignatureHelpProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            signatureHelpTriggerCharacters: metadata.triggerCharacters,
            signatureHelpRetriggerCharacters: metadata.retriggerCharacters,
            provideSignatureHelp: function (model, position, token, context) {
                return _this._proxy.$provideSignatureHelp(handle, model.uri, position, context, token);
            }
        });
    };
    // --- links
    MainThreadLanguageFeatures.prototype.$registerDocumentLinkProvider = function (handle, selector) {
        var _this = this;
        this._registrations[handle] = modes.LinkProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideLinks: function (model, token) {
                return _this._heapService.trackRecursive(_this._proxy.$provideDocumentLinks(handle, model.uri, token));
            },
            resolveLink: function (link, token) {
                return _this._proxy.$resolveDocumentLink(handle, link, token);
            }
        });
    };
    // --- colors
    MainThreadLanguageFeatures.prototype.$registerDocumentColorProvider = function (handle, selector) {
        var proxy = this._proxy;
        this._registrations[handle] = modes.ColorProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideDocumentColors: function (model, token) {
                return proxy.$provideDocumentColors(handle, model.uri, token)
                    .then(function (documentColors) {
                    return documentColors.map(function (documentColor) {
                        var _a = documentColor.color, red = _a[0], green = _a[1], blue = _a[2], alpha = _a[3];
                        var color = {
                            red: red,
                            green: green,
                            blue: blue,
                            alpha: alpha
                        };
                        return {
                            color: color,
                            range: documentColor.range
                        };
                    });
                });
            },
            provideColorPresentations: function (model, colorInfo, token) {
                return proxy.$provideColorPresentations(handle, model.uri, {
                    color: [colorInfo.color.red, colorInfo.color.green, colorInfo.color.blue, colorInfo.color.alpha],
                    range: colorInfo.range
                }, token);
            }
        });
    };
    // --- folding
    MainThreadLanguageFeatures.prototype.$registerFoldingRangeProvider = function (handle, selector) {
        var proxy = this._proxy;
        this._registrations[handle] = modes.FoldingRangeProviderRegistry.register(typeConverters.LanguageSelector.from(selector), {
            provideFoldingRanges: function (model, context, token) {
                return proxy.$provideFoldingRanges(handle, model.uri, context, token);
            }
        });
    };
    // --- configuration
    MainThreadLanguageFeatures._reviveRegExp = function (regExp) {
        if (typeof regExp === 'undefined') {
            return undefined;
        }
        if (regExp === null) {
            return null;
        }
        return new RegExp(regExp.pattern, regExp.flags);
    };
    MainThreadLanguageFeatures._reviveIndentationRule = function (indentationRule) {
        if (typeof indentationRule === 'undefined') {
            return undefined;
        }
        if (indentationRule === null) {
            return null;
        }
        return {
            decreaseIndentPattern: MainThreadLanguageFeatures_1._reviveRegExp(indentationRule.decreaseIndentPattern),
            increaseIndentPattern: MainThreadLanguageFeatures_1._reviveRegExp(indentationRule.increaseIndentPattern),
            indentNextLinePattern: MainThreadLanguageFeatures_1._reviveRegExp(indentationRule.indentNextLinePattern),
            unIndentedLinePattern: MainThreadLanguageFeatures_1._reviveRegExp(indentationRule.unIndentedLinePattern),
        };
    };
    MainThreadLanguageFeatures._reviveOnEnterRule = function (onEnterRule) {
        return {
            beforeText: MainThreadLanguageFeatures_1._reviveRegExp(onEnterRule.beforeText),
            afterText: MainThreadLanguageFeatures_1._reviveRegExp(onEnterRule.afterText),
            oneLineAboveText: MainThreadLanguageFeatures_1._reviveRegExp(onEnterRule.oneLineAboveText),
            action: onEnterRule.action
        };
    };
    MainThreadLanguageFeatures._reviveOnEnterRules = function (onEnterRules) {
        if (typeof onEnterRules === 'undefined') {
            return undefined;
        }
        if (onEnterRules === null) {
            return null;
        }
        return onEnterRules.map(MainThreadLanguageFeatures_1._reviveOnEnterRule);
    };
    MainThreadLanguageFeatures.prototype.$setLanguageConfiguration = function (handle, languageId, _configuration) {
        var configuration = {
            comments: _configuration.comments,
            brackets: _configuration.brackets,
            wordPattern: MainThreadLanguageFeatures_1._reviveRegExp(_configuration.wordPattern),
            indentationRules: MainThreadLanguageFeatures_1._reviveIndentationRule(_configuration.indentationRules),
            onEnterRules: MainThreadLanguageFeatures_1._reviveOnEnterRules(_configuration.onEnterRules),
            autoClosingPairs: null,
            surroundingPairs: null,
            __electricCharacterSupport: null
        };
        if (_configuration.__characterPairSupport) {
            // backwards compatibility
            configuration.autoClosingPairs = _configuration.__characterPairSupport.autoClosingPairs;
        }
        if (_configuration.__electricCharacterSupport && _configuration.__electricCharacterSupport.docComment) {
            configuration.__electricCharacterSupport = {
                docComment: {
                    open: _configuration.__electricCharacterSupport.docComment.open,
                    close: _configuration.__electricCharacterSupport.docComment.close
                }
            };
        }
        var languageIdentifier = this._modeService.getLanguageIdentifier(languageId);
        if (languageIdentifier) {
            this._registrations[handle] = LanguageConfigurationRegistry.register(languageIdentifier, configuration);
        }
    };
    var MainThreadLanguageFeatures_1;
    MainThreadLanguageFeatures = MainThreadLanguageFeatures_1 = __decorate([
        extHostNamedCustomer(MainContext.MainThreadLanguageFeatures),
        __param(1, IHeapService),
        __param(2, IModeService)
    ], MainThreadLanguageFeatures);
    return MainThreadLanguageFeatures;
}());
export { MainThreadLanguageFeatures };
