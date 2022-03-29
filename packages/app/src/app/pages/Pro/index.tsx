import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { SubscriptionPaymentProvider } from 'app/graphql/types';
import { ProLegacy } from './legacy';
import { ProUpgrade } from './upgrade';

export const ProPage = () => {
  const { pageMounted } = useActions().pro;

  const { activeTeamInfo } = useAppState();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (!activeTeamInfo === undefined) return <p>Loading...</p>;

  if (
    activeTeamInfo?.subscription?.paymentProvider ===
    SubscriptionPaymentProvider.Paddle
  ) {
    return <ProLegacy />;
  }

  return <ProUpgrade />;
};
