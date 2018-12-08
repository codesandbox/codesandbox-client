/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createConnection } from '../../../net.js';
import { onUnexpectedError } from '../../base/common/errors.js';
import { filterEvent } from '../../base/common/event.js';
import { Protocol } from '../../base/parts/ipc/node/ipc.net.js';
import product from '../../platform/node/product.js';
import { createMessageOfType, isMessageOfType } from '../common/extensionHostProtocol.js';
import { ExtensionHostMain, exit } from './extensionHostMain.js';
// With Electron 2.x and node.js 8.x the "natives" module
// can cause a native crash (see https://github.com/nodejs/node/issues/19891 and
// https://github.com/electron/electron/issues/10905). To prevent this from
// happening we essentially blocklist this module from getting loaded in any
// extension by patching the node require() function.
(function () {
    var Module = require.__$__nodeRequire('module');
    var originalLoad = Module._load;
    Module._load = function (request) {
        if (request === 'natives') {
            throw new Error('Either the extension or a NPM dependency is using the "natives" node module which is unsupported as it can cause a crash of the extension host. Click [here](https://go.microsoft.com/fwlink/?linkid=871887) to find out more');
        }
        return originalLoad.apply(this, arguments);
    };
})();
// This calls exit directly in case the initialization is not finished and we need to exit
// Otherwise, if initialization completed we go to extensionHostMain.terminate()
var onTerminate = function () {
    exit();
};
function createExtHostProtocol() {
    var pipeName = process.env.VSCODE_IPC_HOOK_EXTHOST;
    return new Promise(function (resolve, reject) {
        console.log(pipeName);
        var socket = createConnection(pipeName, function () {
            socket.removeListener('error', reject);
            resolve(new Protocol(socket));
        });
        socket.once('error', reject);
    }).then(function (protocol) {
        return new /** @class */ (function () {
            function class_1() {
                var _this = this;
                this._terminating = false;
                this.onMessage = filterEvent(protocol.onMessage, function (msg) {
                    if (!isMessageOfType(msg, 2 /* Terminate */)) {
                        return true;
                    }
                    _this._terminating = true;
                    onTerminate();
                    return false;
                });
            }
            class_1.prototype.send = function (msg) {
                if (!this._terminating) {
                    protocol.send(msg);
                }
            };
            return class_1;
        }());
    });
}
function connectToRenderer(protocol) {
    return new Promise(function (c, e) {
        // Listen init data message
        var first = protocol.onMessage(function (raw) {
            first.dispose();
            var initData = JSON.parse(raw.toString());
            var rendererCommit = initData.commit;
            var myCommit = product.commit;
            if (rendererCommit && myCommit) {
                // Running in the built version where commits are defined
                if (rendererCommit !== myCommit) {
                    exit(55);
                }
            }
            // Print a console message when rejection isn't handled within N seconds. For details:
            // see https://nodejs.org/api/process.html#process_event_unhandledrejection
            // and https://nodejs.org/api/process.html#process_event_rejectionhandled
            var unhandledPromises = [];
            process.on('unhandledRejection', function (reason, promise) {
                unhandledPromises.push(promise);
                setTimeout(function () {
                    var idx = unhandledPromises.indexOf(promise);
                    if (idx >= 0) {
                        unhandledPromises.splice(idx, 1);
                        console.warn('rejected promise not handled within 1 second');
                        onUnexpectedError(reason);
                    }
                }, 1000);
            });
            process.on('rejectionHandled', function (promise) {
                var idx = unhandledPromises.indexOf(promise);
                if (idx >= 0) {
                    unhandledPromises.splice(idx, 1);
                }
            });
            // Print a console message when an exception isn't handled.
            process.on('uncaughtException', function (err) {
                onUnexpectedError(err);
            });
            // Kill oneself if one's parent dies. Much drama.
            setInterval(function () {
                try {
                    process.kill(initData.parentPid, 0); // throws an exception if the main process doesn't exist anymore.
                }
                catch (e) {
                    onTerminate();
                }
            }, 1000);
            // In certain cases, the event loop can become busy and never yield
            // e.g. while-true or process.nextTick endless loops
            // So also use the native node module to do it from a separate thread
            var watchdog;
            try {
                watchdog = require.__$__nodeRequire('native-watchdog');
                watchdog.start(initData.parentPid);
            }
            catch (err) {
                // no problem...
                onUnexpectedError(err);
            }
            // Tell the outside that we are initialized
            protocol.send(createMessageOfType(0 /* Initialized */));
            c({ protocol: protocol, initData: initData });
        });
        // Tell the outside that we are ready to receive messages
        protocol.send(createMessageOfType(1 /* Ready */));
    });
}
patchExecArgv();
createExtHostProtocol().then(function (protocol) {
    // connect to main side
    return connectToRenderer(protocol);
}).then(function (renderer) {
    // setup things
    var extensionHostMain = new ExtensionHostMain(renderer.protocol, renderer.initData);
    onTerminate = function () { return extensionHostMain.terminate(); };
    return extensionHostMain.start();
}).catch(function (err) { return console.error(err); });
function patchExecArgv() {
    // when encountering the prevent-inspect flag we delete this
    // and the prior flag
    if (process.env.VSCODE_PREVENT_FOREIGN_INSPECT) {
        for (var i = 0; i < process.execArgv.length; i++) {
            if (process.execArgv[i].match(/--inspect-brk=\d+|--inspect=\d+/)) {
                process.execArgv.splice(i, 1);
                break;
            }
        }
    }
}
