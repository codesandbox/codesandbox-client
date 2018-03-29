import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as getters from './getters';
import { SubscriptionError } from './errors';

import { State } from './types';

const state: State = {
    price: 10,
    isUpdatingSubscription: false,
    error: null,
    get tier() {
        return getters.tier(this);
    }
};

const signals = {
    patronMounted: sequences.loadPatron,
    priceChanged: sequences.changePrice,
    createSubscriptionClicked: sequences.createSubscription,
    updateSubscriptionClicked: sequences.updateSubscription,
    cancelSubscriptionClicked: sequences.cancelSubscription,
    tryAgainClicked: sequences.clearError
};

export default Module<State, typeof signals>({
    state,
    signals,
    catch: [ [ SubscriptionError, sequences.setError ] ]
});
