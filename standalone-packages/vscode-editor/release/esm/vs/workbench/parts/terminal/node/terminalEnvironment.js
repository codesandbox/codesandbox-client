/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from '../../../../../os.js';
import * as paths from '../../../../base/common/paths.js';
import * as platform from '../../../../base/common/platform.js';
import pkg from '../../../../platform/node/package.js';
/**
 * This module contains utility functions related to the environment, cwd and paths.
 */
export function mergeEnvironments(parent, other) {
    if (!other) {
        return;
    }
    // On Windows apply the new values ignoring case, while still retaining
    // the case of the original key.
    if (platform.isWindows) {
        for (var configKey in other) {
            var actualKey = configKey;
            for (var envKey in parent) {
                if (configKey.toLowerCase() === envKey.toLowerCase()) {
                    actualKey = envKey;
                    break;
                }
            }
            var value = other[configKey];
            _mergeEnvironmentValue(parent, actualKey, value);
        }
    }
    else {
        Object.keys(other).forEach(function (key) {
            var value = other[key];
            _mergeEnvironmentValue(parent, key, value);
        });
    }
}
function _mergeEnvironmentValue(env, key, value) {
    if (typeof value === 'string') {
        env[key] = value;
    }
    else {
        delete env[key];
    }
}
export function sanitizeEnvironment(env) {
    // Remove keys based on strings
    var keysToRemove = [
        'ELECTRON_ENABLE_STACK_DUMPING',
        'ELECTRON_ENABLE_LOGGING',
        'ELECTRON_NO_ASAR',
        'ELECTRON_NO_ATTACH_CONSOLE',
        'ELECTRON_RUN_AS_NODE',
        'GOOGLE_API_KEY',
        'VSCODE_CLI',
        'VSCODE_DEV',
        'VSCODE_IPC_HOOK',
        'VSCODE_LOGS',
        'VSCODE_NLS_CONFIG',
        'VSCODE_PORTABLE',
        'VSCODE_PID',
        'VSCODE_NODE_CACHED_DATA_DIR'
    ];
    keysToRemove.forEach(function (key) {
        if (env[key]) {
            delete env[key];
        }
    });
}
export function addTerminalEnvironmentKeys(env, locale) {
    env['TERM_PROGRAM'] = 'vscode';
    env['TERM_PROGRAM_VERSION'] = pkg.version;
    env['LANG'] = _getLangEnvVariable(locale);
}
export function resolveConfigurationVariables(configurationResolverService, env, lastActiveWorkspaceRoot) {
    Object.keys(env).forEach(function (key) {
        if (typeof env[key] === 'string') {
            env[key] = configurationResolverService.resolve(lastActiveWorkspaceRoot, env[key]);
        }
    });
    return env;
}
function _getLangEnvVariable(locale) {
    var parts = locale ? locale.split('-') : [];
    var n = parts.length;
    if (n === 0) {
        // Fallback to en_US to prevent possible encoding issues.
        return 'en_US.UTF-8';
    }
    if (n === 1) {
        // app.getLocale can return just a language without a variant, fill in the variant for
        // supported languages as many shells expect a 2-part locale.
        var languageVariants = {
            de: 'DE',
            en: 'US',
            es: 'ES',
            fi: 'FI',
            fr: 'FR',
            it: 'IT',
            ja: 'JP',
            ko: 'KR',
            pl: 'PL',
            ru: 'RU',
            zh: 'CN'
        };
        if (parts[0] in languageVariants) {
            parts.push(languageVariants[parts[0]]);
        }
    }
    else {
        // Ensure the variant is uppercase
        parts[1] = parts[1].toUpperCase();
    }
    return parts.join('_') + '.UTF-8';
}
export function getCwd(shell, root, configHelper) {
    if (shell.cwd) {
        return shell.cwd;
    }
    var cwd;
    // TODO: Handle non-existent customCwd
    if (!shell.ignoreConfigurationCwd) {
        // Evaluate custom cwd first
        var customCwd = configHelper.config.cwd;
        if (customCwd) {
            if (paths.isAbsolute(customCwd)) {
                cwd = customCwd;
            }
            else if (root) {
                cwd = paths.normalize(paths.join(root.fsPath, customCwd));
            }
        }
    }
    // If there was no custom cwd or it was relative with no workspace
    if (!cwd) {
        cwd = root ? root.fsPath : os.homedir();
    }
    return _sanitizeCwd(cwd);
}
function _sanitizeCwd(cwd) {
    // Make the drive letter uppercase on Windows (see #9448)
    if (platform.platform === 3 /* Windows */ && cwd && cwd[1] === ':') {
        return cwd[0].toUpperCase() + cwd.substr(1);
    }
    return cwd;
}
/**
 * Adds quotes to a path if it contains whitespaces
 */
export function preparePathForTerminal(path) {
    if (platform.isWindows) {
        if (/\s+/.test(path)) {
            return "\"" + path + "\"";
        }
        return path;
    }
    path = path.replace(/(%5C|\\)/g, '\\\\');
    var charsToEscape = [
        ' ', '\'', '"', '?', ':', ';', '!', '*', '(', ')', '{', '}', '[', ']'
    ];
    for (var i = 0; i < path.length; i++) {
        var indexOfChar = charsToEscape.indexOf(path.charAt(i));
        if (indexOfChar >= 0) {
            path = path.substring(0, i) + "\\" + path.charAt(i) + path.substring(i + 1);
            i++; // Skip char due to escape char being added
        }
    }
    return path;
}
