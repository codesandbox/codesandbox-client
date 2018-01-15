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

export { describe, test as it, test, expect, jestMock as jest };
