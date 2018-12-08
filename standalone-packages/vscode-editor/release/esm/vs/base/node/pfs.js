/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as extfs from './extfs.js';
import { join } from '../../../path.js';
import { nfcall, Queue } from '../common/async.js';
import * as fs from '../../../fs.js';
import * as os from '../../../os.js';
import * as platform from '../common/platform.js';
import { once } from '../common/event.js';
export function readdir(path) {
    return nfcall(extfs.readdir, path);
}
export function exists(path) {
    return new TPromise(function (c) { return fs.exists(path, c); });
}
export function chmod(path, mode) {
    return nfcall(fs.chmod, path, mode);
}
export var mkdirp = extfs.mkdirp;
import { TPromise } from '../common/winjs.base.js';
export function rimraf(path) {
    return lstat(path).then(function (stat) {
        if (stat.isDirectory() && !stat.isSymbolicLink()) {
            return readdir(path)
                .then(function (children) { return TPromise.join(children.map(function (child) { return rimraf(join(path, child)); })); })
                .then(function () { return rmdir(path); });
        }
        else {
            return unlink(path);
        }
    }, function (err) {
        if (err.code === 'ENOENT') {
            return void 0;
        }
        return TPromise.wrapError(err);
    });
}
export function realpath(path) {
    return nfcall(extfs.realpath, path);
}
export function stat(path) {
    return nfcall(fs.stat, path);
}
export function statLink(path) {
    return nfcall(extfs.statLink, path);
}
export function lstat(path) {
    return nfcall(fs.lstat, path);
}
export function rename(oldPath, newPath) {
    return nfcall(fs.rename, oldPath, newPath);
}
export function rmdir(path) {
    return nfcall(fs.rmdir, path);
}
export function unlink(path) {
    return nfcall(fs.unlink, path);
}
export function symlink(target, path, type) {
    return nfcall(fs.symlink, target, path, type);
}
export function readlink(path) {
    return nfcall(fs.readlink, path);
}
export function truncate(path, len) {
    return nfcall(fs.truncate, path, len);
}
export function readFile(path, encoding) {
    return nfcall(fs.readFile, path, encoding);
}
// According to node.js docs (https://nodejs.org/docs/v6.5.0/api/fs.html#fs_fs_writefile_file_data_options_callback)
// it is not safe to call writeFile() on the same path multiple times without waiting for the callback to return.
// Therefor we use a Queue on the path that is given to us to sequentialize calls to the same path properly.
var writeFilePathQueue = Object.create(null);
export function writeFile(path, data, options) {
    var queueKey = toQueueKey(path);
    return ensureWriteFileQueue(queueKey).queue(function () { return nfcall(extfs.writeFileAndFlush, path, data, options); });
}
function toQueueKey(path) {
    var queueKey = path;
    if (platform.isWindows || platform.isMacintosh) {
        queueKey = queueKey.toLowerCase(); // accomodate for case insensitive file systems
    }
    return queueKey;
}
function ensureWriteFileQueue(queueKey) {
    var writeFileQueue = writeFilePathQueue[queueKey];
    if (!writeFileQueue) {
        writeFileQueue = new Queue();
        writeFilePathQueue[queueKey] = writeFileQueue;
        var onFinish = once(writeFileQueue.onFinished);
        onFinish(function () {
            delete writeFilePathQueue[queueKey];
            writeFileQueue.dispose();
        });
    }
    return writeFileQueue;
}
/**
* Read a dir and return only subfolders
*/
export function readDirsInDir(dirPath) {
    return readdir(dirPath).then(function (children) {
        return TPromise.join(children.map(function (c) { return dirExists(join(dirPath, c)); })).then(function (exists) {
            return children.filter(function (_, i) { return exists[i]; });
        });
    });
}
/**
* `path` exists and is a directory
*/
export function dirExists(path) {
    return stat(path).then(function (stat) { return stat.isDirectory(); }, function () { return false; });
}
/**
* `path` exists and is a file.
*/
export function fileExists(path) {
    return stat(path).then(function (stat) { return stat.isFile(); }, function () { return false; });
}
/**
 * Deletes a path from disk.
 */
var _tmpDir = null;
function getTmpDir() {
    if (!_tmpDir) {
        _tmpDir = os.tmpdir();
    }
    return _tmpDir;
}
export function del(path, tmp) {
    if (tmp === void 0) { tmp = getTmpDir(); }
    return nfcall(extfs.del, path, tmp);
}
export function whenDeleted(path) {
    // Complete when wait marker file is deleted
    return new TPromise(function (c) {
        var running = false;
        var interval = setInterval(function () {
            if (!running) {
                running = true;
                fs.exists(path, function (exists) {
                    running = false;
                    if (!exists) {
                        clearInterval(interval);
                        c(void 0);
                    }
                });
            }
        }, 1000);
    });
}
export function copy(source, target) {
    return nfcall(extfs.copy, source, target);
}
