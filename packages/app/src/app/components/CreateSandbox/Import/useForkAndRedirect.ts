import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import { forkRepository } from '../utils/api';

export const useForkAndRedirect = () => {
  async function forkAndRedirect(...params: Parameters<typeof forkRepository>) {
    try {
      const response = await forkRepository(...params);
      window.location.href = v2DefaultBranchUrl(response.owner, response.repo);
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
