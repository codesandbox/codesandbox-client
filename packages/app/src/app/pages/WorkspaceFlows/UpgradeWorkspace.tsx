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
import { SubscriptionInterval } from 'app/graphql/types';

export const UpgradeWorkspace = () => {
  const { hasLogIn, checkout } = useAppState();
  const actions = useActions();
  const { isAdmin } = useWorkspaceAuthorization();
  const { location } = useHistory();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');
  const plan = getQueryParam('plan');
  const interval = getQueryParam('interval');
  const history = useHistory();

  const planPreSelected =
    plan === 'flex' ||
    (plan === 'builder' &&
      (interval === 'month' || interval === 'year') &&
      workspaceId);

  if (planPreSelected && !checkout.newSubscription) {
    actions.checkout.selectPlan({
      plan,
      billingInterval:
        interval === 'month'
          ? SubscriptionInterval.Monthly
          : SubscriptionInterval.Yearly,
    });
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

  if (workspaceId && isAdmin === false) {
    // Page was accessed by a non-admin or workpace cannot be upgraded
    return <Redirect to={dashboardUrls.recent(workspaceId)} />;
  }

  return (
    <WorkspaceSetup
      steps={steps}
      flow="upgrade"
      onComplete={fullReload => {
        if (fullReload) {
          window.location.href = dashboardUrls.recent(workspaceId);
        } else {
          history.push(dashboardUrls.recent(workspaceId));
        }
      }}
      onDismiss={() => {
        const eventPrefix = location.pathname.includes('upgrade')
          ? 'Upgrade Workspace'
          : 'Manage Subscription';
        track(`${eventPrefix} Flow - Dismissed`);
        history.push(dashboardUrls.recent(workspaceId));
      }}
      startFrom={planPreSelected ? 'spending-limit' : undefined}
    />
  );
};
