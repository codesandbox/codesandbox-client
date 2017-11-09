import { createAPIActions, doRequest } from '../../../api/actions';

export const FETCH_GIT_CHANGES_API_ACTIONS = createAPIActions(
  'SANDBOX',
  'GIT_CHANGES'
);

const fetchGitChanges = (id: string) => dispatch =>
  dispatch(
    doRequest(FETCH_GIT_CHANGES_API_ACTIONS, `sandboxes/${id}/git/diff`, {
      method: 'GET',
      body: {
        id,
      },
    })
  );

export default { fetchGitChanges };
