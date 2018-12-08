/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as paths from '../../../../base/common/paths.js';
import * as types from '../../../../base/common/types.js';
import * as objects from '../../../../base/common/objects.js';
import { relative } from '../../../../../path.js';
import { isWindows, isMacintosh, isLinux } from '../../../../base/common/platform.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import { localize } from '../../../../nls.js';
var AbstractVariableResolverService = /** @class */ (function () {
    function AbstractVariableResolverService(_context, _envVariables) {
        if (_envVariables === void 0) { _envVariables = process.env; }
        var _this = this;
        this._context = _context;
        this._envVariables = _envVariables;
        if (isWindows) {
            this._envVariables = Object.create(null);
            Object.keys(_envVariables).forEach(function (key) {
                _this._envVariables[key.toLowerCase()] = _envVariables[key];
            });
        }
    }
    AbstractVariableResolverService.prototype.resolve = function (root, value) {
        return this.recursiveResolve(root ? root.uri : undefined, value);
    };
    AbstractVariableResolverService.prototype.resolveAny = function (workspaceFolder, config, commandValueMapping) {
        var result = objects.deepClone(config);
        // hoist platform specific attributes to top level
        if (isWindows && result.windows) {
            Object.keys(result.windows).forEach(function (key) { return result[key] = result.windows[key]; });
        }
        else if (isMacintosh && result.osx) {
            Object.keys(result.osx).forEach(function (key) { return result[key] = result.osx[key]; });
        }
        else if (isLinux && result.linux) {
            Object.keys(result.linux).forEach(function (key) { return result[key] = result.linux[key]; });
        }
        // delete all platform specific sections
        delete result.windows;
        delete result.osx;
        delete result.linux;
        // substitute all variables recursively in string values
        return this.recursiveResolve(workspaceFolder ? workspaceFolder.uri : undefined, result, commandValueMapping);
    };
    AbstractVariableResolverService.prototype.resolveWithCommands = function (folder, config) {
        throw new Error('resolveWithCommands not implemented.');
    };
    AbstractVariableResolverService.prototype.recursiveResolve = function (folderUri, value, commandValueMapping) {
        var _this = this;
        if (types.isString(value)) {
            return this.resolveString(folderUri, value, commandValueMapping);
        }
        else if (types.isArray(value)) {
            return value.map(function (s) { return _this.recursiveResolve(folderUri, s, commandValueMapping); });
        }
        else if (types.isObject(value)) {
            var result_1 = Object.create(null);
            Object.keys(value).forEach(function (key) {
                var resolvedKey = _this.resolveString(folderUri, key, commandValueMapping);
                result_1[resolvedKey] = _this.recursiveResolve(folderUri, value[key], commandValueMapping);
            });
            return result_1;
        }
        return value;
    };
    AbstractVariableResolverService.prototype.resolveString = function (folderUri, value, commandValueMapping) {
        var _this = this;
        var filePath = this._context.getFilePath();
        return value.replace(AbstractVariableResolverService.VARIABLE_REGEXP, function (match, variable) {
            var argument;
            var parts = variable.split(':');
            if (parts && parts.length > 1) {
                variable = parts[0];
                argument = parts[1];
            }
            switch (variable) {
                case 'env':
                    if (argument) {
                        if (isWindows) {
                            argument = argument.toLowerCase();
                        }
                        var env = _this._envVariables[argument];
                        if (types.isString(env)) {
                            return env;
                        }
                        // For `env` we should do the same as a normal shell does - evaluates missing envs to an empty string #46436
                        return '';
                    }
                    throw new Error(localize('missingEnvVarName', "'{0}' can not be resolved because no environment variable name is given.", match));
                case 'config':
                    if (argument) {
                        var config = _this._context.getConfigurationValue(folderUri, argument);
                        if (types.isUndefinedOrNull(config)) {
                            throw new Error(localize('configNotFound', "'{0}' can not be resolved because setting '{1}' not found.", match, argument));
                        }
                        if (types.isObject(config)) {
                            throw new Error(localize('configNoString', "'{0}' can not be resolved because '{1}' is a structured value.", match, argument));
                        }
                        return config;
                    }
                    throw new Error(localize('missingConfigName', "'{0}' can not be resolved because no settings name is given.", match));
                case 'command':
                    if (argument && commandValueMapping) {
                        var v = commandValueMapping[argument];
                        if (typeof v === 'string') {
                            return v;
                        }
                        throw new Error(localize('noValueForCommand', "'{0}' can not be resolved because the command has no value.", match));
                    }
                    return match;
                default: {
                    // common error handling for all variables that require an open folder and accept a folder name argument
                    switch (variable) {
                        case 'workspaceRoot':
                        case 'workspaceFolder':
                        case 'workspaceRootFolderName':
                        case 'workspaceFolderBasename':
                        case 'relativeFile':
                            if (argument) {
                                var folder = _this._context.getFolderUri(argument);
                                if (folder) {
                                    folderUri = folder;
                                }
                                else {
                                    throw new Error(localize('canNotFindFolder', "'{0}' can not be resolved. No such folder '{1}'.", match, argument));
                                }
                            }
                            if (!folderUri) {
                                if (_this._context.getWorkspaceFolderCount() > 1) {
                                    throw new Error(localize('canNotResolveWorkspaceFolderMultiRoot', "'{0}' can not be resolved in a multi folder workspace. Scope this variable using ':' and a workspace folder name.", match));
                                }
                                throw new Error(localize('canNotResolveWorkspaceFolder', "'{0}' can not be resolved. Please open a folder.", match));
                            }
                            break;
                        default:
                            break;
                    }
                    // common error handling for all variables that require an open file
                    switch (variable) {
                        case 'file':
                        case 'relativeFile':
                        case 'fileDirname':
                        case 'fileExtname':
                        case 'fileBasename':
                        case 'fileBasenameNoExtension':
                            if (!filePath) {
                                throw new Error(localize('canNotResolveFile', "'{0}' can not be resolved. Please open an editor.", match));
                            }
                            break;
                        default:
                            break;
                    }
                    switch (variable) {
                        case 'workspaceRoot':
                        case 'workspaceFolder':
                            return normalizeDriveLetter(folderUri.fsPath);
                        case 'cwd':
                            return folderUri ? normalizeDriveLetter(folderUri.fsPath) : process.cwd();
                        case 'workspaceRootFolderName':
                        case 'workspaceFolderBasename':
                            return paths.basename(folderUri.fsPath);
                        case 'lineNumber':
                            var lineNumber = _this._context.getLineNumber();
                            if (lineNumber) {
                                return lineNumber;
                            }
                            throw new Error(localize('canNotResolveLineNumber', "'{0}' can not be resolved. Make sure to have a line selected in the active editor.", match));
                        case 'selectedText':
                            var selectedText = _this._context.getSelectedText();
                            if (selectedText) {
                                return selectedText;
                            }
                            throw new Error(localize('canNotResolveSelectedText', "'{0}' can not be resolved. Make sure to have some text selected in the active editor.", match));
                        case 'file':
                            return filePath;
                        case 'relativeFile':
                            if (folderUri) {
                                return paths.normalize(relative(folderUri.fsPath, filePath));
                            }
                            return filePath;
                        case 'fileDirname':
                            return paths.dirname(filePath);
                        case 'fileExtname':
                            return paths.extname(filePath);
                        case 'fileBasename':
                            return paths.basename(filePath);
                        case 'fileBasenameNoExtension':
                            var basename = paths.basename(filePath);
                            return basename.slice(0, basename.length - paths.extname(basename).length);
                        case 'execPath':
                            var ep = _this._context.getExecPath();
                            if (ep) {
                                return ep;
                            }
                            return match;
                        default:
                            return match;
                    }
                }
            }
        });
    };
    AbstractVariableResolverService.VARIABLE_REGEXP = /\$\{(.*?)\}/g;
    return AbstractVariableResolverService;
}());
export { AbstractVariableResolverService };
