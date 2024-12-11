import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import track from '@codesandbox/common/lib/utils/analytics';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useActions, useAppState } from 'app/overmind';
import { Redirect } from 'react-router-dom';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

export const CreateWorkspace = () => {
  const actions = useActions();
  const { activeTeam } = useAppState();
  const [freshWorkspaceId, , clearFreshWorkspaceId] = useGlobalPersistedState<
    string
  >('FRESH_WORKSPACE_ID', undefined);

  const { hasLogIn } = useAppState();

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  return (
    <WorkspaceSetup
      steps={['create', 'usecases', 'plans', 'spending-limit', 'finalize']}
      flow="create-workspace"
      onComplete={() => {
        clearFreshWorkspaceId();
        window.location.href = dashboardUrls.recent(activeTeam, {
          new_workspace: 'true',
        });
      }}
      onDismiss={() => {
        if (freshWorkspaceId) {
          actions.dashboard.deleteWorkspace();
          clearFreshWorkspaceId();
        }
        track('Create Workspace Flow - Dismissed');
        window.location.href = dashboardUrls.recent();
      }}
    />
  );
};
