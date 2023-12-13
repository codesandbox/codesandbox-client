import React from 'react';

import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useHistory } from 'react-router-dom';
import { WorkspaceFlowLayout } from './WorkspaceFlowLayout';

export const UpgradeWorkspace = () => {
  const history = useHistory();

  return (
    <WorkspaceFlowLayout
      canDismiss
      onDismiss={() => history.push(dashboardUrls.recent())}
    >
      <WorkspaceSetup
        steps={['plans', 'extra', 'payment']}
        onFinished={() => {
          // When setup is finished do a full reload
          window.location.href = dashboardUrls.recent();
        }}
      />
    </WorkspaceFlowLayout>
  );
};
