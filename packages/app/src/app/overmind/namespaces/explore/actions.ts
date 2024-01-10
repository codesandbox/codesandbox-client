import { PickedSandboxDetails } from '@codesandbox/common/lib/types';
import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';

export const popularSandboxesMounted = withLoadApp(
  async ({ state, actions, effects }: Context, date: string) => {
    try {
      state.explore.popularSandboxes = await effects.api.getPopularSandboxes(
        date
      );
    } catch (error) {
      actions.internal.handleError({
        message: 'There has been a problem getting the sandboxes',
        error,
      });
    }
  }
);

export const pickSandbox = async (
  { effects, state, actions }: Context,
  { description, id, title }: PickedSandboxDetails
) => {
  try {
    const data = await effects.api.saveSandboxPick(id, title, description);
    const popularSandbox = (
      state.explore.popularSandboxes?.sandboxes || []
    ).find(module => module.id === id);

    if (popularSandbox) {
      popularSandbox.picks.push({
        ...data,
        // Why are we doing this?
        id: Math.random().toString(),
      });
    }

    effects.notificationToast.success('Sandbox picked');
    state.currentModal = null;
  } catch (error) {
    actions.internal.handleError({
      message: 'There has been a problem picking the sandbox',
      error,
    });
  }
};

export const pickSandboxModal = (
  { state }: Context,
  details: PickedSandboxDetails
) => {
  state.explore.pickedSandboxDetails = details;
  state.currentModal = 'pickSandbox';
};

export const getSandbox = async (
  { state, actions, effects }: Context,
  id: string
) => {
  try {
    state.explore.selectedSandbox = await effects.api.getSandbox(id);
  } catch (error) {
    actions.internal.handleError({
      message: 'A problem occurred while fetching the sandbox',
      error,
    });
  }
};

export const pickedSandboxesMounted = async ({
  state,
  actions,
  effects,
}: Context) => {
  state.explore.pickedSandboxesLoading = true;

  try {
    const pickedSandboxes = await effects.api.getPickedSandboxes();

    state.explore.pickedSandboxesIndexes = pickedSandboxes.sandboxes.map(
      a => a.id
    );
    state.explore.pickedSandboxes = pickedSandboxes;
  } catch (error) {
    actions.internal.handleError({
      message: 'A problem occurred while fetching the sandboxes',
      error,
    });
  }
  state.explore.pickedSandboxesLoading = false;
};
