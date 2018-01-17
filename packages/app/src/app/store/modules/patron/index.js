import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { tier } from './getters';
import { SubscriptionError } from './errors';

export default Module({
  model,
  state: {
    price: 10,
    isUpdatingSubscription: false,
  },
  getters: {
    tier,
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
