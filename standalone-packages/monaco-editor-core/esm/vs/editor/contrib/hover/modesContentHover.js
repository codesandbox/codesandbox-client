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
import * as nls from '../../../nls';
import * as dom from '../../../base/browser/dom';
import { Range } from '../../common/core/range';
import { Position } from '../../common/core/position';
import { HoverProviderRegistry } from '../../common/modes';
import { getHover } from './getHover';
import { HoverOperation } from './hoverOperation';
import { ContentHoverWidget } from './hoverWidgets';
import { MarkdownString, isEmptyMarkdownString, markedStringsEquals } from '../../../base/common/htmlContent';
import { ModelDecorationOptions } from '../../common/model/textModel';
import { ColorPickerModel } from '../colorPicker/colorPickerModel';
import { ColorPickerWidget } from '../colorPicker/colorPickerWidget';
import { ColorDetector } from '../colorPicker/colorDetector';
import { Color, RGBA } from '../../../base/common/color';
import { Disposable, combinedDisposable } from '../../../base/common/lifecycle';
import { getColorPresentations } from '../colorPicker/color';
import { CancellationToken } from '../../../base/common/cancellation';
var $ = dom.$;
var ColorHover = /** @class */ (function () {
    function ColorHover(range, color, provider) {
        this.range = range;
        this.color = color;
        this.provider = provider;
    }
    return ColorHover;
}());
var ModesContentComputer = /** @class */ (function () {
    function ModesContentComputer(editor) {
        this._editor = editor;
        this._range = null;
    }
    ModesContentComputer.prototype.setRange = function (range) {
        this._range = range;
        this._result = [];
    };
    ModesContentComputer.prototype.clearResult = function () {
        this._result = [];
    };
    ModesContentComputer.prototype.computeAsync = function (token) {
        var model = this._editor.getModel();
        if (!HoverProviderRegistry.has(model)) {
            return Promise.resolve(null);
        }
        return getHover(model, new Position(this._range.startLineNumber, this._range.startColumn), token);
    };
    ModesContentComputer.prototype.computeSync = function () {
        var _this = this;
        var lineNumber = this._range.startLineNumber;
        if (lineNumber > this._editor.getModel().getLineCount()) {
            // Illegal line number => no results
            return [];
        }
        var colorDetector = ColorDetector.get(this._editor);
        var maxColumn = this._editor.getModel().getLineMaxColumn(lineNumber);
        var lineDecorations = this._editor.getLineDecorations(lineNumber);
        var didFindColor = false;
        var result = lineDecorations.map(function (d) {
            var startColumn = (d.range.startLineNumber === lineNumber) ? d.range.startColumn : 1;
            var endColumn = (d.range.endLineNumber === lineNumber) ? d.range.endColumn : maxColumn;
            if (startColumn > _this._range.startColumn || _this._range.endColumn > endColumn) {
                return null;
            }
            var range = new Range(_this._range.startLineNumber, startColumn, _this._range.startLineNumber, endColumn);
            var colorData = colorDetector.getColorData(d.range.getStartPosition());
            if (!didFindColor && colorData) {
                didFindColor = true;
                var _a = colorData.colorInfo, color = _a.color, range_1 = _a.range;
                return new ColorHover(range_1, color, colorData.provider);
            }
            else {
                if (isEmptyMarkdownString(d.options.hoverMessage)) {
                    return null;
                }
                var contents = void 0;
                if (d.options.hoverMessage) {
                    if (Array.isArray(d.options.hoverMessage)) {
                        contents = d.options.hoverMessage.slice();
                    }
                    else {
                        contents = [d.options.hoverMessage];
                    }
                }
                return { contents: contents, range: range };
            }
        });
        return result.filter(function (d) { return !!d; });
    };
    ModesContentComputer.prototype.onResult = function (result, isFromSynchronousComputation) {
        // Always put synchronous messages before asynchronous ones
        if (isFromSynchronousComputation) {
            this._result = result.concat(this._result.sort(function (a, b) {
                if (a instanceof ColorHover) { // sort picker messages at to the top
                    return -1;
                }
                else if (b instanceof ColorHover) {
                    return 1;
                }
                return 0;
            }));
        }
        else {
            this._result = this._result.concat(result);
        }
    };
    ModesContentComputer.prototype.getResult = function () {
        return this._result.slice(0);
    };
    ModesContentComputer.prototype.getResultWithLoadingMessage = function () {
        return this._result.slice(0).concat([this._getLoadingMessage()]);
    };
    ModesContentComputer.prototype._getLoadingMessage = function () {
        return {
            range: this._range,
            contents: [new MarkdownString().appendText(nls.localize('modesContentHover.loading', "Loading..."))]
        };
    };
    return ModesContentComputer;
}());
var ModesContentHoverWidget = /** @class */ (function (_super) {
    __extends(ModesContentHoverWidget, _super);
    function ModesContentHoverWidget(editor, markdownRenderer, _themeService) {
        var _this = _super.call(this, ModesContentHoverWidget.ID, editor) || this;
        _this._themeService = _themeService;
        _this.renderDisposable = Disposable.None;
        _this._computer = new ModesContentComputer(_this._editor);
        _this._highlightDecorations = [];
        _this._isChangingDecorations = false;
        _this._markdownRenderer = markdownRenderer;
        _this._register(markdownRenderer.onDidRenderCodeBlock(_this.onContentsChange, _this));
        _this._hoverOperation = new HoverOperation(_this._computer, function (result) { return _this._withResult(result, true); }, null, function (result) { return _this._withResult(result, false); });
        _this._register(dom.addStandardDisposableListener(_this.getDomNode(), dom.EventType.FOCUS, function () {
            if (_this._colorPicker) {
                dom.addClass(_this.getDomNode(), 'colorpicker-hover');
            }
        }));
        _this._register(dom.addStandardDisposableListener(_this.getDomNode(), dom.EventType.BLUR, function () {
            dom.removeClass(_this.getDomNode(), 'colorpicker-hover');
        }));
        _this._register(editor.onDidChangeConfiguration(function (e) {
            _this._hoverOperation.setHoverTime(_this._editor.getConfiguration().contribInfo.hover.delay);
        }));
        return _this;
    }
    ModesContentHoverWidget.prototype.dispose = function () {
        this.renderDisposable.dispose();
        this.renderDisposable = Disposable.None;
        this._hoverOperation.cancel();
        _super.prototype.dispose.call(this);
    };
    ModesContentHoverWidget.prototype.onModelDecorationsChanged = function () {
        if (this._isChangingDecorations) {
            return;
        }
        if (this.isVisible) {
            // The decorations have changed and the hover is visible,
            // we need to recompute the displayed text
            this._hoverOperation.cancel();
            this._computer.clearResult();
            if (!this._colorPicker) { // TODO@Michel ensure that displayed text for other decorations is computed even if color picker is in place
                this._hoverOperation.start(0 /* Delayed */);
            }
        }
    };
    ModesContentHoverWidget.prototype.startShowingAt = function (range, mode, focus) {
        if (this._lastRange && this._lastRange.equalsRange(range)) {
            // We have to show the widget at the exact same range as before, so no work is needed
            return;
        }
        this._hoverOperation.cancel();
        if (this.isVisible) {
            // The range might have changed, but the hover is visible
            // Instead of hiding it completely, filter out messages that are still in the new range and
            // kick off a new computation
            if (this._showAtPosition.lineNumber !== range.startLineNumber) {
                this.hide();
            }
            else {
                var filteredMessages = [];
                for (var i = 0, len = this._messages.length; i < len; i++) {
                    var msg = this._messages[i];
                    var rng = msg.range;
                    if (rng.startColumn <= range.startColumn && rng.endColumn >= range.endColumn) {
                        filteredMessages.push(msg);
                    }
                }
                if (filteredMessages.length > 0) {
                    if (hoverContentsEquals(filteredMessages, this._messages)) {
                        return;
                    }
                    this._renderMessages(range, filteredMessages);
                }
                else {
                    this.hide();
                }
            }
        }
        this._lastRange = range;
        this._computer.setRange(range);
        this._shouldFocus = focus;
        this._hoverOperation.start(mode);
    };
    ModesContentHoverWidget.prototype.hide = function () {
        this._lastRange = null;
        this._hoverOperation.cancel();
        _super.prototype.hide.call(this);
        this._isChangingDecorations = true;
        this._highlightDecorations = this._editor.deltaDecorations(this._highlightDecorations, []);
        this._isChangingDecorations = false;
        this.renderDisposable.dispose();
        this.renderDisposable = Disposable.None;
        this._colorPicker = null;
    };
    ModesContentHoverWidget.prototype.isColorPickerVisible = function () {
        if (this._colorPicker) {
            return true;
        }
        return false;
    };
    ModesContentHoverWidget.prototype._withResult = function (result, complete) {
        this._messages = result;
        if (this._lastRange && this._messages.length > 0) {
            this._renderMessages(this._lastRange, this._messages);
        }
        else if (complete) {
            this.hide();
        }
    };
    ModesContentHoverWidget.prototype._renderMessages = function (renderRange, messages) {
        var _this = this;
        this.renderDisposable.dispose();
        this._colorPicker = null;
        // update column from which to show
        var renderColumn = Number.MAX_VALUE;
        var highlightRange = Range.lift(messages[0].range);
        var fragment = document.createDocumentFragment();
        var isEmptyHoverContent = true;
        var containColorPicker = false;
        var markdownDisposeable;
        messages.forEach(function (msg) {
            if (!msg.range) {
                return;
            }
            renderColumn = Math.min(renderColumn, msg.range.startColumn);
            highlightRange = Range.plusRange(highlightRange, msg.range);
            if (!(msg instanceof ColorHover)) {
                msg.contents
                    .filter(function (contents) { return !isEmptyMarkdownString(contents); })
                    .forEach(function (contents) {
                    var renderedContents = _this._markdownRenderer.render(contents);
                    markdownDisposeable = renderedContents;
                    fragment.appendChild($('div.hover-row', null, renderedContents.element));
                    isEmptyHoverContent = false;
                });
            }
            else {
                containColorPicker = true;
                var _a = msg.color, red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha;
                var rgba = new RGBA(red * 255, green * 255, blue * 255, alpha);
                var color_1 = new Color(rgba);
                var editorModel_1 = _this._editor.getModel();
                var range_2 = new Range(msg.range.startLineNumber, msg.range.startColumn, msg.range.endLineNumber, msg.range.endColumn);
                var colorInfo = { range: msg.range, color: msg.color };
                // create blank olor picker model and widget first to ensure it's positioned correctly.
                var model_1 = new ColorPickerModel(color_1, [], 0);
                var widget_1 = new ColorPickerWidget(fragment, model_1, _this._editor.getConfiguration().pixelRatio, _this._themeService);
                getColorPresentations(editorModel_1, colorInfo, msg.provider, CancellationToken.None).then(function (colorPresentations) {
                    model_1.colorPresentations = colorPresentations;
                    var originalText = _this._editor.getModel().getValueInRange(msg.range);
                    model_1.guessColorPresentation(color_1, originalText);
                    var updateEditorModel = function () {
                        var textEdits;
                        var newRange;
                        if (model_1.presentation.textEdit) {
                            textEdits = [model_1.presentation.textEdit];
                            newRange = new Range(model_1.presentation.textEdit.range.startLineNumber, model_1.presentation.textEdit.range.startColumn, model_1.presentation.textEdit.range.endLineNumber, model_1.presentation.textEdit.range.endColumn);
                            newRange = newRange.setEndPosition(newRange.endLineNumber, newRange.startColumn + model_1.presentation.textEdit.text.length);
                        }
                        else {
                            textEdits = [{ identifier: null, range: range_2, text: model_1.presentation.label, forceMoveMarkers: false }];
                            newRange = range_2.setEndPosition(range_2.endLineNumber, range_2.startColumn + model_1.presentation.label.length);
                        }
                        _this._editor.pushUndoStop();
                        _this._editor.executeEdits('colorpicker', textEdits);
                        if (model_1.presentation.additionalTextEdits) {
                            textEdits = model_1.presentation.additionalTextEdits.slice();
                            _this._editor.executeEdits('colorpicker', textEdits);
                            _this.hide();
                        }
                        _this._editor.pushUndoStop();
                        range_2 = newRange;
                    };
                    var updateColorPresentations = function (color) {
                        return getColorPresentations(editorModel_1, {
                            range: range_2,
                            color: {
                                red: color.rgba.r / 255,
                                green: color.rgba.g / 255,
                                blue: color.rgba.b / 255,
                                alpha: color.rgba.a
                            }
                        }, msg.provider, CancellationToken.None).then(function (colorPresentations) {
                            model_1.colorPresentations = colorPresentations;
                        });
                    };
                    var colorListener = model_1.onColorFlushed(function (color) {
                        updateColorPresentations(color).then(updateEditorModel);
                    });
                    var colorChangeListener = model_1.onDidChangeColor(updateColorPresentations);
                    _this._colorPicker = widget_1;
                    _this.showAt(range_2.getStartPosition(), range_2, _this._shouldFocus);
                    _this.updateContents(fragment);
                    _this._colorPicker.layout();
                    _this.renderDisposable = combinedDisposable([colorListener, colorChangeListener, widget_1, markdownDisposeable]);
                });
            }
        });
        // show
        if (!containColorPicker && !isEmptyHoverContent) {
            this.showAt(new Position(renderRange.startLineNumber, renderColumn), highlightRange, this._shouldFocus);
            this.updateContents(fragment);
        }
        this._isChangingDecorations = true;
        this._highlightDecorations = this._editor.deltaDecorations(this._highlightDecorations, [{
                range: highlightRange,
                options: ModesContentHoverWidget._DECORATION_OPTIONS
            }]);
        this._isChangingDecorations = false;
    };
    ModesContentHoverWidget.ID = 'editor.contrib.modesContentHoverWidget';
    ModesContentHoverWidget._DECORATION_OPTIONS = ModelDecorationOptions.register({
        className: 'hoverHighlight'
    });
    return ModesContentHoverWidget;
}(ContentHoverWidget));
export { ModesContentHoverWidget };
function hoverContentsEquals(first, second) {
    if ((!first && second) || (first && !second) || first.length !== second.length) {
        return false;
    }
    for (var i = 0; i < first.length; i++) {
        var firstElement = first[i];
        var secondElement = second[i];
        if (firstElement instanceof ColorHover) {
            return false;
        }
        if (secondElement instanceof ColorHover) {
            return false;
        }
        if (!markedStringsEquals(firstElement.contents, secondElement.contents)) {
            return false;
        }
    }
    return true;
}
