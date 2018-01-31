// @flow
import { dispatch } from 'codesandbox-api';
import expect from 'jest-matchers';
import jestMock from 'jest-mock';
import jestTestHooks from 'jest-circus';
import run from 'jest-circus/build/run';
import { makeDescribe } from 'jest-circus/build/utils';
import {
  addEventHandler,
  setState,
  dispatch as dispatchJest,
  ROOT_DESCRIBE_BLOCK_NAME,
} from 'jest-circus/build/state';

import type Manager from '../manager';
import type { Module } from '../entities/module';
import type {
  Event,
  TestEntry,
  DescribeBlock,
  TestName,
  TestFn,
} from './types';

function resetTestState() {
  const ROOT_DESCRIBE_BLOCK = makeDescribe(ROOT_DESCRIBE_BLOCK_NAME);
  const INITIAL_STATE = {
    currentDescribeBlock: ROOT_DESCRIBE_BLOCK,
    expand: undefined,
    hasFocusedTests: false,
    rootDescribeBlock: ROOT_DESCRIBE_BLOCK,
    testTimeout: 5000,
  };

  setState(INITIAL_STATE);
}

export default class TestRunner {
  tests: Array<Module>;
  manager: Manager;
  startTime: number;
  endTime: number;

  constructor(manager: Manager) {
    this.manager = manager;
    this.startTime = Date.now();
    this.endTime = Date.now();

    addEventHandler(this.handleMessage);
  }

  initialize() {
    this.resetResults();
    this.startTime = Date.now();
    this.endTime = Date.now();
  }

  testGlobals(module: Module) {
    const test = (testName: TestName, fn?: TestFn) =>
      dispatchJest({
        fn,
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });
    const it = test;
    test.skip = (testName: TestName, fn?: TestFn) =>
      dispatchJest({
        fn,
        mode: 'skip',
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });
    test.only = (testName: TestName, fn: TestFn) =>
      dispatchJest({
        fn,
        mode: 'only',
        name: 'add_test',
        testName: `${module.path}:#:${testName}`,
      });

    return {
      ...jestTestHooks,
      expect,
      jest: jestMock,
      test,
      it,
    };
  }

  findTests(modules: { [path: string]: Module }) {
    this.tests = Object.keys(modules)
      .filter(path => {
        let matched = false;
        if (
          path.includes('__tests__') &&
          (path.endsWith('.js') || path.endsWith('.ts'))
        ) {
          matched = true;
        }
        if (path.endsWith('.test.js') || path.endsWith('.test.ts')) {
          matched = true;
        }
        if (path.endsWith('.spec.js') || path.endsWith('.spec.ts')) {
          matched = true;
        }
        return matched;
      })
      .map(p => modules[p]);
  }

  /* istanbul ignore next */
  async transpileTests() {
    for (let t of this.tests) {
      await this.manager.transpileModules(t, true);
    }
  }

  sendMessage(event: string, message: any = {}) {
    dispatch({
      file: this.filename,
      type: 'test',
      event,
      ...message,
    });
  }

  /* istanbul ignore next */
  async runTests() {
    this.sendMessage('total_test_start');
    await this.transpileTests();
    resetTestState();

    for (let i = 0; i < this.tests.length; i++) {
      const t = this.tests[i];

      this.manager.evaluateModule(t);
    }
    await run();
    this.sendMessage('total_test_end');
  }

  errorToCodeSandbox(
    error: Error & {
      matcherResult: {
        actual: any,
        expected: any,
        name: string,
        pass: boolean,
        message: Function,
      },
    }
  ) {
    return {
      message: error.message,
      stack: error.stack,
      matcherResult: {
        actual: error.matcherResult.actual,
        expected: error.matcherResult.expected,
        name: error.matcherResult.name,
        pass: error.matcherResult.pass,
      },
    };
  }

  getDescribeBlocks(test: TestEntry) {
    let t: ?(TestEntry | DescribeBlock) = test;
    const blocks = [];

    // $FlowIssue
    while (t.parent != null) {
      blocks.push(t.parent.name);
      // $FlowIssue
      t = t.parent;
    }

    // Remove ROOT_DESCRIBE_BLOCK
    blocks.pop();

    return blocks.reverse();
  }

  testToCodeSandbox(test: TestEntry) {
    const [path, name] = test.name.split(':#:');
    return {
      name,
      path,
      duration: test.duration,
      status: test.status || 'running',
      errors: test.errors.map(this.errorToCodeSandbox),
      blocks: this.getDescribeBlocks(test),
    };
  }

  handleMessage = (message: Event, state) => {
    switch (message.name) {
      case 'test_start': {
        return this.sendMessage('test_start', {
          test: this.testToCodeSandbox(message.test),
        });
      }
      case 'test_failure':
      case 'test_success': {
        return this.sendMessage('test_end', {
          test: this.testToCodeSandbox(message.test),
        });
      }
      case 'start_describe_definition': {
        return this.sendMessage('describe_start', {
          blockName: message.blockName,
        });
      }
      case 'finish_describe_definition': {
        return this.sendMessage('describe_end');
      }
      case 'add_test': {
        const [path, testName] = message.testName.split(':#:');
        return this.sendMessage('add_test', {
          testName,
          path,
        });
      }
      default: {
        break;
      }
    }
  };

  resetResults = () => {};
}
