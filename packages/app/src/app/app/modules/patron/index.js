import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { tier } from './getters';

export default Module({
  model,
  state: {
    price: 10,
  },
  getters: {
    tier,
  },
  signals: {
    priceChanged: sequences.changePrice,
    createSubscriptionClicked: sequences.createSubscription,
    updateSubscriptionClicked: sequences.updateSubscription,
    cancelSubscriptionClicked: sequences.cancelSubscription,
  },
});
