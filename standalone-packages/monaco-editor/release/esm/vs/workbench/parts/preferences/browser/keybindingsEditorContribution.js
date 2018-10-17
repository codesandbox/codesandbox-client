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
import * as nls from '../../../../nls.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyChord, SimpleKeybinding } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { Range } from '../../../../editor/common/core/range.js';
import { registerEditorContribution, registerEditorCommand, EditorCommand } from '../../../../editor/browser/editorExtensions.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/snippetController2.js';
import { SmartSnippetInserter } from '../common/smartSnippetInserter.js';
import { DefineKeybindingOverlayWidget } from './keybindingWidgets.js';
import { FloatingClickWidget } from '../../../browser/parts/editor/editorWidgets.js';
import { parseTree } from '../../../../base/common/json.js';
import { ScanCodeBinding } from '../../../../base/common/scanCode.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { WindowsNativeResolvedKeybinding } from '../../../services/keybinding/common/windowsKeyboardMapper.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { overviewRulerInfo, overviewRulerError } from '../../../../editor/common/view/editorColorRegistry.js';
import { TrackedRangeStickiness, OverviewRulerLane } from '../../../../editor/common/model.js';
import { KeybindingParser } from '../../../../base/common/keybindingParser.js';
var NLS_LAUNCH_MESSAGE = nls.localize('defineKeybinding.start', "Define Keybinding");
var NLS_KB_LAYOUT_ERROR_MESSAGE = nls.localize('defineKeybinding.kbLayoutErrorMessage', "You won't be able to produce this key combination under your current keyboard layout.");
var INTERESTING_FILE = /keybindings\.json$/;
var DefineKeybindingController = /** @class */ (function (_super) {
    __extends(DefineKeybindingController, _super);
    function DefineKeybindingController(_editor, _instantiationService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._instantiationService = _instantiationService;
        _this._keybindingWidgetRenderer = null;
        _this._keybindingDecorationRenderer = null;
        _this._register(_this._editor.onDidChangeModel(function (e) { return _this._update(); }));
        _this._update();
        return _this;
    }
    DefineKeybindingController.get = function (editor) {
        return editor.getContribution(DefineKeybindingController.ID);
    };
    DefineKeybindingController.prototype.getId = function () {
        return DefineKeybindingController.ID;
    };
    Object.defineProperty(DefineKeybindingController.prototype, "keybindingWidgetRenderer", {
        get: function () {
            return this._keybindingWidgetRenderer;
        },
        enumerable: true,
        configurable: true
    });
    DefineKeybindingController.prototype.dispose = function () {
        this._disposeKeybindingWidgetRenderer();
        this._disposeKeybindingDecorationRenderer();
        _super.prototype.dispose.call(this);
    };
    DefineKeybindingController.prototype._update = function () {
        if (!isInterestingEditorModel(this._editor)) {
            this._disposeKeybindingWidgetRenderer();
            this._disposeKeybindingDecorationRenderer();
            return;
        }
        // Decorations are shown for the default keybindings.json **and** for the user keybindings.json
        this._createKeybindingDecorationRenderer();
        // The button to define keybindings is shown only for the user keybindings.json
        if (!this._editor.getConfiguration().readOnly) {
            this._createKeybindingWidgetRenderer();
        }
        else {
            this._disposeKeybindingWidgetRenderer();
        }
    };
    DefineKeybindingController.prototype._createKeybindingWidgetRenderer = function () {
        if (!this._keybindingWidgetRenderer) {
            this._keybindingWidgetRenderer = this._instantiationService.createInstance(KeybindingWidgetRenderer, this._editor);
        }
    };
    DefineKeybindingController.prototype._disposeKeybindingWidgetRenderer = function () {
        if (this._keybindingWidgetRenderer) {
            this._keybindingWidgetRenderer.dispose();
            this._keybindingWidgetRenderer = null;
        }
    };
    DefineKeybindingController.prototype._createKeybindingDecorationRenderer = function () {
        if (!this._keybindingDecorationRenderer) {
            this._keybindingDecorationRenderer = this._instantiationService.createInstance(KeybindingEditorDecorationsRenderer, this._editor);
        }
    };
    DefineKeybindingController.prototype._disposeKeybindingDecorationRenderer = function () {
        if (this._keybindingDecorationRenderer) {
            this._keybindingDecorationRenderer.dispose();
            this._keybindingDecorationRenderer = null;
        }
    };
    DefineKeybindingController.ID = 'editor.contrib.defineKeybinding';
    DefineKeybindingController = __decorate([
        __param(1, IInstantiationService)
    ], DefineKeybindingController);
    return DefineKeybindingController;
}(Disposable));
export { DefineKeybindingController };
var KeybindingWidgetRenderer = /** @class */ (function (_super) {
    __extends(KeybindingWidgetRenderer, _super);
    function KeybindingWidgetRenderer(_editor, _instantiationService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._instantiationService = _instantiationService;
        _this._launchWidget = _this._register(_this._instantiationService.createInstance(FloatingClickWidget, _this._editor, NLS_LAUNCH_MESSAGE, DefineKeybindingCommand.ID));
        _this._register(_this._launchWidget.onClick(function () { return _this.showDefineKeybindingWidget(); }));
        _this._defineWidget = _this._register(_this._instantiationService.createInstance(DefineKeybindingOverlayWidget, _this._editor));
        _this._launchWidget.render();
        return _this;
    }
    KeybindingWidgetRenderer.prototype.showDefineKeybindingWidget = function () {
        var _this = this;
        this._defineWidget.start().then(function (keybinding) { return _this._onAccepted(keybinding); });
    };
    KeybindingWidgetRenderer.prototype._onAccepted = function (keybinding) {
        this._editor.focus();
        if (keybinding) {
            var regexp = new RegExp(/\\/g);
            var backslash = regexp.test(keybinding);
            if (backslash) {
                keybinding = keybinding.slice(0, -1) + '\\\\';
            }
            var snippetText = [
                '{',
                '\t"key": ' + JSON.stringify(keybinding) + ',',
                '\t"command": "${1:commandId}",',
                '\t"when": "${2:editorTextFocus}"',
                '}$0'
            ].join('\n');
            var smartInsertInfo = SmartSnippetInserter.insertSnippet(this._editor.getModel(), this._editor.getPosition());
            snippetText = smartInsertInfo.prepend + snippetText + smartInsertInfo.append;
            this._editor.setPosition(smartInsertInfo.position);
            SnippetController2.get(this._editor).insert(snippetText, 0, 0);
        }
    };
    KeybindingWidgetRenderer = __decorate([
        __param(1, IInstantiationService)
    ], KeybindingWidgetRenderer);
    return KeybindingWidgetRenderer;
}(Disposable));
export { KeybindingWidgetRenderer };
var KeybindingEditorDecorationsRenderer = /** @class */ (function (_super) {
    __extends(KeybindingEditorDecorationsRenderer, _super);
    function KeybindingEditorDecorationsRenderer(_editor, _keybindingService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._keybindingService = _keybindingService;
        _this._dec = [];
        _this._updateDecorations = _this._register(new RunOnceScheduler(function () { return _this._updateDecorationsNow(); }, 500));
        var model = _this._editor.getModel();
        _this._register(model.onDidChangeContent(function () { return _this._updateDecorations.schedule(); }));
        _this._register(_this._keybindingService.onDidUpdateKeybindings(function (e) { return _this._updateDecorations.schedule(); }));
        _this._register({
            dispose: function () {
                _this._dec = _this._editor.deltaDecorations(_this._dec, []);
                _this._updateDecorations.cancel();
            }
        });
        _this._updateDecorations.schedule();
        return _this;
    }
    KeybindingEditorDecorationsRenderer.prototype._updateDecorationsNow = function () {
        var model = this._editor.getModel();
        var newDecorations = [];
        var root = parseTree(model.getValue());
        if (root && Array.isArray(root.children)) {
            for (var i = 0, len = root.children.length; i < len; i++) {
                var entry = root.children[i];
                var dec = this._getDecorationForEntry(model, entry);
                if (dec !== null) {
                    newDecorations.push(dec);
                }
            }
        }
        this._dec = this._editor.deltaDecorations(this._dec, newDecorations);
    };
    KeybindingEditorDecorationsRenderer.prototype._getDecorationForEntry = function (model, entry) {
        if (!Array.isArray(entry.children)) {
            return null;
        }
        for (var i = 0, len = entry.children.length; i < len; i++) {
            var prop = entry.children[i];
            if (prop.type !== 'property') {
                continue;
            }
            if (!Array.isArray(prop.children) || prop.children.length !== 2) {
                continue;
            }
            var key = prop.children[0];
            if (key.value !== 'key') {
                continue;
            }
            var value = prop.children[1];
            if (value.type !== 'string') {
                continue;
            }
            var resolvedKeybindings = this._keybindingService.resolveUserBinding(value.value);
            if (resolvedKeybindings.length === 0) {
                return this._createDecoration(true, null, null, model, value);
            }
            var resolvedKeybinding = resolvedKeybindings[0];
            var usLabel = null;
            if (resolvedKeybinding instanceof WindowsNativeResolvedKeybinding) {
                usLabel = resolvedKeybinding.getUSLabel();
            }
            if (!resolvedKeybinding.isWYSIWYG()) {
                var uiLabel = resolvedKeybinding.getLabel();
                if (value.value.toLowerCase() === uiLabel.toLowerCase()) {
                    // coincidentally, this is actually WYSIWYG
                    return null;
                }
                return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
            }
            if (/abnt_|oem_/.test(value.value)) {
                return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
            }
            var expectedUserSettingsLabel = resolvedKeybinding.getUserSettingsLabel();
            if (!KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals(value.value, expectedUserSettingsLabel)) {
                return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
            }
            return null;
        }
        return null;
    };
    KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals = function (a, b) {
        a = a.trim().toLowerCase();
        b = b.trim().toLowerCase();
        if (a === b) {
            return true;
        }
        var _a = KeybindingParser.parseUserBinding(a), parsedA1 = _a[0], parsedA2 = _a[1];
        var _b = KeybindingParser.parseUserBinding(b), parsedB1 = _b[0], parsedB2 = _b[1];
        return (this._userBindingEquals(parsedA1, parsedB1)
            && this._userBindingEquals(parsedA2, parsedB2));
    };
    KeybindingEditorDecorationsRenderer._userBindingEquals = function (a, b) {
        if (a === null && b === null) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        if (a instanceof SimpleKeybinding && b instanceof SimpleKeybinding) {
            return a.equals(b);
        }
        if (a instanceof ScanCodeBinding && b instanceof ScanCodeBinding) {
            return a.equals(b);
        }
        return false;
    };
    KeybindingEditorDecorationsRenderer.prototype._createDecoration = function (isError, uiLabel, usLabel, model, keyNode) {
        var msg;
        var className;
        var beforeContentClassName;
        var overviewRulerColor;
        if (isError) {
            // this is the error case
            msg = new MarkdownString().appendText(NLS_KB_LAYOUT_ERROR_MESSAGE);
            className = 'keybindingError';
            beforeContentClassName = 'inlineKeybindingError';
            overviewRulerColor = themeColorFromId(overviewRulerError);
        }
        else {
            // this is the info case
            if (usLabel && uiLabel !== usLabel) {
                msg = new MarkdownString(nls.localize({
                    key: 'defineKeybinding.kbLayoutLocalAndUSMessage',
                    comment: [
                        'Please translate maintaining the stars (*) around the placeholders such that they will be rendered in bold.',
                        'The placeholders will contain a keyboard combination e.g. Ctrl+Shift+/'
                    ]
                }, "**{0}** for your current keyboard layout (**{1}** for US standard).", uiLabel, usLabel));
            }
            else {
                msg = new MarkdownString(nls.localize({
                    key: 'defineKeybinding.kbLayoutLocalMessage',
                    comment: [
                        'Please translate maintaining the stars (*) around the placeholder such that it will be rendered in bold.',
                        'The placeholder will contain a keyboard combination e.g. Ctrl+Shift+/'
                    ]
                }, "**{0}** for your current keyboard layout.", uiLabel));
            }
            className = 'keybindingInfo';
            beforeContentClassName = 'inlineKeybindingInfo';
            overviewRulerColor = themeColorFromId(overviewRulerInfo);
        }
        var startPosition = model.getPositionAt(keyNode.offset);
        var endPosition = model.getPositionAt(keyNode.offset + keyNode.length);
        var range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        // icon + highlight + message decoration
        return {
            range: range,
            options: {
                stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                className: className,
                beforeContentClassName: beforeContentClassName,
                hoverMessage: msg,
                overviewRuler: {
                    color: overviewRulerColor,
                    position: OverviewRulerLane.Right
                }
            }
        };
    };
    KeybindingEditorDecorationsRenderer = __decorate([
        __param(1, IKeybindingService)
    ], KeybindingEditorDecorationsRenderer);
    return KeybindingEditorDecorationsRenderer;
}(Disposable));
export { KeybindingEditorDecorationsRenderer };
var DefineKeybindingCommand = /** @class */ (function (_super) {
    __extends(DefineKeybindingCommand, _super);
    function DefineKeybindingCommand() {
        return _super.call(this, {
            id: DefineKeybindingCommand.ID,
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.languageId.isEqualTo('jsonc')),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 41 /* KEY_K */),
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DefineKeybindingCommand.prototype.runEditorCommand = function (accessor, editor) {
        if (!isInterestingEditorModel(editor) || editor.getConfiguration().readOnly) {
            return;
        }
        var controller = DefineKeybindingController.get(editor);
        if (controller && controller.keybindingWidgetRenderer) {
            controller.keybindingWidgetRenderer.showDefineKeybindingWidget();
        }
    };
    DefineKeybindingCommand.ID = 'editor.action.defineKeybinding';
    return DefineKeybindingCommand;
}(EditorCommand));
function isInterestingEditorModel(editor) {
    var model = editor.getModel();
    if (!model) {
        return false;
    }
    var url = model.uri.toString();
    return INTERESTING_FILE.test(url);
}
registerEditorContribution(DefineKeybindingController);
registerEditorCommand(new DefineKeybindingCommand());
