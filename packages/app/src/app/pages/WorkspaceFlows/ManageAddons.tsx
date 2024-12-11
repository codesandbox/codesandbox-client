import React, { useEffect, useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import track from '@codesandbox/common/lib/utils/analytics';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Redirect, useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';
import { useActions, useAppState } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const ManageAddons = () => {
  const { hasLogIn, activeTeam, activeTeamInfo } = useAppState();
  const { isPro } = useWorkspaceSubscription();
  const { getQueryParam, setQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');
  const history = useHistory();

  const {
    dashboard: { dashboardMounted },
    checkout,
  } = useActions();

  useEffect(() => {
    dashboardMounted();
    checkout.fetchPrices();
  }, [dashboardMounted]);

  useEffect(() => {
    if (!activeTeamInfo) {
      return;
    }

    if (!activeTeamInfo.subscriptionSchedule?.current) {
      window.location.href = dashboardUrls.recent(workspaceId);
      return;
    }

    checkout.initializeCartFromExistingSubscription();
  }, [activeTeamInfo]);

  useEffect(() => {
    if (!activeTeam) {
      return;
    }

    if (!workspaceId || workspaceId !== activeTeam) {
      setQueryParam('workspace', activeTeam);
    }
  }, [workspaceId, activeTeam]);

  const [steps] = useState(() => {
    // Ensure this is run only once
    const initialSteps: WorkspaceSetupStep[] = ['addons'];

    return initialSteps;
  });

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  if (!workspaceId || isPro === false) {
    // Page was accessed by a non-admin or workpace cannot be upgraded
    return <Redirect to={dashboardUrls.recent(workspaceId)} />;
  }

  return (
    <WorkspaceSetup
      steps={steps}
      flow="manage-addons"
      onComplete={fullReload => {
        if (fullReload) {
          window.location.href = dashboardUrls.recent(workspaceId);
        } else {
          history.push(dashboardUrls.recent(workspaceId));
        }
      }}
      onDismiss={() => {
        track('Manage Addons Flow - Dismissed');
        history.push(dashboardUrls.recent(workspaceId));
      }}
    />
  );
};
