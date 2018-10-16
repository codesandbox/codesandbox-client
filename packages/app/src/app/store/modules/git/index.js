import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { fetchGitChanges } from '../../sequences';

export default Module({
  model,
  state: {
    repoTitle: '',
    error: null,
    isExported: false,
    showExportedModal: false,
    isFetching: false,
    subject: '',
    description: '',
    originalGitChanges: null,
    commit: null,
    pr: null,
    isCommitting: false,
    isCreatingPr: false,
  },
  signals: {
    repoTitleChanged: sequences.changeRepoTitle,
    createRepoClicked: sequences.createRepo,
    gitMounted: fetchGitChanges,
    createCommitClicked: sequences.createCommit,
    subjectChanged: sequences.changeSubject,
    descriptionChanged: sequences.changeDescription,
    createPrClicked: sequences.createPr,
  },
});
