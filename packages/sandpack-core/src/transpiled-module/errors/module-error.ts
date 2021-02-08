import { FileError } from '../../transpiler/utils/worker-error-handler';
import { TranspiledModule } from '../transpiled-module';

// Babel bug workaround (https://github.com/babel/babel/issues/8061)
const ErrorClass = Error;

export default class ModuleError extends ErrorClass {
  path: string;
  error: Error;
  constructor(module: TranspiledModule, err: FileError) {
    super();

    this.name = 'ModuleError';
    this.path = err.fileName || module.module.path;
    this.message = err.message;
    this.error = err;
    this.stack = err.stack;
  }
}
