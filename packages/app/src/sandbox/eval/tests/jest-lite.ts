import { dispatch, actions, listen } from 'codesandbox-api';
import { react, reactTs } from '@codesandbox/common/lib/templates';
import { messages } from '@codesandbox/common/lib/utils/jest-lite';

import expect from 'expect';
import jestMock from 'jest-mock';
import jestTestHooks from 'jest-circus';

import { makeDescribe } from 'jest-circus/build/utils';
import path from 'path';
import { bind as bindEach } from 'jest-each';

import {
  addSerializer,
  toMatchSnapshot,
  toThrowErrorMatchingSnapshot,
} from 'jest-snapshot';

import {
  addEventHandler,
  setState,
  dispatch as dispatchJest,
  ROOT_DESCRIBE_BLOCK_NAME,
} from 'jest-circus/build/state';
import { parse } from 'sandbox-hooks/react-error-overlay/utils/parser';
import { map } from 'sandbox-hooks/react-error-overlay/utils/mapper';
import { Manager } from 'sandpack-core';
import { Module } from 'sandpack-core/lib/types/module';

import run from './run-circus';

import { Event, TestEntry, DescribeBlock, TestName, TestFn } from './types';

export { messages };

expect.extend({
  toMatchSnapshot,
  toThrowErrorMatchingSnapshot,
});
expect.addSnapshotSerializer = addSerializer;

function addScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
    s.onload = () => {
      resolve();
    };
    s.onerror = error => {
      reject(error);
    };
  });
}

let jsdomPromise = null;
/**
 * Load JSDOM while the sandbox loads. Before we run a test we make sure that this has been loaded.
 */
const getJSDOM = () => {
  let jsdomPath = '/static/js/jsdom-16.3.0.min.js';
  if (
    navigator.userAgent.indexOf('jsdom') !== -1 &&
    process.env.NODE_ENV === 'test'
  ) {
    jsdomPath = 'file://' + path.resolve('./static/js/jsdom-16.3.0.min.js');
  }

  jsdomPromise = jsdomPromise || addScript(jsdomPath);

  return jsdomPromise;
};

function resetTestState() {
  const ROOT_DESCRIBE_BLOCK = makeDescribe(ROOT_DESCRIBE_BLOCK_NAME);
  const INITIAL_STATE = {
    currentDescribeBlock: ROOT_DESCRIBE_BLOCK,
    expand: undefined,
    hasFocusedTests: false,
    rootDescribeBlock: ROOT_DESCRIBE_BLOCK,
    testTimeout: 5000,
  };

  expect.setState({
    assertionCalls: 0,
    expectedAssertionsNumber: null,
    isExpectingAssertions: false,
    suppressedErrors: [],
    testPath: null,
    currentTestName: null,
    snapshotState: null,
  });

  setState(INITIAL_STATE);
}

export default class TestRunner {
  tests: Array<Module>;
  ranTests: Set<string>;
  manager: Manager;
  watching: boolean = true;

  LOCALHOST_URL: string = 'http://localhost';

  dom: any;

  constructor(manager: Manager) {
    this.manager = manager;
    this.ranTests = new Set();

    addEventHandler(this.handleMessage);
    listen(this.handleCodeSandboxMessage);

    this.sendMessage(messages.INITIALIZE);
  }

  public getRuntimeGlobals(module: Module) {
    const test = (testName: TestName, fn?: TestFn) =>
      dispatchJest({
        fn,
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });
    const skip = (testName: TestName, fn?: TestFn) =>
      dispatchJest({
        fn,
        mode: 'skip',
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });
    const only = (testName: TestName, fn: TestFn) => {
      dispatchJest({
        fn,
        mode: 'only',
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });
    };
    test.each = bindEach(test);
    skip.each = bindEach(skip);
    only.each = bindEach(only);

    test.only = only;
    test.skip = skip;

    const it = test;
    return {
      ...jestTestHooks,
      test,
      jest: jestMock,
      it,
      expect,
    };
  }

  /**
   * In this function we actually set some globals on the global window. This is because there are modules out
   * there that try to overwrite some globals that we try to set. For example, this code won't work:
   *
   * ```js
   * const test = 5;
   * ```
   *
   * if we add test to the scope in the function:
   *
   * ```ts
   * function evaluate(test) {
   *   const test = 5; // <- Error!
   * }
   * ```
   *
   * Because of this, we have to put these globals on the global window. The big disadvantage of this is that
   * we cannot run these tests in parallel. If we would want to do that we could introduce the globals in separate
   * scope (separate function) that wraps the inner function, like this:
   *
   * ```ts
   * (function jestGlobals(test) {
   *   (function evaluate() {
   *     const test = 5; // <- No Error!
   *   })()
   * })
   * ```
   *
   * Right now we're making sure to clean the globals up in teardown
   *
   * Related issue: https://github.com/codesandbox/codesandbox-client/issues/4922
   */
  setTestGlobals(module: Module) {
    const jsdomWindow = this.dom.window.document.defaultView;
    const { document: jsdomDocument } = jsdomWindow;

    // Set the modules that are not set on JSDOM
    jsdomWindow.Date = Date;
    jsdomWindow.fetch = fetch;

    const jestRuntimeGlobals = this.getRuntimeGlobals(module);

    const globals = {
      document: jsdomDocument,
      window: jsdomWindow,
      global: jsdomWindow,

      // When calling `Event` we don't want the native `Event` but the JSDOM version
      Event: jsdomWindow.Event,
    };

    Object.keys(jestRuntimeGlobals).forEach(globalKey => {
      window[globalKey] = jestRuntimeGlobals[globalKey];
    });

    return globals;
  }

  static isTest(testPath: string) {
    const endsWith = [
      '.test.js',
      '.test.ts',
      '.test.tsx',
      '.test.jsx',
      '.spec.js',
      '.spec.ts',
      '.spec.tsx',
      '.spec.jsx',
    ];

    if (
      testPath.includes('__tests__') &&
      (testPath.endsWith('.js') ||
        testPath.endsWith('.ts') ||
        testPath.endsWith('.tsx'))
    ) {
      return true;
    }

    return endsWith.filter(ext => testPath.endsWith(ext)).length > 0;
  }

  findTests(modules: { [path: string]: Module }) {
    if (this.tests) {
      this.tests.forEach(t => {
        if (!modules[t.path]) {
          // A removed test
          this.sendMessage(messages.REMOVE_FILE, { path: t.path });
        }
      });
    }
    this.tests = Object.keys(modules)
      .filter(TestRunner.isTest)
      .map(p => modules[p]);

    return this.tests;
  }

  /* istanbul ignore next */
  async transpileTests() {
    return Promise.all(
      (this.tests || []).map(async t => {
        const tModule = this.manager.getTranspiledModule(t, '');
        if (
          tModule.source &&
          tModule.compilation &&
          this.ranTests.has(t.path)
        ) {
          // We cached this test, don't run it again. We only run tests of changed
          // files
          return null;
        }

        this.sendMessage(messages.ADD_FILE, { path: t.path });
        try {
          await this.manager.transpileModules(t, true);

          if (!tModule.source) {
            this.ranTests.delete(t.path);
          }

          return t;
        } catch (e) {
          const error = await this.errorToCodeSandbox(e);
          this.ranTests.delete(t.path);
          this.sendMessage(messages.FILE_ERROR, { path: t.path, error });

          return null;
        }
      })
    );
  }

  sendMessage(event: string, message: any = {}) {
    dispatch({
      type: 'test',
      event,
      ...message,
    });
  }

  oldWindow = {};
  async initJSDOM() {
    await getJSDOM();
    const { JSDOM } = (window as any).JSDOM;
    let url = document.location.origin;
    if (url === 'null') {
      url = this.LOCALHOST_URL;
    }

    this.dom = new JSDOM('<!DOCTYPE html>', {
      pretendToBeVisual: true,
      url,
    });

    // If there's code accessing globals (e.g. `getComputedStyle`), it will
    // use the global window instead. We can't change a global, but we can override
    // values over it.
    const GLOBAL_OVERRIDE_KEYS = ['getComputedStyle'];
    GLOBAL_OVERRIDE_KEYS.forEach(key => {
      this.oldWindow[key] = window[key];
      window[key] = this.dom.window[key];
    });
  }

  oldEnvVars: { [key: string]: string };
  async setup() {
    this.oldEnvVars = { ...this.manager.envVariables };
    this.manager.envVariables.NODE_ENV = 'test';
  }

  async teardown() {
    const global = this.dom.window.document.defaultView;
    global.close();
    Object.defineProperty(global, 'document', { value: null });
    this.dom = null;
    this.manager.envVariables = this.oldEnvVars;

    // Put back the old globals of the window after tests have run
    Object.keys(this.oldWindow).forEach(key => {
      window[key] = this.oldWindow[key];
    });
    this.oldWindow = {};

    // @ts-expect-error We don't have the module, but the module is only used in a lazy context
    const jestRuntimeGlobals = this.getRuntimeGlobals();
    Object.keys(jestRuntimeGlobals).forEach(globalKey => {
      delete window[globalKey];
    });
  }

  /* istanbul ignore next */
  async runTests(force: boolean = false) {
    if (!this.watching && !force) {
      return;
    }

    await this.initJSDOM();

    this.sendMessage(messages.TOTAL_TEST_START);

    let testModules: Module[] = [];

    try {
      if (this.manager.preset.name === react.name) {
        try {
          testModules = [
            await this.manager.resolveModuleAsync({
              path: './src/setupTests.js',
            }),
          ];
        } catch (e) {
          testModules = [
            await this.manager.resolveModuleAsync({
              path: './src/setupTests.ts',
            }),
          ];
        }
      } else if (this.manager.preset.name === reactTs.name) {
        testModules = [
          await this.manager.resolveModuleAsync({
            path: './src/setupTests.ts',
          }),
        ];
      } else if (this.manager.configurations.package) {
        const { parsed } = this.manager.configurations.package;

        if (parsed && parsed.jest && parsed.jest.setupFilesAfterEnv) {
          testModules = await Promise.all(
            parsed.jest.setupFilesAfterEnv.map((setupPath: string) =>
              this.manager.resolveModuleAsync({
                path: setupPath,
              })
            )
          );
        }
      }
    } catch (e) {
      /* ignore */
    }

    if (testModules.length) {
      await Promise.all(
        testModules.map(testSetup =>
          this.manager.transpileModules(testSetup, true)
        )
      );
    }

    if (this.manager.modules) {
      this.findTests(this.manager.modules);
    }

    // $FlowIssue
    const tests: Array<Module> = (await this.transpileTests()).filter(t => t);

    resetTestState();

    await this.setup();

    await Promise.all(
      tests.map(async t => {
        dispatch(actions.error.clear(t.path, 'jest'));

        try {
          if (testModules.length) {
            testModules.forEach(module => {
              this.manager.evaluateModule(module, {
                force: true,
                globals: this.setTestGlobals(module),
              });
            });
          }

          this.manager.evaluateModule(t, {
            force: true,
            globals: this.setTestGlobals(t),
          });
          this.ranTests.add(t.path);
        } catch (e) {
          this.ranTests.delete(t.path);
          const error = await this.errorToCodeSandbox(e);
          this.sendMessage(messages.FILE_ERROR, { path: t.path, error });
        }
      })
    );

    await run();
    await this.teardown();

    setTimeout(() => {
      this.sendMessage(messages.TOTAL_TEST_END);
    });
  }

  async errorToCodeSandbox(
    error: Error & {
      matcherResult?: boolean;
    }
  ) {
    const parsedError = parse(error);
    const mappedErrors = await map(parsedError);

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      matcherResult: Boolean(error.matcherResult),
      mappedErrors,
    };
  }

  getDescribeBlocks(test: TestEntry) {
    let t: TestEntry | DescribeBlock | undefined = test;
    const blocks = [];

    while (t.parent != null) {
      blocks.push(t.parent.name);

      t = t.parent;
    }

    // Remove ROOT_DESCRIBE_BLOCK
    blocks.pop();

    return blocks.reverse();
  }

  async testToCodeSandbox(test: TestEntry) {
    const [testPath, name] = test.name.split(':#:');

    const errors = await Promise.all(test.errors.map(this.errorToCodeSandbox));

    return {
      name,
      path: testPath,
      duration: test.duration,
      status: test.status || 'running',
      errors,
      blocks: this.getDescribeBlocks(test),
    };
  }

  handleMessage = async (message: Event) => {
    switch (message.name) {
      case 'test_start': {
        const test = await this.testToCodeSandbox(message.test);

        return this.sendMessage(messages.TEST_START, {
          test,
        });
      }
      case 'test_failure':
      case 'test_success': {
        const { suppressedErrors } = expect.getState();

        if (suppressedErrors && suppressedErrors.length) {
          /* eslint-disable no-param-reassign */
          message.test.errors = suppressedErrors;
          message.test.status = 'fail';
          /* eslint-enable no-param-reassign */
          expect.setState({ suppressedErrors: [] });
        }
        const test = await this.testToCodeSandbox(message.test);

        if (test.errors) {
          test.errors.forEach(err => {
            if (err.mappedErrors && err.mappedErrors.length) {
              const { mappedErrors } = err;
              const [mappedError] = mappedErrors;

              dispatch(
                actions.error.show(err.name || 'Jest Error', err.message, {
                  line: mappedError._originalLineNumber,
                  column: mappedError._originalColumnNumber,
                  path: test.path,
                  payload: {},
                  source: 'jest',
                })
              );
            }
          });
        }
        try {
          return this.sendMessage(messages.TEST_END, {
            test,
          });
        } catch (e) {
          const error = await this.errorToCodeSandbox(e);
          return this.sendMessage(messages.FILE_ERROR, {
            path: test.path,
            error,
          });
        }
      }
      case 'start_describe_definition': {
        return this.sendMessage(messages.DESCRIBE_START, {
          blockName: message.blockName,
        });
      }
      case 'finish_describe_definition': {
        return this.sendMessage(messages.DESCRIBE_END);
      }
      case 'add_test': {
        const [testPath, testName] = message.testName.split(':#:');
        return this.sendMessage(messages.ADD_TEST, {
          testName,
          path: testPath,
          mode: message.mode,
        });
      }
      default: {
        return null;
      }
    }
  };

  handleCodeSandboxMessage = (message: any) => {
    switch (message.type) {
      case 'set-test-watching':
        this.watching = message.watching;
        if (message.watching === true) {
          this.ranTests.clear();
          this.runTests(true);
        }
        break;
      case 'run-all-tests':
        this.ranTests.clear();
        this.runTests(true);
        break;
      case 'run-tests': {
        const testPath = message.path;

        this.ranTests.delete(testPath);
        this.runTests();
        break;
      }
    }
  };

  // We stub this, because old versions of CodeSandbox still needs this
  reportError = () => {};
}
