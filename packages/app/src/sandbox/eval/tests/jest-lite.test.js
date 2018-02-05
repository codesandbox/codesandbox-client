// import TestRunner from './jest-lite';
const TestRunner = {};

describe.skip('TestRunner class', () => {
  it('exports a module', () => {
    expect(TestRunner).toEqual(expect.any(Function));
  });

  describe('#constructor', () => {
    it('returns a TestRunner instance', () => {
      expect(new TestRunner()).toBeInstanceOf(TestRunner);
    });
  });

  describe('initialize', () => {
    it('should reset results', () => {
      const testRunner = new TestRunner();
      expect(testRunner.aggregatedResults.totalTests).toBe(0);
      testRunner.addResult({ status: 'pass', name: 'foo' });
      expect(testRunner.aggregatedResults.totalTests).toBe(1);
      testRunner.initialize();
      expect(testRunner.aggregatedResults.totalTests).toBe(0);
    });
  });

  describe('testGlobals', () => {
    it('returns an object', () => {
      let {
        describe: _describe,
        it: _it,
        test: _test,
        expect: _expect,
        jest: _jest,
      } = new TestRunner().testGlobals();

      expect(_describe).toEqual(expect.any(Function));
      expect(_it).toEqual(expect.any(Function));
      expect(_test).toEqual(expect.any(Function));
      expect(_expect).toEqual(expect.any(Function));
      expect(_jest).toEqual(expect.any(Object));
    });

    describe('describe', () => {
      let testRunner;
      let _describe;
      let fnSpy;

      beforeAll(() => {
        testRunner = new TestRunner();
        _describe = testRunner.testGlobals().describe;
        fnSpy = jest.fn();
      });

      it('calls the function block', () => {
        _describe('foo', fnSpy);
        expect(fnSpy).toHaveBeenCalled();
      });
    });

    describe('test', () => {
      let testRunner;
      let _test;
      let fnSpy;

      beforeEach(() => {
        testRunner = new TestRunner();
        _test = testRunner.testGlobals().test;
        fnSpy = jest.fn();
      });

      it('calls the function block', () => {
        _test('foo', fnSpy);
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
      expect(testRunner.tests).toEqual([]);
    });
    it('should not find any tests when no modules are passed', () => {
      testRunner.findTests([]);
      expect(testRunner.tests).toEqual([]);
    });

    it('should find tests when modules are passed', () => {
      testRunner.findTests([{ path: 'Sum.test.js' }]);
      expect(testRunner.tests).toHaveLength(1);

      testRunner.findTests([
        { path: 'Sum.test.js' },
        { path: 'Sum.spec.js' },
        { path: '__tests__/Sum.js' },
        { path: 'Sum.js' },
        { path: 'src/Sum.js' },
      ]);
      expect(testRunner.tests).toHaveLength(3);

      testRunner.findTests([
        { path: 'Sum.test.ts' },
        { path: 'Sum.spec.ts' },
        { path: '__tests__/Sum.ts' },
        { path: 'Sum.ts' },
        { path: 'src/Sum.ts' },
      ]);
      expect(testRunner.tests).toHaveLength(3);

      testRunner.findTests([{ path: 'Sum.test.js' }, { path: 'Sum.test.ts' }]);
      expect(testRunner.tests).toHaveLength(2);
    });
  });

  describe('transpileTests', () => {
    it('todo');
  });

  describe('runTests', () => {
    it('todo');
  });

  describe('addResult', () => {
    let testRunner;

    beforeEach(() => {
      testRunner = new TestRunner();
    });

    it('should start off with no test results', () => {
      expect(testRunner.aggregatedResults).toMatchObject({
        failedTestSuites: 0,
        passedTestSuites: 0,
        totalTestSuites: 0,
        failedTests: 0,
        passedTests: 0,
        totalTests: 0,
      });
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

  describe('reportResults', () => {
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

      let results = testRunner.reportResults();
      let { summaryMessage } = results;

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

      let results = testRunner.reportResults();
      let { summaryMessage, failedMessages } = results;

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

      let results = testRunner.reportResults();
      let { summaryMessage } = results;

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

      let results = testRunner.reportResults();
      let { failedMessages } = results;

      expect(results).not.toEqual(null);
      expect(failedMessages[0]).toMatch(/FAIL/);
      expect(failedMessages[0]).toMatch(/foo > bar/);
    });

    it('should report fail tests by nested describe', () => {
      testRunner.setCurrentDescribe('foo');
      testRunner.setCurrentDescribe('bar');
      testRunner.addResult({ status: 'fail', name: 'baz' });

      let results = testRunner.reportResults();
      let { failedMessages } = results;

      expect(results).not.toEqual(null);
      expect(failedMessages[0]).toMatch(/FAIL/);
      expect(failedMessages[0]).toMatch(/foo > bar > baz/);
    });

    it('should report pass & fail tests', () => {
      testRunner.addResult({ status: 'pass', name: 'foo' });
      testRunner.addResult({ status: 'pass', name: 'bar' });
      testRunner.addResult({ status: 'fail', name: 'baz' });

      let results = testRunner.reportResults();
      let { summaryMessage } = results;

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

      let results = testRunner.reportResults();
      let { summaryMessage } = results;

      expect(results).not.toEqual(null);
      expect(summaryMessage).toMatch(/Test Summary: 👻/);
      expect(summaryMessage).toMatch(
        /Test Suites: 2 failed, 1 passed, 3 total/
      );
      expect(summaryMessage).toMatch(/Tests: 3 failed, 3 passed, 6 total/);
    });
  });
});
