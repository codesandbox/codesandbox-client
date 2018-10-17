/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nls from '../../../nls.js';
import { basename, dirname } from '../../../base/common/paths.js';
import { Text } from './snippetParser.js';
import { getLeadingWhitespace, commonPrefixLength, isFalsyOrWhitespace, pad } from '../../../base/common/strings.js';
export var KnownSnippetVariableNames = Object.freeze({
    'CURRENT_YEAR': true,
    'CURRENT_YEAR_SHORT': true,
    'CURRENT_MONTH': true,
    'CURRENT_DATE': true,
    'CURRENT_HOUR': true,
    'CURRENT_MINUTE': true,
    'CURRENT_SECOND': true,
    'CURRENT_DAY_NAME': true,
    'CURRENT_DAY_NAME_SHORT': true,
    'CURRENT_MONTH_NAME': true,
    'CURRENT_MONTH_NAME_SHORT': true,
    'SELECTION': true,
    'CLIPBOARD': true,
    'TM_SELECTED_TEXT': true,
    'TM_CURRENT_LINE': true,
    'TM_CURRENT_WORD': true,
    'TM_LINE_INDEX': true,
    'TM_LINE_NUMBER': true,
    'TM_FILENAME': true,
    'TM_FILENAME_BASE': true,
    'TM_DIRECTORY': true,
    'TM_FILEPATH': true,
});
var CompositeSnippetVariableResolver = /** @class */ (function () {
    function CompositeSnippetVariableResolver(_delegates) {
        this._delegates = _delegates;
        //
    }
    CompositeSnippetVariableResolver.prototype.resolve = function (variable) {
        for (var _i = 0, _a = this._delegates; _i < _a.length; _i++) {
            var delegate = _a[_i];
            var value = delegate.resolve(variable);
            if (value !== void 0) {
                return value;
            }
        }
        return undefined;
    };
    return CompositeSnippetVariableResolver;
}());
export { CompositeSnippetVariableResolver };
var SelectionBasedVariableResolver = /** @class */ (function () {
    function SelectionBasedVariableResolver(_model, _selection) {
        this._model = _model;
        this._selection = _selection;
        //
    }
    SelectionBasedVariableResolver.prototype.resolve = function (variable) {
        var name = variable.name;
        if (name === 'SELECTION' || name === 'TM_SELECTED_TEXT') {
            var value = this._model.getValueInRange(this._selection) || undefined;
            if (value && this._selection.startLineNumber !== this._selection.endLineNumber) {
                // Selection is a multiline string which we indentation we now
                // need to adjust. We compare the indentation of this variable
                // with the indentation at the editor position and add potential
                // extra indentation to the value
                var line = this._model.getLineContent(this._selection.startLineNumber);
                var lineLeadingWhitespace = getLeadingWhitespace(line, 0, this._selection.startColumn - 1);
                var varLeadingWhitespace_1 = lineLeadingWhitespace;
                variable.snippet.walk(function (marker) {
                    if (marker === variable) {
                        return false;
                    }
                    if (marker instanceof Text) {
                        varLeadingWhitespace_1 = getLeadingWhitespace(marker.value.split(/\r\n|\r|\n/).pop());
                    }
                    return true;
                });
                var whitespaceCommonLength_1 = commonPrefixLength(varLeadingWhitespace_1, lineLeadingWhitespace);
                value = value.replace(/(\r\n|\r|\n)(.*)/g, function (m, newline, rest) { return "" + newline + varLeadingWhitespace_1.substr(whitespaceCommonLength_1) + rest; });
            }
            return value;
        }
        else if (name === 'TM_CURRENT_LINE') {
            return this._model.getLineContent(this._selection.positionLineNumber);
        }
        else if (name === 'TM_CURRENT_WORD') {
            var info = this._model.getWordAtPosition({
                lineNumber: this._selection.positionLineNumber,
                column: this._selection.positionColumn
            });
            return info && info.word || undefined;
        }
        else if (name === 'TM_LINE_INDEX') {
            return String(this._selection.positionLineNumber - 1);
        }
        else if (name === 'TM_LINE_NUMBER') {
            return String(this._selection.positionLineNumber);
        }
        return undefined;
    };
    return SelectionBasedVariableResolver;
}());
export { SelectionBasedVariableResolver };
var ModelBasedVariableResolver = /** @class */ (function () {
    function ModelBasedVariableResolver(_model) {
        this._model = _model;
        //
    }
    ModelBasedVariableResolver.prototype.resolve = function (variable) {
        var name = variable.name;
        if (name === 'TM_FILENAME') {
            return basename(this._model.uri.fsPath);
        }
        else if (name === 'TM_FILENAME_BASE') {
            var name_1 = basename(this._model.uri.fsPath);
            var idx = name_1.lastIndexOf('.');
            if (idx <= 0) {
                return name_1;
            }
            else {
                return name_1.slice(0, idx);
            }
        }
        else if (name === 'TM_DIRECTORY') {
            var dir = dirname(this._model.uri.fsPath);
            return dir !== '.' ? dir : '';
        }
        else if (name === 'TM_FILEPATH') {
            return this._model.uri.fsPath;
        }
        return undefined;
    };
    return ModelBasedVariableResolver;
}());
export { ModelBasedVariableResolver };
var ClipboardBasedVariableResolver = /** @class */ (function () {
    function ClipboardBasedVariableResolver(_clipboardService, _selectionIdx, _selectionCount) {
        this._clipboardService = _clipboardService;
        this._selectionIdx = _selectionIdx;
        this._selectionCount = _selectionCount;
        //
    }
    ClipboardBasedVariableResolver.prototype.resolve = function (variable) {
        if (variable.name !== 'CLIPBOARD' || !this._clipboardService) {
            return undefined;
        }
        var text = this._clipboardService.readText();
        if (!text) {
            return undefined;
        }
        var lines = text.split(/\r\n|\n|\r/).filter(function (s) { return !isFalsyOrWhitespace(s); });
        if (lines.length === this._selectionCount) {
            return lines[this._selectionIdx];
        }
        else {
            return text;
        }
    };
    return ClipboardBasedVariableResolver;
}());
export { ClipboardBasedVariableResolver };
var TimeBasedVariableResolver = /** @class */ (function () {
    function TimeBasedVariableResolver() {
    }
    TimeBasedVariableResolver.prototype.resolve = function (variable) {
        var name = variable.name;
        if (name === 'CURRENT_YEAR') {
            return String(new Date().getFullYear());
        }
        else if (name === 'CURRENT_YEAR_SHORT') {
            return String(new Date().getFullYear()).slice(-2);
        }
        else if (name === 'CURRENT_MONTH') {
            return pad((new Date().getMonth().valueOf() + 1), 2);
        }
        else if (name === 'CURRENT_DATE') {
            return pad(new Date().getDate().valueOf(), 2);
        }
        else if (name === 'CURRENT_HOUR') {
            return pad(new Date().getHours().valueOf(), 2);
        }
        else if (name === 'CURRENT_MINUTE') {
            return pad(new Date().getMinutes().valueOf(), 2);
        }
        else if (name === 'CURRENT_SECOND') {
            return pad(new Date().getSeconds().valueOf(), 2);
        }
        else if (name === 'CURRENT_DAY_NAME') {
            return TimeBasedVariableResolver.dayNames[new Date().getDay()];
        }
        else if (name === 'CURRENT_DAY_NAME_SHORT') {
            return TimeBasedVariableResolver.dayNamesShort[new Date().getDay()];
        }
        else if (name === 'CURRENT_MONTH_NAME') {
            return TimeBasedVariableResolver.monthNames[new Date().getMonth()];
        }
        else if (name === 'CURRENT_MONTH_NAME_SHORT') {
            return TimeBasedVariableResolver.monthNamesShort[new Date().getMonth()];
        }
        return undefined;
    };
    TimeBasedVariableResolver.dayNames = [nls.localize('Sunday', "Sunday"), nls.localize('Monday', "Monday"), nls.localize('Tuesday', "Tuesday"), nls.localize('Wednesday', "Wednesday"), nls.localize('Thursday', "Thursday"), nls.localize('Friday', "Friday"), nls.localize('Saturday', "Saturday")];
    TimeBasedVariableResolver.dayNamesShort = [nls.localize('SundayShort', "Sun"), nls.localize('MondayShort', "Mon"), nls.localize('TuesdayShort', "Tue"), nls.localize('WednesdayShort', "Wed"), nls.localize('ThursdayShort', "Thu"), nls.localize('FridayShort', "Fri"), nls.localize('SaturdayShort', "Sat")];
    TimeBasedVariableResolver.monthNames = [nls.localize('January', "January"), nls.localize('February', "February"), nls.localize('March', "March"), nls.localize('April', "April"), nls.localize('May', "May"), nls.localize('June', "June"), nls.localize('July', "July"), nls.localize('August', "August"), nls.localize('September', "September"), nls.localize('October', "October"), nls.localize('November', "November"), nls.localize('December', "December")];
    TimeBasedVariableResolver.monthNamesShort = [nls.localize('JanuaryShort', "Jan"), nls.localize('FebruaryShort', "Feb"), nls.localize('MarchShort', "Mar"), nls.localize('AprilShort', "Apr"), nls.localize('MayShort', "May"), nls.localize('JuneShort', "Jun"), nls.localize('JulyShort', "Jul"), nls.localize('AugustShort', "Aug"), nls.localize('SeptemberShort', "Sep"), nls.localize('OctoberShort', "Oct"), nls.localize('NovemberShort', "Nov"), nls.localize('DecemberShort', "Dec")];
    return TimeBasedVariableResolver;
}());
export { TimeBasedVariableResolver };
