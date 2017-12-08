import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    settings: {
      prettifyOnSaveEnabled: false,
    },
    showEditor: true,
    showPreview: true,
  },
  signals: {
    viewModeChanged: sequences.changeViewMode,
  },
});
