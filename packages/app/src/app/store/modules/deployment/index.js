import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';

export default Module({
  state: {
    deploying: false,
    url: null,
  },
  signals: {
    deployClicked: sequences.deploy,
    deploySandboxClicked: sequences.openDeployModal,
  },
});
