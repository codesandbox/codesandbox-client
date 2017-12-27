import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    repoTitle: '',
    error: null,
    isExported: false,
    showExportedModal: false,
  },
  signals: {
    repoTitleChanged: sequences.changeRepoTitle,
    createRepoClicked: sequences.createRepo,
  },
});
