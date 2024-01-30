import React, { useEffect, useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Redirect, useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';
import { useActions, useAppState } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { UBB_PRO_PLAN } from 'app/constants';
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

  if (proPlanPreSelected && !checkout.basePlan) {
    actions.checkout.selectPlan(UBB_PRO_PLAN);
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
      'plan-options',
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
        history.push(dashboardUrls.recent(workspaceId));
      }}
      startFrom={proPlanPreSelected ? 'addons' : undefined}
    />
  );
};
