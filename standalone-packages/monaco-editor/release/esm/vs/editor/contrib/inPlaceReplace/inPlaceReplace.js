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
import { TPromise } from '../../../base/common/winjs.base.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, EditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { IEditorWorkerService } from '../../common/services/editorWorkerService.js';
import { InPlaceReplaceCommand } from './inPlaceReplaceCommand.js';
import { EditorState } from '../../browser/core/editorState.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { editorBracketMatchBorder } from '../../common/view/editorColorRegistry.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { createCancelablePromise, timeout } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
var InPlaceReplaceController = /** @class */ (function () {
    function InPlaceReplaceController(editor, editorWorkerService) {
        this.decorationIds = [];
        this.editor = editor;
        this.editorWorkerService = editorWorkerService;
    }
    InPlaceReplaceController.get = function (editor) {
        return editor.getContribution(InPlaceReplaceController.ID);
    };
    InPlaceReplaceController.prototype.dispose = function () {
    };
    InPlaceReplaceController.prototype.getId = function () {
        return InPlaceReplaceController.ID;
    };
    InPlaceReplaceController.prototype.run = function (source, up) {
        var _this = this;
        // cancel any pending request
        if (this.currentRequest) {
            this.currentRequest.cancel();
        }
        var selection = this.editor.getSelection();
        var model = this.editor.getModel();
        var modelURI = model.uri;
        if (selection.startLineNumber !== selection.endLineNumber) {
            // Can't accept multiline selection
            return null;
        }
        var state = new EditorState(this.editor, 1 /* Value */ | 4 /* Position */);
        if (!this.editorWorkerService.canNavigateValueSet(modelURI)) {
            return undefined;
        }
        this.currentRequest = createCancelablePromise(function (token) { return _this.editorWorkerService.navigateValueSet(modelURI, selection, up); });
        return this.currentRequest.then(function (result) {
            if (!result || !result.range || !result.value) {
                // No proper result
                return;
            }
            if (!state.validate(_this.editor)) {
                // state has changed
                return;
            }
            // Selection
            var editRange = Range.lift(result.range);
            var highlightRange = result.range;
            var diff = result.value.length - (selection.endColumn - selection.startColumn);
            // highlight
            highlightRange = {
                startLineNumber: highlightRange.startLineNumber,
                startColumn: highlightRange.startColumn,
                endLineNumber: highlightRange.endLineNumber,
                endColumn: highlightRange.startColumn + result.value.length
            };
            if (diff > 1) {
                selection = new Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn + diff - 1);
            }
            // Insert new text
            var command = new InPlaceReplaceCommand(editRange, selection, result.value);
            _this.editor.pushUndoStop();
            _this.editor.executeCommand(source, command);
            _this.editor.pushUndoStop();
            // add decoration
            _this.decorationIds = _this.editor.deltaDecorations(_this.decorationIds, [{
                    range: highlightRange,
                    options: InPlaceReplaceController.DECORATION
                }]);
            // remove decoration after delay
            if (_this.decorationRemover) {
                _this.decorationRemover.cancel();
            }
            _this.decorationRemover = timeout(350);
            _this.decorationRemover.then(function () { return _this.decorationIds = _this.editor.deltaDecorations(_this.decorationIds, []); }).catch(onUnexpectedError);
        }).catch(onUnexpectedError);
    };
    InPlaceReplaceController.ID = 'editor.contrib.inPlaceReplaceController';
    InPlaceReplaceController.DECORATION = ModelDecorationOptions.register({
        className: 'valueSetReplacement'
    });
    InPlaceReplaceController = __decorate([
        __param(1, IEditorWorkerService)
    ], InPlaceReplaceController);
    return InPlaceReplaceController;
}());
var InPlaceReplaceUp = /** @class */ (function (_super) {
    __extends(InPlaceReplaceUp, _super);
    function InPlaceReplaceUp() {
        return _super.call(this, {
            id: 'editor.action.inPlaceReplace.up',
            label: nls.localize('InPlaceReplaceAction.previous.label', "Replace with Previous Value"),
            alias: 'Replace with Previous Value',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 82 /* US_COMMA */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    InPlaceReplaceUp.prototype.run = function (accessor, editor) {
        var controller = InPlaceReplaceController.get(editor);
        if (!controller) {
            return undefined;
        }
        return TPromise.wrap(controller.run(this.id, true));
    };
    return InPlaceReplaceUp;
}(EditorAction));
var InPlaceReplaceDown = /** @class */ (function (_super) {
    __extends(InPlaceReplaceDown, _super);
    function InPlaceReplaceDown() {
        return _super.call(this, {
            id: 'editor.action.inPlaceReplace.down',
            label: nls.localize('InPlaceReplaceAction.next.label', "Replace with Next Value"),
            alias: 'Replace with Next Value',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 84 /* US_DOT */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    InPlaceReplaceDown.prototype.run = function (accessor, editor) {
        var controller = InPlaceReplaceController.get(editor);
        if (!controller) {
            return undefined;
        }
        return TPromise.wrap(controller.run(this.id, false));
    };
    return InPlaceReplaceDown;
}(EditorAction));
registerEditorContribution(InPlaceReplaceController);
registerEditorAction(InPlaceReplaceUp);
registerEditorAction(InPlaceReplaceDown);
registerThemingParticipant(function (theme, collector) {
    var border = theme.getColor(editorBracketMatchBorder);
    if (border) {
        collector.addRule(".monaco-editor.vs .valueSetReplacement { outline: solid 2px " + border + "; }");
    }
});
