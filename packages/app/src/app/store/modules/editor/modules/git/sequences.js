import { set } from 'cerebral/operators';
import { state, props, string } from 'cerebral/tags';
import * as actions from './actions';

export const changeRepoTitle = set(state`editor.git.repoTitle`, props`title`);

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
