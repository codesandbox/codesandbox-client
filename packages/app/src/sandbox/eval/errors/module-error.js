/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
export default class ModuleError extends Error {
  constructor(module, err) {
    super();

    this.name = 'ModuleError';
    this.path = err.fileName || module.module.path;
    this.message =
      err && typeof err === 'object' && err.message ? err.message : err;
    this.error = err;
  }
}
