import {
  IConfig,
  IOnInitialize,
  IAction,
  IOperator,
  IDerive,
  IState,
} from 'overmind';
import { merge, namespaced } from 'overmind/config';
import { createConnect } from './createConnect';
import * as effects from './effects';
import { state } from './state';
import { onInitialize } from './onInitialize';
import * as actions from './actions';
import * as preferences from './namespaces/preferences';
import * as userNotifications from './namespaces/userNotifications';
import * as patron from './namespaces/patron';
import * as editor from './namespaces/editor';
import * as live from './namespaces/live';
import * as workspace from './namespaces/workspace';
import * as dashboard from './namespaces/dashboard';
import * as deployment from './namespaces/deployment';
import * as files from './namespaces/files';
import * as git from './namespaces/git';
import * as explore from './namespaces/explore';
import * as profile from './namespaces/profile';
import * as server from './namespaces/server';

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
  })
);

export interface Config extends IConfig<typeof config> {}

export interface OnInitialize extends IOnInitialize<Config> {}

export interface Action<Input = void, Output = void>
  extends IAction<Config, Input, Output> {}

export interface AsyncAction<Input = void, Output = void>
  extends IAction<Config, Input, Promise<Output>> {}

export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> {}

export interface Derive<Parent extends IState, Output>
  extends IDerive<Config, Parent, Output> {}

export const connect = createConnect<typeof config>();
