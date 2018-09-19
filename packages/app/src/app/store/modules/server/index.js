import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    status: 'disconnected',
  },
  signals: {
    statusChanged: sequences.setStatus,
  },
});
