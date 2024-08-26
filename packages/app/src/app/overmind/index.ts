import { IContext } from 'overmind';
import {
  createActionsHook,
  createEffectsHook,
  createReactionHook,
  createStateHook,
} from 'overmind-react';
import { merge, namespaced } from 'overmind/config';

import * as actions from './actions';
import * as effects from './effects';
import { createModals } from './factories';
import * as modals from './modals';
import * as checkout from './namespaces/checkout';
import * as dashboard from './namespaces/dashboard';
import * as sidebar from './namespaces/sidebar';
import * as preferences from './namespaces/preferences';
import * as profile from './namespaces/profile';
import * as userNotifications from './namespaces/userNotifications';
import { state } from './state';

export const config = merge(
  {
    effects,
    state,
    actions,
  },
  namespaced({
    preferences,
    userNotifications,
    dashboard,
    sidebar,
    profile,
    checkout,
    modals: createModals(modals),
  })
);

export type Context = IContext<{
  state: typeof config.state;
  actions: typeof config.actions;
  effects: typeof config.effects;
}>;

export const useAppState = createStateHook<Context>();
export const useActions = createActionsHook<Context>();
export const useEffects = createEffectsHook<Context>();
export const useReaction = createReactionHook<Context>();

export const Observer: React.FC<{
  children: <T>(context: {
    state: Context['state'];
    actions: Context['actions'];
  }) => T;
}> = ({ children }) => {
  const appState = useAppState();
  const appActions = useActions();

  return children({ state: appState, actions: appActions });
};
