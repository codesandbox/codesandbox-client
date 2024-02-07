import React, { useEffect, useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import track from '@codesandbox/common/lib/utils/analytics';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Redirect, useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';
import { useActions, useAppState } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';

export const UpgradeWorkspace = () => {
  const { hasLogIn, checkout } = useAppState();
  const actions = useActions();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isPro, isPaddle } = useWorkspaceSubscription();
  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');
  const plan = getQueryParam('plan');
  const history = useHistory();

  const proPlanPreSelected = plan === 'pro' && workspaceId;

  // Cannot upgrade if already on ubb or legacy paddle
  const cannotUpgradeToUbb = (ubbBeta && isPro) || isPaddle;

  if (proPlanPreSelected && !checkout.selectedPlan) {
    actions.checkout.selectPlan('flex');
  }

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
      'addons',
      'spending-limit',
      'finalize',
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

  if (workspaceId && (isAdmin === false || cannotUpgradeToUbb)) {
    // Page was accessed by a non-admin or workpace cannot be upgraded
    return <Redirect to={dashboardUrls.recent(workspaceId)} />;
  }

  return (
    <WorkspaceSetup
      steps={steps}
      onComplete={fullReload => {
        if (fullReload) {
          window.location.href = dashboardUrls.recent(workspaceId);
        } else {
          history.push(dashboardUrls.recent(workspaceId));
        }
      }}
      onDismiss={() => {
        track('Upgrade Workspace Flow - Dismissed');
        history.push(dashboardUrls.recent(workspaceId));
      }}
      startFrom={proPlanPreSelected ? 'addons' : undefined}
    />
  );
};
