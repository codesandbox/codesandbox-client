var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NoOpNotification } from '../platform/notification/common/notification.js';
import Severity from '../base/common/severity.js';
import { ICodeSandboxService } from './services/codesandbox/common/codesandbox.js';
var CodeSandboxNotificationService = /** @class */ (function () {
    function CodeSandboxNotificationService(codesandboxService) {
        this.codesandboxService = codesandboxService;
    }
    CodeSandboxNotificationService.prototype.info = function (message) {
        return this.notify({ severity: Severity.Info, message: message });
    };
    CodeSandboxNotificationService.prototype.warn = function (message) {
        return this.notify({ severity: Severity.Warning, message: message });
    };
    CodeSandboxNotificationService.prototype.error = function (error) {
        return this.notify({ severity: Severity.Error, message: error });
    };
    CodeSandboxNotificationService.prototype.notify = function (notification) {
        var message = notification.message.toString();
        switch (notification.severity) {
            case Severity.Error:
                this.codesandboxService.showNotification('error', message);
                break;
            case Severity.Warning:
                this.codesandboxService.showNotification('warning', message);
                break;
            case Severity.Info:
                this.codesandboxService.showNotification('info', message);
                break;
            case Severity.Ignore:
                console.log('Notification', message);
                break;
            default:
                this.codesandboxService.showNotification('info', message);
                break;
        }
        return CodeSandboxNotificationService.NO_OP;
    };
    CodeSandboxNotificationService.prototype.prompt = function (severity, message, choices, onCancel) {
        console.log('Prompt', message, choices);
        return CodeSandboxNotificationService.NO_OP;
    };
    CodeSandboxNotificationService.NO_OP = new NoOpNotification();
    CodeSandboxNotificationService = __decorate([
        __param(0, ICodeSandboxService)
    ], CodeSandboxNotificationService);
    return CodeSandboxNotificationService;
}());
export { CodeSandboxNotificationService };
