import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { WorkspaceFlowLayout } from './WorkspaceFlowLayout';

export const CreateWorkspace = () => {
  return (
    <WorkspaceFlowLayout>
      <WorkspaceSetup
        steps={['create', 'members', 'plans', 'extra', 'payment']}
        onFinished={() => {
          window.location.href = dashboardUrls.recent();
        }}
      />
    </WorkspaceFlowLayout>
  );
};
