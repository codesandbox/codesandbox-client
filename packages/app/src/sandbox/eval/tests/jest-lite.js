// @flow
import expect from 'jest-matchers';
import jestMock from 'jest-mock';
import { getCurrentManager } from '../../compile';

const describe = (name, fn) => {
  const testRunner = getCurrentManager().testRunner;
  testRunner.setCurrentDescribe(name);
  fn();
  testRunner.resetCurrentDescribe(name);
};

const test = (name, fn) => {
  const testRunner = getCurrentManager().testRunner;
  let error = false;
  try {
    fn();
  } catch (Error) {
    error = true;
    testRunner.addResult({ status: 'fail', name });
  } finally {
    if (!error) {
      testRunner.addResult({ status: 'pass', name });
    }
  }
};

export default class TestRunner {
  tests: Array;
  aggregatedResults: Object;
  currentDescribe: String;
  manager: Manager;
  startTime: Date;
  endTime: Date;

  constructor(manager) {
    this.tests = [];
    this.aggregatedResults = this._makeEmptyAggregatedResults();
    this.currentDescribe = '';
    this.currentPath = '';
    this.manager = manager;
    this.startTime = Date.now();
    this.endTime = Date.now();
  }

  _makeEmptyAggregatedResults() {
    return {
      failedTestSuites: 0,
      failedTests: 0,
      passedTestSuites: 0,
      passedTests: 0,
      totalTestSuites: 0,
      totalTests: 0,
      summaryMessage: '',
      failedMessages: [],
      results: [],
    };
  }

  initialize() {
    this.resetResults();
    this.startTime = Date.now();
    this.endTime = Date.now();
  }

  static testGlobals() {
    return {
      describe,
      test,
      it: test,
      expect,
      jest: jestMock,
    };
  }

  findTests(modules) {
    this.tests = modules.filter(m => {
      let matched = false;
      if (
        m.path.includes('__tests__') &&
        (m.path.endsWith('.js') || m.path.endsWith('.ts'))
      ) {
        matched = true;
      }
      if (m.path.endsWith('.test.js') || m.path.endsWith('.test.ts')) {
        matched = true;
      }
      if (m.path.endsWith('.spec.js') || m.path.endsWith('.spec.ts')) {
        matched = true;
      }
      return matched;
    });
  }

  async transpileTests() {
    for (let t of this.tests) {
      await this.manager.transpileModules(t);
    }
  }

  async runTests() {
    await this.transpileTests();
    this.tests.forEach(t => {
      this.setCurrentPath(t.path);
      this.manager.evaluateModule(t);
      this.resetCurrentPath();
    });
  }

  addResult({ status, name }) {
    let describe = this.currentDescribe;
    let path = this.currentPath;

    this.aggregatedResults.results.push({ status, name, describe, path });

    this.aggregatedResults.totalTests++;
    if (status === 'pass') {
      this.aggregatedResults.passedTests++;
    } else {
      this.aggregatedResults.failedTests++;
    }
    let totalTestSuites = new Set();
    let failedTestSuites = new Set();
    this.aggregatedResults.results.forEach(({ status, path }) => {
      totalTestSuites.add(path);
      if (status === 'fail') {
        failedTestSuites.add(path);
      }
    });
    this.aggregatedResults.totalTestSuites = totalTestSuites.size;
    this.aggregatedResults.failedTestSuites = failedTestSuites.size;
    this.aggregatedResults.passedTestSuites =
      totalTestSuites.size - failedTestSuites.size;
  }

  reportResults() {
    let aggregatedResults = this.aggregatedResults;
    let results = this.aggregatedResults.results;
    let summaryMessage = '';
    let failedMessages = [];
    let summaryEmoji = '';

    if (aggregatedResults.totalTestSuites === 0) {
      return null;
    }

    results.forEach(({ status, name, describe, path }) => {
      if (status === 'fail') {
        let message = `FAIL (${path}) `;
        if (describe) {
          message += `${describe} > `;
        }
        message += `${name}`;
        failedMessages.push(message);
      }
    });

    summaryEmoji =
      aggregatedResults.totalTestSuites === aggregatedResults.passedTestSuites
        ? '😎'
        : '👻';
    summaryMessage = `Test Summary: ${summaryEmoji}\n\n`;
    summaryMessage += 'Test Suites: ';
    if (aggregatedResults.failedTestSuites !== null) {
      summaryMessage += `${aggregatedResults.failedTestSuites} failed, `;
    }
    if (aggregatedResults.passedTestSuites !== null) {
      summaryMessage += `${aggregatedResults.passedTestSuites} passed, `;
    }
    summaryMessage += `${aggregatedResults.totalTestSuites} total`;
    summaryMessage += '\n';

    summaryMessage += 'Tests: ';
    if (aggregatedResults.failedTests !== null) {
      summaryMessage += `${aggregatedResults.failedTests} failed, `;
    }
    if (aggregatedResults.passedTests !== null) {
      summaryMessage += `${aggregatedResults.passedTests} passed, `;
    }
    summaryMessage += `${aggregatedResults.totalTests} total`;
    summaryMessage += '\n';

    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    summaryMessage += `Time: ${this.duration}ms`;
    summaryMessage += '\n';

    aggregatedResults.summaryMessage = summaryMessage;
    aggregatedResults.failedMessages = failedMessages;
    return aggregatedResults;
  }

  resetResults() {
    this.aggregatedResults = this._makeEmptyAggregatedResults();
  }

  setCurrentDescribe(name) {
    if (this.currentDescribe) {
      this.currentDescribe += ` > ${name}`;
    } else {
      this.currentDescribe += `${name}`;
    }
  }

  resetCurrentDescribe() {
    this.currentDescribe = '';
  }

  setCurrentPath(name) {
    this.currentPath = name;
  }

  resetCurrentPath() {
    this.currentPath = '';
  }
}
