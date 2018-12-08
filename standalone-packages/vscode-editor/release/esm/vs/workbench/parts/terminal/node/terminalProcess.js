/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from '../../../../../os.js';
import * as path from '../../../../../path.js';
import * as pty from '../../../../../node-pty.js';
import { Emitter } from '../../../../base/common/event.js';
var TerminalProcess = /** @class */ (function () {
    function TerminalProcess(shellLaunchConfig, cwd, cols, rows, env) {
        var _this = this;
        this._currentTitle = '';
        this._onProcessData = new Emitter();
        this._onProcessExit = new Emitter();
        this._onProcessIdReady = new Emitter();
        this._onProcessTitleChanged = new Emitter();
        var shellName;
        if (os.platform() === 'win32') {
            shellName = path.basename(shellLaunchConfig.executable || '');
        }
        else {
            // Using 'xterm-256color' here helps ensure that the majority of Linux distributions will use a
            // color prompt as defined in the default ~/.bashrc file.
            shellName = 'xterm-256color';
        }
        var options = {
            name: shellName,
            cwd: cwd,
            env: env,
            cols: cols,
            rows: rows
        };
        try {
            this._ptyProcess = pty.spawn(shellLaunchConfig.executable, shellLaunchConfig.args || [], options);
            this._processStartupComplete = new Promise(function (c) {
                _this.onProcessIdReady(function (pid) {
                    c();
                });
            });
        }
        catch (error) {
            // The only time this is expected to happen is when the file specified to launch with does not exist.
            this._exitCode = 2;
            this._queueProcessExit();
            this._processStartupComplete = Promise.resolve(void 0);
            return;
        }
        this._ptyProcess.on('data', function (data) {
            _this._onProcessData.fire(data);
            if (_this._closeTimeout) {
                clearTimeout(_this._closeTimeout);
                _this._queueProcessExit();
            }
        });
        this._ptyProcess.on('exit', function (code) {
            _this._exitCode = code;
            _this._queueProcessExit();
        });
        // TODO: We should no longer need to delay this since pty.spawn is sync
        setTimeout(function () {
            _this._sendProcessId();
        }, 500);
        this._setupTitlePolling();
    }
    Object.defineProperty(TerminalProcess.prototype, "onProcessData", {
        get: function () { return this._onProcessData.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TerminalProcess.prototype, "onProcessExit", {
        get: function () { return this._onProcessExit.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TerminalProcess.prototype, "onProcessIdReady", {
        get: function () { return this._onProcessIdReady.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TerminalProcess.prototype, "onProcessTitleChanged", {
        get: function () { return this._onProcessTitleChanged.event; },
        enumerable: true,
        configurable: true
    });
    TerminalProcess.prototype.dispose = function () {
        this._onProcessData.dispose();
        this._onProcessExit.dispose();
        this._onProcessIdReady.dispose();
        this._onProcessTitleChanged.dispose();
    };
    TerminalProcess.prototype._setupTitlePolling = function () {
        var _this = this;
        // Send initial timeout async to give event listeners a chance to init
        setTimeout(function () {
            _this._sendProcessTitle();
        }, 0);
        // Setup polling
        setInterval(function () {
            if (_this._currentTitle !== _this._ptyProcess.process) {
                _this._sendProcessTitle();
            }
        }, 200);
    };
    // Allow any trailing data events to be sent before the exit event is sent.
    // See https://github.com/Tyriar/node-pty/issues/72
    TerminalProcess.prototype._queueProcessExit = function () {
        var _this = this;
        if (this._closeTimeout) {
            clearTimeout(this._closeTimeout);
        }
        this._closeTimeout = setTimeout(function () { return _this._kill(); }, 250);
    };
    TerminalProcess.prototype._kill = function () {
        var _this = this;
        // Wait to kill to process until the start up code has run. This prevents us from firing a process exit before a
        // process start.
        this._processStartupComplete.then(function () {
            // Attempt to kill the pty, it may have already been killed at this
            // point but we want to make sure
            try {
                _this._ptyProcess.kill();
            }
            catch (ex) {
                // Swallow, the pty has already been killed
            }
            _this._onProcessExit.fire(_this._exitCode);
            _this.dispose();
        });
    };
    TerminalProcess.prototype._sendProcessId = function () {
        this._onProcessIdReady.fire(this._ptyProcess.pid);
    };
    TerminalProcess.prototype._sendProcessTitle = function () {
        this._currentTitle = this._ptyProcess.process;
        this._onProcessTitleChanged.fire(this._currentTitle);
    };
    TerminalProcess.prototype.shutdown = function (immediate) {
        if (immediate) {
            this._kill();
        }
        else {
            this._queueProcessExit();
        }
    };
    TerminalProcess.prototype.input = function (data) {
        this._ptyProcess.write(data);
    };
    TerminalProcess.prototype.resize = function (cols, rows) {
        // Ensure that cols and rows are always >= 1, this prevents a native
        // exception in winpty.
        this._ptyProcess.resize(Math.max(cols, 1), Math.max(rows, 1));
    };
    return TerminalProcess;
}());
export { TerminalProcess };
