import React, { useState } from 'react';
import { Stack, Link } from '@codesandbox/components';
import { useEffects, useAppState } from 'app/overmind';

import css from '@styled-system/css';

export const StripePlan = () => {
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
    <Stack direction="vertical" gap={2}>
      <Link
        onClick={createCustomerPortal}
        size={3}
        variant="active"
        css={css({ fontWeight: 'medium' })}
      >
        {loading ? 'Loading...' : 'Manage subscription'}
      </Link>
    </Stack>
  );
};
