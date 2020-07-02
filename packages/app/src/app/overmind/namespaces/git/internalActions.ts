import { AsyncAction } from 'app/overmind';

export const fetchGitChanges: AsyncAction = async ({ state, effects }) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const { id } = state.editor.currentSandbox;

  state.git.isFetching = true;
  state.git.gitChanges = await effects.api.getGitChanges(id);
  state.git.isFetching = false;
};
