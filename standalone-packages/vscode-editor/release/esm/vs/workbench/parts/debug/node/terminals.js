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
import * as cp from '../../../../../child_process.js';
import * as nls from '../../../../nls.js';
import * as env from '../../../../base/common/platform.js';
import * as pfs from '../../../../base/node/pfs.js';
import { assign } from '../../../../base/common/objects.js';
import { getPathFromAmdModule } from '../../../../base/common/amd.js';
var TERMINAL_TITLE = nls.localize('console.title', "VS Code Console");
var terminalLauncher = undefined;
export function getTerminalLauncher() {
    if (!terminalLauncher) {
        if (env.isWindows) {
            terminalLauncher = new WinTerminalService();
        }
        else if (env.isMacintosh) {
            terminalLauncher = new MacTerminalService();
        }
        else if (env.isLinux) {
            terminalLauncher = new LinuxTerminalService();
        }
    }
    return terminalLauncher;
}
var _DEFAULT_TERMINAL_LINUX_READY = null;
export function getDefaultTerminalLinuxReady() {
    if (!_DEFAULT_TERMINAL_LINUX_READY) {
        _DEFAULT_TERMINAL_LINUX_READY = new Promise(function (c) {
            if (env.isLinux) {
                Promise.all([pfs.exists('/etc/debian_version'), process.lazyEnv]).then(function (_a) {
                    var isDebian = _a[0];
                    if (isDebian) {
                        c('x-terminal-emulator');
                    }
                    else if (process.env.DESKTOP_SESSION === 'gnome' || process.env.DESKTOP_SESSION === 'gnome-classic') {
                        c('gnome-terminal');
                    }
                    else if (process.env.DESKTOP_SESSION === 'kde-plasma') {
                        c('konsole');
                    }
                    else if (process.env.COLORTERM) {
                        c(process.env.COLORTERM);
                    }
                    else if (process.env.TERM) {
                        c(process.env.TERM);
                    }
                    else {
                        c('xterm');
                    }
                });
                return;
            }
            c('xterm');
        });
    }
    return _DEFAULT_TERMINAL_LINUX_READY;
}
var _DEFAULT_TERMINAL_WINDOWS = null;
export function getDefaultTerminalWindows() {
    if (!_DEFAULT_TERMINAL_WINDOWS) {
        var isWoW64 = !!process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
        _DEFAULT_TERMINAL_WINDOWS = (process.env.windir ? process.env.windir : 'C:\\Windows') + "\\" + (isWoW64 ? 'Sysnative' : 'System32') + "\\cmd.exe";
    }
    return _DEFAULT_TERMINAL_WINDOWS;
}
var TerminalLauncher = /** @class */ (function () {
    function TerminalLauncher() {
    }
    TerminalLauncher.prototype.runInTerminal = function (args, config) {
        return this.runInTerminal0(args.title, args.cwd, args.args, args.env || {}, config);
    };
    TerminalLauncher.prototype.runInTerminal0 = function (title, dir, args, envVars, config) {
        return void 0;
    };
    return TerminalLauncher;
}());
var WinTerminalService = /** @class */ (function (_super) {
    __extends(WinTerminalService, _super);
    function WinTerminalService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WinTerminalService.prototype.runInTerminal0 = function (title, dir, args, envVars, configuration) {
        var exec = configuration.external.windowsExec || getDefaultTerminalWindows();
        return new Promise(function (c, e) {
            var title = "\"" + dir + " - " + TERMINAL_TITLE + "\"";
            var command = "\"\"" + args.join('" "') + "\" & pause\""; // use '|' to only pause on non-zero exit code
            var cmdArgs = [
                '/c', 'start', title, '/wait', exec, '/c', command
            ];
            // merge environment variables into a copy of the process.env
            var env = assign({}, process.env, envVars);
            // delete environment variables that have a null value
            Object.keys(env).filter(function (v) { return env[v] === null; }).forEach(function (key) { return delete env[key]; });
            var options = {
                cwd: dir,
                env: env,
                windowsVerbatimArguments: true
            };
            var cmd = cp.spawn(WinTerminalService.CMD, cmdArgs, options);
            cmd.on('error', e);
            c(null);
        });
    };
    WinTerminalService.CMD = 'cmd.exe';
    return WinTerminalService;
}(TerminalLauncher));
var MacTerminalService = /** @class */ (function (_super) {
    __extends(MacTerminalService, _super);
    function MacTerminalService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MacTerminalService.prototype.runInTerminal0 = function (title, dir, args, envVars, configuration) {
        var terminalApp = configuration.external.osxExec || MacTerminalService.DEFAULT_TERMINAL_OSX;
        return new Promise(function (c, e) {
            if (terminalApp === MacTerminalService.DEFAULT_TERMINAL_OSX || terminalApp === 'iTerm.app') {
                // On OS X we launch an AppleScript that creates (or reuses) a Terminal window
                // and then launches the program inside that window.
                var script_1 = terminalApp === MacTerminalService.DEFAULT_TERMINAL_OSX ? 'TerminalHelper' : 'iTermHelper';
                var scriptpath = getPathFromAmdModule(require, "vs/workbench/parts/execution/electron-browser/" + script_1 + ".scpt");
                var osaArgs = [
                    scriptpath,
                    '-t', title || TERMINAL_TITLE,
                    '-w', dir,
                ];
                for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                    var a = args_1[_i];
                    osaArgs.push('-a');
                    osaArgs.push(a);
                }
                if (envVars) {
                    for (var key in envVars) {
                        var value = envVars[key];
                        if (value === null) {
                            osaArgs.push('-u');
                            osaArgs.push(key);
                        }
                        else {
                            osaArgs.push('-e');
                            osaArgs.push(key + "=" + value);
                        }
                    }
                }
                var stderr_1 = '';
                var osa = cp.spawn(MacTerminalService.OSASCRIPT, osaArgs);
                osa.on('error', e);
                osa.stderr.on('data', function (data) {
                    stderr_1 += data.toString();
                });
                osa.on('exit', function (code) {
                    if (code === 0) { // OK
                        c(null);
                    }
                    else {
                        if (stderr_1) {
                            var lines = stderr_1.split('\n', 1);
                            e(new Error(lines[0]));
                        }
                        else {
                            e(new Error(nls.localize('mac.terminal.script.failed', "Script '{0}' failed with exit code {1}", script_1, code)));
                        }
                    }
                });
            }
            else {
                e(new Error(nls.localize('mac.terminal.type.not.supported', "'{0}' not supported", terminalApp)));
            }
        });
    };
    MacTerminalService.DEFAULT_TERMINAL_OSX = 'Terminal.app';
    MacTerminalService.OSASCRIPT = '/usr/bin/osascript'; // osascript is the AppleScript interpreter on OS X
    return MacTerminalService;
}(TerminalLauncher));
var LinuxTerminalService = /** @class */ (function (_super) {
    __extends(LinuxTerminalService, _super);
    function LinuxTerminalService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinuxTerminalService.prototype.runInTerminal0 = function (title, dir, args, envVars, configuration) {
        var terminalConfig = configuration.external;
        var execThenable = terminalConfig.linuxExec ? Promise.resolve(terminalConfig.linuxExec) : getDefaultTerminalLinuxReady();
        return new Promise(function (c, e) {
            var termArgs = [];
            //termArgs.push('--title');
            //termArgs.push(`"${TERMINAL_TITLE}"`);
            execThenable.then(function (exec) {
                if (exec.indexOf('gnome-terminal') >= 0) {
                    termArgs.push('-x');
                }
                else {
                    termArgs.push('-e');
                }
                termArgs.push('bash');
                termArgs.push('-c');
                var bashCommand = quote(args) + "; echo; read -p \"" + LinuxTerminalService.WAIT_MESSAGE + "\" -n1;";
                termArgs.push("''" + bashCommand + "''"); // wrapping argument in two sets of ' because node is so "friendly" that it removes one set...
                // merge environment variables into a copy of the process.env
                var env = assign({}, process.env, envVars);
                // delete environment variables that have a null value
                Object.keys(env).filter(function (v) { return env[v] === null; }).forEach(function (key) { return delete env[key]; });
                var options = {
                    cwd: dir,
                    env: env
                };
                var stderr = '';
                var cmd = cp.spawn(exec, termArgs, options);
                cmd.on('error', e);
                cmd.stderr.on('data', function (data) {
                    stderr += data.toString();
                });
                cmd.on('exit', function (code) {
                    if (code === 0) { // OK
                        c(null);
                    }
                    else {
                        if (stderr) {
                            var lines = stderr.split('\n', 1);
                            e(new Error(lines[0]));
                        }
                        else {
                            e(new Error(nls.localize('linux.term.failed', "'{0}' failed with exit code {1}", exec, code)));
                        }
                    }
                });
            });
        });
    };
    LinuxTerminalService.WAIT_MESSAGE = nls.localize('press.any.key', "Press any key to continue...");
    return LinuxTerminalService;
}(TerminalLauncher));
/**
 * Quote args if necessary and combine into a space separated string.
 */
function quote(args) {
    var r = '';
    for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
        var a = args_2[_i];
        if (a.indexOf(' ') >= 0) {
            r += '"' + a + '"';
        }
        else {
            r += a;
        }
        r += ' ';
    }
    return r;
}
export function hasChildprocesses(processId) {
    if (processId) {
        try {
            // if shell has at least one child process, assume that shell is busy
            if (env.isWindows) {
                var result = cp.spawnSync('wmic', ['process', 'get', 'ParentProcessId']);
                if (result.stdout) {
                    var pids = result.stdout.toString().split('\r\n');
                    if (!pids.some(function (p) { return parseInt(p) === processId; })) {
                        return false;
                    }
                }
            }
            else {
                var result = cp.spawnSync('/usr/bin/pgrep', ['-lP', String(processId)]);
                if (result.stdout) {
                    var r = result.stdout.toString().trim();
                    if (r.length === 0 || r.indexOf(' tmux') >= 0) { // ignore 'tmux'; see #43683
                        return false;
                    }
                }
            }
        }
        catch (e) {
            // silently ignore
        }
    }
    // fall back to safe side
    return true;
}
export function prepareCommand(args, config) {
    var shellType;
    // get the shell configuration for the current platform
    var shell;
    var shell_config = config.integrated.shell;
    if (env.isWindows) {
        shell = shell_config.windows;
        shellType = 0 /* cmd */;
    }
    else if (env.isLinux) {
        shell = shell_config.linux;
        shellType = 2 /* bash */;
    }
    else if (env.isMacintosh) {
        shell = shell_config.osx;
        shellType = 2 /* bash */;
    }
    // try to determine the shell type
    shell = shell.trim().toLowerCase();
    if (shell.indexOf('powershell') >= 0 || shell.indexOf('pwsh') >= 0) {
        shellType = 1 /* powershell */;
    }
    else if (shell.indexOf('cmd.exe') >= 0) {
        shellType = 0 /* cmd */;
    }
    else if (shell.indexOf('bash') >= 0) {
        shellType = 2 /* bash */;
    }
    else if (shell.indexOf('git\\bin\\bash.exe') >= 0) {
        shellType = 2 /* bash */;
    }
    var quote;
    var command = '';
    switch (shellType) {
        case 1 /* powershell */:
            quote = function (s) {
                s = s.replace(/\'/g, '\'\'');
                return "'" + s + "'";
                //return s.indexOf(' ') >= 0 || s.indexOf('\'') >= 0 || s.indexOf('"') >= 0 ? `'${s}'` : s;
            };
            if (args.cwd) {
                command += "cd '" + args.cwd + "'; ";
            }
            if (args.env) {
                for (var key in args.env) {
                    var value = args.env[key];
                    if (value === null) {
                        command += "Remove-Item env:" + key + "; ";
                    }
                    else {
                        command += "${env:" + key + "}='" + value + "'; ";
                    }
                }
            }
            if (args.args && args.args.length > 0) {
                var cmd = quote(args.args.shift());
                command += (cmd[0] === '\'') ? "& " + cmd + " " : cmd + " ";
                for (var _i = 0, _a = args.args; _i < _a.length; _i++) {
                    var a = _a[_i];
                    command += quote(a) + " ";
                }
            }
            break;
        case 0 /* cmd */:
            quote = function (s) {
                s = s.replace(/\"/g, '""');
                return (s.indexOf(' ') >= 0 || s.indexOf('"') >= 0) ? "\"" + s + "\"" : s;
            };
            if (args.cwd) {
                command += "cd " + quote(args.cwd) + " && ";
            }
            if (args.env) {
                command += 'cmd /C "';
                for (var key in args.env) {
                    var value = args.env[key];
                    if (value === null) {
                        command += "set \"" + key + "=\" && ";
                    }
                    else {
                        value = value.replace(/[\^\&]/g, function (s) { return "^" + s; });
                        command += "set \"" + key + "=" + value + "\" && ";
                    }
                }
            }
            for (var _b = 0, _c = args.args; _b < _c.length; _b++) {
                var a = _c[_b];
                command += quote(a) + " ";
            }
            if (args.env) {
                command += '"';
            }
            break;
        case 2 /* bash */:
            quote = function (s) {
                s = s.replace(/\"/g, '\\"');
                return (s.indexOf(' ') >= 0 || s.indexOf('\\') >= 0) ? "\"" + s + "\"" : s;
            };
            if (args.cwd) {
                command += "cd " + quote(args.cwd) + " ; ";
            }
            if (args.env) {
                command += 'env';
                for (var key in args.env) {
                    var value = args.env[key];
                    if (value === null) {
                        command += " -u \"" + key + "\"";
                    }
                    else {
                        command += " \"" + key + "=" + value + "\"";
                    }
                }
                command += ' ';
            }
            for (var _d = 0, _e = args.args; _d < _e.length; _d++) {
                var a = _e[_d];
                command += quote(a) + " ";
            }
            break;
    }
    return command;
}
