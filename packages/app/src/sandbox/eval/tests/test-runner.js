// @flow
export default class TestRunner {
  tests: Array;
  aggregatedResults: Object;
  currentDescribe: String;
  manager: Manager;

  constructor(manager) {
    // console.log('TR: Constructor');
    this.tests = [];
    this.aggregatedResults = this._makeEmptyAggregatedResults();
    this.currentDescribe = '';
    this.currentPath = '';
    this.manager = manager;
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
  }

  findTests(modules) {
    // console.log('TR: findTests');
    this.tests = modules.filter(m => {
      let matched = false;
      if (m.path.includes('__tests__') && m.path.endsWith('.js')) {
        matched = true;
      }
      if (m.path.endsWith('.test.js')) {
        matched = true;
      }
      if (m.path.endsWith('.spec.js')) {
        matched = true;
      }
      return matched;
    });
  }

  async transpileTests() {
    // console.log('TR: transpileTests');
    for (let t of this.tests) {
      await this.manager.transpileModules(t);
    }
  }

  async runTests() {
    // console.log('TR: runTests');
    await this.transpileTests();
    this.tests.forEach(t => {
      this.setCurrentPath(t.path);
      this.manager.evaluateModule(t);
      this.resetCurrentPath();
    });
  }

  addResult({ status, name }) {
    // console.log('TR: addResult');
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
    // console.log('TR: Report');
    let aggregatedResults = this.aggregatedResults;
    let results = this.aggregatedResults.results;
    let summaryMessage = '';
    let failedMessages = [];

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

    summaryMessage = '💁 Test Summary: \n\n';
    summaryMessage += 'Test Suites: ';
    if (aggregatedResults.failedMessagesuites) {
      summaryMessage += `${aggregatedResults.failedMessagesuites} failed, `;
    }
    if (aggregatedResults.passedTestSuites) {
      summaryMessage += `${aggregatedResults.passedTestSuites} passed, `;
    }
    summaryMessage += `${aggregatedResults.totalTestSuites} total`;
    summaryMessage += '\n';

    summaryMessage += 'Tests: ';
    if (aggregatedResults.failedMessages) {
      summaryMessage += `${aggregatedResults.failedTests} failed, `;
    }
    if (aggregatedResults.passedTests) {
      summaryMessage += `${aggregatedResults.passedTests} passed, `;
    }
    summaryMessage += `${aggregatedResults.totalTests} total`;
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
