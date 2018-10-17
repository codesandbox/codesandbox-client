import { TPromise } from '../base/common/winjs.base';
var CodeSandboxWorkspacesService = /** @class */ (function () {
    function CodeSandboxWorkspacesService() {
    }
    CodeSandboxWorkspacesService.prototype.createWorkspace = function (folders) {
        return new TPromise(function (r) {
            return r({
                id: 'codesandbox-workspace',
                configPath: '/codesandbox/config.json',
            });
        });
    };
    return CodeSandboxWorkspacesService;
}());
export { CodeSandboxWorkspacesService };
