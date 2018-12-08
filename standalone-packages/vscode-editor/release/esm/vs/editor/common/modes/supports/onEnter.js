/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedError } from '../../../../base/common/errors.js';
import * as strings from '../../../../base/common/strings.js';
import { IndentAction } from '../languageConfiguration.js';
var OnEnterSupport = /** @class */ (function () {
    function OnEnterSupport(opts) {
        var _this = this;
        opts = opts || {};
        opts.brackets = opts.brackets || [
            ['(', ')'],
            ['{', '}'],
            ['[', ']']
        ];
        this._brackets = [];
        opts.brackets.forEach(function (bracket) {
            var openRegExp = OnEnterSupport._createOpenBracketRegExp(bracket[0]);
            var closeRegExp = OnEnterSupport._createCloseBracketRegExp(bracket[1]);
            if (openRegExp && closeRegExp) {
                _this._brackets.push({
                    open: bracket[0],
                    openRegExp: openRegExp,
                    close: bracket[1],
                    closeRegExp: closeRegExp,
                });
            }
        });
        this._regExpRules = opts.regExpRules || [];
    }
    OnEnterSupport.prototype.onEnter = function (oneLineAboveText, beforeEnterText, afterEnterText) {
        // (1): `regExpRules`
        for (var i = 0, len = this._regExpRules.length; i < len; i++) {
            var rule = this._regExpRules[i];
            var regResult = [{
                    reg: rule.beforeText,
                    text: beforeEnterText
                }, {
                    reg: rule.afterText,
                    text: afterEnterText
                }, {
                    reg: rule.oneLineAboveText,
                    text: oneLineAboveText
                }].every(function (obj) {
                return obj.reg ? obj.reg.test(obj.text) : true;
            });
            if (regResult) {
                return rule.action;
            }
        }
        // (2): Special indent-outdent
        if (beforeEnterText.length > 0 && afterEnterText.length > 0) {
            for (var i = 0, len = this._brackets.length; i < len; i++) {
                var bracket = this._brackets[i];
                if (bracket.openRegExp.test(beforeEnterText) && bracket.closeRegExp.test(afterEnterText)) {
                    return { indentAction: IndentAction.IndentOutdent };
                }
            }
        }
        // (4): Open bracket based logic
        if (beforeEnterText.length > 0) {
            for (var i = 0, len = this._brackets.length; i < len; i++) {
                var bracket = this._brackets[i];
                if (bracket.openRegExp.test(beforeEnterText)) {
                    return { indentAction: IndentAction.Indent };
                }
            }
        }
        return null;
    };
    OnEnterSupport._createOpenBracketRegExp = function (bracket) {
        var str = strings.escapeRegExpCharacters(bracket);
        if (!/\B/.test(str.charAt(0))) {
            str = '\\b' + str;
        }
        str += '\\s*$';
        return OnEnterSupport._safeRegExp(str);
    };
    OnEnterSupport._createCloseBracketRegExp = function (bracket) {
        var str = strings.escapeRegExpCharacters(bracket);
        if (!/\B/.test(str.charAt(str.length - 1))) {
            str = str + '\\b';
        }
        str = '^\\s*' + str;
        return OnEnterSupport._safeRegExp(str);
    };
    OnEnterSupport._safeRegExp = function (def) {
        try {
            return new RegExp(def);
        }
        catch (err) {
            onUnexpectedError(err);
            return null;
        }
    };
    return OnEnterSupport;
}());
export { OnEnterSupport };
