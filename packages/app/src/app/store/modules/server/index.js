import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    status: 'initializing',
  },
  signals: {
    statusChanged: sequences.setStatus,
  },
});
