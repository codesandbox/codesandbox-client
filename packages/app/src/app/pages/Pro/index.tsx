import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { SubscriptionPaymentProvider } from 'app/graphql/types';
import { useHistory } from 'react-router-dom';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';

import { ProLegacy } from './legacy';
import { ProUpgrade } from './upgrade';

export const ProPage: React.FC = () => {
  const { pageMounted } = useActions().pro;
  const history = useHistory();

  const { activeTeamInfo, hasLoadedApp, isLoggedIn } = useAppState();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (hasLoadedApp && !isLoggedIn) {
    history.push(signInPageUrl('/pro'));

    return null;
  }

  if (!activeTeamInfo === undefined) return <p>Loading...</p>;

  if (
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Paddle
  ) {
    return <ProLegacy />;
  }

  return <ProUpgrade />;
};
