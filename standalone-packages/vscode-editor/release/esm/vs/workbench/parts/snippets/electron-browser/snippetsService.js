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
import { basename, extname, join } from '../../../../../path.js';
import { isFalsyOrEmpty } from '../../../../base/common/arrays.js';
import { combinedDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { values } from '../../../../base/common/map.js';
import * as resources from '../../../../base/common/resources.js';
import { endsWith, isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { setSnippetSuggestSupport } from '../../../../editor/contrib/suggest/suggest.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ISnippetsService } from './snippets.contribution.js';
import { SnippetFile } from './snippetsFile.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { languagesExtPoint } from '../../../services/mode/common/workbenchModeService.js';
import { SnippetCompletionProvider } from './snippetCompletionProvider.js';
var snippetExt;
(function (snippetExt) {
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
    snippetExt.toValidSnippet = toValidSnippet;
    snippetExt.snippetsContribution = {
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
    snippetExt.point = ExtensionsRegistry.registerExtensionPoint('snippets', [languagesExtPoint], snippetExt.snippetsContribution);
})(snippetExt || (snippetExt = {}));
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
        setSnippetSuggestSupport(new SnippetCompletionProvider(this._modeService, this));
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
        snippetExt.point.setHandler(function (extensions) {
            var _loop_1 = function (extension) {
                var _loop_2 = function (contribution) {
                    var validContribution = snippetExt.toValidSnippet(extension, contribution, _this._modeService);
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
        var disposables = [];
        var addFolderSnippets = function () {
            disposables = dispose(disposables);
            return _this._fileService.resolveFile(folder).then(function (stat) {
                if (!isFalsyOrEmpty(stat.children)) {
                    for (var _i = 0, _a = stat.children; _i < _a.length; _i++) {
                        var entry = _a[_i];
                        disposables.push(_this._addSnippetFile(entry.resource, source));
                    }
                }
            }, function (err) {
                _this._logService.error("Failed snippets from folder '" + folder.toString() + "'", err);
            });
        };
        bucket.push(watch(this._fileService, folder, addFolderSnippets));
        bucket.push(combinedDisposable(disposables));
        return addFolderSnippets();
    };
    SnippetsService.prototype._addSnippetFile = function (uri, source) {
        var _this = this;
        var ext = extname(uri.path);
        var key = uri.toString();
        if (source === 1 /* User */ && ext === '.json') {
            var langName = basename(uri.path, '.json');
            this._files.set(key, new SnippetFile(source, uri, [langName], undefined, this._fileService));
        }
        else if (ext === '.code-snippets') {
            this._files.set(key, new SnippetFile(source, uri, undefined, undefined, this._fileService));
        }
        return {
            dispose: function () { return _this._files.delete(key); }
        };
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
