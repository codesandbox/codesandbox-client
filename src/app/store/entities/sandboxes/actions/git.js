import { push } from 'react-router-redux';
import { sandboxUrl } from 'app/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';

export const FETCH_GIT_CHANGES_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_CHANGES'
);

export const CREATE_GIT_COMMIT_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_COMMIT'
);

export const CREATE_GIT_PR_API_ACTIONS = createAPIActions('SANDBOX', 'GIT_PR');

export const SET_ORIGINAL_GIT = 'SET_ORIGINAL_GIT';

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
  fetchGitChanges,
  createGitCommit,
  createGitPR,
  setOriginalGit,
};
