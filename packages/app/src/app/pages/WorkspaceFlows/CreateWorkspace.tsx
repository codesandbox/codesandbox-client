import React from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useActions, useAppState } from 'app/overmind';
import { Redirect } from 'react-router-dom';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

export const CreateWorkspace = () => {
  const actions = useActions();
  const [freshWorkspaceId, , clearFreshWorkspaceId] = useGlobalPersistedState<
    string
  >('FRESH_WORKSPACE_ID', undefined);

  const { hasLogIn, userFeatureFlags } = useAppState();

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  if (userFeatureFlags.ubbBeta === false) {
    return <Redirect to={dashboardUrls.recent()} />;
  }

  return (
    <WorkspaceSetup
      steps={['create', 'plans', 'addons', 'plan-options', 'payment']}
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
