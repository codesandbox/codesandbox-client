/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter, mapEvent } from '../common/event.js';
export var domEvent = function (element, type, useCapture) {
    var fn = function (e) { return emitter.fire(e); };
    var emitter = new Emitter({
        onFirstListenerAdd: function () {
            element.addEventListener(type, fn, useCapture);
        },
        onLastListenerRemove: function () {
            element.removeEventListener(type, fn, useCapture);
        }
    });
    return emitter.event;
};
export function stop(event) {
    return mapEvent(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
        return e;
    });
}
