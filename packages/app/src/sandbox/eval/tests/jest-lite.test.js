import TestRunner, { messages } from './jest-lite';

jest.mock('sandbox-hooks/react-error-overlay/utils/mapper', () => ({
  map: jest.fn(),
}));

jest.mock('codesandbox-api');
const api = require('codesandbox-api');

api.dispatch = jest.fn();

describe('TestRunner class', () => {
  it('exports a module', () => {
    expect(TestRunner).toEqual(expect.any(Function));
  });

  describe('#constructor', () => {
    it('returns a TestRunner instance', () => {
      expect(new TestRunner()).toBeInstanceOf(TestRunner);
    });
  });

  describe('initialize', () => {
    let testRunner;
    beforeEach(() => {
      TestRunner.sendMessage = jest.fn();
      testRunner = new TestRunner();
    });

    it('should be created with 0 test ran', () => {
      expect(testRunner.ranTests.size).toBe(0);
    });

    it('should send message (dispatch) on initilaization', () => {
      expect(api.dispatch).toHaveBeenCalledWith({
        type: 'test',
        event: messages.INITIALIZE,
      });
    });
  });

  describe('getRuntimeGlobals', () => {
    it('returns an object', async () => {
      const testRunner = new TestRunner();

      window.fetch = jest.fn();
      window.localStorage = jest.fn();

      await testRunner.initJSDOM();

      const {
        it: _it,
        test: _test,
        expect: _expect,
        jest: _jest,
      } = testRunner.getRuntimeGlobals();

      expect(_it).toBeInstanceOf(Function);
      expect(_test).toBeInstanceOf(Function);
      expect(_expect).toBeInstanceOf(Function);
      expect(_jest).toBeInstanceOf(Object);
    });

    xdescribe('test', () => {
      let testRunner;
      let _test;
      let fnSpy;

      beforeEach(async () => {
        testRunner = new TestRunner();
        await testRunner.initJSDOM();
        _test = testRunner.getRuntimeGlobals().test;
        fnSpy = jest.fn();
      });

      it('calls the function block', () => {
        expect(fnSpy).toHaveBeenCalled();
      });

      it('adds pass test result', () => {
        _test('foo', () => {});
        expect(testRunner.aggregatedResults.passedTests).toBe(1);
        expect(testRunner.aggregatedResults.failedTests).toBe(0);
      });

      it('adds fail test result', () => {
        _test('foo', () => {
          throw Error();
        });
        expect(testRunner.aggregatedResults.passedTests).toBe(0);
        expect(testRunner.aggregatedResults.failedTests).toBe(1);
      });
    });
  });

  describe('findTests', () => {
    let testRunner;

    beforeEach(() => {
      testRunner = new TestRunner();
    });

    it('should be initialized with no tests', () => {
      expect(testRunner.ranTests.size).toBe(0);
    });
    it('should not find any tests when no modules are passed', () => {
      testRunner.findTests({});
      expect(testRunner.tests).toEqual([]);
    });

    it('should find 1 test when modules are passed', () => {
      testRunner.findTests({ 'Sum.test.js': { path: 'Sum.test.js' } });
      expect(testRunner.tests).toHaveLength(1);
    });

    it('should find 3 of 6 tests when modules are passed', () => {
      testRunner.findTests({
        'Sum.test.js': { path: 'Sum.test.js' },
        'Sum.spec.js': { path: 'Sum.spec.js' },
        '__tests__/Sum.js': { path: '__tests__/Sum.js' },
        'Sum.js': { path: 'Sum.js' },
        'src/Sum.js': { path: 'src/Sum.js' },
        'src/Sum.js1': { path: 'src/Sum.js1' },
      });
      expect(testRunner.tests).toHaveLength(3);
    });

    it('should find 3 of 5 tests when modules are passed', () => {
      testRunner.findTests({
        'Sum.test.ts': { path: 'Sum.test.ts' },
        'Sum.spec.ts': { path: 'Sum.spec.ts' },
        '__tests__/Sum.ts': { path: '__tests__/Sum.ts' },
        'Sum.ts': { path: 'Sum.ts' },
        'src/Sum.ts': { path: 'src/Sum.ts' },
      });
      expect(testRunner.tests).toHaveLength(3);
    });

    it('should find 3 of 5 (typescript) tests when modules are passed', () => {
      testRunner.findTests({
        'Sum.test.tsx': { path: 'Sum.test.tsx' },
        'Sum.spec.tsx': { path: 'Sum.spec.tsx' },
        '__tests__/Sum.tsx': { path: '__tests__/Sum.tsx' },
        'Sum.tsx': { path: 'Sum.tsx' },
        'src/Sum.tsx': { path: 'src/Sum.tsx' },
      });
      expect(testRunner.tests).toHaveLength(3);
    });

    it('should find 3 of 3 tests when modules are passed', () => {
      testRunner.findTests({
        'Sum.test.js': { path: 'Sum.test.js' },
        'Sum.test.ts': { path: 'Sum.test.ts' },
        'Sum.test.tsx': { path: 'Sum.test.tsx' },
      });
      expect(testRunner.tests).toHaveLength(3);
    });
  });

  describe('transpileTests', () => {
    // it('todo');
  });

  describe('runTests', () => {
    // it('todo');
  });

  // deprecated
  xdescribe('addResult', () => {
    let testRunner;

    beforeEach(() => {
      testRunner = new TestRunner();
    });

    it('should add pass test results', () => {
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      expect(testRunner.aggregatedResults).toMatchObject({
        failedTestSuites: 0,
        passedTestSuites: 1,
        totalTestSuites: 1,
        failedTests: 0,
        passedTests: 2,
        totalTests: 2,
      });
    });

    it('should add fail test results', () => {
      testRunner.addResult({ status: 'fail', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });
      expect(testRunner.aggregatedResults).toMatchObject({
        failedTestSuites: 1,
        passedTestSuites: 0,
        totalTestSuites: 1,
        failedTests: 2,
        passedTests: 0,
        totalTests: 2,
      });
    });

    it('should add pass & fail test results', () => {
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.addResult({ status: 'fail', name: 'baz' });
      expect(testRunner.aggregatedResults).toMatchObject({
        failedTestSuites: 1,
        passedTestSuites: 0,
        totalTestSuites: 1,
        failedTests: 1,
        passedTests: 2,
        totalTests: 3,
      });
    });

    it('should add pass & fail test results by suite', () => {
      testRunner.setCurrentPath('a.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.setCurrentPath('b.js');
      testRunner.addResult({ status: 'fail', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });
      testRunner.setCurrentPath('c.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });
      expect(testRunner.aggregatedResults).toMatchObject({
        failedTestSuites: 2,
        passedTestSuites: 1,
        totalTestSuites: 3,
        failedTests: 3,
        passedTests: 3,
        totalTests: 6,
      });
    });
  });

  // deprecated
  xdescribe('reportResults', () => {
    let testRunner;

    beforeEach(() => {
      testRunner = new TestRunner();
    });

    it('should start off with no tests to report', () => {
      expect(testRunner.reportResults()).toEqual(null);
    });

    it('should report pass tests', () => {
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });

      const results = testRunner.reportResults();
      const { summaryMessage } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 😎/);
      expect(summaryMessage).toMatch(
        /Test Suites: 0 failed, 1 passed, 1 total/
      );
      expect(summaryMessage).toMatch(/Tests: 0 failed, 2 passed, 2 total/);
    });

    it('should report fail tests', () => {
      testRunner.addResult({ status: 'fail', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });

      const results = testRunner.reportResults();
      const { summaryMessage, failedMessages } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 👻/);
      expect(summaryMessage).toMatch(
        /Test Suites: 1 failed, 0 passed, 1 total/
      );
      expect(summaryMessage).toMatch(/Tests: 2 failed, 0 passed, 2 total/);

      expect(failedMessages).toHaveLength(2);
      expect(failedMessages[0]).toMatch(/FAIL/);
      expect(failedMessages[0]).toMatch(/foo/);
      expect(failedMessages[1]).toMatch(/FAIL/);
      expect(failedMessages[1]).toMatch(/bar/);
    });

    it('should add pass & fail test results by suite', () => {
      testRunner.setCurrentPath('a.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.setCurrentPath('b.js');
      testRunner.addResult({ status: 'fail', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });
      testRunner.setCurrentPath('c.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });

      const results = testRunner.reportResults();
      const { summaryMessage } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 👻/);
      expect(summaryMessage).toMatch(
        /Test Suites: 2 failed, 1 passed, 3 total/
      );
      expect(summaryMessage).toMatch(/Tests: 3 failed, 3 passed, 6 total/);
    });

    it('should report fail tests by describe', () => {
      testRunner.setCurrentDescribe('foo');
      testRunner.addResult({ status: 'fail', name: 'bar' });

      const results = testRunner.reportResults();
      const { failedMessages } = results;

      expect(results).not.toEqual(null);
      expect(failedMessages[0]).toMatch(/FAIL/);
      expect(failedMessages[0]).toMatch(/foo > bar/);
    });

    it('should report fail tests by nested describe', () => {
      testRunner.setCurrentDescribe('foo');
      testRunner.setCurrentDescribe('bar');
      testRunner.addResult({ status: 'fail', name: 'baz' });

      const results = testRunner.reportResults();
      const { failedMessages } = results;

      expect(results).not.toEqual(null);
      expect(failedMessages[0]).toMatch(/FAIL/);
      expect(failedMessages[0]).toMatch(/foo > bar > baz/);
    });

    it('should report pass & fail tests', () => {
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.addResult({ status: 'fail', name: 'baz' });

      const results = testRunner.reportResults();
      const { summaryMessage } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 👻/);
      expect(summaryMessage).toMatch(
        /Test Suites: 1 failed, 0 passed, 1 total/
      );
      expect(summaryMessage).toMatch(/Tests: 1 failed, 2 passed, 3 total/);
    });

    it('should report pass & fail tests by suite', () => {
      testRunner.setCurrentPath('a.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.setCurrentPath('b.js');
      testRunner.addResult({ status: 'fail', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });
      testRunner.setCurrentPath('c.js');
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'fail', name: 'bar' });

      const results = testRunner.reportResults();
      const { summaryMessage } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 👻/);
      expect(summaryMessage).toMatch(
        /Test Suites: 2 failed, 1 passed, 3 total/
      );
      expect(summaryMessage).toMatch(/Tests: 3 failed, 3 passed, 6 total/);
    });
  });
});
