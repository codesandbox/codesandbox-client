import { CerebralError } from '@cerebral/fluent';
import { SubscriptionErrorResult } from './types'

export class SubscriptionError extends CerebralError {
  constructor(result: SubscriptionErrorResult) {
    super(result.errors.detail[0]);
  }
}
