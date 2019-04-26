import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

export const setStatus = [set(state`server.status`, props`status`)];

export const setContainerStatus = [
  set(state`server.containerStatus`, props`status`),
];
