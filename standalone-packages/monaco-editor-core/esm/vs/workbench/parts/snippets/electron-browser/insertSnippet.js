/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import * as nls from '../../../../nls';
import { registerEditorAction, EditorAction } from '../../../../editor/browser/editorExtensions';
import { IModeService } from '../../../../editor/common/services/modeService';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands';
import { ISnippetsService } from './snippets.contribution';
import { SnippetController2 } from '../../../../editor/contrib/snippet/snippetController2';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys';
import { Snippet } from './snippetsFile';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput';
var Args = /** @class */ (function () {
    function Args(snippet, name, langId) {
        this.snippet = snippet;
        this.name = name;
        this.langId = langId;
    }
    Args.fromUser = function (arg) {
        if (!arg || typeof arg !== 'object') {
            return Args._empty;
        }
        var snippet = arg.snippet, name = arg.name, langId = arg.langId;
        if (typeof snippet !== 'string') {
            snippet = undefined;
        }
        if (typeof name !== 'string') {
            name = undefined;
        }
        if (typeof langId !== 'string') {
            langId = undefined;
        }
        return new Args(snippet, name, langId);
    };
    Args._empty = new Args(undefined, undefined, undefined);
    return Args;
}());
var InsertSnippetAction = /** @class */ (function (_super) {
    __extends(InsertSnippetAction, _super);
    function InsertSnippetAction() {
        return _super.call(this, {
            id: 'editor.action.insertSnippet',
            label: nls.localize('snippet.suggestions.label', "Insert Snippet"),
            alias: 'Insert Snippet',
            precondition: EditorContextKeys.writable
        }) || this;
    }
    InsertSnippetAction.prototype.run = function (accessor, editor, arg) {
        var _this = this;
        var modeService = accessor.get(IModeService);
        var snippetService = accessor.get(ISnippetsService);
        if (!editor.getModel()) {
            return undefined;
        }
        var quickInputService = accessor.get(IQuickInputService);
        var _a = editor.getPosition(), lineNumber = _a.lineNumber, column = _a.column;
        var _b = Args.fromUser(arg), snippet = _b.snippet, name = _b.name, langId = _b.langId;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var languageId, language, snippets, picks, prevSnippet, _i, snippets_1, snippet_1, pick, label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (snippet) {
                            return [2 /*return*/, resolve(new Snippet(undefined, undefined, undefined, undefined, snippet, undefined, 1 /* User */))];
                        }
                        if (langId) {
                            languageId = modeService.getLanguageIdentifier(langId).id;
                        }
                        else {
                            editor.getModel().tokenizeIfCheap(lineNumber);
                            languageId = editor.getModel().getLanguageIdAtPosition(lineNumber, column);
                            language = modeService.getLanguageIdentifier(languageId).language;
                            if (!modeService.getLanguageName(language)) {
                                languageId = editor.getModel().getLanguageIdentifier().id;
                            }
                        }
                        if (!name) return [3 /*break*/, 2];
                        return [4 /*yield*/, snippetService.getSnippets(languageId)];
                    case 1:
                        // take selected snippet
                        (_a.sent()).every(function (snippet) {
                            if (snippet.name !== name) {
                                return true;
                            }
                            resolve(snippet);
                            return false;
                        });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, snippetService.getSnippets(languageId)];
                    case 3:
                        snippets = (_a.sent()).sort(Snippet.compare);
                        picks = [];
                        prevSnippet = void 0;
                        for (_i = 0, snippets_1 = snippets; _i < snippets_1.length; _i++) {
                            snippet_1 = snippets_1[_i];
                            pick = {
                                label: snippet_1.prefix,
                                detail: snippet_1.description,
                                snippet: snippet_1
                            };
                            if (!prevSnippet || prevSnippet.snippetSource !== snippet_1.snippetSource) {
                                label = '';
                                switch (snippet_1.snippetSource) {
                                    case 1 /* User */:
                                        label = nls.localize('sep.userSnippet', "User Snippets");
                                        break;
                                    case 3 /* Extension */:
                                        label = nls.localize('sep.extSnippet', "Extension Snippets");
                                        break;
                                    case 2 /* Workspace */:
                                        label = nls.localize('sep.workspaceSnippet', "Workspace Snippets");
                                        break;
                                }
                                picks.push({ type: 'separator', label: label });
                            }
                            picks.push(pick);
                            prevSnippet = snippet_1;
                        }
                        return [2 /*return*/, quickInputService.pick(picks, { matchOnDetail: true }).then(function (pick) { return resolve(pick && pick.snippet); }, reject)];
                    case 4: return [2 /*return*/];
                }
            });
        }); }).then(function (snippet) {
            if (snippet) {
                SnippetController2.get(editor).insert(snippet.codeSnippet, 0, 0);
            }
        });
    };
    return InsertSnippetAction;
}(EditorAction));
registerEditorAction(InsertSnippetAction);
// compatibility command to make sure old keybinding are still working
CommandsRegistry.registerCommand('editor.action.showSnippets', function (accessor) {
    return accessor.get(ICommandService).executeCommand('editor.action.insertSnippet');
});
