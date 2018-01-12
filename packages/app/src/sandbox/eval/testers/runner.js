import expect from 'jest-matchers';
import jestMock from 'jest-mock';
import { getCurrentManager } from '../../compile';

const describe = (name, fn) => {
  fn();
};

const test = (name, fn) => {
  let testManager = getCurrentManager().testManager;
  let error = false;
  try {
    fn();
  } catch (Error) {
    error = true;
    testManager.addResult(`❌ FAIL ${name}`);
  } finally {
    if (!error) {
      testManager.addResult(`✅ PASS ${name}`);
    }
  }
};

export { describe, test as it, test, expect, jestMock };
