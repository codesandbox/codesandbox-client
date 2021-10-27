"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const regexp_1 = require("../utils/regexp");
class TypeScriptServerError extends Error {
    constructor(serverId, version, response, serverMessage, serverStack) {
        super(`<${serverId}> TypeScript Server Error (${version.versionString})\n${serverMessage}\n${serverStack}`);
        this.response = response;
        this.serverMessage = serverMessage;
        this.serverStack = serverStack;
    }
    static create(serverId, version, response) {
        const parsedResult = TypeScriptServerError.parseErrorText(version, response);
        return new TypeScriptServerError(serverId, version, response, parsedResult ? parsedResult.message : undefined, parsedResult ? parsedResult.stack : undefined);
    }
    get serverErrorText() { return this.response.message; }
    get serverCommand() { return this.response.command; }
    /**
     * Given a `errorText` from a tsserver request indicating failure in handling a request,
     * prepares a payload for telemetry-logging.
     */
    static parseErrorText(version, response) {
        const errorText = response.message;
        if (errorText) {
            const errorPrefix = 'Error processing request. ';
            if (errorText.startsWith(errorPrefix)) {
                let prefixFreeErrorText = errorText.substr(errorPrefix.length);
                // Prior to https://github.com/microsoft/TypeScript/pull/32785, this error
                // returned and excessively long and detailed list of paths.  Since server-side
                // filtering doesn't have sufficient granularity to drop these specific
                // messages, we sanitize them here.
                if (prefixFreeErrorText.indexOf('Could not find sourceFile') >= 0) {
                    prefixFreeErrorText = prefixFreeErrorText.replace(/ in \[[^\]]*\]/g, '');
                }
                const newlineIndex = prefixFreeErrorText.indexOf('\n');
                if (newlineIndex >= 0) {
                    // Newline expected between message and stack.
                    return {
                        message: prefixFreeErrorText.substring(0, newlineIndex),
                        stack: TypeScriptServerError.normalizeMessageStack(version, prefixFreeErrorText.substring(newlineIndex + 1))
                    };
                }
            }
        }
        return undefined;
    }
    /**
     * Try to replace full TS Server paths with 'tsserver.js' so that we don't have to post process the data as much
     */
    static normalizeMessageStack(version, message) {
        if (!message) {
            return '';
        }
        return message.replace(new RegExp(`${regexp_1.escapeRegExp(version.path)}[/\\\\]tsserver.js:`, 'gi'), 'tsserver.js:');
    }
}
exports.TypeScriptServerError = TypeScriptServerError;
//# sourceMappingURL=serverError.js.map