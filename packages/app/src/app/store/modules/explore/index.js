import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    popularSandboxes: null,
    pickedSandboxes: null,
    pickedSandboxesIndexes: null,
    pickedSandboxesLoading: false,
  },
  signals: {
    popularSandboxesMounted: sequences.mountPopularSandboxes,
    pickSandbox: sequences.pickSandbox,
    pickedSandboxesMounted: sequences.pickedSandboxes,
  },
});
