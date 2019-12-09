"use strict";
var AutoCollectExceptions = (function () {
    function AutoCollectExceptions(client) {
        if (!!AutoCollectExceptions.INSTANCE) {
            throw new Error("Exception tracking should be configured from the applicationInsights object");
        }
        AutoCollectExceptions.INSTANCE = this;
        this._client = client;
    }
    Object.defineProperty(AutoCollectExceptions, "UNCAUGHT_EXCEPTION_HANDLER_NAME", {
        get: function () { return "uncaughtException"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCollectExceptions, "UNHANDLED_REJECTION_HANDLER_NAME", {
        get: function () { return "unhandledRejection"; },
        enumerable: true,
        configurable: true
    });
    AutoCollectExceptions.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    AutoCollectExceptions.prototype.enable = function (isEnabled) {
        var _this = this;
        if (isEnabled) {
            this._isInitialized = true;
            var self = this;
            if (!this._exceptionListenerHandle) {
                var handle = function (reThrow, error) {
                    _this._client.trackException({ exception: error });
                    _this._client.flush({ isAppCrashing: true });
                    if (reThrow) {
                        var THIS_IS_APPLICATION_INSIGHTS_RETHROWING_YOUR_EXCEPTION = error;
                        throw THIS_IS_APPLICATION_INSIGHTS_RETHROWING_YOUR_EXCEPTION; // Error originated somewhere else in your app
                    }
                };
                this._exceptionListenerHandle = handle.bind(this, true);
                this._rejectionListenerHandle = handle.bind(this, false);
                process.on(AutoCollectExceptions.UNCAUGHT_EXCEPTION_HANDLER_NAME, this._exceptionListenerHandle);
                process.on(AutoCollectExceptions.UNHANDLED_REJECTION_HANDLER_NAME, this._rejectionListenerHandle);
            }
        }
        else {
            if (this._exceptionListenerHandle) {
                process.removeListener(AutoCollectExceptions.UNCAUGHT_EXCEPTION_HANDLER_NAME, this._exceptionListenerHandle);
                process.removeListener(AutoCollectExceptions.UNHANDLED_REJECTION_HANDLER_NAME, this._rejectionListenerHandle);
                this._exceptionListenerHandle = undefined;
                this._rejectionListenerHandle = undefined;
                delete this._exceptionListenerHandle;
                delete this._rejectionListenerHandle;
            }
        }
    };
    AutoCollectExceptions.prototype.dispose = function () {
        AutoCollectExceptions.INSTANCE = null;
        this.enable(false);
        this._isInitialized = false;
    };
    AutoCollectExceptions.INSTANCE = null;
    return AutoCollectExceptions;
}());
module.exports = AutoCollectExceptions;
//# sourceMappingURL=Exceptions.js.map