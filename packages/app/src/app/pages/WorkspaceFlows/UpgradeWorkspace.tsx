import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useHistory } from 'react-router-dom';

export const UpgradeWorkspace = () => {
  const history = useHistory();

  return (
    <WorkspaceSetup
      steps={['plans', 'plan-options', 'payment']}
      onComplete={() => {
        // When setup is finished do a full reload
        window.location.href = dashboardUrls.recent();
      }}
      onDismiss={() => {
        history.push(dashboardUrls.recent());
      }}
    />
  );
};
