"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const NODE_SHEBANG_MATCHER = new RegExp('#! */usr/bin/env +node');
const JS_EXTENSIONS = ['.js', '.es6', '.jsx', '.mjs'];
function isJavaScript(aPath) {
    const ext = path.extname(aPath).toLowerCase();
    if (ext) {
        if (JS_EXTENSIONS.indexOf(ext) >= 0) {
            return true;
        }
    }
    else if (path.basename(aPath).toLowerCase() === 'www') {
        return true;
    }
    try {
        const buffer = Buffer.alloc(30);
        const fd = fs.openSync(aPath, 'r');
        fs.readSync(fd, buffer, 0, buffer.length, 0);
        fs.closeSync(fd);
        const line = buffer.toString();
        if (NODE_SHEBANG_MATCHER.test(line)) {
            return true;
        }
    }
    catch (e) {
        // silently ignore problems
    }
    return false;
}
exports.isJavaScript = isJavaScript;
function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
exports.random = random;
function killTree(processId) {
    if (process.platform === 'win32') {
        const windir = process.env['WINDIR'] || 'C:\\Windows';
        const TASK_KILL = path.join(windir, 'System32', 'taskkill.exe');
        // when killing a process in Windows its child processes are *not* killed but become root processes.
        // Therefore we use TASKKILL.EXE
        try {
            cp.execSync(`${TASK_KILL} /F /T /PID ${processId}`);
        }
        catch (err) {
        }
    }
    else {
        // on linux and OS X we kill all direct and indirect child processes as well
        try {
            const cmd = path.join(__dirname, './terminateProcess.sh');
            cp.spawnSync(cmd, [processId.toString()]);
        }
        catch (err) {
        }
    }
}
exports.killTree = killTree;
function trimLastNewline(msg) {
    return msg.replace(/(\n|\r\n)$/, '');
}
exports.trimLastNewline = trimLastNewline;
function extendObject(toObject, fromObject) {
    for (let key in fromObject) {
        if (fromObject.hasOwnProperty(key)) {
            toObject[key] = fromObject[key];
        }
    }
    return toObject;
}
exports.extendObject = extendObject;
function stripBOM(s) {
    if (s && s[0] === '\uFEFF') {
        s = s.substr(1);
    }
    return s;
}
exports.stripBOM = stripBOM;
const semverRegex = /v?(\d+)\.(\d+)\.(\d+)/;
function compareSemver(a, b) {
    const aNum = versionStringToNumber(a);
    const bNum = versionStringToNumber(b);
    return aNum - bNum;
}
exports.compareSemver = compareSemver;
function versionStringToNumber(str) {
    const match = str.match(semverRegex);
    if (!match) {
        throw new Error('Invalid node version string: ' + str);
    }
    return parseInt(match[1], 10) * 10000 + parseInt(match[2], 10) * 100 + parseInt(match[3], 10);
}

//# sourceMappingURL=utils.js.map
