/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/*
 * Suppress closure compiler errors about unknown 'global' variable
 * @fileoverview
 * @suppress {undefinedVars}
 */

/**
 * Zone is a mechanism for intercepting and keeping track of asynchronous work.
 *
 * A Zone is a global object which is configured with rules about how to intercept and keep track
 * of the asynchronous callbacks. Zone has these responsibilities:
 *
 * 1. Intercept asynchronous task scheduling
 * 2. Wrap callbacks for error-handling and zone tracking across async operations.
 * 3. Provide a way to attach data to zones
 * 4. Provide a context specific last frame error handling
 * 5. (Intercept blocking methods)
 *
 * A zone by itself does not do anything, instead it relies on some other code to route existing
 * platform API through it. (The zone library ships with code which monkey patches all of the
 * browsers's asynchronous API and redirects them through the zone for interception.)
 *
 * In its simplest form a zone allows one to intercept the scheduling and calling of asynchronous
 * operations, and execute additional code before as well as after the asynchronous task. The rules
 * of interception are configured using [ZoneConfig]. There can be many different zone instances in
 * a system, but only one zone is active at any given time which can be retrieved using
 * [Zone#current].
 *
 *
 *
 * ## Callback Wrapping
 *
 * An important aspect of the zones is that they should persist across asynchronous operations. To
 * achieve this, when a future work is scheduled through async API, it is necessary to capture, and
 * subsequently restore the current zone. For example if a code is running in zone `b` and it
 * invokes `setTimeout` to scheduleTask work later, the `setTimeout` method needs to 1) capture the
 * current zone and 2) wrap the `wrapCallback` in code which will restore the current zone `b` once
 * the wrapCallback executes. In this way the rules which govern the current code are preserved in
 * all future asynchronous tasks. There could be a different zone `c` which has different rules and
 * is associated with different asynchronous tasks. As these tasks are processed, each asynchronous
 * wrapCallback correctly restores the correct zone, as well as preserves the zone for future
 * asynchronous callbacks.
 *
 * Example: Suppose a browser page consist of application code as well as third-party
 * advertisement code. (These two code bases are independent, developed by different mutually
 * unaware developers.) The application code may be interested in doing global error handling and
 * so it configures the `app` zone to send all of the errors to the server for analysis, and then
 * executes the application in the `app` zone. The advertising code is interested in the same
 * error processing but it needs to send the errors to a different third-party. So it creates the
 * `ads` zone with a different error handler. Now both advertising as well as application code
 * create many asynchronous operations, but the [Zone] will ensure that all of the asynchronous
 * operations created from the application code will execute in `app` zone with its error
 * handler and all of the advertisement code will execute in the `ads` zone with its error handler.
 * This will not only work for the async operations created directly, but also for all subsequent
 * asynchronous operations.
 *
 * If you think of chain of asynchronous operations as a thread of execution (bit of a stretch)
 * then [Zone#current] will act as a thread local variable.
 *
 *
 *
 * ## Asynchronous operation scheduling
 *
 * In addition to wrapping the callbacks to restore the zone, all operations which cause a
 * scheduling of work for later are routed through the current zone which is allowed to intercept
 * them by adding work before or after the wrapCallback as well as using different means of
 * achieving the request. (Useful for unit testing, or tracking of requests). In some instances
 * such as `setTimeout` the wrapping of the wrapCallback and scheduling is done in the same
 * wrapCallback, but there are other examples such as `Promises` where the `then` wrapCallback is
 * wrapped, but the execution of `then` in triggered by `Promise` scheduling `resolve` work.
 *
 * Fundamentally there are three kinds of tasks which can be scheduled:
 *
 * 1. [MicroTask] used for doing work right after the current task. This is non-cancelable which is
 *    guaranteed to run exactly once and immediately.
 * 2. [MacroTask] used for doing work later. Such as `setTimeout`. This is typically cancelable
 *    which is guaranteed to execute at least once after some well understood delay.
 * 3. [EventTask] used for listening on some future event. This may execute zero or more times, with
 *    an unknown delay.
 *
 * Each asynchronous API is modeled and routed through one of these APIs.
 *
 *
 * ### [MicroTask]
 *
 * [MicroTask]s represent work which will be done in current VM turn as soon as possible, before VM
 * yielding.
 *
 *
 * ### [TimerTask]
 *
 * [TimerTask]s represent work which will be done after some delay. (Sometimes the delay is
 * approximate such as on next available animation frame). Typically these methods include:
 * `setTimeout`, `setImmediate`, `setInterval`, `requestAnimationFrame`, and all browser specif
 * variants.
 *
 *
 * ### [EventTask]
 *
 * [EventTask]s represent a request to create a listener on an event. Unlike the other task
 * events may never be executed, but typically execute more than once. There is no queue of
 * events, rather their callbacks are unpredictable both in order and time.
 *
 *
 * ## Global Error Handling
 *
 *
 * ## Composability
 *
 * Zones can be composed together through [Zone.fork()]. A child zone may create its own set of
 * rules. A child zone is expected to either:
 *
 * 1. Delegate the interception to a parent zone, and optionally add before and after wrapCallback
 *    hook.s
 * 2) Or process the request itself without delegation.
 *
 * Composability allows zones to keep their concerns clean. For example a top most zone may chose
 * to handle error handling, while child zones may chose to do user action tracking.
 *
 *
 * ## Root Zone
 *
 * At the start the browser will run in a special root zone, which is configure to behave exactly
 * like the platform, making any existing code which is not-zone aware behave as expected. All
 * zones are children of the root zone.
 *
 */
interface Zone {
  /**
   *
   * @returns {Zone} The parent Zone.
   */
  parent: Zone;
  /**
   * @returns {string} The Zone name (useful for debugging)
   */
  name: string;

  /**
   * Returns a value associated with the `key`.
   *
   * If the current zone does not have a key, the request is delegated to the parent zone. Use
   * [ZoneSpec.properties] to configure the set of properties associated with the current zone.
   *
   * @param key The key to retrieve.
   * @returns {any} The value for the key, or `undefined` if not found.
   */
  get(key: string): any;
  /**
   * Returns a Zone which defines a `key`.
   *
   * Recursively search the parent Zone until a Zone which has a property `key` is found.
   *
   * @param key The key to use for identification of the returned zone.
   * @returns {Zone} The Zone which defines the `key`, `null` if not found.
   */
  getZoneWith(key: string): Zone;
  /**
   * Used to create a child zone.
   *
   * @param zoneSpec A set of rules which the child zone should follow.
   * @returns {Zone} A new child zone.
   */
  fork(zoneSpec: ZoneSpec): Zone;
  /**
   * Wraps a callback function in a new function which will properly restore the current zone upon
   * invocation.
   *
   * The wrapped function will properly forward `this` as well as `arguments` to the `callback`.
   *
   * Before the function is wrapped the zone can intercept the `callback` by declaring
   * [ZoneSpec.onIntercept].
   *
   * @param callback the function which will be wrapped in the zone.
   * @param source A unique debug location of the API being wrapped.
   * @returns {function(): *} A function which will invoke the `callback` through [Zone.runGuarded].
   */
  wrap<F extends Function>(callback: F, source: string): F;
  /**
   * Invokes a function in a given zone.
   *
   * The invocation of `callback` can be intercepted be declaring [ZoneSpec.onInvoke].
   *
   * @param callback The function to invoke.
   * @param applyThis
   * @param applyArgs
   * @param source A unique debug location of the API being invoked.
   * @returns {any} Value from the `callback` function.
   */
  run<T>(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): T;
  /**
   * Invokes a function in a given zone and catches any exceptions.
   *
   * Any exceptions thrown will be forwarded to [Zone.HandleError].
   *
   * The invocation of `callback` can be intercepted be declaring [ZoneSpec.onInvoke]. The
   * handling of exceptions can intercepted by declaring [ZoneSpec.handleError].
   *
   * @param callback The function to invoke.
   * @param applyThis
   * @param applyArgs
   * @param source A unique debug location of the API being invoked.
   * @returns {any} Value from the `callback` function.
   */
  runGuarded<T>(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): T;
  /**
   * Execute the Task by restoring the [Zone.currentTask] in the Task's zone.
   *
   * @param callback
   * @param applyThis
   * @param applyArgs
   * @returns {*}
   */
  runTask(task: Task, applyThis?: any, applyArgs?: any): any;
  scheduleMicroTask(
      source: string, callback: Function, data?: TaskData,
      customSchedule?: (task: Task) => void): MicroTask;
  scheduleMacroTask(
      source: string, callback: Function, data: TaskData, customSchedule: (task: Task) => void,
      customCancel: (task: Task) => void): MacroTask;
  scheduleEventTask(
      source: string, callback: Function, data: TaskData, customSchedule: (task: Task) => void,
      customCancel: (task: Task) => void): EventTask;
  /**
   * Allows the zone to intercept canceling of scheduled Task.
   *
   * The interception is configured using [ZoneSpec.onCancelTask]. The default canceler invokes
   * the [Task.cancelFn].
   *
   * @param task
   * @returns {any}
   */
  cancelTask(task: Task): any;
}

interface ZoneType {
  /**
   * @returns {Zone} Returns the current [Zone]. Returns the current zone. The only way to change
   * the current zone is by invoking a run() method, which will update the current zone for the
   * duration of the run method callback.
   */
  current: Zone;
  /**
   * @returns {Task} The task associated with the current execution.
   */
  currentTask: Task;

  /**
   * Verify that Zone has been correctly patched. Specifically that Promise is zone aware.
   */
  assertZonePatched();
}

/**
 * Provides a way to configure the interception of zone events.
 *
 * Only the `name` property is required (all other are optional).
 */
interface ZoneSpec {
  /**
   * The name of the zone. Usefull when debugging Zones.
   */
  name: string;

  /**
   * A set of properties to be associated with Zone. Use [Zone.get] to retrive them.
   */
  properties?: {[key: string]: any};

  /**
   * Allows the interception of zone forking.
   *
   * When the zone is being forked, the request is forwarded to this method for interception.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param zoneSpec The argument passed into the `fork` method.
   */
  onFork?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone,
       zoneSpec: ZoneSpec) => Zone;

  /**
   * Allows interception of the wrapping of the callback.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param delegate The argument passed into the `warp` method.
   * @param source The argument passed into the `warp` method.
   */
  onIntercept?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function,
       source: string) => Function;

  /**
   * Allows interception of the callback invocation.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param delegate The argument passed into the `run` method.
   * @param applyThis The argument passed into the `run` method.
   * @param applyArgs The argument passed into the `run` method.
   * @param source The argument passed into the `run` method.
   */
  onInvoke?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function,
       applyThis: any, applyArgs: any[], source: string) => any;

  /**
   * Allows interception of the error handling.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param error The argument passed into the `handleError` method.
   */
  onHandleError?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone,
       error: any) => boolean;

  /**
   * Allows interception of task scheduling.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param task The argument passed into the `scheduleTask` method.
   */
  onScheduleTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => Task;

  onInvokeTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task,
       applyThis: any, applyArgs: any) => any;

  /**
   * Allows interception of task cancelation.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param task The argument passed into the `cancelTask` method.
   */
  onCancelTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => any;

  /**
   * Notifies of changes to the task queue empty status.
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   * @param currentZone The current [Zone] where the current interceptor has beed declared.
   * @param targetZone The [Zone] which originally received the request.
   * @param isEmpty
   */
  onHasTask?:
      (delegate: ZoneDelegate, current: Zone, target: Zone, hasTaskState: HasTaskState) => void;
}
;

/**
 *  A delegate when intercepting zone operations.
 *
 *  A ZoneDelegate is needed because a child zone can't simply invoke a method on a parent zone. For
 *  example a child zone wrap can't just call parent zone wrap. Doing so would create a callback
 *  which is bound to the parent zone. What we are interested is intercepting the callback before it
 *  is bound to any zone. Furthermore, we also need to pass the targetZone (zone which received the
 *  original request) to the delegate.
 *
 *  The ZoneDelegate methods mirror those of Zone with an addition of extra targetZone argument in
 *  the method signature. (The original Zone which received the request.) Some methods are renamed
 *  to prevent confusion, because they have slightly different semantics and arguments.
 *
 *  - `wrap` => `intercept`: The `wrap` method delegates to `intercept`. The `wrap` method returns
 *     a callback which will run in a given zone, where as intercept allows wrapping the callback
 *     so that additional code can be run before and after, but does not associated the callback
 *     with the zone.
 *  - `run` => `invoke`: The `run` method delegates to `invoke` to perform the actual execution of
 *     the callback. The `run` method switches to new zone; saves and restores the `Zone.current`;
 *     and optionally performs error handling. The invoke is not responsible for error handling,
 *     or zone management.
 *
 *  Not every method is usually overwritten in the child zone, for this reason the ZoneDelegate
 *  stores the closest zone which overwrites this behavior along with the closest ZoneSpec.
 *
 *  NOTE: We have tried to make this API analogous to Event bubbling with target and current
 *  properties.
 *
 *  Note: The ZoneDelegate treats ZoneSpec as class. This allows the ZoneSpec to use its `this` to
 *  store internal state.
 */
interface ZoneDelegate {
  zone: Zone;
  fork(targetZone: Zone, zoneSpec: ZoneSpec): Zone;
  intercept(targetZone: Zone, callback: Function, source: string): Function;
  invoke(targetZone: Zone, callback: Function, applyThis: any, applyArgs: any[], source: string):
      any;
  handleError(targetZone: Zone, error: any): boolean;
  scheduleTask(targetZone: Zone, task: Task): Task;
  invokeTask(targetZone: Zone, task: Task, applyThis: any, applyArgs: any): any;
  cancelTask(targetZone: Zone, task: Task): any;
  hasTask(targetZone: Zone, isEmpty: HasTaskState): void;
}

type HasTaskState = {
  microTask: boolean; macroTask: boolean; eventTask: boolean; change: TaskType;
};

/**
 * Task type: `microTask`, `macroTask`, `eventTask`.
 */
type TaskType = string; /* TS v1.8 => "microTask" | "macroTask" | "eventTask" */
;

/**
 */
interface TaskData {
  /**
   * A periodic [MacroTask] is such which get automatically rescheduled after it is executed.
   */
  isPeriodic?: boolean;

  /**
   * Delay in milliseconds when the Task will run.
   */
  delay?: number;

  /**
   * identifier returned by the native setTimeout.
   */
  handleId?: number;
}

/**
 * Represents work which is executed with a clean stack.
 *
 * Tasks are used in Zones to mark work which is performed on clean stack frame. There are three
 * kinds of task. [MicroTask], [MacroTask], and [EventTask].
 *
 * A JS VM can be modeled as a [MicroTask] queue, [MacroTask] queue, and [EventTask] set.
 *
 * - [MicroTask] queue represents a set of tasks which are executing right after the current stack
 *   frame becomes clean and before a VM yield. All [MicroTask]s execute in order of insertion
 *   before VM yield and the next [MacroTask] is executed.
 * - [MacroTask] queue represents a set of tasks which are executed one at a time after each VM
 *   yield. The queue is order by time, and insertions can happen in any location.
 * - [EventTask] is a set of tasks which can at any time be inserted to the end of the [MacroTask]
 *   queue. This happens when the event fires.
 *
 */
interface Task {
  /**
   * Task type: `microTask`, `macroTask`, `eventTask`.
   */
  type: TaskType;

  /**
   * Debug string representing the API which requested the scheduling of the task.
   */
  source: string;

  /**
   * The Function to be used by the VM on entering the [Task]. This function will delegate to
   * [Zone.runTask] and delegate to `callback`.
   */
  invoke: Function;

  /**
   * Function which needs to be executed by the Task after the [Zone.currentTask] has been set to
   * the current task.
   */
  callback: Function;

  /**
   * Task specific options associated with the current task. This is passed to the `scheduleFn`.
   */
  data: TaskData;

  /**
   * Represents the default work which needs to be done to schedule the Task by the VM.
   *
   * A zone may chose to intercept this function and perform its own scheduling.
   */
  scheduleFn: (task: Task) => void;

  /**
   * Represents the default work which needs to be done to un-schedule the Task from the VM. Not all
   * Tasks are cancelable, and therefore this method is optional.
   *
   * A zone may chose to intercept this function and perform its own scheduling.
   */
  cancelFn: (task: Task) => void;

  /**
   * @type {Zone} The zone which will be used to invoke the `callback`. The Zone is captured
   * at the time of Task creation.
   */
  zone: Zone;

  /**
   * Number of times the task has been executed, or -1 if canceled.
   */
  runCount: number;
}

interface MicroTask extends Task {
  /* TS v1.8 => type: 'microTask'; */
}

interface MacroTask extends Task {
  /* TS v1.8 => type: 'macroTask'; */
}

interface EventTask extends Task {
  /* TS v1.8 => type: 'eventTask'; */
}

/**
 * Extend the Error with additional fields for rewritten stack frames
 */
interface Error {
  /**
   * Stack trace where extra frames have been removed and zone names added.
   */
  zoneAwareStack?: string;

  /**
   * Original stack trace with no modiffications
   */
  originalStack?: string;
}

/** @internal */
type AmbientZone = Zone;
/** @internal */
type AmbientZoneDelegate = ZoneDelegate;

const Zone: ZoneType = (function(global: any) {
  if (global['Zone']) {
    throw new Error('Zone already loaded.');
  }

  class Zone implements AmbientZone {
    static __symbol__: (name: string) => string = __symbol__;

    static assertZonePatched() {
      if (global.Promise !== ZoneAwarePromise) {
        throw new Error(
            'Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
            'has been overwritten.\n' +
            'Most likely cause is that a Promise polyfill has been loaded ' +
            'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
            'If you must load one, do so before loading zone.js.)');
      }
    }


    static get current(): AmbientZone {
      return _currentZoneFrame.zone;
    };
    static get currentTask(): Task {
      return _currentTask;
    };

    public get parent(): AmbientZone {
      return this._parent;
    };
    public get name(): string {
      return this._name;
    };


    private _parent: Zone;
    private _name: string;
    private _properties: {[key: string]: any} = null;
    private _zoneDelegate: ZoneDelegate;

    constructor(parent: Zone, zoneSpec: ZoneSpec) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate =
          new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }

    public get(key: string): any {
      const zone: Zone = this.getZoneWith(key) as Zone;
      if (zone) return zone._properties[key];
    }

    public getZoneWith(key: string): AmbientZone {
      let current: Zone = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }

    public fork(zoneSpec: ZoneSpec): AmbientZone {
      if (!zoneSpec) throw new Error('ZoneSpec required!');
      return this._zoneDelegate.fork(this, zoneSpec);
    }

    public wrap<T extends Function>(callback: T, source: string): T {
      if (typeof callback !== 'function') {
        throw new Error('Expecting function got: ' + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone: Zone = this;
      return function() {
        return zone.runGuarded(_callback, this, <any>arguments, source);
      } as any as T;
    }

    public run(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): any;
    public run<T>(
        callback: (...args: any[]) => T, applyThis: any = null, applyArgs: any[] = null,
        source: string = null): T {
      _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }

    public runGuarded(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): any;
    public runGuarded<T>(
        callback: (...args: any[]) => T, applyThis: any = null, applyArgs: any[] = null,
        source: string = null) {
      _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
      }
    }


    runTask(task: Task, applyThis?: any, applyArgs?: any): any {
      task.runCount++;
      if (task.zone != this)
        throw new Error(
            'A task can only be run in the zone which created it! (Creation: ' + task.zone.name +
            '; Execution: ' + this.name + ')');
      const previousTask = _currentTask;
      _currentTask = task;
      _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
      try {
        if (task.type == 'macroTask' && task.data && !task.data.isPeriodic) {
          task.cancelFn = null;
        }
        try {
          return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent;
        _currentTask = previousTask;
      }
    }


    scheduleMicroTask(
        source: string, callback: Function, data?: TaskData,
        customSchedule?: (task: Task) => void): MicroTask {
      return <MicroTask>this._zoneDelegate.scheduleTask(
          this, new ZoneTask('microTask', this, source, callback, data, customSchedule, null));
    }

    scheduleMacroTask(
        source: string, callback: Function, data: TaskData, customSchedule: (task: Task) => void,
        customCancel: (task: Task) => void): MacroTask {
      return <MacroTask>this._zoneDelegate.scheduleTask(
          this,
          new ZoneTask('macroTask', this, source, callback, data, customSchedule, customCancel));
    }

    scheduleEventTask(
        source: string, callback: Function, data: TaskData, customSchedule: (task: Task) => void,
        customCancel: (task: Task) => void): EventTask {
      return <EventTask>this._zoneDelegate.scheduleTask(
          this,
          new ZoneTask('eventTask', this, source, callback, data, customSchedule, customCancel));
    }

    cancelTask(task: Task): any {
      const value = this._zoneDelegate.cancelTask(this, task);
      task.runCount = -1;
      task.cancelFn = null;
      return value;
    }
  };

  class ZoneDelegate implements AmbientZoneDelegate {
    public zone: Zone;

    private _taskCounts: {microTask: number,
                          macroTask: number,
                          eventTask: number} = {microTask: 0, macroTask: 0, eventTask: 0};

    private _parentDelegate: ZoneDelegate;

    private _forkDlgt: ZoneDelegate;
    private _forkZS: ZoneSpec;
    private _forkCurrZone: Zone;

    private _interceptDlgt: ZoneDelegate;
    private _interceptZS: ZoneSpec;
    private _interceptCurrZone: Zone;

    private _invokeDlgt: ZoneDelegate;
    private _invokeZS: ZoneSpec;
    private _invokeCurrZone: Zone;

    private _handleErrorDlgt: ZoneDelegate;
    private _handleErrorZS: ZoneSpec;
    private _handleErrorCurrZone: Zone;

    private _scheduleTaskDlgt: ZoneDelegate;
    private _scheduleTaskZS: ZoneSpec;
    private _scheduleTaskCurrZone: Zone;

    private _invokeTaskDlgt: ZoneDelegate;
    private _invokeTaskZS: ZoneSpec;
    private _invokeTaskCurrZone: Zone;

    private _cancelTaskDlgt: ZoneDelegate;
    private _cancelTaskZS: ZoneSpec;
    private _cancelTaskCurrZone: Zone;

    private _hasTaskDlgt: ZoneDelegate;
    private _hasTaskZS: ZoneSpec;
    private _hasTaskCurrZone: Zone;

    constructor(zone: Zone, parentDelegate: ZoneDelegate, zoneSpec: ZoneSpec) {
      this.zone = zone;
      this._parentDelegate = parentDelegate;

      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
      this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);

      this._interceptZS =
          zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
      this._interceptDlgt =
          zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
      this._interceptCurrZone =
          zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);

      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
      this._invokeDlgt =
          zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
      this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);

      this._handleErrorZS =
          zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
      this._handleErrorDlgt =
          zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
      this._handleErrorCurrZone =
          zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);

      this._scheduleTaskZS =
          zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
      this._scheduleTaskDlgt =
          zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
      this._scheduleTaskCurrZone =
          zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);

      this._invokeTaskZS =
          zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
      this._invokeTaskDlgt =
          zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
      this._invokeTaskCurrZone =
          zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);

      this._cancelTaskZS =
          zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
      this._cancelTaskDlgt =
          zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
      this._cancelTaskCurrZone =
          zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);

      this._hasTaskZS = zoneSpec && (zoneSpec.onHasTask ? zoneSpec : parentDelegate._hasTaskZS);
      this._hasTaskDlgt =
          zoneSpec && (zoneSpec.onHasTask ? parentDelegate : parentDelegate._hasTaskDlgt);
      this._hasTaskCurrZone = zoneSpec && (zoneSpec.onHasTask ? this.zone : parentDelegate.zone);
    }

    fork(targetZone: Zone, zoneSpec: ZoneSpec): AmbientZone {
      return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                            new Zone(targetZone, zoneSpec);
    }

    intercept(targetZone: Zone, callback: Function, source: string): Function {
      return this._interceptZS ?
          this._interceptZS.onIntercept(
              this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
          callback;
    }

    invoke(targetZone: Zone, callback: Function, applyThis: any, applyArgs: any[], source: string):
        any {
      return this._invokeZS ?
          this._invokeZS.onInvoke(
              this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs,
              source) :
          callback.apply(applyThis, applyArgs);
    }

    handleError(targetZone: Zone, error: any): boolean {
      return this._handleErrorZS ?
          this._handleErrorZS.onHandleError(
              this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
          true;
    }

    scheduleTask(targetZone: Zone, task: Task): Task {
      try {
        if (this._scheduleTaskZS) {
          return this._scheduleTaskZS.onScheduleTask(
              this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
        } else if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == 'microTask') {
          scheduleMicroTask(<MicroTask>task);
        } else {
          throw new Error('Task is missing scheduleFn.');
        }
        return task;
      } finally {
        if (targetZone == this.zone) {
          this._updateTaskCount(task.type, 1);
        }
      }
    }

    invokeTask(targetZone: Zone, task: Task, applyThis: any, applyArgs: any): any {
      try {
        return this._invokeTaskZS ?
            this._invokeTaskZS.onInvokeTask(
                this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis,
                applyArgs) :
            task.callback.apply(applyThis, applyArgs);
      } finally {
        if (targetZone == this.zone && (task.type != 'eventTask') &&
            !(task.data && task.data.isPeriodic)) {
          this._updateTaskCount(task.type, -1);
        }
      }
    }

    cancelTask(targetZone: Zone, task: Task): any {
      let value;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask(
            this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
      } else if (!task.cancelFn) {
        throw new Error('Task does not support cancellation, or is already canceled.');
      } else {
        value = task.cancelFn(task);
      }
      if (targetZone == this.zone) {
        // this should not be in the finally block, because exceptions assume not canceled.
        this._updateTaskCount(task.type, -1);
      }
      return value;
    }

    hasTask(targetZone: Zone, isEmpty: HasTaskState) {
      return this._hasTaskZS &&
          this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
    }

    private _updateTaskCount(type: TaskType, count: number) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error('More tasks executed then were scheduled.');
      }
      if (prev == 0 || next == 0) {
        const isEmpty: HasTaskState = {
          microTask: counts.microTask > 0,
          macroTask: counts.macroTask > 0,
          eventTask: counts.eventTask > 0,
          change: type
        };
        try {
          this.hasTask(this.zone, isEmpty);
        } finally {
          if (this._parentDelegate) {
            this._parentDelegate._updateTaskCount(type, count);
          }
        }
      }
    }
  }


  class ZoneTask implements Task {
    public type: TaskType;
    public source: string;
    public invoke: Function;
    public callback: Function;
    public data: TaskData;
    public scheduleFn: (task: Task) => void;
    public cancelFn: (task: Task) => void;
    public zone: Zone;
    public runCount: number = 0;

    constructor(
        type: TaskType, zone: Zone, source: string, callback: Function, options: TaskData,
        scheduleFn: (task: Task) => void, cancelFn: (task: Task) => void) {
      this.type = type;
      this.zone = zone;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      this.callback = callback;
      const self = this;
      this.invoke = function() {
        _numberOfNestedTaskFrames++;
        try {
          return zone.runTask(self, this, <any>arguments);
        } finally {
          if (_numberOfNestedTaskFrames == 1) {
            drainMicroTaskQueue();
          }
          _numberOfNestedTaskFrames--;
        }
      };
    }

    public toString() {
      if (this.data && typeof this.data.handleId !== 'undefined') {
        return this.data.handleId;
      } else {
        return Object.prototype.toString.call(this);
      }
    }

    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    public toJSON() {
      return {
        type: this.type,
        source: this.source,
        data: this.data,
        zone: this.zone.name,
        invoke: this.invoke,
        scheduleFn: this.scheduleFn,
        cancelFn: this.cancelFn,
        runCount: this.runCount,
        callback: this.callback
      };
    }
  }

  interface UncaughtPromiseError extends Error {
    zone: AmbientZone;
    task: Task;
    promise: ZoneAwarePromise<any>;
    rejection: any;
  }

  class ZoneFrame {
    public parent: ZoneFrame;
    public zone: Zone;
    constructor(parent: ZoneFrame, zone: Zone) {
      this.parent = parent;
      this.zone = zone;
    }
  }

  function __symbol__(name: string) {
    return '__zone_symbol__' + name;
  };
  const symbolSetTimeout = __symbol__('setTimeout');
  const symbolPromise = __symbol__('Promise');
  const symbolThen = __symbol__('then');

  let _currentZoneFrame = new ZoneFrame(null, new Zone(null, null));
  let _currentTask: Task = null;
  let _microTaskQueue: Task[] = [];
  let _isDrainingMicrotaskQueue: boolean = false;
  const _uncaughtPromiseErrors: UncaughtPromiseError[] = [];
  let _numberOfNestedTaskFrames = 0;

  function scheduleQueueDrain() {
    // if we are not running in any task, and there has not been anything scheduled
    // we must bootstrap the initial task creation by manually scheduling the drain
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      // We are not running in Task, so we need to kickstart the microtask queue.
      if (global[symbolPromise]) {
        global[symbolPromise].resolve(0)[symbolThen](drainMicroTaskQueue);
      } else {
        global[symbolSetTimeout](drainMicroTaskQueue, 0);
      }
    }
  }

  function scheduleMicroTask(task: MicroTask) {
    scheduleQueueDrain();
    _microTaskQueue.push(task);
  }

  function consoleError(e: any) {
    const rejection = e && e.rejection;
    if (rejection) {
      console.error(
          'Unhandled Promise rejection:',
          rejection instanceof Error ? rejection.message : rejection, '; Zone:',
          (<Zone>e.zone).name, '; Task:', e.task && (<Task>e.task).source, '; Value:', rejection,
          rejection instanceof Error ? rejection.stack : undefined);
    }
    console.error(e);
  }

  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (e) {
            consoleError(e);
          }
        }
      }
      while (_uncaughtPromiseErrors.length) {
        while (_uncaughtPromiseErrors.length) {
          const uncaughtPromiseError: UncaughtPromiseError = _uncaughtPromiseErrors.shift();
          try {
            uncaughtPromiseError.zone.runGuarded(() => {
              throw uncaughtPromiseError;
            });
          } catch (e) {
            consoleError(e);
          }
        }
      }
      _isDrainingMicrotaskQueue = false;
    }
  }


  function isThenable(value: any): boolean {
    return value && value.then;
  }

  function forwardResolution(value: any): any {
    return value;
  }

  function forwardRejection(rejection: any): any {
    return ZoneAwarePromise.reject(rejection);
  }

  const symbolState: string = __symbol__('state');
  const symbolValue: string = __symbol__('value');
  const source: string = 'Promise.then';
  const UNRESOLVED = null;
  const RESOLVED = true;
  const REJECTED = false;
  const REJECTED_NO_CATCH = 0;

  function makeResolver(promise: ZoneAwarePromise<any>, state: boolean): (value: any) => void {
    return (v) => {
      resolvePromise(promise, state, v);
      // Do not return value or you will break the Promise spec.
    };
  }

  function resolvePromise(
      promise: ZoneAwarePromise<any>, state: boolean, value: any): ZoneAwarePromise<any> {
    if (promise[symbolState] === UNRESOLVED) {
      if (value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) &&
          value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
        clearRejectedNoCatch(<Promise<any>>value);
        resolvePromise(promise, value[symbolState], value[symbolValue]);
      } else if (isThenable(value)) {
        value.then(makeResolver(promise, state), makeResolver(promise, false));
      } else {
        promise[symbolState] = state;
        const queue = promise[symbolValue];
        promise[symbolValue] = value;

        for (let i = 0; i < queue.length;) {
          scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
        }
        if (queue.length == 0 && state == REJECTED) {
          promise[symbolState] = REJECTED_NO_CATCH;
          try {
            throw new Error(
                'Uncaught (in promise): ' + value +
                (value && value.stack ? '\n' + value.stack : ''));
          } catch (e) {
            const error: UncaughtPromiseError = e;
            error.rejection = value;
            error.promise = promise;
            error.zone = Zone.current;
            error.task = Zone.currentTask;
            _uncaughtPromiseErrors.push(error);
            scheduleQueueDrain();
          }
        }
      }
    }
    // Resolving an already resolved promise is a noop.
    return promise;
  }

  function clearRejectedNoCatch(promise: ZoneAwarePromise<any>): void {
    if (promise[symbolState] === REJECTED_NO_CATCH) {
      promise[symbolState] = REJECTED;
      for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
        if (promise === _uncaughtPromiseErrors[i].promise) {
          _uncaughtPromiseErrors.splice(i, 1);
          break;
        }
      }
    }
  }


  function scheduleResolveOrReject<R, U>(
      promise: ZoneAwarePromise<any>, zone: AmbientZone, chainPromise: ZoneAwarePromise<any>,
      onFulfilled?: (value: R) => U, onRejected?: (error: any) => U): void {
    clearRejectedNoCatch(promise);
    const delegate =
        promise[symbolState] ? onFulfilled || forwardResolution : onRejected || forwardRejection;
    zone.scheduleMicroTask(source, () => {
      try {
        resolvePromise(chainPromise, true, zone.run(delegate, null, [promise[symbolValue]]));
      } catch (error) {
        resolvePromise(chainPromise, false, error);
      }
    });
  }

  class ZoneAwarePromise<R> implements Promise<R> {
    static toString() {
      return 'function ZoneAwarePromise() { [native code] }';
    }

    static resolve<R>(value: R): Promise<R> {
      return resolvePromise(<ZoneAwarePromise<R>>new this(null), RESOLVED, value);
    }

    static reject<U>(error: U): Promise<U> {
      return resolvePromise(<ZoneAwarePromise<U>>new this(null), REJECTED, error);
    }

    static race<R>(values: PromiseLike<any>[]): Promise<R> {
      let resolve: (v: any) => void;
      let reject: (v: any) => void;
      let promise: any = new this((res, rej) => {
        [resolve, reject] = [res, rej];
      });
      function onResolve(value) {
        promise && (promise = null || resolve(value));
      }
      function onReject(error) {
        promise && (promise = null || reject(error));
      }

      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        value.then(onResolve, onReject);
      }
      return promise;
    }

    static all<R>(values): Promise<R> {
      let resolve: (v: any) => void;
      let reject: (v: any) => void;
      let promise = new this((res, rej) => {
        resolve = res;
        reject = rej;
      });
      let count = 0;
      const resolvedValues = [];
      for (let value of values) {
        if (!isThenable(value)) {
          value = this.resolve(value);
        }
        value.then(
            ((index) => (value) => {
              resolvedValues[index] = value;
              count--;
              if (!count) {
                resolve(resolvedValues);
              }
            })(count),
            reject);
        count++;
      }
      if (!count) resolve(resolvedValues);
      return promise;
    }

    constructor(
        executor:
            (resolve: (value?: R|PromiseLike<R>) => void, reject: (error?: any) => void) => void) {
      const promise: ZoneAwarePromise<R> = this;
      if (!(promise instanceof ZoneAwarePromise)) {
        throw new Error('Must be an instanceof Promise.');
      }
      promise[symbolState] = UNRESOLVED;
      promise[symbolValue] = [];  // queue;
      try {
        executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
      } catch (e) {
        resolvePromise(promise, false, e);
      }
    }

    then<R, U>(
        onFulfilled?: (value: R) => U | PromiseLike<U>,
        onRejected?: (error: any) => U | PromiseLike<U>): Promise<R> {
      const chainPromise: Promise<R> = new (this.constructor as typeof ZoneAwarePromise)(null);
      const zone = Zone.current;
      if (this[symbolState] == UNRESOLVED) {
        (<any[]>this[symbolValue]).push(zone, chainPromise, onFulfilled, onRejected);
      } else {
        scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
      }
      return chainPromise;
    }

    catch<U>(onRejected?: (error: any) => U | PromiseLike<U>): Promise<R> {
      return this.then(null, onRejected);
    }
  }
  // Protect against aggressive optimizers dropping seemingly unused properties.
  // E.g. Closure Compiler in advanced mode.
  ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
  ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
  ZoneAwarePromise['race'] = ZoneAwarePromise.race;
  ZoneAwarePromise['all'] = ZoneAwarePromise.all;

  const NativePromise = global[__symbol__('Promise')] = global['Promise'];
  global['Promise'] = ZoneAwarePromise;
  function patchThen(NativePromise) {
    const NativePromiseProtototype = NativePromise.prototype;
    const NativePromiseThen = NativePromiseProtototype[__symbol__('then')] =
        NativePromiseProtototype.then;
    NativePromiseProtototype.then = function(onResolve, onReject) {
      const nativePromise = this;
      return new ZoneAwarePromise((resolve, reject) => {
               NativePromiseThen.call(nativePromise, resolve, reject);
             })
          .then(onResolve, onReject);
    };
  }

  if (NativePromise) {
    patchThen(NativePromise);
    if (typeof global['fetch'] !== 'undefined') {
      let fetchPromise: Promise<any>;
      try {
        // In MS Edge this throws
        fetchPromise = global['fetch']();
      } catch (e) {
        // In Chrome this throws instead.
        fetchPromise = global['fetch']('about:blank');
      }
      // ignore output to prevent error;
      fetchPromise.then(() => null, () => null);
      if (fetchPromise.constructor != NativePromise &&
          fetchPromise.constructor != ZoneAwarePromise) {
        patchThen(fetchPromise.constructor);
      }
    }
  }

  // This is not part of public API, but it is usefull for tests, so we expose it.
  Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;

  /*
   * This code patches Error so that:
   *   - It ignores un-needed stack frames.
   *   - It Shows the associated Zone for reach frame.
   */

  enum FrameType {
    /// Skip this frame when printing out stack
    blackList,
    /// This frame marks zone transition
    transition
  }

  const NativeError = global[__symbol__('Error')] = global.Error;
  // Store the frames which should be removed from the stack frames
  const blackListedStackFrames: {[frame: string]: FrameType} = {};
  // We must find the frame where Error was created, otherwise we assume we don't understand stack
  let zoneAwareFrame: string;
  global.Error = ZoneAwareError;
  // How should the stack frames be parsed.
  let frameParserStrategy = null;
  const stackRewrite = 'stackRewrite';

  // fix #595, create property descriptor
  // for error properties
  const createProperty = function(props, key) {
    // if property is already defined, skip it.
    if (props[key]) {
      return;
    }
    // define a local property
    // in case error property is not settable
    const name = __symbol__(key);
    props[key] = {
      configurable: true,
      enumerable: true,
      get: function() {
        // if local property has no value
        // use internal error's property value
        if (!this[name]) {
          const error = this[__symbol__('error')];
          if (error) {
            this[name] = error[key];
          }
        }
        return this[name];
      },
      set: function(value) {
        // setter will set value to local property value
        this[name] = value;
      }
    };
  };

  // fix #595, create property descriptor
  // for error method properties
  const createMethodProperty = function(props, key) {
    if (props[key]) {
      return;
    }
    props[key] = {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function() {
        const error = this[__symbol__('error')];
        let errorMethod = (error && error[key]) || this[key];
        if (errorMethod) {
          return errorMethod.apply(error, arguments);
        }
      }
    };
  };

  const createErrorProperties = function() {
    const props = Object.create(null);

    const error = new NativeError();
    let keys = Object.getOwnPropertyNames(error);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // Avoid bugs when hasOwnProperty is shadowed
      if (Object.prototype.hasOwnProperty.call(error, key)) {
        createProperty(props, key);
      }
    }

    const proto = NativeError.prototype;
    if (proto) {
      let pKeys = Object.getOwnPropertyNames(proto);
      for (let i = 0; i < pKeys.length; i++) {
        const key = pKeys[i];
        // skip constructor
        if (key !== 'constructor' && key !== 'toString' && key !== 'toSource') {
          createProperty(props, key);
        }
      }
    }

    // some other properties are not
    // in NativeError
    createProperty(props, 'originalStack');
    createProperty(props, 'zoneAwareStack');

    // define toString, toSource as method property
    createMethodProperty(props, 'toString');
    createMethodProperty(props, 'toSource');
    return props;
  };

  const errorProperties = createErrorProperties();

  // for derived Error class which extends ZoneAwareError
  // we should not override the derived class's property
  // so we create a new props object only copy the properties
  // from errorProperties which not exist in derived Error's prototype
  const getErrorPropertiesForPrototype = function(prototype) {
    // if the prototype is ZoneAwareError.prototype
    // we just return the prebuilt errorProperties.
    if (prototype === ZoneAwareError.prototype) {
      return errorProperties;
    }
    const newProps = Object.create(null);
    const cKeys = Object.getOwnPropertyNames(errorProperties);
    const keys = Object.getOwnPropertyNames(prototype);
    cKeys.forEach(cKey => {
      if (keys.filter(key => {
                return key === cKey;
              })
              .length === 0) {
        newProps[cKey] = errorProperties[cKey];
      }
    });

    return newProps;
  };

  /**
   * This is ZoneAwareError which processes the stack frame and cleans up extra frames as well as
   * adds zone information to it.
   */
  function ZoneAwareError() {
    // make sure we have a valid this
    // if this is undefined(call Error without new) or this is global
    // or this is some other objects, we should force to create a
    // valid ZoneAwareError by call Object.create()
    if (!(this instanceof ZoneAwareError)) {
      return ZoneAwareError.apply(Object.create(ZoneAwareError.prototype), arguments);
    }
    // Create an Error.
    let error: Error = NativeError.apply(this, arguments);
    this[__symbol__('error')] = error;

    // Save original stack trace
    error.originalStack = error.stack;

    // Process the stack trace and rewrite the frames.
    if (ZoneAwareError[stackRewrite] && error.originalStack) {
      let frames: string[] = error.originalStack.split('\n');
      let zoneFrame = _currentZoneFrame;
      let i = 0;
      // Find the first frame
      while (frames[i] !== zoneAwareFrame && i < frames.length) {
        i++;
      }
      for (; i < frames.length && zoneFrame; i++) {
        let frame = frames[i];
        if (frame.trim()) {
          let frameType =
              blackListedStackFrames.hasOwnProperty(frame) && blackListedStackFrames[frame];
          if (frameType === FrameType.blackList) {
            frames.splice(i, 1);
            i--;
          } else if (frameType === FrameType.transition) {
            if (zoneFrame.parent) {
              // This is the special frame where zone changed. Print and process it accordingly
              frames[i] += ` [${zoneFrame.parent.zone.name} => ${zoneFrame.zone.name}]`;
              zoneFrame = zoneFrame.parent;
            } else {
              zoneFrame = null;
            }
          } else {
            frames[i] += ` [${zoneFrame.zone.name}]`;
          }
        }
      }
      error.stack = error.zoneAwareStack = frames.join('\n');
    }
    // use defineProperties here instead of copy property value
    // because of issue #595 which will break angular2.
    Object.defineProperties(this, getErrorPropertiesForPrototype(Object.getPrototypeOf(this)));
    return this;
  }

  // Copy the prototype so that instanceof operator works as expected
  ZoneAwareError.prototype = NativeError.prototype;
  ZoneAwareError[Zone.__symbol__('blacklistedStackFrames')] = blackListedStackFrames;
  ZoneAwareError[stackRewrite] = false;

  if (NativeError.hasOwnProperty('stackTraceLimit')) {
    // Extend default stack limit as we will be removing few frames.
    NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);

    // make sure that ZoneAwareError has the same property which forwards to NativeError.
    Object.defineProperty(ZoneAwareError, 'stackTraceLimit', {
      get: function() {
        return NativeError.stackTraceLimit;
      },
      set: function(value) {
        return NativeError.stackTraceLimit = value;
      }
    });
  }

  if (NativeError.hasOwnProperty('captureStackTrace')) {
    Object.defineProperty(ZoneAwareError, 'captureStackTrace', {
      // add named function here because we need to remove this
      // stack frame when prepareStackTrace below
      value: function zoneCaptureStackTrace(targetObject: Object, constructorOpt?: Function) {
        NativeError.captureStackTrace(targetObject, constructorOpt);
      }
    });
  }

  Object.defineProperty(ZoneAwareError, 'prepareStackTrace', {
    get: function() {
      return NativeError.prepareStackTrace;
    },
    set: function(value) {
      if (!value || typeof value !== 'function') {
        return NativeError.prepareStackTrace = value;
      }
      return NativeError.prepareStackTrace = function(error, structuredStackTrace) {
        // remove additional stack information from ZoneAwareError.captureStackTrace
        if (structuredStackTrace) {
          for (let i = 0; i < structuredStackTrace.length; i++) {
            const st = structuredStackTrace[i];
            // remove the first function which name is zoneCaptureStackTrace
            if (st.getFunctionName() === 'zoneCaptureStackTrace') {
              structuredStackTrace.splice(i, 1);
              break;
            }
          }
        }
        return value.apply(this, [error, structuredStackTrace]);
      };
    }
  });

  // Now we need to populet the `blacklistedStackFrames` as well as find the
  // run/runGuraded/runTask frames. This is done by creating a detect zone and then threading
  // the execution through all of the above methods so that we can look at the stack trace and
  // find the frames of interest.
  let detectZone: Zone = Zone.current.fork({
    name: 'detect',
    onInvoke: function(
        parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function,
        applyThis: any, applyArgs: any[], source: string): any {
      // Here only so that it will show up in the stack frame so that it can be black listed.
      return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
    },
    onHandleError: function(parentZD: ZoneDelegate, current: Zone, target: Zone, error: any):
        boolean {
          if (error.originalStack && Error === ZoneAwareError) {
            let frames = error.originalStack.split(/\n/);
            let runFrame = false, runGuardedFrame = false, runTaskFrame = false;
            while (frames.length) {
              let frame = frames.shift();
              // On safari it is possible to have stack frame with no line number.
              // This check makes sure that we don't filter frames on name only (must have
              // linenumber)
              if (/:\d+:\d+/.test(frame)) {
                // Get rid of the path so that we don't accidintely find function name in path.
                // In chrome the seperator is `(` and `@` in FF and safari
                // Chrome: at Zone.run (zone.js:100)
                // Chrome: at Zone.run (http://localhost:9876/base/build/lib/zone.js:100:24)
                // FireFox: Zone.prototype.run@http://localhost:9876/base/build/lib/zone.js:101:24
                // Safari: run@http://localhost:9876/base/build/lib/zone.js:101:24
                let fnName: string = frame.split('(')[0].split('@')[0];
                let frameType = FrameType.transition;
                if (fnName.indexOf('ZoneAwareError') !== -1) {
                  zoneAwareFrame = frame;
                }
                if (fnName.indexOf('runGuarded') !== -1) {
                  runGuardedFrame = true;
                } else if (fnName.indexOf('runTask') !== -1) {
                  runTaskFrame = true;
                } else if (fnName.indexOf('run') !== -1) {
                  runFrame = true;
                } else {
                  frameType = FrameType.blackList;
                }
                blackListedStackFrames[frame] = frameType;
                // Once we find all of the frames we can stop looking.
                if (runFrame && runGuardedFrame && runTaskFrame) {
                  ZoneAwareError[stackRewrite] = true;
                  break;
                }
              }
            }
          }
          return false;
        }
  }) as Zone;
  // carefully constructor a stack frame which contains all of the frames of interest which
  // need to be detected and blacklisted.
  let detectRunFn = () => {
    detectZone.run(() => {
      detectZone.runGuarded(() => {
        throw new Error('blacklistStackFrames');
      });
    });
  };
  // Cause the error to extract the stack frames.
  detectZone.runTask(detectZone.scheduleMacroTask('detect', detectRunFn, null, () => null, null));

  return global['Zone'] = Zone;
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
