import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { ProLegacy } from './Legacy';
import { ProUpgrade } from './Upgrade';

export const ProPage: React.FC = () => {
  const { pageMounted } = useActions().pro;
  const history = useHistory();
  const { hasLoadedApp, isLoggedIn } = useAppState();
  const { isPaddle, isPatron } = useWorkspaceSubscription();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (hasLoadedApp && !isLoggedIn) {
    history.push(signInPageUrl('/pro'));

    return null;
  }

  if (isPaddle || isPatron) {
    return <ProLegacy />;
  }

  return <ProUpgrade />;
};
