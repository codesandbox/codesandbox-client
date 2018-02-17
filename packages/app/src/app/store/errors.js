import { CerebralError } from '@cerebral/fluent';

export class AuthenticationError extends CerebralError {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
