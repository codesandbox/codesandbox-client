/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import * as nls from '../../../../nls.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { join, basename, dirname, extname } from '../../../../../path.js';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { timeout } from '../../../../base/common/async.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { ISnippetsService } from './snippets.contribution.js';
import { values } from '../../../../base/common/map.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IFileService } from '../../../../platform/files/common/files.js';
var id = 'workbench.action.openSnippets';
var ISnippetPick;
(function (ISnippetPick) {
    function is(thing) {
        return thing && typeof thing.filepath === 'string';
    }
    ISnippetPick.is = is;
})(ISnippetPick || (ISnippetPick = {}));
function computePicks(snippetService, envService, modeService) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, future, seen, _i, _a, file, names, _b, _c, snippet, _d, _e, scope, name_1, mode, dir, _f, _g, mode, label;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    existing = [];
                    future = [];
                    seen = new Set();
                    _i = 0;
                    return [4 /*yield*/, snippetService.getSnippetFiles()];
                case 1:
                    _a = _h.sent();
                    _h.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    file = _a[_i];
                    if (file.source === 3 /* Extension */) {
                        // skip extension snippets
                        return [3 /*break*/, 5];
                    }
                    if (!file.isGlobalSnippets) return [3 /*break*/, 4];
                    return [4 /*yield*/, file.load()];
                case 3:
                    _h.sent();
                    names = new Set();
                    outer: for (_b = 0, _c = file.data; _b < _c.length; _b++) {
                        snippet = _c[_b];
                        for (_d = 0, _e = snippet.scopes; _d < _e.length; _d++) {
                            scope = _e[_d];
                            name_1 = modeService.getLanguageName(scope);
                            if (names.size >= 4) {
                                names.add(name_1 + "...");
                                break outer;
                            }
                            else {
                                names.add(name_1);
                            }
                        }
                    }
                    existing.push({
                        label: basename(file.location.fsPath),
                        filepath: file.location.fsPath,
                        description: names.size === 0
                            ? nls.localize('global.scope', "(global)")
                            : nls.localize('global.1', "({0})", values(names).join(', '))
                    });
                    return [3 /*break*/, 5];
                case 4:
                    mode = basename(file.location.fsPath, '.json');
                    existing.push({
                        label: basename(file.location.fsPath),
                        description: "(" + modeService.getLanguageName(mode) + ")",
                        filepath: file.location.fsPath
                    });
                    seen.add(mode);
                    _h.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    dir = join(envService.appSettingsHome, 'snippets');
                    for (_f = 0, _g = modeService.getRegisteredModes(); _f < _g.length; _f++) {
                        mode = _g[_f];
                        label = modeService.getLanguageName(mode);
                        if (label && !seen.has(mode)) {
                            future.push({
                                label: mode,
                                description: "(" + label + ")",
                                filepath: join(dir, mode + ".json"),
                                hint: true
                            });
                        }
                    }
                    existing.sort(function (a, b) {
                        var a_ext = extname(a.filepath);
                        var b_ext = extname(b.filepath);
                        if (a_ext === b_ext) {
                            return a.label.localeCompare(b.label);
                        }
                        else if (a_ext === '.code-snippets') {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    });
                    future.sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
                    return [2 /*return*/, { existing: existing, future: future }];
            }
        });
    });
}
function createGlobalSnippetFile(defaultPath, windowService, fileService, opener) {
    return __awaiter(this, void 0, void 0, function () {
        var path, resource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fileService.createFolder(defaultPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, timeout(100)];
                case 2:
                    _a.sent(); // ensure quick pick closes...
                    return [4 /*yield*/, windowService.showSaveDialog({
                            defaultPath: defaultPath.fsPath,
                            filters: [{ name: 'Code Snippets', extensions: ['code-snippets'] }]
                        })];
                case 3:
                    path = _a.sent();
                    if (!path) {
                        return [2 /*return*/, undefined];
                    }
                    resource = URI.file(path);
                    if (dirname(resource.fsPath) !== defaultPath.fsPath) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, fileService.updateContent(resource, [
                            '{',
                            '\t// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and ',
                            '\t// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope ',
                            '\t// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is ',
                            '\t// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: ',
                            '\t// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. ',
                            '\t// Placeholders with the same ids are connected.',
                            '\t// Example:',
                            '\t// "Print to console": {',
                            '\t// \t"scope": "javascript,typescript",',
                            '\t// \t"prefix": "log",',
                            '\t// \t"body": [',
                            '\t// \t\t"console.log(\'$1\');",',
                            '\t// \t\t"$2"',
                            '\t// \t],',
                            '\t// \t"description": "Log output to console"',
                            '\t// }',
                            '}'
                        ].join('\n'))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, opener.open(resource)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createLanguageSnippetFile(pick, fileService) {
    return __awaiter(this, void 0, void 0, function () {
        var contents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fileService.existsFile(URI.file(pick.filepath))];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    contents = [
                        '{',
                        '\t// Place your snippets for ' + pick.label + ' here. Each snippet is defined under a snippet name and has a prefix, body and ',
                        '\t// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:',
                        '\t// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the ',
                        '\t// same ids are connected.',
                        '\t// Example:',
                        '\t// "Print to console": {',
                        '\t// \t"prefix": "log",',
                        '\t// \t"body": [',
                        '\t// \t\t"console.log(\'$1\');",',
                        '\t// \t\t"$2"',
                        '\t// \t],',
                        '\t// \t"description": "Log output to console"',
                        '\t// }',
                        '}'
                    ].join('\n');
                    return [4 /*yield*/, fileService.updateContent(URI.file(pick.filepath), contents)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
CommandsRegistry.registerCommand(id, function (accessor) { return __awaiter(_this, void 0, void 0, function () {
    var snippetService, quickInputService, opener, windowService, modeService, envService, workspaceService, fileService, picks, existing, globalSnippetPicks, _i, _a, folder, pick;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                snippetService = accessor.get(ISnippetsService);
                quickInputService = accessor.get(IQuickInputService);
                opener = accessor.get(IOpenerService);
                windowService = accessor.get(IWindowService);
                modeService = accessor.get(IModeService);
                envService = accessor.get(IEnvironmentService);
                workspaceService = accessor.get(IWorkspaceContextService);
                fileService = accessor.get(IFileService);
                return [4 /*yield*/, computePicks(snippetService, envService, modeService)];
            case 1:
                picks = _b.sent();
                existing = picks.existing;
                globalSnippetPicks = [{
                        label: nls.localize('new.global', "New Global Snippets file..."),
                        uri: URI.file(join(envService.appSettingsHome, 'snippets'))
                    }];
                for (_i = 0, _a = workspaceService.getWorkspace().folders; _i < _a.length; _i++) {
                    folder = _a[_i];
                    globalSnippetPicks.push({
                        label: nls.localize('new.folder', "New Snippets file for '{0}'...", folder.name),
                        uri: folder.toResource('.vscode')
                    });
                }
                if (existing.length > 0) {
                    existing.unshift({ type: 'separator', label: nls.localize('group.global', "Existing Snippets") });
                    existing.push({ type: 'separator', label: nls.localize('new.global.sep', "New Snippets") });
                }
                else {
                    existing.push({ type: 'separator', label: nls.localize('new.global.sep', "New Snippets") });
                }
                return [4 /*yield*/, quickInputService.pick([].concat(existing, globalSnippetPicks, picks.future), {
                        placeHolder: nls.localize('openSnippet.pickLanguage', "Select Snippets File or Create Snippets"),
                        matchOnDescription: true,
                    })];
            case 2:
                pick = _b.sent();
                if (!(globalSnippetPicks.indexOf(pick) >= 0)) return [3 /*break*/, 3];
                return [2 /*return*/, createGlobalSnippetFile(pick.uri, windowService, fileService, opener)];
            case 3:
                if (!ISnippetPick.is(pick)) return [3 /*break*/, 6];
                if (!pick.hint) return [3 /*break*/, 5];
                return [4 /*yield*/, createLanguageSnippetFile(pick, fileService)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2 /*return*/, opener.open(URI.file(pick.filepath))];
            case 6: return [2 /*return*/];
        }
    });
}); });
MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
    command: {
        id: id,
        title: { value: nls.localize('openSnippet.label', "Configure User Snippets"), original: 'Preferences: Configure User Snippets' },
        category: nls.localize('preferences', "Preferences")
    }
});
MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
    group: '3_snippets',
    command: {
        id: id,
        title: nls.localize({ key: 'miOpenSnippets', comment: ['&& denotes a mnemonic'] }, "User &&Snippets")
    },
    order: 1
});
