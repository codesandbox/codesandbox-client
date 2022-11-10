import React from 'react';
import { format } from 'date-fns';
import { Stack, Text, Link } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';

export const Stripe = () => {
  const { activeTeam, activeTeamInfo: team } = useAppState();
  const [loading, createCustomerPortal] = useCreateCustomerPortal(activeTeam);

  return (
    <Stack direction="vertical" gap={2}>
      <Link onClick={createCustomerPortal} size={3} variant="active">
        {loading ? 'Loading...' : 'Manage subscription'}
      </Link>

      {!loading && team.subscription.cancelAt && (
        <Text size={3} css={{ color: '#F7CC66' }}>
          Your subscription expires on{' '}
          {format(new Date(team.subscription.cancelAt), 'PP')}.{' '}
        </Text>
      )}
    </Stack>
  );
};
