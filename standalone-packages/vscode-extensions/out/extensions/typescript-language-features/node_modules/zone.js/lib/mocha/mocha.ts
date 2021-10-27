/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

'use strict';

((context: any) => {
  const Mocha = context.Mocha;

  if (typeof Mocha === 'undefined') {
    throw new Error('Missing Mocha.js');
  }

  if (typeof Zone === 'undefined') {
    throw new Error('Missing Zone.js');
  }

  const ProxyZoneSpec = Zone['ProxyZoneSpec'];
  const SyncTestZoneSpec = Zone['SyncTestZoneSpec'];

  if (!ProxyZoneSpec) {
    throw new Error('Missing ProxyZoneSpec');
  }

  if (Mocha['__zone_patch__']) {
    throw new Error('"Mocha" has already been patched with "Zone".');
  }

  Mocha['__zone_patch__'] = true;

  const rootZone = Zone.current;
  const syncZone = rootZone.fork(new SyncTestZoneSpec('Mocha.describe'));
  let testZone = null;
  const suiteZone = rootZone.fork(new ProxyZoneSpec());

  const mochaOriginal = {
    after: Mocha.after,
    afterEach: Mocha.afterEach,
    before: Mocha.before,
    beforeEach: Mocha.beforeEach,
    describe: Mocha.describe,
    it: Mocha.it
  };

  function modifyArguments(args: IArguments, syncTest: Function, asyncTest?: Function): any[] {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg === 'function') {
        // The `done` callback is only passed through if the function expects at
        // least one argument.
        // Note we have to make a function with correct number of arguments,
        // otherwise mocha will
        // think that all functions are sync or async.
        args[i] = (arg.length === 0) ? syncTest(arg) : asyncTest(arg);
        // Mocha uses toString to view the test body in the result list, make sure we return the
        // correct function body
        args[i].toString = function() {
          return arg.toString();
        };
      }
    }

    return args as any;
  }

  function wrapDescribeInZone(args: IArguments): any[] {
    const syncTest: any = function(fn) {
      return function() {
        return syncZone.run(fn, this, arguments as any as any[]);
      };
    };

    return modifyArguments(args, syncTest);
  }

  function wrapTestInZone(args: IArguments): any[] {
    const asyncTest = function(fn) {
      return function(done) {
        return testZone.run(fn, this, [done]);
      };
    };

    const syncTest: any = function(fn) {
      return function() {
        return testZone.run(fn, this);
      };
    };

    return modifyArguments(args, syncTest, asyncTest);
  }

  function wrapSuiteInZone(args: IArguments): any[] {
    const asyncTest = function(fn) {
      return function(done) {
        return suiteZone.run(fn, this, [done]);
      };
    };

    const syncTest: any = function(fn) {
      return function() {
        return suiteZone.run(fn, this);
      };
    };

    return modifyArguments(args, syncTest, asyncTest);
  };

  context.describe = context.suite = Mocha.describe = function() {
    return mochaOriginal.describe.apply(this, wrapDescribeInZone(arguments));
  };

  context.xdescribe = context.suite.skip = Mocha.describe.skip = function() {
    return mochaOriginal.describe.skip.apply(this, wrapDescribeInZone(arguments));
  };

  context.describe.only = context.suite.only = Mocha.describe.only = function() {
    return mochaOriginal.describe.only.apply(this, wrapDescribeInZone(arguments));
  };

  context.it = context.specify = context.test = Mocha.it = function() {
    return mochaOriginal.it.apply(this, wrapTestInZone(arguments));
  };

  context.xit = context.xspecify = Mocha.it.skip = function() {
    return mochaOriginal.it.skip.apply(this, wrapTestInZone(arguments));
  };

  context.it.only = context.test.only = Mocha.it.only = function() {
    return mochaOriginal.it.only.apply(this, wrapTestInZone(arguments));
  };

  context.after = context.suiteTeardown = Mocha.after = function() {
    return mochaOriginal.after.apply(this, wrapSuiteInZone(arguments));
  };

  context.afterEach = context.teardown = Mocha.afterEach = function() {
    return mochaOriginal.afterEach.apply(this, wrapTestInZone(arguments));
  };

  context.before = context.suiteSetup = Mocha.before = function() {
    return mochaOriginal.before.apply(this, wrapSuiteInZone(arguments));
  };

  context.beforeEach = context.setup = Mocha.beforeEach = function() {
    return mochaOriginal.beforeEach.apply(this, wrapTestInZone(arguments));
  };

  ((originalRunTest, originalRun) => {
    Mocha.Runner.prototype.runTest = function(fn) {
      Zone.current.scheduleMicroTask('mocha.forceTask', () => {
        originalRunTest.call(this, fn);
      });
    };

    Mocha.Runner.prototype.run = function(fn) {
      this.on('test', (e) => {
        if (Zone.current !== rootZone) {
          throw new Error('Unexpected zone: ' + Zone.current.name);
        }
        testZone = rootZone.fork(new ProxyZoneSpec());
      });

      return originalRun.call(this, fn);
    };


  })(Mocha.Runner.prototype.runTest, Mocha.Runner.prototype.run);

})(window);