import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    deploying: false,
    url: null,
  },
  signals: {
    deployClicked: sequences.deploy,
  },
});
