/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../base/common/winjs.base';
import { Event } from '../../../base/common/event';
import { createDecorator } from '../../instantiation/common/instantiation';
import { isThenable } from '../../../base/common/async';
export var ILifecycleService = createDecorator('lifecycleService');
export function StartupKindToString(startupKind) {
    switch (startupKind) {
        case 1 /* NewWindow */: return 'NewWindow';
        case 3 /* ReloadedWindow */: return 'ReloadedWindow';
        case 4 /* ReopenedWindow */: return 'ReopenedWindow';
    }
}
export function LifecyclePhaseToString(phase) {
    switch (phase) {
        case 1 /* Starting */: return 'Starting';
        case 2 /* Restoring */: return 'Restoring';
        case 3 /* Running */: return 'Running';
        case 4 /* Eventually */: return 'Eventually';
    }
}
export var NullLifecycleService = {
    _serviceBrand: null,
    phase: 3 /* Running */,
    when: function () { return Promise.resolve(); },
    startupKind: 1 /* NewWindow */,
    onWillShutdown: Event.None,
    onShutdown: Event.None
};
// Shared veto handling across main and renderer
export function handleVetos(vetos, onError) {
    if (vetos.length === 0) {
        return TPromise.as(false);
    }
    var promises = [];
    var lazyValue = false;
    for (var _i = 0, vetos_1 = vetos; _i < vetos_1.length; _i++) {
        var valueOrPromise = vetos_1[_i];
        // veto, done
        if (valueOrPromise === true) {
            return TPromise.as(true);
        }
        if (isThenable(valueOrPromise)) {
            promises.push(valueOrPromise.then(function (value) {
                if (value) {
                    lazyValue = true; // veto, done
                }
            }, function (err) {
                onError(err); // error, treated like a veto, done
                lazyValue = true;
            }));
        }
    }
    return TPromise.join(promises).then(function () { return lazyValue; });
}
