import {
  IConfig,
  IOnInitialize,
  IAction,
  IOperator,
  IDerive,
  IState,
} from 'overmind';
import { merge, namespaced } from 'overmind/config';
import * as effects from './effects';
import { state } from './state';
import { onInitialize } from './onInitialize';
import * as actions from './actions';
import * as preferences from './namespaces/preferences';
import * as userNotifications from './namespaces/userNotifications';
import * as patron from './namespaces/patron';
import * as editor from './namespaces/editor';
import * as live from './namespaces/live';

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
  })
);

export interface Config extends IConfig<typeof config> {}

export interface OnInitialize extends IOnInitialize<Config> {}

export interface Action<Input = void, Output = void | Promise<void>>
  extends IAction<Config, Input, Output> {}

export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> {}

export interface Derive<Parent extends IState, Output>
  extends IDerive<Config, Parent, Output> {}
