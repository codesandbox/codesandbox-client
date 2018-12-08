/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { SyncDescriptor } from './descriptors.js';
var _registry = [];
export function registerSingleton(id, ctor, supportsDelayedInstantiation) {
    _registry.push({ id: id, descriptor: new SyncDescriptor(ctor, [], supportsDelayedInstantiation) });
}
export function getServices() {
    return _registry;
}
