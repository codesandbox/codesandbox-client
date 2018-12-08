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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
import * as nls from '../../../nls.js';
import { illegalArgument, onUnexpectedError } from '../../../base/common/errors.js';
import { RawContextKey, IContextKeyService, ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { IProgressService } from '../../../platform/progress/common/progress.js';
import { registerEditorAction, registerEditorContribution, EditorAction, EditorCommand, registerEditorCommand, registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import RenameInputField from './renameInputField.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { RenameProviderRegistry } from '../../common/modes.js';
import { Position } from '../../common/core/position.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { Range } from '../../common/core/range.js';
import { MessageController } from '../message/messageController.js';
import { EditorState } from '../../browser/core/editorState.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IBulkEditService } from '../../browser/services/bulkEditService.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
var RenameSkeleton = /** @class */ (function () {
    function RenameSkeleton(model, position) {
        this.model = model;
        this.position = position;
        this._provider = RenameProviderRegistry.ordered(model);
    }
    RenameSkeleton.prototype.hasProvider = function () {
        return this._provider.length > 0;
    };
    RenameSkeleton.prototype.resolveRenameLocation = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, res, word;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = this._provider[0];
                        if (!provider.resolveRenameLocation) return [3 /*break*/, 2];
                        return [4 /*yield*/, provider.resolveRenameLocation(this.model, this.position, token)];
                    case 1:
                        res = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!res) {
                            word = this.model.getWordAtPosition(this.position);
                            if (word) {
                                res = {
                                    range: new Range(this.position.lineNumber, word.startColumn, this.position.lineNumber, word.endColumn),
                                    text: word.word
                                };
                            }
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RenameSkeleton.prototype.provideRenameEdits = function (newName, i, rejects, token) {
        if (i === void 0) { i = 0; }
        if (rejects === void 0) { rejects = []; }
        return __awaiter(this, void 0, void 0, function () {
            var provider, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (i >= this._provider.length) {
                            return [2 /*return*/, {
                                    edits: undefined,
                                    rejectReason: rejects.join('\n')
                                }];
                        }
                        provider = this._provider[i];
                        return [4 /*yield*/, provider.provideRenameEdits(this.model, this.position, newName, token)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, this.provideRenameEdits(newName, i + 1, rejects.concat(nls.localize('no result', "No result.")), token)];
                        }
                        else if (result.rejectReason) {
                            return [2 /*return*/, this.provideRenameEdits(newName, i + 1, rejects.concat(result.rejectReason), token)];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return RenameSkeleton;
}());
export function rename(model, position, newName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new RenameSkeleton(model, position).provideRenameEdits(newName, undefined, undefined, CancellationToken.None)];
        });
    });
}
// ---  register actions and commands
var CONTEXT_RENAME_INPUT_VISIBLE = new RawContextKey('renameInputVisible', false);
var RenameController = /** @class */ (function () {
    function RenameController(editor, _notificationService, _bulkEditService, _progressService, contextKeyService, themeService) {
        this.editor = editor;
        this._notificationService = _notificationService;
        this._bulkEditService = _bulkEditService;
        this._progressService = _progressService;
        this._renameInputField = new RenameInputField(editor, themeService);
        this._renameInputVisible = CONTEXT_RENAME_INPUT_VISIBLE.bindTo(contextKeyService);
    }
    RenameController.get = function (editor) {
        return editor.getContribution(RenameController.ID);
    };
    RenameController.prototype.dispose = function () {
        this._renameInputField.dispose();
    };
    RenameController.prototype.getId = function () {
        return RenameController.ID;
    };
    RenameController.prototype.run = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var position, skeleton, loc, e_1, selection, selectionStart, selectionEnd;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.editor.hasModel()) {
                            return [2 /*return*/, undefined];
                        }
                        position = this.editor.getPosition();
                        skeleton = new RenameSkeleton(this.editor.getModel(), position);
                        if (!skeleton.hasProvider()) {
                            return [2 /*return*/, undefined];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, skeleton.resolveRenameLocation(token)];
                    case 2:
                        loc = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        MessageController.get(this.editor).showMessage(e_1 || nls.localize('resolveRenameLocationFailed', "An unknown error occurred while resolving rename location"), position);
                        return [2 /*return*/, undefined];
                    case 4:
                        if (!loc) {
                            return [2 /*return*/, undefined];
                        }
                        if (loc.rejectReason) {
                            MessageController.get(this.editor).showMessage(loc.rejectReason, position);
                            return [2 /*return*/, undefined];
                        }
                        selection = this.editor.getSelection();
                        selectionStart = 0;
                        selectionEnd = loc.text.length;
                        if (!Range.isEmpty(selection) && !Range.spansMultipleLines(selection) && Range.containsRange(loc.range, selection)) {
                            selectionStart = Math.max(0, selection.startColumn - loc.range.startColumn);
                            selectionEnd = Math.min(loc.range.endColumn, selection.endColumn) - loc.range.startColumn;
                        }
                        this._renameInputVisible.set(true);
                        return [2 /*return*/, this._renameInputField.getInput(loc.range, loc.text, selectionStart, selectionEnd).then(function (newNameOrFocusFlag) {
                                _this._renameInputVisible.reset();
                                if (typeof newNameOrFocusFlag === 'boolean') {
                                    if (newNameOrFocusFlag) {
                                        _this.editor.focus();
                                    }
                                    return undefined;
                                }
                                _this.editor.focus();
                                var state = new EditorState(_this.editor, 4 /* Position */ | 1 /* Value */ | 2 /* Selection */ | 8 /* Scroll */);
                                var renameOperation = Promise.resolve(skeleton.provideRenameEdits(newNameOrFocusFlag, 0, [], token).then(function (result) {
                                    if (!_this.editor.hasModel()) {
                                        return undefined;
                                    }
                                    if (result.rejectReason) {
                                        if (state.validate(_this.editor)) {
                                            MessageController.get(_this.editor).showMessage(result.rejectReason, _this.editor.getPosition());
                                        }
                                        else {
                                            _this._notificationService.info(result.rejectReason);
                                        }
                                        return undefined;
                                    }
                                    return _this._bulkEditService.apply(result, { editor: _this.editor }).then(function (result) {
                                        // alert
                                        if (result.ariaSummary) {
                                            alert(nls.localize('aria', "Successfully renamed '{0}' to '{1}'. Summary: {2}", loc.text, newNameOrFocusFlag, result.ariaSummary));
                                        }
                                    });
                                }, function (err) {
                                    _this._notificationService.error(nls.localize('rename.failed', "Rename failed to execute."));
                                    return Promise.reject(err);
                                }));
                                _this._progressService.showWhile(renameOperation, 250);
                                return renameOperation;
                            }, function (err) {
                                _this._renameInputVisible.reset();
                                return Promise.reject(err);
                            })];
                }
            });
        });
    };
    RenameController.prototype.acceptRenameInput = function () {
        this._renameInputField.acceptInput();
    };
    RenameController.prototype.cancelRenameInput = function () {
        this._renameInputField.cancelInput(true);
    };
    RenameController.ID = 'editor.contrib.renameController';
    RenameController = __decorate([
        __param(1, INotificationService),
        __param(2, IBulkEditService),
        __param(3, IProgressService),
        __param(4, IContextKeyService),
        __param(5, IThemeService)
    ], RenameController);
    return RenameController;
}());
// ---- action implementation
var RenameAction = /** @class */ (function (_super) {
    __extends(RenameAction, _super);
    function RenameAction() {
        return _super.call(this, {
            id: 'editor.action.rename',
            label: nls.localize('rename.label', "Rename Symbol"),
            alias: 'Rename Symbol',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasRenameProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 60 /* F2 */,
                weight: 100 /* EditorContrib */
            },
            menuOpts: {
                group: '1_modification',
                order: 1.1
            }
        }) || this;
    }
    RenameAction.prototype.runCommand = function (accessor, args) {
        var _this = this;
        var editorService = accessor.get(ICodeEditorService);
        var _a = args || [undefined, undefined], uri = _a[0], pos = _a[1];
        if (URI.isUri(uri) && Position.isIPosition(pos)) {
            return editorService.openCodeEditor({ resource: uri }, editorService.getActiveCodeEditor()).then(function (editor) {
                if (!editor) {
                    return;
                }
                editor.setPosition(pos);
                editor.invokeWithinContext(function (accessor) {
                    _this.reportTelemetry(accessor, editor);
                    return _this.run(accessor, editor);
                });
            }, onUnexpectedError);
        }
        return _super.prototype.runCommand.call(this, accessor, args);
    };
    RenameAction.prototype.run = function (accessor, editor) {
        var controller = RenameController.get(editor);
        if (controller) {
            return Promise.resolve(controller.run(CancellationToken.None));
        }
        return Promise.resolve();
    };
    return RenameAction;
}(EditorAction));
export { RenameAction };
registerEditorContribution(RenameController);
registerEditorAction(RenameAction);
var RenameCommand = EditorCommand.bindToContribution(RenameController.get);
registerEditorCommand(new RenameCommand({
    id: 'acceptRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: function (x) { return x.acceptRenameInput(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 3 /* Enter */
    }
}));
registerEditorCommand(new RenameCommand({
    id: 'cancelRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: function (x) { return x.cancelRenameInput(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
// ---- api bridge command
registerDefaultLanguageCommand('_executeDocumentRenameProvider', function (model, position, args) {
    var newName = args.newName;
    if (typeof newName !== 'string') {
        throw illegalArgument('newName');
    }
    return rename(model, position, newName);
});
