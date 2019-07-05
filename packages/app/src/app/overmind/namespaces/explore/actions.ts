import { AsyncAction, Action } from 'app/overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { Pick, PickedSandboxes } from '@codesandbox/common/lib/types';

export const mountPopularSandboxes: AsyncAction<string> = async (
  { state, effects },
  date
) => {
  try {
    state.explore.popularSandboxes = await effects.api.get(
      `/sandboxes/popular?start_date=${date}`
    );
  } catch (error) {
    effects.notificationToast.add({
      message: 'There has been a problem getting the sandboxes',
      status: NotificationStatus.ERROR,
    });
  }
};

export const pickSandbox: AsyncAction<{
  id: string;
  title: string;
  description: string;
}> = async ({ state, effects }, { id, title, description }) => {
  try {
    const data = await effects.api.post<Pick>(`/sandboxes/${id}/pick`, {
      title,
      description,
    });
    const index = state.explore.popularSandboxes.sandboxes.findIndex(
      module => module.id === id
    );

    state.explore.popularSandboxes.sandboxes[index].picks = [
      {
        ...data,
        id: Math.random().toString(),
      },
    ];

    effects.notificationToast.add({
      message: 'Sandbox picked',
      status: NotificationStatus.SUCCESS,
    });
    state.currentModal = null;
  } catch (error) {
    effects.notificationToast.add({
      message: 'There has been a problem picking the sandbox',
      status: NotificationStatus.ERROR,
    });
  }
};

export const pickSandboxModal: Action<any> = ({ state }, details) => {
  state.explore.pickedSandboxDetails = details;
  state.currentModal = 'pickSandbox';
};

export const getSandbox: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  try {
    state.explore.selectedSandbox = await effects.api.get(`/sandboxes/${id}`);
  } catch (error) {
    effects.notificationToast.add({
      message: 'There has been a problem getting the sandbox',
      status: NotificationStatus.ERROR,
    });
  }
};

export const pickedSandboxesMounted: AsyncAction = async ({
  state,
  effects,
}) => {
  state.explore.pickedSandboxesLoading = true;

  try {
    const pickedSandboxes = await effects.api.get<PickedSandboxes>(
      `/sandboxes/picked`
    );

    const indexes = pickedSandboxes.sandboxes.map(a => a.id);

    state.explore.pickedSandboxesIndexes = indexes;

    state.explore.pickedSandboxes = pickedSandboxes;
  } catch (error) {
    effects.notificationToast.add({
      message: 'There has been a problem getting the sandboxes',
      status: NotificationStatus.ERROR,
    });
  }
  state.explore.pickedSandboxesLoading = true;
};
