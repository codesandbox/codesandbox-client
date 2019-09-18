// eslint-disable-next-line
import { CerebralError } from 'cerebral';

export class AuthenticationError extends CerebralError {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class CancelError extends CerebralError {
  constructor(message) {
    super(message);
    this.name = 'CancelError';
  }
}
