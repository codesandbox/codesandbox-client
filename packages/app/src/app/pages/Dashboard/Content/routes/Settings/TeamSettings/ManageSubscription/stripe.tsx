import React from 'react';
import { Stack, Link } from '@codesandbox/components';
import { useAppState } from 'app/overmind';

import css from '@styled-system/css';
import { useCreateCustomerPortal } from 'app/pages/Pro/upgrade/utils';

export const Stripe = () => {
  const { activeTeam } = useAppState();
  const [loading, createCustomerPortal] = useCreateCustomerPortal(activeTeam);

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
