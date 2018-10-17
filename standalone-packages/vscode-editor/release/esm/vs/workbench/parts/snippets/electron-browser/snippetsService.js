/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { basename, extname, join } from '../../../../../path.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { values } from '../../../../base/common/map.js';
import * as resources from '../../../../base/common/resources.js';
import { compare, endsWith, isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { SnippetParser } from '../../../../editor/contrib/snippet/snippetParser.js';
import { setSnippetSuggestSupport } from '../../../../editor/contrib/suggest/suggest.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ISnippetsService } from './snippets.contribution.js';
import { SnippetFile } from './snippetsFile.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { languagesExtPoint } from '../../../services/mode/common/workbenchModeService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { isFalsyOrEmpty } from '../../../../base/common/arrays.js';
import { Range } from '../../../../editor/common/core/range.js';
var schema;
(function (schema) {
    function toValidSnippet(extension, snippet, modeService) {
        if (isFalsyOrWhitespace(snippet.path)) {
            extension.collector.error(localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", extension.description.name, String(snippet.path)));
            return null;
        }
        if (isFalsyOrWhitespace(snippet.language) && !endsWith(snippet.path, '.code-snippets')) {
            extension.collector.error(localize('invalid.language.0', "When omitting the language, the value of `contributes.{0}.path` must be a `.code-snippets`-file. Provided value: {1}", extension.description.name, String(snippet.path)));
            return null;
        }
        if (!isFalsyOrWhitespace(snippet.language) && !modeService.isRegisteredMode(snippet.language)) {
            extension.collector.error(localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", extension.description.name, String(snippet.language)));
            return null;
        }
        var extensionLocation = extension.description.extensionLocation;
        var snippetLocation = resources.joinPath(extensionLocation, snippet.path);
        if (!resources.isEqualOrParent(snippetLocation, extensionLocation)) {
            extension.collector.error(localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", extension.description.name, snippetLocation.path, extensionLocation.path));
            return null;
        }
        return {
            language: snippet.language,
            location: snippetLocation
        };
    }
    schema.toValidSnippet = toValidSnippet;
    schema.snippetsContribution = {
        description: localize('vscode.extension.contributes.snippets', 'Contributes snippets.'),
        type: 'array',
        defaultSnippets: [{ body: [{ language: '', path: '' }] }],
        items: {
            type: 'object',
            defaultSnippets: [{ body: { language: '${1:id}', path: './snippets/${2:id}.json.' } }],
            properties: {
                language: {
                    description: localize('vscode.extension.contributes.snippets-language', 'Language identifier for which this snippet is contributed to.'),
                    type: 'string'
                },
                path: {
                    description: localize('vscode.extension.contributes.snippets-path', 'Path of the snippets file. The path is relative to the extension folder and typically starts with \'./snippets/\'.'),
                    type: 'string'
                }
            }
        }
    };
})(schema || (schema = {}));
function watch(service, resource, callback) {
    var listener = service.onFileChanges(function (e) {
        for (var _i = 0, _a = e.changes; _i < _a.length; _i++) {
            var change = _a[_i];
            if (resources.isEqualOrParent(change.resource, resource)) {
                callback(change.type, change.resource);
            }
        }
    });
    service.watchFileChanges(resource);
    return {
        dispose: function () {
            listener.dispose();
            service.unwatchFileChanges(resource);
        }
    };
}
var SnippetsService = /** @class */ (function () {
    function SnippetsService(_environmentService, _contextService, _modeService, _logService, _fileService, lifecycleService) {
        var _this = this;
        this._environmentService = _environmentService;
        this._contextService = _contextService;
        this._modeService = _modeService;
        this._logService = _logService;
        this._fileService = _fileService;
        this._disposables = [];
        this._pendingWork = [];
        this._files = new Map();
        this._pendingWork.push(Promise.resolve(lifecycleService.when(3 /* Running */).then(function () {
            _this._initExtensionSnippets();
            _this._initUserSnippets();
            _this._initWorkspaceSnippets();
        })));
        setSnippetSuggestSupport(new SnippetSuggestProvider(this._modeService, this));
    }
    SnippetsService.prototype.dispose = function () {
        dispose(this._disposables);
    };
    SnippetsService.prototype._joinSnippets = function () {
        var promises = this._pendingWork.slice(0);
        this._pendingWork.length = 0;
        return Promise.all(promises);
    };
    SnippetsService.prototype.getSnippetFiles = function () {
        var _this = this;
        return this._joinSnippets().then(function () { return values(_this._files); });
    };
    SnippetsService.prototype.getSnippets = function (languageId) {
        var _this = this;
        return this._joinSnippets().then(function () {
            var langName = _this._modeService.getLanguageIdentifier(languageId).language;
            var result = [];
            var promises = [];
            _this._files.forEach(function (file) {
                promises.push(file.load()
                    .then(function (file) { return file.select(langName, result); })
                    .catch(function (err) { return _this._logService.error(err, file.location.toString()); }));
            });
            return Promise.all(promises).then(function () { return result; });
        });
    };
    SnippetsService.prototype.getSnippetsSync = function (languageId) {
        var langName = this._modeService.getLanguageIdentifier(languageId).language;
        var result = [];
        this._files.forEach(function (file) {
            // kick off loading (which is a noop in case it's already loaded)
            // and optimistically collect snippets
            file.load().catch(function (err) { });
            file.select(langName, result);
        });
        return result;
    };
    // --- loading, watching
    SnippetsService.prototype._initExtensionSnippets = function () {
        var _this = this;
        ExtensionsRegistry.registerExtensionPoint('snippets', [languagesExtPoint], schema.snippetsContribution).setHandler(function (extensions) {
            var _loop_1 = function (extension) {
                var _loop_2 = function (contribution) {
                    var validContribution = schema.toValidSnippet(extension, contribution, _this._modeService);
                    if (!validContribution) {
                        return "continue";
                    }
                    if (_this._files.has(validContribution.location.toString())) {
                        _this._files.get(validContribution.location.toString()).defaultScopes.push(validContribution.language);
                    }
                    else {
                        var file_1 = new SnippetFile(3 /* Extension */, validContribution.location, validContribution.language ? [validContribution.language] : undefined, extension.description, _this._fileService);
                        _this._files.set(file_1.location.toString(), file_1);
                        if (_this._environmentService.isExtensionDevelopment) {
                            file_1.load().then(function (file) {
                                // warn about bad tabstop/variable usage
                                if (file.data.some(function (snippet) { return snippet.isBogous; })) {
                                    extension.collector.warn(localize('badVariableUse', "One or more snippets from the extension '{0}' very likely confuse snippet-variables and snippet-placeholders (see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax for more details)", extension.description.name));
                                }
                            }, function (err) {
                                // generic error
                                extension.collector.warn(localize('badFile', "The snippet file \"{0}\" could not be read.", file_1.location.toString()));
                            });
                        }
                    }
                };
                for (var _i = 0, _a = extension.value; _i < _a.length; _i++) {
                    var contribution = _a[_i];
                    _loop_2(contribution);
                }
            };
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                _loop_1(extension);
            }
        });
    };
    SnippetsService.prototype._initWorkspaceSnippets = function () {
        var _this = this;
        // workspace stuff
        var disposables = [];
        var updateWorkspaceSnippets = function () {
            disposables = dispose(disposables);
            _this._pendingWork.push(_this._initWorkspaceFolderSnippets(_this._contextService.getWorkspace(), disposables));
        };
        this._disposables.push({
            dispose: function () { dispose(disposables); }
        });
        this._disposables.push(this._contextService.onDidChangeWorkspaceFolders(updateWorkspaceSnippets));
        this._disposables.push(this._contextService.onDidChangeWorkbenchState(updateWorkspaceSnippets));
        updateWorkspaceSnippets();
    };
    SnippetsService.prototype._initWorkspaceFolderSnippets = function (workspace, bucket) {
        var _this = this;
        var promises = workspace.folders.map(function (folder) {
            var snippetFolder = folder.toResource('.vscode');
            return _this._fileService.existsFile(snippetFolder).then(function (value) {
                if (value) {
                    _this._initFolderSnippets(2 /* Workspace */, snippetFolder, bucket);
                }
                else {
                    // watch
                    bucket.push(watch(_this._fileService, snippetFolder, function (type) {
                        if (type === 1 /* ADDED */) {
                            _this._initFolderSnippets(2 /* Workspace */, snippetFolder, bucket);
                        }
                    }));
                }
            });
        });
        return Promise.all(promises);
    };
    SnippetsService.prototype._initUserSnippets = function () {
        var _this = this;
        var userSnippetsFolder = URI.file(join(this._environmentService.appSettingsHome, 'snippets'));
        return this._fileService.createFolder(userSnippetsFolder).then(function () { return _this._initFolderSnippets(1 /* User */, userSnippetsFolder, _this._disposables); });
    };
    SnippetsService.prototype._initFolderSnippets = function (source, folder, bucket) {
        var _this = this;
        var addUserSnippet = function (filepath) {
            var ext = extname(filepath.path);
            if (source === 1 /* User */ && ext === '.json') {
                var langName = basename(filepath.path, '.json');
                _this._files.set(filepath.toString(), new SnippetFile(source, filepath, [langName], undefined, _this._fileService));
            }
            else if (ext === '.code-snippets') {
                _this._files.set(filepath.toString(), new SnippetFile(source, filepath, undefined, undefined, _this._fileService));
            }
        };
        return this._fileService.resolveFile(folder).then(function (stat) {
            if (!isFalsyOrEmpty(stat.children)) {
                for (var _i = 0, _a = stat.children; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    addUserSnippet(entry.resource);
                }
            }
        }).then(function () {
            // watch
            bucket.push(watch(_this._fileService, folder, function (_type, filename) {
                _this._fileService.existsFile(filename).then(function (value) {
                    if (value) {
                        // file created or changed
                        if (_this._files.has(filename.toString())) {
                            _this._files.get(filename.toString()).reset();
                        }
                        else {
                            addUserSnippet(filename);
                        }
                    }
                    else {
                        // file not found
                        _this._files.delete(filename.toString());
                    }
                });
            }));
            bucket.push({
                dispose: function () {
                    // add a disposable that removes all snippets
                    // from this folder. that ensures snippets disappear
                    // when the folder goes away
                    _this._files.forEach(function (value, index) {
                        if (resources.isEqualOrParent(value.location, folder)) {
                            _this._files.delete(index);
                        }
                    });
                }
            });
        }).then(undefined, function (err) {
            _this._logService.error("Failed snippets from folder '" + folder.toString() + "'", err);
        });
    };
    SnippetsService = __decorate([
        __param(0, IEnvironmentService),
        __param(1, IWorkspaceContextService),
        __param(2, IModeService),
        __param(3, ILogService),
        __param(4, IFileService),
        __param(5, ILifecycleService)
    ], SnippetsService);
    return SnippetsService;
}());
registerSingleton(ISnippetsService, SnippetsService);
var SnippetSuggestion = /** @class */ (function () {
    function SnippetSuggestion(snippet, range) {
        this.snippet = snippet;
        this.label = snippet.prefix;
        this.detail = localize('detail.snippet', "{0} ({1})", snippet.description || snippet.name, snippet.source);
        this.insertText = snippet.body;
        this.range = range;
        this.sortText = (snippet.snippetSource === 3 /* Extension */ ? 'z' : 'a') + "-" + snippet.prefix;
        this.noAutoAccept = true;
        this.kind = 18 /* Snippet */;
        this.insertTextIsSnippet = true;
    }
    SnippetSuggestion.prototype.resolve = function () {
        this.documentation = new MarkdownString().appendCodeblock('', new SnippetParser().text(this.snippet.codeSnippet));
        this.insertText = this.snippet.codeSnippet;
        return this;
    };
    SnippetSuggestion.compareByLabel = function (a, b) {
        return compare(a.label, b.label);
    };
    return SnippetSuggestion;
}());
export { SnippetSuggestion };
var SnippetSuggestProvider = /** @class */ (function () {
    function SnippetSuggestProvider(_modeService, _snippets) {
        this._modeService = _modeService;
        this._snippets = _snippets;
        //
    }
    SnippetSuggestProvider.prototype.provideCompletionItems = function (model, position, context) {
        var languageId = this._getLanguageIdAtPosition(model, position);
        return this._snippets.getSnippets(languageId).then(function (snippets) {
            var suggestions;
            var shift = Math.max(0, position.column - 100);
            var pos = { lineNumber: position.lineNumber, column: Math.max(1, position.column - 100) };
            var lineOffsets = [];
            var linePrefixLow = model.getLineContent(position.lineNumber).substr(Math.max(0, position.column - 100), position.column - 1).toLowerCase();
            while (pos.column < position.column) {
                var word = model.getWordAtPosition(pos);
                if (word) {
                    // at a word
                    lineOffsets.push(word.startColumn - 1);
                    pos.column = word.endColumn + 1;
                    if (word.endColumn - 1 < linePrefixLow.length && !/\s/.test(linePrefixLow[word.endColumn - 1])) {
                        lineOffsets.push(word.endColumn - 1);
                    }
                }
                else if (!/\s/.test(linePrefixLow[pos.column - 1])) {
                    // at a none-whitespace character
                    lineOffsets.push(pos.column - 1);
                    pos.column += 1;
                }
                else {
                    // always advance!
                    pos.column += 1;
                }
            }
            if (lineOffsets.length === 0) {
                // no interesting spans found -> pick all snippets
                suggestions = snippets.map(function (snippet) { return new SnippetSuggestion(snippet, Range.fromPositions(position)); });
            }
            else {
                var consumed = new Set();
                suggestions = [];
                for (var _i = 0, lineOffsets_1 = lineOffsets; _i < lineOffsets_1.length; _i++) {
                    var start = lineOffsets_1[_i];
                    start -= shift;
                    for (var _a = 0, snippets_1 = snippets; _a < snippets_1.length; _a++) {
                        var snippet = snippets_1[_a];
                        if (!consumed.has(snippet) && matches(linePrefixLow, start, snippet.prefixLow, 0)) {
                            suggestions.push(new SnippetSuggestion(snippet, Range.fromPositions(position.delta(0, -(linePrefixLow.length - start)), position)));
                            consumed.add(snippet);
                        }
                    }
                }
            }
            // dismbiguate suggestions with same labels
            suggestions.sort(SnippetSuggestion.compareByLabel);
            for (var i = 0; i < suggestions.length; i++) {
                var item = suggestions[i];
                var to = i + 1;
                for (; to < suggestions.length && item.label === suggestions[to].label; to++) {
                    suggestions[to].label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[to].label, suggestions[to].snippet.name);
                }
                if (to > i + 1) {
                    suggestions[i].label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[i].label, suggestions[i].snippet.name);
                    i = to;
                }
            }
            return { suggestions: suggestions };
        });
    };
    SnippetSuggestProvider.prototype.resolveCompletionItem = function (model, position, item) {
        return (item instanceof SnippetSuggestion) ? item.resolve() : item;
    };
    SnippetSuggestProvider.prototype._getLanguageIdAtPosition = function (model, position) {
        // validate the `languageId` to ensure this is a user
        // facing language with a name and the chance to have
        // snippets, else fall back to the outer language
        model.tokenizeIfCheap(position.lineNumber);
        var languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column);
        var language = this._modeService.getLanguageIdentifier(languageId).language;
        if (!this._modeService.getLanguageName(language)) {
            languageId = model.getLanguageIdentifier().id;
        }
        return languageId;
    };
    SnippetSuggestProvider = __decorate([
        __param(0, IModeService),
        __param(1, ISnippetsService)
    ], SnippetSuggestProvider);
    return SnippetSuggestProvider;
}());
export { SnippetSuggestProvider };
function matches(pattern, patternStart, word, wordStart) {
    while (patternStart < pattern.length && wordStart < word.length) {
        if (pattern[patternStart] === word[wordStart]) {
            patternStart += 1;
        }
        wordStart += 1;
    }
    return patternStart === pattern.length;
}
export function getNonWhitespacePrefix(model, position) {
    /**
     * Do not analyze more characters
     */
    var MAX_PREFIX_LENGTH = 100;
    var line = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
    var minChIndex = Math.max(0, line.length - MAX_PREFIX_LENGTH);
    for (var chIndex = line.length - 1; chIndex >= minChIndex; chIndex--) {
        var ch = line.charAt(chIndex);
        if (/\s/.test(ch)) {
            return line.substr(chIndex + 1);
        }
    }
    if (minChIndex === 0) {
        return line;
    }
    return '';
}
