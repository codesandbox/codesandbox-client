import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import { importRepository } from '../utils/api';

export const useImportAndRedirect = () => {
  async function importAndRedirect(
    owner: string,
    name: string,
    csbTeamId: string
  ) {
    try {
      const response = await importRepository({ owner, name, csbTeamId });
      window.location.href = v2DefaultBranchUrl(response.owner, response.repo);
    } catch (error) {
      notificationState.addNotification({
        message: JSON.stringify(error),
        title: 'Failed to import repository',
        status: NotificationStatus.ERROR,
      });
    }
  }

  return importAndRedirect;
};
