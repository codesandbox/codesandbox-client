import React from 'react';

import Layout from '../../components/layout';
import { useLogin } from '../../hooks/useLogin';
import { usePricing } from '../../hooks/usePricing';
import { useTeamList } from '../../hooks/useTeamList';

export default () => {
  const user = useLogin();
  const pricingData = usePricing();
  const teamList = useTeamList();

  return (
    <Layout>
      <h2>Teams</h2>
      {teamList &&
        teamList.me.workspaces.map(team => {
          return (
            <p key={team.id}>
              {team.name}{' '}
              {team.id === teamList.me.personalWorkspaceId && 'Personal'}
            </p>
          );
        })}

      <h2>Pricing</h2>
      {pricingData &&
        Object.entries(pricingData).map(([plan, values]) => {
          return (
            <div key={plan}>
              <h2>{plan}</h2>

              {Object.entries(values).map(([period, amount]) => {
                return (
                  <p key={period}>
                    {period}: {amount.currency} {amount.unit_amount}
                  </p>
                );
              })}
            </div>
          );
        })}
    </Layout>
  );
};
