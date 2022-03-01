import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { ProLegacy } from './legacy';
import { ProUpgrade } from './upgrade';

export const ProPage = () => {
  const { pageMounted } = useActions().pro;

  const { activeTeamInfo } = useAppState();

  React.useEffect(() => {
    pageMounted();
  }, [pageMounted]);

  if (!activeTeamInfo?.subscription) return null;

  if (activeTeamInfo?.subscription.paymentProvider === 'PADDLE') {
    return <ProLegacy />;
  }

  return <ProUpgrade />;
};
