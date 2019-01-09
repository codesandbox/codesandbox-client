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
    selectedSandbox: null,
    pickedSandboxDetails: null,
  },
  signals: {
    popularSandboxesMounted: sequences.mountPopularSandboxes,
    pickSandbox: sequences.pickSandbox,
    pickSandboxModal: sequences.pickSandboxModal,
    getSandbox: sequences.getSandbox,
    pickedSandboxesMounted: sequences.pickedSandboxes,
  },
});
