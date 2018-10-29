import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    popularSandboxes: null,
  },
  signals: {
    popularSandboxesMounted: sequences.mountPopularSandboxes,
    pickSandbox: sequences.pickSandbox,
  },
});
