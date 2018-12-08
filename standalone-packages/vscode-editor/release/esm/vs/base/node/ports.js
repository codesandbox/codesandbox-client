/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as net from '../../../net.js';
/**
 * @returns Returns a random port between 1025 and 65535.
 */
export function randomPort() {
    var min = 1025;
    var max = 65535;
    return min + Math.floor((max - min) * Math.random());
}
/**
 * Given a start point and a max number of retries, will find a port that
 * is openable. Will return 0 in case no free port can be found.
 */
export function findFreePort(startPort, giveUpAfter, timeout) {
    var done = false;
    return new Promise(function (resolve) {
        var timeoutHandle = setTimeout(function () {
            if (!done) {
                done = true;
                return resolve(0);
            }
        }, timeout);
        doFindFreePort(startPort, giveUpAfter, function (port) {
            if (!done) {
                done = true;
                clearTimeout(timeoutHandle);
                return resolve(port);
            }
        });
    });
}
function doFindFreePort(startPort, giveUpAfter, clb) {
    if (giveUpAfter === 0) {
        return clb(0);
    }
    var client = new net.Socket();
    // If we can connect to the port it means the port is already taken so we continue searching
    client.once('connect', function () {
        dispose(client);
        return doFindFreePort(startPort + 1, giveUpAfter - 1, clb);
    });
    client.once('data', function () {
        // this listener is required since node.js 8.x
    });
    client.once('error', function (err) {
        dispose(client);
        // If we receive any non ECONNREFUSED error, it means the port is used but we cannot connect
        if (err.code !== 'ECONNREFUSED') {
            return doFindFreePort(startPort + 1, giveUpAfter - 1, clb);
        }
        // Otherwise it means the port is free to use!
        return clb(startPort);
    });
    client.connect(startPort, '127.0.0.1');
}
function dispose(socket) {
    try {
        socket.removeAllListeners('connect');
        socket.removeAllListeners('error');
        socket.end();
        socket.destroy();
        socket.unref();
    }
    catch (error) {
        console.error(error); // otherwise this error would get lost in the callback chain
    }
}
