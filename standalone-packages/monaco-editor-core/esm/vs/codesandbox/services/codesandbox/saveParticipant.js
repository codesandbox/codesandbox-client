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
import { sequence, IdleValue } from '../../../base/common/async';
import * as strings from '../../../base/common/strings';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation';
import { Range } from '../../../editor/common/core/range';
import { Selection } from '../../../editor/common/core/selection';
import { Position } from '../../../editor/common/core/position';
import { trimTrailingWhitespace } from '../../../editor/common/commands/trimTrailingWhitespaceCommand';
import { getDocumentFormattingEdits, NoProviderError, } from '../../../editor/contrib/format/format';
import { FormattingEdit } from '../../../editor/contrib/format/formattingEdit';
import { IConfigurationService } from '../../../platform/configuration/common/configuration';
import { TextFileEditorModel } from '../../../workbench/services/textfile/common/textFileEditorModel';
import { EditOperation } from '../../../editor/common/core/editOperation';
import { IEditorWorkerService } from '../../../editor/common/services/editorWorkerService';
import { IProgressService2, } from '../../../workbench/services/progress/common/progress';
import { localize } from '../../../nls';
import { isFalsyOrEmpty } from '../../../base/common/arrays';
import { ILogService } from '../../../platform/log/common/log';
import { SnippetController2 } from '../../../editor/contrib/snippet/snippetController2';
import { ICommandService } from '../../../platform/commands/common/commands';
import { CodeActionKind } from '../../../editor/contrib/codeAction/codeActionTrigger';
import { applyCodeAction } from '../../../editor/contrib/codeAction/codeActionCommands';
import { getCodeActions } from '../../../editor/contrib/codeAction/codeAction';
import { IBulkEditService } from '../../../editor/browser/services/bulkEditService';
import { CancellationTokenSource } from '../../../base/common/cancellation';
var TrimWhitespaceParticipant = /** @class */ (function () {
    function TrimWhitespaceParticipant(configurationService, codeEditorService) {
        this.configurationService = configurationService;
        this.codeEditorService = codeEditorService;
        // Nothing
    }
    TrimWhitespaceParticipant.prototype.participate = function (model, env) {
        if (this.configurationService.getValue('files.trimTrailingWhitespace', {
            overrideIdentifier: model.textEditorModel.getLanguageIdentifier()
                .language,
            resource: model.getResource(),
        })) {
            this.doTrimTrailingWhitespace(model.textEditorModel, env.reason === 2 /* AUTO */);
        }
    };
    TrimWhitespaceParticipant.prototype.doTrimTrailingWhitespace = function (model, isAutoSaved) {
        var prevSelection = [];
        var cursors = [];
        var editor = findEditor(model, this.codeEditorService);
        if (editor) {
            // Find `prevSelection` in any case do ensure a good undo stack when pushing the edit
            // Collect active cursors in `cursors` only if `isAutoSaved` to avoid having the cursors jump
            prevSelection = editor.getSelections();
            if (isAutoSaved) {
                cursors = prevSelection.map(function (s) { return s.getPosition(); });
                var snippetsRange = SnippetController2.get(editor).getSessionEnclosingRange();
                if (snippetsRange) {
                    for (var lineNumber = snippetsRange.startLineNumber; lineNumber <= snippetsRange.endLineNumber; lineNumber++) {
                        cursors.push(new Position(lineNumber, model.getLineMaxColumn(lineNumber)));
                    }
                }
            }
        }
        var ops = trimTrailingWhitespace(model, cursors);
        if (!ops.length) {
            return; // Nothing to do
        }
        model.pushEditOperations(prevSelection, ops, function (edits) { return prevSelection; });
    };
    TrimWhitespaceParticipant = __decorate([
        __param(0, IConfigurationService),
        __param(1, ICodeEditorService)
    ], TrimWhitespaceParticipant);
    return TrimWhitespaceParticipant;
}());
function findEditor(model, codeEditorService) {
    var candidate = null;
    if (model.isAttachedToEditor()) {
        for (var _i = 0, _a = codeEditorService.listCodeEditors(); _i < _a.length; _i++) {
            var editor = _a[_i];
            if (editor.getModel() === model) {
                if (editor.hasTextFocus()) {
                    return editor; // favour focused editor if there are multiple
                }
                candidate = editor;
            }
        }
    }
    return candidate;
}
var FinalNewLineParticipant = /** @class */ (function () {
    function FinalNewLineParticipant(configurationService, codeEditorService) {
        this.configurationService = configurationService;
        this.codeEditorService = codeEditorService;
        // Nothing
    }
    FinalNewLineParticipant.prototype.participate = function (model, env) {
        if (this.configurationService.getValue('files.insertFinalNewline', {
            overrideIdentifier: model.textEditorModel.getLanguageIdentifier()
                .language,
            resource: model.getResource(),
        })) {
            this.doInsertFinalNewLine(model.textEditorModel);
        }
    };
    FinalNewLineParticipant.prototype.doInsertFinalNewLine = function (model) {
        var lineCount = model.getLineCount();
        var lastLine = model.getLineContent(lineCount);
        var lastLineIsEmptyOrWhitespace = strings.lastNonWhitespaceIndex(lastLine) === -1;
        if (!lineCount || lastLineIsEmptyOrWhitespace) {
            return;
        }
        var prevSelection = [];
        var editor = findEditor(model, this.codeEditorService);
        if (editor) {
            prevSelection = editor.getSelections();
        }
        model.pushEditOperations(prevSelection, [
            EditOperation.insert(new Position(lineCount, model.getLineMaxColumn(lineCount)), model.getEOL()),
        ], function (edits) { return prevSelection; });
        if (editor) {
            editor.setSelections(prevSelection);
        }
    };
    FinalNewLineParticipant = __decorate([
        __param(0, IConfigurationService),
        __param(1, ICodeEditorService)
    ], FinalNewLineParticipant);
    return FinalNewLineParticipant;
}());
export { FinalNewLineParticipant };
var TrimFinalNewLinesParticipant = /** @class */ (function () {
    function TrimFinalNewLinesParticipant(configurationService, codeEditorService) {
        this.configurationService = configurationService;
        this.codeEditorService = codeEditorService;
        // Nothing
    }
    TrimFinalNewLinesParticipant.prototype.participate = function (model, env) {
        if (this.configurationService.getValue('files.trimFinalNewlines', {
            overrideIdentifier: model.textEditorModel.getLanguageIdentifier()
                .language,
            resource: model.getResource(),
        })) {
            this.doTrimFinalNewLines(model.textEditorModel, env.reason === 2 /* AUTO */);
        }
    };
    /**
       * returns 0 if the entire file is empty or whitespace only
       */
    TrimFinalNewLinesParticipant.prototype.findLastLineWithContent = function (model) {
        for (var lineNumber = model.getLineCount(); lineNumber >= 1; lineNumber--) {
            var lineContent = model.getLineContent(lineNumber);
            if (strings.lastNonWhitespaceIndex(lineContent) !== -1) {
                // this line has content
                return lineNumber;
            }
        }
        // no line has content
        return 0;
    };
    TrimFinalNewLinesParticipant.prototype.doTrimFinalNewLines = function (model, isAutoSaved) {
        var lineCount = model.getLineCount();
        // Do not insert new line if file does not end with new line
        if (lineCount === 1) {
            return;
        }
        var prevSelection = [];
        var cannotTouchLineNumber = 0;
        var editor = findEditor(model, this.codeEditorService);
        if (editor) {
            prevSelection = editor.getSelections();
            if (isAutoSaved) {
                for (var i = 0, len = prevSelection.length; i < len; i++) {
                    var positionLineNumber = prevSelection[i].positionLineNumber;
                    if (positionLineNumber > cannotTouchLineNumber) {
                        cannotTouchLineNumber = positionLineNumber;
                    }
                }
            }
        }
        var lastLineNumberWithContent = this.findLastLineWithContent(model);
        var deleteFromLineNumber = Math.max(lastLineNumberWithContent + 1, cannotTouchLineNumber + 1);
        var deletionRange = model.validateRange(new Range(deleteFromLineNumber, 1, lineCount, model.getLineMaxColumn(lineCount)));
        if (deletionRange.isEmpty()) {
            return;
        }
        model.pushEditOperations(prevSelection, [EditOperation.delete(deletionRange)], function (edits) { return prevSelection; });
        if (editor) {
            editor.setSelections(prevSelection);
        }
    };
    TrimFinalNewLinesParticipant = __decorate([
        __param(0, IConfigurationService),
        __param(1, ICodeEditorService)
    ], TrimFinalNewLinesParticipant);
    return TrimFinalNewLinesParticipant;
}());
export { TrimFinalNewLinesParticipant };
var FormatOnSaveParticipant = /** @class */ (function () {
    function FormatOnSaveParticipant(_editorService, _editorWorkerService, _configurationService) {
        this._editorService = _editorService;
        this._editorWorkerService = _editorWorkerService;
        this._configurationService = _configurationService;
        // Nothing
    }
    FormatOnSaveParticipant.prototype.participate = function (editorModel, env) {
        var _this = this;
        var model = editorModel.textEditorModel;
        if (env.reason === 2 /* AUTO */ ||
            !this._configurationService.getValue('editor.formatOnSave', {
                overrideIdentifier: model.getLanguageIdentifier().language,
                resource: editorModel.getResource(),
            })) {
            return undefined;
        }
        var versionNow = model.getVersionId();
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var timeout = this._configurationService.getValue('editor.formatOnSaveTimeout', {
            overrideIdentifier: model.getLanguageIdentifier().language,
            resource: editorModel.getResource(),
        });
        return new Promise(function (resolve, reject) {
            var source = new CancellationTokenSource();
            var request = getDocumentFormattingEdits(model, { tabSize: tabSize, insertSpaces: insertSpaces }, source.token);
            setTimeout(function () {
                reject(localize('timeout.formatOnSave', 'Aborted format on save after {0}ms', timeout));
                source.cancel();
            }, timeout);
            request
                .then(function (edits) {
                return _this._editorWorkerService.computeMoreMinimalEdits(model.uri, edits);
            })
                .then(resolve, function (err) {
                if (!(err instanceof Error) || err.name !== NoProviderError.Name) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }).then(function (edits) {
            if (!isFalsyOrEmpty(edits) && versionNow === model.getVersionId()) {
                var editor = findEditor(model, _this._editorService);
                if (editor) {
                    _this._editsWithEditor(editor, edits);
                }
                else {
                    _this._editWithModel(model, edits);
                }
            }
        });
    };
    FormatOnSaveParticipant.prototype._editsWithEditor = function (editor, edits) {
        FormattingEdit.execute(editor, edits);
    };
    FormatOnSaveParticipant.prototype._editWithModel = function (model, edits) {
        var range = edits[0].range;
        var initialSelection = new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
        model.pushEditOperations([initialSelection], edits.map(FormatOnSaveParticipant._asIdentEdit), function (undoEdits) {
            for (var _i = 0, undoEdits_1 = undoEdits; _i < undoEdits_1.length; _i++) {
                var range_1 = undoEdits_1[_i].range;
                if (Range.areIntersectingOrTouching(range_1, initialSelection)) {
                    return [
                        new Selection(range_1.startLineNumber, range_1.startColumn, range_1.endLineNumber, range_1.endColumn),
                    ];
                }
            }
            return undefined;
        });
    };
    FormatOnSaveParticipant._asIdentEdit = function (_a) {
        var text = _a.text, range = _a.range;
        return {
            text: text,
            range: Range.lift(range),
            forceMoveMarkers: true,
        };
    };
    FormatOnSaveParticipant = __decorate([
        __param(0, ICodeEditorService),
        __param(1, IEditorWorkerService),
        __param(2, IConfigurationService)
    ], FormatOnSaveParticipant);
    return FormatOnSaveParticipant;
}());
var CodeActionOnParticipant = /** @class */ (function () {
    function CodeActionOnParticipant(_bulkEditService, _commandService, _configurationService) {
        this._bulkEditService = _bulkEditService;
        this._commandService = _commandService;
        this._configurationService = _configurationService;
    }
    CodeActionOnParticipant.prototype.participate = function (editorModel, env) {
        return __awaiter(this, void 0, void 0, function () {
            var model, settingsOverrides, setting, codeActionsOnSave, timeout;
            var _this = this;
            return __generator(this, function (_a) {
                if (env.reason === 2 /* AUTO */) {
                    return [2 /*return*/, undefined];
                }
                model = editorModel.textEditorModel;
                settingsOverrides = {
                    overrideIdentifier: model.getLanguageIdentifier().language,
                    resource: editorModel.getResource(),
                };
                setting = this._configurationService.getValue('editor.codeActionsOnSave', settingsOverrides);
                if (!setting) {
                    return [2 /*return*/, undefined];
                }
                codeActionsOnSave = Object.keys(setting)
                    .filter(function (x) { return setting[x]; })
                    .map(function (x) { return new CodeActionKind(x); });
                if (!codeActionsOnSave.length) {
                    return [2 /*return*/, undefined];
                }
                timeout = this._configurationService.getValue('editor.codeActionsOnSaveTimeout', settingsOverrides);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            return reject(localize('codeActionsOnSave.didTimeout', 'Aborted codeActionsOnSave after {0}ms', timeout));
                        }, timeout);
                        _this.getActionsToRun(model, codeActionsOnSave).then(resolve);
                    }).then(function (actionsToRun) { return _this.applyCodeActions(actionsToRun); })];
            });
        });
    };
    CodeActionOnParticipant.prototype.applyCodeActions = function (actionsToRun) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, actionsToRun_1, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, actionsToRun_1 = actionsToRun;
                        _a.label = 1;
                    case 1:
                        if (!(_i < actionsToRun_1.length)) return [3 /*break*/, 4];
                        action = actionsToRun_1[_i];
                        return [4 /*yield*/, applyCodeAction(action, this._bulkEditService, this._commandService)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CodeActionOnParticipant.prototype.getActionsToRun = function (model, codeActionsOnSave) {
        return __awaiter(this, void 0, void 0, function () {
            var actions, actionsToRun;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCodeActions(model, model.getFullModelRange(), {
                            type: 'auto',
                            filter: { kind: CodeActionKind.Source, includeSourceActions: true },
                        })];
                    case 1:
                        actions = _a.sent();
                        actionsToRun = actions.filter(function (returnedAction) {
                            return returnedAction.kind &&
                                codeActionsOnSave.some(function (onSaveKind) {
                                    return onSaveKind.contains(returnedAction.kind);
                                });
                        });
                        return [2 /*return*/, actionsToRun];
                }
            });
        });
    };
    CodeActionOnParticipant = __decorate([
        __param(0, IBulkEditService),
        __param(1, ICommandService),
        __param(2, IConfigurationService)
    ], CodeActionOnParticipant);
    return CodeActionOnParticipant;
}());
// The save participant can change a model before its saved to support various scenarios like trimming trailing whitespace
var SaveParticipant = /** @class */ (function () {
    function SaveParticipant(instantiationService, _progressService, _logService) {
        this._progressService = _progressService;
        this._logService = _logService;
        this._saveParticipants = new IdleValue(function () { return [
            instantiationService.createInstance(TrimWhitespaceParticipant),
            instantiationService.createInstance(CodeActionOnParticipant),
            instantiationService.createInstance(FormatOnSaveParticipant),
            instantiationService.createInstance(FinalNewLineParticipant),
            instantiationService.createInstance(TrimFinalNewLinesParticipant),
        ]; });
        // Hook into model
        TextFileEditorModel.setSaveParticipant(this);
    }
    SaveParticipant.prototype.dispose = function () {
        TextFileEditorModel.setSaveParticipant(undefined);
        this._saveParticipants.dispose();
    };
    SaveParticipant.prototype.participate = function (model, env) {
        var _this = this;
        return this._progressService.withProgress({ location: 10 /* Window */ }, function (progress) {
            progress.report({
                message: localize('saveParticipants', 'Running Save Participants...'),
            });
            var promiseFactory = _this._saveParticipants
                .getValue()
                .map(function (p) { return function () {
                return Promise.resolve(p.participate(model, env));
            }; });
            return sequence(promiseFactory).then(function () { }, function (err) { return _this._logService.warn(err); });
        });
    };
    SaveParticipant = __decorate([
        __param(0, IInstantiationService),
        __param(1, IProgressService2),
        __param(2, ILogService)
    ], SaveParticipant);
    return SaveParticipant;
}());
export { SaveParticipant };
