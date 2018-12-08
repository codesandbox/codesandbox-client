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
import './textAreaHandler.css';
import * as browser from '../../../base/browser/browser.js';
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import * as platform from '../../../base/common/platform.js';
import * as strings from '../../../base/common/strings.js';
import { Configuration } from '../config/configuration.js';
import { CopyOptions, TextAreaInput } from './textAreaInput.js';
import { PagedScreenReaderStrategy, TextAreaState } from './textAreaState.js';
import { PartFingerprints, ViewPart } from '../view/viewPart.js';
import { LineNumbersOverlay } from '../viewParts/lineNumbers/lineNumbers.js';
import { Margin } from '../viewParts/margin/margin.js';
import { getMapForWordSeparators } from '../../common/controller/wordCharacterClassifier.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import * as viewEvents from '../../common/view/viewEvents.js';
var VisibleTextAreaData = /** @class */ (function () {
    function VisibleTextAreaData(top, left, width) {
        this.top = top;
        this.left = left;
        this.width = width;
    }
    VisibleTextAreaData.prototype.setWidth = function (width) {
        return new VisibleTextAreaData(this.top, this.left, width);
    };
    return VisibleTextAreaData;
}());
var canUseZeroSizeTextarea = (browser.isEdgeOrIE || browser.isFirefox);
/**
 * Every time we write to the clipboard, we record a bit of extra metadata here.
 * Every time we read from the cipboard, if the text matches our last written text,
 * we can fetch the previous metadata.
 */
var LocalClipboardMetadataManager = /** @class */ (function () {
    function LocalClipboardMetadataManager() {
        this._lastState = null;
    }
    LocalClipboardMetadataManager.prototype.set = function (state) {
        this._lastState = state;
    };
    LocalClipboardMetadataManager.prototype.get = function (pastedText) {
        if (this._lastState && this._lastState.lastCopiedValue === pastedText) {
            // match!
            return this._lastState;
        }
        this._lastState = null;
        return null;
    };
    LocalClipboardMetadataManager.INSTANCE = new LocalClipboardMetadataManager();
    return LocalClipboardMetadataManager;
}());
var TextAreaHandler = /** @class */ (function (_super) {
    __extends(TextAreaHandler, _super);
    function TextAreaHandler(context, viewController, viewHelper) {
        var _this = _super.call(this, context) || this;
        // --- end view API
        _this._primaryCursorVisibleRange = null;
        _this._viewController = viewController;
        _this._viewHelper = viewHelper;
        var conf = _this._context.configuration.editor;
        _this._accessibilitySupport = conf.accessibilitySupport;
        _this._contentLeft = conf.layoutInfo.contentLeft;
        _this._contentWidth = conf.layoutInfo.contentWidth;
        _this._contentHeight = conf.layoutInfo.contentHeight;
        _this._scrollLeft = 0;
        _this._scrollTop = 0;
        _this._fontInfo = conf.fontInfo;
        _this._lineHeight = conf.lineHeight;
        _this._emptySelectionClipboard = conf.emptySelectionClipboard;
        _this._copyWithSyntaxHighlighting = conf.copyWithSyntaxHighlighting;
        _this._visibleTextArea = null;
        _this._selections = [new Selection(1, 1, 1, 1)];
        // Text Area (The focus will always be in the textarea when the cursor is blinking)
        _this.textArea = createFastDomNode(document.createElement('textarea'));
        PartFingerprints.write(_this.textArea, 6 /* TextArea */);
        _this.textArea.setClassName('inputarea');
        _this.textArea.setAttribute('wrap', 'off');
        _this.textArea.setAttribute('autocorrect', 'off');
        _this.textArea.setAttribute('autocapitalize', 'off');
        _this.textArea.setAttribute('autocomplete', 'off');
        _this.textArea.setAttribute('spellcheck', 'false');
        _this.textArea.setAttribute('aria-label', conf.viewInfo.ariaLabel);
        _this.textArea.setAttribute('role', 'textbox');
        _this.textArea.setAttribute('aria-multiline', 'true');
        _this.textArea.setAttribute('aria-haspopup', 'false');
        _this.textArea.setAttribute('aria-autocomplete', 'both');
        _this.textAreaCover = createFastDomNode(document.createElement('div'));
        _this.textAreaCover.setPosition('absolute');
        var simpleModel = {
            getLineCount: function () {
                return _this._context.model.getLineCount();
            },
            getLineMaxColumn: function (lineNumber) {
                return _this._context.model.getLineMaxColumn(lineNumber);
            },
            getValueInRange: function (range, eol) {
                return _this._context.model.getValueInRange(range, eol);
            }
        };
        var textAreaInputHost = {
            getPlainTextToCopy: function () {
                var rawWhatToCopy = _this._context.model.getPlainTextToCopy(_this._selections, _this._emptySelectionClipboard, platform.isWindows);
                var newLineCharacter = _this._context.model.getEOL();
                var isFromEmptySelection = (_this._emptySelectionClipboard && _this._selections.length === 1 && _this._selections[0].isEmpty());
                var multicursorText = (Array.isArray(rawWhatToCopy) ? rawWhatToCopy : null);
                var whatToCopy = (Array.isArray(rawWhatToCopy) ? rawWhatToCopy.join(newLineCharacter) : rawWhatToCopy);
                var metadata = null;
                if (isFromEmptySelection || multicursorText) {
                    // Only store the non-default metadata
                    // When writing "LINE\r\n" to the clipboard and then pasting,
                    // Firefox pastes "LINE\n", so let's work around this quirk
                    var lastCopiedValue = (browser.isFirefox ? whatToCopy.replace(/\r\n/g, '\n') : whatToCopy);
                    metadata = {
                        lastCopiedValue: lastCopiedValue,
                        isFromEmptySelection: (_this._emptySelectionClipboard && _this._selections.length === 1 && _this._selections[0].isEmpty()),
                        multicursorText: multicursorText
                    };
                }
                LocalClipboardMetadataManager.INSTANCE.set(metadata);
                return whatToCopy;
            },
            getHTMLToCopy: function () {
                if (!_this._copyWithSyntaxHighlighting && !CopyOptions.forceCopyWithSyntaxHighlighting) {
                    return null;
                }
                return _this._context.model.getHTMLToCopy(_this._selections, _this._emptySelectionClipboard);
            },
            getScreenReaderContent: function (currentState) {
                if (browser.isIPad) {
                    // Do not place anything in the textarea for the iPad
                    return TextAreaState.EMPTY;
                }
                if (_this._accessibilitySupport === 1 /* Disabled */) {
                    // We know for a fact that a screen reader is not attached
                    // On OSX, we write the character before the cursor to allow for "long-press" composition
                    // Also on OSX, we write the word before the cursor to allow for the Accessibility Keyboard to give good hints
                    if (platform.isMacintosh) {
                        var selection = _this._selections[0];
                        if (selection.isEmpty()) {
                            var position = selection.getStartPosition();
                            var textBefore = _this._getWordBeforePosition(position);
                            if (textBefore.length === 0) {
                                textBefore = _this._getCharacterBeforePosition(position);
                            }
                            if (textBefore.length > 0) {
                                return new TextAreaState(textBefore, textBefore.length, textBefore.length, position, position);
                            }
                        }
                    }
                    return TextAreaState.EMPTY;
                }
                return PagedScreenReaderStrategy.fromEditorSelection(currentState, simpleModel, _this._selections[0], _this._accessibilitySupport === 0 /* Unknown */);
            },
            deduceModelPosition: function (viewAnchorPosition, deltaOffset, lineFeedCnt) {
                return _this._context.model.deduceModelPositionRelativeToViewPosition(viewAnchorPosition, deltaOffset, lineFeedCnt);
            }
        };
        _this._textAreaInput = _this._register(new TextAreaInput(textAreaInputHost, _this.textArea));
        _this._register(_this._textAreaInput.onKeyDown(function (e) {
            _this._viewController.emitKeyDown(e);
        }));
        _this._register(_this._textAreaInput.onKeyUp(function (e) {
            _this._viewController.emitKeyUp(e);
        }));
        _this._register(_this._textAreaInput.onPaste(function (e) {
            var metadata = LocalClipboardMetadataManager.INSTANCE.get(e.text);
            var pasteOnNewLine = false;
            var multicursorText = null;
            if (metadata) {
                pasteOnNewLine = (_this._emptySelectionClipboard && metadata.isFromEmptySelection);
                multicursorText = metadata.multicursorText;
            }
            _this._viewController.paste('keyboard', e.text, pasteOnNewLine, multicursorText);
        }));
        _this._register(_this._textAreaInput.onCut(function () {
            _this._viewController.cut('keyboard');
        }));
        _this._register(_this._textAreaInput.onType(function (e) {
            if (e.replaceCharCnt) {
                _this._viewController.replacePreviousChar('keyboard', e.text, e.replaceCharCnt);
            }
            else {
                _this._viewController.type('keyboard', e.text);
            }
        }));
        _this._register(_this._textAreaInput.onSelectionChangeRequest(function (modelSelection) {
            _this._viewController.setSelection('keyboard', modelSelection);
        }));
        _this._register(_this._textAreaInput.onCompositionStart(function () {
            var lineNumber = _this._selections[0].startLineNumber;
            var column = _this._selections[0].startColumn;
            _this._context.privateViewEventBus.emit(new viewEvents.ViewRevealRangeRequestEvent(new Range(lineNumber, column, lineNumber, column), 0 /* Simple */, true, 1 /* Immediate */));
            // Find range pixel position
            var visibleRange = _this._viewHelper.visibleRangeForPositionRelativeToEditor(lineNumber, column);
            if (visibleRange) {
                _this._visibleTextArea = new VisibleTextAreaData(_this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber), visibleRange.left, canUseZeroSizeTextarea ? 0 : 1);
                _this._render();
            }
            // Show the textarea
            _this.textArea.setClassName('inputarea ime-input');
            _this._viewController.compositionStart('keyboard');
        }));
        _this._register(_this._textAreaInput.onCompositionUpdate(function (e) {
            if (browser.isEdgeOrIE) {
                // Due to isEdgeOrIE (where the textarea was not cleared initially)
                // we cannot assume the text consists only of the composited text
                _this._visibleTextArea = _this._visibleTextArea.setWidth(0);
            }
            else {
                // adjust width by its size
                _this._visibleTextArea = _this._visibleTextArea.setWidth(measureText(e.data, _this._fontInfo));
            }
            _this._render();
        }));
        _this._register(_this._textAreaInput.onCompositionEnd(function () {
            _this._visibleTextArea = null;
            _this._render();
            _this.textArea.setClassName('inputarea');
            _this._viewController.compositionEnd('keyboard');
        }));
        _this._register(_this._textAreaInput.onFocus(function () {
            _this._context.privateViewEventBus.emit(new viewEvents.ViewFocusChangedEvent(true));
        }));
        _this._register(_this._textAreaInput.onBlur(function () {
            _this._context.privateViewEventBus.emit(new viewEvents.ViewFocusChangedEvent(false));
        }));
        return _this;
    }
    TextAreaHandler.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    TextAreaHandler.prototype._getWordBeforePosition = function (position) {
        var lineContent = this._context.model.getLineContent(position.lineNumber);
        var wordSeparators = getMapForWordSeparators(this._context.configuration.editor.wordSeparators);
        var column = position.column;
        var distance = 0;
        while (column > 1) {
            var charCode = lineContent.charCodeAt(column - 2);
            var charClass = wordSeparators.get(charCode);
            if (charClass !== 0 /* Regular */ || distance > 50) {
                return lineContent.substring(column - 1, position.column - 1);
            }
            distance++;
            column--;
        }
        return lineContent.substring(0, position.column - 1);
    };
    TextAreaHandler.prototype._getCharacterBeforePosition = function (position) {
        if (position.column > 1) {
            var lineContent = this._context.model.getLineContent(position.lineNumber);
            var charBefore = lineContent.charAt(position.column - 2);
            if (!strings.isHighSurrogate(charBefore.charCodeAt(0))) {
                return charBefore;
            }
        }
        return '';
    };
    // --- begin event handlers
    TextAreaHandler.prototype.onConfigurationChanged = function (e) {
        var conf = this._context.configuration.editor;
        if (e.fontInfo) {
            this._fontInfo = conf.fontInfo;
        }
        if (e.viewInfo) {
            this.textArea.setAttribute('aria-label', conf.viewInfo.ariaLabel);
        }
        if (e.layoutInfo) {
            this._contentLeft = conf.layoutInfo.contentLeft;
            this._contentWidth = conf.layoutInfo.contentWidth;
            this._contentHeight = conf.layoutInfo.contentHeight;
        }
        if (e.lineHeight) {
            this._lineHeight = conf.lineHeight;
        }
        if (e.accessibilitySupport) {
            this._accessibilitySupport = conf.accessibilitySupport;
            this._textAreaInput.writeScreenReaderContent('strategy changed');
        }
        if (e.emptySelectionClipboard) {
            this._emptySelectionClipboard = conf.emptySelectionClipboard;
        }
        if (e.copyWithSyntaxHighlighting) {
            this._copyWithSyntaxHighlighting = conf.copyWithSyntaxHighlighting;
        }
        return true;
    };
    TextAreaHandler.prototype.onCursorStateChanged = function (e) {
        this._selections = e.selections.slice(0);
        this._textAreaInput.writeScreenReaderContent('selection changed');
        return true;
    };
    TextAreaHandler.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations that can end up relayouting text
        return true;
    };
    TextAreaHandler.prototype.onFlushed = function (e) {
        return true;
    };
    TextAreaHandler.prototype.onLinesChanged = function (e) {
        return true;
    };
    TextAreaHandler.prototype.onLinesDeleted = function (e) {
        return true;
    };
    TextAreaHandler.prototype.onLinesInserted = function (e) {
        return true;
    };
    TextAreaHandler.prototype.onScrollChanged = function (e) {
        this._scrollLeft = e.scrollLeft;
        this._scrollTop = e.scrollTop;
        return true;
    };
    TextAreaHandler.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    // --- begin view API
    TextAreaHandler.prototype.isFocused = function () {
        return this._textAreaInput.isFocused();
    };
    TextAreaHandler.prototype.focusTextArea = function () {
        this._textAreaInput.focusTextArea();
    };
    TextAreaHandler.prototype.prepareRender = function (ctx) {
        if (this._accessibilitySupport === 2 /* Enabled */) {
            // Do not move the textarea with the cursor, as this generates accessibility events that might confuse screen readers
            // See https://github.com/Microsoft/vscode/issues/26730
            this._primaryCursorVisibleRange = null;
        }
        else {
            var primaryCursorPosition = new Position(this._selections[0].positionLineNumber, this._selections[0].positionColumn);
            this._primaryCursorVisibleRange = ctx.visibleRangeForPosition(primaryCursorPosition);
        }
    };
    TextAreaHandler.prototype.render = function (ctx) {
        this._textAreaInput.writeScreenReaderContent('render');
        this._render();
    };
    TextAreaHandler.prototype._render = function () {
        if (this._visibleTextArea) {
            // The text area is visible for composition reasons
            this._renderInsideEditor(this._visibleTextArea.top - this._scrollTop, this._contentLeft + this._visibleTextArea.left - this._scrollLeft, this._visibleTextArea.width, this._lineHeight, true);
            return;
        }
        if (!this._primaryCursorVisibleRange) {
            // The primary cursor is outside the viewport => place textarea to the top left
            this._renderAtTopLeft();
            return;
        }
        var left = this._contentLeft + this._primaryCursorVisibleRange.left - this._scrollLeft;
        if (left < this._contentLeft || left > this._contentLeft + this._contentWidth) {
            // cursor is outside the viewport
            this._renderAtTopLeft();
            return;
        }
        var top = this._context.viewLayout.getVerticalOffsetForLineNumber(this._selections[0].positionLineNumber) - this._scrollTop;
        if (top < 0 || top > this._contentHeight) {
            // cursor is outside the viewport
            this._renderAtTopLeft();
            return;
        }
        // The primary cursor is in the viewport (at least vertically) => place textarea on the cursor
        this._renderInsideEditor(top, left, canUseZeroSizeTextarea ? 0 : 1, canUseZeroSizeTextarea ? 0 : 1, false);
    };
    TextAreaHandler.prototype._renderInsideEditor = function (top, left, width, height, useEditorFont) {
        var ta = this.textArea;
        var tac = this.textAreaCover;
        if (useEditorFont) {
            Configuration.applyFontInfo(ta, this._fontInfo);
        }
        else {
            ta.setFontSize(1);
            ta.setLineHeight(this._fontInfo.lineHeight);
        }
        ta.setTop(top);
        ta.setLeft(left);
        ta.setWidth(width);
        ta.setHeight(height);
        tac.setTop(0);
        tac.setLeft(0);
        tac.setWidth(0);
        tac.setHeight(0);
    };
    TextAreaHandler.prototype._renderAtTopLeft = function () {
        var ta = this.textArea;
        var tac = this.textAreaCover;
        Configuration.applyFontInfo(ta, this._fontInfo);
        ta.setTop(0);
        ta.setLeft(0);
        tac.setTop(0);
        tac.setLeft(0);
        if (canUseZeroSizeTextarea) {
            ta.setWidth(0);
            ta.setHeight(0);
            tac.setWidth(0);
            tac.setHeight(0);
            return;
        }
        // (in WebKit the textarea is 1px by 1px because it cannot handle input to a 0x0 textarea)
        // specifically, when doing Korean IME, setting the textare to 0x0 breaks IME badly.
        ta.setWidth(1);
        ta.setHeight(1);
        tac.setWidth(1);
        tac.setHeight(1);
        if (this._context.configuration.editor.viewInfo.glyphMargin) {
            tac.setClassName('monaco-editor-background textAreaCover ' + Margin.OUTER_CLASS_NAME);
        }
        else {
            if (this._context.configuration.editor.viewInfo.renderLineNumbers !== 0 /* Off */) {
                tac.setClassName('monaco-editor-background textAreaCover ' + LineNumbersOverlay.CLASS_NAME);
            }
            else {
                tac.setClassName('monaco-editor-background textAreaCover');
            }
        }
    };
    return TextAreaHandler;
}(ViewPart));
export { TextAreaHandler };
function measureText(text, fontInfo) {
    // adjust width by its size
    var canvasElem = document.createElement('canvas');
    var context = canvasElem.getContext('2d');
    context.font = createFontString(fontInfo);
    var metrics = context.measureText(text);
    if (browser.isFirefox) {
        return metrics.width + 2; // +2 for Japanese...
    }
    else {
        return metrics.width;
    }
}
function createFontString(bareFontInfo) {
    return doCreateFontString('normal', bareFontInfo.fontWeight, bareFontInfo.fontSize, bareFontInfo.lineHeight, bareFontInfo.fontFamily);
}
function doCreateFontString(fontStyle, fontWeight, fontSize, lineHeight, fontFamily) {
    // The full font syntax is:
    // style | variant | weight | stretch | size/line-height | fontFamily
    // (https://developer.mozilla.org/en-US/docs/Web/CSS/font)
    // But it appears Edge and IE11 cannot properly parse `stretch`.
    return fontStyle + " normal " + fontWeight + " " + fontSize + "px / " + lineHeight + "px " + fontFamily;
}
