/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as paths from '../../../base/common/paths';
import { isLinux } from '../../../base/common/platform';
import { createDecorator } from '../../instantiation/common/instantiation';
import { startsWithIgnoreCase } from '../../../base/common/strings';
import { isEqualOrParent, isEqual } from '../../../base/common/resources';
import { isUndefinedOrNull } from '../../../base/common/types';
export var IFileService = createDecorator('fileService');
export var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType || (FileType = {}));
export var FileSystemProviderCapabilities;
(function (FileSystemProviderCapabilities) {
    FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileReadWrite"] = 2] = "FileReadWrite";
    FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileOpenReadWriteClose"] = 4] = "FileOpenReadWriteClose";
    FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileFolderCopy"] = 8] = "FileFolderCopy";
    FileSystemProviderCapabilities[FileSystemProviderCapabilities["PathCaseSensitive"] = 1024] = "PathCaseSensitive";
    FileSystemProviderCapabilities[FileSystemProviderCapabilities["Readonly"] = 2048] = "Readonly";
})(FileSystemProviderCapabilities || (FileSystemProviderCapabilities = {}));
export var FileOperation;
(function (FileOperation) {
    FileOperation[FileOperation["CREATE"] = 0] = "CREATE";
    FileOperation[FileOperation["DELETE"] = 1] = "DELETE";
    FileOperation[FileOperation["MOVE"] = 2] = "MOVE";
    FileOperation[FileOperation["COPY"] = 3] = "COPY";
})(FileOperation || (FileOperation = {}));
var FileOperationEvent = /** @class */ (function () {
    function FileOperationEvent(_resource, _operation, _target) {
        this._resource = _resource;
        this._operation = _operation;
        this._target = _target;
    }
    Object.defineProperty(FileOperationEvent.prototype, "resource", {
        get: function () {
            return this._resource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileOperationEvent.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileOperationEvent.prototype, "operation", {
        get: function () {
            return this._operation;
        },
        enumerable: true,
        configurable: true
    });
    return FileOperationEvent;
}());
export { FileOperationEvent };
/**
 * Possible changes that can occur to a file.
 */
export var FileChangeType;
(function (FileChangeType) {
    FileChangeType[FileChangeType["UPDATED"] = 0] = "UPDATED";
    FileChangeType[FileChangeType["ADDED"] = 1] = "ADDED";
    FileChangeType[FileChangeType["DELETED"] = 2] = "DELETED";
})(FileChangeType || (FileChangeType = {}));
var FileChangesEvent = /** @class */ (function () {
    function FileChangesEvent(changes) {
        this._changes = changes;
    }
    Object.defineProperty(FileChangesEvent.prototype, "changes", {
        get: function () {
            return this._changes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns true if this change event contains the provided file with the given change type. In case of
     * type DELETED, this method will also return true if a folder got deleted that is the parent of the
     * provided file path.
     */
    FileChangesEvent.prototype.contains = function (resource, type) {
        if (!resource) {
            return false;
        }
        return this._changes.some(function (change) {
            if (change.type !== type) {
                return false;
            }
            // For deleted also return true when deleted folder is parent of target path
            if (type === FileChangeType.DELETED) {
                return isEqualOrParent(resource, change.resource, !isLinux /* ignorecase */);
            }
            return isEqual(resource, change.resource, !isLinux /* ignorecase */);
        });
    };
    /**
     * Returns the changes that describe added files.
     */
    FileChangesEvent.prototype.getAdded = function () {
        return this.getOfType(FileChangeType.ADDED);
    };
    /**
     * Returns if this event contains added files.
     */
    FileChangesEvent.prototype.gotAdded = function () {
        return this.hasType(FileChangeType.ADDED);
    };
    /**
     * Returns the changes that describe deleted files.
     */
    FileChangesEvent.prototype.getDeleted = function () {
        return this.getOfType(FileChangeType.DELETED);
    };
    /**
     * Returns if this event contains deleted files.
     */
    FileChangesEvent.prototype.gotDeleted = function () {
        return this.hasType(FileChangeType.DELETED);
    };
    /**
     * Returns the changes that describe updated files.
     */
    FileChangesEvent.prototype.getUpdated = function () {
        return this.getOfType(FileChangeType.UPDATED);
    };
    /**
     * Returns if this event contains updated files.
     */
    FileChangesEvent.prototype.gotUpdated = function () {
        return this.hasType(FileChangeType.UPDATED);
    };
    FileChangesEvent.prototype.getOfType = function (type) {
        return this._changes.filter(function (change) { return change.type === type; });
    };
    FileChangesEvent.prototype.hasType = function (type) {
        return this._changes.some(function (change) {
            return change.type === type;
        });
    };
    return FileChangesEvent;
}());
export { FileChangesEvent };
export function isParent(path, candidate, ignoreCase) {
    if (!path || !candidate || path === candidate) {
        return false;
    }
    if (candidate.length > path.length) {
        return false;
    }
    if (candidate.charAt(candidate.length - 1) !== paths.nativeSep) {
        candidate += paths.nativeSep;
    }
    if (ignoreCase) {
        return startsWithIgnoreCase(path, candidate);
    }
    return path.indexOf(candidate) === 0;
}
var StringSnapshot = /** @class */ (function () {
    function StringSnapshot(_value) {
        this._value = _value;
    }
    StringSnapshot.prototype.read = function () {
        var ret = this._value;
        this._value = null;
        return ret;
    };
    return StringSnapshot;
}());
export { StringSnapshot };
/**
 * Helper method to convert a snapshot into its full string form.
 */
export function snapshotToString(snapshot) {
    var chunks = [];
    var chunk;
    while (typeof (chunk = snapshot.read()) === 'string') {
        chunks.push(chunk);
    }
    return chunks.join('');
}
var FileOperationError = /** @class */ (function (_super) {
    __extends(FileOperationError, _super);
    function FileOperationError(message, fileOperationResult, options) {
        var _this = _super.call(this, message) || this;
        _this.fileOperationResult = fileOperationResult;
        _this.options = options;
        return _this;
    }
    FileOperationError.isFileOperationError = function (obj) {
        return obj instanceof Error && !isUndefinedOrNull(obj.fileOperationResult);
    };
    return FileOperationError;
}(Error));
export { FileOperationError };
export var FileOperationResult;
(function (FileOperationResult) {
    FileOperationResult[FileOperationResult["FILE_IS_BINARY"] = 0] = "FILE_IS_BINARY";
    FileOperationResult[FileOperationResult["FILE_IS_DIRECTORY"] = 1] = "FILE_IS_DIRECTORY";
    FileOperationResult[FileOperationResult["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
    FileOperationResult[FileOperationResult["FILE_NOT_MODIFIED_SINCE"] = 3] = "FILE_NOT_MODIFIED_SINCE";
    FileOperationResult[FileOperationResult["FILE_MODIFIED_SINCE"] = 4] = "FILE_MODIFIED_SINCE";
    FileOperationResult[FileOperationResult["FILE_MOVE_CONFLICT"] = 5] = "FILE_MOVE_CONFLICT";
    FileOperationResult[FileOperationResult["FILE_READ_ONLY"] = 6] = "FILE_READ_ONLY";
    FileOperationResult[FileOperationResult["FILE_PERMISSION_DENIED"] = 7] = "FILE_PERMISSION_DENIED";
    FileOperationResult[FileOperationResult["FILE_TOO_LARGE"] = 8] = "FILE_TOO_LARGE";
    FileOperationResult[FileOperationResult["FILE_INVALID_PATH"] = 9] = "FILE_INVALID_PATH";
    FileOperationResult[FileOperationResult["FILE_EXCEED_MEMORY_LIMIT"] = 10] = "FILE_EXCEED_MEMORY_LIMIT";
})(FileOperationResult || (FileOperationResult = {}));
export var AutoSaveConfiguration = {
    OFF: 'off',
    AFTER_DELAY: 'afterDelay',
    ON_FOCUS_CHANGE: 'onFocusChange',
    ON_WINDOW_CHANGE: 'onWindowChange'
};
export var HotExitConfiguration = {
    OFF: 'off',
    ON_EXIT: 'onExit',
    ON_EXIT_AND_WINDOW_CLOSE: 'onExitAndWindowClose'
};
export var CONTENT_CHANGE_EVENT_BUFFER_DELAY = 1000;
export var FILES_ASSOCIATIONS_CONFIG = 'files.associations';
export var FILES_EXCLUDE_CONFIG = 'files.exclude';
export var SUPPORTED_ENCODINGS = {
    utf8: {
        labelLong: 'UTF-8',
        labelShort: 'UTF-8',
        order: 1,
        alias: 'utf8bom'
    },
    utf8bom: {
        labelLong: 'UTF-8 with BOM',
        labelShort: 'UTF-8 with BOM',
        encodeOnly: true,
        order: 2,
        alias: 'utf8'
    },
    utf16le: {
        labelLong: 'UTF-16 LE',
        labelShort: 'UTF-16 LE',
        order: 3
    },
    utf16be: {
        labelLong: 'UTF-16 BE',
        labelShort: 'UTF-16 BE',
        order: 4
    },
    windows1252: {
        labelLong: 'Western (Windows 1252)',
        labelShort: 'Windows 1252',
        order: 5
    },
    iso88591: {
        labelLong: 'Western (ISO 8859-1)',
        labelShort: 'ISO 8859-1',
        order: 6
    },
    iso88593: {
        labelLong: 'Western (ISO 8859-3)',
        labelShort: 'ISO 8859-3',
        order: 7
    },
    iso885915: {
        labelLong: 'Western (ISO 8859-15)',
        labelShort: 'ISO 8859-15',
        order: 8
    },
    macroman: {
        labelLong: 'Western (Mac Roman)',
        labelShort: 'Mac Roman',
        order: 9
    },
    cp437: {
        labelLong: 'DOS (CP 437)',
        labelShort: 'CP437',
        order: 10
    },
    windows1256: {
        labelLong: 'Arabic (Windows 1256)',
        labelShort: 'Windows 1256',
        order: 11
    },
    iso88596: {
        labelLong: 'Arabic (ISO 8859-6)',
        labelShort: 'ISO 8859-6',
        order: 12
    },
    windows1257: {
        labelLong: 'Baltic (Windows 1257)',
        labelShort: 'Windows 1257',
        order: 13
    },
    iso88594: {
        labelLong: 'Baltic (ISO 8859-4)',
        labelShort: 'ISO 8859-4',
        order: 14
    },
    iso885914: {
        labelLong: 'Celtic (ISO 8859-14)',
        labelShort: 'ISO 8859-14',
        order: 15
    },
    windows1250: {
        labelLong: 'Central European (Windows 1250)',
        labelShort: 'Windows 1250',
        order: 16
    },
    iso88592: {
        labelLong: 'Central European (ISO 8859-2)',
        labelShort: 'ISO 8859-2',
        order: 17
    },
    cp852: {
        labelLong: 'Central European (CP 852)',
        labelShort: 'CP 852',
        order: 18
    },
    windows1251: {
        labelLong: 'Cyrillic (Windows 1251)',
        labelShort: 'Windows 1251',
        order: 19
    },
    cp866: {
        labelLong: 'Cyrillic (CP 866)',
        labelShort: 'CP 866',
        order: 20
    },
    iso88595: {
        labelLong: 'Cyrillic (ISO 8859-5)',
        labelShort: 'ISO 8859-5',
        order: 21
    },
    koi8r: {
        labelLong: 'Cyrillic (KOI8-R)',
        labelShort: 'KOI8-R',
        order: 22
    },
    koi8u: {
        labelLong: 'Cyrillic (KOI8-U)',
        labelShort: 'KOI8-U',
        order: 23
    },
    iso885913: {
        labelLong: 'Estonian (ISO 8859-13)',
        labelShort: 'ISO 8859-13',
        order: 24
    },
    windows1253: {
        labelLong: 'Greek (Windows 1253)',
        labelShort: 'Windows 1253',
        order: 25
    },
    iso88597: {
        labelLong: 'Greek (ISO 8859-7)',
        labelShort: 'ISO 8859-7',
        order: 26
    },
    windows1255: {
        labelLong: 'Hebrew (Windows 1255)',
        labelShort: 'Windows 1255',
        order: 27
    },
    iso88598: {
        labelLong: 'Hebrew (ISO 8859-8)',
        labelShort: 'ISO 8859-8',
        order: 28
    },
    iso885910: {
        labelLong: 'Nordic (ISO 8859-10)',
        labelShort: 'ISO 8859-10',
        order: 29
    },
    iso885916: {
        labelLong: 'Romanian (ISO 8859-16)',
        labelShort: 'ISO 8859-16',
        order: 30
    },
    windows1254: {
        labelLong: 'Turkish (Windows 1254)',
        labelShort: 'Windows 1254',
        order: 31
    },
    iso88599: {
        labelLong: 'Turkish (ISO 8859-9)',
        labelShort: 'ISO 8859-9',
        order: 32
    },
    windows1258: {
        labelLong: 'Vietnamese (Windows 1258)',
        labelShort: 'Windows 1258',
        order: 33
    },
    gbk: {
        labelLong: 'Simplified Chinese (GBK)',
        labelShort: 'GBK',
        order: 34
    },
    gb18030: {
        labelLong: 'Simplified Chinese (GB18030)',
        labelShort: 'GB18030',
        order: 35
    },
    cp950: {
        labelLong: 'Traditional Chinese (Big5)',
        labelShort: 'Big5',
        order: 36
    },
    big5hkscs: {
        labelLong: 'Traditional Chinese (Big5-HKSCS)',
        labelShort: 'Big5-HKSCS',
        order: 37
    },
    shiftjis: {
        labelLong: 'Japanese (Shift JIS)',
        labelShort: 'Shift JIS',
        order: 38
    },
    eucjp: {
        labelLong: 'Japanese (EUC-JP)',
        labelShort: 'EUC-JP',
        order: 39
    },
    euckr: {
        labelLong: 'Korean (EUC-KR)',
        labelShort: 'EUC-KR',
        order: 40
    },
    windows874: {
        labelLong: 'Thai (Windows 874)',
        labelShort: 'Windows 874',
        order: 41
    },
    iso885911: {
        labelLong: 'Latin/Thai (ISO 8859-11)',
        labelShort: 'ISO 8859-11',
        order: 42
    },
    koi8ru: {
        labelLong: 'Cyrillic (KOI8-RU)',
        labelShort: 'KOI8-RU',
        order: 43
    },
    koi8t: {
        labelLong: 'Tajik (KOI8-T)',
        labelShort: 'KOI8-T',
        order: 44
    },
    gb2312: {
        labelLong: 'Simplified Chinese (GB 2312)',
        labelShort: 'GB 2312',
        order: 45
    },
    cp865: {
        labelLong: 'Nordic DOS (CP 865)',
        labelShort: 'CP 865',
        order: 46
    },
    cp850: {
        labelLong: 'Western European DOS (CP 850)',
        labelShort: 'CP 850',
        order: 47
    }
};
export var FileKind;
(function (FileKind) {
    FileKind[FileKind["FILE"] = 0] = "FILE";
    FileKind[FileKind["FOLDER"] = 1] = "FOLDER";
    FileKind[FileKind["ROOT_FOLDER"] = 2] = "ROOT_FOLDER";
})(FileKind || (FileKind = {}));
export var MIN_MAX_MEMORY_SIZE_MB = 2048;
export var FALLBACK_MAX_MEMORY_SIZE_MB = 4096;
