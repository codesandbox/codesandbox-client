/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var KeybindingSource;
(function (KeybindingSource) {
    KeybindingSource[KeybindingSource["Default"] = 1] = "Default";
    KeybindingSource[KeybindingSource["User"] = 2] = "User";
})(KeybindingSource || (KeybindingSource = {}));
export var IKeybindingService = createDecorator('keybindingService');
