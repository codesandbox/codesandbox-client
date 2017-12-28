import { set, when, wait } from 'cerebral/operators';
import { state, props, string } from 'cerebral/tags';
import * as actions from './actions';

export const changeRepoTitle = set(state`editor.git.repoTitle`, props`title`);

export const changeMessage = set(state`editor.git.message`, props`message`);

export const closeCreateCommitModal = set(
  state`editor.git.showCreateCommitModal`,
  false
);

export const closePrModal = set(state`editor.git.showPrModal`, false);

export const createRepo = [
  actions.whenValidRepo,
  {
    true: [
      set(state`editor.git.isExported`, false),
      set(state`editor.git.showExportedModal`, true),
      actions.exportSandboxToGithub,
      actions.saveGithubData,
      set(
        props`id`,
        string`github/${props`git.username`}/${props`git.repo`}/tree/${props`git.branch`}/`
      ),
      set(state`editor.git.isExported`, true),
      set(state`editor.git.showExportedModal`, false),
      actions.redirectToGithubSandbox,
    ],
    false: set(state`editor.git.error`, props`error`),
  },
];

const whenDirectCommit = when(
  props`commit`,
  commit => !commit.newBranch || !commit.merge
);

export const createCommit = [
  set(state`editor.git.isComitting`, true),
  set(state`editor.git.showCreateCommitModal`, true),
  actions.createCommit,
  set(state`editor.git.commit`, props`commit`),
  set(state`editor.git.isComitting`, false),
  whenDirectCommit,
  {
    true: [wait(1000), set(state`editor.git.showCreateCommitModal`, false)],
    false: [],
  },
  set(state`editor.git.message`, ''),
  set(state`editor.git.gitChanges`, null),
];

export const createPr = [
  set(state`editor.git.isCreatingPr`, true),
  set(state`editor.git.showPrModal`, true),
  actions.createPr,
  set(state`editor.git.pr`, props`pr`),
  set(state`editor.git.isCreatingPr`, false),
  wait(3000),
  actions.openPr,
  set(state`editor.git.message`, ''),
  set(state`editor.git.showPrModal`, false),
  actions.redirectToPr,
];
