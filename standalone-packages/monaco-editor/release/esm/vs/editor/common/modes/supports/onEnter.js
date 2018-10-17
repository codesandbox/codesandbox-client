/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import * as strings from '../../../../base/common/strings.js';
import { IndentAction } from '../languageConfiguration.js';
var OnEnterSupport = /** @class */ (function () {
    function OnEnterSupport(opts) {
        opts = opts || {};
        opts.brackets = opts.brackets || [
            ['(', ')'],
            ['{', '}'],
            ['[', ']']
        ];
        this._brackets = opts.brackets.map(function (bracket) {
            return {
                open: bracket[0],
                openRegExp: OnEnterSupport._createOpenBracketRegExp(bracket[0]),
                close: bracket[1],
                closeRegExp: OnEnterSupport._createCloseBracketRegExp(bracket[1]),
            };
        });
        this._regExpRules = opts.regExpRules || [];
    }
    OnEnterSupport.prototype.onEnter = function (oneLineAboveText, beforeEnterText, afterEnterText) {
        // (1): `regExpRules`
        for (var i = 0, len = this._regExpRules.length; i < len; i++) {
            var rule = this._regExpRules[i];
            if (rule.beforeText.test(beforeEnterText)) {
                if (rule.afterText) {
                    if (rule.afterText.test(afterEnterText)) {
                        return rule.action;
                    }
                }
                else {
                    return rule.action;
                }
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
