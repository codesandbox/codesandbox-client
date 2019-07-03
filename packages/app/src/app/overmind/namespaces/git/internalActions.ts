import { AsyncAction } from 'app/overmind';

export const fetchGitChanges: AsyncAction = async ({ state, effects }) => {
  const id = state.editor.currentId;

  state.git.isFetching = true;
  state.git.originalGitChanges = await effects.api.get(
    `/sandboxes/${id}/git/diff`
  );
  state.git.isFetching = false;
};
