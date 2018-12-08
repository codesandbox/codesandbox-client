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
import './hover.css';
import * as nls from '../../../nls.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { dispose } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { Range } from '../../common/core/range.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { IModeService } from '../../common/services/modeService.js';
import { ModesContentHoverWidget } from './modesContentHover.js';
import { ModesGlyphHoverWidget } from './modesGlyphHover.js';
import { MarkdownRenderer } from '../markdown/markdownRenderer.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { editorHoverBackground, editorHoverBorder, editorHoverHighlight, textCodeBlockBackground, textLinkForeground } from '../../../platform/theme/common/colorRegistry.js';
import { IThemeService, registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
var ModesHoverController = /** @class */ (function () {
    function ModesHoverController(_editor, _openerService, _modeService, _themeService) {
        var _this = this;
        this._editor = _editor;
        this._openerService = _openerService;
        this._modeService = _modeService;
        this._themeService = _themeService;
        this._toUnhook = [];
        this._isMouseDown = false;
        this._hoverClicked = false;
        this._hookEvents();
        this._didChangeConfigurationHandler = this._editor.onDidChangeConfiguration(function (e) {
            if (e.contribInfo) {
                _this._hideWidgets();
                _this._unhookEvents();
                _this._hookEvents();
            }
        });
    }
    Object.defineProperty(ModesHoverController.prototype, "contentWidget", {
        get: function () {
            if (!this._contentWidget) {
                this._createHoverWidget();
            }
            return this._contentWidget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModesHoverController.prototype, "glyphWidget", {
        get: function () {
            if (!this._glyphWidget) {
                this._createHoverWidget();
            }
            return this._glyphWidget;
        },
        enumerable: true,
        configurable: true
    });
    ModesHoverController.get = function (editor) {
        return editor.getContribution(ModesHoverController.ID);
    };
    ModesHoverController.prototype._hookEvents = function () {
        var _this = this;
        var hideWidgetsEventHandler = function () { return _this._hideWidgets(); };
        var hoverOpts = this._editor.getConfiguration().contribInfo.hover;
        this._isHoverEnabled = hoverOpts.enabled;
        this._isHoverSticky = hoverOpts.sticky;
        if (this._isHoverEnabled) {
            this._toUnhook.push(this._editor.onMouseDown(function (e) { return _this._onEditorMouseDown(e); }));
            this._toUnhook.push(this._editor.onMouseUp(function (e) { return _this._onEditorMouseUp(e); }));
            this._toUnhook.push(this._editor.onMouseMove(function (e) { return _this._onEditorMouseMove(e); }));
            this._toUnhook.push(this._editor.onKeyDown(function (e) { return _this._onKeyDown(e); }));
            this._toUnhook.push(this._editor.onDidChangeModelDecorations(function () { return _this._onModelDecorationsChanged(); }));
        }
        else {
            this._toUnhook.push(this._editor.onMouseMove(hideWidgetsEventHandler));
        }
        this._toUnhook.push(this._editor.onMouseLeave(hideWidgetsEventHandler));
        this._toUnhook.push(this._editor.onDidChangeModel(hideWidgetsEventHandler));
        this._toUnhook.push(this._editor.onDidScrollChange(function (e) { return _this._onEditorScrollChanged(e); }));
    };
    ModesHoverController.prototype._unhookEvents = function () {
        this._toUnhook = dispose(this._toUnhook);
    };
    ModesHoverController.prototype._onModelDecorationsChanged = function () {
        this.contentWidget.onModelDecorationsChanged();
        this.glyphWidget.onModelDecorationsChanged();
    };
    ModesHoverController.prototype._onEditorScrollChanged = function (e) {
        if (e.scrollTopChanged || e.scrollLeftChanged) {
            this._hideWidgets();
        }
    };
    ModesHoverController.prototype._onEditorMouseDown = function (mouseEvent) {
        this._isMouseDown = true;
        var targetType = mouseEvent.target.type;
        if (targetType === 9 /* CONTENT_WIDGET */ && mouseEvent.target.detail === ModesContentHoverWidget.ID) {
            this._hoverClicked = true;
            // mouse down on top of content hover widget
            return;
        }
        if (targetType === 12 /* OVERLAY_WIDGET */ && mouseEvent.target.detail === ModesGlyphHoverWidget.ID) {
            // mouse down on top of overlay hover widget
            return;
        }
        if (targetType !== 12 /* OVERLAY_WIDGET */ && mouseEvent.target.detail !== ModesGlyphHoverWidget.ID) {
            this._hoverClicked = false;
        }
        this._hideWidgets();
    };
    ModesHoverController.prototype._onEditorMouseUp = function (mouseEvent) {
        this._isMouseDown = false;
    };
    ModesHoverController.prototype._onEditorMouseMove = function (mouseEvent) {
        // const this._editor.getConfiguration().contribInfo.hover.sticky;
        var targetType = mouseEvent.target.type;
        var hasStopKey = (platform.isMacintosh ? mouseEvent.event.metaKey : mouseEvent.event.ctrlKey);
        if (this._isMouseDown && this._hoverClicked && this.contentWidget.isColorPickerVisible()) {
            return;
        }
        if (this._isHoverSticky && targetType === 9 /* CONTENT_WIDGET */ && mouseEvent.target.detail === ModesContentHoverWidget.ID && !hasStopKey) {
            // mouse moved on top of content hover widget
            return;
        }
        if (this._isHoverSticky && targetType === 12 /* OVERLAY_WIDGET */ && mouseEvent.target.detail === ModesGlyphHoverWidget.ID && !hasStopKey) {
            // mouse moved on top of overlay hover widget
            return;
        }
        if (targetType === 7 /* CONTENT_EMPTY */) {
            var epsilon = this._editor.getConfiguration().fontInfo.typicalHalfwidthCharacterWidth / 2;
            var data = mouseEvent.target.detail;
            if (data && !data.isAfterLines && typeof data.horizontalDistanceToText === 'number' && data.horizontalDistanceToText < epsilon) {
                // Let hover kick in even when the mouse is technically in the empty area after a line, given the distance is small enough
                targetType = 6 /* CONTENT_TEXT */;
            }
        }
        if (targetType === 6 /* CONTENT_TEXT */) {
            this.glyphWidget.hide();
            if (this._isHoverEnabled) {
                this.contentWidget.startShowingAt(mouseEvent.target.range, 0 /* Delayed */, false);
            }
        }
        else if (targetType === 2 /* GUTTER_GLYPH_MARGIN */) {
            this.contentWidget.hide();
            if (this._isHoverEnabled) {
                this.glyphWidget.startShowingAt(mouseEvent.target.position.lineNumber);
            }
        }
        else {
            this._hideWidgets();
        }
    };
    ModesHoverController.prototype._onKeyDown = function (e) {
        if (e.keyCode !== 5 /* Ctrl */ && e.keyCode !== 6 /* Alt */ && e.keyCode !== 57 /* Meta */ && e.keyCode !== 4 /* Shift */) {
            // Do not hide hover when a modifier key is pressed
            this._hideWidgets();
        }
    };
    ModesHoverController.prototype._hideWidgets = function () {
        if (!this._contentWidget || (this._isMouseDown && this._hoverClicked && this._contentWidget.isColorPickerVisible())) {
            return;
        }
        this._glyphWidget.hide();
        this._contentWidget.hide();
    };
    ModesHoverController.prototype._createHoverWidget = function () {
        var renderer = new MarkdownRenderer(this._editor, this._modeService, this._openerService);
        this._contentWidget = new ModesContentHoverWidget(this._editor, renderer, this._themeService);
        this._glyphWidget = new ModesGlyphHoverWidget(this._editor, renderer);
    };
    ModesHoverController.prototype.showContentHover = function (range, mode, focus) {
        this.contentWidget.startShowingAt(range, mode, focus);
    };
    ModesHoverController.prototype.getId = function () {
        return ModesHoverController.ID;
    };
    ModesHoverController.prototype.dispose = function () {
        this._unhookEvents();
        this._didChangeConfigurationHandler.dispose();
        if (this._glyphWidget) {
            this._glyphWidget.dispose();
            this._glyphWidget = null;
        }
        if (this._contentWidget) {
            this._contentWidget.dispose();
            this._contentWidget = null;
        }
    };
    ModesHoverController.ID = 'editor.contrib.hover';
    ModesHoverController = __decorate([
        __param(1, IOpenerService),
        __param(2, IModeService),
        __param(3, IThemeService)
    ], ModesHoverController);
    return ModesHoverController;
}());
export { ModesHoverController };
var ShowHoverAction = /** @class */ (function (_super) {
    __extends(ShowHoverAction, _super);
    function ShowHoverAction() {
        return _super.call(this, {
            id: 'editor.action.showHover',
            label: nls.localize({
                key: 'showHover',
                comment: [
                    'Label for action that will trigger the showing of a hover in the editor.',
                    'This allows for users to show the hover without using the mouse.'
                ]
            }, "Show Hover"),
            alias: 'Show Hover',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 39 /* KEY_I */),
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    ShowHoverAction.prototype.run = function (accessor, editor) {
        var controller = ModesHoverController.get(editor);
        if (!controller) {
            return;
        }
        var position = editor.getPosition();
        var range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
        controller.showContentHover(range, 1 /* Immediate */, true);
    };
    return ShowHoverAction;
}(EditorAction));
registerEditorContribution(ModesHoverController);
registerEditorAction(ShowHoverAction);
// theming
registerThemingParticipant(function (theme, collector) {
    var editorHoverHighlightColor = theme.getColor(editorHoverHighlight);
    if (editorHoverHighlightColor) {
        collector.addRule(".monaco-editor .hoverHighlight { background-color: " + editorHoverHighlightColor + "; }");
    }
    var hoverBackground = theme.getColor(editorHoverBackground);
    if (hoverBackground) {
        collector.addRule(".monaco-editor .monaco-editor-hover { background-color: " + hoverBackground + "; }");
    }
    var hoverBorder = theme.getColor(editorHoverBorder);
    if (hoverBorder) {
        collector.addRule(".monaco-editor .monaco-editor-hover { border: 1px solid " + hoverBorder + "; }");
        collector.addRule(".monaco-editor .monaco-editor-hover .hover-row:not(:first-child):not(:empty) { border-top: 1px solid " + hoverBorder.transparent(0.5) + "; }");
    }
    var link = theme.getColor(textLinkForeground);
    if (link) {
        collector.addRule(".monaco-editor .monaco-editor-hover a { color: " + link + "; }");
    }
    var codeBackground = theme.getColor(textCodeBlockBackground);
    if (codeBackground) {
        collector.addRule(".monaco-editor .monaco-editor-hover code { background-color: " + codeBackground + "; }");
    }
});
