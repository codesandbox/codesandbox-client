import { set, when, toggle } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

export const changeKeybinding = actions.changeKeybinding;

export const changeViewMode = [
  set(state`editor.preferences.showEditor`, props`showEditor`),
  set(state`editor.preferences.showPreview`, props`showPreview`),
];

export const toggleZenMode = toggle(state`editor.preferences.settings.zenMode`);

export const toggleDevtools = toggle(state`editor.preferences.showDevtools`);

export const changeItemIndex = [
  set(state`editor.preferences.itemIndex`, props`itemIndex`),
];

export const setPreference = [
  set(state`editor.preferences.settings.${props`name`}`, props`value`),
];

export const setBadgeVisibility = [
  actions.toggleBadgeVisibility,
  actions.updateBadgeInfo,
];

export const getPaymentDetails = [
  actions.getPaymentDetails,
  when(props`data`),
  {
    true: [set(state`editor.preferences.paymentDetails`, props`data`)],
    false: [
      set(state`editor.preferences.paymentDetailError`, props`error.message`),
    ],
  },
  set(state`editor.preferences.paymentDetails`, props`data`),
  set(state`editor.preferences.isLoadingPaymentDetails`, false),
];

export const updatePaymentDetails = [
  set(state`editor.preferences.isLoadingPaymentDetails`, true),
  actions.updatePaymentDetails,
  set(state`editor.preferences.isLoadingPaymentDetails`, false),
];
