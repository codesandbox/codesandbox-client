/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function createMessageOfType(type) {
    var result = Buffer.allocUnsafe(1);
    switch (type) {
        case 0 /* Initialized */:
            result.writeUInt8(1, 0);
            break;
        case 1 /* Ready */:
            result.writeUInt8(2, 0);
            break;
        case 2 /* Terminate */:
            result.writeUInt8(3, 0);
            break;
    }
    return result;
}
export function isMessageOfType(message, type) {
    if (message.length !== 1) {
        return false;
    }
    switch (message.readUInt8(0)) {
        case 1: return type === 0 /* Initialized */;
        case 2: return type === 1 /* Ready */;
        case 3: return type === 2 /* Terminate */;
        default: return false;
    }
}
