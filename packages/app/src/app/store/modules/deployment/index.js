import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    peopleWant2: [],
    hasAlias: false,
    deployToDelete: null,
    deploying: false,
    url: null,
    gettingDeploys: true,
    sandboxDeploys: [],
  },
  signals: {
    getDeploys: sequences.getDeploys,
    addPersonFor2: sequences.addPersonFor2,
    deployClicked: sequences.deploy,
    deploySandboxClicked: sequences.openDeployModal,
    setDeploymentToDelete: sequences.deploymentToDelete,
    deleteDeployment: sequences.deleteDeployment,
    aliasDeployment: sequences.aliasDeployment,
    getPeople: sequences.getPeopleWhoWant2,
  },
});
