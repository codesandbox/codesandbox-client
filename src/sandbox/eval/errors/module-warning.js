/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
export default class ModuleWarning extends Error {
  constructor(module, warning) {
    super();

    this.name = 'ModuleWarning';
    this.module = module;
    this.message =
      warning && typeof warning === 'object' && warning.message
        ? warning.message
        : warning;
    this.warning = warning;

    Error.captureStackTrace(this, this.constructor);
  }
}
