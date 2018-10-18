import { toDisposable } from '../base/common/lifecycle';
var CodeSandboxStatusbarService = /** @class */ (function () {
    function CodeSandboxStatusbarService() {
    }
    CodeSandboxStatusbarService.prototype.addEntry = function (entry, alignment, priority) {
        console.log('Adding statusbar entry', entry, alignment, priority);
        return toDisposable(function () { });
    };
    CodeSandboxStatusbarService.prototype.setStatusMessage = function (message, autoDisposeAfter, delayBy) {
        console.log('Setting status message', message);
        return toDisposable(function () { });
    };
    return CodeSandboxStatusbarService;
}());
export { CodeSandboxStatusbarService };
