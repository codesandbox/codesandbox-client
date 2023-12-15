import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

export const CreateWorkspace = () => {
  return (
    <WorkspaceSetup
      steps={['create', 'members', 'plans', 'plan-options', 'payment']}
      onComplete={() => {
        window.location.href = dashboardUrls.recent();
      }}
      onDismiss={() => {
        // TODO: Cleanup workspace?
        window.location.href = dashboardUrls.recent();
      }}
    />
  );
};
