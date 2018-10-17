/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Emitter } from '../../../base/common/event.js';
var TokenizationRegistryImpl = /** @class */ (function () {
    function TokenizationRegistryImpl() {
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._map = Object.create(null);
        this._colorMap = null;
    }
    TokenizationRegistryImpl.prototype.fire = function (languages) {
        this._onDidChange.fire({
            changedLanguages: languages,
            changedColorMap: false
        });
    };
    TokenizationRegistryImpl.prototype.register = function (language, support) {
        var _this = this;
        this._map[language] = support;
        this.fire([language]);
        return {
            dispose: function () {
                if (_this._map[language] !== support) {
                    return;
                }
                delete _this._map[language];
                _this.fire([language]);
            }
        };
    };
    TokenizationRegistryImpl.prototype.get = function (language) {
        return (this._map[language] || null);
    };
    TokenizationRegistryImpl.prototype.setColorMap = function (colorMap) {
        this._colorMap = colorMap;
        this._onDidChange.fire({
            changedLanguages: Object.keys(this._map),
            changedColorMap: true
        });
    };
    TokenizationRegistryImpl.prototype.getColorMap = function () {
        return this._colorMap;
    };
    TokenizationRegistryImpl.prototype.getDefaultBackground = function () {
        return this._colorMap[2 /* DefaultBackground */];
    };
    return TokenizationRegistryImpl;
}());
export { TokenizationRegistryImpl };
