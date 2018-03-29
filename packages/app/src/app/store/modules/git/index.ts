import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { fetchGitChanges } from '../../sequences';
import { State } from './types';

const state: State = {
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
    isCreatingPr: false
};

const signals = {
    repoTitleChanged: sequences.changeRepoTitle,
    createRepoClicked: sequences.createRepo,
    gitMounted: fetchGitChanges,
    createCommitClicked: sequences.createCommit,
    messageChanged: sequences.changeMessage,
    createPrClicked: sequences.createPr
};

export default Module<State, typeof signals>({
    state,
    signals
});
