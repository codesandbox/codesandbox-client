import { CerebralError } from '@cerebral/fluent';

export class SubscriptionError extends CerebralError {
  constructor(result) {
    super(result.errors.detail[0]);
  }
}
