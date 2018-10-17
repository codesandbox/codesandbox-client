/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../base/common/winjs.base.js';
import { TokenizationRegistry } from '../../common/modes.js';
import { renderViewLine2 as renderViewLine, RenderLineInput } from '../../common/viewLayout/viewLineRenderer.js';
import { LineTokens } from '../../common/core/lineTokens.js';
import * as strings from '../../../base/common/strings.js';
import { ViewLineRenderingData } from '../../common/viewModel/viewModel.js';
var Colorizer = /** @class */ (function () {
    function Colorizer() {
    }
    Colorizer.colorizeElement = function (themeService, modeService, domNode, options) {
        options = options || {};
        var theme = options.theme || 'vs';
        var mimeType = options.mimeType || domNode.getAttribute('lang') || domNode.getAttribute('data-lang');
        if (!mimeType) {
            console.error('Mode not detected');
            return undefined;
        }
        themeService.setTheme(theme);
        var text = domNode.firstChild.nodeValue;
        domNode.className += ' ' + theme;
        var render = function (str) {
            domNode.innerHTML = str;
        };
        return this.colorize(modeService, text, mimeType, options).then(render, function (err) { return console.error(err); });
    };
    Colorizer._tokenizationSupportChangedPromise = function (language) {
        var listener = null;
        var stopListening = function () {
            if (listener) {
                listener.dispose();
                listener = null;
            }
        };
        return new TPromise(function (c, e) {
            listener = TokenizationRegistry.onDidChange(function (e) {
                if (e.changedLanguages.indexOf(language) >= 0) {
                    stopListening();
                    c(void 0);
                }
            });
        }, stopListening);
    };
    Colorizer.colorize = function (modeService, text, mimeType, options) {
        if (strings.startsWithUTF8BOM(text)) {
            text = text.substr(1);
        }
        var lines = text.split(/\r\n|\r|\n/);
        var language = modeService.getModeId(mimeType);
        options = options || {};
        if (typeof options.tabSize === 'undefined') {
            options.tabSize = 4;
        }
        // Send out the event to create the mode
        modeService.getOrCreateMode(language);
        var tokenizationSupport = TokenizationRegistry.get(language);
        if (tokenizationSupport) {
            return TPromise.as(_colorize(lines, options.tabSize, tokenizationSupport));
        }
        // wait 500ms for mode to load, then give up
        return TPromise.any([this._tokenizationSupportChangedPromise(language), TPromise.timeout(500)]).then(function (_) {
            var tokenizationSupport = TokenizationRegistry.get(language);
            if (tokenizationSupport) {
                return _colorize(lines, options.tabSize, tokenizationSupport);
            }
            return _fakeColorize(lines, options.tabSize);
        });
    };
    Colorizer.colorizeLine = function (line, mightContainNonBasicASCII, mightContainRTL, tokens, tabSize) {
        if (tabSize === void 0) { tabSize = 4; }
        var isBasicASCII = ViewLineRenderingData.isBasicASCII(line, mightContainNonBasicASCII);
        var containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, mightContainRTL);
        var renderResult = renderViewLine(new RenderLineInput(false, line, false, isBasicASCII, containsRTL, 0, tokens, [], tabSize, 0, -1, 'none', false, false));
        return renderResult.html;
    };
    Colorizer.colorizeModelLine = function (model, lineNumber, tabSize) {
        if (tabSize === void 0) { tabSize = 4; }
        var content = model.getLineContent(lineNumber);
        model.forceTokenization(lineNumber);
        var tokens = model.getLineTokens(lineNumber);
        var inflatedTokens = tokens.inflate();
        return this.colorizeLine(content, model.mightContainNonBasicASCII(), model.mightContainRTL(), inflatedTokens, tabSize);
    };
    return Colorizer;
}());
export { Colorizer };
function _colorize(lines, tabSize, tokenizationSupport) {
    return _actualColorize(lines, tabSize, tokenizationSupport);
}
function _fakeColorize(lines, tabSize) {
    var html = [];
    var defaultMetadata = ((0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
        | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
        | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
    var tokens = new Uint32Array(2);
    tokens[0] = 0;
    tokens[1] = defaultMetadata;
    for (var i = 0, length_1 = lines.length; i < length_1; i++) {
        var line = lines[i];
        tokens[0] = line.length;
        var lineTokens = new LineTokens(tokens, line);
        var isBasicASCII = ViewLineRenderingData.isBasicASCII(line, /* check for basic ASCII */ true);
        var containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, /* check for RTL */ true);
        var renderResult = renderViewLine(new RenderLineInput(false, line, false, isBasicASCII, containsRTL, 0, lineTokens, [], tabSize, 0, -1, 'none', false, false));
        html = html.concat(renderResult.html);
        html.push('<br/>');
    }
    return html.join('');
}
function _actualColorize(lines, tabSize, tokenizationSupport) {
    var html = [];
    var state = tokenizationSupport.getInitialState();
    for (var i = 0, length_2 = lines.length; i < length_2; i++) {
        var line = lines[i];
        var tokenizeResult = tokenizationSupport.tokenize2(line, state, 0);
        LineTokens.convertToEndOffset(tokenizeResult.tokens, line.length);
        var lineTokens = new LineTokens(tokenizeResult.tokens, line);
        var isBasicASCII = ViewLineRenderingData.isBasicASCII(line, /* check for basic ASCII */ true);
        var containsRTL = ViewLineRenderingData.containsRTL(line, isBasicASCII, /* check for RTL */ true);
        var renderResult = renderViewLine(new RenderLineInput(false, line, false, isBasicASCII, containsRTL, 0, lineTokens.inflate(), [], tabSize, 0, -1, 'none', false, false));
        html = html.concat(renderResult.html);
        html.push('<br/>');
        state = tokenizeResult.endState;
    }
    return html.join('');
}
