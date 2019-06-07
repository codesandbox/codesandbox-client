import { BaseError } from 'make-error';

export interface TypeScriptCompileErrorProps {
  message: string;
}

const TS_ERROR_MESSAGE =
  'TypeScript compiler encountered syntax errors while transpiling. Errors: ';

export default class TypeScriptCompileError extends BaseError {
  name = 'TypeScriptCompileError';
  options: {};

  static fromError = (error: TypeScriptCompileErrorProps) => {
    const message = [
      'Failed to compile TypeScript: ',
      error.message.replace(TS_ERROR_MESSAGE, ''),
    ].join('');

    return new TypeScriptCompileError(message, error);
  };

  constructor(message: string, options: {}) {
    super(message);

    this.options = options;
    Object.defineProperty(this, 'options', {
      enumerable: false,
    });
  }

  toObject() {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  }
}
