import { Emitter } from '../base/common/event.js';
var CodeSandboxBroadcastService = /** @class */ (function () {
    function CodeSandboxBroadcastService(windowId) {
        this.windowId = windowId;
        this._onBroadcast = new Emitter();
        this.registerListeners();
    }
    CodeSandboxBroadcastService.prototype.registerListeners = function () {
        var _this = this;
        (window || self).addEventListener('message', function (e) {
            var data = e.data;
            if (data.$type === 'broadcast' && data.$windowId !== _this.windowId) {
                var b = data.b;
                _this._onBroadcast.fire(b);
            }
        });
    };
    Object.defineProperty(CodeSandboxBroadcastService.prototype, "onBroadcast", {
        get: function () {
            return this._onBroadcast.event;
        },
        enumerable: true,
        configurable: true
    });
    CodeSandboxBroadcastService.prototype.broadcast = function (b) {
        console.log('Sending broadcast', b);
        (window.parent || window).postMessage({
            $type: 'broadcast',
            $windowId: this.windowId,
            b: b,
        }, '*');
    };
    return CodeSandboxBroadcastService;
}());
export { CodeSandboxBroadcastService };
