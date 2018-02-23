import { CerebralError } from 'cerebral';

export class SubscriptionError extends CerebralError {
  constructor(result) {
    super(result.errors.detail[0]);
  }
}
