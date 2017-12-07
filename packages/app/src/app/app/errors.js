import { CerebralError } from 'cerebral';

export class AuthenticationError extends CerebralError {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
