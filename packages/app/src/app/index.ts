// linting should throw for using extension and unused var t
import * as t from './index.js';

// linting should throw for unused var
let a = 'b';

// linting should throw for no implicit return
const b = () => {
  return 1 + 1;
};
