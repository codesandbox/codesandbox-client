import { Action, AsyncAction } from 'app/overmind';
import { setVimExtensionEnabled } from 'app/vscode/initializers';
import { json } from 'overmind';

export const viewModeChanged: Action<{
  showEditor: boolean;
  showPreview: boolean;
}> = ({ state }, { showEditor, showPreview }) => {
  state.preferences.showEditor = showEditor;
  state.preferences.showPreview = showPreview;
};

export const devtoolsToggled: Action = ({ state }) => {
  state.preferences.showDevtools = !state.preferences.showDevtools;
};

export const setDevtoolsOpen: Action<boolean> = ({ state }, isOpen) => {
  state.preferences.showDevtools = isOpen;
};

export const itemIdChanged: AsyncAction<string> = async (
  { state, actions, effects },
  itemId
) => {
  state.preferences.itemId = itemId;
  if (itemId === 'keybindings') {
    effects.keybindingManager.pause();
  } else {
    effects.keybindingManager.start();
  }

  if (itemId === 'integrations') {
    await actions.deployment.internal.getZeitUserDetails();
  }
};

export const settingChanged: Action<{
  value: any;
  name: string;
}> = ({ state, effects }, { name, value }) => {
  state.preferences.settings[name] = value;
  if (name === 'vimMode') {
    setVimExtensionEnabled(value);
  }

  if (name.split('.').length > 1) {
    const prop = name.split('.')[0];
    const value = state.preferences.settings[prop];

    effects.settingsStore.set(prop, value);
  } else {
    effects.settingsStore.set(name, value);
  }

  effects.analytics.track('Change Settings', {
    name,
    value,
  });
};

export const setBadgeVisibility: AsyncAction<{
  id: string;
  visible: boolean;
}> = async ({ state, effects }, { id, visible }) => {
  const badges = state.user.badges;

  badges.forEach((badge, index) => {
    if (badge.id === id) {
      state.user.badges[index].visible = visible;
    }
  });

  await effects.api.updateBadge(id, visible);
};

export const paymentDetailsRequested: AsyncAction = async ({
  state,
  effects,
}) => {
  state.preferences.isLoadingPaymentDetails = true;
  try {
    state.preferences.paymentDetails = await effects.api.getPaymentDetails();
  } catch (error) {
    state.preferences.paymentDetailError = error.message;
  }
  state.preferences.isLoadingPaymentDetails = false;
};

export const paymentDetailsUpdated: AsyncAction<string> = async (
  { state, effects },
  token
) => {
  state.preferences.isLoadingPaymentDetails = true;
  state.preferences.paymentDetails = await effects.api.updatePaymentDetails(
    token
  );
  state.preferences.isLoadingPaymentDetails = false;
};

export const keybindingChanged: Action<{
  name: string;
  value: any;
}> = ({ state, effects }, { name, value }) => {
  const keybindings = state.preferences.settings.keybindings;
  const currentIndex = keybindings.findIndex(binding => binding.key === name);
  const newBinding = {
    key: name,
    bindings: JSON.parse(JSON.stringify(value)),
  };

  if (currentIndex === -1) {
    state.preferences.settings.keybindings.push(newBinding);
  } else {
    state.preferences.settings.keybindings.splice(currentIndex, 1, newBinding);
  }

  const keybindingsValue = keybindings.reduce(
    (currentValue, binding) => ({
      ...currentValue,
      [binding.key]: binding.bindings,
    }),
    {}
  );

  effects.settingsStore.set('keybindings', keybindingsValue);

  effects.keybindingManager.set(json(state.preferences.settings.keybindings));
};

export const zenModeToggled: Action = ({ state }) => {
  state.preferences.settings.zenMode = !state.preferences.settings.zenMode;
};
