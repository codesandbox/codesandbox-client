/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {makeZoneAwareAddListener, makeZoneAwareListeners, makeZoneAwareRemoveAllListeners, makeZoneAwareRemoveListener, patchMethod} from '../common/utils';

const callAndReturnFirstParam = (fn: (self: any, args: any[]) => any) => {
  return (self: any, args: any[]) => {
    fn(self, args);
    return self;
  };
};

// For EventEmitter
const EE_ADD_LISTENER = 'addListener';
const EE_PREPEND_LISTENER = 'prependListener';
const EE_REMOVE_LISTENER = 'removeListener';
const EE_REMOVE_ALL_LISTENER = 'removeAllListeners';
const EE_LISTENERS = 'listeners';
const EE_ON = 'on';

const zoneAwareAddListener = callAndReturnFirstParam(
    makeZoneAwareAddListener(EE_ADD_LISTENER, EE_REMOVE_LISTENER, false, true, false));
const zoneAwarePrependListener = callAndReturnFirstParam(
    makeZoneAwareAddListener(EE_PREPEND_LISTENER, EE_REMOVE_LISTENER, false, true, true));
const zoneAwareRemoveListener =
    callAndReturnFirstParam(makeZoneAwareRemoveListener(EE_REMOVE_LISTENER, false));
const zoneAwareRemoveAllListeners =
    callAndReturnFirstParam(makeZoneAwareRemoveAllListeners(EE_REMOVE_ALL_LISTENER, false));
const zoneAwareListeners = makeZoneAwareListeners(EE_LISTENERS);

export function patchEventEmitterMethods(obj: any): boolean {
  if (obj && obj.addListener) {
    patchMethod(obj, EE_ADD_LISTENER, () => zoneAwareAddListener);
    patchMethod(obj, EE_PREPEND_LISTENER, () => zoneAwarePrependListener);
    patchMethod(obj, EE_REMOVE_LISTENER, () => zoneAwareRemoveListener);
    patchMethod(obj, EE_REMOVE_ALL_LISTENER, () => zoneAwareRemoveAllListeners);
    patchMethod(obj, EE_LISTENERS, () => zoneAwareListeners);
    obj[EE_ON] = obj[EE_ADD_LISTENER];
    return true;
  } else {
    return false;
  }
}

// EventEmitter
let events;
try {
  events = require('events');
} catch (err) {
}

if (events && events.EventEmitter) {
  patchEventEmitterMethods(events.EventEmitter.prototype);
}
