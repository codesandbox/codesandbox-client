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
import { mergeSort } from '../../../../base/common/arrays.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IBulkEditService } from '../../../../editor/browser/services/bulkEditService.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { isResourceFileEdit, isResourceTextEdit } from '../../../../editor/common/modes.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { emptyProgressRunner } from '../../../../platform/progress/common/progress.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
var Recording = /** @class */ (function () {
    function Recording() {
    }
    Recording.start = function (fileService) {
        var _changes = new Set();
        var subscription = fileService.onAfterOperation(function (e) {
            _changes.add(e.resource.toString());
        });
        return {
            stop: function () { return subscription.dispose(); },
            hasChanged: function (resource) { return _changes.has(resource.toString()); }
        };
    };
    return Recording;
}());
var ModelEditTask = /** @class */ (function () {
    function ModelEditTask(_modelReference) {
        this._modelReference = _modelReference;
        this._model = this._modelReference.object.textEditorModel;
        this._edits = [];
    }
    ModelEditTask.prototype.dispose = function () {
        dispose(this._modelReference);
    };
    ModelEditTask.prototype.addEdit = function (resourceEdit) {
        this._expectedModelVersionId = resourceEdit.modelVersionId;
        for (var _i = 0, _a = resourceEdit.edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (typeof edit.eol === 'number') {
                // honor eol-change
                this._newEol = edit.eol;
            }
            if (edit.range || edit.text) {
                // create edit operation
                var range = void 0;
                if (!edit.range) {
                    range = this._model.getFullModelRange();
                }
                else {
                    range = Range.lift(edit.range);
                }
                this._edits.push(EditOperation.replaceMove(range, edit.text));
            }
        }
    };
    ModelEditTask.prototype.validate = function () {
        if (typeof this._expectedModelVersionId === 'undefined' || this._model.getVersionId() === this._expectedModelVersionId) {
            return { canApply: true };
        }
        return { canApply: false, reason: this._model.uri };
    };
    ModelEditTask.prototype.apply = function () {
        if (this._edits.length > 0) {
            this._edits = mergeSort(this._edits, function (a, b) { return Range.compareRangesUsingStarts(a.range, b.range); });
            this._model.pushStackElement();
            this._model.pushEditOperations([], this._edits, function () { return []; });
            this._model.pushStackElement();
        }
        if (this._newEol !== undefined) {
            this._model.pushStackElement();
            this._model.pushEOL(this._newEol);
            this._model.pushStackElement();
        }
    };
    return ModelEditTask;
}());
var EditorEditTask = /** @class */ (function (_super) {
    __extends(EditorEditTask, _super);
    function EditorEditTask(modelReference, editor) {
        var _this = _super.call(this, modelReference) || this;
        _this._editor = editor;
        return _this;
    }
    EditorEditTask.prototype.apply = function () {
        if (this._edits.length > 0) {
            this._edits = mergeSort(this._edits, function (a, b) { return Range.compareRangesUsingStarts(a.range, b.range); });
            this._editor.pushUndoStop();
            this._editor.executeEdits('', this._edits);
            this._editor.pushUndoStop();
        }
        if (this._newEol !== undefined) {
            this._editor.pushUndoStop();
            this._editor.getModel().pushEOL(this._newEol);
            this._editor.pushUndoStop();
        }
    };
    return EditorEditTask;
}(ModelEditTask));
var BulkEditModel = /** @class */ (function () {
    function BulkEditModel(textModelResolverService, editor, edits, progress) {
        this._edits = new Map();
        this._textModelResolverService = textModelResolverService;
        this._editor = editor;
        this._progress = progress;
        edits.forEach(this.addEdit, this);
    }
    BulkEditModel.prototype.dispose = function () {
        this._tasks = dispose(this._tasks);
    };
    BulkEditModel.prototype.addEdit = function (edit) {
        var array = this._edits.get(edit.resource.toString());
        if (!array) {
            array = [];
            this._edits.set(edit.resource.toString(), array);
        }
        array.push(edit);
    };
    BulkEditModel.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._tasks) {
                            throw new Error('illegal state - already prepared');
                        }
                        this._tasks = [];
                        promises = [];
                        this._edits.forEach(function (value, key) {
                            var promise = _this._textModelResolverService.createModelReference(URI.parse(key)).then(function (ref) {
                                var model = ref.object;
                                if (!model || !model.textEditorModel) {
                                    throw new Error("Cannot load file " + key);
                                }
                                var task;
                                if (_this._editor && _this._editor.getModel().uri.toString() === model.textEditorModel.uri.toString()) {
                                    task = new EditorEditTask(ref, _this._editor);
                                }
                                else {
                                    task = new ModelEditTask(ref);
                                }
                                value.forEach(function (edit) { return task.addEdit(edit); });
                                _this._tasks.push(task);
                                _this._progress.report(undefined);
                            });
                            promises.push(promise);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    BulkEditModel.prototype.validate = function () {
        for (var _i = 0, _a = this._tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            var result = task.validate();
            if (!result.canApply) {
                return result;
            }
        }
        return { canApply: true };
    };
    BulkEditModel.prototype.apply = function () {
        for (var _i = 0, _a = this._tasks; _i < _a.length; _i++) {
            var task = _a[_i];
            task.apply();
            this._progress.report(undefined);
        }
    };
    return BulkEditModel;
}());
var BulkEdit = /** @class */ (function () {
    function BulkEdit(editor, progress, _logService, _textModelService, _fileService, _textFileService, _uriLabelServie, _configurationService) {
        this._logService = _logService;
        this._textModelService = _textModelService;
        this._fileService = _fileService;
        this._textFileService = _textFileService;
        this._uriLabelServie = _uriLabelServie;
        this._configurationService = _configurationService;
        this._edits = [];
        this._editor = editor;
        this._progress = progress || emptyProgressRunner;
    }
    BulkEdit.prototype.add = function (edits) {
        var _a;
        if (Array.isArray(edits)) {
            (_a = this._edits).push.apply(_a, edits);
        }
        else {
            this._edits.push(edits);
        }
    };
    BulkEdit.prototype.ariaMessage = function () {
        var editCount = this._edits.reduce(function (prev, cur) { return isResourceFileEdit(cur) ? prev : prev + cur.edits.length; }, 0);
        var resourceCount = this._edits.length;
        if (editCount === 0) {
            return localize('summary.0', "Made no edits");
        }
        else if (editCount > 1 && resourceCount > 1) {
            return localize('summary.nm', "Made {0} text edits in {1} files", editCount, resourceCount);
        }
        else {
            return localize('summary.n0', "Made {0} text edits in one file", editCount, resourceCount);
        }
    };
    BulkEdit.prototype.perform = function () {
        return __awaiter(this, void 0, void 0, function () {
            var seen, total, groups, group, _i, _a, edit, progress, _b, groups_1, group_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        seen = new Set();
                        total = 0;
                        groups = [];
                        for (_i = 0, _a = this._edits; _i < _a.length; _i++) {
                            edit = _a[_i];
                            if (!group
                                || (isResourceFileEdit(group[0]) && !isResourceFileEdit(edit))
                                || (isResourceTextEdit(group[0]) && !isResourceTextEdit(edit))) {
                                group = [];
                                groups.push(group);
                            }
                            group.push(edit);
                            if (isResourceFileEdit(edit)) {
                                total += 1;
                            }
                            else if (!seen.has(edit.resource.toString())) {
                                seen.add(edit.resource.toString());
                                total += 2;
                            }
                        }
                        // define total work and progress callback
                        // for child operations
                        this._progress.total(total);
                        progress = { report: function (_) { return _this._progress.worked(1); } };
                        _b = 0, groups_1 = groups;
                        _c.label = 1;
                    case 1:
                        if (!(_b < groups_1.length)) return [3 /*break*/, 6];
                        group_1 = groups_1[_b];
                        if (!isResourceFileEdit(group_1[0])) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._performFileEdits(group_1, progress)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this._performTextEdits(group_1, progress)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _b++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BulkEdit.prototype._performFileEdits = function (edits, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, edits_1, edit, options, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this._logService.debug('_performFileEdits', JSON.stringify(edits));
                        _i = 0, edits_1 = edits;
                        _d.label = 1;
                    case 1:
                        if (!(_i < edits_1.length)) return [3 /*break*/, 15];
                        edit = edits_1[_i];
                        progress.report(undefined);
                        options = edit.options || {};
                        if (!(edit.newUri && edit.oldUri)) return [3 /*break*/, 5];
                        _a = options.overwrite === undefined && options.ignoreIfExists;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._fileService.existsFile(edit.newUri)];
                    case 2:
                        _a = (_d.sent());
                        _d.label = 3;
                    case 3:
                        // rename
                        if (_a) {
                            return [3 /*break*/, 14]; // not overwriting, but ignoring, and the target file exists
                        }
                        return [4 /*yield*/, this._textFileService.move(edit.oldUri, edit.newUri, options.overwrite)];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 14];
                    case 5:
                        if (!(!edit.newUri && edit.oldUri)) return [3 /*break*/, 10];
                        _b = !options.ignoreIfNotExists;
                        if (_b) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._fileService.existsFile(edit.oldUri)];
                    case 6:
                        _b = (_d.sent());
                        _d.label = 7;
                    case 7:
                        if (!_b) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._textFileService.delete(edit.oldUri, { useTrash: this._configurationService.getValue('files.enableTrash'), recursive: options.recursive })];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 14];
                    case 10:
                        if (!(edit.newUri && !edit.oldUri)) return [3 /*break*/, 14];
                        _c = options.overwrite === undefined && options.ignoreIfExists;
                        if (!_c) return [3 /*break*/, 12];
                        return [4 /*yield*/, this._fileService.existsFile(edit.newUri)];
                    case 11:
                        _c = (_d.sent());
                        _d.label = 12;
                    case 12:
                        // create file
                        if (_c) {
                            return [3 /*break*/, 14]; // not overwriting, but ignoring, and the target file exists
                        }
                        return [4 /*yield*/, this._textFileService.create(edit.newUri, undefined, { overwrite: options.overwrite })];
                    case 13:
                        _d.sent();
                        _d.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    BulkEdit.prototype._performTextEdits = function (edits, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var recording, model, conflicts, validationResult;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logService.debug('_performTextEdits', JSON.stringify(edits));
                        recording = Recording.start(this._fileService);
                        model = new BulkEditModel(this._textModelService, this._editor, edits, progress);
                        return [4 /*yield*/, model.prepare()];
                    case 1:
                        _a.sent();
                        conflicts = edits
                            .filter(function (edit) { return recording.hasChanged(edit.resource); })
                            .map(function (edit) { return _this._uriLabelServie.getUriLabel(edit.resource, { relative: true }); });
                        recording.stop();
                        if (conflicts.length > 0) {
                            model.dispose();
                            throw new Error(localize('conflict', "These files have changed in the meantime: {0}", conflicts.join(', ')));
                        }
                        validationResult = model.validate();
                        if (validationResult.canApply === false) {
                            throw new Error(validationResult.reason.toString() + " has changed in the meantime");
                        }
                        return [4 /*yield*/, model.apply()];
                    case 2:
                        _a.sent();
                        model.dispose();
                        return [2 /*return*/];
                }
            });
        });
    };
    BulkEdit = __decorate([
        __param(2, ILogService),
        __param(3, ITextModelService),
        __param(4, IFileService),
        __param(5, ITextFileService),
        __param(6, ILabelService),
        __param(7, IConfigurationService)
    ], BulkEdit);
    return BulkEdit;
}());
export { BulkEdit };
var BulkEditService = /** @class */ (function () {
    function BulkEditService(_logService, _modelService, _editorService, _textModelService, _fileService, _textFileService, _labelService, _configurationService) {
        this._logService = _logService;
        this._modelService = _modelService;
        this._editorService = _editorService;
        this._textModelService = _textModelService;
        this._fileService = _fileService;
        this._textFileService = _textFileService;
        this._labelService = _labelService;
        this._configurationService = _configurationService;
    }
    BulkEditService.prototype.apply = function (edit, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var edits = edit.edits;
        var codeEditor = options.editor;
        // First check if loaded models were not changed in the meantime
        for (var i = 0, len = edits.length; i < len; i++) {
            var edit_1 = edits[i];
            if (!isResourceFileEdit(edit_1) && typeof edit_1.modelVersionId === 'number') {
                var model = this._modelService.getModel(edit_1.resource);
                if (model && model.getVersionId() !== edit_1.modelVersionId) {
                    // model changed in the meantime
                    return Promise.reject(new Error(model.uri.toString() + " has changed in the meantime"));
                }
            }
        }
        // try to find code editor
        // todo@joh, prefer edit that gets edited
        if (!codeEditor) {
            var candidate = this._editorService.activeTextEditorWidget;
            if (isCodeEditor(candidate)) {
                codeEditor = candidate;
            }
        }
        var bulkEdit = new BulkEdit(options.editor, options.progress, this._logService, this._textModelService, this._fileService, this._textFileService, this._labelService, this._configurationService);
        bulkEdit.add(edits);
        return bulkEdit.perform().then(function () {
            return { ariaSummary: bulkEdit.ariaMessage() };
        }).catch(function (err) {
            // console.log('apply FAILED');
            // console.log(err);
            _this._logService.error(err);
            throw err;
        });
    };
    BulkEditService = __decorate([
        __param(0, ILogService),
        __param(1, IModelService),
        __param(2, IEditorService),
        __param(3, ITextModelService),
        __param(4, IFileService),
        __param(5, ITextFileService),
        __param(6, ILabelService),
        __param(7, IConfigurationService)
    ], BulkEditService);
    return BulkEditService;
}());
export { BulkEditService };
registerSingleton(IBulkEditService, BulkEditService, true);
