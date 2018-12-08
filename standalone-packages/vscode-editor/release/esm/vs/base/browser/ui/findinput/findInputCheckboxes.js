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
import { Checkbox } from '../checkbox/checkbox.js';
import './findInputCheckboxes.css';
import * as nls from '../../../../nls.js';
var NLS_CASE_SENSITIVE_CHECKBOX_LABEL = nls.localize('caseDescription', "Match Case");
var NLS_WHOLE_WORD_CHECKBOX_LABEL = nls.localize('wordsDescription', "Match Whole Word");
var NLS_REGEX_CHECKBOX_LABEL = nls.localize('regexDescription', "Use Regular Expression");
var CaseSensitiveCheckbox = /** @class */ (function (_super) {
    __extends(CaseSensitiveCheckbox, _super);
    function CaseSensitiveCheckbox(opts) {
        return _super.call(this, {
            actionClassName: 'monaco-case-sensitive',
            title: NLS_CASE_SENSITIVE_CHECKBOX_LABEL + opts.appendTitle,
            isChecked: opts.isChecked,
            inputActiveOptionBorder: opts.inputActiveOptionBorder
        }) || this;
    }
    return CaseSensitiveCheckbox;
}(Checkbox));
export { CaseSensitiveCheckbox };
var WholeWordsCheckbox = /** @class */ (function (_super) {
    __extends(WholeWordsCheckbox, _super);
    function WholeWordsCheckbox(opts) {
        return _super.call(this, {
            actionClassName: 'monaco-whole-word',
            title: NLS_WHOLE_WORD_CHECKBOX_LABEL + opts.appendTitle,
            isChecked: opts.isChecked,
            inputActiveOptionBorder: opts.inputActiveOptionBorder
        }) || this;
    }
    return WholeWordsCheckbox;
}(Checkbox));
export { WholeWordsCheckbox };
var RegexCheckbox = /** @class */ (function (_super) {
    __extends(RegexCheckbox, _super);
    function RegexCheckbox(opts) {
        return _super.call(this, {
            actionClassName: 'monaco-regex',
            title: NLS_REGEX_CHECKBOX_LABEL + opts.appendTitle,
            isChecked: opts.isChecked,
            inputActiveOptionBorder: opts.inputActiveOptionBorder
        }) || this;
    }
    return RegexCheckbox;
}(Checkbox));
export { RegexCheckbox };
