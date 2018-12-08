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
import './editorQuickOpen.css';
import { EditorAction, registerEditorContribution } from '../../../browser/editorExtensions.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { QuickOpenEditorWidget } from './quickOpenEditorWidget.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
var QuickOpenController = /** @class */ (function () {
    function QuickOpenController(editor, themeService) {
        this.themeService = themeService;
        this.editor = editor;
    }
    QuickOpenController.get = function (editor) {
        return editor.getContribution(QuickOpenController.ID);
    };
    QuickOpenController.prototype.getId = function () {
        return QuickOpenController.ID;
    };
    QuickOpenController.prototype.dispose = function () {
        // Dispose widget
        if (this.widget) {
            this.widget.destroy();
            this.widget = null;
        }
    };
    QuickOpenController.prototype.run = function (opts) {
        var _this = this;
        if (this.widget) {
            this.widget.destroy();
            this.widget = null;
        }
        // Create goto line widget
        var onClose = function (canceled) {
            // Clear Highlight Decorations if present
            _this.clearDecorations();
            // Restore selection if canceled
            if (canceled && _this.lastKnownEditorSelection) {
                _this.editor.setSelection(_this.lastKnownEditorSelection);
                _this.editor.revealRangeInCenterIfOutsideViewport(_this.lastKnownEditorSelection, 0 /* Smooth */);
            }
            _this.lastKnownEditorSelection = null;
            // Return focus to the editor if
            // - focus is back on the <body> element because no other focusable element was clicked
            // - a command was picked from the picker which indicates the editor should get focused
            if (document.activeElement === document.body || !canceled) {
                _this.editor.focus();
            }
        };
        this.widget = new QuickOpenEditorWidget(this.editor, function () { return onClose(false); }, function () { return onClose(true); }, function (value) {
            _this.widget.setInput(opts.getModel(value), opts.getAutoFocus(value));
        }, {
            inputAriaLabel: opts.inputAriaLabel
        }, this.themeService);
        // Remember selection to be able to restore on cancel
        if (!this.lastKnownEditorSelection) {
            this.lastKnownEditorSelection = this.editor.getSelection();
        }
        // Show
        this.widget.show('');
    };
    QuickOpenController.prototype.decorateLine = function (range, editor) {
        var oldDecorations = [];
        if (this.rangeHighlightDecorationId) {
            oldDecorations.push(this.rangeHighlightDecorationId);
            this.rangeHighlightDecorationId = null;
        }
        var newDecorations = [
            {
                range: range,
                options: QuickOpenController._RANGE_HIGHLIGHT_DECORATION
            }
        ];
        var decorations = editor.deltaDecorations(oldDecorations, newDecorations);
        this.rangeHighlightDecorationId = decorations[0];
    };
    QuickOpenController.prototype.clearDecorations = function () {
        if (this.rangeHighlightDecorationId) {
            this.editor.deltaDecorations([this.rangeHighlightDecorationId], []);
            this.rangeHighlightDecorationId = null;
        }
    };
    QuickOpenController.ID = 'editor.controller.quickOpenController';
    QuickOpenController._RANGE_HIGHLIGHT_DECORATION = ModelDecorationOptions.register({
        className: 'rangeHighlight',
        isWholeLine: true
    });
    QuickOpenController = __decorate([
        __param(1, IThemeService)
    ], QuickOpenController);
    return QuickOpenController;
}());
export { QuickOpenController };
/**
 * Base class for providing quick open in the editor.
 */
var BaseEditorQuickOpenAction = /** @class */ (function (_super) {
    __extends(BaseEditorQuickOpenAction, _super);
    function BaseEditorQuickOpenAction(inputAriaLabel, opts) {
        var _this = _super.call(this, opts) || this;
        _this._inputAriaLabel = inputAriaLabel;
        return _this;
    }
    BaseEditorQuickOpenAction.prototype.getController = function (editor) {
        return QuickOpenController.get(editor);
    };
    BaseEditorQuickOpenAction.prototype._show = function (controller, opts) {
        controller.run({
            inputAriaLabel: this._inputAriaLabel,
            getModel: function (value) { return opts.getModel(value); },
            getAutoFocus: function (searchValue) { return opts.getAutoFocus(searchValue); }
        });
    };
    return BaseEditorQuickOpenAction;
}(EditorAction));
export { BaseEditorQuickOpenAction };
registerEditorContribution(QuickOpenController);
