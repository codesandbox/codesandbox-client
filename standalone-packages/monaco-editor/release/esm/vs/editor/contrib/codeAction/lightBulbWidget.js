/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../base/browser/dom.js';
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../../base/browser/globalMouseMoveMonitor.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import './lightBulbWidget.css';
import { ContentWidgetPositionPreference } from '../../browser/editorBrowser.js';
import { TextModel } from '../../common/model/textModel.js';
import { CodeActionKind } from './codeActionTrigger.js';
var LightBulbWidget = /** @class */ (function () {
    function LightBulbWidget(editor) {
        var _this = this;
        this._disposables = [];
        this._onClick = new Emitter();
        this.onClick = this._onClick.event;
        this._futureFixes = new CancellationTokenSource();
        this._domNode = document.createElement('div');
        this._domNode.className = 'lightbulb-glyph';
        this._editor = editor;
        this._editor.addContentWidget(this);
        this._disposables.push(this._editor.onDidChangeModel(function (_) { return _this._futureFixes.cancel(); }));
        this._disposables.push(this._editor.onDidChangeModelLanguage(function (_) { return _this._futureFixes.cancel(); }));
        this._disposables.push(this._editor.onDidChangeModelContent(function (_) {
            // cancel when the line in question has been removed
            if (_this._model && _this.model.position.lineNumber >= _this._editor.getModel().getLineCount()) {
                _this._futureFixes.cancel();
            }
        }));
        this._disposables.push(dom.addStandardDisposableListener(this._domNode, 'click', function (e) {
            // Make sure that focus / cursor location is not lost when clicking widget icon
            _this._editor.focus();
            // a bit of extra work to make sure the menu
            // doesn't cover the line-text
            var _a = dom.getDomNodePagePosition(_this._domNode), top = _a.top, height = _a.height;
            var lineHeight = _this._editor.getConfiguration().lineHeight;
            var pad = Math.floor(lineHeight / 3);
            if (_this._position && _this._position.position.lineNumber < _this._model.position.lineNumber) {
                pad += lineHeight;
            }
            _this._onClick.fire({
                x: e.posx,
                y: top + height + pad
            });
        }));
        this._disposables.push(dom.addDisposableListener(this._domNode, 'mouseenter', function (e) {
            if ((e.buttons & 1) !== 1) {
                return;
            }
            // mouse enters lightbulb while the primary/left button
            // is being pressed -> hide the lightbulb and block future
            // showings until mouse is released
            _this.hide();
            var monitor = new GlobalMouseMoveMonitor();
            monitor.startMonitoring(standardMouseMoveMerger, function () { }, function () {
                monitor.dispose();
            });
        }));
        this._disposables.push(this._editor.onDidChangeConfiguration(function (e) {
            // hide when told to do so
            if (e.contribInfo && !_this._editor.getConfiguration().contribInfo.lightbulbEnabled) {
                _this.hide();
            }
        }));
    }
    LightBulbWidget.prototype.dispose = function () {
        dispose(this._disposables);
        this._editor.removeContentWidget(this);
    };
    LightBulbWidget.prototype.getId = function () {
        return 'LightBulbWidget';
    };
    LightBulbWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    LightBulbWidget.prototype.getPosition = function () {
        return this._position;
    };
    Object.defineProperty(LightBulbWidget.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (value) {
            var _this = this;
            if (this._position && (!value.position || this._position.position.lineNumber !== value.position.lineNumber)) {
                // hide when getting a 'hide'-request or when currently
                // showing on another line
                this.hide();
            }
            else if (this._futureFixes) {
                // cancel pending show request in any case
                this._futureFixes.cancel();
            }
            this._futureFixes = new CancellationTokenSource();
            var token = this._futureFixes.token;
            this._model = value;
            var selection = this._model.rangeOrSelection;
            this._model.actions.then(function (fixes) {
                if (!token.isCancellationRequested && fixes && fixes.length > 0) {
                    if (selection.isEmpty() && fixes.every(function (fix) { return fix.kind && CodeActionKind.Refactor.contains(fix.kind); })) {
                        _this.hide();
                    }
                    else {
                        _this._show();
                    }
                }
                else {
                    _this.hide();
                }
            }).catch(function (err) {
                _this.hide();
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightBulbWidget.prototype, "title", {
        get: function () {
            return this._domNode.title;
        },
        set: function (value) {
            this._domNode.title = value;
        },
        enumerable: true,
        configurable: true
    });
    LightBulbWidget.prototype._show = function () {
        var config = this._editor.getConfiguration();
        if (!config.contribInfo.lightbulbEnabled) {
            return;
        }
        var lineNumber = this._model.position.lineNumber;
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        var tabSize = model.getOptions().tabSize;
        var lineContent = model.getLineContent(lineNumber);
        var indent = TextModel.computeIndentLevel(lineContent, tabSize);
        var lineHasSpace = config.fontInfo.spaceWidth * indent > 22;
        var effectiveLineNumber = lineNumber;
        if (!lineHasSpace) {
            if (lineNumber > 1) {
                effectiveLineNumber -= 1;
            }
            else {
                effectiveLineNumber += 1;
            }
        }
        this._position = {
            position: { lineNumber: effectiveLineNumber, column: 1 },
            preference: LightBulbWidget._posPref
        };
        this._editor.layoutContentWidget(this);
    };
    LightBulbWidget.prototype.hide = function () {
        this._position = null;
        this._model = null;
        this._futureFixes.cancel();
        this._editor.layoutContentWidget(this);
    };
    LightBulbWidget._posPref = [ContentWidgetPositionPreference.EXACT];
    return LightBulbWidget;
}());
export { LightBulbWidget };
