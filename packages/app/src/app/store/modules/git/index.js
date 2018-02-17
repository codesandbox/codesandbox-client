import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { fetchGitChanges } from '../../sequences';

export default Module({
  state: {
    repoTitle: '',
    error: null,
    isExported: false,
    showExportedModal: false,
    isFetching: false,
    message: '',
    originalGitChanges: null,
    commit: null,
    pr: null,
    isCommiting: false,
    isCreatingPr: false,
  },
  signals: {
    repoTitleChanged: sequences.changeRepoTitle,
    createRepoClicked: sequences.createRepo,
    gitMounted: fetchGitChanges,
    createCommitClicked: sequences.createCommit,
    messageChanged: sequences.changeMessage,
    createPrClicked: sequences.createPr,
  },
});
