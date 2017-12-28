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
    showFetchButton: false,
    isFetching: false,
    message: '',
    originalGitChanges: null,
    showCreateCommitModal: false,
    commit: null,
    pr: null,
    isCommiting: false,
    showPrModal: false,
    isCreatingPr: false,
  },
  signals: {
    repoTitleChanged: sequences.changeRepoTitle,
    createRepoClicked: sequences.createRepo,
    gitMounted: fetchGitChanges,
    createCommitClicked: sequences.createCommit,
    messageChanged: sequences.changeMessage,
    createCommitModalClosed: sequences.closeCreateCommitModal,
    prModalClosed: sequences.closePrModal,
    createPrClicked: sequences.createPr,
  },
});
