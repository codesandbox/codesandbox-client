/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from '../../../../../os.js';
import * as platform from '../../../../base/common/platform.js';
import * as processes from '../../../../base/node/processes.js';
import { readFile, fileExists } from '../../../../base/node/pfs.js';
export function getDefaultShell(p) {
    if (p === 3 /* Windows */) {
        if (platform.isWindows) {
            return getTerminalDefaultShellWindows();
        }
        // Don't detect Windows shell when not on Windows
        return processes.getWindowsShell();
    }
    // Only use $SHELL for the current OS
    if (platform.isLinux && p === 1 /* Mac */ || platform.isMacintosh && p === 2 /* Linux */) {
        return '/bin/bash';
    }
    return getTerminalDefaultShellUnixLike();
}
var _TERMINAL_DEFAULT_SHELL_UNIX_LIKE = null;
function getTerminalDefaultShellUnixLike() {
    if (!_TERMINAL_DEFAULT_SHELL_UNIX_LIKE) {
        var unixLikeTerminal = 'sh';
        if (!platform.isWindows && process.env.SHELL) {
            unixLikeTerminal = process.env.SHELL;
            // Some systems have $SHELL set to /bin/false which breaks the terminal
            if (unixLikeTerminal === '/bin/false') {
                unixLikeTerminal = '/bin/bash';
            }
        }
        _TERMINAL_DEFAULT_SHELL_UNIX_LIKE = unixLikeTerminal;
    }
    return _TERMINAL_DEFAULT_SHELL_UNIX_LIKE;
}
var _TERMINAL_DEFAULT_SHELL_WINDOWS = null;
function getTerminalDefaultShellWindows() {
    if (!_TERMINAL_DEFAULT_SHELL_WINDOWS) {
        var isAtLeastWindows10 = platform.isWindows && parseFloat(os.release()) >= 10;
        var is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
        var powerShellPath = process.env.windir + "\\" + (is32ProcessOn64Windows ? 'Sysnative' : 'System32') + "\\WindowsPowerShell\\v1.0\\powershell.exe";
        _TERMINAL_DEFAULT_SHELL_WINDOWS = isAtLeastWindows10 ? powerShellPath : processes.getWindowsShell();
    }
    return _TERMINAL_DEFAULT_SHELL_WINDOWS;
}
if (platform.isLinux) {
    var file_1 = '/etc/os-release';
    fileExists(file_1).then(function (exists) {
        if (!exists) {
            return;
        }
        readFile(file_1).then(function (b) {
            var contents = b.toString();
            if (/NAME="?Fedora"?/.test(contents)) {
                isFedora = true;
            }
            else if (/NAME="?Ubuntu"?/.test(contents)) {
                isUbuntu = true;
            }
        });
    });
}
export var isFedora = false;
export var isUbuntu = false;
