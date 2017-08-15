// @flow
import SandboxError from './sandbox-error';

export default class NoDomChangeError extends SandboxError {
  constructor(react: boolean, name: string) {
    super();

    this.payload = {
      react,
      name,
    };
  }

  type = 'no-dom-change';
  severity = 'warning';
  hideLine: true;
}
