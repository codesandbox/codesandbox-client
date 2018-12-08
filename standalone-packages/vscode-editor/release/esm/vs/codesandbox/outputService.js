import { Emitter } from '../base/common/event.js';
var CodeSandboxOutputService = /** @class */ (function () {
    function CodeSandboxOutputService() {
        this.onActiveOutputChannel = new Emitter().event;
    }
    CodeSandboxOutputService.prototype.getChannelDescriptors = function () {
        throw new Error('Method not implemented.');
    };
    CodeSandboxOutputService.prototype.getChannel = function (id) {
        throw new Error('getChannel not implemented.');
    };
    CodeSandboxOutputService.prototype.getActiveChannel = function () {
        throw new Error('getActiveChannel not implemented.');
    };
    CodeSandboxOutputService.prototype.showChannel = function (id, preserveFocus) {
        throw new Error('showChannel not implemented.');
    };
    return CodeSandboxOutputService;
}());
export { CodeSandboxOutputService };
