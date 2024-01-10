import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { ProLegacy } from './Legacy';
import { ProUpgrade } from './Upgrade';

export const ProPage: React.FC = () => {
  const {
    setActiveTeam,
    pro: { pageMounted },
  } = useActions();

  const history = useHistory();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const { hasLoadedApp, isLoggedIn } = useAppState();
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
    }
  }, [urlWorkspaceId]);

  if (hasLoadedApp && !isLoggedIn) {
    history.push(signInPageUrl('/pro'));

    return null;
  }

  if (isPaddle) {
    return <ProLegacy />;
  }

  return <ProUpgrade />;
};
