/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls';
import * as path from '../../../../../path';
import { Disposable } from '../../../../base/common/lifecycle';
import { registerEditorContribution } from '../../../../editor/browser/editorExtensions';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
/**
 * Shows a message when opening a large file which has been memory optimized (and features disabled).
 */
var LargeFileOptimizationsWarner = /** @class */ (function (_super) {
    __extends(LargeFileOptimizationsWarner, _super);
    function LargeFileOptimizationsWarner(_editor, _notificationService, _configurationService, _storageService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._notificationService = _notificationService;
        _this._configurationService = _configurationService;
        _this._storageService = _storageService;
        _this._isDisabled = _this._storageService.getBoolean('editor.neverPromptForLargeFiles', 0 /* GLOBAL */, false);
        _this._register(_this._editor.onDidChangeModel(function (e) {
            var model = _this._editor.getModel();
            if (!model) {
                return;
            }
            if (_this._isDisabled) {
                return;
            }
            if (model.isTooLargeForTokenization()) {
                var message = nls.localize({
                    key: 'largeFile',
                    comment: [
                        'Variable 0 will be a file name.'
                    ]
                }, "{0}: tokenization, wrapping and folding have been turned off for this large file in order to reduce memory usage and avoid freezing or crashing.", path.basename(model.uri.path));
                _this._notificationService.prompt(Severity.Info, message, [
                    {
                        label: nls.localize('neverShowAgain', "OK. Never show again"),
                        run: function () {
                            _this._isDisabled = true;
                            _this._storageService.store('editor.neverPromptForLargeFiles', true, 0 /* GLOBAL */);
                        }
                    },
                    {
                        label: nls.localize('removeOptimizations', "Forcefully enable features"),
                        run: function () {
                            _this._configurationService.updateValue("editor.largeFileOptimizations", false).then(function () {
                                _this._notificationService.info(nls.localize('reopenFilePrompt', "Please reopen file in order for this setting to take effect."));
                            }, function (err) {
                                _this._notificationService.error(err);
                            });
                        }
                    }
                ]);
            }
        }));
        return _this;
    }
    LargeFileOptimizationsWarner.prototype.getId = function () {
        return LargeFileOptimizationsWarner.ID;
    };
    LargeFileOptimizationsWarner.ID = 'editor.contrib.largeFileOptimizationsWarner';
    LargeFileOptimizationsWarner = __decorate([
        __param(1, INotificationService),
        __param(2, IConfigurationService),
        __param(3, IStorageService)
    ], LargeFileOptimizationsWarner);
    return LargeFileOptimizationsWarner;
}(Disposable));
export { LargeFileOptimizationsWarner };
registerEditorContribution(LargeFileOptimizationsWarner);
