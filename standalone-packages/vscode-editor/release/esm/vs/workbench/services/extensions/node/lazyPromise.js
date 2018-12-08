/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedError } from '../../../../base/common/errors.js';
var LazyPromise = /** @class */ (function () {
    function LazyPromise() {
        this._actual = null;
        this._actualOk = null;
        this._actualErr = null;
        this._hasValue = false;
        this._value = null;
        this._hasErr = false;
        this._err = null;
    }
    LazyPromise.prototype._ensureActual = function () {
        var _this = this;
        if (!this._actual) {
            this._actual = new Promise(function (c, e) {
                _this._actualOk = c;
                _this._actualErr = e;
                if (_this._hasValue) {
                    _this._actualOk(_this._value);
                }
                if (_this._hasErr) {
                    _this._actualErr(_this._err);
                }
            });
        }
        return this._actual;
    };
    LazyPromise.prototype.resolveOk = function (value) {
        if (this._hasValue || this._hasErr) {
            return;
        }
        this._hasValue = true;
        this._value = value;
        if (this._actual) {
            this._actualOk(value);
        }
    };
    LazyPromise.prototype.resolveErr = function (err) {
        if (this._hasValue || this._hasErr) {
            return;
        }
        this._hasErr = true;
        this._err = err;
        if (this._actual) {
            this._actualErr(err);
        }
        else {
            // If nobody's listening at this point, it is safe to assume they never will,
            // since resolving this promise is always "async"
            onUnexpectedError(err);
        }
    };
    LazyPromise.prototype.then = function (success, error) {
        return this._ensureActual().then(success, error);
    };
    return LazyPromise;
}());
export { LazyPromise };
