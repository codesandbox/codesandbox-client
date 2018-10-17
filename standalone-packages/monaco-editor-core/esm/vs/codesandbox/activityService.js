import { toDisposable } from '../base/common/lifecycle';
var CodeSandboxActivityService = /** @class */ (function () {
    function CodeSandboxActivityService() {
    }
    CodeSandboxActivityService.prototype.showActivity = function (compositeOrActionId, badge, clazz, priority) {
        console.log('activityService', compositeOrActionId, badge, clazz, priority);
        return toDisposable(function () { return true; });
    };
    CodeSandboxActivityService.prototype.getPinnedViewletIds = function () {
        console.log('getPinnedViewletIds called');
        return [];
    };
    return CodeSandboxActivityService;
}());
export { CodeSandboxActivityService };
