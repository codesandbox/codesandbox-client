// Babel bug workaround (https://github.com/babel/babel/issues/8061)
const ErrorClass = Error;

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
export default class ModuleError extends ErrorClass {
  path: string;
  error: Error;
  constructor(module, err) {
    super();

    this.name = 'ModuleError';
    this.path = err.fileName || module.module.path;
    this.message =
      err && typeof err === 'object' && err.message ? err.message : err;
    this.error = err;
    this.stack = err.stack;
  }
}
