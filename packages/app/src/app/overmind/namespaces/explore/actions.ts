import { AsyncAction, Action } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';

export const popularSandboxesMounted: AsyncAction<{
  date: string;
}> = withLoadApp(async ({ state, effects }, { date }) => {
  try {
    state.explore.popularSandboxes = await effects.api.getPopularSandboxes(
      date
    );
  } catch (error) {
    effects.notificationToast.error(
      'There has been a problem getting the sandboxes'
    );
  }
});

export const pickSandbox: AsyncAction<{
  id: string;
  title: string;
  description: string;
}> = async ({ state, effects }, { id, title, description }) => {
  try {
    const data = await effects.api.saveSandboxPick(id, title, description);
    const popularSandbox = state.explore.popularSandboxes.sandboxes.find(
      module => module.id === id
    );

    popularSandbox.picks = [
      {
        ...data,
        // Why are we doing this?
        id: Math.random().toString(),
      },
    ];

    effects.notificationToast.success('Sandbox picked');
    state.currentModal = null;
  } catch (error) {
    effects.notificationToast.error(
      'There has been a problem picking the sandbox'
    );
  }
};

export const pickSandboxModal: Action<{
  details: {
    id: string;
    title: string;
    description: string;
  };
}> = ({ state }, { details }) => {
  state.explore.pickedSandboxDetails = details;
  state.currentModal = 'pickSandbox';
};

export const getSandbox: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  try {
    state.explore.selectedSandbox = await effects.api.getSandbox(id);
  } catch (error) {
    effects.notificationToast.error(
      'There has been a problem getting the sandbox'
    );
  }
};

export const pickedSandboxesMounted: AsyncAction = async ({
  state,
  effects,
}) => {
  state.explore.pickedSandboxesLoading = true;

  try {
    const pickedSandboxes = await effects.api.getPickedSandboxes();

    state.explore.pickedSandboxesIndexes = pickedSandboxes.sandboxes.map(
      a => a.id
    );
    state.explore.pickedSandboxes = pickedSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There has been a problem getting the sandboxes'
    );
  }
  state.explore.pickedSandboxesLoading = false;
};
