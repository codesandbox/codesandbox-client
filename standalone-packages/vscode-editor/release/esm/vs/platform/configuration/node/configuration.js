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
import { Disposable } from '../../../base/common/lifecycle.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { ConfigurationModelParser } from '../common/configurationModels.js';
import { ConfigWatcher } from '../../../base/node/config.js';
import { Emitter } from '../../../base/common/event.js';
import { TPromise } from '../../../base/common/winjs.base.js';
var UserConfiguration = /** @class */ (function (_super) {
    __extends(UserConfiguration, _super);
    function UserConfiguration(settingsPath) {
        var _this = _super.call(this) || this;
        _this._onDidChangeConfiguration = _this._register(new Emitter());
        _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
        _this.userConfigModelWatcher = new ConfigWatcher(settingsPath, {
            changeBufferDelay: 300, onError: function (error) { return onUnexpectedError(error); }, defaultConfig: new ConfigurationModelParser(settingsPath), parse: function (content, parseErrors) {
                var userConfigModelParser = new ConfigurationModelParser(settingsPath);
                userConfigModelParser.parse(content);
                parseErrors = userConfigModelParser.errors.slice();
                return userConfigModelParser;
            }
        });
        _this._register(_this.userConfigModelWatcher);
        // Listeners
        _this._register(_this.userConfigModelWatcher.onDidUpdateConfiguration(function () { return _this._onDidChangeConfiguration.fire(_this.configurationModel); }));
        return _this;
    }
    Object.defineProperty(UserConfiguration.prototype, "configurationModel", {
        get: function () {
            return this.userConfigModelWatcher.getConfig().configurationModel;
        },
        enumerable: true,
        configurable: true
    });
    UserConfiguration.prototype.reload = function () {
        var _this = this;
        return new TPromise(function (c) { return _this.userConfigModelWatcher.reload(function () { return c(null); }); });
    };
    return UserConfiguration;
}(Disposable));
export { UserConfiguration };
