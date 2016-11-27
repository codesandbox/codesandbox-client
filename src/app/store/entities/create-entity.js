import { Schema } from 'normalizr';
import type { Module } from './modules';
import createEntityActions from '../actions/entities';

type Options = {
  reducer?: (state: Object, action: Object) => Object;
  actions?: { [name: string]: Function };
  initialState?: Object;
  afterReceiveReducer?: (module: Module, state: Object) => module;
};

export default (schema: typeof Schema, {
  reducer,
  actions = {},
  initialState = {},
  afterReceiveReducer,
}: Options = {}) => ({
  schema,
  reducer,
  initialState,
  afterReceiveReducer,
  actions: { ...createEntityActions(schema), ...actions },
});
