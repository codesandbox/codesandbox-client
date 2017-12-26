import { set, when, toggle, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { getZeitUserDetails } from 'app/store/sequences';
import * as actions from './actions';

export const openModal = set(state`editor.preferences.showModal`, true);

export const closeModal = set(state`editor.preferences.showModal`, false);

export const changeKeybinding = [
  actions.changeKeybinding,
  actions.storeKeybindings,
];

export const changeViewMode = [
  set(state`editor.preferences.showEditor`, props`showEditor`),
  set(state`editor.preferences.showPreview`, props`showPreview`),
];

export const toggleZenMode = toggle(state`editor.preferences.settings.zenMode`);

export const toggleDevtools = toggle(state`editor.preferences.showDevtools`);

export const changeItemIndex = [
  set(state`editor.preferences.itemIndex`, props`itemIndex`),
  equals(props`itemIndex`),
  {
    '4': getZeitUserDetails,
  },
];

export const setSetting = [
  set(state`editor.preferences.settings.${props`name`}`, props`value`),
  actions.storeSetting,
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
