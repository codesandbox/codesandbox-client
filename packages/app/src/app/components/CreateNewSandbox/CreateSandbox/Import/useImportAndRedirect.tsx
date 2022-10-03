import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { v2DraftBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import history from 'app/utils/history';
import { importRepository } from '../utils/api';

export const useImportAndRedirect = () => {
  async function importAndRedirect(
    owner: string,
    name: string,
    csbTeamId: string
  ) {
    try {
      const response = await importRepository({ owner, name, csbTeamId });
      history.replace(v2DraftBranchUrl(response.owner, response.repo));
    } catch (error) {
      notificationState.addNotification({
        message: 'Failed to import repository',
        status: NotificationStatus.ERROR,
      });
    }
  }

  return importAndRedirect;
};
