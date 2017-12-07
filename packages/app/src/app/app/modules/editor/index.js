import { Module } from 'cerebral';
import model from './model';

import workspace from './modules/workspace';

export default Module({
  model,
  state: {},
  signals: {},
  modules: { workspace },
});
