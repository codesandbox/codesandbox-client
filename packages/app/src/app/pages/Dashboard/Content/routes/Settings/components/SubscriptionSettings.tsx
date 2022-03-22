import { Button } from '@codesandbox/components';

import React, { useState } from 'react';
import { useAppState, useEffects } from 'app/overmind';

export const SubscriptionSettings = () => {
  const { api } = useEffects();
  const { activeTeam } = useAppState();

  const [loading, setLoading] = useState(false);

  const createCustomerPortal = async () => {
    setLoading(true);
    const payload = await api.stripeCustomerPortal(activeTeam);

    if (payload.stripeCustomerPortalUrl) {
      window.location.href = payload.stripeCustomerPortalUrl;
    }

    setLoading(false);
  };

  return (
    <div>
      <Button variant="secondary" onClick={createCustomerPortal}>
        {loading ? 'Loading...' : 'Manage my subscription'}
      </Button>
    </div>
  );
};
