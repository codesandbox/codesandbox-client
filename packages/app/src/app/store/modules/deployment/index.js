import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    hasAlias: false,
    deployToDelete: null,
    deploying: false,
    url: null,
    gettingDeploys: true,
    sandboxDeploys: [],
  },
  signals: {
    deployWithNetlify: sequences.deployWithNetlify,
    getNetlifyDeploys: sequences.getNetlifyDeploys,
    getDeploys: sequences.getDeploys,
    deployClicked: sequences.deploy,
    deploySandboxClicked: sequences.openDeployModal,
    setDeploymentToDelete: sequences.deploymentToDelete,
    deleteDeployment: sequences.deleteDeployment,
    aliasDeployment: sequences.aliasDeployment,
  },
});
