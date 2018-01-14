import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { addNotification } from '../../factories';

export const changePrice = set(state`patron.price`, props`price`);

export const setError = set(state`patron.error`, props`error.message`);

export const clearError = set(state`patron.error`, null);

export const createSubscription = [
  set(state`patron.isUpdatingSubscription`, true),
  actions.subscribe,
  set(state`user`, props`user`),
  set(state`patron.isUpdatingSubscription`, false),
  addNotification('Thank you very much for your support!', 'success'),
];

export const updateSubscription = [
  set(state`patron.isUpdatingSubscription`, true),
  actions.updateSubscription,
  set(state`user`, props`user`),
  set(state`patron.isUpdatingSubscription`, false),
  addNotification('Subscription updated, thanks for helping out!', 'success'),
];

export const cancelSubscription = [
  actions.whenConfirmedCancelSubscription,
  {
    true: [
      set(state`patron.isUpdatingSubscription`, true),
      actions.cancelSubscription,
      set(state`user`, props`user`),
      set(state`patron.isUpdatingSubscription`, false),
      addNotification(
        'Sorry to see you go, but thanks a bunch for the support this far!',
        'success'
      ),
    ],
    false: [],
  },
];
