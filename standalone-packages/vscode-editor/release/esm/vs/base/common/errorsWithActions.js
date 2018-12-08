/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function isErrorWithActions(obj) {
    return obj instanceof Error && Array.isArray(obj.actions);
}
export function createErrorWithActions(message, options) {
    if (options === void 0) { options = Object.create(null); }
    var result = new Error(message);
    if (options.actions) {
        result.actions = options.actions;
    }
    return result;
}
