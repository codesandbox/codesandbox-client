import { createSelector } from 'reselect';
import { KEYBINDINGS } from './keybindings';

export const preferencesSelector = state => state.preferences;
export const keybindingsSelector = createSelector(
  preferencesSelector,
  pref => pref.keybindings
);
export const userKeybindingsSelector = createSelector(
  keybindingsSelector,
  keybindings => {
    const userKeybindings = keybindings || {};
    const newBindings = { ...KEYBINDINGS };
    Object.keys(userKeybindings).forEach(key => {
      newBindings[key].bindings = userKeybindings[key];
    });

    return newBindings;
  }
);
