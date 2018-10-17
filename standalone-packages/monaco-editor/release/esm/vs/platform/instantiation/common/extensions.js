/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { SyncDescriptor } from './descriptors.js';
var _registry = [];
export function registerSingleton(id, ctor) {
    _registry.push({ id: id, descriptor: new SyncDescriptor(ctor) });
}
export function getServices() {
    return _registry;
}
