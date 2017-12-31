import { set, when, toggle, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { getZeitUserDetails } from 'app/store/sequences';
import * as actions from './actions';
import { setKeybindings, startKeybindings } from '../../actions';

export const openModal = set(state`preferences.showModal`, true);

export const closeModal = [
  equals(state`preferences.itemIndex`),
  {
    '3': [],
    otherwise: [set(state`preferences.showModal`, false), startKeybindings],
  },
];

export const changeKeybinding = [
  actions.changeKeybinding,
  actions.storeKeybindings,
  setKeybindings,
];

export const changeViewMode = [
  set(state`preferences.showEditor`, props`showEditor`),
  set(state`preferences.showPreview`, props`showPreview`),
];

export const toggleZenMode = toggle(state`preferences.settings.zenMode`);

export const toggleDevtools = toggle(state`preferences.showDevtools`);

export const changeItemIndex = [
  set(state`preferences.itemIndex`, props`itemIndex`),
  equals(props`itemIndex`),
  {
    '4': getZeitUserDetails,
    otherwise: [],
  },
  equals(props`itemIndex`),
  {
    '3': actions.pauseKeybindings,
    otherwise: startKeybindings,
  },
];

export const setSetting = [
  set(state`preferences.settings.${props`name`}`, props`value`),
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
    true: [set(state`preferences.paymentDetails`, props`data`)],
    false: [set(state`preferences.paymentDetailError`, props`error.message`)],
  },
  set(state`preferences.paymentDetails`, props`data`),
  set(state`preferences.isLoadingPaymentDetails`, false),
];

export const updatePaymentDetails = [
  set(state`preferences.isLoadingPaymentDetails`, true),
  actions.updatePaymentDetails,
  set(state`preferences.isLoadingPaymentDetails`, false),
];
