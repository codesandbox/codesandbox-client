import {
  IAction,
  IConfig,
  IOnInitialize,
  IOperator,
  IReaction,
  Overmind,
} from 'overmind';
import { createHook } from 'overmind-react';
import { merge, namespaced } from 'overmind/config';

import * as actions from './actions';
import { createConnect } from './createConnect';
import * as effects from './effects';
import { createModals } from './factories';
import * as modals from './modals';
import * as comments from './namespaces/comments';
import * as dashboard from './namespaces/dashboard';
import * as deployment from './namespaces/deployment';
import * as editor from './namespaces/editor';
import * as explore from './namespaces/explore';
import * as files from './namespaces/files';
import * as git from './namespaces/git';
import * as live from './namespaces/live';
import * as patron from './namespaces/patron';
import * as preferences from './namespaces/preferences';
import * as profile from './namespaces/profile';
import * as server from './namespaces/server';
import * as userNotifications from './namespaces/userNotifications';
import * as workspace from './namespaces/workspace';
import * as preview from './namespaces/preview';
import { onInitialize } from './onInitialize';
import { state } from './state';

export const config = merge(
  {
    onInitialize,
    effects,
    state,
    actions,
  },
  namespaced({
    preferences,
    userNotifications,
    patron,
    editor,
    live,
    workspace,
    dashboard,
    deployment,
    files,
    git,
    explore,
    profile,
    server,
    comments,
    preview,
    modals: createModals(modals),
  })
);

export interface Config
  extends IConfig<{
    state: typeof config.state;
    actions: typeof config.actions;
    effects: typeof config.effects;
  }> { }

export type RootState = typeof config.state;

export interface OnInitialize extends IOnInitialize<Config> { }

export interface Action<Input = void, Output = void>
  extends IAction<Config, Input, Output> { }

export interface AsyncAction<Input = void, Output = void>
  extends IAction<Config, Input, Promise<Output>> { }

export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> { }

export interface Reaction extends IReaction<Config> { }

export const connect = createConnect<Config>();

export const useOvermind = createHook<Config>();

export const Observer: React.FC<{
  children: <T>(overmind: {
    state: Overmind<Config>['state'];
    actions: Overmind<Config>['actions'];
  }) => T;
}> = ({ children }) => {
  const overmind = useOvermind();

  return children(overmind);
};
