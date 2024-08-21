import { Context } from 'app/overmind';

export const viewModeChanged = (
  { state }: Context,
  {
    showEditor,
    showPreview,
  }: {
    showEditor: boolean;
    showPreview: boolean;
  }
) => {
  state.preferences.showEditor = showEditor;
  state.preferences.showPreview = showPreview;
};

export const devtoolsToggled = ({ state }: Context) => {
  state.preferences.showDevtools = !state.preferences.showDevtools;
};

export const openPreferencesModal = (
  { state }: Context,
  itemId: string = 'account'
) => {
  state.preferences.itemId = itemId;
  state.currentModal = 'preferences';
};

export const setDevtoolsOpen = ({ state }: Context, isOpen: boolean) => {
  state.preferences.showDevtools = isOpen;
};

export const itemIdChanged = async (
  { actions, state }: Context,
  itemId: string
) => {
  state.preferences.itemId = itemId;
};

export const settingChanged = (
  { state, effects }: Context,
  {
    name,
    value,
  }: {
    value: any;
    name: string;
  }
) => {
  const path = name.split('.');
  const firstKey = path[0];
  const lastKey = path.pop();
  const settingsTarget = path.reduce(
    (aggr, pathKey) => aggr[pathKey],
    state.preferences.settings
  );
  settingsTarget[lastKey] = value;

  effects.settingsStore.set(firstKey, state.preferences.settings[firstKey]);

  effects.analytics.track('Change Settings', {
    name,
    value,
  });
};

export const updateAccountDetails = async (
  { state, effects }: Context,
  {
    username,
    name,
  }: {
    username: string;
    name: string;
  }
) => {
  if (!state.user) {
    // Should not happen
    return;
  }

  try {
    await effects.gql.mutations.updateCurrentUser({
      username,
      name,
      bio: '',
      socialLinks: [],
    });

    state.user.name = name;
    state.user.username = username;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem updating your profile.'
    );
  }
};
