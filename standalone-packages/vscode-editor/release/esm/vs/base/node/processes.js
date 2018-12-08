/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as path from '../../../path.js';
import * as fs from '../../../fs.js';
import * as cp from '../../../child_process.js';
import * as nls from '../../nls.js';
import * as Types from '../common/types.js';
import * as Objects from '../common/objects.js';
import * as TPath from '../common/paths.js';
import * as Platform from '../common/platform.js';
import { LineDecoder } from './decoder.js';
import { getPathFromAmdModule } from '../common/amd.js';
function getWindowsCode(status) {
    switch (status) {
        case 0:
            return 0 /* Success */;
        case 1:
            return 2 /* AccessDenied */;
        case 128:
            return 3 /* ProcessNotFound */;
        default:
            return 1 /* Unknown */;
    }
}
export function terminateProcess(process, cwd) {
    if (Platform.isWindows) {
        try {
            var options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            if (cwd) {
                options.cwd = cwd;
            }
            cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
        }
        catch (err) {
            return { success: false, error: err, code: err.status ? getWindowsCode(err.status) : 1 /* Unknown */ };
        }
    }
    else if (Platform.isLinux || Platform.isMacintosh) {
        try {
            var cmd = getPathFromAmdModule(require, 'vs/base/node/terminateProcess.sh');
            var result = cp.spawnSync(cmd, [process.pid.toString()]);
            if (result.error) {
                return { success: false, error: result.error };
            }
        }
        catch (err) {
            return { success: false, error: err };
        }
    }
    else {
        process.kill('SIGKILL');
    }
    return { success: true };
}
export function getWindowsShell() {
    return process.env['comspec'] || 'cmd.exe';
}
var AbstractProcess = /** @class */ (function () {
    function AbstractProcess(arg1, arg2, arg3, arg4) {
        var _this = this;
        if (arg2 !== void 0 && arg3 !== void 0 && arg4 !== void 0) {
            this.cmd = arg1;
            this.args = arg2;
            this.shell = arg3;
            this.options = arg4;
        }
        else {
            var executable = arg1;
            this.cmd = executable.command;
            this.shell = executable.isShellCommand;
            this.args = executable.args.slice(0);
            this.options = executable.options || {};
        }
        this.childProcess = null;
        this.terminateRequested = false;
        if (this.options.env) {
            var newEnv_1 = Object.create(null);
            Object.keys(process.env).forEach(function (key) {
                newEnv_1[key] = process.env[key];
            });
            Object.keys(this.options.env).forEach(function (key) {
                newEnv_1[key] = _this.options.env[key];
            });
            this.options.env = newEnv_1;
        }
    }
    AbstractProcess.prototype.getSanitizedCommand = function () {
        var result = this.cmd.toLowerCase();
        var index = result.lastIndexOf(path.sep);
        if (index !== -1) {
            result = result.substring(index + 1);
        }
        if (AbstractProcess.WellKnowCommands[result]) {
            return result;
        }
        return 'other';
    };
    AbstractProcess.prototype.start = function (pp) {
        var _this = this;
        if (Platform.isWindows && ((this.options && this.options.cwd && TPath.isUNC(this.options.cwd)) || !this.options && TPath.isUNC(process.cwd()))) {
            return Promise.reject(new Error(nls.localize('TaskRunner.UNC', 'Can\'t execute a shell command on a UNC drive.')));
        }
        return this.useExec().then(function (useExec) {
            var cc;
            var ee;
            var result = new Promise(function (c, e) {
                cc = c;
                ee = e;
            });
            if (useExec) {
                var cmd = _this.cmd;
                if (_this.args) {
                    cmd = cmd + ' ' + _this.args.join(' ');
                }
                _this.childProcess = cp.exec(cmd, _this.options, function (error, stdout, stderr) {
                    _this.childProcess = null;
                    var err = error;
                    // This is tricky since executing a command shell reports error back in case the executed command return an
                    // error or the command didn't exist at all. So we can't blindly treat an error as a failed command. So we
                    // always parse the output and report success unless the job got killed.
                    if (err && err.killed) {
                        ee({ killed: _this.terminateRequested, stdout: stdout.toString(), stderr: stderr.toString() });
                    }
                    else {
                        _this.handleExec(cc, pp, error, stdout, stderr);
                    }
                });
            }
            else {
                var childProcess = null;
                var closeHandler = function (data) {
                    _this.childProcess = null;
                    _this.childProcessPromise = null;
                    _this.handleClose(data, cc, pp, ee);
                    var result = {
                        terminated: _this.terminateRequested
                    };
                    if (Types.isNumber(data)) {
                        result.cmdCode = data;
                    }
                    cc(result);
                };
                if (_this.shell && Platform.isWindows) {
                    var options = Objects.deepClone(_this.options);
                    options.windowsVerbatimArguments = true;
                    options.detached = false;
                    var quotedCommand = false;
                    var quotedArg_1 = false;
                    var commandLine_1 = [];
                    var quoted_1 = _this.ensureQuotes(_this.cmd);
                    commandLine_1.push(quoted_1.value);
                    quotedCommand = quoted_1.quoted;
                    if (_this.args) {
                        _this.args.forEach(function (elem) {
                            quoted_1 = _this.ensureQuotes(elem);
                            commandLine_1.push(quoted_1.value);
                            quotedArg_1 = quotedArg_1 && quoted_1.quoted;
                        });
                    }
                    var args = [
                        '/s',
                        '/c',
                    ];
                    if (quotedCommand) {
                        if (quotedArg_1) {
                            args.push('"' + commandLine_1.join(' ') + '"');
                        }
                        else if (commandLine_1.length > 1) {
                            args.push('"' + commandLine_1[0] + '"' + ' ' + commandLine_1.slice(1).join(' '));
                        }
                        else {
                            args.push('"' + commandLine_1[0] + '"');
                        }
                    }
                    else {
                        args.push(commandLine_1.join(' '));
                    }
                    childProcess = cp.spawn(getWindowsShell(), args, options);
                }
                else {
                    if (_this.cmd) {
                        childProcess = cp.spawn(_this.cmd, _this.args, _this.options);
                    }
                }
                if (childProcess) {
                    _this.childProcess = childProcess;
                    _this.childProcessPromise = Promise.resolve(childProcess);
                    if (_this.pidResolve) {
                        _this.pidResolve(Types.isNumber(childProcess.pid) ? childProcess.pid : -1);
                        _this.pidResolve = undefined;
                    }
                    childProcess.on('error', function (error) {
                        _this.childProcess = null;
                        ee({ terminated: _this.terminateRequested, error: error });
                    });
                    if (childProcess.pid) {
                        _this.childProcess.on('close', closeHandler);
                        _this.handleSpawn(childProcess, cc, pp, ee, true);
                    }
                }
            }
            return result;
        });
    };
    AbstractProcess.prototype.handleClose = function (data, cc, pp, ee) {
        // Default is to do nothing.
    };
    AbstractProcess.prototype.ensureQuotes = function (value) {
        if (AbstractProcess.regexp.test(value)) {
            return {
                value: '"' + value + '"',
                quoted: true
            };
        }
        else {
            return {
                value: value,
                quoted: value.length > 0 && value[0] === '"' && value[value.length - 1] === '"'
            };
        }
    };
    Object.defineProperty(AbstractProcess.prototype, "pid", {
        get: function () {
            var _this = this;
            if (this.childProcessPromise) {
                return this.childProcessPromise.then(function (childProcess) { return childProcess.pid; }, function (err) { return -1; });
            }
            else {
                return new Promise(function (resolve) {
                    _this.pidResolve = resolve;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    AbstractProcess.prototype.terminate = function () {
        var _this = this;
        if (!this.childProcessPromise) {
            return Promise.resolve({ success: true });
        }
        return this.childProcessPromise.then(function (childProcess) {
            _this.terminateRequested = true;
            var result = terminateProcess(childProcess, _this.options.cwd);
            if (result.success) {
                _this.childProcess = null;
            }
            return result;
        }, function (err) {
            return { success: true };
        });
    };
    AbstractProcess.prototype.useExec = function () {
        var _this = this;
        return new Promise(function (c, e) {
            if (!_this.shell || !Platform.isWindows) {
                c(false);
            }
            var cmdShell = cp.spawn(getWindowsShell(), ['/s', '/c']);
            cmdShell.on('error', function (error) {
                c(true);
            });
            cmdShell.on('exit', function (data) {
                c(false);
            });
        });
    };
    AbstractProcess.WellKnowCommands = {
        'ant': true,
        'cmake': true,
        'eslint': true,
        'gradle': true,
        'grunt': true,
        'gulp': true,
        'jake': true,
        'jenkins': true,
        'jshint': true,
        'make': true,
        'maven': true,
        'msbuild': true,
        'msc': true,
        'nmake': true,
        'npm': true,
        'rake': true,
        'tsc': true,
        'xbuild': true
    };
    AbstractProcess.regexp = /^[^"].* .*[^"]/;
    return AbstractProcess;
}());
export { AbstractProcess };
var LineProcess = /** @class */ (function (_super) {
    __extends(LineProcess, _super);
    function LineProcess(arg1, arg2, arg3, arg4) {
        return _super.call(this, arg1, arg2, arg3, arg4) || this;
    }
    LineProcess.prototype.handleExec = function (cc, pp, error, stdout, stderr) {
        [stdout, stderr].forEach(function (buffer, index) {
            var lineDecoder = new LineDecoder();
            var lines = lineDecoder.write(buffer);
            lines.forEach(function (line) {
                pp({ line: line, source: index === 0 ? 0 /* stdout */ : 1 /* stderr */ });
            });
            var line = lineDecoder.end();
            if (line) {
                pp({ line: line, source: index === 0 ? 0 /* stdout */ : 1 /* stderr */ });
            }
        });
        cc({ terminated: this.terminateRequested, error: error });
    };
    LineProcess.prototype.handleSpawn = function (childProcess, cc, pp, ee, sync) {
        var _this = this;
        this.stdoutLineDecoder = new LineDecoder();
        this.stderrLineDecoder = new LineDecoder();
        childProcess.stdout.on('data', function (data) {
            var lines = _this.stdoutLineDecoder.write(data);
            lines.forEach(function (line) { return pp({ line: line, source: 0 /* stdout */ }); });
        });
        childProcess.stderr.on('data', function (data) {
            var lines = _this.stderrLineDecoder.write(data);
            lines.forEach(function (line) { return pp({ line: line, source: 1 /* stderr */ }); });
        });
    };
    LineProcess.prototype.handleClose = function (data, cc, pp, ee) {
        [this.stdoutLineDecoder.end(), this.stderrLineDecoder.end()].forEach(function (line, index) {
            if (line) {
                pp({ line: line, source: index === 0 ? 0 /* stdout */ : 1 /* stderr */ });
            }
        });
    };
    return LineProcess;
}(AbstractProcess));
export { LineProcess };
// Wrapper around process.send() that will queue any messages if the internal node.js
// queue is filled with messages and only continue sending messages when the internal
// queue is free again to consume messages.
// On Windows we always wait for the send() method to return before sending the next message
// to workaround https://github.com/nodejs/node/issues/7657 (IPC can freeze process)
export function createQueuedSender(childProcess) {
    var msgQueue = [];
    var useQueue = false;
    var send = function (msg) {
        if (useQueue) {
            msgQueue.push(msg); // add to the queue if the process cannot handle more messages
            return;
        }
        var result = childProcess.send(msg, function (error) {
            if (error) {
                console.error(error); // unlikely to happen, best we can do is log this error
            }
            useQueue = false; // we are good again to send directly without queue
            // now send all the messages that we have in our queue and did not send yet
            if (msgQueue.length > 0) {
                var msgQueueCopy = msgQueue.slice(0);
                msgQueue = [];
                msgQueueCopy.forEach(function (entry) { return send(entry); });
            }
        });
        if (!result || Platform.isWindows /* workaround https://github.com/nodejs/node/issues/7657 */) {
            useQueue = true;
        }
    };
    return { send: send };
}
export var win32;
(function (win32) {
    function findExecutable(command, cwd, paths) {
        // If we have an absolute path then we take it.
        if (path.isAbsolute(command)) {
            return command;
        }
        if (cwd === void 0) {
            cwd = process.cwd();
        }
        var dir = path.dirname(command);
        if (dir !== '.') {
            // We have a directory and the directory is relative (see above). Make the path absolute
            // to the current working directory.
            return path.join(cwd, command);
        }
        if (paths === void 0 && Types.isString(process.env.PATH)) {
            paths = process.env.PATH.split(path.delimiter);
        }
        // No PATH environment. Make path absolute to the cwd.
        if (paths === void 0 || paths.length === 0) {
            return path.join(cwd, command);
        }
        // We have a simple file name. We get the path variable from the env
        // and try to find the executable on the path.
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var pathEntry = paths_1[_i];
            // The path entry is absolute.
            var fullPath = void 0;
            if (path.isAbsolute(pathEntry)) {
                fullPath = path.join(pathEntry, command);
            }
            else {
                fullPath = path.join(cwd, pathEntry, command);
            }
            if (fs.existsSync(fullPath)) {
                return fullPath;
            }
            var withExtension = fullPath + '.com';
            if (fs.existsSync(withExtension)) {
                return withExtension;
            }
            withExtension = fullPath + '.exe';
            if (fs.existsSync(withExtension)) {
                return withExtension;
            }
        }
        return path.join(cwd, command);
    }
    win32.findExecutable = findExecutable;
})(win32 || (win32 = {}));
