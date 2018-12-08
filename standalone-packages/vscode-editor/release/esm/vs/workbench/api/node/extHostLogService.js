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
import { join } from '../../../base/common/paths.js';
import { DelegatedLogService } from '../../../platform/log/common/log.js';
import { createSpdLogService } from '../../../platform/log/node/spdlogService.js';
import { ExtensionHostLogFileName } from '../../services/extensions/common/extensions.js';
import { URI } from '../../../base/common/uri.js';
var ExtHostLogService = /** @class */ (function (_super) {
    __extends(ExtHostLogService, _super);
    function ExtHostLogService(logLevel, logsPath) {
        var _this = _super.call(this, createSpdLogService(ExtensionHostLogFileName, logLevel, logsPath)) || this;
        _this._logsPath = logsPath;
        _this.logFile = URI.file(join(logsPath, ExtensionHostLogFileName + ".log"));
        return _this;
    }
    ExtHostLogService.prototype.$setLevel = function (level) {
        this.setLevel(level);
    };
    ExtHostLogService.prototype.getLogDirectory = function (extensionID) {
        return join(this._logsPath, extensionID);
    };
    return ExtHostLogService;
}(DelegatedLogService));
export { ExtHostLogService };
