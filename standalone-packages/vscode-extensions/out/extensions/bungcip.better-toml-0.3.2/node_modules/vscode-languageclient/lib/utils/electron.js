/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
var path = require('path');
var os = require('os');
var net = require('net');
var cp = require('child_process');
function makeRandomHexString(length) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var result = '';
    for (var i = 0; i < length; i++) {
        var idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
    }
    return result;
}
function generatePipeName() {
    var randomName = 'vscode-' + makeRandomHexString(40);
    if (process.platform === 'win32') {
        return '\\\\.\\pipe\\' + randomName + '-sock';
    }
    // Mac/Unix: use socket file
    return path.join(os.tmpdir(), randomName + '.sock');
}
function generatePatchedEnv(env, stdInPipeName, stdOutPipeName) {
    // Set the two unique pipe names and the electron flag as process env
    var newEnv = {};
    for (var key in env) {
        newEnv[key] = env[key];
    }
    newEnv['STDIN_PIPE_NAME'] = stdInPipeName;
    newEnv['STDOUT_PIPE_NAME'] = stdOutPipeName;
    newEnv['ATOM_SHELL_INTERNAL_RUN_AS_NODE'] = '1';
    return newEnv;
}
function fork(modulePath, args, options, callback) {
    var callbackCalled = false;
    var resolve = function (result) {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(null, result);
    };
    var reject = function (err) {
        if (callbackCalled) {
            return;
        }
        callbackCalled = true;
        callback(err, null);
    };
    // Generate two unique pipe names
    var stdInPipeName = generatePipeName();
    var stdOutPipeName = generatePipeName();
    var newEnv = generatePatchedEnv(options.env || process.env, stdInPipeName, stdOutPipeName);
    var childProcess;
    // Begin listening to stdout pipe
    var server = net.createServer(function (stream) {
        // The child process will write exactly one chunk with content `ready` when it has installed a listener to the stdin pipe
        stream.once('data', function (chunk) {
            // The child process is sending me the `ready` chunk, time to connect to the stdin pipe
            childProcess.stdin = net.connect(stdInPipeName);
            // From now on the childProcess.stdout is available for reading
            childProcess.stdout = stream;
            resolve(childProcess);
        });
    });
    server.listen(stdOutPipeName);
    var serverClosed = false;
    var closeServer = function () {
        if (serverClosed) {
            return;
        }
        serverClosed = true;
        server.close();
    };
    // Create the process
    var bootstrapperPath = path.join(__dirname, 'electronForkStart');
    childProcess = cp.fork(bootstrapperPath, [modulePath].concat(args), {
        silent: true,
        cwd: options.cwd,
        env: newEnv,
        execArgv: options.execArgv
    });
    childProcess.once('error', function (err) {
        closeServer();
        reject(err);
    });
    childProcess.once('exit', function (err) {
        closeServer();
        reject(err);
    });
}
exports.fork = fork;
