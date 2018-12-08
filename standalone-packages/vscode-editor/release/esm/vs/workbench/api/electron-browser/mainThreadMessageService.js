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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls.js';
import { Action } from '../../../base/common/actions.js';
import { MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { once } from '../../../base/common/event.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { dispose } from '../../../base/common/lifecycle.js';
var MainThreadMessageService = /** @class */ (function () {
    function MainThreadMessageService(extHostContext, _notificationService, _commandService, _dialogService) {
        this._notificationService = _notificationService;
        this._commandService = _commandService;
        this._dialogService = _dialogService;
        //
    }
    MainThreadMessageService.prototype.dispose = function () {
        //
    };
    MainThreadMessageService.prototype.$showMessage = function (severity, message, options, commands) {
        if (options.modal) {
            return this._showModalMessage(severity, message, commands);
        }
        else {
            return this._showMessage(severity, message, commands, options.extension);
        }
    };
    MainThreadMessageService.prototype._showMessage = function (severity, message, commands, extension) {
        var _this = this;
        return new Promise(function (resolve) {
            var primaryActions = [];
            var MessageItemAction = /** @class */ (function (_super) {
                __extends(MessageItemAction, _super);
                function MessageItemAction(id, label, handle) {
                    return _super.call(this, id, label, undefined, true, function () {
                        resolve(handle);
                        return undefined;
                    }) || this;
                }
                return MessageItemAction;
            }(Action));
            var ManageExtensionAction = /** @class */ (function (_super) {
                __extends(ManageExtensionAction, _super);
                function ManageExtensionAction(id, label, commandService) {
                    return _super.call(this, id, label, undefined, true, function () {
                        return commandService.executeCommand('_extensions.manage', id);
                    }) || this;
                }
                return ManageExtensionAction;
            }(Action));
            commands.forEach(function (command) {
                primaryActions.push(new MessageItemAction('_extension_message_handle_' + command.handle, command.title, command.handle));
            });
            var source;
            if (extension) {
                source = nls.localize('extensionSource', "{0} (Extension)", extension.displayName || extension.name);
            }
            if (!source) {
                source = nls.localize('defaultSource', "Extension");
            }
            var secondaryActions = [];
            if (extension && !extension.isUnderDevelopment) {
                secondaryActions.push(new ManageExtensionAction(extension.id, nls.localize('manageExtension', "Manage Extension"), _this._commandService));
            }
            var messageHandle = _this._notificationService.notify({
                severity: severity,
                message: message,
                actions: { primary: primaryActions, secondary: secondaryActions },
                source: source
            });
            // if promise has not been resolved yet, now is the time to ensure a return value
            // otherwise if already resolved it means the user clicked one of the buttons
            once(messageHandle.onDidClose)(function () {
                dispose.apply(void 0, primaryActions.concat(secondaryActions));
                resolve(undefined);
            });
        });
    };
    MainThreadMessageService.prototype._showModalMessage = function (severity, message, commands) {
        var cancelId = void 0;
        var buttons = commands.map(function (command, index) {
            if (command.isCloseAffordance === true) {
                cancelId = index;
            }
            return command.title;
        });
        if (cancelId === void 0) {
            if (buttons.length > 0) {
                buttons.push(nls.localize('cancel', "Cancel"));
            }
            else {
                buttons.push(nls.localize('ok', "OK"));
            }
            cancelId = buttons.length - 1;
        }
        return this._dialogService.show(severity, message, buttons, { cancelId: cancelId })
            .then(function (result) { return result === commands.length ? undefined : commands[result].handle; });
    };
    MainThreadMessageService = __decorate([
        extHostNamedCustomer(MainContext.MainThreadMessageService),
        __param(1, INotificationService),
        __param(2, ICommandService),
        __param(3, IDialogService)
    ], MainThreadMessageService);
    return MainThreadMessageService;
}());
export { MainThreadMessageService };
