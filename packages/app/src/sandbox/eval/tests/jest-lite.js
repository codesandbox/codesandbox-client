// @flow
import { dispatch } from 'codesandbox-api';
import expect from 'jest-matchers';
import jestMock from 'jest-mock';
import jestTestHooks from 'jest-circus';
import run from 'jest-circus/build/run';
import { addEventHandler, getState } from 'jest-circus/build/state';

import type Manager from '../manager';
import type { Module } from '../entities/module';
import type { Event, TestEntry, DescribeBlock } from './types';

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

  testGlobals() {
    return {
      ...jestTestHooks,
      expect,
      jest: jestMock,
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
    await this.transpileTests();

    for (let i = 0; i < this.tests.length; i++) {
      const t = this.tests[i];

      this.filename = t.path;
      this.sendMessage('file_start');

      this.manager.evaluateModule(t);
      const results = await run();
      this.sendMessage('file_end');
    }
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

    return blocks.reverse();
  }

  testToCodeSandbox(test: TestEntry) {
    return {
      name: test.name,
      duration: test.duration,
      status: test.status || 'running',
      errors: test.errors.map(this.errorToCodeSandbox),
      blocks: this.getDescribeBlocks(test),
    };
  }

  handleMessage = (message: Event) => {
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
        return this.sendMessage('add_test', {
          testName: message.testName,
        });
      }
      default: {
        break;
      }
    }
  };

  resetResults = () => {};
}
