import React, { useEffect, useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Redirect, useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';
import { useActions, useAppState } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

export const UpgradeWorkspace = () => {
  const { hasLogIn } = useAppState();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');
  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { isAdmin } = useWorkspaceAuthorization();
  const history = useHistory();

  const {
    dashboard: { dashboardMounted },
  } = useActions();

  useEffect(() => {
    dashboardMounted();
  }, [dashboardMounted]);

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

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  if ((workspaceId && ubbBeta === false) || isAdmin === false) {
    // Page was accessed with a non-ubb workspace id
    return <Redirect to={dashboardUrls.recent(workspaceId)} />;
  }

  return (
    <WorkspaceSetup
      steps={steps}
      onComplete={() => {
        // If the flow is actually completed with a stripe checkout
        // the redirect is handled by stripe so this is just for early exit
        history.push(dashboardUrls.recent(workspaceId));
      }}
      onDismiss={() => {
        history.push(dashboardUrls.recent(workspaceId));
      }}
    />
  );
};
