import {
  IConfig,
  IOnInitialize,
  IAction,
  IOperator,
  IDerive,
  IState,
} from 'overmind';
import * as effects from './effects';

export const config = {
  effects,
};

export interface Config extends IConfig<typeof config> {}

export interface OnInitialize extends IOnInitialize<Config> {}

export interface Action<Input = void> extends IAction<Config, Input> {}

export interface Operator<Input = void, Output = Input>
  extends IOperator<Config, Input, Output> {}

export interface Derive<Parent extends IState, Output>
  extends IDerive<Config, Parent, Output> {}
