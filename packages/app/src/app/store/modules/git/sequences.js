import { set, when, wait } from 'cerebral/operators';
import { state, props, string } from 'cerebral/tags';
import * as actions from './actions';

export const changeRepoTitle = set(state`git.repoTitle`, props`title`);

export const changeMessage = set(state`git.message`, props`message`);

export const createRepo = [
  actions.whenValidRepo,
  {
    true: [
      set(state`git.isExported`, false),
      set(state`currentModal`, 'exportGithub'),
      actions.exportSandboxToGithub,
      actions.saveGithubData,
      set(
        props`id`,
        string`github/${props`git.username`}/${props`git.repo`}/tree/${props`git.branch`}/`
      ),
      set(state`git.isExported`, true),
      set(state`currentModal`, null),
      actions.redirectToGithubSandbox,
    ],
    error: set(state`git.error`, props`error`),
  },
];

const whenDirectCommit = when(
  props`commit`,
  commit => !commit.newBranch && !commit.merge
);

export const createCommit = [
  set(state`git.commit`, null),
  set(state`git.isComitting`, true),
  set(state`currentModal`, 'commit'),
  actions.createCommit,
  set(state`git.commit`, props`commit`),
  set(state`git.isComitting`, false),
  whenDirectCommit,
  {
    true: [wait(1000), set(state`currentModal`, null)],
    false: [],
  },
  set(state`git.message`, ''),
  set(state`git.originalGitChanges`, null),
];

export const createPr = [
  set(state`git.pr`, null),
  set(state`git.isCreatingPr`, true),
  set(state`currentModal`, 'pr'),
  actions.createPr,
  set(state`git.pr`, props`pr`),
  set(state`git.isCreatingPr`, false),
  wait(3000),
  actions.openPr,
  set(state`git.message`, ''),
  actions.redirectToPr,
];
