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
import { toDisposable } from '../../../base/common/lifecycle.js';
import { first } from '../../../base/common/async.js';
var URLService = /** @class */ (function () {
    function URLService() {
        this.handlers = new Set();
    }
    URLService.prototype.open = function (uri) {
        var handlers = Array.from(this.handlers);
        return first(handlers.map(function (h) { return function () { return h.handleURL(uri); }; }), undefined, false);
    };
    URLService.prototype.registerHandler = function (handler) {
        var _this = this;
        this.handlers.add(handler);
        return toDisposable(function () { return _this.handlers.delete(handler); });
    };
    return URLService;
}());
export { URLService };
var RelayURLService = /** @class */ (function (_super) {
    __extends(RelayURLService, _super);
    function RelayURLService(urlService) {
        var _this = _super.call(this) || this;
        _this.urlService = urlService;
        return _this;
    }
    RelayURLService.prototype.open = function (uri) {
        return this.urlService.open(uri);
    };
    RelayURLService.prototype.handleURL = function (uri) {
        return _super.prototype.open.call(this, uri);
    };
    return RelayURLService;
}(URLService));
export { RelayURLService };
