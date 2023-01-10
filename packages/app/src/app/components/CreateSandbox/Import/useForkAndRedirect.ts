import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import { forkRepository, ForkSource, ForkDestination } from '../utils/api';

export const useForkAndRedirect = () => {
  async function forkAndRedirect(params: {
    source: ForkSource;
    destination: ForkDestination;
  }) {
    try {
      const response = await forkRepository(params);
      window.location.href = v2BranchUrl({
        workspaceId: params.destination.teamId,
        owner: response.owner,
        repoName: response.repo,
        branchName: response.branch,
      });
    } catch (error) {
      notificationState.addNotification({
        message: JSON.stringify(error),
        title: 'Failed to fork repository',
        status: NotificationStatus.ERROR,
      });
    }
  }

  return forkAndRedirect;
};
