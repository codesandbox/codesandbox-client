import { Context } from 'app/overmind';

export const fetchGitChanges = async ({ state, effects }: Context) => {
  if (!state.editor.currentSandbox) {
    return;
  }

  const { id } = state.editor.currentSandbox;

  state.git.isFetching = true;
  state.git.gitChanges = await effects.api.getGitChanges(id);
  state.git.isFetching = false;
};
