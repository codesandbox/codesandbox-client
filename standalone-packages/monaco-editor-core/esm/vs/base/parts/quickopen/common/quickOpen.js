/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export var Mode;
(function (Mode) {
    Mode[Mode["PREVIEW"] = 0] = "PREVIEW";
    Mode[Mode["OPEN"] = 1] = "OPEN";
    Mode[Mode["OPEN_IN_BACKGROUND"] = 2] = "OPEN_IN_BACKGROUND";
})(Mode || (Mode = {}));
