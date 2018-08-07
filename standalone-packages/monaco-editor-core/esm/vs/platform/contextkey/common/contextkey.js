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
import { createDecorator } from '../../instantiation/common/instantiation';
import { isFalsyOrWhitespace } from '../../../base/common/strings';
export var ContextKeyExprType;
(function (ContextKeyExprType) {
    ContextKeyExprType[ContextKeyExprType["Defined"] = 1] = "Defined";
    ContextKeyExprType[ContextKeyExprType["Not"] = 2] = "Not";
    ContextKeyExprType[ContextKeyExprType["Equals"] = 3] = "Equals";
    ContextKeyExprType[ContextKeyExprType["NotEquals"] = 4] = "NotEquals";
    ContextKeyExprType[ContextKeyExprType["And"] = 5] = "And";
    ContextKeyExprType[ContextKeyExprType["Regex"] = 6] = "Regex";
})(ContextKeyExprType || (ContextKeyExprType = {}));
var ContextKeyExpr = /** @class */ (function () {
    function ContextKeyExpr() {
    }
    ContextKeyExpr.has = function (key) {
        return new ContextKeyDefinedExpr(key);
    };
    ContextKeyExpr.equals = function (key, value) {
        return new ContextKeyEqualsExpr(key, value);
    };
    ContextKeyExpr.notEquals = function (key, value) {
        return new ContextKeyNotEqualsExpr(key, value);
    };
    ContextKeyExpr.regex = function (key, value) {
        return new ContextKeyRegexExpr(key, value);
    };
    ContextKeyExpr.not = function (key) {
        return new ContextKeyNotExpr(key);
    };
    ContextKeyExpr.and = function () {
        var expr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            expr[_i] = arguments[_i];
        }
        return new ContextKeyAndExpr(expr);
    };
    ContextKeyExpr.deserialize = function (serialized) {
        var _this = this;
        if (!serialized) {
            return null;
        }
        var pieces = serialized.split('&&');
        var result = new ContextKeyAndExpr(pieces.map(function (p) { return _this._deserializeOne(p); }));
        return result.normalize();
    };
    ContextKeyExpr._deserializeOne = function (serializedOne) {
        serializedOne = serializedOne.trim();
        if (serializedOne.indexOf('!=') >= 0) {
            var pieces = serializedOne.split('!=');
            return new ContextKeyNotEqualsExpr(pieces[0].trim(), this._deserializeValue(pieces[1]));
        }
        if (serializedOne.indexOf('==') >= 0) {
            var pieces = serializedOne.split('==');
            return new ContextKeyEqualsExpr(pieces[0].trim(), this._deserializeValue(pieces[1]));
        }
        if (serializedOne.indexOf('=~') >= 0) {
            var pieces = serializedOne.split('=~');
            return new ContextKeyRegexExpr(pieces[0].trim(), this._deserializeRegexValue(pieces[1]));
        }
        if (/^\!\s*/.test(serializedOne)) {
            return new ContextKeyNotExpr(serializedOne.substr(1).trim());
        }
        return new ContextKeyDefinedExpr(serializedOne);
    };
    ContextKeyExpr._deserializeValue = function (serializedValue) {
        serializedValue = serializedValue.trim();
        if (serializedValue === 'true') {
            return true;
        }
        if (serializedValue === 'false') {
            return false;
        }
        var m = /^'([^']*)'$/.exec(serializedValue);
        if (m) {
            return m[1].trim();
        }
        return serializedValue;
    };
    ContextKeyExpr._deserializeRegexValue = function (serializedValue) {
        if (isFalsyOrWhitespace(serializedValue)) {
            console.warn('missing regexp-value for =~-expression');
            return null;
        }
        var start = serializedValue.indexOf('/');
        var end = serializedValue.lastIndexOf('/');
        if (start === end || start < 0 /* || to < 0 */) {
            console.warn("bad regexp-value '" + serializedValue + "', missing /-enclosure");
            return null;
        }
        var value = serializedValue.slice(start + 1, end);
        var caseIgnoreFlag = serializedValue[end + 1] === 'i' ? 'i' : '';
        try {
            return new RegExp(value, caseIgnoreFlag);
        }
        catch (e) {
            console.warn("bad regexp-value '" + serializedValue + "', parse error: " + e);
            return null;
        }
    };
    return ContextKeyExpr;
}());
export { ContextKeyExpr };
function cmp(a, b) {
    var aType = a.getType();
    var bType = b.getType();
    if (aType !== bType) {
        return aType - bType;
    }
    switch (aType) {
        case ContextKeyExprType.Defined:
            return a.cmp(b);
        case ContextKeyExprType.Not:
            return a.cmp(b);
        case ContextKeyExprType.Equals:
            return a.cmp(b);
        case ContextKeyExprType.NotEquals:
            return a.cmp(b);
        case ContextKeyExprType.Regex:
            return a.cmp(b);
        default:
            throw new Error('Unknown ContextKeyExpr!');
    }
}
var ContextKeyDefinedExpr = /** @class */ (function () {
    function ContextKeyDefinedExpr(key) {
        this.key = key;
    }
    ContextKeyDefinedExpr.prototype.getType = function () {
        return ContextKeyExprType.Defined;
    };
    ContextKeyDefinedExpr.prototype.cmp = function (other) {
        if (this.key < other.key) {
            return -1;
        }
        if (this.key > other.key) {
            return 1;
        }
        return 0;
    };
    ContextKeyDefinedExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyDefinedExpr) {
            return (this.key === other.key);
        }
        return false;
    };
    ContextKeyDefinedExpr.prototype.evaluate = function (context) {
        return (!!context.getValue(this.key));
    };
    ContextKeyDefinedExpr.prototype.normalize = function () {
        return this;
    };
    ContextKeyDefinedExpr.prototype.serialize = function () {
        return this.key;
    };
    ContextKeyDefinedExpr.prototype.keys = function () {
        return [this.key];
    };
    return ContextKeyDefinedExpr;
}());
export { ContextKeyDefinedExpr };
var ContextKeyEqualsExpr = /** @class */ (function () {
    function ContextKeyEqualsExpr(key, value) {
        this.key = key;
        this.value = value;
    }
    ContextKeyEqualsExpr.prototype.getType = function () {
        return ContextKeyExprType.Equals;
    };
    ContextKeyEqualsExpr.prototype.cmp = function (other) {
        if (this.key < other.key) {
            return -1;
        }
        if (this.key > other.key) {
            return 1;
        }
        if (this.value < other.value) {
            return -1;
        }
        if (this.value > other.value) {
            return 1;
        }
        return 0;
    };
    ContextKeyEqualsExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyEqualsExpr) {
            return (this.key === other.key && this.value === other.value);
        }
        return false;
    };
    ContextKeyEqualsExpr.prototype.evaluate = function (context) {
        /* tslint:disable:triple-equals */
        // Intentional ==
        return (context.getValue(this.key) == this.value);
        /* tslint:enable:triple-equals */
    };
    ContextKeyEqualsExpr.prototype.normalize = function () {
        if (typeof this.value === 'boolean') {
            if (this.value) {
                return new ContextKeyDefinedExpr(this.key);
            }
            return new ContextKeyNotExpr(this.key);
        }
        return this;
    };
    ContextKeyEqualsExpr.prototype.serialize = function () {
        if (typeof this.value === 'boolean') {
            return this.normalize().serialize();
        }
        return this.key + ' == \'' + this.value + '\'';
    };
    ContextKeyEqualsExpr.prototype.keys = function () {
        return [this.key];
    };
    return ContextKeyEqualsExpr;
}());
export { ContextKeyEqualsExpr };
var ContextKeyNotEqualsExpr = /** @class */ (function () {
    function ContextKeyNotEqualsExpr(key, value) {
        this.key = key;
        this.value = value;
    }
    ContextKeyNotEqualsExpr.prototype.getType = function () {
        return ContextKeyExprType.NotEquals;
    };
    ContextKeyNotEqualsExpr.prototype.cmp = function (other) {
        if (this.key < other.key) {
            return -1;
        }
        if (this.key > other.key) {
            return 1;
        }
        if (this.value < other.value) {
            return -1;
        }
        if (this.value > other.value) {
            return 1;
        }
        return 0;
    };
    ContextKeyNotEqualsExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyNotEqualsExpr) {
            return (this.key === other.key && this.value === other.value);
        }
        return false;
    };
    ContextKeyNotEqualsExpr.prototype.evaluate = function (context) {
        /* tslint:disable:triple-equals */
        // Intentional !=
        return (context.getValue(this.key) != this.value);
        /* tslint:enable:triple-equals */
    };
    ContextKeyNotEqualsExpr.prototype.normalize = function () {
        if (typeof this.value === 'boolean') {
            if (this.value) {
                return new ContextKeyNotExpr(this.key);
            }
            return new ContextKeyDefinedExpr(this.key);
        }
        return this;
    };
    ContextKeyNotEqualsExpr.prototype.serialize = function () {
        if (typeof this.value === 'boolean') {
            return this.normalize().serialize();
        }
        return this.key + ' != \'' + this.value + '\'';
    };
    ContextKeyNotEqualsExpr.prototype.keys = function () {
        return [this.key];
    };
    return ContextKeyNotEqualsExpr;
}());
export { ContextKeyNotEqualsExpr };
var ContextKeyNotExpr = /** @class */ (function () {
    function ContextKeyNotExpr(key) {
        this.key = key;
    }
    ContextKeyNotExpr.prototype.getType = function () {
        return ContextKeyExprType.Not;
    };
    ContextKeyNotExpr.prototype.cmp = function (other) {
        if (this.key < other.key) {
            return -1;
        }
        if (this.key > other.key) {
            return 1;
        }
        return 0;
    };
    ContextKeyNotExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyNotExpr) {
            return (this.key === other.key);
        }
        return false;
    };
    ContextKeyNotExpr.prototype.evaluate = function (context) {
        return (!context.getValue(this.key));
    };
    ContextKeyNotExpr.prototype.normalize = function () {
        return this;
    };
    ContextKeyNotExpr.prototype.serialize = function () {
        return '!' + this.key;
    };
    ContextKeyNotExpr.prototype.keys = function () {
        return [this.key];
    };
    return ContextKeyNotExpr;
}());
export { ContextKeyNotExpr };
var ContextKeyRegexExpr = /** @class */ (function () {
    function ContextKeyRegexExpr(key, regexp) {
        this.key = key;
        this.regexp = regexp;
        //
    }
    ContextKeyRegexExpr.prototype.getType = function () {
        return ContextKeyExprType.Regex;
    };
    ContextKeyRegexExpr.prototype.cmp = function (other) {
        if (this.key < other.key) {
            return -1;
        }
        if (this.key > other.key) {
            return 1;
        }
        var source = this.regexp ? this.regexp.source : undefined;
        if (source < other.regexp.source) {
            return -1;
        }
        if (source > other.regexp.source) {
            return 1;
        }
        return 0;
    };
    ContextKeyRegexExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyRegexExpr) {
            var source = this.regexp ? this.regexp.source : undefined;
            return (this.key === other.key && source === other.regexp.source);
        }
        return false;
    };
    ContextKeyRegexExpr.prototype.evaluate = function (context) {
        return this.regexp ? this.regexp.test(context.getValue(this.key)) : false;
    };
    ContextKeyRegexExpr.prototype.normalize = function () {
        return this;
    };
    ContextKeyRegexExpr.prototype.serialize = function () {
        var value = this.regexp
            ? "/" + this.regexp.source + "/" + (this.regexp.ignoreCase ? 'i' : '')
            : '/invalid/';
        return this.key + " =~ " + value;
    };
    ContextKeyRegexExpr.prototype.keys = function () {
        return [this.key];
    };
    return ContextKeyRegexExpr;
}());
export { ContextKeyRegexExpr };
var ContextKeyAndExpr = /** @class */ (function () {
    function ContextKeyAndExpr(expr) {
        this.expr = ContextKeyAndExpr._normalizeArr(expr);
    }
    ContextKeyAndExpr.prototype.getType = function () {
        return ContextKeyExprType.And;
    };
    ContextKeyAndExpr.prototype.equals = function (other) {
        if (other instanceof ContextKeyAndExpr) {
            if (this.expr.length !== other.expr.length) {
                return false;
            }
            for (var i = 0, len = this.expr.length; i < len; i++) {
                if (!this.expr[i].equals(other.expr[i])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    ContextKeyAndExpr.prototype.evaluate = function (context) {
        for (var i = 0, len = this.expr.length; i < len; i++) {
            if (!this.expr[i].evaluate(context)) {
                return false;
            }
        }
        return true;
    };
    ContextKeyAndExpr._normalizeArr = function (arr) {
        var expr = [];
        if (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                var e = arr[i];
                if (!e) {
                    continue;
                }
                e = e.normalize();
                if (!e) {
                    continue;
                }
                if (e instanceof ContextKeyAndExpr) {
                    expr = expr.concat(e.expr);
                    continue;
                }
                expr.push(e);
            }
            expr.sort(cmp);
        }
        return expr;
    };
    ContextKeyAndExpr.prototype.normalize = function () {
        if (this.expr.length === 0) {
            return null;
        }
        if (this.expr.length === 1) {
            return this.expr[0];
        }
        return this;
    };
    ContextKeyAndExpr.prototype.serialize = function () {
        if (this.expr.length === 0) {
            return '';
        }
        if (this.expr.length === 1) {
            return this.normalize().serialize();
        }
        return this.expr.map(function (e) { return e.serialize(); }).join(' && ');
    };
    ContextKeyAndExpr.prototype.keys = function () {
        var result = [];
        for (var _i = 0, _a = this.expr; _i < _a.length; _i++) {
            var expr = _a[_i];
            result.push.apply(result, expr.keys());
        }
        return result;
    };
    return ContextKeyAndExpr;
}());
export { ContextKeyAndExpr };
var RawContextKey = /** @class */ (function (_super) {
    __extends(RawContextKey, _super);
    function RawContextKey(key, defaultValue) {
        var _this = _super.call(this, key) || this;
        _this._defaultValue = defaultValue;
        return _this;
    }
    RawContextKey.prototype.bindTo = function (target) {
        return target.createKey(this.key, this._defaultValue);
    };
    RawContextKey.prototype.getValue = function (target) {
        return target.getContextKeyValue(this.key);
    };
    RawContextKey.prototype.toNegated = function () {
        return ContextKeyExpr.not(this.key);
    };
    RawContextKey.prototype.isEqualTo = function (value) {
        return ContextKeyExpr.equals(this.key, value);
    };
    RawContextKey.prototype.notEqualsTo = function (value) {
        return ContextKeyExpr.notEquals(this.key, value);
    };
    return RawContextKey;
}(ContextKeyDefinedExpr));
export { RawContextKey };
export var IContextKeyService = createDecorator('contextKeyService');
export var SET_CONTEXT_COMMAND_ID = 'setContext';
