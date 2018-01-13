import expect from 'jest-matchers';
import jestMock from 'jest-mock';
import { getCurrentManager } from '../../compile';

const describe = (name, fn) => {
  fn();
};

const test = (name, fn) => {
  let testRunner = getCurrentManager().testRunner;
  let error = false;
  try {
    fn();
  } catch (Error) {
    error = true;
    testRunner.addResult(`❌ FAIL ${name}`);
  } finally {
    if (!error) {
      testRunner.addResult(`✅ PASS ${name}`);
    }
  }
};

export { describe, test as it, test, expect, jestMock as jest };
