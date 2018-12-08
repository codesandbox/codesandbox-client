/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var IOpenerService = createDecorator('openerService');
export var NullOpenerService = Object.freeze({
    _serviceBrand: undefined,
    open: function () { return Promise.resolve(undefined); }
});
