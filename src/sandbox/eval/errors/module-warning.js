import TranspiledModule from '../transpiled-module';

export default class ModuleWarning extends Error {
  constructor(module, warning) {
    super();

    this.name = 'ModuleWarning';
    this.module = module;
    this.message = warning.message;
    this.warning = warning.message;
    this.lineNumber = warning.lineNumber;
    this.columnNumber = warning.columnNumber;
    this.severity = warning.severity;
    this.source = warning.source;

    Error.captureStackTrace(this, this.constructor);
  }

  module: TranspiledModule;
  message: string;
  warning: string;
  message: string;
  severity: 'notice' | 'warning';
  source: ?string;
  lineNumber: ?number;
  columnNumber: ?number;
}
