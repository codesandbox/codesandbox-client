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

const fetchGitChanges = (id: string) => dispatch =>
  dispatch(
    doRequest(FETCH_GIT_CHANGES_API_ACTIONS, `sandboxes/${id}/git/diff`, {
      method: 'GET',
      body: {
        id,
      },
    })
  );

const createGitCommit = (id: string, message: string) => dispatch =>
  dispatch(
    doRequest(CREATE_GIT_COMMIT_API_ACTIONS, `sandboxes/${id}/git/commit`, {
      method: 'POST',
      body: {
        id,
        message,
      },
    })
  );

const createGitPR = (id: string, message: string) => dispatch =>
  dispatch(
    doRequest(CREATE_GIT_PR_API_ACTIONS, `sandboxes/${id}/git/pr`, {
      method: 'POST',
      body: {
        id,
        message,
      },
    })
  );

export default { fetchGitChanges, createGitCommit, createGitPR };
