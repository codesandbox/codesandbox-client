/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {patchTimer} from '../common/timers';
import {patchClass, patchMethod, patchPrototype, zoneSymbol} from '../common/utils';

import {propertyPatch} from './define-property';
import {eventTargetPatch} from './event-target';
import {propertyDescriptorPatch} from './property-descriptor';
import {registerElementPatch} from './register-element';

const set = 'set';
const clear = 'clear';
const blockingMethods = ['alert', 'prompt', 'confirm'];
const _global = typeof window === 'object' && window || typeof self === 'object' && self || global;

patchTimer(_global, set, clear, 'Timeout');
patchTimer(_global, set, clear, 'Interval');
patchTimer(_global, set, clear, 'Immediate');
patchTimer(_global, 'request', 'cancel', 'AnimationFrame');
patchTimer(_global, 'mozRequest', 'mozCancel', 'AnimationFrame');
patchTimer(_global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');

for (let i = 0; i < blockingMethods.length; i++) {
  const name = blockingMethods[i];
  patchMethod(_global, name, (delegate, symbol, name) => {
    return function(s: any, args: any[]) {
      return Zone.current.run(delegate, _global, args, name);
    };
  });
}

eventTargetPatch(_global);
propertyDescriptorPatch(_global);
patchClass('MutationObserver');
patchClass('WebKitMutationObserver');
patchClass('FileReader');
propertyPatch();
registerElementPatch(_global);

// Treat XMLHTTPRequest as a macrotask.
patchXHR(_global);

const XHR_TASK = zoneSymbol('xhrTask');
const XHR_SYNC = zoneSymbol('xhrSync');
const XHR_LISTENER = zoneSymbol('xhrListener');
const XHR_SCHEDULED = zoneSymbol('xhrScheduled');

interface XHROptions extends TaskData {
  target: any;
  args: any[];
  aborted: boolean;
}

function patchXHR(window: any) {
  function findPendingTask(target: any) {
    const pendingTask: Task = target[XHR_TASK];
    return pendingTask;
  }

  function scheduleTask(task: Task) {
    self[XHR_SCHEDULED] = false;
    const data = <XHROptions>task.data;
    // remove existing event listener
    const listener = data.target[XHR_LISTENER];
    if (listener) {
      data.target.removeEventListener('readystatechange', listener);
    }
    const newListener = data.target[XHR_LISTENER] = () => {
      if (data.target.readyState === data.target.DONE) {
        if (!data.aborted && self[XHR_SCHEDULED]) {
          task.invoke();
        }
      }
    };
    data.target.addEventListener('readystatechange', newListener);

    const storedTask: Task = data.target[XHR_TASK];
    if (!storedTask) {
      data.target[XHR_TASK] = task;
    }
    sendNative.apply(data.target, data.args);
    self[XHR_SCHEDULED] = true;
    return task;
  }

  function placeholderCallback() {}

  function clearTask(task: Task) {
    const data = <XHROptions>task.data;
    // Note - ideally, we would call data.target.removeEventListener here, but it's too late
    // to prevent it from firing. So instead, we store info for the event listener.
    data.aborted = true;
    return abortNative.apply(data.target, data.args);
  }

  const openNative =
      patchMethod(window.XMLHttpRequest.prototype, 'open', () => function(self: any, args: any[]) {
        self[XHR_SYNC] = args[2] == false;
        return openNative.apply(self, args);
      });

  const sendNative =
      patchMethod(window.XMLHttpRequest.prototype, 'send', () => function(self: any, args: any[]) {
        const zone = Zone.current;
        if (self[XHR_SYNC]) {
          // if the XHR is sync there is no task to schedule, just execute the code.
          return sendNative.apply(self, args);
        } else {
          const options: XHROptions =
              {target: self, isPeriodic: false, delay: null, args: args, aborted: false};
          return zone.scheduleMacroTask(
              'XMLHttpRequest.send', placeholderCallback, options, scheduleTask, clearTask);
        }
      });

  const abortNative = patchMethod(
      window.XMLHttpRequest.prototype, 'abort',
      (delegate: Function) => function(self: any, args: any[]) {
        const task: Task = findPendingTask(self);
        if (task && typeof task.type == 'string') {
          // If the XHR has already completed, do nothing.
          // If the XHR has already been aborted, do nothing.
          // Fix #569, call abort multiple times before done will cause
          // macroTask task count be negative number
          if (task.cancelFn == null || (task.data && (<XHROptions>task.data).aborted)) {
            return;
          }
          task.zone.cancelTask(task);
        }
        // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no task
        // to cancel. Do nothing.
      });
}

/// GEO_LOCATION
if (_global['navigator'] && _global['navigator'].geolocation) {
  patchPrototype(_global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
}
