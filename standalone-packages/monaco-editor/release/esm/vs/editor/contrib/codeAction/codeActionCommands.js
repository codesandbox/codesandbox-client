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
import { dispose } from '../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { EditorAction, EditorCommand } from '../../browser/editorExtensions.js';
import { IBulkEditService } from '../../browser/services/bulkEditService.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { MessageController } from '../message/messageController.js';
import * as nls from '../../../nls.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IMarkerService } from '../../../platform/markers/common/markers.js';
import { IProgressService } from '../../../platform/progress/common/progress.js';
import { CodeActionModel, SUPPORTED_CODE_ACTIONS } from './codeActionModel.js';
import { CodeActionKind } from './codeActionTrigger.js';
import { CodeActionContextMenu } from './codeActionWidget.js';
import { LightBulbWidget } from './lightBulbWidget.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
function contextKeyForSupportedActions(kind) {
    return ContextKeyExpr.regex(SUPPORTED_CODE_ACTIONS.keys()[0], new RegExp('(\\s|^)' + escapeRegExpCharacters(kind.value) + '\\b'));
}
var QuickFixController = /** @class */ (function () {
    function QuickFixController(editor, markerService, contextKeyService, progressService, contextMenuService, _commandService, _keybindingService, _bulkEditService) {
        var _this = this;
        this._commandService = _commandService;
        this._keybindingService = _keybindingService;
        this._bulkEditService = _bulkEditService;
        this._disposables = [];
        this._editor = editor;
        this._model = new CodeActionModel(this._editor, markerService, contextKeyService, progressService);
        this._codeActionContextMenu = new CodeActionContextMenu(editor, contextMenuService, function (action) { return _this._onApplyCodeAction(action); });
        this._lightBulbWidget = new LightBulbWidget(editor);
        this._updateLightBulbTitle();
        this._disposables.push(this._codeActionContextMenu.onDidExecuteCodeAction(function (_) { return _this._model.trigger({ type: 'auto', filter: {} }); }), this._lightBulbWidget.onClick(this._handleLightBulbSelect, this), this._model.onDidChangeFixes(function (e) { return _this._onCodeActionsEvent(e); }), this._keybindingService.onDidUpdateKeybindings(this._updateLightBulbTitle, this));
    }
    QuickFixController.get = function (editor) {
        return editor.getContribution(QuickFixController.ID);
    };
    QuickFixController.prototype.dispose = function () {
        this._model.dispose();
        dispose(this._disposables);
    };
    QuickFixController.prototype._onCodeActionsEvent = function (e) {
        var _this = this;
        if (this._activeRequest) {
            this._activeRequest.cancel();
            this._activeRequest = undefined;
        }
        if (e && e.actions) {
            this._activeRequest = e.actions;
        }
        if (e && e.actions && e.trigger.filter && e.trigger.filter.kind) {
            // Triggered for specific scope
            // Apply if we only have one action or requested autoApply, otherwise show menu
            e.actions.then(function (fixes) {
                if (e.trigger.autoApply === 2 /* First */ || (e.trigger.autoApply === 1 /* IfSingle */ && fixes.length === 1)) {
                    _this._onApplyCodeAction(fixes[0]);
                }
                else {
                    _this._codeActionContextMenu.show(e.actions, e.position);
                }
            }).catch(onUnexpectedError);
            return;
        }
        if (e && e.trigger.type === 'manual') {
            this._codeActionContextMenu.show(e.actions, e.position);
        }
        else if (e && e.actions) {
            // auto magically triggered
            // * update an existing list of code actions
            // * manage light bulb
            if (this._codeActionContextMenu.isVisible) {
                this._codeActionContextMenu.show(e.actions, e.position);
            }
            else {
                this._lightBulbWidget.model = e;
            }
        }
        else {
            this._lightBulbWidget.hide();
        }
    };
    QuickFixController.prototype.getId = function () {
        return QuickFixController.ID;
    };
    QuickFixController.prototype._handleLightBulbSelect = function (coords) {
        if (this._lightBulbWidget.model && this._lightBulbWidget.model.actions) {
            this._codeActionContextMenu.show(this._lightBulbWidget.model.actions, coords);
        }
    };
    QuickFixController.prototype.triggerFromEditorSelection = function (filter, autoApply) {
        return this._model.trigger({ type: 'manual', filter: filter, autoApply: autoApply });
    };
    QuickFixController.prototype._updateLightBulbTitle = function () {
        var kb = this._keybindingService.lookupKeybinding(QuickFixAction.Id);
        var title;
        if (kb) {
            title = nls.localize('quickFixWithKb', "Show Fixes ({0})", kb.getLabel());
        }
        else {
            title = nls.localize('quickFix', "Show Fixes");
        }
        this._lightBulbWidget.title = title;
    };
    QuickFixController.prototype._onApplyCodeAction = function (action) {
        return applyCodeAction(action, this._bulkEditService, this._commandService, this._editor);
    };
    QuickFixController.ID = 'editor.contrib.quickFixController';
    QuickFixController = __decorate([
        __param(1, IMarkerService),
        __param(2, IContextKeyService),
        __param(3, IProgressService),
        __param(4, IContextMenuService),
        __param(5, ICommandService),
        __param(6, IKeybindingService),
        __param(7, IBulkEditService)
    ], QuickFixController);
    return QuickFixController;
}());
export { QuickFixController };
export function applyCodeAction(action, bulkEditService, commandService, editor) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!action.edit) return [3 /*break*/, 2];
                    return [4 /*yield*/, bulkEditService.apply(action.edit, { editor: editor })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!action.command) return [3 /*break*/, 4];
                    return [4 /*yield*/, commandService.executeCommand.apply(commandService, [action.command.id].concat(action.command.arguments))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function showCodeActionsForEditorSelection(editor, notAvailableMessage, filter, autoApply) {
    var controller = QuickFixController.get(editor);
    if (!controller) {
        return;
    }
    var pos = editor.getPosition();
    controller.triggerFromEditorSelection(filter, autoApply).then(function (codeActions) {
        if (!codeActions || !codeActions.length) {
            MessageController.get(editor).showMessage(notAvailableMessage, pos);
        }
    });
}
var QuickFixAction = /** @class */ (function (_super) {
    __extends(QuickFixAction, _super);
    function QuickFixAction() {
        return _super.call(this, {
            id: QuickFixAction.Id,
            label: nls.localize('quickfix.trigger.label', "Quick Fix..."),
            alias: 'Quick Fix',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 84 /* US_DOT */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    QuickFixAction.prototype.run = function (_accessor, editor) {
        return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"));
    };
    QuickFixAction.Id = 'editor.action.quickFix';
    return QuickFixAction;
}(EditorAction));
export { QuickFixAction };
var CodeActionCommandArgs = /** @class */ (function () {
    function CodeActionCommandArgs(kind, apply) {
        this.kind = kind;
        this.apply = apply;
    }
    CodeActionCommandArgs.fromUser = function (arg) {
        if (!arg || typeof arg !== 'object') {
            return new CodeActionCommandArgs(CodeActionKind.Empty, 1 /* IfSingle */);
        }
        return new CodeActionCommandArgs(CodeActionCommandArgs.getKindFromUser(arg), CodeActionCommandArgs.getApplyFromUser(arg));
    };
    CodeActionCommandArgs.getApplyFromUser = function (arg) {
        switch (typeof arg.apply === 'string' ? arg.apply.toLowerCase() : '') {
            case 'first':
                return 2 /* First */;
            case 'never':
                return 3 /* Never */;
            case 'ifsingle':
            default:
                return 1 /* IfSingle */;
        }
    };
    CodeActionCommandArgs.getKindFromUser = function (arg) {
        return typeof arg.kind === 'string'
            ? new CodeActionKind(arg.kind)
            : CodeActionKind.Empty;
    };
    return CodeActionCommandArgs;
}());
var CodeActionCommand = /** @class */ (function (_super) {
    __extends(CodeActionCommand, _super);
    function CodeActionCommand() {
        return _super.call(this, {
            id: CodeActionCommand.Id,
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider)
        }) || this;
    }
    CodeActionCommand.prototype.runEditorCommand = function (_accessor, editor, userArg) {
        var args = CodeActionCommandArgs.fromUser(userArg);
        return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"), { kind: args.kind, includeSourceActions: true }, args.apply);
    };
    CodeActionCommand.Id = 'editor.action.codeAction';
    return CodeActionCommand;
}(EditorCommand));
export { CodeActionCommand };
var RefactorAction = /** @class */ (function (_super) {
    __extends(RefactorAction, _super);
    function RefactorAction() {
        return _super.call(this, {
            id: RefactorAction.Id,
            label: nls.localize('refactor.label', "Refactor..."),
            alias: 'Refactor',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 48 /* KEY_R */,
                mac: {
                    primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 48 /* KEY_R */
                },
                weight: 100 /* EditorContrib */
            },
            menuOpts: {
                group: '1_modification',
                order: 2,
                when: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.Refactor)),
            }
        }) || this;
    }
    RefactorAction.prototype.run = function (_accessor, editor) {
        return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.refactor.noneMessage', "No refactorings available"), { kind: CodeActionKind.Refactor }, 3 /* Never */);
    };
    RefactorAction.Id = 'editor.action.refactor';
    return RefactorAction;
}(EditorAction));
export { RefactorAction };
var SourceAction = /** @class */ (function (_super) {
    __extends(SourceAction, _super);
    function SourceAction() {
        return _super.call(this, {
            id: SourceAction.Id,
            label: nls.localize('source.label', "Source Action..."),
            alias: 'Source Action',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
            menuOpts: {
                group: '1_modification',
                order: 2.1,
                when: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.Source)),
            }
        }) || this;
    }
    SourceAction.prototype.run = function (_accessor, editor) {
        return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.source.noneMessage', "No source actions available"), { kind: CodeActionKind.Source, includeSourceActions: true }, 3 /* Never */);
    };
    SourceAction.Id = 'editor.action.sourceAction';
    return SourceAction;
}(EditorAction));
export { SourceAction };
var OrganizeImportsAction = /** @class */ (function (_super) {
    __extends(OrganizeImportsAction, _super);
    function OrganizeImportsAction() {
        return _super.call(this, {
            id: OrganizeImportsAction.Id,
            label: nls.localize('organizeImports.label', "Organize Imports"),
            alias: 'Organize Imports',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, contextKeyForSupportedActions(CodeActionKind.SourceOrganizeImports)),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 45 /* KEY_O */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    OrganizeImportsAction.prototype.run = function (_accessor, editor) {
        return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.organize.noneMessage', "No organize imports action available"), { kind: CodeActionKind.SourceOrganizeImports, includeSourceActions: true }, 1 /* IfSingle */);
    };
    OrganizeImportsAction.Id = 'editor.action.organizeImports';
    return OrganizeImportsAction;
}(EditorAction));
export { OrganizeImportsAction };
