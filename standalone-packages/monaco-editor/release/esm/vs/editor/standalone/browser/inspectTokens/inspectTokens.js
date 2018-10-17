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
import './inspectTokens.css';
import * as nls from '../../../../nls.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { escape } from '../../../../base/common/strings.js';
import { registerEditorAction, registerEditorContribution, EditorAction } from '../../../browser/editorExtensions.js';
import { ContentWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { IModeService } from '../../../common/services/modeService.js';
import { TokenizationRegistry, TokenMetadata } from '../../../common/modes.js';
import { IStandaloneThemeService } from '../../common/standaloneThemeService.js';
import { NULL_STATE, nullTokenize, nullTokenize2 } from '../../../common/modes/nullMode.js';
import { Color } from '../../../../base/common/color.js';
import { registerThemingParticipant, HIGH_CONTRAST } from '../../../../platform/theme/common/themeService.js';
import { editorHoverBackground, editorHoverBorder } from '../../../../platform/theme/common/colorRegistry.js';
var InspectTokensController = /** @class */ (function (_super) {
    __extends(InspectTokensController, _super);
    function InspectTokensController(editor, standaloneColorService, modeService) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._standaloneThemeService = standaloneColorService;
        _this._modeService = modeService;
        _this._widget = null;
        _this._register(_this._editor.onDidChangeModel(function (e) { return _this.stop(); }));
        _this._register(_this._editor.onDidChangeModelLanguage(function (e) { return _this.stop(); }));
        _this._register(TokenizationRegistry.onDidChange(function (e) { return _this.stop(); }));
        return _this;
    }
    InspectTokensController.get = function (editor) {
        return editor.getContribution(InspectTokensController.ID);
    };
    InspectTokensController.prototype.getId = function () {
        return InspectTokensController.ID;
    };
    InspectTokensController.prototype.dispose = function () {
        this.stop();
        _super.prototype.dispose.call(this);
    };
    InspectTokensController.prototype.launch = function () {
        if (this._widget) {
            return;
        }
        if (!this._editor.getModel()) {
            return;
        }
        this._widget = new InspectTokensWidget(this._editor, this._standaloneThemeService, this._modeService);
    };
    InspectTokensController.prototype.stop = function () {
        if (this._widget) {
            this._widget.dispose();
            this._widget = null;
        }
    };
    InspectTokensController.ID = 'editor.contrib.inspectTokens';
    InspectTokensController = __decorate([
        __param(1, IStandaloneThemeService),
        __param(2, IModeService)
    ], InspectTokensController);
    return InspectTokensController;
}(Disposable));
var InspectTokens = /** @class */ (function (_super) {
    __extends(InspectTokens, _super);
    function InspectTokens() {
        return _super.call(this, {
            id: 'editor.action.inspectTokens',
            label: nls.localize('inspectTokens', "Developer: Inspect Tokens"),
            alias: 'Developer: Inspect Tokens',
            precondition: null
        }) || this;
    }
    InspectTokens.prototype.run = function (accessor, editor) {
        var controller = InspectTokensController.get(editor);
        if (controller) {
            controller.launch();
        }
    };
    return InspectTokens;
}(EditorAction));
function renderTokenText(tokenText) {
    var result = '';
    for (var charIndex = 0, len = tokenText.length; charIndex < len; charIndex++) {
        var charCode = tokenText.charCodeAt(charIndex);
        switch (charCode) {
            case 9 /* Tab */:
                result += '&rarr;';
                break;
            case 32 /* Space */:
                result += '&middot;';
                break;
            case 60 /* LessThan */:
                result += '&lt;';
                break;
            case 62 /* GreaterThan */:
                result += '&gt;';
                break;
            case 38 /* Ampersand */:
                result += '&amp;';
                break;
            default:
                result += String.fromCharCode(charCode);
        }
    }
    return result;
}
function getSafeTokenizationSupport(languageIdentifier) {
    var tokenizationSupport = TokenizationRegistry.get(languageIdentifier.language);
    if (tokenizationSupport) {
        return tokenizationSupport;
    }
    return {
        getInitialState: function () { return NULL_STATE; },
        tokenize: function (line, state, deltaOffset) { return nullTokenize(languageIdentifier.language, line, state, deltaOffset); },
        tokenize2: function (line, state, deltaOffset) { return nullTokenize2(languageIdentifier.id, line, state, deltaOffset); }
    };
}
var InspectTokensWidget = /** @class */ (function (_super) {
    __extends(InspectTokensWidget, _super);
    function InspectTokensWidget(editor, standaloneThemeService, modeService) {
        var _this = _super.call(this) || this;
        // Editor.IContentWidget.allowEditorOverflow
        _this.allowEditorOverflow = true;
        _this._editor = editor;
        _this._modeService = modeService;
        _this._model = _this._editor.getModel();
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'tokens-inspect-widget';
        _this._tokenizationSupport = getSafeTokenizationSupport(_this._model.getLanguageIdentifier());
        _this._compute(_this._editor.getPosition());
        _this._register(_this._editor.onDidChangeCursorPosition(function (e) { return _this._compute(_this._editor.getPosition()); }));
        _this._editor.addContentWidget(_this);
        return _this;
    }
    InspectTokensWidget.prototype.dispose = function () {
        this._editor.removeContentWidget(this);
        _super.prototype.dispose.call(this);
    };
    InspectTokensWidget.prototype.getId = function () {
        return InspectTokensWidget._ID;
    };
    InspectTokensWidget.prototype._compute = function (position) {
        var data = this._getTokensAtLine(position.lineNumber);
        var token1Index = 0;
        for (var i = data.tokens1.length - 1; i >= 0; i--) {
            var t = data.tokens1[i];
            if (position.column - 1 >= t.offset) {
                token1Index = i;
                break;
            }
        }
        var token2Index = 0;
        for (var i = (data.tokens2.length >>> 1); i >= 0; i--) {
            if (position.column - 1 >= data.tokens2[(i << 1)]) {
                token2Index = i;
                break;
            }
        }
        var result = '';
        var lineContent = this._model.getLineContent(position.lineNumber);
        var tokenText = '';
        if (token1Index < data.tokens1.length) {
            var tokenStartIndex = data.tokens1[token1Index].offset;
            var tokenEndIndex = token1Index + 1 < data.tokens1.length ? data.tokens1[token1Index + 1].offset : lineContent.length;
            tokenText = lineContent.substring(tokenStartIndex, tokenEndIndex);
        }
        result += "<h2 class=\"tm-token\">" + renderTokenText(tokenText) + "<span class=\"tm-token-length\">(" + tokenText.length + " " + (tokenText.length === 1 ? 'char' : 'chars') + ")</span></h2>";
        result += "<hr class=\"tokens-inspect-separator\" style=\"clear:both\"/>";
        var metadata = this._decodeMetadata(data.tokens2[(token2Index << 1) + 1]);
        result += "<table class=\"tm-metadata-table\"><tbody>";
        result += "<tr><td class=\"tm-metadata-key\">language</td><td class=\"tm-metadata-value\">" + escape(metadata.languageIdentifier.language) + "</td>";
        result += "<tr><td class=\"tm-metadata-key\">token type</td><td class=\"tm-metadata-value\">" + this._tokenTypeToString(metadata.tokenType) + "</td>";
        result += "<tr><td class=\"tm-metadata-key\">font style</td><td class=\"tm-metadata-value\">" + this._fontStyleToString(metadata.fontStyle) + "</td>";
        result += "<tr><td class=\"tm-metadata-key\">foreground</td><td class=\"tm-metadata-value\">" + Color.Format.CSS.formatHex(metadata.foreground) + "</td>";
        result += "<tr><td class=\"tm-metadata-key\">background</td><td class=\"tm-metadata-value\">" + Color.Format.CSS.formatHex(metadata.background) + "</td>";
        result += "</tbody></table>";
        result += "<hr class=\"tokens-inspect-separator\"/>";
        if (token1Index < data.tokens1.length) {
            result += "<span class=\"tm-token-type\">" + escape(data.tokens1[token1Index].type) + "</span>";
        }
        this._domNode.innerHTML = result;
        this._editor.layoutContentWidget(this);
    };
    InspectTokensWidget.prototype._decodeMetadata = function (metadata) {
        var colorMap = TokenizationRegistry.getColorMap();
        var languageId = TokenMetadata.getLanguageId(metadata);
        var tokenType = TokenMetadata.getTokenType(metadata);
        var fontStyle = TokenMetadata.getFontStyle(metadata);
        var foreground = TokenMetadata.getForeground(metadata);
        var background = TokenMetadata.getBackground(metadata);
        return {
            languageIdentifier: this._modeService.getLanguageIdentifier(languageId),
            tokenType: tokenType,
            fontStyle: fontStyle,
            foreground: colorMap[foreground],
            background: colorMap[background]
        };
    };
    InspectTokensWidget.prototype._tokenTypeToString = function (tokenType) {
        switch (tokenType) {
            case 0 /* Other */: return 'Other';
            case 1 /* Comment */: return 'Comment';
            case 2 /* String */: return 'String';
            case 4 /* RegEx */: return 'RegEx';
        }
        return '??';
    };
    InspectTokensWidget.prototype._fontStyleToString = function (fontStyle) {
        var r = '';
        if (fontStyle & 1 /* Italic */) {
            r += 'italic ';
        }
        if (fontStyle & 2 /* Bold */) {
            r += 'bold ';
        }
        if (fontStyle & 4 /* Underline */) {
            r += 'underline ';
        }
        if (r.length === 0) {
            r = '---';
        }
        return r;
    };
    InspectTokensWidget.prototype._getTokensAtLine = function (lineNumber) {
        var stateBeforeLine = this._getStateBeforeLine(lineNumber);
        var tokenizationResult1 = this._tokenizationSupport.tokenize(this._model.getLineContent(lineNumber), stateBeforeLine, 0);
        var tokenizationResult2 = this._tokenizationSupport.tokenize2(this._model.getLineContent(lineNumber), stateBeforeLine, 0);
        return {
            startState: stateBeforeLine,
            tokens1: tokenizationResult1.tokens,
            tokens2: tokenizationResult2.tokens,
            endState: tokenizationResult1.endState
        };
    };
    InspectTokensWidget.prototype._getStateBeforeLine = function (lineNumber) {
        var state = this._tokenizationSupport.getInitialState();
        for (var i = 1; i < lineNumber; i++) {
            var tokenizationResult = this._tokenizationSupport.tokenize(this._model.getLineContent(i), state, 0);
            state = tokenizationResult.endState;
        }
        return state;
    };
    InspectTokensWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    InspectTokensWidget.prototype.getPosition = function () {
        return {
            position: this._editor.getPosition(),
            preference: [ContentWidgetPositionPreference.BELOW, ContentWidgetPositionPreference.ABOVE]
        };
    };
    InspectTokensWidget._ID = 'editor.contrib.inspectTokensWidget';
    return InspectTokensWidget;
}(Disposable));
registerEditorContribution(InspectTokensController);
registerEditorAction(InspectTokens);
registerThemingParticipant(function (theme, collector) {
    var border = theme.getColor(editorHoverBorder);
    if (border) {
        var borderWidth = theme.type === HIGH_CONTRAST ? 2 : 1;
        collector.addRule(".monaco-editor .tokens-inspect-widget { border: " + borderWidth + "px solid " + border + "; }");
        collector.addRule(".monaco-editor .tokens-inspect-widget .tokens-inspect-separator { background-color: " + border + "; }");
    }
    var background = theme.getColor(editorHoverBackground);
    if (background) {
        collector.addRule(".monaco-editor .tokens-inspect-widget { background-color: " + background + "; }");
    }
});
