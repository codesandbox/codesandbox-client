import { createSelector } from 'reselect';

export const preferencesSelector = state => state.preferences;
export const keybindingsSelector = createSelector(
  preferencesSelector,
  preferences => preferences.keybindings
);
