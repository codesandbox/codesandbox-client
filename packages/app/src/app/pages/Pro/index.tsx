import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { ProLegacy } from './Legacy';
import { ProUpgrade } from './Upgrade';
import { ProCreate } from './Create';

export const ProPage: React.FC = () => {
  const {
    setActiveTeam,
    pro: { pageMounted },
  } = useActions();

  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const { hasLoadedApp, isLoggedIn, personalWorkspaceId } = useAppState();
  const { isPaddle } = useWorkspaceSubscription();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  const urlWorkspaceId = searchQuery.get('workspace');

  // Make sure if someone gets the URL with a specific workspaceId,
  // the team is selected in the background for them
  React.useEffect(() => {
    if (urlWorkspaceId) {
      setActiveTeam({ id: urlWorkspaceId });
    } else {
      setActiveTeam({ id: personalWorkspaceId });
    }
  }, [urlWorkspaceId, personalWorkspaceId]);

  if (hasLoadedApp && !isLoggedIn) {
    history.push(signInPageUrl('/pro'));

    return null;
  }

  if (isPaddle) {
    return <ProLegacy />;
  }

  // When  you are on pro?workspaceId=... the flow is set to manage existing workspace
  // either by upgrading to pro or managing the subscription
  if (urlWorkspaceId) {
    return <ProUpgrade />;
  }

  // When you are on the /pro page, the flow is set to create a new pro subscription
  return <ProCreate />;
};
