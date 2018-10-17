/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import './messageController.css';
import * as nls from '../../../nls.js';
import { setDisposableTimeout } from '../../../base/common/async.js';
import { dispose, Disposable } from '../../../base/common/lifecycle.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { Range } from '../../common/core/range.js';
import { registerEditorContribution, EditorCommand, registerEditorCommand } from '../../browser/editorExtensions.js';
import { ContentWidgetPositionPreference } from '../../browser/editorBrowser.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { registerThemingParticipant, HIGH_CONTRAST } from '../../../platform/theme/common/themeService.js';
import { inputValidationInfoBorder, inputValidationInfoBackground } from '../../../platform/theme/common/colorRegistry.js';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
var MessageController = /** @class */ (function (_super) {
    __extends(MessageController, _super);
    function MessageController(editor, contextKeyService) {
        var _this = _super.call(this) || this;
        _this._messageListeners = [];
        _this._editor = editor;
        _this._visible = MessageController.MESSAGE_VISIBLE.bindTo(contextKeyService);
        _this._register(_this._editor.onDidAttemptReadOnlyEdit(function () { return _this._onDidAttemptReadOnlyEdit(); }));
        return _this;
    }
    MessageController.get = function (editor) {
        return editor.getContribution(MessageController._id);
    };
    MessageController.prototype.getId = function () {
        return MessageController._id;
    };
    MessageController.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._visible.reset();
    };
    MessageController.prototype.isVisible = function () {
        return this._visible.get();
    };
    MessageController.prototype.showMessage = function (message, position) {
        var _this = this;
        alert(message);
        this._visible.set(true);
        dispose(this._messageWidget);
        this._messageListeners = dispose(this._messageListeners);
        this._messageWidget = new MessageWidget(this._editor, position, message);
        // close on blur, cursor, model change, dispose
        this._messageListeners.push(this._editor.onDidBlurEditorText(function () { return _this.closeMessage(); }));
        this._messageListeners.push(this._editor.onDidChangeCursorPosition(function () { return _this.closeMessage(); }));
        this._messageListeners.push(this._editor.onDidDispose(function () { return _this.closeMessage(); }));
        this._messageListeners.push(this._editor.onDidChangeModel(function () { return _this.closeMessage(); }));
        // close after 3s
        this._messageListeners.push(setDisposableTimeout(function () { return _this.closeMessage(); }, 3000));
        // close on mouse move
        var bounds;
        this._messageListeners.push(this._editor.onMouseMove(function (e) {
            // outside the text area
            if (!e.target.position) {
                return;
            }
            if (!bounds) {
                // define bounding box around position and first mouse occurance
                bounds = new Range(position.lineNumber - 3, 1, e.target.position.lineNumber + 3, 1);
            }
            else if (!bounds.containsPosition(e.target.position)) {
                // check if position is still in bounds
                _this.closeMessage();
            }
        }));
    };
    MessageController.prototype.closeMessage = function () {
        this._visible.reset();
        this._messageListeners = dispose(this._messageListeners);
        this._messageListeners.push(MessageWidget.fadeOut(this._messageWidget));
    };
    MessageController.prototype._onDidAttemptReadOnlyEdit = function () {
        this.showMessage(nls.localize('editor.readonly', "Cannot edit in read-only editor"), this._editor.getPosition());
    };
    MessageController._id = 'editor.contrib.messageController';
    MessageController.MESSAGE_VISIBLE = new RawContextKey('messageVisible', false);
    MessageController = __decorate([
        __param(1, IContextKeyService)
    ], MessageController);
    return MessageController;
}(Disposable));
export { MessageController };
var MessageCommand = EditorCommand.bindToContribution(MessageController.get);
registerEditorCommand(new MessageCommand({
    id: 'leaveEditorMessage',
    precondition: MessageController.MESSAGE_VISIBLE,
    handler: function (c) { return c.closeMessage(); },
    kbOpts: {
        weight: KeybindingsRegistry.WEIGHT.editorContrib(30),
        primary: 9 /* Escape */
    }
}));
var MessageWidget = /** @class */ (function () {
    function MessageWidget(editor, _a, text) {
        var lineNumber = _a.lineNumber, column = _a.column;
        // Editor.IContentWidget.allowEditorOverflow
        this.allowEditorOverflow = true;
        this.suppressMouseDown = false;
        this._editor = editor;
        this._editor.revealLinesInCenterIfOutsideViewport(lineNumber, lineNumber, 0 /* Smooth */);
        this._position = { lineNumber: lineNumber, column: column - 1 };
        this._domNode = document.createElement('div');
        this._domNode.classList.add('monaco-editor-overlaymessage');
        var message = document.createElement('div');
        message.classList.add('message');
        message.textContent = text;
        this._domNode.appendChild(message);
        var anchor = document.createElement('div');
        anchor.classList.add('anchor');
        this._domNode.appendChild(anchor);
        this._editor.addContentWidget(this);
        this._domNode.classList.add('fadeIn');
    }
    MessageWidget.fadeOut = function (messageWidget) {
        var handle;
        var dispose = function () {
            messageWidget.dispose();
            clearTimeout(handle);
            messageWidget.getDomNode().removeEventListener('animationend', dispose);
        };
        handle = setTimeout(dispose, 110);
        messageWidget.getDomNode().addEventListener('animationend', dispose);
        messageWidget.getDomNode().classList.add('fadeOut');
        return { dispose: dispose };
    };
    MessageWidget.prototype.dispose = function () {
        this._editor.removeContentWidget(this);
    };
    MessageWidget.prototype.getId = function () {
        return 'messageoverlay';
    };
    MessageWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    MessageWidget.prototype.getPosition = function () {
        return { position: this._position, preference: [ContentWidgetPositionPreference.ABOVE] };
    };
    return MessageWidget;
}());
registerEditorContribution(MessageController);
registerThemingParticipant(function (theme, collector) {
    var border = theme.getColor(inputValidationInfoBorder);
    if (border) {
        var borderWidth = theme.type === HIGH_CONTRAST ? 2 : 1;
        collector.addRule(".monaco-editor .monaco-editor-overlaymessage .anchor { border-top-color: " + border + "; }");
        collector.addRule(".monaco-editor .monaco-editor-overlaymessage .message { border: " + borderWidth + "px solid " + border + "; }");
    }
    var background = theme.getColor(inputValidationInfoBackground);
    if (background) {
        collector.addRule(".monaco-editor .monaco-editor-overlaymessage .message { background-color: " + background + "; }");
    }
});
