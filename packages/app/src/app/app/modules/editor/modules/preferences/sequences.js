import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

export const changeViewMode = [
  set(state`editor.preferences.showEditor`, props`showEditor`),
  set(state`editor.preferences.showPreview`, props`showPreview`),
];
