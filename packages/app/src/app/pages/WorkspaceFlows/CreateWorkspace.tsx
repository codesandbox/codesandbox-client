import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useActions } from 'app/overmind';

export const CreateWorkspace = () => {
  const actions = useActions();
  const [freshWorkspaceId, , clearFreshWorkspaceId] = useGlobalPersistedState<
    string
  >('FRESH_WORKSPACE_ID', undefined);

  return (
    <WorkspaceSetup
      steps={['create', 'members', 'plans', 'plan-options', 'payment']}
      onComplete={() => {
        clearFreshWorkspaceId();
        window.location.href = dashboardUrls.recent();
      }}
      onDismiss={() => {
        if (freshWorkspaceId) {
          actions.dashboard.deleteWorkspace();
          clearFreshWorkspaceId();
        }
        window.location.href = dashboardUrls.recent();
      }}
    />
  );
};
