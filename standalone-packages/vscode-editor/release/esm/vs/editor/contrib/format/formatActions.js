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
import * as nls from '../../../nls.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { registerEditorAction, EditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { OnTypeFormattingEditProviderRegistry, DocumentRangeFormattingEditProviderRegistry } from '../../common/modes.js';
import { getOnTypeFormattingEdits, getDocumentFormattingEdits, getDocumentRangeFormattingEdits, NoProviderError } from './format.js';
import { FormattingEdit } from './formattingEdit.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { IEditorWorkerService } from '../../common/services/editorWorkerService.js';
import { CharacterSet } from '../../common/core/characterClassifier.js';
import { Range } from '../../common/core/range.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { EditorState } from '../../browser/core/editorState.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
function alertFormattingEdits(edits) {
    edits = edits.filter(function (edit) { return edit.range; });
    if (!edits.length) {
        return;
    }
    var range = edits[0].range;
    for (var i = 1; i < edits.length; i++) {
        range = Range.plusRange(range, edits[i].range);
    }
    var startLineNumber = range.startLineNumber, endLineNumber = range.endLineNumber;
    if (startLineNumber === endLineNumber) {
        if (edits.length === 1) {
            alert(nls.localize('hint11', "Made 1 formatting edit on line {0}", startLineNumber));
        }
        else {
            alert(nls.localize('hintn1', "Made {0} formatting edits on line {1}", edits.length, startLineNumber));
        }
    }
    else {
        if (edits.length === 1) {
            alert(nls.localize('hint1n', "Made 1 formatting edit between lines {0} and {1}", startLineNumber, endLineNumber));
        }
        else {
            alert(nls.localize('hintnn', "Made {0} formatting edits between lines {1} and {2}", edits.length, startLineNumber, endLineNumber));
        }
    }
}
var FormatOnType = /** @class */ (function () {
    function FormatOnType(editor, workerService) {
        var _this = this;
        this.editor = editor;
        this.workerService = workerService;
        this.callOnDispose = [];
        this.callOnModel = [];
        this.callOnDispose.push(editor.onDidChangeConfiguration(function () { return _this.update(); }));
        this.callOnDispose.push(editor.onDidChangeModel(function () { return _this.update(); }));
        this.callOnDispose.push(editor.onDidChangeModelLanguage(function () { return _this.update(); }));
        this.callOnDispose.push(OnTypeFormattingEditProviderRegistry.onDidChange(this.update, this));
    }
    FormatOnType.prototype.update = function () {
        var _this = this;
        // clean up
        this.callOnModel = dispose(this.callOnModel);
        // we are disabled
        if (!this.editor.getConfiguration().contribInfo.formatOnType) {
            return;
        }
        // no model
        if (!this.editor.getModel()) {
            return;
        }
        var model = this.editor.getModel();
        // no support
        var support = OnTypeFormattingEditProviderRegistry.ordered(model)[0];
        if (!support || !support.autoFormatTriggerCharacters) {
            return;
        }
        // register typing listeners that will trigger the format
        var triggerChars = new CharacterSet();
        for (var _i = 0, _a = support.autoFormatTriggerCharacters; _i < _a.length; _i++) {
            var ch = _a[_i];
            triggerChars.add(ch.charCodeAt(0));
        }
        this.callOnModel.push(this.editor.onDidType(function (text) {
            var lastCharCode = text.charCodeAt(text.length - 1);
            if (triggerChars.has(lastCharCode)) {
                _this.trigger(String.fromCharCode(lastCharCode));
            }
        }));
    };
    FormatOnType.prototype.trigger = function (ch) {
        var _this = this;
        if (this.editor.getSelections().length > 1) {
            return;
        }
        var model = this.editor.getModel();
        var position = this.editor.getPosition();
        var canceled = false;
        // install a listener that checks if edits happens before the
        // position on which we format right now. If so, we won't
        // apply the format edits
        var unbind = this.editor.onDidChangeModelContent(function (e) {
            if (e.isFlush) {
                // a model.setValue() was called
                // cancel only once
                canceled = true;
                unbind.dispose();
                return;
            }
            for (var i = 0, len = e.changes.length; i < len; i++) {
                var change = e.changes[i];
                if (change.range.endLineNumber <= position.lineNumber) {
                    // cancel only once
                    canceled = true;
                    unbind.dispose();
                    return;
                }
            }
        });
        var modelOpts = model.getOptions();
        getOnTypeFormattingEdits(model, position, ch, {
            tabSize: modelOpts.tabSize,
            insertSpaces: modelOpts.insertSpaces
        }).then(function (edits) {
            return _this.workerService.computeMoreMinimalEdits(model.uri, edits);
        }).then(function (edits) {
            unbind.dispose();
            if (canceled || isFalsyOrEmpty(edits)) {
                return;
            }
            FormattingEdit.execute(_this.editor, edits);
            alertFormattingEdits(edits);
        }, function (err) {
            unbind.dispose();
            throw err;
        });
    };
    FormatOnType.prototype.getId = function () {
        return FormatOnType.ID;
    };
    FormatOnType.prototype.dispose = function () {
        this.callOnDispose = dispose(this.callOnDispose);
        this.callOnModel = dispose(this.callOnModel);
    };
    FormatOnType.ID = 'editor.contrib.autoFormat';
    FormatOnType = __decorate([
        __param(1, IEditorWorkerService)
    ], FormatOnType);
    return FormatOnType;
}());
var FormatOnPaste = /** @class */ (function () {
    function FormatOnPaste(editor, workerService) {
        var _this = this;
        this.editor = editor;
        this.workerService = workerService;
        this.callOnDispose = [];
        this.callOnModel = [];
        this.callOnDispose.push(editor.onDidChangeConfiguration(function () { return _this.update(); }));
        this.callOnDispose.push(editor.onDidChangeModel(function () { return _this.update(); }));
        this.callOnDispose.push(editor.onDidChangeModelLanguage(function () { return _this.update(); }));
        this.callOnDispose.push(DocumentRangeFormattingEditProviderRegistry.onDidChange(this.update, this));
    }
    FormatOnPaste.prototype.update = function () {
        var _this = this;
        // clean up
        this.callOnModel = dispose(this.callOnModel);
        // we are disabled
        if (!this.editor.getConfiguration().contribInfo.formatOnPaste) {
            return;
        }
        // no model
        if (!this.editor.getModel()) {
            return;
        }
        var model = this.editor.getModel();
        // no support
        var support = DocumentRangeFormattingEditProviderRegistry.ordered(model)[0];
        if (!support || !support.provideDocumentRangeFormattingEdits) {
            return;
        }
        this.callOnModel.push(this.editor.onDidPaste(function (range) {
            _this.trigger(range);
        }));
    };
    FormatOnPaste.prototype.trigger = function (range) {
        var _this = this;
        if (this.editor.getSelections().length > 1) {
            return;
        }
        var model = this.editor.getModel();
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var state = new EditorState(this.editor, 1 /* Value */ | 4 /* Position */);
        getDocumentRangeFormattingEdits(model, range, { tabSize: tabSize, insertSpaces: insertSpaces }, CancellationToken.None).then(function (edits) {
            return _this.workerService.computeMoreMinimalEdits(model.uri, edits);
        }).then(function (edits) {
            if (!state.validate(_this.editor) || isFalsyOrEmpty(edits)) {
                return;
            }
            FormattingEdit.execute(_this.editor, edits);
            alertFormattingEdits(edits);
        });
    };
    FormatOnPaste.prototype.getId = function () {
        return FormatOnPaste.ID;
    };
    FormatOnPaste.prototype.dispose = function () {
        this.callOnDispose = dispose(this.callOnDispose);
        this.callOnModel = dispose(this.callOnModel);
    };
    FormatOnPaste.ID = 'editor.contrib.formatOnPaste';
    FormatOnPaste = __decorate([
        __param(1, IEditorWorkerService)
    ], FormatOnPaste);
    return FormatOnPaste;
}());
var AbstractFormatAction = /** @class */ (function (_super) {
    __extends(AbstractFormatAction, _super);
    function AbstractFormatAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractFormatAction.prototype.run = function (accessor, editor) {
        var _this = this;
        var workerService = accessor.get(IEditorWorkerService);
        var notificationService = accessor.get(INotificationService);
        var formattingPromise = this._getFormattingEdits(editor, CancellationToken.None);
        if (!formattingPromise) {
            return Promise.resolve(void 0);
        }
        // Capture the state of the editor
        var state = new EditorState(editor, 1 /* Value */ | 4 /* Position */);
        // Receive formatted value from worker
        return formattingPromise.then(function (edits) { return workerService.computeMoreMinimalEdits(editor.getModel().uri, edits); }).then(function (edits) {
            if (!state.validate(editor) || isFalsyOrEmpty(edits)) {
                return;
            }
            FormattingEdit.execute(editor, edits);
            alertFormattingEdits(edits);
            editor.focus();
            editor.revealPositionInCenterIfOutsideViewport(editor.getPosition(), 1 /* Immediate */);
        }, function (err) {
            if (err instanceof Error && err.name === NoProviderError.Name) {
                _this._notifyNoProviderError(notificationService, editor.getModel().getLanguageIdentifier().language);
            }
            else {
                throw err;
            }
        });
    };
    AbstractFormatAction.prototype._notifyNoProviderError = function (notificationService, language) {
        notificationService.info(nls.localize('no.provider', "There is no formatter for '{0}'-files installed.", language));
    };
    return AbstractFormatAction;
}(EditorAction));
export { AbstractFormatAction };
var FormatDocumentAction = /** @class */ (function (_super) {
    __extends(FormatDocumentAction, _super);
    function FormatDocumentAction() {
        return _super.call(this, {
            id: 'editor.action.formatDocument',
            label: nls.localize('formatDocument.label', "Format Document"),
            alias: 'Format Document',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 36 /* KEY_F */,
                // secondary: [KeyChord(KeyMod.CtrlCmd | KeyCode.KEY_K, KeyMod.CtrlCmd | KeyCode.KEY_D)],
                linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 39 /* KEY_I */ },
                weight: 100 /* EditorContrib */
            },
            menuOpts: {
                when: EditorContextKeys.hasDocumentFormattingProvider,
                group: '1_modification',
                order: 1.3
            }
        }) || this;
    }
    FormatDocumentAction.prototype._getFormattingEdits = function (editor, token) {
        var model = editor.getModel();
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        return getDocumentFormattingEdits(model, { tabSize: tabSize, insertSpaces: insertSpaces }, token);
    };
    FormatDocumentAction.prototype._notifyNoProviderError = function (notificationService, language) {
        notificationService.info(nls.localize('no.documentprovider', "There is no document formatter for '{0}'-files installed.", language));
    };
    return FormatDocumentAction;
}(AbstractFormatAction));
export { FormatDocumentAction };
var FormatSelectionAction = /** @class */ (function (_super) {
    __extends(FormatSelectionAction, _super);
    function FormatSelectionAction() {
        return _super.call(this, {
            id: 'editor.action.formatSelection',
            label: nls.localize('formatSelection.label', "Format Selection"),
            alias: 'Format Code',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 36 /* KEY_F */),
                weight: 100 /* EditorContrib */
            },
            menuOpts: {
                when: ContextKeyExpr.and(EditorContextKeys.hasDocumentSelectionFormattingProvider, EditorContextKeys.hasNonEmptySelection),
                group: '1_modification',
                order: 1.31
            }
        }) || this;
    }
    FormatSelectionAction.prototype._getFormattingEdits = function (editor, token) {
        var model = editor.getModel();
        var selection = editor.getSelection();
        if (selection.isEmpty()) {
            var maxColumn = model.getLineMaxColumn(selection.startLineNumber);
            selection = selection.setStartPosition(selection.startLineNumber, 1);
            selection = selection.setEndPosition(selection.endLineNumber, maxColumn);
        }
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        return getDocumentRangeFormattingEdits(model, selection, { tabSize: tabSize, insertSpaces: insertSpaces }, token);
    };
    FormatSelectionAction.prototype._notifyNoProviderError = function (notificationService, language) {
        notificationService.info(nls.localize('no.selectionprovider', "There is no selection formatter for '{0}'-files installed.", language));
    };
    return FormatSelectionAction;
}(AbstractFormatAction));
export { FormatSelectionAction };
registerEditorContribution(FormatOnType);
registerEditorContribution(FormatOnPaste);
registerEditorAction(FormatDocumentAction);
registerEditorAction(FormatSelectionAction);
// this is the old format action that does both (format document OR format selection)
// and we keep it here such that existing keybinding configurations etc will still work
CommandsRegistry.registerCommand('editor.action.format', function (accessor) {
    var editor = accessor.get(ICodeEditorService).getFocusedCodeEditor();
    if (editor) {
        return new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.call(this, {}) || this;
            }
            class_1.prototype._getFormattingEdits = function (editor, token) {
                var model = editor.getModel();
                var editorSelection = editor.getSelection();
                var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
                return editorSelection.isEmpty()
                    ? getDocumentFormattingEdits(model, { tabSize: tabSize, insertSpaces: insertSpaces }, token)
                    : getDocumentRangeFormattingEdits(model, editorSelection, { tabSize: tabSize, insertSpaces: insertSpaces }, token);
            };
            return class_1;
        }(AbstractFormatAction))().run(accessor, editor);
    }
    return undefined;
});
