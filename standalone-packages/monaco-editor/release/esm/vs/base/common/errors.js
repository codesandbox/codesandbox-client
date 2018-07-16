/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from './winjs.base.js';
// ------ BEGIN Hook up error listeners to winjs promises
var outstandingPromiseErrors = {};
function promiseErrorHandler(e) {
    //
    // e.detail looks like: { exception, error, promise, handler, id, parent }
    //
    var details = e.detail;
    var id = details.id;
    // If the error has a parent promise then this is not the origination of the
    //  error so we check if it has a handler, and if so we mark that the error
    //  was handled by removing it from outstandingPromiseErrors
    //
    if (details.parent) {
        if (details.handler && outstandingPromiseErrors) {
            delete outstandingPromiseErrors[id];
        }
        return;
    }
    // Indicate that this error was originated and needs to be handled
    outstandingPromiseErrors[id] = details;
    // The first time the queue fills up this iteration, schedule a timeout to
    // check if any errors are still unhandled.
    if (Object.keys(outstandingPromiseErrors).length === 1) {
        setTimeout(function () {
            var errors = outstandingPromiseErrors;
            outstandingPromiseErrors = {};
            Object.keys(errors).forEach(function (errorId) {
                var error = errors[errorId];
                if (error.exception) {
                    onUnexpectedError(error.exception);
                }
                else if (error.error) {
                    onUnexpectedError(error.error);
                }
                console.log('WARNING: Promise with no error callback:' + error.id);
                console.log(error);
                if (error.exception) {
                    console.log(error.exception.stack);
                }
            });
        }, 0);
    }
}
TPromise.addEventListener('error', promiseErrorHandler);
// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
        this.listeners = [];
        this.unexpectedErrorHandler = function (e) {
            setTimeout(function () {
                if (e.stack) {
                    throw new Error(e.message + '\n\n' + e.stack);
                }
                throw e;
            }, 0);
        };
    }
    ErrorHandler.prototype.addListener = function (listener) {
        var _this = this;
        this.listeners.push(listener);
        return function () {
            _this._removeListener(listener);
        };
    };
    ErrorHandler.prototype.emit = function (e) {
        this.listeners.forEach(function (listener) {
            listener(e);
        });
    };
    ErrorHandler.prototype._removeListener = function (listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
    ErrorHandler.prototype.setUnexpectedErrorHandler = function (newUnexpectedErrorHandler) {
        this.unexpectedErrorHandler = newUnexpectedErrorHandler;
    };
    ErrorHandler.prototype.getUnexpectedErrorHandler = function () {
        return this.unexpectedErrorHandler;
    };
    ErrorHandler.prototype.onUnexpectedError = function (e) {
        this.unexpectedErrorHandler(e);
        this.emit(e);
    };
    // For external errors, we don't want the listeners to be called
    ErrorHandler.prototype.onUnexpectedExternalError = function (e) {
        this.unexpectedErrorHandler(e);
    };
    return ErrorHandler;
}());
export { ErrorHandler };
export var errorHandler = new ErrorHandler();
export function setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
    errorHandler.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
}
export function onUnexpectedError(e) {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedError(e);
    }
    return undefined;
}
export function onUnexpectedExternalError(e) {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedExternalError(e);
    }
    return undefined;
}
export function transformErrorForSerialization(error) {
    if (error instanceof Error) {
        var name_1 = error.name, message = error.message;
        var stack = error.stacktrace || error.stack;
        return {
            $isError: true,
            name: name_1,
            message: message,
            stack: stack
        };
    }
    // return as is
    return error;
}
var canceledName = 'Canceled';
/**
 * Checks if the given error is a promise in canceled state
 */
export function isPromiseCanceledError(error) {
    return error instanceof Error && error.name === canceledName && error.message === canceledName;
}
/**
 * Returns an error that signals cancellation.
 */
export function canceled() {
    var error = new Error(canceledName);
    error.name = error.message;
    return error;
}
export function illegalArgument(name) {
    if (name) {
        return new Error("Illegal argument: " + name);
    }
    else {
        return new Error('Illegal argument');
    }
}
export function illegalState(name) {
    if (name) {
        return new Error("Illegal state: " + name);
    }
    else {
        return new Error('Illegal state');
    }
}
export function readonly(name) {
    return name
        ? new Error("readonly property '" + name + " cannot be changed'")
        : new Error('readonly property cannot be changed');
}
export function disposed(what) {
    var result = new Error(what + " has been disposed");
    result.name = 'DISPOSED';
    return result;
}
export function isErrorWithActions(obj) {
    return obj instanceof Error && Array.isArray(obj.actions);
}
export function create(message, options) {
    if (options === void 0) { options = Object.create(null); }
    var result = new Error(message);
    if (options.actions) {
        result.actions = options.actions;
    }
    return result;
}
export function getErrorMessage(err) {
    if (!err) {
        return 'Error';
    }
    if (err.message) {
        return err.message;
    }
    if (err.stack) {
        return err.stack.split('\n')[0];
    }
    return String(err);
}
