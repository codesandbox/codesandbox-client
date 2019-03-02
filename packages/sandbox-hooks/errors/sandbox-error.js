// @flow
import type { Module } from 'common/lib/types';

type Suggestion = {
  title: string,
  action: Function,
};
const ErrorClass = Error;

export default class SandboxError extends ErrorClass {
  severity: 'error' | 'warning';
  type: string;
  module: Module;
  payload: ?Object;
  suggestions: Array<Suggestion>;

  suggestions = [];

  constructor(error: ?Error) {
    super(error ? error.message : null);

    if (error) {
      this.fileName = error.fileName;
      this.description = error.description;
      this.message = error.message;
      this.name = error.name;
      this.stack = error.stack;
      this.number = error.number;
    }
  }
}
