/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars}
 */

// Hack since TypeScript isn't compiling this for a worker.
declare const WorkerGlobalScope;
export const zoneSymbol: (name: string) => string = (n) => `__zone_symbol__${n}`;
const _global = typeof window === 'object' && window || typeof self === 'object' && self || global;

export function bindArguments(args: any[], source: string): any[] {
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {
      args[i] = Zone.current.wrap(args[i], source + '_' + i);
    }
  }
  return args;
}

export function patchPrototype(prototype, fnNames) {
  const source = prototype.constructor['name'];
  for (let i = 0; i < fnNames.length; i++) {
    const name = fnNames[i];
    const delegate = prototype[name];
    if (delegate) {
      prototype[name] = ((delegate: Function) => {
        return function() {
          return delegate.apply(this, bindArguments(<any>arguments, source + '.' + name));
        };
      })(delegate);
    }
  }
}

export const isWebWorker: boolean =
    (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);

export const isNode: boolean =
    (!('nw' in _global) && typeof process !== 'undefined' &&
     {}.toString.call(process) === '[object process]');

export const isBrowser: boolean =
    !isNode && !isWebWorker && !!(typeof window !== 'undefined' && window['HTMLElement']);


export function patchProperty(obj, prop) {
  const desc = Object.getOwnPropertyDescriptor(obj, prop) || {enumerable: true, configurable: true};

  const originalDesc = Object.getOwnPropertyDescriptor(obj, 'original' + prop);
  if (!originalDesc && desc.get) {
    Object.defineProperty(
        obj, 'original' + prop, {enumerable: false, configurable: true, get: desc.get});
  }

  // A property descriptor cannot have getter/setter and be writable
  // deleting the writable and value properties avoids this error:
  //
  // TypeError: property descriptors must not specify a value or be writable when a
  // getter or setter has been specified
  delete desc.writable;
  delete desc.value;

  // substr(2) cuz 'onclick' -> 'click', etc
  const eventName = prop.substr(2);
  const _prop = '_' + prop;

  desc.set = function(fn) {
    if (this[_prop]) {
      this.removeEventListener(eventName, this[_prop]);
    }

    if (typeof fn === 'function') {
      const wrapFn = function(event) {
        let result;
        result = fn.apply(this, arguments);

        if (result != undefined && !result) event.preventDefault();
      };

      this[_prop] = wrapFn;
      this.addEventListener(eventName, wrapFn, false);
    } else {
      this[_prop] = null;
    }
  };

  // The getter would return undefined for unassigned properties but the default value of an
  // unassigned property is null
  desc.get = function() {
    let r = this[_prop] || null;
    // result will be null when use inline event attribute,
    // such as <button onclick="func();">OK</button>
    // because the onclick function is internal raw uncompiled handler
    // the onclick will be evaluated when first time event was triggered or
    // the property is accessed, https://github.com/angular/zone.js/issues/525
    // so we should use original native get to retrieve the handler
    if (r === null) {
      if (originalDesc && originalDesc.get) {
        r = originalDesc.get.apply(this, arguments);
        if (r) {
          desc.set.apply(this, [r]);
          if (typeof this['removeAttribute'] === 'function') {
            this.removeAttribute(prop);
          }
        }
      }
    }
    return this[_prop] || null;
  };

  Object.defineProperty(obj, prop, desc);
};

export function patchOnProperties(obj: any, properties: string[]) {
  const onProperties = [];
  for (const prop in obj) {
    if (prop.substr(0, 2) == 'on') {
      onProperties.push(prop);
    }
  }
  for (let j = 0; j < onProperties.length; j++) {
    patchProperty(obj, onProperties[j]);
  }
  if (properties) {
    for (let i = 0; i < properties.length; i++) {
      patchProperty(obj, 'on' + properties[i]);
    }
  }
};

const EVENT_TASKS = zoneSymbol('eventTasks');

// For EventTarget
const ADD_EVENT_LISTENER = 'addEventListener';
const REMOVE_EVENT_LISTENER = 'removeEventListener';

export interface NestedEventListener { listener?: EventListenerOrEventListenerObject; }

export declare type NestedEventListenerOrEventListenerObject =
    NestedEventListener | EventListener | EventListenerObject;

export interface ListenerTaskMeta extends TaskData {
  useCapturing: boolean;
  eventName: string;
  handler: NestedEventListenerOrEventListenerObject;
  target: any;
  name: string;
  invokeAddFunc: (addFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) => any;
  invokeRemoveFunc:
      (removeFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) => any;
}

function findExistingRegisteredTask(
    target: any, handler: any, name: string, capture: boolean, remove: boolean): Task {
  const eventTasks: Task[] = target[EVENT_TASKS];
  if (eventTasks) {
    for (let i = 0; i < eventTasks.length; i++) {
      const eventTask = eventTasks[i];
      const data = <ListenerTaskMeta>eventTask.data;
      const listener = <NestedEventListener>data.handler;
      if ((data.handler === handler || listener.listener === handler) &&
          data.useCapturing === capture && data.eventName === name) {
        if (remove) {
          eventTasks.splice(i, 1);
        }
        return eventTask;
      }
    }
  }
  return null;
}

function findAllExistingRegisteredTasks(
    target: any, name: string, capture: boolean, remove: boolean): Task[] {
  const eventTasks: Task[] = target[EVENT_TASKS];
  if (eventTasks) {
    const result = [];
    for (let i = eventTasks.length - 1; i >= 0; i--) {
      const eventTask = eventTasks[i];
      const data = <ListenerTaskMeta>eventTask.data;
      if (data.eventName === name && data.useCapturing === capture) {
        result.push(eventTask);
        if (remove) {
          eventTasks.splice(i, 1);
        }
      }
    }
    return result;
  }
  return null;
}

function attachRegisteredEvent(target: any, eventTask: Task, isPrepend: boolean): void {
  let eventTasks: Task[] = target[EVENT_TASKS];
  if (!eventTasks) {
    eventTasks = target[EVENT_TASKS] = [];
  }
  if (isPrepend) {
    eventTasks.unshift(eventTask);
  } else {
    eventTasks.push(eventTask);
  }
}

const defaultListenerMetaCreator = (self: any, args: any[]) => {
  return {
    useCapturing: args[2],
    eventName: args[0],
    handler: args[1],
    target: self || _global,
    name: args[0],
    invokeAddFunc: function(
        addFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) {
      if (delegate && (<Task>delegate).invoke) {
        return this.target[addFnSymbol](this.eventName, (<Task>delegate).invoke, this.useCapturing);
      } else {
        return this.target[addFnSymbol](this.eventName, delegate, this.useCapturing);
      }
    },
    invokeRemoveFunc: function(
        removeFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) {
      if (delegate && (<Task>delegate).invoke) {
        return this.target[removeFnSymbol](
            this.eventName, (<Task>delegate).invoke, this.useCapturing);
      } else {
        return this.target[removeFnSymbol](this.eventName, delegate, this.useCapturing);
      }
    }
  };
};

export function makeZoneAwareAddListener(
    addFnName: string, removeFnName: string, useCapturingParam: boolean = true,
    allowDuplicates: boolean = false, isPrepend: boolean = false,
    metaCreator: (self: any, args: any[]) => ListenerTaskMeta = defaultListenerMetaCreator) {
  const addFnSymbol = zoneSymbol(addFnName);
  const removeFnSymbol = zoneSymbol(removeFnName);
  const defaultUseCapturing = useCapturingParam ? false : undefined;

  function scheduleEventListener(eventTask: Task): any {
    const meta = <ListenerTaskMeta>eventTask.data;
    attachRegisteredEvent(meta.target, eventTask, isPrepend);
    return meta.invokeAddFunc(addFnSymbol, eventTask);
  }

  function cancelEventListener(eventTask: Task): void {
    const meta = <ListenerTaskMeta>eventTask.data;
    findExistingRegisteredTask(
        meta.target, eventTask.invoke, meta.eventName, meta.useCapturing, true);
    return meta.invokeRemoveFunc(removeFnSymbol, eventTask);
  }

  return function zoneAwareAddListener(self: any, args: any[]) {
    const data: ListenerTaskMeta = metaCreator(self, args);

    data.useCapturing = data.useCapturing || defaultUseCapturing;
    // - Inside a Web Worker, `this` is undefined, the context is `global`
    // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
    // see https://github.com/angular/zone.js/issues/190
    let delegate: EventListener = null;
    if (typeof data.handler == 'function') {
      delegate = <EventListener>data.handler;
    } else if (data.handler && (<EventListenerObject>data.handler).handleEvent) {
      delegate = (event) => (<EventListenerObject>data.handler).handleEvent(event);
    }
    let validZoneHandler = false;
    try {
      // In cross site contexts (such as WebDriver frameworks like Selenium),
      // accessing the handler object here will cause an exception to be thrown which
      // will fail tests prematurely.
      validZoneHandler = data.handler && data.handler.toString() === '[object FunctionWrapper]';
    } catch (e) {
      // Returning nothing here is fine, because objects in a cross-site context are unusable
      return;
    }
    // Ignore special listeners of IE11 & Edge dev tools, see
    // https://github.com/angular/zone.js/issues/150
    if (!delegate || validZoneHandler) {
      return data.invokeAddFunc(addFnSymbol, data.handler);
    }

    if (!allowDuplicates) {
      const eventTask: Task = findExistingRegisteredTask(
          data.target, data.handler, data.eventName, data.useCapturing, false);
      if (eventTask) {
        // we already registered, so this will have noop.
        return data.invokeAddFunc(addFnSymbol, eventTask);
      }
    }

    const zone: Zone = Zone.current;
    const source = data.target.constructor['name'] + '.' + addFnName + ':' + data.eventName;

    zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
  };
}

export function makeZoneAwareRemoveListener(
    fnName: string, useCapturingParam: boolean = true,
    metaCreator: (self: any, args: any[]) => ListenerTaskMeta = defaultListenerMetaCreator) {
  const symbol = zoneSymbol(fnName);
  const defaultUseCapturing = useCapturingParam ? false : undefined;

  return function zoneAwareRemoveListener(self: any, args: any[]) {
    const data = metaCreator(self, args);
    data.useCapturing = data.useCapturing || defaultUseCapturing;
    // - Inside a Web Worker, `this` is undefined, the context is `global`
    // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
    // see https://github.com/angular/zone.js/issues/190
    const eventTask = findExistingRegisteredTask(
        data.target, data.handler, data.eventName, data.useCapturing, true);
    if (eventTask) {
      eventTask.zone.cancelTask(eventTask);
    } else {
      data.invokeRemoveFunc(symbol, data.handler);
    }
  };
}

export function makeZoneAwareRemoveAllListeners(fnName: string, useCapturingParam: boolean = true) {
  const symbol = zoneSymbol(fnName);
  const defaultUseCapturing = useCapturingParam ? false : undefined;

  return function zoneAwareRemoveAllListener(self: any, args: any[]) {
    const target = self || _global;
    if (args.length === 0) {
      // remove all listeners without eventName
      target[EVENT_TASKS] = [];
      // we don't cancel Task either, because call native eventEmitter.removeAllListeners will
      // will do remove listener(cancelTask) for us
      target[symbol]();
      return;
    }
    const eventName = args[0];
    const useCapturing = args[1] || defaultUseCapturing;
    // call this function just remove the related eventTask from target[EVENT_TASKS]
    findAllExistingRegisteredTasks(target, eventName, useCapturing, true);
    // we don't need useCapturing here because useCapturing is just for DOM, and
    // removeAllListeners should only be called by node eventEmitter
    // and we don't cancel Task either, because call native eventEmitter.removeAllListeners will
    // will do remove listener(cancelTask) for us
    target[symbol](eventName);
  };
}

export function makeZoneAwareListeners(fnName: string) {
  const symbol = zoneSymbol(fnName);

  return function zoneAwareEventListeners(self: any, args: any[]) {
    const eventName: string = args[0];
    const target = self || _global;
    if (!target[EVENT_TASKS]) {
      return [];
    }
    return target[EVENT_TASKS]
        .filter(task => task.data.eventName === eventName)
        .map(task => task.data.handler);
  };
}

const zoneAwareAddEventListener =
    makeZoneAwareAddListener(ADD_EVENT_LISTENER, REMOVE_EVENT_LISTENER);
const zoneAwareRemoveEventListener = makeZoneAwareRemoveListener(REMOVE_EVENT_LISTENER);

export function patchEventTargetMethods(
    obj: any, addFnName: string = ADD_EVENT_LISTENER, removeFnName: string = REMOVE_EVENT_LISTENER,
    metaCreator: (self: any, args: any[]) => ListenerTaskMeta =
        defaultListenerMetaCreator): boolean {
  if (obj && obj[addFnName]) {
    patchMethod(
        obj, addFnName,
        () => makeZoneAwareAddListener(addFnName, removeFnName, true, false, false, metaCreator));
    patchMethod(
        obj, removeFnName, () => makeZoneAwareRemoveListener(removeFnName, true, metaCreator));
    return true;
  } else {
    return false;
  }
}

const originalInstanceKey = zoneSymbol('originalInstance');

// wrap some native API on `window`
export function patchClass(className) {
  const OriginalClass = _global[className];
  if (!OriginalClass) return;

  _global[className] = function() {
    const a = bindArguments(<any>arguments, className);
    switch (a.length) {
      case 0:
        this[originalInstanceKey] = new OriginalClass();
        break;
      case 1:
        this[originalInstanceKey] = new OriginalClass(a[0]);
        break;
      case 2:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
        break;
      case 3:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
        break;
      case 4:
        this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
        break;
      default:
        throw new Error('Arg list too long.');
    }
  };

  const instance = new OriginalClass(function() {});

  let prop;
  for (prop in instance) {
    // https://bugs.webkit.org/show_bug.cgi?id=44721
    if (className === 'XMLHttpRequest' && prop === 'responseBlob') continue;
    (function(prop) {
      if (typeof instance[prop] === 'function') {
        _global[className].prototype[prop] = function() {
          return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
        };
      } else {
        Object.defineProperty(_global[className].prototype, prop, {
          set: function(fn) {
            if (typeof fn === 'function') {
              this[originalInstanceKey][prop] = Zone.current.wrap(fn, className + '.' + prop);
            } else {
              this[originalInstanceKey][prop] = fn;
            }
          },
          get: function() {
            return this[originalInstanceKey][prop];
          }
        });
      }
    }(prop));
  }

  for (prop in OriginalClass) {
    if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
      _global[className][prop] = OriginalClass[prop];
    }
  }
};

export function createNamedFn(name: string, delegate: (self: any, args: any[]) => any): Function {
  try {
    return (Function('f', `return function ${name}(){return f(this, arguments)}`))(delegate);
  } catch (e) {
    // if we fail, we must be CSP, just return delegate.
    return function() {
      return delegate(this, <any>arguments);
    };
  }
}

export function patchMethod(
    target: any, name: string,
    patchFn: (delegate: Function, delegateName: string, name: string) => (self: any, args: any[]) =>
        any): Function {
  let proto = target;
  while (proto && Object.getOwnPropertyNames(proto).indexOf(name) === -1) {
    proto = Object.getPrototypeOf(proto);
  }
  if (!proto && target[name]) {
    // somehow we did not find it, but we can see it. This happens on IE for Window properties.
    proto = target;
  }
  const delegateName = zoneSymbol(name);
  let delegate: Function;
  if (proto && !(delegate = proto[delegateName])) {
    delegate = proto[delegateName] = proto[name];
    proto[name] = createNamedFn(name, patchFn(delegate, delegateName, name));
  }
  return delegate;
}

export interface MacroTaskMeta extends TaskData {
  name: string;
  target: any;
  callbackIndex: number;
  args: any[];
}

// TODO: support cancel task later if necessary
export function patchMacroTask(
    obj: any, funcName: string, metaCreator: (self: any, args: any[]) => MacroTaskMeta) {
  let setNative = null;

  function scheduleTask(task: Task) {
    const data = <MacroTaskMeta>task.data;
    data.args[data.callbackIndex] = function() {
      task.invoke.apply(this, arguments);
    };
    setNative.apply(data.target, data.args);
    return task;
  }

  setNative = patchMethod(obj, funcName, (delegate: Function) => function(self: any, args: any[]) {
    const meta = metaCreator(self, args);
    if (meta.callbackIndex >= 0 && typeof args[meta.callbackIndex] === 'function') {
      const task = Zone.current.scheduleMacroTask(
          meta.name, args[meta.callbackIndex], meta, scheduleTask, null);
      return task;
    } else {
      // cause an error by calling it directly.
      return delegate.apply(self, args);
    }
  });
}
