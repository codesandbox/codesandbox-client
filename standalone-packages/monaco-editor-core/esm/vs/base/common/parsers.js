/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as Types from './types';
var ValidationStatus = /** @class */ (function () {
    function ValidationStatus() {
        this._state = 0 /* OK */;
    }
    Object.defineProperty(ValidationStatus.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            if (value > this._state) {
                this._state = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ValidationStatus.prototype.isOK = function () {
        return this._state === 0 /* OK */;
    };
    ValidationStatus.prototype.isFatal = function () {
        return this._state === 4 /* Fatal */;
    };
    return ValidationStatus;
}());
export { ValidationStatus };
var Parser = /** @class */ (function () {
    function Parser(problemReporter) {
        this._problemReporter = problemReporter;
    }
    Parser.prototype.reset = function () {
        this._problemReporter.status.state = 0 /* OK */;
    };
    Object.defineProperty(Parser.prototype, "problemReporter", {
        get: function () {
            return this._problemReporter;
        },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.info = function (message) {
        this._problemReporter.info(message);
    };
    Parser.prototype.warn = function (message) {
        this._problemReporter.warn(message);
    };
    Parser.prototype.error = function (message) {
        this._problemReporter.error(message);
    };
    Parser.prototype.fatal = function (message) {
        this._problemReporter.fatal(message);
    };
    Parser.merge = function (destination, source, overwrite) {
        var _this = this;
        Object.keys(source).forEach(function (key) {
            var destValue = destination[key];
            var sourceValue = source[key];
            if (Types.isUndefined(sourceValue)) {
                return;
            }
            if (Types.isUndefined(destValue)) {
                destination[key] = sourceValue;
            }
            else {
                if (overwrite) {
                    if (Types.isObject(destValue) && Types.isObject(sourceValue)) {
                        _this.merge(destValue, sourceValue, overwrite);
                    }
                    else {
                        destination[key] = sourceValue;
                    }
                }
            }
        });
    };
    return Parser;
}());
export { Parser };
