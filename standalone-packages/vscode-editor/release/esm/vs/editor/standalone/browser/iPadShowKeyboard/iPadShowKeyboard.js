/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './iPadShowKeyboard.css';
import * as browser from '../../../../base/browser/browser.js';
import * as dom from '../../../../base/browser/dom.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { registerEditorContribution } from '../../../browser/editorExtensions.js';
var IPadShowKeyboard = /** @class */ (function () {
    function IPadShowKeyboard(editor) {
        var _this = this;
        this.editor = editor;
        this.toDispose = [];
        if (browser.isIPad) {
            this.toDispose.push(editor.onDidChangeConfiguration(function () { return _this.update(); }));
            this.update();
        }
    }
    IPadShowKeyboard.prototype.update = function () {
        var shouldHaveWidget = (!this.editor.getConfiguration().readOnly);
        if (!this.widget && shouldHaveWidget) {
            this.widget = new ShowKeyboardWidget(this.editor);
        }
        else if (this.widget && !shouldHaveWidget) {
            this.widget.dispose();
            this.widget = null;
        }
    };
    IPadShowKeyboard.prototype.getId = function () {
        return IPadShowKeyboard.ID;
    };
    IPadShowKeyboard.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
        if (this.widget) {
            this.widget.dispose();
            this.widget = null;
        }
    };
    IPadShowKeyboard.ID = 'editor.contrib.iPadShowKeyboard';
    return IPadShowKeyboard;
}());
export { IPadShowKeyboard };
var ShowKeyboardWidget = /** @class */ (function () {
    function ShowKeyboardWidget(editor) {
        var _this = this;
        this.editor = editor;
        this._domNode = document.createElement('textarea');
        this._domNode.className = 'iPadShowKeyboard';
        this._toDispose = [];
        this._toDispose.push(dom.addDisposableListener(this._domNode, 'touchstart', function (e) {
            _this.editor.focus();
        }));
        this._toDispose.push(dom.addDisposableListener(this._domNode, 'focus', function (e) {
            _this.editor.focus();
        }));
        this.editor.addOverlayWidget(this);
    }
    ShowKeyboardWidget.prototype.dispose = function () {
        this.editor.removeOverlayWidget(this);
        this._toDispose = dispose(this._toDispose);
    };
    // ----- IOverlayWidget API
    ShowKeyboardWidget.prototype.getId = function () {
        return ShowKeyboardWidget.ID;
    };
    ShowKeyboardWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    ShowKeyboardWidget.prototype.getPosition = function () {
        return {
            preference: 1 /* BOTTOM_RIGHT_CORNER */
        };
    };
    ShowKeyboardWidget.ID = 'editor.contrib.ShowKeyboardWidget';
    return ShowKeyboardWidget;
}());
registerEditorContribution(IPadShowKeyboard);
