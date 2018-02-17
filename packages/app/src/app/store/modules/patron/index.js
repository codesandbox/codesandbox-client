import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as getters from './getters';
import { SubscriptionError } from './errors';

export default Module({
  state: {
    price: 10,
    isUpdatingSubscription: false,
    get tier() {
      return getters.tier(this);
    },
  },
  signals: {
    patronMounted: sequences.loadPatron,
    priceChanged: sequences.changePrice,
    createSubscriptionClicked: sequences.createSubscription,
    updateSubscriptionClicked: sequences.updateSubscription,
    cancelSubscriptionClicked: sequences.cancelSubscription,
    tryAgainClicked: sequences.clearError,
  },
  catch: [[SubscriptionError, sequences.setError]],
});
