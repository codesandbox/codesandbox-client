import React from 'react';
import {
  Element,
  IconButton,
  Stack,
  ThemeProvider,
} from '@codesandbox/components';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useHistory } from 'react-router-dom';
import { WorkspaceFlowLayout } from './WorkspaceFlowLayout';

export const ChangeWorkspacePlan = () => {
  const history = useHistory();

  return (
    <WorkspaceFlowLayout
      canDismiss
      onDismiss={() => history.push(dashboardUrls.settings())}
    >
      <WorkspaceSetup
        steps={['plans']}
        onFinished={() => history.push(dashboardUrls.settings())}
      />
    </WorkspaceFlowLayout>
  );
};
