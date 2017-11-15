import { push } from 'react-router-redux';
import { sandboxUrl } from 'app/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';

import { singleSandboxSelector } from '../selectors';
import { modulesSelector } from '../modules/selectors';
import { directoriesSelector } from '../directories/selectors';

export const FETCH_GIT_CHANGES_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_CHANGES'
);
export const CREATE_GIT_COMMIT_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_COMMIT'
);
export const EXPORT_TO_GITHUB_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_EXPORT'
);

export const CREATE_GIT_PR_API_ACTIONS = createAPIActions('SANDBOX', 'GIT_PR');
export const SET_ORIGINAL_GIT = 'SET_ORIGINAL_GIT';
export const EXPORT_TO_GITHUB = 'EXPORT_TO_GITHUB';

const setOriginalGit = (id, originalGit, originalGitCommitSha) => ({
  type: SET_ORIGINAL_GIT,
  id,
  originalGit,
  originalGitCommitSha,
});

const fetchGitChanges = (id: string) => dispatch =>
  dispatch(
    doRequest(FETCH_GIT_CHANGES_API_ACTIONS, `sandboxes/${id}/git/diff`, {
      method: 'GET',
      body: {
        id,
      },
    })
  );

const createGitCommit = (id: string, message: string) => async dispatch => {
  const result = await dispatch(
    doRequest(CREATE_GIT_COMMIT_API_ACTIONS, `sandboxes/${id}/git/commit`, {
      method: 'POST',
      body: {
        id,
        message,
      },
    })
  );

  const { git, merge, sha } = result;

  if (!merge) {
    // If it's no merge we can simply update the git data, because we know we
    // have the latest version of the files. Otherwise we go to the git sandbox,
    // just to be sure.
    dispatch(setOriginalGit(id, git, sha));
  } else {
    dispatch(push(sandboxUrl({ git })));
  }

  return result;
};

const exportToGithub = (id: string, name: string) => async (
  dispatch: Function,
  getState: Function
) => {
  dispatch({
    type: EXPORT_TO_GITHUB,
    id,
  });
  const modules = modulesSelector(getState());
  const directories = directoriesSelector(getState());
  const sandbox = singleSandboxSelector(getState(), { id });

  const github = await import(/* webpackChunkName: 'export-to-github' */ '../utils/export-to-github');
  const apiData = await github.default(
    sandbox,
    sandbox.modules.map(x => modules[x]),
    sandbox.directories.map(x => directories[x]),
    name
  );

  const res = await dispatch(
    doRequest(
      EXPORT_TO_GITHUB_API_ACTIONS,
      `sandboxes/${id}/git/repo/${name}`,
      {
        method: 'POST',
        body: apiData,
      }
    )
  );

  dispatch(push(sandboxUrl({ git: res })));

  return res;
};

const createGitPR = (id: string, message: string) => async dispatch => {
  const res = await dispatch(
    doRequest(CREATE_GIT_PR_API_ACTIONS, `sandboxes/${id}/git/pr`, {
      method: 'POST',
      body: {
        id,
        message,
      },
    })
  );

  // Go to git version of new branch
  dispatch(push(sandboxUrl({ git: res.git })));

  return res;
};

export default {
  exportToGithub,
  fetchGitChanges,
  createGitCommit,
  createGitPR,
  setOriginalGit,
};
