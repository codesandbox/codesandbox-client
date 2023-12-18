import React, { useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';

export const UpgradeWorkspace = () => {
  const history = useHistory();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');

  const [steps] = useState(() => {
    // Ensure this is run only once
    const initialSteps: WorkspaceSetupStep[] = [
      'plans',
      'plan-options',
      'payment',
    ];

    if (!workspaceId) {
      initialSteps.unshift('select-workspace');
    }

    return initialSteps;
  });

  return (
    <WorkspaceSetup
      steps={steps}
      onComplete={() => {
        // When setup is finished do a full reload
        window.location.href = dashboardUrls.settings();
      }}
      onDismiss={() => {
        history.push(dashboardUrls.settings());
      }}
    />
  );
};
