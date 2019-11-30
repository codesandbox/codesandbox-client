import { AsyncAction } from 'app/overmind';

export const fetchGitChanges: AsyncAction = async ({ state, effects }) => {
  const { id } = state.editor.currentSandbox;

  state.git.isFetching = true;
  state.git.originalGitChanges = await effects.api.getGitChanges(id);
  state.git.isFetching = false;
};
