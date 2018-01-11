import expect from 'jest-matchers';
import jestMock from 'jest-mock';

const describe = (name, fn) => {
  fn();
};

const test = (name, fn) => {
  let error = false;
  try {
    fn();
  } catch (Error) {
    error = true;
    console.log(`❌ FAIL ${name}`);
  } finally {
    if (!error) {
      console.log(`✅ PASS ${name}`);
    }
  }
};

export { describe, test as it, test, expect, jestMock };
